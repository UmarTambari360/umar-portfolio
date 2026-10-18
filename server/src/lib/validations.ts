import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

const urlOrEmptyString = z
  .union([z.string().url('Invalid URL format'), z.literal('')])
  .optional()
  .nullable();

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  tagline: z
    .string()
    .min(1, 'Tagline is required')
    .max(160, 'Tagline must be 160 characters or less'),
  description: z.string().min(1, 'Description is required'),
  stack: z
    .array(z.string())
    .min(1, 'At least one tech stack item is required'),
  status: z.enum(['in_progress', 'shipped', 'paused', 'concept']),
  liveUrl: urlOrEmptyString,
  githubUrl: urlOrEmptyString,
  imageUrl: urlOrEmptyString,
  featured: z.boolean().default(false),
  priority: z.number().int().min(0, 'Priority must be 0 or greater').default(0),
  startedAt: z.coerce.date().optional().nullable(),
  shippedAt: z.coerce.date().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;