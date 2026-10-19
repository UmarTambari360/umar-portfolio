import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { HERO }       from "@/content/home";
import { Container }  from "@/components/ui/container";
import { Eyebrow }    from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/link-button";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="pt-7.5 pb-8 md:pt-9.5 lg:pt-12 lg:pb-12.5"
    >
      <Container className="grid items-center gap-8 md:gap-7 lg:grid-cols-[minmax(0,1fr)_531px] lg:gap-9">
        <div>
          <Eyebrow dot>{HERO.availability}</Eyebrow>

          <h1
            id="hero-heading"
            className="mt-7 font-display text-[2.625rem] leading-[1.1] font-bold uppercase md:mt-7.75 md:text-[3.0625rem] md:leading-[1.06] lg:mt-[47px] lg:text-[clamp(2.75rem,calc((100vw-615px)*0.1164),4.75rem)] lg:leading-[1.1] lg:whitespace-nowrap"
          >
            {HERO.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            <span className="block">
              <span className="text-highlight">{HERO.highlight}</span>
            </span>
          </h1>

          <p className="mt-5.5 max-w-160 text-sm leading-[1.3] text-fg-muted md:mt-3.25 md:max-w-150 md:text-xs md:leading-[1.33] lg:mt-5.75 lg:max-w-130 lg:text-lead lg:leading-tight">
            {HERO.intro}
          </p>

          <div className="mt-9.25 flex flex-col items-start gap-4.25 sm:flex-row sm:items-center sm:gap-x-8 md:mt-8.75 lg:mt-7.75">
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
          </div>
        </div>

        <div className="lg:self-start lg:pt-5.75">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
