import crypto from "crypto";
import argon2 from "argon2";
import { eq, and, gt } from "drizzle-orm";
import { db } from "@/db";
import { users, sessions, passwordResets, User, Session, UserRole } from "@/db/schema";
import {
  UnauthorizedError,
  ConflictError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  RateLimitError,
} from "@/lib/errors";
import { DbRateLimiter } from "./rate-limiter";

export const SESSION_COOKIE_NAME = "dv_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export class AuthService {
  /**
   * Hashes a password with Argon2id using recommended parameters
   */
  static async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * Verifies a plain password against an Argon2id hash
   */
  static async verifyPassword(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch {
      return false;
    }
  }

  /**
   * Registers a new customer account
   */
  static async register(data: {
    email: string;
    password: string;
  }): Promise<{ id: string; email: string; role: UserRole }> {
    const normalizedEmail = data.email.toLowerCase().trim();

    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (existing) {
      throw new ConflictError("این ایمیل قبلاً در سامانه ثبت شده است.");
    }

    const passwordHash = await this.hashPassword(data.password);

    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        passwordHash,
        role: "customer",
      })
      .returning();

    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
  }

  /**
   * Authenticates user credentials with rate-limiting and generic errors
   */
  static async login(params: {
    email: string;
    password: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ user: { id: string; email: string; role: UserRole }; token: string }> {
    const ip = params.ipAddress || "unknown";
    const rateLimitKey = `login:${ip}`;

    // 1. Enforce rate limit: max 5 failed attempts per 15 minutes (900 seconds)
    const rateCheck = await DbRateLimiter.consume(rateLimitKey, 5, 900);
    if (!rateCheck.allowed) {
      throw new RateLimitError(
        `تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً ${Math.ceil(
          rateCheck.retryAfterSeconds / 60
        )} دقیقه دیگر تلاش کنید.`
      );
    }

    const normalizedEmail = params.email.toLowerCase().trim();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      throw new UnauthorizedError("اطلاعات ورود نادرست است یا حساب کاربری یافت نشد.");
    }

    const isValid = await this.verifyPassword(user.passwordHash, params.password);
    if (!isValid) {
      throw new UnauthorizedError("اطلاعات ورود نادرست است یا حساب کاربری یافت نشد.");
    }

    // Success! Reset rate limit for this IP
    await DbRateLimiter.reset(rateLimitKey);

    // Generate secure 32-byte opaque session token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

    await db.insert(sessions).values({
      userId: user.id,
      tokenHash,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      expiresAt,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: rawToken,
    };
  }

  /**
   * Validates a session token and returns the authenticated user
   */
  static async validateSession(
    rawToken: string
  ): Promise<{ user: { id: string; email: string; role: UserRole }; session: Session } | null> {
    if (!rawToken) return null;

    const tokenHash = hashToken(rawToken);
    const now = new Date();

    const [result] = await db
      .select({
        session: sessions,
        user: {
          id: users.id,
          email: users.email,
          role: users.role,
        },
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, now)));

    if (!result) return null;

    return {
      session: result.session,
      user: result.user,
    };
  }

  /**
   * Revokes a session token
   */
  static async logout(rawToken: string): Promise<void> {
    if (!rawToken) return;
    const tokenHash = hashToken(rawToken);
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
  }

  /**
   * Generates a password reset token (generic success response)
   */
  static async requestPasswordReset(
    email: string
  ): Promise<{ rawToken?: string; userEmail?: string }> {
    const normalizedEmail = email.toLowerCase().trim();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail));

    if (!user) {
      // Return without leaking user existence
      return {};
    }

    // Invalidate existing reset tokens for this user
    await db.delete(passwordResets).where(eq(passwordResets.userId, user.id));

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    await db.insert(passwordResets).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    });

    return { rawToken, userEmail: user.email };
  }

  /**
   * Resets password using valid token and invalidates previous sessions
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = hashToken(token);
    const now = new Date();

    const [resetRecord] = await db
      .select()
      .from(passwordResets)
      .where(and(eq(passwordResets.tokenHash, tokenHash), gt(passwordResets.expiresAt, now)));

    if (!resetRecord) {
      throw new ValidationError("لینک بازیابی رمز عبور منقضی شده یا نامعتبر است.");
    }

    const newPasswordHash = await this.hashPassword(newPassword);

    await db.transaction(async (tx) => {
      // 1. Update password
      await tx
        .update(users)
        .set({
          passwordHash: newPasswordHash,
          updatedAt: new Date(),
        })
        .where(eq(users.id, resetRecord.userId));

      // 2. Delete used reset token
      await tx
        .delete(passwordResets)
        .where(eq(passwordResets.id, resetRecord.id));

      // 3. Revoke all active sessions for security
      await tx
        .delete(sessions)
        .where(eq(sessions.userId, resetRecord.userId));
    });
  }

  /**
   * Super Admin only: Changes a user's role between customer and admin
   */
  static async changeUserRole(params: {
    actorId: string;
    actorRole: UserRole;
    targetUserId: string;
    newRole: "customer" | "admin";
  }): Promise<User> {
    if (params.actorRole !== "super_admin") {
      throw new ForbiddenError("تنها مدیر ارشد سامانه (super_admin) مجاز به تغییر نقش‌ها است.");
    }

    if (params.actorId === params.targetUserId) {
      throw new ForbiddenError("امکان تغییر نقش حساب کاربری خود وجود ندارد.");
    }

    const [targetUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, params.targetUserId));

    if (!targetUser) {
      throw new NotFoundError("کاربر مورد نظر یافت نشد.");
    }

    if (targetUser.role === "super_admin") {
      throw new ForbiddenError("امکان تغییر نقش مدیر ارشد سامانه وجود ندارد.");
    }

    const [updated] = await db
      .update(users)
      .set({
        role: params.newRole,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.targetUserId))
      .returning();

    return updated;
  }
}
