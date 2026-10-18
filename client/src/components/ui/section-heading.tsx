import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./eyebrow";

/** Desktop sizes follow the design: Work 46px, About 43px, Toolkit 36px. */
const SIZES = {
  lg: "mt-5 text-[2rem] sm:text-[2.5rem] lg:mt-7 lg:text-h2",
  md: "mt-5 text-[2rem] sm:text-[2.5rem] lg:mt-[22px] lg:text-h2-sm",
  sm: "mt-5 text-[1.75rem] sm:text-[2rem] lg:mt-[25px] lg:text-h3",
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
        <p className="mt-[5px] text-intro text-fg-muted">{description}</p>
      ) : null}
    </div>
  );
}
