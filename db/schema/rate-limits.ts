import { pgTable, uuid, varchar, integer, timestamp, index } from "drizzle-orm/pg-core";

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(), // e.g. "login:192.168.1.1" or "contact:192.168.1.1"
    points: integer("points").default(1).notNull(),
    expireAt: timestamp("expire_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    keyIdx: index("rate_limits_key_idx").on(table.key),
    expireAtIdx: index("rate_limits_expire_at_idx").on(table.expireAt),
  })
);

export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;
