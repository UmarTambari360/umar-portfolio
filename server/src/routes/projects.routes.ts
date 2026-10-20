import { Router, Request, Response, NextFunction } from 'express';
import { eq, and, asc, desc, max, SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema/projects.js';
import {
  HttpError,
  firstIssueMessage,
  isUniqueViolation,
} from '../lib/http-error.js';
import { generateUniqueSlug, slugify } from '../lib/slug.js';
import {
  createProjectSchema,
  updateProjectSchema,
  reorderProjectsSchema,
  projectStatusSchema,
  isUuid,
} from '../lib/validations.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

const SLUG_TAKEN_MESSAGE = 'That slug is already used by another project';

/** Validates the `:id` route param; rejects anything that is not a UUID with a 400. */
function readProjectId(req: Request): string {
  const id = req.params.id;
  if (!id || !isUuid(id)) {
    throw new HttpError(400, 'Invalid project ID');
  }
  return id;
}

/** The form sends "" for an emptied URL field; the database stores NULL. */
function emptyToNull(value: string | null | undefined): string | null {
  return value ? value : null;
}

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { featured, status } = req.query;
      const conditions: SQL[] = [];

      if (featured === 'true') {
        conditions.push(eq(projects.featured, true));
      } else if (featured === 'false') {
        conditions.push(eq(projects.featured, false));
      }

      const parsedStatus = projectStatusSchema.safeParse(status);
      if (parsedStatus.success) {
        conditions.push(eq(projects.status, parsedStatus.data));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const projectList = await db
        .select()
        .from(projects)
        .where(whereClause)
        .orderBy(asc(projects.priority), desc(projects.createdAt));

      res.status(200).json({ data: projectList });
    } catch (error) {
      next(error);
    }
  },
);

// Persists a new order. Declared before "/:identifier" for readability; the
// methods differ (PUT vs GET) so the two never actually compete.
router.put(
  '/reorder',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = reorderProjectsSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new HttpError(
          400,
          firstIssueMessage(parseResult.error, 'Invalid request body'),
        );
      }

      const { ids } = parseResult.data;

      const ordered = await db.transaction(async (tx) => {
        const existing = await tx.select({ id: projects.id }).from(projects);
        const existingIds = new Set(existing.map((row) => row.id));

        // The list must be exactly the current set of projects: no duplicates,
        // none missing, none unknown. Otherwise a stale admin tab could
        // silently scramble the order.
        const submittedIds = new Set(ids);
        const isExactSet =
          submittedIds.size === ids.length &&
          ids.length === existingIds.size &&
          ids.every((id) => existingIds.has(id));

        if (!isExactSet) {
          throw new HttpError(
            409,
            'The project list changed. Reload the page and try again.',
          );
        }

        for (const [index, id] of ids.entries()) {
          await tx
            .update(projects)
            .set({ priority: index })
            .where(eq(projects.id, id));
        }

        return tx
          .select()
          .from(projects)
          .orderBy(asc(projects.priority), desc(projects.createdAt));
      });

      res.status(200).json({ data: ordered });
    } catch (error) {
      next(error);
    }
  },
);

// Accepts either a UUID (used by the admin) or a slug (used by public URLs).
router.get(
  '/:identifier',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const identifier = req.params.identifier;

      if (!identifier) {
        throw new HttpError(400, 'Project identifier is required');
      }

      const result = await db
        .select()
        .from(projects)
        .where(
          isUuid(identifier)
            ? eq(projects.id, identifier)
            : eq(projects.slug, identifier),
        )
        .limit(1);

      const project = result[0];

      if (!project) {
        throw new HttpError(404, 'Project not found');
      }

      res.status(200).json({ data: project });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = createProjectSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new HttpError(
          400,
          firstIssueMessage(parseResult.error, 'Invalid request body'),
        );
      }

      const data = parseResult.data;

      const slug = data.slug ?? (await generateUniqueSlug(slugify(data.name)));

      // New projects go to the end of the list unless a priority is given.
      let priority = data.priority;
      if (priority === undefined) {
        const [row] = await db
          .select({ highest: max(projects.priority) })
          .from(projects);
        priority = (row?.highest ?? -1) + 1;
      }

      const [createdProject] = await db
        .insert(projects)
        .values({
          ...data,
          slug,
          priority,
          liveUrl: emptyToNull(data.liveUrl),
          githubUrl: emptyToNull(data.githubUrl),
          imageUrl: emptyToNull(data.imageUrl),
          startedAt: data.startedAt ?? null,
          shippedAt: data.shippedAt ?? null,
        })
        .returning();

      res.status(201).json({ data: createdProject });
    } catch (error) {
      next(isUniqueViolation(error) ? new HttpError(409, SLUG_TAKEN_MESSAGE) : error);
    }
  },
);

router.patch(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = readProjectId(req);

      const parseResult = updateProjectSchema.safeParse(req.body);

      if (!parseResult.success) {
        throw new HttpError(
          400,
          firstIssueMessage(parseResult.error, 'Invalid request body'),
        );
      }

      const updateData = parseResult.data;

      const [updatedProject] = await db
        .update(projects)
        .set({
          ...updateData,
          ...(updateData.liveUrl !== undefined
            ? { liveUrl: emptyToNull(updateData.liveUrl) }
            : {}),
          ...(updateData.githubUrl !== undefined
            ? { githubUrl: emptyToNull(updateData.githubUrl) }
            : {}),
          ...(updateData.imageUrl !== undefined
            ? { imageUrl: emptyToNull(updateData.imageUrl) }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();

      if (!updatedProject) {
        throw new HttpError(404, 'Project not found');
      }

      res.status(200).json({ data: updatedProject });
    } catch (error) {
      next(isUniqueViolation(error) ? new HttpError(409, SLUG_TAKEN_MESSAGE) : error);
    }
  },
);

router.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = readProjectId(req);

      const deleted = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning({ id: projects.id });

      if (deleted.length === 0) {
        throw new HttpError(404, 'Project not found');
      }

      res.status(200).json({ data: { success: true } });
    } catch (error) {
      next(error);
    }
  },
);

export default router;

