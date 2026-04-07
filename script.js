const introTitle = document.getElementById("introTitle");
const grid = document.getElementById("grid");
const commandsEl = document.getElementById("commands");
const preview = document.getElementById("preview");
const previewVideo = document.getElementById("previewVideo");

let currentFilter = "all";

/* intro */
setTimeout(() => {
  introTitle.classList.add("shrink");
}, 1000);

/* grid */
function drawGrid(){
  for(let i = 0; i < 24; i++){
    const line = document.createElement("div");
    line.className = "grid-line";
    line.style.left = `${(i / 24) * 100}%`;
    grid.appendChild(line);
  }
}
drawGrid();

/* filter */
const filterButtons = document.querySelectorAll(".filter-chip");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {

    currentFilter = btn.dataset.type.toLowerCase();

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderCommands();
  });
});

/* commands */
function renderCommands(){

  commandsEl.innerHTML = "";

  COMMANDS.forEach(cmd => {

    const el = document.createElement("div");
    el.className = "command";

    const cmdType = cmd.time.toLowerCase().trim();

    if(currentFilter !== "all" && cmdType !== currentFilter){
      el.classList.add("dim");
    }

    el.style.left = `${Math.random()*70 + 15}%`;
    el.style.top = `${Math.random()*8000 + 300}px`;

    el.innerHTML = `
      <div>${cmd.text}</div>
      <div class="meta">${cmd.time}</div>
    `;

    /* hover video */
    el.addEventListener("mouseenter", (e) => {

      preview.style.display = "block";

      preview.style.left = e.clientX + 10 + "px";
      preview.style.top = e.clientY - 80 + "px";

      const src = `./videos/${cmd.video}`;

      if(!previewVideo.src.includes(cmd.video)){
        previewVideo.src = src;
        previewVideo.load();
        previewVideo.play();
      }
    });

    el.addEventListener("mouseleave", () => {
      preview.style.display = "none";
    });

    commandsEl.appendChild(el);
  });
}

renderCommands();