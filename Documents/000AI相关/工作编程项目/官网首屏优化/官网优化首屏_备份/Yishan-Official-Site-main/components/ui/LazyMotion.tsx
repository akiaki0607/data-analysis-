"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";
import { ReactNode } from "react";

/**
 * LazyMotion wrapper for optimized framer-motion animations
 * Reduces bundle size by loading only the animations we use
 */
export function LazyMotionWrapper({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

// Export optimized motion component
export { m };

