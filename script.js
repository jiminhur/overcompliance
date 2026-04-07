const introTitle = document.getElementById("introTitle");
const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = preview.querySelector("video");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const clock = document.querySelector(".clock");

let currentFilter = "all";
let redAngle = 0;

/* TITLE */
setTimeout(()=>{
  introTitle.classList.add("shrink");
},800);

/* CAM */
function buildSide(target){

  target.innerHTML="";

  for(let i=0;i<8;i++){

    const v=document.createElement("video");

    v.src="./videos/swipetounlock_1.mp4";
    v.autoplay=true;
    v.muted=true;
    v.loop=true;

    v.setAttribute("playsinline","");
    v.setAttribute("webkit-playsinline","");

    v.addEventListener("loadedmetadata",()=>{
      v.currentTime=i*0.25;
      v.play().catch(()=>{});
    });

    target.appendChild(v);
  }
}

buildSide(leftSide);
buildSide(rightSide);

/* CLOCK */
const angles={
  all:180,
  aligning:30,
  waiting:60,
  executing:90,
  suppressing:120,
  drifting:150
};

function moveHand(t){
  hand.style.transform=`translate(-50%,-100%) rotate(${angles[t]}deg)`;
}

function red(){
  redAngle+=0.5;
  hand2.style.transform=`translate(-50%,-100%) rotate(${redAngle}deg)`;
  requestAnimationFrame(red);
}
red();

/* FILTER */
document.querySelectorAll(".filter-chip").forEach(btn=>{
  btn.onclick=()=>{
    currentFilter=btn.dataset.type.toLowerCase();
    document.querySelectorAll(".filter-chip").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    moveHand(currentFilter);
    render();
  }
});

/* COMMAND */
function render(){

  commandsEl.innerHTML="";
  const cx=window.innerWidth*0.5;

  COMMANDS.forEach(cmd=>{

    const el=document.createElement("div");
    el.className="command";

    const type=(cmd.time||"").toLowerCase().trim();

    if(currentFilter!=="all" && type!==currentFilter){
      el.classList.add("dim");
    }

    el.style.left=`${cx+(Math.random()-0.5)*260}px`;
    el.style.top=`${window.innerHeight*0.6+Math.random()*3000}px`;

    el.innerHTML=`
      <div>${cmd.text}</div>
      <div style="font-size:9px;margin-top:6px;color:#ccc;">
        ${cmd.time} · ${cmd.context} · ${cmd.action}
      </div>
    `;

    el.onmouseenter=e=>{
      preview.style.display="block";
      preview.style.left=e.clientX+10+"px";
      preview.style.top=e.clientY-80+"px";

      previewVideo.src=`./videos/${cmd.video}`;
      previewVideo.play().catch(()=>{});

      clock.classList.add("active");
    };

    el.onmouseleave=()=>{
      preview.style.display="none";
      clock.classList.remove("active");
    };

    commandsEl.appendChild(el);
  });
}

moveHand("all");
render();