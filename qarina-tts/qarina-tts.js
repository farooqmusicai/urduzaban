/* ============================================================
   qarina-tts.js — قرینہ کی اپنی اردو آواز
   آپ کے اپنے server سے چلتی ہے: نہ Windows کی محتاجی، نہ Edge کی، نہ کسی API کی۔
   © FarooqStars / MyMandoob — apni awaaz, apna system.

   ٢٥ اگست ٢٠٢٦ — دو انجن، ایک ہی دروازہ:
     nayi  : Piper نیورل آواز (عورت/مرد · 22050 Hz) — neural-worker.mjs میں
     purani: eSpeak (روبوٹ جیسی، مگر فوری اور صرف چند KB)

   نیورل ماڈل 60 MB + تلفظ کا انجن 19 MB = تقریباً 80 MB۔ اِس لیے:
     • اگر browser میں پہلے سے محفوظ ہے → سیدھا نیورل، کوئی انتظار نہیں
     • ورنہ پہلی بار ایک سوال پوچھا جاتا ہے، اور جواب یاد رکھا جاتا ہے
     • «نہیں» کہیں تو eSpeak چلتی رہے گی — کچھ ٹوٹے گا نہیں
   یعنی 60 MB کبھی چپکے سے نہیں اُترتے۔
   ============================================================ */

const BASE = new URL('./', import.meta.url);
const CACHE = 'qarina-neural-v1';
const ASK   = 'qarina-neural-ok';
const VKEY  = 'qarina-voice';
const VOICES = {
  aurat: { model:'neural/piper/female.onnx', cfg:'neural/piper/female.json' },
  mard : { model:'neural/piper/male.onnx',   cfg:'neural/piper/male.json'   },
};
const pick = () => { try{ return VOICES[localStorage.getItem(VKEY)] || VOICES.aurat; }catch{ return VOICES.aurat; } };

let speaking=false, stopped=false;

/* ---------------- talaffuz ki lughat ----------------
   Do jagah se aati hai, dono milti hain:
     1) qarina-tts/talaffuz.json      — bunyadi (repo mein)
     2) api/lexicon.php?action=get    — Farooq ki apni durustiyan (admin se), yehi upar rehti hain
   Har safhe par lagti hai — lughat, tarjuman, qarina, admin. 5 minute cache.        */
const LUG_TTL = 5*60*1000;
let lugVal=null, lugAt=0, lugP=null;
function applyLug(t, m){
  if(!m) return t;
  let s=String(t); const holds=[];
  const esc=/[.*+?^${}()|[\]\\]/g;
  for(const k of Object.keys(m).filter(x=>/\s/.test(x)).sort((a,b)=>b.length-a.length)){
    try{
      const pat=k.trim().split(/\s+/).map(w=>[...w].map(c=>c.replace(esc,'\\$&')+'[\\p{M}]*').join('')).join('[\\s\\p{M}]+');
      s=s.replace(new RegExp(pat,'gu'), ()=>{ holds.push(m[k]); return '\u0001'+(holds.length-1)+'\u0001'; });
    }catch{}
  }
  s=s.replace(/[\p{L}\p{M}]+/gu, w=>{
    const k=w.replace(/[^\p{L}]/gu,'');
    return (k && Object.prototype.hasOwnProperty.call(m,k)) ? m[k] : w;
  });
  return s.replace(/\u0001(\d+)\u0001/g,(_,i)=>holds[+i]);
}
async function lughat(){
  if(lugVal && (Date.now()-lugAt) < LUG_TTL) return lugVal;
  if(lugP) return lugP;
  lugP = (async()=>{
    const out={};
    try{
      const d=await (await fetch(new URL('talaffuz.json', BASE), {cache:'no-cache'})).json();
      for(const k in d) if(k!=='_' && typeof d[k]==='string' && k) out[k]=d[k];
    }catch{}
    try{
      const j=await (await fetch(new URL('../api/lexicon.php?action=get&t='+Date.now(), BASE), {cache:'no-store'})).json();
      const sp=(j&&j.speak)||{};
      for(const k in sp) if(typeof sp[k]==='string' && k) out[k]=sp[k];   /* admin ki durusti hamesha upar */
    }catch{}
    lugVal=out; lugAt=Date.now(); lugP=null; return out;
  })();
  return lugP;
}
/* admin mein kuch mehfooz ho to foran naya talaffuz — intezar nahi */
export function refreshLughat(){ lugVal=null; lugAt=0; lugP=null; return lughat(); }
export async function lughatCount(){ return Object.keys(await lughat()).length; }


/* ---------------- purani awaz: eSpeak (hameshah maujood) ---------------- */
let factoryP=null;
function factory(){
  if(!factoryP) factoryP=import(new URL('espeak-ng.js', BASE).href).then(m=>m.default||m);
  return factoryP;
}
async function espeakWav(text, opts={}){
  const wpm=String(Math.round(opts.wpm||145)), pitch=String(Math.round(opts.pitch||45));
  const E=await factory();
  const esp=await E({ arguments:['-v','ur','-s',wpm,'-p',pitch,'-w','o.wav',text] });
  return esp.FS.readFile('o.wav');
}

/* ---------------- nayi awaz: Piper (neural) ---------------- */
let worker=null, wcfg=null, rpc=0, ready_=null;
const pend=new Map();
function wk(){
  if(worker) return worker;
  worker=new Worker(new URL('neural-worker.mjs', BASE).href,{type:'module'});
  worker.onmessage=e=>{ const m=e.data,p=pend.get(m.id); if(!p)return; pend.delete(m.id);
    m.t==='err'?p.rej(new Error(m.msg)):p.res(m); };
  worker.onerror=e=>{ for(const p of pend.values()) p.rej(new Error('worker: '+(e.message||'?'))); pend.clear(); };
  return worker;
}
const call=(m,tr=[])=>new Promise((res,rej)=>{ const id=++rpc; pend.set(id,{res,rej}); wk().postMessage({...m,id},tr); });

async function cachedBuf(url){
  try{
    const c=await caches.open(CACHE);
    for(const k of await c.keys()) if(k.url.startsWith(url)){ const r=await c.match(k); if(r) return r.arrayBuffer(); }
  }catch{}
  return null;
}
async function fetchAndCache(url){
  const res=await fetch(url); if(!res.ok) throw new Error('model: HTTP '+res.status);
  const buf=await res.arrayBuffer();
  try{ const c=await caches.open(CACHE); await c.put(url,new Response(buf.slice(0))); }catch{}
  return buf;
}
async function neuralReady(){
  if(ready_) return ready_;
  ready_=(async()=>{
    const v=pick();
    const url=new URL(v.model, BASE).href;
    let buf=await cachedBuf(url);
    if(!buf){
      let ok=null; try{ ok=localStorage.getItem(ASK); }catch{}
      if(ok==='no') throw new Error('user ne mana kiya');
      if(ok!=='yes'){
        const q='قرینہ کی اصلی (نیورل) آواز تقریباً 80 MB کی ہے\n(60 MB ماڈل + 19 MB تلفظ کا انجن)۔\n'
              + 'ایک بار اُترے گی، پھر ہمیشہ کے لیے آپ کے browser میں محفوظ رہے گی۔\n\n'
              + 'ابھی اُتاریں؟   (نہیں کہیں گے تو سادہ آواز چلتی رہے گی)';
        const yes = (typeof confirm==='function') ? confirm(q) : false;
        try{ localStorage.setItem(ASK, yes?'yes':'no'); }catch{}
        if(!yes) throw new Error('user ne mana kiya');
      }
      buf=await fetchAndCache(url);
    }
    const c=await (await fetch(new URL(v.cfg, BASE).href,{cache:'force-cache'})).json();
    wcfg={ sr:c.audio.sample_rate, ns:(c.inference?.noise_scale??0.667),
           ls:(c.inference?.length_scale??1.0), nsw:(c.inference?.noise_w??0.8) };
    await call({t:'init', buf, kind:'piper'},[buf]);
    return true;
  })().catch(e=>{ ready_=null; throw e; });
  return ready_;
}

/* ---------------- awaz bajana ---------------- */
let ctx=null, srcs=[];
function actx(){ return ctx || (ctx = new (window.AudioContext||window.webkitAudioContext)()); }
function play(pcm, sr){
  const a=actx(), b=a.createBuffer(1,pcm.length,sr);
  b.getChannelData(0).set(pcm);
  const s=a.createBufferSource(); s.buffer=b; s.connect(a.destination); s.start();
  srcs.push(s);
  return new Promise(r=>{ s.onended=r; });
}
function trim(p,sr){
  const win=Math.round(0.02*sr), n=Math.floor(p.length/win); if(n<2) return p;
  let first=-1,last=-1;
  for(let k=0;k<n;k++){ let s=0; const e=(k+1)*win;
    for(let i=k*win;i<e;i++) s+=p[i]*p[i];
    if(Math.sqrt(s/win)>0.003){ if(first<0)first=k; last=k; } }
  if(first<0) return p;
  return p.subarray(Math.max(0,first*win-Math.round(0.03*sr)),
                    Math.min(p.length,(last+1)*win+Math.round(0.10*sr)));
}

/* ---------------- pehle se tayyar rakho ----------------
   Agar model pehle se browser mein mehfooz hai to safha khulte hi (chupke se,
   alag worker mein) awaz ka انجن tayyar kar lo — taake 🔊 dabate hi bole.
   Agar mehfooz NAHI hai to yahan kuch nahi hota: 80 MB kabhi khud se nahi utarte. */
(function warm(){
  const go=async()=>{
    try{
      const v=pick();
      const url=new URL(v.model, BASE).href;
      const c=await caches.open(CACHE);
      const keys=await c.keys();
      if(!keys.some(k=>k.url.startsWith(url))) return;      // mehfooz nahi — chhoro
      try{ localStorage.setItem(ASK,'yes'); }catch{}        // pehle utar chuka hai
      neuralReady().catch(()=>{});
    }catch{}
  };
  if(typeof requestIdleCallback==='function') requestIdleCallback(go,{timeout:4000});
  else setTimeout(go,1500);
})();

/* ---------------- baahir ka darwaza (wohi purana) ---------------- */
export async function synth(text, opts={}){ return espeakWav(text, opts); }
export function isSpeaking(){ return speaking; }
export function stop(){
  stopped=true; speaking=false;
  for(const s of srcs){ try{ s.stop(); }catch{} } srcs=[];
  try{ if(window.__qtts_audio){ window.__qtts_audio.pause(); window.__qtts_audio=null; } }catch{}
}
export async function ready(){ return true; }          // eSpeak hamesha maujood — safha turant chalta hai

export async function speak(text, opts={}, cb={}){
  if(!text) return;
  stopped=false; speaking=true;
  try{
    /* pehle nayi awaz — agar mumkin ho */
    try{
      await neuralReady();
      const r=await call({t:'phon', segs:[String(text)], lughat: await lughat()});
      const ids=r.ids[0]||[];
      if(ids.length>=3){
        const ls = wcfg.ls * (opts.wpm ? Math.max(0.6, Math.min(1.8, 145/opts.wpm)) : 1);
        const out=await call({t:'say', ids, ns:wcfg.ns, ls, nsw:wcfg.nsw});
        if(!stopped) await play(trim(out.pcm, wcfg.sr), wcfg.sr);
        speaking=false; cb.onend && cb.onend(); return;
      }
    }catch(e){ /* neural na chali to neeche purani chalegi */ }

    /* purani awaz — eSpeak */
    const wav=await espeakWav(applyLug(String(text), lugVal), opts);   /* purani awaz par bhi lughat */
    if(stopped){ speaking=false; return; }
    const url=URL.createObjectURL(new Blob([wav],{type:'audio/wav'}));
    const a=new Audio(url); window.__qtts_audio=a;
    await new Promise(res=>{ a.onended=a.onerror=res; a.play().catch(res); });
    URL.revokeObjectURL(url);
  } finally { speaking=false; cb.onend && cb.onend(); }
}
