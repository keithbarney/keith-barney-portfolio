# Keith Barney Portfolio

Personal portfolio site. Inherits from `~/Projects/CLAUDE.md`.

---

## Overview

Static portfolio site built with Pug and Sass. Pulls design tokens from the shared `~/Projects/tokens/` directory. No JavaScript frameworks — pure static generation.

## Tech Stack

- **Templating:** Pug
- **Styling:** Sass
- **Build:** Node.js scripts, Browser-Sync
- **Fonts:** Test American Grotesk, Departure Mono, Inter

## Commands

```bash
npm run dev           # Build + watch + serve with live reload
npm run build         # Full build: tokens → styles → pages
npm run build:tokens  # Generate Sass from token JSON
npm run build:styles  # Compile Sass to CSS
npm run build:pages   # Compile Pug to HTML
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/index.pug` | Main portfolio page |
| `src/pages/partials/_head.pug` | Shared HTML head |
| `src/styles/main.sass` | Entry point |
| `src/styles/_tokens.sass` | **AUTO-GENERATED** — do not edit |
| `src/styles/_variables.sass` | CSS custom properties |
| `src/styles/_page-layout.sass` | Portfolio-specific styles |
| `src/scripts/build-tokens.js` | Token JSON → Sass generator |

---

## Page Structure

```
index.pug
├── Header (wordmark + contact)
├── Hero (name + role)
├── Capabilities
├── Work (3 case studies)
├── Experience (company list)
├── About
├── Social links
└── Footer
```

---

## Token Build Process

```
~/Projects/tokens/*.json → build-tokens.js → _tokens.sass
```

**Always run `npm run build:tokens` after modifying token JSON files.**

Supports project-specific overrides:
```bash
node build-tokens.js --project-overrides=./overrides.json
```

---

## Responsive Breakpoints

| Mixin | Min-Width |
|-------|-----------|
| `@include sm` | 480px |
| `@include md` | 768px |
| `@include lg` | 1024px |
| `@include xl` | 1200px |
| `@include xxl` | 1440px |

Reverse (max-width): `@include md-down`

---

## Grid & Layout

12-column CSS Grid with 24px gutter.

```scss
.grid--12          // 12 columns
.col-span-{1-12}   // Column spanning
.gap-{1-6}         // Gap utilities

// Flexbox
.flex, .items-center, .justify-between

// Spacing utilities
.m-{1-6}, .p-{1-6}, .my-{1-6}, .px-{1-6}
```

---

## Accessibility

Built-in utilities in `_accessibility.sass`:

```scss
.sr-only        // Screen reader only
.skip-link      // Keyboard navigation
.focus-ring     // 2px outline + 2px offset
.touch-target   // Min 44×44px (WCAG 2.5.5)
.motion-reduce  // Respects prefers-reduced-motion
```

---

## Notes

- `_tokens.sass` is auto-generated — never edit directly
- Mobile-first responsive design
- `[data-theme="dark"]` enables dark mode
- No JavaScript — static HTML output
- Content-first, linear layout philosophy
