const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.getElementById("previewVideo");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const cubeScene = document.getElementById("cubeScene");
const countEl = document.getElementById("count");
const progressLeft = document.getElementById("progressLeft");
const progressRight = document.getElementById("progressRight");

const frontVideo = document.getElementById("frontVideo");
const backVideo = document.getElementById("backVideo");

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
let flow = 0;
let fakeScroll = 0;

/* intro */
setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);

/* sides */
function buildSideColumn(target){
  target.innerHTML = "";
  for(let i = 0; i < 8; i++){
    const v = document.createElement("video");
    v.src = "./videos/swipetounlock_1.mp4";
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "");
    target.appendChild(v);

    const delay = i * 0.18;
    v.addEventListener("loadedmetadata", () => {
      try{
        v.currentTime = Math.min(delay, Math.max(0, v.duration - 0.2));
      }catch(e){}
    });
  }
}
buildSideColumn(leftSide);
buildSideColumn(rightSide);

/* grid */
function drawGrid(){
  grid.innerHTML = "";
  const cols = 24;

  for(let i = 0; i < cols; i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(i / cols) * 100}%`;
    grid.appendChild(line);
  }
}
drawGrid();
window.addEventListener("resize", drawGrid);

/* hands */
function moveBlueHand(type){
  const angle = typeAngles[type] ?? 180;
  hand.style.transition = "transform 0.6s ease";
  hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function animateRedHand(){
  redAngle += 0.6;
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

    placed.push({ x, y });

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

      const nextSrc = `./videos/${cmd.video}`;
      if(!previewVideo.src.includes(cmd.video)){
        previewVideo.src = nextSrc;
        previewVideo.load();
        previewVideo.play().catch(() => {});
      }
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

/* cube */
frontVideo.style.top = "0%";
backVideo.style.top = "-50%";

backVideo.addEventListener("loadedmetadata", () => {
  try{
    backVideo.currentTime = Math.min(0.3, Math.max(0, backVideo.duration - 0.2));
  }catch(e){}
});

window.addEventListener("scroll", () => {
  const triggerPoint = document.body.scrollHeight - window.innerHeight - 500;
  cubeScene.classList.toggle("active", window.scrollY > triggerPoint);
});

function animateCubeFlow(){
  flow += 0.15;

  frontVideo.style.transform = `translateY(${flow}px)`;
  backVideo.style.transform = `translateY(${-flow}px)`;

  if(flow > 200){
    flow = 0;
  }

  requestAnimationFrame(animateCubeFlow);
}
animateCubeFlow();

/* counter */
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
}, { passive: true });

/* speaker */
const toggle = document.getElementById("soundToggle");
let soundOn = false;

const cubeVideos = document.querySelectorAll(".cube video");

toggle.addEventListener("click", () => {
  soundOn = !soundOn;

  cubeVideos.forEach(v => {
    v.muted = !soundOn;
    if(soundOn){
      v.play().catch(() => {});
    }
  });

  toggle.textContent = soundOn ? "speaker on" : "speaker off";
});