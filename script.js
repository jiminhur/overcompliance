/* ========================= */
/* 기존 그대로 유지 */
/* ========================= */

const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const cube = document.getElementById("cube");
const cubeScene = document.querySelector(".cube-scene");
const countEl = document.getElementById("count");
const progressLeft = document.getElementById("progressLeft");
const progressRight = document.getElementById("progressRight");

const typeAngles = {
  all: 180,
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

let currentFilter = "all";
let redAngle = 0;
let bottomCount = 0;

/* intro */
setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);

/* sides */
function buildSideColumn(target){
  target.innerHTML = "";
  for(let i=0;i<8;i++){
    const v = document.createElement("video");
    v.src = "./videos/swipetounlock_1.mp4";
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    target.appendChild(v);
  }
}
buildSideColumn(leftSide);
buildSideColumn(rightSide);

/* grid */
function drawGrid(){
  grid.innerHTML = "";
  for(let i=0;i<6;i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(window.innerWidth / 6) * i}px`;
    grid.appendChild(line);
  }
}
drawGrid();

/* hands */
function moveBlueHand(type){
  const angle = typeAngles[type] ?? 180;
  hand.style.transition = "transform 0.6s ease";
  hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function animateRedHand(){
  redAngle += 0.1;
  hand2.style.transform = `translate(-50%, -100%) rotate(${redAngle}deg)`;
  requestAnimationFrame(animateRedHand);
}
animateRedHand();

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
    moveBlueHand(currentFilter);
    renderCommands();
  });
});

/* commands */
function renderCommands(){
  commandsEl.innerHTML = "";
  const placed = [];

  const centerStart = window.innerWidth * 0.2;
  const centerWidth = window.innerWidth * 0.6;
  const safeTop = window.innerHeight * 0.68;
  const safeBottom = document.body.scrollHeight - 2100;

  function overlaps(x, y){
    return placed.some(p => Math.abs(p.x - x) < 300 && Math.abs(p.y - y) < 430);
  }

  COMMANDS.forEach(cmd => {
    let x, y, tries = 0;

    do{
      x = centerStart + Math.random() * centerWidth;
      y = safeTop + Math.random() * (safeBottom - safeTop);
      tries++;
    } while (overlaps(x, y) && tries < 60);

    placed.push({x, y});

    const el = document.createElement("div");
    el.className = "command";

    if(currentFilter !== "all" && cmd.time !== currentFilter){
      el.classList.add("dim");
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.innerHTML = `
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    el.addEventListener("mouseenter", (e) => {
      preview.style.display = "block";
      preview.style.left = `${Math.min(window.innerWidth - 230, e.clientX + 10)}px`;
      preview.style.top = `${Math.max(20, e.clientY - 80)}px`;
      preview.querySelector("video").src = `./videos/${cmd.video}`;
    });

    el.addEventListener("mouseleave", () => {
      preview.style.display = "none";
    });

    commandsEl.appendChild(el);
  });
}

updateFilterButtons();
moveBlueHand("all");
renderCommands();

/* ========================= */
/* 🔥 큐브 (수정 버전) */
/* ========================= */

const frontVideo = document.getElementById("frontVideo");
const backVideo = document.getElementById("backVideo");

/* 위치 유지 */
frontVideo.style.top = "0%";
backVideo.style.top = "-50%";

/* 시간차 */
backVideo.addEventListener("loadedmetadata", () => {
  backVideo.currentTime = 0.3;
});

/* 등장 */
window.addEventListener("scroll", () => {
  const triggerPoint = document.body.scrollHeight - window.innerHeight - 500;
  cubeScene.classList.toggle("active", window.scrollY > triggerPoint);
});

/* 🔥 부드럽게 (과한 회전 제거) */
let flow = 0;

function animateCubeFlow(){
  flow += 0.15; // 🔥 낮춤 (핵심)

  frontVideo.style.transform = `translateY(${flow}px)`;
  backVideo.style.transform = `translateY(${-flow}px)`;

  if(flow > 200){
    flow = 0;
  }

  requestAnimationFrame(animateCubeFlow);
}

animateCubeFlow();

/* ========================= */
/* 🔥 counter 복구 */
/* ========================= */

let fakeScroll = 0;

window.addEventListener("wheel", (e) => {
  const triggerPoint = document.body.scrollHeight - window.innerHeight - 500;

  if(window.scrollY > triggerPoint){
    fakeScroll += e.deltaY * 0.05;

    const count = Math.floor(Math.abs(fakeScroll));

    if(count !== bottomCount){
      bottomCount = count;

      countEl.textContent = String(bottomCount).padStart(2, "0");

      const width = Math.min(bottomCount * 8, 160);
      progressLeft.style.width = `${width}px`;
      progressRight.style.width = `${width}px`;
    }
  }
});

/* ========================= */
/* 🔥 speaker */
/* ========================= */

const toggle = document.getElementById("soundToggle");
let soundOn = false;

const cubeVideos = document.querySelectorAll(".cube video");

toggle.addEventListener("click", () => {
  soundOn = !soundOn;

  cubeVideos.forEach(v => {
    v.muted = !soundOn;
  });

  toggle.textContent = soundOn ? "speaker on" : "speaker off";
});