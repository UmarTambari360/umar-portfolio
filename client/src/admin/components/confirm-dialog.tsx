import { useEffect, useId, useRef } from "react";
import { Button } from "@/admin/components/button";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/cn";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** "danger" for destructive actions (delete); "default" otherwise. */
  tone?: "danger" | "default";
  /** While true both buttons are locked and Escape / backdrop clicks do nothing. */
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modal confirmation built on the native <dialog>: the browser provides the
 * focus trap, Escape handling, inert background and focus restore. Focus
 * starts on Cancel so a stray Enter never confirms a destructive action.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "danger",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useLockBodyScroll(open);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        // We close it ourselves (via `open`) so a pending action can block Escape.
        event.preventDefault();
        if (!pending) onCancel();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onCancel();
      }}
      className="m-auto w-[calc(100%-3rem)] max-w-md overflow-hidden rounded-card bg-surface p-0 text-fg backdrop:bg-bg/80"
    >
      <div className="relative py-7 pr-6 pl-8">
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            tone === "danger" ? "bg-danger" : "bg-accent",
          )}
        />
        <h2 id={titleId} className="font-display text-title font-bold text-fg">
          {title}
        </h2>
        <p id={descriptionId} className="mt-3 text-caption text-fg-muted">
          {description}
        </p>
        <div className="mt-7 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button
            ref={cancelRef}
            variant="secondary"
            disabled={pending}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={tone === "danger" ? "danger" : "primary"}
            loading={pending}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
