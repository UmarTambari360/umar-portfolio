import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { Response } from "express";

export interface AuthPayload extends JWTPayload {
  sub: string;
  role: string;
}

const COOKIE_NAME = "portfolio_token";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined.");
  }
  return new TextEncoder().encode(secret);
}

export async function signJWT(username: string): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({ role: "admin" })
    .setSubject(username)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJWT(token: string): Promise<AuthPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);

    if (typeof payload.sub !== "string" || typeof payload.role !== "string") {
      return null;
    }

    return {
      ...payload,
      sub: payload.sub,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
  });
}
