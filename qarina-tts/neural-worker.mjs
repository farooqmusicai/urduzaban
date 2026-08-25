// Model isi worker ke andar chalta hai. Isi liye safha kabhi nahi jamta -
// chahe poori ghazal ek saath de dein. (Pehle yeh main thread par tha: wahi
// "Pages Unresponsive" wala masla.)
//
// Do tarah ki awazein chalti hain:
//   kind 'mms'   -> purani Meta MMS awaz. Raw huroof -> ids (safhe par).
//   kind 'piper' -> nayi Piper awazein (aurat/mard). eSpeak ke IPA phonemes
//                   -> ids. Yeh kaam bhi yahin worker mein hota hai, kyunke
//                   espeak-ng.wasm 18.5 MB ka hai - main thread par rakhte
//                   to safha phir se jam jaata.
import * as ort from './lib/ort.wasm.min.mjs';
import { makePhonemizer } from './piper-phon.mjs';

ort.env.wasm.wasmPaths  = new URL('lib/', import.meta.url).href;
ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy      = false;
ort.env.logLevel        = 'error';

let sess = null;
let kind = 'mms';
let toIds = null;                       // piper ka phonemizer

async function ensurePhonemizer() {
  if (toIds) return;
  const base = import.meta.url;
  const [mod, wasm, ids] = await Promise.all([
    import('./espeak-ng.js'),
    fetch(new URL('espeak-ng.wasm', base)).then(r => r.arrayBuffer()),
    fetch(new URL('neural/piper/phoneme_ids.json', base)).then(r => r.json()),
  ]);
  toIds = makePhonemizer(mod.default, wasm, ids);
}

self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.t === 'init') {
      kind = m.kind || 'mms';
      sess = await ort.InferenceSession.create(m.buf, { executionProviders: ['wasm'] });
      if (kind === 'piper') await ensurePhonemizer();
      postMessage({ t: 'ready', id: m.id });

    } else if (m.t === 'phon') {
      // saari satrein EK hi baar mein - taake 18.5 MB wala eSpeak baar baar na chale
      await ensurePhonemizer();
      toIds.setLughat(m.lughat || null);
      toIds.setSafai(m.safai !== false);
      postMessage({ t: 'ids', id: m.id, ids: await toIds(m.segs) });

    } else if (m.t === 'say') {
      if (!sess) throw new Error('model tayyar nahi');
      const big = BigInt64Array.from(m.ids, v => BigInt(v));
      let pcm;
      if (kind === 'piper') {
        const out = await sess.run({
          input:         new ort.Tensor('int64',   big, [1, m.ids.length]),
          input_lengths: new ort.Tensor('int64',   BigInt64Array.from([BigInt(m.ids.length)]), [1]),
          scales:        new ort.Tensor('float32', Float32Array.from([m.ns, m.ls, m.nsw]), [3]),
        });
        pcm = out.output.data;
      } else {
        const out = await sess.run({
          x:             new ort.Tensor('int64',   big, [1, m.ids.length]),
          x_length:      new ort.Tensor('int64',   BigInt64Array.from([BigInt(m.ids.length)]), [1]),
          noise_scale:   new ort.Tensor('float32', Float32Array.from([m.ns]),  [1]),
          length_scale:  new ort.Tensor('float32', Float32Array.from([m.ls]),  [1]),
          noise_scale_w: new ort.Tensor('float32', Float32Array.from([m.nsw]), [1]),
        });
        pcm = out.y.data;
      }
      postMessage({ t: 'pcm', id: m.id, pcm }, [pcm.buffer]);
    }
  } catch (err) {
    postMessage({ t: 'err', id: m.id, msg: String(err && err.message || err) });
  }
};
