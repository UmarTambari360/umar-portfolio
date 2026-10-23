import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/admin/components/button-link";
import { PageHeader } from "@/admin/components/page-header";
import { ProjectForm } from "@/admin/components/project-form";
import { StatePanel } from "@/admin/components/state-panel";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { errorMessage } from "@/admin/lib/format";
import { projectToFormValues } from "@/admin/lib/project-form";
import { fetchProject, updateProject } from "@/admin/lib/projects-api";
import { toast } from "@/admin/stores/toasts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError } from "@/lib/api";
import type { Project } from "@/types/api";

type EditState =
  | { status: "loading" }
  | { status: "notfound" }
  | { status: "error"; message: string }
  | { status: "success"; project: Project };

const BACK_LINK = (
  <ButtonLink
    to="/admin/projects"
    variant="outline"
    icon={<ArrowLeft aria-hidden size={14} />}
  >
    All projects
  </ButtonLink>
);

function ProjectEditor({ id }: { id: string }) {
  const navigate = useNavigate();
  const [state, setState] = useState<EditState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useAdminDocument(
    state.status === "success"
      ? `Edit ${state.project.name} · Admin`
      : "Edit project · Admin",
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchProject(id, controller.signal)
      .then((project) => {
        setState({ status: "success", project });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const missing =
          error instanceof ApiError &&
          (error.status === 404 || error.status === 400);
        setState(
          missing
            ? { status: "notfound" }
            : { status: "error", message: errorMessage(error) },
        );
      });

    return () => controller.abort();
  }, [id, attempt]);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }, []);

  return (
    <>
      <PageHeader
        title="Edit project"
        description={
          state.status === "success" ? state.project.name : undefined
        }
        actions={BACK_LINK}
      />
      <div className="mt-10">
        {state.status === "loading" ? (
          <div role="status" className="grid gap-6">
            <span className="sr-only">Loading project</span>
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
          </div>
        ) : null}

        {state.status === "notfound" ? (
          <StatePanel
            tone="error"
            title="Project not found."
            description="It may have been deleted. Go back to the list to pick another."
            action={
              <ButtonLink to="/admin/projects">Back to projects</ButtonLink>
            }
          />
        ) : null}

        {state.status === "error" ? (
          <StatePanel
            tone="error"
            title="Couldn’t load this project."
            description={state.message}
            action={<Button onClick={retry}>Try again</Button>}
          />
        ) : null}

        {state.status === "success" ? (
          <ProjectForm
            initialValues={projectToFormValues(state.project)}
            submitLabel="Save changes"
            slugHint="Changing this breaks any existing links to the project page."
            onSubmit={async (payload) => {
              const updated = await updateProject(state.project.id, payload);
              toast.success(`Saved ${updated.name}.`);
              void navigate("/admin/projects");
            }}
            onCancel={() => {
              void navigate("/admin/projects");
            }}
          />
        ) : null}
      </div>
    </>
  );
}

export function Component() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return (
      <StatePanel
        tone="error"
        title="Project not found."
        action={<ButtonLink to="/admin/projects">Back to projects</ButtonLink>}
      />
    );
  }

  // `key` remounts the editor when the id changes, resetting its state cleanly.
  return <ProjectEditor key={id} id={id} />;
}
