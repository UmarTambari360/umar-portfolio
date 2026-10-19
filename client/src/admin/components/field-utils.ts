import { cn } from "@/lib/cn";

const CONTROL =
  "w-full rounded-button border bg-bg px-4 text-body text-fg placeholder:text-fg-subtle";

/** Shared look for text inputs, selects and textareas. */
export function controlClasses(hasError: boolean, extra?: string): string {
  return cn(CONTROL, hasError ? "border-danger" : "border-border", extra);
}

/** `aria-describedby` value for a control rendered inside a FieldFrame. */
export function describedBy(
  id: string,
  hasHint: boolean,
  hasError: boolean,
): string | undefined {
  const ids = [hasHint ? `${id}-hint` : null, hasError ? `${id}-error` : null]
    .filter((value): value is string => value !== null)
    .join(" ");
  return ids.length > 0 ? ids : undefined;
}