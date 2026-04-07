// =========================
// 기본 요소
// =========================

const introTitle = document.getElementById("introTitle");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.getElementById("previewVideo");

let currentFilter = "all";

// =========================
// intro
// =========================

setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);

// =========================
// grid
// =========================

function drawGrid(){
  grid.innerHTML = "";

  const cols = 24;

  for(let i = 0; i < cols; i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(i / cols) * 100}%`;
    grid.appendChild(line);
  }
}

drawGrid();
window.addEventListener("resize", drawGrid);

// =========================
// filter
// =========================

const filterButtons = document.querySelectorAll(".filter-chip");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    currentFilter = btn.dataset.type.toLowerCase();

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderCommands();
  });
});

// =========================
// commands
// =========================

function renderCommands(){

  commandsEl.innerHTML = "";

  COMMANDS.forEach(cmd => {

    const el = document.createElement("div");
    el.className = "command";

    const cmdType = (cmd.time || "").toLowerCase().trim();

    // 🔥 필터 적용
    if(currentFilter !== "all" && cmdType !== currentFilter){
      el.classList.add("dim");
    }

    // 위치 (랜덤 유지)
    el.style.left = `${Math.random()*70 + 15}%`;
    el.style.top = `${Math.random()*8000 + 300}px`;

    // 🔥 구조 (한 줄 + 아래 메타)
    el.innerHTML = `
      <div class="text">${cmd.text}</div>
      <div class="meta">${cmd.time} · ${cmd.context || ""} · ${cmd.action || ""}</div>
    `;

    // =========================
    // hover (영상 + 강조)
    // =========================

    el.addEventListener("mouseenter", (e) => {

      el.classList.add("active"); // 🔥 흐림 제거

      preview.style.display = "block";

      preview.style.left = `${Math.min(window.innerWidth - 230, e.clientX + 12)}px`;
      preview.style.top = `${Math.max(20, e.clientY - 90)}px`;

      const nextSrc = `./videos/${cmd.video}`;

      // 🔥 같은 영상이면 다시 로드 안함
      if(!previewVideo.src.includes(cmd.video)){
        previewVideo.src = nextSrc;
        previewVideo.load();
        previewVideo.play().catch(()=>{});
      }
    });

    el.addEventListener("mouseleave", () => {
      preview.style.display = "none";
      el.classList.remove("active");
    });

    commandsEl.appendChild(el);
  });
}

// 초기 실행
renderCommands();