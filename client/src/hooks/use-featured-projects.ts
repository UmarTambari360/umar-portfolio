import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import type { Project } from "@/types/api";

export type FeaturedProjectsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; projects: Project[] };

/** Loads `GET /api/projects?featured=true` (server orders by priority, then newest). */
export function useFeaturedProjects(): {
  state: FeaturedProjectsState;
  retry: () => void;
} {
  const [state, setState] = useState<FeaturedProjectsState>({
    status: "loading",
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiGet<unknown>("/projects?featured=true", controller.signal)
      .then((data) => {
        if (!Array.isArray(data)) {
          setState({
            status: "error",
            message: "Unexpected response from the server",
          });
          return;
        }
        setState({ status: "success", projects: data as Project[] });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        });
      });

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  return { state, retry };
}