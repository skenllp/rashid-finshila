(()=>{
const C=window.INVITE,$=s=>document.querySelector(s);
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;};
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
const who=C.groom+' & '+C.bride;

/* ---------- dates (formatted in the event's own timezone, whatever the guest's device uses) ---------- */
const fmt=(d,o)=>new Intl.DateTimeFormat('en-GB',{timeZone:'UTC',...o}).format(d);
const events=C.events.map(e=>{
  const d=new Date(e.date+'T00:00:00Z');
  return {...e,d,weekday:fmt(d,{weekday:'long'}),dateTitle:fmt(d,{day:'numeric',month:'long',year:'numeric'}),
    mapUrl:e.mapUrl===undefined?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(e.venue+' '+e.place):e.mapUrl};
});

/* ---------- text from config ---------- */
const data={...C,groomI:C.monogram[0],brideI:C.monogram[1],
  groomLine:'Son of '+C.groomParents,brideLine:'Daughter of '+C.brideParents};
document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=data[el.dataset.t];});

/* hero + footer dates */
const heroEv=$('#heroEvents');
const diamond=()=>{const d=el('div','dia');d.innerHTML='<i></i><b></b><i></i>';return d;};
events.forEach((e,i)=>{
  if(i)heroEv.append(diamond());
  heroEv.append(el('div','cap',e.name+' · '+e.weekday),el('div','hdate',e.dateTitle+(e.time?' · '+e.time:'')),el('div','cap',e.venue+', '+e.place));
});

/* date block + month grid (highlights every event day in the month) */
const sameDate=events.every(e=>e.dateTitle===events[0].dateTitle);
const days=events.map(e=>e.d.getUTCDate());
$('#dateBig').textContent=events.length>1&&events.every(e=>e.d.getUTCMonth()===events[0].d.getUTCMonth()&&e.d.getUTCFullYear()===events[0].d.getUTCFullYear())
  ?days.join(' & ')+' '+fmt(events[0].d,{month:'long',year:'numeric'}):events.map(e=>e.dateTitle).join(' & ');
$('#dateSub').textContent=sameDate?'':events.map(e=>e.name).join(' · ');
$('#footDates').textContent=$('#dateBig').textContent;
{
  const y=events[0].d.getUTCFullYear(),mo=events[0].d.getUTCMonth();
  $('#mo').textContent=fmt(events[0].d,{month:'long'});
  const sm=el('small','',y);$('#mo').append(sm);
  let h=['S','M','T','W','T','F','S'].map(x=>'<div class="h">'+x+'</div>').join('');
  const first=new Date(Date.UTC(y,mo,1)).getUTCDay(),len=new Date(Date.UTC(y,mo+1,0)).getUTCDate();
  for(let i=0;i<first;i++)h+='<div></div>';
  for(let i=1;i<=len;i++)h+='<div class="d'+(days.includes(i)?' on':'')+'">'+i+'</div>';
  $('#grid').innerHTML=h;
}

/* program */
const gcal=d=>d.toISOString().slice(0,10).replace(/-/g,'');
events.forEach(e=>{
  $('#prog').append(el('div','day',e.weekday+' · '+e.dateTitle));
  const it=el('div','item');
  it.append(el('div','t',e.name+(e.time?' · '+e.time:'')),el('div','n',e.venue),el('div','a',e.place));
  const links=el('div','links');
  if(e.mapUrl){const a=el('a','link','View map →');a.href=e.mapUrl;a.target='_blank';a.rel='noopener';links.append(a);}
  const c=el('a','link','Add to calendar');c.target='_blank';c.rel='noopener';
  c.href='https://calendar.google.com/calendar/render?'+new URLSearchParams({action:'TEMPLATE',text:who+' · '+e.name,dates:gcal(e.d)+'/'+gcal(new Date(e.d.getTime()+864e5)),location:e.venue+', '+e.place});
  links.append(c);it.append(links);
  $('#prog').append(it);
});

/* ---------- countdown ---------- */
const T=C.countdownTo?new Date(C.countdownTo):null;
if(T&&!isNaN(T)){
  const tick=()=>{const diff=Math.floor((T-Date.now())/60000);let m=Math.abs(diff);
    if(diff<0)$('#cdLab').textContent='Happily married · together for';
    $('#cd').textContent=Math.floor(m/1440);m%=1440;$('#ch').textContent=Math.floor(m/60);$('#cm').textContent=m%60;};
  tick();setInterval(tick,20000);
}else $('#countSec').hidden=true;

/* ---------- photos, video, gallery, gift ---------- */
const pic=(src,alt)=>{const i=new Image();i.src=src;i.alt=alt;i.loading='lazy';return i;};
const portrait=$('#portrait');
let portraitVideo=null;
if(C.portraitVideo){
  portraitVideo=el('video');
  portraitVideo.muted=true;portraitVideo.loop=true;portraitVideo.playsInline=true;
  portraitVideo.setAttribute('playsinline','');portraitVideo.setAttribute('webkit-playsinline','');
  portraitVideo.preload='none';if(C.portraitPoster)portraitVideo.poster=C.portraitPoster;
  portraitVideo.setAttribute('aria-label',who);
  portrait.append(portraitVideo);
}else if(C.portrait)portrait.append(pic(C.portrait,who));
else portrait.hidden=true;

const photos=(C.gallery||[]).slice(0,4);
photos.forEach(s=>$('#gal').append(pic(s,who)));
if(!photos.length)$('#gallerySec').hidden=true;

if(C.giftUrl)$('#giftLink').href=C.giftUrl;else $('#giftLink').hidden=true;

/* The couple video loads and plays only while it is on screen. */
if(portraitVideo){
  const src=el('source');src.src=C.portraitVideo;src.type='video/mp4';
  let loaded=false;
  const watch=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      if(!loaded){portraitVideo.append(src);portraitVideo.load();loaded=true;}
      if(!reduceMotion){const p=portraitVideo.play();if(p&&p.catch)p.catch(()=>{});}
    }else if(loaded)portraitVideo.pause();
  }),{rootMargin:'200px',threshold:.01});
  watch.observe(portrait);
}

/* ---------- cover: tap plays the envelope video, then fades into the hero ---------- */
const cover=$('#cover'),op=$('#opener'),hero=$('#hero'),bgm=$('#bgm'),musicToggle=$('#musicToggle');
document.body.style.overflow='hidden';
let opened=false,done=false,userPaused=false,safety=null;

const setMusicUI=on=>{
  musicToggle.classList.toggle('playing',on);musicToggle.classList.toggle('paused',!on);
  musicToggle.setAttribute('aria-label',on?'Pause music':'Play music');
};
const startMusic=()=>{
  if(!C.music)return;
  const p=bgm.play();
  if(p&&p.then)p.then(()=>setMusicUI(true)).catch(()=>setMusicUI(false));
};

const finish=()=>{
  if(done)return;
  done=true;clearTimeout(safety);
  try{op.pause();}catch(e){}
  cover.classList.add('gone');
  document.body.style.overflow='';
  window.scrollTo(0,0);
  hero.classList.add('show');
  if(C.music){musicToggle.hidden=false;musicToggle.classList.add('visible');startMusic();}
  setTimeout(reveal,600);
};

const openInvite=()=>{
  if(opened)return finish();
  opened=true;
  cover.classList.add('playing');
  startMusic(); /* the tap unlocks audio, so the song starts with the opening */
  if(reduceMotion)return finish();
  safety=setTimeout(finish,15000);
  op.addEventListener('ended',finish,{once:true});
  op.addEventListener('error',finish,{once:true});
  op.addEventListener('stalled',()=>setTimeout(()=>{if(!done&&op.paused)finish();},5000));
  /* try with sound first (the envelope video has audio); fall back to muted, then skip ahead */
  const play=muted=>{
    op.muted=muted;
    try{op.currentTime=0;}catch(e){}
    const p=op.play();
    if(p&&p.catch)p.catch(()=>muted?finish():play(true));
  };
  play(false);
};
cover.addEventListener('click',openInvite);
cover.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openInvite();}});
$('#skip').addEventListener('click',e=>{e.stopPropagation();finish();});

/* ---------- music (only when config.music is set) ---------- */
if(C.music){
  bgm.src=C.music;bgm.preload='metadata';
  bgm.addEventListener('error',()=>{musicToggle.hidden=true;});
  musicToggle.addEventListener('click',()=>{
    if(bgm.paused){userPaused=false;bgm.play().then(()=>setMusicUI(true)).catch(()=>{});}
    else{userPaused=true;bgm.pause();setMusicUI(false);}
  });
  const stopAudio=()=>{if(!bgm.paused)bgm.pause();};
  window.addEventListener('pagehide',stopAudio);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)stopAudio();
    else if(done&&!userPaused)bgm.play().then(()=>setMusicUI(true)).catch(()=>{});
  });
}

/* ---------- scroll reveal ---------- */
function reveal(){if(!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.rv').forEach(s=>{if(s.getBoundingClientRect().top>innerHeight){s.classList.add('pre');io.observe(s);}});}

/* ---------- RSVP ---------- */
const yes=$('#yes'),no=$('#no'),toast=$('#toast'),rForm=$('#rsvp'),rSubmit=$('#rSubmit');
const att=v=>{yes.setAttribute('aria-pressed',v);no.setAttribute('aria-pressed',!v);$('#cntWrap').hidden=!v;};
yes.onclick=()=>att(true);no.onclick=()=>att(false);

rForm.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=$('#rName').value.trim(),phone=$('#rPhone').value.trim(),note=$('#rNote').value.trim();
  const going=yes.getAttribute('aria-pressed')==='true';
  const count=going?$('#rCount').value:'0';
  if(!name){toast.className='toast error';toast.textContent='Please enter your name.';$('#rName').focus();return;}

  if(C.rsvpScriptUrl){
    toast.className='toast';toast.textContent='Recording your RSVP...';
    rSubmit.disabled=true;const label=rSubmit.textContent;rSubmit.textContent='Submitting...';
    const fd=new FormData();
    fd.append('name',name);fd.append('attending',going?'Joyfully yes':'Sadly no');fd.append('guests',count);
    fd.append('phone',phone);fd.append('note',note);
    fd.append('timestamp',new Date().toLocaleString('en-IN',{timeZone:'Asia/Kolkata'}));
    try{
      await fetch(C.rsvpScriptUrl,{method:'POST',body:fd,mode:'no-cors'});
      toast.className='toast success';toast.textContent='Thank you, '+name+'! Your RSVP has been recorded with love.';
      rSubmit.textContent='RSVP Confirmed';rForm.reset();att(true);
    }catch(err){
      console.error('RSVP submission error:',err);
      toast.className='toast error';toast.textContent='Could not submit your RSVP. Please check your connection and try again.';
      rSubmit.disabled=false;rSubmit.textContent=label;
    }
    return;
  }
  if(C.rsvpWhatsApp){
    const msg=going?'Assalamu alaikum, this is '+name+'. In shaa Allah we will attend the wedding of '+who+'. Guests: '+count+'.'
      :'Assalamu alaikum, this is '+name+'. Sadly I will not be able to attend the wedding of '+who+'. Wishing you both every blessing.';
    window.open('https://wa.me/'+C.rsvpWhatsApp+'?text='+encodeURIComponent(msg),'_blank','noopener');
    toast.className='toast';toast.textContent='Thank you, '+name+'. Please press send in WhatsApp to finish.';
    return;
  }
  toast.className='toast success';toast.textContent='Thank you, '+name+'!';
  rSubmit.textContent='Thank you!';rSubmit.disabled=true;
});
})();
