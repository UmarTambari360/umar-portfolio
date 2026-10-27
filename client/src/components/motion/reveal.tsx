import type { ReactNode } from "react";
import { m } from "framer-motion";
import { VIEWPORT, fadeUp, staggerContainer } from "@/lib/motion";

/*
  Scroll-reveal building blocks. They render the element you ask for (div, li,
  ul...) with no extra wrapper, so layout, margins and semantics stay exactly
  as they were. Only opacity and transform change, and only once.

  Reveal         one element fades up when it scrolls into view.
  RevealStagger  a parent that plays its RevealItem children in sequence.
  RevealItem     a child of RevealStagger.
*/

const viewProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: VIEWPORT,
} as const;

interface RevealProps {
  as?: "div" | "li" | "p";
  /** Seconds to wait before starting (e.g. to offset neighbours in a grid). */
  delay?: number;
  className?: string;
  children: ReactNode;
}

export function Reveal({ as = "div", delay = 0, className, children }: RevealProps) {
  const props = { ...viewProps, variants: fadeUp, custom: delay, className };

  if (as === "li") return <m.li {...props}>{children}</m.li>;
  if (as === "p") return <m.p {...props}>{children}</m.p>;
  return <m.div {...props}>{children}</m.div>;
}

interface RevealStaggerProps {
  as?: "div" | "ul" | "ol";
  /** Seconds between one child starting and the next. */
  stagger?: number;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

export function RevealStagger({
  as = "div",
  stagger = 0.08,
  children,
  ...rest
}: RevealStaggerProps) {
  const props = { ...viewProps, ...rest, variants: staggerContainer(stagger) };

  if (as === "ul") return <m.ul {...props}>{children}</m.ul>;
  if (as === "ol") return <m.ol {...props}>{children}</m.ol>;
  return <m.div {...props}>{children}</m.div>;
}

interface RevealItemProps {
  as?: "div" | "li";
  className?: string;
  children: ReactNode;
}

export function RevealItem({ as = "div", className, children }: RevealItemProps) {
  const props = { variants: fadeUp, className };

  if (as === "li") return <m.li {...props}>{children}</m.li>;
  return <m.div {...props}>{children}</m.div>;
}
