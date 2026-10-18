import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { HERO } from "@/content/home";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/link-button";
import { HeroVisual } from "./hero-visual";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-12 pb-[50px]">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_531px] lg:gap-9">
        <div>
          <Eyebrow dot>{HERO.availability}</Eyebrow>

          <h1
            id="hero-heading"
            className="mt-[47px] font-display text-[2.75rem] leading-[1.1] font-bold uppercase sm:text-6xl lg:text-[clamp(2.75rem,calc((100vw-615px)*0.1164),4.75rem)] lg:leading-[1.1] lg:whitespace-nowrap"
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

          <p className="mt-[23px] max-w-[520px] text-lead text-fg-muted">
            {HERO.intro}
          </p>

          <div className="mt-[31px] flex flex-wrap items-center gap-x-8 gap-y-4">
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

        <div className="lg:self-start lg:pt-[23px]">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
