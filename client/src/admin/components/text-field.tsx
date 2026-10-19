import { useId, type ComponentPropsWithoutRef } from "react";
import { FieldFrame } from "@/admin/components/field";
import { controlClasses, describedBy } from "@/admin/components/field-utils";

interface TextFieldProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "id" | "className"
> {
  label: string;
  /** Validation message; also marks the input invalid for assistive tech. */
  error?: string | null;
  hint?: string;
}

/** Labelled text input. The label is always visible and tied to the input. */
export function TextField({ label, error, hint, ...props }: TextFieldProps) {
  const id = useId();

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
        className={controlClasses(Boolean(error), "mt-2 h-12")}
        {...props}
      />
    </FieldFrame>
  );
}
