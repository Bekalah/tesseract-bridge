/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
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
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = h / 100;
  Object.values(pos).forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
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
  pts.forEach(([x, y], i) => {
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
