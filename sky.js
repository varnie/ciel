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
  document.addEventListener('visibilitychange',()=>{if (!document.hidden) update();});
}
