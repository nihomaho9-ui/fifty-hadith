import re,json,hashlib
SRC='/workspace/50hadith-sources/ar_Forty_Nawawi_Hadith.txt'
raw=open(SRC,encoding='utf-8').read().lstrip('\ufeff')
ORD=['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر']
lines=raw.split('\n')
idx=[i for i,l in enumerate(lines) if re.match(r'^الحديث [^"]+$',l.strip()) or re.match(r'^الحديث \S+( و\S+)? "',l.strip())]
out=[]
for k,i in enumerate(idx):
  blk=lines[i:(idx[k+1] if k+1<len(idx) else len(lines))]
  head=blk[0].strip()
  m=re.match(r'^(الحديث [^"]+?)\s*(".*")?\s*$',head)
  heading=m.group(1).strip(); title=m.group(2)
  rest=[l.rstrip() for l in blk[1:]]
  if title is None:
    while rest and not rest[0].strip(): rest.pop(0)
    title=rest.pop(0).strip()
  body=[l.strip() for l in rest if l.strip()]
  out.append(dict(n=k+1,heading=heading,title=title.strip().strip('"').strip(),paras=body))
json.dump(out,open('data/raw_parsed.json','w'),ensure_ascii=False,indent=1)
print(len(out))
for h in out: print(h['n'],h['heading'],'|',h['title'],'|',len(h['paras']))
