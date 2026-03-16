# Components

## Overview

shadcn/ui components built on **Base UI** (`@base-ui/react`) primitives — NOT Radix UI. This is important: Base UI APIs differ from standard shadcn docs. All components use CVA for variants and `cn()` for class merging.

## Installed Components

| Component | File | Primitive | Key Props |
|-----------|------|-----------|-----------|
| Button | `components/ui/button.tsx` | `@base-ui/react/button` | variant, size, disabled, asChild |
| Card | `components/ui/card.tsx` | Plain div | size (default/sm) |
| Badge | `components/ui/badge.tsx` | `@base-ui/react/use-render` | variant |
| Input | `components/ui/input.tsx` | `@base-ui/react/input` | Standard input props |
| Label | `components/ui/label.tsx` | Plain label | htmlFor |
| Select | `components/ui/select.tsx` | `@base-ui/react/select` | Complex: Root/Trigger/Content/Item |
| Separator | `components/ui/separator.tsx` | `@base-ui/react/separator` | orientation |
| Dialog | `components/ui/dialog.tsx` | `@base-ui/react/dialog` | showCloseButton |
| Tabs | `components/ui/tabs.tsx` | `@base-ui/react/tabs` | List variant: default/line |

## Button Variants & Sizes

### Variants
```
default     — bg-primary text-primary-foreground (ink blue)
outline     — border border-input, hover:bg-accent
secondary   — bg-secondary text-secondary-foreground
ghost       — hover:bg-accent
destructive — bg-destructive text-white
link        — text-primary underline-offset-4
```

### Sizes
```
default — h-9 px-4 py-2
sm      — h-8 px-3 text-xs
lg      — h-10 px-6
xs      — h-7 px-2 text-xs
icon    — size-9
icon-sm — size-8
icon-xs — size-7
icon-lg — size-10
```

## Card Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>Optional action button</CardAction>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

Size `sm` reduces padding.

## Select Usage (Base UI Pattern)

```tsx
<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Select..." />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="opt1">Option 1</Select.Item>
    <Select.Item value="opt2">Option 2</Select.Item>
  </Select.Content>
</Select.Root>
```

**Note**: Base UI Select uses `render` prop for custom triggers, different from Radix.

## Dialog Usage (Base UI Pattern)

```tsx
<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Description</Dialog.Description>
    {/* content */}
    <Dialog.Footer>
      <Dialog.Close render={<Button variant="outline" />}>Cancel</Dialog.Close>
      <Button>Submit</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

## Tabs Usage

```tsx
<Tabs.Root defaultValue="tab1">
  <Tabs.List variant="line">  {/* or "default" for pill style */}
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="tab1">Content 1</Tabs.Panel>
  <Tabs.Panel value="tab2">Content 2</Tabs.Panel>
</Tabs.Root>
```

## Custom Components

### ScrollLink (`components/scroll-link.tsx`)
Client component. Replaces `<a href="#section">` for same-page hash links. Uses `history.replaceState` instead of `pushState` to prevent hash entries stacking in browser history. Smooth scrolls to target element.

```tsx
import { ScrollLink } from "@/components/scroll-link";
<ScrollLink href="#pricing" className="...">Pricing</ScrollLink>
```

**Always use ScrollLink for hash links** — never raw `<a href="#...">`. This prevents the back-button bug where navigating away and pressing back cycles through hash entries instead of leaving the page.

## Utility

```ts
import { cn } from "@/lib/utils";
// cn("px-4", conditional && "bg-red") — clsx + tailwind-merge
```

## Adding New shadcn Components

```bash
cd web && npx shadcn@latest add <component-name>
```

Components install to `src/components/ui/`. They use Base UI primitives, not Radix.

## Existing Page-Level Patterns

### Card Grid (Companies)
```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id}>...</Card>)}
</div>
```

### Form in Card (Auth)
```tsx
<Card>
  <CardHeader className="text-center">...</CardHeader>
  <form onSubmit={handler}>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="field">Field</Label>
        <Input id="field" name="field" />
      </div>
    </CardContent>
    <CardFooter className="flex flex-col gap-4">
      <Button type="submit" className="w-full">Submit</Button>
    </CardFooter>
  </form>
</Card>
```

### Loading Skeleton
```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {[1, 2, 3].map(i => (
    <Card key={i} className="animate-pulse">
      <CardHeader><div className="h-5 w-2/3 rounded bg-muted" /></CardHeader>
      <CardContent><div className="space-y-2">...</div></CardContent>
    </Card>
  ))}
</div>
```
