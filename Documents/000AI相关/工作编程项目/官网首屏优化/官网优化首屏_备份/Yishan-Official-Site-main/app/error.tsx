"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到错误报告服务
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 错误图标 */}
            <div className="mb-8 relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="inline-block"
              >
                <div className="relative">
                  <AlertTriangle className="w-32 h-32 text-red-500 mx-auto" />
                  <motion.div
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"
                  />
                </div>
              </motion.div>
            </div>

            {/* 错误标题 */}
            <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
              糟糕！
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              出错了
            </h2>

            <p className="text-xl text-gray-400 mb-8">
              我们遇到了一个意外错误，请稍后重试。
              <br />
              如果问题持续存在，请联系我们的技术支持团队。
            </p>

            {/* 错误详情（开发环境） */}
            {process.env.NODE_ENV === "development" && error.message && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-left">
                <p className="text-sm font-mono text-red-400 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={reset}
                className="group"
              >
                <RefreshCw className="mr-2 group-hover:rotate-180 transition-transform duration-500" size={20} />
                重试
              </Button>
              <Link href="/">
                <Button variant="outline" size="lg" className="group">
                  <Home className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  返回首页
                </Button>
              </Link>
            </div>

            {/* 支持信息 */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500 mb-2">需要帮助？</p>
              <Link
                href="/contact"
                className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
              >
                联系我们的技术支持团队
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

