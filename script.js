const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.querySelector("#preview video");

const hand = document.getElementById("hand");   // 분침
const hand2 = document.getElementById("hand2"); // 초침

const typeAngles = {
  all: 180,
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

let currentFilter = "all";

/* =========================
   INTRO
========================= */
setTimeout(()=>{
  introTitle.classList.add("shrink");
},1000);

/* =========================
   GRID
========================= */
function drawGrid(){
  grid.innerHTML="";
  for(let i=0;i<6;i++){
    const line=document.createElement("div");
    line.className="grid-line";
    line.style.left=`${(window.innerWidth/6)*i}px`;
    grid.appendChild(line);
  }
}
drawGrid();

/* =========================
   CCTV (핵심)
========================= */
function buildSide(target){
  target.innerHTML="";
  for(let i=0;i<8;i++){
    const v=document.createElement("video");

    v.src="./videos/swipetounlock_1.mp4";
    v.autoplay=true;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;

    v.addEventListener("loadeddata",()=>{
      v.currentTime = i * 0.25; // 시간차
      v.play().catch(()=>{});
    });

    target.appendChild(v);
  }
}
buildSide(leftSide);
buildSide(rightSide);

/* =========================
   CLOCK (핵심)
========================= */
let secondAngle = 0;
let currentAngle = 180;
let targetAngle = 180;

function animateClock(){

  /* 초침 */
  secondAngle += 0.8;
  hand2.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;

  /* 분침 */
  const diff = targetAngle - currentAngle;
  currentAngle += diff * 0.08 + Math.sin(Date.now()*0.01)*0.1;

  hand.style.transform = `translate(-50%, -100%) rotate(${currentAngle}deg)`;

  requestAnimationFrame(animateClock);
}
animateClock();

/* =========================
   FILTER → 분침 연결
========================= */
document.querySelectorAll(".filter-chip").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentFilter = btn.dataset.type;
    targetAngle = typeAngles[currentFilter];

    document.querySelectorAll(".filter-chip")
      .forEach(b=>b.classList.remove("active"));

    btn.classList.add("active");

    renderCommands();
  });
});

/* =========================
   COMMAND (핵심)
========================= */
function renderCommands(){
  commandsEl.innerHTML="";

  const cols=["col-1","col-2","col-3"];

  COMMANDS.forEach((cmd,i)=>{

    const el=document.createElement("div");
    el.className=`command ${cols[i%3]}`;

    const y = 200 + i * 140;
    el.style.top = `${y}px`;

    if(currentFilter!=="all" && cmd.time!==currentFilter){
      el.classList.add("dim");
    }

    el.innerHTML=`
      <div>#${i+1}</div>
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    /* hover → 전체 반전 */
    el.addEventListener("mouseenter",(e)=>{
      document.body.classList.add("invert");

      preview.style.display="block";
      previewVideo.src=`./videos/${cmd.video}`;
      preview.style.left=`${e.clientX+10}px`;
      preview.style.top=`${e.clientY-80}px`;
    });

    el.addEventListener("mouseleave",()=>{
      document.body.classList.remove("invert");
      preview.style.display="none";
    });

    el.addEventListener("click",()=>{
      currentFilter = cmd.time;
      targetAngle = typeAngles[cmd.time];
      renderCommands();
    });

    commandsEl.appendChild(el);
  });
}
renderCommands();

/* =========================
   VIDEO AUTOPLAY
========================= */
window.addEventListener("load",()=>{
  document.querySelectorAll("video").forEach(v=>{
    v.muted=true;
    v.play().catch(()=>{});
  });
});

/* =========================
   CUBE (스크롤 착시)
========================= */
const topVideo = document.querySelector(".cube-top video");
const bottomVideo = document.querySelector(".cube-bottom video");

bottomVideo.addEventListener("loadedmetadata",()=>{
  bottomVideo.currentTime = 0.5;
});

window.addEventListener("scroll",()=>{

  const rect=document.querySelector(".bottom-section").getBoundingClientRect();
  const vh=window.innerHeight;

  if(rect.top < vh && rect.bottom > 0){

    const progress = (vh - rect.top) / (vh + rect.height);
    const move = progress * 200;

    topVideo.style.transform = `translateY(${move}px)`;
    bottomVideo.style.transform = `translateY(${-move}px)`;
  }
});