import { describe, it, expect } from "vitest";
import { normalizeDigits, formatFileSize } from "@/lib/utils";
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InvalidTransitionError,
  RateLimitError,
  FileUploadError,
} from "@/lib/errors";
import { db } from "@/db";
import { users, emailTemplates } from "@/db/schema";
import { sql } from "drizzle-orm";

describe("Phase 1: Foundation & Utilities", () => {
  it("normalizes Persian and Arabic numerals to ASCII digits", () => {
    expect(normalizeDigits("۰۹۱۲۳۴۵۶۷۸۹")).toBe("09123456789");
    expect(normalizeDigits("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
    expect(normalizeDigits("09123456789")).toBe("09123456789");
  });

  it("formats file sizes correctly into Persian strings", () => {
    expect(formatFileSize(500)).toBe("500 بایت");
    expect(formatFileSize(1024 * 50)).toBe("50.0 کیلوبایت");
    expect(formatFileSize(1024 * 1024 * 15)).toBe("15.0 مگابایت");
  });

  it("instantiates AppError subclasses with correct HTTP codes and names", () => {
    expect(new ValidationError("invalid").statusCode).toBe(422);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
    expect(new InvalidTransitionError().statusCode).toBe(409);
    expect(new RateLimitError().statusCode).toBe(429);
    expect(new FileUploadError().statusCode).toBe(415);
  });

  it("connects to PostgreSQL database and queries seed data", async () => {
    const result = await db.execute(sql`SELECT 1 as connected`);
    expect(result).toBeDefined();

    const allUsers = await db.select().from(users);
    expect(allUsers.length).toBeGreaterThanOrEqual(3);

    const templates = await db.select().from(emailTemplates);
    expect(templates.length).toBeGreaterThanOrEqual(2);
  });
});
