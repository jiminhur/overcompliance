const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");

/* sides 영상 */
function buildSideColumn(target){
  for(let i=0;i<8;i++){
    const v = document.createElement("video");
    v.src="./videos/swipetounlock_1.mp4";
    v.autoplay=true;
    v.muted=true;
    v.loop=true;
    v.playsInline=true;

    v.addEventListener("loadedmetadata",()=>{
      v.currentTime=i*0.2;
    });

    target.appendChild(v);
  }
}
buildSideColumn(leftSide);
buildSideColumn(rightSide);

/* grid */
for(let i=0;i<6;i++){
  const line=document.createElement("div");
  line.className="grid-line";
  line.style.left=`${(window.innerWidth/6)*i}px`;
  document.getElementById("grid").appendChild(line);
}

/* commands */
function renderCommands(){
  commandsEl.innerHTML="";

  COMMANDS.forEach((cmd,i)=>{
    const el=document.createElement("div");
    el.className="command";
    el.classList.add(`line-${(i%3)+1}`);
    el.style.top=`${window.innerHeight*0.55}px`;

    el.innerHTML=`
      <div>#${i+1}</div>
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    el.addEventListener("mouseenter",()=>{
      document.body.classList.add("invert");
      preview.style.display="block";
      preview.querySelector("video").src=`./videos/${cmd.video}`;
    });

    el.addEventListener("mouseleave",()=>{
      document.body.classList.remove("invert");
      preview.style.display="none";
    });

    commandsEl.appendChild(el);
  });
}

renderCommands();

/* autoplay 강제 */
function forcePlay(){
  document.querySelectorAll("video").forEach((v,i)=>{
    v.muted=true;
    v.play().catch(()=>{});
  });
}
window.addEventListener("load",forcePlay);

/* cube flow */
const frontVideo=document.querySelector(".front video");
const backVideo=document.querySelector(".back video");

backVideo.currentTime=0.4;

let flow=0;
function animate(){
  flow+=0.3;
  frontVideo.style.transform=`translateY(${flow}px)`;
  backVideo.style.transform=`translateY(${-flow}px)`;
  if(flow>300) flow=0;
  requestAnimationFrame(animate);
}
animate();