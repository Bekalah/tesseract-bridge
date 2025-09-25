import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_REGISTRY_DIR = path.join(__dirname, "registry");
const DEFAULT_EVENTS_DIR = path.join(__dirname, "events");

/**
 * Build an Express application that exposes the bridge registry as JSON APIs.
 *
 * Routes:
 *   - GET /registry            → directory listing of registry root
 *   - GET /registry/*          → JSON, CSV-as-JSON, or NDJSON resources scoped to /registry
 *   - GET /sync                → consolidated snapshot of ids, manifest, and event queues
 *
 * The server never serves front-end assets. Every response is JSON and remains
 * offline-first: data is sourced directly from files committed to this repo.
 *
 * @param {object} [options]
 * @param {string} [options.registryDir] - Override registry directory path.
 * @param {string} [options.eventsDir] - Override events directory path.
 * @returns {import("express").Express}
 */
export function createApp({ registryDir = DEFAULT_REGISTRY_DIR, eventsDir = DEFAULT_EVENTS_DIR } = {}) {
  const app = express();
  app.set("json spaces", 2);

  app.get(
    "/registry",
    asyncHandler(async (req, res) => {
      const entries = await listDirectory(registryDir, "");
      res.json({
        type: "directory",
        path: "/registry",
        entries
      });
    })
  );

  app.get(
    "/registry/*",
    asyncHandler(async (req, res) => {
      const rawSubpath = req.params[0] ?? "";
      let fsTarget;
      let relativePath;
      try {
        ({ fsTarget, relativePath } = resolveRegistryPath(registryDir, rawSubpath));
      } catch (error) {
        res.status(400).json({ error: "Invalid registry path" });
        return;
      }

      let stats;
      try {
        stats = await fs.stat(fsTarget);
      } catch (error) {
        if (error && error.code === "ENOENT") {
          res.status(404).json({ error: "Registry entry not found", path: toRegistryPath(relativePath) });
          return;
        }
        throw error;
      }

      if (stats.isDirectory()) {
        const entries = await listDirectory(fsTarget, relativePath);
        res.json({
          type: "directory",
          path: toRegistryPath(relativePath),
          entries
        });
        return;
      }

      const extension = path.extname(fsTarget).toLowerCase();
      if (extension === ".json") {
        const data = await readJson(fsTarget);
        res.json(data);
        return;
      }

      if (extension === ".csv") {
        const { headers, rows } = await readCsv(fsTarget);
        res.json({
          type: "csv",
          path: toRegistryPath(relativePath),
          headers,
          rows
        });
        return;
      }

      if (extension === ".ndjson") {
        const entries = await readNdjson(fsTarget);
        res.json({
          type: "ndjson",
          path: toRegistryPath(relativePath),
          entries
        });
        return;
      }

      res.status(415).json({ error: "Unsupported registry media type", extension });
    })
  );

  app.get(
    "/sync",
    asyncHandler(async (req, res) => {
      const [ids, manifest, pendingEvents, receipts] = await Promise.all([
        readOptionalJson(path.join(registryDir, "ids.json")),
        readOptionalJson(path.join(registryDir, "notes", "bridge_manifest.json")),
        readOptionalNdjson(path.join(eventsDir, "queue.ndjson")),
        listReceipts(eventsDir)
      ]);

      res.json({
        status: "ok",
        generatedAt: new Date().toISOString(),
        ids,
        manifest,
        pendingEvents,
        receipts
      });
    })
  );

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((error, req, res, next) => {
    console.error("Bridge API error", error);
    res.status(500).json({ error: "Internal server error" });
  });

  return app;
}

if (process.argv[1] === __filename) {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const app = createApp();
  app.listen(port, () => {
    console.log(`tesseract-bridge API listening on port ${port}`);
  });
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function resolveRegistryPath(registryDir, requestPath) {
  const normalizedBase = path.resolve(registryDir);
  const sanitized = sanitizeSubpath(requestPath);
  const fsTarget = path.resolve(registryDir, sanitized);
  if (!fsTarget.startsWith(normalizedBase)) {
    throw new Error("Path escapes registry scope");
  }
  return { fsTarget, relativePath: sanitized };
}

function sanitizeSubpath(input) {
  const normalized = (input ?? "").replace(/\\/g, "/");
  const trimmed = normalized.replace(/^\/+|\/+$/g, "");
  return trimmed;
}

function toRegistryPath(relativePath) {
  const normalized = sanitizeSubpath(relativePath);
  return `/registry${normalized ? `/${normalized}` : ""}`;
}

async function listDirectory(dirPath, relativePath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const sanitized = sanitizeSubpath(relativePath);
  return entries
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => {
      const entryRelative = [sanitized, entry.name].filter(Boolean).join("/");
      return {
        name: entry.name,
        type: entry.isDirectory() ? "directory" : "file",
        path: toRegistryPath(entryRelative)
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

async function readOptionalJson(filePath) {
  try {
    return await readJson(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function readCsv(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(",").map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",");
    const record = {};
    headers.forEach((header, index) => {
      const cell = cells[index] ?? "";
      record[header] = cell.trim();
    });
    return record;
  });

  return { headers, rows };
}

async function readNdjson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const entries = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSON on line ${index + 1} in ${filePath}`);
      }
    });
  return entries;
}

async function readOptionalNdjson(filePath) {
  try {
    return await readNdjson(filePath);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function listReceipts(eventsDir) {
  const receiptDir = path.join(eventsDir, "receipts");
  try {
    const entries = await fs.readdir(receiptDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}
