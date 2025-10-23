#!/bin/bash

##############################################################################
# Next.js 首次部署脚本
# 用途：在服务器上首次部署 Next.js 项目（Git 已克隆后执行）
# 执行方式：bash scripts/setup-git-deploy.sh
##############################################################################

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目配置
APP_NAME="yishan-official"
APP_PORT=5280
PROJECT_DIR=$(pwd)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Next.js 首次部署脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. 检查 Node.js 版本
echo -e "${YELLOW}[1/7]${NC} 检查 Node.js 环境..."
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)

if [ -z "$NODE_VERSION" ]; then
    echo -e "${RED}❌ 错误：未检测到 Node.js，请先安装 Node.js 18+${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
echo ""

# 2. 检查 PM2
echo -e "${YELLOW}[2/7]${NC} 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 未安装，正在安装...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 安装成功${NC}"
else
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✅ PM2 已安装: v$PM2_VERSION${NC}"
fi
echo ""

# 3. 检查环境变量文件
echo -e "${YELLOW}[3/7]${NC} 检查环境变量..."
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ 错误：未找到 .env.local 文件${NC}"
    echo -e "${YELLOW}请先创建 .env.local 文件，参考 .env.local.example${NC}"
    echo ""
    echo -e "${BLUE}快速创建方法：${NC}"
    echo "cat > .env.local << 'EOF'"
    echo "NEXT_PUBLIC_SITE_URL=https://www.geokeji.com"
    echo "SMTP_HOST=smtp.example.com"
    echo "SMTP_PORT=465"
    echo "SMTP_USER=your-email@example.com"
    echo "SMTP_PASS=your-password"
    echo "SMTP_FROM=noreply@geokeji.com"
    echo "CONTACT_EMAIL=contact@geokeji.com"
    echo "EOF"
    exit 1
fi
echo -e "${GREEN}✅ 环境变量文件存在${NC}"
echo ""

# 4. 安装依赖
echo -e "${YELLOW}[4/7]${NC} 安装项目依赖..."
echo -e "${BLUE}执行: npm install${NC}"
npm install
echo -e "${GREEN}✅ 依赖安装完成${NC}"
echo ""

# 5. 构建项目
echo -e "${YELLOW}[5/7]${NC} 构建项目..."
echo -e "${BLUE}执行: npm run build${NC}"
echo -e "${YELLOW}⏳ 首次构建可能需要 3-5 分钟，请耐心等待...${NC}"
npm run build
echo -e "${GREEN}✅ 项目构建完成${NC}"
echo ""

# 6. 启动 PM2 服务
echo -e "${YELLOW}[6/7]${NC} 启动 PM2 服务..."

# 检查是否已有同名服务
if pm2 describe $APP_NAME > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  检测到已有服务 $APP_NAME，正在重启...${NC}"
    pm2 restart $APP_NAME
else
    echo -e "${BLUE}启动新服务: $APP_NAME${NC}"
    pm2 start ecosystem.config.js
fi

pm2 save
echo -e "${GREEN}✅ PM2 服务启动成功${NC}"
echo ""

# 7. 输出访问信息
echo -e "${YELLOW}[7/7]${NC} 部署完成！"
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ 部署成功！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}📋 服务信息：${NC}"
echo -e "  应用名称: ${GREEN}$APP_NAME${NC}"
echo -e "  运行端口: ${GREEN}$APP_PORT${NC}"
echo -e "  项目路径: ${GREEN}$PROJECT_DIR${NC}"
echo ""
echo -e "${BLUE}🌐 访问地址：${NC}"
echo -e "  本地访问: ${GREEN}http://localhost:$APP_PORT${NC}"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
echo -e "  公网访问: ${GREEN}http://$SERVER_IP:$APP_PORT${NC}"
echo ""
echo -e "${BLUE}📊 常用命令：${NC}"
echo -e "  查看状态: ${YELLOW}pm2 list${NC}"
echo -e "  查看日志: ${YELLOW}pm2 logs $APP_NAME${NC}"
echo -e "  重启服务: ${YELLOW}pm2 restart $APP_NAME${NC}"
echo -e "  停止服务: ${YELLOW}pm2 stop $APP_NAME${NC}"
echo ""
echo -e "${BLUE}🔄 下次更新：${NC}"
echo -e "  ${YELLOW}bash scripts/deploy-update.sh${NC}"
echo ""
echo -e "${BLUE}🚀 下一步：${NC}"
echo -e "  1. 配置 Nginx 反向代理（参考 nginx/geokeji.conf）"
echo -e "  2. 绑定域名"
echo -e "  3. 配置 HTTPS（Let's Encrypt）"
echo ""
echo -e "${BLUE}========================================${NC}"

