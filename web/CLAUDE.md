# KagajAI Web — Project Instructions

Inherits from `../CLAUDE.md`. This file adds web-specific conventions.

## UI Components

- **shadcn/ui only** — never build native UI components (no custom buttons, selects, dialogs, etc.)
- Use `npx shadcn@latest add <component>` to add new ones
- All shadcn components live in `src/components/ui/`
- **Base UI primitives** — shadcn v4 uses `@base-ui/react`, not Radix. Key differences:
  - Use `render` prop instead of `asChild` (e.g. `<SidebarMenuButton render={<Link href="/" />}>`)
  - Trigger open state: `data-popup-open` not `data-[state=open]`
  - Anchor width CSS var: `--anchor-width` not `--radix-*-trigger-width`

## Layout

- **Sidebar layout** — `SidebarProvider` + `Sidebar` + `SidebarInset` (not top-nav)
- Sidebar: `collapsible="icon"` — collapses to icon-only strip
- Use `group-data-[collapsible=icon]:hidden` on text elements inside sidebar header/footer to hide them when collapsed
- Use `shrink-0` on icon containers (logo, avatar) to prevent squishing in collapsed state
- Top bar: `SidebarTrigger` + `Separator` + `Breadcrumb`

## Design & UI/UX

- **Always use skills for design work** — invoke `frontend-design` skill and `ui-ux-pro-max` skill for any visual/layout/color/typography decisions
- `ui-ux-pro-max` search script: `python3 /Users/surya-techdev/Workspace/kagaj-ai/.claude/skills/ui-ux-pro-max/scripts/search.py`
- **Target user**: CA firm employees (non-technical). Design for simplicity, not developers.
- **Font**: Plus Jakarta Sans (premium SaaS feel)
- Color system defined in `globals.css` — direct HSL values, no hue variables
