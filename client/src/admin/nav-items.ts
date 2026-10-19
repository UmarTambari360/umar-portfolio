import { ChartColumn, FolderKanban, type LucideIcon } from "lucide-react";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Sections of the admin. Order here is the order in the sidebar and mobile menu. */
export const ADMIN_NAV: readonly AdminNavItem[] = [
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/analytics", label: "Analytics", icon: ChartColumn },
];