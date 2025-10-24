#!/bin/bash

# 职业生涯规划师培训关键词抓取脚本
# 使用方法：./run_career_planning_scraper.sh

echo "🚀 启动职业生涯规划师培训关键词抓取..."
echo "=================================================="

# 检查虚拟环境
if [ ! -d "test_env" ]; then
    echo "❌ 虚拟环境不存在，请先运行 python -m venv test_env"
    exit 1
fi

# 激活虚拟环境
echo "🔧 激活Python虚拟环境..."
source test_env/bin/activate

# 检查关键词文件
KEYWORDS_FILE="data/input/keywords_职业生涯规划师培训.csv"
if [ ! -f "$KEYWORDS_FILE" ]; then
    echo "❌ 关键词文件不存在: $KEYWORDS_FILE"
    exit 1
fi

echo "📋 关键词文件: $KEYWORDS_FILE"
echo "📊 输出目录: data/output"
echo ""

# 显示关键词预览
echo "🔍 关键词预览："
head -10 "$KEYWORDS_FILE"
echo ""

# 提示用户准备
echo "⚠️  请确保："
echo "1. Chrome浏览器已开启调试模式 (运行 ./start_chrome_debug.sh)"
echo "2. 已在浏览器中登录抖音账号"
echo "3. 网络连接稳定"
echo ""

read -p "准备就绪？按回车键继续，或按 Ctrl+C 取消..." 

# 运行抓取程序
echo "🎯 开始抓取职业生涯规划师培训相关关键词..."
python src/connect_douyin_scraper.py \
    --input "$KEYWORDS_FILE" \
    --outdir data/output \
    --debug-port 9222

echo ""
echo "✅ 抓取完成！"
echo "📁 结果文件保存在: data/output/$(date +%Y-%m-%d)/"
echo "📸 截图文件保存在: screenshots/$(date +%Y-%m-%d)/抖音/"