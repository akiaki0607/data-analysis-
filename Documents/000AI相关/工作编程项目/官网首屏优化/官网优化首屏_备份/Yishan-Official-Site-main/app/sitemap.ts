import { MetadataRoute } from "next";

// 添加静态导出配置
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.geokeji.com";
  const staticPages = [
    "",
    "/services/geo",
    "/about",
    "/blog",
    "/cases",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Blog posts (you would typically fetch these from a database or CMS)
  const blogPosts = [
    "what-is-geo",
    "ai-search-trends-2025",
    "geo-optimization-guide",
    "chatgpt-search-optimization",
    "ai-content-generation-best-practices",
    "geo-metrics-and-analytics",
    "voice-search-optimization",
    "geo-case-study-saas",
    "ai-search-user-behavior",
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Case study pages
  const casePages = [
    "saas-project-management",
    "ecommerce-fashion",
    "edtech-language-learning",
  ].map((id) => ({
    url: `${baseUrl}/cases/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPosts, ...casePages];
}

