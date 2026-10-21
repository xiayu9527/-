/* =========================================================
   黎相涛 · 作品集 2026 — 交互脚本
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 图片版本号：图片有改动时 +1，强制浏览器丢弃旧缓存 */
  var V = '?v=3';

  /* ---------------- 作品数据 ---------------- */
  var CAT_NAME = { keyvisual: '电商主图', detail: '详情页', poster: '海报', render: '三维渲染' };

  var WORKS = [
    /* ---------- 电商主图 ---------- */
    {
      slug: 'main-toothbrush-cn', cat: 'keyvisual', span: 3, ar: 1,
      title: '双色情侣智能牙刷', tag: '国内电商主图',
      desc: '柔光冷调配双层圆形展台，把「情侣成对」在画面里直接说清；卖点图标靠左排，右侧留呼吸。'
    },
    {
      slug: 'main-toothbrush-en', cat: 'keyvisual', span: 3, ar: 1,
      title: 'Couple Clean Set 英文版', tag: '出海改版',
      desc: '同一套渲染资产做英文版：换标题区、换图标语言，产品位不动——改版最省时间的做法。'
    },
    {
      slug: 'main-dior-mist-01', cat: 'keyvisual', span: 3, ar: 1,
      title: '净澈粉雾光 · 喷雾精华', tag: '美妆主图',
      desc: '水波与花瓣做底，金属盖单独打高光；粉色瓶身的磨砂质感靠一层粗糙度贴图撑住。'
    },
    {
      slug: 'main-dior-mist-02', cat: 'keyvisual', span: 3, ar: 1,
      title: '精致净护日常 · 场景版', tag: '美妆主图',
      desc: '从桌面场景切进来，补一层虚化窗光；卖点拆成三个场景标签，信息多但不挤。'
    },
    {
      slug: 'main-lipstick-scene', cat: 'keyvisual', span: 3, ar: 1,
      title: '从早到晚 从容出色', tag: '人物场景主图',
      desc: '人物场景占上半屏，产品摆在金色托盘上；早中晚三个时间点用圆形小图串起来，讲使用场景。'
    },
    {
      slug: 'main-lipstick-silk', cat: 'keyvisual', span: 3, ar: 1,
      title: '一抹丝滑 高级显色', tag: '美妆主图',
      desc: '红丝绒背景压暗，只留两道边光刮出管身轮廓；膏体的丝绒感靠高粗糙度加低高光。'
    },
    {
      slug: 'main-lipstick-en', cat: 'keyvisual', span: 3, ar: 1,
      title: 'Silky Matte Lipstick 英文版', tag: '出海改版',
      desc: '英文版重排版式：标题上移、卖点改用胶囊标签，留白更多，适合首页主图位。'
    },
    {
      slug: 'main-lipstick-velvet', cat: 'keyvisual', span: 3, ar: 1,
      title: 'Velvet Matte 黑金', tag: '美妆主图',
      desc: '亮面管身要反射环境又不能糊：大面积柔光箱加一根细长条光，金属才有拉丝的方向感。'
    },
    {
      slug: 'main-headphone', cat: 'keyvisual', span: 3, ar: 1,
      title: '沉浸静界 自在聆听', tag: '3C 主图',
      desc: '深色科技场景，环形光带做视觉引导；耳罩皮革做细颗粒凹凸，金属转轴给一点冷光。'
    },
    {
      slug: 'main-typec', cat: 'keyvisual', span: 3, ar: 1,
      title: 'Type-C 即刻扩展', tag: '3C 主图',
      desc: '小件产品最怕没存在感：同心圆底台加大留白把它「抬」起来，橙色接口做画面唯一跳色。'
    },
    {
      slug: 'main-powerbank-lotso', cat: 'keyvisual', span: 3, ar: 1,
      title: 'LOTSO 自带双线充电宝', tag: '3C 主图',
      desc: '马卡龙粉整套配色，产品斜切摆放，线材盘在机身下——把「自带线」这个卖点变成构图。'
    },
    {
      slug: 'main-powerbank-disney', cat: 'keyvisual', span: 3, ar: 1,
      title: '迪士尼磁吸充电宝', tag: '3C 主图',
      desc: '冷蓝底压住彩色 IP；磁吸、双线、USB 三个接口在画面里都看得见，卖点不用文字硬说。'
    },
    {
      slug: 'main-smartwatch', cat: 'keyvisual', span: 3, ar: 1,
      title: '一表掌握运动与健康', tag: '3C 主图',
      desc: '表盘 UI 做亮，周围功能图标用细线引出；深灰背景让屏幕成为画面里唯一的光源。'
    },

    /* ---------- 详情页 ---------- */
    {
      slug: 'detail-thermos', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '316 保温杯', tag: 'C4D 详情页',
      desc: '内胆、温度屏、木纹桌面——从材质特写拉到使用场景，十几屏讲完一个杯子。'
    },
    {
      slug: 'detail-powerbank', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '快充充电宝', tag: 'C4D 详情页',
      desc: '容量、接口、快充协议逐屏拆解；产品角度按功能点换，避免整页都是同一个 45°。'
    },
    {
      slug: 'detail-watch', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '智能手表', tag: 'C4D 详情页',
      desc: '表盘 UI 逐屏放大，运动、健康、续航分模块讲；深色页面让屏幕内容始终是主角。'
    },
    {
      slug: 'detail-fan-retro', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '复古循环扇', tag: 'C4D 详情页',
      desc: '红金配色，风感用气流线条表达；结构拆解屏做半透明剖面，看得见电机和扇叶。'
    },
    {
      slug: 'detail-fan-green', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '手持小风扇', tag: 'C4D 详情页',
      desc: '清爽绿色系，从手持场景切到桌面场景；风力和续航用图形化表达，不堆文字。'
    },
    {
      slug: 'aplus-usb', cat: 'detail', span: 4, ar: 0.7, tall: true,
      title: 'Doublepow U 盘 · 亚马逊 A+', tag: '亚马逊 A+',
      desc: 'A+ 模块化版式：品牌条加三宫格再加场景图，尺寸按平台规范留足安全边。'
    },
    {
      slug: 'aplus-lipstick', cat: 'detail', span: 4, ar: 0.7, tall: true,
      title: '哑光口红 · 亚马逊 A+', tag: '亚马逊 A+',
      desc: '暗红丝绒统一调性，五个模块从质地讲到色号，图文比例控制在平台建议区间内。'
    },
    {
      slug: 'aplus-headphone', cat: 'detail', span: 4, ar: 0.7, tall: true,
      title: '头戴耳机 · 亚马逊 A+', tag: '亚马逊 A+',
      desc: '深色科技风：产品大图加参数图标再加佩戴场景，模块之间靠留白分隔而不是分割线。'
    },
    {
      slug: 'detail-lipstick', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '哑光口红 · 国内详情页', tag: 'AIGC 详情页',
      desc: '从氛围首屏到质地实拍，再到多场景人群；整页色彩统一在暗红一套里。'
    },
    {
      slug: 'detail-serum', cat: 'detail', span: 3, ar: 0.72, tall: true,
      title: '愈创木精华液', tag: 'AIGC 详情页',
      desc: '成分、质地、使用步骤、对比实验——二十屏信息密度不低，但节奏不能乱。'
    },

    /* ---------- 海报 ---------- */
    {
      slug: 'poster-humidifier', cat: 'poster', span: 4, ar: 0.75,
      title: '森呼吸 润生活', tag: '产品海报',
      desc: '雨林实景加冷雾，产品放在苔藓石上；背景虚化压到 f2.8 的感觉，让白机身跳出来。'
    },
    {
      slug: 'poster-watch-wrist', cat: 'poster', span: 4, ar: 0.75,
      title: '智能随行 健康由我', tag: '产品海报',
      desc: '腕上场景，浅米色背景加侧逆光；表盘内容做亮，和皮肤拉开明度差。'
    },
    {
      slug: 'poster-watch-track', cat: 'poster', span: 4, ar: 0.75,
      title: '燃动每一刻', tag: '场景海报',
      desc: '跑道低机位仰拍加强光，产品悬空、投影落在跑道上；运动感靠光比，不靠动效。'
    },
    {
      slug: 'poster-phone', cat: 'poster', span: 4, ar: 0.75,
      title: '银灰人物 · 无字版', tag: '人物海报',
      desc: '银灰背景配半身人物，手机压在画面中心；一块柔光把机身纹理的菱形线条提出来。'
    },
    {
      slug: 'poster-national', cat: 'poster', span: 4, ar: 0.75,
      title: '喜迎国庆', tag: '节日海报',
      desc: '红旗做前景框，金色立体字压在城楼上；暖调统一，节日感堆在材质上而不是堆元素。'
    },
    {
      slug: 'poster-classroom', cat: 'poster', span: 4, ar: 0.75,
      title: '阳光记得我们来过', tag: '校园海报',
      desc: '一束斜射光穿过窗户，灰尘颗粒可见；文案压在画面下三分之一，克制一点更像海报。'
    },
    {
      slug: 'poster-campus', cat: 'poster', span: 4, ar: 0.75,
      title: '风把夏天吹得很长', tag: '校园海报',
      desc: '操场日落，暖橙天空压住冷绿草地；细体文案居中，留白留给天空。'
    },

    /* ---------- 三维渲染 ---------- */
    {
      slug: 'render-lancome', cat: 'render', span: 4, ar: 0.75,
      title: '玻璃 · 流体 · 色散', tag: '材质渲染',
      desc: '玻璃瓶身加流动的透明介质，靠折射率和色散做出厚度；三瓶横置，倒影留在地面。'
    },
    {
      slug: 'render-humidifier', cat: 'render', span: 4, ar: 0.75,
      title: '加湿器 · 卧室场景', tag: '场景渲染',
      desc: '暖光从右侧进来，雾气用体积雾做；和床头软包的绒面质感形成一层对比。'
    },
    {
      slug: 'render-humidifier-clay', cat: 'render', span: 4, ar: 0.75,
      title: '白模光影测试', tag: '过程稿',
      desc: '同一场景不贴材质，只看形体和光影关系——光位对了，才进最终渲染。'
    },
    {
      slug: 'render-powerbank', cat: 'render', span: 4, ar: 0.75,
      title: 'LOTSO 充电宝', tag: '产品渲染',
      desc: '粉色亚克力场景，两个角度同框；亮面壳体的高光要干净，所以灯箱开得很大。'
    },
    {
      slug: 'render-thermos', cat: 'render', span: 4, ar: 0.75,
      title: '316 保温杯 · 俯视', tag: '产品渲染',
      desc: '绿色桌面做背景，俯视构图；杯口不锈钢的反射里能看到环境，接触阴影单独补一层。'
    }
  ];

  /* 精修前后 */
  var RETOUCH = [
    { before: 'retouch-lipstick-before', after: 'retouch-lipstick-after', title: 'BOBBI BROWN 口红', meta: 'REPAIR / METAL / BACKGROUND' },
    { before: 'retouch-lock-before', after: 'retouch-lock-after', title: '智能门锁', meta: 'CLEAN / BRUSH / SHADOW' },
    { before: 'retouch-emulsion-before', after: 'retouch-emulsion-after', title: '精华乳', meta: 'LABEL / HIGHLIGHT / CONTACT' },
    { before: 'retouch-serum-before', after: 'retouch-serum-after', title: '精华液', meta: 'GLASS / BUBBLE / GRADIENT' }
  ];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var pad2 = function (n) { return n < 10 ? '0' + n : '' + n; };

  /* ---------------- 渲染作品网格 ---------------- */
  var grid = $('#worksGrid');
  var cards = [];

  WORKS.forEach(function (w, i) {
    var el = document.createElement('article');
    el.className = 'work' + (w.tall ? ' work--tall' : '');
    el.style.setProperty('--span', w.span);
    el.style.setProperty('--ar', w.ar);
    el.dataset.cat = w.cat;
    el.dataset.idx = i;

    el.innerHTML =
      '<div class="work__media">' +
        '<img src="assets/img/' + w.slug + '.jpg' + V + '" alt="' + w.title + '｜' + w.tag + '" loading="lazy" decoding="async" width="1000" height="' + Math.round(1000 / w.ar) + '">' +
        '<span class="work__cat">' + w.tag + '</span>' +
        '<div class="work__info">' +
          '<h3>' + w.title + '</h3>' +
          '<p>' + w.desc + '</p>' +
          '<span class="work__view">VIEW PROJECT ↗</span>' +
        '</div>' +
        '<button class="work__open" data-cursor="VIEW" aria-label="查看作品：' + w.title + '"></button>' +
      '</div>';

    el.dataset.cursorHost = '1';
    grid.appendChild(el);
    cards.push({ el: el, data: w, img: el.querySelector('img'), media: el.querySelector('.work__media') });
  });

  $('#workTotal').textContent = WORKS.length;

  /* ---------------- 长图悬停滚动 ---------------- */
  if (canHover) {
    cards.forEach(function (c) {
      if (!c.data.tall) return;
      c.el.addEventListener('mouseenter', function () {
        var mediaH = c.media.clientHeight;
        var imgH = c.img.naturalWidth
          ? (c.img.naturalHeight / c.img.naturalWidth) * c.media.clientWidth
          : c.img.getBoundingClientRect().height;
        var overflow = Math.max(0, imgH - mediaH);
        var shift = Math.min(overflow, 3400);
        var dur = Math.min(9, Math.max(2.6, shift / 700));
        c.el.style.setProperty('--shift', -shift + 'px');
        c.el.style.setProperty('--dur', dur + 's');
      });
    });
  }

  /* ---------------- 分类筛选 ---------------- */
  var filterBar = $('#filters');
  var currentList = [];
  var timers = [];

  function setFilter(key) {
    timers.forEach(clearTimeout);
    timers = [];

    cards.forEach(function (c) {
      var match = key === 'all' || c.data.cat === key;
      if (match) {
        c.el.classList.remove('is-hidden');
        requestAnimationFrame(function () { c.el.classList.remove('is-out'); });
      } else {
        c.el.classList.add('is-out');
        var t = setTimeout(function () { c.el.classList.add('is-hidden'); }, 220);
        timers.push(t);
      }
    });

    currentList = WORKS.map(function (w, i) { return i; }).filter(function (i) {
      return key === 'all' || WORKS[i].cat === key;
    });
    $('#workTotal').textContent = currentList.length;
  }

  filterBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.filter');
    if (!btn) return;
    $$('.filter', filterBar).forEach(function (b) {
      b.classList.toggle('is-on', b === btn);
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
    setFilter(btn.dataset.filter);
  });

  currentList = WORKS.map(function (w, i) { return i; });

  /* ---------------- 灯箱 ---------------- */
  var lb = $('#lb'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'), lbTag = $('#lbTag'),
      lbDesc = $('#lbDesc'), lbIndex = $('#lbIndex'), lbTotal = $('#lbTotal');
  var lbPos = 0;

  function openLb(idx) {
    lbPos = currentList.indexOf(idx);
    if (lbPos < 0) lbPos = 0;
    paintLb();
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    $('#lbClose').focus({ preventScroll: true });
  }

  function paintLb() {
    var idx = currentList[lbPos];
    var w = WORKS[idx];
    if (!w) return;
    lbImg.src = 'assets/img/full/' + w.slug + '.jpg' + V;
    lbImg.alt = w.title + '｜' + w.tag;
    lbTitle.textContent = w.title;
    lbTag.textContent = CAT_NAME[w.cat] + ' / ' + w.tag;
    lbDesc.textContent = w.desc;
    lbIndex.textContent = pad2(lbPos + 1);
    lbTotal.textContent = pad2(currentList.length);
    lb.classList.toggle('lb--tall', !!w.tall);
    $('#lbStage').scrollTop = 0;
  }

  function closeLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  }

  function stepLb(dir) {
    lbPos = (lbPos + dir + currentList.length) % currentList.length;
    paintLb();
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.work__open');
    if (!btn) return;
    var art = btn.closest('.work');
    openLb(parseInt(art.dataset.idx, 10));
  });

  $('#lbClose').addEventListener('click', closeLb);
  $('#lbPrev').addEventListener('click', function () { stepLb(-1); });
  $('#lbNext').addEventListener('click', function () { stepLb(1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.id === 'lbStage') closeLb();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') stepLb(-1);
    if (e.key === 'ArrowRight') stepLb(1);
  });

  /* ---------------- 简历灯箱 ---------------- */
  var resumeLb = $('#resumeLb'), resumeClose = $('#resumeClose');
  function openResume() {
    resumeLb.classList.add('is-open');
    resumeLb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    resumeClose.focus({ preventScroll: true });
  }
  function closeResume() {
    resumeLb.classList.remove('is-open');
    resumeLb.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
  }
  $$('[data-resume]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      openResume();
    });
  });
  resumeClose.addEventListener('click', closeResume);
  resumeLb.addEventListener('click', function (e) {
    if (e.target === resumeLb || e.target.id === 'resumeStage') closeResume();
  });
  document.addEventListener('keydown', function (e) {
    if (resumeLb.classList.contains('is-open') && e.key === 'Escape') closeResume();
  });

  /* ---------------- 白膜 / 成片 ---------------- */
  $$('.pair').forEach(function (pair) {
    var frame = pair.querySelector('.pair__frame');

    if (canHover) {
      frame.addEventListener('pointermove', function (e) {
        var r = frame.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width) * 100;
        frame.style.setProperty('--px', Math.max(0, Math.min(100, x)) + '%');
      });
      frame.addEventListener('pointerleave', function () {
        frame.style.setProperty('--px', '0%');
        pair.classList.remove('is-on');
      });
    } else {
      frame.addEventListener('click', function () {
        pair.classList.toggle('is-on');
      });
    }
  });

  /* ---------------- 修前 / 修后 滑块 ---------------- */
  var rg = $('#retouchGrid');
  RETOUCH.forEach(function (r, i) {
    var el = document.createElement('article');
    el.className = 'ba';
    el.dataset.cursor = 'DRAG';
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'slider');
    el.setAttribute('aria-label', r.title + ' 修前修后对比');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');
    el.setAttribute('aria-valuenow', '50');
    el.innerHTML =
      '<img class="ba__after" src="assets/img/' + r.after + '.jpg' + V + '" alt="' + r.title + ' 精修后" loading="lazy">' +
      '<div class="ba__before"><img src="assets/img/' + r.before + '.jpg' + V + '" alt="' + r.title + ' 精修前" loading="lazy"></div>' +
      '<span class="ba__tag ba__tag--l">修前 BEFORE</span>' +
      '<span class="ba__tag ba__tag--r">修后 AFTER</span>' +
      '<div class="ba__handle" aria-hidden="true"></div>' +
      '<div class="ba__cap"><h3>' + r.title + '</h3><p>' + r.meta + '</p></div>';
    rg.appendChild(el);

    var dragging = false;
    function setP(clientX) {
      var rect = el.getBoundingClientRect();
      var p = ((clientX - rect.left) / rect.width) * 100;
      p = Math.max(2, Math.min(98, p));
      el.style.setProperty('--p', p + '%');
      el.setAttribute('aria-valuenow', Math.round(p));
    }
    el.addEventListener('pointerdown', function (e) {
      dragging = true;
      el.setPointerCapture && el.setPointerCapture(e.pointerId);
      setP(e.clientX);
    });
    el.addEventListener('pointermove', function (e) {
      if (dragging) setP(e.clientX);
    });
    el.addEventListener('pointerup', function () { dragging = false; });
    el.addEventListener('pointercancel', function () { dragging = false; });
    el.addEventListener('keydown', function (e) {
      var now = parseFloat(el.getAttribute('aria-valuenow')) || 50;
      if (e.key === 'ArrowLeft') { e.preventDefault(); el.style.setProperty('--p', Math.max(2, now - 3) + '%'); el.setAttribute('aria-valuenow', Math.round(Math.max(2, now - 3))); }
      if (e.key === 'ArrowRight') { e.preventDefault(); el.style.setProperty('--p', Math.min(98, now + 3) + '%'); el.setAttribute('aria-valuenow', Math.round(Math.min(98, now + 3))); }
    });
  });

  /* ---------------- 载入动画 ---------------- */
  var loader = $('#loader'), loaderNum = $('#loaderNum'), loaderBar = $('#loaderBar');
  var pct = 0;
  var tick = setInterval(function () {
    pct = Math.min(100, pct + Math.random() * 18 + 6);
    loaderNum.textContent = pad2(Math.round(pct));
    loaderBar.style.transform = 'scaleX(' + pct / 100 + ')';
    if (pct >= 100) {
      clearInterval(tick);
      setTimeout(function () {
        loader.classList.add('is-done');
        document.body.classList.add('is-ready');
        setTimeout(function () { loader.style.display = 'none'; }, 1100);
      }, 220);
    }
  }, 110);
  if (reduceMotion) { clearInterval(tick); loader.classList.add('is-done'); loader.style.display = 'none'; }

  /* ---------------- 滚动相关 ---------------- */
  var head = $('#head'), progressBar = $('#progressBar');
  var darkZones = ['#process', '#contact'].map(function (s) { return document.querySelector(s); }).filter(Boolean);
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    head.classList.toggle('is-scrolled', y > 24);

    /* 滚到深色区块时页头反色 */
    var probe = head.offsetHeight / 2;
    var onDark = darkZones.some(function (z) {
      var r = z.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    head.classList.toggle('is-dark', onDark);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* 入场 */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var items = $$('[data-reveal].is-in').length;
      en.target.style.transitionDelay = Math.min(items * 45, 180) + 'ms';
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* 导航高亮 */
  var navLinks = $$('[data-nav]');
  var secIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var id = en.target.id;
      navLinks.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['works', 'process', 'retouch', 'about', 'contact'].forEach(function (id) {
    var s = document.getElementById(id);
    if (s) secIo.observe(s);
  });

  /* ---------------- 自定义光标 ---------------- */
  if (canHover && !reduceMotion) {
    document.documentElement.classList.add('has-cursor');
    var cur = $('#cursor'), ring = $('#cursorRing'), dot = $('#cursorDot'), label = $('#cursorLabel');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      if (!cur.classList.contains('is-on')) cur.classList.add('is-on');
    }, { passive: true });

    window.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });

    (function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest('[data-cursor], .work__media, a, button');
      if (!t) {
        cur.classList.remove('is-hover');
        return;
      }
      var lb2 = t.getAttribute && t.getAttribute('data-cursor');
      if (lb2) {
        label.textContent = lb2;
        cur.classList.add('is-hover');
      } else if (t.closest('.work__media')) {
        label.textContent = 'VIEW';
        cur.classList.add('is-hover');
      } else {
        cur.classList.remove('is-hover');
      }
      var dark = t.closest('.process, .contact, .lb, .pair, .ba');
      cur.classList.toggle('is-dark', !!dark);
    });
  }

  /* ---------------- 复制 ---------------- */
  var toast = $('#toast'), toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }
  function copyText(txt) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(function () { showToast('已复制：' + txt); },
        function () { fallbackCopy(txt); });
    } else {
      fallbackCopy(txt);
    }
  }
  function fallbackCopy(txt) {
    var ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showToast('已复制：' + txt); }
    catch (err) { showToast('复制失败，请手动选择'); }
    document.body.removeChild(ta);
  }
  $$('[data-copy]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      copyText(el.dataset.copy);
    });
  });

  /* 回到顶部 */
  $('#toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

})();
