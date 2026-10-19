import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StatePanelProps {
  /** "error" announces itself to screen readers and uses the danger bar. */
  tone: "empty" | "error";
  title: string;
  description?: string;
  /** Usually a Button: "Try again", "Add project". */
  action?: ReactNode;
}

/** Empty and error states for lists and pages. */
export function StatePanel({
  tone,
  title,
  description,
  action,
}: StatePanelProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="relative overflow-hidden rounded-card bg-surface py-9 pr-6 pl-8 md:py-12 md:pl-12"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 w-1.5",
          tone === "error" ? "bg-danger" : "bg-accent",
        )}
      />
      <p className="font-display text-title font-bold text-fg">{title}</p>
      {description ? (
        <p className="mt-3 max-w-lg text-caption text-fg-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
