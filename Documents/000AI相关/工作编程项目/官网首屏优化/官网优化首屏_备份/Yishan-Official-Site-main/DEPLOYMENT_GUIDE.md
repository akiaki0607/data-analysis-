# Next.js 项目部署完整指南（Git Pull 方式）

> 本指南专为 Ubuntu 服务器 + Git 部署方式设计，适合零基础的开发者。  
> 服务器环境：Node.js v20.19.5 | npm v10.8.2 | Nginx v1.20.2

---

## 📋 目录

- [为什么选择 Git 部署？](#为什么选择-git-部署)
- [第一部分：Git SSH 配置（5分钟）](#第一部分git-ssh-配置5分钟)
- [第二部分：首次部署流程](#第二部分首次部署流程)
- [第三部分：日常更新流程](#第三部分日常更新流程)
- [第四部分：PM2 进程管理](#第四部分pm2-进程管理)
- [第五部分：Nginx 配置详解](#第五部分nginx-配置详解)
- [第六部分：常见问题排查](#第六部分常见问题排查)

---

## 为什么选择 Git 部署？

### Next.js vs Vue 的本质区别

**Vue（静态站点）**：
```
开发 → npm run build → dist/ 文件夹 → 上传到 Nginx → 直接访问 HTML
```

**Next.js（服务端渲染 SSR）**：
```
开发 → npm run build → .next/ + 完整源码 → Node.js 运行时 → 动态渲染页面
```

**核心区别**：
- ❌ Next.js **不能**像 Vue 一样只传 `dist/` 包
- ✅ Next.js **需要**完整项目文件（`app/`, `content/`, `public/`, `package.json` 等）
- ✅ Next.js **需要** Node.js 运行时环境
- ✅ `.next/` 只是构建产物，不能单独运行

### Git Pull 的 3 大优势

| 对比项 | 手动上传（FTP/SFTP） | Git Pull（推荐） |
|--------|---------------------|-----------------|
| **操作步骤** | 选择文件→上传→覆盖（容易漏文件） | `git pull` 一条命令 |
| **更新速度** | 5-10 分钟 | 10 秒 |
| **是否漏传** | ⚠️ 容易漏传 `content/`、`lib/` 等目录 | ✅ 永不漏传 |
| **版本控制** | ❌ 无版本历史 | ✅ 完整 Git 历史 |
| **回滚能力** | ❌ 困难（需要备份） | ✅ `git reset` 一键回滚 |

### 部署流程对比图

```
┌─────────────────────────────────────────────────────────┐
│ 手动上传方式（不推荐）                                      │
├─────────────────────────────────────────────────────────┤
│ 1. 本地修改代码                                            │
│ 2. 打开 MobaXterm/XShell                                  │
│ 3. 选择修改的文件（容易遗漏）                               │
│ 4. 上传到服务器（等待 5-10 分钟）                           │
│ 5. SSH 登录服务器                                          │
│ 6. cd /www/server/geokeji                                │
│ 7. npm run build                                         │
│ 8. pm2 restart yishan-official                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Git Pull 方式（推荐）                                      │
├─────────────────────────────────────────────────────────┤
│ 1. 本地修改代码                                            │
│ 2. git push                                              │
│ 3. SSH 登录服务器                                          │
│ 4. bash scripts/deploy-update.sh                        │
│    （自动执行：git pull + npm install + build + restart）  │
└─────────────────────────────────────────────────────────┘
```

---

## 第一部分：Git SSH 配置（5分钟）

### 步骤1：生成 SSH 密钥

在服务器上执行（**注意替换邮箱**）：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**命令解释**：
- `ssh-keygen`：生成 SSH 密钥工具
- `-t rsa`：使用 RSA 加密算法
- `-b 4096`：密钥长度 4096 位（更安全）
- `-C "邮箱"`：添加注释，便于识别

**交互提示**：
```
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): [直接回车]
Enter passphrase (empty for no passphrase): [直接回车]
Enter same passphrase again: [直接回车]
```

✅ **成功标志**：看到类似这样的指纹图案
```
+---[RSA 4096]----+
|    .o.          |
|   .  o          |
|  . .. .         |
| . o. o          |
+----[SHA256]-----+
```

### 步骤2：复制公钥

```bash
cat ~/.ssh/id_rsa.pub
```

**会输出类似这样的内容**（全部复制）：
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDxxxxxx...很长的字符串...xxxxx your_email@example.com
```

### 步骤3：添加公钥到 GitHub

1. 打开 GitHub → 点击右上角头像 → **Settings**
2. 左侧菜单点击 **SSH and GPG keys**
3. 点击 **New SSH key** 按钮
4. **Title** 填写：`Ubuntu Server - geokeji.com`（便于识别）
5. **Key** 粘贴刚才复制的公钥（整段内容）
6. 点击 **Add SSH key** 确认

### 步骤4：测试连接

```bash
ssh -T git@github.com
```

**第一次连接会提示**：
```
The authenticity of host 'github.com (20.205.243.166)' can't be established.
Are you sure you want to continue connecting (yes/no/[fingerprint])? 
```
👉 **输入 `yes` 回车**

**成功标志**（看到这个就成功了）：
```
Hi 你的GitHub用户名! You've successfully authenticated, but GitHub does not provide shell access.
```

### 常见问题：Permission denied

**问题现象**：
```
git@github.com: Permission denied (publickey).
```

**解决方法**：
1. 检查公钥是否正确复制到 GitHub（不要漏掉开头或结尾）
2. 确认邮箱和 GitHub 账号一致
3. 重新生成密钥：`rm -rf ~/.ssh/id_rsa*` 然后重新执行步骤1

---

## 第二部分：首次部署流程

### 准备工作：清理旧文件

⚠️ **如果服务器已有旧项目，先备份再删除**：

```bash
cd /www/server
mv geokeji geokeji_backup_$(date +%Y%m%d)  # 备份旧文件
```

### 步骤1：克隆项目

**获取 GitHub 仓库地址**（在本地 Windows 上查看）：

```bash
# 在本地项目目录执行（Git Bash 或 PowerShell）
git remote -v
```

会显示类似：
```
origin  git@github.com:你的用户名/Yishan-Official-Site.git (fetch)
```

**在服务器上克隆**：

```bash
cd /www/server
git clone git@github.com:你的用户名/Yishan-Official-Site.git geokeji
cd geokeji
```

✅ **成功标志**：看到 `Cloning into 'geokeji'...` 并完成克隆

### 步骤2：安装 PM2

PM2 是 Node.js 进程管理工具，用于守护进程、自动重启、日志管理。

```bash
npm install -g pm2
```

**验证安装**：
```bash
pm2 --version
```

### 步骤3：配置环境变量

创建 `.env.local` 文件（**注意替换真实信息**）：

```bash
cat > .env.local << 'EOF'
# 网站URL（替换为你的域名）
NEXT_PUBLIC_SITE_URL=https://www.geokeji.com

# 邮件配置（用于联系表单）
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@geokeji.com
CONTACT_EMAIL=contact@geokeji.com
EOF
```

**编辑环境变量**：
```bash
nano .env.local  # 或者 vim .env.local
```

👉 修改完成后按 `Ctrl + X`，输入 `Y`，回车保存。

### 步骤4：执行一键部署脚本

```bash
bash scripts/setup-git-deploy.sh
```

**脚本会自动完成**：
1. ✅ 检查 Node.js/npm 版本
2. ✅ 安装项目依赖（`npm install`）
3. ✅ 构建项目（`npm run build`）
4. ✅ 启动 PM2 服务
5. ✅ 输出访问地址

**预计耗时**：3-5 分钟（首次构建较慢）

✅ **成功标志**：看到类似输出
```
✅ 部署成功！
🌐 访问地址：http://你的服务器IP:5280
📊 查看日志：pm2 logs yishan-official
📋 查看状态：pm2 list
```

### 步骤5：配置 Nginx 反向代理

**复制 Nginx 配置文件**：

```bash
sudo cp nginx/geokeji.conf /etc/nginx/sites-available/geokeji
```

**编辑配置文件**（修改域名）：

```bash
sudo nano /etc/nginx/sites-available/geokeji
```

找到 `server_name` 行，修改为你的域名：
```nginx
server_name www.geokeji.com geokeji.com;
```

**启用站点配置**：

```bash
sudo ln -s /etc/nginx/sites-available/geokeji /etc/nginx/sites-enabled/
```

**测试 Nginx 配置**：

```bash
sudo nginx -t
```

✅ **成功标志**：
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**重载 Nginx**：

```bash
sudo nginx -s reload
```

### 步骤6：验证部署成功

**方法1：直接访问 IP + 端口**
```
http://你的服务器IP:5280
```

**方法2：通过域名访问**（需要先配置DNS）
```
http://www.geokeji.com
```

**检查 PM2 状态**：
```bash
pm2 list
```

应该看到：
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ yishan-official  │ online  │ 0       │ 2m       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

**查看运行日志**：
```bash
pm2 logs yishan-official --lines 50
```

---

## 第三部分：日常更新流程

### 极简 2 步更新法

**步骤1：本地推送代码（Windows 上）**

```bash
# 在项目目录（Git Bash 或 PowerShell）
git add .

# 使用 txt 文件方式提交（避免中文乱码）
echo "fix: 修复某个问题" > commit-message.txt
git commit -F commit-message.txt
rm commit-message.txt

# 推送到 GitHub
git push origin main
```

**步骤2：服务器更新（SSH 登录后）**

```bash
cd /www/server/geokeji
bash scripts/deploy-update.sh
```

**脚本会自动完成**：
1. ✅ 拉取最新代码（`git pull`）
2. ✅ 检测依赖变化（如果 `package.json` 变化，自动 `npm install`）
3. ✅ 重新构建（`npm run build`）
4. ✅ 重启服务（`pm2 restart yishan-official`）
5. ✅ 显示部署结果

**预计耗时**：30 秒 - 1 分钟

✅ **成功标志**：
```
✅ 更新成功！
🌐 访问地址：http://www.geokeji.com
📊 查看日志：pm2 logs yishan-official
```

### 一键更新脚本详解

`scripts/deploy-update.sh` 的工作流程：

```bash
1. 保存当前 Git 版本号（用于回滚）
2. git pull origin main（拉取最新代码）
3. 清理开发文档（调用 deploy-clean.sh）
4. 对比 package.json 文件 MD5
   - 如果变化 → npm install
   - 如果未变化 → 跳过（节省时间）
5. npm run build（重新构建）
6. pm2 restart yishan-official（重启服务）
7. 输出访问地址和日志命令
```

### 自动文档清理机制

**为什么要清理文档？**
- 开发文档（AI开发指南.md、配置指南.md 等）对生产环境无用
- 清理这些文件可以节省服务器空间
- 保持生产环境整洁

**清理机制**：
本项目使用 `.gitattributes` + `deploy-clean.sh` 脚本实现自动清理：

1. **标记文件**（`.gitattributes`）：
   ```
   AI开发指南.md export-ignore
   配置指南.md export-ignore
   README.md export-ignore
   .cursorrules export-ignore
   ```

2. **自动删除**（`scripts/deploy-clean.sh`）：
   - 读取 `.gitattributes` 中标记的文件
   - 在服务器部署时自动删除
   - 本地开发环境保持不变

3. **保留文件**：
   - ✅ 博客文章（`content/blog/*.md`）保留
   - ✅ 环境变量（`.env.local`）保留
   - ✅ 所有业务代码保留

**注意**：`deploy.sh` 和 `deploy-update.sh` 都会自动调用清理脚本。

---

## 第四部分：PM2 进程管理

### 常用命令速查表

| 命令 | 说明 |
|------|------|
| `pm2 list` | 查看所有服务状态 |
| `pm2 logs yishan-official` | 查看实时日志（Ctrl+C 退出） |
| `pm2 logs yishan-official --lines 100` | 查看最近 100 行日志 |
| `pm2 restart yishan-official` | 重启服务 |
| `pm2 stop yishan-official` | 停止服务 |
| `pm2 delete yishan-official` | 删除服务 |
| `pm2 monit` | 实时监控（CPU/内存） |
| `pm2 save` | 保存当前进程列表 |
| `pm2 startup` | 设置开机自启动 |
| `pm2 flush` | 清空日志 |

### 查看日志技巧

**实时日志**（类似 `tail -f`）：
```bash
pm2 logs yishan-official
```

**只看错误日志**：
```bash
pm2 logs yishan-official --err
```

**只看输出日志**：
```bash
pm2 logs yishan-official --out
```

**日志文件位置**：
```
/root/.pm2/logs/yishan-official-out.log   # 标准输出
/root/.pm2/logs/yishan-official-error.log # 错误日志
```

### 开机自启动配置

**首次设置**：
```bash
pm2 startup
```

会输出一条命令，**复制并执行**它，类似：
```bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**保存当前进程列表**：
```bash
pm2 save
```

**验证**：重启服务器后执行 `pm2 list`，应该看到服务自动运行。

---

## 第五部分：Nginx 配置详解

### 配置文件位置

```
/etc/nginx/sites-available/geokeji  # 配置文件
/etc/nginx/sites-enabled/geokeji    # 软链接（启用配置）
```

### 域名绑定设置

编辑配置文件：
```bash
sudo nano /etc/nginx/sites-available/geokeji
```

**关键配置项**：

```nginx
server {
    listen 80;
    server_name www.geokeji.com geokeji.com;  # 修改为你的域名
    
    location / {
        proxy_pass http://localhost:5280;  # 代理到 Next.js 服务
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Nginx 管理命令

| 命令 | 说明 |
|------|------|
| `sudo nginx -t` | 测试配置文件语法 |
| `sudo nginx -s reload` | 重载配置（不停机） |
| `sudo systemctl restart nginx` | 重启 Nginx |
| `sudo systemctl status nginx` | 查看 Nginx 状态 |
| `sudo systemctl enable nginx` | 设置开机自启 |

### HTTPS 升级（可选）

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 自动配置 HTTPS
sudo certbot --nginx -d www.geokeji.com -d geokeji.com

# 自动续期（添加到 crontab）
sudo crontab -e
# 添加这一行：
0 0 * * * certbot renew --quiet
```

---

## 第六部分：常见问题排查

### 问题1：Git pull 失败（冲突）

**现象**：
```
error: Your local changes to the following files would be overwritten by merge:
    .env.local
```

**原因**：服务器上的文件被修改，与远程代码冲突。

**解决方法**：

**方法1：保留本地修改（推荐）**
```bash
git stash                    # 暂存本地修改
git pull origin main         # 拉取远程代码
git stash pop                # 恢复本地修改
```

**方法2：强制覆盖（谨慎使用）**
```bash
git fetch --all
git reset --hard origin/main
```

### 问题2：构建失败（依赖问题）

**现象**：
```
npm ERR! Could not resolve dependency:
```

**解决方法**：

```bash
# 清理缓存和依赖
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### 问题3：PM2 启动失败（端口占用）

**现象**：
```
Error: listen EADDRINUSE: address already in use :::5280
```

**原因**：端口 5280 被占用。

**解决方法**：

```bash
# 查看占用端口的进程
lsof -i:5280

# 或者
netstat -tlnp | grep 5280

# 杀死进程
kill -9 进程ID

# 重启 PM2
pm2 restart yishan-official
```

### 问题4：Nginx 502 错误

**现象**：访问网站显示 `502 Bad Gateway`

**原因**：Nginx 无法连接到后端 Next.js 服务。

**排查步骤**：

1️⃣ **检查 Next.js 是否运行**：
```bash
pm2 list
# 应该显示 status: online
```

2️⃣ **检查端口是否正确**：
```bash
curl http://localhost:5280
# 应该返回 HTML 内容
```

3️⃣ **检查 Nginx 配置**：
```bash
sudo nginx -t
```

4️⃣ **查看 Nginx 错误日志**：
```bash
sudo tail -f /var/log/nginx/error.log
```

### 问题5：网站打不开（防火墙/端口）

**检查防火墙**：

```bash
# Ubuntu UFW
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS Firewalld
sudo firewall-cmd --list-all
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --reload
```

**检查云服务器安全组**：
- 阿里云/腾讯云控制台 → 安全组规则
- 确保开放 80 和 443 端口

### 问题6：构建很慢或内存不足

**现象**：
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**解决方法**：

**临时增加 Node.js 内存**：
```bash
export NODE_OPTIONS="--max-old-space-size=2048"
npm run build
```

**永久方案（修改 PM2 配置）**：

编辑 `ecosystem.config.js`：
```js
module.exports = {
  apps: [{
    name: 'yishan-official',
    script: 'npm',
    args: 'start',
    node_args: '--max-old-space-size=2048'  // 添加这一行
  }]
}
```

---

## 📊 部署检查清单

完成部署后，逐项确认：

- [ ] ✅ Git SSH 配置成功（`ssh -T git@github.com`）
- [ ] ✅ 项目克隆成功（`ls -la /www/server/geokeji`）
- [ ] ✅ 环境变量配置完成（`.env.local` 文件存在）
- [ ] ✅ PM2 服务运行中（`pm2 list` 显示 online）
- [ ] ✅ Nginx 配置正确（`sudo nginx -t` 通过）
- [ ] ✅ 网站可访问（浏览器打开域名）
- [ ] ✅ 联系表单能发送（测试一次）
- [ ] ✅ 博客文章能正常显示
- [ ] ✅ 案例页面能正常访问
- [ ] ✅ PM2 开机自启动已设置（`pm2 startup`）

---

## 🚀 紧急回滚

如果更新后出现问题，快速回滚到上一个版本：

```bash
cd /www/server/geokeji
bash scripts/rollback.sh
```

或者手动回滚：

```bash
git log --oneline -5  # 查看最近 5 次提交
git reset --hard 提交ID  # 回滚到指定版本
npm run build
pm2 restart yishan-official
```

---

## 📞 获取帮助

如果遇到问题，可以：

1. **查看日志**：`pm2 logs yishan-official`
2. **查看 Nginx 日志**：`sudo tail -f /var/log/nginx/error.log`
3. **检查服务状态**：`pm2 monit`
4. **重启所有服务**：`pm2 restart all && sudo nginx -s reload`

---

**祝部署顺利！🎉**

如有问题，欢迎参考 [QUICK_START.md](./QUICK_START.md) 快速开始指南。

