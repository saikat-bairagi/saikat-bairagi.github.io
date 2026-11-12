/* Animated illustrations, drawn in code (no image files) */
import {$$} from './utils.js';

export const ART={
m:`<svg viewBox="0 0 200 140"><g class="bars"><rect x="22" y="84" width="22" height="36" rx="5"/><rect x="54" y="68" width="22" height="52" rx="5"/><rect x="86" y="76" width="22" height="44" rx="5"/><rect x="118" y="50" width="22" height="70" rx="5"/><rect x="150" y="28" width="22" height="92" rx="5"/></g><polyline class="ln" points="33,72 65,54 97,62 129,36 161,14"/><circle class="pt" cx="161" cy="14" r="6"/></svg>`,
d:`<svg viewBox="0 0 200 140"><rect class="fr" x="30" y="24" width="140" height="92" rx="10"/><path class="cv" d="M50 98 C80 30,120 30,150 98"/><g class="an"><circle cx="50" cy="98" r="5"/><circle cx="150" cy="98" r="5"/></g><path class="cur" d="M0 0 l0 17 l5 -4 l4 9 l4 -2 l-4 -9 l6 0z"/></svg>`,
w:`<svg viewBox="0 0 200 140"><rect class="win" x="20" y="20" width="160" height="100" rx="10"/><circle class="dt" cx="35" cy="34" r="3.5"/><circle class="dt" cx="47" cy="34" r="3.5"/><circle class="dt" cx="59" cy="34" r="3.5"/><rect class="cl" x="38" y="54" width="90" height="7" rx="3.5"/><rect class="cl" x="52" y="70" width="70" height="7" rx="3.5"/><rect class="cl" x="52" y="86" width="104" height="7" rx="3.5"/><rect class="cr" x="38" y="100" width="6" height="10" rx="2"/></svg>`,
p:`<svg viewBox="0 0 200 140"><rect class="cd" x="52" y="16" width="96" height="76" rx="10"/><rect class="cd" x="42" y="34" width="96" height="76" rx="10"/><rect class="cd" x="62" y="48" width="96" height="76" rx="10"/><path class="ok" d="M92 88 l14 14 l28 -30"/></svg>`};
export function mountArt(){
 $$('[data-art]').forEach(e=>e.innerHTML=ART[e.dataset.art]);
}
