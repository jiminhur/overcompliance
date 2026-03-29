const stage = document.getElementById("stage");
const track = document.getElementById("track");
const textLayer = document.getElementById("textLayer");
const videoLayer = document.getElementById("videoLayer");
const percent = document.getElementById("percent");
const progress = document.getElementById("progress");
const screen = document.getElementById("screen");

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function update() {
  const max = stage.offsetHeight - window.innerHeight;
  const scroll = window.scrollY;

  const p = clamp(scroll / max, 0, 1);

  percent.innerText = String(Math.floor(p * 100)).padStart(3, "0") + "%";
  progress.style.width = p * 100 + "%";

  // video → text
  videoLayer.style.opacity = 1 - p * 2;
  textLayer.style.opacity = (p - 0.2) * 2;

  // vertical movement only
  const h = screen.offsetHeight;
  track.style.transform = `translateY(${-p * h * 3}px)`;
}

window.addEventListener("scroll", update);
window.addEventListener("load", update);

/* trace */
const words = ["SWIPE", "UNLOCK", "TRY AGAIN", "SELECT"];

window.addEventListener("mousemove", (e) => {
  const el = document.createElement("span");
  el.className = "trace";
  el.innerText = words[Math.floor(Math.random() * words.length)];

  el.style.left = e.clientX + "px";
  el.style.top = e.clientY + "px";

  document.body.appendChild(el);

  setTimeout(() => el.remove(), 800);
});