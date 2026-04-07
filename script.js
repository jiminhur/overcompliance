/* ========================= */
/* 🔥 autoplay 완전 고정 */
/* ========================= */

function forcePlay(){
  document.querySelectorAll("video").forEach(v=>{
    v.muted = true;
    const tryPlay = ()=> v.play().catch(()=>{});
    tryPlay();
    setTimeout(tryPlay,300);
    setTimeout(tryPlay,800);
  });
}

window.addEventListener("load", forcePlay);


/* ========================= */
/* 기본 */
/* ========================= */

const leftSide = document.getElementById("leftSide");
const rightSide = document.getElementById("rightSide");
const commandsEl = document.getElementById("commands");
const ring = document.querySelector(".ring");


/* ========================= */
/* CCTV */
/* ========================= */

function buildSide(target){
  target.innerHTML="";

  for(let i=0;i<8;i++){
    const v=document.createElement("video");

    v.src="./videos/swipetounlock_1.mp4";
    v.muted=true;
    v.loop=true;
    v.autoplay=true;
    v.playsInline=true;

    v.addEventListener("loadeddata",()=>{
      v.currentTime=i*(0.2+Math.random()*0.2);
      v.play().catch(()=>{});
    });

    target.appendChild(v);
  }
}

buildSide(leftSide);
buildSide(rightSide);


/* ========================= */
/* commands */
/* ========================= */

function renderCommands(){
  commandsEl.innerHTML="";

  COMMANDS.forEach((cmd,i)=>{
    const el=document.createElement("div");
    el.className="command";

    const idx=String(i+1).padStart(2,"0");

    el.innerHTML=`
      <div class="cmd-index">#${idx}</div>
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time}</div>
    `;

    el.style.left=Math.random()*window.innerWidth+"px";
    el.style.top=Math.random()*8000+"px";

    /* 🔥 hover → 원 활성화 */
    el.addEventListener("mouseenter",()=>{
      ring.classList.add("active");
    });

    el.addEventListener("mouseleave",()=>{
      ring.classList.remove("active");
    });

    commandsEl.appendChild(el);
  });
}

renderCommands();


/* ========================= */
/* 🔥 전체 색 반전 */
/* ========================= */

document.body.addEventListener("mouseenter",()=>{
  document.body.classList.add("invert");
});

document.body.addEventListener("mouseleave",()=>{
  document.body.classList.remove("invert");
});