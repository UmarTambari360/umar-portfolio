import { cn } from "@/lib/cn";

/** Loading placeholder block. Pulses only when the user has not asked for reduced motion. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-button bg-surface-raised motion-safe:animate-pulse",
        className,
      )}
    />
  );
}
