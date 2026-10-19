import { useId, type ComponentPropsWithoutRef } from "react";
import { ChevronDown } from "lucide-react";
import { FieldFrame } from "@/admin/components/field";
import { controlClasses, describedBy } from "@/admin/components/field-utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<
  ComponentPropsWithoutRef<"select">,
  "id" | "className" | "children"
> {
  label: string;
  options: readonly SelectOption[];
  error?: string | null;
  hint?: string;
}

/** Native <select> (best keyboard and screen-reader behavior) with a custom chevron. */
export function SelectField({
  label,
  options,
  error,
  hint,
  ...props
}: SelectFieldProps) {
  const id = useId();

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      <div className="relative mt-2">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, Boolean(hint), Boolean(error))}
          className={controlClasses(
            Boolean(error),
            "h-12 appearance-none pr-11",
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          size={16}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-fg-muted"
        />
      </div>
    </FieldFrame>
  );
}
