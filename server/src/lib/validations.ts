import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const PROJECT_STATUSES = [
  'in_progress',
  'shipped',
  'paused',
  'concept',
] as const;

export const projectStatusSchema = z.enum(PROJECT_STATUSES);

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Slug cannot be empty')
  .max(120, 'Slug must be 120 characters or less')
  .regex(
    SLUG_PATTERN,
    'Slug may only contain lowercase letters, numbers and single hyphens',
  );

/**
 * http(s) only. `z.string().url()` alone accepts "javascript:alert(1)", which
 * would become an XSS vector the moment any page renders it as a link.
 */
const httpUrl = z
  .string()
  .trim()
  .max(2048, 'URL is too long')
  .url('Invalid URL format')
  .refine((value) => /^https?:\/\//i.test(value), {
    message: 'URL must start with http:// or https://',
  });

const urlOrEmptyString = z
  .union([httpUrl, z.literal('')])
  .optional()
  .nullable();

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  slug: slugSchema.optional(),
  tagline: z
    .string()
    .trim()
    .min(1, 'Tagline is required')
    .max(160, 'Tagline must be 160 characters or less'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(5000, 'Description must be 5000 characters or less'),
  stack: z
    .array(
      z
        .string()
        .trim()
        .min(1, 'Stack items cannot be empty')
        .max(40, 'Stack items must be 40 characters or less'),
    )
    .min(1, 'At least one tech stack item is required')
    .max(12, 'Use 12 stack items or fewer'),
  status: projectStatusSchema,
  liveUrl: urlOrEmptyString,
  githubUrl: urlOrEmptyString,
  imageUrl: urlOrEmptyString,
  featured: z.boolean().default(false),
  // Omit to append the project to the end of the list.
  priority: z.number().int().min(0, 'Priority must be 0 or greater').optional(),
  startedAt: z.coerce.date().optional().nullable(),
  shippedAt: z.coerce.date().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

/** Full ordered list of project ids; position in the array becomes the priority. */
export const reorderProjectsSchema = z.object({
  ids: z
    .array(z.string().uuid('Invalid project ID'))
    .min(1, 'At least one project ID is required')
    .max(500, 'Too many projects'),
});

export const trackSchema = z.object({
  referrer: z.string().max(2048).optional(),
  projectClicked: z.string().uuid().optional(),
});

export type TrackInput = z.infer<typeof trackSchema>;

