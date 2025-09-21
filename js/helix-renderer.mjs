/*
  helix-renderer.mjs
  ND-safe static renderer for layered sacred geometry.

  Layers are rendered back-to-front without motion:
    1) Vesica field - intersecting circle grid
    2) Tree-of-Life scaffold - ten sephirot nodes with twenty-two paths
    3) Fibonacci curve - static logarithmic spiral polyline
    4) Double-helix lattice - two phase-shifted strands with crossbars

  Numerology constants (3, 7, 9, 11, 22, 33, 99, 144) guide proportions.
  Every routine is pure and receives the drawing context plus explicit data.
*/

export function renderHelix(ctx, { width, height, palette, NUM, notices = [] }) {
  // ND-safe background: calm tone, no flashing or gradients
  ctx.save();
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, width, height);

  // Draw layered geometry back-to-front to preserve depth without animation
  drawVesica(ctx, width, height, palette.layers[0], NUM);
  drawTreeOfLife(ctx, width, height, palette.layers[1], palette.layers[2], NUM);
  drawFibonacci(ctx, width, height, palette.layers[3], NUM);
  drawHelix(ctx, width, height, palette.layers[4], palette.layers[5], NUM);
  drawNotices(ctx, width, height, palette.ink, notices);
  ctx.restore();
}

// --- Layer 1: Vesica field -------------------------------------------------
function drawVesica(ctx, w, h, color, NUM) {
  /*
    Intersecting circle grid referencing 9 columns and 7 rows.
    Total circles (9 * 7 * 2 = 126) stay below the 144 threshold for sensory ease.
  */
  const cols = NUM.NINE;
  const rows = NUM.SEVEN;
  const stepX = w / cols;
  const stepY = h / (rows + 2); // vertical margin keeps composition breathable
  const radius = Math.min(stepX, stepY) / 2;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = (col + 0.5) * stepX;
      const cy = (row + 1) * stepY;
      circlePath(ctx, cx - radius * 0.5, cy, radius);
      ctx.stroke();
      circlePath(ctx, cx + radius * 0.5, cy, radius);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// --- Layer 2: Tree-of-Life scaffold ----------------------------------------
function drawTreeOfLife(ctx, w, h, pathColor, nodeColor, NUM) {
  /*
    Ten sephirot nodes (Tree of Life) and twenty-two connecting paths.
    Positions are normalized to keep structure centered and balanced.
  */
  const nodesNorm = [
    [0.50, 0.08], // Keter
    [0.32, 0.20], // Chokhmah
    [0.68, 0.20], // Binah
    [0.32, 0.38], // Chesed
    [0.68, 0.38], // Gevurah
    [0.50, 0.48], // Tipheret
    [0.32, 0.64], // Netzach
    [0.68, 0.64], // Hod
    [0.50, 0.78], // Yesod
    [0.50, 0.92]  // Malkuth
  ];
  const nodes = nodesNorm.map(([nx, ny]) => [nx * w, ny * h]);

  const paths = [
    [0, 1], [0, 2], [1, 2], [1, 3], [1, 5], [2, 4], [2, 5],
    [3, 4], [3, 5], [4, 5], [3, 6], [4, 7], [5, 6], [5, 7],
    [6, 7], [6, 8], [7, 8], [5, 8], [6, 9], [7, 9], [8, 9], [5, 9]
  ]; // 22 paths

  ctx.save();
  ctx.strokeStyle = pathColor;
  ctx.lineWidth = 2;
  paths.forEach(([a, b]) => {
    const [ax, ay] = nodes[a];
    const [bx, by] = nodes[b];
    strokeLine(ctx, ax, ay, bx, by);
  });

  // Sephirot rendered as filled circles; radius uses numerology constant 33
  ctx.fillStyle = nodeColor;
  const radius = Math.min(w, h) / NUM.THIRTYTHREE;
  nodes.forEach(([x, y]) => {
    circlePath(ctx, x, y, radius);
    ctx.fill();
  });
  ctx.restore();
}

// --- Layer 3: Fibonacci curve ----------------------------------------------
function drawFibonacci(ctx, w, h, color, NUM) {
  /*
    Static logarithmic spiral approximated with NUM.NINETYNINE segments.
    Center offset toward the lower left to weave between Vesica and Helix layers.
  */
  const phi = (1 + Math.sqrt(5)) / 2;
  const quarterTurns = NUM.THREE; // three quarter-turns for gentle sweep
  const steps = NUM.NINETYNINE;
  const scale = Math.min(w, h) / NUM.ELEVEN;
  const cx = w * 0.18;
  const cy = h * 0.82;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i <= steps * quarterTurns; i += 1) {
    const theta = (i / steps) * quarterTurns * (Math.PI / 2);
    const radius = scale * Math.pow(phi, theta / (Math.PI / 2));
    const x = cx + radius * Math.cos(theta);
    const y = cy - radius * Math.sin(theta);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// --- Layer 4: Double-helix lattice -----------------------------------------
function drawHelix(ctx, w, h, colorA, colorB, NUM) {
  /*
    Two static sine-based strands with crossbars every eleventh segment.
    Amplitude kept small for visual calm while preserving layered depth.
  */
  const segments = NUM.ONEFORTYFOUR;
  const amplitude = h / NUM.NINE;
  const midY = h / 2;
  const stepX = w / segments;

  ctx.save();
  const drawStrand = (phase, strokeColor) => {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * NUM.THREE + phase;
      const x = i * stepX;
      const y = midY + Math.sin(t) * amplitude;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  };

  drawStrand(0, colorA);
  drawStrand(Math.PI, colorB);

  ctx.strokeStyle = colorB;
  ctx.lineWidth = 1.5;
  for (let i = 0; i <= segments; i += NUM.ELEVEN) {
    const t = (i / segments) * Math.PI * NUM.THREE;
    const x = i * stepX;
    const y1 = midY + Math.sin(t) * amplitude;
    const y2 = midY - Math.sin(t) * amplitude;
    strokeLine(ctx, x, y1, x, y2);
  }
  ctx.restore();
}

// --- Helper routines -------------------------------------------------------
function circlePath(ctx, x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
}

function strokeLine(ctx, ax, ay, bx, by) {
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();
}

// --- Notices layer ----------------------------------------------------------
function drawNotices(ctx, w, h, textColor, notices) {
  /*
    Inline fallback notice panel keeps the user informed when data files are missing.
    Panel stays static and muted to honor the ND-safe brief.
  */
  if (!Array.isArray(notices) || notices.length === 0) {
    return;
  }

  const padding = 12;
  const maxWidth = w / 3;
  const lineHeight = 18;

  ctx.save();
  ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
  ctx.textBaseline = "top";

  let blockTop = padding;
  notices.forEach((notice) => {
    const lines = wrapNoticeLines(notice, maxWidth - padding * 2, ctx);
    const boxHeight = lines.length * lineHeight + padding;

    // ND-safe: muted panel reinforces calm fallback messaging without flashing.
    ctx.fillStyle = "rgba(17, 17, 26, 0.78)";
    ctx.fillRect(padding, blockTop, maxWidth, boxHeight);

    ctx.strokeStyle = "rgba(232, 232, 240, 0.35)";
    ctx.strokeRect(padding, blockTop, maxWidth, boxHeight);

    ctx.fillStyle = textColor;
    lines.forEach((line, index) => {
      ctx.fillText(line, padding * 1.5, blockTop + padding / 2 + index * lineHeight);
    });

    blockTop += boxHeight + padding;
  });

  ctx.restore();
}

function wrapNoticeLines(text, maxLineWidth, ctx) {
  const safeText = String(text);
  const words = safeText.split(" ");
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const tentative = current ? current + " " + word : word;
    if (ctx.measureText(tentative).width > maxLineWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = tentative;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines;
}
