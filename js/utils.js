/* Shared helpers */
export const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
export const root=document.documentElement,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
export const copy=(t,ok)=>{(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(ok,()=>{const a=document.createElement('textarea');a.value=t;document.body.append(a);a.select();try{document.execCommand('copy');ok()}catch(e){}a.remove()})};
export function tween(el,to,suf='',pre='',dec=0){const from=+(el.dataset.v||0);el.dataset.v=to;let t0;const f=t=>{t0??=t;const p=Math.min((t-t0)/700,1),v=from+(to-from)*(1-Math.pow(1-p,3));el.textContent=pre+(dec?v.toFixed(dec):Math.round(v).toLocaleString())+suf;if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}
