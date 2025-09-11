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
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], NUM);
  drawFibonacci(ctx, width, height, palette.layers[2], NUM);
  drawHelix(ctx, width, height, palette.layers[3], NUM);
}
