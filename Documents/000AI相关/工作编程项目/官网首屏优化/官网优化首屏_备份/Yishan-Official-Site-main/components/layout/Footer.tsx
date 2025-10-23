import Link from "next/link";
import Container from "../ui/Container";
import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  services: {
    title: "服务",
    links: [
      { name: "GEO服务", href: "/services/geo" },
      { name: "AI内容生成", href: "/services/geo#content" },
      { name: "智能优化", href: "/services/geo#optimization" },
      { name: "数据分析", href: "/services/geo#analytics" },
    ],
  },
  company: {
    title: "公司",
    links: [
      { name: "关于我们", href: "/about" },
      { name: "成功案例", href: "/cases" },
      { name: "观点洞察", href: "/blog" },
      { name: "联系我们", href: "/contact" },
    ],
  },
  resources: {
    title: "资源",
    links: [
      { name: "行业报告", href: "/blog?category=report" },
      { name: "GEO指南", href: "/blog?category=guide" },
      { name: "最佳实践", href: "/blog?category=practice" },
      { name: "常见问题", href: "/about#faq" },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F8FAFC] border-t border-gray-200">
      <Container>
        {/* Main Footer Content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-xl sm:text-2xl font-bold text-[#0EA5E9]">
                移山科技
              </div>
            </Link>
            <p className="text-[#475569] text-sm sm:text-base mb-6 max-w-md">
              专注于AI驱动的搜索引擎优化（GEO），
              帮助企业在AI搜索时代占据领先地位，
              让您的品牌被AI优先推荐。
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-[#475569] text-sm sm:text-base">
                <Phone size={18} />
                <span>13359282414</span>
              </div>
              <div className="flex items-center space-x-3 text-[#475569] text-sm sm:text-base">
                <Mail size={18} />
                <span>19993397696@163.com</span>
              </div>
              <div className="flex items-start space-x-3 text-[#475569] text-sm sm:text-base">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <div className="flex flex-col space-y-1">
                  <span>北京总公司：北京市朝阳区凤凰置地广场A座21层</span>
                  <span>西安办公地：陕西省西安市碑林区长安国际中心E座22层</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-[#0F172A] font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{section.title}</h3>
              <ul className="space-y-2 sm:space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#475569] hover:text-[#0EA5E9] transition-colors text-sm sm:text-base"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-[#64748B] text-xs sm:text-sm text-center md:text-left">
              © {currentYear} 移山科技. All Rights Reserved. 京ICP备2020035710号-7
            </div>
            <div className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm text-[#64748B]">
              <Link href="/privacy" className="hover:text-[#0EA5E9] transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-[#0EA5E9] transition-colors">
                服务条款
              </Link>
              <Link href="/sitemap.xml" className="hover:text-[#0EA5E9] transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

