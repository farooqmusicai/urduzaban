/* ============================================================================
   uz-keyboard.js — اردو تختہ، ہر صفحے پر  (urduzaban.com)  v1.0 · 22 Aug 2026
   ----------------------------------------------------------------------------
   قرینہ کا تختہ (وہی خاکہ، وہی آرام دہ خانے) اب ایک الگ فائل — جس صفحے پر بھی
   لکھنے کا خانہ ہو، بس یہ سطر ڈالیے:   <script src="uz-keyboard.js"></script>

   • بائیں نیچے تیرتا ہوا بٹن «⌨ اردو تختہ» — click: تختہ کھلے/بند ہو
   • تختہ نیچے جم جاتا ہے؛ جس خانے میں cursor ہو اسی میں لکھتا ہے (input / textarea)
   • اعراب کی قطار (زبر زیر پیش تشدید جزم …) کسی بھی خانے میں لگتی ہے
   • English تہہ (⇧ CAPS) — اور واپس اردو
   • «دبا کر لکھیے» — موبائل انداز: بٹن یا خانے پر دبائے رکھیے → تختہ وہیں کھلے،
     انگلی/ماؤس جس حرف پر چھوڑیں وہ لکھا جائے (hold-to-type)
   • یاد رکھتا ہے: کھلا تھا یا بند، اردو تہہ تھی یا English (localStorage: uz-kb, uz-kb-layer)
   • کوئی Windows/Mac/Linux keyboard install کرنے کی ضرورت نہیں — سب browser میں

   window.UZKeyboard = { open(), close(), toggle(), isOpen(), setTarget(el), insert(text), del() }
   ============================================================================ */
(function () {
"use strict";
if (window.UZKeyboard) return;

/* ---- 1. خاکہ (قرینہ کا وہی) ---- */
var MKDEF = [["َ","زبر"],["ِ","زیر"],["ُ","پیش"],["ّ","تشدید"],["ْ","جزم"],["ً","دو زبر"],["ٍ","دو زیر"],["ٌ","دو پیش"],["ٰ","کھڑی زبر"]];
var URFULL = [["ق","و","ع","ر","ت","ے","ی","ئ","ہ","پ"],
              ["ا","س","د","ف","گ","ح","ج","ک","ل","ں"],
              ["ز","ش","چ","ط","ب","ن","م","ھ","ۂ","ء"],
              ["آ","ض","ص","ث","ظ","غ","خ","ٹ","ڈ","ڑ"],
              ["ذ","ژ","أ","ؤ","ۃ","۔","،","؟","!","٭"],
              ["«","»","(",")","'","\"","ـ","؎","-",":"],
              ["۱","۲","۳","۴","۵","۶","۷","۸","۹","۰"]];
var EN1 = [["q","w","e","r","t","y","u","i","o","p"],
           ["a","s","d","f","g","h","j","k","l","'"],
           ["z","x","c","v","b","n","m",".",",","-"],
           ["1","2","3","4","5","6","7","8","9","0"]];
var HOLD_EN = [["1","2","3","4","5","6","7","8","9","0"],
               ["q","w","e","r","t","y","u","i","o","p"],
               ["a","s","d","f","g","h","j","k","l","'"],
               ["z","x","c","v","b","n","m",".",",","-"],
               ["A","B","C","D","E","F","G","H","I","J"],
               ["K","L","M","N","O","P","Q","R","S","T"],
               ["U","V","W","X","Y","Z","?","!","(",")"]];

/* ---- 2. CSS (صفحے کے رنگ خود اٹھاتا ہے: --paper --card --ink --muted --line --accent --accent-ink) ---- */
var CSS = '\
#uzkbFab{position:fixed; left:14px; bottom:14px; z-index:190; display:inline-flex; align-items:center; gap:8px;\
  font-family:"UZ Naskh","QNaskh","Noto Naskh Arabic",serif; font-size:15px; font-weight:700; line-height:1.7;\
  padding:8px 16px; border-radius:999px; border:1.6px solid var(--accent,#a8731d); background:var(--card,#fffdf8); color:var(--accent,#a8731d);\
  cursor:pointer; box-shadow:0 6px 22px rgba(0,0,0,.18); user-select:none; -webkit-user-select:none; touch-action:none; direction:rtl;}\
#uzkbFab:hover{background:var(--accent,#a8731d); color:var(--accent-ink,#fff8ec);}\
#uzkbFab .k{font-size:18px; line-height:1;}\
#uzkbFab.on{background:var(--accent,#a8731d); color:var(--accent-ink,#fff8ec);}\
#uzkbFab small{font-family:system-ui,sans-serif; font-size:10.5px; font-weight:500; opacity:.8; direction:ltr;}\
@media(max-width:600px){ #uzkbFab{padding:7px 12px;} #uzkbFab small{display:none;} }\
#uzkb{position:fixed; bottom:0; right:0; left:0; z-index:180; background:var(--card,#fffdf8); border-top:2px solid var(--accent,#a8731d);\
  box-shadow:0 -8px 30px rgba(0,0,0,.15); padding:8px 10px 12px; display:none; direction:rtl; font-family:"UZ Naskh","QNaskh","Noto Naskh Arabic",serif; color:var(--ink,#251f14);}\
#uzkb.open{display:block;}\
#uzkb .scroll{max-height:56vh; overflow:auto;}\
body.uzkb-open{padding-bottom:var(--uzkb-pad,400px);}\
#uzkbBar{display:flex; justify-content:space-between; align-items:center; gap:8px; max-width:1100px; margin:0 auto; flex-wrap:wrap;}\
#uzkbBar .ttl{font-size:13px; color:var(--muted,#7c7060); line-height:1.8;}\
#uzkbBar .ttl .en{font-family:system-ui,sans-serif; font-size:11px; opacity:.75; direction:ltr; unicode-bidi:isolate; margin-inline-start:6px;}\
#uzkbBar button{font-family:inherit; font-size:14px; cursor:pointer; border-radius:8px; border:1px solid var(--line,#e6ddc9); background:var(--paper,#faf6ed); color:var(--ink,#251f14); padding:5px 12px; line-height:1.7;}\
#uzkbBar button:hover{border-color:var(--accent,#a8731d);}\
#uzkbBar button.hold{border-color:var(--accent,#a8731d); color:var(--accent,#a8731d); font-weight:700; touch-action:none; user-select:none; -webkit-user-select:none;}\
.uzkb-row{display:flex; justify-content:center; gap:5px; margin-top:5px; flex-wrap:wrap;}\
.uzkb-key{font-family:"UZ Naskh","QNaskh","Noto Naskh Arabic",serif; font-size:20px; line-height:1.5; min-width:44px; height:44px; padding:0 6px;\
  border:1px solid var(--line,#e6ddc9); border-radius:8px; background:var(--paper,#faf6ed); color:var(--ink,#251f14); cursor:pointer; touch-action:manipulation;}\
.uzkb-key:active{border-color:var(--accent,#a8731d); background:rgba(208,122,0,.13);}\
.uzkb-key.sp{min-width:220px;} .uzkb-key.wide{min-width:70px; font-size:15px; color:var(--muted,#7c7060);}\
.uzkb-key.mkk{background:rgba(208,122,0,.13); border-color:#c05f00; font-size:19px;}\
.uzkb-key.lat{font-family:system-ui,sans-serif;}\
@media(max-width:700px){ .uzkb-key{min-width:30px; height:38px; font-size:17px; padding:0 2px;} .uzkb-key.sp{min-width:100px;} .uzkb-key.wide{min-width:56px;} .uzkb-row{gap:4px; margin-top:4px;} #uzkbBar .ttl{display:none;} }\
#uzkbHold{position:fixed; z-index:300; background:var(--card,#fffdf8); border:1.6px solid var(--accent,#a8731d); border-radius:14px;\
  box-shadow:0 8px 34px rgba(0,0,0,.28); padding:8px 10px; display:none; direction:rtl; user-select:none; -webkit-user-select:none; touch-action:none;}\
.uzhk-row{display:flex; gap:4px; justify-content:center; margin-top:4px;}\
.uzhk{min-width:34px; height:37px; padding:0 4px; display:flex; align-items:center; justify-content:center;\
  font-family:"UZ Naskh","QNaskh","Noto Naskh Arabic",serif; font-size:19px; border-radius:7px; border:1px solid var(--line,#e6ddc9); background:var(--paper,#faf6ed); color:var(--ink,#251f14);}\
.uzhk.mk{background:rgba(208,122,0,.13); border-color:#c05f00; font-size:17px;}\
.uzhk.lat{font-family:system-ui,sans-serif; font-size:16px;}\
.uzhk.wide{min-width:70px; font-size:15px; color:var(--muted,#7c7060);}\
.uzhk.hot{background:var(--accent,#a8731d); color:var(--accent-ink,#fff8ec); border-color:var(--accent,#a8731d); transform:scale(1.3); font-weight:700; box-shadow:0 4px 14px rgba(0,0,0,.25);}\
@media (prefers-reduced-motion: reduce){ .uzhk.hot{transform:none;} }\
#uzkbToast{position:fixed; bottom:72px; left:50%; transform:translateX(-50%); background:var(--ink,#251f14); color:var(--paper,#faf6ed); padding:6px 16px; border-radius:999px; font-size:14px; z-index:310; opacity:0; transition:opacity .25s; pointer-events:none; font-family:"UZ Naskh","QNaskh","Noto Naskh Arabic",serif;}\
';

function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

/* ---- 3. عناصر ---- */
var style = document.createElement("style"); style.textContent = CSS; document.head.appendChild(style);
var fab = document.createElement("button"); fab.id = "uzkbFab"; fab.type = "button"; fab.setAttribute("aria-label", "اردو تختہ / Urdu keyboard");
fab.innerHTML = '<span class="k">⌨</span><span>اردو تختہ</span><small>Urdu keyboard</small>';
var kb = document.createElement("div"); kb.id = "uzkb"; kb.setAttribute("role", "region"); kb.setAttribute("aria-label", "اردو تختہ");
kb.innerHTML = '<div id="uzkbBar"><span class="ttl">تختہ — کلک سے لکھیے؛ جس خانے میں cursor ہو اسی میں؛ اعراب والی قطار کسی بھی خانے میں لگتی ہے<span class="en">On-screen keyboard — types into the box that has the cursor</span></span>'
  + '<span><button type="button" id="uzkbHoldBtn" class="hold" title="دبائے رکھیے — تختہ کھلے گا؛ جس حرف پر چھوڑیں گے وہ لکھا جائے گا">⌨ دبا کر لکھیے</button> '
  + '<button type="button" id="uzkbLang">English</button> <button type="button" id="uzkbShift">⇧ CAPS</button> <button type="button" id="uzkbClose">بند کریں</button></span></div><div class="scroll"><div id="uzkbRows"></div></div>';
var hold = document.createElement("div"); hold.id = "uzkbHold";
var toast = document.createElement("div"); toast.id = "uzkbToast";
function mount() { document.body.appendChild(fab); document.body.appendChild(kb); document.body.appendChild(hold); document.body.appendChild(toast); init(); }
var toastT = null;
function say(m) { toast.textContent = m; toast.style.opacity = 1; clearTimeout(toastT); toastT = setTimeout(function () { toast.style.opacity = 0; }, 1800); }

/* ---- 4. ہدف: جس خانے میں آخری بار cursor تھا ---- */
var target = null;
function editable(el) {
  if (!el || el.disabled || el.readOnly) return false;
  if (el.tagName === "TEXTAREA") return true;
  if (el.tagName === "INPUT") return /^(text|search|url|email|tel|password|)$/i.test(el.type || "text");
  return false;
}
function firstBox() {
  var els = document.querySelectorAll("textarea, input");
  for (var i = 0; i < els.length; i++) if (editable(els[i]) && els[i].offsetParent !== null) return els[i];
  return null;
}
function live() { if (target && document.contains(target) && editable(target)) return target; target = firstBox(); return target; }
document.addEventListener("focusin", function (e) { if (editable(e.target)) target = e.target; });

function insert(s) {
  var el = live(); if (!el) { say("پہلے کسی خانے میں click کیجیے / click a text box first"); return; }
  var st = (el.selectionStart != null) ? el.selectionStart : el.value.length, en = (el.selectionEnd != null) ? el.selectionEnd : st;
  el.value = el.value.slice(0, st) + s + el.value.slice(en);
  var p = st + s.length;
  el.focus({ preventScroll: true }); try { el.setSelectionRange(p, p); } catch (e) {}
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
function del() {
  var el = live(); if (!el) return;
  var st = (el.selectionStart != null) ? el.selectionStart : el.value.length, en = (el.selectionEnd != null) ? el.selectionEnd : st;
  if (st === en && st > 0) st--;
  el.value = el.value.slice(0, st) + el.value.slice(en);
  el.focus({ preventScroll: true }); try { el.setSelectionRange(st, st); } catch (e) {}
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/* ---- 5. تختہ (click) ---- */
var layer = store("uz-kb-layer") === "en" ? "en" : "ur", shift = false;
function render() {
  var rows = [], r, i, ch;
  if (layer === "ur") {
    rows.push(MKDEF.map(function (m) { return { l: "◌" + m[0], c: "uzkb-key mkk", t: m[1], ch: m[0] }; }));
    for (i = 0; i < URFULL.length; i++) rows.push(URFULL[i].map(function (x) { return { l: x, c: "uzkb-key", ch: x }; }));
  } else {
    for (i = 0; i < EN1.length; i++) rows.push(EN1[i].map(function (x) { ch = shift ? x.toUpperCase() : x; return { l: ch, c: "uzkb-key lat", ch: ch }; }));
  }
  rows.push([{ l: "⌫", c: "uzkb-key wide", act: "del" }, { l: "خالی جگہ", c: "uzkb-key sp", ch: " " }, { l: "⏎ نئی سطر", c: "uzkb-key wide", ch: "\n" }]);
  var box = document.getElementById("uzkbRows");
  box.innerHTML = rows.map(function (row) {
    return '<div class="uzkb-row">' + row.map(function (k) {
      return '<button type="button" class="' + k.c + '"' + (k.t ? ' title="' + esc(k.t) + '"' : '') + (k.act ? ' data-act="' + k.act + '"' : ' data-ch="' + esc(k.ch) + '"') + '>' + esc(k.l) + '</button>';
    }).join("") + '</div>';
  }).join("");
  document.getElementById("uzkbLang").textContent = layer === "ur" ? "English" : "اردو";
  var sb = document.getElementById("uzkbShift"); sb.style.display = layer === "ur" ? "none" : "inline-block"; sb.textContent = shift ? "⇧ small" : "⇧ CAPS";
}
function isOpen() { return kb.classList.contains("open"); }
function place() {
  var h = isOpen() ? kb.offsetHeight : 0;
  fab.style.bottom = (h ? h + 12 : 14) + "px";
  document.documentElement.style.setProperty("--uzkb-pad", (h + 24) + "px");
}
function setOpen(o) {
  kb.classList.toggle("open", o); document.body.classList.toggle("uzkb-open", o); fab.classList.toggle("on", o);
  store("uz-kb", o ? "1" : "0"); place();
  if (o && !live()) say("کسی خانے میں click کیجیے، پھر حرف دبائیے");
}
window.addEventListener("resize", place);

/* ---- 6. دبا کر لکھیے (hold-to-type) ---- */
var holdMode = "ur", holding = false, hotEl = null, lastPX = 0, lastPY = 0, lpTimer = null, lpStart = null, anchor = null, anchorEl = null;
function buildHold() {
  var h = "", i;
  if (holdMode === "ur") {
    h += '<div class="uzhk-row">' + MKDEF.map(function (m) { return '<span class="uzhk mk" data-ch="' + m[0] + '" title="' + m[1] + '">◌' + m[0] + '</span>'; }).join("") + '</div>';
    for (i = 0; i < URFULL.length; i++) h += '<div class="uzhk-row">' + URFULL[i].map(function (c) { return '<span class="uzhk" data-ch="' + esc(c) + '">' + esc(c) + '</span>'; }).join("") + '</div>';
    h += '<div class="uzhk-row"><span class="uzhk wide" data-act="mode">ABC</span><span class="uzhk wide" data-act="sp">فاصلہ</span><span class="uzhk wide" data-act="del">⌫ مٹائیے</span></div>';
  } else {
    for (i = 0; i < HOLD_EN.length; i++) h += '<div class="uzhk-row">' + HOLD_EN[i].map(function (c) { return '<span class="uzhk lat" data-ch="' + esc(c) + '">' + esc(c) + '</span>'; }).join("") + '</div>';
    h += '<div class="uzhk-row"><span class="uzhk wide" data-act="mode">اردو</span><span class="uzhk wide" data-act="sp">space</span><span class="uzhk wide" data-act="del">⌫</span></div>';
  }
  hold.innerHTML = h;
}
function setHot(el) { if (hotEl === el) return; if (hotEl) hotEl.classList.remove("hot"); hotEl = el; if (hotEl) hotEl.classList.add("hot"); }
function startHold(x, y) {
  holding = true; setHot(null); hold.style.display = "block";
  var r = hold.getBoundingClientRect();
  var left = Math.max(8, Math.min(x - r.width / 2, window.innerWidth - r.width - 8));
  var top = y - r.height - 20; if (top < 8) top = Math.min(y + 26, window.innerHeight - r.height - 8);
  hold.style.left = left + "px"; hold.style.top = top + "px";
}
function endHold() {
  if (!holding) return;
  holding = false; hold.style.display = "none"; window.__uzJustHeld = Date.now();
  if (hotEl) {
    var a = hotEl.getAttribute("data-act"), ch = hotEl.getAttribute("data-ch");
    if (a === "del") del();
    else if (a === "sp") insert(" ");
    else if (a === "mode") { holdMode = holdMode === "ur" ? "en" : "ur"; buildHold(); say(holdMode === "en" ? "English تختہ — اب دبا کر لکھیے" : "اردو تختہ واپس"); }
    else if (ch) insert(ch);
  }
  setHot(null);
}
function lpCancel() { if (lpTimer) { clearTimeout(lpTimer); lpTimer = null; } lpStart = null; }

function init() {
  buildHold(); render();
  /* تیرتا بٹن: click = کھولیے/بند؛ دبائے رکھیے = دبا کر لکھیے */
  var fabHeld = false;
  fab.addEventListener("pointerdown", function (e) {
    e.preventDefault(); fabHeld = false; lastPX = e.clientX; lastPY = e.clientY; lpStart = { x: e.clientX, y: e.clientY };
    lpTimer = setTimeout(function () { lpTimer = null; fabHeld = true; if (!live()) { say("پہلے کسی خانے میں click کیجیے"); return; } startHold(lastPX, lastPY); }, 450);
  });
  fab.addEventListener("click", function (e) { e.preventDefault(); if (fabHeld) { fabHeld = false; return; } setOpen(!isOpen()); });
  document.getElementById("uzkbHoldBtn").addEventListener("pointerdown", function (e) { e.preventDefault(); if (!live()) { say("پہلے کسی خانے میں click کیجیے"); return; } startHold(e.clientX, e.clientY); });
  /* خانے پر دبائے رکھیے (500ms، بغیر ہلے) → تختہ وہیں */
  document.addEventListener("pointerdown", function (e) {
    if (!editable(e.target)) return;
    target = e.target; anchorEl = e.target; lastPX = e.clientX; lastPY = e.clientY; lpStart = { x: e.clientX, y: e.clientY };
    lpTimer = setTimeout(function () {
      lpTimer = null; var el = anchorEl; if (!el) return;
      var a = (el.selectionStart != null) ? el.selectionStart : el.value.length; try { el.setSelectionRange(a, a); } catch (err) {}
      anchor = a; startHold(lastPX, lastPY);
    }, 500);
  }, true);
  document.addEventListener("pointermove", function (e) {
    lastPX = e.clientX; lastPY = e.clientY;
    if (lpStart && (Math.abs(e.clientX - lpStart.x) > 10 || Math.abs(e.clientY - lpStart.y) > 10)) lpCancel();
    if (!holding) return;
    if (e.cancelable) e.preventDefault();
    if (anchorEl && anchor != null) { try { anchorEl.setSelectionRange(anchor, anchor); } catch (err) {} }
    var el = document.elementFromPoint(e.clientX, e.clientY);
    setHot(el && el.classList && el.classList.contains("uzhk") ? el : null);
  }, { passive: false });
  document.addEventListener("pointerup", function () { lpCancel(); anchor = null; anchorEl = null; endHold(); });
  document.addEventListener("pointercancel", function () { lpCancel(); anchor = null; anchorEl = null; holding = false; hold.style.display = "none"; setHot(null); });
  /* تختے کے بٹن — focus نہ چھینیں */
  kb.addEventListener("mousedown", function (e) { if (e.target.tagName === "BUTTON") e.preventDefault(); });
  kb.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return; e.stopPropagation();
    if (b.id === "uzkbLang") { layer = layer === "ur" ? "en" : "ur"; shift = false; store("uz-kb-layer", layer); render(); place(); return; }
    if (b.id === "uzkbShift") { shift = !shift; render(); place(); return; }
    if (b.id === "uzkbClose") { setOpen(false); return; }
    if (b.id === "uzkbHoldBtn") return;
    if (b.getAttribute("data-act") === "del") del(); else if (b.hasAttribute("data-ch")) insert(b.getAttribute("data-ch"));
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen()) setOpen(false); });
  if (store("uz-kb") === "1") setOpen(true);
}
if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

window.UZKeyboard = {
  open: function () { setOpen(true); }, close: function () { setOpen(false); }, toggle: function () { setOpen(!isOpen()); }, isOpen: isOpen,
  setTarget: function (el) { if (editable(el)) target = el; }, insert: insert, del: del, VERSION: "1.0"
};
})();
