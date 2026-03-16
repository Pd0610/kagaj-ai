# KagajAI — Web (Next.js 15)

## Design System — "Ink & Paper"

**Brand guidelines**: `~/Workspace/claude-skills/kagaj-ai/features/brand-guidelines.md` — READ THIS before any UI work. It is the single source of truth for colors, typography, spacing, components, and PDF styling.

### Mandatory Design Workflow

Before writing ANY frontend component, page, or layout:

1. **Read brand guidelines** — Consult `features/brand-guidelines.md` for exact token values, spacing rules, and component specs.
2. **Invoke `/ui-ux-pro-max` skill** — Use the Skill tool for style, palette, typography, and UX guidance. Run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py --design-system` for the full system. Query specific domains as needed.
3. **Use brand tokens** — Every color, radius, spacing value comes from CSS custom properties. Zero hardcoded values.
4. **Verify visually** — After building, use Playwright to screenshot and confirm the result matches the brand.

### Color Tokens (use these, never raw values)

```
Surfaces:     bg-background (cream), bg-card (white), bg-muted
Primary:      bg-primary, text-primary, bg-primary-subtle, text-primary-subtle-fg
               hover:bg-primary-hover, active:bg-primary-active
Gold:         bg-gold (decoration/upgrade CTAs only, NEVER as text on light)
Semantic:     bg-success, bg-warning, bg-destructive, bg-info (+ -subtle variants)
Neutral:      bg-neutral-50 through bg-neutral-900 (warm gray scale)
```

### Typography Rules

- **UI Latin**: Plus Jakarta Sans (already in --font-sans)
- **UI Nepali**: Noto Sans Devanagari (auto-selected by browser per script)
- **Headings**: negative letter-spacing (-0.025em h1, -0.02em h2, -0.01em h3)
- **Devanagari text**: MUST use `leading-[1.7]` — vowel marks clip at normal line-height
- **NEVER letter-space Devanagari** — breaks conjunct clusters
- **Minimum body text**: 16px (1rem). Non-negotiable.
- **Scale**: h1=28px, h2=22px, h3=18px, h4=16px, body=16px, secondary=14px, caption=12px

### Spacing (4px base, 8px rhythm)

```
2px   micro     icon-to-label
4px   xs        inner padding
8px   sm        related elements gap
12px  md        input padding, button vertical
16px  lg        card padding, field gaps
24px  xl        card-to-card
32px  2xl       section separators
48px  3xl       page section breaks
```

**When in doubt, use multiples of 8.**

### Component Specs

**Buttons**: 40px height, px-4 (16px), rounded-md (8px), font-semibold, text-[15px]. Touch target: min 44px.
**Form fields**: 40px height, px-3 (12px), border border-input, focus:ring-2 ring-primary. White bg on cream page.
**Cards**: bg-card, border, rounded-lg (10px), p-5 (20px). Shadow: warm tone `rgba(34,25,10,*)` not pure black.
**Card hover**: `hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`

### Animation Rules

- 150ms hover/active, 200ms card/dropdown, 300ms modal/sheet
- Never exceed 400ms
- Easing: `ease-[cubic-bezier(0.4,0,0.2,1)]`
- **PROHIBITED**: spring/bounce, stagger animations in tables, parallax, looping idle animations
- Animations confirm actions, not celebrate them

### Layout Patterns

- **Page width**: `max-w-7xl mx-auto` for dashboard content
- **Sidebar**: `w-64` fixed, cream-tinted (`bg-sidebar`)
- **Cards grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Form layout**: Single column, `max-w-lg`, `space-y-4`

### Voice & Labels

- **Nepali-first labels**: "दस्तावेज बनाउनुहोस्" not "Create Document" (for document-facing UI)
- **Errors**: Never blame user. "यो फिल्ड भर्नुहोस्" not "Required field missing"
- **Empty states**: Encouraging, show what to do next
- **Dates**: BS first, AD in parentheses. २०८० माघ १५ (January 29, 2024)

### Anti-Patterns (things that cause generic AI output)

- Using raw Tailwind grays (`gray-100`, `slate-200`) instead of semantic tokens
- Centering everything on the page with no visual hierarchy
- Using default shadcn styling without brand customization
- Missing hover/focus states on interactive elements
- No visual distinction between background and card surfaces
- Forgetting warm cream background (using pure white `bg-white` everywhere)
- No gold accent anywhere — the brand feels cold without it
- Buttons with no hover state change

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 (config-less, tokens in `globals.css` `@theme inline`)
- **Components**: shadcn/ui (customized with brand tokens)
- **Icons**: Lucide React (1.5px stroke body, 2px buttons)
- **Fonts**: `@fontsource-variable/plus-jakarta-sans`, `@fontsource-variable/noto-sans-devanagari`
- **State**: React Context for auth, server components by default

## Quality Gates

- TypeScript strict mode (`strict: true`, `noUncheckedIndexedAccess: true`)
- ESLint zero warnings
- `next build` must pass
- No `any` types
- No `console.log` in committed code
