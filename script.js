/* 🔥 영상 자동재생 */
window.addEventListener("load", () => {
  document.querySelectorAll("video").forEach(v => {
    v.muted = true;
    v.play().catch(()=>{});
  });
});

/* 큐브 */
const frontVideo = document.getElementById("frontVideo");
const backVideo = document.getElementById("backVideo");
const cubeScene = document.getElementById("cubeScene");

frontVideo.style.top = "0%";
backVideo.style.top = "-50%";

backVideo.addEventListener("loadedmetadata", () => {
  backVideo.currentTime = 0.3;
});

/* 등장 */
window.addEventListener("scroll", () => {
  const trigger = document.body.scrollHeight - window.innerHeight - 500;
  cubeScene.classList.toggle("active", window.scrollY > trigger);
});

/* 흐름 */
let flow = 0;
function animate(){
  flow += 0.15;

  frontVideo.style.transform = `translateY(${flow}px)`;
  backVideo.style.transform = `translateY(${-flow}px)`;

  if(flow > 200) flow = 0;

  requestAnimationFrame(animate);
}
animate();

/* counter */
let count = 0;

window.addEventListener("wheel", (e)=>{
  const trigger = document.body.scrollHeight - window.innerHeight - 500;

  if(window.scrollY > trigger){
    count += Math.abs(e.deltaY * 0.03);

    const n = Math.floor(count);

    document.getElementById("count").textContent = String(n).padStart(2,"0");

    const w = Math.min(n * 6, 160);
    document.getElementById("progressLeft").style.width = w+"px";
    document.getElementById("progressRight").style.width = w+"px";
  }
});

/* speaker */
const toggle = document.getElementById("soundToggle");
let soundOn = false;

toggle.addEventListener("click", ()=>{
  soundOn = !soundOn;

  document.querySelectorAll(".cube video").forEach(v=>{
    v.muted = !soundOn;
  });

  toggle.textContent = soundOn ? "speaker on" : "speaker off";
});