# Juan David Colorado Vargas · Portfolio

Senior / Lead Product Designer who ships the front-end too. This repository is the full source for my portfolio, live at **[juancoloradov.github.io/portfolio](https://juancoloradov.github.io/portfolio/)**.

It is hand-coded in vanilla **HTML, CSS, and JavaScript**. No framework, no build step, no dependencies, no page builder. What you see in this repo is the entire product.

## Why it is built this way

I design enterprise and AI products, and I write the front-end that ships them. This site is the proof of that: every token, interaction, and animation is hand-authored, the same way I work alongside engineering teams. The medium is the message.

## Highlights

**Zero-dependency front-end**
- No `package.json`, no bundler, no runtime framework. Open `index.html` and it runs.
- One stylesheet driven by CSS custom properties (design tokens), one progressively-enhanced script.

**Design system**
- Type pairing: Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels).
- Tokenized color, spacing, and elevation; a single teal accent carries the brand.

**Native dark mode**
- Respects the visitor's OS preference on first paint, with an inline pre-render script so there is no flash of the wrong theme.
- Manual toggle, persisted to `localStorage`. Every text and accent pair is checked for WCAG AA contrast in both themes.

**Accessibility**
- Semantic landmarks, ordered headings, a skip-to-content link, visible focus states, full keyboard support.
- A scroll-spy nav and a side section stepper that set `aria-current`.
- A focus-managed modal lightbox (role `dialog`, Escape to close).
- Honors `prefers-reduced-motion` throughout; motion degrades, it never breaks.

**Performance**
- WebP with JPEG fallbacks through `<picture>`, lazy-loaded below the fold.
- Explicit media dimensions keep Cumulative Layout Shift near zero.
- Animation runs on `transform` and `opacity` only, so nothing thrashes layout.

**Interaction, hand-rolled**
- `IntersectionObserver` powers the scroll-spy and the staggered reveal animations.
- A living, theme-aware hero atmosphere, a bento case grid, spatial-depth card hovers, and live, clickable proof of shipped sites.

## The CV is part of the design system

`assets/Juan_David_Colorado_CV.pdf` is generated from `cv.html`, so the resume shares the exact fonts, color, and spatial layout as the site. It is not a Word export.

## Structure

```
index.html            single page
cv.html               source for the on-brand PDF resume
css/styles.css        design tokens + every component
assets/               images (WebP + fallbacks), icons, OG card, CV
robots.txt · sitemap.xml · site.webmanifest
```

## Run it locally

No build required. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

**Juan David Colorado Vargas** · Senior / Lead Product Designer · Medellín, Colombia
[Live site](https://juancoloradov.github.io/portfolio/) · [Resume](https://juancoloradov.github.io/portfolio/assets/Juan_David_Colorado_CV.pdf)
