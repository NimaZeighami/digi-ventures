import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

export const emailOutboxStatusEnum = pgEnum("email_outbox_status", [
  "pending",
  "sent",
  "failed",
]);

export const emailOutbox = pgTable(
  "email_outbox",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    toEmail: varchar("to_email", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    htmlBody: text("html_body").notNull(),
    textBody: text("text_body"),
    status: emailOutboxStatusEnum("status").default("pending").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    lastError: text("last_error"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    statusIdx: index("email_outbox_status_idx").on(table.status),
    createdAtIdx: index("email_outbox_created_at_idx").on(table.createdAt),
  })
);

export type EmailOutboxItem = typeof emailOutbox.$inferSelect;
export type NewEmailOutboxItem = typeof emailOutbox.$inferInsert;
