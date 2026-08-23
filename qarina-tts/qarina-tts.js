/* ============================================================
   qarina-tts.js — قرینہ کی اپنی اردو آواز
   espeak-ng (WASM) — آپ کے اپنے server سے چلتی ہے:
   نہ Windows کی محتاجی، نہ Edge کی، نہ کسی API کی۔
   فائلیں: espeak-ng.js + espeak-ng.wasm اسی فولڈر میں۔
   © FarooqStars / MyMandoob — apni awaaz, apna system.
   ============================================================ */
let factoryP=null, cur=null, stopped=false, speaking=false;

function factory(){
  if(!factoryP){
    factoryP=import(new URL('./espeak-ng.js', import.meta.url).href).then(m=>m.default||m);
  }
  return factoryP;
}

/* ایک ٹکڑا → WAV bytes */
export async function synth(text, opts={}){
  const wpm=String(Math.round(opts.wpm||145)), pitch=String(Math.round(opts.pitch||45));
  const E=await factory();
  const esp=await E({ arguments:['-v','ur','-s',wpm,'-p',pitch,'-w','o.wav',text] });
  return esp.FS.readFile('o.wav');
}

/* لمبے متن کو جملوں میں توڑ کر باری باری بولیے */
function chunks(text){
  const parts=[]; let buf='';
  String(text).split(/(?<=[۔؟!\n])/).forEach(s=>{
    if((buf+s).length>320){ if(buf.trim())parts.push(buf); buf=s; } else buf+=s;
  });
  if(buf.trim())parts.push(buf);
  return parts.length?parts:[String(text)];
}

export function isSpeaking(){ return speaking; }

export async function speak(text, opts={}, cb={}){
  stop(); stopped=false; speaking=true;
  try{
    for(const p of chunks(text)){
      if(stopped) break;
      const wav=await synth(p, opts);
      if(stopped) break;
      const url=URL.createObjectURL(new Blob([wav],{type:'audio/wav'}));
      await new Promise((res)=>{
        cur=new Audio(url);
        cur.onplay=()=>{ if(cb.onstart) cb.onstart(); try{window.__qtts_played=true;}catch(e){} };
        cur.onended=()=>{ URL.revokeObjectURL(url); res(); };
        cur.onerror=()=>{ URL.revokeObjectURL(url); res(); };
        cur.play().catch(()=>res());
      });
    }
  } finally {
    speaking=false; cur=null;
    if(cb.onend) cb.onend();
  }
}

export function stop(){
  stopped=true; speaking=false;
  if(cur){ try{ cur.pause(); }catch(e){} cur=null; }
}

/* انجن تیار ہے؟ (فائلیں مل گئیں اور WASM چل پڑا) */
export async function ready(){
  try{ await factory(); return true; }catch(e){ return false; }
}
