import type { ZodError } from 'zod';

/**
 * An error that carries an HTTP status. Throw it anywhere inside a route's
 * try/catch (or a transaction) and the central error handler turns it into
 * `{ error: { message } }` with the right status code.
 */
export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

/** First zod issue as a human-readable message (the API returns one at a time). */
export function firstIssueMessage(error: ZodError, fallback: string): string {
  return error.issues[0]?.message || fallback;
}

function hasCode(value: unknown): value is { code: unknown } {
  return typeof value === 'object' && value !== null && 'code' in value;
}

/**
 * True when Postgres rejected a write because of a UNIQUE constraint (code 23505).
 * Newer Drizzle versions wrap driver errors in `error.cause`, so check both.
 */
export function isUniqueViolation(error: unknown): boolean {
  if (hasCode(error) && error.code === '23505') return true;
  if (error instanceof Error && hasCode(error.cause)) {
    return error.cause.code === '23505';
  }
  return false;
}

