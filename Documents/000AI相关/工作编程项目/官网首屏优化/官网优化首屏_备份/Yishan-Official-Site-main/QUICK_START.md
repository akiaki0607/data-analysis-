# 一页纸快速部署指南

> 适合有经验的开发者，零废话快速上手 Next.js + PM2 + Nginx 部署

---

## 📋 前置条件

- ✅ Ubuntu 服务器（已安装 Node.js 20+、npm、Nginx）
- ✅ GitHub 账号和项目仓库
- ✅ 域名（可选，也可用 IP 访问）

---

## 🚀 首次部署（5 条命令）

### 1. 配置 Git SSH

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"  # 一路回车
cat ~/.ssh/id_rsa.pub  # 复制公钥到 GitHub Settings → SSH Keys
ssh -T git@github.com  # 验证连接（输入 yes）
```

### 2. 克隆项目

```bash
cd /www/server
git clone git@github.com:你的用户名/Yishan-Official-Site.git geokeji
cd geokeji
```

### 3. 配置环境变量

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_SITE_URL=https://www.geokeji.com
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@geokeji.com
CONTACT_EMAIL=contact@geokeji.com
EOF
```

### 4. 一键部署

```bash
bash scripts/setup-git-deploy.sh
```

### 5. 配置 Nginx

```bash
sudo cp nginx/geokeji.conf /etc/nginx/sites-available/geokeji
sudo nano /etc/nginx/sites-available/geokeji  # 修改 server_name 为你的域名
sudo ln -s /etc/nginx/sites-available/geokeji /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload
```

**验证部署**：访问 `http://你的域名` 或 `http://IP:5280`

---

## 🔄 日常更新（2 条命令）

### Windows 本地

```bash
git add .
echo "fix: 修复某个问题" > commit-message.txt
git commit -F commit-message.txt && rm commit-message.txt
git push origin main
```

### 服务器端

```bash
cd /www/server/geokeji
bash scripts/deploy-update.sh
```

---

## ⚡ 紧急回滚（1 条命令）

```bash
cd /www/server/geokeji
bash scripts/rollback.sh
```

或手动回滚：

```bash
git reset --hard HEAD~1  # 回滚到上一个版本
npm run build && pm2 restart yishan-official
```

---

## 📊 常用命令

### PM2 管理

```bash
pm2 list                       # 查看所有服务
pm2 logs yishan-official       # 实时日志
pm2 restart yishan-official    # 重启服务
pm2 monit                      # 实时监控
pm2 startup && pm2 save        # 开机自启
```

### Nginx 管理

```bash
sudo nginx -t                    # 测试配置
sudo nginx -s reload             # 重载配置
sudo systemctl restart nginx     # 重启 Nginx
```

### Git 管理

```bash
git status              # 查看状态
git pull origin main    # 拉取代码
git log --oneline -10   # 查看历史
```

---

## 🐛 故障排查

| 问题 | 命令 |
|------|------|
| **PM2 启动失败** | `pm2 logs yishan-official --lines 100` |
| **Nginx 502** | `sudo tail -f /var/log/nginx/error.log` |
| **端口占用** | `lsof -i:5280` → `kill -9 进程ID` |
| **构建失败** | `rm -rf node_modules && npm install` |
| **Git 冲突** | `git stash && git pull && git stash pop` |

---

## 📂 关键文件

```
/www/server/geokeji/
├── .env.local              # 环境变量（手动创建）
├── ecosystem.config.js     # PM2 配置
├── scripts/
│   ├── setup-git-deploy.sh    # 首次部署
│   ├── deploy-update.sh       # 日常更新
│   └── rollback.sh            # 紧急回滚
└── nginx/
    └── geokeji.conf        # Nginx 配置
```

---

## ✅ 部署检查清单

- [ ] Git SSH 连接成功（`ssh -T git@github.com`）
- [ ] PM2 服务运行（`pm2 list` 显示 online）
- [ ] Nginx 配置正确（`sudo nginx -t` 通过）
- [ ] 网站可访问（浏览器打开域名）
- [ ] PM2 开机自启（`pm2 startup && pm2 save`）

---

## 🆘 紧急联系

- **详细教程**：查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **查看日志**：`pm2 logs yishan-official`
- **重启所有**：`pm2 restart all && sudo nginx -s reload`

---

**祝部署成功！🎉**

