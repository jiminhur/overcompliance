const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commands = document.getElementById("commands");
const preview = document.getElementById("preview");
const pv = document.getElementById("previewVideo");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const clock = document.getElementById("clock");

/* TITLE */
setTimeout(()=>{
  document.getElementById("introTitle").classList.add("shrink");
},1000);

/* 🔥 SIDE CAMERA (완전 해결) */
function buildSideColumn(target, offset=0){
  for(let i=0;i<8;i++){

    const v=document.createElement("video");
    v.src="./videos/swipetounlock_1.mp4";
    v.muted=true;
    v.loop=true;
    v.playsInline=true;
    v.autoplay=true;

    v.addEventListener("loadedmetadata",()=>{
      const d=v.duration||1;
      v.currentTime=(i*0.2+offset)%d;
      v.play().catch(()=>{});
    });

    v.addEventListener("canplay",()=>{
      v.play().catch(()=>{});
    });

    target.appendChild(v);
  }
}

buildSideColumn(leftSide,0);
buildSideColumn(rightSide,0.6);

/* GRID 5 */
[10,30,50,70,90].forEach(p=>{
  const l=document.createElement("div");
  l.className="grid-line";
  l.style.left=p+"%";
  grid.appendChild(l);
});

/* CLOCK */
const angles={
  aligning:30,
  waiting:60,
  executing:90,
  suppressing:120,
  drifting:150
};

function setHand(type){
  hand.style.transform=`translate(-50%,-100%) rotate(${angles[type]}deg)`;
}

/* SECOND */
function tick(){
  const d=new Date();
  hand2.style.transform=`translate(-50%,-100%) rotate(${d.getSeconds()*6}deg)`;
  requestAnimationFrame(tick);
}
tick();

/* COMMAND 중앙 3열 */
const center=window.innerWidth/2;
const cols=[center-110,center,center+110];

COMMANDS.forEach(cmd=>{
  const el=document.createElement("div");
  el.className="command";

  el.style.left=cols[Math.floor(Math.random()*3)]+"px";
  el.style.top=(600+Math.random()*5000)+"px";

  el.innerHTML=`
    <div class="command-inner">
      <div class="cmd-id">#${cmd.id}</div>
      <div class="cmd-text">${cmd.text}</div>
      <div class="meta">${cmd.time}</div>
    </div>
  `;

  el.onmouseenter=(e)=>{
    preview.style.display="block";

    preview.style.left=e.clientX+"px";
    preview.style.top=e.clientY+"px";

    pv.src="./videos/"+cmd.video;
    pv.load();
    pv.play().catch(()=>{});

    clock.classList.add("active");
    setHand(cmd.time);
  };

  el.onmouseleave=()=>{
    preview.style.display="none";
    clock.classList.remove("active");
  };

  commands.appendChild(el);
});