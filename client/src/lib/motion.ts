import type { Variants, ViewportOptions } from "framer-motion";

/**
 * Shared motion tokens, so every animation on the site moves the same way.
 *
 * Rules the whole site follows:
 *  - Animate only `opacity` and `transform` (x / y / scale). These never change
 *    layout, so nothing jumps and the pixel-measured design stays intact.
 *  - Never put a transform on an element that contains `position: fixed`
 *    children (it would become their containing block and break them).
 */

/** Gentle "ease-out": quick start, soft landing (same family as the 300ms UI transitions). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** How far (px) content travels while fading in. Small on purpose: subtle, not showy. */
export const REVEAL_DISTANCE = 24;

/**
 * Scroll reveals play once, a little before the element is fully on screen,
 * and never replay (replaying on every scroll feels restless).
 */
export const VIEWPORT: ViewportOptions = {
  once: true,
  margin: "0px 0px -60px 0px",
};

/**
 * Fade up. `custom` is an optional delay in seconds, so one variant set serves
 * both a lone element (`delay`) and children of a staggered parent.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: REVEAL_DISTANCE },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  }),
};

/**
 * Slide up WITHOUT fading. Used for the hero headline: the browser can only count
 * text towards "Largest Contentful Paint" once it is visible, so a headline that
 * starts at opacity 0 makes the page measurably slower to "load". Sliding keeps
 * the text visible from the first paint while still giving it an entrance.
 */
export const slideUp: Variants = {
  hidden: { y: REVEAL_DISTANCE },
  visible: (delay: number = 0) => ({
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT, delay },
  }),
};

/** Plain fade, for small captions and decorative layers. */
export const fadeIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  },
});

/** Small pop, used by the toolkit chips. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

/** Parent that plays its children one after another. */
export const staggerContainer = (
  stagger: number = 0.08,
  delayChildren: number = 0,
): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
});

/** Accent bar growing downward from its top edge (pair with `origin-top`). */
export const growY: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.8, ease: EASE_OUT, delay: 0.2 },
  },
};
