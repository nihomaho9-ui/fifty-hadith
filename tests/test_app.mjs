// UI smoke tests. Run: NODE_PATH=<dir with jsdom> node tests/test_app.mjs
import {createRequire} from 'module';import fs from 'fs';
const require=createRequire(process.env.JSDOM_DIR?process.env.JSDOM_DIR+'/':import.meta.url);
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8').replace(/<script src="src\/(data|app).js"><\/script>/g,'');
const dom=new JSDOM(html,{url:'http://localhost/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.scrollTo=()=>{};
w.eval(fs.readFileSync('src/data.js','utf8'));w.eval(fs.readFileSync('src/privacy.js','utf8'));w.eval(fs.readFileSync('src/audio.js','utf8'));w.eval(fs.readFileSync('src/app.js','utf8'));
const $=s=>w.document.querySelectorAll(s);let fail=0;const ok=(c,m)=>{if(!c){console.log('FAIL',m);fail++}};
const go=h=>{w.location.hash=h;w.dispatchEvent(new w.HashChangeEvent('hashchange'))};
ok($('ol.list li').length===50,'index lists 50');ok($('.matn').length===0,'index has no full text');
ok($('h2.part').length===2,'two parts');
go('#/h/1');ok($('.k-p').length>=1,'prophet speech coloured');ok(w.document.querySelector('.rhead .h').textContent==='الحديث الأول','heading');
ok(w.localStorage.getItem('fh.last')==='1','last read saved');
go('#/h/24');ok($('.matn .k-d').length===1,'qudsi');
go('#/h/1');w.document.getElementById('bm').click();ok(JSON.parse(w.localStorage.getItem('fh.bookmarks')).includes(1),'bookmark');
go('#/');const q=w.document.getElementById('q');q.value='لا تغضب';q.dispatchEvent(new w.Event('input'));
ok($('ol.list li').length>=1&&[...$('ol.list li .num')].some(e=>e.textContent==='١٦'),'search finds 16');
q.value='الطهور';q.dispatchEvent(new w.Event('input'));ok([...$('ol.list li .num')].some(e=>e.textContent==='٢٣'),'search without diacritics');
go('#/settings');w.document.getElementById('inc').click();ok(w.localStorage.getItem('fh.fontSize')==='23','font +');
ok(w.document.documentElement.style.getPropertyValue('--fs')==='23px','font applied');
go('#/h/50');ok(w.document.querySelector('.pager a.off'),'no next on 50');
for(const p of ['about','terms','privacy']){go('#/'+p);ok($('.page h1').length===1,p)}
// added: copy/share buttons, theme
go('#/h/2');ok(w.document.getElementById('cp')&&w.document.getElementById('sh'),'copy/share buttons');
ok(w.__FH.hadithText(w.HADITH_DATA.hadith[0]).startsWith('الحديث الأول'),'share text');
ok(!/\ue000/.test(w.__FH.hadithText(w.HADITH_DATA.hadith[1])),'share text has no PUA');
go('#/settings');w.document.querySelector('[data-th=dark]').click();ok(w.document.documentElement.getAttribute('data-theme')==='dark','dark theme');
w.document.querySelector('[data-th=light]').click();ok(w.document.documentElement.getAttribute('data-theme')==='light','light theme');
ok(w.localStorage.getItem('fh.theme')==='"light"','theme saved');
go('#/');ok(w.document.getElementById('back').hidden===true,'no back on index');
go('#/h/0');ok(w.location.hash==='#/','bad id goes home');
// 1.0.1: legend without the Prophet's-speech label, colouring kept; listen button; live size preview; privacy
go('#/h/1');ok(!w.document.querySelector('.legend')||!/كلام النبي/.test(w.document.querySelector('.legend').textContent),'no prophet legend label');
ok($('.matn .k-p').length>=1,'prophet colouring kept');
ok(w.document.getElementById('pl')&&w.document.getElementById('pseek')&&/الأنصاري/.test(w.document.querySelector('.player').textContent),'audio player');
ok($('[data-pi]').length===w.HADITH_DATA.hadith[0].paras.length,'paragraphs indexed for highlighting');
go('#/settings');const r=w.document.getElementById('fsr');ok(r&&$('.sample .matn').length===1,'size slider + sample');
r.value='30';r.dispatchEvent(new w.Event('input'));ok(w.document.documentElement.style.getPropertyValue('--fs')==='30px','slider applies size live');
ok(w.document.getElementById('fsv').textContent.indexOf('٣٠')===0,'size number shown');
ok(w.document.querySelector('a[href="#/privacy"]'),'privacy link in settings');
go('#/privacy');ok($('.privacy .langs a').length===4&&/الخصوصية/.test(w.document.querySelector('.privacy h1').textContent),'privacy ar');
go('#/privacy/az');ok(/Məxfilik/.test(w.document.querySelector('.privacy h1').textContent),'privacy az');
ok(/nibrascode@gmail.com/.test(w.document.querySelector('.privacy').textContent),'privacy contact');
// 1.0.2: bundled recordings, no Prophet label in the settings colour key
{const A=w.AUDIO_DATA;let bad=0;for(let n=1;n<=50;n++){if(!A.files[n]||!fs.existsSync(A.files[n])||!(A.dur[n]>10))bad++}ok(!bad,'50 audio files with durations');}
go('#/h/50');ok(w.document.getElementById('pseek')&&+w.document.getElementById('pseek').max>0,'seek range on 50');
go('#/settings');ok(!/كلام النبي/.test(w.document.body.textContent),'no prophet label in settings');
ok(w.document.querySelectorAll('[data-rate]').length===3,'speed setting');
console.log(fail?'UI tests FAILED':'UI tests OK');process.exit(fail?1:0);
