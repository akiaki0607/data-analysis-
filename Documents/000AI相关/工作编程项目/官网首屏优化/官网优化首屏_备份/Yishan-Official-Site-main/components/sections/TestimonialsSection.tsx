"use client";

import { motion } from "framer-motion";
import Section from "../ui/Section";
import Card from "../ui/Card";
import { Star, Sparkles } from "lucide-react";

const testimonials = [
  {
    company: "某跨境电商平台",
    industry: "电商",
    quote: "合作3个月，AI搜索带来的询盘占比从0%提升到35%，ROI超出预期！",
    author: "市场总监 张先生",
    rating: 5,
  },
  {
    company: "某SaaS企业",
    industry: "企业服务",
    quote: "移山科技的GEO服务非常专业，帮我们在豆包、Kimi等AI平台获得大量曝光。",
    author: "CEO 李女士",
    rating: 5,
  },
  {
    company: "某在线教育平台",
    industry: "教育",
    quote: "效果立竿见影！现在用户在AI助手问学习平台，我们总是被推荐。",
    author: "运营负责人 王先生",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <Section className="bg-transparent" id="testimonials">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-4">
            <Sparkles className="text-[#635BFF]" size={16} />
            <span className="text-sm text-[#635BFF]">客户评价</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            他们都在用，效果看得见
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            来自不同行业的真实反馈
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card glass hover className="h-full flex flex-col">
              {/* 星级评分 */}
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="text-[#635BFF] fill-[#635BFF]" size={18} />
                ))}
              </div>

              {/* 评价内容 */}
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                "{item.quote}"
              </p>

              {/* 客户信息 */}
              <div className="border-t border-gray-200 pt-4 mt-auto">
                <p className="text-gray-900 font-semibold">{item.company}</p>
                <p className="text-gray-600 text-sm mb-2">{item.author}</p>
                <span className="inline-block px-3 py-1 bg-[#635BFF]/10 border border-[#635BFF]/20 text-[#635BFF] text-xs rounded-full">
                  {item.industry}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

