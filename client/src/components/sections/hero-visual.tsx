import { HERO } from "@/content/home";

/**
 * Decorative "systems" panel (aria-hidden). Desktop keeps the full composition
 * (crosshair, rings, lime core, two captions); below `lg` it becomes a compact
 * panel with the rings centred and a single caption, like the 768/390 frames.
 */
export function HeroVisual() {
  return (
    <div
      aria-hidden
      className="relative h-51.5 overflow-hidden rounded-card bg-surface md:h-54.5 lg:h-114.75"
    >
      <span className="absolute inset-y-0 left-0 w-1.5 bg-accent" />

      {/* Desktop composition */}
      <svg
        viewBox="0 0 531 459"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 hidden h-full w-full lg:block"
      >
        <g className="stroke-border" strokeWidth="1" fill="none">
          <line x1="109" y1="202" x2="470" y2="202" />
          <line x1="342" y1="79" x2="342" y2="329" />
          <circle cx="342" cy="202" r="127" />
        </g>
        <circle
          cx="342"
          cy="202"
          r="83"
          className="stroke-fg-muted"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="342" cy="202" r="41" className="fill-accent" />
      </svg>

      {/* Compact composition */}
      <svg
        viewBox="0 0 260 260"
        className="absolute top-3 left-1/2 aspect-square h-37.5 -translate-x-1/2 md:h-40 lg:hidden"
      >
        <g className="stroke-border" fill="none">
          <line
            x1="0"
            y1="130"
            x2="260"
            y2="130"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="130"
            y1="0"
            x2="130"
            y2="260"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="130" cy="130" r="127" vectorEffect="non-scaling-stroke" />
        </g>
        <circle
          cx="130"
          cy="130"
          r="83"
          className="stroke-fg-muted"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
        <circle cx="130" cy="130" r="41" className="fill-accent" />
      </svg>

      <p className="absolute top-6.5 left-6.5 hidden text-micro tracking-label text-fg-subtle uppercase lg:block">
        {HERO.visual.top}
      </p>

      <div className="absolute bottom-3.5 left-6 lg:bottom-7.5 lg:left-6.5">
        <p className="hidden text-micro tracking-label text-fg-subtle uppercase lg:block">
          {HERO.visual.caption}
        </p>
        <p className="text-micro font-bold tracking-label text-fg uppercase lg:mt-2 lg:font-display lg:text-xl lg:font-medium lg:tracking-normal lg:normal-case">
          {HERO.visual.title}
        </p>
      </div>
    </div>
  );
}
