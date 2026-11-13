/* Contact page: project brief form, booking buttons, mail fallback */
import {$,$$,copy} from './utils.js';
import {CAL,FORM_ENDPOINT} from './data.js';

export function initContact(){
 /* Booking buttons appear only when CAL is set in data.js */
 if(CAL){$('#cal').hidden=false;$$('[data-cal]').forEach(a=>{a.href=CAL;a.hidden=false})}

 const toastEl=$('#toast');let tt;
 const toast=m=>{toastEl.textContent=m;toastEl.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>toastEl.classList.remove('on'),3200)};
 const embedded=window.top!==window;
 /* Inside an embedded preview, mail apps are blocked. The live site opens the mail app normally. */
 if(embedded)document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="mailto:"]');if(!a)return;
  e.preventDefault();
  if(!window.open(a.href,'_blank')){const addr=a.getAttribute('href').slice(7).split('?')[0];copy(addr,()=>toast('Preview mode blocks mail apps. Address copied: '+addr))}
 });

 /* Project brief: sent straight to the inbox, no mail app needed */
 const val=id=>$('#'+id).value.trim();
 const brief=()=>'Hi Saikat,\n\n'+(val('bn')?'My name is '+val('bn')+'.\n':'')+'I need help with: '+$('#bs').value+'.\n\nAbout my business and goals:\n'+(val('bm')||'(a few lines here)')+'\n'+(val('be')?'\nReply to: '+val('be')+'\n':'');
 $('#bcopy').addEventListener('click',()=>copy(brief(),()=>{const b=$('#bcopy');b.textContent='Copied, now paste it in Telegram';setTimeout(()=>b.textContent='Copy for Telegram',2400)}));
 const st=$('#bst'),btn=$('#bsend');
 const fail=h=>{st.className='bst wide err';st.innerHTML=h};
 $('#bform').addEventListener('submit',async e=>{
  e.preventDefault();
  if($('#bh').value)return;
  const name=val('bn'),email=val('be'),message=val('bm');
  if(!name||!/^\S+@\S+\.\S+$/.test(email)||message.length<5)return fail('Please add your name, a valid email and a short message.');
  st.className='bst wide';st.textContent='';btn.disabled=true;btn.textContent='Sending…';
  const done=note=>{$('#bform').hidden=true;$('#bok').hidden=false;$('#bokn').textContent=name.split(' ')[0];$('#bokp').textContent=note||''};
  if(embedded){setTimeout(()=>done('Preview mode: nothing was actually sent.'),900);return}
  try{
   const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),15000);
   const r=await fetch(FORM_ENDPOINT,{method:'POST',signal:ctl.signal,headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({name,email,service:$('#bs').value,message,_subject:'New enquiry from your website',_template:'table',_captcha:'false'})});
   clearTimeout(timer);
   const j=await r.json().catch(()=>({}));
   if(!r.ok||String(j.success)==='false')throw new Error(j.message||'failed');
   done();
  }catch(err){
   btn.disabled=false;btn.textContent='Send message';
   fail('I could not send that just now. You can <a href="mailto:saikatbabd@gmail.com?subject=Project%20enquiry">email me directly</a> or copy it for Telegram.');
  }
 });
 $('#bagain').addEventListener('click',()=>{$('#bok').hidden=true;$('#bform').hidden=false;$('#bform').reset();btn.disabled=false;btn.textContent='Send message'});
}
