import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const requestStatusEnum = pgEnum("request_status", [
  "draft",
  "submitted",
  "under_review",
  "needs_revision",
  "accepted",
  "rejected",
]);

export const requestSectorEnum = pgEnum("request_sector", [
  "ecommerce",
  "fintech",
  "platform",
  "supply_chain",
  "ai",
  "other",
]);

export const requestStageEnum = pgEnum("request_stage", [
  "seed",
  "early",
  "growth",
  "scale",
]);

export const investmentRequests = pgTable(
  "investment_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    startupName: varchar("startup_name", { length: 100 }).notNull(),
    founderName: varchar("founder_name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    sector: requestSectorEnum("sector").notNull(),
    stage: requestStageEnum("stage").notNull(),
    description: text("description").notNull(),
    filePath: varchar("file_path", { length: 500 }),
    originalFileName: varchar("original_file_name", { length: 255 }),
    fileSize: integer("file_size"),
    mimeType: varchar("mime_type", { length: 100 }),
    status: requestStatusEnum("status").default("draft").notNull(),
    adminMessage: text("admin_message"),
    internalNote: text("internal_note"),
    idempotencyKey: varchar("idempotency_key", { length: 64 }).notNull().unique(),
    version: integer("version").default(1).notNull(), // Optimistic locking
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("requests_user_id_idx").on(table.userId),
    statusIdx: index("requests_status_idx").on(table.status),
    createdAtIdx: index("requests_created_at_idx").on(table.createdAt),
  })
);

export type InvestmentRequest = typeof investmentRequests.$inferSelect;
export type NewInvestmentRequest = typeof investmentRequests.$inferInsert;
export type RequestStatus = (typeof requestStatusEnum.enumValues)[number];
export type RequestSector = (typeof requestSectorEnum.enumValues)[number];
export type RequestStage = (typeof requestStageEnum.enumValues)[number];
