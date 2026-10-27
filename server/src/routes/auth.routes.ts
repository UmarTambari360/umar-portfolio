import { createHash, timingSafeEqual } from "crypto";
import { Router, Request, Response, NextFunction } from "express";
import { rateLimit } from "express-rate-limit";
import bcrypt from "bcryptjs";
import { env } from "../lib/env.js";
import { firstIssueMessage } from "../lib/http-error.js";
import { loginSchema } from "../lib/validations.js";
import { signJWT, setAuthCookie, clearAuthCookie } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Brute-force protection: 10 failed logins per 15 minutes per IP.
// Successful logins are not counted, so the real admin is never locked out
// by their own good behaviour.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: { message: "Too many login attempts. Try again in 15 minutes." },
  },
});

/** Constant-time string comparison (hashing first makes both inputs equal length). */
function safeEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a).digest();
  const digestB = createHash("sha256").update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

router.post(
  "/login",
  loginLimiter,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = loginSchema.safeParse(req.body);

      if (!parseResult.success) {
        res.status(400).json({
          error: {
            message: firstIssueMessage(
              parseResult.error,
              "Invalid request parameters",
            ),
          },
        });
        return;
      }

      const { username, password } = parseResult.data;

      // Always run bcrypt, even for a wrong username. Returning early made wrong
      // usernames answer measurably faster, which tells an attacker which
      // usernames exist.
      const passwordValid = await bcrypt.compare(
        password,
        env.ADMIN_PASSWORD_HASH,
      );
      const usernameValid = safeEqual(username, env.ADMIN_USERNAME);

      if (!usernameValid || !passwordValid) {
        res.status(401).json({ error: { message: "Invalid credentials" } });
        return;
      }

      const token = await signJWT(username);
      setAuthCookie(res, token);

      res.status(200).json({ data: { ok: true } });
    } catch (error) {
      next(error);
    }
  },
);

router.post("/logout", (_req: Request, res: Response): void => {
  clearAuthCookie(res);
  res.status(200).json({ data: { ok: true } });
});

router.get("/me", requireAuth, (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: { message: "Unauthorized" } });
    return;
  }

  res.status(200).json({ data: { username: req.user.sub } });
});

export default router;

