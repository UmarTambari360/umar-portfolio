import { useThemeStore } from "@/stores/theme";
import { cn } from "@/lib/cn";

/**
 * DARK / LIGHT segmented switch. A single native button (role="switch") so it
 * is keyboard operable; the visible labels are decorative for assistive tech.
 */
export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isLight = theme === "light";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label="Light theme"
      onClick={toggleTheme}
      className="relative grid h-[37px] w-[147px] grid-cols-2 items-center rounded-full bg-surface-raised p-1 text-micro font-bold tracking-label uppercase"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-accent transition-transform duration-300 motion-reduce:transition-none",
          isLight && "translate-x-full",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "relative z-10 text-center transition-colors",
          isLight ? "text-fg-muted" : "text-accent-fg",
        )}
      >
        Dark
      </span>
      <span
        aria-hidden
        className={cn(
          "relative z-10 text-center transition-colors",
          isLight ? "text-accent-fg" : "text-fg-muted",
        )}
      >
        Light
      </span>
    </button>
  );
}
