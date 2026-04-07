const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.getElementById("previewVideo");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");

let currentFilter = "all";
let redAngle = 0;

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
  for(let i=0;i<24;i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(i/24)*100}%`;
    grid.appendChild(line);
  }
}
drawGrid();

/* clock */
function animateRedHand(){
  redAngle += 0.5;
  hand2.style.transform = `translate(-50%, -100%) rotate(${redAngle}deg)`;
  requestAnimationFrame(animateRedHand);
}
animateRedHand();

/* filter */
const filterButtons = document.querySelectorAll(".filter-chip");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.type.toLowerCase();

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderCommands();
  });
});

/* commands */
function renderCommands(){

  commandsEl.innerHTML = "";

  const centerX = window.innerWidth * 0.5;
  const spreadX = 260;
  const startY = window.innerHeight * 0.65;
  const spreadY = 3200;

  COMMANDS.forEach(cmd => {

    const el = document.createElement("div");
    el.className = "command";

    const cmdType = (cmd.time || "").toLowerCase().trim();

    if(currentFilter !== "all" && cmdType !== currentFilter){
      el.classList.add("dim");
    }

    // 🔥 중앙 배치
    el.style.left = `${centerX + (Math.random()-0.5)*spreadX}px`;
    el.style.top = `${startY + Math.random()*spreadY}px`;

    // 🔥 구조 (핵심)
    el.innerHTML = `
      <div class="text">${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context || ""} · ${cmd.action || ""}</div>
    `;

    // hover
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

renderCommands();