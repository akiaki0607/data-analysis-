import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  readTime: string;
  tags: string[];
  content: string;
}

const postsDirectory = path.join(process.cwd(), "content/blog");

/**
 * 获取所有博客文章
 */
export function getAllBlogPosts(): BlogPost[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || "",
        date: data.date || "",
        excerpt: data.excerpt || "",
        author: data.author || "移山科技",
        category: data.category || "GEO",
        readTime: data.readTime || "5分钟",
        tags: data.tags || [],
        content,
      } as BlogPost;
    });

  // 按日期排序（最新的在前）
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * 根据 slug 获取单篇博客文章
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      excerpt: data.excerpt || "",
      author: data.author || "移山科技",
      category: data.category || "GEO",
      readTime: data.readTime || "5分钟",
      tags: data.tags || [],
      content,
    } as BlogPost;
  } catch (error) {
    return null;
  }
}

/**
 * 获取最新的 N 篇文章
 */
export function getLatestPosts(count: number = 3): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, count);
}

/**
 * 根据分类获取文章
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.category === category);
}

/**
 * 根据标签获取文章
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts();
  const categories = allPosts.map((post) => post.category);
  return Array.from(new Set(categories));
}

/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = allPosts.flatMap((post) => post.tags);
  return Array.from(new Set(tags));
}

/**
 * 获取相关文章（基于标签和分类）
 */
export function getRelatedPosts(slug: string, count: number = 3): BlogPost[] {
  const currentPost = getBlogPostBySlug(slug);
  if (!currentPost) return [];

  const allPosts = getAllBlogPosts().filter((post) => post.slug !== slug);

  // 计算相关性得分
  const postsWithScore = allPosts.map((post) => {
    let score = 0;

    // 同分类 +3 分
    if (post.category === currentPost.category) {
      score += 3;
    }

    // 每个相同标签 +1 分
    const commonTags = post.tags.filter((tag) =>
      currentPost.tags.includes(tag)
    );
    score += commonTags.length;

    return { post, score };
  });

  // 按得分排序并返回前 N 篇
  return postsWithScore
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.post);
}

