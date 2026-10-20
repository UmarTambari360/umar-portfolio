import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "@/lib/api";
import type { Project, ProjectPayload } from "@/types/api";

/** Typed wrappers around the projects endpoints, so pages never build URLs by hand. */

export function fetchProjects(signal?: AbortSignal): Promise<Project[]> {
  return apiGet<Project[]>("/projects", signal);
}

/** Accepts the project's id (the admin) or its slug (the public site). */
export function fetchProject(
  identifier: string,
  signal?: AbortSignal,
): Promise<Project> {
  return apiGet<Project>(`/projects/${encodeURIComponent(identifier)}`, signal);
}

export function createProject(payload: ProjectPayload): Promise<Project> {
  return apiPost<Project>("/projects", payload);
}

export function updateProject(
  id: string,
  payload: Partial<ProjectPayload>,
): Promise<Project> {
  return apiPatch<Project>(`/projects/${encodeURIComponent(id)}`, payload);
}

export function deleteProject(id: string): Promise<{ success: boolean }> {
  return apiDelete<{ success: boolean }>(`/projects/${encodeURIComponent(id)}`);
}

/** `ids` must be every project id, in the order they should appear. */
export function reorderProjects(ids: string[]): Promise<Project[]> {
  return apiPut<Project[]>("/projects/reorder", { ids });
}

