import type { ComponentProps, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import {
  BUTTON_BASE,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  type ButtonSize,
  type ButtonVariant,
} from "@/admin/components/button-styles";
import { cn } from "@/lib/cn";

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
      className={cn(BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className)}
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

