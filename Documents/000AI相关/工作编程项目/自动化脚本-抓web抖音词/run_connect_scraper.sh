#!/bin/bash
# 运行连接版抖音抓取器

echo "🔍 连接版抖音关键词抓取器"
echo "================================"

# 激活虚拟环境
echo "激活虚拟环境..."
source test_env/bin/activate

# 检查Chrome调试端口
echo "检查Chrome调试端口..."
if curl -s http://localhost:9222/json > /dev/null; then
    echo "✅ 检测到Chrome调试端口 (9222)"
else
    echo "❌ 未检测到Chrome调试端口"
    echo "请先运行: ./start_chrome_debug.sh"
    exit 1
fi

# 运行抓取器
echo "运行抓取器..."
python src/connect_douyin_scraper.py \
    --input data/input/keywords.csv \
    --outdir data/output \
    --debug-port 9222

echo "✅ 抓取完成！"