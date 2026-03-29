const room = document.getElementById("room");
const progressBar = document.querySelector(".page-progress");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function updateScene() {
  const scrollY = window.scrollY;
  const hero = document.getElementById("hero");
  const heroHeight = hero.offsetHeight - window.innerHeight;

  const progress = clamp(scrollY / heroHeight, 0, 1);

  // progress bar
  progressBar.style.width = `${(scrollY / (document.body.scrollHeight - window.innerHeight)) * 100}%`;

  // 3D room movement
  // 처음에는 정면, 스크롤할수록 안쪽을 들여다보는 느낌
  const rotateX = -8 - progress * 18;   // 위아래 회전
  const rotateY = progress * 28 - 14;   // 좌우 회전
  const translateZ = -progress * 140;   // 안으로 들어가는 느낌
  const scale = 1 + progress * 0.06;    // 약간 확대

  room.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateZ(${translateZ}px)
    scale(${scale})
  `;
}

window.addEventListener("scroll", updateScene, { passive: true });
window.addEventListener("resize", updateScene);
window.addEventListener("load", updateScene);