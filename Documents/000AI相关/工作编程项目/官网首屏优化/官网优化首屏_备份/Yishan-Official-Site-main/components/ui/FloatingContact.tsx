"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showFirstVisitTip, setShowFirstVisitTip] = useState(false);

  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 首次访问检测
  useEffect(() => {
    const hasVisited = localStorage.getItem("wechat-contact-visited");
    
    if (!hasVisited) {
      setShowFirstVisitTip(true);
      localStorage.setItem("wechat-contact-visited", "true");
      
      // 3秒后隐藏提示
      const timer = setTimeout(() => {
        setShowFirstVisitTip(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* 悬浮按钮容器 */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            relative flex items-center gap-2 bg-[#635BFF] hover:bg-[#0A2540] text-white 
            rounded-full shadow-2xl transition-all duration-300
            ${isMobile ? 'flex-col py-3 px-4' : 'py-3 px-5'}
            ${showFirstVisitTip ? 'animate-pulse' : ''}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          aria-label="微信咨询"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <MessageCircle size={24} className={isMobile ? 'mb-1' : ''} />
              
              {/* 文字标签 - 始终显示 */}
              <span className={`text-sm font-medium whitespace-nowrap ${isMobile ? 'text-xs' : ''}`}>
                微信咨询
              </span>
            </>
          )}
        </motion.button>

        {/* 首次访问气泡提示 */}
        <AnimatePresence>
          {showFirstVisitTip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-full right-0 mb-2 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap"
            >
              <div className="relative">
                点击咨询
                {/* 小三角 */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                  <div className="border-8 border-transparent border-t-white"></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 展开的联系卡片 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 md:bottom-24 md:right-8 z-50 bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl p-4 md:p-6 shadow-2xl w-72 md:w-80"
          >
            <h3 className="text-gray-900 font-bold mb-4 text-center text-base md:text-lg">
              立即联系我们
            </h3>
            
            {/* 微信二维码 */}
            <div className="bg-white p-3 md:p-4 rounded-xl mb-4">
              <img
                src="/sales-wechat-qrcode.png"
                alt="企业微信二维码"
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-600 text-xs md:text-sm text-center mb-4">
              扫码添加企业微信 · 2分钟响应
            </p>

            {/* 电话 */}
            <a
              href="tel:13359282414"
              className="flex items-center justify-center gap-2 bg-[#635BFF] text-white px-4 py-2.5 md:py-3 rounded-lg hover:bg-[#0A2540] transition-colors text-sm md:text-base font-medium"
            >
              <Phone size={18} />
              <span>133-5928-2414</span>
            </a>
            <p className="text-gray-600 text-xs text-center mt-2">
              工作日 9:00-18:00
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

