import { pgTable, uuid, varchar, text, integer, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const articleStatusEnum = pgEnum("article_status", ["draft", "published"]);

export const newsArticles = pgTable(
  "news_articles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    authorId: uuid("author_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    coverImage: varchar("cover_image", { length: 500 }),
    status: articleStatusEnum("status").default("draft").notNull(),
    readingTimeMinutes: integer("reading_time_minutes").default(3).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: index("news_slug_idx").on(table.slug),
    statusIdx: index("news_status_idx").on(table.status),
    publishedAtIdx: index("news_published_at_idx").on(table.publishedAt),
  })
);

export type NewsArticle = typeof newsArticles.$inferSelect;
export type NewNewsArticle = typeof newsArticles.$inferInsert;
export type ArticleStatus = (typeof articleStatusEnum.enumValues)[number];
