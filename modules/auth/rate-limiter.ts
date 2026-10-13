import { db } from "@/db";
import { rateLimits } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export class DbRateLimiter {
  /**
   * Consumes a point for the given key.
   * If points exceed maxPoints within windowSeconds, allowed is false.
   */
  static async consume(
    key: string,
    maxPoints: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const now = new Date();
    const expireAt = new Date(now.getTime() + windowSeconds * 1000);

    const [existing] = await db
      .select()
      .from(rateLimits)
      .where(eq(rateLimits.key, key));

    let record = existing;

    if (!record) {
      try {
        await db.insert(rateLimits).values({
          key,
          points: 1,
          expireAt,
        });
        return {
          allowed: true,
          remaining: maxPoints - 1,
          retryAfterSeconds: 0,
        };
      } catch {
        // Concurrent race condition: another request inserted this key simultaneously
        const [reFetched] = await db
          .select()
          .from(rateLimits)
          .where(eq(rateLimits.key, key));
        if (reFetched) {
          record = reFetched;
        } else {
          return {
            allowed: true,
            remaining: maxPoints - 1,
            retryAfterSeconds: 0,
          };
        }
      }
    }

    // If window expired, reset
    if (now > record.expireAt) {
      await db
        .update(rateLimits)
        .set({
          points: 1,
          expireAt,
        })
        .where(eq(rateLimits.key, key));

      return {
        allowed: true,
        remaining: maxPoints - 1,
        retryAfterSeconds: 0,
      };
    }

    // Window still active
    if (record.points >= maxPoints) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((record.expireAt.getTime() - now.getTime()) / 1000)
      );
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    // Increment points
    const nextPoints = record.points + 1;
    await db
      .update(rateLimits)
      .set({ points: nextPoints })
      .where(eq(rateLimits.key, key));

    return {
      allowed: true,
      remaining: Math.max(0, maxPoints - nextPoints),
      retryAfterSeconds: 0,
    };
  }

  /**
   * Reset rate limit for a key (e.g. after successful login)
   */
  static async reset(key: string): Promise<void> {
    await db.delete(rateLimits).where(eq(rateLimits.key, key));
  }
}
