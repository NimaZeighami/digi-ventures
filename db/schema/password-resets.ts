import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const passwordResets = pgTable(
  "password_resets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("password_resets_user_id_idx").on(table.userId),
    expiresAtIdx: index("password_resets_expires_at_idx").on(table.expiresAt),
  })
);

export type PasswordReset = typeof passwordResets.$inferSelect;
export type NewPasswordReset = typeof passwordResets.$inferInsert;
