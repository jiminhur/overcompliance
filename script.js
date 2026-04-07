const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.querySelector("#preview video");

const minuteHand = document.getElementById("hand");
const secondHand = document.getElementById("hand2");

const typeAngles = {
  all: 180,
  aligning: 30,
  waiting: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

let currentFilter = "all";
let secondAngle = 0;
let targetAngle = 180;
let currentAngle = 180;

/* intro */
setTimeout(()=> introTitle.classList.add("shrink"),1000);

/* CCTV */
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
      v.currentTime=i*0.25;
      v.play().catch(()=>{});
    });

    target.appendChild(v);
  }
}
buildSide(leftSide);
buildSide(rightSide);

/* grid */
function drawGrid(){
  grid.innerHTML="";
  for(let i=0;i<6;i++){
    const l=document.createElement("div");
    l.className="grid-line";
    l.style.left=`${(window.innerWidth/6)*i}px`;
    grid.appendChild(l);
  }
}
drawGrid();

/* clock */
function animateClock(){
  secondAngle+=0.8;
  secondHand.style.transform=`translate(-50%, -100%) rotate(${secondAngle}deg)`;

  const diff=targetAngle-currentAngle;
  currentAngle+=diff*0.08 + Math.sin(Date.now()*0.01)*0.1;
  minuteHand.style.transform=`translate(-50%, -100%) rotate(${currentAngle}deg)`;

  requestAnimationFrame(animateClock);
}
animateClock();

/* filters */
document.querySelectorAll(".filter-chip").forEach(btn=>{
  btn.addEventListener("click",()=>{
    currentFilter=btn.dataset.type;
    targetAngle=typeAngles[currentFilter];

    document.querySelectorAll(".filter-chip").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");

    renderCommands();
  });
});

/* commands */
function renderCommands(){
  commandsEl.innerHTML="";

  const cols=["col-1","col-2","col-3"];

  COMMANDS.forEach((cmd,i)=>{
    const el=document.createElement("div");
    el.className=`command ${cols[i%3]}`;

    const y=200+(i*120);
    el.style.top=`${y}px`;

    if(currentFilter!=="all" && cmd.time!==currentFilter){
      el.classList.add("dim");
    }

    el.innerHTML=`
      <div>#${i+1}</div>
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    /* hover */
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
      currentFilter=cmd.time;
      targetAngle=typeAngles[cmd.time];
      renderCommands();
    });

    commandsEl.appendChild(el);
  });
}

renderCommands();

/* autoplay */
window.addEventListener("load",()=>{
  document.querySelectorAll("video").forEach(v=>{
    v.muted=true;
    v.play().catch(()=>{});
  });
});