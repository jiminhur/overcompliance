const container = document.getElementById("commands");

/* -----------------------------
   컬럼 위치 (딱 고정)
----------------------------- */
const columns = {
  drifting: 10,
  suppressing: 25,
  executing: 50,
  aligning: 70,
  waiting: 85
};

/* -----------------------------
   충돌 방지 Y 저장
----------------------------- */
const usedY = [];

/* -----------------------------
   랜덤 배치 함수
----------------------------- */
function getY(){
  let y, ok;
  do{
    y = Math.random()*4000 + 200;
    ok = true;
    for(let u of usedY){
      if(Math.abs(u - y) < 180){
        ok = false;
      }
    }
  }while(!ok);

  usedY.push(y);
  return y;
}

/* -----------------------------
   생성
----------------------------- */
commands.forEach(cmd=>{

  const el = document.createElement("div");
  el.className = "command";
  el.innerText = cmd.text;

  const x = columns[cmd.time];

  el.style.left = x + "%";
  el.style.top = getY() + "px";

  /* hover → 초침 이동 */
  el.onmouseenter = ()=>{
    targetAngle = angles[cmd.time];
  };

  container.appendChild(el);
});


/* -----------------------------
   시계
----------------------------- */
const hand = document.querySelector(".hand.blue");
const hand2 = document.querySelector(".hand.red");

const angles = {
  waiting: 30,
  aligning: 60,
  executing: 90,
  suppressing: 120,
  drifting: 150
};

let currentAngle = 0;
let targetAngle = 0;

function animate(){
  currentAngle += (targetAngle-currentAngle)*0.08;

  hand.style.transform =
    `translate(-50%,-100%) rotate(${currentAngle}deg)`;

  requestAnimationFrame(animate);
}
animate();

/* red */
let red=0;
function redMove(){
  red+=0.2;
  hand2.style.transform =
    `translate(-50%,-100%) rotate(${red}deg)`;
  requestAnimationFrame(redMove);
}
redMove();


/* -----------------------------
   intro
----------------------------- */
setTimeout(()=>{
  document.getElementById("intro").style.opacity=0;
},1500);