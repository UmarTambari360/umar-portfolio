import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/admin/components/button";
import { ButtonLink } from "@/admin/components/button-link";
import { ConfirmDialog } from "@/admin/components/confirm-dialog";
import { PageHeader } from "@/admin/components/page-header";
import { ProjectRow } from "@/admin/components/project-row";
import { Skeleton } from "@/admin/components/skeleton";
import { StatePanel } from "@/admin/components/state-panel";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { useAdminProjects } from "@/admin/hooks/use-admin-projects";
import { errorMessage } from "@/admin/lib/format";
import {
  deleteProject,
  reorderProjects,
  updateProject,
} from "@/admin/lib/projects-api";
import { toast } from "@/admin/stores/toasts";
import { ApiError } from "@/lib/api";
import type { Project } from "@/types/api";

export function Component() {
  useAdminDocument("Projects · Admin");

  const { state, reload, setProjects } = useAdminProjects();
  // The one project whose change is being saved. Everything is locked meanwhile,
  // so two quick clicks can never send overlapping (and conflicting) requests.
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const projects = state.status === "success" ? state.projects : [];
  const busy = busyId !== null;

  const move = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    const moving = projects[index];
    if (busy || !moving || target < 0 || target >= projects.length) return;

    const reordered = [...projects];
    reordered.splice(index, 1);
    reordered.splice(target, 0, moving);

    setBusyId(moving.id);
    setProjects(reordered); // optimistic: the row moves immediately
    try {
      setProjects(await reorderProjects(reordered.map((project) => project.id)));
      toast.info(`Moved ${moving.name} to position ${target + 1}.`);
    } catch (error) {
      setProjects(projects); // roll back to what the server last confirmed
      toast.error(errorMessage(error));
      // 409 = the list changed elsewhere (another tab). Refetch the truth.
      if (error instanceof ApiError && error.status === 409) reload();
    } finally {
      setBusyId(null);
    }
  };

  const toggleFeatured = async (project: Project) => {
    if (busy) return;
    setBusyId(project.id);
    try {
      const updated = await updateProject(project.id, {
        featured: !project.featured,
      });
      setProjects(
        projects.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(
        updated.featured
          ? `${updated.name} is now featured.`
          : `${updated.name} removed from the homepage.`,
      );
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProject(toDelete.id);
      setProjects(projects.filter((item) => item.id !== toDelete.id));
      toast.success(`Deleted ${toDelete.name}.`);
      setToDelete(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  const addButton = (
    <ButtonLink
      to="/admin/projects/new"
      icon={<Plus aria-hidden size={14} />}
    >
      Add project
    </ButtonLink>
  );

  const featuredCount = projects.filter((project) => project.featured).length;

  return (
    <>
      <PageHeader
        title="Projects"
        description="Everything shown in the Selected projects section of the homepage. The order here is the order there."
        actions={state.status === "success" ? addButton : undefined}
      />

      <div className="mt-10">
        {state.status === "loading" ? (
          <div role="status" className="grid gap-4">
            <span className="sr-only">Loading projects</span>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : null}

        {state.status === "error" ? (
          <StatePanel
            tone="error"
            title="Couldn’t load projects."
            description={state.message}
            action={<Button onClick={reload}>Try again</Button>}
          />
        ) : null}

        {state.status === "success" && projects.length === 0 ? (
          <StatePanel
            tone="empty"
            title="No projects yet."
            description="Add your first project and mark it as featured to show it on the homepage."
            action={addButton}
          />
        ) : null}

        {state.status === "success" && projects.length > 0 ? (
          <>
            <ul className="grid gap-4">
              {projects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  position={index}
                  total={projects.length}
                  busy={busy}
                  onMove={(direction) => {
                    void move(index, direction);
                  }}
                  onToggleFeatured={() => {
                    void toggleFeatured(project);
                  }}
                  onDelete={() => {
                    setToDelete(project);
                  }}
                />
              ))}
            </ul>
            <p className="mt-6 text-caption text-fg-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
              {featuredCount} featured on the homepage
            </p>
          </>
        ) : null}
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this project?"
        description={`“${toDelete?.name ?? ""}” will be removed from the site for good. Its past click counts stay in analytics, without a name.`}
        confirmLabel="Delete project"
        pending={deleting}
        onConfirm={() => {
          void confirmDelete();
        }}
        onCancel={() => {
          setToDelete(null);
        }}
      />
    </>
  );
}

