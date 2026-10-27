import { Fragment }     from "react";
import { m } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CONTACT }      from "@/content/home";
import { getContactHref } from "@/config/site";
import { Reveal }      from "@/components/motion/reveal";
import { Container }   from "@/components/ui/container";
import { Eyebrow }    from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/link-button";
import { growY } from "@/lib/motion";

export function ContactCta() {
  const contactHref = getContactHref();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-6 pt-10 md:pt-12.5 lg:pt-33"
    >
      <Container>
        <Reveal className="relative overflow-hidden rounded-card bg-surface">
          <m.span
            aria-hidden
            variants={growY}
            className="absolute inset-y-0 left-0 w-1.5 origin-top bg-accent"
          />
          <div className="grid gap-7 px-6 pt-8 pb-8 md:gap-10 md:px-8 md:pb-19 lg:grid-cols-[1fr_auto] lg:items-center lg:pt-12.5 lg:pr-20.75 lg:pb-17.25 lg:pl-8.25">
            <div>
              <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
              <h2
                id="contact-heading"
                className="mt-5 font-display text-[2.1875rem] leading-[1.15] font-bold uppercase md:text-[2.0625rem] lg:mt-6 lg:text-display lg:leading-[1.28]"
              >
                {CONTACT.titleLines.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 ? " " : null}
                    <span className="lg:block">{line}</span>
                  </Fragment>
                ))}
              </h2>
              <p className="mt-5 max-w-xl text-xs text-fg-muted md:mt-13.75 lg:mt-25 lg:text-caption">
                {CONTACT.body}
              </p>
            </div>

            {contactHref ? (
              <LinkButton
                href={contactHref}
                icon={<ArrowUpRight size={12} />}
                className="justify-self-start lg:mt-9 lg:justify-self-end lg:px-12.75"
              >
                {CONTACT.cta}
              </LinkButton>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
