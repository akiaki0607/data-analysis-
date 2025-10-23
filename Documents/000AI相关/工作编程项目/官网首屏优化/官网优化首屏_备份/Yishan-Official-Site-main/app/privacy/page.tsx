import { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "隐私政策 - 移山科技",
  description:
    "移山科技隐私政策，说明我们如何收集、使用和保护您的个人信息。",
  robots: "index, follow",
};

export default function PrivacyPage() {
  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            隐私政策
          </h1>

          <p className="text-gray-400 mb-8">
            最后更新日期：2025年1月
          </p>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. 引言
                </h2>
                <p className="leading-relaxed">
                  移山科技（以下简称"我们"）深知个人信息对您的重要性，我们将按照法律法规要求，采取相应的安全保护措施，尽力保护您的个人信息安全可控。本隐私政策将帮助您了解以下内容：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>我们如何收集和使用您的个人信息</li>
                  <li>我们如何使用Cookie和同类技术</li>
                  <li>我们如何共享、转让、公开披露您的个人信息</li>
                  <li>我们如何保护您的个人信息</li>
                  <li>您如何管理您的个人信息</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. 我们如何收集和使用您的个人信息
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.1 我们收集的信息
                </h3>
                <p className="leading-relaxed mb-4">
                  在您使用我们的服务时，我们可能会收集以下类型的信息：
                </p>

                <h4 className="text-lg font-semibold text-white mb-2">
                  (1) 您主动提供的信息
                </h4>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>
                    <strong>联系表单信息：</strong>
                    当您通过我们网站的联系表单咨询服务时，您需要提供姓名、电子邮箱、电话号码、公司名称和咨询内容。
                  </li>
                  <li>
                    <strong>订阅信息：</strong>
                    当您订阅我们的新闻通讯时，您需要提供电子邮箱地址。
                  </li>
                  <li>
                    <strong>服务使用信息：</strong>
                    当您成为我们的客户时，我们会收集必要的商业信息，包括公司详细信息、项目需求等。
                  </li>
                </ul>

                <h4 className="text-lg font-semibold text-white mb-2">
                  (2) 我们自动收集的信息
                </h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>设备信息：</strong>
                    设备型号、操作系统版本、浏览器类型和版本、屏幕分辨率等。
                  </li>
                  <li>
                    <strong>访问日志：</strong>
                    IP地址、访问时间、访问的页面、访问来源等。
                  </li>
                  <li>
                    <strong>Cookie和类似技术：</strong>
                    我们使用Cookie来提升用户体验和分析网站使用情况。
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  2.2 我们如何使用您的信息
                </h3>
                <p className="leading-relaxed mb-4">
                  我们会将收集到的信息用于以下用途：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>回应您的咨询和服务请求</li>
                  <li>提供、维护和改进我们的服务</li>
                  <li>发送服务相关的通知和更新</li>
                  <li>发送营销信息（您可以随时取消订阅）</li>
                  <li>进行数据分析和研究，改善用户体验</li>
                  <li>检测、预防和解决技术问题</li>
                  <li>保护我们的合法权益和履行法律义务</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. 我们如何使用Cookie和同类技术
                </h2>
                <p className="leading-relaxed mb-4">
                  Cookie是一种小型文本文件，当您访问网站时会存储在您的设备上。我们使用以下类型的Cookie：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>必要Cookie：</strong>
                    这些Cookie对于网站的基本功能是必需的，例如记住您的登录状态。
                  </li>
                  <li>
                    <strong>分析Cookie：</strong>
                    用于统计网站访问量和使用模式，帮助我们改进网站（使用Google Analytics等工具）。
                  </li>
                  <li>
                    <strong>功能Cookie：</strong>
                    用于记住您的偏好设置，提供个性化体验。
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  您可以通过浏览器设置管理或删除Cookie。但请注意，禁用某些Cookie可能会影响网站的功能。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. 我们如何共享、转让、公开披露您的个人信息
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">
                  4.1 共享
                </h3>
                <p className="leading-relaxed mb-4">
                  我们不会与第三方共享您的个人信息，除非：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>获得您的明确同意</li>
                  <li>
                    与服务提供商共享（如邮件服务提供商、分析工具提供商），这些服务提供商仅能在我们的指示下使用您的信息
                  </li>
                  <li>遵守法律法规或政府的强制性要求</li>
                  <li>保护公司、客户或公众的权益、财产或安全</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.2 转让
                </h3>
                <p className="leading-relaxed">
                  我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>获得您的明确同意</li>
                  <li>在涉及合并、收购或破产清算时，如涉及个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受本隐私政策的约束</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.3 公开披露
                </h3>
                <p className="leading-relaxed">
                  我们仅会在以下情况下公开披露您的个人信息：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>获得您的明确同意</li>
                  <li>基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. 我们如何保护您的个人信息
                </h2>
                <p className="leading-relaxed mb-4">
                  我们采取以下措施保护您的个人信息安全：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>数据加密：</strong>
                    我们使用SSL/TLS加密技术保护数据传输安全
                  </li>
                  <li>
                    <strong>访问控制：</strong>
                    严格限制能够访问个人信息的员工数量，并进行身份验证
                  </li>
                  <li>
                    <strong>安全措施：</strong>
                    使用防火墙、入侵检测系统等技术保护我们的系统
                  </li>
                  <li>
                    <strong>员工培训：</strong>
                    定期对员工进行隐私和安全培训
                  </li>
                  <li>
                    <strong>数据备份：</strong>
                    定期备份数据，防止数据丢失
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  尽管我们采取了上述措施，但请您理解，由于技术限制以及可能存在的恶意手段，即使我们竭尽所能加强安全措施，也不可能始终保证信息百分之百的安全。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. 您如何管理您的个人信息
                </h2>
                <p className="leading-relaxed mb-4">
                  您对自己的个人信息享有以下权利：
                </p>

                <h3 className="text-xl font-semibold text-white mb-3">
                  6.1 访问和更新您的信息
                </h3>
                <p className="leading-relaxed">
                  您有权访问和更新您的个人信息。您可以通过联系我们的客服来实现。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.2 删除您的信息
                </h3>
                <p className="leading-relaxed">
                  在以下情形中，您可以向我们提出删除个人信息的请求：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>如果我们处理个人信息的行为违反法律法规</li>
                  <li>如果我们收集、使用您的个人信息，却未征得您的同意</li>
                  <li>如果我们处理个人信息的行为违反了与您的约定</li>
                  <li>如果您注销了账号</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.3 撤回同意
                </h3>
                <p className="leading-relaxed">
                  您可以通过联系我们撤回您之前的同意。当您撤回同意后，我们将不再处理相应的个人信息。但您撤回同意的决定，不会影响此前基于您的授权而开展的个人信息处理。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.4 注销账号
                </h3>
                <p className="leading-relaxed">
                  您可以通过联系我们申请注销您的账号。注销账号后，我们将停止为您提供服务，并根据您的要求删除您的个人信息，法律法规另有规定的除外。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. 未成年人信息保护
                </h2>
                <p className="leading-relaxed">
                  我们的服务主要面向企业客户。我们不会主动收集未满18周岁未成年人的个人信息。如果您是未成年人的监护人，当您对您所监护的未成年人的个人信息有相关疑问时，请通过本隐私政策公示的联系方式与我们联系。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. 隐私政策的更新
                </h2>
                <p className="leading-relaxed">
                  我们可能会不时更新本隐私政策。当我们更新隐私政策时，我们会在本页面上发布更新后的版本，并更新"最后更新日期"。重大变更时，我们还会通过电子邮件或网站公告的方式通知您。
                </p>
                <p className="leading-relaxed mt-4">
                  我们鼓励您定期查看本隐私政策，以了解我们如何保护您的信息。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. 如何联系我们
                </h2>
                <p className="leading-relaxed mb-4">
                  如果您对本隐私政策有任何疑问、意见或建议，或者您需要行使您的个人信息权利，请通过以下方式联系我们：
                </p>
                <ul className="list-none space-y-2">
                  <li>
                    <strong>公司名称：</strong>移山科技
                  </li>
                  <li>
                    <strong>联系邮箱：</strong>
                    <a
                      href="mailto:privacy@geokeji.com"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      privacy@geokeji.com
                    </a>
                  </li>
                  <li>
                    <strong>联系地址：</strong>中国北京市
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  我们将在收到您的请求后15个工作日内予以回复。
                </p>
              </section>

              <section className="bg-gray-900/50 p-6 rounded-lg mt-8">
                <p className="text-sm text-gray-400">
                  本隐私政策的解释权及对本隐私政策未尽事宜的解释权归移山科技所有。如本隐私政策的中文版本与其他语言版本存在不一致，以中文版本为准。
                </p>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

