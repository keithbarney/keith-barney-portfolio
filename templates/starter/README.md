# Project Starter Template

This project is built with [@keith/design-system](../../../README.md).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Link the design system:
   ```bash
   npm link ../keith-design-system
   ```

3. Start development:
   ```bash
   npm run dev
   ```

## Customization

### Token Overrides

Edit `tokens/alias-overrides.json` to override design system defaults:

```json
{
  "color": {
    "action": {
      "primary": { "$value": { "hex": "#E63B2E" } }
    }
  },
  "font-family": {
    "mono": { "$value": "Your Font, monospace" }
  }
}
```

Then run `npm run build:tokens` to regenerate the overrides.

### Adding Components

Create new Pug partials in `src/pug/partials/` and Sass partials in `src/sass/partials/`.

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:tokens` - Rebuild token overrides
