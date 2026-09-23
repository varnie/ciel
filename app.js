import { vocabulary, makeRound, shuffle, isPair } from './game.js';
import { themeCatalog } from './themes.js';
import { startSky } from './sky.js';
import { locale, setLocale, t, themeName } from './i18n.js';
import { themeArt } from './theme-art.js';

const $ = selector => document.querySelector(selector);
const board = $('#board');
const mobile = matchMedia('(max-width: 760px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let saved = {};
try { saved = JSON.parse(localStorage.getItem('ciel-v1')) || {}; } catch {}
setLocale(saved.locale || 'ru');
const progress = { total: Number.isFinite(saved.total) ? saved.total : 0, best: Number.isFinite(saved.best) ? saved.best : 0, mistakes: saved.mistakes && typeof saved.mistakes === 'object' ? saved.mistakes : {} };
progress.completed = Array.isArray(saved.completed) ? [...new Set(saved.completed.filter(id => themeCatalog.some(t => t.id === id)))] : [];
progress.cheerOpportunities = Number.isSafeInteger(saved.cheerOpportunities) && saved.cheerOpportunities >= 0 ? saved.cheerOpportunities : 0;
let sound = saved.sound !== false;
let motion = saved.motion !== false && !reduced.matches;
let theme = 'basics', queue = [], active = [], selected = null, found = 0, errors = new Map(), locked = false, generation = 0;
let spawnTimer;
let streak = 0, bestRound = 0, shapeIndex = 0, toastTimer;
let shapes = shuffle(['round','oval','classic']);
let cheerTimer;
let themePage = 0;
function themesPerPage() {return mobile.matches ? (innerHeight < 720 ? 2 : 4) : 8;}
function cheer(message) {
  progress.cheerOpportunities++;
  if (progress.cheerOpportunities % 5 !== 0) return;
  clearTimeout(cheerTimer);
  $('#bozuu-message').textContent = message;
  $('#bozuu-cheer').hidden = false;
  cheerTimer = setTimeout(() => {$('#bozuu-cheer').hidden = true;},2300);
}
function renderThemes() {
  const query = $('#theme-search').value.trim().toLocaleLowerCase('ru');
  $('#theme-list').replaceChildren();
  const filtered = themeCatalog.filter(item=>!query || `${item.title} ${item.id} ${themeName(item)}`.toLocaleLowerCase('ru').includes(query));
  const pages = Math.max(1,Math.ceil(filtered.length/themesPerPage())); themePage = Math.min(themePage,pages-1);
  for (const item of filtered.slice(themePage*themesPerPage(),(themePage+1)*themesPerPage())) {
    const index = themeCatalog.findIndex(entry=>entry.id===item.id);
    const button = document.createElement('button'); button.className = 'theme-card'; button.dataset.theme = item.id;
    button.setAttribute('aria-label',`${themeName(item)} — ${t('play')}`);
    button.style.setProperty('--card-hue',String((index*47+230)%360));
    const icon = document.createElement('span'); icon.className='theme-art'; icon.innerHTML = themeArt(item.id);
    const title = document.createElement('strong'); title.textContent = themeName(item);
    const detail = document.createElement('small'); detail.textContent = `${index+1} · ${t('pairCount',{n:vocabulary[item.id].length})}${progress.completed.includes(item.id) ? ' · ✓' : ''}`;
    button.append(icon,title,detail); button.onclick = () => {theme = item.id; start(); board.querySelector('button')?.focus({preventScroll:true});};
    $('#theme-list').append(button);
  }
  $('#theme-empty').hidden = Boolean($('#theme-list').children.length);
  $('#theme-page').textContent = `${themePage+1} / ${pages}`;
  $('#themes-prev').disabled = themePage===0; $('#themes-next').disabled = themePage===pages-1;
  const current = themeCatalog.find(item => item.id === theme);
  $('#selected-theme').textContent = `${current.icon} ${themeName(current)} · ${t('round')}`;
  $('#journey-progress').textContent = t('lights',{n:progress.completed.length});
  $('#journey-meter').value = progress.completed.length;
  $('#journey-title').textContent = t(progress.completed.length === 50 ? 'journeyEnd' : progress.completed.length ? 'journeyNear' : 'journeyStart');
}
function updateStreak() {
  $('#streak').textContent = streak > 1 ? t('streak',{n:streak}) : t('rhythm');
  $('#streak').classList.toggle('on-fire',streak >= 3);
}
function celebrate(message) {
  clearTimeout(toastTimer);
  const toast = $('#celebration'); toast.textContent = message; toast.hidden = false;
  toastTimer = setTimeout(() => {toast.hidden = true;},2100);
  cheer(t(streak >= 5 ? 'cheerBig' : 'cheer'));
}
function tap(button) {
  if (!motion || reduced.matches) return;
  button.querySelector('.word').animate([{scale:1},{scale:.9},{scale:1.06},{scale:1}],{duration:300,easing:'ease-out'});
}
function scheduleArrival() {
  clearTimeout(spawnTimer);
  if (!queue.length || !document.body.classList.contains('playing')) return;
  spawnTimer = setTimeout(() => {
    if (document.hidden || locked) { scheduleArrival(); return; }
    const limit = mobile.matches ? 3 : 5;
    const target = 2 + Math.floor(Math.random() * (limit - 1));
    if (active.length < target) {active.push(queue.shift()); render();}
    scheduleArrival();
  }, active.length === 0 ? 650 : 1700 + Math.random() * 2500);
}
const synth = window.speechSynthesis;
const recordedAudio = new Audio();
let speechRequest = 0;
let audioContext;
let lastPop = -Infinity;
function popSound() {
  if (!sound || document.hidden) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    const at = audioContext.currentTime;
    const variant = [[330,100,.11,1100],[520,170,.085,1500],[250,85,.14,800]][Math.floor(Math.random()*3)];
    const tone = audioContext.createOscillator(), envelope = audioContext.createGain();
    tone.frequency.setValueAtTime(variant[0],at); tone.frequency.exponentialRampToValueAtTime(variant[1],at+variant[2]);
    envelope.gain.setValueAtTime(.001,at); envelope.gain.exponentialRampToValueAtTime(.055,at+.008); envelope.gain.exponentialRampToValueAtTime(.001,at+.15);
    tone.connect(envelope); envelope.connect(audioContext.destination); tone.start(at); tone.stop(at+.16);
    const buffer = audioContext.createBuffer(1,Math.ceil(audioContext.sampleRate*.085),audioContext.sampleRate);
    const samples = buffer.getChannelData(0); for(let i=0;i<samples.length;i++) samples[i]=(Math.random()*2-1)*Math.pow(1-i/samples.length,2);
    const noise=audioContext.createBufferSource(), filter=audioContext.createBiquadFilter(), gain=audioContext.createGain();
    noise.buffer=buffer; filter.type='lowpass'; filter.frequency.value=variant[3]; gain.gain.value=.025;
    noise.connect(filter); filter.connect(gain); gain.connect(audioContext.destination); noise.start(at); noise.stop(at+.09);
  } catch {}
}
function effect(kind) {
  if (!sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    const notes = {pick:[660],wrong:[260,220],match:[523,659,784],finish:[523,659,784,1047],start:[392,523]}[kind];
    notes.forEach((frequency,index) => {
      const oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
      const time = audioContext.currentTime + index * .09;
      oscillator.type = 'sine'; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0,time); gain.gain.linearRampToValueAtTime(kind === 'pick' ? .025 : .07,time+.012);
      gain.gain.exponentialRampToValueAtTime(.001,time+.23);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(time); oscillator.stop(time+.25);
    });
  } catch {}
}
function burst(button) {
  if (!motion || reduced.matches) return;
  const box = button.getBoundingClientRect();
  for (let i=0;i<22;i++) {
    const particle = document.createElement('span'); particle.className = 'spark';
    particle.style.left = `${box.x+box.width/2}px`; particle.style.top = `${box.y+box.height/2}px`;
    particle.style.setProperty('--dx',`${Math.cos(i*Math.PI/11)*(110+Math.random()*100)}px`);
    particle.style.setProperty('--dy',`${Math.sin(i*Math.PI/11)*(110+Math.random()*100)}px`);
    particle.style.background = ['#ffe068','#ff69ac','#8b55ed','#fff','#36dfcf'][i%5];
    document.body.append(particle); setTimeout(() => particle.remove(),1100);
  }
  const ring = document.createElement('span'); ring.className = 'match-ring';
  ring.style.left = `${box.x+box.width/2}px`; ring.style.top = `${box.y+box.height/2}px`;
  document.body.append(ring); setTimeout(()=>ring.remove(),1000);
}
function linkPair(a,b) {
  if (!motion || reduced.matches) return;
  const first=a.getBoundingClientRect(),second=b.getBoundingClientRect();
  const x=first.x+first.width/2,y=first.y+first.height/2,dx=second.x+second.width/2-x,dy=second.y+second.height/2-y;
  const line=document.createElement('span');line.className='match-link';
  Object.assign(line.style,{left:`${x}px`,top:`${y}px`,width:`${Math.hypot(dx,dy)}px`,rotate:`${Math.atan2(dy,dx)}rad`});
  document.body.append(line);setTimeout(()=>line.remove(),900);
}
let frenchVoice = null;
function loadVoices() {
  frenchVoice = synth?.getVoices().find(voice => /^fr[-_]FR$/i.test(voice.lang)) || synth?.getVoices().find(voice => /^fr/i.test(voice.lang));
}
loadVoices();
synth?.addEventListener('voiceschanged', loadVoices);
function speak(text) {
  if (!sound) { $('#audio-note').textContent = t('muted'); return; }
  const request = ++speechRequest;
  synth?.cancel(); recordedAudio.pause();
  const entry = Object.entries(vocabulary).flatMap(([category, words]) => words.map(([fr], index) => ({fr,id:`${category}-${index}`}))).find(word => word.fr === text);
  recordedAudio.src = `audio/${entry.id}.mp3`;
  recordedAudio.play().then(() => { $('#audio-note').textContent = ''; }).catch(() => {
    if (request !== speechRequest) return;
    loadVoices();
    if (!synth) { $('#audio-note').textContent = t('audioMissing'); return; }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR'; if (frenchVoice) utterance.voice = frenchVoice; utterance.rate = .85;
  utterance.onerror = event => {
    if (!['interrupted','canceled'].includes(event.error)) $('#audio-note').textContent = t('audioMissing');
  };
  synth.speak(utterance);
  });
}
function save() {
  try {localStorage.setItem('ciel-v1', JSON.stringify({...progress,sound,motion,locale}));}
  catch { $('#audio-note').textContent = t('storage'); }
  $('#lifetime').textContent = progress.total ? t('lifetime',{n:progress.total}) : t('smallStep');
  if (progress.best) $('#lifetime').textContent += ` ${t('best',{n:progress.best})}`;
}
function settings() {
  $('#sound').setAttribute('aria-pressed', String(sound));
  $('#motion').setAttribute('aria-pressed', String(motion));
  document.body.classList.toggle('still', !motion);
}
$('#sound').onclick = () => {sound = !sound; speechRequest++; recordedAudio.pause(); synth?.cancel(); if (!sound) audioContext?.suspend(); settings(); save(); if (sound) speak('le soleil');};
$('#motion').onclick = () => {motion = !motion; settings(); save();};
function updateProgress() { $('#progress-label').textContent = `${found} / 10 ${t('pairs')}`; $('#progress-bar').style.width = `${found * 10}%`; }
function fill(excludeId) {
  while(active.length < 2 && found < 10) {
    if (queue.length) active.push(queue.shift());
    else {
      // Keep two real, playable pairs even at the end; a familiar pair can return.
      const candidates = vocabulary[theme].map(([fr,en],index)=>({id:`${theme}-${index}`,fr,en})).filter(word=>word.id!==excludeId && !active.some(item=>item.id===word.id));
      active.push(shuffle(candidates)[0]);
    }
  }
}
function render(announce = true) {
  const wanted = new Set(active.map(word => word.id));
  for (const button of board.querySelectorAll('button')) if (!wanted.has(button.dataset.id)) button.remove();
  const existing = new Set([...board.children].map(button => `${button.dataset.id}:${button.dataset.lang}`));
  const occupied = new Set([...board.children].map(button => Number(button.dataset.slot)));
  const available = shuffle(Array.from({length: mobile.matches ? 6 : 10}, (_, i) => i).filter(i => !occupied.has(i)));
  const cards = shuffle(active.flatMap(word => ['fr','en'].map(lang => ({...word,lang})))).filter(card => !existing.has(`${card.id}:${card.lang}`));
  const playArrival = announce && sound && cards.length && performance.now()-lastPop >= 15000 && Math.random()<.25;
  if (playArrival) lastPop = performance.now();
  let arrivalIndex = 0;
  for (const card of cards) {
    const button = document.createElement('button');
    button.className = `bubble ${card.lang}`;
    button.dataset.shape = shapes[shapeIndex++ % shapes.length];
    button.dataset.size = ['small','medium','large'][shapeIndex % 3];
    button.style.setProperty('--drift-duration',`${8 + Math.random()*5}s`);
    button.classList.add(Math.random() < .5 ? 'arrive-far' : 'arrive-pop');
    const arrivalDelay = arrivalIndex++ * 130;
    button.style.setProperty('--arrival-delay',`${arrivalDelay}ms`);
    const arrivalGeneration = generation;
    if (playArrival && arrivalIndex <= 2) setTimeout(()=>{if (arrivalGeneration===generation && button.isConnected && document.body.classList.contains('playing')) popSound();},arrivalDelay+80);
    setTimeout(() => button.classList.remove('arrive-far','arrive-pop'),1400+arrivalDelay);
    button.style.setProperty('--delay', `${-Math.random()*5}s`);
    button.dataset.id = card.id; button.dataset.lang = card.lang;
    const slot = available.pop(); button.dataset.slot = slot;
    button.style.gridColumn = String(slot % (mobile.matches ? 2 : 5) + 1);
    button.style.gridRow = String(Math.floor(slot / (mobile.matches ? 2 : 5)) + 1);
    button.style.setProperty('--hue', String(card.lang === 'fr' ? [270,320,350][slot % 3] : [165,195,42][slot % 3]));
    button.setAttribute('aria-pressed','false');
    button.setAttribute('aria-label', `${card[card.lang]}, ${card.lang === 'fr' ? t('listen') : t('english')}`);
    const word = document.createElement('span'); word.className = 'word'; word.lang = card.lang; word.textContent = card[card.lang];
    const label = document.createElement('span'); label.className = 'language'; label.textContent = card.lang === 'fr' ? 'FR · ♪' : 'EN';
    button.append(word,label); button.onclick = () => select(card,button);
    board.append(button);
  }
}
function select(card,button) {
  if (locked) return;
  tap(button);
  if (card.lang === 'fr') speak(card.fr);
  if (selected?.button === button) return;
  if (!selected || selected.card.lang === card.lang) {
    if (card.lang === 'en') effect('pick');
    selected?.button.classList.remove('selected'); selected?.button.setAttribute('aria-pressed','false');
    selected = {card,button}; button.classList.add('selected'); button.setAttribute('aria-pressed','true');
    $('#feedback').textContent = card.lang === 'fr' ? t('pickEnglish') : t('pickFrench');
    return;
  }
  const previous = selected;
  selected = null; locked = true;
  const currentGeneration = generation;
  const matched = isPair(previous.card,card);
  const hadFocus = document.activeElement === button;
  for (const item of [previous.button,button]) {item.classList.remove('selected'); item.setAttribute('aria-pressed','false'); item.classList.add(matched ? 'matched' : 'wrong');}
  if (matched) {
    effect('match'); linkPair(previous.button,button); burst(previous.button); burst(button);
    streak++; bestRound = Math.max(bestRound,streak); progress.best = Math.max(progress.best,streak); updateStreak();
    if (found === 0) cheer(t('cheer'));
    if ([3,5,10].includes(streak)) celebrate({3:t('three'),5:t('five'),10:t('ten')}[streak]);
    found++; progress.total++;
    if (!errors.has(card.id)) progress.mistakes[card.id] = Math.max(0,(Number(progress.mistakes[card.id]) || 0)-1);
    $('#feedback').textContent = `${['Très bien ! ✨','Bravo ! 🌟','Magnifique ! 💜','Super ! 🎈'][Math.floor(Math.random()*4)]} ${card.fr} — ${card.en}`;
    updateProgress(); save();
  } else {
    effect('wrong');
    streak = 0; updateStreak();
    for (const entry of [previous.card,card]) {
      errors.set(entry.id,entry);
      progress.mistakes[entry.id] = (Number(progress.mistakes[entry.id]) || 0)+1;
    }
    $('#feedback').textContent = t('tryAgain'); save();
  }
  setTimeout(() => {
    if (currentGeneration !== generation) return;
    locked = false;
    if (matched) {
      active = active.filter(word => word.id !== card.id); fill(card.id); render(); scheduleArrival();
      if (found === 10) finish(); else if (hadFocus) board.querySelector('button')?.focus({preventScroll:true});
    } else { previous.button.classList.remove('wrong'); button.classList.remove('wrong'); }
  }, matched ? 850 : 600);
}
function start() {
  effect('start');
  document.body.classList.add('playing');
  generation++; clearTimeout(spawnTimer); speechRequest++; recordedAudio.pause(); synth?.cancel(); $('#results').close(); board.replaceChildren();
  queue = makeRound(theme,progress.mistakes); active = []; selected = null; found = 0; errors = new Map(); locked = false;
  streak = 0; bestRound = 0; shapeIndex = 0; shapes = shuffle(['round','oval','classic']); updateStreak();
  clearTimeout(toastTimer); $('#celebration').hidden = true;
  clearTimeout(cheerTimer); $('#bozuu-cheer').hidden = true;
  fill(); render(); scheduleArrival(); updateProgress(); $('#feedback').textContent = t('startHint');
}
function finish() {
  effect('finish');
  const isNew = !progress.completed.includes(theme);
  if (isNew) progress.completed.push(theme);
  save(); renderThemes();
  $('#results').dataset.newStop = String(isNew);
  renderResults();
  $('#results').showModal();
}
function renderResults() {
  const isNew = $('#results').dataset.newStop === 'true';
  $('#journey-result').textContent = progress.completed.length === 50 ? t('endStory') : `${isNew ? t('newLight') : t('oldLight')} ${t('route',{n:progress.completed.length})}`;
  $('#next').textContent = progress.completed.length === 50 ? t('again') : t('next');
  $('#result-description').textContent = t(errors.size ? 'review' : 'perfect');
  $('#review').replaceChildren();
  $('#round-reward').textContent = bestRound === 10 ? t('rewardPerfect') : bestRound >= 5 ? t('rewardFive') : t('reward');
  $('#round-stats').textContent = t('stats',{best:bestRound,total:progress.total});
  for (const word of errors.values()) {
    const button = document.createElement('button'); button.className = 'review-word'; button.textContent = `${word.fr} · ${word.en} ♪`; button.onclick = () => speak(word.fr); $('#review').append(button);
  }
}
$('#results').addEventListener('cancel', event => {event.preventDefault(); start();});
$('#restart').onclick = start;
$('#next').onclick = () => {theme = themeCatalog.find(item => !progress.completed.includes(item.id))?.id || theme; start();};
$('#home').onclick = () => {generation++; clearTimeout(spawnTimer); clearTimeout(toastTimer); clearTimeout(cheerTimer); $('#celebration').hidden = true; $('#bozuu-cheer').hidden = true; speechRequest++; recordedAudio.pause(); synth?.cancel(); document.body.classList.remove('playing'); renderThemes(); $('#theme-search').focus({preventScroll:true});};
$('#result-home').onclick = () => {$('#results').close(); $('#home').click();};
$('#theme-search').addEventListener('input',()=>{themePage=0;renderThemes();});
$('#themes-prev').onclick=()=>{themePage--;renderThemes();};
$('#themes-next').onclick=()=>{themePage++;renderThemes();};
window.addEventListener('resize',()=>{if (!document.body.classList.contains('playing')) renderThemes();});
mobile.addEventListener('change', () => {
  if (!document.body.classList.contains('playing')) { renderThemes(); return; }
  // Return excess pairs to the queue when moving to a narrow screen.
  generation++; locked = false; selected = null;
  // A matched pair may still be waiting for its exit animation.
  const exiting = new Set([...board.querySelectorAll('.matched')].map(button => button.dataset.id));
  active = active.filter(word => !exiting.has(word.id));
  if (mobile.matches && active.length > 3) queue.unshift(...active.splice(3));
  board.replaceChildren(); render(false); scheduleArrival(); if (found === 10 && !$('#results').open) finish();
});
document.addEventListener('visibilitychange', () => {if (document.hidden) {speechRequest++; recordedAudio.pause(); synth?.cancel();}});
theme = themeCatalog.find(item => !progress.completed.includes(item.id))?.id || 'basics';
function localize() {
  $('.intro h1').innerHTML = t('title'); $('.intro > p').innerHTML = t('story');
  $('.theme-picker label').innerHTML = `${t('choose')} <span>${t('themes')}</span>`;
  $('#theme-search').placeholder = t('search');
  for (const [selector,key] of Object.entries({'#theme-empty':'empty','#home':'home','#restart':'restart','#results h2':'closer','#result-home':'other','.below > span:first-child':'headphones','footer span:last-child':'footer'})) $(selector).textContent=t(key);
  for (const key of ['sound','motion']) { $(`#${key}`).title=t(key); $(`#${key}`).setAttribute('aria-label',t(key)); }
  for (const [selector,key] of Object.entries({'#locale':'language','#journey-meter':'completed','.lighthouse':'lighthouse','.game':'game','#theme-list':'themeLabel'})) $(selector).setAttribute('aria-label',t(key));
  $('.theme-pagination').setAttribute('aria-label',locale === 'ru' ? 'Страницы тем' : 'Theme pages');
  $('#themes-prev').setAttribute('aria-label',locale === 'ru' ? 'Предыдущая страница' : 'Previous page');
  $('#themes-next').setAttribute('aria-label',locale === 'ru' ? 'Следующая страница' : 'Next page');
  $('.brand').setAttribute('aria-label','Ciel');
  document.querySelectorAll('img[src="bozuu.svg"]').forEach(img=>{if(img.alt) img.alt=t('mascot');});
  $('#locale').value=locale; $('#audio-note').textContent=''; $('#celebration').hidden=true; $('#bozuu-cheer').hidden=true;
  $('#feedback').textContent = t(selected ? (selected.card.lang==='fr' ? 'pickEnglish' : 'pickFrench') : 'startHint');
  board.querySelectorAll('button').forEach(button=>button.setAttribute('aria-label',`${button.querySelector('.word').textContent}, ${t(button.dataset.lang === 'fr' ? 'listen' : 'english')}`));
  renderThemes(); updateProgress(); updateStreak(); if ($('#results').open) renderResults(); save();
}
$('#locale').onchange = event => {setLocale(event.target.value); localize();};
settings(); localize(); startSky();
