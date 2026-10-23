import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

/** Pill used in the toolkit list. Renders an <li>; wrap in a <ul>. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <li className="inline-flex">
      <Badge
        variant="outline"
        className="h-8.75 rounded-full bg-surface px-5 text-micro font-medium tracking-label text-foreground lg:px-[26px]"
      >
        {children}
      </Badge>
    </li>
  );
}
