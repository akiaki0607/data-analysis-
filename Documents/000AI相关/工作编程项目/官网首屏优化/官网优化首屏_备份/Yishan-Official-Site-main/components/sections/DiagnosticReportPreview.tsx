"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "../ui/Button";
import { FileText } from "lucide-react";

const modules = [
  { id: 1, title: "分析说明", subtitle: "数据概况与指标定义", color: "blue" },
  { id: 2, title: "数据总览", subtitle: "核心指标与平台表现", color: "green" },
  { id: 3, title: "竞品分析", subtitle: "竞争对手对比分析", color: "orange" },
  { id: 4, title: "平台分析", subtitle: "AI平台表现详解", color: "purple" },
  { id: 5, title: "信源分析", subtitle: "信源平台布局分析", color: "red" },
  { id: 6, title: "策略建议", subtitle: "优化策略与建议", color: "indigo" },
];

const colorClasses = {
  blue: "bg-blue-500",
  green: "bg-blue-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  indigo: "bg-indigo-500",
};

export default function DiagnosticReportPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-white/95 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl transition-all"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-500 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">报告模块导航</h3>
          <p className="text-sm text-gray-600">6大模块全方位诊断</p>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 hover:border-blue-500/30 transition-all cursor-pointer group"
          >
            <div className="flex flex-col items-center text-center h-full">
              <div
                className={`w-10 h-10 ${
                  colorClasses[module.color as keyof typeof colorClasses]
                } rounded-lg flex items-center justify-center mb-3 flex-shrink-0`}
              >
                <span className="text-white font-bold text-lg">{module.id}</span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1 flex-shrink-0">
                模块{module.id}：{module.title}
              </h4>
              <p className="text-xs text-gray-600 leading-tight flex-shrink-0">
                {module.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Button */}
      <Link href="/contact?from=diagnostic-report" className="block">
        <Button variant="primary" size="md" className="w-full">
          立即获取免费诊断报告
        </Button>
      </Link>
    </motion.div>
  );
}

