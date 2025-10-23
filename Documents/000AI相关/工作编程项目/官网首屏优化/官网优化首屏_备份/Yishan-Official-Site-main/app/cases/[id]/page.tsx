import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import {
  getCaseStudyById,
  getAllCaseStudies,
  getRelatedCaseStudies,
} from "@/lib/cases";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";

interface CaseStudyPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 生成静态路径
export async function generateStaticParams() {
  const cases = getAllCaseStudies();
  return cases.map((caseStudy) => ({
    id: caseStudy.id,
  }));
}

// 生成元数据
export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { id } = await params;
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    return {
      title: "案例未找到",
    };
  }

  return {
    title: `${caseStudy.title} - 移山科技案例研究`,
    description: caseStudy.description,
    keywords: `GEO案例, ${caseStudy.industry}, AI搜索优化, ${caseStudy.client}`,
    openGraph: {
      title: caseStudy.title,
      description: caseStudy.description,
      type: "article",
      images: caseStudy.imageUrl ? [caseStudy.imageUrl] : [],
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { id } = await params;
  const caseStudy = getCaseStudyById(id);

  if (!caseStudy) {
    notFound();
  }

  const relatedCases = getRelatedCaseStudies(id);

  return (
    <div className="min-h-screen bg-gray-950 py-20">
      <Container>
        {/* 返回链接 */}
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 text-[#635BFF] hover:text-[#0A2540] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回案例列表
        </Link>

        {/* 案例头部 */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#635BFF]/10 text-[#635BFF] rounded-full text-sm font-medium">
              {caseStudy.industry}
            </span>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>项目周期：{caseStudy.timeline}</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {caseStudy.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-400 mb-8">
            <Building2 className="w-5 h-5" />
            <span className="text-lg">{caseStudy.client}</span>
          </div>

          <p className="text-xl text-gray-300 leading-relaxed">
            {caseStudy.description}
          </p>
        </div>

        {/* 关键成果数据 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-6 h-6 text-[#635BFF]" />
            <h2 className="text-3xl font-bold text-white">关键成果</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudy.results.map((result, index) => (
              <Card
                key={index}
                className="bg-[#635BFF]/10 border-[#635BFF]/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    {result.metric}
                  </h3>
                  <Award className="w-5 h-5 text-[#635BFF]" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">优化前：</span>
                    <span className="text-gray-300 font-mono">
                      {result.before}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">优化后：</span>
                    <span className="text-blue-500 font-mono font-bold">
                      {result.after}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <span className="text-blue-400 font-semibold">
                      {result.improvement}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 挑战 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">面临的挑战</h2>
          <Card className="bg-gray-900/50">
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {caseStudy.challenge}
            </p>
          </Card>
        </section>

        {/* 解决方案 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">解决方案</h2>
          <Card className="bg-gray-900/50">
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line mb-6">
              {caseStudy.solution}
            </p>

            {caseStudy.services.length > 0 && (
              <div className="pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">
                  提供的服务
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {caseStudy.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* 客户反馈 */}
        {caseStudy.testimonial && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">客户反馈</h2>
            <Card className="bg-[#635BFF]/20 border-[#635BFF]/30">
              <blockquote className="text-xl text-gray-200 italic leading-relaxed mb-6">
                "{caseStudy.testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#635BFF] flex items-center justify-center text-white font-bold text-lg">
                  {caseStudy.testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {caseStudy.testimonial.author}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {caseStudy.testimonial.position} - {caseStudy.client}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* 相关案例 */}
        {relatedCases.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">更多案例</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedCases.map((relatedCase) => (
                <Link key={relatedCase.id} href={`/cases/${relatedCase.id}`}>
                  <Card className="h-full hover:border-blue-500 transition-all duration-300">
                    <div className="mb-4">
                      <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">
                        {relatedCase.industry}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {relatedCase.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {relatedCase.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>{relatedCase.client}</span>
                      <span>•</span>
                      <span>{relatedCase.timeline}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section>
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-white">
                准备开始您的GEO优化之旅？
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                我们已经帮助数百家企业在AI搜索时代建立了强大的品牌影响力。
                无论您的行业和规模，我们都能为您定制专属的GEO解决方案。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  联系我们
                </Link>
                <Link
                  href="/services/geo"
                  className="px-8 py-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  了解服务
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </Container>
    </div>
  );
}

