import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { CircleAlert } from "lucide-react";
import { SelectField } from "@/admin/components/select-field";
import { SwitchField } from "@/admin/components/switch-field";
import { TagInput } from "@/admin/components/tag-input";
import { TextAreaField } from "@/admin/components/textarea-field";
import { TextField } from "@/admin/components/text-field";
import { errorMessage } from "@/admin/lib/format";
import {
  DESCRIPTION_MAX,
  NAME_MAX,
  STACK_MAX,
  STATUS_OPTIONS,
  TAGLINE_MAX,
  formValuesToPayload,
  validateProjectForm,
  type ProjectFormErrors,
  type ProjectFormValues,
} from "@/admin/lib/project-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import type { ProjectPayload, ProjectStatus } from "@/types/api";

interface ProjectFormProps {
  initialValues: ProjectFormValues;
  submitLabel: string;
  slugHint: string;
  /** Resolve on success (the page then navigates); throw to show the message. */
  onSubmit: (payload: ProjectPayload) => Promise<void>;
  onCancel: () => void;
}

function isProjectStatus(value: string): value is ProjectStatus {
  return STATUS_OPTIONS.some((option) => option.value === value);
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="font-display text-title font-bold">{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>{children}</FieldGroup>
      </CardContent>
    </Card>
  );
}

/** Shared by "New project" and "Edit project". */
export function ProjectForm({
  initialValues,
  submitLabel,
  slugHint,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>(initialValues);
  const [errors, setErrors] = useState<ProjectFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const alertRef = useRef<HTMLDivElement>(null);

  // Bring the error message into view: on a long form the buttons (and the
  // message above them) are usually off-screen when Save is pressed.
  useEffect(() => {
    if (submitError) {
      alertRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [submitError]);

  const setField = <K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (current[key] === undefined) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validateProjectForm(values);
    setErrors(found);
    const count = Object.keys(found).length;
    if (count > 0) {
      setSubmitError(
        `Fix ${count} ${count === 1 ? "field" : "fields"} marked below and try again.`,
      );
      return;
    }

    setSubmitError(null);
    setSubmitting(true);
    try {
      await onSubmit(formValuesToPayload(values));
    } catch (error) {
      setSubmitError(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      className="grid gap-6"
    >
      <FormSection title="Basics">
        <TextField
          label="Name"
          value={values.name}
          maxLength={NAME_MAX}
          autoComplete="off"
          error={errors.name}
          onChange={(event) => {
            setField("name", event.target.value);
          }}
        />
        <TextField
          label="URL slug"
          value={values.slug}
          hint={slugHint}
          autoComplete="off"
          spellCheck={false}
          error={errors.slug}
          onChange={(event) => {
            setField("slug", event.target.value);
          }}
        />
        <TextAreaField
          label="Tagline"
          rows={2}
          value={values.tagline}
          maxLength={TAGLINE_MAX}
          showCount
          hint="One sentence shown on the homepage card."
          error={errors.tagline}
          onChange={(event) => {
            setField("tagline", event.target.value);
          }}
        />
        <TextAreaField
          label="Description"
          rows={9}
          value={values.description}
          maxLength={DESCRIPTION_MAX}
          showCount
          hint="Shown on the project page. Plain text: leave a blank line between paragraphs."
          error={errors.description}
          onChange={(event) => {
            setField("description", event.target.value);
          }}
        />
      </FormSection>

      <FormSection title="Details">
        <TagInput
          label="Tech stack"
          value={values.stack}
          maxTags={STACK_MAX}
          placeholder="Type a technology, press Enter"
          hint="Order matters: the first three show on the homepage card."
          error={errors.stack}
          onChange={(next) => {
            setField("stack", next);
          }}
        />
        <SelectField
          label="Status"
          options={STATUS_OPTIONS}
          value={values.status}
          onValueChange={(next) => {
            if (isProjectStatus(next)) setField("status", next);
          }}
        />
        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="Started"
            type="date"
            value={values.startedAt}
            error={errors.startedAt}
            onChange={(event) => {
              setField("startedAt", event.target.value);
            }}
          />
          <TextField
            label="Shipped"
            type="date"
            value={values.shippedAt}
            error={errors.shippedAt}
            onChange={(event) => {
              setField("shippedAt", event.target.value);
            }}
          />
        </div>
        <SwitchField
          label="Featured on homepage"
          hint="Only featured projects appear in the Selected projects section."
          checked={values.featured}
          onCheckedChange={(next) => {
            setField("featured", next);
          }}
        />
      </FormSection>

      <FormSection title="Links">
        <TextField
          label="Live URL"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.liveUrl}
          error={errors.liveUrl}
          onChange={(event) => {
            setField("liveUrl", event.target.value);
          }}
        />
        <TextField
          label="Source URL"
          type="url"
          inputMode="url"
          placeholder="https://github.com/"
          value={values.githubUrl}
          error={errors.githubUrl}
          onChange={(event) => {
            setField("githubUrl", event.target.value);
          }}
        />
        <TextField
          label="Cover image URL"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={values.imageUrl}
          hint="A direct link to an image. Leave empty to use the generated cover."
          error={errors.imageUrl}
          onChange={(event) => {
            setField("imageUrl", event.target.value);
          }}
        />
      </FormSection>

      {submitError ? (
        <div ref={alertRef}>
          <Alert variant="destructive">
            <CircleAlert aria-hidden />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 md:flex-row md:justify-end">
        <Button variant="outline" disabled={submitting} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
