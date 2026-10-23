import os
from PIL import Image

ROOT = 'C:/Users/Administrator/Desktop/个人站'
Q = 85
METHOD = 6

# 显示上限(CSS px)，必须与 style.css 一致：
#   竖图 .lb.lb--tall .lb__fig img -> max-width:min(86vw,820px)
#   横图 .lb__fig img               -> max-width:min(88vw,1100px)
CAP_TALL = 820
CAP_LAND = 1100

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
            cap = CAP_TALL if h >= w else CAP_LAND
            target_w = max(w, int(round(2 * cap)))  # 2x 显示尺寸 => 2倍屏 1:1 清晰
            nh = int(round(h * target_w / w))
            # WebP 单边上限 16383px：超出则等比缩到上限内
            limit = 16383
            if nh > limit or target_w > limit:
                scale = limit / max(nh, target_w)
                target_w = int(round(target_w * scale))
                nh = int(round(nh * scale))
            if target_w > w or nh > h:
                im = im.resize((target_w, nh), Image.LANCZOS)
            out = os.path.join(dst_dir, base + '.webp')
            im.save(out, 'WEBP', quality=Q, method=METHOD)
            ok += 1
        except Exception as e:
            print('FAIL', base, repr(e))
            skip += 1
        total += 1

print('DONE total=%d ok=%d skip=%d' % (total, ok, skip))
