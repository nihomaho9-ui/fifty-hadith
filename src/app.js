(function(){
"use strict";
var D=window.HADITH_DATA,H=D.hadith,app=document.getElementById('app');
var LS={get:function(k,d){try{var v=localStorage.getItem('fh.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
        set:function(k,v){try{localStorage.setItem('fh.'+k,JSON.stringify(v))}catch(e){}}};
var FS_MIN=18,FS_MAX=30,FS_DEF=22;
function fs(){var v=+LS.get('fontSize',FS_DEF);return (v>=FS_MIN&&v<=FS_MAX)?v:FS_DEF}
function applyFs(){document.documentElement.style.setProperty('--fs',fs()+'px')}
applyFs();
function norm(s){return String(s).replace(/[\u064B-\u0652\u0670\u0640\u200c-\u200f\ue000ﷺ]/g,'')
  .replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/[^\u0621-\u064A0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
var IDX=H.map(function(h){return norm(h.title+' '+h.heading+' '+h.paras.map(function(p){return p.map(function(s){return s.t}).join('')}).join(' '))});
function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function txt(s){return esc(s).replace(/\ue000/g,'<span class="hon">رضي الله عنه</span>')}
var AR='٠١٢٣٤٥٦٧٨٩';function an(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function bm(){return LS.get('bookmarks',[])}
function isRef(p){return p.every(function(s){return s.k==='n'})&&/^(رَوَاهُ|رواه|حَدِيثٌ|حديث)/.test(p[0].t.trim())}
var KN={p:'كلام النبي ﷺ',d:'كلام الله تعالى (حديث قدسي)',q:'آية قرآنية',r:'موضع مراجعة'};
function setTitle(t){document.title=t?t+' — '+D.meta.title:D.meta.title}

function viewIndex(q,tab){
  var marks=bm(),last=LS.get('last',null),qq=norm(q||'');
  var rows=H.filter(function(h,i){return (!qq||IDX[i].indexOf(qq)>=0)&&(tab!=='bm'||marks.indexOf(h.n)>=0)});
  var html='<input class="search" type="search" id="q" placeholder="ابحث في العناوين والمتون" value="'+esc(q||'')+'" aria-label="بحث">'+
   '<div class="tabs" role="group"><button data-tab="all" aria-pressed="'+(tab!=='bm')+'">الكل</button><button data-tab="bm" aria-pressed="'+(tab==='bm')+'">المحفوظة ('+an(marks.length)+')</button></div>';
  if(last&&!qq&&tab!=='bm') html+='<a class="resume" href="#/h/'+last+'">متابعة القراءة: الحديث '+an(last)+' ←</a>';
  if(!rows.length) html+='<p class="empty">لا توجد نتائج</p>';
  var cur='';
  rows.forEach(function(h){
    if(h.part!==cur){if(cur)html+='</ol>';cur=h.part;html+='<h2 class="part">'+(cur==='nawawi'?'الأربعون النووية':'زيادات ابن رجب')+'</h2><ol class="list">'}
    html+='<li><a href="#/h/'+h.n+'"><span class="num">'+an(h.n)+'</span><span class="ttl">'+esc(h.title)+'</span>'+(marks.indexOf(h.n)>=0?'<span class="mark" aria-label="محفوظ">●</span>':'')+'</a></li>';
  });
  if(cur)html+='</ol>';
  app.innerHTML=html;setTitle('');
  var inp=document.getElementById('q');
  inp.addEventListener('input',function(){var p=inp.selectionStart;viewIndex(inp.value,tab);var n=document.getElementById('q');n.focus();n.setSelectionRange(p,p)});
  app.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){viewIndex(inp.value,b.dataset.tab)}});
}

function viewHadith(n){
  var h=H[n-1];if(!h)return viewIndex();
  LS.set('last',n);
  var used={};
  var body=h.paras.map(function(p){
    if(isRef(p))return '<p class="ref">'+txt(p.map(function(s){return s.t}).join(''))+'</p>';
    return '<p class="matn">'+p.map(function(s){if(s.k!=='n')used[s.k]=1;
      return s.k==='n'?txt(s.t):'<span class="k-'+s.k+'"'+(s.k==='r'?' title="موضع مراجعة"':'')+'>'+txt(s.t)+'</span>'}).join('')+'</p>'}).join('');
  var on=bm().indexOf(n)>=0;
  var leg=Object.keys(used).map(function(k){return '<i class="k-'+k+'">● '+KN[k]+'</i>'}).join('');
  var notes=h.review.length||D.meta.corrections.some(function(c){return c.n===n})?
    '<details class="notes"><summary>ملاحظات النص</summary><ul>'+h.review.map(function(r){return '<li>'+esc(r)+'</li>'}).join('')+
    D.meta.corrections.filter(function(c){return c.n===n}).map(function(c){return '<li>تصحيح نقل: '+esc(c.note)+'</li>'}).join('')+'</ul></details>':'';
  app.innerHTML='<article><div class="rhead"><div class="h">'+esc(h.heading)+'</div><h1>'+esc(h.title)+'</h1></div>'+body+
    '<div class="legend">'+leg+'</div>'+
    '<div class="tools"><button class="btn" id="bm" aria-pressed="'+on+'">'+(on?'محفوظ':'حفظ')+'</button></div>'+notes+
    '<nav class="pager"><a class="'+(n>1?'':'off')+'" href="#/h/'+(n-1)+'">→ السابق</a><a href="#/">الفهرس</a><a class="'+(n<H.length?'':'off')+'" href="#/h/'+(n+1)+'">التالي ←</a></nav></article>';
  setTitle(h.heading);
  document.getElementById('bm').onclick=function(){var m=bm(),i=m.indexOf(n);if(i>=0)m.splice(i,1);else m.push(n);m.sort(function(a,b){return a-b});LS.set('bookmarks',m);viewHadith(n)};
  window.scrollTo(0,0);
}

function viewSettings(){
  app.innerHTML='<section class="page"><h1>الإعدادات</h1>'+
   '<div class="row"><span>حجم خط المتن</span><span class="stepper"><button id="dec" aria-label="تصغير">−</button><b id="fsv"></b><button id="inc" aria-label="تكبير">+</button></span></div>'+
   '<p class="preview"><span class="k-p">إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ</span></p>'+
   '<div class="row"><span>إعادة الحجم الافتراضي</span><button class="btn" id="rst">إعادة</button></div>'+
   '<div class="row"><span>مسح المحفوظات وموضع القراءة</span><button class="btn" id="clr">مسح</button></div>'+
   '<h2>الألوان</h2><p><span class="k-p">● كلام النبي ﷺ</span><br><span class="k-d">● كلام الله تعالى في الأحاديث القدسية</span><br><span class="k-q">● الآيات القرآنية</span><br>● بقية النص (الإسناد المختصر، والسؤال، وكلام الصحابة) باللون الأساسي.</p>'+
   '<p><a href="#/about">المصدر</a> · <a href="#/terms">شروط الاستخدام</a> · <a href="#/privacy">الخصوصية</a></p></section>';
  function upd(){document.getElementById('fsv').textContent=an(fs())}upd();
  function set(v){LS.set('fontSize',Math.max(FS_MIN,Math.min(FS_MAX,v)));applyFs();upd()}
  document.getElementById('dec').onclick=function(){set(fs()-1)};
  document.getElementById('inc').onclick=function(){set(fs()+1)};
  document.getElementById('rst').onclick=function(){set(FS_DEF)};
  document.getElementById('clr').onclick=function(){if(confirm('مسح المحفوظات وموضع القراءة؟')){LS.set('bookmarks',[]);localStorage.removeItem('fh.last')}};
  setTitle('الإعدادات');
}
var M=D.meta;
var PAGES={
about:'<h1>المصدر</h1><p>نص الأحاديث الخمسين (الأربعون النووية للإمام النووي، وزيادات الحافظ ابن رجب الحنبلي) مأخوذ من ملف موقع دار الإسلام (IslamHouse):</p><p><a href="'+M.source.page+'" target="_blank" rel="noopener">'+M.source.page+'</a></p>'+
 '<p>وقوبلت العناوين وتمام العدد بنسخة مصورة على الموقع نفسه: «الأربعون النووية مع زيادات ابن رجب» اعتنى بها الشيخ عبد المحسن القاسم.</p>'+
 '<h2>حالة المراجعة</h2><p>نُقل النص كما هو في الملف المصدر دون إكمال للتشكيل. رموز الخط الخاصة حُوّلت: الرمز الخاص بالصلاة إلى «ﷺ»، ورمز الترضي إلى «رضي الله عنه». والتصحيحات القليلة موضحة في «ملاحظات النص» تحت كل حديث.</p>'+
 '<p>تمييز كلام النبي ﷺ بالألوان عمل تحريري يدوي لتيسير القراءة، وليس جزءًا من المتن، وقد تبقى فيه مواضع تحتاج مراجعة. هذا الإصدار تجريبي، ولم يراجعه بعدُ أهل العلم مراجعة كاملة؛ فالمرجع عند الاختلاف النسخ المطبوعة المحققة.</p>'+
 '<h2>الصوت</h2><p>لا يتضمن هذا الإصدار تلاوات صوتية، لأن حقوق الاستخدام لم تُستوثق بعد.</p>'+
 '<h2>الخط</h2><p>خط «أميري» (Amiri) مرخص برخصة SIL Open Font License 1.1.</p>',
terms:'<h1>شروط الاستخدام</h1><p>هذا التطبيق مجاني، للقراءة الشخصية، بلا إعلانات ولا حسابات.</p><p>النص منقول من مصدر منشور (انظر صفحة «المصدر») مع ذكره، دون تغيير مقصود في المحتوى العلمي. يُقدَّم التطبيق «كما هو» دون ضمان لخلوه من أخطاء النقل أو التشكيل أو التلوين، وعند الشك يُرجع إلى النسخ المطبوعة المحققة وأهل العلم.</p><p>تبقى حقوق النصوص المصدرية لأصحابها وفق شروط موقع المصدر. والروابط الخارجية تُفتح خارج التطبيق وتخضع لشروط مواقعها.</p>',
privacy:'<h1>الخصوصية</h1><p>لا يجمع التطبيق أي بيانات شخصية، ولا يستخدم حسابات ولا أدوات تحليل ولا إعلانات، ولا يرسل بياناتك إلى أي خادم.</p><p>تُحفظ الإعدادات (حجم الخط)، والأحاديث المحفوظة، وآخر حديث قرأته، في التخزين المحلي لمتصفحك أو جهازك فقط. ويمكنك مسحها من «الإعدادات» أو بمسح بيانات المتصفح.</p><p>عند فتح التطبيق من الموقع المستضاف على GitHub Pages قد تسجّل GitHub بيانات تقنية عادية للطلبات (مثل عنوان IP) وفق سياسة الخصوصية الخاصة بها؛ والتطبيق نفسه لا يضيف أي تتبّع.</p><p>بعد التحميل الأول يعمل التطبيق دون اتصال بالإنترنت. والروابط الخارجية في صفحة «المصدر» تُفتح في المتصفح وتخضع لسياسات تلك المواقع.</p>'};
function route(){
  var h=location.hash.replace(/^#\/?/,'').split('/');
  if(h[0]==='h')viewHadith(parseInt(h[1],10));
  else if(h[0]==='settings')viewSettings();
  else if(PAGES[h[0]]){app.innerHTML='<section class="page">'+PAGES[h[0]]+'</section>';setTitle('');window.scrollTo(0,0)}
  else viewIndex('', 'all');
}
window.addEventListener('hashchange',route);
document.addEventListener('keydown',function(e){var m=location.hash.match(/^#\/h\/(\d+)/);if(!m||e.target.tagName==='INPUT')return;var n=+m[1];
  if(e.key==='ArrowLeft'&&n<H.length)location.hash='#/h/'+(n+1);if(e.key==='ArrowRight'&&n>1)location.hash='#/h/'+(n-1)});
route();
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
window.__FH={norm:norm,isRef:isRef};
})();
