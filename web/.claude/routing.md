# Routing & Layouts

## Overview

Next.js App Router with route groups. No middleware-based auth — client-side redirect in dashboard layout.

## Route Structure

```
src/app/
├── layout.tsx              ← Root: fonts, metadata, body
├── page.tsx                ← / (landing page — currently placeholder)
├── globals.css             ← Tailwind v4 + brand tokens
├── not-found.tsx           ← 404 page (server component)
├── global-error.tsx        ← Root error boundary (own <html>/<body>)
├── (auth)/
│   ├── layout.tsx          ← Centered card, AuthProvider
│   ├── error.tsx           ← Auth error boundary (card-styled)
│   ├── login/page.tsx      ← /login
│   └── register/page.tsx   ← /register
└── (dashboard)/
    ├── layout.tsx          ← Auth guard, header, AuthProvider
    ├── error.tsx           ← Dashboard error boundary (header stays visible)
    ├── companies/page.tsx  ← /companies (card grid + create dialog)
    ├── templates/page.tsx  ← /templates (search + category tabs, click → /documents/new)
    └── documents/new/page.tsx ← /documents/new?template={id} (form + generate + download)
```

## Layouts

### Root Layout (`src/app/layout.tsx`)
- Imports fonts: Plus Jakarta Sans, Noto Sans Devanagari
- Metadata: "KagajAI — Document Generation for Nepal"
- Body: `font-sans antialiased`
- No providers at root level

### Auth Layout (`src/app/(auth)/layout.tsx`)
- Client component
- Wraps with `AuthProvider`
- Centered: `flex min-h-screen items-center justify-center bg-background p-4`
- Content width: `max-w-md`

### Dashboard Layout (`src/app/(dashboard)/layout.tsx`)
- Client component
- Wraps with `AuthProvider` (independent from auth layout)
- Auth guard: redirects to /login if not authenticated
- Header: `border-b border-border bg-card`, h-16, max-w-7xl
- Nav links: Companies (Building2 icon), Templates (FileText icon) — active state: bold + bottom border via `usePathname()`
- Plan badge next to user name (gold for Pro)
- Upgrade nudge pill (free users only): Crown icon + "Upgrade" in gold
- Main content: `max-w-7xl mx-auto px-4 py-6`

## Pages

### Landing (`/`)
- Server component (no client interactivity)
- Full marketing page with 7 sections: Navbar, Hero, Problem, Features, How it Works, Pricing, Final CTA, Footer
- Fixed navbar with backdrop blur (`bg-background/80 backdrop-blur-md`)
- Hero: gold AI badge, dual CTAs (primary + outline), decorative blur circles
- Problem: 3 pain points with destructive-subtle icon backgrounds
- Features: 6 cards in 3-col grid with primary-subtle icon backgrounds, hover lift
- How it Works: 3 numbered steps with connecting vertical line
- Pricing: 3 tiers (Free/Pro/Enterprise), Pro highlighted with gold "Most Popular" badge
- Final CTA: full-width ink blue section with inverted button
- Footer: brand logo, nav links, copyright
- All content defined as static arrays at module level (easy to update)

### Companies (`/companies`)
- Client component, local state
- Fetches `GET /companies` on mount
- Card grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Cards: type-specific icon circle (colored bg) + name + Nepali name, info rows (Hash/CreditCard/MapPin), colored type badge, hover lift
- Hover-reveal Pencil + Trash2 icon buttons per card
- Create + Edit dialog (shared form, `dialogMode` state): `api.post` for create, `api.put` for edit
- Delete confirmation dialog (second Dialog with `deletingCompany` state)
- Free tier limit: 1 company max, shows "X of 1" counter, gold "Upgrade to add more" button at limit
- Skeleton loading state

### Templates (`/templates`)
- Client component, local state
- Fetches `GET /templates` on mount
- Search input + category tabs with icons + counts (e.g. "Tax (3)")
- "Showing X of Y templates" filter counter
- Template cards: category icon circle (colored bg), gold Pro badge + Lock icon, name/Nepali name, 2-line description clamp, colored category badge
- Locked cards: `opacity-60`, no hover lift, "Upgrade to Pro" text with Crown icon
- Unlocked cards: hover lift + shadow

### Document Generation (`/documents/new?template={id}`)
- Client component, local state
- URL param: `template` (template UUID) via `useSearchParams()`
- Loads template + companies on mount via `Promise.all`
- Company selector: auto-fills `source: "company"` slots from company data (convention-based field map)
- Auto-filled slots: subtle `bg-primary-subtle/30` tint, user can override
- Slot ordering: company-source slots first, then doc-specific
- SlotField component: renders `text`/`textarea`/`number`/`date`/`select` based on slot type
- Submit: `POST /documents` → auto-download PDF blob via `api.downloadBlob()`
- Success state: checkmark, ref number, "Download Again" + "Generate Another" buttons
- Save-as-company nudge: shown if no company selected AND user has 0 companies
- Error display: inline error banner above submit button

## Key Patterns

1. **No shared AuthProvider** — each route group has its own. This means navigating between (auth) and (dashboard) loses auth state, but that's OK because:
   - Auth → Dashboard: login sets token, dashboard reads it from localStorage
   - Dashboard → Auth: logout clears token

2. **Landing page is a server component** — no client interactivity, pure static render. Dashboard/auth pages are client components with `useEffect` + local state.

3. **Loading states**: Skeleton cards during fetch, "Loading..." text during auth check.

4. **Navigation**: `<Link>` for internal, `router.push()` for programmatic.
