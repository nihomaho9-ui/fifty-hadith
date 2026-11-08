// UI smoke tests. Run: NODE_PATH=<dir with jsdom> node tests/test_app.mjs
import {createRequire} from 'module';import fs from 'fs';
const require=createRequire(process.env.JSDOM_DIR?process.env.JSDOM_DIR+'/':import.meta.url);
const {JSDOM}=require('jsdom');
const html=fs.readFileSync('index.html','utf8').replace(/<script src="src\/(data|app).js"><\/script>/g,'');
const dom=new JSDOM(html,{url:'http://localhost/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;w.scrollTo=()=>{};
w.eval(fs.readFileSync('src/data.js','utf8'));w.eval(fs.readFileSync('src/app.js','utf8'));
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
console.log(fail?'UI tests FAILED':'UI tests OK');process.exit(fail?1:0);
