import type { SelectOption } from "@/admin/components/select-field";
import type { Project, ProjectPayload, ProjectStatus } from "@/types/api";

/** Form state is all strings (what inputs hold); the payload is what the API wants. */
export interface ProjectFormValues {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  featured: boolean;
  startedAt: string;
  shippedAt: string;
}

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues, string>>;

export const NAME_MAX = 100;
export const TAGLINE_MAX = 160;
export const DESCRIPTION_MAX = 5000;
export const SLUG_MAX = 120;
export const STACK_MAX = 12;

// Same rules as the server (server/src/lib/validations.ts); the server stays the
// authority, this just gives instant feedback.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const STATUS_OPTIONS: readonly SelectOption[] = [
  { value: "in_progress", label: "In progress" },
  { value: "shipped", label: "Shipped" },
  { value: "paused", label: "Paused" },
  { value: "concept", label: "Concept" },
];

export const EMPTY_FORM_VALUES: ProjectFormValues = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  stack: [],
  status: "in_progress",
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
  featured: false,
  startedAt: "",
  shippedAt: "",
};

/** "2025-06-01T00:00:00.000Z" -> "2025-06-01" (what <input type="date"> expects). */
function toDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function projectToFormValues(project: Project): ProjectFormValues {
  return {
    name: project.name,
    slug: project.slug,
    tagline: project.tagline,
    description: project.description,
    stack: project.stack,
    status: project.status,
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    imageUrl: project.imageUrl ?? "",
    featured: project.featured,
    startedAt: toDateInput(project.startedAt),
    shippedAt: toDateInput(project.shippedAt),
  };
}

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProjectForm(values: ProjectFormValues): ProjectFormErrors {
  const errors: ProjectFormErrors = {};

  const name = values.name.trim();
  if (name.length === 0) errors.name = "Name is required.";
  else if (name.length > NAME_MAX) {
    errors.name = `Name must be ${NAME_MAX} characters or less.`;
  }

  const slug = values.slug.trim();
  if (slug.length > 0) {
    if (slug.length > SLUG_MAX) {
      errors.slug = `Slug must be ${SLUG_MAX} characters or less.`;
    } else if (!SLUG_PATTERN.test(slug)) {
      errors.slug =
        "Use lowercase letters, numbers and single hyphens, e.g. my-project.";
    }
  }

  const tagline = values.tagline.trim();
  if (tagline.length === 0) errors.tagline = "Tagline is required.";
  else if (tagline.length > TAGLINE_MAX) {
    errors.tagline = `Tagline must be ${TAGLINE_MAX} characters or less.`;
  }

  const description = values.description.trim();
  if (description.length === 0) errors.description = "Description is required.";
  else if (description.length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or less.`;
  }

  if (values.stack.length === 0) {
    errors.stack = "Add at least one technology.";
  }

  const urlFields = ["liveUrl", "githubUrl", "imageUrl"] as const;
  for (const field of urlFields) {
    const value = values[field].trim();
    if (value.length > 0 && !isHttpUrl(value)) {
      errors[field] = "Enter a full link starting with https:// or http://.";
    }
  }

  // ISO dates compare correctly as plain strings.
  if (
    values.startedAt &&
    values.shippedAt &&
    values.shippedAt < values.startedAt
  ) {
    errors.shippedAt = "Shipped date can’t be before the start date.";
  }

  return errors;
}

export function formValuesToPayload(values: ProjectFormValues): ProjectPayload {
  const slug = values.slug.trim();

  return {
    name: values.name.trim(),
    ...(slug.length > 0 ? { slug } : {}),
    tagline: values.tagline.trim(),
    description: values.description.trim(),
    stack: values.stack,
    status: values.status,
    liveUrl: values.liveUrl.trim() || null,
    githubUrl: values.githubUrl.trim() || null,
    imageUrl: values.imageUrl.trim() || null,
    featured: values.featured,
    startedAt: values.startedAt || null,
    shippedAt: values.shippedAt || null,
  };
}

