# Styling System

## Overview

Tailwind CSS v4 (config-less). All design tokens in `globals.css` via `@theme inline`. Brand system: "Ink & Paper" — deep ink blue, warm cream, gold accent.

## Brand Reference

Full brand guidelines: `~/Workspace/claude-skills/kagaj-ai/features/brand-guidelines.md`
Design workflow: `web/CLAUDE.md` — Mandatory Design Workflow section

## Tailwind v4 Setup

No `tailwind.config.ts`. All configuration in `globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

:root { /* CSS custom properties */ }
.dark { /* dark mode overrides */ }

@theme inline {
  /* Maps CSS vars → Tailwind utilities */
  --color-primary: var(--primary);
  --font-sans: "Plus Jakarta Sans Variable", ...;
}
```

## Color Tokens

### Surfaces
| Token | Tailwind Class | Value | Use |
|-------|---------------|-------|-----|
| --background | bg-background | warm cream | Page background |
| --card | bg-card | pure white | Card surfaces |
| --muted | bg-muted | warm gray | Subtle backgrounds |

### Primary (Ink Blue)
| Token | Tailwind Class | Use |
|-------|---------------|-----|
| --primary | bg-primary, text-primary | Main actions, links, headings |
| --primary-foreground | text-primary-foreground | Text on primary bg |
| --primary-hover | bg-primary-hover | Button hover |
| --primary-active | bg-primary-active | Button active/pressed |
| --primary-subtle | bg-primary-subtle | Selected row bg, subtle highlight |
| --primary-subtle-fg | text-primary-subtle-fg | Text on primary-subtle bg |

### Gold (Decoration Only)
| Token | Tailwind Class | Use |
|-------|---------------|-----|
| --gold | bg-gold, text-gold | Premium badges, upgrade CTAs, decorative |
| --gold-foreground | text-gold-foreground | Text on gold bg |

**NEVER use gold as text on light backgrounds** — fails WCAG AA (~2.8:1 contrast).

### Semantic States
| Token | Tailwind Class | Use |
|-------|---------------|-----|
| --success / --success-subtle | bg-success | Success messages, confirmations |
| --warning / --warning-subtle | bg-warning | Warning alerts |
| --destructive / --destructive-subtle | bg-destructive | Errors, delete actions |
| --info / --info-subtle | bg-info | Info messages, hints |

### Neutral Scale (Warm Grays)
`bg-neutral-50` through `bg-neutral-900` — warm-tinted grays, not cold slate/zinc.

## Typography

### Fonts
- **UI Latin**: Plus Jakarta Sans Variable (self-hosted via @fontsource)
- **UI Nepali**: Noto Sans Devanagari Variable (auto-selected by browser per script)
- Both imported in `layout.tsx`, set in `--font-sans`

### Scale
```
text-[1.75rem]  — h1 (28px) — tracking-[-0.025em]
text-[1.375rem] — h2 (22px) — tracking-[-0.02em]
text-[1.125rem] — h3 (18px) — tracking-[-0.01em]
text-base       — body (16px) — minimum, non-negotiable
text-sm         — secondary (14px)
text-xs         — caption (12px)
```

### Devanagari Rules
- Always use `leading-[1.7]` — vowel marks clip at normal line-height
- NEVER apply letter-spacing — breaks conjunct clusters (क्ष, त्र, ज्ञ)
- Font stack auto-selects correct font per Unicode script

## Spacing (4px base, 8px rhythm)

```
gap-0.5  (2px)  — micro: icon-to-label
gap-1    (4px)  — xs: inner padding
gap-2    (8px)  — sm: related elements
gap-3    (12px) — md: input padding
gap-4    (16px) — lg: card padding, field gaps
gap-6    (24px) — xl: card-to-card
gap-8    (32px) — 2xl: section separators
gap-12   (48px) — 3xl: page sections
```

## Border Radius

```
rounded-sm  — 4px (6px target, close enough)
rounded-md  — 8px — buttons, dropdowns
rounded-lg  — 10px — cards, panels, modals
rounded-xl  — 14px — large cards, dialogs
rounded-2xl — ~14.4px — sheets, drawers
```

## Animation

- 150ms: hover, active states (`duration-150`)
- 200ms: card lift, dropdown (`duration-200`)
- 300ms: modal enter, sheet slide (`duration-300`)
- Easing: `ease-[cubic-bezier(0.4,0,0.2,1)]`
- PROHIBITED: spring/bounce, stagger in tables, parallax, looping idle

## Files

| File | Purpose |
|------|---------|
| `src/app/globals.css` | All CSS tokens, theme config, base styles |
| `src/app/layout.tsx` | Font imports, metadata |
| `src/lib/utils.ts` | `cn()` class merging utility |
