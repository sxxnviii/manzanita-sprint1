// ── PAGE NAVIGATION ──
const NAV_IDS = ['home','services','schedule','about','team','gallery','faq','contact','request'];

function go(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + id);
  if (pg) { pg.classList.add('active'); window.scrollTo({top:0,behavior:'smooth'}); }
  // update nav active state
  NAV_IDS.forEach(n => {
    const btn = document.getElementById('nb-' + n);
    if (btn) btn.classList.toggle('active', n === id);
  });
  // close mobile menu
  const menu = document.getElementById('navMenu');
  if (menu && window.innerWidth <= 900) menu.style.display = 'none';
}


// ── INDIVIDUAL SERVICE PAGE NAV ──
function goSvc(id) {
  go('svc-' + id);
}

function scrollVid() {
  const v = document.getElementById('videoSec');
  if (v) v.scrollIntoView({behavior:'smooth', block:'start'});
}

// ── VIDEO PLAYER ──
const TOTAL = 204; // 3:24
const SCENES = [
  { start:0,   bg:'linear-gradient(135deg,#0B2545 0%,#163A6E 50%,#006064 100%)' },
  { start:41,  bg:'linear-gradient(135deg,#0D47A1 0%,#01579B 50%,#006064 100%)' },
  { start:82,  bg:'linear-gradient(135deg,#004D40 0%,#00695C 40%,#0D47A1 100%)' },
  { start:123, bg:'linear-gradient(135deg,#4A148C 0%,#6A1B9A 40%,#0D47A1 100%)' },
  { start:164, bg:'linear-gradient(135deg,#1B5E20 0%,#00695C 50%,#0B2545 100%)' },
];

let sec = 0, playing = false, ticker = null, spd = 1, muted = false;
const speeds = [0.5,0.75,1,1.25,1.5,2]; let spIdx = 2;

function fmt(s) {
  const m = Math.floor(s/60), x = Math.floor(s%60);
  return m + ':' + (x<10?'0'+x:x);
}

function getScene() {
  let idx = 0;
  SCENES.forEach((sc,i) => { if(sec >= sc.start) idx = i; });
  return idx;
}

function updateUI() {
  const pct = (sec/TOTAL)*100;
  const fill = document.getElementById('progFill');
  const cur = document.getElementById('tCur');
  if (fill) fill.style.width = pct+'%';
  if (cur) cur.textContent = fmt(sec);
  // scene
  const si = getScene();
  document.querySelectorAll('.scene').forEach((sc,i) => sc.classList.toggle('active', i===si));
  const bg = document.getElementById('vidBg');
  if (bg) bg.style.background = SCENES[si].bg;
  // chapters
  document.querySelectorAll('.ch-btn').forEach((b,i) => b.classList.toggle('active', i===si));
}

function updatePlayBtn() {
  const ic = document.getElementById('ppIcon');
  const overlay = document.getElementById('bigOverlay');
  const lbl = document.getElementById('bigLabel');
  if (playing) {
    if (ic) ic.innerHTML = '<div class="pp-pa"><span></span><span></span></div>';
    if (overlay) overlay.classList.add('hidden');
  } else {
    if (ic) ic.innerHTML = '<div class="pp-p"></div>';
    if (overlay) overlay.classList.remove('hidden');
    if (lbl) lbl.textContent = sec===0 ? 'Click to play' : 'Paused';
  }
}

function startPlay() {
  if (ticker) clearInterval(ticker);
  ticker = setInterval(() => {
    sec += spd * 0.1;
    if (sec >= TOTAL) { sec = TOTAL; pausePlay(); return; }
    updateUI();
  }, 100);
  playing = true;
  updatePlayBtn();
}

function pausePlay() {
  if (ticker) { clearInterval(ticker); ticker = null; }
  playing = false;
  updatePlayBtn();
}

function togglePlay() { playing ? pausePlay() : startPlay(); }

function skipBy(n) {
  sec = Math.max(0, Math.min(TOTAL, sec + n));
  updateUI();
}

function jumpTo(s, btn) {
  sec = s; updateUI();
  if (!playing) startPlay();
}

function toggleMute() {
  muted = !muted;
  const b = document.getElementById('muteBtn');
  if (b) b.textContent = muted ? '🔇' : '🔊';
}

function setVol(v) {
  muted = v == 0;
  const b = document.getElementById('muteBtn');
  if (b) b.textContent = muted ? '🔇' : (v < 50 ? '🔉' : '🔊');
}

function cycleSpd() {
  spIdx = (spIdx+1) % speeds.length;
  spd = speeds[spIdx];
  const b = document.getElementById('spdBtn');
  if (b) b.textContent = spd+'×';
  if (playing) { pausePlay(); startPlay(); }
}

function tryFullscreen() {
  const w = document.querySelector('.player-wrap');
  if (!w) return;
  if (!document.fullscreenElement) w.requestFullscreen?.();
  else document.exitFullscreen?.();
}

// Progress bar click & drag
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('progTrack');
  if (track) {
    function seek(e) {
      const r = track.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      sec = pct * TOTAL; updateUI();
    }
    let drag = false;
    track.addEventListener('click', seek);
    track.addEventListener('mousedown', () => drag=true);
    document.addEventListener('mousemove', e => { if(drag) seek(e); });
    document.addEventListener('mouseup', () => drag=false);
  }

  // Set today as min date
  const dt = document.getElementById('sDT');
  if (dt) {
    const today = new Date().toISOString().split('T')[0];
    dt.min = today; dt.value = today;
  }
});

// ── SERVICE EXPAND ──
function togDetail(btn) {
  const exp = btn.closest('.svc-card').querySelector('.svc-expand');
  if (!exp) return;
  const open = exp.classList.contains('open');
  exp.classList.toggle('open', !open);
  btn.textContent = open ? '+ Details' : '− Hide';
}

// ── TIME SLOT ──
function selSlot(el) {
  if (el.classList.contains('na')) return;
  document.querySelectorAll('.tslot').forEach(s => s.classList.remove('sel'));
  el.classList.add('sel');
}

// ── SUBMIT REQUEST ──
function submitReq() {
  const fn = document.getElementById('rFN')?.value?.trim();
  const ph = document.getElementById('rPH')?.value?.trim();
  const sv = document.getElementById('rSV')?.value;
  if (!fn || !ph || !sv) { alert('Please fill in Name, Phone, and Service.'); return; }
  show('req-ok');
}

// ── SUBMIT BOOKING ──
function submitBook() {
  const fn = document.getElementById('sFN')?.value?.trim();
  const ph = document.getElementById('sPH')?.value?.trim();
  const dt = document.getElementById('sDT')?.value;
  const sv = document.getElementById('sSV')?.value;
  const slot = document.querySelector('.tslot.sel');
  if (!fn || !ph) { alert('Please enter your name and phone.'); return; }
  if (!slot) { alert('Please select a time slot.'); return; }

  let dateStr = '—';
  if (dt) {
    const d = new Date(dt+'T12:00:00');
    dateStr = d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});
  }
  const bcDt = document.getElementById('bcDt');
  const bcTm = document.getElementById('bcTm');
  const bcSv = document.getElementById('bcSv');
  if (bcDt) bcDt.textContent = dateStr;
  if (bcTm) bcTm.textContent = slot.textContent;
  if (bcSv) bcSv.textContent = sv || 'General Visit';

  const conf = document.getElementById('bookConf');
  if (conf) { conf.classList.add('show'); conf.scrollIntoView({behavior:'smooth',block:'center'}); }
}

// ── SUBMIT CONTACT ──
function submitContact() {
  const fn = document.getElementById('cFN')?.value?.trim();
  const em = document.getElementById('cEM')?.value?.trim();
  const mg = document.getElementById('cMG')?.value?.trim();
  if (!fn || !em || !mg) { alert('Please fill in Name, Email, and Message.'); return; }
  show('contact-ok');
}

// ── FAQ ──
function togFaq(btn) {
  const ans = btn.nextElementSibling;
  const was = btn.classList.contains('open');
  document.querySelectorAll('.faq-q').forEach(q => { q.classList.remove('open'); if(q.nextElementSibling) q.nextElementSibling.classList.remove('open'); });
  if (!was) { btn.classList.add('open'); if(ans) ans.classList.add('open'); }
}

// ── GALLERY ──
function selGal(btn) {
  document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── HELPER ──
function show(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),6000); }
}

// ── MOBILE MENU ──
function toggleMobile() {
  const menu = document.getElementById('navMenu');
  if (!menu) return;
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    Object.assign(menu.style, {
      display:'flex',flexDirection:'column',position:'absolute',
      top:'66px',left:'0',right:'0',background:'white',
      borderBottom:'1px solid #DDE4EE',padding:'14px 5%',zIndex:'999',gap:'4px'
    });
  }
}

// ── SERVICE FORM SUBMIT ──
function svcSubmit(id) {
  show(id);
}
