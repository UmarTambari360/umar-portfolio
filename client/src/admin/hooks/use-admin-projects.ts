import { useCallback, useEffect, useState } from "react";
import { fetchProjects } from "@/admin/lib/projects-api";
import { errorMessage } from "@/admin/lib/format";
import type { Project } from "@/types/api";

export type AdminProjectsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; projects: Project[] };

/**
 * Loads every project (featured or not, in homepage order) for the admin list.
 * `setProjects` lets the page apply optimistic updates after its own mutations
 * without refetching.
 */
export function useAdminProjects(): {
  state: AdminProjectsState;
  reload: () => void;
  setProjects: (projects: Project[]) => void;
} {
  const [state, setState] = useState<AdminProjectsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetchProjects(controller.signal)
      .then((projects) => {
        setState({ status: "success", projects });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: "error", message: errorMessage(error) });
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  const setProjects = useCallback((projects: Project[]) => {
    setState({ status: "success", projects });
  }, []);

  return { state, reload, setProjects };
}

