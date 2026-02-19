# Keith Barney — Design Systems Portfolio

**[keithbarney.design](https://keithbarney.design)**

Personal portfolio for Keith Barney, Design Systems Lead. Built with Pug, vanilla CSS, and a custom halftone dot-grid animation. Deployed to GitHub Pages.

## Stack

- **Templating:** [Pug](https://pugjs.org)
- **Styling:** Vanilla CSS with design tokens (CSS custom properties)
- **Animation:** Canvas-based halftone noise field (`halftone.js`)
- **Fonts:** Test American Grotesk, JetBrains Mono, Space Grotesk
- **Hosting:** GitHub Pages via Actions

## Structure

```
keith-barney-portfolio/
├── src/
│   ├── pages/           # Pug templates
│   │   ├── index.pug          # Main portfolio page
│   │   ├── discography.pug    # Music discography
│   │   └── partials/
│   │       └── _head.pug      # Shared HTML head
│   ├── styles/
│   │   └── portfolio.css      # Page-specific styles
│   ├── scripts/
│   │   ├── halftone.js        # Animated dot-grid canvas
│   │   └── build-tokens.js    # Token JSON → CSS generator
│   └── assets/
│       ├── fonts/
│       └── images/
├── dist/                # Built output (deployed)
├── CLAUDE.md            # AI context / design system docs
├── CNAME                # Custom domain
└── package.json
```

## Development

```bash
npm install

# Build + watch + serve with live reload
npm run dev

# Production build
npm run build
```

### Build Pipeline

```
~/Projects/design/tokens/ → build-tokens.js → dist/css/tokens.css
src/pages/*.pug           → pug-cli          → dist/*.html
src/styles/portfolio.css  → copy             → dist/css/portfolio.css
src/scripts/halftone.js   → copy             → dist/js/halftone.js
```

The design token build reads from a shared token directory (`~/Projects/design/tokens/`) and generates CSS custom properties.

## Features

- **Halftone canvas** — Animated noise-driven dot grid in the hero, with adjustable parameters (dev tuner on localhost)
- **Theme toggle** — Dark/light mode with `localStorage` persistence
- **Aesthetic modes** — Default + Terminal theme variant
- **Responsive** — Mobile-first with breakpoints at 768px
- **Accessibility** — Reduced motion support, semantic HTML, skip-link ready
- **Discography** — Complete vinyl/CD pressing history across 5 bands with band filtering

## Deployment

Pushes to `main` trigger GitHub Actions → builds `dist/` → deploys to GitHub Pages at `keithbarney.design`.

## License

MIT
