(() => {
'use strict';
const data = window.PORTFOLIO_DATA;
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Bounded image layers keep every visible icon inside its link's hit area.
const icon = name => `<span class="nav-icon-pair" aria-hidden="true"><img class="nav-icon-color" src="assets/navigation/${name}-color-cropped.png" alt="" width="446" height="463" draggable="false"><img class="nav-icon-blue" src="assets/navigation/${name}-blue-cropped.png" alt="" width="446" height="463" draggable="false"></span>`;
document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
const navLinks = [...document.querySelectorAll('.object-link')];
const chapters = [...document.querySelectorAll('.chapter')];
const names = ['ABOUT ME','TEAM PROJECTS','SOLO & SMALL TEAM','ILLUSTRATIONS'];
const root = document.documentElement;
const hero = document.querySelector('.hero');
const stage = document.querySelector('.character-stage');
const character = document.getElementById('hero-character');
const media = matchMedia('(prefers-reduced-motion: reduce)');
// Website companion: each click restarts the two-stage expression sequence.
const pet=document.getElementById('site-pet');
const petImage=pet.querySelector('img');
const petStatus=document.getElementById('pet-status');
const petStates={idle:{src:'assets/pet/idle.png',alt:'Sleeping Atako companion',status:'Sleeping'},excited:{src:'assets/pet/excited.png',alt:'Atako winks happily',status:'Hello!'},awkward:{src:'assets/pet/awkward.png',alt:'Atako looks bashful with a sweat drop',status:'Still here…'}};
Object.values(petStates).forEach(state=>{const preload=new Image();preload.src=state.src;});
let petTimer=0,petAnimation=null;
function setPetState(state,animate=true) {
 clearTimeout(petTimer);petTimer=0;
 const next=petStates[state];pet.dataset.state=state;
 petImage.src=next.src;petImage.alt=next.alt;petStatus.textContent=next.status;
 pet.setAttribute('aria-label',state==='idle'?'Wake up Atako':'Say hello to Atako again');
 petAnimation?.cancel();
 if(animate&&!reduced)petAnimation=petImage.animate([
  {opacity:0,transform:'translateY(14px) scale(.9)'},
  {opacity:1,transform:'translateY(-5px) scale(1.04)',offset:.65},
  {opacity:1,transform:'translateY(0) scale(1)'}
 ],{duration:340,easing:'cubic-bezier(.2,.7,.3,1)'});
 if(state==='excited')petTimer=setTimeout(()=>setPetState('awkward'),2000);
 if(state==='awkward')petTimer=setTimeout(()=>setPetState('idle'),5000);
}
pet.addEventListener('click',()=>setPetState('excited'));
// Pointer, key and scroll activity postpones the first idle expression change.
function postponePetIdle(){if(pet.dataset.state==='excited'){clearTimeout(petTimer);petTimer=setTimeout(()=>setPetState('awkward'),2000);}}
for(const event of ['pointermove','pointerdown','keydown','wheel','scroll'])addEventListener(event,postponePetIdle,{passive:true});
function updatePetVisibility(visible) {
 if(pet.classList.contains('is-visible')===visible)return;
 pet.classList.toggle('is-visible',visible);pet.tabIndex=visible?0:-1;
 pet.setAttribute('aria-hidden',String(!visible));
 if(!visible)setPetState('idle',false);
}

let reduced = media.matches;
let activeIndex = -1;
let chapterBounds = [];
let dimensions = {};
let scrollQueued = false;
let lastDock = -1;
// Reveal a block once; transforms never affect the layout or scroll measurements.
const mainRevealSelector='.chapter-heading,.about-copy>.mini-label,.about-copy>h3,.about-bio>p,.education,.about-copy>.skill-tags,.signature-palette,.project-feature,.game-card,.gallery-toolbar,.art-card,.next-chapter,.contact-layout,.contact-footer';
const detailRevealSelector='.project-reader-heading,.project-reader-links,.project-reader-section-title,.project-reader-summary>p,.project-reader-tools,.project-design-title,.project-design-description,.project-design-column img,.project-photo-masonry img';
let detailRevealObserver=null;
function revealContent(scope, selector, scrollRoot=null) {
 const elements=[...scope.querySelectorAll(selector)].filter(el=>!el.classList.contains('scroll-reveal'));
 if(reduced||!('IntersectionObserver' in window))return null;
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add('is-revealed');observer.unobserve(entry.target);
  });
 },{root:scrollRoot,rootMargin:'0px 0px -20px 0px',threshold:.04});
 elements.forEach(el=>{el.classList.add('scroll-reveal');observer.observe(el);});
 return observer;
}
document.addEventListener('focusin',e=>e.target.closest('.scroll-reveal')?.classList.add('is-revealed'));

const motionButton = document.querySelector('.motion-toggle');
const starField=document.querySelector('.cover-stars');
// Extra independent glints keep several visible around the foreground artwork.
while(starField.children.length<72) starField.append(starField.firstElementChild.cloneNode(true));
const coverStars=[...starField.querySelectorAll('svg')];
function placeCoverStar(star) {
 star.style.setProperty('--x',`${3+Math.random()*94}%`);
 star.style.setProperty('--y',`${3+Math.random()*75}%`);
 star.style.setProperty('--size',`${9+Math.random()*14}px`);
}

coverStars.forEach(star=>{
 placeCoverStar(star);
 star.style.setProperty('--twinkle-duration',`${3+Math.random()*3.5}s`);
 star.style.animationDelay=`-${Math.random()*8}s`;
 star.addEventListener('animationiteration',()=>placeCoverStar(star));
});
function setMotion(value) {
 reduced = value;
 root.classList.toggle('motion-reduced', value);
 motionButton.setAttribute('aria-pressed', String(value));
 motionButton.textContent = value ? 'Enable motion' : 'Reduce motion';
 waterEffect.setReduced(value);
 if(value)petAnimation?.cancel();
 if(value)document.querySelectorAll('.scroll-reveal').forEach(el=>el.classList.add('is-revealed'));
 scheduleUpdate();
}
motionButton.addEventListener('click', () => setMotion(!reduced));
media.addEventListener('change', e => setMotion(e.matches));
function measure() {
 const mobile = innerWidth <= 680;
 const navHeight = mobile ? 100 : 114;
 dimensions = { width: innerWidth, hero: hero.offsetHeight, navHeight, mobile };
 chapterBounds = chapters.map(s => ({top:s.offsetTop, height:s.offsetHeight}));
 const rect = water.getBoundingClientRect();
 waterEffect.resize(rect.width,rect.height);
 scheduleUpdate();
}
const clamp = n => Math.max(0,Math.min(1,n));
function updateScroll() {
 scrollQueued = false;
 const {width,hero:height,navHeight,mobile} = dimensions;
 const y = scrollY;
 const raw = clamp(y / (height - navHeight));
 const p = reduced ? (raw > .65 ? 1 : 0) : raw*raw*(3-2*raw);
 const dock = clamp((p-.65)/.35);
 if(dock !== lastDock) { root.style.setProperty('--dock',dock); lastDock = dock; }
 document.body.classList.toggle('is-content',p>.85);
 updatePetVisibility(y>=height-navHeight);
 const start = mobile ? [[.15,.69],[.32,.83],[.68,.83],[.85,.69]] : [[.18,.68],[.32,.88],[.70,.84],[.83,.72]];
 const spacing = mobile ? Math.min(94,(width-32)/4) : 114;
 const float = p===0 && !reduced ? 1 : 0;
 navLinks.forEach((link,i) => {
  const sx=width*start[i][0], sy=height*start[i][1];
  const ex=width/2+(i-1.5)*spacing, ey=mobile?48:52;
  const x=sx+(ex-sx)*p, cy=sy+(ey-sy)*p;
  const scale=(mobile?1.062:1.665)+((mobile?.74:.62)-(mobile?1.062:1.665))*p;
  link.style.transform=`translate(${x}px,${cy}px) translate(-50%,-50%) scale(${scale}) rotate(${(1-p)*[-12,9,-7,9][i]}deg)`;
  link.style.setProperty('--float',float);
 });
 let next = -1;
 const probe = y + navHeight + Math.min(160, innerHeight*.21);
 chapterBounds.forEach((b,i) => { if(probe>=b.top) next=i; });
 if(y+innerHeight >= document.documentElement.scrollHeight-4) next=3;
 if(next !== activeIndex || updateScroll.previousDocked !== (p>.85)) {
  activeIndex=next; updateScroll.previousDocked=p>.85;
  navLinks.forEach((link,i) => {
   const current = next===i && p>.85;
   link.classList.toggle('is-muted',p>.85 && !current);
   if(current) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
  });
  if(next>=0) {
   document.getElementById('rail-number').textContent=`0${next+1} / 04`;
   document.getElementById('rail-label').textContent=names[next];
  }
 }
 const selected = chapterBounds[Math.max(next,0)];
 const progress = selected ? clamp((y-selected.top+navHeight)/(Math.max(1,selected.height-innerHeight+navHeight))) : 0;
 document.getElementById('progress-fill').style.width=`${progress*100}%`;
}
function scheduleUpdate() { if(!scrollQueued) { scrollQueued=true; requestAnimationFrame(updateScroll); } }
addEventListener('scroll',scheduleUpdate,{passive:true});
function setPose(id) {
 stage.dataset.pose=data.character.poses[id]?id:'idle';
 const src = data.character.poses[id] || data.character.idle;
 if(character.getAttribute('src')!==src) character.src=src;
}
navLinks.forEach(link => {
 link.addEventListener('pointerenter',()=> { if(scrollY<dimensions.hero*.7) setPose(link.dataset.section); });
 link.addEventListener('pointerleave',()=> { if(scrollY<dimensions.hero*.7) setPose('idle'); });
 link.addEventListener('focus',()=> { if(scrollY<dimensions.hero*.7) setPose(link.dataset.section); });
 link.addEventListener('blur',()=>setPose('idle'));
});
function goTo(id, historyMode='push') {
 const target=document.getElementById(id);
 if(!target) return;
 if(id!=='home') setPose(id);
 const top=id==='home'?0:Math.max(0,target.offsetTop);
 if(historyMode==='push' && location.hash!==`#${id}`) history.pushState(null,'',`#${id}`);
 scrollTo({top,behavior:reduced?'instant':'smooth'});
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 const id=a.getAttribute('href').slice(1); if(!document.getElementById(id))return;
 e.preventDefault();goTo(id);
}));
addEventListener('popstate',()=>goTo(location.hash.slice(1)||'home','none'));
// 原生长页面滚动保留阅读节奏；临近下一章节时，下一次向下滚动将其吸附到目录下。
let wheelLock=0,lastWheelAt=-Infinity;
addEventListener('wheel',e=>{
 const now=performance.now();const newGesture=now-lastWheelAt>180;lastWheelAt=now;
 if(!newGesture)return;
 if(e.ctrlKey||e.metaKey||e.deltaY<18||document.getElementById('detail-dialog').open||innerWidth<=680) return;
 if(now<wheelLock)return;
 const nextIndex=activeIndex+1;
 if(activeIndex>=0&&nextIndex<chapters.length) {
  const nextTop=chapterBounds[nextIndex].top-scrollY;
  if(nextTop>dimensions.navHeight+90 && nextTop<innerHeight+12 && nextTop>innerHeight-110) {
   e.preventDefault();wheelLock=now+1000;goTo(chapters[nextIndex].id);
  }
 }
},{passive:false});
const water=document.getElementById('water-surface');
const canvas=document.getElementById('ripples');
const waterEffect=window.createPortfolioWater(canvas,water,data.water||{});
let lastPointer=null,lastDisturbance=0;
function disturbWater(e,strong=false){
 if(reduced||scrollY>dimensions.hero||e.target.closest('a,button'))return;
 const r=water.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;
 if(x<0||y<0||x>r.width||y>r.height){lastPointer=null;return;}
 const now=performance.now();
 if(!strong&&now-lastDisturbance<18)return;
 const near=lastPointer&&now-lastPointer.time<160&&Math.hypot(x-lastPointer.x,y-lastPointer.y)<160;
 waterEffect.disturb(x,y,near?lastPointer.x:x,near?lastPointer.y:y,strong);
 lastPointer={x,y,time:now};lastDisturbance=now;
}
hero.addEventListener('pointermove',e=>disturbWater(e),{passive:true});
hero.addEventListener('pointerdown',e=>disturbWater(e,true),{passive:true});
hero.addEventListener('pointerleave',()=>{lastPointer=null;});
const gallery=document.getElementById('illustration-gallery');
const galleryEmpty=document.getElementById('gallery-empty');
const artCategories={
 'commissioned': {label:'Commissions',en:'COMMISSIONED WORK'},
 'fan-art': {label:'Fanart',en:'FAN ART'}
};
function renderGallery(filter='commissioned') {
 const category=artCategories[filter];
 const items=data.illustrations.map((art,index)=>({...art,index})).filter(a=>a.category===filter);
 gallery.innerHTML=items.map(a=>`<button class="art-card" data-art="${a.index}" aria-label="Preview ${esc(a.title)}"><span class="art-image" style="aspect-ratio:${a.width} / ${a.height}"><img src="${esc(a.src)}" alt="${esc(a.alt||a.title)}" width="${a.width}" height="${a.height}" loading="lazy" decoding="async"></span></button>`).join('');
 revealContent(gallery,'.art-card');
 gallery.hidden=items.length===0;
 gallery.setAttribute('aria-label',category.label+' gallery');
 galleryEmpty.hidden=items.length>0;
 requestAnimationFrame(measure);
 return items.length;
}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
 const count=renderGallery(button.dataset.filter);
 document.getElementById('announcement').textContent=`Showing ${artCategories[button.dataset.filter].label}.`;
}));
const projects={
  "dissonant": {
    "title": "Dissonant Girls",
    "role": "Art & UI Design",
    "description": "Guide five girls from a fragile band to their first original song through daily life, rehearsal, and performance.",
    "tools": [
      "Unity",
      "Procreate",
      "Adobe Illustrator",
      "Photoshop"
    ]
  },
  "line": {
    "title": "Light As Wind",
    "role": "Level Design & Art",
    "description": "Journey from the ocean to the sky as plush companions in a bedridden girl’s imagined world.",
    "tools": [
      "Unity",
      "Procreate"
    ]
  },
  "anata": {
    "title": "Anata Shika Mienai No",
    "role": "Solo Development",
    "description": "Explore a subway where every route you choose reshapes the balance between five identities.",
    "tools": [
      "Unity",
      "Codex"
    ]
  },
  "goose": {
    "title": "SLEEPWALK",
    "role": "Level, Art & UI Design",
    "description": "Reshape fragmented spaces into paths through a dreamlike puzzle game about expression, love, and self-acceptance.",
    "tools": [
      "Unity",
      "Codex"
    ]
  },
  "bee": {
    "title": "Bee My Flower",
    "role": "Art & Usability",
    "description": "Team up as a bee and a flower to gather pollen, grow paths, and outmaneuver rivals without blocking your own future.",
    "tools": []
  }
};
const dialog=document.getElementById('detail-dialog');
let dialogOpener=null;
let projectScrollCleanup=null;
let projectVideoCleanup=null;
function setupProjectScrollbar(){
 const reader=dialog.querySelector('.project-reader'),track=dialog.querySelector('.project-scrollbar'),thumb=track?.firstElementChild;
 if(!reader||!track)return null;
 const abort=new AbortController();let pending=0,drag=null;
 function update(){
  pending=0;const max=Math.max(0,reader.scrollHeight-reader.clientHeight);
  track.hidden=max<=1;
  if(!max)return;
  const height=track.clientHeight;
  const size=Math.max(28,height*reader.clientHeight/reader.scrollHeight),progress=reader.scrollTop/max;
  thumb.style.height=`${size}px`;thumb.style.transform=`translateY(${progress*(height-size)}px)`;
  track.setAttribute('aria-valuenow',String(Math.round(progress*100)));
  track.setAttribute('aria-valuetext',`${Math.round(progress*100)}%`);
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(update);}
 function move(y,offset){const bounds=track.getBoundingClientRect(),travel=bounds.height-thumb.offsetHeight,max=reader.scrollHeight-reader.clientHeight;reader.scrollTop=Math.max(0,Math.min(1,(y-bounds.top-offset)/Math.max(1,travel)))*max;}
 reader.addEventListener('scroll',schedule,{passive:true,signal:abort.signal});
 reader.addEventListener('load',schedule,{capture:true,signal:abort.signal});
 track.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;e.preventDefault();
  const r=thumb.getBoundingClientRect();drag={id:e.pointerId,offset:e.clientY>=r.top&&e.clientY<=r.bottom?e.clientY-r.top:r.height/2};
  track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');move(e.clientY,drag.offset);
 },{signal:abort.signal});
 track.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId)move(e.clientY,drag.offset);},{signal:abort.signal});
 const stop=()=>{drag=null;track.classList.remove('is-dragging');};
 track.addEventListener('pointerup',stop,{signal:abort.signal});track.addEventListener('pointercancel',stop,{signal:abort.signal});
 track.addEventListener('keydown',e=>{
  const changes={ArrowDown:40,ArrowUp:-40,PageDown:reader.clientHeight*.85,PageUp:-reader.clientHeight*.85};
  if(e.key in changes){e.preventDefault();reader.scrollTop+=changes[e.key];}
  else if(e.key==='Home'||e.key==='End'){e.preventDefault();reader.scrollTop=e.key==='Home'?0:reader.scrollHeight;}
 },{signal:abort.signal});
 const observer=new ResizeObserver(schedule);observer.observe(reader);schedule();
 return ()=>{abort.abort();observer.disconnect();cancelAnimationFrame(pending);};
}
function setupProjectVideo(){
 const reader=dialog.querySelector('.project-reader'),stage=dialog.querySelector('.project-video-stage');
 if(!reader||!stage)return null;
 const video=stage.querySelector('video'),toggle=stage.querySelector('.project-video-toggle'),sound=stage.querySelector('.project-video-sound');
 const abort=new AbortController();let pending=0,disposed=false,fullHeight=0,compactHeight=0;
 const stageTop=stage.offsetTop;
 const active=()=>!video.paused&&!video.ended;
 function update(){
  pending=0;const playing=active();
  const travel=Math.max(0,fullHeight-compactHeight);
  const distance=Math.max(0,reader.scrollTop-stageTop);
  const height=playing?fullHeight-Math.min(distance,travel):fullHeight;
  const compact=playing&&distance>=travel;
  stage.style.setProperty('--video-current-height',`${height}px`);
  stage.classList.toggle('is-playing',playing);stage.classList.toggle('is-compact',compact);
  toggle.setAttribute('aria-label',playing?'Pause video':'Play video');
  sound.setAttribute('aria-label',video.muted?'Unmute video':'Mute video');
  sound.setAttribute('aria-pressed',String(video.muted));
  sound.classList.toggle('is-muted',video.muted);
 }
 function schedule(){if(!pending)pending=requestAnimationFrame(update);}
 function measure(){
  if(video.videoWidth&&video.videoHeight)stage.style.aspectRatio=`${video.videoWidth} / ${video.videoHeight}`;
  fullHeight=stage.offsetHeight;compactHeight=Math.min(reader.clientHeight*.28,fullHeight*.55);
  stage.style.setProperty('--video-compact-height',`${compactHeight}px`);
  stage.style.setProperty('--video-sticky-top',`${compactHeight-fullHeight}px`);schedule();
 }
 async function play(){
  try{await video.play();}
  catch{if(disposed)return;video.muted=true;try{await video.play();}catch{schedule();}}
  if(disposed)video.pause();
 }
 toggle.addEventListener('click',()=>{if(active())video.pause();else play();},{signal:abort.signal});
 sound.addEventListener('click',()=>{video.muted=!video.muted;},{signal:abort.signal});
 reader.addEventListener('scroll',schedule,{passive:true,signal:abort.signal});
 for(const event of ['play','playing','pause','ended','volumechange','error'])video.addEventListener(event,schedule,{signal:abort.signal});
 video.addEventListener('loadedmetadata',measure,{signal:abort.signal});
 const observer=new ResizeObserver(measure);observer.observe(reader);measure();play();
 return ()=>{disposed=true;abort.abort();observer.disconnect();cancelAnimationFrame(pending);video.pause();};
}
function openDialog(html,kicker,opener) {
 projectVideoCleanup?.();projectVideoCleanup=null;
 projectScrollCleanup?.();projectScrollCleanup=null;
 dialogOpener=opener;dialog.classList.toggle('artwork-dialog',html.includes('artwork-detail'));dialog.classList.toggle('project-dialog',html.includes('project-reader'));document.getElementById('dialog-kicker').textContent=kicker;
 detailRevealObserver?.disconnect();
 document.getElementById('dialog-content').innerHTML=html;
 dialog.showModal();document.body.style.overflow='hidden';dialog.scrollTop=0;projectScrollCleanup=setupProjectScrollbar();projectVideoCleanup=setupProjectVideo();
 const reader=dialog.querySelector('.project-reader');
 if(reader)detailRevealObserver=revealContent(reader,detailRevealSelector,reader);
 document.querySelector('.dialog-close').focus({preventScroll:true});
}
function closeDialog(){dialog.close();}
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))closeDialog();});
dialog.addEventListener('close',()=>{projectVideoCleanup?.();projectVideoCleanup=null;projectScrollCleanup?.();projectScrollCleanup=null;document.body.style.overflow='';dialogOpener?.focus({preventScroll:true});scheduleUpdate();});
gallery.addEventListener('click',e=>{
 const button=e.target.closest('[data-art]');if(!button)return;
 const index=Number(button.dataset.art),art=data.illustrations[index];
 const picture=`<img class="detail-art" src="${esc(art.src)}" alt="${esc(art.alt||art.title)}" width="${art.width}" height="${art.height}">`;
 openDialog(`<div class="artwork-detail"><h2 id="dialog-title" class="sr-only">${esc(art.title)}</h2><div class="artwork-picture">${picture}</div><p class="artwork-overlay-date">${art.date?`<time datetime="${esc(art.date)}">${esc(art.date.split('-').reverse().join('-'))}</time>`:'00-00-2000'}</p></div>`, '',button);
});
const projectDetails={
  "dissonant": {
    "title": "Dissonant Girls",
    "date": "2025.03 – 2026.06",
    "genre": "2D · Band management RPG",
    "role": "Art & UI Design",
    "tools": [
      "Unity",
      "Procreate",
      "Adobe Illustrator",
      "Photoshop"
    ],
    "description": "Guide five girls from a fragile band to their first original song through daily life, rehearsal, and performance.",
    "overview": "Set in the fictional city of Shinko, Dissonant Girls follows five girls with different ideas about music. As they build friendships and face the threat of disbanding, they work toward performing an original song at the end of summer.",
    "sections": [
      [
        "Gameplay",
        "Schedule management and daily-life simulation shape the band’s journey. A blackjack-inspired song-arrangement system brings a strategic twist to making music."
      ]
    ]
  },
  "line": {
    "title": "Light As Wind",
    "date": "2026.11",
    "genre": "3D · Side-scrolling platformer",
    "role": "Level Design & Art",
    "tools": [
      "Unity",
      "Procreate"
    ],
    "description": "Journey from the ocean to the sky as plush companions in a bedridden girl’s imagined world.",
    "overview": "A bedridden girl imagines her sea-creature plush toys taking the journey she cannot: from the ocean depths to the open sky. Their adventure turns her loneliness and longing for freedom into a world to explore.",
    "sections": [
      [
        "Environment & Character Design",
        "The journey rises through deep water, shallow seas, land, and sky. The deep ocean reflects the girl’s isolation; the sky embodies her wish for freedom. A starfish, swordfish, and crab each bring a distinct way of moving and interacting with the world."
      ],
      [
        "Level Design",
        "Each stage builds its mechanics around a distinct ecosystem. Underwater levels use jellyfish as springboards and seafloor vents to raise platforms, creating routes across uneven terrain. Hollow coral and towering seagrass provide cover from patrolling anglerfish."
      ],
      [
        "Imagined Worlds",
        "Greek-temple-inspired ruins and seagrass groves lit by small nightlights give each mechanic a recognizable setting. These unexpected combinations reveal the richness of the girl’s imagination."
      ],
      [
        "Narrative Contrast",
        "Each plush character’s final level ends in a sudden death at the height of its journey—such as a starfish drawing a swarm of jellyfish with a harp, or a swordfish dashing through obstacles. The abrupt shift creates visual impact and hints at an underlying tragedy."
      ],
      [
        "Environmental Storytelling",
        "Objects from the girl’s everyday world appear out of place beneath the sea: sheet music floats in the water, and a heart monitor hides beneath a bridge. These clues gradually connect the fantasy to the girl behind it."
      ]
    ]
  },
  "anata": {
    "title": "Anata Shika Mienai No",
    "date": "2026.10",
    "genre": "3D · First-person narrative exploration",
    "role": "Solo Development",
    "tools": [
      "Unity",
      "Codex"
    ],
    "description": "Explore a subway where every route you choose reshapes the balance between five identities.",
    "overview": "A fan game inspired by r-906’s song Anata Shika Mienai No and its companion novel DiaLog. Five subway lines represent five identities sharing one mind; their changing service conditions reveal Identity Four’s growing control.",
    "sections": [
      [
        "Narrative",
        "Identity Four is outgoing, capable, and repeatedly favored by the person who shares these identities. Convinced it should become the only choice, Four begins erasing the others. The story turns an apparent loss of control into a realization: the player’s earlier choices helped make this takeover possible."
      ],
      [
        "Choice & Consequence",
        "Each line has two visible meters: Stability and Encroachment. Choosing a line raises its Stability, while neglected lines lose Stability. Below a threshold, Four begins to take over. Once Encroachment starts, choosing that line cannot reverse it; refusing Four accelerates the process."
      ],
      [
        "Player Experience",
        "By watching the meters and testing different routes, players uncover how their choices affect the network. Attempts to resist gradually expose their own part in Four’s rise."
      ],
      [
        "Visual Design",
        "Manga-style black-and-white environments echo the original song’s artwork. Saturated accents identify the five lines, directing attention toward the route choices at the heart of the story."
      ]
    ]
  },
  "goose": {
    "title": "SLEEPWALK",
    "date": "2026.11",
    "genre": "3D · Spatial puzzle",
    "role": "Level, Art & UI Design",
    "tools": [
      "Unity",
      "Codex"
    ],
    "description": "Reshape fragmented spaces into paths through a dreamlike puzzle game about expression, love, and self-acceptance.",
    "overview": "Inspired by wowaka’s music and artwork, SLEEPWALK is an orthographic 3D puzzle game about the gap between what we feel, what we express, and what others understand. Music and imagery invite players into that tension as they find a way toward self-acceptance.",
    "sections": [
      [
        "Core Mechanic",
        "The player and their shadow move together in mirrored directions. Reshaping the terrain must create a viable path for both figures to reach the goal. Their opposing yet inseparable movement gives physical form to the game’s inner conflict."
      ],
      [
        "Level Design",
        "Scattered geometric forms gradually become compositions inspired by wowaka’s song artwork. Three levels develop the core mechanic through increasingly complex spatial transformations."
      ],
      [
        "Level 1 · Transform",
        "Simple click interactions directly transform the terrain, introducing how to build a route for both figures."
      ],
      [
        "Level 2 · Flip & Swap",
        "Flip the terrain and swap the two figures’ positions to connect the next stretch of their paths."
      ],
      [
        "Level 3 · Rotate & Align",
        "Rotate terrain fragments and position both figures precisely to cross between them and advance."
      ],
      [
        "Visual & UI Design",
        "A minimal black-and-white style draws from music players and the geometric language of wowaka’s artwork. The visuals connect spatial puzzles with listening and interpretation."
      ]
    ]
  },
  "bee": {
    "title": "Bee My Flower",
    "date": "2026.10",
    "genre": "Team-based strategy board game",
    "role": "Art & Usability",
    "tools": [],
    "description": "Team up as a bee and a flower to gather pollen, grow paths, and outmaneuver rivals without blocking your own future.",
    "overview": "A strategy board game for 2–4 players, best with four, inspired by the mutual dependence of bees and flowers. Cooperation within each team meets competition across the board.",
    "sections": [
      [
        "How It Plays",
        "Bees collect pollen and pass it to flowers. Flowers spend pollen to sow paths, helping their partner move while obstructing opponents. Teams must balance building routes with saving enough pollen for their bee to return to the hive with ten."
      ],
      [
        "Design Intent",
        "Blocking every opposing route can leave your own team stranded. The game encourages players to discover that leaving others room to survive can also protect their own chances of winning."
      ],
      [
        "Art & Usability",
        "My contributions focus on art and usability. A fresh, playful, hand-drawn style reflects the game’s theme of interdependence."
      ]
    ]
  }
};
// Artwork keeps its natural proportions in at most two masonry columns.
function renderDesignSections(sections, contribution=false) {
 return (sections||[]).map(section=>{
  const columns=[];
  const columnCount=Math.min(2,Math.ceil(section.images.length/2));
  const perColumn=Math.ceil(section.images.length/columnCount);
  for(let i=0;i<section.images.length;i+=perColumn) columns.push(section.images.slice(i,i+perColumn));
  const heading=contribution?'h5':'h4';
  return `<section class="project-design-section" aria-labelledby="design-${esc(section.id)}">
   <${heading} id="design-${esc(section.id)}" class="project-design-title">${esc(section.title)}</${heading}>
   ${section.description?`<p class="project-design-description">${esc(section.description)}</p>`:''}
   ${section.url?`<a class="project-external-button" href="${esc(section.url)}" target="_blank" rel="noopener noreferrer">${esc(section.linkLabel)}</a>`:''}
   <div class="project-design-masonry" style="--gallery-columns:${columns.length}">${columns.map(column=>`<div class="project-design-column">${column.map(photo=>`<img src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">`).join('')}</div>`).join('')}</div>
  </section>`;
 }).join('');
}
document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
 const key=button.dataset.project,p=projects[key],assets=data.projects[key],details=projectDetails[key];
 const cover=assets.images[0];
 const coverHtml=assets.coverVideo?`<div class="project-reader-cover project-video-stage" style="aspect-ratio:16/9"><div class="project-video-player">
 <video src="${esc(assets.coverVideo)}" poster="${esc(cover)}" autoplay playsinline preload="metadata" aria-label="${esc(p.title)} gameplay video"></video>
 <button class="project-video-toggle" type="button" aria-label="Play video"><svg viewBox="0 0 64 64" aria-hidden="true"><path d="M23 14 50 32 23 50Z" fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/></svg></button>
 <button class="project-video-sound" type="button" aria-label="Mute video" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h4l5-4v14l-5-4H4Z"/><path class="sound-waves" d="M17 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/><path class="sound-muted" d="m17 10 4 4m0-4-4 4"/></svg></button>
 </div></div>`:cover?`<div class="project-reader-cover"><img src="${esc(cover)}" alt="${esc(p.title)} cover"></div>`:'';
 const moreImages=assets.images.slice(1).map(src=>`<img class="project-reader-extra" src="${esc(src)}" alt="${esc(p.title)} project image" loading="lazy">`).join('');
 const photoGallery=assets.gallery?.length?`<div class="project-photo-gallery"><div class="project-photo-masonry">${assets.gallery.map(photo=>`<img src="${esc(photo.src)}" alt="${esc(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">`).join('')}</div></div>`:'';
 const video=assets.video?`<video class="project-reader-extra" controls playsinline src="${esc(assets.video)}"></video>`:'';
 const projectLink=key==='dissonant'?{url:'https://store.steampowered.com/app/3878650/不完全调和少女/',label:'Steam Page ↗'}:key==='line'?{url:'https://lightaswind.com/',label:'Official Website ↗'}:null;
 const externalLink=projectLink?`<div class="project-reader-links"><a class="project-external-button" href="${esc(projectLink.url)}" target="_blank" rel="noopener noreferrer">${esc(projectLink.label)}</a></div>`:'';
 const designContent=assets.designSections?`${renderDesignSections(assets.designSections)}<section class="project-contributions" aria-labelledby="project-contributions-title"><h4 id="project-contributions-title" class="project-contributions-title">My Other Contributions</h4>${renderDesignSections(assets.contributionSections,true)}</section>`:'';
 const download=assets.download?`<a class="text-button" href="${esc(assets.download)}" download>Download playable build ↓</a>`:'';
 openDialog(`<div id="project-reader" class="project-reader" tabindex="0" role="region" aria-label="Scrollable project details">
 ${coverHtml}<article class="project-reader-body">
 <header class="project-reader-heading"><h2 id="dialog-title">${esc(p.title)}</h2>${details.date?`<p class="project-reader-date">${esc(details.date)}</p>`:''}</header>
 ${externalLink}
 <section class="project-reader-section" aria-labelledby="project-overview-title"><h3 id="project-overview-title" class="project-reader-section-title">Overview</h3>
 ${details.overview||details.sections.length||details.genre||details.role||details.tools.length?`<div class="project-reader-columns"><div class="project-reader-summary"><p>${esc(details.overview)}</p>${details.sections.map(([heading,text])=>`<p><strong>${esc(heading)}</strong><br>${esc(text)}</p>`).join('')}${download}</div>
 <aside class="project-reader-tools" aria-label="Project information"><h3>Project</h3><ul><li>${esc(details.genre)}</li><li>${esc(details.role)}</li></ul>${details.tools.length?`<h3>Tools</h3><ul>${details.tools.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</aside></div>`:''}
 </section>
 ${designContent || `<section class="project-reader-section" aria-labelledby="project-images-title"><h3 id="project-images-title" class="project-reader-section-title">Gameplay Images</h3>
 ${photoGallery}${moreImages}${video}</section>`}
 </article></div><div class="project-scrollbar" role="scrollbar" tabindex="0" aria-label="Project scroll" aria-orientation="vertical" aria-controls="project-reader" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span aria-hidden="true"></span></div>`,p.role.toUpperCase(),button);
}));
// 同时支持图片尺寸变化、窗口缩放和筛选之后的章节定位。
const resizeObserver=new ResizeObserver(()=>measure());
resizeObserver.observe(document.querySelector('main'));
addEventListener('resize',measure,{passive:true});
renderGallery();revealContent(document.querySelector('.content-world'),mainRevealSelector);measure();setMotion(reduced);
if(location.hash && document.getElementById(location.hash.slice(1))) requestAnimationFrame(()=>goTo(location.hash.slice(1),'none'));
})();
