/* autoplay 안정 */
document.querySelectorAll("video").forEach(v=>{
  v.muted=true;
  v.play().catch(()=>{});
});

/* intro */
setTimeout(()=>{
  document.getElementById("introTitle").classList.add("shrink");
},1000);

/* grid */
const grid=document.getElementById("grid");
for(let i=0;i<24;i++){
  const l=document.createElement("div");
  l.className="grid-line";
  l.style.left=`${(i/24)*100}%`;
  grid.appendChild(l);
}

/* sides */
function build(target){
  for(let i=0;i<8;i++){
    const v=document.createElement("video");
    v.src="./videos/swipetounlock_1.mp4";
    v.muted=true;v.loop=true;

    v.addEventListener("loadedmetadata",()=>{
      v.currentTime=Math.random()*v.duration;
      v.play();
    });

    target.appendChild(v);
  }
}
build(leftSide);
build(rightSide);

/* clock */
const hand=document.getElementById("hand");
const hand2=document.getElementById("hand2");

setInterval(()=>{
  const d=new Date();
  hand.style.transform=`translate(-50%,-100%) rotate(${d.getMinutes()*6}deg)`;
  hand2.style.transform=`translate(-50%,-100%) rotate(${d.getSeconds()*6}deg)`;
},1000);

/* commands */
const commandsEl=document.getElementById("commands");
const preview=document.getElementById("preview");
const pv=preview.querySelector("video");
const clock=document.querySelector(".clock");

COMMANDS.forEach(cmd=>{
  const el=document.createElement("div");
  el.className="command";

  const id=String(cmd.id).padStart(2,"0");

  el.style.left=`${Math.random()*window.innerWidth}px`;
  el.style.top=`${500+Math.random()*5000}px`;

  el.innerHTML=`
    <div class="cmd-id">#${id}</div>
    <div class="cmd-text">${cmd.text}</div>
    <div class="meta-box">
      ${cmd.time} · ${cmd.context} · ${cmd.action}
    </div>
  `;

  el.onmouseenter=(e)=>{
    preview.style.display="block";
    preview.style.left=e.clientX+"px";
    preview.style.top=e.clientY+"px";

    if(!pv.src.includes(cmd.video)){
      pv.src="./videos/"+cmd.video;
      pv.load();
    }
    pv.play();

    clock.classList.add("active");
  };

  el.onmouseleave=()=>{
    preview.style.display="none";
    clock.classList.remove("active");
  };

  commandsEl.appendChild(el);
});

/* cube */
const cube=document.getElementById("cube");
let angle=0;

function loop(){
  angle+=0.3;
  cube.style.transform=`rotateX(${angle}deg)`;
  requestAnimationFrame(loop);
}
loop();