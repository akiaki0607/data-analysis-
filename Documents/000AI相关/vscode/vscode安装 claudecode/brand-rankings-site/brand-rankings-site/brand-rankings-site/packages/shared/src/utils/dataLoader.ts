import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import type { Ranking, Brand, Industry, MetaData } from '../../data/schema/types';

/**
 * 数据文件根目录
 */
const DATA_DIR = path.join(process.cwd(), '../../data');

/**
 * 加载行业元数据
 */
export function loadIndustries(): Industry[] {
  const filePath = path.join(DATA_DIR, 'metadata', 'industries.yaml');
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = yaml.parse(content) as MetaData;
  return data.industries;
}

/**
 * 加载单个行业的所有排行榜
 */
export function loadRankingsByIndustry(industryId: string): Ranking[] {
  const industryDir = path.join(DATA_DIR, industryId);

  if (!fs.existsSync(industryDir)) {
    return [];
  }

  const files = fs.readdirSync(industryDir).filter(file => file.endsWith('.yaml'));

  return files.map(file => {
    const filePath = path.join(industryDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.parse(content) as Ranking;
  });
}

/**
 * 加载单个排行榜
 */
export function loadRanking(industryId: string, rankingSlug: string): Ranking | null {
  const filePath = path.join(DATA_DIR, industryId, `${rankingSlug}.yaml`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.parse(content) as Ranking;
}

/**
 * 加载单个品牌数据
 */
export function loadBrand(brandId: string): Brand | null {
  const filePath = path.join(DATA_DIR, 'brands', `${brandId}.yaml`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return yaml.parse(content) as Brand;
}

/**
 * 加载所有品牌
 */
export function loadAllBrands(): Brand[] {
  const brandsDir = path.join(DATA_DIR, 'brands');

  if (!fs.existsSync(brandsDir)) {
    return [];
  }

  const files = fs.readdirSync(brandsDir).filter(file => file.endsWith('.yaml'));

  return files.map(file => {
    const filePath = path.join(brandsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    return yaml.parse(content) as Brand;
  });
}

/**
 * 根据行业ID获取行业信息
 */
export function getIndustryById(industryId: string): Industry | null {
  const industries = loadIndustries();
  return industries.find(ind => ind.id === industryId) || null;
}

/**
 * 获取热门排行榜(跨行业)
 */
export function getHotRankings(limit: number = 10): Ranking[] {
  const industries = loadIndustries();
  const allRankings: Ranking[] = [];

  industries.forEach(industry => {
    const rankings = loadRankingsByIndustry(industry.id);
    allRankings.push(...rankings);
  });

  // 按浏览量排序
  allRankings.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  return allRankings.slice(0, limit);
}

/**
 * 搜索排行榜和品牌
 */
export function search(query: string): {
  rankings: Ranking[];
  brands: Brand[];
} {
  const industries = loadIndustries();
  const allRankings: Ranking[] = [];

  industries.forEach(industry => {
    const rankings = loadRankingsByIndustry(industry.id);
    allRankings.push(...rankings);
  });

  const allBrands = loadAllBrands();

  const queryLower = query.toLowerCase();

  const matchedRankings = allRankings.filter(ranking =>
    ranking.title.toLowerCase().includes(queryLower) ||
    ranking.description.toLowerCase().includes(queryLower)
  );

  const matchedBrands = allBrands.filter(brand =>
    brand.name.toLowerCase().includes(queryLower) ||
    brand.description.toLowerCase().includes(queryLower)
  );

  return {
    rankings: matchedRankings,
    brands: matchedBrands
  };
}
