/*
  first-paint-octagram.js
  Renders a static octagram field as a first-paint fallback when hero art is unavailable.
  ND-safe: no motion, soft gradient, clear geometry for grounding without overstimulation.
*/

export function paintOctagram(id = "opus", width = 1200, height = 675) {
  const canvas = document.getElementById(id);
  if (!canvas) {
    return false;
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return false;
  }

  // Gentle radial gradient evokes chapel lighting without flashing.
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    40,
    width / 2,
    height / 2,
    Math.hypot(width, height) / 2
  );
  const palette = ["#0F0B1E", "#1d1d20", "#3b2e5a", "#bfa66b", "#dfe8ff"];
  palette.forEach((color, index) => {
    gradient.addColorStop(index / (palette.length - 1), color);
  });

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Octagram lines remain static to respect the no-animation covenant.
  ctx.globalAlpha = 0.25;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#dfe8ff";
  const radius = Math.min(width, height) * 0.32;
  const cx = width / 2;
  const cy = height / 2;
  for (let k = 0; k < 8; k += 1) {
    const angle = (Math.PI / 4) * k;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.stroke();
  }
  return true;
}
