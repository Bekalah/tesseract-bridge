/**
 * Mounts a hero image into the page using metadata from an art manifest, with graceful fallback.
 *
 * Attempts to resolve the mount target element, fetch the manifest, normalize the hero entry,
 * create and insert an eager-loading Image element, and update an optional status element.
 * If any step fails (missing mount point, manifest, invalid hero, or image load error) the
 * provided fallback callback is invoked and the mount point is updated with a fallback message.
 *
 * @param {Object} [options] - Mount configuration.
 * @param {string} [options.manifestPath="./assets/art/manifest.json"] - Path to the JSON manifest.
 * @param {string} [options.targetId="hero-art"] - ID of the DOM element to receive the hero image.
 * @param {Element|null} [options.statusElement=null] - Optional DOM element whose textContent is updated with status messages.
 * @param {Function|null} [options.onFallback=null] - Optional callback invoked with a fallback message when mounting fails.
 * @returns {{src: string, alt: string} | null} The normalized hero object ({ src, alt }) on success, or null if mounting failed.
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
 * Fetch the manifest JSON at the provided path and compute a base URL for resolving assets.
 *
 * Attempts to GET the manifest using a no-store fetch against a base URL derived from `path`.
 * On success returns the parsed JSON as `manifest`. On a non-OK response or on network/fetch
 * errors the function returns `manifest: null` and a human-readable `message` describing the
 * fallback status. The returned `baseUrl` is a URL object resolved from `path` and should be
 * used to resolve relative asset references.
 *
 * @param {string} path - Path or URL used to derive the manifest request URL and base for assets.
 * @return {Promise<{manifest: Object|null, baseUrl: URL, message: string}>} An object with the parsed manifest (or null), the resolved baseUrl, and a status message.
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
 * Resolve a base URL object for a given path relative to the current location.
 *
 * Attempts to construct a URL from `path` using `window.location.href` as the base.
 * If `path` cannot be parsed, returns a URL for the current page location.
 *
 * @param {string} path - The input path or URL to resolve (relative or absolute).
 * @return {URL} The resolved URL object.
 */
function resolveBaseUrl(path) {
  try {
    return new URL(path, window.location.href);
  } catch (error) {
    return new URL(window.location.href);
  }
}

/**
 * Validate and normalize a hero entry from the manifest.
 *
 * Returns a normalized object with a resolved `src` and an `alt` string when `hero.src`
 * is a non-empty string. If `hero` is missing, not an object, or `src` is empty, returns null.
 *
 * @param {Object} hero - Manifest hero entry; expected to include a string `src` and optionally `alt`.
 * @param {URL|string} baseUrl - Base URL used to resolve relative `src` values (passed to resolveSource).
 * @returns {{src: string, alt: string}|null} Normalized hero with resolved `src` and `alt`, or null if invalid.
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
 * Resolve an image source into an absolute URL string, preserving data URIs.
 *
 * If `src` is a data URI (starts with `data:`) it is returned unchanged. Otherwise
 * this function attempts to resolve `src` against `baseUrl` using the URL constructor
 * and returns the resulting absolute href. If URL construction fails, the original
 * `src` string is returned unchanged.
 *
 * @param {string} src - The source value from the manifest (relative, absolute, or data URI).
 * @param {URL|string} baseUrl - Base URL used to resolve relative sources.
 * @return {string} Absolute URL string for network sources, or the original `src` for data URIs or on resolution failure.
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
 * Create and configure an Image element for hero art.
 *
 * @param {{src: string, alt: string}} hero - Hero data where `src` is the resolved image URL or data URI and `alt` is the alt text.
 * @return {HTMLImageElement} A ready-to-insert <img> element with eager loading, async decoding, sizing and basic styling applied.
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
 * Set the text content of a status DOM element if it exists.
 *
 * If `element` is falsy the function is a no-op.
 *
 * @param {Element|null|undefined} element - The DOM element whose textContent will be updated.
 * @param {string} message - The message to write into the element's textContent.
 */
function updateStatus(element, message) {
  if (!element) {
    return;
  }
  element.textContent = message;
}

/**
 * Report a fallback condition: update a status element and invoke an optional fallback callback.
 *
 * Updates the provided statusElement's text with `message` (no-op if falsy) and, if `opts.onFallback`
 * is a function, calls it with the same `message`.
 *
 * @param {Object} opts - Options bag.
 * @param {Element|null} opts.statusElement - DOM element whose textContent will be set to `message`. If falsy, no DOM update occurs.
 * @param {Function|null} opts.onFallback - Optional callback invoked with `message` when a fallback occurs.
 * @param {string} message - Human-readable status or error message describing the fallback reason.
 */
function triggerFallback(opts, message) {
  updateStatus(opts.statusElement, message);
  if (typeof opts.onFallback === "function") {
    opts.onFallback(message);
  }
}
