"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ArrowRight, Calendar, Clock, Sparkles } from "lucide-react";

const blogPosts = [
  {
    slug: "what-is-geo",
    title: "什么是GEO？为什么它比SEO更重要",
    excerpt:
      "在AI搜索时代，传统SEO优化已经不够。GEO（Generative Engine Optimization）正在成为企业数字营销的新战场...",
    category: "行业洞察",
    date: "2025-10-08",
    readTime: "8分钟",
    image: "/images/blog-1.jpg",
  },
  {
    slug: "ai-search-trends-2025",
    title: "2025年AI搜索趋势报告：企业如何抓住机遇",
    excerpt:
      "根据最新数据，超过60%的用户开始使用AI搜索工具。本报告深度解析AI搜索趋势，为企业提供实战指南...",
    category: "趋势报告",
    date: "2025-10-05",
    readTime: "12分钟",
    image: "/images/blog-2.jpg",
  },
  {
    slug: "geo-optimization-guide",
    title: "GEO优化完整指南：从0到1的实战手册",
    excerpt:
      "这份完整指南将带你了解GEO优化的核心方法论，包括内容策略、技术实现、效果追踪等关键环节...",
    category: "实战指南",
    date: "2025-10-01",
    readTime: "15分钟",
    image: "/images/blog-3.jpg",
  },
];

export default function BlogSection() {
  return (
    <Section className="bg-transparent" id="blog">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-[#635BFF]" size={16} />
            <span className="text-sm text-[#635BFF]">观点洞察</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            GEO知识库
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            深度解析AI搜索趋势，分享前沿优化方法
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.slug}`}>
              <Card hover glass className="h-full group">
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

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-gray-200">
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
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Link href="/blog">
          <Button variant="outline" size="lg">
            查看全部文章
          </Button>
        </Link>
      </motion.div>
    </Section>
  );
}

