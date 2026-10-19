import { useState, type ReactNode } from "react";
import { Button } from "@/admin/components/button";
import { ConfirmDialog } from "@/admin/components/confirm-dialog";
import { PageHeader } from "@/admin/components/page-header";
import { SelectField } from "@/admin/components/select-field";
import { Skeleton } from "@/admin/components/skeleton";
import { StatePanel } from "@/admin/components/state-panel";
import { SwitchField } from "@/admin/components/switch-field";
import { TagInput } from "@/admin/components/tag-input";
import { TextAreaField } from "@/admin/components/textarea-field";
import { TextField } from "@/admin/components/text-field";
import { useAdminDocument } from "@/admin/hooks/use-admin-document";
import { toast } from "@/admin/stores/toasts";

const STATUS_OPTIONS = [
  { value: "in_progress", label: "In progress" },
  { value: "shipped", label: "Shipped" },
  { value: "paused", label: "Paused" },
  { value: "concept", label: "Concept" },
] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-5 text-label font-bold tracking-label text-accent-text uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Development-only gallery of the admin form primitives (not part of the
 * production build). Lets the primitives be reviewed and tested on their own.
 */
export function Component() {
  useAdminDocument("Components · Admin");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [featured, setFeatured] = useState(true);
  const [stack, setStack] = useState<string[]>(["React", "TypeScript"]);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  const confirmDelete = () => {
    setConfirming(true);
    window.setTimeout(() => {
      setConfirming(false);
      setConfirmOpen(false);
      toast.success("Project deleted.");
    }, 800);
  };

  const fakeSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.success("Saved.");
    }, 800);
  };

  return (
    <>
      <PageHeader
        title="Components"
        description="Development-only gallery of the admin form primitives."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setShowErrors((value) => !value);
            }}
          >
            {showErrors ? "Hide errors" : "Show errors"}
          </Button>
        }
      />

      <Section title="Fields">
        <div className="space-y-6 rounded-card bg-surface p-6 md:p-8">
          <TextField
            label="Name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
            hint="Shown as the card title."
            error={showErrors ? "Name is required" : null}
          />
          <TextAreaField
            label="Description"
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            maxLength={500}
            showCount
            error={showErrors ? "Description is required" : null}
          />
          <SelectField
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(event) => {
              setStatus(event.target.value);
            }}
          />
          <TagInput
            label="Stack"
            value={stack}
            onChange={setStack}
            placeholder="Add a technology"
            hint="Press Enter or comma to add. The first three show on the card."
            error={
              showErrors && stack.length === 0
                ? "Add at least one technology"
                : null
            }
          />
          <SwitchField
            label="Featured"
            hint="Show on the homepage."
            checked={featured}
            onCheckedChange={setFeatured}
          />
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button disabled>Disabled</Button>
          <Button loading={saving} onClick={fakeSave}>
            {saving ? "Saving" : "Save (loading demo)"}
          </Button>
        </div>
      </Section>

      <Section title="Dialog and toasts">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="danger"
            onClick={() => {
              setConfirmOpen(true);
            }}
          >
            Delete project…
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.success("Project saved.");
            }}
          >
            Success toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.info("Order updated.");
            }}
          >
            Info toast
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              toast.error("Could not save the project. Try again.");
            }}
          >
            Error toast
          </Button>
        </div>
      </Section>

      <Section title="States">
        <div className="space-y-6">
          <StatePanel
            tone="empty"
            title="No projects yet."
            description="Add your first project to show it on the homepage."
            action={<Button size="sm">Add project</Button>}
          />
          <StatePanel
            tone="error"
            title="Couldn’t load projects."
            description="The server did not respond."
            action={
              <Button size="sm" variant="secondary">
                Try again
              </Button>
            }
          />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </Section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this project?"
        description="It will be removed from the homepage and the API. This can’t be undone."
        confirmLabel="Delete project"
        pending={confirming}
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
