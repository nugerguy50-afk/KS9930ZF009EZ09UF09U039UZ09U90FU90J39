// ── Stars ──
(function(){
  const canvas = document.getElementById('starsCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars=[];
  function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  resize(); window.addEventListener('resize',resize);
  for(let i=0;i<200;i++) stars.push({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    r:Math.random()*1.3+.2, a:Math.random()*.9+.1,
    sp:Math.random()*.4+.05, tw:Math.random()*Math.PI*2
  });
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const t=Date.now()/1000;
    stars.forEach(s=>{
      const alpha=.2+.6*Math.sin(s.tw+t*s.sp);
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(170,215,255,${alpha*s.a})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── Active nav link ──
(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === page || (page===''&&href==='index.html')) a.classList.add('active');
  });
})();

// ── Ripple ──
function addRipple(btn, e){
  const rect=btn.getBoundingClientRect();
  const r=document.createElement('span');
  r.className='ripple';
  const size=Math.max(btn.offsetWidth,btn.offsetHeight);
  r.style.cssText=`width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
  btn.appendChild(r);
  setTimeout(()=>r.remove(),700);
}

// ── Toast ──
function showToast(msg){
  let t=document.getElementById('globalToast');
  if(!t){ t=document.createElement('div'); t.id='globalToast'; t.className='toast';
    t.innerHTML=`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span id="toastMsg"></span>`;
    document.body.appendChild(t);
  }
  document.getElementById('toastMsg').textContent=msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer=setTimeout(()=>t.classList.remove('show'),2600);
}

// ── Copy to clipboard ──
function copyText(text, btn, successLabel='COPIED!', resetLabel='COPY SCRIPT'){
  navigator.clipboard.writeText(text).catch(()=>{
    const ta=document.createElement('textarea');
    ta.value=text; ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  });
  const span = btn.querySelector('span') || btn;
  const orig = span.textContent;
  btn.classList.add('btn-success');
  btn.classList.remove('btn-primary');
  span.textContent = successLabel;
  showToast('Script copied to clipboard!');
  // counter
  let c=parseInt(localStorage.getItem('babft_copies')||'0')+1;
  localStorage.setItem('babft_copies',c);
  document.querySelectorAll('.copy-counter').forEach(el=>el.textContent=c.toLocaleString());
  setTimeout(()=>{
    btn.classList.remove('btn-success'); btn.classList.add('btn-primary');
    span.textContent = resetLabel;
  },2500);
}

// ── FAQ accordion ──
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.faq-q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item=btn.closest('.faq-item');
      const wasOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });
  // init copy counter display
  const c=parseInt(localStorage.getItem('babft_copies')||'0');
  document.querySelectorAll('.copy-counter').forEach(el=>el.textContent=c.toLocaleString());
});
