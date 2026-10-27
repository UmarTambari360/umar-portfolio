import { m, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { HERO }       from "@/content/home";
import { Container }  from "@/components/ui/container";
import { Eyebrow }    from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/link-button";
import { fadeUp, slideUp, staggerContainer } from "@/lib/motion";
import { HeroVisual } from "./hero-visual";

// One sequence for the whole text column: eyebrow, each headline line, intro,
// buttons. Deliberately quick (no initial delay, 60ms between items). The
// headline lines slide without fading (see `slideUp`) so the largest text on
// the page is visible from the very first paint.
const column = staggerContainer(0.06);

export function Hero() {
  // Reduced motion: show everything immediately, no entrance.
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-7.5 pb-8 md:pt-9.5 lg:pt-12 lg:pb-12.5"
    >
      <Container className="grid items-center gap-8 md:gap-7 lg:grid-cols-[minmax(0,1fr)_531px] lg:gap-9">
        <m.div
          variants={column}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <m.div variants={fadeUp}>
            <Eyebrow dot>{HERO.availability}</Eyebrow>
          </m.div>

          <h1
            id="hero-heading"
            className="mt-7 font-display text-[2.625rem] leading-[1.1] font-bold uppercase md:mt-7.75 md:text-[3.0625rem] md:leading-[1.06] lg:mt-[47px] lg:text-[clamp(2.75rem,calc((100vw-615px)*0.1164),4.75rem)] lg:leading-[1.1] lg:whitespace-nowrap"
          >
            {HERO.lines.map((line) => (
              <m.span key={line} variants={slideUp} className="block">
                {line}
              </m.span>
            ))}
            <m.span variants={slideUp} className="block">
              <span className="text-highlight">{HERO.highlight}</span>
            </m.span>
          </h1>

          <m.p
            variants={fadeUp}
            className="mt-5.5 max-w-160 text-sm leading-[1.3] text-fg-muted md:mt-3.25 md:max-w-150 md:text-xs md:leading-[1.33] lg:mt-5.75 lg:max-w-130 lg:text-lead lg:leading-tight"
          >
            {HERO.intro}
          </m.p>

          <m.div
            variants={fadeUp}
            className="mt-9.25 flex flex-col items-start gap-4.25 sm:flex-row sm:items-center sm:gap-x-8 md:mt-8.75 lg:mt-7.75"
          >
            <LinkButton
              href={HERO.primaryCta.href}
              icon={<ArrowDownRight size={12} />}
            >
              {HERO.primaryCta.label}
            </LinkButton>
            <LinkButton
              href={HERO.secondaryCta.href}
              variant="ghost"
              icon={<ArrowUpRight size={12} />}
            >
              {HERO.secondaryCta.label}
            </LinkButton>
          </m.div>
        </m.div>

        <div className="lg:self-start lg:pt-5.75">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
