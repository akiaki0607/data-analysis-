#!/usr/bin/env bash
set -e

echo "抖音联想词采集工具 - 开始安装依赖..."

# 安装Python依赖
echo "正在安装Python依赖..."
pip install -r requirements.txt || {
    echo "依赖安装失败，请检查Python和pip是否正确安装"
    exit 1
}

# 安装Playwright浏览器
echo "正在安装Playwright浏览器..."
python -m playwright install chromium || {
    echo "Playwright浏览器安装失败"
    exit 1
}

echo ""
echo "依赖安装完成，开始运行采集程序..."
echo ""

# 运行主程序（可视化模式）
python src/main.py --input data/input/keywords.csv --outdir data/output --shots screenshots --headful

echo ""
echo "程序执行完成！"