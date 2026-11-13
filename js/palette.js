/* Command palette: Ctrl or Cmd + K, or the search button */
import {$,$$} from './utils.js';
import {CAL} from './data.js';
import {MODES,setMode} from './theme.js';

export function initPalette(){
 const el=$('#cp'),inp=$('#cpi'),list=$('#cpl');
 let items=[],sel=0;
 const page=h=>()=>{const a=$(`#ln a[href="#${h}"]`);if(a)a.click()};
 const link=(href,blank)=>()=>{const a=document.createElement('a');a.href=href;if(blank){a.target='_blank';a.rel='noopener'}document.body.append(a);a.click();a.remove()};
 const ALL=[
  ...[['home','Home'],['services','Services'],['work','Work'],['products','Products'],['tools','Free tools'],['play','Play games'],['about','About'],['contact','Contact']].map(([h,n])=>({n:'Go to '+n,k:'Page',run:page(h)})),
  {n:'Send an email',k:'Contact',run:link('mailto:saikatbabd@gmail.com?subject=Project%20enquiry')},
  {n:'Message on Telegram',k:'Contact',run:link('https://t.me/hymrbairagee',true)},
  ...(CAL?[{n:'Book a call',k:'Contact',run:link(CAL,true)}]:[]),
  ...MODES.map(([m,n,d])=>({n:'Appearance: '+n,k:d,run:()=>setMode(m)}))
 ];
 const render=q=>{
  const s=q.toLowerCase().trim();
  items=ALL.filter(x=>(x.n+' '+x.k).toLowerCase().includes(s));sel=0;
  list.innerHTML=items.length?items.map((x,i)=>`<button type="button" data-i="${i}"${i?'':' class="on"'}>${x.n}<small>${x.k}</small></button>`).join(''):'<p>No matches</p>';
 };
 const mark=()=>{$$('#cpl button').forEach((b,i)=>b.classList.toggle('on',i===sel));const b=$$('#cpl button')[sel];if(b)b.scrollIntoView({block:'nearest'})};
 const open=()=>{el.classList.add('on');el.setAttribute('aria-hidden','false');inp.value='';render('');setTimeout(()=>inp.focus(),30)};
 const close=()=>{el.classList.remove('on');el.setAttribute('aria-hidden','true')};
 const run=i=>{const x=items[i];if(!x)return;close();setTimeout(x.run,60)};
 inp.addEventListener('input',()=>render(inp.value));
 inp.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();sel=Math.min(items.length-1,sel+1);mark()}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=Math.max(0,sel-1);mark()}
  else if(e.key==='Enter'){e.preventDefault();run(sel)}
 });
 list.addEventListener('click',e=>{const b=e.target.closest('button');if(b)run(+b.dataset.i)});
 el.addEventListener('click',e=>{if(e.target===el)close()});
 addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();el.classList.contains('on')?close():open()}
  else if(e.key==='Escape')close();
 });
 const sb=$('#srb');if(sb)sb.addEventListener('click',open);
}
