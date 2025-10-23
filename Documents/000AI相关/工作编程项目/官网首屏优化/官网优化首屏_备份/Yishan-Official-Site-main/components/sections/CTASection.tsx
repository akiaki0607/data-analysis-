"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Section from "../ui/Section";
import Button from "../ui/Button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const benefits = [
  "免费GEO现状诊断",
  "定制优化方案",
  "专家1对1咨询",
  "行业案例分享",
];

export default function CTASection() {
  return (
    <Section className="bg-gradient-to-br from-[#8B5CF6]/5 via-[#8B5CF6]/8 to-[#0EA5E9]/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#8B5CF6]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#0EA5E9]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#C4B5FD]/20 backdrop-blur-lg border border-[#8B5CF6]/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="text-[#8B5CF6]" size={18} />
            <span className="text-sm text-[#8B5CF6]">限时免费咨询</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-[#0F172A] mb-6">
            准备好在AI搜索时代
            <br />
            占据领先地位了吗？
          </h2>

          <p className="text-xl text-[#475569] mb-8 max-w-2xl mx-auto">
            立即预约免费咨询，获取专属GEO优化方案
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3"
              >
                <CheckCircle2 className="text-[#06B6D4] flex-shrink-0" size={20} />
                <span className="text-[#475569] text-left">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/contact?from=cta">
              <Button variant="secondary" size="lg" className="group">
                免费咨询方案
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Button>
            </Link>
            <Link href="/cases">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/80 backdrop-blur-sm border-gray-300 text-[#475569] hover:bg-white hover:text-[#0EA5E9] hover:border-[#0EA5E9]"
              >
                查看成功案例
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badge */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-sm text-[#64748B] mt-8"
          >
            已有500+企业选择移山科技 | 平均响应时间 &lt; 2小时
          </motion.p>
        </motion.div>
      </div>
    </Section>
  );
}

