import os
from PIL import Image

ROOT = 'C:/Users/Administrator/Desktop/个人站'
# 按原图原生分辨率导出（不再压缩到 820）：只转 webp，宽度上限设高，实际不缩尺寸
MAXW = 2000
Q = 88
METHOD = 6

JOBS = [
    (os.path.join(ROOT, '.img_bak', 'docs_full'),
     os.path.join(ROOT, 'docs', 'assets', 'img', 'full')),
    (os.path.join(ROOT, '.img_bak', 'website_full'),
     os.path.join(ROOT, '网站制作', 'assets', 'img', 'full')),
]

total = ok = skip = 0
for src_dir, dst_dir in JOBS:
    if not os.path.isdir(src_dir):
        print('SRC_MISSING', src_dir)
        continue
    os.makedirs(dst_dir, exist_ok=True)
    webps = sorted(f[:-5] for f in os.listdir(dst_dir) if f.endswith('.webp'))
    for base in webps:
        srcf = None
        for ext in ('.jpg', '.png', '.webp'):
            cand = os.path.join(src_dir, base + ext)
            if os.path.exists(cand):
                srcf = cand
                break
        if not srcf:
            print('NO_SRC', base)
            skip += 1
            total += 1
            continue
        try:
            im = Image.open(srcf).convert('RGB')
            w, h = im.size
            if w > MAXW:
                nh = int(round(h * MAXW / w))
                im = im.resize((MAXW, nh), Image.LANCZOS)
            out = os.path.join(dst_dir, base + '.webp')
            im.save(out, 'WEBP', quality=Q, method=METHOD)
            ok += 1
        except Exception as e:
            print('FAIL', base, repr(e))
            skip += 1
        total += 1

print('DONE total=%d ok=%d skip=%d' % (total, ok, skip))
