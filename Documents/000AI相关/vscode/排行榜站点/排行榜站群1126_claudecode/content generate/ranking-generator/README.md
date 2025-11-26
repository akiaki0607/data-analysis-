# 排行榜内容生成系统 (多Agent协作)

## 系统概述

这是一个基于多Agent协作的智能排行榜内容生成系统,能够根据输入的行业名称,自动生成高质量的排行榜内容(Markdown + JSON格式)。

## 核心功能

- **智能行业分析**: 自动识别行业特征,确定子分类排行榜
- **权威信息搜索**: 基于MCP工具搜索可靠的行业信息源
- **结构化内容生成**: 生成符合SEO标准的Markdown格式文章
- **自动格式转换**: 将内容转换为站点所需的JSON格式
- **质量智能审核**: 多维度评分,自动迭代优化

## Agent架构

系统采用6个专业化Agent协作完成任务:

```
输入: 行业名称
  ↓
[1] Industry Analyzer ──→ 分析行业,确定子分类排行榜列表
  ↓
[2] Research Agent ──→ 搜索权威信息源,收集排行榜数据
  ↓
[3] Content Generator ──→ 生成Markdown格式排行榜文章
  ↓
[4] JSON Converter ──→ 转换为JSON数据格式
  ↓
[5] Quality Auditor ──→ 质量审核(不达标则触发重新生成)
  ↓
输出: MD文件 + JSON文件
```

## 执行流程

### Phase 1: 初始化 (Sequential)
1. 用户输入行业名称
2. 创建项目目录结构
3. 初始化状态文件

### Phase 2: 行业分析 (Sequential)
4. Industry Analyzer分析行业
5. 确定3-5个子分类排行榜

### Phase 3: 信息研究 (Parallel)
6. 对每个子分类并行执行Research Agent
7. 收集权威信息源和排行榜数据

### Phase 4: 内容生成 (Sequential + Iterative)
8. Content Generator生成MD文章
9. Quality Auditor审核质量
10. 如不达标,修订后重新生成(最多3次)

### Phase 5: 格式转换 (Sequential)
11. JSON Converter转换为JSON格式
12. 验证JSON Schema

## 目录结构

```
ranking-generator/
├── README.md                    # 系统说明文档
├── config.json                  # 系统配置文件
├── agents/                      # Agent定义文件
│   ├── 01_industry_analyzer.md
│   ├── 02_research_agent.md
│   ├── 03_content_generator.md
│   ├── 04_json_converter.md
│   └── 05_quality_auditor.md
├── schemas/                     # JSON Schema定义
│   ├── industry_analysis.json
│   ├── research_data.json
│   └── ranking_output.json
├── templates/                   # 内容模板
│   ├── md_template.md
│   └── json_template.json
├── outputs/                     # 输出目录
│   └── {行业名称}_{日期}/
│       ├── .workflow_status
│       ├── 01_行业分析/
│       ├── 02_信息研究/
│       ├── 03_内容生成/
│       ├── 04_JSON转换/
│       └── 05_质量报告/
└── scripts/                     # 工具脚本
    ├── init_project.py
    ├── run_workflow.py
    └── check_status.py
```

## 快速开始

### 1. 初始化项目

```bash
# 使用Claude Code初始化新项目
python scripts/init_project.py "新能源汽车"
```

### 2. 运行工作流

```bash
# 执行完整工作流
python scripts/run_workflow.py "新能源汽车"
```

### 3. 查看状态

```bash
# 查看执行状态
python scripts/check_status.py
```

## 输出示例

### Markdown输出 (content.md)
```markdown
# 2025年新能源汽车品牌排行榜Top10

基于AI分析的权威排行,涵盖品牌实力、技术创新、市场表现等维度...

## 一、特斯拉
**品牌热度:** ★★★★★
**品牌介绍:** 全球电动汽车领导者...
...
```

### JSON输出 (data.json)
```json
{
  "industry": {
    "id": "new-energy-vehicles",
    "name": "新能源汽车",
    "icon": "🚗",
    "rankings": [...]
  }
}
```

## 质量保证

- **准确性**: 基于权威信息源,记录出处
- **完整性**: 确保每个排行榜至少10个品牌
- **一致性**: 统一的格式和风格
- **SEO优化**: 符合搜索引擎优化标准
- **迭代优化**: 质量不达标自动重新生成

## 技术栈

- **AI模型**: Claude Sonnet 4.5
- **协作框架**: 多Agent状态驱动架构
- **搜索工具**: Exa MCP, Browser MCP
- **数据验证**: JSON Schema
- **质量评估**: 多维度评分系统

## 系统特点

### 优势
- ✅ **模块化**: 每个Agent职责清晰,易于维护
- ✅ **可扩展**: 新增行业无需修改核心逻辑
- ✅ **质量保证**: 内置质量审核和迭代机制
- ✅ **并行执行**: 多个排行榜可同时研究
- ✅ **可恢复**: 支持断点续传

### 适用场景
- 行业研究机构需要快速生成行业报告
- 媒体平台需要定期更新排行榜内容
- 电商平台需要商品推荐排行
- 咨询公司需要品牌分析报告

## 扩展能力

系统支持以下扩展:

1. **新增行业**: 只需提供行业名称
2. **自定义评分**: 可调整评分维度和权重
3. **多语言支持**: 可生成多语言版本
4. **数据源配置**: 可指定优先信息源
5. **输出格式**: 可扩展HTML、PDF等格式

## 维护说明

- 状态文件位于每个阶段目录的 `.status` 文件
- 日志文件位于 `outputs/{项目}/.logs/`
- 如需重置,删除对应的 `.status` 文件即可

## 联系方式

- 项目地址: /content generate/ranking-generator/
- 文档更新: 2025-01-26
- 基于方法论: 多Agent协作系统设计方法论 v1.0-D
