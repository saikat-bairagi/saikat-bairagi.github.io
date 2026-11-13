/* Appearance: Auto (time of day), System, Morning, Afternoon, Evening and Night */
import {$,$$,root,reduce} from './utils.js';

const I=d=>`<svg viewBox="0 0 24 24">${d}</svg>`;
const ICON={
 morning:I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
 afternoon:I('<path d="M5 16a7 7 0 0 1 14 0"/><path d="M2 20h20M12 4v2M4.6 8.6l1.4 1.4M19.4 8.6 18 10"/>'),
 evening:I('<path d="M6 17a6 6 0 0 1 12 0"/><path d="M2 21h20M12 7V3M9 5l3-2 3 2"/>'),
 night:I('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>')
};
const SW={
 morning:'linear-gradient(135deg,#fbfbfd 50%,#0b6b43 50%)',
 afternoon:'linear-gradient(135deg,#fdf4e4 50%,#b4531a 50%)',
 evening:'linear-gradient(135deg,#f1e6d3 50%,#7a4a1c 50%)',
 night:'linear-gradient(135deg,#000 50%,#8ff0b5 50%)',
 auto:'conic-gradient(#fbfbfd 0 25%,#fdf4e4 0 50%,#f1e6d3 0 75%,#000 0)',
 system:'linear-gradient(90deg,#fbfbfd 50%,#000 50%)'
};
export const MODES=[['auto','Auto','Follows the time of day'],['system','System','Matches your device'],['morning','Morning','Light'],['afternoon','Afternoon','Warm'],['evening','Evening','Sepia'],['night','Night','Dark']];
const META={morning:'#fbfbfd',afternoon:'#fdf4e4',evening:'#f1e6d3',night:'#000000'};
const lightQuery=matchMedia('(prefers-color-scheme: light)');
const byHour=()=>{const h=new Date().getHours();return h>=5&&h<11?'morning':h>=11&&h<16?'afternoon':h>=16&&h<20?'evening':'night'};
const resolve=m=>m==='auto'?byHour():m==='system'?(lightQuery.matches?'morning':'night'):m;
let mode='night';
try{const m=localStorage.getItem('sb-mode');if(MODES.some(x=>x[0]===m))mode=m}catch(e){}

function paint(t){
 root.dataset.theme=t;root.dataset.mode=mode;
 const mt=$('meta[name="theme-color"]');if(mt)mt.setAttribute('content',META[t]);
 $('#tmb').innerHTML=ICON[t];
 $$('#tpop button').forEach(b=>b.classList.toggle('on',b.dataset.m===mode));
 window.dispatchEvent(new Event('themechange'));
}
/* A circular reveal from the button where the browser supports it, a soft fade elsewhere */
function setTheme(t,x,y){
 if(root.dataset.theme===t){paint(t);return}
 if(document.startViewTransition&&!reduce){
  const r=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y));
  document.startViewTransition(()=>paint(t)).ready
   .then(()=>root.animate({clipPath:[`circle(0px at ${x}px ${y}px)`,`circle(${r}px at ${x}px ${y}px)`]},{duration:800,easing:'cubic-bezier(.2,.8,.2,1)',pseudoElement:'::view-transition-new(root)'}))
   .catch(()=>{});
 }else{root.classList.add('ta');paint(t);setTimeout(()=>root.classList.remove('ta'),800)}
}
export function setMode(m){
 mode=m;
 try{localStorage.setItem('sb-mode',m)}catch(e){}
 const r=$('#tmb').getBoundingClientRect();
 setTheme(resolve(m),r.left+r.width/2,r.top+r.height/2);
}
export function initTheme(){
 const pop=$('#tpop'),btn=$('#tmb');
 pop.innerHTML='<p class="tt">Appearance</p>'+MODES.map(([m,n,d])=>`<button type="button" role="menuitemradio" data-m="${m}"><i class="sw2" style="background:${SW[m]}"></i><span>${n}<small>${d}</small></span></button>`).join('');
 const close=()=>{pop.classList.remove('on');btn.setAttribute('aria-expanded','false')};
 paint(resolve(mode));
 btn.addEventListener('click',()=>{const o=pop.classList.toggle('on');btn.setAttribute('aria-expanded',o)});
 pop.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;setMode(b.dataset.m);close()});
 window.addEventListener('click',e=>{if(!e.target.closest('.th'))close()},true);
 addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 setInterval(()=>{if(mode==='auto'){const t=resolve('auto');if(t!==root.dataset.theme)setTheme(t,innerWidth/2,0)}},30000);
 if(lightQuery.addEventListener)lightQuery.addEventListener('change',()=>{if(mode==='system')setTheme(resolve('system'),innerWidth/2,0)});
}
