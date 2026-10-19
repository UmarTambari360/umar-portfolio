import { useId } from "react";
import { Switch } from "@/admin/components/switch";

interface SwitchFieldProps {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
}

/** A labelled setting row: text on the left, switch on the right. */
export function SwitchField({
  label,
  hint,
  checked,
  onCheckedChange,
  disabled,
}: SwitchFieldProps) {
  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="min-w-0">
        <label
          id={labelId}
          htmlFor={id}
          className="block text-micro font-bold tracking-label text-fg-muted uppercase"
        >
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="mt-1 text-caption text-fg-subtle">
            {hint}
          </p>
        ) : null}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={hint ? hintId : undefined}
      />
    </div>
  );
}
