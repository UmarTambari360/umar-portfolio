import { PageHeader } from "@/admin/components/page-header";
import { StatePanel } from "@/admin/components/state-panel";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";

/** Placeholder until the analytics dashboard is built. */
export function Component() {
  useAdminDocument("Analytics · Admin");

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Visitors, top projects and where people come from."
      />
      <div className="mt-10">
        <StatePanel
          tone="empty"
          title="Analytics is coming."
          description="Visitor counts and project clicks will appear here."
        />
      </div>
    </>
  );
}
