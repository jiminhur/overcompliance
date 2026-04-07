/* ========================= */
/* 🔥 VIDEO AUTOPLAY (확정) */
/* ========================= */

function forcePlayVideos(){
  const videos = document.querySelectorAll("video");

  videos.forEach(v => {
    v.muted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("autoplay", "");

    const p = v.play();
    if(p !== undefined){
      p.catch(() => {
        document.body.addEventListener("click", () => v.play(), {once:true});
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", forcePlayVideos);


/* ========================= */
/* 기본 요소 */
/* ========================= */

const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const cubeScene = document.querySelector(".cube-scene");

const countEl = document.getElementById("count");
const progressLeft = document.getElementById("progressLeft");
const progressRight = document.getElementById("progressRight");


/* ========================= */
/* intro */
/* ========================= */

setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);


/* ========================= */
/* 🔥 CCTV SIDE (랜덤 시간차 최종) */
/* ========================= */

function buildSideColumn(target){
  target.innerHTML = "";

  for(let i=0;i<8;i++){
    const v = document.createElement("video");

    v.src = "./videos/swipetounlock_1.mp4";
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.autoplay = true;

    /* 🔥 랜덤 + 시간차 핵심 */
    v.addEventListener("loadedmetadata", () => {
      v.currentTime = i * (0.2 + Math.random() * 0.2);
    });

    target.appendChild(v);
  }
}

buildSideColumn(leftSide);
buildSideColumn(rightSide);


/* ========================= */
/* grid */
/* ========================= */

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


/* ========================= */
/* hands */
/* ========================= */

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
/* filters */
/* ========================= */

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


/* ========================= */
/* commands (#01 구조) */
/* ========================= */

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

  COMMANDS.forEach((cmd, i) => {

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

    const index = String(i + 1).padStart(2,"0");

    el.innerHTML = `
      <div class="cmd-index">#${index}</div>
      <div class="cmd-text">${cmd.text}</div>
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
/* cube (평면 + 흐름) */
/* ========================= */

const frontVideo = document.querySelector(".front video");
const backVideo = document.querySelector(".back video");

frontVideo.style.top = "0%";
backVideo.style.top = "-50%";

backVideo.addEventListener("loadedmetadata", () => {
  backVideo.currentTime = 0.3;
});

window.addEventListener("scroll", () => {
  const trigger = document.body.scrollHeight - window.innerHeight - 500;

  if(window.scrollY > trigger){
    cubeScene.classList.add("active");
  } else {
    cubeScene.classList.remove("active");
  }
});

let flow = 0;

function animateCube(){
  flow += 0.15;

  frontVideo.style.transform = `translateY(${flow}px)`;
  backVideo.style.transform = `translateY(${-flow}px)`;

  if(flow > 200) flow = 0;

  requestAnimationFrame(animateCube);
}

animateCube();


/* ========================= */
/* counter */
/* ========================= */

let count = 0;

window.addEventListener("wheel", (e)=>{
  const trigger = document.body.scrollHeight - window.innerHeight - 500;

  if(window.scrollY > trigger){
    count += Math.abs(e.deltaY * 0.03);

    const n = Math.floor(count);

    countEl.textContent = String(n).padStart(2,"0");

    const w = Math.min(n * 6, 160);
    progressLeft.style.width = w+"px";
    progressRight.style.width = w+"px";
  }
});


/* ========================= */
/* speaker */
/* ========================= */

const toggle = document.getElementById("soundToggle");
let soundOn = false;

if(toggle){
  toggle.addEventListener("click", ()=>{
    soundOn = !soundOn;

    document.querySelectorAll(".cube video").forEach(v=>{
      v.muted = !soundOn;
    });

    toggle.textContent = soundOn ? "speaker on" : "speaker off";
  });
}