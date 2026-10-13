import { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.APP_URL.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/my-requests",
        "/reset-password",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
