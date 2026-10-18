import { ArrowDown } from "lucide-react";
import { METRICS, METRICS_HINT } from "@/content/home";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button-styles";
import { cn } from "@/lib/cn";

export function Metrics() {
  return (
    <section aria-label="At a glance">
      <Container>
        <div className="grid gap-8 border-t border-border pt-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <ul className="grid gap-8 sm:grid-cols-3 lg:grid-cols-[repeat(3,minmax(0,305px))]">
            {METRICS.map((metric) => (
              <li key={metric.value}>
                <p
                  className={cn(
                    "font-display text-metric font-bold uppercase",
                    metric.accent ? "text-accent-text" : "text-fg",
                  )}
                >
                  {metric.value}
                </p>
                <p className="mt-0.5 text-micro tracking-label text-fg-subtle uppercase">
                  {metric.label}
                </p>
              </li>
            ))}
          </ul>

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
