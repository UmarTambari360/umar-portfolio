import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BUTTON_BASE,
  BUTTON_SIZES,
  LINK_VARIANTS,
  type ButtonSize,
  type ButtonVariant,
} from "@/admin/components/button-styles";
import { cn } from "@/lib/cn";

/*
  Same look as <Button>, but a real <a> (via react-router) for navigation, so
  middle-click and "open in new tab" work. See LINK_VARIANTS for why the hover
  rules differ from the button's.
*/
interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        BUTTON_BASE,
        LINK_VARIANTS[variant],
        BUTTON_SIZES[size],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Link>
  );
}

