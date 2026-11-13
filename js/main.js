/* Entry point: smooth scroll, page router, reveal animations, intro */
import {$,$$,root,reduce} from './utils.js';
import {mountArt} from './art.js';
import {renderReviews} from './reviews.js';
import {initWork} from './work.js';
import {initTools} from './tools.js';
import {initContact} from './contact.js';
import {initTheme} from './theme.js';
import {initGames} from './games.js';
import {initPalette} from './palette.js';
import {initNav} from './nav.js';

$('#yr').textContent=new Date().getFullYear();
initTheme();mountArt();renderReviews();initWork();initTools();initContact();initGames();initPalette();initNav();
const tags=['UI/UX','Google Ads','Figma','Landing pages','YouTube','Adobe XD','Portfolio sites','Instagram','TikTok','Gumroad'];
$('#mq').innerHTML=[...tags,...tags].map(t=>`<span>${t}</span>`).join('');
const st=$('#stmt');st.innerHTML=st.textContent.split(' ').map(w=>`<span>${w}</span>`).join(' ');
const sw=$$('#stmt span');
const dev=$('#dev'),upEl=$('#up'),barEl=$('#bar');
let maxScroll=1,devTop=0,stTop=0,stH=1,lit=0,upOn=false,lastP=-1;
const docTop=el=>{let t=0;while(el){t+=el.offsetTop;el=el.offsetParent}return t};
/* Layout is measured once (and again when it changes), so scrolling never forces a layout */
function measure(){maxScroll=Math.max(1,root.scrollHeight-innerHeight);if(dev&&dev.offsetParent)devTop=docTop(dev);if(st.offsetParent){stTop=docTop(st);stH=st.offsetHeight}}
const onScroll=y=>{
 const on=y>700;if(on!==upOn){upOn=on;upEl.classList.toggle('on',on)}
 barEl.style.transform=`scaleX(${Math.min(1,y/maxScroll)})`;
 if(dev&&dev.offsetParent&&!reduce){const p=Math.min(1,Math.max(0,(innerHeight-(devTop-y))/(innerHeight*.85)));
  if(Math.abs(p-lastP)>.002){lastP=p;dev.style.transform=`perspective(1400px) rotateX(${(1-p)*16}deg) scale(${.8+.2*p})`}}
 if(st.offsetParent){const p=Math.min(1,Math.max(0,(innerHeight*.9-(stTop-y))/(stH+innerHeight*.45)));
  const n=Math.min(sw.length,Math.max(0,Math.ceil(p*sw.length*1.15)));
  while(lit<n)sw[lit++].classList.add('on');while(lit>n)sw[--lit].classList.remove('on')}};
let lenis=null;
if(window.Lenis&&!reduce){lenis=new Lenis({lerp:.09,wheelMultiplier:1,smoothWheel:true});
 lenis.on('scroll',e=>onScroll(e.scroll));const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)}
else addEventListener('scroll',()=>onScroll(scrollY),{passive:true});
if(window.ResizeObserver)new ResizeObserver(()=>{measure();if(lenis)lenis.resize()}).observe(document.body);
const pages=$$('.pg'),navs=$$('#ln a');let cur=null;
const valid=n=>pages.some(p=>p.dataset.p===n);
function show(n){pages.forEach(p=>p.classList.toggle('on',p.dataset.p===n));cur=n;
 navs.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+n));
 document.title=pages.find(p=>p.dataset.p===n).dataset.t;
 lenis?lenis.scrollTo(0,{immediate:true}):scrollTo(0,0);lenis&&lenis.resize();measure();onScroll(0)}
const main=$('main');let busy=false,quiet=false,want=null;
const hashPage=()=>{const h=location.hash.slice(1);return valid(h)?h:'home'};
function navigate(n,clicked){
 if(!valid(n))n='home';
 if(n===cur){if(clicked)lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'});return}
 if(busy){want=n;return}
 busy=true;main.classList.add('xo');
 setTimeout(()=>{show(n);main.classList.add('xi');main.classList.remove('xo');void main.offsetWidth;main.classList.remove('xi');
  setTimeout(()=>{busy=false;if(want&&want!==cur){const w=want;want=null;navigate(w)}else want=null},560)},340)}
function setHash(n){quiet=true;try{history.pushState(null,'','#'+n)}catch(e){location.hash=n}setTimeout(()=>{quiet=false},600)}
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const n=a.getAttribute('href').slice(1);if(!valid(n))return;
 e.preventDefault();if(n!==cur)setHash(n);navigate(n,true)});
addEventListener('hashchange',()=>{if(!quiet)navigate(hashPage())});
show(hashPage());
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
 const n=e.target.querySelector('[data-n]');if(n)count(n)}),{threshold:.16});
$$('.rv').forEach((el,i)=>{el.style.transitionDelay=(i%3)*90+'ms';io.observe(el)});
function count(n){const to=+n.dataset.n,s=n.dataset.s||'';let t0;const f=t=>{t0??=t;const p=Math.min((t-t0)/1500,1);
 n.textContent=Math.round(to*(1-Math.pow(1-p,3)))+(p===1?s:'');if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
const gl=$('.glow');
let tx=innerWidth/2,ty=innerHeight/2,gx=tx,gy=ty,gr=0;
gl.style.transform=`translate3d(${gx}px,${gy}px,0)`;
if(matchMedia('(pointer:fine)').matches&&!reduce){
 /* The glow follows the mouse with its own transform and sleeps when it has caught up */
 const glide=()=>{gx+=(tx-gx)*.1;gy+=(ty-gy)*.1;gl.style.transform=`translate3d(${gx}px,${gy}px,0)`;gr=Math.abs(tx-gx)+Math.abs(ty-gy)>.5?requestAnimationFrame(glide):0};
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(!gr)gr=requestAnimationFrame(glide)},{passive:true});
 $$('.tile').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',e.clientX-r.left+'px');c.style.setProperty('--y',e.clientY-r.top+'px')}));
 $$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.22}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')})}
/* Pause animations in sections that are off screen */
const po=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('off',!e.isIntersecting)),{rootMargin:'160px 0px'});
$$('.hero,.mq,.s,.hd').forEach(el=>po.observe(el));
const ld=$('#ld');
if(ld){let seen=false;try{seen=sessionStorage.getItem('ld')}catch(e){}
 if(reduce||seen){ld.remove()}else{ld.querySelector('b').innerHTML='SAIKAT'.split('').map((c,i)=>`<span style="animation-delay:${i*.09}s">${c}</span>`).join('');
  $$('.hero .rv').forEach((e,i)=>e.style.transitionDelay=(2.5+i*.14)+'s');setTimeout(()=>ld.classList.add('out'),2500);setTimeout(()=>{ld.remove();$$('.hero .rv').forEach(e=>e.style.transitionDelay='')},3600);try{sessionStorage.setItem('ld',1)}catch(e){}}}
const ck=()=>{const t=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dhaka',hour:'numeric',minute:'2-digit',second:'2-digit'}).format(new Date());$$('.clk').forEach(e=>e.textContent=t)};ck();setInterval(ck,1000);
const tkb=$('#tkb'),pop=$('#pop'),closePop=()=>{pop.classList.remove('on');tkb.setAttribute('aria-expanded','false')};
tkb.addEventListener('click',e=>{e.stopPropagation();const o=pop.classList.toggle('on');tkb.setAttribute('aria-expanded',o)});
document.addEventListener('click',closePop);addEventListener('keydown',e=>{if(e.key==='Escape')closePop()});
$$('.fq button').forEach(b=>b.addEventListener('click',()=>{const f=b.parentNode,a=f.querySelector('.an'),o=f.classList.toggle('on');a.style.maxHeight=o?a.scrollHeight+'px':0;b.setAttribute('aria-expanded',o)}));
const prs=$$('.pr');let pk=0;setInterval(()=>{if(!$('.proc.in')||!prs[0].offsetParent)return;prs.forEach((e,k)=>e.classList.toggle('act',k===pk));pk=(pk+1)%prs.length},1700);
$('#up').addEventListener('click',()=>lenis?lenis.scrollTo(0):scrollTo({top:0,behavior:'smooth'}));
