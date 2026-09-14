import re, zlib

data = open('/home/orangepi3/Projects/Resume/resume.pdf','rb').read()

def get_stream(num):
    m = re.search((r'(?<![0-9])'+str(num)+r'\s+0\s+obj\b').encode(), data)
    if not m: return None, None
    s = data.find(b'stream', m.end())
    if s == -1: return None, None
    hdr = data[m.end():s]
    s += 6
    if data[s:s+2] == b'\r\n': s += 2
    elif data[s:s+1] == b'\n': s += 1
    e = data.rfind(b'endstream', s, data.find(b'endobj', s))
    raw = data[s:e]
    if b'FlateDecode' in hdr:
        raw = zlib.decompress(raw)
    return hdr, raw

# --- parse ToUnicode CMaps (obj 19 = regular, obj 24 = bold) ---
def parse_cmap(raw):
    txt = raw.decode('latin-1')
    mapping = {}
    # bfchar
    for blk in re.findall(r'beginbfchar(.*?)endbfchar', txt, re.S):
        for src, dst in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>', blk):
            mapping[int(src,16)] = ''.join(chr(int(dst[i:i+4],16)) for i in range(0,len(dst),4))
    # bfrange  <lo> <hi> [<a><b>...]
    for blk in re.findall(r'beginbfrange(.*?)endbfrange', txt, re.S):
        for lo, hi, rest in re.findall(r'<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(\[.*?\]|<[0-9A-Fa-f]+>)', blk, re.S):
            lo_i, hi_i = int(lo,16), int(hi,16)
            if rest.startswith('['):
                items = re.findall(r'<([0-9A-Fa-f]+)>', rest)
                for i, it in enumerate(items):
                    mapping[lo_i+i] = ''.join(chr(int(it[j:j+4],16)) for j in range(0,len(it),4))
            else:
                dst = rest.strip('<>')
                # increment last UTF-16 code unit
                base = [int(dst[j:j+4],16) for j in range(0,len(dst),4)]
                for i in range(hi_i-lo_i+1):
                    codes = base[:]
                    codes[-1] += i
                    mapping[lo_i+i] = ''.join(chr(c) for c in codes)
    return mapping

_, c19 = get_stream(19)
_, c24 = get_stream(24)
cmap_reg = parse_cmap(c19)
cmap_bold = parse_cmap(c24)
print("cmap reg entries:", len(cmap_reg), "bold:", len(cmap_bold))

hdr12, content = get_stream(12)
print("content len", len(content))
open('/home/orangepi3/Projects/Resume/_tools/content.txt','wb').write(content)
print(content[:1500].decode('latin-1'))
