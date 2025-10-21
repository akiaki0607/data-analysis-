#!/bin/bash

# 小红书联想词采集工具运行脚本
# 使用方法: ./run_xiaohongshu_scraper.sh

echo "🚀 启动小红书联想词采集工具..."
echo "=================================="

# 检查Python环境
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 python3，请先安装Python 3"
    exit 1
fi

# 检查必要的目录
if [ ! -d "data/input" ]; then
    echo "❌ 错误: data/input 目录不存在"
    exit 1
fi

# 查找输入文件
INPUT_FILE=""
if [ -f "data/input/keywords.csv" ]; then
    INPUT_FILE="data/input/keywords.csv"
elif [ -f "data/input/keywords_优贝.csv" ]; then
    INPUT_FILE="data/input/keywords_优贝.csv"
else
    echo "❌ 错误: 未找到关键词输入文件"
    echo "请确保以下文件之一存在:"
    echo "  - data/input/keywords.csv"
    echo "  - data/input/keywords_优贝.csv"
    exit 1
fi

echo "✅ 找到输入文件: $INPUT_FILE"

# 设置输出目录
OUTPUT_DIR="data/output"
SCREENSHOT_DIR="screenshots"

# 创建输出目录
mkdir -p "$OUTPUT_DIR"
mkdir -p "$SCREENSHOT_DIR"

echo "📁 输出目录: $OUTPUT_DIR"
echo "📸 截图目录: $SCREENSHOT_DIR"
echo ""

# 询问是否显示浏览器界面
echo "是否显示浏览器界面? (y/N): "
read -r SHOW_BROWSER

HEADFUL_FLAG=""
if [[ "$SHOW_BROWSER" =~ ^[Yy]$ ]]; then
    HEADFUL_FLAG="--headful"
    echo "🌐 将显示浏览器界面"
else
    echo "🔒 将在后台运行（无界面）"
fi

echo ""
echo "开始采集..."
echo "=================================="

# 运行采集程序
python3 src/smart_xiaohongshu_scraper.py \
    --input "$INPUT_FILE" \
    --outdir "$OUTPUT_DIR" \
    --shots "$SCREENSHOT_DIR" \
    $HEADFUL_FLAG

echo ""
echo "=================================="
echo "✅ 采集任务完成！"
echo "📊 请查看输出目录: $OUTPUT_DIR"
echo "📸 请查看截图目录: $SCREENSHOT_DIR"