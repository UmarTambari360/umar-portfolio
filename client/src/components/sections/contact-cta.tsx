import { ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/content/home";
import { getContactHref } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { LinkButton } from "@/components/ui/link-button";

export function ContactCta() {
  // No email configured -> no button (never a link that goes nowhere).
  const contactHref = getContactHref();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-6 pt-[132px]"
    >
      <Container>
        <div className="relative overflow-hidden rounded-card bg-surface">
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[6px] bg-accent"
          />
          <div className="grid gap-10 px-8 pt-[50px] pb-12 lg:grid-cols-[1fr_auto] lg:items-center lg:pr-[83px] lg:pb-[69px] lg:pl-[33px]">
            <div>
              <Eyebrow>{CONTACT.eyebrow}</Eyebrow>
              <h2
                id="contact-heading"
                className="mt-6 font-display text-[2.5rem] font-bold uppercase sm:text-5xl lg:text-display"
              >
                {CONTACT.titleLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-10 max-w-xl text-caption text-fg-muted lg:mt-[100px]">
                {CONTACT.body}
              </p>
            </div>

            {contactHref ? (
              <LinkButton
                href={contactHref}
                icon={<ArrowUpRight size={12} />}
                className="justify-self-start px-8 lg:mt-9 lg:justify-self-end lg:px-[51px]"
              >
                {CONTACT.cta}
              </LinkButton>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
