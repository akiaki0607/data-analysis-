/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * 格式化数字(添加千分位)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num);
}

/**
 * 生成页面标题
 */
export function generatePageTitle(title: string, siteName: string = 'Rankings'): string {
  return `${title} - ${siteName}`;
}

/**
 * 截断文本
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * 获取行业颜色类名
 */
export function getIndustryColorClass(industryId: string): string {
  const colorMap: Record<string, string> = {
    tech: 'text-industry-tech',
    food: 'text-industry-food',
    home: 'text-industry-home',
    auto: 'text-industry-auto',
    business: 'text-industry-business',
    education: 'text-industry-education',
  };

  return colorMap[industryId] || 'text-primary-600';
}

/**
 * 获取行业背景色类名
 */
export function getIndustryBgClass(industryId: string): string {
  const bgMap: Record<string, string> = {
    tech: 'bg-industry-tech',
    food: 'bg-industry-food',
    home: 'bg-industry-home',
    auto: 'bg-industry-auto',
    business: 'bg-industry-business',
    education: 'bg-industry-education',
  };

  return bgMap[industryId] || 'bg-primary-600';
}

/**
 * 生成排名变化文本
 */
export function getRankChange(change?: number): string {
  if (!change || change === 0) return '-';
  if (change > 0) return `↑${change}`;
  return `↓${Math.abs(change)}`;
}

/**
 * 生成评分星级
 */
export function getStarRating(score: number): string {
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return '⭐'.repeat(fullStars) +
         (halfStar ? '⭐' : '') +
         '☆'.repeat(emptyStars);
}
