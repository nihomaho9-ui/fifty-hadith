(function(){
"use strict";
var D=window.HADITH_DATA,H=D.hadith,app=document.getElementById('app'),root=document.documentElement;
var VERSION='1.0.2';
var LS={get:function(k,d){try{var v=localStorage.getItem('fh.'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
        set:function(k,v){try{localStorage.setItem('fh.'+k,JSON.stringify(v))}catch(e){}}};
var CAP=window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()?window.Capacitor:null;
function native(m,o){return CAP&&CAP.nativePromise?CAP.nativePromise('Nibras',m,o||{}):Promise.reject(new Error('web'))}
var FS_MIN=18,FS_MAX=34,FS_DEF=22;
function fs(){var v=+LS.get('fontSize',FS_DEF);return (v>=FS_MIN&&v<=FS_MAX)?v:FS_DEF}
function applyFs(){root.style.setProperty('--fs',fs()+'px')}
applyFs();
/* theme: auto | light | dark */
var mq=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
function themePref(){var t=LS.get('theme','auto');return t==='light'||t==='dark'?t:'auto'}
function isDark(){var t=themePref();return t==='dark'||(t==='auto'&&!!(mq&&mq.matches))}
function applyTheme(){var d=isDark();root.setAttribute('data-theme',d?'dark':'light');
  var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',d?'#0e1716':'#1d5a6e');
  native('setTheme',{dark:d}).catch(function(){})}
applyTheme();
/* native shell: exact system-bar insets (also pushed by MainActivity on every change) */
native('getInsets').then(function(r){var st=root.style;st.setProperty('--sat',r.top+'px');st.setProperty('--sab',r.bottom+'px');st.setProperty('--sal',r.left+'px');st.setProperty('--sar',r.right+'px');st.setProperty('--kb',(r.ime||0)+'px')}).catch(function(){});
if(mq&&mq.addEventListener)mq.addEventListener('change',applyTheme);
function norm(s){return String(s).replace(/[\u064B-\u0652\u0670\u0640\u200c-\u200f\ue000ﷺ]/g,'')
  .replace(/[إأآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ/g,'ي')
  .replace(/[^\u0621-\u064A0-9\s]/g,' ').replace(/\s+/g,' ').trim()}
function plain(p){return p.map(function(s){return s.t}).join('').replace(/\ue000/g,'رضي الله عنه')}
var IDX=H.map(function(h){return norm(h.title+' '+h.heading+' '+h.paras.map(function(p){return p.map(function(s){return s.t}).join('')}).join(' '))});
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function txt(s){return esc(s).replace(/\ue000/g,'<span class="hon">رضي الله عنه</span>')}
var AR='٠١٢٣٤٥٦٧٨٩';function an(n){return String(n).replace(/\d/g,function(d){return AR[d]})}
function bm(){return LS.get('bookmarks',[])}
function isRef(p){return p.every(function(s){return s.k==='n'})&&/^(رَوَاهُ|رواه|حَدِيثٌ|حديث)/.test(p[0].t.trim())}
var KN={p:'كلام النبي ﷺ',d:'كلام الله تعالى (حديث قدسي)',q:'آية قرآنية',r:'موضع مراجعة'};
var I={
  search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/></svg>',
  copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
  share:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
  moon:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
  play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>',
  stop:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
  sound:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  sun:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
};
function setTitle(t){document.title=t?t+' — '+D.meta.title:D.meta.title}
var toastT;function toast(m){var t=document.getElementById('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},1800)}
function hadithText(h){
  return h.heading+': '+h.title+'\n\n'+h.paras.map(plain).join('\n\n')+'\n\n— '+D.meta.title;
}
function copyText(s){
  return native('copy',{text:s}).catch(function(){
    if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(s);
    throw 0}).catch(function(){
    var ta=document.createElement('textarea');ta.value=s;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(e){}document.body.removeChild(ta);
    if(!ok)throw new Error('copy')});
}
function shareText(title,s){
  return native('share',{title:title,text:s}).catch(function(e){
    if(navigator.share)return navigator.share({title:title,text:s});
    return copyText(s).then(function(){toast('نُسخ النص للمشاركة')})});
}
function setBack(show){var b=document.getElementById('back');if(b)b.hidden=!show}
function themeIcon(){var b=document.getElementById('themeBtn');if(b){b.innerHTML=isDark()?I.sun:I.moon;b.setAttribute('aria-label',isDark()?'المظهر الفاتح':'المظهر الداكن')}}

function viewIndex(q,tab){
  setBack(false);
  var marks=bm(),last=LS.get('last',null),qq=norm(q||'');
  var rows=H.filter(function(h,i){return (!qq||IDX[i].indexOf(qq)>=0)&&(tab!=='bm'||marks.indexOf(h.n)>=0)});
  var html='<div class="searchbox">'+I.search+'<input class="search" type="search" id="q" placeholder="ابحث في العناوين والمتون" value="'+esc(q||'')+'" aria-label="بحث" autocomplete="off"></div>'+
   '<div class="tabs" role="group"><button data-tab="all" aria-pressed="'+(tab!=='bm')+'">الكل ('+an(H.length)+')</button><button data-tab="bm" aria-pressed="'+(tab==='bm')+'">المحفوظة ('+an(marks.length)+')</button></div>';
  if(last&&H[last-1]&&!qq&&tab!=='bm') html+='<a class="resume" href="#/h/'+last+'"><span><small>متابعة القراءة</small><b>'+esc(H[last-1].heading)+'</b><span class="rt"> — '+esc(H[last-1].title)+'</span></span><span aria-hidden="true">←</span></a>';
  if(qq) html+='<p class="count">'+an(rows.length)+' نتيجة</p>';
  if(!rows.length) html+='<p class="empty">'+(tab==='bm'&&!qq?'لم تحفظ أي حديث بعد. اضغط «حفظ» في صفحة الحديث.':'لا توجد نتائج')+'</p>';
  var cur='';
  rows.forEach(function(h){
    if(h.part!==cur){if(cur)html+='</ol>';cur=h.part;html+='<h2 class="part">'+(cur==='nawawi'?'الأربعون النووية':'زيادات ابن رجب')+'</h2><ol class="list">'}
    html+='<li><a href="#/h/'+h.n+'"><span class="num">'+an(h.n)+'</span><span class="ttl">'+esc(h.title)+'<small>'+esc(h.heading)+'</small></span>'+(marks.indexOf(h.n)>=0?'<span class="mark" aria-label="محفوظ">'+I.star+'</span>':'')+'</a></li>';
  });
  if(cur)html+='</ol>';
  app.innerHTML=html;setTitle('');
  var inp=document.getElementById('q');
  inp.addEventListener('input',function(){var p=inp.selectionStart;LS_Q=inp.value;viewIndex(inp.value,tab);var n=document.getElementById('q');n.focus();try{n.setSelectionRange(p,p)}catch(e){}});
  app.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){TAB=b.dataset.tab;viewIndex(inp.value,b.dataset.tab)}});
}
var LS_Q='',TAB='all';

function matnHtml(p,used,pi){
  var a=pi===undefined?'':' data-pi="'+pi+'"';
  if(isRef(p))return '<p class="ref"'+a+'>'+txt(p.map(function(s){return s.t}).join(''))+'</p>';
  return '<p class="matn"'+a+'>'+p.map(function(s){if(s.k!=='n'&&used)used[s.k]=1;
    return s.k==='n'?txt(s.t):'<span class="k-'+s.k+'"'+(s.k==='r'?' title="موضع مراجعة"':'')+'>'+txt(s.t)+'</span>'}).join('')+'</p>'}

/* ---------- listening: bundled recordings (one file per hadith, fully offline) ---------- */
var RATES=[['0.75','٠٫٧٥×'],['1','١×'],['1.25','١٫٢٥×']];
function audRate(){var r=String(LS.get('audRate','1'));return RATES.some(function(x){return x[0]===r})?r:'1'}
function fmt(t){t=Math.max(0,Math.floor(t||0));return an(Math.floor(t/60))+':'+an(('0'+t%60).slice(-2))}
var AD=window.AUDIO_DATA||{files:{},dur:{}};
var AUD={n:0,state:'idle',el:null,
  has:function(n){return !!AD.files[n]},
  audio:function(){if(!AUD.el){var e=AUD.el=new Audio();e.preload='auto';
      e.addEventListener('timeupdate',AUD.prog);e.addEventListener('loadedmetadata',AUD.prog);
      e.addEventListener('ended',function(){var nx=AUD.n+1;AUD.finish();
        if(LS.get('autoNext',false)&&H[nx-1]&&AUD.has(nx)){location.hash='#/h/'+nx;setTimeout(function(){AUD.start(nx)},150)}});
      e.addEventListener('error',function(){AUD.state='idle';AUD.ui();toast('تعذّر تشغيل التسجيل')});}
    return AUD.el},
  start:function(n){var e=AUD.audio();if(AUD.n!==n){e.src=AD.files[n];AUD.n=n}AUD.play()},
  play:function(){var e=AUD.audio();e.playbackRate=+audRate();var pr=e.play();AUD.state='playing';AUD.ui();
    if(pr&&pr.catch)pr.catch(function(){AUD.state='idle';AUD.ui();toast('تعذّر تشغيل التسجيل')})},
  pause:function(){if(AUD.el)AUD.el.pause();AUD.state='paused';AUD.ui()},
  stop:function(){if(AUD.el){AUD.el.pause();try{AUD.el.currentTime=0}catch(e){}}AUD.state='idle';AUD.ui();AUD.prog()},
  finish:function(){AUD.state='idle';if(AUD.el)try{AUD.el.currentTime=0}catch(e){}AUD.ui();AUD.prog()},
  prog:function(){var r=document.getElementById('pseek'),t=document.getElementById('ptime');if(!r)return;
    var n=curHadith(),e=AUD.el,mine=e&&AUD.n===n,d=mine&&isFinite(e.duration)&&e.duration?e.duration:(AD.dur[n]||0),c=mine?e.currentTime:0;
    r.max=String(Math.max(1,Math.round(d*10)));if(!r._drag)r.value=String(Math.round(c*10));t.textContent=fmt(c)+' / '+fmt(d)},
  ui:function(){var b=document.getElementById('player');if(!b)return;var n=curHadith(),st=AUD.n===n?AUD.state:'idle';
    b.className='player '+st;
    document.getElementById('pl').innerHTML=st==='playing'?I.pause+'إيقاف مؤقت':(st==='paused'?I.play+'متابعة':I.play+'استماع');
    document.getElementById('pst').hidden=st==='idle';AUD.prog()}
};
function curHadith(){var m=location.hash.match(/^#\/h\/(\d+)/);return m?+m[1]:0}
function onHadith(n){return curHadith()===n}
function playerHtml(n){
  if(!AUD.has(n))return '';
  return '<div class="player idle" id="player"><div class="prow"><button class="btn pbtn" id="pl"></button><button class="btn" id="pst" hidden>'+I.stop+'إيقاف</button>'+
    '<span class="ptime" id="ptime"></span></div><input type="range" class="range pseek" id="pseek" min="0" max="1" value="0" step="1" aria-label="موضع التسجيل" dir="ltr">'+
    '<div class="pinfo">بصوت: '+esc(AD.reader||'')+'</div></div>'}

function viewHadith(n){
  var h=H[n-1];if(!h){location.hash='#/';return}
  setBack(true);
  LS.set('last',n);
  var used={};
  var body=h.paras.map(function(p,pi){return matnHtml(p,used,pi)}).join('');
  var on=bm().indexOf(n)>=0;
  delete used.p;
  var leg=Object.keys(used).map(function(k){return '<i class="k-'+k+'">● '+KN[k]+'</i>'}).join('');
  var notes=h.review.length||D.meta.corrections.some(function(c){return c.n===n})?
    '<details class="notes"><summary>ملاحظات النص</summary><ul>'+h.review.map(function(r){return '<li>'+esc(r)+'</li>'}).join('')+
    D.meta.corrections.filter(function(c){return c.n===n}).map(function(c){return '<li>تصحيح نقل: '+esc(c.note)+'</li>'}).join('')+'</ul></details>':'';
  app.innerHTML='<article class="card"><div class="rhead"><div class="h">'+esc(h.heading)+'</div><h1>'+esc(h.title)+'</h1><div class="pt">'+(h.part==='nawawi'?'من الأربعين النووية':'من زيادات ابن رجب')+'</div></div>'+
    playerHtml(n)+body+
    (leg?'<div class="legend">'+leg+'</div>':'')+
    '<div class="tools"><button class="btn" id="bm" aria-pressed="'+on+'">'+I.star+(on?'محفوظ':'حفظ')+'</button>'+
    '<button class="btn" id="cp">'+I.copy+'نسخ</button><button class="btn" id="sh">'+I.share+'مشاركة</button></div>'+notes+'</article>'+
    '<nav class="pager"><a class="'+(n>1?'':'off')+'" href="#/h/'+(n-1)+'">→ السابق</a><a href="#/">الفهرس</a><a class="'+(n<H.length?'':'off')+'" href="#/h/'+(n+1)+'">التالي ←</a></nav>';
  setTitle(h.heading);
  document.getElementById('bm').onclick=function(){var m=bm(),i=m.indexOf(n);if(i>=0)m.splice(i,1);else m.push(n);m.sort(function(a,b){return a-b});LS.set('bookmarks',m);
    var b=document.getElementById('bm'),o=i<0;b.setAttribute('aria-pressed',String(o));b.innerHTML=I.star+(o?'محفوظ':'حفظ');toast(o?'حُفظ الحديث':'أُزيل من المحفوظة')};
  document.getElementById('cp').onclick=function(){copyText(hadithText(h)).then(function(){toast('تم نسخ الحديث')},function(){toast('تعذّر النسخ')})};
  document.getElementById('sh').onclick=function(){shareText(h.heading,hadithText(h)).catch(function(){})};
  if(AUD.has(n)){
    document.getElementById('pl').onclick=function(){if(AUD.n===n&&AUD.state==='playing')AUD.pause();else if(AUD.n===n&&AUD.state==='paused')AUD.play();else{if(AUD.state!=='idle')AUD.stop();AUD.start(n)}};
    document.getElementById('pst').onclick=function(){AUD.stop()};
    var sk=document.getElementById('pseek');
    sk.addEventListener('input',function(){sk._drag=true;var e=AUD.audio();if(AUD.n!==n){e.src=AD.files[n];AUD.n=n;AUD.state='paused'}
      try{e.currentTime=(+sk.value)/10}catch(x){}document.getElementById('ptime').textContent=fmt((+sk.value)/10)+' / '+fmt(AD.dur[n]||e.duration)});
    sk.addEventListener('change',function(){sk._drag=false;AUD.ui()});
    AUD.ui();
  }
  window.scrollTo(0,0);
}

function viewSettings(){
  setBack(true);
  var t=themePref();
  app.innerHTML='<section class="page"><h1>الإعدادات</h1>'+
   '<div class="row"><span>حجم خط المتن</span><span class="stepper"><button id="dec" aria-label="تصغير">−</button><b id="fsv"></b><button id="inc" aria-label="تكبير">+</button></span></div>'+
   '<input type="range" class="range" id="fsr" min="'+FS_MIN+'" max="'+FS_MAX+'" step="1" value="'+fs()+'" aria-label="حجم خط المتن">'+
   '<div class="sample" aria-label="معاينة بالحجم الحقيقي"><div class="sl">معاينة بالحجم الحقيقي في صفحة الحديث</div>'+matnHtml(H[0].paras[0])+'</div>'+
   '<div class="row"><span>المظهر</span><span class="seg" role="group">'+
     [['auto','تلقائي'],['light','فاتح'],['dark','داكن']].map(function(o){return '<button data-th="'+o[0]+'" aria-pressed="'+(t===o[0])+'">'+o[1]+'</button>'}).join('')+'</span></div>'+
   '<div class="row"><span>إعادة الحجم الافتراضي</span><button class="btn" id="rst">إعادة</button></div>'+
   '<div class="row"><span>سرعة الاستماع</span><span class="seg" role="group">'+RATES.map(function(o){return '<button data-rate="'+o[0]+'" aria-pressed="'+(audRate()===o[0])+'">'+o[1]+'</button>'}).join('')+'</span></div>'+
   '<label class="row"><span>تشغيل الحديث التالي تلقائيًّا</span><input type="checkbox" class="sw" id="autoNext"'+(LS.get('autoNext',false)?' checked':'')+'></label>'+
   '<a class="row link" href="#/privacy"><span>سياسة الخصوصية</span><span aria-hidden="true">←</span></a>'+
   '<div class="row"><span>مسح المحفوظات وموضع القراءة</span><button class="btn" id="clr">مسح</button></div>'+
   '<h2>الألوان</h2><p><span class="k-d">● كلام الله تعالى في الأحاديث القدسية</span><br><span class="k-q">● الآيات القرآنية</span><br>● بقية النص (الإسناد المختصر، والسؤال، وكلام الصحابة) باللون الأساسي.</p>'+
   '<p><a href="#/about">المصدر</a> · <a href="#/terms">شروط الاستخدام</a> · <a href="#/privacy">الخصوصية</a></p>'+
   '<p class="ver">الإصدار '+an(VERSION)+' · Nibras</p></section>';
  var fr=document.getElementById('fsr');
  function upd(){document.getElementById('fsv').textContent=an(fs());fr.value=fs()}upd();
  function setFs(v){LS.set('fontSize',Math.max(FS_MIN,Math.min(FS_MAX,v)));applyFs();upd()}
  document.getElementById('inc').onclick=function(){setFs(fs()+1)};
  document.getElementById('dec').onclick=function(){setFs(fs()-1)};
  fr.addEventListener('input',function(){setFs(+fr.value)});
  document.getElementById('rst').onclick=function(){setFs(FS_DEF)};
  document.getElementById('autoNext').onchange=function(){LS.set('autoNext',this.checked)};
  app.querySelectorAll('[data-rate]').forEach(function(b){b.onclick=function(){LS.set('audRate',b.dataset.rate);if(AUD.el)AUD.el.playbackRate=+b.dataset.rate;
    app.querySelectorAll('[data-rate]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})}});
  document.getElementById('clr').onclick=function(){if(confirm('مسح المحفوظات وموضع القراءة؟')){LS.set('bookmarks',[]);try{localStorage.removeItem('fh.last')}catch(e){}toast('تم المسح')}};
  app.querySelectorAll('[data-th]').forEach(function(b){b.onclick=function(){LS.set('theme',b.dataset.th);applyTheme();themeIcon();
    app.querySelectorAll('[data-th]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b))})}});
  setTitle('الإعدادات');
}
var M=D.meta;
var PAGES={
about:'<h1>المصدر</h1><p>نص الأحاديث الخمسين (الأربعون النووية للإمام النووي، وزيادات الحافظ ابن رجب الحنبلي) مأخوذ من ملف موقع دار الإسلام (IslamHouse):</p><p><a href="'+M.source.page+'" target="_blank" rel="noopener">'+M.source.page+'</a></p>'+
 '<p>وقوبلت العناوين وتمام العدد بنسخة مصورة على الموقع نفسه: «الأربعون النووية مع زيادات ابن رجب» اعتنى بها الشيخ عبد المحسن القاسم.</p>'+
 '<h2>حالة المراجعة</h2><p>نُقل النص كما هو في الملف المصدر دون إكمال للتشكيل. رموز الخط الخاصة حُوّلت: الرمز الخاص بالصلاة إلى «ﷺ»، ورمز الترضي إلى «رضي الله عنه». والتصحيحات القليلة موضحة في «ملاحظات النص» تحت كل حديث.</p>'+
 '<p>تمييز كلام النبي ﷺ بالألوان عمل تحريري يدوي لتيسير القراءة، وليس جزءًا من المتن، وقد تبقى فيه مواضع تحتاج مراجعة. هذا الإصدار تجريبي، ولم يراجعه بعدُ أهل العلم مراجعة كاملة؛ فالمرجع عند الاختلاف النسخ المطبوعة المحققة.</p>'+
 '<h2>الاستماع</h2><p>التسجيلات الصوتية بصوت القارئ إبراهيم الأنصاري، من موقع دار الإسلام (IslamHouse): «قراءة الأربعون النووية مع زيادات ابن رجب». قُسِّم الملف إلى خمسين مقطعًا، لكل حديث مقطع، وضُغط لتقليل الحجم، دون أي تغيير في المحتوى. وهي داخل التطبيق فتعمل دون إنترنت.</p><p><a href="'+(AD.source||'')+'" target="_blank" rel="noopener">'+(AD.source||'')+'</a></p>'+
 '<h2>الخطوط</h2><p>خط المتن «أميري» (Amiri)، وخط الواجهة «نوتو كوفي العربي» (Noto Kufi Arabic)، وكلاهما مرخص برخصة SIL Open Font License 1.1 ومضمَّن في التطبيق.</p>'+
 '<h2>التطبيق</h2><p>تطبيق «الأربعون النووية» من Nibras. يعمل دون اتصال بالإنترنت كليًّا.</p>',
terms:'<h1>شروط الاستخدام</h1><p>هذا التطبيق مجاني، للقراءة الشخصية، بلا إعلانات ولا حسابات.</p><p>النص منقول من مصدر منشور (انظر صفحة «المصدر») مع ذكره، دون تغيير مقصود في المحتوى العلمي. يُقدَّم التطبيق «كما هو» دون ضمان لخلوه من أخطاء النقل أو التشكيل أو التلوين، وعند الشك يُرجع إلى النسخ المطبوعة المحققة وأهل العلم.</p><p>تبقى حقوق النصوص المصدرية لأصحابها وفق شروط موقع المصدر. والروابط الخارجية تُفتح خارج التطبيق وتخضع لشروط مواقعها.</p>',
privacy:''};
function viewPrivacy(l){
  setBack(true);var P=window.PRIVACY_DATA||{};if(!P[l])l='ar';
  var tabs='<div class="tabs langs" role="group">'+Object.keys(P).map(function(k){return '<a href="#/privacy/'+k+'" lang="'+k+'"'+(k===l?' aria-current="page"':'')+'>'+P[k].name+'</a>'}).join('')+'</div>';
  app.innerHTML='<section class="page privacy">'+tabs+'<div lang="'+l+'" dir="'+(P[l]?P[l].dir:'rtl')+'">'+(P[l]?P[l].html:'')+'</div></section>';
  setTitle('الخصوصية');window.scrollTo(0,0)}
function route(){
  if(AUD.state==='playing'&&!onHadith(AUD.n)&&!LS.get('autoNext',false))AUD.pause();
  var h=location.hash.replace(/^#\/?/,'').split('/');
  if(h[0]==='h')viewHadith(parseInt(h[1],10));
  else if(h[0]==='settings')viewSettings();
  else if(h[0]==='privacy')viewPrivacy(h[1]);
  else if(PAGES[h[0]]){setBack(true);app.innerHTML='<section class="page">'+PAGES[h[0]]+'</section>';setTitle('');window.scrollTo(0,0)}
  else viewIndex(LS_Q,TAB);
  themeIcon();
}
window.addEventListener('hashchange',route);
document.addEventListener('keydown',function(e){var m=location.hash.match(/^#\/h\/(\d+)/);if(!m||e.target.tagName==='INPUT')return;var n=+m[1];
  if(e.key==='ArrowLeft'&&n<H.length)location.hash='#/h/'+(n+1);if(e.key==='ArrowRight'&&n>1)location.hash='#/h/'+(n-1)});
/* swipe between hadith (RTL: swipe right = next) */
var sx=null,sy=0;
app.addEventListener('touchstart',function(e){if(e.touches.length!==1)return;sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
app.addEventListener('touchend',function(e){if(sx===null)return;var m=location.hash.match(/^#\/h\/(\d+)/),t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;sx=null;
  if(!m||Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*.6)return;var sel=window.getSelection&&String(window.getSelection());if(sel)return;var n=+m[1];
  if(dx>0&&n<H.length)location.hash='#/h/'+(n+1);else if(dx<0&&n>1)location.hash='#/h/'+(n-1)},{passive:true});
document.getElementById('back').onclick=function(){if(history.length>1&&location.hash&&location.hash!=='#/')history.back();else location.hash='#/'};
document.getElementById('themeBtn').onclick=function(){LS.set('theme',isDark()?'light':'dark');applyTheme();if(/^#\/settings/.test(location.hash))route();else themeIcon()};
route();
if(!CAP&&'serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
window.__FH={norm:norm,isRef:isRef,hadithText:hadithText,AUD:AUD};
})();
