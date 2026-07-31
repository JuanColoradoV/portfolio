---
artifact: qa
topic: portfolio-release
date: 2026-07-30
status: conditional-pass
upstream: PRODUCT.md, DESIGN.md, 2026-07-30-visual-home-hero.md, index.html, case pages, CV PDF
scope: index, five case studies, note, 404, preview redirect, CV source and PDF
---

# QA — portfolio release

## Representative tasks

1. A recruiter identifies Juan's level, focus, and strongest evidence above the fold.
2. A design leader opens a featured case and follows the decision trail.
3. A visitor opens a live product, downloads the CV, or starts a conversation.
4. A keyboard user reaches navigation, cases, image controls, social links, and contact actions.

## Findings

| ID | Area | Pillar | Severity | Detail | Recommendation | Status |
|----|------|--------|----------|--------|----------------|--------|
| 01 | Published entry point | Usability / consistency | **Blocker** | The redesigned experience previously lived in `preview.html` instead of the production entry point. | Promote the redesign to `index.html`; retain `preview.html` only as a no-index redirect. | **Fixed** |
| 02 | Home hero artifacts | Visual / usability | **Medium** | Rotated raster cards made otherwise adequate source images appear soft and generic. | Use straight product frames, high-density raster assets, and SVG where available. | **Fixed** |
| 03 | Footer contact | Usability / WCAG | **Medium** | Social destinations and email lacked enough visual hierarchy on the dark footer. | Add labelled email plus 44px LinkedIn and Behance controls using the accessible blue accent. | **Fixed** |
| 04 | Bucket outcomes | Evidence / trust | **High** | `80%` drop-off and `0` engineering rework had no repository source or documented method. | Replace them with defensible scope facts: three friction points, two prototype directions, four-step funnel. | **Fixed** |
| 05 | Document structure | WCAG 2.2 AA | **High** | Potential failures include missing labels, duplicate IDs, broken heading order, unsafe new tabs, and missing image metadata. | Parse all ten current pages and resolve failures. | **Passed — 0 found** |
| 06 | Routes and fragments | Usability | **High** | Broken local assets or anchors would block case and contact tasks. | Validate local references and fragments across current pages. | **Passed — 0 found** |
| 07 | Contrast and targets | WCAG 2.2 AA | **High** | Dark-surface accent and small navigation targets previously approached or missed minimums. | Use `--acid-on-dark`, darker blue on paper, and 44px preferred hit areas. | **Fixed / static recheck passed** |
| 08 | Resume PDF | Content / visual | **High** | The one-page CV was undersized, compressed, and visually subordinate to the portfolio. | Rebuild it as a two-page executive resume in true Letter size with selectable text, clear evidence, and full contact URLs. | **Passed — 2 pages, 702 words** |
| 09 | Asset performance | Performance | **Medium** | Three Bucket PNG fallbacks exceed 500KB. | Serve their 82–137KB WebP sources first and retain PNG only as fallback. | **Passed** |
| 10 | SproutLoud tenure | Content / evidence | **High** | Seven years of production and leadership experience appear in the CV and experience list but still lack a dedicated case. | Build a case only from real artifacts and outcomes supplied by Juan. | **Open — content required** |
| 11 | Manual assistive-tech pass | WCAG 2.2 AA | **Medium** | Static checks cannot prove tab order, focus visibility, 400% reflow, VoiceOver, or NVDA behavior. | Run a human keyboard pass plus VoiceOver and NVDA spot checks before claiming conformance. | **Open** |
| 12 | External live sites | Reliability | **Low** | Fina was externally verified; the available tool could not verify every other external destination. | Open all five live links manually before publishing. | **Open — manual check** |

## Compliance summary

**Tested:** ten current HTML documents; one `h1` per content page; heading order; duplicate IDs; local
references and fragments; image `alt`, width, and height; safe `_blank` links; JSON-LD; manifest and
sitemap syntax; CSS brace balance and local URLs; JavaScript syntax; PDF page count, extractable text,
and both rendered pages; asset fallback sizes; reduced-motion rules; documented contrast pairings and target
sizes.

**Not tested:** manual browser interaction, 400% zoom, forced-colors, VoiceOver, NVDA, or a visual
desktop/mobile browser capture. The sandbox exposed no usable browser binding and blocked local headless
Chrome. HIPAA-aware UI review is excluded because the portfolio does not display patient or clinical
records; the inspected healthcare table uses synthetic `example.com` addresses. This is not a claim of
HIPAA or WCAG conformance.

## Sign-off

**Conditional pass for local visual review.** There are no known release-blocking code, route, PDF, or
unsupported-claim defects in the current files. Final publication should wait for Juan's browser review,
manual live-link check, and assistive-technology spot check. The SproutLoud case remains the primary
content opportunity rather than a technical defect.
