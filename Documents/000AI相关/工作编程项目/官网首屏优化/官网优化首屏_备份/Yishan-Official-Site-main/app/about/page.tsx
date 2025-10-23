import { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Target, Users, Award, Heart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "关于我们 - 专注GEO的AI搜索优化专家 | 移山科技",
  description:
    "移山科技成立于2023年，是国内领先的GEO服务商。我们专注于帮助企业在AI搜索时代实现增长，拥有专业的技术团队和丰富的行业经验。",
  keywords: "关于移山科技, GEO服务商, AI优化团队, 公司简介",
};

const values = [
  {
    icon: Target,
    title: "专注专业",
    description: "深耕GEO领域，持续研究AI搜索算法，为客户提供最专业的优化服务。",
  },
  {
    icon: Users,
    title: "客户至上",
    description: "以客户成功为目标，提供定制化解决方案，确保每个客户都能获得显著增长。",
  },
  {
    icon: Award,
    title: "追求卓越",
    description: "不断创新优化方法，追求行业最佳实践，帮助客户在AI时代保持竞争力。",
  },
  {
    icon: Heart,
    title: "诚信透明",
    description: "坚持数据驱动，透明展示优化效果，与客户建立长期信任关系。",
  },
];

// 暂时注释掉团队成员信息
// const team = [
//   {
//     name: "张伟",
//     role: "创始人 & CEO",
//     bio: "前百度搜索算法工程师，10年搜索引擎优化经验，GEO领域先行者。",
//   },
//   {
//     name: "李娜",
//     role: "首席技术官",
//     bio: "AI大模型专家，曾就职于字节跳动，专注于AI内容生成和优化技术。",
//   },
//   {
//     name: "王强",
//     role: "首席数据官",
//     bio: "数据科学家，擅长数据分析和策略优化，帮助客户实现数据驱动增长。",
//   },
//   {
//     name: "刘芳",
//     role: "客户成功总监",
//     bio: "10年B2B服务经验，深入理解客户需求，确保服务质量和客户满意度。",
//   },
// ];

// 暂时注释掉发展历程信息
// const milestones = [
//   { year: "2023", event: "公司成立，专注GEO服务" },
//   { year: "2023", event: "服务首批10家企业客户" },
//   { year: "2024", event: "客户数突破100家，覆盖多个行业" },
//   { year: "2024", event: "发布GEO优化白皮书" },
//   { year: "2025", event: "服务客户超过500家，成为行业领导者" },
// ];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="text-yellow-400" size={18} />
              <span className="text-sm text-white">关于我们</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              让企业在AI时代
              <br />
              <span className="text-white">
                移山填海
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              移山科技成立于2023年，是国内领先的GEO（AI搜索引擎优化）服务商
              <br />
              我们专注于帮助企业在AI搜索时代实现可持续增长
            </p>
          </div>
        </Container>
      </Section>

      {/* Mission Section */}
      <Section className="bg-transparent">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                我们的使命
              </h2>
              <p className="text-2xl text-gray-300 leading-relaxed">
                在AI搜索快速发展的今天，传统SEO已经不够。
                我们相信，企业需要全新的优化策略来适应AI时代。
                移山科技致力于成为企业最值得信赖的GEO合作伙伴，
                帮助每一个客户在AI搜索中占据领先地位。
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values Section */}
      <Section className="bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              核心价值观
            </h2>
            <p className="text-xl text-gray-400">
              这些价值观指引我们的每一个决策和行动
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} glass className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-[#635BFF]/20 rounded-2xl">
                    <value.icon className="text-[#635BFF]" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Team Section - 暂时注释掉
      <Section className="bg-transparent">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              核心团队
            </h2>
            <p className="text-xl text-gray-400">
              来自顶尖互联网公司的专业人才
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} glass hover className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-[#635BFF] rounded-full flex items-center justify-center">
                  <div className="text-3xl text-white font-bold">
                    {member.name[0]}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {member.name}
                </h3>
                <div className="text-sm text-[#635BFF] mb-3">{member.role}</div>
                <p className="text-gray-400 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      */}

      {/* Timeline Section - 暂时注释掉
      <Section className="bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              发展历程
            </h2>
            <p className="text-xl text-gray-400">
              从创立到成为行业领导者
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#635BFF] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                  <Card glass className="flex-1">
                    <p className="text-gray-300">{milestone.event}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      */}

      {/* Contact Section */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                联系方式
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                我们期待与您交流，共同探索AI搜索时代的增长机会
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card glass className="text-center">
                <div className="text-blue-400 mb-2">📧</div>
                <div className="text-white font-semibold mb-1">邮箱</div>
                <div className="text-gray-400 text-sm">
                  19993397696@163.com
                </div>
              </Card>
              <Card glass className="text-center">
                <div className="text-blue-400 mb-2">📱</div>
                <div className="text-white font-semibold mb-1">电话</div>
                <div className="text-gray-400 text-sm">13359282414</div>
              </Card>
              <Card glass className="text-center">
                <div className="text-blue-400 mb-2">📍</div>
                <div className="text-white font-semibold mb-1">地址</div>
                <div className="text-gray-400 text-sm">
                  北京市朝阳区曙光西里甲5号院
                  <br />
                  16号楼21层2101内2107C1室
                </div>
              </Card>
            </div>

            <div className="text-center">
              <Link href="/contact">
                <Button variant="primary" size="lg">
                  预约咨询
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}


