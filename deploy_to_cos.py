# -*- coding: utf-8 -*-
"""
一键把本地 docs/ 上传到腾讯云 COS（用于静态网站托管）
==================================================
适用：你已经按说明在腾讯云建好「公有读」存储桶，并开了「静态网站托管」。

用法：
  1. 安装依赖：  pip install cos-python-sdk-v5
  2. 把下面「配置区」四项填成你自己的（控制台都能看到）
  3. 运行：      python deploy_to_cos.py

⚠️ 安全：SECRET_ID / SECRET_KEY 是你的 API 密钥，
   别发给别人、别提交到 GitHub（本文件不要进版本库）。
   用完可以删，或到腾讯云控制台「API 密钥」里禁用。
==================================================
"""
import os
from qcloud_cos import CosConfig, CosS3Client

# ===================== 在这里填你自己的 =====================
SECRET_ID  = 'AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'   # 腾讯云「访问管理→API密钥管理」里的 SecretId
SECRET_KEY = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'        # 对应的 SecretKey
REGION     = 'ap-chengdu'                              # 存储桶所在地域，如 ap-chengdu / ap-shanghai / ap-beijing
BUCKET     = 'my-portfolio-1250000000'                 # 桶名-APPID（控制台「存储桶列表」里那一串）
LOCAL_DIR  = 'docs'                                    # 要上传的本地目录（相对本脚本位置）
# ============================================================

# 若还是占位值，提醒后退出，避免误传
if SECRET_ID.startswith('AKIDxxxx') or BUCKET.startswith('my-portfolio'):
    print('请先把脚本顶部「配置区」填成你自己的 SecretId / SecretKey / 地域 / 桶名，再运行。')
    raise SystemExit(1)

# 常见静态资源 MIME 映射（COS 默认猜测有时会错，这里显式指定）
EXT_MIME = {
    '.html': 'text/html', '.htm': 'text/html',
    '.css':  'text/css',  '.js':  'application/javascript',
    '.json': 'application/json', '.xml': 'application/xml',
    '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico':  'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
    '.ttf':  'font/ttf', '.mp4': 'video/mp4', '.webm': 'video/webm',
}

if not os.path.isdir(LOCAL_DIR):
    print('找不到本地目录：%s（请把本脚本放在个人站根目录，与 docs/ 同级）' % LOCAL_DIR)
    raise SystemExit(1)

config = CosConfig(Region=REGION, SecretId=SECRET_ID, SecretKey=SECRET_KEY)
client = CosS3Client(config)

count = 0
for root, _, files in os.walk(LOCAL_DIR):
    for fn in files:
        local = os.path.join(root, fn)
        key = os.path.relpath(local, LOCAL_DIR).replace(os.sep, '/')  # 以桶根为基准
        ext = os.path.splitext(fn)[1].lower()
        mime = EXT_MIME.get(ext, 'application/octet-stream')
        with open(local, 'rb') as f:
            client.put_object(
                Bucket=BUCKET,
                Body=f,
                Key=key,
                ContentType=mime,
                ACL='public-read',          # 公有读，别人才能直接打开
            )
        count += 1
        if count % 10 == 0 or count == 1:
            print('  已传 %d 个：%s' % (count, key))

print('\n✅ 上传完成，共 %d 个文件。' % count)
print('----------------------------------------------------------------')
print('访问地址（开「静态网站托管」后用这个，最规范）：')
print('  https://%s.cos-website.%s.myqcloud.com/' % (BUCKET, REGION))
print('对象直链（没开静态托管也能用）：')
print('  https://%s.cos.%s.myqcloud.com/' % (BUCKET, REGION))
print('----------------------------------------------------------------')
print('提示：第一次打开若 403，回去确认存储桶访问权限是「公有读」。')
