"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import Section from "../ui/Section";
import { TrendingUp, Users, Award, Zap } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: 350,
    suffix: "%",
    label: "平均AI推荐率提升",
    color: "from-[#8B5CF6] to-[#0EA5E9]",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "服务企业客户",
    color: "from-[#8B5CF6] to-[#0EA5E9]",
  },
  {
    icon: Award,
    value: 99,
    suffix: "%",
    label: "客户满意度",
    color: "from-[#8B5CF6] to-[#0EA5E9]",
  },
  {
    icon: Zap,
    value: 72,
    suffix: "小时",
    label: "最快见效周期",
    color: "from-[#8B5CF6] to-[#0EA5E9]",
  },
];

function AnimatedNumber({
  value,
  suffix,
}: {
  value: number;
  suffix: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString() + suffix;
      }
    });
  }, [springValue, suffix]);

  return <div ref={ref} className="text-4xl sm:text-5xl md:text-6xl font-bold" />;
}

export default function StatsSection() {
  return (
    <Section className="bg-transparent relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#0EA5E9]/5" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9]" />

      <div className="relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
              用数据说话
            </h2>
            <p className="text-xl text-[#475569]">
              真实可靠的业绩表现，值得信赖的合作伙伴
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center justify-center"
            >
              <div className="relative group flex flex-col items-center min-h-[200px] sm:min-h-[220px] md:min-h-[240px] justify-end pb-3 sm:pb-4">
                {/* Icon */}
                <div className="mb-4 sm:mb-5 md:mb-6 flex justify-center">
                  <div
                    className={`p-3 sm:p-4 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}
                  >
                    <stat.icon className="text-white" size={32} />
                  </div>
                </div>

                {/* Number */}
                <div
                  className={`bg-gradient-to-r ${stat.color} bg-clip-text text-transparent font-mono`}
                >
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>

                {/* Label */}
                <div className="text-[#475569] text-base sm:text-lg text-center pt-1.5 sm:pt-2">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

