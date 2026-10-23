import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** "danger" for destructive actions (delete); "default" otherwise. */
  tone?: "danger" | "default";
  /** While true both buttons are locked and Escape / outside clicks do nothing. */
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation built on shadcn's AlertDialog (Radix): focus trap, Escape,
 * inert background and focus restore come from Radix. Focus starts on Cancel
 * so a stray Enter never confirms a destructive action.
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
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !pending) onCancel();
      }}
    >
      <AlertDialogContent className="overflow-hidden pl-8">
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            tone === "danger" ? "bg-destructive" : "bg-primary",
          )}
        />
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-title font-bold">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: tone === "danger" ? "destructive" : "default",
            })}
            disabled={pending}
            onClick={(event) => {
              // Keep the dialog open while the request runs; the page closes it.
              event.preventDefault();
              onConfirm();
            }}
          >
            {pending ? <Spinner aria-hidden /> : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
