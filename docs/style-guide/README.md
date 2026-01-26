# Design System Style Guide

Visual documentation of the @keith/design-system tokens and components.

## Setup

```bash
npm install
npm run dev
```

## Pages

- **base.html** - Base/primitive tokens (colors, scale, typography, radius)
- **alias.html** - Semantic/alias tokens (mapped from base tokens)

## Structure

```
style-guide/
├── src/
│   ├── pug/           # Pug templates
│   │   ├── base.pug   # Base tokens documentation
│   │   ├── alias.pug  # Alias tokens documentation
│   │   └── partials/  # Reusable components
│   ├── sass/          # Style guide styles
│   └── fonts/         # Local font files
├── dist/              # Built output
└── package.json
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
