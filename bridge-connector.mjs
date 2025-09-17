import { renderHelix } from "./js/helix-renderer.mjs";

// Detect runtime so we can read local files offline without external deps.
const isNode = typeof process !== "undefined" && process.release?.name === "node";
let fsModulePromise = null;

async function readTextResource(relativePath) {
  /*
    Offline-first helper: read text either via fs (Node) or fetch (browser).
    Returns null when the resource is unavailable so callers can fall back.
  */
  try {
    if (isNode) {
      if (!fsModulePromise) {
        fsModulePromise = import("fs/promises");
      }
      const { readFile } = await fsModulePromise;
      const url = new URL(relativePath, import.meta.url);
      return await readFile(url, "utf-8");
    }
    if (typeof fetch === "function") {
      const response = await fetch(relativePath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    }
  } catch (error) {
    console.warn(`Resource load failed for ${relativePath}: ${error.message}`);
  }
  return null;
}

async function readJSONResource(relativePath) {
  const text = await readTextResource(relativePath);
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn(`JSON parse failed for ${relativePath}: ${error.message}`);
    return null;
  }
}

function parseCSV(text) {
  /*
    Minimal CSV parser for calm datasets: comma-separated, no quotes.
    Splits into header/value objects while ignoring blank lines.
  */
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  const headers = lines[0].split(",").map(cell => cell.trim());
  const rows = lines.slice(1).map(line => line.split(",").map(cell => cell.trim()));
  return { headers, rows };
}

export default class TesseractBridge {
  constructor() {
    this.registry = {
      nodes: new Map(),
      rooms: new Map(),
      arcana: new Map(),
      chapels: new Map(),
      shem: new Map()
    };
    this.registrySource = null;
    this.connections = {
      cosmogenesis: null,
      stoneGrimoire: null,
      codex1499: null,
      livingArcanae: null,
      livingArcanaeGame: null,
      circuitum99: null,
      magicalMysteryHouse: null
    };
    this.eventQueue = [];
    this.eventTimer = null;
    this.numerology = {
      THREE: 3,
      SEVEN: 7,
      NINE: 9,
      ELEVEN: 11,
      TWENTYTWO: 22,
      THIRTYTHREE: 33,
      NINETYNINE: 99,
      ONEFORTYFOUR: 144
    };
  }

  async initialize() {
    console.log("\u2b61 Initializing Tesseract Bridge...");
    await this.loadRegistry();
    await this.establishConnections();
    this.startEventProcessor();
    console.log("\u2713 Bridge initialized");
  }

  async loadRegistry() {
    const ids = await readJSONResource("./registry/ids.json");
    if (ids) {
      this.registrySource = ids;
    }
    await this.loadMappings();
    console.log("\u2713 Registry loaded");
  }

  async loadMappings() {
    const mappings = [
      { file: "./registry/maps/node_to_room.csv", type: "node-room" },
      { file: "./registry/maps/node_to_chapel.csv", type: "node-chapel" },
      { file: "./registry/maps/arcana_to_paths.csv", type: "arcana-path" },
      { file: "./registry/maps/angel_demon_pairs.csv", type: "shem" }
    ];
    for (const mapping of mappings) {
      await this.loadCSVMapping(mapping.file, mapping.type);
    }
  }

  async loadCSVMapping(file, type) {
    const text = await readTextResource(file);
    if (!text) {
      console.warn(`Could not load ${file}`);
      return;
    }
    const { headers, rows } = parseCSV(text);
    rows.forEach(values => {
      this.processMappingRow(type, headers, values);
    });
  }

  processMappingRow(type, headers, values) {
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    switch (type) {
      case "node-room": {
        const node = this.registry.nodes.get(row.node_id) || {};
        node.room = row.room_id;
        this.registry.nodes.set(row.node_id, node);
        const room = this.registry.rooms.get(row.room_id) || { nodes: [] };
        if (!room.nodes.includes(row.node_id)) {
          room.nodes.push(row.node_id);
        }
        this.registry.rooms.set(row.room_id, room);
        break;
      }
      case "node-chapel": {
        const node = this.registry.nodes.get(row.node_id) || {};
        node.chapel = row.chapel_id;
        this.registry.nodes.set(row.node_id, node);
        const chapel = this.registry.chapels.get(row.chapel_id) || { nodes: [] };
        if (!chapel.nodes.includes(row.node_id)) {
          chapel.nodes.push(row.node_id);
        }
        this.registry.chapels.set(row.chapel_id, chapel);
        break;
      }
      case "arcana-path": {
        this.registry.arcana.set(row.arcana_id, { path: row.path });
        break;
      }
      case "shem": {
        this.registry.shem.set(row.shem_id, {
          demon: row.demon,
          virtue: row.virtue
        });
        break;
      }
      default:
        break;
    }
  }

  async establishConnections() {
    console.log("\u2b61 Connecting to satellite repositories...");
    this.connections = {
      cosmogenesis: new CosmogenesisConnection(),
      stoneGrimoire: new StoneGrimoireConnection(),
      codex1499: new Codex1499Connection(),
      livingArcanae: new LivingArcanaeConnection(),
      livingArcanaeGame: new LivingArcanaeGameConnection(),
      circuitum99: new Circuitum99Connection(),
      magicalMysteryHouse: new MagicalMysteryHouseConnection()
    };
  }

  startEventProcessor() {
    if (this.eventTimer) {
      return;
    }
    this.eventTimer = setInterval(() => {
      this.processEventQueue().catch(error => {
        console.error("Event processing failed:", error);
      });
    }, 1000);
    if (typeof this.eventTimer.unref === "function") {
      this.eventTimer.unref();
    }
  }

  async processEventQueue() {
    if (this.eventQueue.length === 0) {
      return;
    }
    const event = this.eventQueue.shift();
    await this.routeEvent(event);
    await this.saveReceipt(event);
  }

  async routeEvent(event) {
    console.log("\u26a1 Routing event:", event.type);
    switch (event.source) {
      case "cosmogenesis":
        await this.connections.cosmogenesis.handle(event);
        break;
      case "stone-grimoire":
        await this.connections.stoneGrimoire.handle(event);
        break;
      case "codex-1499":
        await this.connections.codex1499.handle(event);
        break;
      case "living-arcanae":
        await this.connections.livingArcanae.handle(event);
        break;
      case "living-arcanae-game":
        await this.connections.livingArcanaeGame.handle(event);
        break;
      case "circuitum99":
        await this.connections.circuitum99.handle(event);
        break;
      case "magical-mystery-house":
        await this.connections.magicalMysteryHouse.handle(event);
        break;
      default:
        console.warn("Unknown event source:", event.source);
        break;
    }
  }

  async saveReceipt(event) {
    const receipt = {
      timestamp: new Date().toISOString(),
      event,
      processed: true
    };
    console.log("\u2713 Receipt saved:", receipt.timestamp);
  }

  async sendEvent(source, type, data) {
    const event = {
      id: this.generateEventId(),
      source,
      type,
      data,
      timestamp: new Date().toISOString()
    };
    this.eventQueue.push(event);
    return event.id;
  }

  generateEventId() {
    const timestamp = Date.now();
    const mystical = timestamp % this.numerology.ONEFORTYFOUR;
    return `EVT-${timestamp}-${mystical}`;
  }

  getNode(nodeId) {
    return this.registry.nodes.get(nodeId);
  }

  getRoom(roomId) {
    return this.registry.rooms.get(roomId);
  }

  getArcana(arcanaId) {
    return this.registry.arcana.get(arcanaId);
  }

  getShem(shemId) {
    return this.registry.shem.get(shemId);
  }

  async renderGeometry(canvasId, config = {}) {
    if (typeof document === "undefined") {
      console.warn("renderGeometry requires a browser DOM environment.");
      return;
    }
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
      console.warn(`Canvas ${canvasId} not found.`);
      return;
    }
    const ctx = canvas.getContext("2d");
    const palette = config.palette || (await this.loadPalette());
    renderHelix(ctx, {
      width: canvas.width,
      height: canvas.height,
      palette,
      NUM: this.numerology
    });
  }

  async loadPalette() {
    const palette = await readJSONResource("./data/palette.json");
    if (palette) {
      return palette;
    }
    return {
      bg: "#0b0b12",
      ink: "#e8e8f0",
      layers: [
        "#b1c7ff",
        "#89f7fe",
        "#a0ffa1",
        "#ffd27f",
        "#f5a3ff",
        "#d0d0e6"
      ]
    };
  }
}

class CosmogenesisConnection {
  async handle(event) {
    console.log("\u269b Cosmogenesis processing:", event.type);
  }
}

class StoneGrimoireConnection {
  async handle(event) {
    console.log("\ud83d\udcdc Stone Grimoire processing:", event.type);
  }
}

class Codex1499Connection {
  async handle(event) {
    console.log("\ud83d\udcd6 Codex 1499 processing:", event.type);
  }
}

class LivingArcanaeConnection {
  async handle(event) {
    console.log("\ud83d\udd2e Living Arcanae processing:", event.type);
  }
}

class LivingArcanaeGameConnection {
  async handle(event) {
    console.log("\ud83c\udfae Living Arcanae Game processing:", event.type);
  }
}

class Circuitum99Connection {
  async handle(event) {
    console.log("\u26a1 Circuitum 99 processing:", event.type);
  }
}

class MagicalMysteryHouseConnection {
  async handle(event) {
    console.log("\ud83c\udfdb\ufe0f Magical Mystery House processing:", event.type);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const bridge = new TesseractBridge();
  bridge.initialize().catch(error => {
    console.error("Bridge initialization failed:", error);
  });
}
