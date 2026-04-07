const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.getElementById("previewVideo");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const clock = document.getElementById("clock");

const typeAngles = {
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150,
  all: 180
};

let currentFilter = "all";

/* title intro */
setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1100);

/* autoplay safety */
function forcePlay(video){
  video.muted = true;
  video.playsInline = true;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }
}

/* side videos */
function buildSideColumn(target, isRight = false){
  target.innerHTML = "";

  for(let i = 0; i < 8; i++){
    const v = document.createElement("video");
    v.src = "./videos/swipetounlock_1.mp4";
    v.autoplay = true;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = "auto";

    v.addEventListener("loadedmetadata", () => {
      const offset = isRight ? 0.22 : 0;
      const randomBase = (i * 0.17 + offset) % Math.max(v.duration || 1, 1);
      v.currentTime = randomBase;
      forcePlay(v);
    });

    target.appendChild(v);
  }
}

buildSideColumn(leftSide, false);
buildSideColumn(rightSide, true);

/* grid: 5 lines / 7 zones */
function drawGrid(){
  grid.innerHTML = "";

  const lines = [14, 32, 44, 56, 68]; 
  // 5 lines total
  lines.forEach(percent => {
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${percent}%`;
    grid.appendChild(line);
  });
}

drawGrid();

/* clock */
function setMinuteHandByType(type){
  const angle = typeAngles[type] ?? 180;
  hand.style.transition = "transform 0.45s ease";
  hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function animateSecondHand(){
  const now = new Date();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  const secondAngle = (seconds + milliseconds / 1000) * 6;

  hand2.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
  requestAnimationFrame(animateSecondHand);
}

setMinuteHandByType("all");
animateSecondHand();

/* filter buttons */
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
    setMinuteHandByType(currentFilter);
    updateCommandVisibility();
  });
});

/* command layout
   central 3 columns between the inner 3 vertical lines:
   32%, 44%, 56%, 68%
*/
const centralColumns = [32, 44, 56];
const columnOffset = 1.4; // small push inward for box width feel

function getCentralColumnX(index){
  const percent = centralColumns[index];
  return (window.innerWidth * (percent / 100)) + (window.innerWidth * (columnOffset / 100));
}

function renderCommands(){
  commandsEl.innerHTML = "";

  const placed = [];
  const safeTop = 620;
  const safeBottom = document.body.scrollHeight - 1200;

  function overlaps(x, y){
    return placed.some(p => Math.abs(p.x - x) < 245 && Math.abs(p.y - y) < 220);
  }

  COMMANDS.forEach((cmd, i) => {
    let x, y, tries = 0;

    do{
      const col = Math.floor(Math.random() * 3);
      x = getCentralColumnX(col);
      y = safeTop + Math.random() * (safeBottom - safeTop);
      tries++;
    } while (overlaps(x, y) && tries < 80);

    placed.push({x, y});

    const el = document.createElement("div");
    el.className = "command";
    el.dataset.type = cmd.time;

    const idText = `#${cmd.id}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.innerHTML = `
      <div class="cmd-id">${idText}</div>
      <div class="cmd-text">${cmd.text}</div>
      <div class="meta-box" data-type="${cmd.time}">
        <span class="meta-row"><span class="meta-label">TYPE</span>${cmd.time}</span>
        <span class="meta-row"><span class="meta-label">CONTEXT</span>${cmd.context}</span>
        <span class="meta-row"><span class="meta-label">BODY</span>${cmd.bodyEngagement}</span>
        <span class="meta-row"><span class="meta-label">ACTION</span>${cmd.action}</span>
        <span class="meta-row"><span class="meta-label">AWARENESS</span>${cmd.awareness}</span>
      </div>
    `;

    const metaBox = el.querySelector(".meta-box");

    metaBox.addEventListener("click", (e) => {
      e.stopPropagation();
      currentFilter = cmd.time;
      updateFilterButtons();
      setMinuteHandByType(cmd.time);
      updateCommandVisibility();
    });

    el.addEventListener("mouseenter", (e) => {
      showPreview(e, cmd.video);
      clock.classList.add("active");
    });

    el.addEventListener("mousemove", (e) => {
      movePreview(e);
    });

    el.addEventListener("mouseleave", () => {
      hidePreview();
      clock.classList.remove("active");
    });

    commandsEl.appendChild(el);
  });

  updateCommandVisibility();
}

function updateCommandVisibility(){
  const items = Array.from(document.querySelectorAll(".command"));
  items.forEach(el => {
    if(currentFilter === "all"){
      el.classList.remove("dim");
    }else{
      el.classList.toggle("dim", el.dataset.type !== currentFilter);
    }
  });
}

function showPreview(e, videoName){
  preview.style.display = "block";
  movePreview(e);

  if(!previewVideo.src.includes(videoName)){
    previewVideo.src = `./videos/${videoName}`;
    previewVideo.load();
  }
  forcePlay(previewVideo);
}

function movePreview(e){
  const previewWidth = 240;
  const offset = 14;

  let x = e.clientX + offset;
  let y = e.clientY - 90;

  if(x > window.innerWidth - previewWidth - 10){
    x = e.clientX - previewWidth - 10;
  }

  if(y < 20){
    y = 20;
  }

  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;
}

function hidePreview(){
  preview.style.display = "none";
}

renderCommands();

/* resize */
window.addEventListener("resize", () => {
  drawGrid();
  renderCommands();
});