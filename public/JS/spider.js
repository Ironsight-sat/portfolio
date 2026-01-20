/* ================================
   Spider Cursor Background Effect
   Adapted for Portfolio Project
   ================================ */

const canvas = document.getElementById("spider-canvas");
const ctx = canvas.getContext("2d");

const { sin, cos, PI, hypot, min, max } = Math;

let w, h;

/* ---------- Helpers ---------- */

function rnd(x = 1, dx = 0) {
  return Math.random() * x + dx;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function many(n, fn) {
  return [...Array(n)].map((_, i) => fn(i));
}

function pt(x, y) {
  return { x, y };
}

function noise(x, y, t = 101) {
  return (
    sin(0.3 * x + 1.4 * t + 2.0 + 2.5 * sin(0.4 * y - 1.3 * t)) +
    sin(0.2 * y + 1.5 * t + 2.8 + 2.3 * sin(0.5 * x - 1.2 * t))
  );
}

function drawCircle(x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, PI * 2);
  ctx.fill();
}

function drawLine(x0, y0, x1, y1) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);

  many(80, (i) => {
    i = (i + 1) / 80;
    let x = lerp(x0, x1, i);
    let y = lerp(y0, y1, i);
    let k = noise(x / 5 + x0, y / 5 + y0) * 2;
    ctx.lineTo(x + k, y + k);
  });

  ctx.stroke();
}

/* ---------- Spider Logic ---------- */

function spawnSpider() {
  const points = many(280, () => ({
    x: rnd(innerWidth),
    y: rnd(innerHeight),
    len: 0,
    r: 0,
  }));

  const legs = many(8, (i) => ({
    x: cos((i / 8) * PI * 2),
    y: sin((i / 8) * PI * 2),
  }));

  let seed = rnd(1000);
  let tx = innerWidth / 2;
  let ty = innerHeight / 2;
  let x = tx;
  let y = ty;

  let kx = rnd(0.3, 0.7);
  let ky = rnd(0.3, 0.7);
  let walkRadius = pt(rnd(60, 80), rnd(60, 80));
  let radius = innerWidth / rnd(120, 160);

  function drawPoint(p) {
    legs.forEach((l) => {
      if (!p.len) return;
      drawLine(
        lerp(x + l.x * radius, p.x, p.len * p.len),
        lerp(y + l.y * radius, p.y, p.len * p.len),
        x + l.x * radius,
        y + l.y * radius
      );
    });

    drawCircle(p.x, p.y, p.r);
  }

  return {
    follow(mx, my) {
      tx = mx;
      ty = my;
    },

    tick(t) {
      const selfX = cos(t * kx + seed) * walkRadius.x;
      const selfY = sin(t * ky + seed) * walkRadius.y;

      let fx = tx + selfX;
      let fy = ty + selfY;

      x += min(innerWidth / 120, (fx - x) / 10);
      y += min(innerWidth / 120, (fy - y) / 10);

      let count = 0;

      points.forEach((p) => {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = hypot(dx, dy);

        let r = min(2, innerWidth / dist / 6);
        let active = dist < innerWidth / 8 && count++ < 7;
        let dir = active ? 0.12 : -0.08;

        if (active) r *= 1.6;

        p.r = r;
        p.len = max(0, min(p.len + dir, 1));

        drawPoint(p);
      });
    },
  };
}

/* ---------- Init ---------- */

const spiders = many(1, spawnSpider); // keep ONE for elegance

addEventListener("pointermove", (e) => {
  spiders.forEach((s) => s.follow(e.clientX, e.clientY));
});

/* ---------- Animation Loop ---------- */

requestAnimationFrame(function animate(t) {
  if (canvas.width !== innerWidth) canvas.width = innerWidth;
  if (canvas.height !== innerHeight) canvas.height = innerHeight;

  // Match your terminal dark theme
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = ctx.strokeStyle = "#38bdf8";

  t /= 1000;
  spiders.forEach((s) => s.tick(t));

  requestAnimationFrame(animate);
});
