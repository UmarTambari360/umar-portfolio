import { cn } from "@/lib/cn";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  id?: string;
  disabled?: boolean;
  /** Visible label elsewhere on the page: pass its id. Otherwise pass `label`. */
  "aria-labelledby"?: string;
  label?: string;
  "aria-describedby"?: string;
}

/**
 * OFF / ON pill, styled like the theme toggle. A native button with
 * role="switch", so Space and Enter work. State is shown by position and text,
 * not only by color.
 */
export function Switch({
  checked,
  onCheckedChange,
  id,
  disabled,
  "aria-labelledby": labelledBy,
  label,
  "aria-describedby": describedByIds,
}: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      aria-describedby={describedByIds}
      disabled={disabled}
      onClick={() => {
        onCheckedChange(!checked);
      }}
      className="relative grid h-9.25 w-28 shrink-0 grid-cols-2 items-center rounded-full bg-surface-raised p-1 text-micro font-bold tracking-label uppercase disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 left-1 w-[calc(50%-0.25rem)] rounded-full transition-[transform,background-color] duration-300 motion-reduce:transition-none",
          checked ? "translate-x-full bg-accent" : "bg-border",
        )}
      />
      <span
        aria-hidden
        className={cn(
          "relative z-10 text-center",
          checked ? "text-fg-muted" : "text-fg",
        )}
      >
        Off
      </span>
      <span
        aria-hidden
        className={cn(
          "relative z-10 text-center",
          checked ? "text-accent-fg" : "text-fg-muted",
        )}
      >
        On
      </span>
    </button>
  );
}
