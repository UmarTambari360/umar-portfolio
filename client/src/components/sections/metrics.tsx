import { ArrowDown } from "lucide-react";
import { METRICS, METRICS_HINT } from "@/content/home";
import { Container }     from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button-styles";
import { RevealItem, RevealStagger } from "@/components/motion/reveal";
import { cn } from "@/lib/cn";

export function Metrics() {
  return (
    <section aria-label="At a glance">
      <Container>
        <div className="grid gap-8 border-t border-border pt-5 md:pt-4.75 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:pt-7">
          <RevealStagger
            as="ul"
            stagger={0.1}
            className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,305px))]"
          >
            {METRICS.map((metric) => (
              <RevealItem
                as="li"
                key={metric.value}
                className="max-md:odd:last:col-span-2"
              >
                <p
                  className={cn(
                    "font-display text-[1.3125rem] font-bold uppercase md:text-[1.6875rem] lg:text-metric lg:leading-[1.55]",
                    metric.accent ? "text-accent-text" : "text-fg",
                  )}
                >
                  {metric.value}
                </p>
                <p className="mt-0.5 text-micro tracking-label text-fg-subtle uppercase">
                  {metric.label}
                </p>
              </RevealItem>
            ))}
          </RevealStagger>

          <a
            href={METRICS_HINT.href}
            className={cn(
              buttonClasses("ghost"),
              "hidden font-medium text-fg-subtle lg:inline-flex",
            )}
          >
            {METRICS_HINT.label}
            <ArrowDown aria-hidden size={11} />
          </a>
        </div>
      </Container>
    </section>
  );
}
