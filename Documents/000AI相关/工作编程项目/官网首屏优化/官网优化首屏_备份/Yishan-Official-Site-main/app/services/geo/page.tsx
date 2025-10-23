import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  Brain,
  Search,
  LineChart,
  Target,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "GEO服务 - AI搜索引擎优化解决方案 | 移山科技",
  description:
    "移山科技提供专业的GEO（Generative Engine Optimization）服务，包括AI内容优化、搜索排名提升、数据分析等。帮助企业在豆包、DeepSeek、腾讯元宝、Kimi等AI搜索引擎中获得更高曝光。",
  keywords: "GEO服务, AI搜索优化, 生成式引擎优化, AI内容优化, 搜索排名",
};

const features = [
  {
    icon: Brain,
    title: "AI内容智能生成",
    description:
      "基于大语言模型的智能内容创作，精准匹配AI搜索意图，让您的内容被AI优先理解和推荐。",
    points: [
      "智能写作辅助",
      "SEO意图分析",
      "语义优化建议",
      "多平台内容适配",
    ],
  },
  {
    icon: Search,
    title: "GEO搜索优化",
    description:
      "针对豆包、DeepSeek、腾讯元宝、Kimi等AI搜索引擎的专业优化，提升品牌在AI推荐中的排名。",
    points: [
      "AI索引优化",
      "推荐算法研究",
      "实时排名监控",
      "竞品对比分析",
    ],
  },
  {
    icon: LineChart,
    title: "数据洞察分析",
    description:
      "深度追踪AI搜索表现数据，提供可视化报表和优化建议，持续提升GEO效果。",
    points: [
      "数据追踪面板",
      "竞品数据分析",
      "趋势预测报告",
      "策略优化建议",
    ],
  },
  {
    icon: Target,
    title: "品牌声誉管理",
    description:
      "监控和优化品牌在AI对话中的呈现方式，确保正面信息被AI准确传达。",
    points: [
      "24/7声誉监控",
      "负面信息处理",
      "正向引导策略",
      "危机公关应对",
    ],
  },
];

const process = [
  {
    step: "01",
    title: "现状诊断",
    description: "全面评估品牌在AI搜索中的当前表现，识别优化机会和潜在问题。",
  },
  {
    step: "02",
    title: "策略制定",
    description: "基于诊断结果，制定个性化的GEO优化策略和实施路线图。",
  },
  {
    step: "03",
    title: "实施优化",
    description: "执行优化方案，包括内容优化、技术调整、数据追踪等工作。",
  },
  {
    step: "04",
    title: "效果监控",
    description: "持续监控优化效果，定期提供数据报告和优化建议。",
  },
  {
    step: "05",
    title: "持续迭代",
    description: "根据数据反馈不断调整策略，确保长期稳定的GEO表现。",
  },
];

// 暂时注释掉价格套餐信息
// const pricing = [
//   {
//     name: "基础版",
//     price: "¥9,999",
//     period: "/月",
//     description: "适合初创企业和小型团队",
//     features: [
//       "基础GEO优化",
//       "月度数据报告",
//       "5篇AI内容优化",
//       "邮件支持",
//       "基础培训",
//     ],
//     cta: "立即开始",
//     popular: false,
//   },
//   {
//     name: "专业版",
//     price: "¥29,999",
//     period: "/月",
//     description: "适合成长型企业",
//     features: [
//       "深度GEO优化",
//       "周度数据报告",
//       "20篇AI内容优化",
//       "竞品分析报告",
//       "专属客户经理",
//       "优先技术支持",
//       "线上培训课程",
//     ],
//     cta: "立即咨询",
//     popular: true,
//   },
//   {
//     name: "企业版",
//     price: "定制",
//     period: "",
//     description: "适合大型企业和集团",
//     features: [
//       "全方位GEO解决方案",
//       "实时数据监控",
//       "无限内容优化",
//       "深度竞品分析",
//       "专属优化团队",
//       "7x24小时支持",
//       "定制化培训",
//       "战略咨询服务",
//     ],
//     cta: "联系我们",
//     popular: false,
//   },
// ];

export default function GEOServicePage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section className="bg-transparent relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#635BFF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#635BFF]/10 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="text-[#635BFF]" size={18} />
              <span className="text-sm text-gray-900">专业GEO服务</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              GEO服务
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              全方位AI搜索引擎优化解决方案
              <br />
              让您的品牌在AI时代脱颖而出
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                免费咨询
              </Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              核心服务内容
            </h2>
            <p className="text-xl text-gray-600">
              从内容到数据，全方位的GEO优化服务
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card key={index} glass className="h-full">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 bg-[#635BFF]/20 rounded-xl">
                    <feature.icon className="text-[#635BFF]" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.points.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <CheckCircle2 className="text-[#635BFF]" size={18} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Process Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              服务流程
            </h2>
            <p className="text-xl text-gray-600">
              科学系统的优化流程，确保效果最大化
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <Card glass className="h-full text-center">
                  <div className="text-4xl font-bold text-[#635BFF] mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </Card>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-[#635BFF]" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pricing Section - 暂时注释掉
      <Section className="bg-transparent" id="pricing">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              服务套餐
            </h2>
            <p className="text-xl text-gray-400">
              选择适合您的GEO服务方案
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pricing.map((plan, index) => (
              <Card
                key={index}
                glass
                className={`h-full ${
                  plan.popular ? "border-2 border-[#635BFF]" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#635BFF] text-white text-sm px-4 py-1 rounded-full">
                      最受欢迎
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-end justify-center">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-400 ml-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-2 text-gray-300"
                    >
                      <CheckCircle2
                        className="text-blue-500 flex-shrink-0 mt-0.5"
                        size={18}
                      />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className="block">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      */}

      {/* CTA Section */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              准备好提升您的AI搜索表现了吗？
            </h2>
            <p className="text-xl text-gray-900 mb-8">
              立即联系我们，获取免费的GEO现状诊断和优化方案
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  免费咨询
                </Button>
              </Link>
              <Link href="/cases">
                <Button variant="outline" size="lg">
                  查看案例
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}


