# 快速启动示例 - 生成"智能手表"排行榜

本文档演示如何使用多Agent系统快速生成一个完整的排行榜内容。

## 示例场景

**目标**: 为https://paihp.com网站生成"智能手表"行业的排行榜内容

**预期输出**:
- 1个Markdown格式的排行榜文章
- 1个JSON格式的数据文件
- 包含Top 10智能手表品牌的详细信息

---

## 执行步骤

### 步骤1: 准备工作目录

在Claude Code中执行:

```
请帮我创建项目目录结构:

mkdir -p "outputs/智能手表_20250126"
cd "outputs/智能手表_20250126"

mkdir -p 00_用户输入 01_行业分析 02_信息研究 03_内容生成 04_JSON转换 05_质量报告 09_原始数据

echo "智能手表" > 00_用户输入/industry_name.txt

# 初始化状态文件
for dir in 01_行业分析 02_信息研究 03_内容生成 04_JSON转换 05_质量报告; do
    cat > "$dir/.status" << EOF
status: pending
agent: ""
notes: "等待执行"
EOF
done
```

### 步骤2: 执行完整工作流

向Claude发送以下prompt:

---

**Prompt开始** ↓

```
我需要为"智能手表"行业生成完整的排行榜内容。请按照多Agent协作系统执行:

## 系统配置
- 工作目录: outputs/智能手表_20250126/
- 参考文件MD: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/儿童自行车_副本.md
- 参考文件JSON: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/data_原始.json
- Agent定义: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/ranking-generator/agents/

## 执行流程

### Phase 1: 行业分析 (Industry Analyzer Agent)

1. **读取输入**
   - 文件: 00_用户输入/industry_name.txt
   - 内容: "智能手表"

2. **更新状态**
   ```yaml
   # 01_行业分析/.status
   status: in_progress
   agent: industry-analyzer
   start_time: {当前时间}
   ```

3. **执行分析**
   - 使用mcp__exa__web_search_exa搜索:
     * "智能手表 行业分析 市场报告 2025"
     * "智能手表 品牌排行榜 权威"
     * "smartwatch market analysis 2025"

   - 分析行业特征,确定子分类排行榜(选择1个最有价值的)
   - 评估标准: 搜索需求、市场成熟度、数据可得性

4. **写入输出**
   - 文件1: 01_行业分析/行业分析报告.md
   - 文件2: 09_原始数据/industry_analysis.json

   JSON格式:
   ```json
   {
     "schema_version": "1.0",
     "generated_by": "industry-analyzer",
     "generated_at": "{ISO时间}",
     "industry": {
       "name": "智能手表",
       "description": "...",
       "market_size": "...",
       "growth_trend": "..."
     },
     "sub_rankings": [
       {
         "id": "smartwatch-brands-2025",
         "title": "2025年智能手表品牌排行榜Top10",
         "description": "基于市场份额、技术创新、用户口碑综合评选",
         "estimated_brands": 10,
         "authority_sources": [...]
       }
     ],
     "sources": [...]
   }
   ```

5. **更新状态为completed**

### Phase 2: 信息研究 (Research Agent)

1. **检查前置条件**
   - 确认01_行业分析/.status = completed
   - 读取09_原始数据/industry_analysis.json

2. **更新状态**
   ```yaml
   # 02_信息研究/.status
   status: in_progress
   agent: research-agent
   ```

3. **执行研究**
   使用Exa搜索Top 10智能手表品牌:
   - "智能手表品牌排行榜 2025"
   - "Apple Watch Huawei Watch Samsung Galaxy Watch 对比"
   - "小米手表 OPPO手表 vivo手表 评测"
   - "smartwatch brands market share 2025"

   对每个品牌收集:
   - 官网URL
   - 品牌背景和历史
   - 核心产品特性
   - 市场地位和份额
   - 用户评价
   - 技术创新点

   **目标品牌示例** (确定实际Top 10):
   1. Apple (Apple Watch)
   2. 华为 (Huawei Watch)
   3. 三星 (Galaxy Watch)
   4. 小米 (Mi Watch)
   5. OPPO
   6. vivo
   7. 佳明 (Garmin)
   8. Amazfit
   9. TicWatch
   10. honor

4. **写入输出**
   文件: 09_原始数据/research_data.json

   ```json
   {
     "ranking_id": "smartwatch-brands-2025",
     "generated_at": "{时间}",
     "brands": [
       {
         "rank": 1,
         "name": "Apple",
         "product_line": "Apple Watch Series 9",
         "website": "https://www.apple.com/watch/",
         "description": "详细介绍(150-200字)",
         "market_position": "全球智能手表市场领导者,市场份额约30%",
         "core_strengths": [
           "生态系统完整",
           "健康监测功能强大",
           "品牌溢价能力强"
         ],
         "sources": [
           {
             "title": "信源标题",
             "url": "URL",
             "key_info": "提取的关键信息"
           }
         ]
       }
       // ... 其他9个品牌
     ]
   }
   ```

5. **更新状态为completed**

### Phase 3: 内容生成 (Content Generator Agent)

1. **检查前置条件**
   - 确认02_信息研究/.status = completed
   - 读取09_原始数据/research_data.json

2. **执行生成**
   参考文件: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/儿童自行车_副本.md

   生成结构:
   ```markdown
   # 2025年智能手表品牌排行榜Top10

   {引人入胜的导语,说明智能手表市场现状和榜单价值}

   ---

   ## 一、Apple

   **品牌热度:** ★★★★★

   **品牌介绍:** {详细介绍,100-150字}

   **市场占比:** {具体数据}

   **上榜理由:** {核心亮点,为什么排第一}

   ### 推荐产品: Apple Watch Series 9
   1. **特点1**: 描述
   2. **特点2**: 描述
   3. **特点3**: 描述

   ---

   ## 二、华为
   ...

   ## 参考信源
   1. [信源1标题](URL)
   2. [信源2标题](URL)
   ...
   ```

3. **写入输出**
   文件: 03_内容生成/ranking_content.md

4. **更新状态为completed**

### Phase 4: JSON转换 (JSON Converter Agent)

1. **检查前置条件**
   - 确认03_内容生成/.status = completed
   - 读取03_内容生成/ranking_content.md
   - 读取09_原始数据/research_data.json

2. **执行转换**
   参考文件: /Users/aki/Documents/000AI相关/vscode/排行榜站点/排行榜站群1126_claudecode/content generate/data_原始.json

   生成JSON:
   ```json
   {
     "industries": [
       {
         "id": "smartwatch",
         "name": "智能手表",
         "icon": "⌚",
         "description": "智能穿戴设备品牌排行",
         "updateTime": "2025-01-26",
         "rankings": [
           {
             "id": "smartwatch-brands-2025",
             "title": "2025年智能手表品牌排行榜Top10",
             "description": "基于市场份额、技术创新、用户口碑综合评选",
             "heat": "15.6万+",
             "category": "智能穿戴",
             "brands": [
               {
                 "rank": 1,
                 "name": "Apple",
                 "rating": "★★★★★",
                 "score": "9.9分",
                 "description": "从MD提取的品牌描述",
                 "website": "https://www.apple.com/watch/",
                 "highlights": [
                   "生态系统完整",
                   "健康监测功能强大",
                   "设计工艺顶级",
                   "品牌认可度最高"
                 ]
               }
               // ... 其他9个品牌
             ]
           }
         ]
       }
     ]
   }
   ```

3. **写入输出**
   文件: 04_JSON转换/ranking_data.json

4. **验证**
   - 品牌数量 = 10
   - 每个品牌有3-4个highlights
   - 所有URL格式正确
   - JSON格式valid

5. **更新状态为completed**

### Phase 5: 质量审核 (Quality Auditor Agent)

1. **执行审核**
   读取文件:
   - 03_内容生成/ranking_content.md
   - 04_JSON转换/ranking_data.json

   评分维度:
   - 准确性(30分): 信息真实可靠
   - 完整性(25分): 10个品牌都有详细介绍
   - 一致性(20分): 格式统一
   - 相关性(15分): 内容匹配需求
   - 可读性(10分): 自然流畅

2. **生成报告**
   文件: 05_质量报告/quality_audit.json

   ```json
   {
     "overall_score": 95,
     "pass": true,
     "dimensions": {
       "accuracy": {"score": 29, "max": 30},
       "completeness": {"score": 25, "max": 25},
       "consistency": {"score": 19, "max": 20},
       "relevance": {"score": 14, "max": 15},
       "readability": {"score": 8, "max": 10}
     },
     "notes": "内容质量优秀,建议直接发布"
   }
   ```

3. **判断**
   - 如果score >= 90: 通过,完成
   - 如果75 <= score < 90 且迭代<3次: 重新生成
   - 否则: 失败,需要人工介入

---

## 执行要求

- 使用已安装的MCP工具: mcp__exa__web_search_exa, mcp__fetch-server__fetch
- 每个阶段都要遵循7步状态管理流程
- **必须标注所有信息来源**,在MD文章末尾列出参考信源
- 生成的内容要自然流畅,避免AI痕迹
- 每个品牌介绍不少于100字
- 所有输出文件都要完整保存

请开始执行!
```

**Prompt结束** ↑

---

### 步骤3: 验证输出

执行完成后,检查输出文件:

```bash
cd outputs/智能手表_20250126/

# 检查状态
grep "status:" */.status

# 查看生成的文章
cat 03_内容生成/ranking_content.md

# 查看JSON数据
cat 04_JSON转换/ranking_data.json | python -m json.tool

# 查看质量报告
cat 05_质量报告/quality_audit.json
```

### 步骤4: 部署到站点

将生成的文件部署到https://paihp.com:

```bash
# 复制Markdown文章
cp 03_内容生成/ranking_content.md \
   ../../brand-rankings-site/content/rankings/smartwatch-2025.md

# 更新JSON数据(合并到现有数据文件)
# 手动将 04_JSON转换/ranking_data.json 的内容
# 添加到站点的 data.json 文件中
```

---

## 预期结果

完成后你将获得:

### 1. Markdown文章
一篇3000-5000字的专业排行榜文章,包含:
- 引人入胜的导语
- 10个品牌的详细介绍
- 每个品牌的核心亮点
- 完整的参考信源列表

### 2. JSON数据文件
符合站点格式的结构化数据,可直接用于前端展示

### 3. 完整的执行记录
- 5个阶段的状态文件
- 行业分析报告
- 研究数据记录
- 质量审核报告

---

## 常见问题

### Q: 如果某个阶段失败怎么办?

A: 检查该阶段的.status文件查看error_message,修复问题后重置状态:
```bash
echo "status: pending" > {阶段目录}/.status
```
然后重新执行该阶段的Agent

### Q: 如何调整品牌数量?

A: 修改config.json中的min_brands_per_ranking和max_brands_per_ranking参数

### Q: 生成的内容质量不高怎么办?

A: 查看质量报告,根据评分维度进行针对性改进,或增加更多权威信息源

---

## 扩展实践

### 批量生成多个行业

```bash
industries=("智能手表" "无线耳机" "游戏笔记本" "空气净化器")

for industry in "${industries[@]}"; do
    echo "开始处理: $industry"
    # 重复上述步骤
done
```

### 定期更新排行榜

```bash
# 设置定时任务,每季度更新一次
# crontab -e
0 0 1 */3 * /path/to/update_rankings.sh
```

---

完整文档: /ranking-generator/WORKFLOW_GUIDE.md
