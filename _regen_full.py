import os
from PIL import Image

ROOT = 'C:/Users/Administrator/Desktop/个人站'
src = os.path.join(ROOT, '.img_bak', 'docs_full')
dst = os.path.join(ROOT, 'docs', 'assets', 'img', 'full')
MAXW = 820   # 长图宽度上限（790 源保持、1464 源缩到 820），均小于 webp 16383 边长上限
Q = 80
METHOD = 4

webps = sorted(f[:-5] for f in os.listdir(dst) if f.endswith('.webp'))
ok = skip = 0
for base in webps:
    srcf = None
    for ext in ('.jpg', '.png', '.webp'):
        cand = os.path.join(src, base + ext)
        if os.path.exists(cand):
            srcf = cand
            break
    if not srcf:
        print('NO_SRC', base)
        skip += 1
        continue
    try:
        im = Image.open(srcf).convert('RGB')
        w, h = im.size
        if w > MAXW:
            nh = int(round(h * MAXW / w))
            im = im.resize((MAXW, nh), Image.LANCZOS)
        out = os.path.join(dst, base + '.webp')
        im.save(out, 'WEBP', quality=Q, method=METHOD)
        ok += 1
    except Exception as e:
        print('FAIL', base, repr(e))
        skip += 1

print('DONE total=%d ok=%d skip=%d' % (len(webps), ok, skip))
