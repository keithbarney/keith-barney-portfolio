# Keith Barney Portfolio

Personal portfolio site.

---

# Project Context

## Who I Am
- **Name:** Keith Barney
- **Role:** Design Systems Lead @ Experian (5 years)
- **Work:** Design systems designer working closely with design system engineers
- **Location:** Aliso Viejo, CA
- **Email:** keithbarneydesign@gmail.com
- **LinkedIn:** linkedin.com/in/keithbarney
- **Portfolio:** keithbarney.design

## Who Andrew Is
- **Name:** Andrew Johnson
- **Role:** UX & Design Mentor on MentorCruise
- **Expertise:** Design Systems, Creative Direction, Design Leadership, Product Design, Brand Systems, Design Management, Team Building, UX Strategy
- **Mentorship Style:** Direct and actionable feedback, frameworks to apply immediately, blends craft with emotional intelligence
- **Profile:** mentorcruise.com/mentor/andrewjohnson

## What MentorCruise Is
- Online platform connecting mentees with industry mentors in tech
- 2,000+ mentors across ~100 countries
- Long-term 1:1 mentorship with flexible options (calls, Q&A, hybrid)
- 4.9/5 average mentor rating, 97% satisfaction rate
- Website: mentorcruise.com

## My Goals for This Project
1. **Primary Goal:** Create a professional portfolio so I'm ready when interesting job opportunities arise
2. **Target:** Senior design systems leadership roles at top-tier companies (FAANG-level and adjacent)
3. **Focus Areas:**
   - Select 2–3 projects demonstrating senior-level DS leadership at scale
   - Show work that reduced chaos/risk across teams
   - Highlight cross-functional influence and leverage
   - Document ownership of standards, governance, and adoption decisions
4. **Deliverables:** Resume + Portfolio + Interview prep
5. **Andrew's Approach:** Portfolio as a "tease" to get the call, prove value fast, show you solve problems

---

# Design System

## Visual Style

**Swiss Modernism meets Technical Systems** — Precision of Swiss/International style with functional beauty of information systems (cockpit displays, dot matrices, data visualization).

### Color Strategy
- **Foundation:** Black + white / warm neutrals
- **Accent:** One bold color (red, orange, or amber)
- **Contrast:** High contrast text on soft backgrounds

### Typography
- 7-10 words per line (~65ch max-width)
- Flush left, ragged right alignment
- Monospaced fonts for data/metadata
- Mixed weights: light labels, bold values
- Extreme scale contrast

### Visual Elements
- Dot matrix / grid systems as texture
- Bold geometric forms (circles, rounded bars)
- Thin horizontal rules as dividers
- B&W or desaturated photography

### Layout Principles
- Rigid Swiss grid systems
- Asymmetric balance
- Generous whitespace
- 8pt spacing increments

### Influences
Dieter Rams, Müller-Brockmann, Bauhaus, airport displays, cockpit instrumentation

## Design Tokens

Base tokens live at `~/Projects/tokens/`. Created in Figma, exported as JSON following the W3C DTCG spec.

### Token Architecture
1. **Base tokens** — Raw values in `~/Projects/tokens/*.json`
2. **Alias tokens** — Project-specific semantic references to base tokens
3. **CSS output** — Compiled custom properties for stylesheets

### Naming Pattern
```
[project].[category].[group].[variant]
```

| Level | Description | Examples |
|-------|-------------|----------|
| Project | Design system name | `keith`, `acme` |
| Category | Token type | `ui`, `gap`, `font-size`, `container` |
| Group | Semantic grouping | `bg`, `text`, `action`, `feedback` |
| Variant | Specific variant | `default`, `strong`, `primary` |

**Delimiters:** `.` separates levels, `-` separates words within a segment

**Size abbreviations:** `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Token Categories

| Category | Pattern | Example |
|----------|---------|---------|
| UI Colors | `[project].ui.[group].[variant]` | `keith.ui.text.strong` |
| Spacing | `[project].gap.[size]` | `keith.gap.md` |
| Padding | `[project].padding.[size]` | `keith.padding.lg` |
| Typography | `[project].font-size.[name]` | `keith.font-size.body` |
| Radius | `[project].container.[size]` | `keith.container.md` |

### UI Color Groups

| Group | Variants |
|-------|----------|
| `bg`, `surface` | `default` |
| `text` | `default`, `strong`, `disabled` |
| `border` | `default`, `strong` |
| `action` | `primary`, `primary-hover`, `primary-active` |
| `feedback` | `success`, `warning`, `danger`, `info` |

### CSS Output
Dots become hyphens, prefixed with `--`:

`keith.ui.text.strong` → `--keith-ui-text-strong`

```css
.element {
  color: var(--keith-ui-text-default);
  background: var(--keith-ui-bg-default);
  padding: var(--keith-padding-md);
  gap: var(--keith-gap-sm);
}
```

---

# Technical

## Overview
Static portfolio site built with Pug and Sass. Pulls design tokens from the shared `~/Projects/tokens/` directory. No JavaScript frameworks — pure static generation.

## Tech Stack
- **Templating:** Pug
- **Styling:** Sass
- **Build:** Node.js scripts, Browser-Sync
- **Fonts:** Test American Grotesk, JetBrains Mono, Inter

## Naming Conventions
**Folder names:** Use lowercase with hyphens: `lorem-ipsum-dolor`

## Project Structure
```
keith-barney-portfolio/
├── src/
│   ├── styles/
│   ├── scripts/
│   ├── pages/
│   └── assets/
├── dist/
├── package.json
└── readme.md
```

## Commands
```bash
npm run dev           # Build + watch + serve with live reload
npm run build         # Full build: tokens → styles → pages
npm run build:tokens  # Generate Sass from token JSON
npm run build:styles  # Compile Sass to CSS
npm run build:pages   # Compile Pug to HTML
```

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

## Token Build Process
```
~/Projects/tokens/*.json → build-tokens.js → _tokens.sass
```

**Always run `npm run build:tokens` after modifying token JSON files.**

Supports project-specific overrides:
```bash
node build-tokens.js --project-overrides=./overrides.json
```

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

### Column Patterns
```
12 = 3+3+3+3 = 4+4+4 = 6+6 = 4+8 = 3+6+3
```

## Responsive Breakpoints

| Mixin | Min-Width |
|-------|-----------|
| `@include sm` | 480px |
| `@include md` | 768px |
| `@include lg` | 1024px |
| `@include xl` | 1200px |
| `@include xxl` | 1440px |

Reverse (max-width): `@include md-down`

## Accessibility

Built-in utilities in `_accessibility.sass`:

```scss
.sr-only        // Screen reader only
.skip-link      // Keyboard navigation
.focus-ring     // 2px outline + 2px offset
.touch-target   // Min 44×44px (WCAG 2.5.5)
.motion-reduce  // Respects prefers-reduced-motion
```

## Notes
- `_tokens.sass` is auto-generated — never edit directly
- Mobile-first responsive design
- `[data-theme="dark"]` enables dark mode
- No JavaScript — static HTML output
- Content-first, linear layout philosophy
