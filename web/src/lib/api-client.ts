const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public envelope: ApiEnvelope<unknown>,
  ) {
    super(envelope.message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  let envelope: ApiEnvelope<T>;

  try {
    envelope = (await res.json()) as ApiEnvelope<T>;
  } catch {
    // Non-JSON response (HTML error pages, network issues)
    throw new ApiError(res.status, {
      success: false,
      data: null as T,
      message:
        res.status === 0
          ? "Unable to connect to the server. Please check your connection."
          : `Something went wrong (${String(res.status)}).`,
      errors: null,
    });
  }

  if (!res.ok) {
    // Session expired — clear token and force full reload to /login
    const isAuthEndpoint = path === "/login" || path === "/register";
    if (res.status === 401 && !isAuthEndpoint && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new ApiError(res.status, envelope as ApiEnvelope<unknown>);
  }

  return envelope.data;
}

async function downloadBlob(path: string): Promise<Blob> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: "application/pdf",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, {
      success: false,
      data: null,
      message: `Download failed (${String(res.status)}).`,
      errors: null,
    });
  }

  return res.blob();
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: "DELETE" }),

  downloadBlob,
};

export { ApiError };
