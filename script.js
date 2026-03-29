const cube = document.getElementById("cube");
const video = document.getElementById("video");
const inner = document.getElementById("inner");

const counterBox = document.getElementById("counterBox");
const progressLeft = document.getElementById("progressLeft");
const progressRight = document.getElementById("progressRight");

/* TEXT */
const blocks = document.querySelectorAll(".text-block");

let text = "";
for(let i=0;i<2000;i++){
  text += "SWIPE TO UNLOCK ";
}
blocks.forEach(b=>b.textContent=text);

/* 3D */
const d = 400;
const h = d/2;

document.querySelector(".front").style.transform = `translateZ(${h}px)`;
document.querySelector(".back").style.transform = `rotateX(180deg) translateZ(${h}px)`;
document.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${h}px)`;
document.querySelector(".bottom").style.transform = `rotateX(-90deg) translateZ(${h}px)`;

/* ROTATION */
let rotateX = 0;
let count = 0;

function updateCounter(){
  const turns = Math.floor(Math.abs(rotateX)/360);

  if(turns !== count){
    count = turns;
    counterBox.innerText = String(count).padStart(2,"0");

    /* 더 빨리 차는 바 */
    const maxWidth = 160;
    const width = Math.min(count * 35, maxWidth);

    progressLeft.style.width = `${width}px`;
    progressRight.style.width = `${width}px`;
  }
}

window.addEventListener("wheel", e=>{
  rotateX += e.deltaY * 0.08;
  cube.style.transform = `rotateX(${rotateX}deg)`;
  updateCounter();
});

/* SOUND */
let muted = true;
document.getElementById("soundBtn").onclick = ()=>{
  muted = !muted;
  video.muted = muted;
  document.getElementById("soundBtn").innerText =
    muted ? "SOUND OFF" : "SOUND ON";
};

/* TRACE */
const words = ["SWIPE","UNLOCK","VERIFY","ACCESS","HOLD","WAIT"];

let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let lastT = performance.now();
let carry = 0;

function addTrace(x, y, text) {
  const el = document.createElement("div");
  el.className = "trace";
  el.innerText = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.opacity = "0";
    el.style.transform = `translateY(-26px)`;
  });

  setTimeout(() => {
    el.remove();
  }, 1900);
}

document.addEventListener("mousemove", e=>{
  const now = performance.now();
  const dt = Math.max(now - lastT, 16);

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const speed = Math.hypot(dx, dy) / dt;

  /* 이동 속도 따라 밀도 증가 */
  carry += Math.min(2.8, 0.6 + speed * 4.2);

  let burst = Math.floor(carry);
  carry -= burst;

  /* 너무 일정하지 않게 */
  if (Math.random() < 0.2) burst = Math.max(0, burst - 1);
  if (Math.random() < 0.12) burst += 2;

  burst = Math.min(burst, 8);

  const denom = Math.max(Math.abs(dx) + Math.abs(dy), 1);
  const dirX = dx / denom;
  const dirY = dy / denom;

  for(let i=0;i<burst;i++){
    /* 진행 방향을 따라 길게 남기기 */
    const along = Math.random() * 140;
    const side = (Math.random() - 0.5) * 46;

    const x =
      e.clientX -
      dirX * along +
      (-dirY) * side +
      (Math.random() - 0.5) * 14;

    const y =
      e.clientY -
      dirY * along +
      dirX * side +
      (Math.random() - 0.5) * 14;

    const word = words[Math.floor(Math.random() * words.length)];
    addTrace(x, y, word);
  }

  lastX = e.clientX;
  lastY = e.clientY;
  lastT = now;
});