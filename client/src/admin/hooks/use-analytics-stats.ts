import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "@/admin/lib/format";
import { toast } from "@/admin/stores/toasts";
import { apiGet } from "@/lib/api";
import type { AnalyticsStats } from "@/types/api";

export type AnalyticsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  /** `refreshing` keeps the old numbers on screen while new ones load. */
  | { status: "success"; stats: AnalyticsStats; refreshing: boolean };

/** Loads `GET /api/analytics/stats` (admin only). */
export function useAnalyticsStats(): {
  state: AnalyticsState;
  refresh: () => void;
} {
  const [state, setState] = useState<AnalyticsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiGet<AnalyticsStats>("/analytics/stats", controller.signal)
      .then((stats) => {
        setState({ status: "success", stats, refreshing: false });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message = errorMessage(error);
        setState((current) => {
          if (current.status !== "success") return { status: "error", message };
          // A failed refresh keeps the numbers already on screen.
          return { ...current, refreshing: false };
        });
        toast.error(message);
      });

    return () => controller.abort();
  }, [attempt]);

  const refresh = useCallback(() => {
    setState((current) =>
      current.status === "success"
        ? { ...current, refreshing: true }
        : { status: "loading" },
    );
    setAttempt((value) => value + 1);
  }, []);

  return { state, refresh };
}

