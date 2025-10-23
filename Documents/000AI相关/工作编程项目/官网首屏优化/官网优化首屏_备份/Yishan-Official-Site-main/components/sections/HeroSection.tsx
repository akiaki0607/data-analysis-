"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";
import Container from "../ui/Container";
import { TrendingUp, Zap, Clock } from "lucide-react";
import EvidenceCard from "./EvidenceCard";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent py-20 lg:py-0">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-48 h-48 md:w-72 md:h-72 bg-[#0EA5E9]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 h-64 md:w-96 md:h-96 bg-[#8B5CF6]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#3B82F6]/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

      <Container size="full" className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* 左侧内容 - 文案区 */}
          <div className="order-2 lg:order-1">
            {/* 主标题 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#0F172A]"
              style={{ lineHeight: '1.2' }}
            >
              让AI优先推荐你
            </motion.h1>

            {/* 副标题 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl md:text-2xl text-[#475569] mb-8"
            >
              作为GEO行业标准引领者，覆盖主流AI平台，最快72小时见效，效果数据透明可验。
            </motion.p>

            {/* 三指标卡 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            >
              {[
                {
                  icon: TrendingUp,
                  value: "500+",
                  label: "合作企业",
                  color: "text-blue-600",
                },
                {
                  icon: Zap,
                  value: "+300%",
                  label: "品牌曝光增加",
                  color: "text-green-600",
                },
                {
                  icon: Clock,
                  value: "72 小时",
                  label: "最早见效周期",
                  color: "text-purple-600",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl p-4 hover:bg-white hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all text-center"
                >
                  <stat.icon className={`${stat.color} mb-2 mx-auto`} size={24} />
                  <div className="text-3xl font-bold text-[#0F172A] font-mono mb-1">
                    {stat.value}
                  </div>
                  <div className="text-base text-[#475569]">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* 双CTA按钮 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link href="/contact?from=diagnostic-report" className="flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  免费获取诊断报告
                </Button>
              </Link>
              <Link href="/contact?from=whitepaper" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  领取《GEO生成式引擎优化白皮书》
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* 右侧内容 - 证据资源区 */}
          <div className="order-1 lg:order-2">
            <EvidenceCard />
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#64748B] rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

