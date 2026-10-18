import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's built-in font sizes. Without this,
 * custom sizes such as `text-label` are mistaken for text *colors* and get
 * silently dropped when a real color (e.g. `text-accent-text`) is in the same
 * call. Keep this list in sync with the `--text-*` tokens in index.css.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero",
            "display",
            "h2",
            "h2-sm",
            "h3",
            "metric",
            "title",
            "lead",
            "intro",
            "body",
            "caption",
            "label",
            "micro",
          ],
        },
      ],
    },
  },
});

/** Join conditional class names and resolve conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}