const stage = document.getElementById("stage");
const pageProgress = document.getElementById("pageProgress");
const progressText = document.getElementById("progressText");

const videoLayer = document.getElementById("videoLayer");
const textLayer = document.getElementById("textLayer");
const textTrack = document.getElementById("textTrack");
const screen = document.getElementById("screen");

const traceWords = [
  "SWIPE TO UNLOCK",
  "TRY AGAIN",
  "VERIFY",
  "SELECT",
  "POSITION",
  "FOLLOW",
  "ALIGN"
];

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScene() {
  const stageTop = stage.offsetTop;
  const stageRange = stage.offsetHeight - window.innerHeight;
  const scrollY = window.scrollY;

  const progress = clamp((scrollY - stageTop) / stageRange, 0, 1);

  // top page progress
  const fullProgress = clamp(
    scrollY / (document.body.scrollHeight - window.innerHeight),
    0,
    1
  );
  pageProgress.style.width = `${fullProgress * 100}%`;

  // screen progress text
  const percent = String(Math.round(progress * 100)).padStart(3, "0");
  progressText.textContent = `${percent}%`;

  // 1) video fades out
  // 2) text fades in
  const videoOpacity = clamp(1 - progress * 2.2, 0, 1);
  const textOpacity = clamp((progress - 0.18) * 2.2, 0, 1);

  videoLayer.style.opacity = videoOpacity;
  textLayer.style.opacity = textOpacity;

  // only vertical motion inside the screen
  const screenHeight = screen.offsetHeight;
  const totalPanels = 5;
  const totalMove = (totalPanels - 1) * screenHeight;

  const internalProgress = clamp((progress - 0.12) / 0.78, 0, 1);
  const translateY = -internalProgress * totalMove;

  textTrack.style.transform = `translateY(${translateY}px)`;

  // slight system-like depth only, no sideways rotation
  const scale = 1 + progress * 0.02;
  const tiltX = -1.2 - progress * 2.2;

  screen.style.transform = `scale(${scale}) rotateX(${tiltX}deg)`;
}

window.addEventListener("scroll", updateScene, { passive: true });
window.addEventListener("resize", updateScene);
window.addEventListener("load", updateScene);

// cursor trace
let traceThrottle = false;

window.addEventListener("mousemove", (e) => {
  if (traceThrottle) return;
  traceThrottle = true;

  const word = document.createElement("span");
  word.className = "trace-word";
  word.textContent = traceWords[Math.floor(Math.random() * traceWords.length)];
  word.style.left = `${e.clientX}px`;
  word.style.top = `${e.clientY}px`;

  document.body.appendChild(word);

  setTimeout(() => {
    word.remove();
  }, 900);

  setTimeout(() => {
    traceThrottle = false;
  }, 70);
});