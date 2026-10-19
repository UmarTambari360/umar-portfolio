import type { ComponentProps, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "md" | "sm";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-button text-micro font-bold tracking-label uppercase transition-[color,background-color,border-color,filter] duration-200 motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-fg enabled:hover:brightness-105",
  secondary:
    "border border-border bg-transparent text-fg enabled:hover:bg-surface-raised",
  danger: "bg-danger text-danger-fg enabled:hover:brightness-105",
  ghost: "text-fg enabled:hover:text-accent-text",
};

const SIZES: Record<ButtonSize, string> = {
  md: "h-11 px-5",
  sm: "h-9 px-3.5",
};

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Disables the button and shows a spinner; the label stays for screen readers. */
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  type = "button",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {loading ? (
        <LoaderCircle
          aria-hidden
          size={14}
          className="motion-safe:animate-spin"
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
