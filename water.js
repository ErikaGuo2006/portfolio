/* Viscous pearlescent liquid. Self-contained WebGL surface with a 2D fallback. */
(() => {
'use strict';
const VERTEX = `attribute vec2 a_position; varying vec2 v_uv;
void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const PACKING = `
float unpack16(vec2 rg){return (dot(rg,vec2(65280.,255.))-32768.)/16384.;}
vec2 pack16(float x){float n=floor(clamp(x*16384.+32768.,0.,65535.)+.5);float hi=floor(n/256.);return vec2(hi,n-hi*256.)/255.;}
`;
const SIMULATE = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_texel,u_from,u_to;
uniform float u_aspect,u_radius,u_force;
${PACKING}
float heightAt(vec2 p){return unpack16(texture2D(u_state,clamp(p,u_texel,1.-u_texel)).rg);}
void main(){
 vec4 s=texture2D(u_state,v_uv);float h=unpack16(s.rg),velocity=unpack16(s.ba);
 float lap=heightAt(v_uv+vec2(u_texel.x,0.))+heightAt(v_uv-vec2(u_texel.x,0.))+heightAt(v_uv+vec2(0.,u_texel.y))+heightAt(v_uv-vec2(0.,u_texel.y))-4.*h;
 // Strong drag and low surface tension: a thick surface slowly settles,
 // instead of propagating the fast, repeated rings of water.
 velocity=(velocity+lap*.052)*.86;
 h=(h+velocity+lap*.025)*.9994;
 vec2 p=v_uv*vec2(u_aspect,1.),a=u_from*vec2(u_aspect,1.),b=u_to*vec2(u_aspect,1.);
 vec2 pa=p-a,ba=b-a;float along=clamp(dot(pa,ba)/max(dot(ba,ba),.000001),0.,1.);
 float d=length(pa-ba*along);
 // Displace a shallow groove with soft raised shoulders, like a brush in polish.
 float brush=exp(-d*d/(u_radius*u_radius));
 h+=u_force*(brush*.9-exp(-d*d/(u_radius*u_radius*3.4))*.38);
 h=clamp(h,-1.25,1.25);
 vec2 edge=min(v_uv,1.-v_uv)/u_texel;
 float absorb=mix(.78,1.,smoothstep(0.,16.,min(edge.x,edge.y)));
 h*=absorb;velocity*=absorb;
 gl_FragColor=vec4(pack16(h),pack16(velocity));
}`;
const DISPLAY = `precision highp float;
varying vec2 v_uv;
uniform sampler2D u_state;
uniform vec2 u_texel,u_resolution;
uniform float u_time,u_aspect,u_caustics,u_strength;
${PACKING}
float hRaw(vec2 p){return unpack16(texture2D(u_state,clamp(p,u_texel*.5,1.-u_texel*.5)).rg);}
float heightAt(vec2 p){
 vec2 cell=p/u_texel-.5,base=floor(cell),f=fract(cell);vec2 q=(base+.5)*u_texel;
 float a=hRaw(q),b=hRaw(q+vec2(u_texel.x,0.)),c=hRaw(q+vec2(0.,u_texel.y)),d=hRaw(q+u_texel);
 return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
// Analytic slopes retain the original continuous liquid surface.
void wave(vec2 q,vec2 k,float amplitude,float speed,float phase,inout vec2 slope){
 float a=dot(q,k)+u_time*speed+phase;
 slope+=amplitude*k*cos(a);
}
float hash(vec2 p){vec3 a=fract(vec3(p.xyx)*.1031);a+=dot(a,a.yzx+33.33);return fract((a.x+a.y)*a.z);}
void main(){
 vec2 uv=v_uv;
 // Continuous, slow bulk drift keeps the polish moving without pointer input.
 vec2 drift=vec2(u_time*.12,-u_time*.055);
 vec2 q=vec2(uv.x*u_aspect,uv.y)*7.2+drift;
 float h=heightAt(uv),l=heightAt(uv-vec2(u_texel.x,0.)),r=heightAt(uv+vec2(u_texel.x,0.));
 float b=heightAt(uv-vec2(0.,u_texel.y)),t=heightAt(uv+vec2(0.,u_texel.y));
 vec2 drag=vec2(r-l,t-b)*(12.+u_strength*18.);
 q+=drag*.18+vec2(sin(q.y*.39+u_time*.035),cos(q.x*.28-u_time*.025))*.35;
 vec2 slope=vec2(0.);
 wave(q,vec2(1.55,.85),.10,.10,.7,slope);
 wave(q,vec2(-1.2,2.05),.075,-.085,2.1,slope);
 wave(q,vec2(2.65,-.6),.045,.065,4.,slope);
 wave(q,vec2(.9,3.2),.026,-.07,1.2,slope);
 slope+=drag;
 vec3 normal=normalize(vec3(-slope,1.));
 vec3 view=normalize(vec3(0.,-.12,1.));
 vec3 halfVector=normalize(normalize(vec3(-.38,.55,.9))+view);
 float facing=max(dot(normal,halfVector),0.);
 // Blue enamel body, a soft pearly lobe, and a sharper glossy reflection.
 float depth=.45+.22*sin(q.x*.63+q.y*.45)+.12*cos(q.y*.84-q.x*.3);
 vec3 color=mix(vec3(.190,.250,.570),vec3(.285,.395,.725),clamp(depth+normal.y*.20,0.,1.));
 float diffuse=max(dot(normal,normalize(vec3(-.42,.6,1.))),0.);
 color*=.82+diffuse*.24;
 float pearl=pow(facing,12.);
 float gloss=pow(facing,95.);
 float iridescence=.5+.5*sin(dot(normal,view)*22.+slope.x*2.);
 vec3 nacre=mix(vec3(.58,.69,.94),vec3(.57,.85,.92),iridescence);
 color+=nacre*pearl*.17;
 color+=vec3(.76,.88,.98)*gloss*.34;
 // The disturbed surface catches light, without painting a flat white stroke.
 color+=vec3(.09,.15,.21)*max(h,0.)*(.45+pearl)*u_strength;
 // Mica flakes are embedded in the liquid. Their facet normals follow the
 // surface, so they glint as it tilts, rather than blinking on a timer.
 vec2 material=vec2(uv.x*u_aspect,uv.y)+drift/7.2+slope*.006;
 vec2 cell=material*(u_resolution.y/3.1);
 vec2 id=floor(cell),local=fract(cell);
 float seed=hash(id+91.);
 vec2 center=vec2(hash(id+17.),hash(id+49.))*.72+.14;
 float size=mix(.08,.22,hash(id+33.));
 float flake=1.-smoothstep(size*.35,size,length(local-center));
 vec2 tilt=vec2(hash(id+5.),hash(id+13.))-.5;
 vec3 facet=normalize(vec3(normal.xy+tilt*.6,normal.z));
 float sparkle=pow(max(dot(facet,halfVector),0.),100.);
 float dust=step(.69,seed)*flake*sparkle;
 float micro=step(.80,hash(floor(material*u_resolution.y)))*pearl*.035;
 color+=vec3(.70,.82,.98)*(dust*.82+micro);
 float vignette=1.-.07*length((uv-.5)*vec2(.8,1.));
 gl_FragColor=vec4(color*vignette,1.);
}`;
function createGpu(canvas, surface, options) {
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power',preserveDrawingBuffer:false});
 if(!gl)throw new Error('WebGL unavailable');
 const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;};
 const program=source=>{const p=gl.createProgram(),v=compile(gl.VERTEX_SHADER,VERTEX),f=compile(gl.FRAGMENT_SHADER,source);gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);gl.deleteShader(v);gl.deleteShader(f);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;};
 const sim=program(SIMULATE),display=program(DISPLAY);
 const locations=(p,names)=>Object.fromEntries(names.map(n=>[n,gl.getUniformLocation(p,n)]));
 const su=locations(sim,['u_state','u_texel','u_from','u_to','u_aspect','u_radius','u_force']);
 const du=locations(display,['u_state','u_texel','u_resolution','u_time','u_aspect','u_caustics','u_strength']);
 const vertices=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertices);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
 let width=1,height=1,sw=1,sh=1,targets=[],read=0,raf=0,last=0,elapsed=0,accumulator=0;
 let visible=true,reduced=false,lost=false,suspended=false;
 const drops=[];
 function use(p){gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,vertices);const a=gl.getAttribLocation(p,'a_position');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);}
 function texture(){
  const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  const bytes=new Uint8Array(sw*sh*4);for(let i=0;i<bytes.length;i+=4){bytes[i]=128;bytes[i+2]=128;}
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,sw,sh,0,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
  const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER)!==gl.FRAMEBUFFER_COMPLETE)throw new Error('Water framebuffer unavailable');
  return {tex,fb};
 }
 function clear(){
  drops.length=0;
  for(const target of targets){gl.bindFramebuffer(gl.FRAMEBUFFER,target.fb);gl.clearColor(128/255,0,128/255,0);gl.clear(gl.COLOR_BUFFER_BIT);}
 }
 function resize(w,h){
  w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));
  const dpr=Math.min(devicePixelRatio||1,1,Math.sqrt(1600000/(w*h)));
  const rw=Math.round(w*dpr),rh=Math.round(h*dpr);
  if(width===w&&height===h&&canvas.width===rw&&canvas.height===rh&&targets.length)return;
  width=w;height=h;canvas.width=rw;canvas.height=rh;
  const grid=innerWidth<681?192:256;
  if(w>=h){sw=grid;sh=Math.max(96,Math.round(grid*h/w));}else{sh=grid;sw=Math.max(96,Math.round(grid*w/h));}
  targets.forEach(t=>{gl.deleteTexture(t.tex);gl.deleteFramebuffer(t.fb);});targets=[texture(),texture()];read=0;last=0;accumulator=0;
  draw();resume();
 }
 function disturb(x,y,previousX=x,previousY=y,strong=false){
  if(reduced||!visible||lost)return;
  const point={from:[previousX/width,1.-previousY/height],to:[x/width,1.-y/height],radius:(strong?34:25)/height,force:strong?.075:.035};
  if(drops.length>12)drops.shift();drops.push(point);resume();
 }
 function step(drop){
  use(sim);const write=1-read;gl.bindFramebuffer(gl.FRAMEBUFFER,targets[write].fb);gl.viewport(0,0,sw,sh);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,targets[read].tex);
  gl.uniform1i(su.u_state,0);gl.uniform2f(su.u_texel,1/sw,1/sh);gl.uniform1f(su.u_aspect,width/height);
  gl.uniform2fv(su.u_from,drop?drop.from:[-10,-10]);gl.uniform2fv(su.u_to,drop?drop.to:[-10,-10]);gl.uniform1f(su.u_radius,drop?drop.radius:.02);gl.uniform1f(su.u_force,drop?drop.force:0);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);read=write;
 }
 function draw(){
  if(!targets.length||lost)return;
  use(display);gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,targets[read].tex);
  gl.uniform1i(du.u_state,0);gl.uniform2f(du.u_texel,1/sw,1/sh);gl.uniform2f(du.u_resolution,canvas.width,canvas.height);gl.uniform1f(du.u_time,elapsed);gl.uniform1f(du.u_aspect,width/height);
  gl.uniform1f(du.u_caustics,options.caustics??.68);gl.uniform1f(du.u_strength,options.strength??1.);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
 }
 function frame(time){
  raf=0;if(!visible||reduced||suspended||document.hidden||lost)return;
  if(last&&time-last<32.5){raf=requestAnimationFrame(frame);return;}
  const dt=last?Math.min((time-last)/1000,.035):1/60;last=time;elapsed+=dt*.28;accumulator+=dt;
  let steps=0;while(accumulator>=1/120&&steps<4){step(drops.shift());accumulator-=1/120;steps++;}
  draw();raf=requestAnimationFrame(frame);
 }
 function pause(){cancelAnimationFrame(raf);raf=0;last=0;}
 function resume(){if(!raf&&visible&&!reduced&&!suspended&&!document.hidden&&!lost&&targets.length)raf=requestAnimationFrame(frame);}
 function setReduced(value){reduced=value;canvas.dataset.motion=value?'still':'animated';if(value){pause();clear();draw();}else resume();}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;canvas.dataset.active=String(visible);if(visible)resume();else{pause();clear();}},{threshold:0});observer.observe(surface);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else resume();});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;pause();canvas.style.opacity='0';canvas.dataset.renderer='context-lost';});
 canvas.addEventListener('webglcontextrestored',()=>location.reload(),{once:true});
 canvas.dataset.renderer='webgl';canvas.dataset.motion='animated';canvas.dataset.fpsLimit='30';
 const r=surface.getBoundingClientRect();resize(r.width,r.height);
 function setSuspended(value){suspended=value;canvas.dataset.suspended=String(value);if(value)pause();else resume();}
 return {resize,disturb,setReduced,setSuspended};
}
// Overdamped surface fallback with pearly highlights and embedded mica.
function createCpu(canvas,surface){
 const ctx=canvas.getContext('2d',{alpha:false});const buffer=document.createElement('canvas');const bctx=buffer.getContext('2d',{alpha:false});
 let w=1,h=1,gw=1,gh=1,current,previous,next,image,raf=0,last=0,time=0,reduced=false,visible=true,suspended=false;
 function resize(width,height){
  if(w===Math.round(width)&&h===Math.round(height)&&current)return;
  w=Math.max(1,Math.round(width));h=Math.max(1,Math.round(height));canvas.width=w;canvas.height=h;
  gw=w>=h?200:Math.max(90,Math.round(200*w/h));gh=w>=h?Math.max(90,Math.round(200*h/w)):200;
  buffer.width=gw;buffer.height=gh;current=new Float32Array(gw*gh);previous=new Float32Array(gw*gh);next=new Float32Array(gw*gh);image=bctx.createImageData(gw,gh);draw();resume();
 }
 function disturb(x,y,px=x,py=y,strong=false){
  if(reduced||!visible)return;
  const steps=Math.min(18,Math.max(1,Math.ceil(Math.hypot(x-px,y-py)/8)));
  for(let j=0;j<=steps;j++){
   const cx=(px+(x-px)*j/steps)/w*gw,cy=(py+(y-py)*j/steps)/h*gh;
   for(let iy=-4;iy<=4;iy++)for(let ix=-4;ix<=4;ix++){
    const xx=Math.round(cx)+ix,yy=Math.round(cy)+iy;
    if(xx>1&&yy>1&&xx<gw-2&&yy<gh-2)current[yy*gw+xx]=Math.min(1.,current[yy*gw+xx]+Math.exp(-(ix*ix+iy*iy)/9)*(strong?.12:.055));
   }
  }
  resume();
 }
 function step(){
  for(let y=1;y<gh-1;y++)for(let x=1;x<gw-1;x++){
   const i=y*gw+x;const lap=current[i-1]+current[i+1]+current[i-gw]+current[i+gw]-4*current[i];
   next[i]=(current[i]+(current[i]-previous[i])*.65+lap*.10)*.998;
  }
  const old=previous;previous=current;current=next;next=old;
 }
 function draw(){
  for(let y=0;y<gh;y++)for(let x=0;x<gw;x++){
   const i=y*gw+x,dx=(current[i+1]||0)-(current[i-1]||0),dy=(current[i+gw]||0)-(current[i-gw]||0);
   const fx=x+time*3.3,fy=y-time*1.5;
   const sx=Math.cos(fx*.04+fy*.025+time*.07)*.17+Math.cos(fx*.02-fy*.05-time*.05)*.13+dx*5;
   const sy=Math.cos(fx*.04+fy*.025+time*.07)*.12-Math.cos(fx*.02-fy*.05-time*.05)*.20+dy*5;
   const facing=Math.max(0,(-sx*-.20-sy*.22+.96)/Math.sqrt(1+sx*sx+sy*sy));
   const pearl=Math.pow(facing,12)*14,gloss=Math.pow(facing,95)*65;
   const seed=((Math.imul(i+1,1597334677)>>>0)%997)/997;
   const glitter=seed>.88?Math.pow(facing,36)*48:0;
   const p=i*4;
   image.data[p]=57+pearl*.7+gloss*.76+glitter*.7;
   image.data[p+1]=76+pearl*.85+gloss*.88+glitter*.82;
   image.data[p+2]=164+pearl+gloss*.98+glitter;image.data[p+3]=255;
  }
  bctx.putImageData(image,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(buffer,0,0,w,h);
 }
 function frame(now){raf=0;if(reduced||suspended||!visible||document.hidden)return;if(now-last<33){resume();return;}last=now;time+=.009;step();step();draw();resume();}
 function pause(){cancelAnimationFrame(raf);raf=0;}
 function resume(){if(!raf&&!reduced&&!suspended&&visible&&!document.hidden)raf=requestAnimationFrame(frame);}
 function setReduced(value){reduced=value;canvas.dataset.motion=value?'still':'animated';if(value){pause();current.fill(0);previous.fill(0);next.fill(0);draw();}else resume();}
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;canvas.dataset.active=String(visible);if(visible)resume();else pause();});observer.observe(surface);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else resume();});
 canvas.dataset.renderer='canvas2d';const r=surface.getBoundingClientRect();resize(r.width,r.height);
 function setSuspended(value){suspended=value;canvas.dataset.suspended=String(value);if(value)pause();else resume();}
 return {resize,disturb,setReduced,setSuspended};
}
window.createPortfolioWater=(canvas,surface,options={})=>{
 try{return createGpu(canvas,surface,options);}catch(error){
  // Replace the canvas because a successful WebGL context cannot switch to 2D.
  const replacement=canvas.cloneNode(false);canvas.replaceWith(replacement);return createCpu(replacement,surface);
 }
};
})();
