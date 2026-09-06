(function(){
'use strict';
var KEY='uz-prefs-v1';
var DEF={theme:'auto',font:'nastaliq',size:'md',spacing:'comfortable',motion:'auto'};
var FONT_URLS={
  gulzar:'https://fonts.googleapis.com/css2?family=Gulzar&display=swap',
  lateef:'https://fonts.googleapis.com/css2?family=Lateef:wght@400;700&display=swap',
  amiri:'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
  sans:'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap'
};
function read(){try{return Object.assign({},DEF,JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return Object.assign({},DEF);}}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){}}
function lazyFont(id){var u=FONT_URLS[id];if(!u||document.querySelector('link[data-uz-font="'+id+'"]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=u;l.dataset.uzFont=id;document.head.appendChild(l);}
function apply(p){var h=document.documentElement;h.dataset.uzTheme=p.theme;h.dataset.uzFont=p.font;h.dataset.uzSize=p.size;h.dataset.uzSpacing=p.spacing;h.dataset.uzMotion=p.motion;if(FONT_URLS[p.font])lazyFont(p.font);}
var prefs=read();apply(prefs);
function choice(label,key,val,cls){return '<button type="button" class="uzp-choice '+(cls||'')+'" data-key="'+key+'" data-val="'+val+'">'+label+'</button>';}
function mount(){
 if(document.getElementById('uzPrefsBtn'))return;
 var veil=document.createElement('div');veil.id='uzPrefsVeil';document.body.appendChild(veil);
 var panel=document.createElement('section');panel.id='uzPrefsPanel';panel.setAttribute('aria-label','فونٹ اور رنگ کی ترجیحات');panel.innerHTML=
 '<div class="uzp-head"><div class="uzp-title">ظاہری ترجیحات</div><button class="uzp-close" type="button" aria-label="بند کریں">×</button></div>'+
 '<div class="uzp-group"><div class="uzp-label">رنگ / Theme</div><div class="uzp-grid">'+choice('خودکار','theme','auto')+choice('کاغذ','theme','paper')+choice('رات','theme','night')+choice('سبز','theme','emerald')+choice('نیلا','theme','sapphire')+choice('سادہ','theme','plain')+'</div></div>'+
 '<div class="uzp-group"><div class="uzp-label">اردو فونٹ</div><div class="uzp-grid">'+choice('نستعلیق','font','nastaliq','uzp-font')+choice('نسخ','font','naskh','uzp-font')+choice('گلزار','font','gulzar','uzp-font')+choice('لطیف','font','lateef','uzp-font')+choice('امیری','font','amiri','uzp-font')+choice('سادہ Sans','font','sans','uzp-font')+'</div><div class="uzp-note">نستعلیق اور نسخ site کے اپنے local fonts ہیں؛ باقی صرف آپ کے منتخب کرنے پر load ہوتے ہیں۔</div></div>'+
 '<div class="uzp-group"><div class="uzp-label">متن کا سائز</div><div class="uzp-grid four">'+choice('چھوٹا','size','sm')+choice('معمول','size','md')+choice('بڑا','size','lg')+choice('بہت بڑا','size','xl')+'</div></div>'+
 '<div class="uzp-group"><div class="uzp-label">سطروں کا فاصلہ</div><div class="uzp-grid">'+choice('کم','spacing','compact')+choice('آرام دہ','spacing','comfortable')+choice('کشادہ','spacing','airy')+'</div></div>'+
 '<div class="uzp-group"><div class="uzp-label">حرکت / Animation</div><div class="uzp-grid">'+choice('خودکار','motion','auto')+choice('کم حرکت','motion','reduced')+'</div></div>'+
 '<button type="button" class="uzp-reset">اصل حالت بحال کریں</button>';
 document.body.appendChild(panel);
 var openBtn=document.createElement('button');openBtn.id='uzPrefsBtn';openBtn.type='button';openBtn.setAttribute('aria-label','فونٹ اور رنگ بدلیں');openBtn.setAttribute('aria-expanded','false');openBtn.textContent='Aa ⚙';document.body.appendChild(openBtn);
 function paint(){panel.querySelectorAll('[data-key]').forEach(function(b){b.classList.toggle('on',prefs[b.dataset.key]===b.dataset.val);});}
 function close(){panel.classList.remove('open');veil.classList.remove('open');openBtn.setAttribute('aria-expanded','false');}
 function open(){paint();panel.classList.add('open');veil.classList.add('open');openBtn.setAttribute('aria-expanded','true');}
 openBtn.addEventListener('click',function(){panel.classList.contains('open')?close():open();});
 veil.addEventListener('click',close);panel.querySelector('.uzp-close').addEventListener('click',close);
 panel.addEventListener('click',function(e){var b=e.target.closest('[data-key]');if(!b)return;prefs[b.dataset.key]=b.dataset.val;apply(prefs);save(prefs);paint();});
 panel.querySelector('.uzp-reset').addEventListener('click',function(){prefs=Object.assign({},DEF);apply(prefs);save(prefs);paint();});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
 paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
