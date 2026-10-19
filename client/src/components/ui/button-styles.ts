import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost" | "link";

const BASE =
  "inline-flex items-center gap-2 text-micro font-bold tracking-label uppercase transition-[transform,color,background-color,filter] duration-200 motion-reduce:transition-none";

const VARIANTS: Record<ButtonVariant, string> = {
  // 48px tall / 11px text on tablet + mobile frames, 50px / 10px on desktop.
  primary:
    "h-12 rounded-button bg-accent px-9 text-[0.6875rem] text-accent-fg hover:-translate-y-0.5 hover:brightness-105 motion-reduce:hover:translate-y-0 lg:h-[50px] lg:px-6 lg:text-micro",
  ghost: "text-fg hover:text-accent-text",
  link: "text-accent-text underline-offset-4 hover:underline",
};

export function buttonClasses(
  variant: ButtonVariant,
  className?: string,
): string {
  return cn(BASE, VARIANTS[variant], className);
}