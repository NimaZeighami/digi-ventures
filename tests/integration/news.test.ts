import { describe, it, expect, beforeAll } from "vitest";
import { NewsService } from "@/modules/news/service";
import { AuthService } from "@/modules/auth/service";
import { ConflictError, NotFoundError } from "@/lib/errors";

describe("Phase 6: News CMS System", () => {
  let adminUserId: string;
  const testRunId = Date.now().toString(36);

  beforeAll(async () => {
    // Register or fetch a user for authorId
    const email = `news-author-${testRunId}@digiventures.ir`;
    const user = await AuthService.register({
      email,
      password: "StrongPass#123",
    });
    adminUserId = user.id;
  });

  it("calculates reading time correctly based on word count", () => {
    const shortContent = "این یک متن کوتاه تستی است برای بررسی سرعت خواندن.";
    expect(NewsService.calculateReadingTime(shortContent)).toBe(1);

    // 450 words should be ~3 minutes
    const longContent = Array(450).fill("کلمه").join(" ");
    expect(NewsService.calculateReadingTime(longContent)).toBe(3);
  });

  it("generates clean URL slugs from Persian titles", () => {
    const title = "سرمایه‌گذاری جدید دیجی‌ونچرز در حوزه هوش مصنوعی ۲۰۲۶!";
    const slug = NewsService.generateSlug(title);
    expect(slug).toBeDefined();
    expect(slug.length).toBeGreaterThan(0);
    expect(slug).not.toContain("!");
  });

  it("creates a draft article and computes reading time automatically", async () => {
    const slug = `ai-investments-${testRunId}`;
    const article = await NewsService.createArticle(adminUserId, {
      title: "گزارش سرمایه‌گذاری در هوش مصنوعی",
      slug,
      excerpt: "چکیده‌ای از وضعیت سرمایه‌گذاری خطرپذیر در فناوری هوش مصنوعی",
      content: Array(300).fill("متن گزارش جامع فناوری و هوش مصنوعی در ایران.").join(" "),
      status: "draft",
    });

    expect(article).toBeDefined();
    expect(article.id).toBeDefined();
    expect(article.status).toBe("draft");
    expect(article.publishedAt).toBeNull();
    expect(article.readingTimeMinutes).toBeGreaterThanOrEqual(2);
  });

  it("prevents duplicate slug creation with ConflictError", async () => {
    const slug = `duplicate-slug-${testRunId}`;
    await NewsService.createArticle(adminUserId, {
      title: "عنوان اول",
      slug,
      excerpt: "چکیده اول",
      content: "متن کامل مقاله اول",
      status: "draft",
    });

    await expect(
      NewsService.createArticle(adminUserId, {
        title: "عنوان دوم با همان اسلاگ",
        slug,
        excerpt: "چکیده دوم",
        content: "متن کامل مقاله دوم",
        status: "draft",
      })
    ).rejects.toThrow(ConflictError);
  });

  it("hides draft articles from public query but allows staff preview", async () => {
    const slug = `secret-draft-${testRunId}`;
    await NewsService.createArticle(adminUserId, {
      title: "پیش‌نویس محرمانه برای انتشار آتی",
      slug,
      excerpt: "این گزارش هنوز نباید در دسترس عموم باشد",
      content: "محتوای پیش‌نویس",
      status: "draft",
    });

    // Public query (includeDrafts = false) should return null
    const publicResult = await NewsService.getArticleBySlug(slug, false);
    expect(publicResult).toBeNull();

    // Staff preview (includeDrafts = true) should return article
    const staffResult = await NewsService.getArticleBySlug(slug, true);
    expect(staffResult).not.toBeNull();
    expect(staffResult?.article.slug).toBe(slug);
    expect(staffResult?.article.status).toBe("draft");
  });

  it("publishes an article, sets publishedAt, and makes it publicly accessible and searchable", async () => {
    const slug = `public-announcement-${testRunId}`;
    const article = await NewsService.createArticle(adminUserId, {
      title: `رونمایی از صندوق جدید سرمایه‌گذاری ${testRunId}`,
      slug,
      excerpt: "دیجی‌ونچرز از صندوق مرحله کشت ایده رونمایی کرد",
      content: "جزئیات کامل صندوق جدید و معیارهای پذیرش استارتاپ‌ها در مرحله بذری.",
      status: "draft",
    });

    // Update to published
    const updated = await NewsService.updateArticle(article.id, {
      status: "published",
    });

    expect(updated.status).toBe("published");
    expect(updated.publishedAt).not.toBeNull();

    // Now publicly visible
    const publicArticle = await NewsService.getArticleBySlug(slug, false);
    expect(publicArticle).not.toBeNull();
    expect(publicArticle?.article.title).toBe(article.title);

    // Search query matches
    const searchResults = await NewsService.getPublishedArticles(testRunId);
    expect(searchResults.some((a) => a.id === article.id)).toBe(true);
  });

  it("lists all articles for admin directory and allows deletion", async () => {
    const slug = `to-be-deleted-${testRunId}`;
    const article = await NewsService.createArticle(adminUserId, {
      title: "مطلب موقت برای حذف",
      slug,
      excerpt: "این مقاله حذف خواهد شد",
      content: "محتوای تستی",
      status: "draft",
    });

    const adminList = await NewsService.getAllArticlesAdmin();
    expect(adminList.some((a) => a.id === article.id)).toBe(true);

    // Delete article
    await NewsService.deleteArticle(article.id);

    // Verify gone
    const deletedCheck = await NewsService.getArticleBySlug(slug, true);
    expect(deletedCheck).toBeNull();

    // Deleting again throws NotFoundError
    await expect(NewsService.deleteArticle(article.id)).rejects.toThrow(NotFoundError);
  });
});
