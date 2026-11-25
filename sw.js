const C='fh-v5';const A=['./','index.html','privacy.html','src/styles.css','src/app.js','src/data.js','src/privacy.js','src/audio.js','fonts/Amiri-Regular.woff2','fonts/Amiri-Bold.woff2','fonts/NotoKufiArabic-UI.woff2','icons/favicon-32.png','icons/icon-96.png','icons/icon-192.png','icons/icon-512-rounded.png','manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)))});
