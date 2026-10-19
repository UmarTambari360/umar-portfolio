import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Page-width column: 1220px of content (box-content) with 24px gutters on
 * mobile and 42px from tablet up (as in the 390 and 768 frames).
 */
export function Container({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn(
        "mx-auto box-content max-w-page px-6 md:px-10.5",
        className,
      )}
      {...props}
    />
  );
}
