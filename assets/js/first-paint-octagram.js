/*
  first-paint-octagram.js
  Draws a static octagram field as a first paint fallback when hero art is absent.
  ND-safe: static gradients only, no animation.
*/

export function paintOctagram(id = "opus", W = 1200, H = 675) {
  const c = document.getElementById(id);
  if (!c) {
    return;
  }
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");
  if (!x) {
    return;
  }

  const g = x.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, Math.hypot(W, H) / 2);
  const colors = ["#0F0B1E", "#1d1d20", "#3b2e5a", "#bfa66b", "#dfe8ff"];
  x.globalAlpha = 1;
  colors.forEach((col, i) => {
    g.addColorStop(i / (colors.length - 1), col);
  });
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);

  x.globalAlpha = 0.25;
  x.lineWidth = 2;
  x.strokeStyle = "#dfe8ff";
  const R = Math.min(W, H) * 0.32;
  const cx = W / 2;
  const cy = H / 2;
  for (let k = 0; k < 8; k += 1) {
    const a = (Math.PI / 4) * k;
    x.beginPath();
    x.moveTo(cx, cy);
    x.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    x.stroke();
  }
}
