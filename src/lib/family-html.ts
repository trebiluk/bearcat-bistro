import { COLORS } from "./brand";
import { loadBackupFolder, writeBackupFile } from "./folder";
import { buildFamilyPayload, type FamilyPayload, type FamilySource } from "./family-menu";
import { I18N, LOCALES } from "./i18n";
import { ndsHtml } from "./legal";

export function renderFamilyHtml(data: FamilyPayload) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<title>${data.brand.name} · lunch menu</title>
<meta name="theme-color" content="${COLORS.navy.hex}"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700&family=Noto+Sans:wght@400;600;700&family=Noto+Sans+Arabic:wght@400;600;700&family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Sans+Ethiopic:wght@400;600;700&display=swap"/>
<style>
:root{--navy:${COLORS.navy.hex};--navy2:${COLORS.navy2.hex};--harvest:${COLORS.harvest.hex};--cream:${COLORS.cream.hex};--gold:${COLORS.gold.hex};--ink:${COLORS.ink.hex};--muted:${COLORS.muted.hex};--paper:${COLORS.paper.hex};--line:${COLORS.line.hex}}
*{box-sizing:border-box}
html,body{margin:0;background:radial-gradient(1200px 480px at 10% -10%,#fff8f2 0%,transparent 55%),var(--paper);color:var(--ink);font-family:Barlow,Segoe UI,sans-serif}
html[lang=ar],html[lang=fa]{font-family:"Noto Sans Arabic","Noto Naskh Arabic",Tahoma,sans-serif}
html[lang=fa]{font-family:"Noto Naskh Arabic","Noto Sans Arabic",Tahoma,sans-serif}
html[lang=ti]{font-family:"Noto Sans Ethiopic",Barlow,sans-serif}
html[lang=uk],html[lang=ru]{font-family:"Noto Sans",Barlow,sans-serif}
html[dir=rtl] h1,html[dir=rtl] h2,html[dir=rtl] h3,.hero h2{font-family:inherit;letter-spacing:0}
.langs{display:flex;flex-wrap:wrap;gap:6px;padding:8px 16px;background:var(--navy2);direction:ltr}
.langs button{background:rgba(255,255,255,.08);color:var(--cream);padding:8px 12px;border-radius:999px;font-size:15px;font-weight:700;min-height:40px}
.langs button.on{background:var(--harvest);color:var(--cream)}
.calwrap,.week,table.cal{direction:ltr}
h1,h2,h3{font-family:"Bebas Neue",Arial Narrow,Impact,sans-serif;letter-spacing:.03em;font-weight:400}
button{cursor:pointer;border:0;font-family:inherit}
.wrap{max-width:1100px;margin:0 auto;padding:16px}
header.top{background:var(--navy);color:var(--cream);box-shadow:inset 0 -3px 0 var(--harvest)}
header.top .wrap{display:flex;flex-wrap:nowrap;gap:8px;align-items:center;justify-content:space-between;padding-top:10px;padding-bottom:10px}
.kicker{color:var(--harvest);letter-spacing:.22em;font-size:10px;margin:0;font-weight:600}
.brand{font-family:"Bebas Neue",sans-serif;font-size:28px;line-height:.85;margin:2px 0 0}
.schools{display:flex;gap:4px;background:rgba(255,255,255,.1);padding:3px;border-radius:999px;flex-shrink:0}
.schools button{background:transparent;color:rgba(251,247,242,.75);padding:8px 12px;border-radius:999px;font-size:13px;font-weight:600}
.schools button.on{background:var(--cream);color:var(--navy)}
.cep{margin:0;padding:8px 16px;background:var(--harvest);color:var(--cream);font-size:16px;font-weight:700}
.hero{background:var(--navy);color:var(--cream);margin:0 0 12px;padding:16px 18px;border-radius:16px;box-shadow:inset 3px 0 0 var(--harvest),0 10px 28px -18px rgba(19,36,60,.28)}
.hero .when{color:var(--harvest);font-size:12px;font-weight:600;letter-spacing:.08em;margin:0}
.hero h2{font-size:clamp(32px,8vw,56px);line-height:.9;margin:6px 0}
.hero p{margin:6px 0 0;font-size:15px;color:rgba(251,247,242,.85)}
.tools{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.tools input{flex:1;min-width:180px;height:42px;padding:0 14px;border:0;border-radius:999px;border-left:3px solid var(--harvest);background:var(--gold);font:inherit;font-size:15px}
.btn{height:42px;padding:0 16px;border-radius:999px;background:var(--cream);color:var(--navy);font-size:14px;font-weight:600;box-shadow:0 1px 2px rgba(19,36,60,.04)}
.btn.primary{background:var(--harvest);color:var(--cream)}
details.toolsbox{margin:14px 0 8px;background:var(--cream);border-radius:12px;padding:4px 12px}
details.toolsbox summary{font-size:14px;font-weight:600;padding:10px 0;cursor:pointer;list-style:none}
details.toolsbox summary::-webkit-details-marker{display:none}
.months{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 12px}
.months button{padding:7px 12px;border-radius:999px;background:var(--cream);color:var(--muted);font-size:13px;font-weight:600}
.months button.on{background:var(--navy);color:var(--cream)}
.honor{font-size:13px;color:var(--muted);margin:0 0 8px}
.week{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
@media(max-width:800px){.week{grid-template-columns:1fr 1fr}}
.card{background:var(--cream);border-left:3px solid var(--harvest);border-radius:12px;padding:12px;min-height:88px;text-align:left;box-shadow:0 1px 2px rgba(19,36,60,.04)}
.card.today{background:var(--navy);color:var(--cream)}
.card.closed{background:var(--cream);color:var(--muted);border-color:var(--line)}
.card .d{font-size:12px;font-weight:600;color:var(--harvest)}
.card .e{font-family:"Bebas Neue",sans-serif;font-size:22px;line-height:1.05;margin-top:4px}
.card .holy{font-size:11px;color:var(--muted);margin-top:4px;font-weight:500}
.calwrap{overflow:auto;border-radius:16px;background:var(--cream);box-shadow:0 1px 2px rgba(19,36,60,.04);-webkit-overflow-scrolling:touch}
table.cal{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;background:var(--cream)}
table.cal th{background:var(--harvest);color:var(--cream);padding:10px 4px;font-size:12px;font-weight:600;letter-spacing:.04em;position:sticky;top:0;z-index:2}
table.cal th.wk{background:var(--navy2);color:rgba(251,247,242,.8)}
table.cal td{border-top:1px solid var(--line);border-left:1px solid var(--line);vertical-align:top;height:96px;padding:6px;width:14.28%;overflow:hidden}
.dshort{display:none}
table.cal tr td:first-child{border-left:0}
table.cal td.out{background:#f6f1ea;color:#b5aea6}
table.cal td.closed{background:#f4f0ea}
table.cal td.today{box-shadow:inset 0 0 0 2px var(--harvest)}
table.cal td.holy{background:var(--gold)}
table.cal td button{all:unset;display:block;width:100%;height:100%;cursor:pointer;font-family:Barlow,sans-serif}
.num{font-family:"Bebas Neue",sans-serif;font-size:20px;color:var(--navy)}
.food{font-weight:700;font-size:13px;line-height:1.25;margin-top:4px}
.holy{font-size:11px;color:var(--muted);font-weight:500;margin-top:3px}
.side{font-size:13px;color:var(--muted);line-height:1.45}
.breakfast{background:var(--gold);border-radius:12px;padding:12px 14px;color:var(--navy);font-size:13px;line-height:1.4;margin:12px 0}
.lab{background:var(--cream);border-radius:16px;padding:14px 16px;margin:12px 0}
.lab .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.lab .chips span{background:var(--gold);border-radius:999px;padding:4px 10px;font-size:12px;font-weight:600}
.holidays{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0 14px}
.holidays span{font-size:12px;color:var(--muted);background:var(--cream);border-radius:999px;padding:4px 10px}
.drawer{position:fixed;inset:auto 16px 16px 16px;background:var(--cream);color:var(--ink);padding:18px;border-radius:16px;box-shadow:0 18px 40px -20px rgba(19,36,60,.45);z-index:20;max-width:720px;margin:0 auto}
.drawer .kicker{color:var(--harvest)}
.drawer h3{font-size:28px;margin:4px 0}
.hits{background:var(--cream);border-radius:12px;padding:12px;margin:12px 0}
.hits button{display:block;width:100%;text-align:left;padding:8px;background:transparent;font-size:15px;border-bottom:1px solid var(--line)}
.skip{position:absolute;left:-999px;top:8px}
.skip:focus{left:8px;z-index:50;background:var(--harvest);color:var(--cream);padding:8px 14px;border-radius:999px;text-decoration:none;font-weight:700}
button:focus-visible,a:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid var(--harvest);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}}
.nds-full{font-size:12px;line-height:1.5;color:var(--navy);margin-top:12px}
.nds-full a{color:#b84420}
.nds-full ol{padding-left:1.2em}
@media (max-width:700px){
  .wrap{padding:10px 12px 16px}
  .brand{font-size:26px}
  .cep{font-size:12px;padding:6px 12px}
  .hero{margin-bottom:10px;padding:14px 14px}
  .tools{flex-direction:column}
  .tools input,.btn{width:100%}
  .week{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px;margin-left:-12px;margin-right:-12px;padding-left:12px;padding-right:12px}
  .card{flex:0 0 72%;min-width:72%;scroll-snap-align:start;min-height:72px}
  .dlong{display:none}
  .dshort{display:inline}
  table.cal th{font-size:10px;padding:8px 1px;letter-spacing:0}
  table.cal td{height:78px;padding:4px 3px}
  .num{font-size:16px}
  .food{font-size:11px;line-height:1.2;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .holy{font-size:10px}
  .drawer{inset:auto 10px 12px 10px;padding:16px}
  #monthTitle{font-size:28px;margin:8px 0 4px}
}
@media print{
  header.top,.tools,.drawer,.langs,.skip{display:none!important}
  .hero,.week{break-inside:avoid}
  table.cal td{height:72px}
  body{background:white}
}
</style>
</head>
<body>
<a class="skip" href="#lunch">Skip to lunch</a>
<header class="top">
  <div class="wrap">
    <div>
      <p class="kicker">${data.brand.kicker}</p>
      <p class="brand">${data.brand.name}</p>
    </div>
    <div class="schools" id="schools"></div>
  </div>
</header>
<p class="cep" id="cep"></p>
<div class="langs" id="langs" role="navigation" aria-label="Language"></div>
<div class="wrap">
  <div id="lunch">
  <div id="hero"></div>
  <div class="week" id="week"></div>
  </div>
  <div id="lab" class="lab"></div>
  <div id="hits"></div>
  <div class="months" id="months"></div>
  <h2 id="monthTitle"></h2>
  <p id="honor" class="honor"></p>
  <div class="holidays" id="holidays"></div>
  <div class="calwrap"><table class="cal" id="cal"></table></div>
  <details class="toolsbox">
    <summary id="toolsSum"></summary>
    <div class="tools">
      <input id="q" placeholder="" aria-label="Find a food"/>
      <button class="btn" id="copy"></button>
      <button class="btn" id="ics"></button>
      <button class="btn primary" id="print"></button>
    </div>
  </details>
  <p id="alts" class="side" style="margin-top:14px"></p>
  <p class="breakfast" id="breakfast"></p>
  <p class="side" id="allergy"></p>
  <p class="side" id="contact"></p>
  <div class="foot nds">
    <p id="cepFoot"></p>
    <p id="legalHint"></p>
    <p id="legalShort"></p>
    <div class="nds-full">${ndsHtml()}</div>
  </div>
</div>
<div class="drawer" id="drawer" hidden></div>
<script type="application/json" id="data">${json}</script>
<script type="application/json" id="i18n">${JSON.stringify({ locales: LOCALES, packs: I18N }).replace(/</g, "\\u003c")}</script>
<script>
const DATA = JSON.parse(document.getElementById("data").textContent);
const I18 = JSON.parse(document.getElementById("i18n").textContent);
const store = {
  school: localStorage.getItem("bb-school") || DATA.schools[1].id,
  month: defaultMonth(),
  q: "",
  lang: localStorage.getItem("bb-lang") || "en"
};
function defaultMonth(){
  const t = DATA.today.slice(0,7);
  if (DATA.months.some(m => m.key === t)) return t;
  const past = DATA.months.filter(m => m.key <= t);
  return (past[past.length-1] || DATA.months[0] || {key:t}).key;
}
function loc(){ return I18.locales.find(x => x.id===store.lang) || I18.locales[0]; }
function L(){ return I18.packs[store.lang] || I18.packs.en; }
function food(n){ const p=L(); return (p.food && p.food[n]) || n; }
function statusText(s){
  const p=L();
  if (s==="Snow") return p.snow;
  if (s==="Holiday") return p.holiday;
  if (s==="Weekend") return p.weekend;
  if (s==="Breakfast only") return p.halfDay;
  if (s==="Closed" || s==="PD") return p.closed;
  return s;
}
function applyLang(){
  const meta = loc();
  document.documentElement.lang = meta.id;
  document.documentElement.dir = meta.dir;
  document.getElementById("cep").textContent = L().cep;
  document.getElementById("toolsSum").textContent = L().tools;
  document.getElementById("q").placeholder = L().searchPh;
  document.getElementById("q").setAttribute("aria-label", L().findFood);
  document.getElementById("copy").textContent = L().copy;
  document.getElementById("ics").textContent = L().ics;
  document.getElementById("print").textContent = L().print;
  document.getElementById("alts").textContent = L().alts;
  document.getElementById("breakfast").textContent = L().breakfast;
  document.getElementById("allergy").textContent = L().allergy+" "+L().change;
  document.getElementById("contact").textContent = L().contact;
  document.getElementById("cepFoot").textContent = L().cep;
  document.getElementById("legalHint").textContent = L().legalHint;
  document.getElementById("legalShort").textContent = L().legalShort;
}
function paintLangs(){
  document.getElementById("langs").innerHTML = I18.locales.map(x =>
    "<button type='button' data-lang='"+x.id+"' lang='"+x.id+"' dir='"+x.dir+"' aria-pressed='"+(x.id===store.lang?"true":"false")+"' class='"+(x.id===store.lang?"on":"")+"'>"+x.native+"</button>"
  ).join("");
}
function daysOf(){ return DATA.days[store.school] || {}; }
function school(){ return DATA.schools.find(s => s.id === store.school) || DATA.schools[0]; }
function monthMeta(){ return DATA.months.find(m => m.key === store.month) || DATA.months[0]; }
function iso(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function parse(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function sunday(d){ const x=new Date(d); x.setDate(x.getDate()-x.getDay()); return x; }
function add(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
function fmt(s){
  const d=parse(s);
  return L().days[d.getDay()]+", "+L().months[d.getMonth()]+" "+d.getDate();
}
function todayLunch(){ return daysOf()[DATA.today]; }
function serve(day){ return day && day.status === "Serve"; }

function paintSchools(){
  document.getElementById("schools").innerHTML = DATA.schools.map(s =>
    "<button data-id="+s.id+" class='"+(s.id===store.school?"on":"")+"'>"+s.short+"</button>"
  ).join("");
}
function paintMonths(){
  document.getElementById("months").innerHTML = DATA.months.map(m => {
    const n = Number(m.key.slice(5,7));
    const label = L().months[n-1] || m.name;
    return "<button data-m="+m.key+" class='"+(m.key===store.month?"on":"")+"'>"+label+"</button>";
  }).join("");
}
function nextServe(from){
  const map = daysOf();
  return Object.keys(map).sort().find(k => k >= from && serve(map[k]));
}
function paintHero(){
  const sc = school();
  const today = todayLunch();
  const nextKey = serve(today) ? DATA.today : nextServe(DATA.today);
  const day = nextKey ? daysOf()[nextKey] : null;
  let html = "";
  if (serve(today)){
    html = "<div class='hero'><p class='when'>"+esc(L().today)+" · "+esc(sc.short)+" · "+esc(L().lunchFree)+"</p><h2>"+esc(food(today.entree))+"</h2><p>"+esc((today.second?food(today.second)+" · ":"")+(today.sides||[]).map(food).join(" · "))+"</p></div>";
  } else if (day){
    html = "<div class='hero'><p class='when'>"+esc(L().nextLunch)+" · "+esc(fmt(nextKey))+" · "+esc(sc.short)+"</p><h2>"+esc(food(day.entree))+"</h2><p>"+esc((day.second?food(day.second)+" · ":"")+(day.sides||[]).map(food).join(" · "))+"</p></div>";
  } else {
    html = "<div class='hero'><p class='when'>"+esc(sc.name)+"</p><h2>"+esc(monthLabel())+"</h2><p>"+esc(L().menuNotPosted)+"</p></div>";
  }
  document.getElementById("hero").innerHTML = html;
  paintLab();
}
function paintLab(){
  const el = document.getElementById("lab");
  if (!el) return;
  const today = todayLunch();
  const day = serve(today) ? today : (function(){ const k=nextServe(DATA.today); return k?daysOf()[k]:null; })();
  if (!serve(day)) { el.hidden = true; return; }
  el.hidden = false;
  const bits = [day.entree, day.second].concat(day.sides||[]).concat([day.milk]).filter(Boolean);
  el.innerHTML = "<p class='kicker'>Nutrition lab</p><p><b>Five groups:</b> fruit, veggie, grain, protein, milk. Take at least 3, including fruit or veg (½ cup).</p><div class='chips'>"+bits.map(function(n){return "<span>"+esc(food(n))+"</span>";}).join("")+"</div>";
}
function monthLabel(){
  const [y,m] = store.month.split("-").map(Number);
  return L().months[m-1]+" "+y;
}
function weekDays(){
  const start = sunday(parse(DATA.today <= (store.month+"-28") ? (DATA.today.startsWith(store.month)? DATA.today : store.month+"-01") : store.month+"-01"));
  const map = daysOf();
  const cells = [];
  for (let i=1;i<=5;i++){
    const d = iso(add(start,i));
    const day = map[d];
    if (day) cells.push({date:d, day});
  }
  if (!cells.length){
    const keys = Object.keys(map).filter(k => k.startsWith(store.month) && map[k].status==="Serve").slice(0,5);
    return keys.map(k => ({date:k, day:map[k]}));
  }
  return cells;
}
function shortCap(day){
  if (!day) return "";
  if (serve(day)) return food(day.entree);
  if (day.status === "Weekend") return "";
  if (day.note && day.note.length <= 16 && store.lang==="en") return day.note;
  return statusText(day.status);
}
function paintWeek(){
  document.getElementById("week").innerHTML = weekDays().map(({date,day}) => {
    const on = date===DATA.today;
    const closed = !serve(day);
    const label = on ? L().today : L().days[parse(date).getDay()];
    return "<button class='card"+(on?" today":"")+(closed?" closed":"")+"' data-day='"+date+"'><div class='d'>"+esc(label)+"</div><div class='e'>"+esc(shortCap(day))+"</div></button>";
  }).join("");
}
function paintCal(){
  const [y,m] = store.month.split("-").map(Number);
  const first = new Date(y,m-1,1);
  const start = sunday(first);
  const map = daysOf();
  const DAYS = L().days;
  const SHORT = L().daysShort;
  let html = "<thead><tr>"+DAYS.map((d,i)=>"<th class='"+(i===0||i===6?"wk":"")+"'><span class='dlong'>"+d+"</span><span class='dshort'>"+SHORT[i]+"</span></th>").join("")+"</tr></thead><tbody>";
  for (let w=0;w<6;w++){
    let any=false; let row="";
    for (let i=0;i<7;i++){
      const dt = add(start, w*7+i);
      const key = iso(dt);
      const inM = dt.getMonth()===m-1;
      if (inM) any=true;
      const day = map[key];
      const wknd = i===0||i===6;
      const holy = day && day.note && !serve(day);
      let cls = inM?"":"out";
      if (day && !serve(day)) cls += " closed";
      if (holy) cls += " holy";
      if (key===DATA.today) cls += " today";
      const caption = shortCap(day);
      const sub = day && day.note && serve(day) ? "<div class='holy'>"+esc(day.note)+"</div>" : (holy ? "<div class='holy'>"+esc(statusText(day.status))+"</div>" : "");
      const label = !inM ? "<span class='num' style='opacity:.35'>"+dt.getDate()+"</span>"
        : wknd && !day ? "<span class='num'>"+dt.getDate()+"</span>"
        : "<button data-day='"+key+"'><span class='num'>"+dt.getDate()+"</span><div class='food'>"+esc(caption)+"</div>"+sub+"</button>";
      row += "<td class='"+cls+"'>"+label+"</td>";
    }
    if (any) html += "<tr>"+row+"</tr>";
  }
  html += "</tbody>";
  document.getElementById("cal").innerHTML = html;
}
function paintHits(){
  const box = document.getElementById("hits");
  const q = store.q.trim().toLowerCase();
  if (!q){ box.innerHTML=""; return; }
  const map = daysOf();
  const hits = Object.values(map).filter(d => serve(d) && (d.entree+" "+food(d.entree)+" "+d.second+" "+food(d.second)+" "+d.sides.join(" ")+" "+d.sides.map(food).join(" ")).toLowerCase().includes(q));
  if (!hits.length){ box.innerHTML = "<div class='hits'>"+esc(L().noMatch)+"</div>"; return; }
  box.innerHTML = "<div class='hits'><b>"+esc(L().nextTimes)+" “"+esc(store.q)+"”</b>"+hits.slice(0,12).map(d =>
    "<button data-go='"+d.date+"'>"+fmt(d.date)+" — "+esc(food(d.entree))+"</button>"
  ).join("")+"</div>";
}
function openDay(date){
  const day = daysOf()[date];
  const el = document.getElementById("drawer");
  if (!day){ el.hidden = true; return; }
  store.month = date.slice(0,7);
  const extra = serve(day)
    ? "<p>"+esc(day.second?food(day.second):"")+"</p><p>"+esc(day.sides.map(food).join(" · "))+"</p><p>"+esc(L().milk)+": "+esc(food(day.milk||"1% white milk"))+"</p>"+(day.chef?"<p>"+esc(L().chef)+"</p>":"")+(day.note?"<p class='holy'>"+esc(day.note)+"</p>":"")
    : "<p>"+esc(statusText(day.status))+"</p>";
  el.hidden = false;
  el.innerHTML = "<p class='kicker'>"+fmt(date)+"</p><h3>"+esc(serve(day)?food(day.entree):statusText(day.status))+"</h3>"+extra+"<p>"+esc(L().alts)+"</p><button class='btn primary' id='close'>"+esc(L().close)+"</button>";
  paint();
}
function icsFor(date){
  const day = daysOf()[date];
  if (!day || !serve(day)) return;
  const ymd = date.replace(/-/g,"");
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT","DTSTART;VALUE=DATE:"+ymd,"DTEND;VALUE=DATE:"+ymd,"SUMMARY:"+school().short+" lunch: "+day.entree,"DESCRIPTION:"+DATA.brand.name+" — "+L().lunchFree+" "+(day.sides.join(", ")),"END:VEVENT","END:VCALENDAR"];
  const ics = lines.join("\\n");
  const a=document.createElement("a");
  a.href="data:text/calendar;charset=utf-8,"+encodeURIComponent(ics);
  a.download="lunch-"+date+".ics";
  a.click();
}
function esc(s){
  return String(s||"").replace(/&/g,"\\u0026amp;").replace(/</g,"\\u0026lt;").replace(/>/g,"\\u0026gt;").replace(/"/g,"\\u0026quot;");
}
function paint(){
  applyLang();
  paintLangs();
  const meta = monthMeta();
  document.getElementById("monthTitle").textContent = monthLabel();
  document.getElementById("honor").textContent = [meta.title, meta.honor].filter(Boolean).join(" · ");
  const hol = (DATA.holidays||[]).filter(h => h.date.startsWith(store.month));
  document.getElementById("holidays").innerHTML = hol.map(h => "<span>"+esc(h.date.slice(5).replace("-","/"))+" "+esc(store.lang==="en"?h.note:statusText(h.status))+"</span>").join("");
  paintSchools(); paintMonths(); paintHero(); paintWeek(); paintCal(); paintHits();
}
document.body.addEventListener("click", e => {
  const t = e.target.closest("[data-id],[data-m],[data-day],[data-go],[data-lang],#close,#print,#copy,#ics");
  if (!t) return;
  if (t.id==="print"){ window.print(); return; }
  if (t.id==="copy"){
    const d = todayLunch();
    const text = d && serve(d) ? DATA.brand.name+" "+L().today+": "+food(d.entree)+". "+d.sides.map(food).join(", ")+". "+L().lunchFree : L().noLunch;
    navigator.clipboard.writeText(text);
    return;
  }
  if (t.id==="ics"){ icsFor(DATA.today); return; }
  if (t.id==="close"){ document.getElementById("drawer").hidden = true; return; }
  if (t.dataset.lang){ store.lang = t.dataset.lang; localStorage.setItem("bb-lang", store.lang); paint(); return; }
  if (t.dataset.id){ store.school = t.dataset.id; localStorage.setItem("bb-school", store.school); paint(); return; }
  if (t.dataset.m){ store.month = t.dataset.m; paint(); return; }
  if (t.dataset.day){ openDay(t.dataset.day); return; }
  if (t.dataset.go){ openDay(t.dataset.go); return; }
});
document.getElementById("q").addEventListener("input", e => { store.q = e.target.value; paintHits(); });
paint();
</script>
</body>
</html>`;
}

export function downloadFamilyPage(src: FamilySource) {
  const html = renderFamilyHtml(buildFamilyPayload(src));
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "bearcat-bistro-menu.html";
  a.click();
  URL.revokeObjectURL(a.href);
  return html;
}

export function previewFamilyPage(src: FamilySource) {
  const html = renderFamilyHtml(buildFamilyPayload(src));
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  window.open(URL.createObjectURL(blob), "_blank", "noopener");
  return html;
}

export async function saveFamilyPageToFolder(src: FamilySource) {
  const html = renderFamilyHtml(buildFamilyPayload(src));
  const folder = await loadBackupFolder();
  if (!folder) {
    downloadFamilyPage(src);
    return "downloaded";
  }
  await writeBackupFile(folder, html, "bearcat-bistro-menu.html");
  return "folder";
}
