/* ========================= */
/* VIDEO AUTOPLAY */
/* ========================= */

function forcePlayVideos(){
  document.querySelectorAll("video").forEach(v=>{
    v.muted = true;
    v.play().catch(()=>{});
  });
}

document.addEventListener("DOMContentLoaded", forcePlayVideos);


/* ========================= */
/* 기본 */
/* ========================= */

const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const hand = document.getElementById("hand");
const cubeScene = document.querySelector(".cube-scene");

const countEl = document.getElementById("count");
const progressLeft = document.getElementById("progressLeft");
const progressRight = document.getElementById("progressRight");


/* intro */
setTimeout(()=> introTitle.classList.add("shrink"),1000);


/* ========================= */
/* CCTV */
/* ========================= */

function buildSideColumn(target){
  target.innerHTML = "";

  for(let i=0;i<8;i++){
    const v = document.createElement("video");

    v.src = "./videos/swipetounlock_1.mp4";
    v.muted = true;
    v.loop = true;
    v.autoplay = true;
    v.playsInline = true;

    v.addEventListener("loadeddata", ()=>{
      v.currentTime = i * (0.2 + Math.random()*0.2);
      v.play().catch(()=>{});
    });

    target.appendChild(v);
  }
}

buildSideColumn(leftSide);
buildSideColumn(rightSide);


/* ========================= */
/* grid */
/* ========================= */

for(let i=0;i<6;i++){
  const line = document.createElement("div");
  line.className = "grid-line";
  line.style.left = `${(window.innerWidth/6)*i}px`;
  grid.appendChild(line);
}


/* ========================= */
/* commands */
/* ========================= */

function renderCommands(){
  commandsEl.innerHTML="";

  COMMANDS.forEach((cmd,i)=>{
    const el = document.createElement("div");
    el.className="command";

    const index = String(i+1).padStart(2,"0");

    el.innerHTML=`
      <div class="cmd-index">#${index}</div>
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time}</div>
    `;

    el.style.left=Math.random()*window.innerWidth+"px";
    el.style.top=Math.random()*8000+"px";

    commandsEl.appendChild(el);
  });
}

renderCommands();


/* ========================= */
/* cube */
/* ========================= */

const frontVideo = document.getElementById("frontVideo");
const backVideo = document.getElementById("backVideo");

let flow=0;

function animateCube(){
  flow+=0.15;

  frontVideo.style.transform=`translateY(${flow}px)`;
  backVideo.style.transform=`translateY(${-flow}px)`;

  if(flow>200) flow=0;

  requestAnimationFrame(animateCube);
}

animateCube();

window.addEventListener("scroll",()=>{
  const trigger=document.body.scrollHeight-window.innerHeight-500;

  cubeScene.classList.toggle("active",window.scrollY>trigger);
});


/* ========================= */
/* counter */
/* ========================= */

let count=0;

window.addEventListener("wheel",(e)=>{
  count+=Math.abs(e.deltaY*0.03);

  const n=Math.floor(count);

  countEl.textContent=String(n).padStart(2,"0");

  const w=Math.min(n*6,160);
  progressLeft.style.width=w+"px";
  progressRight.style.width=w+"px";
});


/* ========================= */
/* speaker */
/* ========================= */

const toggle=document.getElementById("soundToggle");

if(toggle){
  let on=false;

  toggle.onclick=()=>{
    on=!on;

    document.querySelectorAll("video").forEach(v=>{
      v.muted=!on;
    });

    toggle.textContent=on?"speaker on":"speaker off";
  };
}


/* ========================= */
/* 🔥 hover invert */
/* ========================= */

document.addEventListener("mouseover",()=>{
  document.body.classList.add("invert");
});

document.addEventListener("mouseout",()=>{
  document.body.classList.remove("invert");
});