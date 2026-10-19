import { TOOLKIT }  from "@/content/home";
import { Chip }     from "@/components/ui/chip";
import { Container }      from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function Toolkit() {
  return (
    <section aria-labelledby="toolkit-heading">
      <Container>
        <SectionHeading
          id="toolkit-heading"
          eyebrow={TOOLKIT.eyebrow}
          title={TOOLKIT.title}
          size="sm"
        />
        <ul
          aria-label="Tools"
          className="mt-4.5 flex flex-wrap gap-x-3 gap-y-1.5 md:mt-3.75 lg:mt-5.5 lg:gap-4"
        >
          {TOOLKIT.items.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </ul>
      </Container>
    </section>
  );
}
