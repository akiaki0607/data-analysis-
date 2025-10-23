"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, FileQuestion } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* 404 动画图标 */}
            <div className="mb-8 relative">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="inline-block"
              >
                <FileQuestion className="w-32 h-32 text-[#635BFF] mx-auto" />
              </motion.div>
            </div>

            {/* 404 文字 */}
            <h1 className="text-8xl md:text-9xl font-bold mb-4 text-[#635BFF]">
              404
            </h1>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              页面未找到
            </h2>

            <p className="text-xl text-gray-400 mb-8">
              抱歉，您访问的页面不存在或已被移动。
              <br />
              请检查 URL 是否正确，或返回首页继续浏览。
            </p>

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="primary" size="lg" className="group">
                  <Home className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  返回首页
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="group">
                  <Search className="mr-2 group-hover:scale-110 transition-transform" size={20} />
                  浏览博客
                </Button>
              </Link>
            </div>

            {/* 热门链接 */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <p className="text-sm text-gray-500 mb-4">或者访问这些热门页面：</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link
                  href="/services/geo"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  GEO服务
                </Link>
                <span className="text-gray-700">•</span>
                <Link
                  href="/cases"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  成功案例
                </Link>
                <span className="text-gray-700">•</span>
                <Link
                  href="/contact"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  联系我们
                </Link>
                <span className="text-gray-700">•</span>
                <Link
                  href="/about"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  关于我们
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

