import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

/*
  shadcn's `<Button asChild>` around a react-router <Link>: same look as the
  button, but a real <a>, so middle-click and "open in new tab" work.
*/
interface ButtonLinkProps extends Omit<
  ComponentProps<typeof Link>,
  "className"
> {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  icon?: ReactNode;
  className?: string;
}

export function ButtonLink({
  variant,
  size,
  icon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link {...props}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}
