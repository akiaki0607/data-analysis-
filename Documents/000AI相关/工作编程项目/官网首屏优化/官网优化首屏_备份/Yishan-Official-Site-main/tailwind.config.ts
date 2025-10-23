import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-sans-sc)", "var(--font-inter)", "system-ui", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        noto: ["var(--font-noto-sans-sc)", "sans-serif"],
      },
      colors: {
        background: "#FAFBFC",     // 极浅蓝灰（比之前更亮）
        foreground: "#0F172A",     // 深板岩色
        brand: {
          // 主色 - 天空蓝系
          primary: "#0EA5E9",      // 天空蓝（主色）- 明亮活力
          primaryDark: "#0369A1",  // 深天空蓝（hover）
          primaryLight: "#7DD3FC", // 浅天空蓝（装饰）

          // 强调色 - 紫罗兰系
          accent: "#8B5CF6",       // 紫罗兰（CTA按钮）
          accentDark: "#7C3AED",   // 深紫（hover）
          accentLight: "#C4B5FD",  // 浅紫（badge背景）

          // 辅助色
          cyan: "#06B6D4",         // 青蓝（icon/装饰）
          electric: "#3B82F6",     // 电蓝（渐变）
          green: "#20d95c",        // 保留向后兼容
        },
        text: {
          primary: "#0F172A",      // 深板岩（标题）
          secondary: "#475569",    // 中板岩（正文）
          muted: "#64748B",        // 浅板岩（辅助）
          inverse: "#F8FAFC",      // 白色（深色背景上文本）
        },
        surface: {
          base: "#FFFFFF",         // 卡片背景
          elevated: "#F8FAFC",     // 悬浮卡片
          hover: "#F1F5F9",        // hover状态
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)",
        "gradient-hero": "linear-gradient(135deg, #0EA5E9 0%, #3B82F6 50%, #8B5CF6 100%)",
        "gradient-accent": "linear-gradient(135deg, #8B5CF6 0%, #C4B5FD 100%)",
      },
    },
  },
  plugins: [],
};

export default config;

