import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: ReactNode;
  /** Adds the small lime status dot used in the hero. */
  dot?: boolean;
  className?: string;
}

/**
 * The lime status dot with a soft pulsing halo. Same 7px box as the original
 * plain dot; the halo is extra and never changes layout.
 *
 * The halo only animates while the dot is on (or near) the screen. An endless
 * animation running off-screen wastes battery, and it makes Chrome put every
 * element painted after it on its own GPU layer.
 */
function StatusDot() {
  const ref = useRef<HTMLSpanElement>(null);
  const onScreen = useInView(ref, { margin: "100px 0px" });

  return (
    <span ref={ref} aria-hidden className="relative size-1.75 shrink-0">
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-accent opacity-60 [animation-duration:2.4s]",
          onScreen && "motion-safe:animate-ping",
        )}
      />
      <span className="relative block size-full rounded-full bg-accent" />
    </span>
  );
}

export function Eyebrow({ children, dot = false, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 text-micro font-medium tracking-[0.03em] text-accent-text uppercase lg:text-label lg:tracking-label",
        className,
      )}
    >
      {dot ? <StatusDot /> : null}
      {children}
    </p>
  );
}
