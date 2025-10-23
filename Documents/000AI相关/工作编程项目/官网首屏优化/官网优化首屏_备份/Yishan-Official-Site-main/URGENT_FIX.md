# 🚨 紧急修复：博客 404 问题

> **问题**：服务器上所有博客页面（/blog/*）返回 404  
> **原因**：缺少 `content/blog/` 目录  
> **预计修复时间**：5 分钟

---

## 📋 快速修复步骤

### 方式 1: 从本地上传（推荐，最快）

```bash
# 1. 在本地项目目录执行（Windows PowerShell 或 Git Bash）
scp -r ./content/ user@server:/www/server/geokeji/

# 替换以下内容：
# - user: 你的服务器用户名
# - server: 服务器 IP 或域名
# - /www/server/geokeji/: 项目在服务器上的路径

# 示例：
# scp -r ./content/ root@123.456.78.90:/www/server/geokeji/
```

### 方式 2: 通过 Git 拉取

```bash
# 1. SSH 登录服务器
ssh user@server

# 2. 进入项目目录
cd /www/server/geokeji

# 3. 拉取最新代码
git pull origin main

# 4. 验证文件
ls content/blog/*.md
# 应显示 9 个 .md 文件
```

### 方式 3: 手动下载上传（如果以上方式都失败）

1. 从 GitHub 下载 `content` 目录：
   ```
   https://github.com/yourusername/your-repo/tree/main/content
   ```

2. 使用 FTP/SFTP 工具（如 FileZilla）上传到服务器：
   ```
   本地: D:\MyProject\Yishan-Official-Site\content
   服务器: /www/server/geokeji/content
   ```

---

## ✅ 验证修复

### 步骤 1: 检查文件是否上传成功

```bash
ssh user@server "ls -la /www/server/geokeji/content/blog/"
```

**预期输出**（应显示 9 个 .md 文件）：

```
ai-content-generation-best-practices.md
ai-search-trends-2025.md
ai-search-user-behavior.md
chatgpt-search-optimization.md
geo-case-study-saas.md
geo-metrics-and-analytics.md
geo-optimization-guide.md
voice-search-optimization.md
what-is-geo.md
```

### 步骤 2: 重启服务（可选）

**如果使用 PM2：**

```bash
ssh user@server "cd /www/server/geokeji && pm2 restart all"
```

**如果使用 npm start：**

```bash
# 先停止现有进程
ssh user@server "pkill -f 'node.*next'"

# 重新启动
ssh user@server "cd /www/server/geokeji && npm start &"
```

> **注意**：通常无需重启，Next.js 会自动检测文件变化。

### 步骤 3: 测试页面访问

**方式 A：浏览器测试**

访问以下 URL（替换为你的域名）：

- ✅ http://yourdomain.com/blog/what-is-geo
- ✅ http://yourdomain.com/blog/ai-search-trends-2025
- ✅ http://yourdomain.com/blog

**方式 B：命令行测试**

```bash
curl -I http://yourdomain.com/blog/what-is-geo
```

**预期输出**：

```
HTTP/1.1 200 OK
```

**错误输出**：

```
HTTP/1.1 404 Not Found  # 说明修复失败
```

---

## 🔍 如果修复后仍然 404

### 检查 1: 确认文件确实存在

```bash
ssh user@server "cat /www/server/geokeji/content/blog/what-is-geo.md"
# 应显示文件内容
```

### 检查 2: 确认构建产物存在

```bash
ssh user@server "ls /www/server/geokeji/.next/"
# 应显示构建目录
```

如果 `.next` 不存在，执行：

```bash
ssh user@server
cd /www/server/geokeji
npm run build
pm2 restart all  # 或重启你的服务
```

### 检查 3: 确认服务正在运行

```bash
ssh user@server "ps aux | grep next"
# 应显示 Node.js 进程
```

如果没有进程，执行：

```bash
ssh user@server "cd /www/server/geokeji && pm2 start ecosystem.config.js"
# 或
ssh user@server "cd /www/server/geokeji && npm start"
```

---

## 📞 需要帮助？

如果以上步骤都无法解决问题，提供以下信息联系开发人员：

1. **服务器验证输出**：
   ```bash
   ssh user@server "ls -la /www/server/geokeji/content/blog/"
   ```

2. **构建状态**：
   ```bash
   ssh user@server "ls -la /www/server/geokeji/.next/"
   ```

3. **服务进程状态**：
   ```bash
   ssh user@server "ps aux | grep next"
   ```

4. **页面访问结果**：
   ```bash
   curl -I http://yourdomain.com/blog/what-is-geo
   ```

---

**文档版本**: 1.0  
**创建时间**: 2025-10-15  
**预计修复时间**: 5 分钟


