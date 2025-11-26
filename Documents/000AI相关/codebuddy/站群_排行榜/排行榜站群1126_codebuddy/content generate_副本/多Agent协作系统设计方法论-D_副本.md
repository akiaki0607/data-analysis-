# 多Agent协作系统设计方法论 (D版)

> **版本**: v1.0-D
> **创建日期**: 2025-10-16
> **适用范围**: 基于Claude Code + MCP工具的多Agent协作系统设计

---

## 📚 目录

1. [方法论概述](#1-方法论概述)
2. [核心设计原则](#2-核心设计原则)
3. [Agent角色设计方法](#3-agent角色设计方法)
4. [工作流程设计模式](#4-工作流程设计模式)
5. [状态管理机制](#5-状态管理机制)
6. [数据流设计](#6-数据流设计)
7. [质量保证机制](#7-质量保证机制)
8. [输出物设计](#8-输出物设计)
9. [可扩展性设计](#9-可扩展性设计)
10. [实施检查清单](#10-实施检查清单)
11. [异常处理与恢复](#11-异常处理与恢复)
12. [评估与指标体系](#12-评估与指标体系)

---

## 1. 方法论概述

### 1.1 什么是多Agent协作系统?

多Agent协作系统是一种将复杂任务分解为多个专业化子任务,由多个AI代理(Agent)各司其职、协同完成的系统架构。每个Agent具备:
- **专业化能力**: 专注于特定领域的分析或生成任务
- **自主性**: 能够自主检查前置条件、执行任务、更新状态
- **协作性**: 通过标准化的数据格式和状态机制与其他Agent协作

### 1.2 适用场景

适合使用多Agent协作系统的场景:
- ✅ 任务复杂度高,需要多个专业领域知识
- ✅ 存在明确的任务分解边界和依赖关系
- ✅ 需要大规模、高质量的结构化输出
- ✅ 单一Agent难以在质量和数量之间平衡
- ✅ 存在质量验证和迭代优化需求
- ✅ 需要并行执行以提升整体效率

### 1.3 核心价值主张

**相比单一大型Agent的优势:**
1. **模块化**: 每个Agent职责清晰,易于维护和优化
2. **可扩展**: 新增Agent无需重构整体系统
3. **质量控制**: 专门的质量审核Agent保证输出质量
4. **并行化**: 无依赖关系的Agent可同时执行
5. **可恢复性**: 某个Agent失败不影响整体,可断点续传
6. **可观测性**: 通过状态文件随时了解执行进度

---

## 2. 核心设计原则

### 2.1 单一职责原则 (Single Responsibility Principle)

**定义**: 每个Agent只负责一个明确的、独立的任务领域。

**设计指导**:
- ✅ **DO**: 设计"公司画像分析Agent" - 专注企业信息提取
- ❌ **DON'T**: 设计"公司和产品分析Agent" - 职责模糊,难以优化

**判断标准**:
- Agent的输出能用一句话清晰描述
- Agent的失败不会导致其他Agent完全无法工作
- Agent可以被独立替换或升级

**示例 (商业分析系统)**:
```
✅ 正确拆分:
- company-profiler: 分析企业画像
- product-feature-analyzer: 分析产品特性
- user-persona-researcher: 构建客户画像

❌ 错误拆分:
- business-analyzer: 分析企业和产品 (职责过大)
- data-collector: 收集所有数据 (过于通用)
```

---

### 2.2 文档驱动协作原则 (Document-Driven Collaboration)

**定义**: Agent之间通过读写标准化文件进行协作,而非直接的代码调用或内存传递。

**核心优势**:
- ✅ **可追溯**: 每个Agent的输入输出都有完整记录
- ✅ **可调试**: 出现问题时可以检查中间文件定位问题
- ✅ **可恢复**: 从任意断点恢复执行
- ✅ **可扩展**: 新Agent只需遵循文件格式规范即可接入

**文档类型设计**:

| 文档类型 | 用途 | 格式 | 示例 |
|---------|------|------|------|
| **数据文件** | Agent间传递业务数据 | JSON | `company_profile.json` |
| **状态文件** | 标记Agent执行状态 | YAML | `.status` |
| **配置文件** | 存储系统配置参数 | JSON/YAML | `config.json` |
| **报告文件** | 呈现分析结果 | Markdown/HTML | `analysis_report.md` |
| **迭代指导文件** | 质量审核后的改进建议 | Markdown | `revision_requirements.md` |

**文件格式规范**:
```json
// 数据文件示例 (company_profile.json)
{
  "schema_version": "1.0",
  "generated_by": "company-profiler",
  "generated_at": "2025-10-16T10:00:00Z",
  "data": {
    "company_name": "...",
    "industry": "...",
    // ... 业务数据
  },
  "metadata": {
    "source_urls": ["..."],
    "confidence_level": "high"
  }
}
```

#### 2.2.1 并发协作策略

在多Agent并行执行或分布式部署时,需要额外的并发控制措施来避免文件覆盖与读取脏数据:

- **锁机制约束写入**: 约定每个可写文件关联一个`.lock`文件,Agent在写入前先尝试创建锁;失败时需退避重试或排队。

  ```bash
  # 伪代码
  until lock_acquired "outputs/product_features.json.lock"; do
    sleep 2  # 指数退避
  done
  write_temp "outputs/product_features.json.tmp"
  mv "outputs/product_features.json.tmp" "outputs/product_features.json"
  release_lock "outputs/product_features.json.lock"
  ```

- **原子写入与版本标记**: 所有写操作采用`<file>.tmp`+原子`rename`,并在对象元数据中记录`version`或`etag`,读取方在处理前比对版本号。
- **分布式同步策略**: 跨主机协作时,统一使用支持乐观并发控制的后端(如S3/GCS带`If-Match`校验、Git托管工作区或轻量数据库),禁止直接在共享文件系统上进行无锁写入。
- **冲突检测与合并**: 设计`conflict-detector` Agent定期扫描状态库,一旦检测到同一数据文件存在多个版本,生成合并提示或触发回滚流程。
- **审计与回放**: 对关键文档启用追加式操作日志(`*.log.jsonl`),记录写入者、版本、哈希值,便于审计与灾难恢复。

---

### 2.3 明确依赖原则 (Explicit Dependency Principle)

**定义**: 每个Agent必须显式声明其依赖的前置Agent和输入文件,系统应该能够自动检测依赖是否满足。

**依赖声明格式**:
```yaml
AGENT_NAME: "product-feature-analyzer"
MY_DIR: "02_产品分析"
DEPENDENCIES:
  - "01_企业分析"  # 依赖的目录(Agent)
REQUIRED_INPUT_FILES:
  - "09_原始数据/company_profile.json"  # 必需的输入文件
OUTPUT_FILES:
  - "02_产品分析/产品特性.json"
  - "09_原始数据/product_features.json"
```

**依赖检测逻辑**:
```python
def can_agent_start(agent_config):
    # 1. 检查自身状态
    if read_status(agent_config.MY_DIR) != "pending":
        return False

    # 2. 检查依赖Agent状态
    for dep in agent_config.DEPENDENCIES:
        if read_status(dep) != "completed":
            return False

    # 3. 检查输入文件存在性
    for file in agent_config.REQUIRED_INPUT_FILES:
        if not file_exists(file):
            return False

    return True
```

---

### 2.4 状态驱动执行原则 (State-Driven Execution)

**定义**: 使用状态文件(.status)标记每个Agent的执行状态,Agent通过读取状态文件自主判断是否可以启动。

**状态生命周期**:
```
pending → in_progress → completed (正常流程)
pending → in_progress → failed (异常流程)
completed → pending (质量不达标,触发重新执行)
```

**状态文件格式**:
```yaml
status: pending|in_progress|completed|failed|needs_revision
agent: "{agent_name}"
start_time: "2025-10-16T10:00:00Z"
end_time: "2025-10-16T10:25:00Z"
duration_minutes: 25
input_files:
  - "../00_验证信息/verified_context.json"
output_files:
  - "企业档案.json"
  - "../09_原始数据/company_profile.json"
notes: "简要描述执行情况"
iteration: 1
error_message: "(仅在failed时填写)"
```

**状态检查标准流程** (7步):
```
STEP 1: 前置条件检查 - 读取自身和依赖的.status文件
STEP 2: 更新状态为 in_progress - 标记开始执行
STEP 3: 读取输入文件 - 加载必需数据
STEP 4: 执行核心任务 - Agent专属逻辑
STEP 5: 写入输出文件 - 保存结果
STEP 6: 更新状态为 completed - 标记完成
STEP 7: 错误处理 - 捕获异常并标记failed
```

---

### 2.5 质量优先原则 (Quality-First Principle)

**定义**: 系统应该内置质量验证机制,在数量和质量之间,优先保证质量。

**质量保证机制设计**:

1. **专门的质量审核Agent**
   - 独立于生成Agent的质量审核角色
   - 使用明确的评分标准和通过阈值
   - 有权触发重新生成

2. **迭代优化循环**
   ```
   生成Agent → 质量审核Agent → 评分
                              ↓
                    score >= 90? → 通过
                    75 <= score < 90 AND iter < 3? → 重新生成
                    否则 → 失败,人工介入
   ```

3. **质量评估维度**
   - **准确性**: 内容是否符合事实
   - **完整性**: 是否覆盖了所有必要维度
   - **一致性**: 格式、风格是否统一
   - **相关性**: 输出是否与目标需求匹配
   - **自然度**: 生成内容是否自然流畅

4. **迭代改进机制**
   - 质量不达标时,生成`revision_requirements.md`文件
   - 详细说明哪些方面需要改进,如何改进
   - 生成Agent读取该文件,调整策略后重新生成
   - 最多迭代3次,避免无限循环

---

### 2.6 数量保证原则 (Quantity Guarantee Principle)

**定义**: 对于需要大规模输出的任务,应该设计数学公式确保输出数量达标。

**数量计算公式设计**:

以商业分析系统的问题生成为例:
```
目标: 每个企业生成1650+个问题

策略1: 功能维度
  功能点数(50) × 每功能问题数(20) = 1000

策略2: 场景维度
  场景数(20) × 每场景问题数(15) = 300

策略3: 对比维度
  竞品数(5) × 每竞品问题数(10) = 50

策略4: 决策阶段维度
  决策阶段(5) × 每阶段通用问题(20) = 100

策略5: 真实问题变体
  真实问题基数(50) × 变体数(4) = 200

───────────────────────────────
总计: 1650 问题 ✓
```

**关键点**:
- 将数量目标分解到多个维度
- 每个维度设置明确的生成公式
- 确保各维度相加达到或超过总目标
- 在Agent的prompt中明确说明这些公式

---

### 2.7 并行优先原则 (Parallelization-First Principle)

**定义**: 在保证依赖关系正确的前提下,优先设计可并行执行的工作流。

**并行机会识别**:
1. **同级依赖**: 依赖相同前置Agent的多个Agent可并行
2. **独立输出**: 输出文件无冲突的Agent可并行
3. **无数据竞争**: 不会同时写入同一文件的Agent可并行

**并行执行设计模式**:

```
Phase 1: Foundation (Sequential)
  └─ company-profiler
       └─ product-feature-analyzer

Phase 2: Customer & Market (Parallel)
  ├─ user-persona-researcher      } 可并行
  └─ market-intelligence-gatherer }

Phase 3: Core Generation (Sequential with Loop)
  └─ query-simulator
       └─ evidence-quality-auditor
            └─ (可能触发query-simulator重新执行)

Phase 4: Strategy & Output (Parallel)
  ├─ solution-strategist  } 可并行
  └─ report-writer        }
```

**并行执行收益计算**:
```
顺序执行时间: 25 + 30 + 35 + 30 + 45 + 15 + 25 + 20 = 225分钟

并行执行时间:
  Phase 1: 25 + 30 = 55分钟
  Phase 2: max(35, 30) = 35分钟
  Phase 3: 45 + 15 = 60分钟
  Phase 4: max(25, 20) = 25分钟
  ────────────────────────────
  总计: 175分钟 (节省22%)
```

---

### 2.8 工具优先原则 (Tool-First Principle)

**定义**: 优先使用Claude Code提供的MCP工具,而非编写传统代码。

**MCP工具选择指南**:

| 任务类型 | 推荐工具 | 避免使用 |
|---------|---------|---------|
| 访问网页并提取信息 | Browser MCP (Playwright) | requests + BeautifulSoup |
| 搜索网络信息 | Exa MCP | Google Search API |
| 查询技术文档 | Context7 MCP | 手动爬取文档站 |
| 分析GitHub仓库 | DeepWiki MCP | git clone + 代码分析 |
| 获取网页内容 | WebFetch | curl + 解析 |

**工具使用原则**:
1. **AI原生**: 让Claude直接理解内容,不需要编写提取逻辑
2. **无需维护**: MCP工具由官方维护,无需处理网站变更
3. **安全可控**: MCP工具有权限控制,避免滥用
4. **结果结构化**: MCP工具返回结构化数据,易于处理

---

### 2.9 人类可读原则 (Human-Readable Principle)

**定义**: 所有中间文件和输出文件应该便于人类阅读和理解,而非仅为机器优化。

**文件格式选择**:
- ✅ **JSON**: 结构化数据,便于解析和人类阅读
- ✅ **YAML**: 配置文件,更简洁,注释友好
- ✅ **Markdown**: 报告文档,格式化文本
- ✅ **CSV**: 表格数据,Excel兼容
- ✅ **HTML**: 富交互展示

**可读性设计**:
```json
// ✅ 良好的可读性
{
  "company_name": "优贝童车",
  "industry": "儿童自行车制造",
  "market_position": "中高端儿童自行车市场领导者",
  "scale": "中型企业(年销50万+辆)"
}

// ❌ 差的可读性
{
  "cn": "优贝童车",
  "ind": "bike_mfg",
  "pos": 3,
  "sc": "md_50w"
}
```

**文件命名规范**:
- ✅ `company_profile.json` - 清晰明确
- ✅ `质量审核报告_2025-10-16.md` - 中文+日期
- ❌ `cp.json` - 缩写不清
- ❌ `output_final_v3_new.json` - 版本混乱

---

### 2.10 可恢复性原则 (Recoverability Principle)

**定义**: 系统应该支持从任意断点恢复执行,不需要重新运行整个流程。

**恢复机制设计**:

1. **状态持久化**
   - 每个Agent完成后立即更新.status文件
   - 状态文件包含足够信息用于恢复判断

2. **断点识别**
   ```bash
   # 识别最后完成的Agent
   grep "status: completed" outputs-BA/{公司}_{日期}/*/.status

   # 输出:
   # 01_企业分析/.status: status: completed
   # 02_产品分析/.status: status: completed
   # 03_客户画像/.status: status: completed
   # → 下一步应该执行 market-intelligence-gatherer
   ```

3. **恢复操作**
   ```bash
   # Step 1: 识别失败或未完成的Agent
   failed_agent=$(find outputs-BA/{公司}_{日期} -name ".status" \
                   -exec grep -l "status: failed\|status: in_progress" {} \;)

   # Step 2: 重置状态为pending
   echo "status: pending" > $failed_agent

   # Step 3: 重新启动Agent
   invoke {agent_name}
   ```

4. **数据完整性保护**
   - 输出文件使用原子写入(先写临时文件,再rename)
   - 关键文件写入后立即验证格式正确性
   - 保留上一次成功的输出作为备份

---

## 3. Agent角色设计方法

### 3.1 Agent识别与拆分方法

**问题**: 如何将一个复杂任务拆分为多个Agent?

**方法1: 领域驱动拆分 (Domain-Driven Decomposition)**

根据业务领域的自然边界拆分:
- 企业分析 → company-profiler
- 产品分析 → product-feature-analyzer
- 客户研究 → user-persona-researcher

**方法2: 数据流拆分 (Data Flow Decomposition)**

根据数据处理的流程拆分:
- 数据收集 → data-collector
- 数据清洗 → data-cleaner
- 数据分析 → data-analyzer
- 结果生成 → result-generator

**方法3: 职能角色拆分 (Functional Role Decomposition)**

模拟人类团队的角色分工:
- 研究员 → researcher
- 分析师 → analyst
- 策略师 → strategist
- 质检员 → auditor
- 报告员 → reporter

**拆分决策树**:
```
任务是否涉及多个领域知识?
  ├─ 是 → 按领域拆分 (Domain-Driven)
  └─ 否 → 任务是否有明显的数据处理流程?
           ├─ 是 → 按数据流拆分 (Data Flow)
           └─ 否 → 按职能角色拆分 (Functional Role)
```

---

### 3.2 Agent命名规范

**命名格式**: `{职能}-{角色}` 或 `{领域}-{动作}-er`

**示例**:
- ✅ `company-profiler` - 公司画像构建者
- ✅ `query-simulator` - 查询模拟器
- ✅ `evidence-quality-auditor` - 证据质量审核员
- ❌ `agent1`, `agent_main` - 无意义命名
- ❌ `do_analysis` - 动词形式,不符合"角色"概念

**命名原则**:
1. **角色化**: 用名词而非动词 (profiler vs profile)
2. **专业化**: 体现专业领域 (company-profiler vs data-collector)
3. **英文优先**: 便于代码中使用
4. **kebab-case**: 小写+连字符

---

### 3.3 Agent职责定义模板

每个Agent应该有清晰的职责描述,包含以下元素:

```markdown
## Agent名称

### 核心使命 (Core Mission)
用一句话描述Agent存在的意义和核心价值。

示例: "为后续的问题生成提供产品知识基础,确保生成的问题覆盖产品的所有核心功能。"

### 工作方式 (Working Method)
描述Agent使用的工具和技术方法。

示例: "使用Browser MCP访问产品页面,通过Claude模型理解内容并提取结构化数据。"

### 详细职责 (Detailed Responsibilities)
列出Agent需要完成的具体任务,使用bullet points。

示例:
- 使用Browser MCP访问产品介绍页、功能页、定价页
- 识别并提取30-50个产品功能点
- 为每个功能生成10-20个问题种子
- 分析产品与竞品的差异化特性

### 输入依赖 (Input Dependencies)
明确列出Agent需要读取的文件。

示例:
- 输入文件: `09_原始数据/company_profile.json`
- 依赖Agent: company-profiler

### 输出产物 (Output Artifacts)
明确列出Agent生成的文件及其格式。

示例:
- `02_产品分析/产品特性.json` (结构化数据)
- `02_产品分析/产品特性报告.md` (人类可读报告)
- `09_原始数据/product_features.json` (供下游Agent使用)

### 输出格式 (Output Format)
提供JSON Schema或示例数据结构。

### 与下游的关联 (Downstream Impact)
说明本Agent的输出如何被下游Agent使用。

示例: "产品特性数据将被query-simulator用于生成基于功能的问题。"
```

---

### 3.4 Agent配置参数标准

每个Agent应该在其定义文件中声明以下配置参数:

```yaml
# Agent元数据
AGENT_NAME: "product-feature-analyzer"
AGENT_VERSION: "1.0"
AGENT_DESCRIPTION: "分析产品特性并生成问题种子"

# 目录配置
MY_DIR: "02_产品分析"
OUTPUT_DIR: "02_产品分析"
RAW_DATA_DIR: "09_原始数据"

# 依赖配置
DEPENDENCIES:
  - "01_企业分析"
REQUIRED_INPUT_FILES:
  - "09_原始数据/company_profile.json"
OPTIONAL_INPUT_FILES:
  - "00_验证信息/user_input.txt"

# 输出配置
OUTPUT_FILES:
  - "02_产品分析/产品特性.json"
  - "02_产品分析/产品特性报告.md"
  - "09_原始数据/product_features.json"

# 执行配置
ESTIMATED_DURATION_MINUTES: 30
MAX_RETRY_TIMES: 3
TIMEOUT_MINUTES: 60

# 质量配置
QUALITY_METRICS:
  - name: "功能点数量"
    threshold: 30
  - name: "问题种子数量"
    threshold: 300
```

---

## 4. 工作流程设计模式

### 4.1 顺序执行模式 (Sequential Pattern)

**适用场景**: Agent之间存在强依赖关系,后者必须等待前者完成。

**示例**:
```
company-profiler → product-feature-analyzer → user-persona-researcher
```

**特点**:
- ✅ 依赖关系清晰
- ✅ 调试简单
- ❌ 执行时间长
- ❌ 资源利用率低

**实现**:
```python
# Pseudocode
def sequential_workflow():
    invoke(company_profiler)
    wait_until_completed("01_企业分析")

    invoke(product_feature_analyzer)
    wait_until_completed("02_产品分析")

    invoke(user_persona_researcher)
    wait_until_completed("03_客户画像")
```

---

### 4.2 并行执行模式 (Parallel Pattern)

**适用场景**: 多个Agent依赖相同的前置Agent,但彼此独立。

**示例**:
```
product-feature-analyzer (completed)
    ├─→ user-persona-researcher      } 并行执行
    └─→ market-intelligence-gatherer }
```

**特点**:
- ✅ 执行时间缩短
- ✅ 资源利用率高
- ❌ 需要并发控制
- ❌ 调试复杂度提升

**实现**:
```python
# Pseudocode
def parallel_workflow():
    # 等待前置Agent完成
    wait_until_completed("02_产品分析")

    # 并行启动多个Agent
    invoke_parallel([
        user_persona_researcher,
        market_intelligence_gatherer
    ])

    # 等待全部完成
    wait_until_all_completed([
        "03_客户画像",
        "04_市场情报"
    ])
```

**并行执行的前提条件**:
1. ✅ 输出文件无冲突 (不会写入同一文件)
2. ✅ 无数据竞争 (不会同时读写同一文件)
3. ✅ 资源充足 (内存、CPU、API配额)

---

### 4.3 迭代优化模式 (Iterative Refinement Pattern)

**适用场景**: 输出质量需要验证,不达标时需要重新生成。

**示例**:
```
query-simulator → question_database.json → evidence-quality-auditor
                                                    ↓
                                            score >= 90? → 继续
                                            75 <= score < 90 AND iter < 3?
                                                    ↓
                        revision_requirements.md ← 写入改进建议
                                                    ↓
                        重置 query-simulator.status = pending
                                                    ↓
                                            query-simulator (改进生成)
```

**特点**:
- ✅ 质量保证
- ✅ 自动优化
- ❌ 时间不确定
- ❌ 可能陷入循环

**实现**:
```python
# Pseudocode
def iterative_workflow():
    max_iterations = 3
    iteration = 1

    while iteration <= max_iterations:
        # 生成内容
        invoke(query_simulator, iteration=iteration)
        wait_until_completed("05_问题库")

        # 质量审核
        invoke(evidence_quality_auditor, iteration=iteration)
        wait_until_completed("08_质量报告")

        # 读取质量报告
        report = read_json("08_质量报告/quality_audit_report.json")
        score = report["overall_score"]

        if score >= 90:
            # 质量达标,继续下游
            break
        elif score >= 75 and iteration < max_iterations:
            # 质量不足,重新生成
            reset_status("05_问题库", "pending")
            iteration += 1
        else:
            # 失败,需要人工介入
            mark_as_failed("08_质量报告")
            break
```

**防止无限循环的机制**:
1. **最大迭代次数限制** (通常3次)
2. **质量阈值设置** (低于某个分数直接失败)
3. **超时机制** (单次迭代超时则终止)

---

### 4.4 分阶段执行模式 (Phased Execution Pattern)

**适用场景**: 复杂工作流,需要分为多个阶段,每个阶段内部可能有顺序或并行。

**示例 (商业分析系统)**:
```
Phase 1: Foundation (Sequential)
  └─ company-profiler → product-feature-analyzer

Phase 2: Customer & Market (Parallel)
  ├─ user-persona-researcher
  └─ market-intelligence-gatherer

Phase 3: Core Generation (Sequential + Iterative)
  └─ query-simulator ↔ evidence-quality-auditor

Phase 4: Strategy & Output (Parallel)
  ├─ solution-strategist
  └─ report-writer
```

**特点**:
- ✅ 结构清晰
- ✅ 便于监控
- ✅ 便于优化
- ✅ 综合优势

**阶段划分原则**:
1. **业务逻辑边界**: 不同阶段完成不同的业务目标
2. **数据依赖边界**: 阶段间存在明确的数据依赖
3. **并行化边界**: 同一阶段内的Agent可并行

---

### 4.5 条件分支模式 (Conditional Branching Pattern)

**适用场景**: 根据中间结果决定后续执行路径。

**示例**:
```
business-type-detector
    ├─ B2B? → b2b-analysis-pipeline
    └─ B2C? → b2c-analysis-pipeline
```

**实现**:
```python
# Pseudocode
def conditional_workflow():
    invoke(business_type_detector)
    wait_until_completed("00_验证信息")

    context = read_json("00_验证信息/verified_context.json")
    business_type = context["company_type"]

    if business_type == "B2B":
        invoke_pipeline(b2b_agents)
    elif business_type == "B2C":
        invoke_pipeline(b2c_agents)
    elif business_type == "B2B2C":
        invoke_pipeline(hybrid_agents)
```

---

## 5. 状态管理机制

### 5.1 状态文件设计

**标准格式** (.status):
```yaml
# 必需字段
status: pending|in_progress|completed|failed|needs_revision
agent: "{agent_name}"

# 时间字段
start_time: "2025-10-16T10:00:00Z"  # ISO 8601格式
end_time: "2025-10-16T10:25:00Z"
duration_minutes: 25

# 文件引用字段
input_files:
  - "../00_验证信息/verified_context.json"
  - "../09_原始数据/company_profile.json"
output_files:
  - "产品特性.json"
  - "../09_原始数据/product_features.json"

# 描述字段
notes: "产品分析完成,识别50个功能点,生成800个问题种子"

# 迭代字段 (可选)
iteration: 1

# 错误字段 (仅在failed时)
error_message: "无法访问产品页面,连接超时"
```

---

### 5.2 状态流转规则

**正常流程**:
```
pending → in_progress → completed
```

**异常流程**:
```
pending → in_progress → failed
```

**迭代流程**:
```
completed → (质量审核) → pending (重新生成)
```

**特殊状态**:
```
needs_revision (由质量审核Agent设置,表示需要改进)
```

**状态更新时机**:
- `pending`: 项目初始化时设置
- `in_progress`: Agent开始执行时立即设置 (STEP 2)
- `completed`: Agent成功完成时立即设置 (STEP 6)
- `failed`: Agent执行异常时立即设置 (STEP 7)
- `needs_revision`: 质量审核不达标时设置

---

### 5.3 7步标准执行流程

所有Agent必须遵循的标准流程:

```markdown
STEP 1: 前置条件检查
  - 读取 {MY_DIR}/.status,验证 status == "pending"
  - 读取所有依赖目录的 .status,验证 status == "completed"
  - 验证所有 REQUIRED_INPUT_FILES 存在且非空
  - 如有任何条件不满足,立即退出,不执行后续步骤

STEP 2: 更新状态为 in_progress
  - 写入 {MY_DIR}/.status
  - 设置: status=in_progress, start_time, input_files, notes

STEP 3: 读取输入文件
  - 依次读取所有 REQUIRED_INPUT_FILES
  - 解析并验证文件格式
  - 加载到内存供后续使用

STEP 4: 执行核心任务
  - Agent的专属业务逻辑
  - 使用MCP工具获取数据
  - 使用Claude模型分析和生成内容
  - 捕获任何异常 → 跳转到 STEP 7

STEP 5: 写入输出文件
  - 依次写入所有 OUTPUT_FILES
  - 使用原子写入(先写临时文件,再rename)
  - 验证文件格式正确性

STEP 6: 更新状态为 completed
  - 写入 {MY_DIR}/.status
  - 设置: status=completed, end_time, duration_minutes, output_files, notes, iteration

STEP 7: 错误处理
  - 捕获STEP 4或STEP 5的异常
  - 写入 {MY_DIR}/.status
  - 设置: status=failed, end_time, error_message, notes
  - 记录详细错误日志
```

---

### 5.4 状态检测函数模板

```python
# Pseudocode - 状态检测函数

def read_status(status_file_path):
    """读取.status文件并返回状态值"""
    if not file_exists(status_file_path):
        return "pending"  # 默认状态

    content = read_file(status_file_path)
    # 解析YAML格式
    status_data = parse_yaml(content)
    return status_data.get("status", "pending")

def check_dependencies_completed(dependency_dirs):
    """检查所有依赖是否完成"""
    for dep_dir in dependency_dirs:
        status_file = f"{dep_dir}/.status"
        status = read_status(status_file)
        if status != "completed":
            return False, f"依赖 {dep_dir} 未完成 (状态: {status})"
    return True, None

def check_input_files_exist(file_paths):
    """检查所有输入文件是否存在"""
    for file_path in file_paths:
        if not file_exists(file_path):
            return False, f"输入文件 {file_path} 不存在"
        if file_size(file_path) == 0:
            return False, f"输入文件 {file_path} 为空"
    return True, None

def can_agent_start(agent_config):
    """综合检查Agent是否可以启动"""
    # 1. 检查自身状态
    my_status = read_status(f"{agent_config.MY_DIR}/.status")
    if my_status != "pending":
        return False, f"当前状态为 {my_status},不是 pending"

    # 2. 检查依赖状态
    deps_ok, deps_msg = check_dependencies_completed(agent_config.DEPENDENCIES)
    if not deps_ok:
        return False, deps_msg

    # 3. 检查输入文件
    files_ok, files_msg = check_input_files_exist(agent_config.REQUIRED_INPUT_FILES)
    if not files_ok:
        return False, files_msg

    return True, "所有前置条件满足"
```

---

### 5.5 原子写入与事务模式

- **两阶段写入**: 所有状态更新拆分为`准备阶段`(写入`*.status.tmp`并记录`previous_status_hash`)与`提交阶段`(校验文件未被其他Agent修改后再原子`rename`)。
- **版本对比**: 状态文件新增`version`字段(自增整数或UUID),更新时必须提交当前读取到的版本(`if version != expected_version → 失败并重试`),避免覆盖其他Agent的结果。
- **事务批处理**: 需要同时更新多个状态文件时,使用中间事务日志(`transactions/{timestamp}_{agent}.txn`),记录计划修改的文件与目标状态,所有目标成功写入后再标记事务完成,失败则按日志执行回滚。
- **一致性断言**: 在提交状态前,执行钩子函数(`pre_commit_checks`)确保输入/输出文件的哈希、数据量与预期一致,防止写入半成品。

### 5.6 回滚与补偿流程

- **软回滚**: 失败状态写入后立即保留一份`{dir}/.status.bak`快照,允许运维或恢复Agent通过对比差异恢复至最新`completed`状态。
- **自动补偿**: 配置`status-compensator` Agent监听失败或冲突事件,依据事务日志自动重放上一次成功的输出文件,并触发依赖Agent重跑。
- **人工干预点**: 对长链路关键节点,提供`manual_override.md`模板记录审批意见、回滚步骤和验证清单,确保人在环节可追溯。

### 5.7 多Agent并发一致性实践

- **锁粒度设计**: 使用目录级锁控制状态更新,文件级锁控制数据写入;对于轻量级查询操作使用读锁,避免阻塞判定。
- **超时与抢占**: 锁文件包含`holder`, `start_time`, `ttl`;当持锁Agent超时未释放时,由调度器或守护Agent执行抢占并生成告警。
- **分布式协调**: 在多实例部署下,统一依赖一个协调层(如Redis Redlock、Etcd、Postgres advisory locks)托管锁状态,并通过心跳维持租约。
- **一致性监控**: 将状态目录哈希和版本指标暴露给监控面板,一旦出现无序跳跃或重复回退,立即触发告警与调查流程。

## 6. 数据流设计

### 6.1 数据分层架构

建议采用3层数据架构:

```
Layer 1: 原始数据层 (Raw Data Layer)
  └─ 09_原始数据/
     ├─ company_profile.json
     ├─ product_features.json
     ├─ customer_personas.json
     └─ question_database.json

Layer 2: 处理数据层 (Processed Data Layer)
  └─ NN_各Agent目录/
     ├─ 01_企业分析/企业档案.json
     ├─ 02_产品分析/产品特性.json
     └─ 05_问题库/questions_full.csv

Layer 3: 展示数据层 (Presentation Layer)
  ├─ questions_by_platform.html
  ├─ keywords_analysis.html
  └─ analysis_report.md
```

**数据流动规则**:
- Agent → 写入 Layer 1 (原始JSON)
- Agent → 写入 Layer 2 (处理后数据)
- report-writer → 读取 Layer 1+2,生成 Layer 3

---

### 6.2 JSON Schema设计

每个数据文件应该有明确的JSON Schema定义:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Company Profile",
  "type": "object",
  "required": ["company_name", "industry", "market_position"],
  "properties": {
    "schema_version": {
      "type": "string",
      "description": "Schema版本号"
    },
    "generated_by": {
      "type": "string",
      "description": "生成此文件的Agent名称"
    },
    "generated_at": {
      "type": "string",
      "format": "date-time",
      "description": "生成时间 (ISO 8601)"
    },
    "company_name": {
      "type": "string",
      "description": "公司名称"
    },
    "industry": {
      "type": "string",
      "description": "所属行业"
    },
    "market_position": {
      "type": "string",
      "description": "市场定位"
    }
  }
}
```

---

### 6.3 数据验证机制

每个Agent在读取输入文件时应该进行验证:

```python
# Pseudocode
def validate_input_file(file_path, schema_path):
    """验证输入文件是否符合Schema"""
    data = read_json(file_path)
    schema = read_json(schema_path)

    # JSON Schema验证
    if not validate_schema(data, schema):
        raise ValueError(f"{file_path} 不符合Schema定义")

    # 业务规则验证
    if "company_name" in data and len(data["company_name"]) == 0:
        raise ValueError("company_name不能为空")

    return data
```

---

## 7. 质量保证机制

### 7.1 质量审核Agent设计

质量审核Agent应该独立于生成Agent,具备以下能力:

**职责**:
1. 读取生成Agent的输出
2. 根据预定义的质量标准进行评分
3. 判断是否达到通过阈值
4. 如不达标,生成详细的改进建议

**评分维度**:
```yaml
质量评分维度:
  - 准确性 (Accuracy): 30分
    * 内容是否符合事实
    * 是否存在错误信息

  - 完整性 (Completeness): 25分
    * 是否覆盖了所有必要维度
    * 数量是否达标

  - 一致性 (Consistency): 20分
    * 格式是否统一
    * 风格是否一致

  - 相关性 (Relevance): 15分
    * 输出是否与目标需求匹配
    * 是否存在无关内容

  - 自然度 (Naturalness): 10分
    * 生成内容是否自然流畅
    * 是否有明显的机器生成痕迹

总分: 100分
通过阈值: 90分
重新生成阈值: 75分
```

---

### 7.2 迭代改进机制

**触发条件**:
```
IF quality_score >= 90:
  → 通过,继续下游

ELIF 75 <= quality_score < 90 AND iteration < 3:
  → 触发重新生成

ELSE:
  → 失败,需要人工介入
```

**改进建议文件格式** (revision_requirements.md):
```markdown
# 质量审核改进建议

## 本次迭代: 第 2 次
## 上次得分: 82/100

## 需要改进的维度

### 1. 完整性 (当前18/25分)
**问题**: 部分产品功能未生成对应问题
**改进要求**:
- 功能点"API集成"缺少问题,请补充10-15个问题
- 功能点"性能优化"只有5个问题,请增加到20个

### 2. 自然度 (当前7/10分)
**问题**: 部分问题表达不够自然
**改进要求**:
- 减少"请问..."、"能否..."等过于正式的表达
- 增加口语化问题,如"XX怎么用?好用吗?"
- 参考真实问题的表达方式

### 3. 相关性 (当前12/15分)
**问题**: 存在与产品无关的问题
**改进要求**:
- 移除关于"行业趋势"的通用问题
- 聚焦于具体产品功能和使用场景

## 改进策略建议
1. 重新阅读product_features.json,确保所有功能都有对应问题
2. 参考real_questions.json中的真实问题表达方式
3. 检查每个问题是否与产品特性直接相关
```

---

### 7.3 质量监控指标

**系统级指标**:
- 平均迭代次数 (期望: 1-1.5次)
- 首次通过率 (期望: >60%)
- 失败率 (期望: <5%)

**Agent级指标**:
- 平均执行时间
- 失败次数
- 输出文件大小

---

## 8. 输出物设计

### 8.1 输出目录结构设计

```
outputs-BA/{公司名称}_{YYYY-MM-DD}/
├── .workflow_status              # 项目总体状态
├── 00_执行摘要/                  # 快速了解
│   ├── 客户价值评估.md
│   └── 关键发现TOP10.md
├── 01_企业分析/                  # 企业层面
│   ├── .status
│   ├── 企业档案.json
│   └── 企业档案报告.md
├── 02_产品分析/                  # 产品层面
│   ├── .status
│   ├── 产品特性.json
│   └─ 产品特性报告.md
├── 03_客户画像/                  # 客户层面
│   ├── .status
│   └── 客户画像.json
├── 04_市场情报/                  # 市场层面
│   ├── .status
│   └── 真实问题集.json
├── 05_问题库/                    # 核心输出
│   ├── .status
│   ├── .iteration_count
│   ├── questions_full.json       # 完整数据
│   ├── questions_full.csv        # Excel兼容
│   └── questions_by_platform.html # 交互展示
├── 06_关键词库/                  # 核心输出
│   ├── keywords.json
│   └── keywords.csv
├── 07_内容策略/                  # 策略层面
│   ├── .status
│   └── 内容优先级排序.md
├── 08_质量报告/                  # 质量层面
│   ├── .status
│   ├── quality_audit_report.json
│   └── revision_requirements.md  # (如有迭代)
└── 09_原始数据/                  # 数据层面
    ├── company_profile.json
    ├── product_features.json
    ├── customer_personas.json
    ├── real_questions.json
    └── question_database.json
```

**目录命名原则**:
- 使用00-09数字前缀表示执行顺序
- 使用中文命名,便于人类理解
- 核心输出目录用特殊标记 (如: 05_问题库/)

---

### 8.2 多格式输出策略

**为什么需要多格式?**
- JSON: 供程序读取和处理
- CSV: 供Excel打开和分析
- HTML: 供交互式查看和筛选
- Markdown: 供阅读和分享

**格式转换流程**:
```
JSON (原始数据) → CSV (数据分析) → HTML (可视化展示) → PDF (最终交付)
```

**示例: 问题库输出**:
```json
// questions_full.json (机器可读)
{
  "questions": [
    {
      "question_id": "Q001",
      "question_text": "...",
      "keywords": ["..."]
    }
  ]
}
```

```csv
# questions_full.csv (Excel可打开)
问题ID,问题文本,客户画像,决策阶段,问题类型,关键词
Q001,"..."," P1",考虑阶段,对比评估,"关键词1,关键词2"
```

```html
<!-- questions_by_platform.html (交互式展示) -->
<html>
  <body>
    <div class="filter-bar">
      <select id="platform-filter">
        <option value="all">所有平台</option>
        <option value="豆包">豆包</option>
        <option value="Kimi">Kimi</option>
      </select>
    </div>
    <table id="questions-table">
      <!-- 可筛选、排序的表格 -->
    </table>
  </body>
</html>
```

---

### 8.3 人类可读报告设计

**报告结构模板**:
```markdown
# {公司名称} 产品分析报告

## 📊 执行摘要
- 分析日期: 2025-10-16
- 识别功能点: 50个
- 生成问题数: 1850个
- 质量得分: 96/100 (A+)

## 1. 企业概况
### 1.1 基本信息
- 公司名称: XXX
- 所属行业: XXX
- 市场定位: XXX

### 1.2 核心优势
1. 优势1: ...
2. 优势2: ...

## 2. 产品分析
### 2.1 产品概述
### 2.2 核心功能 (Top 10)
### 2.3 差异化特性

## 3. 客户画像
### 3.1 画像1: 技术决策者
- 人口统计: ...
- 心理特征: ...
- AI搜索行为: ...

## 4. 问题库分析
### 4.1 问题数量统计
- 按平台分布: 豆包(600), Kimi(700), DeepSeek(550)
- 按决策阶段: 认知(300), 考虑(500), 决策(400), 使用(400), 推荐(250)

### 4.2 高优先级问题 (Top 20)

## 5. 内容策略建议
### 5.1 优先创建内容的问题
### 5.2 SEO优化建议

## 附录
- 完整问题库: 见 questions_full.csv
- 关键词库: 见 keywords.csv
```

---

## 9. 可扩展性设计

### 9.1 新增Agent的标准流程

当需要新增一个Agent时,按以下步骤操作:

**Step 1: 定义Agent职责**
```markdown
## Agent名称: new-analyzer

### 核心使命
一句话描述这个Agent的存在意义。

### 工作方式
使用哪些MCP工具,如何处理数据。

### 详细职责
- 职责1
- 职责2
- 职责3
```

**Step 2: 声明配置参数**
```yaml
AGENT_NAME: "new-analyzer"
MY_DIR: "NN_新分析"
DEPENDENCIES:
  - "MM_依赖目录"
REQUIRED_INPUT_FILES:
  - "09_原始数据/input.json"
OUTPUT_FILES:
  - "NN_新分析/output.json"
  - "09_原始数据/new_data.json"
```

**Step 3: 设计输入输出格式**
```json
// 输入格式 (读取的JSON)
{
  "field1": "...",
  "field2": "..."
}

// 输出格式 (生成的JSON)
{
  "schema_version": "1.0",
  "generated_by": "new-analyzer",
  "data": {
    // 业务数据
  }
}
```

**Step 4: 编写Agent定义文件**
- 创建 `.claude/agents/new-analyzer.md`
- 添加状态机制章节 (参考模板)
- 详细描述Agent逻辑

**Step 5: 更新依赖矩阵**
- 在工作流文档中添加新Agent的位置
- 标注与其他Agent的依赖关系

**Step 6: 创建状态文件模板**
```yaml
# NN_新分析/.status
status: pending
agent: "new-analyzer"
notes: "等待前置依赖完成"
```

**Step 7: 测试与集成**
- 独立测试新Agent
- 集成到完整工作流
- 验证并行执行兼容性

---

### 9.2 替换Agent的标准流程

当需要替换一个现有Agent时:

**Step 1: 确认接口兼容性**
- 新Agent的输入是否兼容现有依赖?
- 新Agent的输出是否满足下游需求?
- JSON Schema是否一致?

**Step 2: 影响分析**
```
old-agent 被替换为 new-agent
影响的下游Agent:
  - downstream-agent-1 (需要更新输入字段)
  - downstream-agent-2 (无需更新)
```

**Step 3: 向后兼容方案**
- 保留旧输出格式,同时提供新格式
- 使用适配器Agent转换数据格式
- 逐步迁移下游Agent

**Step 4: 灰度替换**
```
Phase 1: 并行运行old-agent和new-agent,输出对比
Phase 2: 新项目使用new-agent,旧项目保留old-agent
Phase 3: 全部迁移到new-agent,移除old-agent
```

---

### 9.3 系统fork与定制

当需要基于现有系统创建定制版本时:

**复用原则**:
- ✅ 复用: 状态机制、7步流程、质量审核机制
- ✅ 复用: 数据分层架构、JSON Schema设计
- ⚠️ 定制: Agent角色定义、数量保证公式
- ⚠️ 定制: 具体的MCP工具调用逻辑

**Fork流程**:
```bash
# 1. 复制核心框架
cp -r .claude/状态机制规范.md new-project/
cp -r .claude/agents/状态机制_通用模板.md new-project/

# 2. 修改Agent定义
# 根据新需求重新设计Agent角色

# 3. 调整输出目录结构
# 根据新需求修改目录命名和层次

# 4. 更新工作流
# 根据新的Agent依赖关系调整执行顺序
```

---

## 10. 实施检查清单

### 10.1 设计阶段检查清单

在开始编码前,确认以下设计已完成:

- [ ] **任务分解**
  - [ ] 识别了所有必要的Agent角色
  - [ ] 每个Agent职责明确,不重复
  - [ ] Agent数量合理 (建议5-10个)

- [ ] **依赖关系**
  - [ ] 绘制了Agent依赖关系图
  - [ ] 识别了并行执行的机会
  - [ ] 没有循环依赖

- [ ] **数据流设计**
  - [ ] 定义了所有JSON文件的Schema
  - [ ] 确定了文件命名规范
  - [ ] 设计了数据分层架构

- [ ] **工作流设计**
  - [ ] 定义了执行阶段
  - [ ] 设计了质量保证机制
  - [ ] 考虑了错误恢复方案

- [ ] **输出物设计**
  - [ ] 定义了目录结构
  - [ ] 确定了输出文件格式
  - [ ] 设计了人类可读报告

---

### 10.2 开发阶段检查清单

在实施过程中,确认每个Agent:

- [ ] **配置参数**
  - [ ] 声明了AGENT_NAME
  - [ ] 声明了MY_DIR和DEPENDENCIES
  - [ ] 列出了REQUIRED_INPUT_FILES
  - [ ] 列出了OUTPUT_FILES

- [ ] **状态机制**
  - [ ] 遵循7步标准流程
  - [ ] STEP 1: 检查前置条件
  - [ ] STEP 2: 更新为in_progress
  - [ ] STEP 6: 更新为completed
  - [ ] STEP 7: 异常时更新为failed

- [ ] **输入验证**
  - [ ] 验证输入文件存在
  - [ ] 验证JSON格式正确
  - [ ] 验证必需字段完整

- [ ] **输出规范**
  - [ ] 输出JSON包含schema_version
  - [ ] 输出JSON包含generated_by和generated_at
  - [ ] 输出文件路径正确

- [ ] **错误处理**
  - [ ] 捕获了所有可能的异常
  - [ ] 记录了详细错误信息
  - [ ] 更新了.status文件

---

### 10.3 测试阶段检查清单

- [ ] **单元测试**
  - [ ] 每个Agent可以独立执行
  - [ ] 输入验证逻辑正确
  - [ ] 输出格式符合Schema

- [ ] **集成测试**
  - [ ] 完整工作流可以顺序执行
  - [ ] Agent间数据传递正确
  - [ ] 状态流转符合预期

- [ ] **并行测试**
  - [ ] 可并行的Agent确实可以并行
  - [ ] 无数据竞争
  - [ ] 无文件冲突

- [ ] **异常测试**
  - [ ] Agent失败时状态正确标记
  - [ ] 可以从失败点恢复
  - [ ] 依赖检查机制生效

- [ ] **质量测试**
  - [ ] 质量审核机制生效
  - [ ] 迭代循环正确工作
  - [ ] 最大迭代次数限制生效

---

### 10.4 部署阶段检查清单

- [ ] **文档**
  - [ ] 完成系统设计文档
  - [ ] 完成Agent协作流程指南
  - [ ] 完成项目初始化模板
  - [ ] 完成用户操作手册

- [ ] **配置**
  - [ ] 创建配置文件模板
  - [ ] 创建状态文件模板
  - [ ] 创建初始化脚本

- [ ] **监控**
  - [ ] 可以查看整体进度
  - [ ] 可以查看各Agent状态
  - [ ] 可以识别失败Agent

- [ ] **维护**
  - [ ] 提供恢复脚本
  - [ ] 提供重置脚本
- [ ] 提供日志查询方法

---

## 11. 异常处理与恢复

### 11.1 异常分类

- **按严重程度**: Critical(阻塞流程)、Major(影响重大)、Minor(影响有限)、Warning(潜在风险)。
- **按问题类型**: Agent执行失败、依赖缺失、质量不达标、资源不足、环境配置异常等。

明确分类有助于在状态文件中快速标注问题级别,并匹配合适的恢复策略。

### 11.2 异常检测机制

- **超时检测**: 为关键阶段设定超时阈值,在达到75%时预警,超时后自动切换到失败/重试流程。

```python
class TimeoutDetector:
    def __init__(self):
        self.timeouts = {
            "requirements": 30 * 60,
            "design": 40 * 60,
            "development": 90 * 60,
            "testing": 30 * 60,
        }

    def check_timeout(self, stage_name, start_time):
        elapsed = time.time() - start_time
        timeout = self.timeouts.get(stage_name, 60 * 60)

        if elapsed > timeout:
            return True, f"Stage {stage_name} timeout after {elapsed/60:.1f}分钟"
        if elapsed > timeout * 0.75:
            return None, f"Stage {stage_name} approaching timeout ({elapsed/timeout*100:.0f}%)"
        return False, None
```

- **质量检测**: 对关键输出进行评分,低于阈值时提供问题列表供质量Agent复查。

```python
class QualityDetector:
    def check_quality(self, deliverable_path, min_score=0.8):
        score = self.calculate_quality_score(deliverable_path)
        if score < min_score:
            issues = self.identify_issues(deliverable_path)
            return False, f"Quality score {score:.2f} below threshold {min_score}", issues
        return True, None, None
```

- **依赖检测**: 在Agent启动前检查前置文件与状态是否齐备,缺失时阻止执行并在.status中记录。

```python
class DependencyDetector:
    def check_dependencies(self, stage, project_state):
        missing = [
            dep for dep in stage.dependencies
            if not self.is_dependency_satisfied(dep, project_state)
        ]
        if missing:
            return False, f"Missing dependencies: {missing}"
        return True, None
```

### 11.3 恢复策略

- **重试机制**: 对可重入的Agent采用指数退避重试,限定最大次数,失败时写入详细错误上下文。

```python
class RetryStrategy:
    def __init__(self, max_retries=3, backoff_factor=2):
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor

    def execute_with_retry(self, agent_func, context):
        for attempt in range(self.max_retries):
            try:
                result = agent_func(context)
                if self.is_success(result):
                    return result
                time.sleep(self.backoff_factor ** attempt)
            except Exception as error:
                if attempt == self.max_retries - 1:
                    raise
                logger.error(f"Attempt {attempt+1} error: {error}")
        raise RuntimeError("Failed after max retries")
```

- **回滚机制**: 为关键阶段建立文件级检查点,失败后回滚并通知依赖Agent暂停。

```python
class RollbackStrategy:
    def create_checkpoint(self, project_path, stage_name):
        checkpoint = f"{project_path}/.checkpoints/{stage_name}"
        self.copy_directory(project_path, checkpoint)
        return checkpoint

    def rollback_to_checkpoint(self, project_path, checkpoint):
        self.remove_directory(project_path)
        self.copy_directory(checkpoint, project_path)
        logger.info(f"Rolled back to checkpoint: {checkpoint}")
```

- **降级策略**: 在资源受限或交付紧急情况下,对非关键质量指标适度降低阈值,并记录审批人。

- **人工介入**: 当自动化策略失败时,通过通知系统@到负责人员,待人工处理完成后再恢复流程。

### 11.4 异常日志记录

使用结构化日志记录异常上下文(时间、Agent、阶段、失败原因、恢复动作),便于排查与回溯。

```json
{
  "timestamp": "2025-10-16T10:30:45Z",
  "level": "ERROR",
  "agent": "frontend-developer",
  "stage": "08_frontend",
  "event": "agent_failure",
  "error": {
    "type": "BuildError",
    "message": "npm build failed",
    "code": "BUILD_001"
  },
  "context": {
    "project": "project001",
    "attempt": 1,
    "duration_seconds": 125
  },
  "recovery_action": "retry_with_dependency_install"
}
```

---

## 12. 评估与指标体系

### 12.1 评估维度

- **效率指标**: 总体执行时间、阶段耗时分布、并行效率、资源利用率。
- **质量指标**: 输出质量评分、缺陷率/返工率、质量审核通过率、用户满意度。
- **可靠性指标**: 成功率、平均失败次数、平均恢复时间(MTTR)、系统可用性。
- **可维护性指标**: Agent修改频率、新Agent上架耗时、工作流调整灵活性、文档完备度。

每个指标需在项目初始化时设定目标值与告警阈值,纳入状态板或监控看板。

### 12.2 数据收集与分析

- **运行指标采集**: 在每次工作流执行后自动汇总执行时长、阶段耗时、质量评分、失败/重试次数及资源使用。

```python
class MetricsCollector:
    def collect_run_metrics(self, project_path):
        return {
            "execution_time": self.calculate_total_time(project_path),
            "stage_durations": self.get_stage_durations(project_path),
            "quality_scores": self.collect_quality_scores(project_path),
            "failure_count": self.count_failures(project_path),
            "retry_count": self.count_retries(project_path),
            "resource_usage": self.get_resource_usage(project_path),
        }
```

- **瓶颈分析**: 基于历史指标识别耗时最长阶段、并行效率退化点,并生成调优建议。

```python
class PerformanceAnalyzer:
    def analyze_bottlenecks(self, metrics_history):
        slowest = self.find_slowest_stages(metrics_history)
        efficiency = self.calculate_parallel_efficiency(metrics_history)
        degradation = self.detect_performance_degradation(metrics_history)
        return {
            "bottlenecks": slowest,
            "parallel_efficiency": efficiency,
            "degradation": degradation,
            "recommendations": self.generate_recommendations(),
        }
```

- **质量追踪**: 针对关键质量指标建立趋势图,出现连续下降时触发改进工作项。

### 12.3 持续改进机制

- **A/B测试**: 对比不同Prompt、策略或调度方式,通过统计对比选择最佳方案。

```python
class ABTester:
    def compare_strategies(self, strategy_a, strategy_b, test_cases):
        results_a = self.run_tests(strategy_a, test_cases)
        results_b = self.run_tests(strategy_b, test_cases)
        return self.statistical_comparison(results_a, results_b)
```

- **反馈闭环**: 运行系统 → 收集数据 → 分析性能 → 识别问题 → 制定改进 → 实施 → 验证效果 → 再次运行。
- **指标治理**: 定期(如每周/月)复盘指标达成情况,更新目标值、指标定义及监控告警策略。

---

## 附录

### A. 术语表

| 术语 | 定义 |
|------|------|
| **Agent** | 执行特定任务的AI代理,具备自主性和专业化能力 |
| **MCP工具** | Model Context Protocol工具,Claude Code提供的外部能力接口 |
| **状态文件** | 记录Agent执行状态的YAML文件 (.status) |
| **依赖** | Agent A需要Agent B完成后才能启动,则A依赖B |
| **迭代** | 质量不达标时,重新执行生成Agent的过程 |
| **并行执行** | 多个Agent同时运行,而非顺序执行 |
| **断点恢复** | 从失败或中断的位置继续执行,无需从头开始 |

---

### B. 参考资源

**内部文档**:
- `.claude/状态机制规范.md` - 状态机制完整规范
- `.claude/agents/状态机制_通用模板.md` - Agent开发模板
- `.claude/Agent协作流程指南.md` - 工作流程详细指南
- `.claude/项目初始化模板.md` - 项目初始化方法
- `CLAUDE.md` - 主文档

**外部资源**:
- Claude Code官方文档: https://docs.claude.com/claude-code
- MCP协议规范: https://modelcontextprotocol.io/
- JSON Schema规范: https://json-schema.org/

---

### C. 版本历史

| 版本 | 日期 | 主要变更 |
|------|------|---------|
| v1.0 | 2025-10-16 | 初始版本,基于商业分析系统提炼 |

---

**方法论维护者**: Claude Code Team
**最后更新**: 2025-10-16
**反馈渠道**: 通过项目Issue提交改进建议
