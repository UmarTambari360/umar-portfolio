import { CircleAlert } from "lucide-react";
import { WORK } from "@/content/home";
import { useFeaturedProjects } from "@/hooks/use-featured-projects";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "./project-card";

function ProjectsSkeleton() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading projects</span>
      <ul aria-hidden className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {[0, 1].map((key) => (
          <li key={key}>
            <Skeleton className="h-62.5 w-full rounded-card bg-surface lg:h-120" />
          </li>
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
      className="scroll-mt-6 pt-13 pb-7.25 md:pt-11.5 lg:pt-22 lg:pb-12.5"
    >
      <Container>
        <SectionHeading
          id="work-heading"
          eyebrow={WORK.eyebrow}
          title={WORK.title}
          description={WORK.description}
        />

        <div className="mt-2.75 md:mt-6.25 lg:mt-8">
          {state.status === "loading" ? <ProjectsSkeleton /> : null}

          {state.status === "error" ? (
            <Alert variant="destructive" className="rounded-card p-6">
              <CircleAlert aria-hidden />
              <AlertTitle className="font-display text-title">
                Couldn’t load projects.
              </AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
              <div className="col-start-2 mt-4">
                <Button size="lg" onClick={retry}>
                  Try again
                </Button>
              </div>
            </Alert>
          ) : null}

          {state.status === "success" && state.projects.length === 0 ? (
            <p className="rounded-card bg-surface p-8 text-body text-fg-muted">
              {WORK.emptyMessage}
            </p>
          ) : null}

          {state.status === "success" && state.projects.length > 0 ? (
            <ul className="grid gap-5 lg:grid-cols-2 lg:gap-6">
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
