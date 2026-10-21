# -*- coding: utf-8 -*-
"""把站内图片转成 WebP 并限制到实际显示所需尺寸，体积砍到原来的 1/3 左右。"""
import os
from PIL import Image

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docs', 'assets', 'img')


def target_width(name, is_full):
    stem = os.path.basename(name)
    if is_full:
        return 900
    if stem.startswith('detail-') or stem.startswith('aplus-'):
        return 700            # 卡片宽度约 350px，2x 屏 700 够用；高度保留，悬停还要往下滚
    if stem.startswith('retouch-'):
        return 1100           # 精修对比滑块偏大
    if stem.startswith('resume'):
        return 1000
    return 800                # keyvisual / poster / render / wire


def convert(folder, is_full=False):
    files = [f for f in sorted(os.listdir(folder)) if f.lower().endswith('.jpg')]
    before = after = 0
    rows = []
    for f in files:
        src = os.path.join(folder, f)
        dst = os.path.splitext(src)[0] + '.webp'
        before += os.path.getsize(src)
        im = Image.open(src)
        im.load()
        if im.mode != 'RGB':
            im = im.convert('RGB')
        tw = target_width(f, is_full)
        if im.width > tw:
            nh = max(1, round(im.height * tw / im.width))
            im = im.resize((tw, nh), Image.LANCZOS)
        im.save(dst, 'WEBP', quality=82, method=6)
        sz = os.path.getsize(dst)
        after += sz
        rows.append((f, im.size, os.path.getsize(src) // 1024, sz // 1024))
    for f, size, b, a in rows:
        print(f'{f:34s} {size[0]:>4}x{size[1]:<6} {b:>5}KB -> {a:>4}KB  ({a*100//max(b,1)}%)')
    print(f'--- {folder}\n    合计 {before//1024}KB -> {after//1024}KB  ({after*100//max(before,1)}%)\n')
    return before, after


b1, a1 = convert(BASE, False)
b2, a2 = convert(os.path.join(BASE, 'full'), True)
print(f'总：{(b1+b2)//1024}KB -> {(a1+a2)//1024}KB')
