export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "md" | "sm";

/** Layout, type and transitions shared by <Button> and <ButtonLink>. */
export const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-button text-micro font-bold tracking-label uppercase transition-[color,background-color,border-color,filter] duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60";

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-5",
  sm: "h-9 px-3.5",
};

/** For <button>: hover only applies while the button is enabled. */
export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg enabled:hover:brightness-105",
  secondary:
    "border border-border bg-transparent text-fg enabled:hover:bg-surface-raised",
  danger: "bg-danger text-danger-fg enabled:hover:brightness-105",
  ghost: "text-fg enabled:hover:text-accent-text",
};

/**
 * For <a>: the `enabled:` variant above only matches form controls, never
 * links, so a link needs plain `hover:` rules to look the same.
 */
export const LINK_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg hover:brightness-105",
  secondary: "border border-border bg-transparent text-fg hover:bg-surface-raised",
  danger: "bg-danger text-danger-fg hover:brightness-105",
  ghost: "text-fg hover:text-accent-text",
};

