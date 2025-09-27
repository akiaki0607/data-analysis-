# GEO优化分析系统 V2 - 完整版

基于PRD V2要求的完整数据分析解决方案，用于分析思迈特在AI平台上的可见度和竞争情况。

## 功能特性

- **数据上传**: 支持Excel (.xlsx) 和CSV (.csv) 格式文件上传
- **智能分析**: 自动识别客户品牌和竞品信息
- **薄弱组合识别**: 识别客户品牌可见概率低于35%的关键词-AI平台组合
- **蓝海关键词筛选**: 找出竞品也表现薄弱的机会关键词
- **优先级排序**: 按薄弱AI平台数量对蓝海关键词进行排序
- **信源平台分析**: 识别优秀信源平台和客户薄弱的信源平台
- **可视化展示**: 美观的Web界面展示分析过程和结果

## 系统要求

- Python 3.8+
- Flask
- pandas
- openpyxl

## 安装和运行

### 1. 创建虚拟环境
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate     # Windows
```

### 2. 安装依赖
```bash
pip install pandas openpyxl flask
```

### 3. 运行应用
```bash
python app.py
```

### 4. 访问系统
打开浏览器访问: http://localhost:5000

## 使用说明

### 数据文件格式要求

上传的Excel文件需要包含以下工作表：

1. **数据封面**: 包含客户名称等基本信息
2. **汇总报表**: 包含品牌类型分类（我方品牌、核心竞品、其他竞品）
3. **关键词数据分析_清洗后**: 包含关键词、平台、品牌、可见概率等数据
4. **信源数据分析_清洗后**: 包含信源平台相关数据

### 分析流程

1. **数据上传**: 在首页上传符合格式要求的Excel文件
2. **自动分析**: 系统自动进行数据预处理和分析
3. **查看结果**: 在分析页面查看过程分析和最终结果

### 核心分析逻辑

- **薄弱组合**: 客户品牌可见概率 < 35%
- **蓝海关键词**: 客户薄弱 且 所有竞品最高可见概率 < 35%
- **薄弱信源平台**: 客户在优秀信源平台的文章占比 < 50%

## 项目结构

```
数据分析-codebuddyV2/
├── app.py                 # Flask主应用
├── templates/             # HTML模板
│   ├── base.html         # 基础模板
│   ├── index.html        # 首页
│   └── analysis.html     # 分析结果页
├── uploads/              # 上传文件存储
├── venv/                 # 虚拟环境
├── requerment/           # 需求文档和示例数据
└── README.md            # 说明文档
```

## 技术栈

- **后端**: Flask (Python Web框架)
- **数据处理**: pandas, openpyxl
- **前端**: Bootstrap 5, jQuery
- **图标**: Font Awesome

## 开发说明

### 核心类和方法

- `GEOAnalyzer`: 主要分析类
  - `load_excel_data()`: 加载Excel数据
  - `identify_weak_combinations()`: 识别薄弱组合
  - `prioritize_blue_ocean_keywords()`: 蓝海关键词排序
  - `identify_excellent_source_platforms()`: 信源平台分析
  - `run_full_analysis()`: 运行完整分析

### API接口

- `POST /upload`: 文件上传接口
- `GET /analysis`: 分析结果页面
- `GET /api/analysis-data`: 获取分析数据API

## 注意事项

1. 确保上传的Excel文件格式正确
2. 文件大小限制为16MB
3. 系统会自动识别客户名称和竞品信息
4. 分析结果基于PRD V2的业务规则

## 许可证

本项目仅供学习和研究使用。