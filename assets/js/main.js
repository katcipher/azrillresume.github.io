/* ==========================================================================
   Azrill Muhammad Hakimi — Portfolio interactions
   No libraries: everything below is plain JavaScript.
   Portfolio content (albums / videos) lives in portfolio-data.js.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var pad2 = function (n) { return String(n).padStart(2, '0'); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var desktop = window.matchMedia('(min-width: 861px)');

  var vw = window.innerWidth;
  var vh = window.innerHeight;

  /* ------------------------------------------------------------------
     1. Portfolio: build album cards + video cards from portfolio-data.js
     ------------------------------------------------------------------ */
  var DATA = window.PORTFOLIO || { albums: [], videos: [] };
  var IMG_DIR = 'assets/img/albums/';
  var fullOf = function (file) { return IMG_DIR + file; };
  var thumbOf = function (file) { return IMG_DIR + 'thumbs/' + file.replace(/\.[^.]+$/, '') + '.webp'; };
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  // If a thumbnail is missing, quietly fall back to the full-size photo.
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.dataset.full && !t.dataset.fellBack) {
      t.dataset.fellBack = '1';
      t.src = t.dataset.full;
    }
  }, true);

  function renderPortfolio() {
    var albumsEl = $('[data-albums]');
    var videosEl = $('[data-videos]');
    var variants = ['', 'invert', ''];

    if (albumsEl) {
      albumsEl.innerHTML = DATA.albums.map(function (a, i) {
        var images = a.images || [];
        var cover = (a.cover && a.cover.length ? a.cover : images.map(function (x) { return x.file; })).slice(0, 3);
        var accent = i % 3 === 2;
        return (
          '<article class="album' + (accent ? ' album--accent' : '') + '" style="--n:' + i + '" data-reveal>' +
            '<div class="album__inner ' + variants[i % 3] + '" data-album="' + i + '" data-cursor="Open">' +
              '<div class="album__text">' +
                '<div class="album__top mono"><b>' + pad2(i + 1) + '</b><span>' + esc(a.category) + '</span><span>· ' + images.length + ' photo' + (images.length === 1 ? '' : 's') + '</span></div>' +
                '<div><h3 class="album__title">' + esc(a.title) + '</h3>' + (a.blurb ? '<p class="album__blurb">' + esc(a.blurb) + '</p>' : '') + '</div>' +
                '<button class="btn album__open" type="button"><span class="btn__label">Open album</span>' + ARROW + '</button>' +
              '</div>' +
              '<div class="album__pile" aria-hidden="true">' +
                cover.map(function (file) {
                  return '<div class="print"><img src="' + esc(thumbOf(file)) + '" data-full="' + esc(fullOf(file)) + '" alt="" loading="lazy" decoding="async"></div>';
                }).join('') +
              '</div>' +
            '</div>' +
          '</article>'
        );
      }).join('');
    }

    if (videosEl) {
      videosEl.innerHTML = DATA.videos.map(function (v, i) {
        return (
          '<button class="video" type="button" data-video="' + i + '" data-cursor="Play" data-reveal style="--d:' + (i % 2) * 0.12 + 's" aria-label="Play video: ' + esc(v.title) + '">' +
            '<span class="video__media"><img src="' + esc(v.poster || ('https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg')) + '" alt="" loading="lazy" decoding="async">' +
              '<span class="video__play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 3.5v17l14-8.500Z"/></svg></span></span>' +
            '<span class="video__meta"><span class="mono">' + pad2(i + 1) + '</span><span><span class="video__title">' + esc(v.title) + '</span>' +
              (v.tag ? '<span class="video__tag mono">' + esc(v.tag) + '</span>' : '') + '</span></span>' +
          '</button>'
        );
      }).join('');
    }

    var ac = $('[data-album-count]');
    var vc = $('[data-video-count]');
    if (ac) ac.textContent = DATA.albums.length;
    if (vc) vc.textContent = DATA.videos.length;
  }

  /* ------------------------------------------------------------------
     2. Text splitting (word masks, character masks, scrub words)
     ------------------------------------------------------------------ */
  function splitWords(el, scrub) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            if (scrub) {
              var s = document.createElement('span');
              s.className = 'sw';
              s.textContent = part;
              frag.appendChild(s);
              i++;
              return;
            }
            var w = document.createElement('span');
            w.className = 'w';
            var inner = document.createElement('span');
            inner.className = 'w__i';
            inner.style.setProperty('--i', i++);
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') {
          walk(n);
        }
      });
    })(el);
    return i;
  }

  function splitChars(el) {
    var text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function (ch, i) {
      var c = document.createElement('span');
      c.className = 'c';
      c.style.setProperty('--i', i);
      c.textContent = ch;
      el.appendChild(c);
    });
  }

  function prepareText() {
    $$('[data-split]').forEach(function (el) { splitWords(el, false); });
    $$('[data-scrub]').forEach(function (el) { splitWords(el, true); });
    $$('[data-chars]').forEach(splitChars);
    // Rolling button labels: duplicate the label so it can roll on hover
    $$('.btn__label').forEach(function (label) {
      var text = label.textContent;
      label.textContent = '';
      for (var k = 0; k < 2; k++) {
        var s = document.createElement('span');
        s.textContent = text;
        if (k) s.setAttribute('aria-hidden', 'true');
        label.appendChild(s);
      }
    });
    // Stagger children inside [data-stagger]
    $$('[data-stagger]').forEach(function (group) {
      $$('[data-reveal]', group).forEach(function (child, i) {
        if (!child.style.getPropertyValue('--d')) child.style.setProperty('--d', (i * 0.08).toFixed(2) + 's');
      });
    });
  }

  /* ------------------------------------------------------------------
     3. Reveal on scroll + number count-up
     ------------------------------------------------------------------ */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var pad = parseInt(el.dataset.pad || '0', 10);
    var fmt = function (v) {
      var s = v.toFixed(decimals);
      return pad ? s.padStart(pad, '0') : s;
    };
    if (reduced) { el.textContent = fmt(target); return; }
    var start = null;
    var dur = 1800;
    (function tick(now) {
      if (start === null) start = now;
      var p = clamp((now - start) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(target * e);
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  }

  function startReveals() {
    var targets = $$('[data-reveal], [data-split], [data-hero-name], .skill-row');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        $$('[data-count]', el).forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     4. Intro loader
     ------------------------------------------------------------------ */
  function runLoader(done) {
    var el = $('.loader');
    if (!el || reduced) { root.classList.add('is-loaded'); done(); return; }
    var count = $('.loader__count', el);
    var bar = $('.loader__bar i', el);
    var fontsReady = false;
    var ready = function () { fontsReady = true; };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready); else ready();
    setTimeout(ready, 2500);
    var start = performance.now();
    var dur = 1250;
    (function tick(now) {
      var t = clamp((now - start) / dur, 0, 1);
      var p = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      if (!fontsReady) p = Math.min(p, 0.93);
      count.textContent = String(Math.round(p * 100)).padStart(3, '0');
      bar.style.setProperty('--p', p.toFixed(3));
      if (p < 1) { requestAnimationFrame(tick); return; }
      setTimeout(function () {
        root.classList.add('is-loaded');
        setTimeout(done, 380);
      }, 180);
    })(start);
  }

  /* ------------------------------------------------------------------
     5. The frame loop: smoothed scroll value shared by every effect
     ------------------------------------------------------------------ */
  var scrollY = window.pageYOffset;
  var smoothY = scrollY;
  var velocity = 0;
  var direction = 1;
  var maxScroll = 1;
  var tickers = [];
  var measurers = [];

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    maxScroll = Math.max(1, root.scrollHeight - vh);
    measurers.forEach(function (fn) { fn(); });
  }

  function frame(now) {
    var y = window.pageYOffset;
    if (y !== scrollY) direction = y > scrollY ? 1 : -1;
    scrollY = y;
    smoothY = reduced ? y : lerp(smoothY, y, 0.1);
    if (Math.abs(y - smoothY) < 0.05) smoothY = y;
    velocity = y - smoothY;
    for (var i = 0; i < tickers.length; i++) tickers[i](now);
    requestAnimationFrame(frame);
  }

  /* --- progress bar + nav behaviour --- */
  function initChrome() {
    var bar = $('.progress');
    var nav = $('.nav');
    var lastY = scrollY;
    tickers.push(function () {
      if (bar) bar.style.transform = 'scaleX(' + clamp(scrollY / maxScroll, 0, 1).toFixed(4) + ')';
      if (!nav) return;
      nav.classList.toggle('is-stuck', scrollY > 24);
      var delta = scrollY - lastY;
      if (Math.abs(delta) > 6) {
        nav.classList.toggle('is-hidden', delta > 0 && scrollY > 500 && !root.classList.contains('menu-open'));
        lastY = scrollY;
      }
    });

    // Active link
    var links = $$('.nav__links a');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.id === 'skills' ? 'about' : entry.target.id;
          if (entry.isIntersecting && map[id]) {
            links.forEach(function (a) { a.classList.remove('is-active'); });
            map[id].classList.add('is-active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      $$('main section[id]').forEach(function (s) { io.observe(s); });
    }
  }

  /* --- mobile menu --- */
  function initMenu() {
    var btn = $('[data-menu-toggle]');
    var menu = $('#menu');
    if (!btn || !menu) return;
    var label = $('[data-menu-label]', btn);
    function set(open) {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      btn.setAttribute('aria-expanded', String(open));
      root.classList.toggle('menu-open', open);
      root.classList.toggle('is-locked', open);
      if (label) label.textContent = open ? 'Close' : 'Menu';
    }
    btn.addEventListener('click', function () { set(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) { set(false); btn.focus(); }
    });
    desktop.addEventListener('change', function (e) { if (e.matches) set(false); });
  }

  /* --- hero: lines slide apart, letters compress, portrait floats --- */
  function initHero() {
    var hero = $('.hero');
    var name = $('[data-hero-name]');
    if (!hero || !name) return;
    var l1 = $('.hero__line--1', name);
    var l2 = $('.hero__line--2', name);
    var portrait = $('[data-hero-portrait]');
    var foot = $('[data-hero-foot]');
    var heroH = hero.offsetHeight;
    var mx = 0, my = 0, px = 0, py = 0, lastP = -1;
    measurers.push(function () { heroH = hero.offsetHeight; });

    if (finePointer && !reduced) {
      hero.addEventListener('pointermove', function (e) {
        mx = e.clientX / vw - 0.5;
        my = e.clientY / vh - 0.5;
      });
      hero.addEventListener('pointerleave', function () { mx = 0; my = 0; });
    }

    tickers.push(function () {
      if (reduced || smoothY > heroH + 50) return;
      var p = clamp(smoothY / heroH, 0, 1);
      px = lerp(px, mx, 0.06);
      py = lerp(py, my, 0.06);
      if (portrait) {
        portrait.style.transform = 'translate3d(' + (px * -26).toFixed(2) + 'px,' + (py * -20 - p * 90).toFixed(2) + 'px,0) rotate(' + (px * 3 - p * 5).toFixed(2) + 'deg)';
      }
      if (Math.abs(p - lastP) < 0.0005) return;
      lastP = p;
      l1.style.transform = 'translate3d(' + (-p * 16).toFixed(2) + 'vw,0,0)';
      l2.style.transform = 'translate3d(' + (p * 12).toFixed(2) + 'vw,0,0)';
      name.style.setProperty('--wdth', (100 - p * 38).toFixed(1));
      if (foot) foot.style.opacity = clamp(1 - p * 1.8, 0, 1).toFixed(3);
    });
  }

  /* --- marquee: constant drift that speeds up and reverses with scroll --- */
  function initMarquees() {
    $$('[data-marquee]').forEach(function (m) {
      var track = $('.marquee__track', m);
      var group = $('.marquee__group', m);
      if (!track || !group) return;
      var w = group.offsetWidth;
      var copies = Math.max(2, Math.ceil((vw * 2) / Math.max(1, w)) + 1);
      for (var i = 1; i < copies; i++) track.appendChild(group.cloneNode(true));
      var x = 0, visible = true, last = performance.now(), dir = -1;
      measurers.push(function () { w = group.offsetWidth; });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; }).observe(m);
      }
      if (reduced) return;
      tickers.push(function (now) {
        var dt = Math.min(50, now - last) / 16.67;
        last = now;
        if (!visible || !w) return;
        dir = lerp(dir, -direction, 0.06);
        x += dir * (1.1 + Math.abs(velocity) * 0.045) * dt;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0) skewX(' + clamp(velocity * 0.012, -7, 7).toFixed(2) + 'deg)';
      });
    });
  }

  /* --- scroll-linked effects: scrub text, drifting titles, width axis, card stack --- */
  function initScrollEffects() {
    // Statement: words light up as you read down the page
    $$('[data-scrub]').forEach(function (el) {
      var words = $$('.sw', el);
      var top = 0, h = 1, lit = -1;
      measurers.push(function () {
        var r = el.getBoundingClientRect();
        top = r.top + window.pageYOffset;
        h = r.height;
      });
      tickers.push(function () {
        var p = reduced ? 1 : clamp((smoothY + vh * 0.82 - top) / (h + vh * 0.28), 0, 1);
        var n = Math.round(p * words.length);
        if (n === lit) return;
        lit = n;
        for (var i = 0; i < words.length; i++) words[i].classList.toggle('is-lit', i < n);
      });
    });

    if (reduced) return;

    // Titles that drift sideways / change letter width as they cross the screen
    var items = $$('[data-drift], [data-wdth]').map(function (el) {
      var range = (el.dataset.wdth || '').split(',').map(parseFloat);
      return { el: el, drift: parseFloat(el.dataset.drift || '0'), from: range[0], to: range[1], top: 0, h: 1, last: null };
    });
    measurers.push(function () {
      items.forEach(function (it) {
        var prev = it.el.style.transform;
        it.el.style.transform = 'none';
        var r = it.el.getBoundingClientRect();
        it.el.style.transform = prev;
        it.top = r.top + window.pageYOffset;
        it.h = r.height;
      });
    });
    tickers.push(function () {
      items.forEach(function (it) {
        var rel = it.top - smoothY; // element top relative to viewport
        if (rel > vh + 200 || rel + it.h < -200) return;
        var p = clamp(1 - (rel + it.h / 2) / (vh + it.h / 2), 0, 1); // 0 = entering from bottom, 1 = leaving at top
        var key = p.toFixed(3);
        if (key === it.last) return;
        it.last = key;
        if (it.drift) it.el.style.transform = 'translate3d(' + ((p - 0.5) * 2 * it.drift).toFixed(2) + 'vw,0,0)';
        if (!isNaN(it.from)) it.el.style.setProperty('--wdth', lerp(it.from, it.to, clamp(p * 1.6, 0, 1)).toFixed(1));
      });
    });

    // Album cards: each one scales back slightly as the next slides over it
    var cards = $$('.album');
    var inners = cards.map(function (c) { return $('.album__inner', c); });
    var workVisible = false;
    var work = $('[data-albums]');
    if (work && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { workVisible = entries[0].isIntersecting; }, { rootMargin: '20% 0px' }).observe(work);
    }
    tickers.push(function () {
      if (!workVisible) return;
      if (!desktop.matches) {
        inners.forEach(function (el) { if (el.style.transform) el.style.transform = ''; });
        return;
      }
      for (var i = 0; i < cards.length - 1; i++) {
        var a = cards[i].getBoundingClientRect();
        var b = cards[i + 1].getBoundingClientRect();
        var p = clamp(1 - (b.top - a.top) / a.height, 0, 1);
        inners[i].style.transform = 'scale(' + (1 - p * 0.06).toFixed(4) + ')';
      }
    });
  }

  /* ------------------------------------------------------------------
     6. Pointer niceties: magnetic buttons, tilt cards, cursor label
     ------------------------------------------------------------------ */
  function initPointer() {
    if (!finePointer || reduced) return;

    $$('[data-magnetic]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (dx * 0.28).toFixed(1) + 'px,' + (dy * 0.38).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--rx', ((0.5 - y) * 7).toFixed(2) + 'deg');
        el.style.setProperty('--ry', ((x - 0.5) * 9).toFixed(2) + 'deg');
        el.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.classList.remove('is-tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });

    // Round label that follows the pointer over albums, photos and videos
    var cursor = $('.cursor');
    var label = $('[data-cursor-label]');
    if (!cursor) return;
    root.classList.add('has-cursor');
    var tx = -100, ty = -100, x = -100, y = -100, s = 0, on = false;
    document.addEventListener('pointermove', function (e) {
      tx = e.clientX;
      ty = e.clientY;
      var target = e.target.closest ? e.target.closest('[data-cursor]') : null;
      var next = !!target;
      if (next && label.textContent !== target.dataset.cursor) label.textContent = target.dataset.cursor;
      if (next !== on) {
        on = next;
        cursor.classList.toggle('is-on', on);
        if (on && s < 0.05) { x = tx; y = ty; }
      }
    }, { passive: true });
    var hide = function () { on = false; cursor.classList.remove('is-on'); };
    document.addEventListener('pointerleave', hide);
    document.addEventListener('click', hide); // whatever was under the pointer has probably changed
    window.addEventListener('scroll', hide, { passive: true });
    tickers.push(function () {
      x = lerp(x, tx, 0.2);
      y = lerp(y, ty, 0.2);
      s = lerp(s, on ? 1 : 0, 0.16);
      cursor.style.setProperty('--x', x.toFixed(1) + 'px');
      cursor.style.setProperty('--y', y.toFixed(1) + 'px');
      cursor.style.setProperty('--s', s.toFixed(3));
    });
  }

  /* ------------------------------------------------------------------
     7. Theme toggle, clock, copy-to-clipboard, year
     ------------------------------------------------------------------ */
  function initTheme() {
    var btn = $('[data-theme-toggle]');
    var meta = $('meta[name="theme-color"]');
    var paint = function () {
      if (meta) meta.setAttribute('content', root.dataset.theme === 'dark' ? '#0e0d0b' : '#ece8df');
    };
    paint();
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      var apply = function () {
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) {}
        paint();
      };
      if (!document.startViewTransition || reduced) { apply(); return; }
      var r = btn.getBoundingClientRect();
      root.style.setProperty('--vx', (r.left + r.width / 2) + 'px');
      root.style.setProperty('--vy', (r.top + r.height / 2) + 'px');
      document.startViewTransition(apply);
    });
  }

  function initClock() {
    var short = $$('[data-clock]');
    var long = $$('[data-clock-s]');
    if (!short.length && !long.length) return;
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    } catch (e) { return; }
    var tick = function () {
      var t = fmt.format(new Date());
      short.forEach(function (el) { el.textContent = t.slice(0, 5); });
      long.forEach(function (el) { el.textContent = t; });
    };
    tick();
    setInterval(tick, 1000);
  }

  var toastTimer;
  function toast(msg) {
    var el = $('.toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 2200);
  }

  function initCopy() {
    $$('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.dataset.copy;
        var ok = function () { toast('Email copied to clipboard'); };
        var fail = function () { window.location.href = 'mailto:' + text; };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fail);
        else fail();
      });
    });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  /* ------------------------------------------------------------------
     8. Overlays: album sheet → photo viewer, and the video player
     ------------------------------------------------------------------ */
  var layers = [];

  function syncInert() {
    var top = layers.length ? layers[layers.length - 1].el : null;
    $$('body > *').forEach(function (node) {
      if (node.classList.contains('cursor') || node.classList.contains('toast') || node.tagName === 'SCRIPT') return;
      if ('inert' in node) node.inert = !!top && node !== top;
    });
  }

  function openLayer(el, onClose) {
    layers.push({ el: el, onClose: onClose, restore: document.activeElement });
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    root.classList.add('is-locked');
    syncInert();
    var focusTarget = $('[data-close]', el);
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function closeLayer(el) {
    var idx = -1;
    layers.forEach(function (l, i) { if (l.el === el) idx = i; });
    if (idx < 0) return;
    var layer = layers.splice(idx, 1)[0];
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    if (!layers.length) root.classList.remove('is-locked');
    syncInert();
    if (layer.onClose) layer.onClose();
    if (layer.restore && layer.restore.focus) layer.restore.focus({ preventScroll: true });
  }

  function initOverlays() {
    var sheet = $('#sheet');
    var viewer = $('#viewer');
    var vmodal = $('#vmodal');
    if (!sheet || !viewer || !vmodal) return;

    var sheetGrid = $('#sheetGrid');
    var viewerImg = $('#viewerImg');
    var viewerCap = $('#viewerCap');
    var viewerNow = $('#viewerNow');
    var viewerTotal = $('#viewerTotal');
    var stage = $('#viewerStage');
    var list = [];
    var index = 0;
    var clearTimer;
    var swiped = false;

    /* --- album sheet --- */
    function openAlbum(i) {
      var album = DATA.albums[i];
      if (!album) return;
      clearTimeout(clearTimer);
      list = album.images || [];
      $('#sheetCat').textContent = album.category || '';
      $('#sheetTitle').textContent = album.title || '';
      $('#sheetCount').textContent = list.length + ' photo' + (list.length === 1 ? '' : 's');
      sheetGrid.innerHTML = list.map(function (img, n) {
        var size = img.w && img.h ? ' width="' + img.w + '" height="' + img.h + '"' : '';
        return (
          '<button class="shot" type="button" data-shot="' + n + '" data-cursor="Zoom" style="--i:' + Math.min(n, 14) + '" aria-label="Open photo ' + (n + 1) + ': ' + esc(img.caption || '') + '">' +
            '<img src="' + esc(thumbOf(img.file)) + '" data-full="' + esc(fullOf(img.file)) + '" alt=""' + size + ' loading="lazy" decoding="async">' +
            '<span class="shot__n mono">' + pad2(n + 1) + '</span>' +
            (img.caption ? '<span class="shot__cap">' + esc(img.caption) + '</span>' : '') +
          '</button>'
        );
      }).join('');
      $('#sheetBody').scrollTop = 0;
      void sheet.offsetWidth; // let the browser register the start state before animating
      openLayer(sheet, function () {
        clearTimer = setTimeout(function () { sheetGrid.innerHTML = ''; }, 950);
      });
    }

    /* --- photo viewer --- */
    function show(dir, instant) {
      var item = list[index];
      if (!item) return;
      var swap = function () {
        viewerImg.style.setProperty('--dir', dir || 1);
        viewerImg.classList.remove('is-out');
        viewerImg.classList.add('is-pre');
        viewerImg.src = fullOf(item.file);
        viewerImg.alt = item.caption || '';
        viewerCap.textContent = item.caption || '';
        viewerNow.textContent = pad2(index + 1);
        viewerTotal.textContent = pad2(list.length);
        var reveal = function () {
          void viewerImg.offsetWidth;
          viewerImg.classList.remove('is-pre');
        };
        if (viewerImg.decode) viewerImg.decode().then(reveal, reveal); else reveal();
        // warm up the neighbours
        [1, -1].forEach(function (d) {
          var n = list[(index + d + list.length) % list.length];
          if (n) { var pre = new Image(); pre.src = fullOf(n.file); }
        });
      };
      if (instant || reduced) { swap(); return; }
      viewerImg.style.setProperty('--dir', dir || 1);
      viewerImg.classList.add('is-out');
      setTimeout(swap, 200);
    }

    function step(dir) {
      if (list.length < 2) return;
      index = (index + dir + list.length) % list.length;
      show(dir);
    }

    function openViewer(i) {
      index = i;
      $$('.viewer__nav', viewer).forEach(function (b) { b.hidden = list.length < 2; });
      show(1, true);
      openLayer(viewer);
    }

    /* --- video player --- */
    function openVideo(i) {
      var v = DATA.videos[i];
      if (!v) return;
      $('#vmodalTitle').textContent = v.title || '';
      $('#vmodalLink').href = 'https://www.youtube.com/watch?v=' + encodeURIComponent(v.id);
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?autoplay=1&rel=0';
      frame.title = v.title || 'Video';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.allowFullscreen = true;
      $('#vmodalFrame').appendChild(frame);
      openLayer(vmodal, function () { $('#vmodalFrame').innerHTML = ''; });
    }

    /* --- wiring --- */
    document.addEventListener('click', function (e) {
      var t = e.target;
      var closeBtn = t.closest('[data-close]');
      if (closeBtn) { closeLayer(closeBtn.closest('.sheet, .viewer, .vmodal')); return; }
      var album = t.closest('[data-album]');
      if (album) { openAlbum(parseInt(album.dataset.album, 10)); return; }
      var shot = t.closest('[data-shot]');
      if (shot) { openViewer(parseInt(shot.dataset.shot, 10)); return; }
      var video = t.closest('[data-video]');
      if (video) { openVideo(parseInt(video.dataset.video, 10)); return; }
      var stepBtn = t.closest('[data-step]');
      if (stepBtn) { step(parseInt(stepBtn.dataset.step, 10)); return; }
      if (t === vmodal) closeLayer(vmodal);
      if (t === stage && !swiped) closeLayer(viewer);
    });

    document.addEventListener('keydown', function (e) {
      if (!layers.length) return;
      var top = layers[layers.length - 1].el;
      if (e.key === 'Escape') { e.preventDefault(); closeLayer(top); return; }
      if (top === viewer) {
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      }
    });

    // Swipe between photos on touch screens
    var startX = null;
    stage.addEventListener('pointerdown', function (e) { startX = e.clientX; swiped = false; });
    stage.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 48) { swiped = true; step(dx < 0 ? 1 : -1); }
    });
    stage.addEventListener('pointercancel', function () { startX = null; });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  renderPortfolio();
  prepareText();
  initTheme();
  initClock();
  initCopy();
  initMenu();
  initOverlays();
  initChrome();
  initHero();
  initMarquees();
  initScrollEffects();
  initPointer();

  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);

  requestAnimationFrame(frame);
  runLoader(startReveals);
})();
