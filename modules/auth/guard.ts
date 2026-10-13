import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthService, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "./service";
import { UserRole } from "@/db/schema";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Extracts raw session token from request cookies or Authorization header
 */
export function getRawTokenFromRequest(req?: Request): string | null {
  // 1. Try Next.js cookies() helper if in Server Component / Action context
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) return token;
  } catch {
    // cookies() may throw if called outside Next.js request context
  }

  // 2. Try parsing Cookie header from Request object
  if (req) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]*)`));
      if (match && match[1]) return decodeURIComponent(match[1]);
    }

    // 3. Try Bearer token in Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
  }

  return null;
}

/**
 * Validates session token and returns current user, or null if unauthenticated
 */
export async function getSessionUser(req?: Request): Promise<SessionUser | null> {
  const token = getRawTokenFromRequest(req);
  if (!token) return null;

  const result = await AuthService.validateSession(token);
  return result ? result.user : null;
}

/**
 * Enforces authentication; throws UnauthorizedError if invalid
 */
export async function requireAuth(req?: Request): Promise<SessionUser> {
  const user = await getSessionUser(req);
  if (!user) {
    throw new UnauthorizedError("لطفاً ابتدا وارد حساب کاربری خود شوید.");
  }
  return user;
}

/**
 * Enforces RBAC permissions; throws ForbiddenError if user role not allowed
 */
export function requireRole(user: SessionUser, allowedRoles: UserRole[]): void {
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError("شما مجوز لازم برای انجام این عملیات را ندارید.");
  }
}

/**
 * Asserts resource ownership (owner or admin/super_admin)
 */
export function assertOwnership(
  resourceOwnerId: string,
  user: SessionUser
): void {
  const isOwner = user.id === resourceOwnerId;
  const isStaff = user.role === "admin" || user.role === "super_admin";
  if (!isOwner && !isStaff) {
    throw new ForbiddenError("شما اجازه دسترسی به این منبع را ندارید.");
  }
}

/**
 * Sets secure HttpOnly session cookie on NextResponse
 */
export function setSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clears session cookie on NextResponse
 */
export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
