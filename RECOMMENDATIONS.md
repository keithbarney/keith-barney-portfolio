# Portfolio Improvement Recommendations

## What Was Fixed (This PR)

1. **Missing asset:** Created `case-study-05.svg` (Paciolan project referenced it but file didn't exist — broken image on live site)
2. **Dead links:** Replaced `href="#"` placeholder links for Paciolan and SpeakUp in About section with real URLs
3. **SEO/Social sharing:** Added Open Graph and Twitter Card meta tags to `_head.pug` — links shared on Slack/LinkedIn/Twitter now show proper titles and descriptions
4. **Page title:** Updated from generic "Design Systems Designer" to "Design Systems Leader" to match the role Keith is targeting
5. **Accessibility:** Added skip-to-content link for keyboard navigation
6. **README:** Complete rewrite to match actual project structure, commands, and features (was outdated with wrong folder names and missing pages)

---

## High-Priority Recommendations

### 1. Case Study Detail Pages
**Impact: Critical for job applications**

Right now all case studies are inline on the homepage — long paragraphs with no visual breakup. Senior DS roles at FAANG expect **dedicated case study pages** with:
- Problem → Process → Solution → Impact structure
- Metrics and outcomes (adoption %, time saved, teams impacted)
- Visuals: before/after, component screenshots, token architecture diagrams
- Your specific role vs. the team's

**Inspiration:** Look at portfolios from designers at Google/Meta (e.g., Sebastien Gabriel, Olivia Truong at Shopify, Adham Dannaway). They all use separate deep-dive pages.

### 2. Real Project Imagery
**Impact: High**

The SVG placeholders (dot grids, abstract shapes) are on-brand but read as "work in progress." Replace with:
- Figma component library screenshots
- Token architecture diagrams
- Before/after UI comparisons
- Design system documentation screenshots
- Adoption dashboard mockups

Even anonymized/redacted Experian screens would be far more compelling than geometric placeholders.

### 3. Quantify Impact
**Impact: High**

The case study descriptions are strong narratively but lack numbers. Add where possible:
- "Unified X components across 3 platforms" → how many components?
- "Reduced redundant Figma frames" → by what %?
- "Designers' Figma proficiency increased" → measurable how?
- "Turned abstract adoption conversations into concrete work items" → for how many product teams?

### 4. Add a Resume/PDF Download
**Impact: Medium-High**

Recruiters want a downloadable resume. Add a link in the header or footer.

### 5. OG Image
**Impact: Medium**

Create a branded OG image (1200×630) so links to keithbarney.design look polished when shared. Could be the name + role on the dark background with the halftone pattern.

---

## Medium-Priority

### 6. Performance
- The `.otf` fonts should be converted to `.woff2` for ~60% size savings (Test American Grotesk is large)
- Add `font-display: swap` (already done ✓)
- Consider lazy-loading the halftone canvas on mobile (it's CPU-intensive for a phone)

### 7. Mobile Polish
- Project images are `display: none` on mobile — consider showing a smaller version rather than hiding entirely
- The disciplines grid collapses to a single column but could be 2-column on tablet

### 8. Contact / CTA
- No clear call-to-action beyond the email link. Consider a "Let's talk" section or a more prominent contact area
- The email in the footer is easy to miss

### 9. Analytics
- No analytics present. Add a lightweight solution (Plausible, Fathom, or even a simple Cloudflare analytics snippet) to understand visitor behavior

### 10. Favicon
- No favicon configured. Create a simple "KB" monogram or use the wordmark

---

## Nice-to-Have

### 11. Page Transitions
- Between index and discography, a simple cross-fade or slide would add polish

### 12. Case Study Filtering/Sorting
- As you add more projects, consider filtering by skill (Design Systems, Tooling, Leadership)

### 13. Dark/Light Theme
- The light theme toggle exists but needs testing — make sure all token values work in both modes

### 14. Discography Page Styles
- The discography page loads `halftone.js` but has no hero section to contain it — verify it renders correctly
- Table styles may need their own section in portfolio.css (they rely on Heavy DS defaults)

---

## Competitive Landscape

Top design system portfolios in 2025 share these patterns:
- **Story-first case studies** with clear problem/solution/impact framing
- **3-4 deep projects** rather than many shallow ones
- **Real deliverables** shown (not just descriptions)
- **Clean, systematic design** that demonstrates the designer's own DS thinking
- **Fast load times** and flawless mobile experience

Keith's portfolio already nails the aesthetic and systematic design angle. The biggest gap is **depth** — moving from descriptions to visual, evidence-rich case studies.
