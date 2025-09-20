/*
  bridge.js
  Tiny helper for remote realms to discover bridge links and check health.
  ND-safe: small pure functions, offline-first defaults, ASCII quotes only.
*/
(function createBridgeIIFE() {
  const script = typeof document !== "undefined" ? document.currentScript : null;
  const baseHref = resolveBase(script);

  function resolveBase(currentScript) {
    /*
      Pure resolver: determines the base URL for subsequent fetches. When no
      script element is present, falls back to window location or root.
    */
    if (currentScript && currentScript.src) {
      return new URL("./", currentScript.src).toString();
    }
    if (typeof window !== "undefined" && window.location) {
      return window.location.origin + "/";
    }
    return "./";
  }

  function makeURL(path) {
    return new URL(path, baseHref).toString();
  }

  async function fetchJSON(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.json();
  }

  async function fetchText(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    return await response.text();
  }

  function createBridge(base) {
    /*
      Exposes two pure async helpers:
        - links(): fetches realm links JSON for discovery.
        - ping(): fetches health check and reports status text + timestamp.
    */
    return {
      async links() {
        const data = await fetchJSON(makeURL("registry/realm_links.json"));
        return { base, data };
      },
      async ping() {
        const responseText = await fetchText(makeURL("core/health-check.html"));
        return {
          base,
          ok: true,
          received: new Date().toISOString(),
          snippet: responseText.slice(0, 144)
        };
      }
    };
  }

  const bridge = createBridge(baseHref);
  if (typeof globalThis !== "undefined") {
    globalThis.tesseractBridge = bridge;
  }
})();
