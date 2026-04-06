(function () {
  const isIndex = document.getElementById("commands");
  const isDetail = document.getElementById("cube") && document.getElementById("counterBox");

  function placeClockLabels() {
    const labels = document.querySelectorAll(".clock-label");
    if (!labels.length) return;

    const cx = 240;
    const cy = 240;
    const r = 165;

    // ALL + 5 metadata = 6축, 180도 / 6 = 30도
    const angles = [0, 30, 60, 90, 120, 150];

    labels.forEach((label, i) => {
      const rad = angles[i] * Math.PI / 180;
      const x = cx + Math.cos(rad) * r;
      const y = cy - Math.sin(rad) * r;
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
    });
  }

  function drawGridLines() {
    const existing = document.querySelectorAll(".grid-line");
    existing.forEach(el => el.remove());

    const sideWidth = window.innerWidth * 0.125;
    const usableWidth = window.innerWidth - sideWidth * 2;
    const colWidth = usableWidth / 5;

    for (let i = 0; i < 6; i++) {
      const line = document.createElement("div");
      line.className = "grid-line";
      line.style.left = `${sideWidth + i * colWidth}px`;
      document.body.appendChild(line);
    }
  }

  function buildSideColumns() {
    const left = document.getElementById("leftSide");
    const right = document.getElementById("rightSide");
    if (!left || !right) return;

    function fill(container) {
      container.innerHTML = "";
      for (let i = 0; i < 8; i++) {
        const v = document.createElement("video");
        v.src = "./videos/swipetounlock_1.mp4";
        v.autoplay = true;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        container.appendChild(v);
      }
    }

    fill(left);
    fill(right);
  }

  function initIndex() {
    const introTitle = document.getElementById("introTitle");
    const hand = document.getElementById("hand");
    const hand2 = document.getElementById("hand2");
    const labels = Array.from(document.querySelectorAll(".clock-label"));
    const commandsEl = document.getElementById("commands");
    const thumbPreview = document.getElementById("thumbPreview");

    placeClockLabels();
    drawGridLines();
    buildSideColumns();

    window.addEventListener("resize", () => {
      placeClockLabels();
      drawGridLines();
      render(activeFilter);
    });

    setTimeout(() => {
      introTitle.classList.add("shrink");
    }, 1000);

    const typeAngles = {
      all: 0,
      waiting: 30,
      aligning: 60,
      executing: 90,
      suppressing: 120,
      drifting: 150
    };

    let activeFilter = "all";

    function setActiveFilter(type) {
      activeFilter = type;

      labels.forEach(label => {
        const same = label.dataset.type === type;
        if (same) {
          label.classList.add("active");
          label.classList.remove("dim");
        } else if (type === "all") {
          label.classList.remove("active");
          label.classList.remove("dim");
        } else {
          label.classList.remove("active");
          label.classList.add("dim");
        }
      });

      document.body.className = type === "all" ? "" : type;
      render(type);
      updateHands(typeAngles[type] ?? 0);
    }

    function updateHands(angle) {
      hand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
      hand2.style.transform = `translate(-50%, -100%) rotate(${angle * 2}deg)`;
    }

    labels.forEach(label => {
      label.addEventListener("click", () => {
        const type = label.dataset.type;
        setActiveFilter(type);
      });
    });

    function render(filter = "all") {
      commandsEl.innerHTML = "";

      const groups = {
        waiting: [],
        aligning: [],
        executing: [],
        suppressing: [],
        drifting: []
      };

      COMMANDS.forEach(cmd => {
        groups[cmd.time].push(cmd);
      });

      const keys = ["waiting", "aligning", "executing", "suppressing", "drifting"];
      const sideWidth = window.innerWidth * 0.125;
      const usableWidth = window.innerWidth - sideWidth * 2;
      const colWidth = usableWidth / 5;

      keys.forEach((key, colIndex) => {
        const list = groups[key];

        list.forEach((cmd, i) => {
          const el = document.createElement("div");
          el.className = "command";

          const isTarget = filter === "all" || cmd.time === filter;
          if (!isTarget) el.classList.add("dim");
          if (filter !== "all" && cmd.time === filter) el.classList.add("active-col");

          el.innerHTML = `
            <div class="command-text">${cmd.text}</div>
            <div class="meta">
              <span>${cmd.time}</span>
              <span>${cmd.context}</span>
              <span>${cmd.bodyEngagement}</span>
              <span>${cmd.action}</span>
              <span>${cmd.awareness}</span>
            </div>
          `;

          const x = sideWidth + colIndex * colWidth + colWidth / 2;
          const y = 220 + i * 130;

          el.style.left = `${x}px`;
          el.style.top = `${y}px`;
          el.style.transform = `translateX(-50%)`;

          el.onmouseenter = (e) => {
            thumbPreview.style.display = "block";
            thumbPreview.querySelector("video").src = `./videos/${cmd.video}`;
            thumbPreview.style.left = `${Math.min(window.innerWidth - 240, e.clientX + 18)}px`;
            thumbPreview.style.top = `${Math.max(24, e.clientY - 110)}px`;
            document.body.className = cmd.time;
          };

          el.onmousemove = (e) => {
            thumbPreview.style.left = `${Math.min(window.innerWidth - 240, e.clientX + 18)}px`;
            thumbPreview.style.top = `${Math.max(24, e.clientY - 110)}px`;
          };

          el.onmouseleave = () => {
            thumbPreview.style.display = "none";
            document.body.className = filter === "all" ? "" : filter;
          };

          el.onclick = () => {
            location.href = `detail.html?id=${cmd.id}`;
          };

          commandsEl.appendChild(el);
        });
      });
    }

    setActiveFilter("all");
  }

  function initDetail() {
    const params = new URLSearchParams(location.search);
    const id = Number(params.get("id") || 1);
    const cmd = COMMANDS.find(c => c.id === id) || COMMANDS[0];

    const cube = document.getElementById("cube");
    const frontVideo = document.getElementById("videoFront");
    const backVideo = document.getElementById("videoBack");
    const counterBox = document.getElementById("counterBox");
    const progressLeft = document.getElementById("progressLeft");
    const progressRight = document.getElementById("progressRight");
    const soundBtn = document.getElementById("soundBtn");
    const textBlocks = document.querySelectorAll(".text-block");

    let dense = "";
    for (let i = 0; i < 2000; i++) dense += `${cmd.text.toUpperCase()} `;
    textBlocks.forEach(b => b.textContent = dense);

    frontVideo.src = `./videos/${cmd.video}`;
    backVideo.src = `./videos/${cmd.video}`;

    function safePlay(v) {
      const p = v.play();
      if (p !== undefined) p.catch(() => {});
    }

    window.addEventListener("load", () => {
      safePlay(frontVideo);
      safePlay(backVideo);
    });

    const d = 400;
    const h = d / 2;

    document.querySelector(".front").style.transform = `translateZ(${h}px)`;
    document.querySelector(".back").style.transform = `rotateX(180deg) translateZ(${h}px)`;
    document.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${h}px)`;
    document.querySelector(".bottom").style.transform = `rotateX(-90deg) translateZ(${h}px)`;

    let rotateX = 0;
    let count = 0;

    function updateCounter() {
      const turns = Math.floor(Math.abs(rotateX) / 360);
      if (turns !== count) {
        count = turns;
        counterBox.innerText = String(count).padStart(2, "0");
        const maxWidth = 160;
        const width = Math.min(count * 35, maxWidth);
        progressLeft.style.width = `${width}px`;
        progressRight.style.width = `${width}px`;
      }
    }

    window.addEventListener("wheel", (e) => {
      rotateX += e.deltaY * 0.08;
      cube.style.transform = `rotateX(${rotateX}deg)`;
      updateCounter();
    });

    let muted = true;
    soundBtn.onclick = () => {
      muted = !muted;
      frontVideo.muted = muted;
      backVideo.muted = true;
      soundBtn.innerText = muted ? "SOUND OFF" : "SOUND ON";
    };
  }

  if (isIndex) initIndex();
  if (isDetail) initDetail();
})();