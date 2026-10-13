import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "@/db";
import { newsArticles, users, NewsArticle, ArticleStatus } from "@/db/schema";
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors";

export interface CreateArticleDto {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  status: ArticleStatus;
}

export class NewsService {
  /**
   * Generates a clean URL slug from title
   */
  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\u0600-\u06FFa-z0-9\s-_]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 100);
  }

  /**
   * Calculates reading time in minutes based on ~200 Persian/English words per minute
   */
  static calculateReadingTime(content: string): number {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  /**
   * Creates a new news/blog article
   */
  static async createArticle(
    authorId: string,
    data: CreateArticleDto
  ): Promise<NewsArticle> {
    const slug = data.slug.toLowerCase().trim();

    const [existing] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.slug, slug));

    if (existing) {
      throw new ConflictError("شناسه آدرس (slug) تکراری است. لطفاً شناسه یکتای دیگری انتخاب کنید.");
    }

    const readingTime = this.calculateReadingTime(data.content);
    const publishedAt = data.status === "published" ? new Date() : null;

    const [created] = await db
      .insert(newsArticles)
      .values({
        authorId,
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.cover_image,
        status: data.status,
        readingTimeMinutes: readingTime,
        publishedAt,
      })
      .returning();

    return created;
  }

  /**
   * Updates an existing article
   */
  static async updateArticle(
    articleId: string,
    data: Partial<CreateArticleDto>
  ): Promise<NewsArticle> {
    const [current] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.id, articleId));

    if (!current) {
      throw new NotFoundError("مقاله مورد نظر یافت نشد.");
    }

    // Check slug uniqueness if slug changed
    if (data.slug && data.slug.toLowerCase().trim() !== current.slug) {
      const newSlug = data.slug.toLowerCase().trim();
      const [existing] = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.slug, newSlug));

      if (existing) {
        throw new ConflictError("این شناسه آدرس قبلاً برای مقاله دیگری استفاده شده است.");
      }
    }

    const readingTime = data.content
      ? this.calculateReadingTime(data.content)
      : current.readingTimeMinutes;

    let publishedAt = current.publishedAt;
    if (data.status === "published" && !current.publishedAt) {
      publishedAt = new Date();
    }

    const [updated] = await db
      .update(newsArticles)
      .set({
        title: data.title ?? current.title,
        slug: data.slug ? data.slug.toLowerCase().trim() : current.slug,
        excerpt: data.excerpt ?? current.excerpt,
        content: data.content ?? current.content,
        coverImage: data.cover_image ?? current.coverImage,
        status: data.status ?? current.status,
        readingTimeMinutes: readingTime,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(newsArticles.id, articleId))
      .returning();

    return updated;
  }

  /**
   * Deletes an article
   */
  static async deleteArticle(articleId: string): Promise<void> {
    const [deleted] = await db
      .delete(newsArticles)
      .where(eq(newsArticles.id, articleId))
      .returning();

    if (!deleted) {
      throw new NotFoundError("مقاله مورد نظر یافت نشد.");
    }
  }

  /**
   * Retrieves single published article by slug (optionally includes drafts for staff preview)
   */
  static async getArticleBySlug(
    slug: string,
    includeDrafts: boolean = false
  ): Promise<{ article: NewsArticle; authorEmail: string } | null> {
    const normalizedSlug = slug.toLowerCase().trim();

    const [result] = await db
      .select({
        article: newsArticles,
        authorEmail: users.email,
      })
      .from(newsArticles)
      .innerJoin(users, eq(newsArticles.authorId, users.id))
      .where(eq(newsArticles.slug, normalizedSlug));

    if (!result) return null;

    if (!includeDrafts && result.article.status !== "published") {
      return null;
    }

    return result;
  }

  /**
   * Retrieves all published articles for the public hub
   */
  static async getPublishedArticles(search?: string): Promise<NewsArticle[]> {
    let query = db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.status, "published"))
      .orderBy(desc(newsArticles.publishedAt));

    const articles = await query;
    if (!search) return articles;

    const q = search.toLowerCase();
    return articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    );
  }

  /**
   * Retrieves all articles for the admin CMS directory
   */
  static async getAllArticlesAdmin(): Promise<
    (NewsArticle & { authorEmail: string })[]
  > {
    const results = await db
      .select({
        article: newsArticles,
        authorEmail: users.email,
      })
      .from(newsArticles)
      .innerJoin(users, eq(newsArticles.authorId, users.id))
      .orderBy(desc(newsArticles.createdAt));

    return results.map((r) => ({
      ...r.article,
      authorEmail: r.authorEmail,
    }));
  }
}
