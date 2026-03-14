const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string | null;
  errors: Record<string, string[]> | null;
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T[]> {
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

class ApiError extends Error {
  constructor(
    public status: number,
    public body: ApiEnvelope<null>,
  ) {
    super(body.message ?? "API error");
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/v1${path}`, {
    ...options,
    headers,
  });

  const body = (await res.json()) as ApiEnvelope<T>;

  if (!res.ok) {
    throw new ApiError(res.status, body as ApiEnvelope<null>);
  }

  return body;
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),
};

export { ApiError };
