# -*- coding: utf-8 -*-
"""生成作品集网站所需的两套尺寸图片（卡片图 + 灯箱大图）。"""
import os
import shutil
from PIL import Image, ImageOps

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, '网站制作', 'assets', 'img')
OUT_FULL = os.path.join(OUT, 'full')
os.makedirs(OUT_FULL, exist_ok=True)

# slug, 源文件, 类型
ITEMS = [
    # 电商主图
    ('main-toothbrush-cn',  '主图/1 (1).png', 'normal'),
    ('main-toothbrush-en',  '主图/4 (2).png', 'normal'),
    ('main-dior-mist-01',   '主图/1 (2).png', 'normal'),
    ('main-dior-mist-02',   '主图/5.png', 'normal'),
    ('main-lipstick-scene', '主图/1 (3).png', 'normal'),
    ('main-lipstick-silk',  '主图/1 (4).png', 'normal'),
    ('main-lipstick-en',    '主图/8.png', 'normal'),
    ('main-lipstick-velvet','主图/2.jpg', 'normal'),
    ('main-headphone',      '主图/1 (5).png', 'normal'),
    ('main-typec',          '主图/1.png', 'normal'),
    ('main-powerbank-lotso','主图/111.png', 'normal'),
    ('main-powerbank-disney','主图/222.jpg', 'normal'),
    ('main-smartwatch',     '主图/爆款首图.png', 'normal'),
    # 详情页
    ('detail-thermos',      'C4D详情/保温杯详情页.png', 'tall'),
    ('detail-powerbank',    'C4D详情/充电宝详情页.png', 'tall'),
    ('detail-watch',        'C4D详情/智能手表详情页.jpg', 'tall'),
    ('detail-fan-retro',    'C4D详情/详情页 拷贝.jpg', 'tall'),
    ('detail-fan-green',    'C4D详情/风扇详情页.jpg', 'tall'),
    ('aplus-usb',           'AIGC详情页/亚马逊A+U盘.png', 'aplus'),
    ('aplus-lipstick',      'AIGC详情页/亚马逊A+口红.png', 'aplus'),
    ('aplus-headphone',     'AIGC详情页/亚马逊A+头戴式耳机.png', 'aplus'),
    ('detail-lipstick',     'AIGC详情页/口红详情页.png', 'tall'),
    ('detail-serum',        'AIGC详情页/维特丝愈创木精华液详情页.png', 'tall'),
    # 海报
    ('poster-humidifier',   '海报/加湿器雨林海报_文案版.png', 'portrait'),
    ('poster-watch-wrist',  '海报/手表电商海报_文案版.png', 'portrait'),
    ('poster-watch-track',  '海报/手表运动场景海报_文案版.png', 'portrait'),
    ('poster-phone',        '海报/手机银灰人物海报_无文字版.png', 'portrait'),
    ('poster-national',     '海报/国庆.jpeg', 'portrait'),
    ('poster-classroom',    '海报/教室.png', 'portrait'),
    ('poster-campus',       '海报/campus-poster-photo-2.png', 'portrait'),
    # 三维渲染
    ('render-lancome',      '建模渲染/5.jpg', 'normal'),
    ('render-humidifier',   '建模渲染/渲染.jpg', 'normal'),
    ('render-humidifier-clay','建模渲染/2.png', 'normal'),
    ('render-powerbank',    '建模渲染/0SKU4 拷贝.jpg', 'normal'),
    ('render-thermos',      '建模渲染/渲染3 拷贝.jpg', 'normal'),
    # 白膜（注：白膜1.png 是精华液 3:4 竖图，膜.png 是充电宝方图——按宽高比与成片配对）
    ('wire-powerbank',      '建模渲染/膜.png', 'normal'),
    ('wire-thermos',        '建模渲染/白膜.png', 'normal'),
    ('wire-lancome',        '建模渲染/白膜1.png', 'normal'),
    # 精修前后（用高保真规则，避免缩小/压缩导致文字发虚）
    ('retouch-lipstick-before', '精修/口红修前.jpg', 'retouch'),
    ('retouch-lipstick-after',  '精修/口红修后.jpg', 'retouch'),
    ('retouch-lock-before', '精修/智能门锁修前.jpg', 'retouch'),
    ('retouch-lock-after',  '精修/智能门锁修后.jpg', 'retouch'),
    ('retouch-emulsion-before', '精修/精华乳修前.jpg', 'retouch'),
    ('retouch-emulsion-after',  '精修/精华乳修后.jpg', 'retouch'),
    ('retouch-serum-before','精修/精华液修前.jpg', 'retouch'),
    ('retouch-serum-after', '精修/精华液修后.jpg', 'retouch'),
]

# 各类型的卡片图尺寸（宽上限, 长边上限）与大图尺寸
CARD_RULES = {
    'normal':   (1300, 1400),
    'portrait': (1100, 1500),
    'aplus':    (1100, 3000),
    'tall':     (700, 20000),
    'retouch':  (1500, 2400),
}
FULL_RULES = {
    'normal':   (2000, 2200),
    'portrait': (1600, 2200),
    'aplus':    (1500, 4200),
    'tall':     (1000, 40000),
    'retouch':  (1800, 3000),
}


def resize_to(im, max_w, max_h):
    w, h = im.size
    scale = min(max_w / w, max_h / h, 1.0)
    if scale < 1.0:
        im = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    return im


def save_jpg(im, path, quality):
    im.convert('RGB').save(path, 'JPEG', quality=quality, optimize=True, progressive=True)


# 小文件原样拷贝（零质量损失）；大文件按「原分辨率」重编码（不降尺寸，只降体积）
MAX_COPY_BYTES = 600 * 1024


def emit(src_path, im, out_path, max_w, max_h, quality):
    w, h = im.size
    scale = min(max_w / w, max_h / h, 1.0)
    if scale >= 1.0:
        if src_path.lower().endswith(('.jpg', '.jpeg')) and os.path.getsize(src_path) <= MAX_COPY_BYTES:
            shutil.copyfile(src_path, out_path)
            return im
        out = im
    else:
        out = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    save_jpg(out, out_path, quality)
    return out


manifest = []
for slug, src, kind in ITEMS:
    p = os.path.join(ROOT, src)
    if not os.path.exists(p):
        print('MISSING', src)
        continue
    im = ImageOps.exif_transpose(Image.open(p))
    im = im.convert('RGB')

    cw, ch = CARD_RULES[kind]
    card_path = os.path.join(OUT, slug + '.jpg')
    card = emit(p, im.copy(), card_path, cw, ch, 95 if kind == 'retouch' else (86 if kind == 'tall' else 90))

    fw, fh = FULL_RULES[kind]
    full_path = os.path.join(OUT_FULL, slug + '.jpg')
    full = emit(p, im, full_path, fw, fh, 95 if kind == 'retouch' else (86 if kind == 'tall' else 90))

    manifest.append((slug, kind, im.size, card.size, full.size,
                     os.path.getsize(card_path) // 1024, os.path.getsize(full_path) // 1024))

# 简历图
resume_src = os.path.join(ROOT, '黎相涛 · 个人简历.png')
if os.path.exists(resume_src):
    im = Image.open(resume_src).convert('RGB')
    im = resize_to(im, 1500, 2200)
    save_jpg(im, os.path.join(OUT, 'resume.jpg'), 88)
    print('resume', im.size)

print(f'{"slug":26s} {"kind":9s} {"src":12s} {"card":12s} {"full":12s} {"KB":>5s} {"KB":>5s}')
for m in manifest:
    print(f'{m[0]:26s} {m[1]:9s} {m[2][0]}x{m[2][1]:<6d} {m[3][0]}x{m[3][1]:<6d} {m[4][0]}x{m[4][1]:<6d} {m[5]:>5d} {m[6]:>5d}')
print('total files', len(manifest))
