import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/admin/components/button";
import { ButtonLink } from "@/admin/components/button-link";
import { cn } from "@/lib/cn";
import { formatIndex, statusLabel } from "@/lib/projects";
import type { Project } from "@/types/api";

interface ProjectRowProps {
  project: Project;
  /** Zero-based position in the homepage order. */
  position: number;
  total: number;
  /** A change to this row (or another) is being saved; locks every action. */
  busy: boolean;
  onMove: (direction: "up" | "down") => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
}

/** One project in the admin list, with its actions. Renders an <li>. */
export function ProjectRow({
  project,
  position,
  total,
  busy,
  onMove,
  onToggleFeatured,
  onDelete,
}: ProjectRowProps) {
  return (
    <li
      className={cn(
        "relative overflow-hidden rounded-card bg-surface py-5 pr-5 pl-7 md:pl-8",
      )}
    >
      {project.featured ? (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-1.5 bg-accent"
        />
      ) : null}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-micro font-bold tracking-label text-accent-text uppercase">
            {formatIndex(position)} / {statusLabel(project.status)}
            {project.featured ? " / Featured" : ""}
          </p>
          <h2 className="mt-2 truncate font-display text-title font-bold text-fg">
            {project.name}
          </h2>
          <p className="mt-1 line-clamp-2 text-caption text-fg-muted">
            {project.tagline}
          </p>
          <p className="mt-1 truncate text-caption text-fg-subtle">
            /projects/{project.slug}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            aria-label={`Move ${project.name} up`}
            icon={<ArrowUp aria-hidden size={14} />}
            disabled={busy || position === 0}
            onClick={() => {
              onMove("up");
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            aria-label={`Move ${project.name} down`}
            icon={<ArrowDown aria-hidden size={14} />}
            disabled={busy || position === total - 1}
            onClick={() => {
              onMove("down");
            }}
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            aria-pressed={project.featured}
            onClick={onToggleFeatured}
          >
            {project.featured ? "Unfeature" : "Feature"}
            <span className="sr-only"> {project.name}</span>
          </Button>
          <ButtonLink
            to={`/admin/projects/${project.id}/edit`}
            variant="secondary"
            size="sm"
          >
            Edit<span className="sr-only"> {project.name}</span>
          </ButtonLink>
          <Button variant="danger" size="sm" disabled={busy} onClick={onDelete}>
            Delete<span className="sr-only"> {project.name}</span>
          </Button>
        </div>
      </div>
    </li>
  );
}

