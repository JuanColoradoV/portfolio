---
artifact: visual
topic: executive-resume
date: 2026-07-30
status: implemented
upstream: PRODUCT.md, portfolio visual system, current career content
downstream: 2026-07-30-qa-portfolio-release.md
---

# Visual direction — executive resume

## Decision

Replace the compressed one-page layout with a two-page Letter resume appropriate for a 10+ year senior
profile. Page one prioritizes positioning, recent product leadership, and measured evidence. Page two
gives the seven-year SproutLoud tenure enough space to read as a career foundation rather than a footnote.

## System

- Dark ink header, accessible blue accent, warm paper background, and the portfolio radius language.
- Helvetica Neue for ATS-safe selectable text; Menlo for evidence and section labels.
- Open two-column grid without a heavy tinted sidebar.
- Evidence cards remain secondary to role scope and decisions.
- True US Letter output at 612×792 points; two rendered pages; 702 extractable words.
- Email, phone, LinkedIn, and portfolio destinations are printed in full and remain selectable.
- No photo, skill bars, rating dots, or decorative charts.

## Quality result

Both pages were rendered at 2× and visually inspected. No clipped text, overlap, broken glyphs, or
misaligned footer was found. The PDF remains under 100KB and uses real text rather than a flattened image.
