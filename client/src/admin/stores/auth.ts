import { create } from "zustand";
import {
  ApiError,
  apiGet,
  apiPost,
  setUnauthorizedHandler,
} from "@/lib/api";

/**
 * Session state for the admin area. The only credential is the httpOnly
 * `portfolio_token` cookie, which JavaScript cannot read, so "signed in" is
 * always learned from the server (`GET /api/auth/me`), never stored locally.
 *
 *   unknown          not asked yet (page just loaded)
 *   authenticated    /me answered with a username
 *   unauthenticated  /me (or any request) answered 401
 *   error            the server could not be reached or answered unexpectedly
 */
export type AuthStatus =
  | "unknown"
  | "authenticated"
  | "unauthenticated"
  | "error";

interface Credentials {
  username: string;
  password: string;
}

interface AuthState {
  status: AuthStatus;
  username: string | null;
  /** Message for the `error` status. */
  errorMessage: string | null;
  /** True after a request returned 401 while we believed we were signed in. */
  sessionExpired: boolean;
  checkSession: () => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  markExpired: () => void;
}

function readUsername(data: unknown): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "username" in data &&
    typeof data.username === "string"
  ) {
    return data.username;
  }
  throw new ApiError("Unexpected response from the server", 200);
}

async function fetchUsername(): Promise<string> {
  const data = await apiGet<unknown>("/auth/me", undefined, {
    expectUnauthorized: true,
  });
  return readUsername(data);
}

/** One in-flight session check at a time (React StrictMode runs effects twice). */
let inFlightCheck: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()((set, get) => ({
  status: "unknown",
  username: null,
  errorMessage: null,
  sessionExpired: false,

  checkSession: () => {
    const { status } = get();
    // A settled answer is trusted until a request says otherwise (401 handler).
    if (status === "authenticated" || status === "unauthenticated") {
      return Promise.resolve();
    }
    if (inFlightCheck) return inFlightCheck;

    if (status === "error") set({ status: "unknown", errorMessage: null });

    inFlightCheck = (async () => {
      try {
        const username = await fetchUsername();
        set({ status: "authenticated", username, errorMessage: null });
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          set({ status: "unauthenticated", username: null });
        } else {
          set({
            status: "error",
            errorMessage:
              error instanceof Error
                ? error.message
                : "Could not reach the server",
          });
        }
      } finally {
        inFlightCheck = null;
      }
    })();
    return inFlightCheck;
  },

  login: async ({ username, password }) => {
    await apiPost<unknown>(
      "/auth/login",
      { username, password },
      { expectUnauthorized: true },
    );

    // Confirm the browser actually kept the cookie before calling it a success.
    let confirmedUsername: string;
    try {
      confirmedUsername = await fetchUsername();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        throw new ApiError(
          "Signed in, but the browser did not keep the session cookie. In production the site must be served over HTTPS.",
          401,
        );
      }
      throw error;
    }

    set({
      status: "authenticated",
      username: confirmedUsername,
      errorMessage: null,
      sessionExpired: false,
    });
  },

  logout: async () => {
    try {
      await apiPost<unknown>("/auth/logout", {}, { expectUnauthorized: true });
    } catch (error) {
      // Already signed out is the outcome we wanted; anything else is real.
      if (!(error instanceof ApiError && error.status === 401)) throw error;
    }
    set({ status: "unauthenticated", username: null, sessionExpired: false });
  },

  markExpired: () => {
    if (get().status !== "authenticated") return;
    set({ status: "unauthenticated", username: null, sessionExpired: true });
  },
}));

// Any admin request that comes back 401 ends the session; the route guard then
// redirects to the login page.
setUnauthorizedHandler(() => {
  useAuthStore.getState().markExpired();
});