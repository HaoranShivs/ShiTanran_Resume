import re, zlib
PDF='/home/orangepi3/Projects/Resume/resume.pdf'
data=open(PDF,'rb').read()
def get_stream(num):
    m=re.search((r'(?<![0-9])'+str(num)+r'\s+0\s+obj\b').encode(),data)
    s=data.find(b'stream',m.end()); hdr=data[m.end():s]; s+=6
    if data[s:s+2]==b'\r\n': s+=2
    elif data[s:s+1]==b'\n': s+=1
    e=data.rfind(b'endstream',s,data.find(b'endobj',s)); raw=data[s:e]
    if b'FlateDecode' in hdr: raw=zlib.decompress(raw)
    return raw
def parse_cmap(raw):
    txt=raw.decode('latin-1'); mp={}
    for blk in re.findall(r'beginbfchar(.*?)endbfchar',txt,re.S):
        for s_,d_ in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>',blk):
            mp[int(s_,16)]=''.join(chr(int(d_[i:i+4],16)) for i in range(0,len(d_),4))
    for blk in re.findall(r'beginbfrange(.*?)endbfrange',txt,re.S):
        for lo,hi,rest in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(\[.*?\]|<[0-9A-Fa-f]+>)',blk,re.S):
            l,h=int(lo,16),int(hi,16)
            if rest.startswith('['):
                for i,it in enumerate(re.findall(r'<([0-9A-Fa-f]+)>',rest)):
                    mp[l+i]=''.join(chr(int(it[j:j+4],16)) for j in range(0,len(it),4))
            else:
                st=rest.strip('<>'); base=[int(st[j:j+4],16) for j in range(0,len(st),4)]
                for i in range(h-l+1):
                    c=base[:]; c[-1]+=i; mp[l+i]=''.join(chr(v) for v in c)
    return mp
CM6=parse_cmap(get_stream(19))
CM7=parse_cmap(get_stream(24))

def widths(num):
    body=data[re.search((str(num)+r'\s+0\s+obj').encode(),data).end():]
    body=body[:body.find(b'endobj')].decode('latin-1')
    w={}; m=re.search(r'/W\s*\[(.*)', body, re.S)
    if not m: return w
    arr=m.group(1).split('/')[0]
    arr=arr[:arr.rfind(']')]
    toks=re.findall(r'\[([^\]]*)\]|(-?[\d.]+)', arr)
    flat=[]; i=0
    seq=[]
    for a,b in toks:
        if a: seq.append(('l',[float(v) for v in a.split()]))
        else: seq.append(('n',float(b)))
    idx=0
    while idx < len(seq):
        k,v=seq[idx]
        if k=='n' and idx+1<len(seq) and seq[idx+1][0]=='l':
            start=int(v)
            for j,wv in enumerate(seq[idx+1][1]): w[start+j]=wv
            idx+=2
        elif k=='n' and idx+1<len(seq) and seq[idx+1][0]=='n':
            start=int(v); end=int(seq[idx+1][1]); wv=seq[idx+2][1]
            for c in range(start,end+1): w[c]=wv
            idx+=3
        else: idx+=1
    return w
W6=widths(18); W7=widths(23)
FONTS={'F6':(W6,CM6),'F7':(W7,CM7)}

content=get_stream(12).decode('latin-1')
# tokenizer
tok=re.compile(r'<([0-9A-Fa-f]+)>|\((?:\\.|[^\\()])*\)|\[|\]|/[^\s/\[\]()<>]+|-?\d*\.?\d+|[A-Za-z\'"*]+')
stack=[]; items=[]
tm=[1,0,0,1,0,0]; tlm=tm[:]
font='F6'; fs=14
def mul(a,b):
    return [a[0]*b[0]+a[1]*b[2], a[0]*b[1]+a[1]*b[3],
            a[2]*b[0]+a[3]*b[2], a[2]*b[1]+a[3]*b[3],
            a[4]*b[0]+a[5]*b[2]+b[4], a[4]*b[1]+a[5]*b[3]+b[5]]
for m in tok.finditer(content):
    t=m.group(0)
    if t=='BT':
        tm=[1,0,0,1,0,0]; tlm=tm[:]; stack=[]
    elif t=='ET': stack=[]
    elif t in ('Tj','TJ','Td','TD','Tm','Tf','T*',"'",'"','Tc','Tw','Tz','TL','Ts','Tr'):
        op=t
        if op=='Tf':
            font='/'+stack[-2].lstrip('/'); fs=float(stack[-1])
            font=font.lstrip('/')
        elif op=='Tm':
            tm=[float(v) for v in stack[-6:]]; tlm=tm[:]
        elif op in ('Td','TD'):
            tx,ty=float(stack[-2]),float(stack[-1])
            tlm=mul([1,0,0,1,tx,ty],tlm); tm=tlm[:]
        elif op=='T*':
            tlm=mul([1,0,0,1,0,-14],tlm); tm=tlm[:]
        elif op in ('Tj','TJ',"'",'"'):
            s=''
            if op=='Tj':
                h=stack[-1]
                CMX=FONTS.get(font,(W6,CM6))[1]
                s=''.join(CMX.get(int(h[i:i+4],16),'?') for i in range(0,len(h),4))
            elif op=='TJ':
                for e in stack[0] if isinstance(stack[0],list) else []:
                    pass
            if s:
                W=FONTS.get(font,(W6,CM6))[0]
                widths_used=[]
                for i in range(0,len(stack[-1]),4) if op=='Tj' else []:
                    pass
                x,y=tm[4],tm[5]
                adv=sum(W.get(int(h,16),1000) for h in [stack[-1][i:i+4] for i in range(0,len(stack[-1]),4)])/1000.0*fs
                items.append((round(y,1),round(x,1),round(fs,1),font,s))
                tm=mul([1,0,0,1,adv,0],tm)
        stack=[]
    else:
        if t.startswith('<') and t.endswith('>'):
            stack.append(t[1:-1])
        elif t.startswith('('):
            stack.append(t[1:-1])
        elif t.startswith('/'):
            stack.append(t)
        elif t=='[':
            stack.append([])
        else:
            try: stack.append(float(t))
            except: stack.append(t)
open('/home/orangepi3/Projects/Resume/_tools/items.txt','w').write(
    '\n'.join(f"{y}\t{x}\t{fs}\t{f}\t{s}" for y,x,fs,f,s in sorted(items,key=lambda r:(-r[0],r[1]))))
print("items:",len(items))
