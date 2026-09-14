import re, zlib
data = open('/home/orangepi3/Projects/Resume/resume.pdf','rb').read()
for m in re.finditer(rb'(\d+)\s+(\d+)\s+obj\b', data):
    num = int(m.group(1))
    yield_ = None
for num in range(1, 40):
    mm = re.search((str(num)+r'\s+0\s+obj\b').encode(), data)
    if not mm: continue
    end = data.find(b'endobj', mm.end())
    body = data[mm.end():end]
    head = body[:400]
    print("=== obj", num, "len", len(body))
    print(head.decode('latin-1').replace('\n',' | ')[:400])
