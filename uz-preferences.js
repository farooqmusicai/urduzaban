/* UrduZaban shared preferences controller */
(function(){
  'use strict';
  var KEY='uz-prefs-v1';
  var defaults={theme:'auto',font:'nastaliq',size:'md',spacing:'comfortable',motion:'auto'};
  var fontSheets={
    gulzar:'https://fonts.googleapis.com/css2?family=Gulzar&display=swap',
    lateef:'https://fonts.googleapis.com/css2?family=Lateef:wght@400;700&display=swap',
    amiri:'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap',
    sans:'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&display=swap'
  };
  function getPrefs(){
    try{
      var j=JSON.parse(localStorage.getItem(KEY)||'{}');
      return Object.assign({},defaults,j||{});
    }catch(e){ return Object.assign({},defaults); }
  }
  function save(p){ try{localStorage.setItem(KEY,JSON.stringify(p));}catch(e){} }
  function loadFont(id){
    var href=fontSheets[id]; if(!href) return;
    if(document.querySelector('link[data-uz-font="'+id+'"]')) return;
    var l=document.createElement('link'); l.rel='stylesheet'; l.href=href; l.dataset.uzFont=id; document.head.appendChild(l);
  }
  function apply(p){
    var h=document.documentElement;
    h.dataset.uzTheme=p.theme||'auto';
    h.dataset.uzFont=p.font||'nastaliq';
    h.dataset.uzSize=p.size||'md';
    h.dataset.uzSpacing=p.spacing||'comfortable';
    h.dataset.uzMotion=p.motion||'auto';
    loadFont(p.font);
    syncUI(p);
  }
  function syncUI(p){
    document.querySelectorAll('[data-uz-pref]').forEach(function(b){
      var k=b.getAttribute('data-uz-pref'),v=b.getAttribute('data-uz-value');
      b.classList.toggle('on',p[k]===v);
      b.setAttribute('aria-pressed',p[k]===v?'true':'false');
    });
  }
  function setOne(k,v){ var p=getPrefs(); p[k]=v; save(p); apply(p); }
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function choice(k,v,label,extra){ return '<button type="button" class="uzp-choice '+(extra||'')+'" data-uz-pref="'+esc(k)+'" data-uz-value="'+esc(v)+'" aria-pressed="false">'+label+'</button>'; }
  function build(){
    if(document.getElementById('uzPrefsBtn')) return;
    var veil=document.createElement('div'); veil.id='uzPrefsVeil';
    var panel=document.createElement('aside'); panel.id='uzPrefsPanel'; panel.setAttribute('aria-hidden','true'); panel.setAttribute('aria-label','اردو زبان کی ظاہری ترجیحات');
    panel.innerHTML=''
      +'<div class="uzp-head"><div class="uzp-title">دیکھنے کا انداز</div><button type="button" class="uzp-close" aria-label="بند کریں">✕</button></div>'
      +'<div class="uzp-group"><div class="uzp-label">رنگ / Theme</div><div class="uzp-grid">'
      +choice('theme','auto','خودکار')+choice('theme','paper','کاغذ')+choice('theme','night','رات')+choice('theme','emerald','سبز')+choice('theme','sapphire','نیلا')+choice('theme','plain','سادہ')+'</div></div>'
      +'<div class="uzp-group"><div class="uzp-label">اردو فونٹ</div><div class="uzp-grid">'
      +choice('font','nastaliq','نستعلیق','uzp-font')+choice('font','naskh','نسخ','uzp-font')+choice('font','gulzar','گلزار','uzp-font')+choice('font','lateef','لطیف','uzp-font')+choice('font','amiri','امیری','uzp-font')+choice('font','sans','سادہ عربی','uzp-font')+'</div><div class="uzp-note">نستعلیق اور نسخ site کے اندر موجود ہیں۔ دوسرے کھلے فونٹ صرف منتخب کرنے پر internet سے لوڈ ہوں گے۔</div></div>'
      +'<div class="uzp-group"><div class="uzp-label">متن کا حجم</div><div class="uzp-grid uzp-four">'
      +choice('size','sm','چھوٹا')+choice('size','md','معمول')+choice('size','lg','بڑا')+choice('size','xl','بہت بڑا')+'</div></div>'
      +'<div class="uzp-group"><div class="uzp-label">سطروں کا فاصلہ</div><div class="uzp-grid">'
      +choice('spacing','compact','کم')+choice('spacing','comfortable','آرام دہ')+choice('spacing','airy','کھلا')+'</div></div>'
      +'<div class="uzp-group"><div class="uzp-label">حرکت</div><div class="uzp-grid">'
      +choice('motion','auto','خودکار')+choice('motion','reduced','کم حرکت')+'</div></div>'
      +'<div class="uzp-actions"><button type="button" class="uzp-reset">اصل حالت بحال کریں</button></div>';
    var btn=document.createElement('button'); btn.id='uzPrefsBtn'; btn.type='button'; btn.setAttribute('aria-label','رنگ، فونٹ اور متن کی ترتیبات'); btn.setAttribute('aria-expanded','false'); btn.textContent='Aa ⚙';
    document.body.appendChild(veil); document.body.appendChild(panel); document.body.appendChild(btn);
    function open(on){ panel.classList.toggle('open',on); veil.classList.toggle('open',on); panel.setAttribute('aria-hidden',on?'false':'true'); btn.setAttribute('aria-expanded',on?'true':'false'); }
    btn.addEventListener('click',function(){open(!panel.classList.contains('open'));});
    veil.addEventListener('click',function(){open(false);});
    panel.querySelector('.uzp-close').addEventListener('click',function(){open(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape') open(false);});
    panel.addEventListener('click',function(e){ var b=e.target.closest('[data-uz-pref]'); if(!b) return; setOne(b.dataset.uzPref,b.dataset.uzValue); });
    panel.querySelector('.uzp-reset').addEventListener('click',function(){ save(defaults); apply(defaults); });
    syncUI(getPrefs());
  }
  var p=getPrefs(); apply(p);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',build); else build();
  window.UZPreferences={get:getPrefs,set:setOne,apply:apply,reset:function(){save(defaults);apply(defaults);}};
})();