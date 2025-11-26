# 排行榜生成系统 - 工作流执行指南

## 快速开始

### 准备工作

1. **确认MCP工具可用**
   - Exa MCP (搜索)
   - WebFetch (网页获取)
   - Playwright MCP (可选,浏览器自动化)

2. **创建项目目录**

```bash
mkdir -p "outputs/{行业名称}_$(date +%Y%m%d)"
cd "outputs/{行业名称}_$(date +%Y%m%d)"

# 创建子目录
mkdir -p 00_用户输入 01_行业分析 02_信息研究 03_内容生成 04_JSON转换 05_质量报告 09_原始数据

# 初始化状态文件
for dir in 01_行业分析 02_信息研究 03_内容生成 04_JSON转换 05_质量报告; do
    echo "status: pending" > "$dir/.status"
done
```

3. **输入行业名称**

```bash
echo "智能手表" > 00_用户输入/industry_name.txt
```

---

## 执行流程

### Phase 1: 行业分析

#### 使用Claude执行Agent

向Claude Code发送以下prompt:

```
你是Industry Analyzer Agent。请按照以下步骤执行:

**STEP 1: 检查前置条件**
- 读取文件: outputs/{行业}_YYYYMMDD/00_用户输入/industry_name.txt
- 读取文件: outputs/{行业}_YYYYMMDD/01_行业分析/.status
- 确认status为pending

**STEP 2: 更新状态为in_progress**
写入 01_行业分析/.status:
```yaml
status: in_progress
agent: industry-analyzer
start_time: {当前时间ISO 8601}
notes: 开始分析行业
```

**STEP 3-4: 执行分析**
1. 使用mcp__exa__web_search_exa工具搜索行业信息:
   - 查询: "{行业名称} 行业分析 品牌排行榜 市场报告 2025"
   - 获取20个结果

2. 分析行业特征,**识别5个子分类排行榜方向**(固定数量)

3. 对每个子分类评估:
   - 搜索需求
   - 市场成熟度
   - 数据可得性
   - 商业价值

**STEP 5: 写入输出**
生成两个文件:
1. 01_行业分析/行业分析报告.md (人类可读)
2. 09_原始数据/industry_analysis.json (机器可读)

JSON格式:
```json
{
  "schema_version": "1.0",
  "generated_by": "industry-analyzer",
  "generated_at": "{ISO时间}",
  "industry": {
    "name": "行业名称",
    "description": "行业描述",
    "market_size": "市场规模",
    "growth_trend": "增长趋势"
  },
  "sub_rankings": [
    {
      "id": "ranking-1",
      "title": "排行榜1标题",
      "description": "描述",
      "rationale": "价值理由",
      "estimated_brands": 10,
      "authority_sources": ["来源1", "来源2"]
    },
    {
      "id": "ranking-2",
      "title": "排行榜2标题",
      "description": "描述",
      "rationale": "价值理由",
      "estimated_brands": 10,
      "authority_sources": ["来源1", "来源2"]
    },
    {
      "id": "ranking-3",
      "title": "排行榜3标题",
      "description": "描述",
      "rationale": "价值理由",
      "estimated_brands": 10,
      "authority_sources": ["来源1", "来源2"]
    },
    {
      "id": "ranking-4",
      "title": "排行榜4标题",
      "description": "描述",
      "rationale": "价值理由",
      "estimated_brands": 10,
      "authority_sources": ["来源1", "来源2"]
    },
    {
      "id": "ranking-5",
      "title": "排行榜5标题",
      "description": "描述",
      "rationale": "价值理由",
      "estimated_brands": 10,
      "authority_sources": ["来源1", "来源2"]
    }
  ],
  "sources": [{"title": "...", "url": "...", "accessed_at": "..."}]
}
```

**STEP 6: 更新状态为completed**
```yaml
status: completed
agent: industry-analyzer
end_time: {时间}
duration_minutes: {耗时}
notes: 成功识别{N}个子分类排行榜
```
```

---

### Phase 2: 信息研究

#### 针对每个子分类执行Research

```
你是Research Agent。请针对"{子分类名称}"排行榜执行研究:

**目标**: 找到该领域的Top 10品牌及其详细信息

**STEP 1: 检查前置条件**
- 确认 01_行业分析/.status 为completed
- 读取 09_原始数据/industry_analysis.json
- 读取本次要研究的子分类信息

**STEP 2-4: 执行研究**

1. 使用Exa搜索权威排行榜:
   - "{子分类} 品牌排行榜 2025 权威"
   - "{子分类} top 10 brands 排名"
   - "{子分类} 市场份额 销量排名"

2. 对于每个候选品牌,收集:
   - 品牌官网
   - 品牌介绍(历史、定位、特色)
   - 市场地位和占有率
   - 核心产品/服务
   - 用户评价和口碑
   - 权威奖项或认证

3. 确定最终10个品牌,排序依据:
   - 市场份额和销量
   - 品牌知名度
   - 用户口碑
   - 创新能力
   - 服务质量

**STEP 5: 写入输出**
生成 09_原始数据/research_data.json:
```json
{
  "ranking_id": "...",
  "brands": [
    {
      "rank": 1,
      "name": "品牌名",
      "website": "官网URL",
      "description": "详细介绍(150-200字)",
      "market_position": "市场地位",
      "core_strengths": ["优势1", "优势2", "优势3"],
      "user_reputation": "用户口碑",
      "sources": [
        {"title": "信源标题", "url": "URL", "key_info": "提取的关键信息"}
      ]
    }
  ]
}
```

**注意**: 每个品牌必须标注信息来源!
```

---

### Phase 3: 内容生成

```
你是Content Generator Agent。请根据研究数据生成排行榜文章:

**参考文件**: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/儿童自行车_副本.md

**要求**:
1. 文章结构完整(标题、导语、品牌详情、结语)
2. 每个品牌介绍不少于100字
3. 突出品牌差异化特点
4. 自然流畅,避免AI痕迹
5. **文章末尾列出所有参考信源**

**输出**: 03_内容生成/ranking_content.md
```

---

### Phase 4: JSON转换

```
你是JSON Converter Agent。请将MD内容转换为JSON格式:

**参考文件**: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/data_原始.json

**转换规则**:
1. 从MD提取品牌信息(名称、描述、亮点)
2. 生成合理的评分(5星=9.7-10.0分)
3. 生成符合规范的ID
4. 选择合适的行业图标emoji

**输出**: 04_JSON转换/ranking_data.json

**验证**:
- 品牌数量必须=10个
- 每个品牌都有3-4个highlights
- 所有URL格式正确
```

---

### Phase 5: 质量审核

```
你是Quality Auditor Agent。请审核生成的内容:

**评分维度**:
1. 准确性(30分): 信息是否真实可靠
2. 完整性(25分): 是否包含所有必要内容
3. 一致性(20分): 格式和风格是否统一
4. 相关性(15分): 内容是否匹配需求
5. 可读性(10分): 是否自然流畅

**通过标准**: 总分≥90分

**如果<90分**: 生成改进建议 → 触发Content Generator重新生成(最多3次)

**输出**: 05_质量报告/quality_audit.json
```

---

## 简化执行方式

### 一次性执行所有阶段

可以向Claude发送综合prompt:

```
我需要为"{行业名称}"生成排行榜内容。请按照ranking-generator系统的流程执行:

1. Industry Analyzer: 分析行业,**识别5个子分类排行榜**(固定数量)
2. Research Agent: 针对每个子分类,研究Top 10品牌
3. Content Generator: 为每个排行榜生成MD格式文章(参考儿童自行车_副本.md)
4. JSON Converter: 将5个排行榜转换并**合并到1个JSON文件**中(参考data_原始.json)
5. Quality Auditor: 审核质量,如需改进则迭代

所有输出保存到: outputs/{行业}_{日期}/

执行时:
- 使用Exa MCP搜索行业信息
- 使用WebFetch获取详细页面
- 记录所有信息来源
- 遵循7步状态管理流程
- **重要**: 5个排行榜最终合并到1个JSON文件的industries[0].rankings数组中
```

---

## 输出示例

完成后,你将获得:

```
outputs/智能手表_20250126/
├── 01_行业分析/
│   ├── .status (completed)
│   └── 行业分析报告.md
├── 02_信息研究/
│   ├── .status (completed)
│   └── 研究报告.md
├── 03_内容生成/
│   ├── .status (completed)
│   └── ranking_content.md ← 最终文章
├── 04_JSON转换/
│   ├── .status (completed)
│   └── ranking_data.json ← 站点数据
├── 05_质量报告/
│   ├── .status (completed)
│   └── quality_audit.json
└── 09_原始数据/
    ├── industry_analysis.json
    └── research_data.json
```

---

## 故障排查

### Agent执行失败

检查.status文件:
```bash
cat 01_行业分析/.status
```

如果状态为failed,查看error_message,重置状态:
```bash
echo "status: pending" > 01_行业分析/.status
```

### 质量不达标

查看质量报告:
```bash
cat 05_质量报告/quality_audit.json
```

根据改进建议,重置Content Generator状态:
```bash
echo "status: pending" > 03_内容生成/.status
```

---

## 最佳实践

1. **信息源质量**: 优先使用行业协会、权威媒体、咨询机构的数据
2. **品牌选择**: 确保Top 10品牌具有代表性和知名度
3. **内容原创**: 避免直接复制,用自己的语言重新组织
4. **数据更新**: 标注数据时间,定期更新
5. **用户视角**: 从消费者决策角度组织内容

---

## 扩展使用

### 批量生成多个行业

```bash
for industry in "智能手表" "游戏笔记本" "儿童书包"; do
    echo "$industry" > "00_用户输入/industry_name.txt"
    # 执行完整流程
done
```

### 自定义评分权重

修改config.json中的scoring_dimensions

### 添加新的Agent

参考agents/目录下的模板,创建新的Agent定义

---

完整文档: /ranking-generator/README.md
