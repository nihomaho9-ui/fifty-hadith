import base64,re,os
os.makedirs('dist',exist_ok=True)
h=open('index.html').read();css=open('src/styles.css').read()
for n in ['Regular','Bold']:
  b=base64.b64encode(open(f'fonts/Amiri-{n}.woff2','rb').read()).decode()
  css=css.replace(f'url("../fonts/Amiri-{n}.woff2")',f'url(data:font/woff2;base64,{b})')
h=h.replace('<link rel="stylesheet" href="src/styles.css">','<style>'+css+'</style>')
h=re.sub(r'<link rel="(manifest|icon)"[^>]*>\n','',h)
h=h.replace('<script src="src/data.js"></script>','<script>'+open('src/data.js').read()+'</script>')
h=h.replace('<script src="src/app.js"></script>','<script>'+open('src/app.js').read()+'</script>')
open('dist/fifty-hadith-standalone.html','w').write(h);print(len(h))
