import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { buttonClasses, type ButtonVariant } from "./button-styles";

interface LinkButtonProps extends Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "className"
> {
  href: string;
  variant?: ButtonVariant;
  /** Opens in a new tab with a safe `rel`, and announces that to screen readers. */
  external?: boolean;
  icon?: ReactNode;
  className?: string;
}

/** Anchor styled as a button. Always renders a real, navigable link. */
export function LinkButton({
  href,
  variant = "primary",
  external = false,
  icon,
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={buttonClasses(variant, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      <span>
        {children}
        {external ? (
          <span className="sr-only"> (opens in a new tab)</span>
        ) : null}
      </span>
      {icon ? <span aria-hidden>{icon}</span> : null}
    </a>
  );
}
