// Model isi worker ke andar chalta hai. Isi liye safha kabhi nahi jamta -
// chahe poori ghazal ek saath de dein. (Pehle yeh main thread par tha: wahi
// "Pages Unresponsive" wala masla.)
import * as ort from './lib/ort.wasm.min.mjs';

ort.env.wasm.wasmPaths  = new URL('lib/', import.meta.url).href;
ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy      = false;
ort.env.logLevel        = 'error';

let sess = null;

self.onmessage = async (e) => {
  const m = e.data;
  try {
    if (m.t === 'init') {
      sess = await ort.InferenceSession.create(m.buf, { executionProviders: ['wasm'] });
      postMessage({ t: 'ready', id: m.id });

    } else if (m.t === 'say') {
      if (!sess) throw new Error('model tayyar nahi');
      const out = await sess.run({
        x:             new ort.Tensor('int64',   BigInt64Array.from(m.ids.map(BigInt)), [1, m.ids.length]),
        x_length:      new ort.Tensor('int64',   BigInt64Array.from([BigInt(m.ids.length)]), [1]),
        noise_scale:   new ort.Tensor('float32', Float32Array.from([m.ns]),  [1]),
        length_scale:  new ort.Tensor('float32', Float32Array.from([m.ls]),  [1]),
        noise_scale_w: new ort.Tensor('float32', Float32Array.from([m.nsw]), [1]),
      });
      const pcm = out.y.data;
      postMessage({ t: 'pcm', id: m.id, pcm }, [pcm.buffer]);
    }
  } catch (err) {
    postMessage({ t: 'err', id: m.id, msg: String(err && err.message || err) });
  }
};
