export type ProjectStatus = "in_progress" | "shipped" | "paused" | "concept";

/**
 * Mirrors the Drizzle `projects` table (server/src/db/schema/projects.ts) as it
 * arrives over JSON: timestamps are ISO strings, nullable columns are `null`.
 */
export interface Project {
  id: string;
  name: string;
  /** URL-safe identifier used in the public page address: /projects/<slug>. */
  slug: string;
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

/** Body of POST /api/projects and PATCH /api/projects/:id (see server validations.ts). */
export interface ProjectPayload {
  name: string;
  /** Omit to let the server generate one from the name (create) or keep it (update). */
  slug?: string;
  tagline: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  /** "YYYY-MM-DD" or null. */
  startedAt: string | null;
  shippedAt: string | null;
}

/** GET /api/analytics/stats (server/src/lib/analytics.ts). */
export interface AnalyticsStats {
  totalVisitors: number;
  visitorsThisWeek: number;
  visitorsThisMonth: number;
  /** Last 30 days, oldest first, zero-filled. `date` is "YYYY-MM-DD" (UTC). */
  dailyStats: Array<{ date: string; views: number }>;
  topProjects: Array<{
    projectId: string;
    projectName: string;
    clickCount: number;
  }>;
  topReferrers: Array<{ referrer: string; count: number }>;
}

