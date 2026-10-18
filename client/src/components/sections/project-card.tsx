import { ArrowUpRight } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import {
  formatIndex,
  safeExternalUrl,
  statusLabel,
  visibleStack,
} from "@/lib/projects";
import type { Project } from "@/types/api";
import { ProjectCover } from "./project-cover";

interface ProjectCardProps {
  project: Project;
  index: number;
}

/**
 * One featured project. Every field is real data from the API; the action
 * links only exist when the project actually has a live or source URL.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const liveUrl = safeExternalUrl(project.liveUrl);
  const sourceUrl = safeExternalUrl(project.githubUrl);
  const { items, extra } = visibleStack(project.stack);

  return (
    <li className="min-w-0">
      <article className="overflow-hidden rounded-card bg-surface">
        <ProjectCover project={project} index={index} />

        <div className="px-6 pt-[22px] pb-7">
          <p className="text-micro font-bold tracking-label text-accent-text uppercase">
            {formatIndex(index)} / {statusLabel(project.status)}
          </p>
          <h3 className="mt-3 font-display text-title font-bold text-fg">
            {project.name}
          </h3>
          <p className="mt-2 text-caption text-fg-muted">{project.tagline}</p>

          {items.length > 0 ? (
            <ul
              aria-label="Tech stack"
              className="mt-4 flex flex-wrap items-center text-micro font-medium tracking-label text-fg uppercase"
            >
              {items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`} className="inline-flex">
                  {itemIndex > 0 ? (
                    <span aria-hidden className="mx-2 text-fg-subtle">
                      ·
                    </span>
                  ) : null}
                  {item}
                </li>
              ))}
              {extra > 0 ? (
                <li className="inline-flex text-fg-subtle">
                  <span aria-hidden className="mx-2">
                    ·
                  </span>
                  +{extra}
                </li>
              ) : null}
            </ul>
          ) : null}

          {liveUrl || sourceUrl ? (
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {liveUrl ? (
                <LinkButton
                  href={liveUrl}
                  variant="link"
                  external
                  icon={<ArrowUpRight size={11} />}
                >
                  View live
                  <span className="sr-only"> for {project.name}</span>
                </LinkButton>
              ) : null}
              {sourceUrl ? (
                <LinkButton
                  href={sourceUrl}
                  variant="ghost"
                  external
                  icon={<ArrowUpRight size={11} />}
                >
                  Source
                  <span className="sr-only"> for {project.name}</span>
                </LinkButton>
              ) : null}
            </div>
          ) : null}
        </div>
      </article>
    </li>
  );
}
