import type { ReactNode } from "react";

interface FieldFrameProps {
  /** Id of the control inside; the label, hint and error are wired to it. */
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}

/**
 * Label, control slot, hint and error message for one form field. The control
 * gets `id` and `aria-describedby` (see `describedBy` in field-utils).
 */
export function FieldFrame({
  id,
  label,
  hint,
  error,
  children,
}: FieldFrameProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-micro font-bold tracking-label text-fg-muted uppercase"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-caption text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-caption text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
