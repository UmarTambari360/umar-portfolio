import { ABOUT } from "@/content/home";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-6 pb-[105px]"
    >
      <Container>
        <div className="grid gap-12 border-t border-border pt-[59px] lg:grid-cols-[minmax(0,1fr)_531px] lg:gap-9">
          <div>
            <SectionHeading
              id="about-heading"
              eyebrow={ABOUT.eyebrow}
              size="md"
              title={ABOUT.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            />
            <p className="mt-[9px] max-w-[500px] text-body text-fg-muted">
              {ABOUT.body}
            </p>
          </div>

          <ol aria-label="Principles" className="self-start">
            {ABOUT.principles.map((principle, index) => (
              <li
                key={principle.title}
                className="grid grid-cols-[3.5rem_1fr] border-t border-border pt-[17px] pb-[38px] pl-3 last:pb-0"
              >
                <span className="text-label font-medium tracking-label text-accent-text">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-caption font-bold tracking-[0.04em] text-fg uppercase">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-caption text-fg-muted">
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
