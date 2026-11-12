/* Client review carousel with country flags */
import {$} from './utils.js';
import {REVIEWS} from './data.js';

const R=(c,x)=>`<svg viewBox="0 0 30 20" preserveAspectRatio="none">${c}</svg>`;
const FLAGS={
 us:R('<rect width="30" height="20" fill="#b22234"/><path d="M0 2.3h30M0 5.4h30M0 8.5h30M0 11.6h30M0 14.7h30M0 17.8h30" stroke="#fff" stroke-width="1.55"/><rect width="13" height="10.8" fill="#3c3b6e"/>'),
 nl:R('<rect width="30" height="7" fill="#ae1c28"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#21468b"/>'),
 at:R('<rect width="30" height="7" fill="#ed2939"/><rect y="6.7" width="30" height="6.7" fill="#fff"/><rect y="13.3" width="30" height="6.7" fill="#ed2939"/>')
};

export function renderReviews(){
 if(!REVIEWS.length)return;
 $('#revs').hidden=false;
 const card=r=>`<article class="rev"><div><div class="stars" aria-label="5 out of 5">★★★★★</div><p>“${r.text}”</p></div><div class="who"><span class="av">${r.name[0].toUpperCase()}</span><div><b>${r.name}</b><small><span class="fg">${FLAGS[r.flag]||''}</span>${r.country}</small></div></div></article>`;
 const html=REVIEWS.map(card).join('');
 $('#rvl').innerHTML=html+html.replace(/<article/g,'<article aria-hidden="true"');
}
