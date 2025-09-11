/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sinusoids)
*/
export function renderHelix(ctx, { width, height, palette, NUM }) {
  ctx.save();
  ctx.fillStyle = palette.bg; // calm background
  ctx.fillRect(0, 0, width, height);

  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);

  ctx.restore();
}

/* Vesica: two circles create a lens shape, calming balance */
function drawVesica(ctx, w, h, color, NUM) {
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

/* Tree-of-Life: nodes and paths, drawn top to bottom */
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  const nodes = [
    [0.5, 0.05], [0.25, 0.2], [0.75, 0.2], [0.25, 0.45], [0.75, 0.45],
    [0.5, 0.6], [0.25, 0.75], [0.75, 0.75], [0.5, 0.9], [0.5, 0.98]
  ].map(([x, y]) => [x * w, y * h]);

  const paths = [
    [0,1],[0,2],[1,2],[1,3],[1,5],[2,4],[2,5],[3,4],[3,5],[3,6],
    [4,5],[4,7],[5,6],[5,7],[5,8],[6,7],[6,8],[7,8],[6,9],[7,9],[8,9],[5,9]
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  paths.forEach(([a,b])=>{
    ctx.beginPath();
    ctx.moveTo(nodes[a][0], nodes[a][1]);
    ctx.lineTo(nodes[b][0], nodes[b][1]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  const r = Math.min(w,h) / NUM.TWENTYTWO;
  nodes.forEach(([x,y])=>{
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
}

/* Fibonacci spiral: static log spiral using golden ratio */
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2;
  const cx = w * 0.75;
  const cy = h * 0.75;
  const scale = Math.min(w, h) / NUM.THIRTYTHREE;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let t = 0; t <= NUM.NINE; t += 1 / NUM.TWENTYTWO) {
    const r = scale * Math.pow(phi, t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/* Double-helix lattice: two phase-shifted waves, linked by crossbars */
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  const amp = h / NUM.SEVEN;
  const freq = NUM.THREE;
  const step = w / NUM.NINETYNINE; // many points for smoothness without animation
  const a = [];
  const b = [];
  for (let x = 0; x <= w; x += step) {
    const t = (x / w) * freq * Math.PI * 2;
    a.push([x, h / 2 + Math.sin(t) * amp]);
    b.push([x, h / 2 + Math.sin(t + Math.PI) * amp]);
  }

  const trace = (pts, color)=>{
    ctx.strokeStyle = color;
    ctx.beginPath();
    pts.forEach(([x,y],i)=>{ if(i) ctx.lineTo(x,y); else ctx.moveTo(x,y); });
    ctx.stroke();
  };

  trace(a, colorA);
  trace(b, colorB);

  ctx.strokeStyle = colorA; // crossbars unify the two strands
  for (let i = 0; i < a.length; i += NUM.ELEVEN) {
    ctx.beginPath();
    ctx.moveTo(a[i][0], a[i][1]);
    ctx.lineTo(b[i][0], b[i][1]);
    ctx.stroke();
  }
}
