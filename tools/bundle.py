import base64,re,os
os.makedirs('dist',exist_ok=True)
h=open('index.html').read();css=open('src/styles.css').read()
def b64(p):return base64.b64encode(open(p,'rb').read()).decode()
for n in ['Amiri-Regular','Amiri-Bold','NotoKufiArabic-UI']:
  css=css.replace(f'url("../fonts/{n}.woff2")',f'url(data:font/woff2;base64,{b64("fonts/"+n+".woff2")})')
h=h.replace('<link rel="stylesheet" href="src/styles.css">','<style>'+css+'</style>')
h=re.sub(r'<link rel="(manifest|icon)"[^>]*>\n','',h)
h=h.replace('src="icons/icon-96.png"','src="data:image/png;base64,'+b64('icons/icon-96.png')+'"')
h=re.sub(r'<link rel="apple-touch-icon"[^>]*>\n','',h)
h=h.replace('<script src="src/privacy.js"></script>','<script>'+open('src/privacy.js').read()+'</script>')
h=h.replace('<script src="src/data.js"></script>','<script>'+open('src/data.js').read()+'</script>')
h=h.replace('<script src="src/app.js"></script>','<script>'+open('src/app.js').read()+'</script>')
open('dist/fifty-hadith-standalone.html','w').write(h);print(len(h))
