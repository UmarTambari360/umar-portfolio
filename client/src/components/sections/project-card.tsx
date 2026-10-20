import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonClasses } from "@/components/ui/button-styles";
import { LinkButton } from "@/components/ui/link-button";
import { trackProjectClick } from "@/lib/analytics";
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
 * One featured project. Every field is real data from the API. "Details" opens
 * the project page; the live and source links only exist when the project
 * actually has those URLs.
 *
 * Desktop (lg+) shows a cover above the text. Tablet and mobile use the
 * compact text card from those frames: lime bar on the left, stack and links
 * pinned to the bottom.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const liveUrl = safeExternalUrl(project.liveUrl);
  const sourceUrl = safeExternalUrl(project.githubUrl);
  const { items, extra } = visibleStack(project.stack);

  // Counts the first live/source click of the visit (see lib/analytics.ts).
  // `onAuxClick` covers middle-click, which is how many people open new tabs.
  const recordClick = () => {
    trackProjectClick(project.id);
  };

  return (
    <li className="min-w-0">
      <article className="relative flex min-h-[250px] flex-col overflow-hidden rounded-card bg-surface lg:min-h-0">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[6px] bg-accent lg:hidden"
        />

        <div className="hidden lg:block">
          <ProjectCover project={project} index={index} />
        </div>

        <div className="flex flex-1 flex-col px-6 pt-[22px] pb-7">
          <div>
            <p className="text-micro font-bold tracking-label text-accent-text uppercase">
              {formatIndex(index)} / {statusLabel(project.status)}
            </p>
            <h3 className="mt-3 font-display text-[1.390625rem] leading-[1.2] font-bold text-fg lg:text-title">
              {project.name}
            </h3>
            <p className="mt-2 text-caption text-fg-muted">{project.tagline}</p>
          </div>

          <div className="mt-auto pt-6 lg:mt-0 lg:pt-4">
            {items.length > 0 ? (
              <ul
                aria-label="Tech stack"
                className="flex flex-wrap items-center text-micro font-medium tracking-label text-accent-text uppercase lg:text-fg"
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

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                to={`/projects/${project.slug}`}
                className={buttonClasses("ghost")}
              >
                Details
                <span className="sr-only"> for {project.name}</span>
                <ArrowRight aria-hidden size={11} />
              </Link>
              {liveUrl ? (
                <LinkButton
                  href={liveUrl}
                  variant="link"
                  external
                  className="text-fg lg:text-accent-text"
                  onClick={recordClick}
                  onAuxClick={recordClick}
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
                  onClick={recordClick}
                  onAuxClick={recordClick}
                  icon={<ArrowUpRight size={11} />}
                >
                  Source
                  <span className="sr-only"> for {project.name}</span>
                </LinkButton>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

