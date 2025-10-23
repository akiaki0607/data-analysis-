import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: "sm" | "md" | "lg" | "full";
  id?: string;
}

export default function Section({
  children,
  className,
  containerSize = "lg",
  id,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-12 sm:py-16 md:py-20 lg:py-24", className)}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

