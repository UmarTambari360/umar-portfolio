import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AdminLoading } from "@/admin/components/admin-loading";
import { TextField } from "@/admin/components/text-field";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { useAuthStore } from "@/admin/stores/auth";
import { buttonClasses } from "@/components/ui/button-styles";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/ui/wordmark";

/** Where to go after signing in: the page that sent us here, if it is in /admin. */
function readRedirectTarget(state: unknown): string {
  if (
    typeof state === "object" &&
    state !== null &&
    "from" in state &&
    typeof state.from === "string"
  ) {
    const { from } = state;
    if (
      from.startsWith("/admin") &&
      !from.startsWith("//") &&
      !from.startsWith("/admin/login")
    ) {
      return from;
    }
  }
  return "/admin";
}

export function Component() {
  useAdminDocument("Sign in · Admin");

  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);
  const checkSession = useAuthStore((state) => state.checkSession);
  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  if (status === "unknown") return <AdminLoading />;
  if (status === "authenticated") {
    return <Navigate to={readRedirectTarget(location.state)} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      // On success the store flips to "authenticated" and this page redirects.
      await login({ username: username.trim(), password });
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Something went wrong. Try again.",
      );
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="flex items-center justify-between px-6 py-5 md:px-10.5">
        <Wordmark />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pt-4 pb-12 md:px-10.5">
        <section
          aria-labelledby="login-heading"
          className="relative w-full max-w-md overflow-hidden rounded-card bg-surface py-8 pr-6 pl-8 md:py-10 md:pr-10 md:pl-12"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5 bg-accent"
          />
          <p className="text-label font-medium tracking-label text-accent-text uppercase">
            Admin
          </p>
          <h1
            id="login-heading"
            className="mt-3 font-display text-h3 font-bold text-fg uppercase"
          >
            Sign in
          </h1>

          {sessionExpired ? (
            <p role="status" className="mt-5 text-caption text-fg-muted">
              Your session expired. Sign in again to continue.
            </p>
          ) : null}

          <form
            className="mt-6 space-y-5"
            onSubmit={(event) => {
              void handleSubmit(event);
            }}
          >
            <TextField
              label="Username"
              name="username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />

            {error ? (
              <p role="alert" className="text-caption text-danger">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className={buttonClasses(
                "primary",
                "w-full justify-center disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:brightness-100",
              )}
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
