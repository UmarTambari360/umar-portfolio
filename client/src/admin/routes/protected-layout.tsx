import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AdminShell } from "@/admin/components/admin-shell";
import { AdminLoading } from "@/admin/components/admin-loading";
import { Button } from "@/admin/components/button";
import { StatePanel } from "@/admin/components/state-panel";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { useAuthStore } from "@/admin/stores/auth";

/**
 * Route guard for everything under /admin except the login page. Asks the
 * server who we are once, then either renders the admin shell, shows a
 * retryable error, or redirects to the login page remembering where we were
 * headed.
 */
export function Component() {
  useAdminDocument("Admin");

  const location = useLocation();
  const status = useAuthStore((state) => state.status);
  const errorMessage = useAuthStore((state) => state.errorMessage);
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  if (status === "unknown") return <AdminLoading />;

  if (status === "error") {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg px-6">
        <div className="w-full max-w-md">
          <StatePanel
            tone="error"
            title="Couldn’t reach the server."
            description={errorMessage ?? undefined}
            action={
              <Button
                onClick={() => {
                  void checkSession();
                }}
              >
                Try again
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <AdminShell />;
}
