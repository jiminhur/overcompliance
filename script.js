const D={
  Align:[{id:1,text:"#1 When crossing a street, steps follow only one selected color.",video:"videos/swipetounlock_1.mp4"},{id:2,text:"#2 Movement aligns in single direction within a flow. — Keep right.",video:"videos/swipetounlock_1.mp4"},{id:3,text:"#3 Position is adjusted to remain behind a marked line. — Please stand behind the line.",video:"videos/swipetounlock_1.mp4"},{id:4,text:"#4 The face aligns precisely within the frame indicated on screen. — Position your face within the frame.",video:"videos/swipetounlock_1.mp4"}],
  Input:[{id:1,text:"#1 Input placeholder.",video:"videos/swipetounlock_1.mp4"},{id:2,text:"#2 Input placeholder.",video:"videos/swipetounlock_1.mp4"},{id:3,text:"#3 Input placeholder.",video:"videos/swipetounlock_1.mp4"},{id:4,text:"#4 Input placeholder.",video:"videos/swipetounlock_1.mp4"}],
  Select:[{id:1,text:"#1 Select placeholder.",video:"videos/swipetounlock_1.mp4"},{id:2,text:"#2 Select placeholder.",video:"videos/swipetounlock_1.mp4"},{id:3,text:"#3 Select placeholder.",video:"videos/swipetounlock_1.mp4"}],
  Loop:[{id:1,text:"#1 Loop placeholder.",video:"videos/swipetounlock_1.mp4"},{id:2,text:"#2 Loop placeholder.",video:"videos/swipetounlock_1.mp4"},{id:3,text:"#3 Loop placeholder.",video:"videos/swipetounlock_1.mp4"},{id:4,text:"#4 Loop placeholder.",video:"videos/swipetounlock_1.mp4"}],
  Control:[{id:1,text:"#1 Control placeholder.",video:"videos/swipetounlock_1.mp4"},{id:2,text:"#2 Control placeholder.",video:"videos/swipetounlock_1.mp4"},{id:3,text:"#3 Control placeholder.",video:"videos/swipetounlock_1.mp4"},{id:4,text:"#4 Control placeholder.",video:"videos/swipetounlock_1.mp4"},{id:5,text:"#5 Control placeholder.",video:"videos/swipetounlock_1.mp4"},{id:6,text:"#6 Control placeholder.",video:"videos/swipetounlock_1.mp4"}],
  Edge:[{id:1,text:"#1 Edge placeholder.",video:"videos/swipetounlock_1.mp4"},{id:2,text:"#2 Edge placeholder.",video:"videos/swipetounlock_1.mp4"},{id:3,text:"#3 Edge placeholder.",video:"videos/swipetounlock_1.mp4"}]
};
const cats=['Align','Input','Select','Loop','Control','Edge'];
const $=id=>document.getElementById(id);
let t=0,cat='Align',ci=0,mut=true,mx=-1,my=-1,wormSets={},dragI=null,dragX=0,dragY=0,activeDrag=null;

// ===== CINEMATIC LOADING SEQUENCE =====
document.addEventListener('DOMContentLoaded',()=>{
  const ldImg=$('ld-img');
  const ldLogo=$('ld-logo');
  const ldPct=$('ld-pct');
  const loader=$('loader');

  const bgs=['loadingpage_background_1.jpg','loadingpage_background_2.jpg','loadingpage_background_3.jpg'];
  let phase=0,prog=0;

  // Preload all images
  bgs.forEach(src=>{const i=new Image();i.src=src});
  const firstImg=new Image();firstImg.src='The_first_image_of_the_website_zoom_in.jpg';

  // Phase 1: slide in first background
  ldImg.src=bgs[0];
  ldImg.onload=()=>{requestAnimationFrame(()=>ldImg.classList.add('visible'))};
  setTimeout(()=>ldLogo.classList.add('visible','flicker'),400);

  // FAST progress: ~5.5 seconds total
  const progIv=setInterval(()=>{
    prog+=1.8+Math.random()*0.8; // fast increment
    if(prog>100)prog=100;
    ldPct.textContent=Math.floor(prog)+'%';

    // Phase 2 at 30%: spatial slide to bg2
    if(prog>=30&&phase===0){
      phase=1;
      ldImg.classList.remove('visible');
      ldImg.classList.add('exit-left');
      setTimeout(()=>{
        ldImg.classList.remove('exit-left');
        ldImg.src=bgs[1];
        ldImg.onload=()=>requestAnimationFrame(()=>ldImg.classList.add('visible'));
      },500);
    }
    // Phase 3 at 70%: spatial slide to bg3
    if(prog>=70&&phase===1){
      phase=2;
      ldImg.classList.remove('visible');
      ldImg.classList.add('exit-left');
      setTimeout(()=>{
        ldImg.classList.remove('exit-left');
        ldImg.src=bgs[2];
        ldImg.onload=()=>requestAnimationFrame(()=>ldImg.classList.add('visible'));
      },500);
    }
    // Done at 100%
    if(prog>=100){
      clearInterval(progIv);
      // Quick transition to tunnel zoom
      setTimeout(()=>{
        ldLogo.classList.remove('visible','flicker');
        ldImg.classList.remove('visible');
        ldImg.classList.add('exit-left');
        setTimeout(()=>{
          ldImg.classList.remove('exit-left');
          ldImg.src='The_first_image_of_the_website_zoom_in.jpg';
          ldImg.onload=()=>{
            requestAnimationFrame(()=>ldImg.classList.add('visible'));
            // Final zoom into vanishing point
            setTimeout(()=>{
              loader.classList.add('zoom-end');
              setTimeout(()=>{
                loader.style.display='none';
                startWebsite();
              },700);
            },400);
          };
        },400);
      },300);
    }
  },100); // 100ms intervals for ~5.5s total
});

// ===== START EXISTING WEBSITE (unchanged structure) =====
function startWebsite(){
  $('bar').classList.remove('hide');
  $('sc').classList.remove('hide');
  buildIndex();buildSections();
  // Scroll to bottom (Main_bottom page)
  requestAnimationFrame(()=>{$('sc').scrollTop=$('sc').scrollHeight});

  // BOTTOM BOUNDARY: bounce back when trying to scroll past bottom
  $('sc').addEventListener('scroll',()=>{
    const sc=$('sc');
    const maxScroll=sc.scrollHeight-sc.clientHeight;
    if(sc.scrollTop>=maxScroll-2){
      // Jump slightly upward — system refuses further access
      setTimeout(()=>{sc.scrollTo({top:maxScroll-60,behavior:'smooth'})},200);
    }
  });

  // Bar clicks
  document.querySelectorAll('.cw').forEach(w=>w.addEventListener('click',()=>{
    cat=w.dataset.c;
    document.querySelectorAll('.cw').forEach(x=>x.classList.toggle('active',x.dataset.c===cat));
    const el=$('s-cat-'+cat);if(el)el.scrollIntoView({behavior:'smooth'});
  }));
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  requestAnimationFrame(loop);
}

// ===== INDEX =====
function buildIndex(){
  const g=$('idx-g');g.innerHTML='';
  cats.forEach(c=>{
    const b=document.createElement('button');b.className='idx-b';b.textContent=c;
    b.addEventListener('click',()=>{
      cat=c;
      // COLOR INVERSION: briefly invert the index section
      const sec=b.closest('.idx-sec');
      if(sec){sec.classList.add('inverted');setTimeout(()=>sec.classList.remove('inverted'),600)}
      const el=$('s-cat-'+c);if(el)el.scrollIntoView({behavior:'smooth'});
    });
    g.appendChild(b);
  });
}

// ===== BUILD ALL CATEGORY SECTIONS =====
function buildSections(){
  const dyn=$('dyn');dyn.innerHTML='';
  // Reverse order: Edge at top, Align closest to index
  [...cats].reverse().forEach((c,ri)=>{
    // Category section
    const sec=document.createElement('section');
    sec.className='s-cat';sec.id='s-cat-'+c;
    sec.innerHTML=`<canvas class="worm-cv" id="worm-${c}"></canvas><div class="cat-row" id="row-${c}"></div>`;
    dyn.appendChild(sec);
    // Index clone between categories (except after last)
    if(ri<cats.length-1){
      const idx=document.createElement('section');idx.className='idx-sec';
      idx.innerHTML=`<img src="Whole_content_index.jpg" class="sec-bg" alt=""><div class="idx-ctr"><p class="idx-d">You enact everyday commands through:</p><div class="idx-g idx-clone"></div></div>`;
      dyn.appendChild(idx);
    }
  });
  // Fill clone index grids
  document.querySelectorAll('.idx-clone').forEach(g=>{
    g.innerHTML='';
    cats.forEach(c=>{
      const b=document.createElement('button');b.className='idx-b';b.textContent=c;
      b.addEventListener('click',()=>{
        cat=c;
        const sec=b.closest('.idx-sec');
        if(sec){sec.classList.add('inverted');setTimeout(()=>sec.classList.remove('inverted'),600)}
        const el=$('s-cat-'+c);if(el)el.scrollIntoView({behavior:'smooth'});
      });
      g.appendChild(b);
    });
  });
  // Build tiles and worm for each category
  cats.forEach(c=>{buildTiles(c);buildWorm(c)});
  // Wire worm drag
  cats.forEach(c=>{
    const cv=$('worm-'+c);if(!cv)return;
    cv.addEventListener('mousedown',e=>{const r=cv.getBoundingClientRect();startDrag(c,e.clientX-r.left,e.clientY-r.top)});
    cv.addEventListener('mousemove',e=>{if(dragI!==null&&activeDrag===c){const r=cv.getBoundingClientRect();doDrag(e.clientX-r.left,e.clientY-r.top)}});
    cv.addEventListener('mouseup',()=>{dragI=null;activeDrag=null});
    cv.addEventListener('touchstart',e=>{const r=cv.getBoundingClientRect();startDrag(c,e.touches[0].clientX-r.left,e.touches[0].clientY-r.top)},{passive:true});
    cv.addEventListener('touchmove',e=>{if(dragI!==null&&activeDrag===c){const r=cv.getBoundingClientRect();doDrag(e.touches[0].clientX-r.left,e.touches[0].clientY-r.top)}},{passive:true});
    cv.addEventListener('touchend',()=>{dragI=null;activeDrag=null});
  });
}

// ===== TILES (3-column frame row) =====
function buildTiles(c){
  const cmds=D[c],row=$('row-'+c);if(!row)return;row.innerHTML='';
  const barT='You enact everyday commands through: Align, Input, Select, Loop, Control, Edge ← Do not click the words.';
  const n=Math.min(cmds.length,3);
  for(let i=0;i<n;i++){
    const cmd=cmds[i];
    const f=document.createElement('div');f.className='frame';
    f.innerHTML=`
      <div class="fr-out"></div>
      <div class="fr-wl"></div><div class="fr-wr"></div><div class="fr-fl"></div>
      <div class="fr-in"></div>
      <div class="fr-vid"><video src="${cmd.video}" muted playsinline autoplay loop></video></div>
      <svg class="fr-t1" viewBox="0 0 200 36" preserveAspectRatio="none"><polygon points="0,0 200,0 100,36" fill="#DFFF00"/></svg>
      <svg class="fr-t2" viewBox="0 0 200 30" preserveAspectRatio="none"><polygon points="0,0 200,0 100,30" fill="#DFFF00" opacity=".85"/></svg>
      <div class="fr-bar"><span>${barT}</span></div>`;
    f.addEventListener('click',()=>{ci=i;showDetail(c,cmd)});
    row.appendChild(f);
  }
}

// ===== WORM TEXT =====
function buildWorm(c){
  const cmds=D[c]||[],txt=cmds.map(x=>x.text).join('      ');
  const W=window.innerWidth,H=window.innerHeight*.55;
  const letters=[];
  for(let i=0;i<txt.length;i++){
    const tt=i/txt.length;
    const x=W*.03+tt*W*.94+Math.sin(tt*Math.PI*3)*W*.06;
    const y=H*.7-tt*H*.5+Math.sin(tt*Math.PI*2.2)*H*.12;
    letters.push({ch:txt[i],x,y,hx:x,hy:y,vx:0,vy:0,rot:0,ph:Math.random()*6.28});
  }
  wormSets[c]=letters;
}
function startDrag(c,x,y){const wL=wormSets[c];if(!wL)return;let md=50,mi=-1;for(let i=0;i<wL.length;i++){const d=Math.hypot(wL[i].x-x,wL[i].y-y);if(d<md){md=d;mi=i}}if(mi>=0){activeDrag=c;dragI=mi;dragX=x;dragY=y}}
function doDrag(x,y){if(dragI===null||!activeDrag)return;const wL=wormSets[activeDrag];if(!wL)return;for(let i=Math.max(0,dragI-14);i<Math.min(wL.length,dragI+14);i++){const p=1-Math.abs(i-dragI)/14;wL[i].x+=(x-dragX)*p*.25;wL[i].y+=(y-dragY)*p*.25}dragX=x;dragY=y}

function renderWorm(c){
  const cv=$('worm-'+c);if(!cv)return;
  const wL=wormSets[c];if(!wL||!wL.length)return;
  const d=devicePixelRatio||1,W=cv.parentElement.offsetWidth,H=cv.offsetHeight;
  cv.width=W*d;cv.height=H*d;cv.style.width=W+'px';cv.style.height=H+'px';
  const ctx=cv.getContext('2d');ctx.scale(d,d);
  // Subtle path outline
  if(wL.length>2){ctx.beginPath();ctx.moveTo(wL[0].x,wL[0].y);for(let i=1;i<wL.length;i+=2)ctx.lineTo(wL[i].x,wL[i].y);ctx.strokeStyle='rgba(0,0,0,.03)';ctx.lineWidth=22;ctx.lineCap='round';ctx.stroke()}
  for(let i=0;i<wL.length;i++){
    const L=wL[i],ph=L.ph;
    // Category physics
    if(c==='Align'){const sn=Math.sin(t*.4);if(sn>.3){const gy=Math.round(L.hy/40)*40;L.vx+=(L.hx-L.x)*.02;L.vy+=(gy-L.y)*.015}else{L.vx+=Math.sin(t*2+ph)*.3;L.vy+=Math.cos(t*1.5+ph)*.25;L.vx+=(L.hx-L.x)*.002;L.vy+=(L.hy-L.y)*.002}}
    else if(c==='Input'){const en=(t*.5+i*.08)%5;if(en<.3){L.x=i%2?-20:W+20}L.vx+=(L.hx-L.x)*.018;L.vy+=(L.hy-L.y)*.018}
    else if(c==='Select'){const fg=Math.floor((t*.12)%4),mg=Math.floor(i/(wL.length/4));if(mg===fg){L.vx+=(L.hx-L.x)*.02;L.vy+=(L.hy-L.y)*.02}else{const dx2=L.x-W/2,dy2=L.y-H/2,ds=Math.max(Math.hypot(dx2,dy2),1);L.vx+=dx2/ds*.2;L.vy+=dy2/ds*.2;L.vx+=(L.hx-L.x)*.001;L.vy+=(L.hy-L.y)*.001}}
    else if(c==='Loop'){const la=t*.5+i*.04,lr=Math.min(W,H)*.15+Math.sin(i*.1)*20;L.vx+=(W/2+Math.cos(la)*lr-L.x)*.01;L.vy+=(H/2+Math.sin(la)*lr*.6-L.y)*.01}
    else if(c==='Control'){L.vx+=(L.hx+Math.sin(t*.3+i*.02)*W*.01-L.x)*.012;L.vy+=(L.hy+Math.cos(t*.25)*H*.008-L.y)*.012;L.vx*=.97;L.vy*=.97}
    else if(c==='Edge'){L.vx+=(L.hx-L.x)*.005+Math.sin(t*2+ph)*.3;L.vy+=(L.hy-L.y)*.005+Math.cos(t*1.5+ph)*.25;if(L.x<10){L.x=10;L.vx=Math.abs(L.vx)*.5}if(L.x>W-10){L.x=W-10;L.vx=-Math.abs(L.vx)*.5}if(L.y<10){L.y=10;L.vy=Math.abs(L.vy)*.5}if(L.y>H-10){L.y=H-10;L.vy=-Math.abs(L.vy)*.5}}
    else{L.vx+=(L.hx-L.x)*.008+Math.sin(t*2+ph)*.2;L.vy+=(L.hy-L.y)*.008+Math.cos(t*1.5+ph)*.15}
    L.vx*=.92;L.vy*=.92;L.x+=L.vx;L.y+=L.vy;
    let a=0;if(i<wL.length-1)a=Math.atan2(wL[i+1].y-L.y,wL[i+1].x-L.x);else if(i>0)a=Math.atan2(L.y-wL[i-1].y,L.x-wL[i-1].x);
    a+=Math.sin(t*2.5+i*.3)*.1;L.rot+=(a-L.rot)*.06;
    let al=.7;if(c==='Select'){const fg2=Math.floor((t*.12)%4),mg2=Math.floor(i/(wL.length/4));al=mg2===fg2?.9:.3}
    const sz=17+Math.sin(i*.08+t)*2;
    ctx.save();ctx.translate(L.x,L.y);ctx.rotate(L.rot);
    ctx.font=`500 ${sz}px Monument,Helvetica Neue,Arial,sans-serif`;ctx.fillStyle=`rgba(25,25,25,${al})`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(L.ch,0,0);
    if(L.ch!==' '){const m=ctx.measureText(L.ch);ctx.fillStyle=`rgba(25,25,25,${al*.4})`;ctx.fillRect(-m.width/2,sz*.45,m.width,1.5)}
    ctx.restore();
  }
}

// ===== DETAIL =====
function showDetail(c,cmd){
  let det=document.querySelector('.s-det');
  if(!det){
    det=document.createElement('section');det.className='s-det';
    det.innerHTML=`<canvas class="det-cv" id="det-cv"></canvas><div class="det-room" id="det-room"></div><button id="det-back" style="position:absolute;top:8px;left:8px;z-index:20;font-family:var(--mon);font-size:11px;background:rgba(255,255,255,.85);border:1px solid rgba(0,0,0,.1);padding:4px 10px;cursor:pointer">←</button>`;
    $('dyn').prepend(det);
  }
  const rm=$('det-room');
  rm.innerHTML=`
    <div class="dt-out"></div>
    <div class="dt-wl"></div><div class="dt-wr"></div><div class="dt-fl"></div>
    <div class="dt-in"></div>
    <div class="dt-vid"><video id="det-vid" src="${cmd.video}" muted playsinline autoplay loop></video></div>
    <svg class="dt-t1" viewBox="0 0 200 36" preserveAspectRatio="none"><polygon points="0,0 200,0 100,36" fill="#DFFF00"/></svg>
    <svg class="dt-t2" viewBox="0 0 200 30" preserveAspectRatio="none"><polygon points="0,0 200,0 100,30" fill="#DFFF00" opacity=".85"/></svg>`;
  $('det-vid').muted=mut;$('det-vid').play().catch(()=>{});
  cat=c;window._cmdTxt=cmd.text;
  det.scrollIntoView({behavior:'smooth'});
  $('det-back').onclick=()=>{const el=$('s-cat-'+cat);if(el)el.scrollIntoView({behavior:'smooth'})};
}

function renderDetBg(){
  const cv=$('det-cv');if(!cv)return;
  const r=cv.parentElement;if(!r)return;
  const br=r.getBoundingClientRect();if(br.bottom<0||br.top>window.innerHeight)return;
  const d=devicePixelRatio||1,W=r.offsetWidth,H=r.offsetHeight;
  cv.width=W*d;cv.height=H*d;cv.style.width=W+'px';cv.style.height=H+'px';
  const ctx=cv.getContext('2d');ctx.scale(d,d);
  const txt=window._cmdTxt||'';if(!txt)return;
  const fs=Math.min(W*.2,160);
  ctx.font=`900 ${fs}px Harber,Impact,sans-serif`;
  const tw=ctx.measureText(txt).width;const rw=tw+W*.15;
  let sp=30;if(cat==='Control')sp=12;else if(cat==='Input')sp=45;else if(cat==='Edge')sp=38;
  const layers=[{y:H*.2,s:sp,a:.15},{y:H*.4,s:-sp*.8,a:.2},{y:H*.55,s:sp*.6,a:.18},{y:H*.7,s:-sp*1.1,a:.25},{y:H*.85,s:sp*.9,a:.12}];
  for(const l of layers){
    const off=(t*l.s)%rw;
    ctx.globalAlpha=l.a;ctx.fillStyle='#DFFF00';ctx.font=`900 ${fs}px Harber,Impact,sans-serif`;
    for(let x=-rw+off;x<W+rw;x+=rw)ctx.fillText(txt,x,l.y);
  }
  ctx.globalAlpha=1;
}

// ===== LOOP =====
function loop(){
  t+=.016;
  cats.forEach(c=>{const el=$('worm-'+c);if(!el)return;const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<window.innerHeight)renderWorm(c)});
  renderDetBg();
  requestAnimationFrame(loop);
}