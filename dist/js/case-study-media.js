(() => {
  const container = document.querySelector('[data-case-study-media]');
  if (!container) return;

  const lastPathSegment = window.location.pathname.split('/').filter(Boolean).pop() || 'project-template';
  const page = lastPathSegment.endsWith('.html') ? lastPathSegment : `${lastPathSegment}.html`;

  function createConfiguredMediaFigure(image, index) {
    const figure = document.createElement('figure');
    figure.className = 'project-figure';
    const media = document.createElement('img');
    media.className = 'project-image';
    media.src = image.src;
    media.alt = image.alt;
    media.loading = index === 0 ? 'eager' : 'lazy';
    media.decoding = 'async';
    if (index === 0) media.fetchPriority = 'high';
    figure.append(media);
    return figure;
  }

  function renderConfiguredGallery(config, expanded) {
    if (config.type === 'positioned-grid') return;
    const layout = config.layouts[expanded ? 'expanded' : 'compact'];
    if (!layout) return;
    let imageIndex = 0;
    container.replaceChildren(...layout.map((columnImages) => {
      const column = document.createElement('div');
      column.className = 'gallery-column';
      column.append(...columnImages.map((imageId) => {
        const image = config.images[imageId];
        if (!image) return document.createComment(`Missing gallery image: ${imageId}`);
        return createConfiguredMediaFigure(image, imageIndex++);
      }));
      return column;
    }));
  }

  function getPositionedLayout(config, width) {
    return [...config.layouts]
      .filter((layout) => Number.isFinite(layout.minWidth) && layout.minWidth <= width)
      .sort((left, right) => left.minWidth - right.minWidth)
      .pop();
  }

  function renderPositionedGallery(config, width) {
    const layout = getPositionedLayout(config, width);
    if (!layout) return;
    container.style.setProperty('--gallery-columns', layout.columns);
    container.style.setProperty('--gallery-column-gap', `${layout.columnGap}px`);
    container.style.setProperty('--gallery-row-gap', `${layout.rowGap}px`);
    let imageIndex = 0;
    container.replaceChildren(...layout.items.map((item) => {
      const image = config.images[item.id];
      if (!image) return document.createComment(`Missing gallery image: ${item.id}`);
      const figure = createConfiguredMediaFigure(image, imageIndex++);
      figure.classList.add('gallery-item');
      figure.style.gridColumn = `${item.columnStart} / span ${item.columnSpan}`;
      if (item.rowSpan) figure.style.gridRow = `auto / span ${item.rowSpan}`;
      return figure;
    }));
  }

  function watchConfiguredGallery(config) {
    if (config.type === 'positioned-grid') {
      let activeLayout;
      let frame;
      const render = () => {
        frame = undefined;
        const layout = getPositionedLayout(config, window.innerWidth);
        if (!layout || layout === activeLayout) return;
        activeLayout = layout;
        renderPositionedGallery(config, window.innerWidth);
      };
      const scheduleRender = () => {
        if (frame === undefined) frame = window.requestAnimationFrame(render);
      };
      new ResizeObserver(scheduleRender).observe(container);
      window.addEventListener('resize', scheduleRender, { passive: true });
      scheduleRender();
      return;
    }
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const render = () => renderConfiguredGallery(config, mediaQuery.matches);
    mediaQuery.addEventListener('change', render);
    render();
  }

  const loadJson = (url) => fetch(url, { cache: 'no-store' })
    .then((response) => response.ok ? response.json() : {})
    .catch(() => ({}));

  loadJson('case-study-gallery-config.json')
    .then((configuredGalleries) => {
      const configuredGallery = configuredGalleries?.[page];
      if (!configuredGallery) return;
      container.classList.add(`project-media--${configuredGallery.type}`);
      container.classList.add(`project-media--${page.replace(/\.html$/, '')}`);
      watchConfiguredGallery(configuredGallery);
    })
    .catch(() => {
      // Keep the authored fallback visible if the gallery configuration is unavailable.
    });
})();
