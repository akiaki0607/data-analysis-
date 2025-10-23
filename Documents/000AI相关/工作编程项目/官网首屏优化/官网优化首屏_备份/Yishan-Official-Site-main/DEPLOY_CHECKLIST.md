# 部署检查清单

> **重要**：本项目是 Next.js 应用，部署时必须上传特定目录，否则会导致页面 404

---

## 📦 必须上传的目录和文件

### ✅ 核心目录（缺一不可）

1. **`content/`** ⚠️ **关键！博客系统依赖此目录**
   - 包含所有博客 Markdown 文件
   - 缺少会导致所有 `/blog/*` 页面 404
   - 验证命令：`ls content/blog/*.md`（应显示 9 个 .md 文件）

2. **`app/`** - Next.js 应用路由
3. **`components/`** - React 组件
4. **`lib/`** - 工具函数和数据
5. **`public/`** - 静态资源（图片、llms.txt、robots.txt 等）
6. **`types/`** - TypeScript 类型定义

### ✅ 配置文件

- `next.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `package.json`
- `package-lock.json`

### ❌ 无需上传（自动生成）

- `node_modules/` - 通过 `npm install` 安装
- `.next/` - 通过 `npm run build` 生成

---

## 🚀 标准部署流程

### 步骤 1: 本地验证

```bash
# 确认所有博客文件存在
ls content/blog/*.md

# 应显示 9 个文件：
# ai-content-generation-best-practices.md
# ai-search-trends-2025.md
# ai-search-user-behavior.md
# chatgpt-search-optimization.md
# geo-case-study-saas.md
# geo-metrics-and-analytics.md
# geo-optimization-guide.md
# voice-search-optimization.md
# what-is-geo.md
```

### 步骤 2: 上传文件到服务器

**方式 A：使用 SCP（推荐）**

```bash
# 上传整个项目（排除 node_modules 和 .next）
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ user@server:/www/server/geokeji/
```

**方式 B：使用 Git**

```bash
# 服务器上执行
cd /www/server/geokeji
git pull origin main
```

**方式 C：手动上传（如果前两种方式失败）**

确保上传以下目录：
- `content/` ⚠️
- `app/`
- `components/`
- `lib/`
- `public/`
- `types/`
- 所有配置文件

### 步骤 3: 服务器上安装依赖和构建

```bash
ssh user@server
cd /www/server/geokeji

# 安装依赖
npm install

# 构建项目
npm run build

# 启动服务
npm start
# 或使用 PM2：pm2 restart ecosystem.config.js
```

### 步骤 4: 部署后验证

```bash
# 1. 验证 content 目录
ssh user@server "ls -la /www/server/geokeji/content/blog/"
# 应显示 9 个 .md 文件

# 2. 验证构建产物
ssh user@server "ls -la /www/server/geokeji/.next/"
# 应显示 Next.js 构建目录

# 3. 测试页面访问
curl http://yourdomain.com/blog/what-is-geo
# 应返回 HTML 内容，而非 404
```

---

## 🐛 常见问题排查

### 问题 1: 博客页面全部 404

**症状**：访问 `/blog/what-is-geo` 等页面返回 404

**原因**：服务器缺少 `content/blog/` 目录

**修复**：

```bash
# 方式 1: 从本地上传
scp -r ./content/ user@server:/www/server/geokeji/

# 方式 2: 服务器上 git pull
ssh user@server "cd /www/server/geokeji && git pull"

# 验证
ssh user@server "ls /www/server/geokeji/content/blog/*.md"
```

### 问题 2: 页面显示但样式错误

**原因**：缺少 `.next` 构建产物或 `public` 目录

**修复**：

```bash
ssh user@server
cd /www/server/geokeji
npm run build
pm2 restart all  # 或 npm start
```

### 问题 3: Git Pull 后 content 仍然缺失

**原因**：`.gitignore` 可能误将 `content` 加入忽略

**修复**：

```bash
# 本地检查 .gitignore
cat .gitignore | grep content

# 如果 content 被忽略，从 .gitignore 移除后重新提交
git add content/
git commit -m "fix: 确保 content 目录被版本控制"
git push

# 服务器重新拉取
ssh user@server "cd /www/server/geokeji && git pull"
```

---

## 📝 部署前自检清单

部署前逐一确认：

- [ ] 本地 `content/blog/` 包含 9 个 .md 文件
- [ ] 所有文件已提交到 Git（`git status` 显示 clean）
- [ ] `.gitignore` 没有忽略 `content/` 目录
- [ ] `package.json` 和 `package-lock.json` 已更新
- [ ] 已在本地测试构建成功（`npm run build`）

部署后逐一验证：

- [ ] 服务器上 `content/blog/` 包含 9 个 .md 文件
- [ ] 服务器上已安装依赖（`node_modules/` 存在）
- [ ] 服务器上已构建项目（`.next/` 存在）
- [ ] 访问 `/blog/what-is-geo` 返回正常页面（非 404）
- [ ] 访问 `/blog` 列表显示 9 篇文章

---

## 🔍 快速验证脚本

复制以下脚本到服务器执行，一键检查所有关键文件：

```bash
#!/bin/bash
echo "=== 部署验证开始 ==="

# 检查 content 目录
if [ -d "content/blog" ]; then
  MD_COUNT=$(ls content/blog/*.md 2>/dev/null | wc -l)
  echo "✅ content/blog 存在，包含 $MD_COUNT 个 .md 文件"
else
  echo "❌ content/blog 目录不存在！"
fi

# 检查 node_modules
if [ -d "node_modules" ]; then
  echo "✅ node_modules 存在"
else
  echo "⚠️ node_modules 不存在，需要执行 npm install"
fi

# 检查 .next 构建产物
if [ -d ".next" ]; then
  echo "✅ .next 构建产物存在"
else
  echo "⚠️ .next 不存在，需要执行 npm run build"
fi

# 检查进程
if pgrep -f "next" > /dev/null; then
  echo "✅ Next.js 服务正在运行"
else
  echo "⚠️ Next.js 服务未运行"
fi

echo "=== 验证完成 ==="
```

保存为 `verify-deploy.sh`，执行：

```bash
chmod +x verify-deploy.sh
./verify-deploy.sh
```

---

**文档版本**: 1.0  
**最后更新**: 2025-10-15  
**维护人员**: 开发团队


