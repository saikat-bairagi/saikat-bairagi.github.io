/* Free tools page: thirteen small tools that run entirely in the browser */
import {$,$$,copy,tween} from './utils.js';
import {RC,LIM,SZ} from './data.js';

export function initTools(){
 $('#rl').innerHTML=RC.map(t=>`<label><input type="checkbox"><i></i><span>${t}</span></label>`).join('');
 const msg=p=>p===0?'Tick a few boxes to see your score.':p<40?'Plenty of room to grow. A clearer, faster site can change a lot.':p<75?'A decent base. A few improvements would make it work harder.':p<100?'Strong. A little polish and it is ready to impress.':'Excellent. Your site covers the essentials.';
 $('#rl').addEventListener('change',()=>{const p=Math.round($$('#rl input:checked').length/RC.length*100);$('#rf').style.strokeDashoffset=327*(1-p/100);tween($('#rs'),p,'%');$('#rm').textContent=msg(p)});
 const A=['a1','a2','a3'].map(i=>$('#'+i));
 const calc=()=>{const[b,c,r]=A.map(e=>+e.value);$('#o1').textContent='$'+b.toLocaleString();$('#o2').textContent='$'+c.toFixed(2);$('#o3').textContent=r+'%';const cl=b/c,le=cl*r/100;tween($('#k1'),Math.round(cl));tween($('#k2'),Math.round(le));tween($('#k3'),le?b/le:0,'','$',2)};
 A.forEach(e=>e.addEventListener('input',calc));calc();
 const h2l=h=>{const r=parseInt(h.slice(1,3),16)/255,g=parseInt(h.slice(3,5),16)/255,b=parseInt(h.slice(5,7),16)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let s=0,hh=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);hh=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;hh*=60}return[hh,s*100,l*100]};
 const l2h=(h,s,l)=>{h=((h%360)+360)%360;s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return'#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')};
 const pal=()=>{const[h,s,l]=h2l($('#pc').value);const c=[l2h(h,s,l),l2h(h+30,s,Math.min(l+8,85)),l2h(h-30,s,Math.max(l-8,15)),l2h(h+180,s*.8,l),l2h(h,Math.min(s,18),94)];$('#sw').innerHTML=c.map(x=>`<button type="button" style="background:${x}" data-c="${x}" aria-label="Copy ${x}"><span>${x}</span></button>`).join('')};
 $('#pc').addEventListener('input',pal);$('#pshuf').addEventListener('click',()=>{$('#pc').value=l2h(Math.random()*360,55+Math.random()*30,40+Math.random()*15);pal()});pal();
 $('#sw').addEventListener('click',e=>{const b=e.target.closest('button');if(b)copy(b.dataset.c,()=>$('#pm').textContent='Copied '+b.dataset.c)});
 const U=['u1','u2','u3','u4'].map(i=>$('#'+i));let ul='';
 const utm=()=>{const[u,s,m,c]=U.map(e=>e.value.trim());if(!u){$('#uo').textContent='Your link will appear here.';ul='';return}let url;try{url=new URL(/^https?:\/\//.test(u)?u:'https://'+u)}catch(e){$('#uo').textContent='Enter a valid website link.';ul='';return}
  [['utm_source',s],['utm_medium',m],['utm_campaign',c]].forEach(([k,v])=>v&&url.searchParams.set(k,v.toLowerCase().replace(/\s+/g,'-')));ul=url.toString();$('#uo').textContent=ul};
 U.forEach(e=>e.addEventListener('input',utm));
 $('#uc').addEventListener('click',()=>{if(!ul)return;copy(ul,()=>{$('#uc').textContent='Copied';setTimeout(()=>$('#uc').textContent='Copy link',1800)})});

 $('#fl2').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('#fl2 button').forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;$$('.tc').forEach(c=>{c.hidden=!(f==='all'||c.dataset.cat.includes(f))})});

 $('#lim').innerHTML=LIM.map(([n,l])=>`<div><span>${n}</span><em>0 / ${l.toLocaleString()}</em><i><b></b></i></div>`).join('');
 $('#ac').addEventListener('input',e=>{const n=e.target.value.length;$$('#lim div').forEach((d,i)=>{const l=LIM[i][1],bad=n>l;d.querySelector('em').textContent=n.toLocaleString()+' / '+l.toLocaleString();d.querySelector('em').classList.toggle('bad',bad);const b=d.querySelector('b');b.style.width=Math.min(100,n/l*100)+'%';b.classList.toggle('bad',bad)})});

 const esc=t=>t.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
 const sp=()=>{const t=$('#s1').value.trim(),d=$('#s2').value.trim(),u=$('#s3').value.trim();
  $('#pv1').textContent=t?(t.length>60?t.slice(0,60)+'…':t):'Your page title appears here';
  $('#pv2').textContent=d?(d.length>160?d.slice(0,160)+'…':d):'Your description appears here.';
  $('#pv3').textContent=u?u.replace(/^https?:\/\//,'').replace(/\//g,' › '):'yourwebsite.com';
  $('#cn1').textContent='Title '+t.length+'/60';$('#cn1').classList.toggle('bad',t.length>60);$('#cn2').textContent='Description '+d.length+'/160';$('#cn2').classList.toggle('bad',d.length>160)};
 ['s1','s2','s3'].forEach(i=>$('#'+i).addEventListener('input',sp));
 $('#s4').addEventListener('click',()=>copy('<title>'+esc($('#s1').value.trim())+'</title>\n<meta name="description" content="'+esc($('#s2').value.trim())+'">',()=>{$('#s4').textContent='Copied';setTimeout(()=>$('#s4').textContent='Copy meta tags',1800)}));

 const lum=h=>{const c=[1,3,5].map(i=>{const v=parseInt(h.slice(i,i+2),16)/255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 const cc2=()=>{const a=$('#ka').value,b=$('#kb').value,l1=lum(a),l2=lum(b),r=(Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05);$('#cx').style.color=a;$('#cx').style.background=b;$('#cr').textContent=r.toFixed(2)+':1';
  $('#r1').textContent='Normal text: '+(r>=7?'AAA':r>=4.5?'AA':'Fail');$('#r1').classList.toggle('ok',r>=4.5);$('#r2').textContent='Large text: '+(r>=4.5?'AAA':r>=3?'AA':'Fail');$('#r2').classList.toggle('ok',r>=3)};
 ['ka','kb'].forEach(i=>$('#'+i).addEventListener('input',cc2));cc2();

 let iurl='';
 const imgRun=()=>{const f=$('#im').files[0];$('#oq').textContent=$('#iq').value+'%';$('#ow').textContent=$('#iw').value+'px';if(!f)return;
  const im=new Image();im.onload=()=>{const w=Math.min(+$('#iw').value,im.width),h=Math.round(im.height*w/im.width),c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,w,h);x.drawImage(im,0,0,w,h);
   c.toBlob(b=>{if(!b)return;if(iurl)URL.revokeObjectURL(iurl);iurl=URL.createObjectURL(b);const kb=n=>(n/1024).toFixed(0)+' KB';$('#io').textContent=`${im.width}×${im.height} → ${w}×${h}  |  ${kb(f.size)} → ${kb(b.size)}  (${Math.max(0,Math.round((1-b.size/f.size)*100))}% smaller)`;const d=$('#idl');d.href=iurl;d.hidden=false},'image/jpeg',+$('#iq').value/100)};im.src=URL.createObjectURL(f)};
 ['im','iq','iw'].forEach(i=>$('#'+i).addEventListener('input',imgRun));

 let qsvg='';
 $('#qt').addEventListener('input',e=>{const t=e.target.value.trim(),q=$('#qr'),d=$('#qd');if(!t){q.textContent='Your QR code appears here.';d.hidden=true;return}
  if(!window.qrcode){q.textContent='The QR library did not load. Check your connection.';return}
  try{const o=qrcode(0,'M');o.addData(t);o.make();qsvg=o.createSvgTag({cellSize:6,margin:2,scalable:true});q.innerHTML=qsvg;d.href=URL.createObjectURL(new Blob([qsvg],{type:'image/svg+xml'}));d.hidden=false}catch(er){q.textContent='That text is too long for a QR code.';d.hidden=true}});

 $('#sz').innerHTML=SZ.map(([n,v])=>`<button type="button" data-v="${v}"><span>${n}</span><b>${v}</b></button>`).join('');
 $('#sz').addEventListener('click',e=>{const b=e.target.closest('button');if(b)copy(b.dataset.v,()=>{const x=b.querySelector('b');x.textContent='Copied';setTimeout(()=>x.textContent=b.dataset.v,1200)})});

 const Q=['q1','q2','q3'].map(i=>$('#'+i));
 const roas=()=>{const[sp2,rv,co]=Q.map(e=>+e.value);$('#r1o').textContent='$'+sp2.toLocaleString();$('#r2o').textContent='$'+rv.toLocaleString();$('#r3o').textContent='$'+co.toLocaleString();
  const pr=rv-co-sp2;tween($('#p1'),sp2?rv/sp2:0,'x','',2);tween($('#p2'),pr,'','$');tween($('#p3'),(sp2+co)?pr/(sp2+co)*100:0,'%')};
 Q.forEach(e=>e.addEventListener('input',roas));roas();

 const gr=()=>{const a=$('#gr1').value,b=$('#gr2').value,n=$('#gr3').value,css=`background: linear-gradient(${n}deg, ${a}, ${b});`;$('#gro').textContent=n+'deg';$('#grv').style.background=`linear-gradient(${n}deg,${a},${b})`;$('#grc').textContent=css;return css};
 ['gr1','gr2','gr3'].forEach(i=>$('#'+i).addEventListener('input',gr));
 $('#gr4').addEventListener('click',()=>{const a=$('#gr1').value;$('#gr1').value=$('#gr2').value;$('#gr2').value=a;gr()});gr();
 $('#grb').addEventListener('click',()=>copy(gr(),()=>{$('#grb').textContent='Copied';setTimeout(()=>$('#grb').textContent='Copy CSS',1800)}));

 $('#wc').addEventListener('input',e=>{const t=e.target.value,w=(t.trim().match(/\S+/g)||[]).length;tween($('#w1'),w);tween($('#w2'),t.length);tween($('#w3'),Math.ceil(w/200))});
}
