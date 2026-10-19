import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
import { AdminLoading } from "@/admin/components/admin-loading";
import App from "./App.tsx";

/**
 * Development-only gallery of the admin form primitives. `import.meta.env.DEV`
 * is replaced at build time, so production contains neither the route nor the page.
 */
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [{ path: "kit", lazy: () => import("@/admin/routes/kit") }]
  : [];

/**
 * The public site stays at "/" exactly as before (App mounts the visit
 * tracker, so admin pages never count as visits). Everything under /admin is
 * loaded on demand, so it adds nothing to the public bundle.
 */
export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/admin/login",
    lazy: () => import("@/admin/routes/login"),
    HydrateFallback: AdminLoading,
  },
  {
    path: "/admin",
    lazy: () => import("@/admin/routes/protected-layout"),
    HydrateFallback: AdminLoading,
    children: [
      { index: true, element: <Navigate to="/admin/projects" replace /> },
      { path: "projects", lazy: () => import("@/admin/routes/projects") },
      { path: "analytics", lazy: () => import("@/admin/routes/analytics") },
      ...devRoutes,
      { path: "*", element: <Navigate to="/admin/projects" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
