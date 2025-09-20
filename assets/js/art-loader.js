/*
  art-loader.js
  Fetches WEBP art metadata and mounts a static image into the page.
  ND-safe: eager loading without motion, graceful fallback when assets are offline.
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

function resolveBaseUrl(path) {
  try {
    return new URL(path, window.location.href);
  } catch (error) {
    return new URL(window.location.href);
  }
}

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

function updateStatus(element, message) {
  if (!element) {
    return;
  }
  element.textContent = message;
}

function triggerFallback(opts, message) {
  updateStatus(opts.statusElement, message);
  if (typeof opts.onFallback === "function") {
    opts.onFallback(message);
  }
}
