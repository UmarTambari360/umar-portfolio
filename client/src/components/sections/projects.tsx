import { WORK } from "@/content/home";
import { useFeaturedProjects } from "@/hooks/use-featured-projects";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonClasses } from "@/components/ui/button-styles";
import { ProjectCard } from "./project-card";

function ProjectsSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading projects</span>
      <ul aria-hidden className="grid gap-6 md:grid-cols-2">
        {[0, 1].map((key) => (
          <li
            key={key}
            className="h-[480px] animate-pulse rounded-card bg-surface motion-reduce:animate-none"
          />
        ))}
      </ul>
    </div>
  );
}

export function Projects() {
  const { state, retry } = useFeaturedProjects();

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-6 pt-[88px] pb-[50px]"
    >
      <Container>
        <SectionHeading
          id="work-heading"
          eyebrow={WORK.eyebrow}
          title={WORK.title}
          description={WORK.description}
        />

        <div className="mt-8">
          {state.status === "loading" ? <ProjectsSkeleton /> : null}

          {state.status === "error" ? (
            <div role="alert" className="rounded-card bg-surface p-8">
              <p className="font-display text-title font-bold">
                Couldn’t load projects.
              </p>
              <p className="mt-2 text-caption text-fg-muted">{state.message}</p>
              <button
                type="button"
                onClick={retry}
                className={buttonClasses("primary", "mt-6")}
              >
                Try again
              </button>
            </div>
          ) : null}

          {state.status === "success" && state.projects.length === 0 ? (
            <p className="rounded-card bg-surface p-8 text-body text-fg-muted">
              {WORK.emptyMessage}
            </p>
          ) : null}

          {state.status === "success" && state.projects.length > 0 ? (
            <ul className="grid gap-6 md:grid-cols-2">
              {state.projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
