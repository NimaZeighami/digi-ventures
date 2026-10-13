import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "@/modules/auth/service";
import { db } from "@/db";
import { users, sessions, rateLimits } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  UnauthorizedError,
  ConflictError,
  RateLimitError,
  ForbiddenError,
} from "@/lib/errors";

describe("Phase 2: Authentication & RBAC System", () => {
  const testEmail = "testfounder@example.com";
  const testPassword = "ValidPassword123!";

  beforeEach(async () => {
    // Clean up test user if exists
    await db.delete(users).where(eq(users.email, testEmail));
    await db.delete(rateLimits);
  });

  it("registers a new customer account with Argon2id hash", async () => {
    const newUser = await AuthService.register({
      email: testEmail,
      password: testPassword,
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.email).toBe(testEmail);
    expect(newUser.role).toBe("customer");

    const [dbUser] = await db.select().from(users).where(eq(users.id, newUser.id));
    expect(dbUser).toBeDefined();
    expect(dbUser.passwordHash).not.toBe(testPassword);
    expect(dbUser.passwordHash.startsWith("$argon2id$")).toBe(true);
  });

  it("prevents duplicate account registration", async () => {
    await AuthService.register({ email: testEmail, password: testPassword });

    await expect(
      AuthService.register({ email: testEmail, password: testPassword })
    ).rejects.toThrow(ConflictError);
  });

  it("authenticates valid credentials and issues secure session token", async () => {
    await AuthService.register({ email: testEmail, password: testPassword });

    const loginRes = await AuthService.login({
      email: testEmail,
      password: testPassword,
      ipAddress: "127.0.0.1",
    });

    expect(loginRes.user.email).toBe(testEmail);
    expect(loginRes.token).toBeDefined();
    expect(loginRes.token.length).toBe(64); // 32 bytes hex

    const sessionRes = await AuthService.validateSession(loginRes.token);
    expect(sessionRes).not.toBeNull();
    expect(sessionRes?.user.id).toBe(loginRes.user.id);
  });

  it("returns generic error on wrong password without user enumeration", async () => {
    await AuthService.register({ email: testEmail, password: testPassword });

    // Wrong password for existing user
    await expect(
      AuthService.login({
        email: testEmail,
        password: "WrongPassword!",
        ipAddress: "192.168.1.10",
      })
    ).rejects.toThrow(UnauthorizedError);

    // Non-existent user returns the exact same generic error
    await expect(
      AuthService.login({
        email: "nonexistent@startup.ir",
        password: "SomePassword123!",
        ipAddress: "192.168.1.10",
      })
    ).rejects.toThrow(UnauthorizedError);
  });

  it("enforces persistent rate limiting after 5 consecutive failed logins", async () => {
    const testIp = "10.0.0.99";

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      try {
        await AuthService.login({
          email: "nobody@example.com",
          password: "bad",
          ipAddress: testIp,
        });
      } catch (e) {
        // expected UnauthorizedError
      }
    }

    // 6th attempt MUST trigger RateLimitError
    await expect(
      AuthService.login({
        email: "nobody@example.com",
        password: "bad",
        ipAddress: testIp,
      })
    ).rejects.toThrow(RateLimitError);
  });

  it("invalidates session on logout", async () => {
    await AuthService.register({ email: testEmail, password: testPassword });
    const { token } = await AuthService.login({
      email: testEmail,
      password: testPassword,
    });

    // Verify session is active
    let validated = await AuthService.validateSession(token);
    expect(validated).not.toBeNull();

    // Logout
    await AuthService.logout(token);

    // Verify session revoked
    validated = await AuthService.validateSession(token);
    expect(validated).toBeNull();
  });

  it("handles forgot password and token-based reset", async () => {
    const user = await AuthService.register({ email: testEmail, password: testPassword });

    const resetReq = await AuthService.requestPasswordReset(testEmail);
    expect(resetReq.rawToken).toBeDefined();

    const newPassword = "BrandNewPassword123!";
    await AuthService.resetPassword(resetReq.rawToken!, newPassword);

    // Old password should now fail
    await expect(
      AuthService.login({ email: testEmail, password: testPassword })
    ).rejects.toThrow(UnauthorizedError);

    // New password should succeed
    const loginRes = await AuthService.login({
      email: testEmail,
      password: newPassword,
    });
    expect(loginRes.user.id).toBe(user.id);
  });

  it("enforces RBAC role promotion rules", async () => {
    const customer = await AuthService.register({ email: testEmail, password: testPassword });

    const [superAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.role, "super_admin"));
    expect(superAdmin).toBeDefined();

    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"));
    expect(admin).toBeDefined();

    // 1. Admin CANNOT change roles
    await expect(
      AuthService.changeUserRole({
        actorId: admin.id,
        actorRole: "admin",
        targetUserId: customer.id,
        newRole: "admin",
      })
    ).rejects.toThrow(ForbiddenError);

    // 2. Super Admin CAN change customer to admin
    const updated = await AuthService.changeUserRole({
      actorId: superAdmin.id,
      actorRole: "super_admin",
      targetUserId: customer.id,
      newRole: "admin",
    });
    expect(updated.role).toBe("admin");

    // 3. Super Admin cannot change their own role
    await expect(
      AuthService.changeUserRole({
        actorId: superAdmin.id,
        actorRole: "super_admin",
        targetUserId: superAdmin.id,
        newRole: "customer",
      })
    ).rejects.toThrow(ForbiddenError);
  });
});
