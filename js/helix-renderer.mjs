/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves with rungs)

  All geometry is parameterized by numerology constants (3,7,9,11,22,33,99,144).
*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, { width, height, color: palette.layers[0], NUM });
  drawTreeOfLife(ctx, { width, height, color: palette.layers[1], NUM });
  drawFibonacci(ctx, { width, height, color: palette.layers[2], NUM });
  drawHelix(ctx, { width, height, color: palette.layers[3], NUM });
}

// Layer 1: Vesica field
function drawVesica(ctx, { width, height, color, NUM }) {
  const cols = NUM.THREE; // 3 columns
  const rows = NUM.SEVEN; // 7 rows
  const radius = Math.min(width / (cols * 2), height / (rows * 2));
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.2; // ND-safe: keep light

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const x = (c + 0.5) * width / cols;
      const y = (r + 0.5) * height / rows;
      ctx.beginPath();
      ctx.arc(x - radius / 2, y, radius, 0, Math.PI * 2);
      ctx.arc(x + radius / 2, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}

// Layer 2: Tree-of-Life scaffold
function drawTreeOfLife(ctx, { width, height, color, NUM }) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.4;

  const nodes = [
    [0.5, 0.05], //1 Keter
    [0.75, 0.18], //2 Chokhmah
    [0.25, 0.18], //3 Binah
    [0.75, 0.35], //4 Chesed
    [0.25, 0.35], //5 Gevurah
    [0.5, 0.5],  //6 Tiferet
    [0.75, 0.65], //7 Netzach
    [0.25, 0.65], //8 Hod
    [0.5, 0.82], //9 Yesod
    [0.5, 0.95]  //10 Malkuth
  ].map(([x, y]) => [x * width, y * height]);

  // 22 paths (approximate traditional connections)
  const paths = [
    [1,2],[1,3],[2,3],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6],
    [4,5],[4,6],[4,7],[4,8],[5,6],[5,8],[6,7],[6,8],[6,9],
    [7,8],[7,9],[8,9],[9,10]
  ];
  // ensure we reference correct indices (1-based in list)
  paths.forEach(([a,b]) => {
    const [x1,y1] = nodes[a-1];
    const [x2,y2] = nodes[b-1];
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  });

  // draw nodes
  const r = 6;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;
}

// Layer 3: Fibonacci curve (log spiral)
function drawFibonacci(ctx, { width, height, color, NUM }) {
  const cx = width / 2;
  const cy = height / 2;
  const turns = NUM.ONEFORTYFOUR; // spiral length scaled by 144 degrees
  const steps = NUM.NINETYNINE; // resolution
  const growth = 0.12; // gentle expansion
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;

  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (Math.PI * 2 * (turns / 360));
    const r = 5 * Math.exp(growth * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

// Layer 4: Double-helix lattice
function drawHelix(ctx, { width, height, color, NUM }) {
  const midY = height / 2;
  const amplitude = height / 4;
  const steps = NUM.NINETYNINE; // smoothness
  const freq = NUM.NINE * Math.PI * 2 / width; // 9 oscillations across width
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.8;

  // first strand
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = midY + amplitude * Math.sin(freq * x);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // second strand phase-shifted by pi
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y = midY + amplitude * Math.sin(freq * x + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // rungs
  const rungs = NUM.THIRTYTHREE; // 33 rungs
  for (let i = 0; i <= rungs; i++) {
    const x = (i / rungs) * width;
    const y1 = midY + amplitude * Math.sin(freq * x);
    const y2 = midY + amplitude * Math.sin(freq * x + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}
