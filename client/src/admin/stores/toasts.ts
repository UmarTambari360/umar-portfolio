import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

/** Newest toasts win; the oldest are dropped past this count. */
const MAX_TOASTS = 4;

/** A counter, not crypto.randomUUID(), which is missing on plain-http pages. */
let nextId = 1;

interface ToastState {
  toasts: ToastItem[];
  push: (tone: ToastTone, message: string) => void;
  dismiss: (id: number) => void;
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (tone, message) => {
    const item: ToastItem = { id: nextId, tone, message };
    nextId += 1;
    set((state) => ({ toasts: [...state.toasts, item].slice(-MAX_TOASTS) }));
  },
  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) }));
  },
}));

/** Call from anywhere (components, event handlers, store actions). */
export const toast = {
  success: (message: string): void => {
    useToastStore.getState().push("success", message);
  },
  error: (message: string): void => {
    useToastStore.getState().push("error", message);
  },
  info: (message: string): void => {
    useToastStore.getState().push("info", message);
  },
};