# DESIGN.md

Visual system for the evidence portfolio. Register: brand. Risk budget: high.

## Color — Committed

One color owns the surface. The page alternates between **paper** and full-bleed **ink**; ink carries roughly 40–50% of the scroll. No hedging with neutral bands at the edges of ink sections.

| Role | OKLCH | Use |
|---|---|---|
| `--paper` | `oklch(0.982 0.005 175)` | Default surface. Warm off-white, tinted toward the brand hue. |
| `--paper-sunk` | `oklch(0.955 0.008 175)` | Recessed panels on paper. |
| `--ink` | `oklch(0.205 0.028 192)` | Full-bleed sections. Deep, tinted near-black. Never `#000`. |
| `--ink-raised` | `oklch(0.265 0.032 192)` | Cards and receipts on ink. |
| `--teal` | `oklch(0.56 0.098 180)` | Brand accent, carried over. Links, rules, active states. |
| `--teal-bright` | `oklch(0.72 0.11 180)` | The same accent on ink, where it needs lift. |
| `--signal` | `oklch(0.79 0.148 74)` | **Evidence marker.** Amber. Marks every number that opens. |
| `--text` | `oklch(0.24 0.02 192)` | Body on paper. |
| `--text-soft` | `oklch(0.50 0.014 192)` | Secondary on paper. |
| `--on-ink` | `oklch(0.94 0.006 175)` | Body on ink. |
| `--on-ink-soft` | `oklch(0.72 0.012 192)` | Secondary on ink. |

Amber is reserved. It means *this claim has a receipt.* Never decorative.

Reduce chroma as lightness approaches the extremes. No pure black, no pure white anywhere.

## Typography — extreme contrast

Three families, each with one job.

- **Bricolage Grotesque** — display only. Variable on three axes: `wght 200–800`, `wdth 75–100`, `opsz 12–96`. The **width axis is the drama**: display type runs condensed (`wdth 78`) at 800 weight, which reads as compressed force rather than merely large. Existing identity, pushed hard.
- **Inter** — body. The self-hosted subset carries `400–700` only, so 400 is the light end. Emphasis at 600. Existing identity, kept.
- **JetBrains Mono** — the evidence voice. 500/600, uppercase, `0.1em` tracking, small. Every receipt label, every method note, every sample size.

The system *is* the contrast: enormous condensed 800-weight display against small 400-weight body and tiny mono annotations. Ratio between display and body exceeds 5×. Flat scales read as uncommitted.

```
--step-display : clamp(3.2rem, 9.5vw, 8rem)     /* Bricolage 800 */
--step-xl      : clamp(2rem, 4.2vw, 3.25rem)
--step-lg      : clamp(1.35rem, 2.2vw, 1.75rem)
--step-body    : clamp(1rem, 1.15vw, 1.125rem)  /* Inter 400 */
--step-mono    : 0.72rem                         /* JetBrains 600, tracked */
```

Line-height on ink gets `+0.06`. Light type on dark reads lighter and needs the room.

## The receipt — signature component

The one element the whole site is built around. Any quantitative claim renders as a receipt.

```
CLAIM        Ten filters → one prompt          ← display, large
─────────────────────────────────────────
EVIDENCE     9 of 10 participants              ← mono label, Inter value
METHOD       Unmoderated prototype test, Maze
SAMPLE       n = 10 · directional, not statistical
CAVEAT       The tenth never realised they      ← always present
             could prompt at all
```

Rules:

1. **Every receipt carries a CAVEAT row.** No exceptions. A receipt without a caveat is marketing.
2. Numbers appear as ratios (`9 of 10`), never as derived percentages that hide the sample.
3. Built on `<details>`/`<summary>` so it works without JavaScript. Open transition animates `grid-template-rows`, never `height`.
4. The amber marker sits on the trigger. Amber anywhere means openable.

## Layout

- Asymmetric. 70/30 and 62/38 splits. Never centered stacks.
- Display type is allowed to break its container and bleed past the grid edge.
- Ink sections are full-bleed, edge to edge, no rounded outer corners.
- Rhythm through variation: 140px between movements, 16px inside a receipt.
- Cards only where they are genuinely the right affordance. Receipts are not cards.

## Motion

- Entrance: staggered reveal, 60ms between siblings, `cubic-bezier(0.22, 1, 0.36, 1)`.
- Receipts open on `grid-template-rows: 0fr → 1fr`.
- No bounce, no elastic, no parallax on text.
- Everything collapses under `prefers-reduced-motion: reduce`.

## Bans, specific to this site

- No stat strip. Big-number-small-label-three-across is the SaaS hero template and is rejected by name.
- No gradient text, no `background-clip: text`.
- No glassmorphism.
- No fabricated imagery. Real project artifacts, redacted diagrams, and honest data visualisation only. A generated product screenshot presented as work is disqualifying on a site whose entire premise is verifiability.
- No repeated tiny uppercase kickers above every section. Mono labels belong to receipts, where they carry meaning.
