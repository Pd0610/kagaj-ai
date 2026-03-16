# API Client

## Overview

Thin fetch wrapper with token injection and envelope unwrapping. No external dependencies (no axios, tanstack-query, etc.).

**File**: `src/lib/api-client.ts`

## API Base URL

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";
```

Set via `NEXT_PUBLIC_API_URL` env var. Defaults to local Sail instance.

## Envelope Pattern

Every API response follows:
```ts
interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
}
```

The client unwraps the envelope — callers receive `data` directly, not the full envelope.

## Methods

```ts
api.get<T>(path: string): Promise<T>
api.post<T>(path: string, body: unknown): Promise<T>
api.put<T>(path: string, body: unknown): Promise<T>
api.delete<T>(path: string): Promise<T>
```

All paths are relative to API_BASE. Example: `api.get<Company[]>('/companies')`

## Auth Token

- Read from `localStorage.getItem('token')` on every request
- Sent as `Authorization: Bearer {token}` header
- If no token → header omitted (public endpoints)

## Error Handling

```ts
class ApiError extends Error {
  status: number;
  envelope: ApiEnvelope<unknown>;
}
```

Thrown when `!res.ok`. Callers catch `ApiError` to access:
- `err.message` — human-readable error message
- `err.status` — HTTP status code
- `err.envelope.errors` — field-level validation errors (422 responses)

## Usage Patterns

### Simple fetch
```ts
const companies = await api.get<Company[]>('/companies');
```

### Create with error handling
```ts
try {
  const company = await api.post<Company>('/companies', formData);
} catch (err) {
  if (err instanceof ApiError && err.envelope.errors) {
    // Field-level errors: { name: ["The name field is required."] }
  }
}
```

### In useEffect
```ts
useEffect(() => {
  api.get<Template[]>('/templates').then(setTemplates).catch(console.error);
}, []);
```

## 401 Session Expiry (Centralized)

Handled in `api-client.ts` — pages never check for 401 themselves.

On any 401 response (except `/login` and `/register` endpoints):
1. Clears `token` from localStorage
2. Does `window.location.href = "/login"` (full page reload to reset all React state)

This means expired tokens are handled automatically. No per-page 401 logic needed.

## Headers

Every request sends:
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}  (if token exists)
```
