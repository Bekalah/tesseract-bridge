/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
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
