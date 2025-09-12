/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers rendered in order to preserve depth:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)
  No animation, network, or external libraries.
*/

// Draw repeating vesica circles. Limited to 144 iterations for calm visuals.
function drawVesica(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const radius = Math.min(w, h) / NUM.THREE;
  const step = radius;
  let count = 0;
  for (let y = radius; y < h && count < NUM.ONEFORTYFOUR; y += step) {
    for (let x = radius; x < w && count < NUM.ONEFORTYFOUR; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + step / 2, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      count++;
    }
  }
}

// Simplified Tree-of-Life with 10 nodes and 22 paths.
function drawTree(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const cx = w / 2;
  const cy = h / 2;
  const spacing = h / NUM.ELEVEN;
  const nodes = [
    { x: cx, y: cy - spacing * 3 },
    { x: cx - spacing, y: cy - spacing * 2 },
    { x: cx + spacing, y: cy - spacing * 2 },
    { x: cx - spacing * 2, y: cy - spacing },
    { x: cx, y: cy - spacing },
    { x: cx + spacing * 2, y: cy - spacing },
    { x: cx - spacing, y: cy },
    { x: cx + spacing, y: cy },
    { x: cx, y: cy + spacing },
    { x: cx, y: cy + spacing * 2 },
  ];
  const paths = [
    [1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 5], [3, 6], [4, 5],
    [5, 6], [4, 7], [5, 7], [5, 8], [6, 8], [7, 8], [7, 9], [8, 9],
    [7, 10], [8, 10], [9, 10], [4, 3], [6, 2], [1, 5],
  ];
  paths.forEach(([a, b]) => {
    const A = nodes[a - 1];
    const B = nodes[b - 1];
    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.stroke();
  });
  ctx.fillStyle = color;
  const r = NUM.NINE / NUM.THREE; // radius 3
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Static Fibonacci spiral built from quarter-circle arcs.
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  let a = 0;
  let b = Math.min(w, h) / NUM.NINETYNINE;
  let x = w / 2;
  let y = h / 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  for (let i = 0; i < NUM.THIRTYTHREE; i++) {
    const next = a + b;
    const angle = (i % 4) * (Math.PI / 2);
    ctx.arc(x, y, next, angle, angle + Math.PI / 2);
    a = b;
    b = next;


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


  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)


    4) Double-helix lattice (two phase-shifted, no motion)
*/

// Small helpers
function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

// Draw layer 1: Vesica field
function drawVesica(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const r = NUM.NINETYNINE;
  const step = NUM.ONEFORTYFOUR;
  for (let y = -r; y <= h + r; y += step) {
    for (let x = -r; x <= w + r; x += step) {
      circle(ctx, x, y, r);
      ctx.stroke();
    }
  }
}

// Draw layer 2: Tree-of-Life (nodes + paths)
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const xc = w / 2;
  const xo = w / NUM.NINE; // horizontal offset
  const ys = h / NUM.NINE; // vertical step
  const nodes = [
    [xc, ys * 0.5],
    [xc + xo, ys * 1.5],
    [xc - xo, ys * 1.5],
    [xc - xo * 1.2, ys * 3],
    [xc + xo * 1.2, ys * 3],
    [xc, ys * 4.5],
    [xc - xo, ys * 6],
    [xc + xo, ys * 6],
    [xc, ys * 7.5],
    [xc, ys * 9],
  ];
  const paths = [
    [0,1],[0,2],[0,5],
    [1,2],[1,3],[1,5],[1,6],
    [2,4],[2,5],[2,7],
    [3,4],[3,5],
    [4,5],[4,6],
    [5,6],[5,7],[5,8],[5,9],
    [6,7],[6,8],
    [7,8],
    [8,9]
  ];
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  for (const [a, b] of paths) {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
  }
  ctx.fillStyle = nodeColor;
  for (const [x, y] of nodes) {
    circle(ctx, x, y, NUM.SEVEN);

    4) Double-helix lattice (two phase-shifted sinusoids)

  No animation, no external dependencies. All geometry uses
  numerology constants passed via NUM for gentle parameterization.
*/

function drawVesica(ctx, w, h, color, NUM) {
  // Using ELEVEN to size vesica grid.
  const r = w / NUM.ELEVEN;
  const step = r;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let y = -r; y <= h + r; y += step) {
    for (let x = -r; x <= w + r; x += step) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + r, y, r, 0, Math.PI * 2);


    4) Double-helix lattice (two phase-shifted sine strands)
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  // clear background with ND-safe calm color
    4) Double-helix lattice (two phase-shifted sine curves with 33 rungs)

  All geometry is parameterized by numerology constants to keep the scene
  symbolic yet calm. No animation or flashing elements.
*/

export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

function drawVesica(ctx, w, h, color, NUM) {
  // Vesica grid: three circles, constant THREE from numerology
  const r = Math.min(w, h) / NUM.THREE;
  const centers = [];
  for (let i = 0; i < NUM.THREE; i++) {
    centers.push([w / 2 - r + i * r, h / 2]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  centers.forEach(([cx]) => {
    ctx.beginPath();
    ctx.arc(cx, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  // Simplified positions for ten sephirot using three columns
  const pos = {
    1: [w / 2, h * 0.1],
    2: [w * 0.7, h * 0.2],
    3: [w * 0.3, h * 0.2],
    4: [w * 0.75, h * 0.4],
    5: [w * 0.25, h * 0.4],
    6: [w / 2, h * 0.5],
    7: [w * 0.8, h * 0.7],
    8: [w * 0.2, h * 0.7],
    9: [w / 2, h * 0.75],
    10: [w / 2, h * 0.9]
  };

  // 22 connecting paths (simplified Kircher tree)
  const paths = [
    [1, 2], [1, 3], [2, 3],
    [2, 4], [2, 5], [3, 4], [3, 5],
    [4, 5], [4, 6], [5, 6],
    [4, 7], [5, 8],
    [6, 7], [6, 8], [6, 9],
    [7, 8], [7, 9], [8, 9],
    [7, 10], [8, 10], [9, 10],
    [5, 9]
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1.5;
  paths.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(...pos[a]);
    ctx.lineTo(...pos[b]);



*/

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;

  ctx.save();


  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);

  drawFibonacciCurve(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers[3], NUM);
  ctx.restore();
}

function drawVesicaField(ctx, w, h, color, NUM) {
  /* ND-safe: static vesica grid using three circles; gentle lines */
  const r = Math.min(w, h) / NUM.THREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = -1; i <= 1; i++) {
    const cx = w / 2 + i * r / 2;
    ctx.beginPath();
    ctx.arc(cx, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawTreeOfLife(ctx, w, h, color, NUM) {
  /* ND-safe: static Tree-of-Life scaffold; high-contrast nodes */
  const nodes = [
    { x: 0.5, y: 0.05 },
    { x: 0.25, y: 0.15 },
    { x: 0.75, y: 0.15 },
    { x: 0.25, y: 0.35 },
    { x: 0.75, y: 0.35 },
    { x: 0.5, y: 0.45 },
    { x: 0.25, y: 0.65 },
    { x: 0.75, y: 0.65 },
    { x: 0.5, y: 0.75 },
    { x: 0.5, y: 0.92 }
  ];
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],
    [5,6],[5,7],[6,8],[7,8],[8,9],
    [1,2],[3,4],[6,7],[1,6],[2,7],[3,8],[4,8],
    [1,5],[2,5],[3,9],[4,9]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (const [a,b] of paths.slice(0, NUM.TWENTYTWO)) {
    const p = nodes[a];
    const q = nodes[b];
    ctx.beginPath();
    ctx.moveTo(p.x*w, p.y*h);
    ctx.lineTo(q.x*w, q.y*h);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  const radius = Math.max(4, h / NUM.ONEFORTYFOUR * NUM.SEVEN);
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x*w, n.y*h, radius, 0, Math.PI*2);

  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelixLattice(ctx, width, height, palette.layers.slice(3), NUM);
}

// --- Layer 1: Vesica field -------------------------------------------------
// ND-safe choice: gentle grid, no motion, subtle stroke.
function drawVesicaField(ctx, w, h, color, NUM) {
  const cols = NUM.THREE; // 3x3 grid
  const rows = NUM.THREE;
  const radius = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.THIRTYTHREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = (c + 0.5) * (w / cols);
      const cy = (r + 0.5) * (h / rows);
      ctx.beginPath();
      ctx.arc(cx - radius / 2, cy, radius, 0, Math.PI * 2);
      ctx.arc(cx + radius / 2, cy, radius, 0, Math.PI * 2);


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


function drawTree(ctx, w, h, color, NUM) {
  // Simplified Tree-of-Life positions scaled by width/height.
  const nodes = [
    { x: 0.5, y: 0.05 },
    { x: 0.3, y: 0.2 }, { x: 0.7, y: 0.2 },
    { x: 0.5, y: 0.35 },
    { x: 0.2, y: 0.5 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.5 },
    { x: 0.3, y: 0.7 }, { x: 0.7, y: 0.7 },
    { x: 0.5, y: 0.9 }
  ];
  // Connections approximating 22 paths.
  const edges = [
    [0,1],[0,2],[1,3],[2,3],[1,4],[2,6],[3,5],[4,5],[5,6],[4,7],[5,7],[5,8],[6,8],[7,9],[8,9],
    [1,2],[1,5],[2,5],[3,4],[3,6],[7,8],[0,3]
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  edges.forEach(([a,b]) => {
    const p1 = nodes[a];
    const p2 = nodes[b];
    ctx.beginPath();
    ctx.moveTo(p1.x * w, p1.y * h);
    ctx.lineTo(p2.x * w, p2.y * h);
    ctx.stroke();
  });
  const r = w / NUM.NINETYNINE; // small node radius
  ctx.fillStyle = color;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);

// --- Layer 2: Tree-of-Life scaffold ---------------------------------------
// ND-safe: static nodes, readable contrast.
function drawTreeOfLife(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  const nodes = [
    { x: 0.5, y: 0.05 },
    { x: 0.25, y: 0.2 },
    { x: 0.75, y: 0.2 },
    { x: 0.25, y: 0.4 },
    { x: 0.75, y: 0.4 },
    { x: 0.5, y: 0.5 },
    { x: 0.25, y: 0.7 },
    { x: 0.75, y: 0.7 },
    { x: 0.5, y: 0.8 },
    { x: 0.5, y: 0.95 }
  ];
  const edges = [
    [0,1],[0,2],[0,5],
    [1,2],[1,5],[1,3],
    [2,4],[2,5],
    [3,4],[3,5],[3,6],
    [4,5],[4,7],
    [5,6],[5,7],[5,8],
    [6,7],[6,8],[6,9],
    [7,8],[7,9],
    [8,9]
  ];
  ctx.lineWidth = 2;
  for (const [a,b] of edges) {
    const na = nodes[a];
    const nb = nodes[b];
    ctx.beginPath();
    ctx.moveTo(na.x * w, na.y * h);
    ctx.lineTo(nb.x * w, nb.y * h);
    ctx.stroke();
  }
  const r = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.SEVEN;
  for (const n of nodes) {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);


    ctx.fill();
  }
}


function drawFibonacciCurve(ctx, w, h, color, NUM) {
  /* ND-safe: static Fibonacci spiral; smooth polyline */
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = { x: w / 2, y: h / 2 };
  const a = Math.min(w, h) / NUM.ELEVEN;
  const steps = NUM.NINETYNINE;


// Draw layer 3: Fibonacci polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const cx = w / NUM.THREE;
  const cy = h - h / NUM.THREE;
  let r = NUM.NINE;
  let ang = 0;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  for (let i = 0; i < NUM.ELEVEN; i++) {
    ang += Math.PI / 2;
    r *= phi;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    ctx.lineTo(x, y);

// --- Layer 3: Fibonacci curve ---------------------------------------------
// ND-safe: fixed polyline, no animation.
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.TWENTYTWO;
  const center = { x: w / 2, y: h / 2 };
  const scale = Math.min(w, h) / NUM.NINETYNINE;
  const pts = [];
  let theta = 0;
  for (let i = 0; i < steps; i++) {
    const r = scale * Math.pow(phi, theta / (Math.PI / NUM.NINE));
    const x = center.x + r * Math.cos(theta);
    const y = center.y + r * Math.sin(theta);
    pts.push({ x, y });
    theta += Math.PI / NUM.ELEVEN;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (const p of pts.slice(1)) ctx.lineTo(p.x, p.y);
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice ----------------------------------------
// ND-safe: static sine strands with cross-links, soft tones.
function drawHelixLattice(ctx, w, h, colors, NUM) {
  const mid = h / 2;
  const amp = h / NUM.THREE;
  const freq = (2 * Math.PI / w) * NUM.NINE; // nine waves
  ctx.lineWidth = 1.5;
  const strands = [0, Math.PI];
  strands.forEach((phase, i) => {
    ctx.strokeStyle = colors[i];
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = mid + amp * Math.sin(freq * x + phase);
      if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  });
  ctx.strokeStyle = colors[2] || colors[0];
  const rungs = NUM.THIRTYTHREE;
  for (let i = 0; i <= rungs; i++) {
    const x = (w / rungs) * i;
    const y1 = mid + amp * Math.sin(freq * x);
    const y2 = mid + amp * Math.sin(freq * x + Math.PI);

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// --- Layer 1: Vesica field ---
function drawVesica(ctx, w, h, color, NUM) {
  const r = w / NUM.THREE; // large radius honoring triadic balance
  const cx1 = w / 2 - r / 2;
  const cx2 = w / 2 + r / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(cx1, cy, r, 0, Math.PI * 2);
  ctx.arc(cx2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

// --- Layer 2: Tree-of-Life scaffold ---
function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  // simplified coordinates scaled to canvas
  const nodes = [
    [0.5, 0.1], // Keter
    [0.33, 0.2], // Chokmah
    [0.66, 0.2], // Binah
    [0.25, 0.4], // Chesed
    [0.75, 0.4], // Gevurah
    [0.5, 0.5], // Tiphereth
    [0.33, 0.7], // Netzach
    [0.66, 0.7], // Hod
    [0.5, 0.8], // Yesod
    [0.5, 0.9]  // Malkuth
  ].map(([x, y]) => [x * w, y * h]);

  const edges = [
    [0,1],[0,2], // top triad
    [1,3],[2,4],[3,5],[4,5], // upper connections
    [3,6],[4,7],[5,6],[5,7], // middle
    [6,8],[7,8],[8,9],       // lower
    [1,2],[3,4],[6,7]       // horizontals
  ];
  // Ensure 22 paths using numerology constant
  if (edges.length !== NUM.TWENTYTWO) {
    console.warn("Tree-of-Life edges expected to be 22");
  }

  ctx.strokeStyle = pathColor;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);


// Layer 1 — Vesica grid: calm intersecting circles forming a field
function drawVesica(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.3; // ND-safe subtlety
  const r = Math.min(w, h) / NUM.THREE;
  for (let i = -1; i <= 1; i++) {
    ctx.beginPath();
    ctx.arc(w / 2 + i * r, h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let j = -1; j <= 1; j++) {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + j * r, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

// Layer 2 — Tree of Life: 10 nodes + 22 paths
function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  ctx.save();
  const nodes = [
    { x: 0.5, y: 0.05 }, // Keter
    { x: 0.25, y: 0.2 }, // Binah
    { x: 0.75, y: 0.2 }, // Chokmah
    { x: 0.25, y: 0.4 }, // Chesed
    { x: 0.75, y: 0.4 }, // Gevurah
    { x: 0.5, y: 0.5 }, // Tiferet
    { x: 0.25, y: 0.7 }, // Netzach
    { x: 0.75, y: 0.7 }, // Hod
    { x: 0.5, y: 0.8 }, // Yesod
    { x: 0.5, y: 0.95 } // Malkuth
  ];

  const edges = [
    [0,1],[0,2],[1,2],[1,3],[1,4],[2,3],[2,4],[3,5],[4,5],[3,6],
    [4,7],[5,6],[5,7],[6,8],[7,8],[8,9],[2,5],[1,5],[3,7],[4,6],
    [0,5],[5,9]
  ]; // 22 paths

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  edges.forEach(([a, b]) => {
    const A = nodes[a];
    const B = nodes[b];
    ctx.beginPath();
    ctx.moveTo(A.x * w, A.y * h);
    ctx.lineTo(B.x * w, B.y * h);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;

  nodes.forEach(function(n){
    ctx.beginPath();
    ctx.arc(n.x, n.y, NUM.THREE, 0, Math.PI * 2); // node radius 3


  const r = h / 100;
  Object.values(pos).forEach(([x, y]) => {

  const r = w / NUM.NINETYNINE;
  nodes.forEach(([x,y]) => {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);

    ctx.fill();
  });
}


// L3 Fibonacci curve: static log spiral, gentle yellow path
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.THIRTYTHREE; // 33 segments
  const center = { x: w * 0.25, y: h * 0.75 };
  const scale = Math.min(w, h) / NUM.ONEFORTYFOUR * NUM.NINE; // base size



function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.NINETYNINE; // spiral detail
  const a = Math.min(w, h) / NUM.THIRTYTHREE;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {

    const angle = i / steps * NUM.NINE * Math.PI / 2;
    const r = a * Math.pow(phi, angle / (Math.PI / 2));
    const x = center.x + r * Math.cos(angle);
    const y = center.y + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);


    const theta = i * (Math.PI / NUM.ELEVEN); // gentle sweep
    const radius = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = center.x + radius * Math.cos(theta);
    const y = center.y + radius * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);

    const t = i / steps * NUM.NINE * Math.PI / 2;
    const r = a * Math.pow(PHI, t / (Math.PI / 2));
    const x = w / 2 + r * Math.cos(t);
    const y = h / 2 + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);





  }
  ctx.stroke();
}


// Double-helix lattice made of two sine waves and vertical connectors.
function drawHelix(ctx, w, h, color, NUM) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  const mid = h / 2;
  const amp = h / NUM.NINE;
  const waves = NUM.SEVEN;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const t = (x / w) * Math.PI * waves;
    const y = mid + Math.sin(t) * amp;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const t = (x / w) * Math.PI * waves;
    const y = mid - Math.sin(t) * amp;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  for (let i = 0; i <= NUM.THIRTYTHREE; i++) {
    const x = (w / NUM.THIRTYTHREE) * i;
    ctx.beginPath();
    ctx.moveTo(x, mid - amp);
    ctx.lineTo(x, mid + amp);

    ctx.stroke();
  }
}

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);


function drawHelixLattice(ctx, w, h, color, NUM) {
  /* ND-safe: static double helix lattice; no animation */
  const segments = NUM.THIRTYTHREE;
  const amp = h / NUM.THREE;
  const mid = h / 2;
  const step = w / segments;
  const phase = Math.PI;
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= segments; i++) {
    const x = i * step;
    const angle = i / segments * NUM.SEVEN * Math.PI * 2 / NUM.NINE;
    const yA = mid + amp * Math.sin(angle);
    const yB = mid + amp * Math.sin(angle + phase);
    pointsA.push({x, y:yA});
    pointsB.push({x, y:yB});
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  drawPolyline(ctx, pointsA);
  drawPolyline(ctx, pointsB);
  ctx.lineWidth = 1;
  for (let i = 0; i <= segments; i += NUM.SEVEN) {
    const p = pointsA[i];
    const q = pointsB[i];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);


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


// Draw layer 4: Double-helix lattice
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const segs = NUM.TWENTYTWO;
  const amp = h / NUM.NINE;
  const yMid = h / 2;
  const pointsA = [];
  const pointsB = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const x = t * w;
    const yA = yMid + Math.sin(t * Math.PI * NUM.THREE) * amp;
    const yB = yMid + Math.sin(t * Math.PI * NUM.THREE + Math.PI) * amp;
    pointsA.push([x, yA]);
    pointsB.push([x, yB]);
  }
  ctx.lineWidth = 1.5;
  // helix A
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  pointsA.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  // helix B
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  pointsB.forEach(([x,y],i)=>{ if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.stroke();
  // lattice bars
  ctx.strokeStyle = colorA;
  for (let i = 0; i <= segs; i++) {
    const [x1,y1] = pointsA[i];
    const [x2,y2] = pointsB[i];
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);

function drawHelix(ctx, w, h, color, NUM) {
  const segments = NUM.TWENTYTWO;
  const amp = h / NUM.SEVEN;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * w;
    const y = h / 2 + Math.sin(t * NUM.THIRTYTHREE) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = t * w;
    const y = h / 2 + Math.cos(t * NUM.THIRTYTHREE) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

export function renderHelix(ctx, opts) {
  const { width:w, height:h, palette, NUM } = opts;
  // Clear with background color for high contrast.
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, w, h);
  // Layer order ensures depth without motion.
  drawVesica(ctx, w, h, palette.layers[0], NUM);
  drawTree(ctx, w, h, palette.layers[1], NUM);
  drawFibonacci(ctx, w, h, palette.layers[2], NUM);
  drawHelix(ctx, w, h, palette.layers[3], NUM);
  // Final overlay for text/readability contrast.
  ctx.fillStyle = palette.ink;
}

function drawFibonacci(ctx, w, h, color, NUM) {
  // Static logarithmic spiral built from golden ratio
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const center = [w / 2, h / 2];
  const pts = [];
  let r = h / NUM.THIRTYTHREE;
  let angle = 0;
  while (r < Math.min(w, h) / 2) {
    const x = center[0] + r * Math.cos(angle);
    const y = center[1] + r * Math.sin(angle);
    pts.push([x, y]);
    angle += Math.PI / NUM.THREE; // quarter turn per step
    r *= phi;
  }
  drawPolyline(ctx, pts);
}

function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  // Double-helix lattice: two sine strands with crossbars
  const amp = w / NUM.TWENTYTWO;
  const steps = NUM.NINETYNINE;
  const stepY = h / steps;
  const left = w * 0.33;
  const right = w * 0.66;
  const ptsA = [];
  const ptsB = [];
  for (let i = 0; i <= steps; i++) {
    const y = i * stepY;
    const t = (i / steps) * Math.PI * NUM.THREE;
    ptsA.push([left + Math.sin(t) * amp, y]);
    ptsB.push([right + Math.sin(t + Math.PI) * amp, y]);
  }
  ctx.strokeStyle = colorA;
  ctx.lineWidth = 1;
  drawPolyline(ctx, ptsA);
  ctx.strokeStyle = colorB;
  drawPolyline(ctx, ptsB);

  // crossbars every ELEVEN steps for lattice feel
  ctx.strokeStyle = colorB;
  for (let i = 0; i < steps; i += NUM.ELEVEN) {
    ctx.beginPath();
    ctx.moveTo(ptsA[i][0], ptsA[i][1]);
    ctx.lineTo(ptsB[i][0], ptsB[i][1]);



    ctx.stroke();
  }
}



function drawPolyline(ctx, pts) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();
}


// Exported orchestrator

export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}


  // Layer order: Vesica -> Tree -> Fibonacci -> Helix
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// ND-safe notes: all routines are static, parameterized, and free of time-based motion.

function drawPolyline(ctx, pts) {
  ctx.beginPath();
  pts.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// --- Layer 3: Fibonacci curve ---
function drawFibonacci(ctx, w, h, color, NUM) {
  const centerX = w * 0.6; // placed off-center for depth
  const centerY = h * 0.6;
  const points = [];
  const a = w / NUM.ONEFORTYFOUR; // seed size
  const b = 0.306349; // log(phi)/(pi/2) constant for golden spiral
  const segments = NUM.THIRTYTHREE; // polyline points
  for (let i = 0; i <= segments; i++) {
    const theta = i / NUM.SEVEN * Math.PI * 2; // step angle with sevenfold harmony
    const r = a * Math.exp(b * theta);
    points.push([centerX + r * Math.cos(theta), centerY + r * Math.sin(theta)]);
  }
  ctx.strokeStyle = color;
  ctx.beginPath();
  points.forEach(([x,y], idx) => {
    if (idx === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

// --- Layer 4: Double-helix lattice ---
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amplitude = h / NUM.NINE; // gentle wave
  const segments = NUM.NINETYNINE; // resolution of lattice
  const step = w / segments;
  const phase = Math.PI; // second helix phase shift

  const path = (offset, color) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const x = i * step;
      const y = h/2 + amplitude * Math.sin((i / NUM.THREE) * Math.PI * 2 + offset);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  path(0, colorA);
  path(phase, colorB);

  // lattice crossbars every eleventh segment for stability
  ctx.strokeStyle = colorB;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const x = i * step;
    const y1 = h/2 + amplitude * Math.sin((i / NUM.THREE) * Math.PI * 2);
    const y2 = h/2 + amplitude * Math.sin((i / NUM.THREE) * Math.PI * 2 + phase);

=======
  const r = NUM.NINE / 2; // small node size
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x * w, n.y * h, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// Layer 3 — Fibonacci spiral: static golden spiral polyline
function drawFibonacci(ctx, w, h, color, NUM) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = NUM.THREE; // three quarter-turns
  const steps = NUM.NINETYNINE;
  const scale = Math.min(w, h) / NUM.ELEVEN;
  const cx = w * 0.2;
  const cy = h * 0.8;
  ctx.beginPath();
  for (let i = 0; i <= steps * turns; i++) {
    const theta = (i / steps) * turns * (Math.PI / 2);
    const r = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + r * Math.cos(theta);
    const y = cy - r * Math.sin(theta);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

// Layer 4 — Double helix lattice: two sine curves + 33 rungs
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  ctx.save();
  const points = NUM.ONEFORTYFOUR; // smoothness
  const amp = h / 4;
  const mid = h / 2;

  // first strand
  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * NUM.THREE;
    const x = (i / points) * w;
    const y = mid + Math.sin(t) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // second strand phase-shifted by π
  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const t = (i / points) * Math.PI * NUM.THREE + Math.PI;
    const x = (i / points) * w;
    const y = mid + Math.sin(t) * amp;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // lattice rungs
  ctx.strokeStyle = colorA;
  for (let j = 0; j <= NUM.THIRTYTHREE; j++) {
    const t = (j / NUM.THIRTYTHREE) * Math.PI * NUM.THREE;
    const x = (j / NUM.THIRTYTHREE) * w;
    const y1 = mid + Math.sin(t) * amp;
    const y2 = mid + Math.sin(t + Math.PI) * amp;
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}






  ctx.restore();
}
