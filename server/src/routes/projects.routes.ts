import { Router, Request, Response, NextFunction } from 'express';
import { eq, and, asc, desc, SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { projects } from '../db/schema/projects.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from '../lib/validations.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

const getProjectId = (
  value: string | string[] | undefined
): string | undefined => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { featured, status } = req.query;
      const conditions: SQL[] = [];

      if (typeof featured === 'string') {
        if (featured === 'true') {
          conditions.push(eq(projects.featured, true));
        } else if (featured === 'false') {
          conditions.push(eq(projects.featured, false));
        }
      }

      if (
        typeof status === 'string' &&
        ['in_progress', 'shipped', 'paused', 'concept'].includes(status)
      ) {
        conditions.push(
          eq(
            projects.status,
            status as 'in_progress' | 'shipped' | 'paused' | 'concept'
          )
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const projectList = await db
        .select()
        .from(projects)
        .where(whereClause)
        .orderBy(asc(projects.priority), desc(projects.createdAt));

      res.status(200).json({ data: projectList });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getProjectId(req.params.id);

      if (!id) {
        res.status(400).json({ error: { message: 'Project ID is required' } });
        return;
      }

      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      const project = result[0];

      if (!project) {
        res.status(404).json({ error: { message: 'Project not found' } });
        return;
      }

      res.status(200).json({ data: project });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = createProjectSchema.safeParse(req.body);

      if (!parseResult.success) {
        const issue = parseResult.error.errors[0];
        res.status(400).json({
          error: {
            message: issue?.message || 'Invalid request body',
          },
        });
        return;
      }

      const data = parseResult.data;

      const [createdProject] = await db
        .insert(projects)
        .values({
          ...data,
          liveUrl: data.liveUrl || null,
          githubUrl: data.githubUrl || null,
          imageUrl: data.imageUrl || null,
          startedAt: data.startedAt ?? null,
          shippedAt: data.shippedAt ?? null,
        })
        .returning();

      res.status(201).json({ data: createdProject });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getProjectId(req.params.id);

      if (!id) {
        res.status(400).json({ error: { message: 'Project ID is required' } });
        return;
      }

      const parseResult = updateProjectSchema.safeParse(req.body);

      if (!parseResult.success) {
        const issue = parseResult.error.errors[0];
        res.status(400).json({
          error: {
            message: issue?.message || 'Invalid request body',
          },
        });
        return;
      }

      const existing = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      if (!existing[0]) {
        res.status(404).json({ error: { message: 'Project not found' } });
        return;
      }

      const updateData = parseResult.data;

      const [updatedProject] = await db
        .update(projects)
        .set({
          ...updateData,
          ...(updateData.liveUrl !== undefined
            ? { liveUrl: updateData.liveUrl || null }
            : {}),
          ...(updateData.githubUrl !== undefined
            ? { githubUrl: updateData.githubUrl || null }
            : {}),
          ...(updateData.imageUrl !== undefined
            ? { imageUrl: updateData.imageUrl || null }
            : {}),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();

      res.status(200).json({ data: updatedProject });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = getProjectId(req.params.id);

      if (!id) {
        res.status(400).json({ error: { message: 'Project ID is required' } });
        return;
      }

      const existing = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);

      if (!existing[0]) {
        res.status(404).json({ error: { message: 'Project not found' } });
        return;
      }

      await db.delete(projects).where(eq(projects.id, id));

      res.status(200).json({ data: { success: true } });
    } catch (error) {
      next(error);
    }
  }
);

export default router;