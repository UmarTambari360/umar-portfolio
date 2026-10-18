import { Request, Response, NextFunction } from "express";
import { verifyJWT, AuthPayload } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.portfolio_token as string | undefined;

  if (!token) {
    res.status(401).json({ error: { message: "Unauthorized" } });
    return;
  }

  const payload = await verifyJWT(token);

  if (!payload) {
    res.status(401).json({ error: { message: "Unauthorized" } });
    return;
  }

  req.user = payload;
  next();
}
