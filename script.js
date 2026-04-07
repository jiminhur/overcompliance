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
}/* ========================= */
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