#!/bin/bash

##############################################################################
# Next.js 一键部署脚本（服务器端使用）
# 用途：日常更新部署（拉取代码 → 清理文档 → 构建 → 重启）
# 执行方式：bash scripts/deploy.sh
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

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Yishan Official Site - 一键部署${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 保存当前版本（用于回滚和检测变化）
CURRENT_VERSION=$(git rev-parse HEAD)
echo -e "${YELLOW}当前版本: ${GREEN}${CURRENT_VERSION:0:8}${NC}"
echo ""

# 1. 拉取最新代码
echo -e "${YELLOW}[1/5]${NC} 拉取最新代码..."
echo -e "${BLUE}执行: git pull origin main${NC}"

if ! git pull origin main; then
    echo -e "${RED}❌ Git pull 失败！${NC}"
    echo -e "${YELLOW}可能原因：${NC}"
    echo -e "  1. 本地文件被修改（冲突）"
    echo -e "  2. 网络连接问题"
    echo ""
    echo -e "${BLUE}解决方法：${NC}"
    echo -e "  ${YELLOW}git stash${NC}        # 暂存本地修改"
    echo -e "  ${YELLOW}git pull${NC}         # 重新拉取"
    echo -e "  ${YELLOW}git stash pop${NC}    # 恢复本地修改"
    exit 1
fi

NEW_VERSION=$(git rev-parse HEAD)
echo -e "${GREEN}✅ 代码更新成功${NC}"
echo -e "   新版本: ${GREEN}${NEW_VERSION:0:8}${NC}"
echo ""

# 检查是否有更新
if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo -e "${YELLOW}⚠️  代码无更新，跳过构建${NC}"
    exit 0
fi

# 2. 智能依赖检测
echo -e "${YELLOW}[2/5]${NC} 检查依赖变化..."
PACKAGE_CHANGED=false

# 对比 package.json 是否变化
if git diff --name-only $CURRENT_VERSION $NEW_VERSION | grep -q "package.json"; then
    PACKAGE_CHANGED=true
    echo -e "${YELLOW}⚠️  检测到 package.json 变化${NC}"
    echo -e "${BLUE}执行: npm install${NC}"
    npm install
    echo -e "${GREEN}✅ 依赖更新完成${NC}"
else
    echo -e "${GREEN}✅ 依赖无变化，跳过安装${NC}"
fi
echo ""

# 3. 清理文档文件
echo -e "${YELLOW}[3/5]${NC} 清理不必要的文档..."
echo -e "${BLUE}执行: bash scripts/deploy-clean.sh${NC}"
bash scripts/deploy-clean.sh
echo ""

# 4. 构建项目
echo -e "${YELLOW}[4/5]${NC} 构建项目..."
echo -e "${BLUE}执行: npm run build${NC}"
echo -e "${YELLOW}⏳ 构建中，请稍候...${NC}"

if ! npm run build; then
    echo -e "${RED}❌ 构建失败！${NC}"
    echo ""
    echo -e "${YELLOW}正在回滚到上一个版本...${NC}"
    git reset --hard $CURRENT_VERSION
    echo -e "${GREEN}✅ 已回滚到版本: ${CURRENT_VERSION:0:8}${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建成功${NC}"
echo ""

# 5. 重启 PM2
echo -e "${YELLOW}[5/5]${NC} 重启应用..."

if ! pm2 describe $APP_NAME > /dev/null 2>&1; then
    echo -e "${RED}❌ 错误：未找到 PM2 服务 $APP_NAME${NC}"
    echo -e "${YELLOW}请先执行首次部署脚本：${NC}"
    echo -e "  ${BLUE}bash scripts/setup-git-deploy.sh${NC}"
    exit 1
fi

pm2 restart $APP_NAME
pm2 save
echo -e "${GREEN}✅ 服务重启成功${NC}"
echo ""

# 输出部署结果
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}📊 更新信息：${NC}"
echo -e "  旧版本: ${YELLOW}${CURRENT_VERSION:0:8}${NC}"
echo -e "  新版本: ${GREEN}${NEW_VERSION:0:8}${NC}"
echo -e "  更新文件数: ${GREEN}$(git diff --name-only $CURRENT_VERSION $NEW_VERSION | wc -l)${NC}"
echo ""
echo -e "${BLUE}🌐 访问地址：${NC}"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
echo -e "  ${GREEN}http://$SERVER_IP:$APP_PORT${NC}"
echo ""
echo -e "${BLUE}📋 查看日志：${NC}"
echo -e "  ${YELLOW}pm2 logs $APP_NAME${NC}"
echo ""
echo -e "${BLUE}🔄 如果出现问题，回滚到上一个版本：${NC}"
echo -e "  ${YELLOW}bash scripts/rollback.sh${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"

# 显示最近几条日志
echo -e "${YELLOW}📝 最近日志：${NC}"
pm2 logs $APP_NAME --lines 10 --nostream
