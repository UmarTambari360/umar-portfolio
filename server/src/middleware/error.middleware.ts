import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { env } from "../lib/env.js";

export interface CustomError extends Error {
  statusCode?: number;
  status?: number;
}

/** Handles requests to /api/* that matched no route. */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: "Not found" } });
}

export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // body-parser (malformed JSON, payload too large) sets `status`; HttpError sets `statusCode`.
  const statusCode = err.statusCode ?? err.status ?? 500;
  const isServerError = statusCode >= 500;

  // Always log server errors, including in production: without this, a crashing
  // route leaves no trace in `docker compose logs`.
  if (isServerError) {
    console.error(`[Error] ${statusCode} - ${err.message}`);
    if (err.stack) console.error(err.stack);
  }

  // Never leak internals (SQL errors, stack details) to the client in production.
  const message =
    isServerError && env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({ error: { message } });
};

