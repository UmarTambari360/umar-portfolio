import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  /** Adds the small lime status dot used in the hero. */
  dot?: boolean;
  className?: string;
}

export function Eyebrow({ children, dot = false, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-micro font-medium tracking-[0.03em] text-accent-text uppercase lg:text-label lg:tracking-label",
        className,
      )}
    >
      {dot ? (
        <span aria-hidden className="size-1.75 rounded-full bg-accent" />
      ) : null}
      {children}
    </p>
  );
}
