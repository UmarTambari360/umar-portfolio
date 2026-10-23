import { useId, type ComponentPropsWithoutRef } from "react";
import { describedBy, FIELD_LABEL_CLASS } from "@/admin/components/field-utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface TextFieldProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "id" | "className"
> {
  label: string;
  /** Validation message; also marks the input invalid for assistive tech. */
  error?: string | null;
  hint?: string;
}

/** Labelled text input (shadcn Field + Input). The label is always visible and tied to the input. */
export function TextField({ label, error, hint, ...props }: TextFieldProps) {
  const id = useId();

  return (
    <Field data-invalid={error ? true : undefined}>
      <FieldLabel htmlFor={id} className={FIELD_LABEL_CLASS}>
        {label}
      </FieldLabel>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        {...props}
      />
      {hint ? (
        <FieldDescription id={`${id}-hint`}>{hint}</FieldDescription>
      ) : null}
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </Field>
  );
}
