# Repository Guidelines

## Project Structure & Module Organization

The active portfolio application lives in `codex-site/`. Its Next.js/Vinext entry points are in `codex-site/app/`: `layout.tsx` supplies the shared document shell, `page.tsx` redirects the root route, and `globals.css` contains application-wide styles. Public, browser-served portfolio content is in `codex-site/public/`, including HTML case studies, `css/`, `js/`, `images/`, and local `fonts/`. Keep a page’s assets close to their public consumer (for example, `public/images/atlas-annotate-1.png`).

## Build, Test, and Development Commands

Run commands from `codex-site/` with Node.js 22.13 or later:

- `npm install` installs the locked dependencies.
- `npm run dev` starts the local Vinext development server.
- `npm run lint` runs ESLint with the Next.js core-web-vitals and TypeScript rules.
- `npm run build` creates a production build; use it to catch build-time and type errors.
- `npm run start` serves the production build after a successful build.

There is no automated test runner configured. For changes to public pages, verify the affected route in a browser at desktop and mobile widths, then run lint and a production build.

## Coding Style & Naming Conventions

Use TypeScript and React function components for application code. Follow the existing two-space indentation, semicolons, single-quoted imports, and `PascalCase` component names. Use `camelCase` for local variables and functions. Keep route components small; move only genuinely reusable UI into clearly named modules. Preserve the established lowercase, hyphenated asset and static-page names, such as `atlas-branch-manager.html` and `site-nav.css`.

ESLint is the source of truth for code quality. Do not hand-edit generated directories such as `.next/`, `.vinext/`, `dist/`, or `node_modules/`.

## Commit & Pull Request Guidelines

Recent commits use brief, imperative, title-cased subjects, such as `Tighten mobile navigation spacing`. Keep each commit focused and describe the user-visible change. Pull requests should include a concise summary, affected routes or assets, validation commands run, and before/after screenshots for visual changes. Link the related issue when one exists.

## Configuration & Content Safety

Do not add secrets or deployment credentials to source control. Favor optimized, appropriately sized assets in `public/`, and retain local font licensing and attribution information when adding or replacing fonts.
