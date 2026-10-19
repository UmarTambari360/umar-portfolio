import { PageHeader } from "@/admin/components/page-header";
import { StatePanel } from "@/admin/components/state-panel";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";

/** Placeholder until project management is built. */
export function Component() {
  useAdminDocument("Projects · Admin");

  return (
    <>
      <PageHeader
        title="Projects"
        description="Everything shown in the Selected projects section of the homepage."
      />
      <div className="mt-10">
        <StatePanel
          tone="empty"
          title="Project management is next."
          description="Create, edit, reorder and feature projects from here."
        />
      </div>
    </>
  );
}
