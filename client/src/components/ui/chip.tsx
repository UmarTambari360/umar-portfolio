import type { ReactNode } from "react";
import { m } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { popIn } from "@/lib/motion";

/**
 * Pill used in the toolkit list. Renders an <li>; wrap in a <ul>.
 * Inside a RevealStagger it pops in with its siblings; anywhere else (for
 * example the project page) there is no animating parent, so it is static.
 */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <m.li variants={popIn} className="inline-flex">
      <Badge
        variant="outline"
        className="h-8.75 rounded-full bg-surface px-5 text-micro font-medium tracking-label text-foreground lg:px-[26px]"
      >
        {children}
      </Badge>
    </m.li>
  );
}
