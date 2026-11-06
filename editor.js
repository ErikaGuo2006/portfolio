/* Local-only layout inspector. Settings never leave this browser unless exported. */
(() => {
'use strict';
if(!['localhost','127.0.0.1','::1','[::1]',''].includes(location.hostname))return;
const STORAGE='atako-layout-v1';
const selector=['.hero h1','.contact-heading','.hand-note','.hero-intro p','.hero-intro>span','.hero-invitation','.hero-topline','.chapter-heading h2','.chapter-heading>p','.section-eyebrow>span','.about-copy>.mini-label','.about-copy h3','.about-bio p','.education h4','.timeline-item strong','.timeline-item p','.contact-block h4','.contact-block>a','.social-pending','.project-description>.mini-label','.project-description h3','.project-description>p','.project-meta','.game-number','.project-classification>span','.game-card h3','.game-card p','.next-chapter strong','.ending p','.filter>span'].join(',');
const targets=[...document.querySelectorAll(selector)];
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return(h>>>0).toString(36);};
const duplicates={};
const targetMap=new Map();
const labels=new Map();
const targetAliases=new Map();
function structuralKey(el){
 const parts=[];let node=el;
 while(node&&node!==document.body){if(node.id){parts.unshift(node.id);break;}const parent=node.parentElement;if(!parent)break;parts.unshift(node.tagName.toLowerCase()+Array.prototype.indexOf.call(parent.children,node));node=parent;}
 return "layout-"+parts.join("-");
}
for(const el of targets){
 const section=el.closest('section')?.id||'page';
 const text=el.textContent.replace(/\s+/g,' ').trim();
 const seed=section+'-'+el.tagName.toLowerCase()+'-'+hash(text);const n=duplicates[seed]=(duplicates[seed]||0)+1;
 const legacy=seed+'-'+n;
 const key=el.dataset.layoutKey||el.id||structuralKey(el);el.dataset.layoutId=key;targetMap.set(key,el);
 targetAliases.set(legacy,key);if(el.dataset.layoutLegacy)targetAliases.set(el.dataset.layoutLegacy,key);
 labels.set(key,section.replaceAll('-',' ')+' / '+text.slice(0,58));
}
const fields=[
 {key:'font-size',label:'Font size',unit:'px',min:6,max:320,step:1},
 {key:'line-height',label:'Line height',unit:'',min:.8,max:3,step:.05},
 {key:'letter-spacing',label:'Letter spacing',unit:'px',min:-8,max:20,step:.1},
 {key:'width',label:'Text width',unit:'px',min:60,max:1600,step:1},
 {key:'margin-top',label:'Space above',unit:'px',min:-80,max:240,step:1},
 {key:'margin-bottom',label:'Space below',unit:'px',min:-80,max:240,step:1},
 {key:'margin-left',label:'Left offset',unit:'px',min:0,max:240,step:1}
];
const allowed=new Set([...fields.map(f=>f.key),'text-align','font-family','font-weight','font-style']);
const families={serif:'"Noto Serif SC", Georgia, serif',sans:'Arial, sans-serif',condensed:'"Barlow Condensed", Arial, sans-serif'};
function empty(){return{version:1,desktop:{},mobile:{}};}
function validate(raw){
 if(!raw||raw.version!==1)throw new Error('Unsupported settings file');
 const clean=empty();
 for(const mode of ['desktop','mobile']){
  for(const [savedKey,props] of Object.entries(raw[mode]||{})){
   const key=targetAliases.get(savedKey)||savedKey;
   if(!props||typeof props!=='object')continue;
   const result={};
   for(const [prop,value] of Object.entries(props)){
    if(!allowed.has(prop)||typeof value!=='string')continue;
    const field=fields.find(f=>f.key===prop);
    if(field){const n=Number(value.replace(/px$/,''));if(Number.isFinite(n)&&n>=field.min&&n<=field.max)result[prop]=n+field.unit;}
    else if(prop==='text-align'&&['left','center','right'].includes(value))result[prop]=value;
    else if(prop==='font-family'&&Object.values(families).includes(value))result[prop]=value;
    else if(prop==='font-weight'&&['400','600','900'].includes(value))result[prop]=value;
    else if(prop==='font-style'&&value==='normal')result[prop]=value;
   }
   if(Object.keys(result).length)clean[mode][key]={...clean[mode][key],...result};
  }
 }
 return clean;
}
let state=empty();try{const saved=localStorage.getItem(STORAGE);if(saved){const backup=STORAGE+'-before-key-recovery';if(!localStorage.getItem(backup))localStorage.setItem(backup,saved);state=validate(JSON.parse(saved));}}catch{}
let enabled=false,selected=null,transaction=false;
const history=[];
const profile=()=>matchMedia('(max-width:680px)').matches?'mobile':'desktop';
const style=document.createElement('style');style.id='local-layout-overrides';document.head.append(style);
function apply(){
 let css='';
 for(const mode of ['desktop','mobile']){
  let rules='';
  for(const[key,props]of Object.entries(state[mode])){
   const declarations=Object.entries(props).map(([k,v])=>`${k}:${v}!important`).join(';');
   rules+=`[data-layout-id="${key}"]{${declarations}${props.width?';max-width:100%!important;box-sizing:border-box':''}}`;
   if(props['font-size']||props['font-family']||props['font-weight']||props['font-style']||props['letter-spacing']||props['line-height'])rules+=`[data-layout-id="${key}"] em,[data-layout-id="${key}"] span{font:inherit!important;letter-spacing:inherit!important}`;
  }
  css+=`@media(${mode==='mobile'?'max':'min'}-width:${mode==='mobile'?680:681}px){${rules}}`;
 }
 style.textContent=css;
}
apply();
const root=document.createElement('div');root.id='layout-editor';
root.innerHTML=`<button id="layout-toggle" aria-controls="layout-panel" aria-expanded="false">Edit layout</button>
<aside id="layout-panel" aria-label="Layout editor" hidden>
 <div class="le-heading"><strong>Layout editor</strong><button id="le-close" aria-label="Close layout editor">✕</button></div>
 <p class="le-intro">Click text on the page to adjust it.</p>
 <div class="le-mode" id="le-mode"></div>
 <label class="le-select-label" for="le-target">Selected text</label><select id="le-target"><option value="">Choose text…</option></select>
 <fieldset id="le-fields" disabled><legend class="sr-only">Text properties</legend>
 <label class="le-select-label" for="le-family">Typeface</label><select id="le-family"><option value="serif">Noto Serif SC Black</option><option value="sans">Sans serif</option><option value="condensed">Barlow Condensed</option></select>
 ${fields.map(f=>`<div class="le-field"><label for="le-${f.key}">${f.label}${f.unit?' · '+f.unit:''}</label><input id="le-${f.key}" aria-label="${f.label}" type="number" min="${f.min}" max="${f.max}" step="${f.step}"><input class="le-range" data-property="${f.key}" aria-label="${f.label} slider" type="range" min="${f.min}" max="${f.max}" step="${f.step}"></div>`).join('')}
 <label class="le-select-label" for="le-align">Alignment</label><select id="le-align"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select>
 <button id="le-reset-text" type="button">Reset selected text</button>
 </fieldset>
 <div class="le-actions"><button id="le-undo">Undo</button><button id="le-save">Save locally</button><button id="le-export">Export settings</button><button id="le-import">Import settings</button><button id="le-reset">Reset all</button><button id="le-side">Move panel left</button></div>
 <input id="le-file" type="file" accept="application/json,.json" hidden>
 <p id="le-status" role="status">Changes save in this browser. Export to share them.</p>
</aside>`;
document.body.append(root);
const $=id=>root.querySelector('#'+id);
const panel=$('layout-panel'),picker=$('le-target'),status=$('le-status');
for(const [key,label]of labels){const option=document.createElement('option');option.value=key;option.textContent=label;picker.append(option);}
function say(text){status.textContent=text;}
function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(state));say('Saved in this browser. Export to share your changes.');}catch{say('Browser storage unavailable. Export to keep your changes.');}}
function snapshot(){history.push(JSON.stringify(state));if(history.length>40)history.shift();}
function refresh(){
 $('le-mode').textContent=profile()==='mobile'?'MOBILE · up to 680px':'DESKTOP · above 680px';
 if(!selected)return;
 const el=targetMap.get(selected),c=getComputedStyle(el),overrides=state[profile()][selected]||{};
 for(const f of fields){
  let n=parseFloat(c.getPropertyValue(f.key));
  if(f.key==='line-height')n=n/parseFloat(c.fontSize);
  if(f.key==='width')n=el.getBoundingClientRect().width;
  if(!Number.isFinite(n))n=f.key==='line-height'?1.5:0;
  if(overrides[f.key])n=parseFloat(overrides[f.key]);
  n=Math.max(f.min,Math.min(f.max,Math.round(n*100)/100));
  $('le-'+f.key).value=n;root.querySelector(`[data-property="${f.key}"]`).value=n;
 }
 $('le-align').value=['left','center','right'].includes(c.textAlign)?c.textAlign:'left';
 $('le-family').value=c.fontFamily.includes('Noto')?'serif':c.fontFamily.includes('Barlow')?'condensed':'sans';
}
function select(key,scroll=false){
 targetMap.get(selected)?.classList.remove('layout-selected');selected=key||null;picker.value=key||'';
 $('le-fields').disabled=!selected;
 if(selected){const el=targetMap.get(selected);el.classList.add('layout-selected');if(scroll)el.scrollIntoView({behavior:'smooth',block:'center'});}
 refresh();
}
function toggle(force){
 enabled=typeof force==='boolean'?force:!enabled;panel.hidden=!enabled;
 document.body.classList.toggle('layout-editing',enabled);
 $('layout-toggle').textContent=enabled?'Finish editing':'Edit layout';$('layout-toggle').setAttribute('aria-expanded',String(enabled));
 if(!enabled){targetMap.get(selected)?.classList.remove('layout-selected');document.querySelector('.layout-hover')?.classList.remove('layout-hover');}
 else{panel.scrollTop=0;if(selected)targetMap.get(selected)?.classList.add('layout-selected');refresh();}
}
function change(prop,value){if(!selected)return;if(!transaction){snapshot();transaction=true;}const group=state[profile()];group[selected]||={};group[selected][prop]=value;apply();persist();}
$('layout-toggle').onclick=()=>toggle();$('le-close').onclick=()=>toggle(false);
picker.onchange=()=>select(picker.value,true);
for(const f of fields){
 const number=$('le-'+f.key),range=root.querySelector(`[data-property="${f.key}"]`);
 for(const input of [number,range]){
  input.addEventListener('input',()=>{if(input.value==='')return;let n=Number(input.value);if(!Number.isFinite(n)||n<f.min||n>f.max)return;number.value=n;range.value=n;change(f.key,n+f.unit);});
  input.addEventListener('change',()=>{transaction=false;refresh();});
 }
}
$('le-align').onchange=e=>{change('text-align',e.target.value);transaction=false;};
$('le-family').onchange=e=>{const family=e.target.value;change('font-family',families[family]);change('font-weight',family==='serif'?'900':family==='condensed'?'600':'400');change('font-style','normal');transaction=false;};
$('le-reset-text').onclick=()=>{if(!selected)return;snapshot();delete state[profile()][selected];transaction=false;apply();persist();refresh();};
$('le-reset').onclick=()=>{snapshot();state=empty();transaction=false;apply();persist();refresh();say('All adjustments reset. Undo can restore them.');};
$('le-undo').onclick=()=>{if(!history.length){say('No changes to undo.');return;}state=validate(JSON.parse(history.pop()));transaction=false;apply();persist();refresh();};
$('le-save').onclick=persist;
$('le-export').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='atako-layout-settings.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);say('Settings exported. Send the JSON file to apply them permanently.');};
$('le-import').onclick=()=>$('le-file').click();
$('le-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>500000)throw new Error('Too large');const incoming=validate(JSON.parse(await file.text()));snapshot();state=incoming;transaction=false;apply();persist();refresh();say('Settings imported and saved.');}catch{say('Could not import. Choose an exported layout settings JSON file.');}e.target.value='';};
$('le-side').onclick=()=>{const left=root.classList.toggle('le-left');$('le-side').textContent=left?'Move panel right':'Move panel left';};
document.addEventListener('click',e=>{
 if(!enabled||root.contains(e.target))return;
 const el=e.target.closest('[data-layout-id]');if(!el)return;
 e.preventDefault();e.stopImmediatePropagation();transaction=false;select(el.dataset.layoutId);
},true);
document.addEventListener('pointerover',e=>{if(!enabled||root.contains(e.target))return;document.querySelector('.layout-hover')?.classList.remove('layout-hover');e.target.closest('[data-layout-id]')?.classList.add('layout-hover');});
document.addEventListener('keydown',e=>{if(e.altKey&&e.key.toLowerCase()==='e'){e.preventDefault();toggle();}if(e.key==='Escape'&&enabled&&!document.querySelector('dialog[open]'))toggle(false);});
let previousMode=profile();addEventListener('resize',()=>{if(previousMode!==profile()){previousMode=profile();transaction=false;}if(enabled)refresh();},{passive:true});
refresh();
})();
