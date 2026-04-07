/* autoplay */
document.querySelectorAll("video").forEach(v=>{
  v.muted=true;
  v.play().catch(()=>{});
});

/* intro */
setTimeout(()=>{
  introTitle.classList.add("shrink");
},1000);

/* grid */
for(let i=0;i<24;i++){
  const l=document.createElement("div");
  l.className="grid-line";
  l.style.left=`${(i/24)*100}%`;
  grid.appendChild(l);
}

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

/* clock */
setInterval(()=>{
  const d=new Date();
  hand.style.transform=`translate(-50%,-100%) rotate(${d.getMinutes()*6}deg)`;
  hand2.style.transform=`translate(-50%,-100%) rotate(${d.getSeconds()*6}deg)`;
},1000);

/* commands */
const pv=preview.querySelector("video");

COMMANDS.forEach(cmd=>{
  const el=document.createElement("div");
  el.className="command";

  el.style.left=`${Math.random()*window.innerWidth}px`;
  el.style.top=`${500+Math.random()*5000}px`;

  el.innerHTML=`
    <div class="cmd-id">#${cmd.id}</div>
    <div class="cmd-text">${cmd.text}</div>
    <div class="meta-box">
      ${cmd.time} · ${cmd.context} · ${cmd.action}
    </div>
  `;

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
    document.querySelector(".clock").classList.add("active");
  };

  el.onmousemove=(e)=>{
    preview.style.left=(e.clientX+12)+"px";
    preview.style.top=(e.clientY-80)+"px";
  };

  el.onmouseleave=()=>{
    preview.style.display="none";
    document.querySelector(".clock").classList.remove("active");
  };

  commands.appendChild(el);
});

/* cube */
let angle=0;
function loop(){
  angle+=0.3;
  cube.style.transform=`rotateX(${angle}deg)`;
  requestAnimationFrame(loop);
}
loop();