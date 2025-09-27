#!/bin/bash

# GEO优化分析系统启动脚本

echo "🚀 启动GEO优化分析系统 V2"
echo "================================"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "📦 创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "🔧 激活虚拟环境..."
source venv/bin/activate

# 安装依赖
echo "📚 安装依赖包..."
pip install -r requirements.txt

# 运行测试
echo "🧪 运行系统测试..."
python test_system.py

echo ""
echo "🌐 启动Web服务器..."
echo "访问地址: http://127.0.0.1:8080"
echo "按 Ctrl+C 停止服务器"
echo "================================"

# 启动Flask应用
python app.py