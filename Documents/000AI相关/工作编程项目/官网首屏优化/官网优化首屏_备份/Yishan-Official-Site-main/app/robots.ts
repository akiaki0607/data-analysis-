import { MetadataRoute } from "next";

// 添加静态导出配置
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/llms.txt"],
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://www.geokeji.com/sitemap.xml",
  };
}

