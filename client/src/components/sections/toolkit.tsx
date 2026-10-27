import { TOOLKIT }  from "@/content/home";
import { Chip }     from "@/components/ui/chip";
import { Reveal, RevealStagger } from "@/components/motion/reveal";
import { Container }      from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function Toolkit() {
  return (
    <section aria-labelledby="toolkit-heading">
      <Container>
        <Reveal>
          <SectionHeading
            id="toolkit-heading"
            eyebrow={TOOLKIT.eyebrow}
            title={TOOLKIT.title}
            size="sm"
          />
        </Reveal>
        <RevealStagger
          as="ul"
          stagger={0.04}
          aria-label="Tools"
          className="mt-4.5 flex flex-wrap gap-x-3 gap-y-1.5 md:mt-3.75 lg:mt-5.5 lg:gap-4"
        >
          {TOOLKIT.items.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </RevealStagger>
      </Container>
    </section>
  );
}
