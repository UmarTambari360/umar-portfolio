import { HERO } from "@/content/home";

/** Decorative "systems" panel: crosshair, two rings and a lime core. Purely visual (aria-hidden). */
export function HeroVisual() {
  return (
    <div
      aria-hidden
      className="relative h-[320px] overflow-hidden rounded-card bg-surface lg:h-[459px]"
    >
      <span className="absolute inset-y-0 left-0 w-[6px] bg-accent" />

      <svg
        viewBox="0 0 531 459"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
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

      <p className="absolute top-[26px] left-[26px] text-micro tracking-label text-fg-subtle uppercase">
        {HERO.visual.top}
      </p>

      <div className="absolute bottom-[30px] left-[26px]">
        <p className="text-micro tracking-label text-fg-subtle uppercase">
          {HERO.visual.caption}
        </p>
        <p className="mt-2 font-display text-xl font-medium text-fg">
          {HERO.visual.title}
        </p>
      </div>
    </div>
  );
}
