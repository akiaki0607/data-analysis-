export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  description: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  timeline: string;
  services: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
  };
  imageUrl?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    id: "saas-project-management",
    title: "B2B SaaS项目管理平台3个月品牌提及率提升300%",
    client: "某项目管理SaaS平台",
    industry: "企业软件/SaaS",
    description:
      "一家专注于中小企业的项目管理SaaS平台，在竞争激烈的市场中面临获客成本高、品牌知名度低的挑战。通过系统化的GEO策略，在3个月内实现了品牌在AI搜索引擎中从零曝光到高推荐率的跨越式增长。",
    challenge:
      "客户获取成本从800元/客户飙升至1800元/客户，增长125%；在ChatGPT、Perplexity等AI搜索引擎中品牌提及率为零；传统SEO效果递减，面临AI搜索时代被边缘化的风险；销售周期长达90天，需要大量时间建立客户信任。",
    solution:
      "实施全面的GEO优化策略，包括：重构官网内容，采用问答式结构和自然语言表达；创建60篇深度专业文章，覆盖用户完整决策旅程；添加完整的Schema.org结构化数据标记；获取10篇权威媒体报道，建立外部信任；完善第三方平台（G2、Capterra等）的品牌信息；建立每日监控机制，快速迭代优化。",
    results: [
      {
        metric: "品牌提及率",
        before: "0%",
        after: "65%",
        improvement: "从零到行业前三",
      },
      {
        metric: "AI来源流量",
        before: "0访问/月",
        after: "2500访问/月",
        improvement: "占总流量18%",
      },
      {
        metric: "演示请求",
        before: "120个/月",
        after: "195个/月",
        improvement: "+62.5%",
      },
      {
        metric: "客户获取成本",
        before: "¥1800",
        after: "¥1350",
        improvement: "降低25%",
      },
      {
        metric: "销售周期",
        before: "90天",
        after: "72天",
        improvement: "缩短20%",
      },
      {
        metric: "3个月ROI",
        before: "-",
        after: "234%",
        improvement: "快速回报",
      },
    ],
    timeline: "3个月",
    services: [
      "GEO策略咨询",
      "内容优化与创作",
      "技术实施",
      "媒体关系建设",
      "持续监控与优化",
    ],
    testimonial: {
      quote:
        "与移山科技合作GEO优化是我们2024年最正确的决策之一。仅用3个月，我们的品牌就在ChatGPT中获得了稳定的推荐，来自AI搜索的高质量询盘占比已达35%。更重要的是，这些线索的转化率比传统渠道高出50%，因为用户通过AI已经对我们有了充分了解。",
      author: "张总",
      position: "营销副总裁",
    },
    imageUrl: "/images/cases/saas-case.jpg",
  },
  {
    id: "ecommerce-fashion",
    title: "时尚电商品牌通过GEO实现AI搜索曝光率提升400%",
    client: "某新锐时尚电商品牌",
    industry: "电子商务/时尚",
    description:
      "一家专注于年轻消费者的新锐时尚电商品牌，在传统电商平台和社交媒体之外，希望开拓AI搜索这一新兴渠道。通过精准的GEO策略和内容优化，成功在ChatGPT、Perplexity等平台建立了强大的品牌影响力。",
    challenge:
      "年轻用户越来越多地使用AI助手进行购物决策，但品牌完全不在AI的推荐范围；电商平台广告成本持续上涨，ROI从3:1降至1.5:1；传统搜索引擎流量增长停滞，需要开拓新的获客渠道；品牌在「可持续时尚」、「国潮服饰」等关键领域缺乏认知。",
    solution:
      "制定电商垂直领域的GEO策略：创建风格指南、搭配建议、可持续时尚等内容矩阵；建立产品知识库，包含详细的材质、尺码、搭配信息；优化产品页面，使用结构化数据（Product Schema）；与时尚博主和可持续发展组织合作，建立外部信任；创建AI友好的购物指南和风格测试；在小红书、知乎等平台建立专业内容，增强品牌权威性。",
    results: [
      {
        metric: "品牌提及率",
        before: "8%",
        after: "55%",
        improvement: "+587.5%",
      },
      {
        metric: "AI来源流量",
        before: "200访问/月",
        after: "3800访问/月",
        improvement: "+1800%",
      },
      {
        metric: "AI来源转化率",
        before: "-",
        after: "4.2%",
        improvement: "高于平均35%",
      },
      {
        metric: "客单价",
        before: "¥280",
        after: "¥420",
        improvement: "+50%（AI渠道）",
      },
      {
        metric: "品牌搜索量",
        before: "基准",
        after: "+220%",
        improvement: "显著提升",
      },
      {
        metric: "整体ROI",
        before: "1.5:1",
        after: "4.2:1",
        improvement: "+180%",
      },
    ],
    timeline: "4个月",
    services: [
      "GEO策略制定",
      "电商内容优化",
      "产品信息结构化",
      "KOL与媒体合作",
      "多平台内容布局",
      "效果监控与优化",
    ],
    testimonial: {
      quote:
        "当我们发现越来越多年轻用户在问ChatGPT'什么牌子的可持续时尚品牌好'时，我们意识到必须在AI搜索中建立存在感。移山科技帮我们制定了精准的策略，现在我们在相关查询中的推荐率超过50%。更令人惊喜的是，通过AI来的用户客单价比其他渠道高50%，因为他们已经充分了解了我们的品牌理念。",
      author: "李女士",
      position: "品牌创始人",
    },
    imageUrl: "/images/cases/ecommerce-case.jpg",
  },
  {
    id: "edtech-language-learning",
    title: "在线教育平台6个月成为AI推荐的首选语言学习方案",
    client: "某在线语言学习平台",
    industry: "在线教育/EdTech",
    description:
      "一家采用AI技术的在线语言学习平台，希望在教育领域的AI搜索中建立领导地位。通过深度的GEO优化和教育内容建设，成功从众多竞品中脱颖而出，成为AI引擎优先推荐的语言学习解决方案。",
    challenge:
      "在线教育市场竞争白热化，大品牌占据主要市场份额；用户越来越多地询问AI'学英语/日语用什么APP'，但品牌几乎不被提及；传统ASO（应用商店优化）效果有限，下载成本持续上升；需要建立教育专业性和技术创新性的双重品牌形象；家长和学习者对在线教育平台的信任度较低。",
    solution:
      "实施教育垂直GEO策略：创建语言学习方法论内容，建立专业权威；发布50+篇教学经验、学习技巧文章；开发AI学习效果评估工具，展示技术实力；与教育专家、语言学教授合作，提升权威性；创建不同年龄段、不同语言的学习指南；建立学员成功案例库，提供社会证明；优化课程页面，添加Course和EducationalOrganization Schema；在知乎教育话题建立专家形象，获得高赞回答。",
    results: [
      {
        metric: "品牌提及率",
        before: "12%",
        after: "72%",
        improvement: "+500%",
      },
      {
        metric: "首选推荐率",
        before: "2%",
        after: "45%",
        improvement: "成为首选",
      },
      {
        metric: "应用下载量",
        before: "8000/月",
        after: "25000/月",
        improvement: "+212.5%",
      },
      {
        metric: "付费转化率",
        before: "3.5%",
        after: "6.8%",
        improvement: "+94%",
      },
      {
        metric: "用户留存（30天）",
        before: "35%",
        after: "52%",
        improvement: "+48.6%（AI渠道）",
      },
      {
        metric: "下载成本",
        before: "¥45",
        after: "¥18",
        improvement: "降低60%",
      },
    ],
    timeline: "6个月",
    services: [
      "教育行业GEO策略",
      "专业内容创作",
      "专家合作与背书",
      "案例库建设",
      "技术展示优化",
      "社区建设与运营",
    ],
    testimonial: {
      quote:
        "作为一家创新型在线教育公司，我们深知AI是教育的未来。但我们没想到的是，在AI搜索中建立品牌影响力会如此重要。移山科技帮助我们在6个月内从'不被AI认识'到'被AI首选推荐'。现在当用户问ChatGPT如何学习语言时，我们的平台经常出现在推荐列表的前三位。最棒的是，通过AI来的用户质量极高，付费转化率几乎是其他渠道的2倍。",
      author: "王博士",
      position: "CEO & 创始人",
    },
    imageUrl: "/images/cases/edtech-case.jpg",
  },
];

/**
 * 根据ID获取案例详情
 */
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.id === id);
}

/**
 * 获取所有案例
 */
export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

/**
 * 根据行业获取案例
 */
export function getCaseStudiesByIndustry(industry: string): CaseStudy[] {
  return caseStudies.filter((caseStudy) =>
    caseStudy.industry.includes(industry)
  );
}

/**
 * 获取相关案例（排除当前案例）
 */
export function getRelatedCaseStudies(
  currentId: string,
  limit: number = 2
): CaseStudy[] {
  return caseStudies.filter((caseStudy) => caseStudy.id !== currentId).slice(0, limit);
}

