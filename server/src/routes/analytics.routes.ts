import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { trackPageView, getAnalyticsStats } from '../lib/analytics.js';
import { firstIssueMessage } from '../lib/http-error.js';
import { trackSchema } from '../lib/validations.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// The endpoint is public and writes to the database, so cap it per IP.
// A real visitor sends one ping per visit; 30/minute is very generous.
const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: { message: 'Too many requests' } },
});

/** Keeps only "https://example.com" from a referrer; drops anything that is not http(s). */
function toOrigin(referrer: string | undefined): string | undefined {
  if (!referrer) return undefined;
  try {
    const url = new URL(referrer);
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.origin
      : undefined;
  } catch {
    return undefined;
  }
}

router.post(
  '/track',
  trackLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = trackSchema.safeParse(req.body ?? {});

      if (!parseResult.success) {
        res.status(400).json({
          error: {
            message: firstIssueMessage(parseResult.error, 'Invalid request body'),
          },
        });
        return;
      }

      const { referrer, projectClicked } = parseResult.data;

      // `req.ip` honours the "trust proxy" setting (see index.ts). Reading the
      // X-Forwarded-For header by hand, as before, let anyone fake their IP.
      const result = await trackPageView({
        ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'],
        referrer: toOrigin(referrer),
        projectClicked,
      });

      res.status(200).json({ data: { tracked: result.tracked } });
    } catch (error) {
      next(error);
    }
  },
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
  },
);

export default router;

