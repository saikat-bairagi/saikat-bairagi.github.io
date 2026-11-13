/* Pure game logic with no DOM access, so it is easy to test */

export const N=4;

/* 2048. Tiles are {id,r,c,v}. planMove marks where each tile goes (nr,nc),
   which tiles merge into another (dead), and returns {moved,gain}. */
export function planMove(tiles,dir){
 let moved=false,gain=0;
 tiles.forEach(t=>{t.nr=t.r;t.nc=t.c;t.dead=null;t.merged=false});
 const horiz=dir==='L'||dir==='R',rev=dir==='R'||dir==='D';
 for(let k=0;k<N;k++){
  const line=tiles.filter(t=>(horiz?t.r:t.c)===k).sort((a,b)=>{const d=horiz?a.c-b.c:a.r-b.r;return rev?-d:d});
  let pos=0,prev=null;
  for(const t of line){
   if(prev&&prev.v===t.v&&!prev.merged){prev.v*=2;prev.merged=true;gain+=prev.v;t.dead=prev;t.nr=prev.nr;t.nc=prev.nc;moved=true}
   else{const i=rev?N-1-pos:pos;if(horiz)t.nc=i;else t.nr=i;pos++;prev=t;if(t.nr!==t.r||t.nc!==t.c)moved=true}
  }
 }
 return {moved,gain};
}
export function emptyCells(tiles){
 const used=new Set(tiles.map(t=>t.r*N+t.c)),out=[];
 for(let i=0;i<N*N;i++)if(!used.has(i))out.push({r:(i/N)|0,c:i%N});
 return out;
}
export function hasMoves(tiles){
 if(tiles.length<N*N)return true;
 const g=Array.from({length:N},()=>Array(N).fill(0));
 tiles.forEach(t=>{g[t.r][t.c]=t.v});
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){const v=g[r][c];if((c<N-1&&g[r][c+1]===v)||(r<N-1&&g[r+1][c]===v))return true}
 return false;
}

/* Snake */
export const DIRS={L:{x:-1,y:0},R:{x:1,y:0},U:{x:0,y:-1},D:{x:0,y:1}};
export function placeFood(s,rnd=Math.random){
 const used=new Set(s.body.map(p=>p.y*s.size+p.x)),free=[];
 for(let i=0;i<s.size*s.size;i++)if(!used.has(i))free.push({x:i%s.size,y:(i/s.size)|0});
 return free.length?free[(rnd()*free.length)|0]:null;
}
export function newSnake(size){
 const m=(size/2)|0,s={size,body:[{x:m,y:m},{x:m-1,y:m},{x:m-2,y:m}],dir:DIRS.R,next:DIRS.R,food:null,score:0,dead:false};
 s.food=placeFood(s);
 return s;
}
export function turn(s,d){if(d.x+s.dir.x===0&&d.y+s.dir.y===0)return;s.next=d}
export function snakeStep(s){
 s.dir=s.next;
 const h=s.body[0],n={x:h.x+s.dir.x,y:h.y+s.dir.y},grow=!!s.food&&n.x===s.food.x&&n.y===s.food.y;
 const body=grow?s.body:s.body.slice(0,-1);
 if(n.x<0||n.y<0||n.x>=s.size||n.y>=s.size||body.some(p=>p.x===n.x&&p.y===n.y)){s.dead=true;return s}
 s.body=[n,...body];
 if(grow){s.score++;s.food=placeFood(s)}
 return s;
}

/* Stack: place the moving block on the one below */
export function stackPlace(prev,cur,tol=3){
 const left=Math.max(prev.x,cur.x),right=Math.min(prev.x+prev.w,cur.x+cur.w),w=right-left;
 if(w<=0)return {over:true};
 if(Math.abs(cur.x-prev.x)<=tol)return {block:{x:prev.x,w:prev.w},perfect:true};
 return {block:{x:left,w},perfect:false,cut:{x:cur.x<prev.x?cur.x:right,w:cur.w-w}};
}

/* Memory */
export function shuffle(a,rnd=Math.random){
 a=a.slice();
 for(let i=a.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
