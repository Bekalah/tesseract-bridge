/**
 * Cathedral event bus helper.
 *
 * Offline-first and ND-safe: no automatic reconnection loops, no hidden motion.
 * Consumers opt-in by calling `connect()` when a bridge to cathedral-core is needed.
 */
export type BridgeEvent = {
  topic:string;
  payload?:unknown;
};

export type BridgeHandler = (event:BridgeEvent) => void;

export interface BridgeEventBus {
  connect:() => void;
  publish:(topic:string, payload?:unknown) => void;
  subscribe:(topic:string, handler:BridgeHandler) => () => void;
}

const WS_ENDPOINT = "wss://cathedral-core.fly.dev/ws";

export function createEventBus():BridgeEventBus {
  const subscriptions = new Map<string, Set<BridgeHandler>>();
  let socket:WebSocket | null = null;

  function ensureSocket():void {
    if (socket || typeof WebSocket !== "function") {
      return;
    }

    socket = new WebSocket(WS_ENDPOINT);
    socket.addEventListener("message", (event:MessageEvent) => {
      const envelope = decodeEnvelope(event.data);
      if (!envelope) {
        return;
      }
      deliver(envelope);
    });

    socket.addEventListener("close", () => {
      socket = null; // allow manual reconnection; no automatic loops.
    });

    socket.addEventListener("error", () => {
      socket = null;
    });
  }

  function connect():void {
    ensureSocket();
  }

  function publish(topic:string, payload?:unknown):void {
    const envelope:BridgeEvent = { topic, payload };
    deliver(envelope); // Local echo keeps offline behavior consistent.

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    try {
      socket.send(JSON.stringify(envelope));
    } catch (_error) {
      // Ignore serialization errors; ND-safe rule avoids noisy throws.
    }
  }

  function subscribe(topic:string, handler:BridgeHandler):() => void {
    const safeHandler:BridgeHandler = (event) => handler(event);
    const group = subscriptions.get(topic) ?? new Set<BridgeHandler>();
    group.add(safeHandler);
    subscriptions.set(topic, group);

    return () => {
      const existing = subscriptions.get(topic);
      if (!existing) {
        return;
      }
      existing.delete(safeHandler);
      if (existing.size === 0) {
        subscriptions.delete(topic);
      }
    };
  }

  function deliver(event:BridgeEvent):void {
    const listeners = subscriptions.get(event.topic);
    if (!listeners) {
      return;
    }
    listeners.forEach((listener) => {
      listener(event);
    });
  }

  return { connect, publish, subscribe };
}

function decodeEnvelope(raw:unknown):BridgeEvent | null {
  if (raw == null) {
    return null;
  }

  let text:string;
  if (typeof raw === "string") {
    text = raw;
  } else if (raw instanceof ArrayBuffer) {
    text = new TextDecoder("utf-8").decode(new Uint8Array(raw));
  } else {
    text = String(raw);
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const topic = typeof (parsed as { topic?:unknown }).topic === "string" ? (parsed as { topic:string }).topic : null;
    if (!topic) {
      return null;
    }
    const payload = (parsed as { payload?:unknown }).payload;
    return { topic, payload };
  } catch (_error) {
    return null;
  }
}
