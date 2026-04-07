/* ========================= */
/* 기존 유지 */
/* ========================= */

const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = preview.querySelector("video");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
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

/* ========================= */
/* 감시 카메라 (유지) */
/* ========================= */

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

/* ========================= */
/* GRID 유지 */
/* ========================= */

function drawGrid(){
  grid.innerHTML = "";
  for(let i=0;i<24;i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(i/24)*100}%`;
    grid.appendChild(line);
  }
}
drawGrid();

/* ========================= */
/* 시계 유지 */
/* ========================= */

function moveBlueHand(type){
  const angle = typeAngles[type] ?? 180;
  hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function animateRedHand(){
  redAngle += 0.1;
  hand2.style.transform = `translate(-50%, -100%) rotate(${redAngle}deg)`;
  requestAnimationFrame(animateRedHand);
}
animateRedHand();

/* ========================= */
/* FILTER 유지 */
/* ========================= */

const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));

function updateFilterButtons(){
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.type === currentFilter);
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.type.toLowerCase();
    updateFilterButtons();
    moveBlueHand(currentFilter);
    renderCommands();
  });
});

/* ========================= */
/* 🔥 COMMAND (핵심 수정) */
/* ========================= */

function renderCommands(){

  commandsEl.innerHTML = "";

  const placed = [];

  const centerX = window.innerWidth * 0.5;
  const spreadX = 260;
  const startY = window.innerHeight * 0.65;
  const spreadY = 3200;

  function overlaps(x, y){
    return placed.some(p => Math.abs(p.x - x) < 260 && Math.abs(p.y - y) < 180);
  }

  COMMANDS.forEach(cmd => {

    let x, y, tries = 0;

    do{
      x = centerX + (Math.random()-0.5)*spreadX;
      y = startY + Math.random()*spreadY;
      tries++;
    } while (overlaps(x, y) && tries < 40);

    placed.push({x,y});

    const el = document.createElement("div");
    el.className = "command";

    const cmdType = (cmd.time || "").toLowerCase().trim();

    if(currentFilter !== "all" && cmdType !== currentFilter){
      el.classList.add("dim");
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    /* 🔥 구조 수정 */
    el.innerHTML = `
      <div class="text">${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    el.addEventListener("mouseenter", (e) => {

      el.classList.add("active");

      preview.style.display = "block";
      preview.style.left = `${Math.min(window.innerWidth-230, e.clientX+12)}px`;
      preview.style.top = `${Math.max(20, e.clientY-90)}px`;

      const src = `./videos/${cmd.video}`;

      if(!previewVideo.src.includes(cmd.video)){
        previewVideo.src = src;
        previewVideo.load();
        previewVideo.play().catch(()=>{});
      }
    });

    el.addEventListener("mouseleave", () => {
      preview.style.display = "none";
      el.classList.remove("active");
    });

    commandsEl.appendChild(el);
  });
}

updateFilterButtons();
moveBlueHand("all");
renderCommands();

/* ========================= */
/* 큐브 / 카운터 / 스피커 그대로 유지 */
/* ========================= */

/* 기존 코드 그대로 두면 됨 */