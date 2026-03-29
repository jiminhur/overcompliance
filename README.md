# overcompliance

<div class="scene">
  <div class="room" id="room">
    <div class="wall front">SWIPE TO UNLOCK</div>
    <div class="wall right">TRY AGAIN</div>
    <div class="wall floor">DO NOT CROSS THE LINE</div>
    <div class="wall ceiling">POSITION YOUR FACE WITHIN THE FRAME</div>
  </div>
</div>

body {
  margin: 0;
  height: 300vh;
  background: #fff;
  overflow-x: hidden;
  font-family: Arial, sans-serif;
}

.scene {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  perspective: 1200px;
  background: white;
}

.room {
  position: relative;
  width: 420px;
  height: 420px;
  transform-style: preserve-3d;
}

.wall {
  position: absolute;
  width: 420px;
  height: 420px;
  border: 1px solid #111;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  letter-spacing: 0.08em;
  background: rgba(227, 227, 227, 0.96);
  backface-visibility: hidden;
}

.front   { transform: translateZ(-210px); }
.right   { transform: rotateY(-90deg) translateZ(-210px); transform-origin: center; }
.floor   { transform: rotateX(90deg) translateZ(-210px); transform-origin: center; }
.ceiling { transform: rotateX(-90deg) translateZ(-210px); transform-origin: center; }

const room = document.getElementById("room");

window.addEventListener("scroll", () => {
  const t = window.scrollY;
  const ry = Math.min(t * 0.08, 35);
  const rx = Math.min(t * 0.04, 18);

  room.style.transform = `rotateX(${rx}deg) rotateY(${-ry}deg)`;
});