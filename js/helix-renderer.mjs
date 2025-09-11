/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers:
    1) Vesica field (intersecting circles)
    2) Tree-of-Life scaffold (10 sephirot + 22 paths; simplified layout)
    3) Fibonacci curve (log spiral polyline; static)
    4) Double-helix lattice (two phase-shifted sine waves with crossbars)

  Each layer uses palette.layers[n]; geometry uses numerology constants.
*/

// Pure function: draws all layers on provided context
export function renderHelix(ctx, opts = {}) {
  const { width, height, palette, NUM } = opts;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTree(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
}

// Layer 1: Vesica field — calm intersecting circles
function drawVesica(ctx, w, h, color, NUM) {
  const r = Math.min(w, h) / NUM.THREE;
  const cx = w / 2;
  const cy = h / 2;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  // draw three overlapping circles for basic vesica shape
  [ -1, 0, 1 ].forEach(i => {
    ctx.beginPath();
    ctx.arc(cx + i * r / NUM.THREE, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Layer 2: Tree-of-Life scaffold
function drawTree(ctx, w, h, pathColor, nodeColor, NUM) {
  // simplified proportional layout for 10 sephirot
  const nodes = [
    [0.5, 0.05], // Keter
    [0.75, 0.15], [0.25, 0.15], // Chokmah, Binah
    [0.75, 0.3], [0.25, 0.3],  // Chesed, Gevurah
    [0.5, 0.4],               // Tiferet
    [0.75, 0.55], [0.25, 0.55], // Netzach, Hod
    [0.5, 0.7],                // Yesod
    [0.5, 0.85]                // Malkuth
  ].map(([x,y]) => [x*w, y*h]);

  // 22 paths (simplified)
  const paths = [
    [0,1],[0,2], [1,3],[2,4], [3,5],[4,5], [3,6],[4,7], [6,8],[7,8], [8,9],
    [1,4],[2,3], [1,5],[2,5], [3,7],[4,6], [1,6],[2,6], [6,9],[7,9], [5,9]
  ];

  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 1;
  paths.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(...nodes[a]);
    ctx.lineTo(...nodes[b]);
    ctx.stroke();
  });

  ctx.fillStyle = nodeColor;
  nodes.forEach(([x,y]) => {
    ctx.beginPath();
    ctx.arc(x, y, h / NUM.NINETYNINE * NUM.SEVEN, 0, Math.PI*2);
    ctx.fill();
  });
}

// Layer 3: Fibonacci curve — static log spiral
function drawFibonacci(ctx, w, h, color, NUM) {
  const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
  const turns = NUM.SEVEN; // gentle spiral
  const step = Math.PI / NUM.TWENTYTWO;
  const maxR = Math.min(w, h) / 2;
  const pts = [];
  for (let t = 0; t < turns * Math.PI * 2; t += step) {
    const r = Math.pow(phi, t / Math.PI) * maxR / Math.pow(phi, turns * 2);
    pts.push([w/2 + r * Math.cos(t), h/2 + r * Math.sin(t)]);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  pts.forEach(([x,y], i) => {
    if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
}

// Layer 4: Double-helix lattice — two sine waves with crossbars
function drawHelix(ctx, w, h, lineColor, barColor, NUM) {
  const amp = h / NUM.NINE;
  const freq = NUM.THREE;
  const bars = NUM.THIRTYTHREE;
  const step = w / bars;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x <= w; x += 2) {
    const y1 = h/2 + amp * Math.sin((x / w) * freq * Math.PI * 2);
    if (x === 0) {
      ctx.moveTo(x, y1);
    } else {
      ctx.lineTo(x, y1);
    }
  }
  ctx.stroke();

  ctx.beginPath();
  for (let x = 0; x <= w; x += 2) {
    const y2 = h/2 + amp * Math.sin((x / w) * freq * Math.PI * 2 + Math.PI);
    if (x === 0) {
      ctx.moveTo(x, y2);
    } else {
      ctx.lineTo(x, y2);
    }
  }
  ctx.stroke();

  // crossbars
  ctx.strokeStyle = barColor;
  for (let i = 0; i <= bars; i++) {
    const x = i * step;
    const y1 = h/2 + amp * Math.sin((x / w) * freq * Math.PI * 2);
    const y2 = h/2 + amp * Math.sin((x / w) * freq * Math.PI * 2 + Math.PI);
    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }
}
