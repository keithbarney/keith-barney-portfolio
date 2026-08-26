(() => {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('grid-debug')) return;

  const overlay = document.createElement('div');
  overlay.className = 'grid-debug-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const columnCount = Number.parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--site-grid-columns'),
    10,
  ) || 1;

  for (let index = 1; index <= columnCount; index += 1) {
    const cell = document.createElement('span');
    cell.className = 'grid-debug-cell';
    cell.textContent = `Col ${index}`;
    overlay.append(cell);
  }

  document.body.append(overlay);
  document.body.classList.add('grid-debug-active');
})();
