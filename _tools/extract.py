import re, zlib, sys, collections

data = open('/home/orangepi3/Projects/Resume/resume.pdf','rb').read()
print("size", len(data))

# find all objects
objs = {}
for m in re.finditer(rb'(\d+)\s+(\d+)\s+obj\b', data):
    num = int(m.group(1))
    objs[num] = m.end()

print("num objects", len(objs))

def get_obj_dict(num):
    start = objs.get(num)
    if start is None: return None
    end = data.find(b'endobj', start)
    return data[start:end]

# find streams
streams = []
for m in re.finditer(rb'(\d+)\s+(\d+)\s+obj\b(.*?)stream\r?\n', data, re.S):
    num = int(m.group(1))
    hdr = m.group(2)
    sstart = m.end()
    # find endstream
    e = data.find(b'endstream', sstart)
    raw = data[sstart:e]
    streams.append((num, hdr, raw))

print("streams", len(streams))
for num, hdr, raw in streams:
    flate = b'FlateDecode' in hdr
    print(num, hdr[:120].replace(b'\n',b' '), len(raw), "flate" if flate else "")
