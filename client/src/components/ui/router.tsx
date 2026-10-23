import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLoading } from "@/admin/components/admin-loading";
import App from "../../App.tsx";

/**
 * The public site stays at "/" exactly as before (App mounts the visit
 * tracker, so admin pages never count as visits). Everything under /admin is
 * loaded on demand, so it adds nothing to the public bundle.
 */
export const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/projects/:slug",
    lazy: () => import("@/routes/project-detail"),
    HydrateFallback: AdminLoading, // generic "Loading" screen, shown on a direct visit
  },
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
      {
        path: "projects/new",
        lazy: () => import("@/admin/routes/project-new"),
      },
      {
        path: "projects/:id/edit",
        lazy: () => import("@/admin/routes/project-edit"),
      },
      { path: "analytics", lazy: () => import("@/admin/routes/analytics") },
      { path: "*", element: <Navigate to="/admin/projects" replace /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
