# Project Notes

Personal notes and quick reference for the design system.

---

## Shell Aliases

Added to `~/.zshrc`:

```bash
alias style-guide="cd ~/Projects/keith-design-system/docs/style-guide"
alias design-system="cd ~/Projects/keith-design-system"
alias portfolio="cd ~/Projects/portfolio"
```

---

## Quick Start Commands

### Style Guide
```bash
style-guide
npm run dev
```

### Design System (build tokens)
```bash
design-system
npm run build
```

### Portfolio
```bash
portfolio
npm run dev
```

---

## Project Locations

| Project | Path |
|---------|------|
| Design System | `~/Projects/keith-design-system` |
| Style Guide | `~/Projects/keith-design-system/docs/style-guide` |
| Portfolio | `~/Projects/portfolio` |

---

## Figma Sync

```bash
design-system
npm run pull:figma   # Pull tokens from Figma
npm run push:figma   # Push tokens to Figma
```

Requires `tokens/.env` with `FIGMA_TOKEN` and `FIGMA_FILE_KEY`.

---

## Notes

<!-- Add your notes below -->
