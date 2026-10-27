import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";

/**
 * Sets up Framer Motion once for the page.
 *
 *  - LazyMotion + `domAnimation`: components use the lightweight `m.*`
 *    elements instead of `motion.*`, and the animation engine comes as one
 *    "feature pack". Same API, a fraction of the bundle. `strict` makes the
 *    build fail loudly if someone accidentally imports the heavy `motion.*`.
 *
 *  - The feature pack is bundled with the page on purpose (not lazy-loaded):
 *    the hero and header animate on load, so a separately fetched pack would
 *    keep them invisible until a second request finished, and a failed request
 *    would leave them invisible for good.
 *
 *  - reducedMotion="user": when the visitor's OS asks for reduced motion,
 *    movement (y / scale / rotate) is switched off and only gentle fades remain.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
