import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error] ${statusCode} - ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({
    error: {
      message,
    },
  });
};
