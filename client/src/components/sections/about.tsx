import { Fragment }        from "react";
import { ABOUT }           from "@/content/home";
import { Container }       from "@/components/ui/container";
import { SectionHeading }  from "@/components/ui/section-heading";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-6 pb-13.25 lg:pb-29.5"
    >
      <Container>
        <div className="grid gap-8 border-t border-border pt-6.75 md:pt-7.5 lg:grid-cols-[minmax(0,1fr)_531px] lg:gap-9 lg:pt-14.75">
          <div>
            <SectionHeading
              id="about-heading"
              eyebrow={ABOUT.eyebrow}
              size="md"
              title={ABOUT.titleLines.map((line, index) => (
                <Fragment key={line}>
                  {index > 0 ? " " : null}
                  <span className="lg:block">{line}</span>
                </Fragment>
              ))}
            />
            <p className="mt-3.5 max-w-160 text-xs leading-[1.33] text-fg-muted lg:mt-2.25 lg:max-w-125 lg:text-body lg:leading-[1.45]">
              {ABOUT.body}
            </p>
          </div>

          <ol aria-label="Principles" className="self-start">
            {ABOUT.principles.map((principle, index) => (
              <li
                key={principle.title}
                className="grid grid-cols-[2rem_1fr] border-t border-border pt-2.5 pb-5.5 last:pb-0 lg:grid-cols-[3.5rem_1fr] lg:pt-4.25 lg:pb-9.5 lg:pl-3"
              >
                <span className="text-label font-medium tracking-label text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[0.6875rem] font-bold tracking-[0.04em] text-fg uppercase lg:text-caption">
                    {principle.title}
                  </h3>
                  <p className="mt-1.5 text-[0.6875rem] text-fg-muted lg:mt-2 lg:text-caption">
                    {principle.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
