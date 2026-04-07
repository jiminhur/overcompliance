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
let cubeRotation = 0;

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
    if(btn.dataset.type === currentFilter){
      btn.classList.add("active");
    }else{
      btn.classList.remove("active");
    }
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

    el.addEventListener("mousemove", (e) => {
      preview.style.left = `${Math.min(window.innerWidth - 230, e.clientX + 10)}px`;
      preview.style.top = `${Math.max(20, e.clientY - 80)}px`;
    });

    el.addEventListener("mouseleave", () => {
      preview.style.display = "none";
    });

    el.addEventListener("click", () => {
      currentFilter = cmd.time;
      updateFilterButtons();
      moveBlueHand(cmd.time);
      renderCommands();
    });

    commandsEl.appendChild(el);
  });
}

updateFilterButtons();
moveBlueHand("all");
renderCommands();

/* cube text */
/* 🔥 큐브 핵심 (진짜 완성본) */

/* 요소 */
const frontVideo = document.querySelector(".front video");
const backVideo = document.querySelector(".back video");

/* 1️⃣ 시작 위치 다르게 (이거 없으면 무조건 깨짐) */
frontVideo.style.top = "0%";
backVideo.style.top = "-50%";

/* 2️⃣ 시간차 (회전 착시 핵심) */
backVideo.addEventListener("loadedmetadata", () => {
  backVideo.currentTime = 0.4;
});

/* 3️⃣ 스크롤 위치 → 큐브 등장 */
window.addEventListener("scroll", () => {
  const triggerPoint = document.body.scrollHeight - window.innerHeight - 500;

  if(window.scrollY > triggerPoint){
    cubeScene.classList.add("active");
  } else {
    cubeScene.classList.remove("active");
  }
});

/* 4️⃣ 흐름 애니메이션 (진짜 핵심) */
let flow = 0;

function animateCubeFlow(){
  flow += 0.35;  // 👉 속도 (0.25~0.5 사이 추천)

  frontVideo.style.transform = `translateY(${flow}px)`;
  backVideo.style.transform = `translateY(${-flow}px)`;

  /* 무한 루프 */
  if(flow > 300){
    flow = 0;
  }

  requestAnimationFrame(animateCubeFlow);
}

animateCubeFlow();

/* 5️⃣ 스크롤 추가 반응 (살짝 더 입체감) */
window.addEventListener("wheel", (e) => {
  const triggerPoint = document.body.scrollHeight - window.innerHeight - 500;

  if(window.scrollY > triggerPoint){
    flow += e.deltaY * 0.1;
  }
});

/* 🔥 모든 영상 강제 autoplay */

function forcePlayAllVideos(){
  const videos = document.querySelectorAll("video");

  videos.forEach(v => {
    v.muted = true;
    v.play().catch(() => {});
  });
}

window.addEventListener("load", forcePlayAllVideos);
