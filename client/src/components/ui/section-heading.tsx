import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./eyebrow";

/**
 * Heading sizes per breakpoint, measured from the 390 / 768 / 1440 frames.
 * Desktop steps down by section: Work 46px, About 43px, Toolkit 36px.
 * Whenever a plain `leading-*` is set below `lg`, the desktop line-height is
 * restated with `lg:leading-*` because a base `leading-*` would otherwise win.
 */
const SIZES = {
  lg: "mt-[17px] text-[1.75rem] leading-[1.05] md:mt-5 md:text-[2.0625rem] lg:mt-7 lg:text-h2 lg:leading-[1.05]",
  md: "mt-[18px] text-[1.90625rem] leading-[1.23] lg:mt-[22px] lg:text-h2-sm lg:leading-[1.25]",
  sm: "mt-[25px] text-[1.625rem] leading-[1.05] md:mt-[22px] md:text-[1.78125rem] lg:mt-[25px] lg:text-h3 lg:leading-[1.05]",
} as const;

interface SectionHeadingProps {
  /** id for the <h2>, referenced by the section's aria-labelledby. */
  id: string;
  eyebrow: string;
  title: ReactNode;
  description?: string;
  size?: keyof typeof SIZES;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  size = "lg",
}: SectionHeadingProps) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn("font-display font-bold uppercase", SIZES[size])}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-3.75 text-[0.78125rem] text-fg-muted md:mt-2.5 md:text-xs lg:mt-1.25 lg:text-intro">
          {description}
        </p>
      ) : null}
    </div>
  );
}
