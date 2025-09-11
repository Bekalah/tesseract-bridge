/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers order (back to front):
    1) Vesica field (intersecting circles grid)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine strands)

  All drawing routines are pure; no global state, no motion.
*/

export function renderHelix(ctx, options) {
  const w = options.width;
  const h = options.height;
  const palette = options.palette;
  const NUM = options.NUM;

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);

  drawVesica(ctx, w, h, palette.layers[0], NUM);
  drawTreeOfLife(ctx, w, h, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, w, h, palette.layers[3], NUM);
  drawHelix(ctx, w, h, palette.layers[4], palette.layers[5], NUM);
}

// L1 Vesica field: calm circle grid evoking sacred intersection
function drawVesica(ctx, w, h, color, NUM) {
  const cols = NUM.NINE;      // nine columns for completeness of 0-9
  const rows = NUM.SEVEN;     // seven vertical tiers
  const r = Math.min(w / cols, h / rows) / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let c = 0; c < cols; c++) {
    for (let rIdx = 0; rIdx < rows; rIdx++) {
      const x = (c + 0.5) * (w / cols);
      const y = (rIdx + 0.5) * (h / rows);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// L2 Tree-of-Life: ten sephirot nodes and twenty-two connecting paths
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  const third = w / 3;
  const mid = w / 2;
  const unit = h / NUM.TWENTYTWO; // vertical spacing using 22 paths constant

  const nodes = [
    { x: mid,    y: unit * 2 },   // 0 Keter
    { x: third,  y: unit * 4 },   // 1 Chokmah
    { x: third*2,y: unit * 4 },   // 2 Binah
    { x: third,  y: unit * 8 },   // 3 Chesed
    { x: third*2,y: unit * 8 },   // 4 Gevurah
    { x: mid,    y: unit * 10 },  // 5 Tiferet
    { x: third,  y: unit * 14 },  // 6 Netzach
    { x: third*2,y: unit * 14 },  // 7 Hod
    { x: mid,    y: unit * 16 },  // 8 Yesod
    { x: mid,    y: unit * 20 }   // 9 Malkuth
  ];

  const edges = [
    [0,1],[0,2],[1,2],[1,3],[1,5],[2,3],[2,4],[2,5],
    [3,4],[3,5],[3,6],[4,5],[4,7],[5,6],[5,7],[5,8],
    [6,7],[6,8],[6,9],[7,8],[7,9],[8,9]
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  edges.forEach(function(e){
    const a = nodes[e[0]];
    const b = nodes[e[1]];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(function(n){
    ctx.beginPath();
    ctx.arc(n.x, n.y, NUM.THREE, 0, Math.PI * 2); // node radius 3
    ctx.fill();
  });
}

// L3 Fibonacci curve: static log spiral, gentle yellow path
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.THIRTYTHREE; // 33 segments
  const center = { x: w * 0.25, y: h * 0.75 };
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.NINE; // base size

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const theta = i * (Math.PI / NUM.ELEVEN); // gentle sweep
    const radius = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

// L4 Double-helix lattice: two phase-shifted sine strands with crossbars
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const steps = NUM.NINETYNINE; // fine vertical resolution
  const amp = w / NUM.SEVEN;    // amplitude width
  const freq = NUM.ELEVEN * Math.PI * 2; // helix density
  const stepY = h / steps;

  ctx.lineWidth = 1;

  function strand(color, phase) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = w / 2 + Math.sin(freq * t + phase) * amp;
      const y = i * stepY;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  strand(colorA, 0);
  strand(colorB, Math.PI); // phase shift for second strand

  ctx.strokeStyle = colorA;
  for (let i = 0; i <= NUM.TWENTYTWO; i += 2) { // lattice crossbars
    const t = i / NUM.TWENTYTWO;
    const y = t * h;
    const x1 = w / 2 + Math.sin(freq * t) * amp;
    const x2 = w / 2 + Math.sin(freq * t + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}
