export type ProjectStatus = "in_progress" | "shipped" | "paused" | "concept";

/**
 * Mirrors the Drizzle `projects` table (server/src/db/schema/projects.ts) as it
 * arrives over JSON: timestamps are ISO strings, nullable columns are `null`.
 */
export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  priority: number;
  startedAt: string | null;
  shippedAt: string | null;
  createdAt: string;
  updatedAt: string;
}