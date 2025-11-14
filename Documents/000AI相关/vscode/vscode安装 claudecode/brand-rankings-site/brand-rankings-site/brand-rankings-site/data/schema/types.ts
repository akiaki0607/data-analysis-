// TypeScript 类型定义

/**
 * 行业元数据
 */
export interface Industry {
  id: string;              // 行业ID (如 'tech')
  name: string;            // 行业名称
  slug: string;            // URL slug
  subdomain: string;       // 子域名
  description: string;     // 描述
  icon: string;            // 图标 (emoji 或 SVG 路径)
  color: string;           // 主题色 (hex)
  rankingCount: number;    // 排行榜数量
  featured?: string[];     // 精选排行榜IDs
}

/**
 * 排行榜
 */
export interface Ranking {
  id: string;              // 排行榜唯一标识
  title: string;           // 标题
  slug: string;            // URL slug
  category: string;        // 所属行业ID
  subcategory?: string;    // 子分类
  updateDate: string;      // 更新日期 (YYYY-MM-DD)
  description: string;     // 描述
  methodology?: string;    // 评估方法说明
  brands: BrandRanking[];  // 品牌排名列表
  tags?: string[];         // 标签
  viewCount?: number;      // 浏览量
}

/**
 * 品牌在排行榜中的条目
 */
export interface BrandRanking {
  rank: number;            // 排名
  name: string;            // 品牌名称
  brandId: string;         // 品牌ID（关联品牌主数据）
  score: number;           // 综合评分 (0-10)
  logo: string;            // Logo路径
  description: string;     // 简介
  metrics: {               // 具体指标（根据行业定制）
    [key: string]: string | number;
  };
  change?: number;         // 排名变化（相比上期）
  tags?: string[];         // 标签
}

/**
 * 品牌主数据
 */
export interface Brand {
  id: string;              // 品牌唯一标识
  name: string;            // 品牌名称
  nameEn?: string;         // 英文名称
  slug: string;            // URL slug
  logo: string;            // Logo路径
  founded?: string;        // 成立时间
  headquarters?: string;   // 总部位置
  website?: string;        // 官网
  description: string;     // 详细介绍
  industries: string[];    // 涉及行业IDs
  rankings: BrandRankingRef[]; // 出现在哪些排行榜
  socialMedia?: {          // 社交媒体
    weibo?: string;
    wechat?: string;
    twitter?: string;
    linkedin?: string;
  };
}

/**
 * 品牌在排行榜中的引用
 */
export interface BrandRankingRef {
  rankingId: string;       // 排行榜ID
  rank: number;            // 排名
  score: number;           // 评分
}

/**
 * 元数据配置
 */
export interface MetaData {
  industries: Industry[];  // 所有行业
}
