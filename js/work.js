/* Work page: concept projects with animated browser mockups */
import {$} from './utils.js';
import {CON} from './data.js';

const tl=(a,k)=>`<div class="g3 ${k}">${a.map(t=>`<div><i></i><span>${t}</span></div>`).join('')}</div>`;
const mock=c=>`<div class="bm" style="--c1:${c.c1};--c2:${c.c2};--bg:${c.bg};--tx:${c.tx}"><div class="bb"><i></i><i></i><i></i><span>${c.url}</span></div><div class="vp"><div class="sc"><div class="nv"><b>${c.logo}</b><div>${c.nav.map(x=>`<span>${x}</span>`).join('')}</div></div><div class="hr"><h4>${c.h}</h4><p>${c.sub}</p><a>${c.cta}</a></div>${tl(c.tiles,c.k)}<div class="ct"><h5>${c.h2}</h5><p>${c.p2}</p></div>${tl(c.t2,c.k)}<div class="hr"><h4>${c.cta}</h4><a>${c.cta}</a></div></div></div></div>`;

export function initWork(){
 $('#cs').innerHTML=CON.map((c,i)=>`<article class="cc ${i%2?'r':''} rv"><div class="ci"><p class="eb">${c.type}</p><h2 class="gt">${c.name}</h2><span class="tag">Concept project</span><p class="m">${c.brief}</p><ul class="ck">${c.did.map(d=>`<li>${d}</li>`).join('')}</ul><div class="chips">${c.tools.map(t=>`<span>${t}</span>`).join('')}</div><div class="ds"><i style="background:${c.c1}"></i><i style="background:${c.c2}"></i><i style="background:${c.bg}"></i>Palette</div></div>${mock(c)}</article>`).join('');
 $('#hm').innerHTML=mock(CON[3]);
}
