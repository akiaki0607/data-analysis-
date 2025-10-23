"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

// 移山科技 Logo 组件
const YishanLogo: React.FC = () => (
  <div className="w-8 h-8 flex items-center justify-center">
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path d="M29.9999 5L55.495 50H4.50481L29.9999 5Z" fill="#3B82F6" />
      <path
        d="M29.9999 15.2223L47.7475 50H12.2523L29.9999 15.2223Z"
        fill="white"
      />
      <path
        d="M30 0L33.0902 9.40983H43.1695L35.0396 15.2223L38.1298 24.6321L30 18.8194L21.8702 24.6321L24.9604 15.2223L16.8305 9.40983H26.9098L30 0Z"
        fill="#2563EB"
      />
    </svg>
  </div>
);

// 3D 书本封面组件
const BookCover: React.FC = () => {
  return (
    <div className="relative w-[240px] h-[340px] sm:w-[280px] sm:h-[400px] drop-shadow-2xl">
      {/* 书本背面 - 3D 效果 */}
      <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg transform translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-lg"></div>
      </div>

      {/* 书本正面 */}
      <div className="absolute top-0 left-0 w-full h-full bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200/50">
        {/* 背景装饰元素 */}
        <div className="absolute w-[400px] h-[400px] bg-blue-400/30 rounded-full -top-32 -right-32 filter blur-3xl"></div>

        <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full text-slate-800">
          {/* 顶部 Logo 和品牌名 */}
          <div className="flex items-center gap-2">
            <YishanLogo />
            <span className="font-bold text-lg sm:text-xl tracking-wider">移山科技</span>
          </div>

          {/* 中间主标题区域 */}
          <div className="flex-grow flex flex-col justify-center items-center">
            <div className="flex items-center gap-2 sm:gap-4">
              <svg
                width="18"
                height="32"
                viewBox="0 0 24 42"
                className="sm:w-6 sm:h-10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0L24 21L0 42V0Z" fill="#3B82F6" />
              </svg>
              <p className="text-sm sm:text-lg font-medium tracking-widest text-slate-600">
                B2B企业数字营销
              </p>
            </div>
            <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mt-1 leading-[0.9] text-center">
              <span className="block">GEO</span>
              <span className="block whitespace-nowrap">白皮书</span>
            </h2>
          </div>

          {/* 底部品牌英文名 */}
          <div className="mt-auto">
            <p className="font-semibold text-sm sm:text-base text-slate-700">Yishan Technology</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WhitepaperPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12"
    >
      {/* 左侧：标题 + 二维码 */}
      <div className="flex-1 space-y-6 max-w-xl">
        {/* 免费领取标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-blue-500 mb-3">
            免费领取
          </h2>
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
            「GEO白皮书」
          </p>
        </motion.div>

        {/* 二维码领取卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-blue-500 p-5 sm:p-6 rounded-2xl flex items-center gap-4 sm:gap-6 shadow-lg shadow-blue-500/20"
        >
          <Image
            src="/images/geo-qrcode.png"
            alt="移山科技微信二维码"
            width={110}
            height={110}
            className="rounded-lg bg-white p-1 flex-shrink-0"
          />
          <div className="text-slate-900 font-bold text-lg sm:text-xl">
            <p>微信扫描二维码</p>
            <p>
              回复: <span className="text-white">GEO白皮书</span>
            </p>
            <p>即可免费领取!</p>
          </div>
        </motion.div>

        {/* 说明文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-xs sm:text-sm text-gray-600"
        >
          PDF电子白皮书（永久免费领取）
        </motion.p>
      </div>

      {/* 右侧：3D 书本展示 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex justify-center items-center"
      >
        <BookCover />
      </motion.div>
    </motion.div>
  );
}

