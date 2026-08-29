// Piper (eSpeak) phonemizer — CI aur browser, dono jagah BILKUL ek jaisa.
//
// Kyun: Piper ke VITS models raw huroof nahi lete — woh eSpeak-ng ke IPA
// phonemes lete hain. urduzaban repo mein espeak-ng.js + espeak-ng.wasm
// pehle se maujood hain (18.5 MB), aur us mein Urdu ("ur") ki poori
// support hai — yahan yehi istemal hota hai, taake CI mein banaya gaya
// sample aur browser ki awaz hu-ba-hu ek jaisi ho.
//
// Tareeqa (piper-phonemize/src/phonemize.cpp ke mutabiq):
//   1) matn ko clause (viraam) ke hisaab se toro, viraam alag rakho
//   2) har clause ko eSpeak se IPA banwao  (-q --ipa -v ur)
//   3) NFD (decompose) — "ç" -> "c" + combining cedilla
//   4) har code point -> id  (phoneme_ids.json)
//   5) shuru mein ^ , har phoneme ke baad _ , aakhir mein $
//
// eSpeak har clause ka jawab alag line mein deta hai — is liye saare clause
// ek hi baar mein bheje jaate hain (18.5 MB wasm baar baar load na ho).

const PUNCT = { '۔':'.', '؟':'?', '،':',', '؛':';', '٪':'%',
                '.':'.', '?':'?', '!':'!', ',':',', ';':';', ':':':' };
const CLAUSE_RE = /[۔؟،؛.?!,;:]/;

export function splitClauses(text){
  // -> [{t:'...', p:'.'|''} ...]   p = us clause ke aakhir ka viraam
  const out=[]; let buf='';
  for(const ch of text){
    if(PUNCT[ch] && CLAUSE_RE.test(ch)){
      if(buf.trim()) out.push({t:buf.trim(), p:PUNCT[ch]});
      else if(out.length) out[out.length-1].p = PUNCT[ch];
      buf='';
    } else buf += ch;
  }
  if(buf.trim()) out.push({t:buf.trim(), p:''});
  return out;
}


/* ---------- Urdu ke aeraab: kya rakhna hai, kya girana hai ----------
   NAAPA HUA (eSpeak-ng 1.52 ki Urdu lugat par):
     kitaab  کِتَاب  ->  aeraab ke saath "ki-ta-AAB"  (ghalat)
                          zabar hata kar     "kitaab"  (theek)
     mohabbat مُحَبَّت -> "mo-ha-BAAT" (ghalat) -> "mohabbat" (theek)
   Yani: zabar/zer/pesh jab LAMBI awaz (ا و ی ے) se pehle aayen, ya
   tashdeed se pehle aayen, to eSpeak do awazein bana deta hai.
   Baqi jagah aeraab MADAD karte hain:
     دَم -> dam (theek) jabke bila-aeraab دم -> dʌm
     پھِر -> pʰɪr (theek) jabke بلا اعراب پھر -> p+h alag
   Is liye sab aeraab girana bhi ghalat hai, sab rakhna bhi. Sirf yeh do
   surtein giraayi jaati hain. Matn aap ka jaisa hai waisa hi rehta hai -
   yeh safai sirf awaz banate waqt hoti hai.                            */
const MARK   = /[\u064B-\u0652\u0654-\u0655\u0670\u0653\u0656-\u065F]/;
const SHADDA = '\u0651', SUKOON = '\u0652', TATWEEL = '\u0640';
const LONG   = '\u0627\u0622\u0648\u06C7\u06CC\u064A\u06D2\u06D3';   // ا آ و ۇ ی ي ے ۓ

export function cleanAeraab(t){
  const o=[];
  for(let i=0;i<t.length;i++){
    const c=t[i];
    if(c===TATWEEL) continue;
    if(MARK.test(c) && c!==SHADDA && c!==SUKOON){
      let j=i+1; while(j<t.length && MARK.test(t[j])) j++;
      if(j<t.length && LONG.includes(t[j])) continue;   // zabar + lambi awaz
      if(t[i+1]===SHADDA) continue;                      // zabar + tashdeed
    }
    o.push(c);
  }
  return o.join('');
}

// lughat ka key: lafz bila aeraab, bila viraam
export const keyOf = w => w.replace(/[^\p{L}]/gu,'');

// Lughat lagao: har lafz dekho, agar lughat mein hai to us ki jagah
// aap ka likha hua talaffuz bol do.
// Pehle poore fiqre (do ya zyada lafz), phir tanha lafz.
// Fiqre ki jagah pehle ek nishan rakha jata hai, taake lafz wala daur use dobara na chhue.
const RX_ESC = /[.*+?^${}()|[\]\\]/g;
function phraseRe(k){
  const pat = k.trim().split(/\s+/)
    .map(w => [...w].map(c => c.replace(RX_ESC, '\\$&') + '[\\p{M}]*').join(''))
    .join('[\\s\\p{M}]+');
  return new RegExp(pat, 'gu');
}
export function applyLughat(t, lughat){
  if(!lughat) return t;
  let s = String(t);
  const holds = [];
  const multi = Object.keys(lughat).filter(k => /\s/.test(k)).sort((a,b) => b.length - a.length);
  for(const k of multi){
    try{ s = s.replace(phraseRe(k), () => { holds.push(lughat[k]); return '\u0001' + (holds.length-1) + '\u0001'; }); }catch{}
  }
  s = s.replace(/[\p{L}\p{M}]+/gu, w => {
    const k = keyOf(w);
    return (k && Object.prototype.hasOwnProperty.call(lughat,k)) ? lughat[k] : w;
  });
  return s.replace(/\u0001(\d+)\u0001/g, (_,i) => holds[+i]);
}

export function makePhonemizer(ESpeakNG, wasmBinary, idMap){
  let lughat = null;
  let safai = true;
  let compiled = null;
  async function espeak(text){
    if(!compiled) compiled = await WebAssembly.compile(wasmBinary);
    const out=[];
    await ESpeakNG({
      arguments:['-q','--ipa','-v','ur',text],
      print:s=>out.push(s), printErr:()=>{},
      instantiateWasm:(imports,cb)=>{
        WebAssembly.instantiate(compiled,imports).then(inst=>cb(inst,compiled));
        return {};
      },
    });
    return out;
  }

  // segments: ["satar 1","satar 2",...]  ->  [[id,...],[id,...]]
  const toIds = async function(segments){
    const plan=[];                       // har segment ke clauses
    const flat=[];                       // saare clauses ek qatar mein
    for(const s0 of segments){
      let s = safai ? cleanAeraab(s0) : s0;
      s = applyLughat(s, lughat);
      const cs = splitClauses(s);
      plan.push(cs);
      for(const c of cs) flat.push(c.t);
    }
    if(!flat.length) return segments.map(()=>[]);

    // "۔\n" se joro: eSpeak har clause ka jawab apni line mein deta hai
    const lines = await espeak(flat.join('۔\n'));
    if(lines.length !== flat.length)
      throw new Error(`phonemizer: ${flat.length} tukday bheje, ${lines.length} wapas aaye`);

    const id = ch => idMap[ch];
    let k=0;
    return plan.map(cs=>{
      const ids=[];
      const push = ch => { const v=id(ch); if(v!==undefined){ ids.push(v); ids.push(idMap['_']); } };
      ids.push(idMap['^'], idMap['_']);          // bos + pad
      for(const c of cs){
        for(const ch of lines[k++].normalize('NFD')) push(ch);
        if(c.p){ push(c.p); if(c.p===','||c.p===';'||c.p===':') push(' '); }
      }
      ids.push(idMap['$']);                       // eos
      return ids;
    });
  };
  toIds.setLughat = m => { lughat = m; };
  toIds.setSafai  = v => { safai = !!v; };
  return toIds;
}
