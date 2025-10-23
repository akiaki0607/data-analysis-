#!/bin/bash

##############################################################################
# Next.js 紧急回滚脚本
# 用途：将项目回滚到上一个 Git 版本
# 执行方式：bash scripts/rollback.sh
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
echo -e "${RED}  ⚠️  紧急回滚脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. 显示当前版本
CURRENT_VERSION=$(git rev-parse HEAD)
echo -e "${YELLOW}当前版本: ${CURRENT_VERSION:0:8}${NC}"
echo ""

# 2. 显示最近的提交历史
echo -e "${BLUE}最近 5 次提交：${NC}"
git log --oneline -5
echo ""

# 3. 确认回滚
echo -e "${RED}⚠️  警告：此操作将回滚到上一个版本！${NC}"
echo -e "${YELLOW}是否继续？(yes/no) [默认: no]${NC}"
read -r -p "> " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${GREEN}已取消回滚${NC}"
    exit 0
fi

# 4. 获取上一个版本
PREVIOUS_VERSION=$(git rev-parse HEAD~1)
echo ""
echo -e "${YELLOW}[1/4]${NC} 准备回滚到版本: ${GREEN}${PREVIOUS_VERSION:0:8}${NC}"
echo ""

# 5. 执行回滚
echo -e "${YELLOW}[2/4]${NC} 执行 Git 回滚..."
git reset --hard HEAD~1
echo -e "${GREEN}✅ Git 回滚成功${NC}"
echo ""

# 6. 检查依赖是否需要重新安装
echo -e "${YELLOW}[3/4]${NC} 检查依赖..."
if git diff --name-only $PREVIOUS_VERSION $CURRENT_VERSION | grep -q "package.json"; then
    echo -e "${YELLOW}⚠️  检测到 package.json 变化，重新安装依赖${NC}"
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ 依赖无变化${NC}"
fi
echo ""

# 7. 重新构建
echo -e "${YELLOW}[4/4]${NC} 重新构建..."
echo -e "${BLUE}执行: npm run build${NC}"

if ! npm run build; then
    echo -e "${RED}❌ 构建失败！${NC}"
    echo -e "${YELLOW}尝试清理缓存后重新构建...${NC}"
    rm -rf .next node_modules
    npm install
    npm run build
fi

echo -e "${GREEN}✅ 构建成功${NC}"
echo ""

# 8. 重启服务
echo -e "${YELLOW}重启 PM2 服务...${NC}"
pm2 restart $APP_NAME
pm2 save
echo -e "${GREEN}✅ 服务重启成功${NC}"
echo ""

# 9. 输出结果
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ 回滚成功！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}📊 回滚信息：${NC}"
echo -e "  旧版本: ${RED}${CURRENT_VERSION:0:8}${NC}"
echo -e "  当前版本: ${GREEN}${PREVIOUS_VERSION:0:8}${NC}"
echo ""
echo -e "${BLUE}🌐 访问地址：${NC}"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")
echo -e "  ${GREEN}http://$SERVER_IP:$APP_PORT${NC}"
echo ""
echo -e "${BLUE}📋 查看日志：${NC}"
echo -e "  ${YELLOW}pm2 logs $APP_NAME${NC}"
echo ""
echo -e "${BLUE}🔄 如需回滚到更早版本：${NC}"
echo -e "  ${YELLOW}git log --oneline -10${NC}      # 查看历史"
echo -e "  ${YELLOW}git reset --hard <commit-id>${NC}  # 回滚到指定版本"
echo -e "  ${YELLOW}npm run build && pm2 restart $APP_NAME${NC}"
echo ""
echo -e "${BLUE}========================================${NC}"

