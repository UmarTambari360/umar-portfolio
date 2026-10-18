import { create } from "zustand";

export type Theme = "dark" | "light";

// Keep in sync with the inline script in index.html.
const STORAGE_KEY = "theme";

/** The inline script in index.html has already set data-theme before React runs. */
function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/** Point the browser UI color at the active --bg token (mobile address bar). */
function syncThemeColor(): void {
  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg")
    .trim();
  if (!bg) return;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", bg);
}

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (e.g. private mode); the theme still applies, it just won't persist.
  }
  syncThemeColor();
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: readTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    get().setTheme(get().theme === "dark" ? "light" : "dark");
  },
}));

syncThemeColor();