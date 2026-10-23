import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * shadcn's stock skeleton is `bg-accent`, which here is the lime brand color.
 * Use the neutral raised surface instead, and pulse only when the visitor has
 * not asked for reduced motion.
 */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      data-slot="skeleton"
      className={cn("rounded-md bg-muted motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}

export { Skeleton };
