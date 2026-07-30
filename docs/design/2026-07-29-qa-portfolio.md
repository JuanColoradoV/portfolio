---
artifact: qa
topic: portfolio-site
date: 2026-07-29
status: findings-open
upstream: PRODUCT.md, DESIGN.md
scope: juancoloradov.github.io/portfolio (index, live build) — light + dark themes, 390-1440px
---

# QA — portfolio site

## What was tested, and what was not

**Tested.** Usability heuristics against five representative tasks; WCAG 2.2 AA contrast computed on
172 text/background pairings in both themes with canvas-resolved colours; target sizes (SC 2.5.8);
tabbability of every interactive control in the hero and work sections; reflow and horizontal-scroll
behaviour at 390 / 560 / 768 / 940 / 1024 / 1280 / 1440; document structure (single h1, lang, alt
attributes, skip link, landmarks); receipt behaviour with JavaScript disabled.

**NOT tested.** Screen readers (no VoiceOver or NVDA pass — findings on announced order and
`<details>` semantics are unverified). Real keyboard operation by a person; tabbability was measured
programmatically, which is not the same as a manual tab pass. 400% browser zoom. Focus-visible
appearance under `forced-colors`. HIPAA pillar excluded: no patient or clinical data on this site.
Design-vs-spec and the Figma batch audit do not apply; there is no Figma source.

## Findings

| ID | Area | Pillar | Severity | Detail | Recommendation | Status |
|----|------|--------|----------|--------|----------------|--------|
| 1 | Contact section | Principles / PRODUCT.md constraint | **High** | Subtitle read "Available for Senior Product Designer & Lead roles and select freelance engagements." He is employed at Symplast and PRODUCT.md states the site must not signal an active search. The same class of leak was removed from the hero on 07-28; this instance survived. | Replaced with a capability statement carrying no availability signal. | **Fixed** |
| 2 | `.section-nav__item` | WCAG 2.2 AA — SC 2.5.8 | **Medium** | Section-stepper dots measure 9×21px, below the 24×24 minimum. The Spacing exception may apply but has not been verified. | Enlarge the hit area to ≥24×24 via padding, keeping the dot visually small. | Open |
| 3 | `.nav__link` | WCAG 2.2 AA — SC 2.5.8 | **Medium** | Primary nav links measure ~41×16px. Height is below the 24px minimum. | Add vertical padding to reach 24px, or confirm the Spacing exception. | Open |
| 4 | Client marquee | Usability — aesthetic & minimalist design | **Low** | Names clip mid-word at both viewport edges ("…ia", "New H…"). Intentional marquee behaviour, but reads as a rendering fault on a static screenshot. | Add an edge mask/fade so the clip reads as deliberate. | Open |
| 5 | Case imagery | Principles | **Medium** | All three case covers use the same treatment: a product screenshot floating on an abstract coloured render. Decorative, not artifactual; nothing distinguishes the flagship, and none of it evidences process. | Replace with real artifacts (flow diagrams, before/after, component library). Blocked: needs the author to supply real Figma sources. Fabricated UI is explicitly banned by PRODUCT.md. | Open — blocked |
| 6 | Case cards | Principles / DESIGN.md | **Medium** | The hero promises every number opens; the EPM card's figures carry no sourcing line. Solving AI now does. | Add sourcing, or accept that "0→1" and "2 platforms" are facts rather than measured claims. | Open |
| 7 | SproutLoud | Content | **High** | Seven years of experience, now claimed on the CV, have no case study on the site. The strongest tenure claim is unevidenced. | Build the case study. Author's account gathered 07-29. | Open |

## Corrected during the audit

The first automated contrast pass reported 8 AA failures in light mode. All 8 were **artefacts of the
measurement**, not defects: the parser could not read `oklch()` values, and the background walker read
only `background-color`, so it missed the contact section's gradient and the badge's pseudo-element
fill. It also measured the skip link, which is hidden until focused. Re-run with canvas-resolved
colours: **0 confirmed contrast failures across 172 pairings in both themes.** Reported here because a
QA artifact that hides its own false positives is worth less than one that shows them.

## Passing

- Single `h1`, `lang` set, zero images missing `alt`, skip link present, 4 landmarks.
- No page-level horizontal scroll at any tested width; single-column below 940px.
- The receipt is a native `<details>`/`<summary>`: it opens and closes with JavaScript disabled.
- Every interactive control in the hero and work sections is natively focusable.
- Reduced-motion honoured on the receipt transition and the ink-band CTA.
- 0 confirmed contrast failures, both themes.

## Sign-off

**Not signed off.** Findings 2, 3, 4, 6 are open and fixable. Finding 5 is blocked on real assets.
Finding 7 is the largest gap and is content, not craft. A manual keyboard and screen-reader pass is
still required before any accessibility claim is made about this site.
