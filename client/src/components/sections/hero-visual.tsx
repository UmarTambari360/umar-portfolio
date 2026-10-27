import { useRef } from "react";
import { m, useInView, useReducedMotion, type Variants } from "framer-motion";
import { HERO } from "@/content/home";
import { cn } from "@/lib/cn";
import { EASE_OUT, fadeIn } from "@/lib/motion";

/*
  Hero "systems" panel (decorative, aria-hidden).

  Resting state is the original composition: crosshair, two rings, lime core,
  two captions. The animation adds two layers on top of it:

  1. Entrance (Framer Motion, plays once): the panel fades in, the crosshair and
     rings draw themselves, the core pops in, then the captions appear.
  2. Idle motion (CSS, loops forever): the core breathes, a radar pulse leaves
     it, and two small dots orbit the rings (opposite directions, different
     speeds). All of it is switched off for visitors who prefer reduced motion.

  Desktop (lg+) and compact (below lg) are two separate SVGs, exactly as before;
  CSS shows one and hides the other.
*/

const panel: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

/** Stroke "drawing itself" (desktop SVG only: needs plain, scaling strokes). */
const draw = (delay: number): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: EASE_OUT, delay },
  },
});

/** Ring growing out from its centre (compact SVG: its 1px strokes are non-scaling). */
const grow = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  },
});

const core = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 13, delay },
  },
});

interface Geometry {
  cx: number;
  cy: number;
  rCore: number;
  rInner: number;
  rOuter: number;
  /** Radius of the small orbiting dots. */
  dot: number;
}

/**
 * The idle layers shared by both SVGs: radar pulse, breathing core, orbiting dots.
 * Each looping element is its own <g> or <circle> so CSS transforms never
 * collide with the Framer Motion transforms used for the entrance.
 */
function IdleLayers({ cx, cy, rCore, rInner, rOuter, dot }: Geometry) {
  const origin = { transformOrigin: `${cx}px ${cy}px` };

  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={rCore}
        fill="none"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
        className="origin-center animate-radar-ping stroke-accent [transform-box:fill-box] motion-reduce:hidden"
      />

      <g className="origin-center animate-core-breathe [transform-box:fill-box] motion-reduce:animate-none">
        <m.circle
          cx={cx}
          cy={cy}
          r={rCore}
          className="fill-accent"
          variants={core(0.95)}
        />
      </g>

      <m.g variants={fadeIn(1.5)}>
        <g
          style={origin}
          className="animate-orbit motion-reduce:animate-none"
        >
          <circle cx={cx + rInner} cy={cy} r={dot} className="fill-accent" />
        </g>
        <g
          style={origin}
          className="animate-orbit-reverse motion-reduce:animate-none"
        >
          <circle
            cx={cx - rOuter}
            cy={cy}
            r={dot * 0.75}
            className="fill-fg-muted"
          />
        </g>
      </m.g>
    </>
  );
}

const WIDE: Geometry = {
  cx: 342,
  cy: 202,
  rCore: 41,
  rInner: 83,
  rOuter: 127,
  dot: 4,
};

const COMPACT: Geometry = {
  cx: 130,
  cy: 130,
  rCore: 41,
  rInner: 83,
  rOuter: 127,
  dot: 5,
};

export function HeroVisual() {
  // Reduced motion: render the finished composition at once, no entrance at all.
  const reduceMotion = useReducedMotion();

  // The endless loops only run while the panel is on (or near) the screen.
  // Off-screen they would waste battery and make Chrome promote everything
  // painted after them (the project cards, the contact panel) to GPU layers.
  const panelRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(panelRef, { margin: "100px 0px" });

  return (
    <m.div
      ref={panelRef}
      aria-hidden
      variants={panel}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      className={cn(
        "relative h-51.5 overflow-hidden rounded-card bg-surface md:h-54.5 lg:h-114.75",
        !onScreen && "[&_*]:animate-none!",
      )}
    >
      <span className="absolute inset-y-0 left-0 w-1.5 bg-accent" />

      {/* Desktop composition */}
      <svg
        viewBox="0 0 531 459"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 hidden h-full w-full lg:block"
      >
        <g className="stroke-border" strokeWidth="1" fill="none">
          <m.line x1="109" y1="202" x2="470" y2="202" variants={draw(0.3)} />
          <m.line x1="342" y1="79" x2="342" y2="329" variants={draw(0.4)} />
          {/* -rotate-90 makes the ring start drawing from 12 o'clock. */}
          <m.circle
            cx="342"
            cy="202"
            r="127"
            variants={draw(0.45)}
            className="origin-center -rotate-90 [transform-box:fill-box]"
          />
        </g>
        <m.circle
          cx="342"
          cy="202"
          r="83"
          className="origin-center -rotate-90 stroke-fg-muted [transform-box:fill-box]"
          strokeWidth="1"
          fill="none"
          variants={draw(0.6)}
        />
        <IdleLayers {...WIDE} />
      </svg>

      {/* Compact composition */}
      <svg
        viewBox="0 0 260 260"
        className="absolute top-3 left-1/2 aspect-square h-37.5 -translate-x-1/2 md:h-40 lg:hidden"
      >
        <g className="stroke-border" fill="none">
          <m.line
            x1="0"
            y1="130"
            x2="260"
            y2="130"
            vectorEffect="non-scaling-stroke"
            variants={fadeIn(0.3)}
          />
          <m.line
            x1="130"
            y1="0"
            x2="130"
            y2="260"
            vectorEffect="non-scaling-stroke"
            variants={fadeIn(0.3)}
          />
          <m.circle
            cx="130"
            cy="130"
            r="127"
            vectorEffect="non-scaling-stroke"
            variants={grow(0.4)}
          />
        </g>
        <m.circle
          cx="130"
          cy="130"
          r="83"
          className="stroke-fg-muted"
          fill="none"
          vectorEffect="non-scaling-stroke"
          variants={grow(0.55)}
        />
        <IdleLayers {...COMPACT} />
      </svg>

      <m.p
        variants={fadeIn(0.9)}
        className="absolute top-6.5 left-6.5 hidden text-micro tracking-label text-fg-subtle uppercase lg:block"
      >
        {HERO.visual.top}
      </m.p>

      <m.div
        variants={fadeIn(1)}
        className="absolute bottom-3.5 left-6 lg:bottom-7.5 lg:left-6.5"
      >
        <p className="hidden text-micro tracking-label text-fg-subtle uppercase lg:block">
          {HERO.visual.caption}
        </p>
        <p className="text-micro font-bold tracking-label text-fg uppercase lg:mt-2 lg:font-display lg:text-xl lg:font-medium lg:tracking-normal lg:normal-case">
          {HERO.visual.title}
        </p>
      </m.div>
    </m.div>
  );
}
