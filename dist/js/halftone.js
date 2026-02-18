// ===========================================
// HALFTONE ENVIRONMENT
// Full-viewport animated dot grid
// Adapted from Heavy Brand Guidelines noise field
// ===========================================

(function () {
  'use strict';

  // --- Noise functions ---

  function hash(x, y, seed) {
    var v = Math.sin(x * 127.1 + y * 311.7 + seed * 43758.5453) * 43758.5453;
    return v - Math.floor(v);
  }

  function noise2d(px, py, seed) {
    var ix = Math.floor(px);
    var iy = Math.floor(py);
    var fx = px - ix;
    var fy = py - iy;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    var a = hash(ix, iy, seed);
    var b = hash(ix + 1, iy, seed);
    var c = hash(ix, iy + 1, seed);
    var d = hash(ix + 1, iy + 1, seed);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  }

  function fbm(px, py, seed, octaves) {
    var val = 0;
    var amp = 0.5;
    var freq = 1;
    for (var i = 0; i < octaves; i++) {
      val += noise2d(px * freq, py * freq, seed + i * 100) * amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val;
  }

  // --- Tunable parameters ---

  var params = {
    grid: 5,
    gridMobile: 15,
    maxRFactor: 0.36,
    yFadeExp: 0.2,
    noiseScale: 2,
    speedX: 1.45,
    speedY: 0.95,
    octaves: 6,
    seed: 113,
    timeScale: 0.0002,
    minDot: 1,
  };

  // --- Canvas setup ---

  var DPR = window.devicePixelRatio || 1;
  var TAU = Math.PI * 2;
  var canvas, ctx;
  var w = 0, h = 0;
  var startTime = performance.now();
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;
  var rafId = null;
  var dotColor = '';
  var bgColor = '';
  var heroEl = null;

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'halftone-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    heroEl = document.querySelector('.hero');
    if (heroEl) {
      heroEl.insertBefore(canvas, heroEl.firstChild);
    } else {
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    ctx = canvas.getContext('2d');
  }

  function resize() {
    isMobile = window.innerWidth < 768;
    var target = heroEl || document.documentElement;
    w = target.offsetWidth;
    h = target.offsetHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // Resolve CSS custom properties that may contain var() references
  // by applying them to a real CSS property and reading the computed value.
  function resolveColor(prop) {
    var el = document.createElement('div');
    el.style.color = 'var(' + prop + ')';
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    document.body.appendChild(el);
    var resolved = getComputedStyle(el).color;
    el.remove();
    return resolved;
  }

  function readThemeColors() {
    dotColor = resolveColor('--canvas-dot') || dotColor;
    bgColor = resolveColor('--canvas-bg') || bgColor;
  }

  // --- Rendering ---

  function draw(t) {
    var grid = isMobile ? params.gridMobile : params.grid;
    var maxR = grid * params.maxRFactor;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = dotColor;

    var cols = Math.ceil(w / grid) + 1;
    var rows = Math.ceil(h / grid) + 1;

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var x = col * grid;
        var y = row * grid;
        var yFade = Math.pow(y / h, params.yFadeExp);
        var nx = x / w * params.noiseScale;
        var ny = y / h * params.noiseScale;
        var n = fbm(nx + t * params.speedX, ny + t * params.speedY, params.seed, params.octaves);
        var r = n * maxR * yFade;
        if (r < params.minDot) continue;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
    }
  }

  function loop() {
    var t = (performance.now() - startTime) * params.timeScale;
    draw(t);
    rafId = requestAnimationFrame(loop);
  }

  function staticRender() {
    draw(0);
  }

  // --- Theme toggle ---

  function getInitialTheme() {
    var stored = localStorage.getItem('kb-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kb-theme', theme);
    readThemeColors();
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    if (isReducedMotion) staticRender();
  }

  function initToggle() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Dev Overlay: Halftone Parameter Tuner ---

  function initDevOverlay() {
    var PANEL_ID = 'halftone-tuner';
    if (document.getElementById(PANEL_ID)) return;

    var controls = [
      { key: 'grid',        label: 'Grid',       min: 4,     max: 40,    step: 1    },
      { key: 'gridMobile',  label: 'Grid (mob)', min: 4,     max: 30,    step: 1    },
      { key: 'maxRFactor',  label: 'Max R',      min: 0.1,   max: 0.8,   step: 0.01 },
      { key: 'yFadeExp',    label: 'Y Fade',     min: 0.2,   max: 4,     step: 0.1  },
      { key: 'noiseScale',  label: 'Noise',      min: 0.5,   max: 12,    step: 0.5  },
      { key: 'speedX',      label: 'Speed X',    min: 0,     max: 2,     step: 0.05 },
      { key: 'speedY',      label: 'Speed Y',    min: 0,     max: 2,     step: 0.05 },
      { key: 'octaves',     label: 'Octaves',    min: 1,     max: 6,     step: 1    },
      { key: 'seed',        label: 'Seed',        min: 0,     max: 200,   step: 1    },
      { key: 'timeScale',   label: 'Time ×',     min: 0,     max: 0.002, step: 0.0001 },
      { key: 'minDot',      label: 'Min dot',    min: 0,     max: 1,     step: 0.05 },
    ];

    var style = document.createElement('style');
    style.id = PANEL_ID + '-style';
    style.textContent = [
      '#' + PANEL_ID + '{position:fixed;top:16px;right:16px;z-index:99999;background:rgba(0,0,0,.92);padding:12px 16px;border-radius:8px;font:11px/1.6 ui-monospace,"JetBrains Mono",monospace;color:rgba(255,255,255,.7);min-width:220px;max-height:90vh;overflow-y:auto;box-shadow:0 2px 16px rgba(0,0,0,.5);user-select:none}',
      '#' + PANEL_ID + ' .ht-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.08em}',
      '#' + PANEL_ID + ' .ht-close{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font:inherit;padding:2px 4px}',
      '#' + PANEL_ID + ' .ht-close:hover{color:#fff}',
      '#' + PANEL_ID + ' .ht-row{display:grid;grid-template-columns:70px 1fr 42px;align-items:center;gap:6px;margin:3px 0}',
      '#' + PANEL_ID + ' .ht-label{color:rgba(255,255,255,.5);font-size:10px}',
      '#' + PANEL_ID + ' input[type=range]{width:100%;height:4px;accent-color:rgba(255,255,255,.6);cursor:pointer}',
      '#' + PANEL_ID + ' .ht-val{text-align:right;color:rgba(255,255,255,.5);font-size:10px;font-variant-numeric:tabular-nums}',
      '#' + PANEL_ID + ' .ht-actions{display:flex;gap:6px;margin-top:10px;border-top:1px solid rgba(255,255,255,.1);padding-top:8px}',
      '#' + PANEL_ID + ' .ht-btn{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);padding:4px 10px;border-radius:4px;cursor:pointer;font:inherit;transition:all .15s;flex:1;text-align:center}',
      '#' + PANEL_ID + ' .ht-btn:hover{border-color:rgba(255,255,255,.4);color:#fff}',
    ].join('');
    document.head.appendChild(style);

    var panel = document.createElement('div');
    panel.id = PANEL_ID;

    // Header
    var header = document.createElement('div');
    header.className = 'ht-header';
    header.innerHTML = '<span>Halftone Tuner</span>';
    var closeBtn = document.createElement('button');
    closeBtn.className = 'ht-close';
    closeBtn.textContent = '\u2715';
    closeBtn.title = 'Close tuner';
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Store default values for reset
    var defaults = {};
    for (var k in params) defaults[k] = params[k];

    // Build sliders
    var valueEls = {};
    controls.forEach(function (c) {
      var row = document.createElement('div');
      row.className = 'ht-row';

      var label = document.createElement('span');
      label.className = 'ht-label';
      label.textContent = c.label;

      var input = document.createElement('input');
      input.type = 'range';
      input.min = c.min;
      input.max = c.max;
      input.step = c.step;
      input.value = params[c.key];

      var val = document.createElement('span');
      val.className = 'ht-val';
      val.textContent = formatVal(params[c.key], c.step);
      valueEls[c.key] = val;

      input.addEventListener('input', function () {
        params[c.key] = parseFloat(input.value);
        val.textContent = formatVal(params[c.key], c.step);
      });

      row.appendChild(label);
      row.appendChild(input);
      row.appendChild(val);
      panel.appendChild(row);
    });

    // Action buttons
    var actions = document.createElement('div');
    actions.className = 'ht-actions';

    var resetBtn = document.createElement('button');
    resetBtn.className = 'ht-btn';
    resetBtn.textContent = 'Reset';
    resetBtn.addEventListener('click', function () {
      for (var k in defaults) params[k] = defaults[k];
      panel.querySelectorAll('input[type=range]').forEach(function (inp, i) {
        var c = controls[i];
        inp.value = params[c.key];
        valueEls[c.key].textContent = formatVal(params[c.key], c.step);
      });
    });

    var copyBtn = document.createElement('button');
    copyBtn.className = 'ht-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () {
      var obj = {};
      controls.forEach(function (c) { obj[c.key] = params[c.key]; });
      navigator.clipboard.writeText(JSON.stringify(obj, null, 2)).then(function () {
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1200);
      });
    });

    actions.appendChild(resetBtn);
    actions.appendChild(copyBtn);
    panel.appendChild(actions);

    // Close — re-show trigger button
    closeBtn.addEventListener('click', function () {
      panel.remove();
      style.remove();
      var trigger = document.getElementById('halftone-tuner-trigger');
      if (trigger) trigger.style.display = 'flex';
    });

    document.body.appendChild(panel);
  }

  function formatVal(v, step) {
    if (step < 0.001) return v.toFixed(4);
    if (step < 0.1) return v.toFixed(2);
    if (step < 1) return v.toFixed(1);
    return String(Math.round(v));
  }

  // Expose for dev overlay bookmarklet or console
  window.__halftone = {
    params: params,
    openTuner: initDevOverlay,
  };

  // --- Dev trigger button (localhost only) ---

  function initDevButton() {
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;

    var btn = document.createElement('button');
    btn.id = 'halftone-tuner-trigger';
    btn.textContent = '\u2699';
    btn.title = 'Halftone Tuner';
    btn.style.cssText = 'position:absolute;bottom:16px;right:16px;z-index:99998;width:32px;height:32px;border-radius:6px;border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.8);color:rgba(255,255,255,.6);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;line-height:1;padding:0';

    btn.addEventListener('mouseenter', function () {
      btn.style.borderColor = 'rgba(255,255,255,.5)';
      btn.style.color = '#fff';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.borderColor = 'rgba(255,255,255,.2)';
      btn.style.color = 'rgba(255,255,255,.6)';
    });
    btn.addEventListener('click', function () {
      initDevOverlay();
      btn.style.display = 'none';
    });

    var target = document.querySelector('.hero') || document.body;
    target.appendChild(btn);
  }

  // --- Init ---

  function init() {
    createCanvas();
    resize();

    var theme = getInitialTheme();
    applyTheme(theme);

    initToggle();
    initDevButton();

    var observeTarget = heroEl || document.documentElement;
    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () {
        resize();
        if (isReducedMotion) staticRender();
      }).observe(observeTarget);
    } else {
      window.addEventListener('resize', function () {
        resize();
        if (isReducedMotion) staticRender();
      });
    }

    if (isReducedMotion) {
      staticRender();
    } else {
      loop();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
