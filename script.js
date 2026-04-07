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

const hand = document.getElementById("hand");   // 🔥 분침
const hand2 = document.getElementById("hand2"); // 🔥 초침

let currentFilter = "all";
let redAngle = 0;

/* ========================= */
/* intro */
/* ========================= */

setTimeout(()=>{
  introTitle.classList.add("shrink");
},1000);

/* ========================= */
/* 🔥 감시카메라 (완전 복구 + 시차) */
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

    // 🔥 핵심: 시차
    v.addEventListener("loadedmetadata", ()=>{
      v.currentTime = i * 0.3;
    });

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
/* 🔥 시계 완전 복구 */
/* ========================= */

const typeAngles = {
  all: 180,
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

/* 🔥 분침 */
function moveBlueHand(type){

  const angle = typeAngles[type] ?? 180;

  hand.style.transition = "transform 0.5s ease";

  hand.style.transform =
    `translate(-50%, -100%) rotate(${angle}deg)`;
}

/* 🔥 초침 */
function animateRedHand(){
  redAngle += 0.4;

  hand2.style.transform =
    `translate(-50%, -100%) rotate(${redAngle}deg)`;

  requestAnimationFrame(animateRedHand);
}

animateRedHand();

/* ========================= */
/* 🔥 필터 */
/* ========================= */

const filterButtons = document.querySelectorAll(".filter-chip");

filterButtons.forEach(btn=>{

  btn.addEventListener("click",()=>{

    currentFilter = btn.dataset.type.toLowerCase();

    filterButtons.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    moveBlueHand(currentFilter); // 🔥 분침 이동

    renderCommands();
  });

});

/* ========================= */
/* 🔥 COMMAND */
/* ========================= */

function renderCommands(){

  commandsEl.innerHTML = "";

  const centerX = window.innerWidth * 0.5;

  COMMANDS.forEach(cmd=>{

    const el = document.createElement("div");
    el.className = "command";

    const type = (cmd.time || "").toLowerCase().trim();

    if(currentFilter !== "all" && type !== currentFilter){
      el.classList.add("dim");
    }

    el.style.left = `${centerX + (Math.random()-0.5)*260}px`;
    el.style.top = `${window.innerHeight*0.65 + Math.random()*3000}px`;

    el.innerHTML = `
      <div class="text">${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    /* hover */
    el.addEventListener("mouseenter",(e)=>{

      preview.style.display="block";

      preview.style.left =
        `${Math.min(window.innerWidth-230, e.clientX+10)}px`;

      preview.style.top =
        `${Math.max(20, e.clientY-80)}px`;

      previewVideo.src = `./videos/${cmd.video}`;

      el.classList.add("active");
    });

    el.addEventListener("mouseleave",()=>{
      preview.style.display="none";
      el.classList.remove("active");
    });

    commandsEl.appendChild(el);
  });
}

/* 초기 실행 */
moveBlueHand("all");
renderCommands();