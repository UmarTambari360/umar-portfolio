import { ArrowDown, ArrowUp, Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
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

/** One project in the admin table, with its actions. Renders a <tr>. */
export function ProjectRow({
  project,
  position,
  total,
  busy,
  onMove,
  onToggleFeatured,
  onDelete,
}: ProjectRowProps) {
  const status = (
    <Badge
      variant={project.status === "shipped" ? "default" : "outline"}
      className="text-micro font-bold tracking-label uppercase"
    >
      {statusLabel(project.status)}
    </Badge>
  );

  return (
    <TableRow>
      <TableCell className="w-12 text-micro font-bold tracking-label text-accent-text">
        {formatIndex(position)}
      </TableCell>

      <TableCell>
        <div className="max-w-48 sm:max-w-xs lg:max-w-md">
          <p className="truncate font-display text-body font-bold text-foreground">
            {project.name}
          </p>
          <p className="truncate text-caption text-muted-foreground">
            /projects/{project.slug}
          </p>
          <div className="mt-2 md:hidden">{status}</div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">{status}</TableCell>

      <TableCell>
        <Switch
          checked={project.featured}
          disabled={busy}
          aria-label={`Show ${project.name} on the homepage`}
          onCheckedChange={() => {
            onToggleFeatured();
          }}
        />
      </TableCell>

      <TableCell>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Move ${project.name} up`}
            disabled={busy || position === 0}
            onClick={() => {
              onMove("up");
            }}
          >
            <ArrowUp aria-hidden size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Move ${project.name} down`}
            disabled={busy || position === total - 1}
            onClick={() => {
              onMove("down");
            }}
          >
            <ArrowDown aria-hidden size={14} />
          </Button>
        </div>
      </TableCell>

      <TableCell className="w-12 text-right">
        {/* modal={false}: avoids a Radix quirk where opening a dialog from a
            menu item can leave the page unclickable after the dialog closes. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={busy}
              aria-label={`Actions for ${project.name}`}
            >
              <Ellipsis aria-hidden size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`/admin/projects/${project.id}/edit`}>
                <Pencil aria-hidden />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onSelect={onDelete}
            >
              <Trash2 aria-hidden className="text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
