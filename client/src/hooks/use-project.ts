import { useCallback, useEffect, useState } from "react";
import { ApiError, apiGet } from "@/lib/api";
import type { Project } from "@/types/api";

export type ProjectState =
  | { status: "loading" }
  | { status: "notfound" }
  | { status: "error"; message: string }
  | { status: "success"; project: Project };

/**
 * Loads one project by slug (`GET /api/projects/:slug`).
 * Mount it under a `key={slug}` so a different slug starts from "loading".
 */
export function useProject(slug: string | undefined): {
  state: ProjectState;
  retry: () => void;
} {
  const [state, setState] = useState<ProjectState>(
    slug ? { status: "loading" } : { status: "notfound" },
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    apiGet<Project>(`/projects/${encodeURIComponent(slug)}`, controller.signal)
      .then((project) => {
        setState({ status: "success", project });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        if (error instanceof ApiError && error.status === 404) {
          setState({ status: "notfound" });
          return;
        }
        setState({
          status: "error",
          message:
            error instanceof Error ? error.message : "Something went wrong",
        });
      });

    return () => controller.abort();
  }, [slug, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  return { state, retry };
}

