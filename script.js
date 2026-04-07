/* autoplay */
document.querySelectorAll("video").forEach(v=>{
  v.muted=true;
  v.play().catch(()=>{});
});

/* 🔥 grid 3줄 */
const grid=document.getElementById("grid");

[0.4,0.5,0.6].forEach(p=>{
  const l=document.createElement("div");
  l.className="grid-line";
  l.style.left=(p*100)+"%";
  grid.appendChild(l);
});

/* 🔥 감시카메라 */
function build(target){
  for(let i=0;i<8;i++){
    const v=document.createElement("video");
    v.src="./videos/swipetounlock_1.mp4";
    v.muted=true;
    v.loop=true;

    v.addEventListener("loadedmetadata",()=>{
      v.currentTime=Math.random()*v.duration;
      v.play();
    });

    target.appendChild(v);
  }
}

build(leftSide);
build(rightSide);

/* 🔥 중앙 3열 배치 */
const centerStart=window.innerWidth*0.4;
const colWidth=window.innerWidth*0.2;

function getX(){
  const col=Math.floor(Math.random()*3);
  return centerStart + col*(colWidth/3);
}

/* 🔥 시계 */
const hand=document.getElementById("hand");
const clock=document.querySelector(".clock");

const angles={
  aligning:30,
  waiting:60,
  executing:90,
  suppressing:120,
  drifting:150,
  all:180
};

/* 🔥 commands */
const pv=preview.querySelector("video");

COMMANDS.forEach(cmd=>{
  const el=document.createElement("div");
  el.className="command";

  el.style.left=getX()+"px";
  el.style.top=(600+Math.random()*5000)+"px";

  el.innerHTML=`
    <div class="cmd-id">#${cmd.id}</div>
    <div class="cmd-text">${cmd.text}</div>
    <div class="meta-box">${cmd.time}</div>
  `;

  const meta=el.querySelector(".meta-box");

  /* 🔥 메타 클릭 → 분침 */
  meta.onclick=()=>{
    const angle=angles[cmd.time]||180;
    hand.style.transform=`translate(-50%,-100%) rotate(${angle}deg)`;
  };

  /* 🔥 hover */
  el.onmouseenter=(e)=>{
    preview.style.display="block";

    let x=e.clientX+12;
    let y=e.clientY-80;

    if(x>window.innerWidth-240) x=e.clientX-240;
    if(y<20) y=20;

    preview.style.left=x+"px";
    preview.style.top=y+"px";

    if(!pv.src.includes(cmd.video)){
      pv.src="./videos/"+cmd.video;
      pv.load();
    }

    pv.play();
    clock.classList.add("active");
  };

  el.onmousemove=(e)=>{
    preview.style.left=(e.clientX+12)+"px";
    preview.style.top=(e.clientY-80)+"px";
  };

  el.onmouseleave=()=>{
    preview.style.display="none";
    clock.classList.remove("active");
  };

  commands.appendChild(el);
});