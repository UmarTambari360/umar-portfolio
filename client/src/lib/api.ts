/**
 * Minimal typed client for the Express API.
 * Success bodies are `{ data }`; failures are `{ error: { message } }`.
 * In development Vite proxies `/api` to the server (see vite.config.ts).
 */
const API_BASE = "/api";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readErrorMessage(body: unknown, fallback: string): string {
  if (isRecord(body) && isRecord(body.error)) {
    const { message } = body.error;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

export async function apiGet<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    signal,
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON body (e.g. a proxy error page); handled below.
  }

  if (!response.ok) {
    throw new ApiError(
      readErrorMessage(body, `Request failed (${response.status})`),
      response.status,
    );
  }

  if (!isRecord(body) || !("data" in body)) {
    throw new ApiError("Unexpected response from the server", response.status);
  }

  return body.data as T;
}