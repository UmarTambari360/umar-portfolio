import type { ReactNode } from "react";

/** Pill used in the toolkit list. Renders an <li>; wrap in a <ul>. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="inline-flex h-[35px] items-center rounded-full border border-border bg-surface px-[26px] text-micro font-medium tracking-label text-fg">
      {children}
    </li>
  );
}
