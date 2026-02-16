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

  // --- Canvas setup ---

  var DPR = window.devicePixelRatio || 1;
  var GRID = 8;
  var GRID_MOBILE = 12;
  var TAU = Math.PI * 2;
  var canvas, ctx;
  var w = 0, h = 0;
  var startTime = performance.now();
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;
  var rafId = null;
  var dotColor = 'rgba(255,255,255,0.85)';
  var bgColor = '#0A0A0A';

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'halftone-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');
  }

  function resize() {
    isMobile = window.innerWidth < 768;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function readThemeColors() {
    var style = getComputedStyle(document.documentElement);
    dotColor = style.getPropertyValue('--canvas-dot').trim() || dotColor;
    bgColor = style.getPropertyValue('--canvas-bg').trim() || bgColor;
  }

  // --- Rendering ---

  function draw(t) {
    var grid = isMobile ? GRID_MOBILE : GRID;
    var maxR = grid * 0.45;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = dotColor;

    var cols = Math.ceil(w / grid) + 1;
    var rows = Math.ceil(h / grid) + 1;

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var x = col * grid;
        var y = row * grid;
        var nx = x / w * 4;
        var ny = y / h * 4;
        var n = fbm(nx + t * 0.5, ny + t * 0.3, 42, 3);
        var r = n * maxR;
        if (r < 0.3) continue;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }
    }
  }

  function loop() {
    var t = (performance.now() - startTime) * 0.0001;
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
    // Colors update on next frame via readThemeColors
    readThemeColors();
    // Update toggle button text
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? 'Light' : 'Dark';
    // Re-render static frame if reduced motion
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

  // --- Init ---

  function init() {
    createCanvas();
    resize();

    var theme = getInitialTheme();
    applyTheme(theme);

    initToggle();

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(function () {
        resize();
        if (isReducedMotion) staticRender();
      }).observe(document.documentElement);
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
