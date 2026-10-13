import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import nextConfig from "@/next.config.mjs";
import { FileStorageService } from "@/modules/storage/service";
import { RequestService } from "@/modules/requests/service";
import { AuthService } from "@/modules/auth/service";
import { ForbiddenError } from "@/lib/errors";

describe("Phase 9: QA, Security & SEO Hardening", () => {
  const testRunId = Date.now().toString(36);

  it("verifies strict production security headers in next.config.mjs", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.output).toBe("standalone");

    if (nextConfig.headers) {
      const headerRules = await nextConfig.headers();
      const allRoutesRule = headerRules.find((r: any) => r.source === "/:path*");
      expect(allRoutesRule).toBeDefined();

      if (allRoutesRule) {
        const headerMap = Object.fromEntries(
          allRoutesRule.headers.map((h: any) => [h.key, h.value])
        );

        expect(headerMap["X-Frame-Options"]).toBe("DENY");
        expect(headerMap["X-Content-Type-Options"]).toBe("nosniff");
        expect(headerMap["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
        expect(headerMap["Strict-Transport-Security"]).toContain("max-age=");
        expect(headerMap["Permissions-Policy"]).toContain("camera=()");
      }
    }
  });

  it("generates valid dynamic sitemap with public pages and published news", async () => {
    const entries = await sitemap();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThanOrEqual(7);

    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/portfolio"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/about"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/team"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/news"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/contact"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/investment-request"))).toBe(true);
  });

  it("enforces robots.txt privacy protecting admin and api paths", () => {
    const rules = robots();
    expect(rules.sitemap).toContain("/sitemap.xml");

    const disallowed = Array.isArray(rules.rules)
      ? rules.rules[0].disallow
      : rules.rules.disallow;

    expect(disallowed).toContain("/admin/");
    expect(disallowed).toContain("/api/");
    expect(disallowed).toContain("/my-requests");
    expect(disallowed).toContain("/reset-password");
  });

  it("blocks IDOR cross-tenant request access between different customers", async () => {
    // Register Customer A
    const userA = await AuthService.register({
      email: `user-a-${testRunId}@test.ir`,
      password: "Password#123",
    });

    // Register Customer B
    const userB = await AuthService.register({
      email: `user-b-${testRunId}@test.ir`,
      password: "Password#123",
    });

    // Customer A creates draft
    const requestA = await RequestService.createDraft(userA, {
      startup_name: "استارتاپ آلفا",
      founder_name: "کاربر الف",
      email: userA.email,
      phone: "09121111111",
      sector: "ecommerce",
      stage: "seed",
      description: "شرح تفصیلی طرح استارتاپ الف برای تست عدم دسترسی دیگران.",
      idempotency_key: `key_a_${testRunId}`,
    });

    // Customer B attempts to access Customer A's proposal -> Must throw ForbiddenError
    await expect(
      RequestService.getRequestById(userB, requestA.id)
    ).rejects.toThrow(ForbiddenError);
  });

  it("blocks path traversal attacks attempting to escape storage root", () => {
    expect(() => {
      FileStorageService.getSafeAbsolutePath("../../../etc/passwd");
    }).toThrow(ForbiddenError);

    expect(() => {
      FileStorageService.getSafeAbsolutePath("/etc/shadow");
    }).toThrow(ForbiddenError);
  });
});
