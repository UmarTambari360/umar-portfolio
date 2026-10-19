/**
 * Minimal typed client for the Express API.
 * Success bodies are `{ data }`; failures are `{ error: { message } }`.
 * In development Vite proxies `/api` to the server (see vite.config.ts), so
 * requests are same-origin and the httpOnly auth cookie travels with them.
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

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

/**
 * Registers the one callback that runs when a request comes back 401 and the
 * caller did not expect that (see `expectUnauthorized`). The admin auth store
 * uses it to drop the session and send the user to the login page.
 */
export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler;
}

interface RequestOptions {
  /** Aborts the request (e.g. when a component unmounts). */
  signal?: AbortSignal;
  /** Lets the request finish even if the page is being closed (like sendBeacon). */
  keepalive?: boolean;
  /**
   * Set for calls where 401 is a normal answer (login with a wrong password,
   * the "am I signed in?" probe) so it is not treated as an expired session.
   */
  expectUnauthorized?: boolean;
}

async function parseResponse<T>(
  response: Response,
  expectUnauthorized: boolean,
): Promise<T> {
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON body (e.g. a proxy error page); handled below.
  }

  if (!response.ok) {
    if (response.status === 401 && !expectUnauthorized) {
      unauthorizedHandler?.();
    }
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

type Method = "GET" | "POST" | "PATCH" | "DELETE";

async function request<T>(
  method: Method,
  path: string,
  body: unknown,
  options: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
    keepalive: options.keepalive,
    signal: options.signal,
  });
  return parseResponse<T>(response, options.expectUnauthorized === true);
}

export function apiGet<T>(
  path: string,
  signal?: AbortSignal,
  options: Pick<RequestOptions, "expectUnauthorized"> = {},
): Promise<T> {
  return request<T>("GET", path, undefined, { ...options, signal });
}

export function apiPost<T>(
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return request<T>("POST", path, body, options);
}

export function apiPatch<T>(
  path: string,
  body: unknown,
  options: RequestOptions = {},
): Promise<T> {
  return request<T>("PATCH", path, body, options);
}

export function apiDelete<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  return request<T>("DELETE", path, undefined, options);
}