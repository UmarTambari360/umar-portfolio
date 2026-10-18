import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Page-width column: 1220px of content (box-content) with 24px gutters on small screens. */
export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mx-auto box-content max-w-page px-6", className)}
      {...props}
    />
  );
}
