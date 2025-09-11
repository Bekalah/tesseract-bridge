/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)

  No animation, no dependencies. All geometry uses ASCII quotes, UTF-8, LF newlines.
*/

export function renderHelix(ctx, opts) {
  const { width:w, height:h, palette, NUM } = opts;
  ctx.fillStyle = palette.bg; // calm background
  ctx.fillRect(0, 0, w, h);

  drawVesicaField(ctx, w, h, palette.layers[0], NUM);
  drawTreeOfLife(ctx, w, h, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, w, h, palette.layers[3], NUM);
  drawHelixLattice(ctx, w, h, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field
function drawVesicaField(ctx, w, h, color, NUM) {
  /* ND-safe: simple intersecting pair representing the Vesica Piscis. */
  const radius = Math.min(w, h) / NUM.THREE; // embeds numerology 3
  const centers = [
    { x: w/2 - radius/2, y: h/2 },
    { x: w/2 + radius/2, y: h/2 }
  ];
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  centers.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Layer 2: Tree-of-Life scaffold
function drawTreeOfLife(ctx, w, h, nodeColor, pathColor, NUM) {
  /* Ten sephirot nodes placed using simple fractions; twenty-two connecting paths. */
  const margin = h / NUM.NINE; // gentle spacing via 9
  const nodeRadius = 6;
  const nodes = [
    { x: w/2, y: margin },
    { x: w/2 - w/6, y: h/5 },
    { x: w/2 + w/6, y: h/5 },
    { x: w/2 - w/4, y: h/2.9 },
    { x: w/2, y: h/2.4 },
    { x: w/2 + w/4, y: h/2.9 },
    { x: w/2 - w/6, y: h/1.8 },
    { x: w/2 + w/6, y: h/1.8 },
    { x: w/2, y: h/1.4 },
    { x: w/2, y: h - margin }
  ];

  // Paths: minimal set referencing numerology constant 22
  const paths = [
    [0,1],[0,2],[1,3],[2,5],[3,4],[4,5],
    [3,6],[5,7],[6,7],[6,8],[7,8],[8,9],
    [1,4],[2,4],[1,6],[2,7],[3,8],[5,8],
    [4,9],[6,9],[7,9],[1,2]
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1.5;
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci log spiral (static polyline)
function drawFibonacci(ctx, w, h, color, NUM) {
  /* Static log spiral; 144 steps, growth tuned by 33 and 7. */
  const center = { x: w/2, y: h/2 };
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio constant
  const steps = NUM.ONEFORTYFOUR; // smooth curve via 144
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / NUM.THIRTYTHREE) * Math.PI * 2; // 33 controls rotation speed
    const r = 5 * Math.pow(phi, i / NUM.SEVEN); // 7 controls radial growth
    points.push({
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle)
    });
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, idx) => { if (idx === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  ctx.stroke();
}

// Layer 4: Double-helix lattice
function drawHelixLattice(ctx, w, h, colorA, colorB, NUM) {
  /* Two phase-shifted sine curves with connecting rungs; static lattice. */
  const amplitude = h / NUM.ELEVEN; // gentle height via 11
  const freq = NUM.THREE; // three full periods across width
  const step = w / NUM.NINETYNINE; // fine sampling using 99
  ctx.lineWidth = 1;

  const pathA = [], pathB = [];
  for (let x = 0; x <= w; x += step) {
    const t = (x / w) * freq * Math.PI * 2;
    pathA.push({ x, y: h/2 + amplitude * Math.sin(t) });
    pathB.push({ x, y: h/2 + amplitude * Math.sin(t + Math.PI) }); // phase shift
  }

  ctx.strokeStyle = colorA;
  ctx.beginPath();
  pathA.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  pathB.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  ctx.stroke();

  ctx.strokeStyle = colorA;
  for (let i = 0; i < pathA.length; i += NUM.THREE) {
    ctx.beginPath();
    ctx.moveTo(pathA[i].x, pathA[i].y);
    ctx.lineTo(pathB[i].x, pathB[i].y);
    ctx.stroke();
  }
}
