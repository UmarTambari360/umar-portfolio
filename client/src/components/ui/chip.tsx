import type { ReactNode } from "react";

/** Pill used in the toolkit list. Renders an <li>; wrap in a <ul>. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="inline-flex h-8.75 items-center rounded-full border border-border bg-surface px-5 text-micro font-medium tracking-label text-fg lg:px-[26px]">
      {children}
    </li>
  );
}
