import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "观点洞察 - GEO行业知识与趋势分析 | 移山科技",
  description:
    "移山科技博客，分享GEO优化方法、AI搜索趋势、行业洞察和最佳实践。帮助企业了解AI搜索时代的营销策略。",
  keywords: "GEO博客, AI搜索趋势, 优化方法, 行业洞察, 营销策略",
};

const blogPosts = [
  {
    slug: "what-is-geo",
    title: "什么是GEO？为什么它比SEO更重要",
    excerpt:
      "在AI搜索时代，传统SEO优化已经不够。GEO（Generative Engine Optimization）正在成为企业数字营销的新战场。本文深入解析GEO的核心概念、与SEO的区别，以及为什么每个企业都应该关注GEO...",
    category: "行业洞察",
    date: "2025-10-08",
    readTime: "8分钟",
    author: "张伟",
    tags: ["GEO", "SEO", "AI搜索"],
  },
  {
    slug: "ai-search-trends-2025",
    title: "2025年AI搜索趋势报告：企业如何抓住机遇",
    excerpt:
      "根据最新数据，超过60%的用户开始使用AI搜索工具，这一数字还在快速增长。本报告深度解析AI搜索趋势，包括用户行为变化、技术发展方向、市场机会等，为企业提供实战指南...",
    category: "趋势报告",
    date: "2025-10-05",
    readTime: "12分钟",
    author: "李娜",
    tags: ["趋势分析", "AI搜索", "市场研究"],
  },
  {
    slug: "geo-optimization-guide",
    title: "GEO优化完整指南：从0到1的实战手册",
    excerpt:
      "这份完整指南将带你了解GEO优化的核心方法论，包括内容策略、技术实现、效果追踪等关键环节。无论你是营销人员还是技术专家，都能从中获得实用的优化建议...",
    category: "实战指南",
    date: "2025-10-01",
    readTime: "15分钟",
    author: "王强",
    tags: ["优化指南", "实战", "方法论"],
  },
  {
    slug: "chatgpt-search-optimization",
    title: "ChatGPT搜索优化：让AI优先推荐你的品牌",
    excerpt:
      "ChatGPT已经成为全球最受欢迎的AI搜索工具之一。如何让ChatGPT在回答用户问题时优先提到你的品牌？本文分享5个实用的优化策略，帮助你在ChatGPT中提升品牌曝光...",
    category: "优化技巧",
    date: "2025-09-28",
    readTime: "10分钟",
    author: "张伟",
    tags: ["ChatGPT", "优化技巧", "品牌营销"],
  },
  {
    slug: "ai-content-generation-best-practices",
    title: "AI内容生成最佳实践：平衡质量与效率",
    excerpt:
      "AI工具可以大幅提升内容创作效率，但如何确保内容质量？本文分享AI内容生成的最佳实践，包括prompt工程、内容审核、人机协作等关键要素...",
    category: "内容营销",
    date: "2025-09-25",
    readTime: "11分钟",
    author: "李娜",
    tags: ["内容生成", "AI工具", "最佳实践"],
  },
  {
    slug: "geo-metrics-and-analytics",
    title: "GEO数据指标体系：如何衡量优化效果",
    excerpt:
      "没有数据就无法优化。建立科学的GEO指标体系是优化成功的关键。本文介绍核心指标定义、数据采集方法、分析框架，帮助你建立数据驱动的优化流程...",
    category: "数据分析",
    date: "2025-09-20",
    readTime: "13分钟",
    author: "王强",
    tags: ["数据分析", "指标体系", "效果评估"],
  },
  {
    slug: "voice-search-optimization",
    title: "语音搜索优化：下一个流量增长点",
    excerpt:
      "随着智能音箱和语音助手的普及，语音搜索正在快速增长。语音搜索与文字搜索有很大不同，需要特殊的优化策略。本文分享语音搜索优化的核心方法...",
    category: "优化技巧",
    date: "2025-09-15",
    readTime: "9分钟",
    author: "刘芳",
    tags: ["语音搜索", "优化技巧", "流量增长"],
  },
  {
    slug: "geo-case-study-saas",
    title: "SaaS企业GEO实战：3个月流量增长300%",
    excerpt:
      "一个真实的SaaS企业GEO优化案例。从诊断到实施，详细记录整个优化过程，包括遇到的挑战、解决方案、最终效果。这个案例可以为你的优化工作提供参考...",
    category: "案例分析",
    date: "2025-09-10",
    readTime: "14分钟",
    author: "张伟",
    tags: ["案例分析", "SaaS", "实战经验"],
  },
  {
    slug: "ai-search-user-behavior",
    title: "AI搜索用户行为研究：他们想要什么",
    excerpt:
      "理解用户行为是优化的基础。我们对1000+AI搜索用户进行了深度研究，发现了一些有趣的行为模式和需求特点。这些洞察可以指导你的优化策略...",
    category: "用户研究",
    date: "2025-09-05",
    readTime: "10分钟",
    author: "刘芳",
    tags: ["用户研究", "行为分析", "需求洞察"],
  },
];

const categories = [
  "全部",
  "行业洞察",
  "趋势报告",
  "实战指南",
  "优化技巧",
  "内容营销",
  "数据分析",
  "案例分析",
  "用户研究",
];

export default function BlogPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="text-[#635BFF]" size={18} />
              <span className="text-sm text-gray-900">观点洞察</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              GEO知识库
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              深度解析AI搜索趋势，分享前沿优化方法
              <br />
              帮助企业在AI时代保持竞争优势
            </p>
          </div>
        </Container>
      </Section>

      {/* Blog Section */}
      <Section className="bg-gray-50">
        <Container>
          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  category === "全部"
                    ? "bg-[#635BFF] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#635BFF]/30 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {blogPosts.length > 0 && (
            <Link href={`/blog/${blogPosts[0].slug}`}>
              <Card glass hover className="mb-12 overflow-hidden group">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="relative h-64 lg:h-auto bg-[#635BFF]/10 rounded-xl flex items-center justify-center">
                    <div className="text-8xl">📝</div>
                  </div>
                  <div className="flex flex-col justify-center py-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="bg-[#635BFF]/90 text-white text-xs px-3 py-1 rounded-full">
                        {blogPosts[0].category}
                      </span>
                      <span className="text-gray-600 text-sm">推荐阅读</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#635BFF] transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{blogPosts[0].date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>{blogPosts[0].readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>作者：{blogPosts[0].author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card glass hover className="h-full group">
                  {/* Image Placeholder */}
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-[#635BFF]/10">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl">📝</div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#635BFF]/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#635BFF] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded-full text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight
                      className="text-[#635BFF] group-hover:translate-x-1 transition-transform"
                      size={16}
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More - Placeholder */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 hover:border-[#635BFF]/30 transition-all">
              加载更多
            </button>
          </div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <Section className="bg-transparent">
        <Container>
          <Card glass className="max-w-3xl mx-auto text-center p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              订阅GEO资讯
            </h2>
            <p className="text-gray-600 mb-8">
              每周获取最新的GEO优化技巧和行业洞察
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20"
              />
              <button className="px-6 py-3 bg-[#635BFF] text-white rounded-lg font-semibold hover:bg-[#0A2540] transition-all">
                订阅
              </button>
            </div>
          </Card>
        </Container>
      </Section>
    </div>
  );
}


