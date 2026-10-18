import { Router, Request, Response, NextFunction } from 'express';
import { trackPageView, getAnalyticsStats } from '../lib/analytics.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post(
  '/track',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const forwarded = req.headers['x-forwarded-for'];
      const rawIp =
        typeof forwarded === 'string'
          ? forwarded.split(',')[0]?.trim()
          : req.socket.remoteAddress;

      const ip = rawIp || '127.0.0.1';
      const userAgent = req.headers['user-agent'];

      const body = req.body as { referrer?: string; projectClicked?: string };

      await trackPageView({
        ip,
        userAgent,
        referrer: body.referrer,
        projectClicked: body.projectClicked,
      });

      res.status(200).json({ data: { tracked: true } });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/stats',
  requireAuth,
  async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await getAnalyticsStats();
      res.status(200).json({ data: stats });
    } catch (error) {
      next(error);
    }
  }
);

export default router;