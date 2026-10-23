/** Label look shared by every admin field (uppercase micro caps). */
export const FIELD_LABEL_CLASS =
  "text-micro font-bold tracking-label text-muted-foreground uppercase";

/** `aria-describedby` value for a control rendered inside a shadcn <Field>. */
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