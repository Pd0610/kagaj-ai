# Auth System (Frontend)

## Overview

React Context-based auth. Token stored in localStorage. AuthProvider wraps both (auth) and (dashboard) route groups independently — they do NOT share a single root provider.

## AuthContext

**File**: `src/contexts/auth-context.tsx`

### Exports
- `AuthProvider` — wraps children with auth state
- `useAuth()` — hook returning `{ user, isLoading, isAuthenticated, login, register, logout }`
- `ApiError` — re-exported from api-client

### State
```ts
{ user: User | null, isLoading: boolean, isAuthenticated: boolean }
```

### Init Flow
1. Check localStorage for token
2. If no token → `isLoading: false` immediately (skip /me call)
3. If token exists → `isLoading: true` → `GET /me` → set user or clear token on error

### Methods
- `login(email, password)` → `POST /login` → store token → set user
- `register(name, email, password)` → `POST /register` → store token → set user
- `logout()` → `POST /logout` (silently ignores errors) → remove token → set user null

### Value
Memoized with `useMemo`. `useAuth()` throws if used outside `AuthProvider`.

## Auth Pages

### Login (`src/app/(auth)/login/page.tsx`)
- Client component
- Form: email + password fields
- On success → `router.push('/companies')`
- Error display: styled error banner with AlertCircle icon on destructive-subtle background
- "or" divider between submit button and sign-up link
- Uses: Card, Input, Label, Button, AlertCircle (lucide)

### Register (`src/app/(auth)/register/page.tsx`)
- Client component
- Form: name + email + password fields (password has "Minimum 8 characters" placeholder)
- Benefits list in header: 3 items with green CheckCircle2 icons (5 free docs, 20+ templates, bilingual PDF)
- On success → `router.push('/companies')`
- Error display: per-field errors below each input, form-level error as styled banner
- "No credit card required" reassurance below submit button
- "or" divider between submit area and sign-in link
- Uses: Card, Input, Label, Button, AlertCircle, CheckCircle2 (lucide)

### Auth Layout (`src/app/(auth)/layout.tsx`)
- Wraps with `AuthProvider`
- Branded logo above card: "KagajAI" with gold "AI" accent, links to /
- Decorative background: primary-subtle and gold blur circles
- Centered card: `flex min-h-screen items-center justify-center bg-background p-4`
- Max width: `max-w-md`
- Copyright footer below card

## Dashboard Auth Guard

**File**: `src/app/(dashboard)/layout.tsx`

```tsx
useEffect(() => {
  if (!isLoading && !isAuthenticated) router.push('/login');
}, [isLoading, isAuthenticated, router]);
```

- Shows loading state while checking auth
- Redirects to /login if not authenticated
- Returns null during redirect (prevents flash)

## Token Storage

- **Where**: `localStorage.setItem('token', ...)`
- **Key**: `'token'`
- **Sent as**: `Authorization: Bearer {token}` header on every API request
- **Note**: Not httpOnly — accessible to JS (acceptable for MVP, XSS risk for production)

## Files

| File | Purpose |
|------|---------|
| `src/contexts/auth-context.tsx` | AuthProvider, useAuth hook |
| `src/app/(auth)/layout.tsx` | Auth pages layout (centered card) |
| `src/app/(auth)/login/page.tsx` | Login form |
| `src/app/(auth)/register/page.tsx` | Registration form |
| `src/app/(dashboard)/layout.tsx` | Dashboard guard + header (uses AuthProvider independently) |
