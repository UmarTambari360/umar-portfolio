import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/admin/components/button-link";
import { PageHeader } from "@/admin/components/page-header";
import { ProjectForm } from "@/admin/components/project-form";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { EMPTY_FORM_VALUES } from "@/admin/lib/project-form";
import { createProject } from "@/admin/lib/projects-api";
import { toast } from "@/admin/stores/toasts";

export function Component() {
  useAdminDocument("New project · Admin");
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="New project"
        description="New projects are added to the end of the list. Reorder them afterwards."
        actions={
          <ButtonLink
            to="/admin/projects"
            variant="secondary"
            icon={<ArrowLeft aria-hidden size={14} />}
          >
            All projects
          </ButtonLink>
        }
      />
      <div className="mt-10">
        <ProjectForm
          initialValues={EMPTY_FORM_VALUES}
          submitLabel="Create project"
          slugHint="Used in the project page address. Leave empty to generate it from the name."
          onSubmit={async (payload) => {
            const created = await createProject(payload);
            toast.success(`Created ${created.name}.`);
            void navigate("/admin/projects");
          }}
          onCancel={() => {
            void navigate("/admin/projects");
          }}
        />
      </div>
    </>
  );
}

