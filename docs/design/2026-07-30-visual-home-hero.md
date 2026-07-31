---
artifact: visual
topic: portfolio-home-hero
date: 2026-07-30
status: implemented
upstream: PRODUCT.md, DESIGN.md, index.html
downstream: 2026-07-30-qa-portfolio-release.md
---

# Visual direction — home hero

## Intent

Present real product work above the fold with the finish of a senior design portfolio, without turning
screenshots into decorative mockups or implying evidence that does not exist.

## Implemented system

| Element | Implementation | Reason |
|---------|----------------|--------|
| Primary artifact | Solving AI workflow screen, 1440×960 WebP, inside a straight browser frame | Preserves product credibility and avoids transform-induced softness |
| Enterprise artifact | Nvidia redacted dashboard as a 1200×720 SVG | Remains sharp at every density while respecting the NDA |
| Shipped artifact | EPM mobile map, 620×1342 WebP, inside a CSS device frame | Shows a real mobile outcome without an external device mockup |
| Stage | `--ink` surface, `--acid` blue glow, grid, orbit, `--radius-xl` | Adds authored depth while keeping the work dominant |
| Labels | JetBrains Mono with explicit project and proof type | Makes the collage scannable and reinforces the evidence voice |
| Motion | Eight-pixel hover lift; removed under `prefers-reduced-motion` | Provides feedback without affecting legibility |

## Quality controls

- No generated product imagery is presented as real work.
- Above-fold images load eagerly; the primary image uses `fetchpriority="high"`.
- Raster assets render below their intrinsic width at desktop and mobile breakpoints.
- Rotation was removed from all product cards to prevent browser resampling blur.
- Rounded corners reuse the existing radius tokens rather than introducing a second geometry system.
- Every linked artifact retains visible copy and descriptive alternative text.

## Limitation

The implementation was validated structurally and by asset dimensions. Chrome headless and the in-app
browser were unavailable under the current sandbox, so final visual approval still requires opening the
local build in a normal browser.
