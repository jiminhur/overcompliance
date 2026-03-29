const screenInner = document.getElementById("screenInner");
const progressText = document.getElementById("progressText");
const stage = document.querySelector(".stage");

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScene() {
  const stageTop = stage.offsetTop;
  const stageHeight = stage.offsetHeight - window.innerHeight;
  const scrollY = window.scrollY;

  const progress = clamp((scrollY - stageTop) / stageHeight, 0, 1);

  // 진행률 텍스트
  const percent = String(Math.round(progress * 100)).padStart(3, "0");
  progressText.textContent = `${percent}%`;

  // 처음에는 거의 평면처럼 보이게
  // 스크롤하면 안쪽 공간이 점점 드러남
  const rotateX = -2 - progress * 18;
  const rotateY = progress * 24 - 12;
  const translateZ = -progress * 120;
  const scale = 1 + progress * 0.02;

  screenInner.style.transform = `
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    translateZ(${translateZ}px)
    scale(${scale})
  `;
}

window.addEventListener("scroll", updateScene, { passive: true });
window.addEventListener("resize", updateScene);
window.addEventListener("load", updateScene);