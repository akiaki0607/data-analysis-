# 抖音关键词联想词抓取工具

## 📋 项目简介

这是一个自动化抓取抖音关键词联想词的工具，支持批量处理多个客户的关键词，自动截图并生成结构化的CSV数据。

## 🚀 版本历史

### v2.0.0 (2025-10-19) - 连接版本 ✨ 最新稳定版
- 🔗 **连接现有浏览器**：支持连接到已打开的Chrome浏览器
- 🔑 **使用现有登录状态**：无需重复登录，使用已有会话
- 🧹 **修复输入框清空问题**：解决关键词累积问题，确保每次输入都是独立的
- 📸 **改进截图功能**：添加文件大小验证，确保截图质量
- 🛡️ **增强错误处理**：多种选择器备用方案，提高稳定性
- ✅ **用户确认机制**：等待用户准备就绪后开始抓取
- 📊 **详细日志记录**：完整的执行过程记录和调试信息

### v1.0.0 (2025-10-19) - 基础版本
- 📱 基础抖音关键词抓取功能
- 📊 CSV数据输出
- 📸 截图功能
- 🔄 OCR文字识别

## 🎯 功能特性

### 核心功能
- ✅ **批量关键词处理**：支持从CSV文件读取多个关键词
- ✅ **多客户支持**：按客户分组处理和保存结果
- ✅ **自动截图**：每个关键词自动截图保存联想词界面
- ✅ **结构化输出**：生成包含完整信息的CSV文件
- ✅ **浏览器连接**：连接现有Chrome浏览器，使用登录状态

### 技术特性
- 🔧 **Playwright自动化**：使用现代浏览器自动化框架
- 🔗 **Chrome调试协议**：连接现有浏览器实例
- 📝 **多重清空机制**：确保输入框完全清空
- 🔍 **多选择器备用**：提高元素定位成功率
- 📊 **数据验证**：输入内容和文件大小验证

## 📁 项目结构

```
自动化脚本-抓web抖音词/
├── src/                          # 源代码目录
│   ├── connect_douyin_scraper.py # 🌟 主程序（连接版本）
│   ├── main.py                   # 原始程序
│   ├── ocr_douyin_scraper.py     # OCR版本
│   └── utils.py                  # 工具函数
├── config/                       # 配置文件
│   └── config.yml               # 程序配置
├── data/                        # 数据目录
│   ├── input/                   # 输入数据
│   │   └── keywords.csv         # 关键词列表
│   └── output/                  # 输出数据
│       └── 2025-10-19/         # 按日期分组的结果
├── screenshots/                 # 截图目录
│   └── 2025-10-19/             # 按日期分组的截图
├── test_env/                    # Python虚拟环境
├── start_chrome_debug.sh        # Chrome调试模式启动脚本
├── run_connect_scraper.sh       # 一键运行脚本
└── requirements.txt             # Python依赖
```

## 🛠️ 安装和使用

### 环境要求
- Python 3.8+
- Chrome浏览器
- macOS/Linux/Windows

### 快速开始

#### 1. 安装依赖
```bash
# 创建虚拟环境
python -m venv test_env
source test_env/bin/activate  # Linux/macOS
# test_env\Scripts\activate     # Windows

# 安装依赖
pip install -r requirements.txt
playwright install chromium
```

#### 2. 准备数据
编辑 `data/input/keywords.csv` 文件：
```csv
keyword,client
体检套餐,思迈特
数据分析,永洪
```

#### 3. 运行程序

**方法一：一键运行（推荐）**
```bash
# 启动Chrome调试模式
./start_chrome_debug.sh

# 在浏览器中登录抖音后，运行抓取器
./run_connect_scraper.sh
```

**方法二：手动运行**
```bash
# 如果Chrome已开启调试模式
source test_env/bin/activate
python src/connect_douyin_scraper.py --input data/input/keywords.csv --outdir data/output
```

### 使用流程
1. 🚀 启动Chrome调试模式
2. 🔑 在浏览器中登录抖音
3. ▶️ 运行抓取脚本
4. ✅ 确认页面准备就绪
5. 📊 查看生成的结果文件

## 📊 输出格式

### CSV文件结构
```csv
date,client,platform,keyword,rank,suggestion_text,page_url,screenshot_path,source_mode
2025-10-19,思迈特,douyin,体检套餐,1,体检套餐推荐,https://www.douyin.com/search/体检套餐,screenshots/...,DOM
```

### 字段说明
- `date`: 抓取日期
- `client`: 客户名称
- `platform`: 平台（douyin）
- `keyword`: 原始关键词
- `rank`: 联想词排序
- `suggestion_text`: 联想词文本
- `page_url`: 页面URL
- `screenshot_path`: 截图文件路径
- `source_mode`: 数据来源（DOM/OCR/FALLBACK）

## ⚙️ 配置说明

### config/config.yml
```yaml
douyin:
  base_url: 'https://www.douyin.com'
  timeout: 60000  # 超时时间（毫秒）
  wait_time: 2000 # 等待时间（毫秒）

screenshot:
  width: 1280
  height: 720
  min_file_size: 5120  # 最小文件大小（字节）
```

## 🔧 故障排除

### 常见问题

**1. Chrome调试端口连接失败**
```bash
# 检查Chrome是否开启调试模式
curl -s http://localhost:9222/json

# 重新启动Chrome调试模式
./start_chrome_debug.sh
```

**2. 搜索框定位失败**
- 确保已登录抖音账号
- 检查页面是否完全加载
- 尝试刷新页面

**3. 截图文件为空**
- 检查页面是否正确显示
- 确认网络连接稳定
- 查看日志中的错误信息

### 日志文件
程序运行日志保存在 `douyin_scraper.log` 文件中，包含详细的执行过程和错误信息。

## 🎯 最佳实践

### 使用建议
1. **网络环境**：使用稳定的网络连接
2. **登录状态**：确保抖音账号已登录且状态稳定
3. **批量处理**：建议每次处理不超过50个关键词
4. **定期清理**：定期清理截图和日志文件

### 性能优化
- 调整 `config.yml` 中的超时和等待时间
- 使用SSD硬盘提高截图保存速度
- 关闭不必要的浏览器扩展

## 📈 开发计划

### 待实现功能
- [ ] 支持更多平台（小红书、微博等）
- [ ] 图形化界面
- [ ] 实时数据分析
- [ ] 云端部署支持

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发环境设置
```bash
git clone <repository-url>
cd 自动化脚本-抓web抖音词
python -m venv test_env
source test_env/bin/activate
pip install -r requirements.txt
```

## 📄 许可证

本项目仅供学习和研究使用，请遵守相关网站的使用条款。

## 📞 联系方式

如有问题或建议，请提交Issue或联系开发者。

---

**⭐ 如果这个项目对您有帮助，请给个Star支持一下！**