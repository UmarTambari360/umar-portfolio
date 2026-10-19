import { useEffect, useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  Info,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  useToastStore,
  type ToastItem,
  type ToastTone,
} from "@/admin/stores/toasts";
import { cn } from "@/lib/cn";

/** Success and info toasts leave on their own; errors stay until dismissed. */
const AUTO_DISMISS_MS = 5000;

const TONES: Record<
  ToastTone,
  { icon: LucideIcon; label: string; bar: string }
> = {
  success: { icon: CircleCheck, label: "Success", bar: "bg-accent" },
  error: { icon: CircleAlert, label: "Error", bar: "bg-danger" },
  info: { icon: Info, label: "Notice", bar: "bg-fg-subtle" },
};

function ToastCard({ item }: { item: ToastItem }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const [paused, setPaused] = useState(false);
  const { icon: Icon, label, bar } = TONES[item.tone];

  // Hovering or focusing a toast pauses its timer so it can be read.
  useEffect(() => {
    if (item.tone === "error" || paused) return;
    const timer = window.setTimeout(() => {
      dismiss(item.id);
    }, AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [item.id, item.tone, paused, dismiss]);

  return (
    <div
      onMouseEnter={() => {
        setPaused(true);
      }}
      onMouseLeave={() => {
        setPaused(false);
      }}
      onFocus={() => {
        setPaused(true);
      }}
      onBlur={() => {
        setPaused(false);
      }}
      className="pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-card border border-border bg-surface-raised py-4 pr-3 pl-6"
    >
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 w-1.5", bar)}
      />
      <Icon aria-hidden size={18} className="mt-0.5 shrink-0 text-fg-muted" />
      <p className="min-w-0 flex-1 text-caption text-fg">
        <span className="sr-only">{label}: </span>
        {item.message}
      </p>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => {
          dismiss(item.id);
        }}
        className="grid size-8 shrink-0 place-items-center rounded-full text-fg-muted hover:text-fg"
      >
        <X aria-hidden size={14} />
      </button>
    </div>
  );
}

/**
 * Mount once in the admin shell. The two regions are always in the page so
 * screen readers pick up new toasts: errors are announced immediately
 * (role="alert"), everything else politely (role="status").
 */
export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-60 flex flex-col items-center gap-3 p-4 lg:items-end lg:p-6">
      <div role="status" className="flex w-full max-w-md flex-col gap-3">
        {toasts
          .filter((item) => item.tone !== "error")
          .map((item) => (
            <ToastCard key={item.id} item={item} />
          ))}
      </div>
      <div role="alert" className="flex w-full max-w-md flex-col gap-3">
        {toasts
          .filter((item) => item.tone === "error")
          .map((item) => (
            <ToastCard key={item.id} item={item} />
          ))}
      </div>
    </div>
  );
}
