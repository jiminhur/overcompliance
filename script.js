const cube = document.getElementById("cube");
const video = document.getElementById("video");

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
const h = d / 2;

document.querySelector(".front").style.transform = `translateZ(${h}px)`;
document.querySelector(".back").style.transform = `rotateX(180deg) translateZ(${h}px)`;
document.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${h}px)`;
document.querySelector(".bottom").style.transform = `rotateX(-90deg) translateZ(${h}px)`;

/* ROTATION */
let rotateX = 0;
let count = 0;

function updateCounter(){
  const turns = Math.floor(Math.abs(rotateX) / 360);

  if(turns !== count){
    count = turns;
    counterBox.innerText = String(count).padStart(2,"0");

    /* 15회면 양쪽 바 끝까지 */
    const maxWidth = 160;
    const width = Math.min((count / 15) * maxWidth, maxWidth);

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
const words = ["SWIPE","UNLOCK","VERIFY","ACCESS"];

document.addEventListener("mousemove", e=>{
  if(Math.random() > 0.6){
    const el = document.createElement("div");
    el.className = "trace";
    el.innerText = words[Math.floor(Math.random()*words.length)];

    el.style.left = e.clientX + "px";
    el.style.top = e.clientY + "px";

    document.body.appendChild(el);

    setTimeout(()=>{
      el.style.opacity = 0;
    },200);

    setTimeout(()=>{
      el.remove();
    },900);
  }
});