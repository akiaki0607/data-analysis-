"use client";

import { motion } from "framer-motion";
import { Brain, FileText, LineChart, Search, Sparkles, Target } from "lucide-react";
import Section from "../ui/Section";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Link from "next/link";

const services = [
  {
    icon: Brain,
    title: "AI内容智能生成",
    description:
      "基于大语言模型的智能内容创作，精准匹配AI搜索意图，让您的内容被AI优先理解和推荐。",
    features: ["智能写作", "意图分析", "语义优化", "多平台适配"],
  },
  {
    icon: Search,
    title: "GEO搜索优化",
    description:
      "针对豆包、DeepSeek、腾讯元宝、Kimi等AI搜索引擎的专业优化，提升品牌在AI推荐中的排名和曝光。",
    features: ["AI索引优化", "推荐算法研究", "实时监控", "效果分析"],
  },
  {
    icon: LineChart,
    title: "数据洞察分析",
    description:
      "深度追踪AI搜索表现数据，提供可视化报表和优化建议，持续提升GEO效果和ROI。",
    features: ["数据追踪", "竞品分析", "趋势预测", "策略优化"],
  },
  {
    icon: Target,
    title: "品牌声誉管理",
    description:
      "监控和优化品牌在AI对话中的呈现方式，确保正面信息被AI准确传达，提升品牌信任度。",
    features: ["声誉监控", "负面处理", "正向引导", "危机应对"],
  },
];

export default function ServicesSection() {
  return (
    <Section className="bg-transparent" id="services">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-[#C4B5FD]/20 border border-[#8B5CF6]/30 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-[#8B5CF6]" size={16} />
            <span className="text-sm text-[#8B5CF6]">核心服务</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            全方位GEO解决方案
          </h2>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            从内容创作到数据分析，一站式AI搜索优化服务
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card hover glass className="h-full">
              <div className="flex items-start space-x-4 mb-4">
                <div className="p-3 bg-[#0EA5E9]/15 rounded-xl">
                  <service.icon className="text-[#0EA5E9]" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2">
                    {service.title}
                  </h3>
                </div>
              </div>
              <p className="text-[#475569] mb-6 leading-relaxed">
                {service.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2 text-sm text-[#475569]"
                  >
                    <div className="w-1.5 h-1.5 bg-[#06B6D4] rounded-full flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Link href="/services/geo">
          <Button variant="primary" size="lg">
            了解详细服务
          </Button>
        </Link>
      </motion.div>
    </Section>
  );
}

