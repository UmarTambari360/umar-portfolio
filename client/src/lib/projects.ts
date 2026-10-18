import type { ProjectStatus } from "@/types/api";

const STATUS_LABELS: Record<ProjectStatus, string> = {
  in_progress: "In progress",
  shipped: "Shipped",
  paused: "Paused",
  concept: "Concept",
};

export function statusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status];
}

/** 0 -> "01", 1 -> "02" ... used for the card eyebrow. */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/** First `limit` stack items plus a count of what was left out. */
export function visibleStack(
  stack: readonly string[],
  limit = 3,
): { items: string[]; extra: number } {
  return {
    items: stack.slice(0, limit),
    extra: Math.max(0, stack.length - limit),
  };
}

/**
 * URLs come from the database (and later an admin form), so only ever render
 * http(s) links. Anything else (javascript:, data:, garbage) becomes null.
 */
export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}