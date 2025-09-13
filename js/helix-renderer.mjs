/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers (back to front):
    1) Vesica field – intersecting circles
    2) Tree-of-Life scaffold – ten nodes, twenty-two paths
    3) Fibonacci curve – logarithmic spiral polyline
    4) Double-helix lattice – two phase-shifted strands

  All geometry is static: no animation, no network calls, no external deps.
  Numerology constants (3,7,9,11,22,33,99,144) guide proportions.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field ---
// Calm grid of intersecting circles; cols*rows < 144 to stay gentle.
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.NINE;
  const rows = NUM.SEVEN;
  const stepX = w / cols;
  const stepY = h / rows;
  const r = Math.min(stepX, stepY) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let c = 0; c < cols; c++) {
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const cx = c * stepX + stepX / 2;
      const cy = rIdx * stepY + stepY / 2;
      ctx.beginPath();
      ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// --- Layer 2: Tree-of-Life scaffold ---
// Ten sephirot nodes with twenty-two connective paths.
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodes = [
    [0.5, 0.05],
    [0.35, 0.15], [0.65, 0.15],
    [0.35, 0.30], [0.65, 0.30],
    [0.5, 0.40],
    [0.35, 0.55], [0.65, 0.55],
    [0.5, 0.65],
    [0.5, 0.80]
  ].map(([x, y]) => [x * w, y * h]);

  const edges = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[1,4],[2,3],[3,4],
    [3,5],[4,5],[5,6],[5,7],[6,7],[3,6],[4,7],[6,8],
    [7,8],[5,8],[8,9],[0,5],[1,5],[2,5]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1.5;
  edges.forEach(([a, b]) => {
    const [x1, y1] = nodes[a];
    const [x2, y2] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = Math.min(w, h) / NUM.THIRTYTHREE;
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// --- Layer 3: Fibonacci curve ---
// Static logarithmic spiral approximated with a polyline.
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE;
  const scale = Math.min(w, h) / NUM.ELEVEN;
  const cx = w * 0.2;
  const cy = h * 0.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps * turns; i++) {
    const theta = (i / steps) * turns * (Math.PI / 2);
    const r = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice ---
// Two sine strands with crossbars; entirely static for ND safety.
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segments = NUM.ONEFORTYFOUR;
  const amp = h / NUM.NINE;
  const step = w / segments;
  const mid = h / 2;
  const phase = Math.PI; // 180° offset for second strand

  const strand = (offset, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = mid + amp * Math.sin((i / NUM.THREE) * Math.PI * 2 + offset);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  strand(0, colorA);
  strand(phase, colorB);

  ctx.strokeStyle = colorA;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const x = i * step;
    const y1 = mid + amp * Math.sin((i / NUM.THREE) * Math.PI * 2);
    const y2 = mid + amp * Math.sin((i / NUM.THREE) * Math.PI * 2 + phase);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
