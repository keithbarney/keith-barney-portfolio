# Token Naming Syntax

This document defines the naming conventions for design tokens in the Keith Design System. Following these rules ensures consistency across the token library and predictable CSS output.

## Overview

The token system uses a three-tier architecture:

1. **Base tokens** - Raw values (colors, spacing scale, typography primitives)
2. **Alias tokens** - Semantic references to base tokens
3. **CSS output** - Compiled custom properties for use in stylesheets

## General Rules

### Delimiters

| Delimiter | Purpose | Example |
|-----------|---------|---------|
| `.` (dot) | Separates hierarchy levels | `ui.text.strong` |
| `-` (hyphen) | Separates words within a segment | `primary-hover` |

### Conventions

- **Case**: All lowercase
- **Abbreviations**: Only use established size abbreviations (see Size Scale below)
- **No underscores**: Use hyphens for word separation

## Syntax Pattern

Token names follow the JSON structure directly:

```
[category].[group].[variant]
```

| Level | Required | Description | Examples |
|-------|----------|-------------|----------|
| Category | Yes | Token type | `ui`, `gap`, `font-size`, `container` |
| Group | Usually | Semantic grouping | `bg`, `text`, `action`, `feedback` |
| Variant | Usually | Specific variant | `default`, `strong`, `primary`, `success` |

## Token Type Patterns

### Colors (Base)

Base color tokens define the raw color palette.

```
[family].[intensity]
```

| Family | Intensity | Token |
|--------|-----------|-------|
| `gray` | `50` | `gray.50` |
| `gray` | `900` | `gray.900` |
| `red` | `500` | `red.500` |
| `blue` | `400` | `blue.400` |
| `gray` | `Black` | `gray.Black` |
| `gray` | `White` | `gray.White` |

### UI Colors (Alias)

UI color tokens reference base colors and provide semantic meaning.

```
ui.[group].[variant]
```

| Category | Group | Variant | Token |
|----------|-------|---------|-------|
| `ui` | `bg` | `default` | `ui.bg.default` |
| `ui` | `surface` | `default` | `ui.surface.default` |
| `ui` | `text` | `default` | `ui.text.default` |
| `ui` | `text` | `strong` | `ui.text.strong` |
| `ui` | `text` | `disabled` | `ui.text.disabled` |
| `ui` | `border` | `default` | `ui.border.default` |
| `ui` | `border` | `strong` | `ui.border.strong` |
| `ui` | `action` | `primary` | `ui.action.primary` |
| `ui` | `action` | `primary-hover` | `ui.action.primary-hover` |
| `ui` | `action` | `primary-active` | `ui.action.primary-active` |
| `ui` | `feedback` | `success` | `ui.feedback.success` |
| `ui` | `feedback` | `warning` | `ui.feedback.warning` |
| `ui` | `feedback` | `danger` | `ui.feedback.danger` |
| `ui` | `feedback` | `info` | `ui.feedback.info` |

### Spacing

Spacing tokens control gaps, padding, and margins.

```
[type].[size]
```

**Gap tokens:**

| Type | Size | Token | Value |
|------|------|-------|-------|
| `gap` | `none` | `gap.none` | 0 |
| `gap` | `xxs` | `gap.xxs` | 2 |
| `gap` | `xs` | `gap.xs` | 4 |
| `gap` | `sm` | `gap.sm` | 8 |
| `gap` | `md` | `gap.md` | 12 |
| `gap` | `lg` | `gap.lg` | 16 |
| `gap` | `xl` | `gap.xl` | 20 |
| `gap` | `2xl` | `gap.2xl` | 24 |
| `gap` | `3xl` | `gap.3xl` | 32 |
| `gap` | `4xl` | `gap.4xl` | 48 |

**Padding tokens:**

| Type | Size | Token | Value |
|------|------|-------|-------|
| `padding` | `sm` | `padding.sm` | 4 |
| `padding` | `md` | `padding.md` | 8 |
| `padding` | `lg` | `padding.lg` | 16 |
| `padding` | `xl` | `padding.xl` | 24 |
| `padding` | `2xl` | `padding.2xl` | 48 |

**Screen tokens:**

| Type | Size | Token | Value |
|------|------|-------|-------|
| `screen` | `side-margin` | `screen.side-margin` | 16 |
| `screen` | `column-gap` | `screen.column-gap` | 24 |

### Typography

Typography tokens define font families and sizes.

**Font families:**

```
font-family.[name]
```

| Category | Name | Token | Value |
|----------|------|-------|-------|
| `font-family` | `primary` | `font-family.primary` | Test American Grotesk |
| `font-family` | `mono` | `font-family.mono` | Departure Mono |

**Font sizes:**

```
font-size.[semantic-name]
```

| Category | Name | Token | Value |
|----------|------|-------|-------|
| `font-size` | `body-xs` | `font-size.body-xs` | 12px |
| `font-size` | `body-sm` | `font-size.body-sm` | 14px |
| `font-size` | `body` | `font-size.body` | 16px |
| `font-size` | `h3` | `font-size.h3` | 24px |
| `font-size` | `h2` | `font-size.h2` | 28px |
| `font-size` | `h1` | `font-size.h1` | 32px |

### Border Radius

Border radius tokens control corner rounding.

```
container.[size]
```

| Category | Size | Token | Value |
|----------|------|-------|-------|
| `container` | `none` | `container.none` | 0 |
| `container` | `sm` | `container.sm` | 4px |
| `container` | `md` | `container.md` | 8px |
| `container` | `lg` | `container.lg` | 12px |
| `container` | `full` | `container.full` | 999px |

## Size Scale Convention

Use these standard abbreviations for size variants:

| Abbreviation | Meaning |
|--------------|---------|
| `none` | No value / zero |
| `xxs` | Extra extra small |
| `xs` | Extra small |
| `sm` | Small |
| `md` | Medium (default) |
| `lg` | Large |
| `xl` | Extra large |
| `2xl` | 2x extra large |
| `3xl` | 3x extra large |
| `4xl` | 4x extra large |

## CSS Output Convention

When tokens are compiled to CSS custom properties:

1. All dots (`.`) become hyphens (`-`)
2. Prefixed with `--`
3. Existing hyphens within segments are preserved

### Examples

| Category | Group | Variant | Token | CSS Custom Property |
|----------|-------|---------|-------|---------------------|
| `ui` | `bg` | `default` | `ui.bg.default` | `--ui-bg-default` |
| `ui` | `text` | `strong` | `ui.text.strong` | `--ui-text-strong` |
| `ui` | `action` | `primary-hover` | `ui.action.primary-hover` | `--ui-action-primary-hover` |
| `gap` | — | `md` | `gap.md` | `--gap-md` |
| `font-size` | — | `body-sm` | `font-size.body-sm` | `--font-size-body-sm` |
| `container` | — | `lg` | `container.lg` | `--container-lg` |

### Usage in CSS

```css
.element {
  color: var(--ui-text-default);
  background: var(--ui-bg-default);
  padding: var(--padding-md);
  border-radius: var(--container-sm);
  gap: var(--gap-sm);
}

.element--strong {
  color: var(--ui-text-strong);
  border-color: var(--ui-border-strong);
}
```

## Quick Reference

```
Colors (base):     [family].[intensity]           gray.500
UI colors:         ui.[group].[variant]           ui.text.strong
Spacing:           [type].[size]                  gap.md, padding.lg
Typography:        font-size.[name]               font-size.body-sm
Radius:            container.[size]               container.md
```
