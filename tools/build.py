import json,hashlib,sys,re
sys.path.insert(0,'tools');from spans import S
src=json.load(open('data/raw_parsed.json'))
SRCF='/workspace/50hadith-sources/ar_Forty_Nawawi_Hadith.txt'
sha=hashlib.sha256(open('/workspace/50hadith-sources/ar_Forty_Nawawi_Hadith.doc','rb').read()).hexdigest()
corr=[]
import unicodedata
def canon(t):
  # sort combining marks inside each cluster; return canonical string and map canon idx->orig idx
  out=[];mp=[];i=0
  while i<len(t):
    j=i+1
    while j<len(t) and unicodedata.combining(t[j]): j+=1
    cl=t[i]+''.join(sorted(t[i+1:j]))
    for k,ch in enumerate(cl): out.append(ch);mp.append(i if k==0 else j-1)
    i=j
  mp.append(len(t));return ''.join(out),mp
def find(t,a,start):
  ct,mp=canon(t);ca,_=canon(a)
  ci=next((k for k in range(len(mp)) if mp[k]>=start),len(ct))
  r=ct.find(ca,ci)
  if r<0: return -1,-1
  e=r+len(ca)
  return mp[r], (mp[e] if e<len(mp)-1 else len(t)) if e<len(ct) else len(t)
def clean(t,n):
  o=t
  t=t.replace('\uf072','ﷺ').replace('\uf074','\ue000').replace('\u200d','')
  if n==46 and 'حَرَام"ٌ' in t: t=t.replace('حَرَام"ٌ','حَرَامٌ"');corr.append((n,'نقل التنوين قبل علامة التنصيص: «حَرَام"ٌ» ← «حَرَامٌ"»'))
  return t
out=[]
for h in src:
  n=h['n'];paras=[clean(p,n) for p in h['paras']]
  title=h['title']
  if title.startswith('االطهور'): title=title[1:];corr.append((n,'حذف ألف زائدة في العنوان «االطهور»'))
  # split reference: last para starting with رواه/حديث or trailing "رَوَاهُ" inside para
  segsP=[[] for _ in paras];flags=[]
  pos=[0]*len(paras);spans=[[] for _ in paras]
  for (pi,a,b,ty,note) in S[n]:
    t=paras[pi];i,j=find(t,a,pos[pi])
    if i<0: raise SystemExit(f'{n}: start not found {a}')
    if b is not None:
      k,j=find(t,b,i)
      if k<0: raise SystemExit(f'{n}: end not found {b}')
    spans[pi].append((i,j,ty));pos[pi]=j
    if note: flags.append(note)
  P=[]
  for pi,t in enumerate(paras):
    segs=[];c=0
    for i,j,ty in sorted(spans[pi]):
      if i<c: raise SystemExit(f'{n}: overlap')
      if i>c: segs.append({'t':t[c:i],'k':'n'})
      segs.append({'t':t[i:j],'k':{'prophet':'p','divine':'d','quran':'q','review':'r'}[ty]});c=j
    if c<len(t): segs.append({'t':t[c:],'k':'n'})
    P.append(segs)
  out.append({'n':n,'heading':h['heading'],'title':title,'paras':P,'review':flags,'part':'nawawi' if n<=42 else 'ibnrajab'})
meta={'title':'الأربعون النووية وزيادات ابن رجب','source':{'page':'https://islamhouse.com/ar/books/5271/','file':'https://d1.islamhouse.com/data/ar/ih_books/parts/Forty_Nawawi_Hadith/ar_Forty_Nawawi_Hadith.doc','sha256':sha,'check_pdf':'https://d1.islamhouse.com/data/ar/ih_books/parts/Forty_Nawawi_Hadith/ar_Forty_Nawawi_Hadith_alQasim.pdf'},
 'symbols':{'U+F072':'ﷺ','U+F074':'رضي الله عنه (رمز في خط المصدر، يُعرض نصًّا)','U+200D':'حُذف'},'corrections':[{'n':a,'note':b} for a,b in corr]}
json.dump({'meta':meta,'hadith':out},open('data/hadith.json','w'),ensure_ascii=False,indent=1)
open('src/data.js','w').write('window.HADITH_DATA='+json.dumps({'meta':meta,'hadith':out},ensure_ascii=False)+';\n')
print('ok',len(out),corr)
