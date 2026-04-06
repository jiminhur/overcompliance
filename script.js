const container = document.getElementById("commands");

/* 컬럼 위치 */
const columns = {
  drifting: 10,
  suppressing: 25,
  executing: 50,
  aligning: 75,
  waiting: 90
};

/* GRID 생성 */
Object.values(columns).forEach(x=>{
  const line = document.createElement("div");
  line.className = "grid-line";
  line.style.left = x + "%";
  document.getElementById("grid").appendChild(line);
});

/* 충돌 방지 */
const usedY = [];

function getY(){
  let y, ok;
  do{
    y = Math.random()*4000 + 200;
    ok = true;
    for(let u of usedY){
      if(Math.abs(u - y) < 150) ok=false;
    }
  }while(!ok);

  usedY.push(y);
  return y;
}

/* 생성 */
commands.forEach(cmd=>{
  const el = document.createElement("div");
  el.className = "command";
  el.innerText = cmd.text;

  el.style.left = columns[cmd.time] + "%";
  el.style.top = getY() + "px";

  el.onmouseenter = ()=>{
    targetAngle = angles[cmd.time];
  };

  container.appendChild(el);
});

/* 시계 */
const hand = document.querySelector(".blue");
const yellow = document.querySelector(".yellow");

const angles = {
  waiting:30,
  aligning:60,
  executing:90,
  suppressing:120,
  drifting:150
};

let currentAngle=0;
let targetAngle=0;

function animate(){
  currentAngle += (targetAngle-currentAngle)*0.08;
  hand.style.transform =
    `translate(-50%,-100%) rotate(${currentAngle}deg)`;
  requestAnimationFrame(animate);
}
animate();

/* 노란 */
let yAngle=0;
function yellowMove(){
  yAngle += 0.05;
  yellow.style.transform =
    `translate(-50%,-100%) rotate(${yAngle}deg)`;
  requestAnimationFrame(yellowMove);
}
yellowMove();

/* SIDE VIDEO */
for(let i=0;i<8;i++){
  const v1 = document.createElement("video");
  v1.src="./video.mp4";
  v1.autoplay=true;
  v1.loop=true;
  v1.muted=true;

  const v2 = v1.cloneNode(true);

  document.querySelector(".left").appendChild(v1);
  document.querySelector(".right").appendChild(v2);
}

/* intro */
setTimeout(()=>{
  document.getElementById("intro").style.opacity=0;
},1500);