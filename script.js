const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const grid = document.getElementById("grid");
const commands = document.getElementById("commands");
const preview = document.getElementById("preview");
const pv = document.getElementById("previewVideo");
const hand = document.getElementById("hand");
const hand2 = document.getElementById("hand2");
const clock = document.getElementById("clock");

/* 제목 */
setTimeout(()=>{
  document.getElementById("introTitle").classList.add("shrink");
},1000);

/* 영상 자동재생 */
function play(v){
  v.muted=true;
  v.play().catch(()=>{});
}

/* 감시카메라 */
function build(target){
  for(let i=0;i<8;i++){
    const v=document.createElement("video");
    v.src="./videos/swipetounlock_1.mp4";
    v.muted=true;
    v.loop=true;

    v.addEventListener("loadedmetadata",()=>{
      v.currentTime=Math.random()*v.duration;
      play(v);
    });

    target.appendChild(v);
  }
}
build(leftSide);
build(rightSide);

/* grid 5줄 */
[10,30,50,70,90].forEach(p=>{
  const l=document.createElement("div");
  l.className="grid-line";
  l.style.left=p+"%";
  grid.appendChild(l);
});

/* 시계 */
const angles={
  aligning:30,
  waiting:60,
  executing:90,
  suppressing:120,
  drifting:150
};

function setHand(type){
  hand.style.transform=`translate(-50%,-100%) rotate(${angles[type]||180}deg)`;
}

/* 초침 */
function tick(){
  const d=new Date();
  hand2.style.transform=`translate(-50%,-100%) rotate(${d.getSeconds()*6}deg)`;
  requestAnimationFrame(tick);
}
tick();

/* 중앙 3열 */
const cols=[40,50,60];

COMMANDS.forEach(cmd=>{
  const el=document.createElement("div");
  el.className="command";

  const col=cols[Math.floor(Math.random()*3)];

  el.style.left=(window.innerWidth*(col/100))+"px";
  el.style.top=(600+Math.random()*5000)+"px";

  el.innerHTML=`
    <div class="cmd-id">#${cmd.id}</div>
    <div class="cmd-text">${cmd.text}</div>
    <div class="meta">${cmd.time}</div>
  `;

  el.onmouseenter=(e)=>{
    preview.style.display="block";

    let x=e.clientX+10;
    let y=e.clientY-80;

    if(x>window.innerWidth-240) x=e.clientX-240;
    if(y<20) y=20;

    preview.style.left=x+"px";
    preview.style.top=y+"px";

    if(!pv.src.includes(cmd.video)){
      pv.src="./videos/"+cmd.video;
      pv.load();
    }

    play(pv);
    clock.classList.add("active");
    setHand(cmd.time);
  };

  el.onmouseleave=()=>{
    preview.style.display="none";
    clock.classList.remove("active");
  };

  commands.appendChild(el);
});