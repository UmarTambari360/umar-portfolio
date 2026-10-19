import { useEffect } from "react";
import { startVisitTracking } from "@/lib/analytics";

/** Mount once near the app root. */
export function useVisitTracking(): void {
  useEffect(() => startVisitTracking(), []);
}