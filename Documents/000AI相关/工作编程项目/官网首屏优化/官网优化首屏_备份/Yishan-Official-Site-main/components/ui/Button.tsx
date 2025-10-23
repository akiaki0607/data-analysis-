import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] text-white hover:from-[#7C3AED] hover:to-[#8B5CF6] shadow-lg hover:shadow-xl hover:shadow-[#8B5CF6]/25 hover:scale-105 transition-all duration-300",
    secondary:
      "bg-[#0EA5E9] text-white hover:bg-[#0369A1] shadow-md hover:shadow-lg hover:shadow-[#0EA5E9]/25 transition-all duration-300",
    outline:
      "border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9] hover:text-white transition-all duration-300",
    ghost: "text-[#475569] hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-all duration-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 sm:px-4 sm:py-2 text-sm",
    md: "px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base",
    lg: "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

