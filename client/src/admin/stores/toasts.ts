import { toast as sonner } from "sonner";

/**
 * Same call sites as before (`toast.success("Saved")`), now backed by Sonner.
 * Success and info messages fade on their own; errors stay until dismissed so
 * a failure is never missed.
 */
export const toast = {
  success: (message: string): void => {
    sonner.success(message);
  },
  error: (message: string): void => {
    sonner.error(message, { duration: Infinity, closeButton: true });
  },
  info: (message: string): void => {
    sonner.info(message);
  },
};