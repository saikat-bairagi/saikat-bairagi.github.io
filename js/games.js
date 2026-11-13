/* Play page: 2048, Snake, Memory and Stack.
   Loops only run while a game is on screen, so the rest of the site stays fast. */
import {$,$$,root,reduce} from './utils.js';
import {planMove,hasMoves,emptyCells,DIRS,newSnake,turn,snakeStep,stackPlace,shuffle} from './game-logic.js';

const store={get:k=>{try{return +localStorage.getItem('sb-'+k)||0}catch(e){return 0}},set:(k,v)=>{try{localStorage.setItem('sb-'+k,v)}catch(e){}}};
const css=n=>getComputedStyle(root).getPropertyValue(n).trim();
let C={};
const pal=()=>{C={bg:css('--bg'),card:css('--card'),fg:css('--fg'),mute:css('--mute'),line:css('--line'),g:css('--g')}};
const live=id=>{const pg=$('.pg.on');return !!pg&&pg.dataset.p==='play'&&!document.hidden&&$('#gm-'+id).classList.contains('on')};
const clearOver=id=>$$('#wr-'+id+' .gm-over').forEach(o=>o.remove());
const overlay=(id,title,sub,again,label='Play again')=>{
 clearOver(id);
 const o=document.createElement('div');o.className='gm-over';
 o.innerHTML=`<b>${title}</b><span>${sub}</span><button class="b p" type="button">${label}</button>`;
 o.querySelector('button').addEventListener('click',again);
 $('#wr-'+id).append(o);
};
const swipe=(el,fn)=>{
 let sx=0,sy=0,on=false;
 el.addEventListener('pointerdown',e=>{sx=e.clientX;sy=e.clientY;on=true});
 el.addEventListener('pointerup',e=>{
  if(!on)return;on=false;
  const dx=e.clientX-sx,dy=e.clientY-sy;
  if(Math.max(Math.abs(dx),Math.abs(dy))<24)return;
  fn(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'));
 });
 el.addEventListener('pointercancel',()=>{on=false});
};

/* ---------- 2048 ---------- */
function game2048(){
 const wr=$('#wr-2048');
 wr.innerHTML='<div class="b2048" id="b2048" tabindex="0" aria-label="2048 board">'+Array.from({length:16},(_,i)=>`<i class="cell" style="--r:${i>>2};--c:${i&3}"></i>`).join('')+'</div>';
 const bd=$('#b2048');
 let tiles=[],score=0,uid=1,lock=false,won=false;
 const show=()=>{const b=Math.max(store.get('2048'),score);store.set('2048',b);$('#sc-2048').textContent=score;$('#bs-2048').textContent=b};
 const mk=t=>{const e=document.createElement('div');e.className='tl t'+t.v+' new';e.textContent=t.v;e.style.setProperty('--r',t.r);e.style.setProperty('--c',t.c);bd.append(e);t.el=e};
 const spawn=()=>{const e=emptyCells(tiles);if(!e.length)return;const p=e[(Math.random()*e.length)|0],t={id:uid++,r:p.r,c:p.c,v:Math.random()<.9?2:4};tiles.push(t);mk(t)};
 const restart=()=>{$$('#b2048 .tl').forEach(x=>x.remove());tiles=[];uid=1;score=0;lock=false;won=false;clearOver('2048');spawn();spawn();show()};
 const move=dir=>{
  if(lock||!live('2048'))return;
  const {moved,gain}=planMove(tiles,dir);
  if(!moved)return;
  lock=true;score+=gain;
  const dead=tiles.filter(t=>t.dead),alive=tiles.filter(t=>!t.dead);
  tiles.forEach(t=>{t.r=t.nr;t.c=t.nc;t.el.style.setProperty('--r',t.r);t.el.style.setProperty('--c',t.c)});
  setTimeout(()=>{
   dead.forEach(t=>t.el.remove());
   alive.forEach(t=>{if(t.merged){t.el.className='tl t'+t.v+' pop';t.el.textContent=t.v}});
   tiles=alive;spawn();show();lock=false;
   if(!won&&alive.some(t=>t.v>=2048)){won=true;overlay('2048','You made 2048!',score+' points',()=>clearOver('2048'),'Keep going')}
   else if(!hasMoves(tiles))overlay('2048','Game over',score+' points',restart);
  },reduce?0:150);
 };
 swipe(bd,move);restart();
 return {restart,move,resume(){},redraw(){}};
}

/* ---------- Snake ---------- */
function gameSnake(){
 const wr=$('#wr-snake');
 wr.innerHTML='<canvas class="gm-canvas" id="cv-snake" aria-label="Snake board"></canvas>';
 const cv=$('#cv-snake'),cx=cv.getContext&&cv.getContext('2d'),S=18;
 let s,prev,acc=0,last=0,run=false,started=false,tick=125,raf=0;
 const show=()=>{const b=Math.max(store.get('snake'),s.score);store.set('snake',b);$('#sc-snake').textContent=s.score;$('#bs-snake').textContent=b};
 const rr=(x,y,w,h,r)=>{cx.beginPath();cx.roundRect?cx.roundRect(x,y,w,h,r):cx.rect(x,y,w,h);cx.fill()};
 const fit=()=>{const w=cv.getBoundingClientRect().width||440,d=Math.min(window.devicePixelRatio||1,2);cv.width=cv.height=Math.round(w*d);draw(1)};
 function draw(t){
  if(!cx||!s)return;
  const W=cv.width,u=W/S;
  cx.clearRect(0,0,W,W);
  cx.fillStyle=C.line;
  for(let x=0;x<S;x++)for(let y=0;y<S;y++)cx.fillRect(x*u+u/2-1,y*u+u/2-1,2,2);
  if(s.food){cx.fillStyle=C.g;cx.beginPath();cx.arc((s.food.x+.5)*u,(s.food.y+.5)*u,u*.32*(1+.12*Math.sin(Date.now()/160)),0,7);cx.fill()}
  const n=s.body.length;
  for(let i=n-1;i>=0;i--){
   const a=prev[i]||prev[prev.length-1],b=s.body[i],x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,m=u*.07;
   cx.globalAlpha=.35+.65*(1-i/n);cx.fillStyle=C.g;rr(x*u+m,y*u+m,u-2*m,u-2*m,u*.3);
  }
  cx.globalAlpha=1;
  const msg=!started?'Tap or press an arrow key to start':(!run&&!s.dead?'Paused. Press space':'');
  if(msg){cx.fillStyle=C.fg;cx.font=`600 ${W/24}px -apple-system,Inter,sans-serif`;cx.textAlign='center';cx.fillText(msg,W/2,W*.92)}
 }
 const restart=()=>{s=newSnake(S);prev=s.body.map(p=>({...p}));acc=0;last=0;run=false;started=false;tick=125;clearOver('snake');show();draw(1)};
 const end=()=>{run=false;draw(1);overlay('snake','Game over',s.score+' eaten',restart)};
 const step=()=>{
  prev=s.body.map(p=>({...p}));
  const before=s.score;snakeStep(s);
  if(s.dead)return end();
  if(s.score>before){prev.push({...prev[prev.length-1]});tick=Math.max(65,tick-3);show()}
 };
 const loop=t=>{
  raf=0;if(!run)return;
  if(!live('snake')){setTimeout(go,400);return}
  const dt=Math.min(t-(last||t),60);last=t;acc+=dt;
  while(acc>=tick&&run){acc-=tick;step()}
  if(run){draw(Math.min(acc/tick,1));raf=requestAnimationFrame(loop)}
 };
 const go=()=>{if(!run||raf)return;if(live('snake')){last=0;raf=requestAnimationFrame(loop)}else setTimeout(go,400)};
 const start=()=>{if(s.dead||started)return;started=true;run=true;go()};
 const dir=k=>{if(s.dead)return;start();turn(s,DIRS[k])};
 const action=()=>{if(s.dead)restart();else if(!started)start();else{run=!run;if(run)go();else draw(1)}};
 swipe(cv,dir);cv.addEventListener('click',start);
 window.ResizeObserver?new ResizeObserver(fit).observe(cv):addEventListener('resize',fit);
 restart();fit();
 return {restart,dir,action,resume:go,redraw:()=>draw(1)};
}

/* ---------- Memory ---------- */
const EM=['🚀','🎯','🎨','💡','🔥','⭐','🎧','🍀'];
function gameMemory(){
 const wr=$('#wr-memory');
 wr.innerHTML='<div class="mem" id="mem"></div>';
 const mem=$('#mem');
 let deck,a,b,lock,moves,found;
 const show=()=>{$('#sc-memory').textContent=moves;$('#bs-memory').textContent=store.get('memory')||'-'};
 const restart=()=>{
  deck=shuffle([...EM,...EM]);moves=0;found=0;a=b=null;lock=false;clearOver('memory');
  mem.innerHTML=deck.map((e,i)=>`<button class="mc" type="button" data-i="${i}" aria-label="Card ${i+1}"><i><b></b><u>${e}</u></i></button>`).join('');
  show();
 };
 mem.addEventListener('click',e=>{
  const c=e.target.closest('.mc');
  if(!c||lock||c.classList.contains('f')||c.classList.contains('m'))return;
  c.classList.add('f');
  if(!a){a=c;return}
  b=c;moves++;lock=true;$('#sc-memory').textContent=moves;
  if(deck[a.dataset.i]===deck[b.dataset.i]){
   [a,b].forEach(x=>{x.classList.remove('f');x.classList.add('m')});
   a=b=null;lock=false;
   if(++found===8){const best=store.get('memory');if(!best||moves<best)store.set('memory',moves);show();setTimeout(()=>overlay('memory','You did it!',moves+' moves',restart),500)}
  }else setTimeout(()=>{a.classList.remove('f');b.classList.remove('f');a=b=null;lock=false},reduce?250:750);
 });
 restart();
 return {restart,resume(){},redraw(){}};
}

/* ---------- Stack ---------- */
function gameStack(){
 const wr=$('#wr-stack');
 wr.innerHTML='<canvas class="gm-canvas tall" id="cv-stack" aria-label="Stack board"></canvas>';
 const cv=$('#cv-stack'),cx=cv.getContext&&cv.getContext('2d'),VW=400,VH=500,BH=26,W0=150;
 let layers,cur,pieces,score,cam,camT,run,over,raf=0,last=0,flash=0;
 const show=()=>{const b=Math.max(store.get('stack'),score);store.set('stack',b);$('#sc-stack').textContent=score;$('#bs-stack').textContent=b};
 const rr=(x,y,w,h,r)=>{cx.beginPath();cx.roundRect?cx.roundRect(x,y,w,h,r):cx.rect(x,y,w,h);cx.fill()};
 const fit=()=>{const w=cv.getBoundingClientRect().width||440,d=Math.min(window.devicePixelRatio||1,2);cv.width=Math.round(w*d);cv.height=Math.round(w*d*1.25);draw()};
 const yOf=i=>VH-(i+1)*BH+cam;
 function draw(){
  if(!cx||!layers)return;
  cx.setTransform(cv.width/VW,0,0,cv.width/VW,0,0);
  cx.clearRect(0,0,VW,VH);
  layers.forEach((b,i)=>{const y=yOf(i);if(y>VH||y<-BH)return;cx.globalAlpha=.4+.6*((i%12)/11);cx.fillStyle=C.g;rr(b.x,y,b.w,BH-2,5)});
  pieces.forEach(p=>{cx.globalAlpha=Math.max(0,1-p.t*.9);cx.fillStyle=C.g;rr(p.x,p.y,p.w,BH-2,5)});
  cx.globalAlpha=1;
  if(!over){cx.fillStyle=C.fg;rr(cur.x,yOf(layers.length),cur.w,BH-2,5)}
  cx.fillStyle=C.fg;cx.font='700 56px -apple-system,Inter,sans-serif';cx.textAlign='center';cx.globalAlpha=.9;cx.fillText(score,VW/2,72);cx.globalAlpha=1;
  if(flash>0){cx.globalAlpha=flash;cx.fillStyle=C.g;cx.font='600 22px -apple-system,Inter,sans-serif';cx.fillText('Perfect!',VW/2,104);cx.globalAlpha=1}
  if(!run&&!over){cx.fillStyle=C.mute;cx.font='500 18px -apple-system,Inter,sans-serif';cx.fillText('Tap or press space to start',VW/2,VH-28)}
 }
 const restart=()=>{layers=[{x:(VW-W0)/2,w:W0}];cur={x:0,w:W0,v:2.4};pieces=[];score=0;cam=0;camT=0;run=false;over=false;flash=0;clearOver('stack');show();draw()};
 const frame=t=>{
  raf=0;
  if(!live('stack')){setTimeout(go,400);return}
  const f=Math.min(t-(last||t),50)/16.67;last=t;
  if(run){cur.x+=cur.v*f;if(cur.x+cur.w>VW){cur.x=VW-cur.w;cur.v=-Math.abs(cur.v)}else if(cur.x<0){cur.x=0;cur.v=Math.abs(cur.v)}}
  cam+=(camT-cam)*Math.min(1,.12*f);
  pieces.forEach(p=>{p.vy+=.5*f;p.y+=p.vy*f;p.t+=.02*f});
  pieces=pieces.filter(p=>p.y<VH+60);
  flash=Math.max(0,flash-.02*f);
  draw();
  if(run||pieces.length||Math.abs(camT-cam)>.3||flash>0)raf=requestAnimationFrame(frame);
 };
 const go=()=>{if(raf)return;if(live('stack')){last=0;raf=requestAnimationFrame(frame)}else if(run)setTimeout(go,400)};
 const drop=()=>{
  if(over)return;
  if(!run){run=true;go();return}
  const top=layers[layers.length-1],r=stackPlace(top,{x:cur.x,w:cur.w});
  if(r.over){over=true;run=false;pieces.push({x:cur.x,y:yOf(layers.length),w:cur.w,vy:0,t:0});go();overlay('stack','Game over',score+' layers',restart);return}
  layers.push(r.block);score++;
  if(r.perfect)flash=1;else if(r.cut)pieces.push({x:r.cut.x,y:yOf(layers.length-1),w:r.cut.w,vy:0,t:0});
  camT=Math.max(0,(layers.length-8)*BH);
  const sp=2.4+Math.min(score*.13,5);
  cur={x:Math.random()<.5?0:VW-r.block.w,w:r.block.w,v:(Math.random()<.5?1:-1)*sp};
  show();go();
 };
 cv.addEventListener('pointerdown',e=>{e.preventDefault();drop()});
 window.ResizeObserver?new ResizeObserver(fit).observe(cv):addEventListener('resize',fit);
 restart();fit();
 return {restart,action:drop,resume:go,redraw:draw};
}

/* ---------- Page ---------- */
const GAMES=[
 {id:'2048',n:'2048',d:'Slide the tiles and merge matching numbers.',h:'Arrow keys, WASD, or swipe on the board.'},
 {id:'snake',n:'Snake',d:'Eat, grow, and never touch yourself.',h:'Arrow keys, WASD or swipe. Space pauses.'},
 {id:'memory',n:'Memory',d:'Find all the matching pairs in the fewest moves.',h:'Tap two cards to flip them.'},
 {id:'stack',n:'Stack',d:'Time your tap to build the tallest tower.',h:'Tap, click or press space to drop the block.'}
];
const panel=g=>`<div class="gm-panel" id="gm-${g.id}"><div class="gm-bar"><div><h3>${g.n}</h3><p>${g.d}</p></div><div class="gm-sc"><span>${g.id==='memory'?'Moves':'Score'} <b id="sc-${g.id}">0</b></span><span>Best <b id="bs-${g.id}">0</b></span><button class="b g" type="button" id="rs-${g.id}">New game</button></div></div><div class="gm-wrap" id="wr-${g.id}"></div><p class="gm-hint">${g.h}</p></div>`;

export function initGames(){
 const host=$('#gm');
 if(!host)return;
 host.innerHTML=GAMES.map(panel).join('');
 pal();
 const G={'2048':game2048(),snake:gameSnake(),memory:gameMemory(),stack:gameStack()};
 const all=f=>Object.values(G).forEach(f);
 $('#gm-2048').classList.add('on');
 GAMES.forEach(g=>$('#rs-'+g.id).addEventListener('click',()=>G[g.id].restart()));
 $('#gtabs').addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  $$('#gtabs button').forEach(x=>x.classList.toggle('on',x===b));
  $$('.gm-panel').forEach(p=>p.classList.toggle('on',p.id==='gm-'+b.dataset.g));
  all(x=>{x.resume();x.redraw()});
 });
 addEventListener('themechange',()=>{pal();all(x=>x.redraw())});
 document.addEventListener('visibilitychange',()=>all(x=>x.resume()));
 const MAP={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D',a:'L',d:'R',w:'U',s:'D'};
 document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;
  const k=MAP[e.key]||MAP[(e.key||'').toLowerCase()];
  if(k&&live('2048')){e.preventDefault();G['2048'].move(k)}
  else if(k&&live('snake')){e.preventDefault();G.snake.dir(k)}
  else if(e.key===' '&&(live('stack')||live('snake'))){e.preventDefault();(live('stack')?G.stack:G.snake).action()}
 });
}
