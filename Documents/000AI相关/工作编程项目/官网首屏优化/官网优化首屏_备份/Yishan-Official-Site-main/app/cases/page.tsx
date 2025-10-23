import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import { ArrowUpRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "成功案例 - GEO优化实战成果 | 移山科技",
  description:
    "查看移山科技的GEO优化成功案例，了解我们如何帮助企业在AI搜索引擎中获得显著增长。包括SaaS、电商、教育等多个行业的真实案例。",
  keywords: "GEO案例, AI优化案例, 搜索优化成果, 客户案例",
};

const allCases = [
  {
    id: 1,
    company: "科技独角兽A",
    industry: "企业服务",
    title: "AI推荐率提升450%，获客成本降低60%",
    description:
      "该SaaS企业专注于企业协作工具，面临传统SEO效果下降的困境。通过系统化的GEO优化，在主流AI搜索引擎中的推荐率大幅提升，3个月内自然流量增长300%，获客成本显著降低。",
    challenge: "传统SEO流量下降，AI搜索中品牌曝光不足",
    solution:
      "内容重构+AI意图优化+技术架构升级+持续数据监控",
    results: [
      { label: "AI推荐率", value: "+450%" },
      { label: "自然流量", value: "+300%" },
      { label: "获客成本", value: "-60%" },
      { label: "转化率", value: "+85%" },
    ],
    tags: ["SaaS", "B2B", "企业服务"],
    duration: "3个月",
  },
  {
    id: 2,
    company: "电商品牌B",
    industry: "电商零售",
    title: "品牌声量提升5倍，转化率翻倍",
    description:
      "知名消费品电商品牌，在激烈的市场竞争中寻求突破。针对消费品行业特点，优化AI对话中的品牌呈现，成功抢占AI推荐高地，实现销售额显著增长。",
    challenge: "品牌声量不足，在AI推荐中排名靠后",
    solution: "品牌声誉管理+内容营销+数据驱动优化",
    results: [
      { label: "品牌声量", value: "+500%" },
      { label: "转化率", value: "+120%" },
      { label: "销售额", value: "+280%" },
      { label: "复购率", value: "+65%" },
    ],
    tags: ["电商", "消费品", "品牌营销"],
    duration: "4个月",
  },
  {
    id: 3,
    company: "教育平台C",
    industry: "在线教育",
    title: "用户留存提升80%，口碑传播指数增长400%",
    description:
      "在线学习平台在用户获取和留存上遇到瓶颈。通过AI内容优化和品牌声誉管理，在教育领域建立权威形象，成为AI优先推荐的学习平台。",
    challenge: "用户增长放缓，品牌认知度不足",
    solution: "内容权威化+用户口碑优化+AI推荐策略",
    results: [
      { label: "用户留存", value: "+80%" },
      { label: "口碑指数", value: "+400%" },
      { label: "注册转化", value: "+165%" },
      { label: "课程完成率", value: "+55%" },
    ],
    tags: ["教育", "在线学习", "知识付费"],
    duration: "5个月",
  },
  {
    id: 4,
    company: "金融科技D",
    industry: "金融科技",
    title: "品牌信任度提升90%，用户咨询量增长350%",
    description:
      "金融科技公司在严格监管环境下，需要建立用户信任。通过精准的GEO策略和合规内容优化，在AI搜索中建立权威形象。",
    challenge: "行业监管严格，用户信任度建立困难",
    solution: "合规内容优化+权威性建设+风险管理",
    results: [
      { label: "品牌信任", value: "+90%" },
      { label: "咨询量", value: "+350%" },
      { label: "注册率", value: "+200%" },
      { label: "投资转化", value: "+140%" },
    ],
    tags: ["金融科技", "合规", "信任建设"],
    duration: "6个月",
  },
  {
    id: 5,
    company: "医疗健康E",
    industry: "医疗健康",
    title: "专业权威性提升，问诊量增长280%",
    description:
      "在线医疗平台需要在AI搜索中建立专业形象。通过医疗内容的专业化优化和权威背书，成为AI优先推荐的医疗咨询平台。",
    challenge: "医疗内容专业性要求高，竞争激烈",
    solution: "专业内容审核+权威背书+用户评价优化",
    results: [
      { label: "问诊量", value: "+280%" },
      { label: "医生入驻", value: "+150%" },
      { label: "用户满意", value: "96%" },
      { label: "复诊率", value: "+75%" },
    ],
    tags: ["医疗", "健康", "专业服务"],
    duration: "4个月",
  },
  {
    id: 6,
    company: "智能硬件F",
    industry: "智能硬件",
    title: "产品曝光提升600%，电商转化增长220%",
    description:
      "智能硬件品牌在新品推广中采用GEO策略，在AI搜索中快速建立品牌认知，实现销售突破。",
    challenge: "新品知名度低，传统广告成本高",
    solution: "产品内容优化+技术参数展示+用户评价管理",
    results: [
      { label: "产品曝光", value: "+600%" },
      { label: "电商转化", value: "+220%" },
      { label: "品牌搜索", value: "+400%" },
      { label: "好评率", value: "94%" },
    ],
    tags: ["智能硬件", "消费电子", "新品推广"],
    duration: "3个月",
  },
];

const categories = [
  "全部",
  "企业服务",
  "电商零售",
  "在线教育",
  "金融科技",
  "医疗健康",
  "智能硬件",
];

export default function CasesPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="text-[#635BFF]" size={18} />
              <span className="text-sm text-gray-900">成功案例</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              他们的成功，您也可以复制
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              来自不同行业的企业，都在移山科技的帮助下
              <br />
              在AI搜索时代实现了显著增长
            </p>
          </div>
        </Container>
      </Section>

      {/* Cases Section */}
      <Section className="bg-gray-50">
        <Container>
          {/* Categories Filter - Placeholder for future interactivity */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  category === "全部"
                    ? "bg-[#635BFF] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#635BFF]/30 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {allCases.map((item) => (
              <Card key={item.id} glass hover className="h-[560px] md:h-[604px] flex flex-col group">
                {/* 头部信息 - 固定高度 */}
                <div className="flex items-start justify-between mb-3 md:mb-4 h-[52px] md:h-[60px] flex-shrink-0">
                  <div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                      {item.company}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{item.industry}</div>
                  </div>
                  <ArrowUpRight
                    className="text-[#635BFF] opacity-0 group-hover:opacity-100 transition-opacity"
                    size={20}
                  />
                </div>

                {/* 标题 - 固定高度，居中显示 */}
                <h3 className="text-lg md:text-xl font-bold text-[#635BFF] mb-2 md:mb-3 h-[24px] md:h-[28px] overflow-hidden flex-shrink-0 text-center">
                  {item.title}
                </h3>

                {/* 描述 - 固定高度 */}
                <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 h-[72px] flex-shrink-0">
                  {item.description}
                </p>

                {/* 挑战/方案/周期 - 固定高度 */}
                <div className="space-y-2 mb-4 h-[84px] flex-shrink-0 overflow-hidden">
                  <div className="text-sm">
                    <span className="text-gray-500">挑战：</span>
                    <span className="text-gray-700">{item.challenge}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">解决方案：</span>
                    <span className="text-gray-700">{item.solution}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">周期：</span>
                    <span className="text-gray-700">{item.duration}</span>
                  </div>
                </div>

                {/* Results Grid - 固定高度，确保全局对齐 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3 mb-3 md:mb-4 flex-shrink-0">
                  {item.results.map((result, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-end bg-gray-50 border border-gray-200 rounded-lg h-[68px] md:h-[72px] pb-2 md:pb-3 pt-2"
                    >
                      <div className="text-base md:text-lg font-bold text-[#635BFF] font-mono">
                        {result.value}
                      </div>
                      <div className="text-xs text-gray-600 text-center leading-tight pt-1.5 md:pt-2">
                        {result.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tags - 固定高度，整组居中对齐 */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 h-[28px] md:h-[32px] items-center justify-center flex-shrink-0">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 md:px-3 py-1 md:py-1.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              下一个成功案例就是您
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              立即联系我们，开启您的GEO增长之旅
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#635BFF] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#0A2540] transition-all"
            >
              免费咨询
            </Link>
          </div>
        </Container>
      </Section>
    </div>
  );
}


