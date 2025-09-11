/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  Design:
    - No motion or interaction; all draws happen once.
    - Palette-driven colors with soft contrasts.
    - Numerology constants (3,7,9,11,22,33,99,144) parameterize geometry.
*/

export function renderHelix(ctx, opts) {
  const { width:w, height:h, palette, NUM } = opts;

  // Fill background explicitly for offline clarity
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  drawVesica(ctx, w, h, palette.layers[0], NUM);
  drawTree(ctx, w, h, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, w, h, palette.layers[3], NUM);
  drawHelix(ctx, w, h, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field -- two intersecting circles
function drawVesica(ctx, w, h, color, NUM) {
  const r = h / NUM.THREE; // calm scale
  const cy = h / 2;
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// Layer 2: Tree-of-Life scaffold
function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  // Normalized node positions (x,y)
  const nodes = [
    [0.5, 0.05], // Keter
    [0.75, 0.2], // Chokmah
    [0.25, 0.2], // Binah
    [0.75, 0.4], // Chesed
    [0.25, 0.4], // Gevurah
    [0.5, 0.55], // Tipheret
    [0.75, 0.7], // Netzach
    [0.25, 0.7], // Hod
    [0.5, 0.85], // Yesod
    [0.5, 0.95]  // Malkuth
  ];

  const edges = [
    [0,1],[0,2],[1,2],[1,3],[2,4],[3,4],
    [3,5],[4,5],[3,6],[4,7],[6,7],[6,8],[7,8],
    [8,9],[5,6],[5,7],[1,4],[2,3],[0,5],[5,8],
    [1,5],[2,5]
  ]; // 22 paths

  const scale = (p) => [p[0] * w, p[1] * h];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1.5;
  edges.forEach(([a,b]) => {
    const [x1,y1] = scale(nodes[a]);
    const [x2,y2] = scale(nodes[b]);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = h / NUM.NINETYNINE; // small calm nodes
  nodes.forEach(n => {
    const [x,y] = scale(n);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve (approximate log spiral)
function drawFibonacci(ctx, w, h, color, NUM) {
  const cx = w / 2;
  const cy = h / 2;
  const maxR = Math.min(w, h) / 2;
  const pts = [];
  for (let i = 0; i <= NUM.ONEFORTYFOUR; i++) {
    const phi = i / NUM.ONEFORTYFOUR * 4 * Math.PI; // up to two turns
    const r = maxR * (i / NUM.ONEFORTYFOUR); // simple expansion
    pts.push([cx + r * Math.cos(phi), cy + r * Math.sin(phi)]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  ctx.stroke();
}

// Layer 4: Static double-helix lattice
function drawHelix(ctx, w, h, c1, c2, NUM) {
  const mid = h / 2;
  const amp = h / NUM.ELEVEN; // gentle amplitude
  const step = w / NUM.NINETYNINE;
  const period = w / NUM.THIRTYTHREE; // wave length
  const a = [];
  const b = [];
  for (let x = 0; x <= w; x += step) {
    const t = (2 * Math.PI * x) / period;
    a.push([x, mid + amp * Math.sin(t)]);
    b.push([x, mid + amp * Math.sin(t + Math.PI)]);
  }

  // Helix A
  ctx.strokeStyle = c1;
  ctx.beginPath();
  ctx.moveTo(a[0][0], a[0][1]);
  for (let i = 1; i < a.length; i++) ctx.lineTo(a[i][0], a[i][1]);
  ctx.stroke();

  // Helix B
  ctx.strokeStyle = c2;
  ctx.beginPath();
  ctx.moveTo(b[0][0], b[0][1]);
  for (let i = 1; i < b.length; i++) ctx.lineTo(b[i][0], b[i][1]);
  ctx.stroke();

  // Lattice crossbars every 7th step
  ctx.strokeStyle = c1;
  for (let i = 0; i < a.length; i += NUM.SEVEN) {
    ctx.beginPath();
    ctx.moveTo(a[i][0], a[i][1]);
    ctx.lineTo(b[i][0], b[i][1]);
    ctx.stroke();
  }
}
