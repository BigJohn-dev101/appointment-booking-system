const API_BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "/api");

export class ApiError extends Error {
  status: number;
  data: { code?: string; email?: string } | null;

  constructor(
    message: string,
    status: number,
    data: { code?: string; email?: string } | null = null,
  ) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401 && path !== "/auth/login") {
    throw new ApiError("Session expired", 401, data);
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message ?? "Something went wrong",
      response.status,
      data,
    );
  }

  return data as T;
}
