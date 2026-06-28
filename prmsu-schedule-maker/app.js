/* =========================================================================
   PRMSU Schedule Maker
   Upload COR (PDF/image) -> extract -> review/edit -> pretty schedule -> JPEG
   No backend. Everything runs in the browser.
   ========================================================================= */

const SEAL_URI = "data:image/jpeg;base64,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"; // embedded at build time (data URI of PRMSU seal)

if (typeof window !== "undefined" && window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

/* ---------- tiny helpers ---------- */
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; };
const esc = s => (s==null?"":String(s)).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const ICO = {
  chevDown:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  chevRight:'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

const PALETTE = [
  {fill:"#E8EAFB",bd:"#4F46E5",tx:"#312E81"},
  {fill:"#F2E7FB",bd:"#9333EA",tx:"#581C87"},
  {fill:"#DCF2EE",bd:"#0D9488",tx:"#134E4A"},
  {fill:"#FBEFDA",bd:"#D97706",tx:"#7C2D12"},
  {fill:"#FBE2E9",bd:"#E11D48",tx:"#881337"},
  {fill:"#E2F3E0",bd:"#16A34A",tx:"#14532D"},
  {fill:"#E0F2FE",bd:"#0284C7",tx:"#075985"},
  {fill:"#FEF9C3",bd:"#CA8A04",tx:"#713F12"},
];

/* =========================================================================
   STEP NAVIGATION
   ========================================================================= */
const STEPS = ["stepUpload","stepProcessing","stepReview","stepResult"];
function show(step){ STEPS.forEach(s=>$(s).classList.toggle("hidden", s!==step)); window.scrollTo({top:0,behavior:"smooth"}); }

/* =========================================================================
   TIME / DAY PARSING
   ========================================================================= */
function parseDays(str){
  const out=[]; const s=(str||"").replace(/[^A-Za-z]/g,"");
  const map={M:"Mon",T:"Tue",W:"Wed",F:"Fri",S:"Sat",U:"Sun"};
  let i=0;
  while(i<s.length){
    if(s.substr(i,2)==="Th"){ out.push("Thu"); i+=2; continue; }
    const c=s[i]; if(map[c]) out.push(map[c]); i++;
  }
  return [...new Set(out)];
}
function daysToCode(arr){
  const m={Mon:"M",Tue:"T",Wed:"W",Thu:"Th",Fri:"F",Sat:"S",Sun:"U"};
  const ord=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return ord.filter(d=>arr.includes(d)).map(d=>m[d]).join("");
}
// "7:30-9 am" / "10:30 am-12 pm" / "1-2 pm" -> {s:"07:30", e:"09:00"}
function parseTimeRange(raw){
  const str=(raw||"").toLowerCase();
  const m=str.match(/(\d{1,2}(?::\d{2})?)\s*(am|pm)?\s*[-–]\s*(\d{1,2}(?::\d{2})?)\s*(am|pm)?/);
  if(!m) return null;
  let [,a,apA,b,apB]=m;
  if(!apB) apB=apA; if(!apA) apA=apB;
  const toMin=(t,ap)=>{ let [h,mm]=t.split(":").map(n=>parseInt(n,10)); if(isNaN(mm))mm=0;
    if(ap==="pm"&&h!==12)h+=12; if(ap==="am"&&h===12)h=0; return h*60+mm; };
  let s=toMin(a,apA), e=toMin(b,apB);
  if(e===0) e=720;            // a class ending at "12" means noon, never midnight (e.g. "10-12 am")
  if(s>e) e+=720;             // end rolled past start within the day (e.g. "11-1" = 11am-1pm)
  if(e-s>720) e-=720;         // guard against impossible >12h span
  const fmt=v=>String(Math.floor(v/60)).padStart(2,"0")+":"+String(v%60).padStart(2,"0");
  return {s:fmt(s), e:fmt(e)};
}
// split "7:30-9 am MW CCIT RM 5" -> {time, days, room}
function splitSchedule(raw){
  const str=(raw||"").trim();
  const tm=str.match(/^\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i);
  if(!tm) return {time:"",days:"",room:str};
  let rest=str.slice(tm[0].length).trim();
  const dm=rest.match(/^((?:Th|[MTWFSU])+)\b/);
  let days="", room=rest;
  if(dm){ days=dm[1]; room=rest.slice(dm[1].length).trim(); }
  return {time:tm[1].trim(), days, room};
}

/* =========================================================================
   PDF EXTRACTION (coordinate-based - accurate)
   ========================================================================= */
async function extractFromPdf(file, onProgress){
  const buf=await file.arrayBuffer();
  const pdf=await pdfjsLib.getDocument({data:buf}).promise;
  const page=await pdf.getPage(1);
  const vp=page.getViewport({scale:1});
  const W=vp.width, H=vp.height;
  const tc=await page.getTextContent();
  const items=tc.items
    .map(it=>({str:it.str, x:it.transform[4], y:H-it.transform[5], fx:it.transform[4]/W}))
    .filter(it=>it.str.trim().length);
  const totalChars=items.reduce((a,it)=>a+it.str.trim().length,0);
  if(totalChars<60){              // scanned PDF, no text layer -> rasterize + OCR
    onProgress&&onProgress(0.05,"Scanned PDF - running OCR…");
    const scale=2.2;
    const v2=page.getViewport({scale});
    const cv=document.createElement("canvas"); cv.width=v2.width; cv.height=v2.height;
    await page.render({canvasContext:cv.getContext("2d"),viewport:v2}).promise;
    const text=await ocrCanvas(cv,onProgress);
    return parseFromText(text);
  }
  return parseFromItems(items);
}

function parseFromItems(items){
  items.sort((a,b)=> a.y-b.y || a.x-b.x);
  // cluster into rows by y
  const rows=[]; let cur=null;
  for(const it of items){
    if(!cur || Math.abs(it.y-cur.y)>3.5){ cur={y:it.y,cells:[]}; rows.push(cur); }
    cur.cells.push(it);
  }
  // column by x-fraction (tuned to the PRMSU COR template).
  // boundaries sit in the gaps between columns so wide cells (long subject
  // codes like "CS ELEC 1", long descriptions like "...Health and") don't bleed.
  const colOf=fx=> fx<0.205?"code": fx<0.445?"desc": fx<0.487?"units": fx<0.515?"tf": fx<0.74?"sched": fx<0.835?"instr":"section";

  // header fields (search anywhere). pdf.js may split "Course/ Yr" and append
  // "Period:" onto the name line, so the patterns stop at the next label.
  const all=rows.map(r=>r.cells.map(c=>c.str).join(" ")).join("\n");
  const field=re=>{ const m=all.match(re); return m?m[1].trim():""; };
  const student={
    name:    field(/Name:\s*(.+?)(?:\s+Period:|\s+ID\b|\n|$)/i),
    id:      field(/ID\s*No\.?:?\s*([0-9\-]+)/i),
    course:  field(/Course\s*\/?\s*Yr\.?\s*:?\s*([A-Z]{2,6}\s*\d+[A-Z]?)/i),
    period:  (field(/Period:\s*(.+?)(?:\s+Date:|\n|$)/i)||"").replace(/\/\s+/,"/").replace(/\s+/g," "),
    date:    field(/Date:\s*([A-Za-z]+\s+\d{1,2},?\s*\d{4})/i),
    section: ""
  };

  // walk the subject table
  const subjects=[]; let sub=null; let inTable=false;
  const pullSection=s=>{ const m=(s||"").match(/([A-Z]{2,6}\s*\d[A-Z])\s*$/); return m?m[1].replace(/\s+/g," "):""; };
  const cleanInstr=s=>{ s=(s||"").trim(); const m=s.match(/^(.*?)\s*[A-Z]{2,6}\s*\d[A-Z]\s*$/); return (m&&m[1])?m[1].trim():s; };
  const stripLab=s=>(s||"").replace(/^\s*\d\.\d\s*/,"").trim();

  for(const r of rows){
    const line=r.cells.map(c=>c.str).join(" ");
    if(/Subject\s+Description/i.test(line) || /Units.*Schedule/i.test(line)){ inTable=true; continue; }
    if(/Total\s+Units/i.test(line)) break;
    if(!inTable) continue;

    const C={code:"",desc:"",units:"",tf:"",sched:"",instr:"",section:""};
    r.cells.sort((a,b)=>a.x-b.x).forEach(c=>{ const k=colOf(c.fx); C[k]=(C[k]?C[k]+" ":"")+c.str.trim(); });

    const isNew=/^A?\s?\d{2,4}\b/.test(C.code.trim());
    if(isNew){
      const parts=C.code.trim().split(/\s+/);
      const reg=parts.shift();
      sub={ reg, subjectCode:parts.join(" "), name:C.desc.trim(), units:(C.units||"").trim(),
            section:pullSection(C.section)||pullSection(C.instr), mainInstr:cleanInstr(C.instr), sessions:[] };
      subjects.push(sub);
      if(!student.section && sub.section) student.section=sub.section;
      const sc=stripLab(C.sched);
      if(sc) sub.sessions.push({raw:sc, instr:cleanInstr(C.instr)});
    } else if(sub){
      if(C.desc) sub.name=(sub.name+" "+C.desc.trim()).trim();
      const sc=stripLab(C.sched);
      if(sc){
        if(parseTimeRange(sc)){                          // a real time range -> another session
          sub.sessions.push({raw:sc, instr:cleanInstr(C.instr)});
        } else if(sub.sessions.length){                  // bare room fragment (wrapped number/word) -> merge into prior room
          sub.sessions[sub.sessions.length-1].raw+=" "+sc;
        }
      }
      if(!sub.section){ const s=pullSection(C.section)||pullSection(C.instr); if(s) sub.section=s; }
    }
  }
  return toData(student, subjects);
}

/* =========================================================================
   OCR (Tesseract) - fallback for images / scanned PDFs
   ========================================================================= */
async function ocrCanvas(canvas, onProgress){
  const {data}=await Tesseract.recognize(canvas,"eng",{
    logger:m=>{ if(m.status==="recognizing text") onProgress&&onProgress(0.1+m.progress*0.85,"Reading text… "+Math.round(m.progress*100)+"%"); }
  });
  return data.text;
}
async function extractFromImage(file,onProgress){
  const url=URL.createObjectURL(file);
  const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url;});
  const cv=document.createElement("canvas");
  const scale=Math.min(2200/img.width,2.5)||1.5;
  cv.width=img.width*scale; cv.height=img.height*scale;
  cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
  URL.revokeObjectURL(url);
  const text=await ocrCanvas(cv,onProgress);
  return parseFromText(text);
}
// loose line-parser for OCR text (less reliable than the PDF coordinate path)
function parseFromText(text){
  const field=re=>{ const m=text.match(re); return m?m[1].trim():""; };
  const student={
    name:field(/Name:?\s*([^\n]+)/i), id:field(/ID\s*No\.?:?\s*([0-9\-]+)/i),
    course:field(/Course\/?Yr\.?:?\s*([A-Za-z0-9 ]+)/i), period:field(/Period:?\s*([^\n]+)/i),
    date:field(/Date:?\s*([A-Za-z0-9, ]+)/i), section:field(/([A-Z]{2,6}\s*\d[A-Z])/)
  };
  const subjects=[]; let sub=null;
  const lines=text.split("\n").map(l=>l.replace(/\s+/g," ").trim()).filter(Boolean);
  const schedRe=/\d{1,2}(?::\d{2})?\s*(?:am|pm)?\s*[-–]\s*\d{1,2}(?::\d{2})?\s*(?:am|pm)/i;
  for(const line of lines){
    if(/total units/i.test(line)) break;
    const codeM=line.match(/^(A?\d{2,4})\s+([A-Z]{2,4}(?:\s*[A-Z]*)?\s*\d+[A-Z]?)\s+(.*)$/);
    if(codeM){
      sub={reg:codeM[1],subjectCode:codeM[2].trim(),name:"",units:"",section:student.section,sessions:[]};
      let rest=codeM[3];
      const um=rest.match(/(\d\.\d)\s+\d\.\d\s+\d\.\d/); if(um) sub.units=um[1];
      const sm=rest.match(schedRe); sub.name=(um?rest.slice(0,um.index):rest).trim();
      const sIdx=rest.search(schedRe);
      if(sIdx>=0) sub.sessions.push({raw:rest.slice(sIdx).trim(),instr:""});
      subjects.push(sub);
    } else if(sub && schedRe.test(line)){
      const sIdx=line.search(schedRe);
      sub.sessions.push({raw:line.slice(sIdx).trim(),instr:""});
    }
  }
  return toData(student, subjects);
}

/* =========================================================================
   NORMALISE -> flat class list used by the form + renderer
   ========================================================================= */
function toData(student, subjects){
  const classes=[];
  subjects.forEach(sub=>{
    const subInstr=(sub.sessions.find(s=>s.instr)||{}).instr || sub.mainInstr || "";
    const multi=sub.sessions.length>1;
    sub.sessions.forEach((se,si)=>{
      const parts=splitSchedule(se.raw);
      const tr=parseTimeRange(parts.time)||{s:"",e:""};
      const room=(parts.room||"").replace(/\s+/g," ").trim();
      // "LAB" as a whole word means laboratory; for a 2-session subject the
      // code row is the lecture and the wrapped continuation row is the lab.
      const kind=/\bLAB(ORATORY)?\b/i.test(room) ? "Lab" : (multi ? (si===0?"Lec":"Lab") : "Lec");
      classes.push({
        name:sub.name.replace(/\s+/g," ").replace(/([A-Za-z])-\s+(?=[A-Za-z])/g,"$1-").trim(),
        code:sub.subjectCode.trim(),
        units:sub.units||"",
        days:daysToCode(parseDays(parts.days)),
        start:to12(tr.s), end:to12(tr.e),
        room, kind,
        prof:(se.instr||subInstr||"").trim() || "To be assigned"
      });
    });
  });
  return {student, classes};
}
function to12(hhmm){
  if(!hhmm) return "";
  let [h,m]=hhmm.split(":").map(n=>parseInt(n,10));
  const ap=h<12?"AM":"PM"; const h12=(h%12)||12;
  return h12+":"+String(m).padStart(2,"0")+" "+ap;
}
function to24(t){
  if(!t) return null;
  const m=t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if(!m) return null;
  let h=parseInt(m[1],10), mm=m[2]?parseInt(m[2],10):0; const ap=(m[3]||"").toLowerCase();
  if(ap==="pm"&&h!==12)h+=12; if(ap==="am"&&h===12)h=0;
  return h*60+mm;
}

/* =========================================================================
   REVIEW FORM
   ========================================================================= */
function fillReview(data){
  const s=data.student||{};
  $("f_name").value=s.name||""; $("f_id").value=s.id||"";
  $("f_course").value=s.course||""; $("f_section").value=s.section||"";
  $("f_period").value=s.period||""; $("f_date").value=s.date||"";
  const body=$("editBody"); body.innerHTML="";
  (data.classes||[]).forEach(c=>body.appendChild(rowEl(c)));
  if(!data.classes||!data.classes.length) body.appendChild(rowEl({}));
}
// dropdown option sets for the review form
const TIME_OPTS = (function(){
  let o="";
  for(let m=6*60; m<=21*60; m+=30){
    const hh=String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
    o+=`<option>${to12(hh)}</option>`;
  }
  return o;
})();
const DAY_OPTS = [
  ["MW","MW · Mon & Wed"],["TTh","TTh · Tue & Thu"],["MWF","MWF · Mon Wed Fri"],
  ["TThS","TThS · Tue Thu Sat"],["MTWThF","Daily · Mon to Fri"],
  ["M","Mon"],["T","Tue"],["W","Wed"],["Th","Thu"],["F","Fri"],["S","Sat"],["U","Sun"]
];
// set a <select> to a value, adding the value as an option first if it isn't listed
function setSelect(sel,val){
  if(val && ![...sel.options].some(o=>o.value===val)){
    const o=document.createElement("option"); o.value=val; o.textContent=val; sel.appendChild(o);
  }
  sel.value=val||"";
}
function rowEl(c){
  const tr=document.createElement("tr");
  const inp=(cls,val,ph)=>`<input class="${cls}" value="${esc(val||"")}" placeholder="${ph||""}">`;
  const dayOpts='<option value="">-</option>'+DAY_OPTS.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
  const timeOpts='<option value="">-</option>'+TIME_OPTS;
  tr.innerHTML=
    `<td>${inp("w-sub c-name",c.name,"Subject")}</td>`+
    `<td>${inp("w-code c-code",c.code,"MTN 4")}</td>`+
    `<td>${inp("w-u c-units",c.units,"3.0")}</td>`+
    `<td><select class="w-day c-days">${dayOpts}</select></td>`+
    `<td><select class="w-t c-start">${timeOpts}</select></td>`+
    `<td><select class="w-t c-end">${timeOpts}</select></td>`+
    `<td>${inp("w-room c-room",c.room,"CCIT RM 5")}</td>`+
    `<td><select class="c-kind"><option value="">-</option><option>Lec</option><option>Lab</option></select></td>`+
    `<td>${inp("c-prof",c.prof,"Instructor")}</td>`+
    `<td><button class="del" title="Remove">${ICO.x}</button></td>`;
  setSelect(tr.querySelector(".c-days"), c.days);
  setSelect(tr.querySelector(".c-start"), c.start);
  setSelect(tr.querySelector(".c-end"), c.end);
  tr.querySelector(".c-kind").value=c.kind||"";
  tr.querySelector(".del").onclick=()=>tr.remove();
  return tr;
}
function collectReview(){
  const student={
    name:$("f_name").value.trim(), id:$("f_id").value.trim(),
    course:$("f_course").value.trim(), section:$("f_section").value.trim(),
    period:$("f_period").value.trim(), date:$("f_date").value.trim()
  };
  const classes=[...$("editBody").querySelectorAll("tr")].map(tr=>({
    name:tr.querySelector(".c-name").value.trim(),
    code:tr.querySelector(".c-code").value.trim(),
    units:tr.querySelector(".c-units").value.trim(),
    days:tr.querySelector(".c-days").value.trim(),
    start:tr.querySelector(".c-start").value.trim(),
    end:tr.querySelector(".c-end").value.trim(),
    room:tr.querySelector(".c-room").value.trim(),
    kind:tr.querySelector(".c-kind").value,
    prof:tr.querySelector(".c-prof").value.trim()
  })).filter(c=>c.name||c.code);
  return {student,classes};
}

/* =========================================================================
   RENDER THE SCHEDULE CARD
   ========================================================================= */
function renderSchedule(data){
  const PXH=64;
  // unique subjects (by code+name) -> color + legend
  const subjMap=new Map();
  data.classes.forEach(c=>{
    const key=(c.code||c.name);
    if(!subjMap.has(key)) subjMap.set(key,{code:c.code,name:c.name,units:c.units,prof:c.prof,sessions:[]});
    subjMap.get(key).sessions.push(c);
  });
  const subs=[...subjMap.values()];
  subs.forEach((s,i)=>s.color=PALETTE[i%PALETTE.length]);
  const colorOf=key=>subs.find(s=>(s.code||s.name)===key).color;

  // sessions with parsed minutes
  const evs=[];
  data.classes.forEach(c=>{
    const s=to24(c.start), e=to24(c.end); if(s==null||e==null) return;
    parseDays(c.days).forEach(d=>evs.push({day:d,s,e,c}));
  });

  // time bounds
  let minS=7*60, maxE=17.5*60;
  if(evs.length){ minS=Math.min(...evs.map(x=>x.s)); maxE=Math.max(...evs.map(x=>x.e)); }
  const START=Math.floor(minS/60)*60, END=Math.ceil(maxE/60)*60;
  const totalH=(END-START)/60*PXH;
  const top=v=>(v-START)/60*PXH, dur=(a,b)=>(b-a)/60*PXH;

  // day columns: Mon–Fri always, + Sat/Sun if used
  const order=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const used=new Set(evs.map(x=>x.day));
  const days=order.filter(d=>["Mon","Tue","Wed","Thu","Fri"].includes(d)||used.has(d));
  const long={Mon:"Monday",Tue:"Tuesday",Wed:"Wednesday",Thu:"Thursday",Fri:"Friday",Sat:"Saturday",Sun:"Sunday"};
  // FIXED-PX columns (not 1fr): html2canvas mis-distributes fr units and balloons
  // the last column, so we size every day column explicitly for a faithful export.
  const TIMEW=54, DAYW=124;
  const gridW=TIMEW+days.length*DAYW;
  const gridCols=`${TIMEW}px repeat(${days.length},${DAYW}px)`;

  // stats
  const totalUnits=subs.reduce((a,s)=>a+(parseFloat(s.units)||0),0);
  const classDays=days.filter(d=>used.has(d));
  const freeDays=["Mon","Tue","Wed","Thu","Fri"].filter(d=>!used.has(d));
  const span=a=> a.length? (a.length>1? a[0].slice(0,3)+"–"+a[a.length-1].slice(0,3) : a[0]) : "-";

  const h12=h=>(h%12)||12, ampm=h=>h<12?"AM":"PM";
  const clk=v=>{const h=Math.floor(v/60),m=v%60;return h12(h)+":"+String(m).padStart(2,"0");};
  const shortRoom=r=>(r||"").replace(/^CCIT\s+/i,"");

  // header time labels
  let labels="";
  for(let h=START/60;h<=END/60;h++){ const y=(h-START/60)*PXH; labels+=`<div class="sc-tl" style="top:${y-(h===START/60?0:6)}px">${h12(h)} ${ampm(h)}</div>`; }

  // grid header
  let ghead=`<div></div>`;
  days.forEach(d=>{ const free=!used.has(d); ghead+=`<div class="sc-dh${free?' free':''}">${d}<small>${free?'free':long[d].slice(0,3)}</small></div>`; });

  // columns
  let gbody=`<div class="sc-time" style="height:${totalH}px">${labels}</div>`;
  days.forEach(d=>{
    const free=!used.has(d);
    let col=`<div class="sc-col${free?' free':''}" style="height:${totalH}px">`;
    if(free) col+=`<div class="sc-freenote">No classes</div>`;
    evs.filter(x=>x.day===d).forEach(x=>{
      const col2=colorOf(x.c.code||x.c.name);
      col+=`<div class="ev" style="top:${top(x.s)}px;height:${dur(x.s,x.e)}px;background:${col2.fill};border-left-color:${col2.bd};color:${col2.tx}">`+
           `<div class="ev-t">${esc(x.c.name)}</div>`+
           `<div class="ev-m">${clk(x.s)}–${clk(x.e)}${x.c.room?" · "+esc(shortRoom(x.c.room)):""}</div></div>`;
    });
    col+=`</div>`; gbody+=col;
  });

  // legend
  let leg="";
  subs.forEach(s=>{
    let lines="";
    s.sessions.forEach(se=>{
      const dcode=se.days||daysToCode(parseDays(se.days));
      const tag=se.kind
        ? `<span class="lc-tag" style="background:${s.color.bd}">${esc(se.kind)}</span>`
        : `<span class="lc-tag" style="background:#94A2B8">${esc(dcode||"-")}</span>`;
      const dtxt=se.kind?esc(dcode)+" · ":"";
      const time=(se.start&&se.end)?esc(se.start)+"–"+esc(se.end):"";
      lines+=`<div class="lc-line">${tag}<span>${dtxt}${time}${se.room?" · "+esc(shortRoom(se.room)):""}</span></div>`;
    });
    const prof=(!s.prof||/to be/i.test(s.prof))?"<em>To be assigned</em>":esc(s.prof);
    leg+=`<div class="lc"><div class="lc-top"><span class="lc-dot" style="background:${s.color.bd}"></span>`+
         `<span class="lc-code">${esc(s.code||"-")}</span>`+(s.units?`<span class="lc-u">${esc(s.units)} units</span>`:"")+`</div>`+
         `<div class="lc-name">${esc(s.name)}</div><div class="lc-prof">${prof}</div>${lines}</div>`;
  });

  const st=data.student||{};
  const card=el("div","sc-card");
  card.id="scheduleCard";
  card.innerHTML=`
    <div class="sc-rail"></div>
    <header class="sc-head">
      <div class="sc-head-top">
        <img class="sc-logo" src="${SEAL_URI}" alt="PRMSU seal">
        <div>
          <p class="sc-eyebrow">President Ramon Magsaysay State University</p>
          <h1 class="sc-title">Weekly Class Schedule</h1>
          <p class="sc-sub">${esc(st.period||"")}</p>
        </div>
      </div>
      <div class="sc-info">
        <div><div class="k">Name</div><div class="v">${esc(st.name||"-")}</div></div>
        <div><div class="k">Student No.</div><div class="v">${esc(st.id||"-")}</div></div>
        <div><div class="k">Course &amp; Year</div><div class="v">${esc(st.course||"-")}</div></div>
        <div><div class="k">Section</div><div class="v">${esc(st.section||"-")}</div></div>
      </div>
    </header>

    <div class="sc-stats">
      <div class="sc-stat"><div class="n">${subs.length}</div><div class="l">Subjects</div></div>
      <div class="sc-stat"><div class="n">${totalUnits% 1? totalUnits.toFixed(1):totalUnits}</div><div class="l">Total units</div></div>
      <div class="sc-stat"><div class="n">${span(classDays)}</div><div class="l">Class days</div></div>
      <div class="sc-stat"><div class="n">${freeDays.length?span(freeDays):"-"}</div><div class="l">Free day</div></div>
    </div>

    <div class="sc-body">
      <div class="sc-scroll"><div class="sc-grid" style="width:${gridW}px;min-width:${gridW}px">
        <div class="sc-ghead" style="grid-template-columns:${gridCols}">${ghead}</div>
        <div class="sc-gbody" style="grid-template-columns:${gridCols}">${gbody}</div>
      </div></div>
      <p class="sc-cap">Times are positioned to scale. On a phone, swipe sideways to see the full week.</p>
    </div>

    <div class="sc-leg" id="legSection">
      <div class="sc-leg-head">
        <h2>Subjects &amp; Details</h2>
        <button class="sc-toggle" id="legToggle" type="button">${ICO.chevDown} Hide</button>
      </div>
      <div class="sc-leggrid">${leg}</div>
    </div>

    <div class="sc-foot">Generated with PRMSU Schedule Maker${st.date?" · COR dated "+esc(st.date):""}</div>`;

  const host=$("cardHost"); host.innerHTML=""; host.appendChild(card);
  card.style.maxWidth=(gridW+48)+"px";   // hug the timetable on desktop; full-width + scroll on mobile
  card.style.margin="0 auto";
  card.dataset.gridw=gridW;              // used by the JPEG export to expand to full width

  // toggle for the Subjects & Details section
  const sec=card.querySelector("#legSection"), tgl=card.querySelector("#legToggle");
  tgl.onclick=()=>{
    const collapsed=sec.classList.toggle("collapsed");
    tgl.innerHTML=collapsed?ICO.chevRight+" Show":ICO.chevDown+" Hide";
  };
}

/* =========================================================================
   EXPORT JPEG
   ========================================================================= */
function fileName(){
  const who=($("f_name").value.trim().split(",")[0]||"schedule").replace(/[^A-Za-z0-9]+/g,"-");
  return `PRMSU-Schedule-${who}.jpg`;
}
// Render the card to a full-width canvas. Expands to desktop width FIRST so the
// whole week is captured even on a phone (grid is normally scrolled/clipped).
function captureCard(){
  return new Promise((resolve,reject)=>{
    const card=$("scheduleCard"); if(!card){ reject(new Error("No schedule yet")); return; }
    const scroll=card.querySelector(".sc-scroll");
    const fullW=(parseInt(card.dataset.gridw,10)||680)+48;
    const saved=[];
    const tweak=(el,prop,val)=>{ saved.push([el,prop,el.style[prop]]); el.style[prop]=val; };
    tweak(card,"maxWidth","none"); tweak(card,"width",fullW+"px");
    if(scroll) tweak(scroll,"overflow","visible");
    const restore=()=>saved.forEach(([el,prop,val])=>el.style[prop]=val);
    html2canvas(card,{scale:3,backgroundColor:"#ffffff",useCORS:true,windowWidth:Math.max(820,fullW+40)})
      .then(canvas=>{ restore(); resolve(canvas); })
      .catch(e=>{ restore(); reject(e); });
  });
}
const canvasToBlob=canvas=>new Promise(res=>canvas.toBlob(res,"image/jpeg",0.95));

function saveJPEG(btn){
  const label=btn.innerHTML; btn.textContent="Saving…"; btn.disabled=true;
  captureCard().then(canvas=>{
    const a=document.createElement("a");
    a.download=fileName(); a.href=canvas.toDataURL("image/jpeg",0.95); a.click();
    btn.innerHTML=label; btn.disabled=false;
  }).catch(err=>{ alert("Couldn't save: "+err); btn.innerHTML=label; btn.disabled=false; });
}

function shareSchedule(btn){
  const label=btn.innerHTML; btn.textContent="Preparing…"; btn.disabled=true;
  captureCard().then(canvasToBlob).then(blob=>{
    const file=new File([blob], fileName(), {type:"image/jpeg"});
    const data={ files:[file], title:"My PRMSU Class Schedule", text:"My weekly class schedule" };
    if(navigator.canShare && navigator.canShare({files:[file]})){
      return navigator.share(data).catch(()=>{});   // user cancelling the sheet is fine
    }
    // fallback: save the image so it can be shared from the gallery/downloads
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.download=fileName(); a.href=url; a.click();
    URL.revokeObjectURL(url);
    alert("Direct sharing isn't supported on this browser, so the image was saved to your device. You can share it from your photos or downloads.");
  }).catch(err=>{ alert("Couldn't prepare the image: "+err); })
    .finally(()=>{ btn.innerHTML=label; btn.disabled=false; });
}

/* =========================================================================
   SAMPLE DATA (Carlos's COR - guarantees a perfect demo)
   ========================================================================= */
const SAMPLE={
  student:{name:"QUITANEG JR., CARLOS LABORCE",id:"25-1-1-1561",course:"BSCS 2",section:"BSCS 2A",period:"2026-2027 / First Semester",date:"June 22, 2026"},
  classes:[
    {name:"Calculus I",code:"MTN 4",units:"3.0",days:"MW",start:"7:30 AM",end:"9:00 AM",room:"CCIT RM 5",kind:"",prof:"May Ann A. Acera"},
    {name:"Discrete Structures II",code:"DS 102",units:"3.0",days:"TTh",start:"12:30 PM",end:"2:00 PM",room:"CCIT MULTI",kind:"",prof:"Menchie A. Dela Cruz"},
    {name:"Object-Oriented Programming",code:"SDF 104",units:"3.0",days:"TTh",start:"10:30 AM",end:"12:00 PM",room:"CCIT LAB 5",kind:"Lab",prof:"Jason S. Artates"},
    {name:"Object-Oriented Programming",code:"SDF 104",units:"3.0",days:"TTh",start:"2:00 PM",end:"3:00 PM",room:"CCIT RM 4",kind:"Lec",prof:"Jason S. Artates"},
    {name:"Data Structures and Algorithms",code:"CC 104",units:"3.0",days:"MW",start:"10:30 AM",end:"12:00 PM",room:"CCIT LAB 5",kind:"Lab",prof:"Daniel A. Bachillar"},
    {name:"Data Structures and Algorithms",code:"CC 104",units:"3.0",days:"MW",start:"1:00 PM",end:"2:00 PM",room:"CCIT RM 5",kind:"Lec",prof:"Daniel A. Bachillar"},
    {name:"CS Elective 1",code:"CS ELEC 1",units:"3.0",days:"MW",start:"4:00 PM",end:"5:00 PM",room:"CCIT RM 4",kind:"Lec",prof:"To be assigned"},
    {name:"CS Elective 1",code:"CS ELEC 1",units:"3.0",days:"TTh",start:"3:30 PM",end:"5:00 PM",room:"CCIT LAB 9",kind:"Lab",prof:"To be assigned"},
    {name:"PATHFit 3: Dance",code:"PE 301C",units:"2.0",days:"MW",start:"9:30 AM",end:"10:30 AM",room:"GYM 01",kind:"",prof:"Teacher A.2"}
  ]
};

/* =========================================================================
   WIRING
   ========================================================================= */
async function handleFile(file){
  if(!file) return;
  const isPdf = file.type==="application/pdf" || /\.pdf$/i.test(file.name);
  if(!isPdf){
    alert("Please upload your COR as a PDF file.\n\nDownload it from the PRMSU student portal and upload that PDF here.");
    return;
  }
  show("stepProcessing");
  const setP=(p,t)=>{ $("barFill").style.width=Math.round((p||0)*100)+"%"; if(t)$("procSub").textContent=t; };
  setP(0.02,"Opening file…");
  try{
    $("procText").textContent="Reading your COR (PDF)…";
    const data=await extractFromPdf(file,setP);
    setP(1,"Done");
    fillReview(data);
    show("stepReview");
  }catch(err){
    console.error(err);
    alert("Sorry, couldn't read that file: "+err.message+"\n\nYou can still fill the details in manually.");
    fillReview({student:{},classes:[]});
    show("stepReview");
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded",()=>{
    $("navSeal").src=SEAL_URI;

    const drop=$("drop"), file=$("file"), agree=$("agree");
    const syncAgree=()=>drop.classList.toggle("disabled", !agree.checked);
    const flashAgree=()=>{ const b=$("agreeBox"); b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash"); };
    const gateOK=()=>{ if(agree.checked) return true; flashAgree(); return false; };
    agree.addEventListener("change", syncAgree); syncAgree();

    drop.onclick=e=>{ if(e.target.id==="browseBtn") return; if(!gateOK()) return; file.click(); };
    $("browseBtn").onclick=e=>{ e.stopPropagation(); if(!gateOK()) return; file.click(); };
    file.onchange=()=>handleFile(file.files[0]);
    ["dragenter","dragover"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add("over");}));
    ["dragleave","drop"].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove("over");}));
    drop.addEventListener("drop",e=>{ if(!gateOK()) return; const f=e.dataTransfer.files[0]; if(f) handleFile(f); });

    const sb=$("sampleBtn"); if(sb) sb.onclick=()=>{ fillReview(JSON.parse(JSON.stringify(SAMPLE))); show("stepReview"); };
    $("addRow").onclick=()=>$("editBody").appendChild(rowEl({}));
    $("backUpload").onclick=()=>show("stepUpload");
    $("backReview").onclick=()=>show("stepReview");
    $("generateBtn").onclick=()=>{ renderSchedule(collectReview()); show("stepResult"); };
    $("saveBtn").onclick=function(){ saveJPEG(this); };
    $("shareBtn").onclick=function(){ shareSchedule(this); };
  });
}

// Exposed for Node-based unit tests (no effect in the browser)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { parseFromItems, parseFromText, splitSchedule, parseTimeRange, parseDays, daysToCode, to12, to24, toData, SAMPLE };
}
