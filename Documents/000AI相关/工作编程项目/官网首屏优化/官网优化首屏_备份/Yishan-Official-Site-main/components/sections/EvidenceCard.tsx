"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";
import { FileText, BarChart3, Users, Target, TrendingUp, Search } from "lucide-react";

const analysisModules = [
  { id: 1, title: "分析说明", icon: FileText, color: "blue" },
  { id: 2, title: "数据纵览", icon: BarChart3, color: "green" },
  { id: 3, title: "竞品分析", icon: Users, color: "orange" },
  { id: 4, title: "平台分心", icon: Target, color: "purple" },
  { id: 5, title: "信源分析", icon: TrendingUp, color: "red" },
  { id: 6, title: "策略建议", icon: Search, color: "indigo" },
];

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-green-500", 
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  indigo: "bg-indigo-500",
};

export default function EvidenceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all max-w-md mx-auto lg:mx-0"
    >
      {/* 卡片头部 */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
          <FileText className="text-white" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          品牌GEO引擎诊断报告
        </h3>
        <p className="text-base text-gray-600">
          6大模块全方位分析，数据透明可验
        </p>
      </div>

      {/* 分析模块网格 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {analysisModules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-3 hover:bg-gray-100 hover:border-blue-500/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 ${
                  colorClasses[module.color as keyof typeof colorClasses]
                } rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <module.icon className="text-white" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {module.title}
                </h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA按钮 */}
      <Link href="/contact?from=diagnostic-report" className="block">
        <Button variant="primary" size="md" className="w-full">
          免费获取诊断报告
        </Button>
      </Link>

      {/* 底部说明 */}
      <p className="text-xs text-gray-500 text-center mt-3">
        点击获取专属品牌分析报告
      </p>
    </motion.div>
  );
}
