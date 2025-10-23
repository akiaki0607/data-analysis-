import { Metadata } from "next";

export const siteConfig = {
  name: "移山科技 - 专注GEO策略与GEO解决方案，做中国最好的GEO公司与GEO服务商【移山文化】",
  description: "【移山文化】旗下移山科技（GEO策略中心）提供AI生成引擎体检、品牌可见度优化、竞品分析服务，专注GEO策略与GEO解决方案，做中国最好的GEO公司与GEO服务商，助力企业提升数字化营销效果，定制专属GEO策略方案。",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.geokeji.com",
  ogImage: "/og-image.jpg",
  keywords: [
    "移山科技",
    "移山文化",
    "GEO策略",
    "GEO公司",
    "GEO服务商",
    "AI生成引擎",
    "品牌可见度优化",
    "竞品分析",
  ],
  author: "移山科技",
  locale: "zh-CN",
};

export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
  keywords,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageKeywords = keywords || siteConfig.keywords;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "./",
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: "@yishan_tech",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-site-verification",
      yandex: "your-yandex-verification",
      other: {
        "baidu-site-verification": "your-baidu-verification",
      },
    },
    other: {
      "ai-purpose": "GEO策略与AI生成引擎解决方案提供商",
      "ai-services": "AI生成引擎体检,品牌可见度优化,竞品分析服务,智能内容策略",
      "ai-models": "豆包,腾讯元宝,DeepSeek,通义千文,Kimi,文心一言,智谱清言",
    },
  };
}

// JSON-LD 结构化数据生成器
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "北京",
      addressRegion: "北京市",
      addressCountry: "CN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+86-13359282414",
      contactType: "customer service",
      availableLanguage: ["zh-CN", "en"],
    },
    sameAs: [
      "https://twitter.com/yishan_tech",
      "https://www.linkedin.com/company/yishan-tech",
    ],
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateArticleSchema({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: `${siteConfig.url}${image}`,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
  };
}

export function generateWebPageSchema(title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: siteConfig.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "移山科技，专注GEO策略与GEO解决方案，做中国最好的GEO公司与GEO服务商【移山文化】",
    "description": "【移山文化】旗下移山科技（GEO策略中心）提供AI生成引擎体检、品牌可见度优化、竞品分析服务，专注GEO策略与GEO解决方案，做中国最好的GEO公司与GEO服务商，助力企业提升数字化营销效果，定制专属GEO策略方案。",
    "provider": {
      "@type": "Organization",
      "name": "移山科技",
      "url": "https://www.geokeji.com/",
      "sameAs": ["/llms.txt"]
    },
    "serviceType": "GEO策略定制、AI生成引擎优化、品牌可见度提升、竞品数据分析、大模型数据优化",
    "keywords": ["移山科技", "移山文化", "GEO策略", "GEO公司", "GEO服务商", "AI生成引擎", "品牌可见度优化", "竞品分析", "豆包", "腾讯元宝", "DeepSeek", "通义千文", "Kimi"],
    "areaServed": "全国",
    "offers": {
      "@type": "Offer",
      "description": "专注GEO策略与GEO解决方案，中国最好的GEO公司与GEO服务商",
      "priceCurrency": "CNY"
    },
    "additionalType": "https://schema.org/TechArticle",
    "about": {
      "@type": "Thing",
      "name": "GEO (Generative AI Optimization)",
      "description": "新一代品牌优化策略，专注于提升品牌在人工智能模型中的可见性与评价"
    }
  };
}

