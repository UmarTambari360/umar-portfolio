import { useCallback, useState } from "react";
import { toast } from "@/admin/stores/toasts";
import { useAuthStore } from "@/admin/stores/auth";

/** Sign-out with a pending flag and an error toast; the route guard does the redirect. */
export function useSignOut(): { signOut: () => Promise<void>; pending: boolean } {
  const logout = useAuthStore((state) => state.logout);
  const [pending, setPending] = useState(false);

  const signOut = useCallback(async () => {
    if (pending) return;
    setPending(true);
    try {
      await logout();
    } catch (caught) {
      toast.error(
        caught instanceof Error ? caught.message : "Could not sign out. Try again.",
      );
      setPending(false);
    }
  }, [logout, pending]);

  return { signOut, pending };
}