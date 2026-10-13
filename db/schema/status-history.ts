import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { investmentRequests, requestStatusEnum } from "./requests";

export const requestStatusHistory = pgTable(
  "request_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .references(() => investmentRequests.id, { onDelete: "cascade" })
      .notNull(),
    actorId: uuid("actor_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    fromStatus: requestStatusEnum("from_status").notNull(),
    toStatus: requestStatusEnum("to_status").notNull(),
    adminMessage: text("admin_message"),
    internalNote: text("internal_note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    requestIdIdx: index("status_history_request_id_idx").on(table.requestId),
    createdAtIdx: index("status_history_created_at_idx").on(table.createdAt),
  })
);

export type RequestStatusHistory = typeof requestStatusHistory.$inferSelect;
export type NewRequestStatusHistory = typeof requestStatusHistory.$inferInsert;
