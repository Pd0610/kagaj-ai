# KagajAI Web — Knowledge Base

> Every subsystem documented. Read the relevant doc before working on that area.

## Subsystem Index

| Doc | What it covers | When to read |
|-----|---------------|--------------|
| [auth.md](auth.md) | AuthContext, login/register pages, token storage, auth flow | Any auth UI, protected routes, user state |
| [routing.md](routing.md) | App Router structure, route groups, layouts, page inventory | Adding pages, navigation changes, layout work |
| [components.md](components.md) | shadcn/Base UI inventory, component APIs, patterns | Building UI, using existing components |
| [api-client.md](api-client.md) | API client, envelope pattern, error handling | API calls, data fetching, error display |
| [styling.md](styling.md) | Tailwind v4, CSS tokens, brand system, design workflow | Any visual/UI work |

## Quick Facts

- **Framework**: Next.js 15 (App Router), React 19
- **Styling**: Tailwind CSS v4 (config-less, tokens in globals.css `@theme inline`)
- **Components**: shadcn/ui on Base UI primitives (NOT Radix)
- **Fonts**: Plus Jakarta Sans (UI), Noto Sans Devanagari (Nepali) — self-hosted via @fontsource
- **Icons**: Lucide React
- **Auth**: localStorage token + React Context
- **TypeScript**: strict mode, noUncheckedIndexedAccess
