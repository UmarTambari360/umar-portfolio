import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { loginSchema } from "../lib/validations.js";
import { signJWT, setAuthCookie, clearAuthCookie } from "../lib/auth.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parseResult = loginSchema.safeParse(req.body);

      if (!parseResult.success) {
        const issue = parseResult.error.errors[0];
        res.status(400).json({
          error: {
            message: issue?.message || "Invalid request parameters",
          },
        });
        return;
      }

      const { username, password } = parseResult.data;

      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

      if (!adminUsername || !adminPasswordHash) {
        res.status(500).json({
          error: {
            message: "Server authentication configuration is missing",
          },
        });
        return;
      }

      if (username !== adminUsername) {
        res.status(401).json({ error: { message: "Invalid credentials" } });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

      if (!isPasswordValid) {
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
