const logo = document.getElementById("logo");
const halo = document.getElementById("halo");
const bgTop = document.getElementById("bgTop");
const scene = document.getElementById("scene");
const camera = document.getElementById("camera");
const popup = document.getElementById("popup");

window.onload = () => {

  // 1. 로고 사라짐
  setTimeout(() => {
    logo.style.opacity = 0;
  }, 1500);

  // 2. halo 등장
  setTimeout(() => {
    halo.style.opacity = 1;
  }, 2500);

  // 3. background image 등장
  setTimeout(() => {
    bgTop.style.opacity = 1;
  }, 3500);

  // 4. 약관 등장 + 카메라 이동
  setTimeout(() => {
    scene.style.opacity = 1;

    camera.style.transform =
      "translate(-65%, -60%) scale(1.8)";
  }, 4500);

  // 5. 10초 후 팝업
  setTimeout(() => {
    popup.style.display = "block";
  }, 14500);
};