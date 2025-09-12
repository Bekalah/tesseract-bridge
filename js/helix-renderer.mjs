/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

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
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesicaField(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], NUM);
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
=======
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

    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;

  const r = h / 100;
  Object.values(pos).forEach(([x, y]) => {

  const r = w / NUM.NINETYNINE;
  nodes.forEach(([x,y]) => {

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);

    ctx.fill();
  });
}


function drawFibonacci(ctx, w, h, color, NUM) {
  const PHI = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.NINETYNINE; // spiral detail
  const a = Math.min(w, h) / NUM.THIRTYTHREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = i / steps * NUM.NINE * Math.PI / 2;
    const r = a * Math.pow(PHI, t / (Math.PI / 2));
    const x = w / 2 + r * Math.cos(t);
    const y = h / 2 + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);

  }
  ctx.stroke();
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
=======
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


// Exported orchestrator
export function renderHelix(ctx, opts) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  // Layer order: Vesica -> Tree -> Fibonacci -> Helix
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// ND-safe notes: all routines are static, parameterized, and free of time-based motion.
=======
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

    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}


