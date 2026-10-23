import { useId } from "react";
import { FIELD_LABEL_CLASS } from "@/admin/components/field-utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";

interface SwitchFieldProps {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
}

/** A labelled setting row: text on the left, shadcn Switch on the right. */
export function SwitchField({
  label,
  hint,
  checked,
  onCheckedChange,
  disabled,
}: SwitchFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <Field orientation="horizontal" className="items-center justify-between">
      <FieldContent>
        <FieldLabel htmlFor={id} className={FIELD_LABEL_CLASS}>
          {label}
        </FieldLabel>
        {hint ? <FieldDescription id={hintId}>{hint}</FieldDescription> : null}
      </FieldContent>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-describedby={hint ? hintId : undefined}
      />
    </Field>
  );
}
