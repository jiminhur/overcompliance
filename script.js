const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.getElementById("previewVideo");
const ring = document.getElementById("ring");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");
const cubeTopVideo = document.getElementById("cubeTopVideo");
const cubeBottomVideo = document.getElementById("cubeBottomVideo");
const countEl = document.getElementById("count");
const progressLeft = document.getElementById("progressLeft");
const progressRight = document.getElementById("progressRight");
const soundToggle = document.getElementById("soundToggle");
const bottomSection = document.getElementById("bottomSection");

const typeAngles = {
  all: 180,
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

let currentFilter = "all";
let targetMinuteAngle = typeAngles.all;
let displayedMinuteAngle = typeAngles.all;
let secondAngle = 0;
let soundOn = false;
let countValue = 0;

/* autoplay */
function forcePlayVideos(){
  document.querySelectorAll("video").forEach((v) => {
    v.muted = !soundOn;
    v.setAttribute("playsinline", "");
    v.setAttribute("autoplay", "");
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    setTimeout(tryPlay, 250);
    setTimeout(tryPlay, 700);
    setTimeout(tryPlay, 1400);
  });
}

window.addEventListener("load", forcePlayVideos);

/* title */
setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);

/* cctv */
function buildSideColumn(target){
  target.innerHTML = "";

  for(let i = 0; i < 8; i++){
    const v = document.createElement("video");
    v.src = "./videos/swipetounlock_1.mp4";
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;

    v.addEventListener("loadeddata", () => {
      if (Number.isFinite(v.duration) && v.duration > 0) {
        v.currentTime = (i * (0.2 + Math.random() * 0.2)) % v.duration;
      }
      v.play().catch(() => {});
    });

    target.appendChild(v);
  }
}

buildSideColumn(leftSide);
buildSideColumn(rightSide);

/* grid */
function drawGrid(){
  grid.innerHTML = "";
  for(let i = 0; i < 6; i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(window.innerWidth / 6) * i}px`;
    grid.appendChild(line);
  }
}
drawGrid();

/* clock */
function setMinuteTarget(type){
  targetMinuteAngle = typeAngles[type] ?? 180;
}

function animateClock(){
  secondAngle += 0.9;
  secondHand.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;

  const diff = targetMinuteAngle - displayedMinuteAngle;
  displayedMinuteAngle += diff * 0.08 + Math.sin(Date.now() * 0.01) * 0.05;
  minuteHand.style.transform = `translate(-50%, -100%) rotate(${displayedMinuteAngle}deg)`;

  requestAnimationFrame(animateClock);
}
animateClock();

/* filters */
const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));

function updateFilterButtons(){
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === currentFilter);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.type;
    updateFilterButtons();
    setMinuteTarget(currentFilter);
    renderCommands();
  });
});

/* commands */
function renderCommands(){
  commandsEl.innerHTML = "";

  const columnXs = ["col-1", "col-2", "col-3"];
  const topStart = 220;
  const bottomLimit = 7600;
  const verticalGapMin = 220;
  const usedY = [[], [], []];

  function getYForColumn(colIndex){
    let y, tries = 0;
    do{
      y = topStart + Math.random() * (bottomLimit - topStart);
      tries++;
    } while (
      usedY[colIndex].some(prev => Math.abs(prev - y) < verticalGapMin) &&
      tries < 100
    );
    usedY[colIndex].push(y);
    return y;
  }

  COMMANDS.forEach((cmd, i) => {
    const colIndex = i % 3;
    const el = document.createElement("div");
    el.className = `command ${columnXs[colIndex]}`;

    if(currentFilter !== "all" && cmd.time !== currentFilter){
      el.classList.add("dim");
    }

    const idx = String(i + 1).padStart(2, "0");
    el.style.top = `${getYForColumn(colIndex)}px`;

    el.innerHTML = `
      <div class="cmd-index">#${idx}</div>
      <div class="cmd-text">${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    el.addEventListener("mouseenter", (e) => {
      document.body.classList.add("invert");
      ring.classList.add("active");

      preview.style.display = "block";
      previewVideo.src = `./videos/${cmd.video}`;
      previewVideo.play().catch(() => {});
      preview.style.left = `${Math.min(window.innerWidth - 230, e.clientX + 10)}px`;
      preview.style.top = `${Math.max(20, e.clientY - 80)}px`;
    });

    el.addEventListener("mousemove", (e) => {
      preview.style.left = `${Math.min(window.innerWidth - 230, e.clientX + 10)}px`;
      preview.style.top = `${Math.max(20, e.clientY - 80)}px`;
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("invert");
      ring.classList.remove("active");
      preview.style.display = "none";
    });

    el.addEventListener("click", () => {
      currentFilter = cmd.time;
      updateFilterButtons();
      setMinuteTarget(cmd.time);
      renderCommands();
    });

    commandsEl.appendChild(el);
  });
}

updateFilterButtons();
setMinuteTarget("all");
renderCommands();

/* cube videos */
function initCubeVideos(){
  cubeBottomVideo.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(cubeBottomVideo.duration) && cubeBottomVideo.duration > 0) {
      cubeBottomVideo.currentTime = 0.35;
    }
  });
}
initCubeVideos();

/* bottom scroll-driven motion */
function updateBottomSection(){
  const rect = bottomSection.getBoundingClientRect();
  const vh = window.innerHeight;

  const start = vh * 0.15;
  const end = rect.height - vh * 0.55;
  const progressed = Math.min(Math.max(start - rect.top, 0), end);
  const progress = end > 0 ? progressed / end : 0;

  const offset = progress * 140;

  cubeTopVideo.style.transform = `translateY(${offset}px)`;
  cubeBottomVideo.style.transform = `translateY(${-offset}px)`;

  countValue = Math.floor(progress * 36);
  countEl.textContent = String(countValue).padStart(2, "0");

  const w = Math.min(countValue * 4.5, 160);
  progressLeft.style.width = `${w}px`;
  progressRight.style.width = `${w}px`;
}

window.addEventListener("scroll", updateBottomSection);
window.addEventListener("resize", () => {
  drawGrid();
  renderCommands();
  updateBottomSection();
});

/* sound */
soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  document.querySelectorAll("video").forEach(v => {
    v.muted = !soundOn;
    if (soundOn) {
      v.play().catch(() => {});
    }
  });
  soundToggle.textContent = soundOn ? "speaker on" : "speaker off";
});

updateBottomSection();