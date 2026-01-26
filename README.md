# Keith Design System

A reusable design system featuring Swiss Grid principles, design tokens synced with Figma, and base UI components.

## Installation

```bash
# For local development with npm link
npm link ../keith-design-system
```

## Usage

### In your project's main.scss:

```scss
// Import core design system
@use '@keith/design-system/styles' as ds;
@use '@keith/design-system/grid';
@use '@keith/design-system/components';

// Import project token overrides (optional)
@use '../tokens/generated/overrides';

// Project-specific styles
@use 'partials/header';
@use 'partials/hero';
```

## Structure

```
keith-design-system/
├── tokens/
│   ├── base/           # Primitives (from Figma)
│   ├── alias/          # Semantic defaults
│   └── dist/           # Generated outputs
├── components/         # Base UI components
├── grid/               # Swiss grid system
├── styles/             # Core styles
├── scripts/            # Figma sync scripts
├── templates/          # Project starter template
└── docs/               # Documentation
```

## Token Override Flow

```
FIGMA → BASE TOKENS → ALIAS TOKENS → PROJECT OVERRIDES → FINAL CSS
```

## Scripts

- `npm run build` - Build tokens to CSS and Sass
- `npm run pull:figma` - Sync tokens from Figma
- `npm run push:figma` - Push tokens to Figma

## Starting a New Project

1. Copy `templates/starter/` to new location
2. Update package.json with project name
3. Link design system: `npm link ../keith-design-system`
4. Customize `tokens/alias-overrides.json`
5. Run `npm run dev`
