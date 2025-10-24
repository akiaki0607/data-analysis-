#!/bin/bash
# 启动Chrome浏览器调试模式脚本

echo "🚀 启动Chrome浏览器调试模式..."

# 关闭现有Chrome进程
echo "关闭现有Chrome进程..."
pkill -f "Google Chrome" 2>/dev/null || true
sleep 2

# 启动Chrome调试模式
echo "启动Chrome调试模式 (端口: 9222)..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-debug \
  --disable-web-security \
  --disable-features=VizDisplayCompositor \
  --start-maximized \
  https://www.douyin.com &

echo "✅ Chrome已启动，调试端口: 9222"
echo "📝 请在浏览器中登录抖音，然后运行抓取脚本"
echo "🔗 调试地址: http://localhost:9222"