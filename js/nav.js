/* Mobile navigation: on phones the links fold into one arrow button */
import {$} from './utils.js';

export function initNav(){
 const nav=$('nav'),btn=$('#mnb');
 let y0=0;
 const set=o=>{
  if(o)y0=scrollY;
  nav.classList.toggle('open',o);
  btn.setAttribute('aria-expanded',o);
 };
 btn.addEventListener('click',e=>{e.stopPropagation();set(!nav.classList.contains('open'))});
 $('#ln').addEventListener('click',e=>{if(e.target.closest('a'))set(false)});
 document.addEventListener('click',e=>{if(!e.target.closest('nav'))set(false)});
 addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
 /* Fold the menu away when the page is scrolled, or when the screen grows to desktop size */
 addEventListener('scroll',()=>{if(nav.classList.contains('open')&&Math.abs(scrollY-y0)>48)set(false)},{passive:true});
 const wide=matchMedia('(min-width:861px)');
 if(wide.addEventListener)wide.addEventListener('change',e=>{if(e.matches)set(false)});
}
