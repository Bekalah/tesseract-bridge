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
  }
}
