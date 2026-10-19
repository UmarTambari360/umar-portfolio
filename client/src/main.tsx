import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
import "./index.css";
import { router } from "./router.tsx";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element "#root" was not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
