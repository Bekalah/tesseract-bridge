/*
  art-loader.js
  Loads WEBP-only hero art from the manifest and appends it to the altar container.
  ND-safe: graceful fallback text if the manifest is unavailable or references
  a non-WEBP asset. No motion or external dependencies.
*/

function appendNotice(container, text) {
  const note = document.createElement("p");
  note.textContent = text;
  note.style.margin = "8px 0 0";
  note.style.fontSize = "13px";
  note.style.color = "#a6a6c1";
  container.appendChild(note);
}

export async function mountArt(targetId = "hero-art", manifestPath = "/assets/art/manifest.json") {
  const container = document.getElementById(targetId);
  if (!container) {
    return "container-missing";
  }

  if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
    appendNotice(container, "Offline mode: manifest fetch skipped; octagram fallback active.");
    return "offline-skip";
  }

  try {
    const res = await fetch(manifestPath, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }
    const manifest = await res.json();
    const hero = manifest && manifest.hero;
    if (!hero || typeof hero.src !== "string") {
      appendNotice(container, "Manifest missing WEBP hero; fallback canvas retained.");
      return "manifest-missing";
    }
    if (!hero.src.trim().toLowerCase().endsWith(".webp")) {
      appendNotice(container, "Manifest hero must be WEBP per covenant; fallback canvas retained.");
      return "format-invalid";
    }

    return await new Promise((resolve) => {
      const img = new Image();
      img.loading = "eager";
      img.decoding = "async";
      img.src = hero.src;
      img.alt = typeof hero.alt === "string" ? hero.alt : "";
      img.addEventListener("load", () => {
        resolve("loaded");
      });
      img.addEventListener("error", () => {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
        appendNotice(container, "Hero WEBP failed to load; fallback canvas retained.");
        resolve("image-error");
      });
      container.appendChild(img);
    });
  } catch (error) {
    appendNotice(container, "Manifest fetch failed; fallback canvas retained.");
    return "fetch-error";
/**
 * Mounts a hero WEBP image into the page using a remote manifest, with graceful fallback.
 *
 * Attempts to locate the DOM mount point (by `targetId`), fetch and parse the manifest,
 * normalize the hero entry, build and insert an Image element, and update an optional
 * status element. On any failure (missing mount point, manifest, hero data, or image load)
 * the function writes a user-visible message into the mount point and invokes the
 * provided fallback callback.
 *
 * @param {Object} [options] - Overrides for mounting behavior.
 * @param {string} [options.manifestPath="./assets/art/manifest.json"] - Path to the art manifest JSON.
 * @param {string} [options.targetId="hero-art"] - ID of the DOM element to mount the hero image into.
 * @param {Element|null} [options.statusElement=null] - Optional element whose textContent will be updated with status messages.
 * @param {(message: string) => void|null} [options.onFallback=null] - Optional callback invoked with a fallback message when fallback is triggered.
 * @returns {{src: string, alt: string}|null} The normalized hero object ({ src, alt }) on success, or `null` if mounting failed.
 */

export async function mountArt(options = {}) {
  const opts = {
    manifestPath: "./assets/art/manifest.json",
    targetId: "hero-art",
    statusElement: null,
    onFallback: null,
    ...options
  };

  const mountPoint = document.getElementById(opts.targetId);
  if (!mountPoint) {
    const msg = "Hero art mount missing; octagram fallback only.";
    triggerFallback(opts, msg);
    return null;
  }

  const manifestResult = await fetchManifest(opts.manifestPath);
  if (!manifestResult.manifest) {
    mountPoint.textContent = manifestResult.message;
    triggerFallback(opts, manifestResult.message);
    return null;
  }

  const hero = normalizeHero(manifestResult.manifest.hero, manifestResult.baseUrl);
  if (!hero) {
    const msg = "Manifest missing hero art; octagram fallback active.";
    mountPoint.textContent = msg;
    triggerFallback(opts, msg);
    return null;
  }

  const img = buildHeroImage(hero);
  mountPoint.innerHTML = "";
  mountPoint.appendChild(img);
  updateStatus(opts.statusElement, "Loading hero art (WEBP)...");

  const onLoad = () => {
    updateStatus(opts.statusElement, "Hero art mounted (WEBP).");
  };
  const onError = () => {
    const msg = "Hero art resource missing; octagram fallback active.";
    mountPoint.textContent = msg;
    triggerFallback(opts, msg);
  };

  img.addEventListener("load", onLoad, { once: true });
  img.addEventListener("error", onError, { once: true });

  if (img.complete) {
    if (img.naturalWidth > 0) {
      onLoad();
    } else {
      onError();
    }
  }

  return hero;
}

/**
 * Fetches a JSON manifest from the given path and returns the parsed manifest together with its resolved base URL and a status message.
 *
 * Resolves the provided path to an absolute base URL, performs a no-store fetch, and returns a structured result object.
 * On non-OK HTTP responses or on fetch errors (e.g., offline or file:// restrictions) this function does not throw — it returns `{ manifest: null }` and a message indicating a fallback should be used.
 *
 * @param {string} path - Path or URL to the manifest (may be relative).
 * @returns {Promise<{manifest: any|null, baseUrl: URL, message: string}>} An object containing the parsed `manifest` (or `null` if unavailable), the resolved `baseUrl`, and a human-readable `message`.
 */
async function fetchManifest(path) {
  const baseUrl = resolveBaseUrl(path);
  try {
    const response = await fetch(baseUrl.href, { cache: "no-store" });
    if (!response.ok) {
      return { manifest: null, baseUrl, message: "Manifest fetch failed; octagram fallback ready." };
    }
    const data = await response.json();
    return { manifest: data, baseUrl, message: "Manifest loaded." };
  } catch (error) {
    // Offline or file:// contexts may block fetch; respect fallback strategy.
    return { manifest: null, baseUrl, message: "Manifest unavailable; relying on fallback art." };
  }
}

/**
 * Resolve a path to an absolute URL using the current page location.
 *
 * Attempts to construct a URL for the given path relative to window.location.href.
 * If the path is invalid (throws), returns a URL for the current page location instead.
 *
 * @param {string} path - A relative or absolute URL string to resolve.
 * @returns {URL} The resolved absolute URL (falls back to the current page URL on error).
 */
function resolveBaseUrl(path) {
  try {
    return new URL(path, window.location.href);
  } catch (error) {
    return new URL(window.location.href);
  }
}

/**
 * Validate and normalize a hero entry from the manifest into a safe {src, alt} object.
 *
 * Returns null if the input is not an object or has no usable `src`. If valid, trims the
 * source string, resolves it against `baseUrl` (data URLs are preserved), and preserves
 * the alt text (empty string when absent).
 *
 * @param {Object} hero - Manifest hero entry expected to contain `src` and optional `alt`.
 * @param {URL|string} baseUrl - Base URL used to resolve relative `src` values.
 * @returns {{src: string, alt: string}|null} Normalized hero with resolved `src` and `alt`, or `null` if invalid.
 */
function normalizeHero(hero, baseUrl) {
  if (!hero || typeof hero !== "object") {
    return null;
  }
  const rawSrc = typeof hero.src === "string" ? hero.src.trim() : "";
  if (!rawSrc) {
    return null;
  }
  const alt = typeof hero.alt === "string" ? hero.alt : "";
  return {
    src: resolveSource(rawSrc, baseUrl),
    alt
  };
}

/**
 * Resolve an image source to an absolute URL, preserving data URIs.
 *
 * If `src` is a `data:` URI it is returned unchanged. Otherwise `src` is resolved
 * against `baseUrl` using the URL constructor; on resolution errors the original
 * `src` is returned as a fallback.
 *
 * @param {string} src - Image source; may be a data URI, absolute URL, or relative path.
 * @param {string|URL} baseUrl - Base URL used to resolve relative `src` values.
 * @return {string} An absolute URL string, the original `data:` URI, or the original `src` on error.
 */
function resolveSource(src, baseUrl) {
  if (src.startsWith("data:")) {
    return src;
  }
  try {
    const resolved = new URL(src, baseUrl);
    return resolved.href;
  } catch (error) {
    return src;
  }
}

/**
 * Create and configure an HTMLImageElement for a hero image.
 *
 * @param {{src: string, alt?: string}} hero - Hero descriptor with a resolved `src` URL and optional `alt` text.
 * @returns {HTMLImageElement} A configured <img> element (loading eager, async decoding, responsive styling) ready to be mounted into the DOM.
 */
function buildHeroImage(hero) {
  const img = new Image();
  img.loading = "eager";
  img.decoding = "async";
  img.src = hero.src;
  img.alt = hero.alt;
  img.style.display = "block";
  img.style.maxWidth = "100%";
  img.style.margin = "0 auto";
  img.style.boxShadow = "0 0 0 1px #1d1d2a";
  return img;
}

/**
 * Update a status DOM element's text content if the element exists.
 *
 * No-op when `element` is null or undefined.
 * @param {HTMLElement|null|undefined} element - The DOM element to update (ignored if falsy).
 * @param {string} message - Message to set as the element's text content.
 */
function updateStatus(element, message) {
  if (!element) {
    return;
  }
  element.textContent = message;
}

/**
 * Notify the user and invoke the configured fallback callback.
 *
 * Updates the provided status element's text with the given message and, if present, calls opts.onFallback(message).
 *
 * @param {{statusElement?: Element|null, onFallback?: function}} opts - Options containing an optional DOM element to display status and an optional fallback callback.
 * @param {string} message - Message describing the fallback reason.
 */
function triggerFallback(opts, message) {
  updateStatus(opts.statusElement, message);
  if (typeof opts.onFallback === "function") {
    opts.onFallback(message);
  }
}
