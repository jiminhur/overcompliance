/* ========================= */
/* 기본 */
/* ========================= */

const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = preview.querySelector("video");
const hand = document.getElementById("hand");   // 분침
const hand2 = document.getElementById("hand2"); // 초침

let currentFilter = "all";
let redAngle = 0;

/* ========================= */
/* intro */
/* ========================= */

setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);

/* ========================= */
/* 🔥 감시카메라 (시차 포함) */
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

    // 🔥 시차
    v.addEventListener("loadedmetadata", () => {
      v.currentTime = i * 0.25;
    });

    target.appendChild(v);
  }
}

buildSideColumn(leftSide);
buildSideColumn(rightSide);

/* ========================= */
/* GRID */
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
/* 🔥 시계 */
/* ========================= */

const typeAngles = {
  all: 180,
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

function moveBlueHand(type){
  const angle = typeAngles[type] ?? 180;
  hand.style.transition = "transform 0.5s ease";
  hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

/* 초침 */
function animateRedHand(){
  redAngle += 0.4;
  hand2.style.transform = `translate(-50%, -100%) rotate(${redAngle}deg)`;
  requestAnimationFrame(animateRedHand);
}
animateRedHand();

/* ========================= */
/* FILTER */
/* ========================= */

const filterButtons = document.querySelectorAll(".filter-chip");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    currentFilter = btn.dataset.type.toLowerCase();

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    moveBlueHand(currentFilter); // 🔥 분침 이동
    renderCommands();
  });
});

/* ========================= */
/* 🔥 COMMAND (중앙 + 박스) */
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

    // 🔥 필터
    if(currentFilter !== "all" && cmdType !== currentFilter){
      el.classList.add("dim");
    }

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.innerHTML = `
      <div class="text">${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    /* hover */
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

/* 초기 */
moveBlueHand("all");
renderCommands();