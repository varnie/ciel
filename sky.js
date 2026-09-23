export function timePalette(hour) {
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 18) return 'day';
  if (hour >= 18 && hour < 21) return 'dusk';
  return 'night';
}
export function startSky() {
  const sky = document.querySelector('.sky');
  const celestial = document.createElement('span'); celestial.className = 'celestial'; sky.append(celestial);
  const stars = document.createElement('div'); stars.className = 'stars';
  for (let i=0;i<45;i++) {
    const star = document.createElement('b');
    star.style.left = `${Math.random()*100}%`; star.style.top = `${Math.random()*85}%`;
    star.style.setProperty('--twinkle',`${2+Math.random()*4}s`); star.style.animationDelay = `${-Math.random()*6}s`;
    stars.append(star);
  }
  sky.append(stars);
  const rain = document.createElement('div'); rain.className = 'rain';
  for (let i=0;i<24;i++) {
    const drop = document.createElement('b'); drop.style.left = `${Math.random()*100}%`; drop.style.animationDelay = `${-Math.random()*2}s`; rain.append(drop);
  }
  sky.append(rain);
  // Small, fixed-size ambient layers: nothing captures input or creates endless DOM nodes.
  const details = document.createElement('div'); details.className = 'sky-details';
  for (let i=0;i<12;i++) {
    const mote = document.createElement('span'); mote.className = 'air-mote';
    mote.style.left = `${4+Math.random()*92}%`; mote.style.top = `${12+Math.random()*76}%`;
    mote.style.setProperty('--drift',`${12+Math.random()*15}s`); mote.style.animationDelay = `${-Math.random()*25}s`;
    details.append(mote);
  }
  for (let i=0;i<3;i++) {
    const bird = document.createElement('span'); bird.className = 'sky-bird';
    bird.style.top = `${18+i*21}%`; bird.style.setProperty('--crossing',`${38+i*11}s`); bird.style.animationDelay = `${-i*13-4}s`;
    bird.innerHTML = '<b></b><b></b>'; details.append(bird);
  }
  for (let i=0;i<2;i++) {
    const meteor = document.createElement('span'); meteor.className = 'shooting-star';
    meteor.style.left = `${35+i*30}%`; meteor.style.top = `${12+i*23}%`;
    meteor.style.animationDelay = `${i*17}s`; details.append(meteor);
  }
  sky.append(details);
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  function tinyFirework() {
    if (document.hidden || calm.matches || document.body.classList.contains('still') || document.querySelector('dialog[open],.matched') || Math.random()>.45) return;
    const bloom = document.createElement('span'); bloom.className = 'tiny-firework';
    bloom.style.left = `${Math.random()<.5 ? 9+Math.random()*12 : 79+Math.random()*12}%`;
    bloom.style.top = `${18+Math.random()*25}%`;
    const hue = [40,175,285][Math.floor(Math.random()*3)];
    for(let i=0;i<9;i++) {
      const dot = document.createElement('b'); const angle=i*Math.PI*2/9;
      const radius=25+Math.random()*20;
      dot.style.setProperty('--spark-x',`${Math.cos(angle)*radius}px`);
      dot.style.setProperty('--spark-y',`${Math.sin(angle)*radius}px`);
      dot.style.background=`hsl(${hue} 95% 85%)`;
      bloom.append(dot);
    }
    details.append(bloom);setTimeout(()=>bloom.remove(),1400);
  }
  // At most one small, silent bloom per minute; often skip the opportunity.
  setInterval(tinyFirework,60000);
  let windTimer, windReturn;
  function stopWind() {
    clearTimeout(windReturn);
    document.body.classList.remove('breeze');
  }
  function scheduleWind() {
    clearTimeout(windTimer);
    windTimer = setTimeout(()=>{
      if (!document.hidden && !calm.matches && document.body.classList.contains('playing') && !document.body.classList.contains('still') && !document.querySelector('dialog[open]')) {
        const narrow = matchMedia('(max-width: 760px)').matches;
        const distance = (narrow ? 5 + Math.random()*2 : 11 + Math.random()*5) * (Math.random()<.5 ? -1 : 1);
        document.body.style.setProperty('--wind-offset',`${distance.toFixed(1)}px`);
        document.body.classList.add('breeze');
        windReturn = setTimeout(stopWind,3500);
      }
      scheduleWind();
    },22000 + Math.random()*16000);
  }
  scheduleWind();
  // Turning off motion or leaving the game cancels an in-flight gust immediately.
  new MutationObserver(()=>{
    if (document.body.classList.contains('still') || !document.body.classList.contains('playing')) {
      if (document.body.classList.contains('breeze')) stopWind();
    }
  }).observe(document.body,{attributes:true,attributeFilter:['class']});
  calm.addEventListener('change',()=>{if(calm.matches) stopWind();});
  function tapFeedback(event) {
    if (calm.matches || document.body.classList.contains('still') || document.hidden) return;
    const button = event.target.closest('button');
    if (!button || button.disabled || button.classList.contains('bubble')) return;
    if (event.type === 'keydown' && (!['Enter',' '].includes(event.key) || event.repeat)) return;
    const box = button.getBoundingClientRect();
    const ripple = document.createElement('span'); ripple.className = 'ui-ripple'; ripple.setAttribute('aria-hidden','true');
    ripple.style.left = `${event.type === 'pointerdown' ? event.clientX : box.x+box.width/2}px`;
    ripple.style.top = `${event.type === 'pointerdown' ? event.clientY : box.y+box.height/2}px`;
    document.body.append(ripple); setTimeout(()=>ripple.remove(),650);
  }
  document.addEventListener('pointerdown',tapFeedback);
  document.addEventListener('keydown',tapFeedback);
  function update() { document.body.dataset.sky = timePalette(new Date().getHours()); }
  update(); setInterval(update,60000);
  let showerTimer;
  function weather() {
    if (!document.hidden && !document.body.classList.contains('still')) {
      const shower = Math.random() < .3;
      document.body.classList.toggle('shower',shower);
      if (shower) { clearTimeout(showerTimer); showerTimer = setTimeout(()=>document.body.classList.remove('shower'),18000); }
    }
  }
  setInterval(weather,65000);
  document.addEventListener('visibilitychange',()=>{
    document.body.classList.toggle('scene-paused',document.hidden);
    if (document.hidden) {stopWind();clearTimeout(windTimer);} else {update();scheduleWind();}
  });
}
