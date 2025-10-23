import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  tone?: "light" | "dark";
}

export default function Card({
  children,
  className,
  hover = false,
  glass = false,
  tone = "light",
}: CardProps) {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";

  const isDark = tone === "dark";

  const toneStyles = isDark
    ? "bg-gray-900/80 text-gray-100 border border-gray-800"
    : "bg-white/95 text-gray-900 border border-gray-200";

  const glassStyles = glass
    ? `${toneStyles} backdrop-blur-lg shadow-sm`
    : toneStyles;

  const hoverStyles = hover
    ? "hover:transform hover:scale-105 hover:shadow-2xl hover:border-[#635BFF]/50 cursor-pointer"
    : "";

  return (
    <div className={cn(baseStyles, glassStyles, hoverStyles, className)}>
      {children}
    </div>
  );
}

