import { Metadata } from "next";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "服务条款 - 移山科技",
  description: "移山科技服务条款，规定使用我们网站和服务的条件。",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            服务条款
          </h1>

          <p className="text-gray-400 mb-8">
            最后更新日期：2025年1月
          </p>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  1. 接受条款
                </h2>
                <p className="leading-relaxed">
                  欢迎使用移山科技（以下简称"我们"或"移山科技"）提供的网站和服务。通过访问或使用我们的网站
                  (www.geokeji.com) 和相关服务（统称为"服务"），您同意接受并遵守本服务条款。
                </p>
                <p className="leading-relaxed mt-4">
                  如果您不同意本服务条款的任何部分，请不要使用我们的服务。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  2. 服务说明
                </h2>
                <p className="leading-relaxed mb-4">
                  移山科技提供以下服务：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>GEO（生成式引擎优化）咨询服务：</strong>
                    帮助企业在ChatGPT、Perplexity等AI搜索引擎中提升品牌曝光和推荐率
                  </li>
                  <li>
                    <strong>内容优化服务：</strong>
                    创作和优化适合AI搜索引擎的内容
                  </li>
                  <li>
                    <strong>技术实施服务：</strong>
                    实施必要的技术优化，包括结构化数据标记等
                  </li>
                  <li>
                    <strong>培训和指导服务：</strong>
                    为企业团队提供GEO培训和持续指导
                  </li>
                  <li>
                    <strong>效果监控服务：</strong>
                    跟踪和分析GEO优化效果
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  具体服务内容和范围以双方签订的服务合同为准。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  3. 用户责任
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">
                  3.1 账号安全
                </h3>
                <p className="leading-relaxed">
                  如果您创建了账号，您需要：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>提供准确、完整的注册信息</li>
                  <li>及时更新您的信息以保持准确性</li>
                  <li>对您账号下的所有活动负责</li>
                  <li>立即通知我们任何未经授权的账号使用</li>
                  <li>保护好您的登录凭证</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.2 合法使用
                </h3>
                <p className="leading-relaxed mb-4">
                  您同意在使用我们的服务时：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>遵守所有适用的法律法规</li>
                  <li>不侵犯他人的知识产权</li>
                  <li>不发布虚假、误导性或欺诈性信息</li>
                  <li>不干扰或破坏服务的正常运行</li>
                  <li>不进行任何未经授权的访问或使用</li>
                  <li>不从事任何不正当竞争行为</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  3.3 内容责任
                </h3>
                <p className="leading-relaxed">
                  您对通过我们服务提交、发布或展示的任何内容（"用户内容"）负全部责任。您声明并保证：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>您拥有用户内容的所有权或必要的许可</li>
                  <li>用户内容不侵犯任何第三方的权利</li>
                  <li>用户内容不违反任何适用的法律法规</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  4. 知识产权
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">
                  4.1 我们的知识产权
                </h3>
                <p className="leading-relaxed">
                  除用户内容外，服务中的所有内容（包括但不限于文本、图形、图像、代码、软件、商标、服务标记）均为移山科技或其许可方的财产，受著作权法、商标法和其他知识产权法律的保护。
                </p>
                <p className="leading-relaxed mt-4">
                  未经我们事先书面许可，您不得复制、修改、分发、出售或以其他方式利用我们的知识产权。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.2 用户内容许可
                </h3>
                <p className="leading-relaxed">
                  通过向我们提交用户内容，您授予我们一项全球性的、非独家的、免版税的许可，以使用、复制、修改、改编、发布和展示该内容，用于提供和改进我们的服务。
                </p>
                <p className="leading-relaxed mt-4">
                  此许可不转移用户内容的所有权，您保留对用户内容的所有权利。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  4.3 服务成果
                </h3>
                <p className="leading-relaxed">
                  我们为您提供的服务成果（如优化后的内容、技术实施等）的知识产权归属和使用权限，以双方签订的服务合同约定为准。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  5. 付费服务
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">
                  5.1 服务费用
                </h3>
                <p className="leading-relaxed">
                  某些服务需要付费。费用标准、支付方式和支付时间将在服务合同中明确规定。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.2 发票和税务
                </h3>
                <p className="leading-relaxed">
                  我们将根据您的要求提供合法有效的发票。您需要按照适用的税法规定承担相应的税务责任。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  5.3 退款政策
                </h3>
                <p className="leading-relaxed">
                  退款政策将根据具体服务类型在服务合同中明确规定。一般情况下：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>已经开始提供的服务不予退款</li>
                  <li>因我们的原因导致服务无法提供的，将按比例退款</li>
                  <li>具体退款条件以服务合同约定为准</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  6. 服务保证和免责声明
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">
                  6.1 服务保证
                </h3>
                <p className="leading-relaxed">
                  我们承诺：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>按照行业标准提供专业的GEO服务</li>
                  <li>尽最大努力实现约定的优化目标</li>
                  <li>保护客户的商业机密和个人信息</li>
                  <li>及时回应客户的咨询和问题</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  6.2 免责声明
                </h3>
                <p className="leading-relaxed mb-4">
                  我们的服务按"现状"提供。在法律允许的最大范围内，我们不对以下事项作出保证：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>效果保证：</strong>
                    由于AI搜索引擎的算法不断变化，我们无法保证特定的优化效果或排名
                  </li>
                  <li>
                    <strong>时间保证：</strong>
                    优化效果的显现时间可能因多种因素而有所不同
                  </li>
                  <li>
                    <strong>持续性：</strong>
                    AI平台的算法更新可能影响已有的优化成果
                  </li>
                  <li>
                    <strong>竞争影响：</strong>
                    竞争对手的行为可能影响您的表现
                  </li>
                  <li>
                    <strong>第三方平台：</strong>
                    我们不对ChatGPT、Perplexity等第三方平台的运营负责
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  7. 责任限制
                </h2>
                <p className="leading-relaxed mb-4">
                  在法律允许的最大范围内：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    我们的总责任不超过您为相关服务支付的费用金额
                  </li>
                  <li>
                    我们不对任何间接的、偶然的、特殊的、惩罚性的或后果性的损害负责
                  </li>
                  <li>
                    我们不对由于您违反本服务条款造成的任何损失负责
                  </li>
                  <li>
                    我们不对第三方平台（如AI搜索引擎）的行为或决定负责
                  </li>
                </ul>
                <p className="leading-relaxed mt-4">
                  上述责任限制不适用于因我们的故意或重大过失导致的损害。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  8. 服务变更和终止
                </h2>

                <h3 className="text-xl font-semibold text-white mb-3">
                  8.1 服务变更
                </h3>
                <p className="leading-relaxed">
                  我们保留随时修改、暂停或终止服务（或其任何功能）的权利。我们将尽合理努力提前通知您重大变更。
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">
                  8.2 服务终止
                </h3>
                <p className="leading-relaxed">
                  我们可能在以下情况下终止您对服务的访问：
                </p>
                <ul className="list-disc list-inside space-y-2 mt-4">
                  <li>您违反本服务条款</li>
                  <li>您的行为可能对我们或其他用户造成法律责任</li>
                  <li>您的账号长期未使用</li>
                  <li>基于合法的商业或法律原因</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  您也可以随时停止使用我们的服务。如果您是付费客户，终止服务的条件和流程将按照服务合同的约定执行。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  9. 争议解决
                </h2>
                <p className="leading-relaxed mb-4">
                  如果您对我们的服务有任何争议或不满，我们鼓励您首先通过以下方式与我们联系：
                </p>
                <ul className="list-none space-y-2 mb-4">
                  <li>
                    <strong>电子邮箱：</strong>
                    <a
                      href="mailto:support@geokeji.com"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      support@geokeji.com
                    </a>
                  </li>
                </ul>
                <p className="leading-relaxed">
                  我们将尽力通过友好协商解决争议。如果协商不成，任何争议应提交至北京市有管辖权的人民法院解决。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  10. 适用法律
                </h2>
                <p className="leading-relaxed">
                  本服务条款受中华人民共和国法律管辖，并按其解释。如果本服务条款的任何条款被认定为无效或不可执行，该条款将被解释为反映双方的原意，其余条款继续完全有效。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  11. 条款更新
                </h2>
                <p className="leading-relaxed">
                  我们可能会不时更新本服务条款。当我们做出重大变更时，我们会通过电子邮件或在网站上发布显著通知的方式告知您。
                </p>
                <p className="leading-relaxed mt-4">
                  更新后的服务条款将在发布之日起生效。在更新后继续使用我们的服务，即表示您接受更新后的服务条款。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">
                  12. 联系我们
                </h2>
                <p className="leading-relaxed mb-4">
                  如果您对本服务条款有任何疑问，请通过以下方式联系我们：
                </p>
                <ul className="list-none space-y-2">
                  <li>
                    <strong>公司名称：</strong>移山科技
                  </li>
                  <li>
                    <strong>电子邮箱：</strong>
                    <a
                      href="mailto:legal@geokeji.com"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      legal@geokeji.com
                    </a>
                  </li>
                  <li>
                    <strong>联系地址：</strong>中国北京市
                  </li>
                </ul>
              </section>

              <section className="bg-gray-900/50 p-6 rounded-lg mt-8">
                <p className="text-sm text-gray-400">
                  本服务条款的最终解释权归移山科技所有。通过使用我们的服务，您确认已阅读、理解并同意接受本服务条款的约束。
                </p>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

