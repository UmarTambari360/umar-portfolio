import { useId, type ComponentPropsWithoutRef } from "react";
import { FieldFrame } from "@/admin/components/field";
import { controlClasses, describedBy } from "@/admin/components/field-utils";

interface TextAreaFieldProps extends Omit<
  ComponentPropsWithoutRef<"textarea">,
  "id" | "className" | "value"
> {
  label: string;
  value: string;
  error?: string | null;
  hint?: string;
  /** Shows "n / maxLength" under the field (needs `maxLength`). */
  showCount?: boolean;
}

export function TextAreaField({
  label,
  value,
  error,
  hint,
  showCount = false,
  maxLength,
  rows = 5,
  ...props
}: TextAreaFieldProps) {
  const id = useId();

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        className={controlClasses(Boolean(error), "mt-2 block resize-y py-3")}
        {...props}
      />
      {showCount && maxLength !== undefined ? (
        <p className="mt-2 text-right text-caption text-fg-subtle">
          {value.length} / {maxLength}
        </p>
      ) : null}
    </FieldFrame>
  );
}
