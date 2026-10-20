import { like } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema/projects.js';

const MAX_BASE_LENGTH = 110; // leaves room for a "-123" collision suffix within 120

/** "Pen Times Magazine!" -> "pen-times-magazine". Never returns an empty string. */
export function slugify(input: string): string {
  const slug = input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: "é" -> "e"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_BASE_LENGTH)
    .replace(/-+$/g, '');

  return slug || 'project';
}

/**
 * Returns `base`, or `base-2`, `base-3`, ... whichever is free.
 * The UNIQUE constraint remains the real guarantee; this just makes the
 * common case (two projects with the same name) work without an error.
 */
export async function generateUniqueSlug(base: string): Promise<string> {
  const rows = await db
    .select({ slug: projects.slug })
    .from(projects)
    .where(like(projects.slug, `${base}%`));

  const taken = new Set(rows.map((row) => row.slug));
  if (!taken.has(base)) return base;

  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
}

