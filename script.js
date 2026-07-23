const WMO = {
  0:  {text:"Clear sky", fam:"clear"},
  1:  {text:"Mostly clear", fam:"clear"},
  2:  {text:"Partly cloudy", fam:"cloud"},
  3:  {text:"Overcast", fam:"cloud"},
  45: {text:"Fog", fam:"fog"},
  48: {text:"Depositing rime fog", fam:"fog"},
  51: {text:"Light drizzle", fam:"rain"},
  53: {text:"Drizzle", fam:"rain"},
  55: {text:"Dense drizzle", fam:"rain"},
  56: {text:"Freezing drizzle", fam:"rain"},
  57: {text:"Freezing drizzle", fam:"rain"},
  61: {text:"Light rain", fam:"rain"},
  63: {text:"Rain", fam:"rain"},
  65: {text:"Heavy rain", fam:"rain"},
  66: {text:"Freezing rain", fam:"rain"},
  67: {text:"Freezing rain", fam:"rain"},
  71: {text:"Light snow", fam:"snow"},
  73: {text:"Snow", fam:"snow"},
  75: {text:"Heavy snow", fam:"snow"},
  77: {text:"Snow grains", fam:"snow"},
  80: {text:"Rain showers", fam:"rain"},
  81: {text:"Rain showers", fam:"rain"},
  82: {text:"Violent showers", fam:"rain"},
  85: {text:"Snow showers", fam:"snow"},
  86: {text:"Snow showers", fam:"snow"},
  95: {text:"Thunderstorm", fam:"storm"},
  96: {text:"Thunderstorm, hail", fam:"storm"},
  99: {text:"Thunderstorm, hail", fam:"storm"},
};

/* ---------------- Icon set (inline SVG, stroke-based) ---------------- */
function icon(fam, isDay, size=1){
  const stroke = "currentColor";
  const sun = `<circle cx="32" cy="32" r="12" stroke="${stroke}" stroke-width="3" fill="none"/>
    ${[0,45,90,135,180,225,270,315].map(a=>`<line x1="${32+18*Math.cos(a*Math.PI/180)}" y1="${32+18*Math.sin(a*Math.PI/180)}" x2="${32+26*Math.cos(a*Math.PI/180)}" y2="${32+26*Math.sin(a*Math.PI/180)}" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`).join('')}`;
  const moon = `<path d="M40 20a16 16 0 1 0 4 26 13 13 0 0 1-4-26z" stroke="${stroke}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  const cloud = `<path d="M20 42h24a9 9 0 0 0 1-17.9A13 13 0 0 0 20 20a10 10 0 0 0-2 21.9" stroke="${stroke}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const cloudSmall = `<path d="M24 40h18a7 7 0 0 0 0-14 10 10 0 0 0-19-1 8 8 0 0 0 1 15" stroke="${stroke}" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const rainDrops = `<line x1="26" y1="48" x2="23" y2="56" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/><line x1="34" y1="48" x2="31" y2="56" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/><line x1="42" y1="48" x2="39" y2="56" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;
  const snowDots = `<circle cx="24" cy="50" r="2" fill="${stroke}"/><circle cx="32" cy="54" r="2" fill="${stroke}"/><circle cx="40" cy="50" r="2" fill="${stroke}"/>`;
  const bolt = `<path d="M34 46l-8 12h7l-3 10 11-14h-7l3-8z" fill="${stroke}"/>`;
  const fogLines = `<line x1="16" y1="44" x2="48" y2="44" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/><line x1="20" y1="52" x2="44" y2="52" stroke="${stroke}" stroke-width="3" stroke-linecap="round"/>`;

  let inner = "";
  if(fam==="clear"){ inner = isDay ? sun : moon; }
  else if(fam==="cloud"){ inner = isDay ? sun.replace('r="12"','r="9"').replace('cx="32" cy="32"','cx="24" cy="26"') + cloud : moon.replace('40 20','34 22') + cloud; }
  else if(fam==="fog"){ inner = cloudSmall + fogLines; }
  else if(fam==="rain"){ inner = cloudSmall + rainDrops; }
  else if(fam==="snow"){ inner = cloudSmall + snowDots; }
  else if(fam==="storm"){ inner = cloudSmall + bolt; }
  else { inner = cloud; }
  return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="color:var(--cloud)">${inner}</svg>`;
}

function compassIcon(deg){
  return `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" stroke="currentColor" stroke-width="2" opacity="0.35"/>
    <g transform="rotate(${deg} 32 32)"><path d="M32 10 L38 34 L32 30 L26 34 Z" fill="currentColor"/></g></svg>`;
}

/* ---------------- Sky particle canvas ---------------- */
const canvas = document.getElementById('sky-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mode = "clear"; // clear | cloud | rain | snow | storm | fog
let W=0,H=0;
function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
window.addEventListener('resize', resize); resize();

function seedParticles(){
  particles = [];
  if(mode==="rain" || mode==="storm"){
    for(let i=0;i<140;i++) particles.push({x:Math.random()*W, y:Math.random()*H, len:10+Math.random()*14, speed:8+Math.random()*7, drift:-1});
  } else if(mode==="snow"){
    for(let i=0;i<90;i++) particles.push({x:Math.random()*W, y:Math.random()*H, r:1.5+Math.random()*2.5, speed:0.6+Math.random()*1.2, drift:Math.random()*0.6-0.3, wob:Math.random()*Math.PI*2});
  } else if(mode==="clear-night"){
    for(let i=0;i<90;i++) particles.push({x:Math.random()*W, y:Math.random()*H*0.6, r:Math.random()*1.4+0.3, tw:Math.random()*Math.PI*2});
  } else {
    particles = [];
  }
}

let animMode = "clear";
function tick(){
  ctx.clearRect(0,0,W,H);
  if(animMode==="rain" || animMode==="storm"){
    ctx.strokeStyle = "rgba(200,220,240,0.5)";
    ctx.lineWidth = 1.4;
    for(const p of particles){
      ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x+p.drift*4,p.y+p.len); ctx.stroke();
      p.y += p.speed; p.x += p.drift;
      if(p.y>H){ p.y=-20; p.x=Math.random()*W; }
    }
  } else if(animMode==="snow"){
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for(const p of particles){
      p.wob += 0.02;
      ctx.beginPath(); ctx.arc(p.x+Math.sin(p.wob)*8, p.y, p.r, 0, Math.PI*2); ctx.fill();
      p.y += p.speed;
      if(p.y>H){ p.y=-10; p.x=Math.random()*W; }
    }
  } else if(animMode==="clear-night"){
    for(const p of particles){
      p.tw += 0.03;
      const a = 0.4 + Math.sin(p.tw)*0.4;
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0,a)})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

function setSky(fam, isDay){
  const body = document.body;
  body.className = "";
  const sun = document.getElementById('sun-moon');
  sun.classList.remove('show-sun','show-moon');

  if(fam==="clear"){
    body.classList.add(isDay ? "sky-clear-day" : "sky-clear-night");
    sun.classList.add(isDay ? "show-sun" : "show-moon");
    animMode = isDay ? "clear" : "clear-night";
  } else if(fam==="cloud"){
    body.classList.add(isDay ? "sky-cloud-day" : "sky-cloud-night");
    animMode = "clear";
  } else if(fam==="rain"){
    body.classList.add(isDay ? "sky-rain-day" : "sky-rain-night");
    animMode = "rain";
  } else if(fam==="snow"){
    body.classList.add(isDay ? "sky-snow-day" : "sky-snow-night");
    animMode = "snow";
  } else if(fam==="storm"){
    body.classList.add("sky-storm");
    animMode = "storm";
  } else if(fam==="fog"){
    body.classList.add("sky-fog");
    animMode = "clear";
  }
  mode = fam;
  seedParticles();
}

/* ---------------- Data fetching ---------------- */
const statusArea = document.getElementById('statusArea');
const statusDetail = document.getElementById('statusDetail');
const dashboard = document.getElementById('dashboard');

async function geocode(name){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=6&language=en&format=json`;
  const r = await fetch(url);
  const j = await r.json();
  return j.results || [];
}

async function reverseGeocode(lat, lon){
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=&count=1&language=en&format=json&latitude=${lat}&longitude=${lon}`;
  // Open-Meteo geocoding search doesn't do reverse lookup; fall back to a generic label
  return null;
}

async function fetchWeather(lat, lon){
  const params = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,is_day",
    hourly: "temperature_2m,weather_code,precipitation_probability",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: "6"
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const r = await fetch(url);
  if(!r.ok) throw new Error("Forecast request failed");
  return r.json();
}

function fmtHour(iso){
  const d = new Date(iso);
  return d.toLocaleTimeString([], {hour:'numeric'});
}
function fmtDay(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString([], {weekday:'short'});
}

function render(place, data){
  const cur = data.current;
  const fam = (WMO[cur.weather_code] || {fam:"cloud"}).fam;
  const isDay = cur.is_day === 1;

  document.getElementById('placeName').textContent = place.name;
  document.getElementById('placeCountry').textContent = [place.admin1, place.country].filter(Boolean).join(', ');
  document.getElementById('tempNow').textContent = Math.round(cur.temperature_2m);
  document.getElementById('conditionText').textContent = (WMO[cur.weather_code]||{}).text || "—";
  document.getElementById('feelsLike').textContent = Math.round(cur.apparent_temperature);
  document.getElementById('hiToday').textContent = Math.round(data.daily.temperature_2m_max[0]);
  document.getElementById('loToday').textContent = Math.round(data.daily.temperature_2m_min[0]);
  document.getElementById('updatedAt').textContent = new Date(cur.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  document.getElementById('heroIcon').innerHTML = icon(fam, isDay);

  setSky(fam, isDay);

  // hourly strip: next 24h starting from current hour
  const nowISO = cur.time;
  let startIdx = data.hourly.time.findIndex(t => t >= nowISO);
  if(startIdx < 0) startIdx = 0;
  const hStrip = document.getElementById('hourlyStrip');
  hStrip.innerHTML = "";
  for(let i=startIdx; i<Math.min(startIdx+24, data.hourly.time.length); i++){
    const wc = data.hourly.weather_code[i];
    const f = (WMO[wc]||{fam:"cloud"}).fam;
    const div = document.createElement('div');
    div.className = "hour-card" + (i===startIdx ? " now" : "");
    div.innerHTML = `<div class="t">${i===startIdx ? 'Now' : fmtHour(data.hourly.time[i])}</div>
      ${icon(f, isDay, 0.5)}
      <div class="v">${Math.round(data.hourly.temperature_2m[i])}°</div>`;
    hStrip.appendChild(div);
  }

  // daily
  const dailyList = document.getElementById('dailyList');
  dailyList.innerHTML = "";
  const allHigh = Math.max(...data.daily.temperature_2m_max);
  const allLow = Math.min(...data.daily.temperature_2m_min);
  const span = Math.max(1, allHigh - allLow);
  for(let i=0; i<Math.min(5, data.daily.time.length); i++){
    const wc = data.daily.weather_code[i];
    const f = (WMO[wc]||{fam:"cloud"}).fam;
    const hi = data.daily.temperature_2m_max[i];
    const lo = data.daily.temperature_2m_min[i];
    const leftPct = ((lo-allLow)/span)*100;
    const widthPct = ((hi-lo)/span)*100;
    const row = document.createElement('div');
    row.className = "day-row";
    row.innerHTML = `
      <div class="dname">${i===0 ? "Today" : fmtDay(data.daily.time[i])}</div>
      <div class="dcondition">${icon(f, true)} ${(WMO[wc]||{}).text||""}</div>
      <div class="range">
        <span class="lo">${Math.round(lo)}°</span>
        <div class="bar"><i style="left:${leftPct}%"></i></div>
        <span class="hi">${Math.round(hi)}°</span>
      </div>
      <div class="rain">${data.daily.precipitation_probability_max[i]}% rain</div>
    `;
    dailyList.appendChild(row);
  }

  // dial grid
  const dialGrid = document.getElementById('dialGrid');
  const sunrise = new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  const sunset = new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
  dialGrid.innerHTML = `
    <div class="dial">
      <div class="dlabel">Humidity</div>
      <div class="dvalue">${cur.relative_humidity_2m}<small>%</small></div>
      <div class="dsub">Relative humidity</div>
    </div>
    <div class="dial">
      <div class="dlabel">Wind</div>
      <div class="dvalue">${Math.round(cur.wind_speed_10m)}<small>km/h</small></div>
      <div class="compass" style="color:var(--gold)">${compassIcon(cur.wind_direction_10m)}<span class="dsub">${cur.wind_direction_10m}°</span></div>
    </div>
    <div class="dial">
      <div class="dlabel">Pressure</div>
      <div class="dvalue">${Math.round(cur.surface_pressure)}<small>hPa</small></div>
      <div class="dsub">At surface</div>
    </div>
    <div class="dial">
      <div class="dlabel">UV Index</div>
      <div class="dvalue">${Math.round(data.daily.uv_index_max[0])}</div>
      <div class="dsub">Peak today</div>
    </div>
    <div class="dial">
      <div class="dlabel">Sunrise</div>
      <div class="dvalue" style="font-size:22px">${sunrise}</div>
    </div>
    <div class="dial">
      <div class="dlabel">Sunset</div>
      <div class="dvalue" style="font-size:22px">${sunset}</div>
    </div>
  `;

  statusArea.classList.add('hidden');
  dashboard.classList.remove('hidden');
}

async function loadCity(place){
  try{
    statusArea.classList.remove('hidden');
    dashboard.classList.add('hidden');
    statusArea.firstChild.textContent = "Reading the sky over " + place.name + "… ";
    const data = await fetchWeather(place.latitude, place.longitude);
    render(place, data);
  }catch(err){
    statusArea.classList.remove('hidden');
    dashboard.classList.add('hidden');
    statusArea.firstChild.textContent = "Couldn't load weather for that place. ";
    statusDetail.textContent = "Check your connection and try again.";
    console.error(err);
  }
}

async function loadByCoords(lat, lon, label){
  try{
    statusArea.classList.remove('hidden');
    dashboard.classList.add('hidden');
    statusArea.firstChild.textContent = "Reading the sky above you… ";
    const data = await fetchWeather(lat, lon);
    render({name: label || "Your location", admin1:"", country:""}, data);
  }catch(err){
    statusArea.firstChild.textContent = "Couldn't load your local weather. ";
    statusDetail.textContent = "Try searching for a city instead.";
    console.error(err);
  }
}

/* ---------------- Search UI ---------------- */
const cityInput = document.getElementById('cityInput');
const suggList = document.getElementById('suggList');
let debounceT;

cityInput.addEventListener('input', () => {
  clearTimeout(debounceT);
  const q = cityInput.value.trim();
  if(q.length < 2){ suggList.classList.remove('open'); return; }
  debounceT = setTimeout(async () => {
    const results = await geocode(q);
    if(!results.length){ suggList.classList.remove('open'); return; }
    suggList.innerHTML = results.map((r,i) =>
      `<div class="sugg-item" data-idx="${i}">${r.name}<span class="country">${[r.admin1, r.country].filter(Boolean).join(', ')}</span></div>`
    ).join('');
    suggList.classList.add('open');
    suggList.querySelectorAll('.sugg-item').forEach((el,i) => {
      el.addEventListener('click', () => {
        suggList.classList.remove('open');
        cityInput.value = results[i].name;
        loadCity(results[i]);
      });
    });
  }, 320);
});

document.getElementById('searchBtn').addEventListener('click', async () => {
  const q = cityInput.value.trim();
  if(!q) return;
  const results = await geocode(q);
  if(results.length) loadCity(results[0]);
  else { statusArea.classList.remove('hidden'); dashboard.classList.add('hidden'); statusArea.firstChild.textContent = "No place found for \"" + q + "\". "; }
});
cityInput.addEventListener('keydown', e => { if(e.key === 'Enter'){ suggList.classList.remove('open'); document.getElementById('searchBtn').click(); }});
document.addEventListener('click', e => { if(!document.getElementById('suggestions').contains(e.target)) suggList.classList.remove('open'); });

function useGeolocation(){
  if(!navigator.geolocation){
    statusDetail.textContent = "Geolocation isn't available — try searching instead.";
    return;
  }
  statusArea.classList.remove('hidden'); dashboard.classList.add('hidden');
  statusArea.firstChild.textContent = "Locating you… ";
  navigator.geolocation.getCurrentPosition(
    pos => loadByCoords(pos.coords.latitude, pos.coords.longitude),
    () => { loadCity({name:"Addis Ababa", latitude:9.03, longitude:38.74, admin1:"Oromia", country:"Ethiopia"}); },
    {timeout:6000}
  );
}
document.getElementById('locbtn2').addEventListener('click', useGeolocation);

/* ---------------- Initial load ---------------- */
(function init(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos => loadByCoords(pos.coords.latitude, pos.coords.longitude),
      () => loadCity({name:"Addis Ababa", latitude:9.03, longitude:38.74, admin1:"Oromia", country:"Ethiopia"}),
      {timeout:5000}
    );
  } else {
    loadCity({name:"Addis Ababa", latitude:9.03, longitude:38.74, admin1:"Oromia", country:"Ethiopia"});
  }
})();