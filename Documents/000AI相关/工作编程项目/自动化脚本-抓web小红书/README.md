# 小红书联想词自动化采集工具

一个基于 Playwright 的小红书联想词自动化采集工具，支持批量关键词处理和智能重试机制。

## 功能特点

- 🎯 **智能采集**: 支持多种策略采集小红书联想词
- 🔄 **自动重试**: 内置重试机制，提高采集成功率
- 📸 **自动截图**: 自动保存采集过程截图
- 📊 **数据导出**: 结果自动保存为CSV格式
- 🌐 **多模式**: 支持有头模式和无头模式运行
- 🛡️ **兜底机制**: 采集失败时自动生成相关联想词

## 环境要求

- Python 3.8+
- Chrome/Chromium 浏览器
- 网络连接

## 安装步骤

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 安装 Playwright 浏览器

```bash
playwright install chromium
```

## 使用方法

### 快速开始

#### Windows 用户
双击运行 `run_xiaohongshu.bat`

#### macOS/Linux 用户
```bash
chmod +x run_xiaohongshu_scraper.sh
./run_xiaohongshu_scraper.sh
```

### 手动运行

```bash
# 基础运行（后台模式）
python src/smart_xiaohongshu_scraper.py --input data/input/keywords.csv --outdir data/output --shots screenshots

# 显示浏览器界面
python src/smart_xiaohongshu_scraper.py --input data/input/keywords.csv --outdir data/output --shots screenshots --headful
```

## 输入文件格式

在 `data/input/` 目录下创建 CSV 文件，包含以下列：

```csv
client,keyword
优贝,儿童自行车
优贝,青少年自行车
思迈特,健康管理
思迈特,数据分析
永洪,商业智能
永洪,数据可视化
```

### 必需列说明

- **client**: 客户名称，用于结果分组
- **keyword**: 要采集联想词的关键词

## 输出结果

### CSV 文件结构

结果保存在 `data/output/YYYY-MM-DD/` 目录下，每个客户一个文件：

```csv
date,client,platform,keyword,rank,suggestion_text,page_url,screenshot_path,source_mode
2025-10-22,优贝,xiaohongshu,儿童自行车,1,儿童自行车推荐,https://www.xiaohongshu.com/...,screenshots/...,DOM
```

### 字段说明

- **date**: 采集日期
- **client**: 客户名称
- **platform**: 平台（xiaohongshu）
- **keyword**: 原始关键词
- **rank**: 联想词排名
- **suggestion_text**: 联想词内容
- **page_url**: 页面URL
- **screenshot_path**: 截图路径
- **source_mode**: 数据来源（DOM/OCR/FALLBACK）

## 配置文件

`config/config.yml` 包含所有配置选项：

```yaml
xiaohongshu:
  base_url: "https://www.xiaohongshu.com/explore"
  timeouts:
    page_load: 120000    # 页面加载超时
    search_input: 30000  # 搜索框等待超时
    suggestions: 15000   # 联想词等待超时
  retry:
    max_attempts: 3      # 最大重试次数
    delay: 3000         # 重试延迟
```

## 采集策略

工具采用多重策略确保采集成功率：

### 1. 搜索框输入策略
- 自动查找搜索框
- 输入关键词触发联想词

### 2. 直接访问策略
- 直接访问搜索结果页面
- 从页面提取相关内容

### 3. 兜底机制
- 生成基于关键词的相关联想词
- 确保每个关键词都有结果

## 故障排除

### 常见问题

**1. 浏览器启动失败**
```bash
# 重新安装浏览器
playwright install chromium
```

**2. 访问小红书失败**
- 检查网络连接
- 尝试手动访问 https://www.xiaohongshu.com/explore
- 使用 `--headful` 参数查看具体问题

**3. 依赖安装问题**
```bash
# 升级 pip
pip install --upgrade pip

# 重新安装依赖
pip install -r requirements.txt --force-reinstall
```

### 调试模式

使用 `--headful` 参数运行，可以看到浏览器操作过程：

```bash
python src/smart_xiaohongshu_scraper.py --input data/input/keywords.csv --outdir data/output --shots screenshots --headful
```

## 项目结构

```
小红书采集工具/
├── config/
│   └── config.yml              # 配置文件
├── data/
│   ├── input/                  # 输入文件目录
│   └── output/                 # 输出结果目录
├── screenshots/                # 截图目录
├── src/
│   ├── xiaohongshu_scraper.py     # 基础采集器
│   ├── smart_xiaohongshu_scraper.py # 智能采集器（推荐）
│   ├── utils.py                # 工具函数
│   └── ocr.py                  # OCR功能
├── run_xiaohongshu_scraper.sh     # Linux/macOS 运行脚本
├── run_xiaohongshu.bat           # Windows 运行脚本
└── requirements.txt            # Python依赖
```

## 更新日志

### v1.0 (2025-10-22)
- 🎉 首次发布小红书版本
- ✅ 支持小红书联想词采集
- ✅ 多策略采集机制
- ✅ 智能重试和兜底机制
- ✅ 自动截图功能

## 技术支持

如遇问题，请检查：

1. Python 版本是否为 3.8+
2. 依赖是否正确安装
3. 网络连接是否正常
4. 输入文件格式是否正确

## 许可证

MIT License