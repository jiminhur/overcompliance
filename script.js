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

function renderCommands(){
  commandsEl.innerHTML = "";

  let lineIndex = 0;

  COMMANDS.forEach((cmd, i) => {

    const el = document.createElement("div");
    el.className = "command";

    /* 중앙 3줄 배치 */
    const line = (i % 3) + 1;
    el.classList.add(`line-${line}`);

    el.style.top = `${window.innerHeight * 0.55}px`;

    el.innerHTML = `
      <div>#${i+1}</div>
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context} · ${cmd.action}</div>
    `;

    /* 🔥 hover 시 전체 반전 */
    el.addEventListener("mouseenter", () => {
      document.body.classList.add("invert");
    });

    el.addEventListener("mouseleave", () => {
      document.body.classList.remove("invert");
    });

    /* preview */
    el.addEventListener("mouseenter", (e) => {
      preview.style.display = "block";
      preview.querySelector("video").src = `./videos/${cmd.video}`;
    });

    el.addEventListener("mouseleave", () => {
      preview.style.display = "none";
    });

    commandsEl.appendChild(el);
  });
}

/* ========================= */
/* FORCE AUTOPLAY (전체 영상) */
/* ========================= */

function forcePlayAllVideos(){
  const videos = document.querySelectorAll("video");

  videos.forEach((v,i) => {
    v.muted = true;
    v.playsInline = true;

    const playPromise = v.play();

    if(playPromise !== undefined){
      playPromise.catch(() => {
        setTimeout(() => v.play(), 300);
      });
    }

    /* 🔥 시간차 */
    v.addEventListener("loadedmetadata", () => {
      v.currentTime = (i * 0.15) % v.duration;
    });
  });
}

window.addEventListener("load", forcePlayAllVideos);