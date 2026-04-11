/* ═══════════════════════════════════════════════════════════
   TERMS AND CONDITIONS — script.js
   Interactive system for visual communication design project
   ═══════════════════════════════════════════════════════════ */
 
// ─── DATASET ───────────────────────────────────────────────
const dataset = [
  { id: 1,  category: "align",   groupLabel: "Align",   en: "When crossing a street, steps follow only one selected color.",                                          video: "video1.mp4"  },
  { id: 2,  category: "align",   groupLabel: "Align",   en: "Movement aligns in a single direction within a flow. — Keep right.",                                     video: "video2.mp4"  },
  { id: 3,  category: "align",   groupLabel: "Align",   en: "Position is adjusted to remain behind a marked line. — Please stand behind the line.",                    video: "video3.mp4"  },
  { id: 4,  category: "align",   groupLabel: "Align",   en: "The face aligns precisely within the frame indicated on screen. — Position your face within the frame.",  video: "video4.mp4"  },
  { id: 5,  category: "input",   groupLabel: "Input",   en: "Following on-screen instructions, a finger swipes upward to unlock. — Swipe up to unlock.",              video: "video5.mp4"  },
  { id: 6,  category: "input",   groupLabel: "Input",   en: "A password is entered to gain access. — Enter your password",                                            video: "video6.mp4"  },
  { id: 7,  category: "input",   groupLabel: "Input",   en: "System entry proceeds by accepting cookies. — Accept all cookies",                                       video: "video7.mp4"  },
  { id: 8,  category: "input",   groupLabel: "Input",   en: "The door is operated without reading the instruction. — Push / Pull.",                                    video: "video8.mp4"  },
  { id: 9,  category: "select",  groupLabel: "Select",  en: "Specific objects are selected within an image. — Select all images with traffic lights.",                 video: "video9.mp4"  },
  { id: 10, category: "select",  groupLabel: "Select",  en: "Personal items are placed in a designated area. — Place your items in the tray.",                         video: "video10.mp4" },
  { id: 11, category: "select",  groupLabel: "Select",  en: "Within given options, a single answer is selected. — Select the correct answer.",                         video: "video11.mp4" },
  { id: 12, category: "loop",    groupLabel: "Loop",    en: "The screen is tapped multiple times when there is no response. — Processing…",                           video: "video12.mp4" },
  { id: 13, category: "loop",    groupLabel: "Loop",    en: "The elevator button is pressed repeatedly before it responds. — Press the button once.",                  video: "video13.mp4" },
  { id: 14, category: "loop",    groupLabel: "Loop",    en: "The same action is repeated after failure. — Try again.",                                                 video: "video14.mp4" },
  { id: 15, category: "loop",    groupLabel: "Loop",    en: "When access is denied, attempts are repeated. — Access denied",                                          video: "video15.mp4" },
  { id: 16, category: "control", groupLabel: "Control", en: "Before the signal changes, the body leans forward in anticipation of movement.",                          video: "video16.mp4" },
  { id: 17, category: "control", groupLabel: "Control", en: "A progress bar is watched as it fills toward completion. — Saving...",                                    video: "video17.mp4" },
  { id: 18, category: "control", groupLabel: "Control", en: "In quiet spaces, sound is held back. — Keep quiet.",                                                     video: "video18.mp4" },
  { id: 19, category: "control", groupLabel: "Control", en: "Movement is paused and held in place. — Do not move",                                                    video: "video19.mp4" },
  { id: 20, category: "control", groupLabel: "Control", en: "When a surveillance camera is present, movement shifts to avoid its gaze. — Recording in progress",       video: "video20.mp4" },
  { id: 21, category: "control", groupLabel: "Control", en: "The connection status is monitored through fluctuating signals.",                                         video: "video21.mp4" },
  { id: 22, category: "edge",    groupLabel: "Edge",    en: "A fictional exit button is drawn on the wall. — (no command)",                                            video: "video22.mp4" },
  { id: 23, category: "edge",    groupLabel: "Edge",    en: "With no device present, typing continues in empty space.",                                                video: "video23.mp4" },
  { id: 24, category: "edge",    groupLabel: "Edge",    en: "An impulse emerges to overturn everything at once. — (no command)",                                       video: "video24.mp4" },
];
 
// ─── CONSTANTS ─────────────────────────────────────────────
const CATEGORIES  = ["align", "input", "select", "loop", "control", "edge"];
const CAT_COLORS  = { align: "#FF6B4A", input: "#4AE0FF", select: "#FFD94A", loop: "#B44AFF", control: "#4AFF8B", edge: "#FF4A8B" };
const SVG_W       = 3200;
const SVG_H       = 2200;
const NS          = "http://www.w3.org/2000/svg";
const CMD_DURATION = 12000; // 12 seconds per command
 
// ─── STATE ─────────────────────────────────────────────────
let currentView    = "main";
let activeCategory = null;
let time           = 0;
let mouseX         = 0;
let mouseY         = 0;
let mouseVX        = 0;
let mouseVY        = 0;
let prevMouseX     = 0;
let prevMouseY     = 0;
 
// Camera state
let currentVB      = { x: 0, y: 0, w: SVG_W, h: SVG_H };
let targetVB       = { x: 0, y: 0, w: SVG_W, h: SVG_H };
let currentRot     = 0;
let targetRot      = 0;
 
// Sequence state
let seqTimer       = null;
let seqSegIdx      = 0;
let seqProgress    = 0; // 0–1 within current segment
let seqPlaying     = false;
 
// Per-category data
const catData   = {};
const catPaths  = {};
const catGroups = {};
const catPerturb = {};
 
// Cursor force: stored displacement per category group
const catForceOffsets = {};
 
// DOM refs
const svgEl       = document.getElementById("svg-canvas");
const rotWrapper  = document.getElementById("rotation-wrapper");
const cursorRing  = document.getElementById("cursor-ring");
 
// ─── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(MotionPathPlugin);
  groupByCategory();
  buildSVG();
  bindEvents();
  animate();
  setTimeout(() => document.getElementById("loading").classList.add("hidden"), 2000);
});
 
function groupByCategory() {
  CATEGORIES.forEach(cat => {
    catData[cat] = dataset.filter(d => d.category === cat);
    catPerturb[cat] = { x: 0, y: 0, vx: 0, vy: 0 };
    catForceOffsets[cat] = { x: 0, y: 0 };
  });
}
 
// ─── PATH GENERATION ───────────────────────────────────────
// Each category gets a unique irregular organic spiral
function generatePath(ci, itemCount) {
  const cols = 3, rows = 2;
  const col = ci % cols, row = Math.floor(ci / cols);
  const cellW = SVG_W / cols, cellH = SVG_H / rows;
  const cx = cellW * col + cellW * 0.5;
  const cy = cellH * row + cellH * 0.5;
  const radius = Math.min(cellW, cellH) * 0.4;
 
  const shapes = [
    { loops: 3.8, xW: 0.30, yW: 0.55, freq: 9,  amp: 0.22 },
    { loops: 2.8, xW: 0.50, yW: 0.40, freq: 6,  amp: 0.25 },
    { loops: 4.2, xW: 0.20, yW: 0.70, freq: 11, amp: 0.18 },
    { loops: 3.0, xW: 0.45, yW: 0.35, freq: 7,  amp: 0.30 },
    { loops: 3.5, xW: 0.35, yW: 0.50, freq: 8,  amp: 0.20 },
    { loops: 2.5, xW: 0.55, yW: 0.60, freq: 5,  amp: 0.35 },
  ];
  const s = shapes[ci];
  const segments = itemCount * 6 + 8;
  const points = [];
 
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * s.loops + ci * 1.3;
    const spiralR = radius * (0.1 + t * 0.9);
    const wobble = 1 + s.amp * Math.sin(t * s.freq + ci * 2.7);
    const r = spiralR * wobble;
    const xStr = 1 + s.xW * Math.sin(t * 3.5 + ci * 0.8);
    const yStr = s.yW + 0.3 * Math.cos(t * 4.2 + ci * 1.6);
    const jx = Math.sin(t * 17 + ci * 5.3) * radius * 0.04;
    const jy = Math.cos(t * 13 + ci * 3.7) * radius * 0.04;
    points.push({
      x: cx + Math.cos(angle) * r * xStr + jx,
      y: cy + Math.sin(angle) * r * yStr + jy
    });
  }
 
  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[Math.min(points.length - 1, i + 1)];
    const prev = points[Math.max(0, i - 2)];
    const T = 0.33;
    d += ` C ${(p0.x + (p1.x - prev.x) * T).toFixed(1)} ${(p0.y + (p1.y - prev.y) * T).toFixed(1)}, ` +
             `${(p1.x - (p2.x - p0.x) * T).toFixed(1)} ${(p1.y - (p2.y - p0.y) * T).toFixed(1)}, ` +
             `${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }
  return d;
}
 
// ─── BUILD SVG ─────────────────────────────────────────────
function buildSVG() {
  svgEl.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
  svgEl.innerHTML = "";
 
  const defs = document.createElementNS(NS, "defs");
  svgEl.appendChild(defs);
 
  CATEGORIES.forEach((cat, ci) => {
    const items = catData[cat];
    const pathD = generatePath(ci, items.length);
    const pathId = `path-${cat}`;
 
    // Path in defs
    const pathDef = document.createElementNS(NS, "path");
    pathDef.setAttribute("id", pathId);
    pathDef.setAttribute("d", pathD);
    defs.appendChild(pathDef);
 
    // Group
    const g = document.createElementNS(NS, "g");
    g.setAttribute("class", "cat-group");
    g.setAttribute("data-cat", cat);
 
    // Visible path stroke
    const vis = document.createElementNS(NS, "path");
    vis.setAttribute("d", pathD);
    vis.setAttribute("class", "cat-path-vis");
    vis.setAttribute("stroke", CAT_COLORS[cat]);
    g.appendChild(vis);
 
    // Hit area
    const hit = document.createElementNS(NS, "path");
    hit.setAttribute("d", pathD);
    hit.setAttribute("class", "cat-hit");
    g.appendChild(hit);
 
    // Text along path with ● separators
    const textEl = document.createElementNS(NS, "text");
    textEl.setAttribute("fill", CAT_COLORS[cat]);
    textEl.setAttribute("fill-opacity", "0.9");
    textEl.setAttribute("font-family", "'DM Sans', sans-serif");
    textEl.setAttribute("font-size", "16");
    textEl.setAttribute("font-weight", "400");
    textEl.setAttribute("letter-spacing", "0.6");
 
    const tp = document.createElementNS(NS, "textPath");
    tp.setAttribute("href", `#${pathId}`);
    tp.setAttribute("startOffset", "2%");
 
    let fullText = "";
    items.forEach((item, idx) => {
      if (idx > 0) fullText += "   ●   ";
      fullText += `${String(item.id).padStart(2, "0")} — ${item.en}`;
    });
    tp.textContent = fullText;
    textEl.appendChild(tp);
    g.appendChild(textEl);
 
    // Category label (serif, italic)
    const labelEl = document.createElementNS(NS, "text");
    labelEl.setAttribute("fill", CAT_COLORS[cat]);
    labelEl.setAttribute("fill-opacity", "0.25");
    labelEl.setAttribute("font-family", "'Playfair Display', serif");
    labelEl.setAttribute("font-size", "12");
    labelEl.setAttribute("font-style", "italic");
    labelEl.setAttribute("letter-spacing", "3");
    const labelTp = document.createElementNS(NS, "textPath");
    labelTp.setAttribute("href", `#${pathId}`);
    labelTp.setAttribute("startOffset", "0%");
    labelTp.textContent = items[0].groupLabel;
    labelEl.appendChild(labelTp);
    g.appendChild(labelEl);
 
    svgEl.appendChild(g);
 
    catGroups[cat] = g;
    catPaths[cat] = { pathId, pathD, items, pathEl: pathDef, textEl, tp };
 
    // Click → enter category
    g.addEventListener("click", () => {
      if (currentView === "main") enterCategory(cat);
    });
  });
 
  // Add separator nodes after render
  requestAnimationFrame(addSeparatorNodes);
}
 
function addSeparatorNodes() {
  CATEGORIES.forEach(cat => {
    const pd = catPaths[cat];
    const pathEl = pd.pathEl;
    const totalLen = pathEl.getTotalLength();
    const items = pd.items;
    const segLen = totalLen / items.length;
    pd.segmentMids = [];
 
    for (let i = 0; i < items.length; i++) {
      pd.segmentMids.push(segLen * i + segLen * 0.5);
 
      if (i < items.length - 1) {
        const sepLen = segLen * (i + 1);
        const sepPt = pathEl.getPointAtLength(Math.min(sepLen, totalLen));
 
        // Filled circle
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", sepPt.x);
        c.setAttribute("cy", sepPt.y);
        c.setAttribute("r", "5");
        c.setAttribute("fill", CAT_COLORS[cat]);
        c.setAttribute("fill-opacity", "0.3");
        c.setAttribute("class", "sep-node");
        catGroups[cat].appendChild(c);
 
        // Outer ring
        const r = document.createElementNS(NS, "circle");
        r.setAttribute("cx", sepPt.x);
        r.setAttribute("cy", sepPt.y);
        r.setAttribute("r", "9");
        r.setAttribute("fill", "none");
        r.setAttribute("stroke", CAT_COLORS[cat]);
        r.setAttribute("stroke-width", "0.5");
        r.setAttribute("stroke-opacity", "0.15");
        catGroups[cat].appendChild(r);
      }
    }
  });
}
 
// ─── CURSOR FORCE SYSTEM ───────────────────────────────────
// Computes repulsion force on each category group based on cursor proximity
function computeCursorForce() {
  if (currentView !== "main") return;
 
  // Convert screen mouse to SVG coordinates
  const rect = svgEl.getBoundingClientRect();
  const scaleX = currentVB.w / rect.width;
  const scaleY = currentVB.h / rect.height;
  const svgMX = currentVB.x + mouseX * scaleX;
  const svgMY = currentVB.y + mouseY * scaleY;
 
  // Cursor speed magnitude
  const speed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
  const forceMultiplier = Math.min(speed * 0.3, 8); // stronger with fast movement
 
  CATEGORIES.forEach((cat, ci) => {
    const cols = 3, rows = 2;
    const col = ci % cols, row = Math.floor(ci / cols);
    const cellW = SVG_W / cols, cellH = SVG_H / rows;
    const ocx = cellW * col + cellW * 0.5;
    const ocy = cellH * row + cellH * 0.5;
 
    const dx = ocx - svgMX;
    const dy = ocy - svgMY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const threshold = 400;
 
    const fo = catForceOffsets[cat];
 
    if (dist < threshold) {
      const strength = (1 - dist / threshold) * (2 + forceMultiplier);
      const nx = dx / (dist || 1);
      const ny = dy / (dist || 1);
      // Push away sharply
      fo.x += nx * strength * 1.8;
      fo.y += ny * strength * 1.8;
    }
 
    // Spring return (slower than push = snappy feel)
    fo.x *= 0.92;
    fo.y *= 0.92;
  });
}
 
// ─── ENTER CATEGORY ────────────────────────────────────────
function enterCategory(cat) {
  currentView = "inside";
  activeCategory = cat;
  seqSegIdx = 0;
  seqProgress = 0;
  seqPlaying = true;
 
  document.getElementById("hero").classList.add("hidden");
  document.getElementById("back-btn").classList.add("visible");
  document.getElementById("scroll-hint").classList.add("visible");
  document.getElementById("seg-info").classList.add("visible");
 
  // Fade out other categories fast
  CATEGORIES.forEach(c => {
    if (c !== cat) {
      catGroups[c].style.transition = "opacity 0.35s ease";
      catGroups[c].style.opacity = "0";
      setTimeout(() => { catGroups[c].style.display = "none"; }, 350);
    }
  });
 
  // Enlarge text for immersive reading
  const pd = catPaths[cat];
  pd.textEl.setAttribute("font-size", "28");
  pd.textEl.setAttribute("fill-opacity", "0.95");
  pd.textEl.setAttribute("font-weight", "500");
 
  // Dramatic zoom to start of path
  const startPt = pd.pathEl.getPointAtLength(0);
  const zoom = 12;
  targetVB = {
    x: startPt.x - SVG_W / zoom / 2,
    y: startPt.y - SVG_H / zoom / 2,
    w: SVG_W / zoom,
    h: SVG_H / zoom
  };
 
  // Initial rotation from path direction
  const ahead = pd.pathEl.getPointAtLength(30);
  const initAngle = Math.atan2(ahead.y - startPt.y, ahead.x - startPt.x) * (180 / Math.PI);
  targetRot = -initAngle * 0.4;
 
  // Start auto-advance sequence
  startSequence(cat);
 
  // Show first video
  showVideoForItem(catData[cat][0]);
}
 
// ─── EXIT CATEGORY ─────────────────────────────────────────
function exitCategory() {
  if (!activeCategory) return;
 
  const pd = catPaths[activeCategory];
  pd.textEl.setAttribute("font-size", "16");
  pd.textEl.setAttribute("fill-opacity", "0.9");
  pd.textEl.setAttribute("font-weight", "400");
 
  currentView = "main";
  activeCategory = null;
  targetRot = 0;
  seqPlaying = false;
  clearInterval(seqTimer);
 
  document.getElementById("hero").classList.remove("hidden");
  document.getElementById("back-btn").classList.remove("visible");
  document.getElementById("scroll-hint").classList.remove("visible");
  document.getElementById("seg-info").classList.remove("visible");
  hideVideo();
 
  CATEGORIES.forEach(c => {
    catGroups[c].style.display = "";
    requestAnimationFrame(() => {
      catGroups[c].style.transition = "opacity 0.6s ease";
      catGroups[c].style.opacity = "1";
    });
  });
 
  targetVB = { x: 0, y: 0, w: SVG_W, h: SVG_H };
}
 
document.getElementById("back-btn").addEventListener("click", exitCategory);
 
// ─── AUTO-ADVANCE SEQUENCE ─────────────────────────────────
function startSequence(cat) {
  const items = catData[cat];
  seqSegIdx = 0;
  seqProgress = 0;
 
  // Use GSAP ticker for smooth sub-frame progress
  // Each command gets CMD_DURATION ms
  // Total progress 0→1 over all items
}
 
// ─── ANIMATION LOOP ────────────────────────────────────────
function animate() {
  time += 0.007;
  requestAnimationFrame(animate);
 
  // Mouse velocity
  mouseVX = mouseX - prevMouseX;
  mouseVY = mouseY - prevMouseY;
  prevMouseX = mouseX;
  prevMouseY = mouseY;
 
  // Cursor force
  computeCursorForce();
 
  // ViewBox interpolation
  const vbEase = currentView === "inside" ? 0.065 : 0.055;
  currentVB.x += (targetVB.x - currentVB.x) * vbEase;
  currentVB.y += (targetVB.y - currentVB.y) * vbEase;
  currentVB.w += (targetVB.w - currentVB.w) * vbEase;
  currentVB.h += (targetVB.h - currentVB.h) * vbEase;
  svgEl.setAttribute("viewBox",
    `${currentVB.x.toFixed(1)} ${currentVB.y.toFixed(1)} ${currentVB.w.toFixed(1)} ${currentVB.h.toFixed(1)}`
  );
 
  // Rotation interpolation
  const rotEase = currentView === "inside" ? 0.045 : 0.03;
  currentRot += (targetRot - currentRot) * rotEase;
  rotWrapper.style.transform = `rotate(${currentRot.toFixed(2)}deg)`;
 
  // Update cursor ring position
  cursorRing.style.left = mouseX + "px";
  cursorRing.style.top = mouseY + "px";
 
  if (currentView === "main") {
    animateMain();
  } else {
    animateInside();
  }
}
 
// ─── MAIN SCREEN ANIMATION ────────────────────────────────
function animateMain() {
  CATEGORIES.forEach((cat, ci) => {
    const g = catGroups[cat];
    const p = catPerturb[cat];
    const fo = catForceOffsets[cat];
 
    // Spring-back from drag perturbation
    p.vx += -p.x * 0.02;
    p.vy += -p.y * 0.02;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.x += p.vx;
    p.y += p.vy;
 
    // Multi-layer organic motion
    const t1 = time * 0.55 + ci * 1.5;
    const t2 = time * 0.85 + ci * 0.8;
    const t3 = time * 1.3  + ci * 2.3;
    const t4 = time * 0.35 + ci * 3.1;
 
    const dx = Math.sin(t1) * 8 + Math.sin(t2) * 5 + Math.cos(t3) * 3 + Math.sin(t4) * 2 + p.x + fo.x;
    const dy = Math.cos(t1 * 0.7) * 7 + Math.sin(t2 * 1.2) * 4 + Math.sin(t3 * 0.5) * 2.5 + Math.cos(t4 * 0.8) * 1.5 + p.y + fo.y;
 
    // Breathing + rotation
    const scale = 1 + Math.sin(time * 0.28 + ci * 1.2) * 0.012 + Math.sin(time * 0.6 + ci * 0.7) * 0.005;
    const rot = Math.sin(time * 0.22 + ci * 1.8) * 0.8 + Math.sin(time * 0.5 + ci * 2.5) * 0.3;
 
    // Mouse parallax
    const depth = 0.5 + ci * 0.15;
    const mx = (mouseX - window.innerWidth / 2)  * 0.006 * depth * (ci % 2 === 0 ? 1 : -0.7);
    const my = (mouseY - window.innerHeight / 2) * 0.006 * depth * (ci % 2 === 0 ? -0.7 : 1);
 
    const cols = 3, rows = 2;
    const col = ci % cols, row = Math.floor(ci / cols);
    const cellW = SVG_W / cols, cellH = SVG_H / rows;
    const ocx = cellW * col + cellW * 0.5;
    const ocy = cellH * row + cellH * 0.5;
 
    g.setAttribute("transform",
      `translate(${(dx + mx).toFixed(1)}, ${(dy + my).toFixed(1)}) ` +
      `rotate(${rot.toFixed(2)}, ${ocx}, ${ocy}) ` +
      `scale(${scale.toFixed(4)})`
    );
  });
}
 
// ─── INSIDE ANIMATION ──────────────────────────────────────
function animateInside() {
  if (!activeCategory) return;
 
  const pd = catPaths[activeCategory];
  const pathEl = pd.pathEl;
  const totalLen = pathEl.getTotalLength();
  const items = pd.items;
 
  // Auto-advance: increment progress continuously
  if (seqPlaying) {
    const totalDuration = items.length * CMD_DURATION;
    const progressPerFrame = (1000 / 60) / totalDuration; // approx per frame at 60fps
    seqProgress = Math.min(1, seqProgress + progressPerFrame);
  }
 
  // Also allow scroll to override / adjust
  const progress = Math.max(0, Math.min(1, seqProgress));
  const currentLen = progress * totalLen;
  const pt = pathEl.getPointAtLength(currentLen);
 
  // Path tangent for rotation
  const lookDist = 25;
  const aheadLen = Math.min(currentLen + lookDist, totalLen);
  const behindLen = Math.max(currentLen - lookDist, 0);
  const ptAhead = pathEl.getPointAtLength(aheadLen);
  const ptBehind = pathEl.getPointAtLength(behindLen);
  const angle = Math.atan2(ptAhead.y - ptBehind.y, ptAhead.x - ptBehind.x) * (180 / Math.PI);
 
  // Strong rotation — screen reorients to text direction
  targetRot = -angle * 0.4;
 
  // Zoom with oscillation
  const zoomBase = 12;
  const zoomOsc = zoomBase + Math.sin(time * 0.4) * 1.0 + Math.sin(time * 0.8) * 0.5;
 
  // Drift
  const driftX = Math.sin(time * 1.1) * 6 + Math.sin(time * 2.0) * 3;
  const driftY = Math.cos(time * 0.8) * 5 + Math.cos(time * 1.5) * 2.5;
 
  const w = SVG_W / zoomOsc;
  const h = SVG_H / zoomOsc;
  targetVB = {
    x: pt.x - w / 2 + driftX,
    y: pt.y - h / 2 + driftY,
    w, h
  };
 
  // Determine active segment
  const segIdx = Math.min(Math.floor(progress * items.length), items.length - 1);
  const item = items[segIdx];
 
  // Update segment indicator
  document.getElementById("si-id").textContent = String(item.id).padStart(2, "0");
  document.getElementById("si-id").style.color = CAT_COLORS[activeCategory];
  document.getElementById("si-cat").textContent = item.groupLabel;
  document.getElementById("si-text").textContent =
    item.en.length > 70 ? item.en.substring(0, 70) + "…" : item.en;
 
  // Video sync — on segment change
  if (segIdx !== seqSegIdx) {
    seqSegIdx = segIdx;
    showVideoForItem(item);
  }
 
  // If reached the end, stop
  if (progress >= 1) {
    seqPlaying = false;
  }
}
 
// ─── VIDEO SYSTEM ──────────────────────────────────────────
let videoShowTimer = null;
let videoHideTimer = null;
 
function showVideoForItem(item) {
  clearTimeout(videoShowTimer);
  clearTimeout(videoHideTimer);
 
  const panel = document.getElementById("video-panel");
  const prog = document.getElementById("vp-progress");
  const wasVisible = panel.classList.contains("visible");
  const showDelay = wasVisible ? 200 : 600;
 
  if (!wasVisible) {
    panel.classList.remove("visible");
    prog.style.transition = "none";
    prog.style.width = "0%";
  }
 
  videoShowTimer = setTimeout(() => {
    const color = CAT_COLORS[activeCategory];
 
    document.getElementById("vp-file").textContent = item.video;
    document.getElementById("vp-cmd").textContent =
      item.en.length > 60 ? item.en.substring(0, 60) + "…" : item.en;
    document.getElementById("vp-id").textContent = String(item.id).padStart(2, "0");
    document.getElementById("vp-id").style.color = color;
 
    document.querySelector(".vp-frame").style.borderColor = color + "30";
 
    // Reset progress
    prog.style.transition = "none";
    prog.style.width = "0%";
 
    panel.classList.add("visible");
 
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        prog.style.transition = `width ${CMD_DURATION / 1000}s linear`;
        prog.style.background = color;
        prog.style.width = "100%";
      });
    });
 
    // Hide only if no next segment comes (end of category)
    videoHideTimer = setTimeout(() => {
      panel.classList.remove("visible");
    }, CMD_DURATION + 500);
  }, showDelay);
}
 
function hideVideo() {
  clearTimeout(videoShowTimer);
  clearTimeout(videoHideTimer);
  document.getElementById("video-panel").classList.remove("visible");
  seqSegIdx = -1;
}
 
// ─── EVENTS ────────────────────────────────────────────────
function bindEvents() {
  // Mouse tracking
  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
 
  // Cursor ring activation on fast movement
  let cursorActiveTimer;
  document.addEventListener("mousemove", () => {
    const speed = Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY);
    if (speed > 5) {
      cursorRing.classList.add("active");
      clearTimeout(cursorActiveTimer);
      cursorActiveTimer = setTimeout(() => cursorRing.classList.remove("active"), 200);
    }
  });
 
  // Scroll — adjusts sequence progress
  window.addEventListener("wheel", e => {
    if (currentView !== "inside") return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.008 : -0.008;
    seqProgress = Math.max(0, Math.min(1, seqProgress + delta));
    document.getElementById("scroll-hint").classList.remove("visible");
  }, { passive: false });
 
  // Drag — perturb organisms on main screen
  let isDragging = false;
  let dragLast = { x: 0, y: 0 };
  let dragCat = null;
 
  svgEl.addEventListener("mousedown", e => {
    if (currentView !== "main") return;
    isDragging = true;
    dragLast = { x: e.clientX, y: e.clientY };
    const target = e.target.closest(".cat-group");
    dragCat = target ? target.getAttribute("data-cat") : null;
  });
 
  document.addEventListener("mousemove", e => {
    if (!isDragging || currentView !== "main") return;
    const dx = e.clientX - dragLast.x;
    const dy = e.clientY - dragLast.y;
    dragLast = { x: e.clientX, y: e.clientY };
 
    if (dragCat && catPerturb[dragCat]) {
      catPerturb[dragCat].vx += dx * 0.15;
      catPerturb[dragCat].vy += dy * 0.15;
    }
 
    const scale = currentVB.w / window.innerWidth;
    currentVB.x -= dx * scale * 0.15;
    currentVB.y -= dy * scale * 0.15;
    targetVB.x = currentVB.x;
    targetVB.y = currentVB.y;
  });
 
  document.addEventListener("mouseup", () => {
    isDragging = false;
    dragCat = null;
  });
 
  // Keyboard
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && currentView === "inside") exitCategory();
    // Space to pause/resume auto-advance
    if (e.key === " " && currentView === "inside") {
      e.preventDefault();
      seqPlaying = !seqPlaying;
    }
  });
 
  // Touch support
  let touchStartY = 0;
  document.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
 
  document.addEventListener("touchmove", e => {
    if (currentView !== "inside") return;
    const dy = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    seqProgress = Math.max(0, Math.min(1, seqProgress + dy * 0.001));
  }, { passive: true });
}
 