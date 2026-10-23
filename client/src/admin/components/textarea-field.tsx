import { useId, type ComponentPropsWithoutRef } from "react";
import { describedBy, FIELD_LABEL_CLASS } from "@/admin/components/field-utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

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
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
      </FieldLabel>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        maxLength={maxLength}
        // shadcn's textarea auto-grows (field-sizing), so `rows` becomes a minimum height.
        style={{ minHeight: `${rows * 1.5 + 1}rem` }}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        {...props}
      />
      {showCount && maxLength !== undefined ? (
        <p className="text-right text-caption text-muted-foreground">
          {value.length} / {maxLength}
        </p>
      ) : null}
      {hint ? (
        <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
      ) : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
  );
}
