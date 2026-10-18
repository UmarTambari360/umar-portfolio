import { TOOLKIT } from "@/content/home";
import { Chip } from "@/components/ui/chip";
import { Container } from "@/components/ui/container";
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
        <ul aria-label="Tools" className="mt-[22px] flex flex-wrap gap-4">
          {TOOLKIT.items.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </ul>
      </Container>
    </section>
  );
}
