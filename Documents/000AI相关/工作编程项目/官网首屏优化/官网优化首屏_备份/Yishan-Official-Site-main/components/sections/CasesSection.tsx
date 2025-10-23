"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ArrowUpRight, Sparkles } from "lucide-react";

const cases = [
  {
    id: 1,
    company: "科技独角兽A",
    industry: "企业服务",
    title: "AI推荐率提升450%，获客成本降低60%",
    description:
      "通过系统化的GEO优化，该SaaS企业在主流AI搜索引擎中的推荐率大幅提升，3个月内自然流量增长300%。",
    image: "/images/case-1.jpg",
    results: [
      { label: "AI推荐率", value: "+450%" },
      { label: "自然流量", value: "+300%" },
      { label: "获客成本", value: "-60%" },
    ],
    tags: ["SaaS", "B2B", "企业服务"],
  },
  {
    id: 2,
    company: "电商品牌B",
    industry: "电商零售",
    title: "品牌声量提升5倍，转化率翻倍",
    description:
      "针对消费品行业特点，优化AI对话中的品牌呈现，成功抢占AI推荐高地，实现销售额显著增长。",
    image: "/images/case-2.jpg",
    results: [
      { label: "品牌声量", value: "+500%" },
      { label: "转化率", value: "+120%" },
      { label: "销售额", value: "+280%" },
    ],
    tags: ["电商", "消费品", "品牌营销"],
  },
  {
    id: 3,
    company: "教育平台C",
    industry: "在线教育",
    title: "用户留存提升80%，口碑传播指数增长400%",
    description:
      "通过AI内容优化和品牌声誉管理，在教育领域建立权威形象，成为AI优先推荐的学习平台。",
    image: "/images/case-3.jpg",
    results: [
      { label: "用户留存", value: "+80%" },
      { label: "口碑指数", value: "+400%" },
      { label: "注册转化", value: "+165%" },
    ],
    tags: ["教育", "在线学习", "知识付费"],
  },
];

export default function CasesSection() {
  return (
    <Section className="bg-transparent" id="cases">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-[#635BFF]" size={16} />
            <span className="text-sm text-[#635BFF]">成功案例</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            他们选择了移山科技
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            来自不同行业的企业，都在AI搜索时代获得了增长
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {cases.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/cases/${item.id}`}>
              <Card hover glass className="h-[520px] md:h-[564px] flex flex-col group">
                {/* Image Placeholder - 固定高度 */}
                <div className="relative h-40 md:h-48 mb-3 md:mb-4 rounded-xl overflow-hidden bg-[#635BFF]/10 flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center px-2">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 md:mb-2">
                        {item.company}
                      </div>
                      <div className="text-xs sm:text-sm">{item.industry}</div>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/10 backdrop-blur-md rounded-full p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="text-white" size={18} />
                  </div>
                </div>

                {/* 标题 - 固定高度，居中显示 */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight h-[24px] md:h-[28px] overflow-hidden flex-shrink-0 text-center">
                  {item.title}
                </h3>
                
                {/* 描述 - 固定高度 */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-[60px] flex-shrink-0">
                  {item.description}
                </p>

                {/* Results - 固定高度，确保全局对齐 */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4 flex-shrink-0">
                  {item.results.map((result, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-end bg-white/80 border border-gray-200 rounded-lg h-[68px] md:h-[72px] pb-2 md:pb-3 pt-2"
                    >
                      <div className="text-lg md:text-xl font-bold text-[#635BFF] font-mono">
                        {result.value}
                      </div>
                      <div className="text-xs text-gray-600 text-center leading-tight pt-1.5 md:pt-2">
                        {result.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags - 固定高度，整组居中对齐 */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 h-[28px] md:h-[32px] items-center justify-center flex-shrink-0">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 md:px-3 py-1 md:py-1.5 bg-white/80 border border-gray-200 rounded-full text-gray-600 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
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
        <Link href="/cases">
          <Button variant="outline" size="lg">
            查看更多案例
          </Button>
        </Link>
      </motion.div>
    </Section>
  );
}

