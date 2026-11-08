import json,re,sys,unicodedata
sys.path.insert(0,'tools')
d=json.load(open('data/hadith.json'));H=d['hadith']
raw=json.load(open('data/raw_parsed.json'))
ORD='الأول الثاني الثالث الرابع الخامس السادس السابع الثامن التاسع العاشر'.split()
def ok(c,m):
  if not c: print('FAIL',m);sys.exit(1)
ok(len(H)==50,'count 50');ok([h['n'] for h in H]==list(range(1,51)),'order')
ok(sum(h['part']=='nawawi' for h in H)==42,'42 nawawi')
ok(H[49]['heading']=='الحديث الخمسون','last heading')
ok(len(set(h['heading'] for h in H))==50,'unique headings')
def clean(t): return t.replace('\uf072','ﷺ').replace('\uf074','\ue000').replace('\u200d','')
for h,r in zip(H,raw):
  for p,rp in zip(h['paras'],r['paras']):
    joined=''.join(s['t'] for s in p);exp=clean(rp)
    if h['n']==46: exp=exp.replace('حَرَام"ٌ','حَرَامٌ"')
    ok(joined==exp,f"{h['n']} text preserved exactly")
    for s in p:
      ok(s['t'],'non-empty seg')
      if s['k']!='n': ok(not unicodedata.combining(s['t'][0]),f"{h['n']} seg starts on base char")
  ks={s['k'] for p in h['paras'] for s in p}
  ok('p' in ks or 'd' in ks,f"{h['n']} has speech")
  ok(not any(re.search('[\uf000-\uf0ff]',s['t'])  for p in h['paras'] for s in p),'no PUA')
# qudsi hadith carry divine segments
for n in (24,38,42): ok(any(s['k']=='d' for p in H[n-1]['paras'] for s in p),f'{n} divine')
for n in (10,29): ok(any(s['k']=='q' for p in H[n-1]['paras'] for s in p),f'{n} quran')
# narrator openings never coloured
for h in H: ok(h['paras'][0][0]['k']=='n' and h['paras'][0][0]['t'].startswith('عَنْ'),f"{h['n']} isnad neutral")
# companion saying in 40 stays neutral
ok(any(s['k']=='n' and 'إذَا أَمْسَيْتَ' in s['t'] for s in H[39]['paras'][0]),'ibn umar neutral')
# jibril's questions neutral in 2
ok(all('أَخْبِرْنِي' not in s['t'] for s in H[1]['paras'][0] if s['k']=='p'),'jibril neutral')
print('data tests OK')
