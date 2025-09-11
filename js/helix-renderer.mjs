/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves)
*/
export function renderHelix(ctx, { width, height, palette, NUM }) {
  // Base fill keeps contrast readable and motion-free
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Each helper renders one calm layer; functions are pure and parameterized.

function drawVesica(ctx, w, h, color, NUM) {
  // Vesica: two intersecting circles scaled by sacred THREE
  const r = Math.min(w, h) / NUM.THREE;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx - r / 2, cy, r, 0, Math.PI * 2);
  ctx.arc(cx + r / 2, cy, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawTree(ctx, w, h, nodeColor, pathColor, NUM) {
  // Tree of Life: 3 columns, 9 units high
  const offsetX = w / NUM.SEVEN;
  const offsetY = h / NUM.NINE;
  const nodes = [
    { x: w / 2, y: offsetY },
    { x: w / 2 + offsetX, y: offsetY * 2 },
    { x: w / 2 - offsetX, y: offsetY * 2 },
    { x: w / 2 + offsetX, y: offsetY * 4 },
    { x: w / 2 - offsetX, y: offsetY * 4 },
    { x: w / 2, y: offsetY * 5.5 },
    { x: w / 2 + offsetX, y: offsetY * 7 },
    { x: w / 2 - offsetX, y: offsetY * 7 },
    { x: w / 2, y: offsetY * 8.5 },
    { x: w / 2, y: offsetY * 10 }
  ];
  // 22 connecting paths (classic pattern, order optimized for clarity)
  const paths = [
    [0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[3,6],[4,7],[6,5],[7,5],
    [6,8],[7,8],[8,9],[1,4],[2,3],[1,6],[2,7],[3,7],[4,6],[0,5],[1,2],[5,8]
  ];
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });
  ctx.fillStyle = nodeColor;
  const rNode = Math.min(w, h) / NUM.ONEFORTYFOUR; // gentle node size
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, rNode, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawFibonacci(ctx, w, h, color, NUM) {
  // Log spiral using ELEVEN points; avoids motion while hinting growth
  const phi = (1 + Math.sqrt(5)) / 2;
  const steps = NUM.ELEVEN;
  const scale = Math.min(w, h) / NUM.THIRTYTHREE;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const angle = i * Math.PI / NUM.ELEVEN * 2;
    const r = scale * Math.pow(phi, i / NUM.SEVEN);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  // Double helix lattice: two sine waves phase-shifted 180°
  const amp = h / NUM.NINE;
  const steps = NUM.NINETYNINE;
  const freq = Math.PI * 2 / NUM.TWENTYTWO;
  ctx.lineWidth = 1;

  ctx.strokeStyle = colorA;
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const x = (i / (steps - 1)) * w;
    const y = h / 2 + amp * Math.sin(freq * i);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  ctx.strokeStyle = colorB;
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const x = (i / (steps - 1)) * w;
    const y = h / 2 + amp * Math.sin(freq * i + Math.PI);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}
