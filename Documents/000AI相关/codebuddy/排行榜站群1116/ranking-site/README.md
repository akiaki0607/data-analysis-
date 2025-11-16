# 排行榜网站使用说明

## 项目简介

这是一个简单易用的排行榜网站，用于展示不同行业下的品牌排行榜。网站采用纯前端技术，无需后端服务器，非常适合小白用户使用。

## 技术栈

- **HTML5**: 页面结构
- **CSS3**: 样式设计（响应式布局）
- **JavaScript**: 交互逻辑
- **JSON**: 数据存储

## 文件结构

```
ranking-site/
├── index.html          # 首页
├── industry.html       # 行业详情页
├── ranking.html        # 榜单详情页
├── styles.css          # 样式文件
├── script.js          # 首页脚本
├── data.json          # 数据文件
└── README.md          # 说明文档
```

## 如何使用

### 方法一：直接打开（最简单）

1. 找到 `index.html` 文件
2. 双击打开（会在浏览器中显示）
3. 开始浏览网站

### 方法二：使用本地服务器（推荐）

如果双击打开后数据无法加载，可以使用本地服务器：

**使用Python（Mac/Linux自带）：**
```bash
# 在终端中进入项目文件夹
cd /Users/aki/Documents/000AI相关/codebuddy/排行榜站群1116/ranking-site

# 启动服务器
python3 -m http.server 8000

# 然后在浏览器中访问：http://localhost:8000
```

**使用VS Code（如果已安装）：**
1. 安装 "Live Server" 插件
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 如何修改数据

所有数据都存储在 `data.json` 文件中，你可以直接编辑这个文件来修改内容。

### 数据结构说明

```json
{
  "industries": [
    {
      "id": "行业ID（英文，用于URL）",
      "name": "行业名称",
      "icon": "图标（emoji）",
      "description": "行业描述",
      "updateTime": "更新时间",
      "rankings": [
        {
          "id": "榜单ID",
          "title": "榜单标题",
          "description": "榜单描述",
          "heat": "热度值",
          "category": "分类",
          "brands": [
            {
              "rank": 排名数字,
              "name": "品牌名称",
              "rating": "星级评分",
              "score": "综合评分",
              "description": "品牌描述",
              "website": "官网链接",
              "highlights": ["亮点1", "亮点2"]
            }
          ]
        }
      ]
    }
  ]
}
```

### 添加新行业

在 `data.json` 的 `industries` 数组中添加新对象：

```json
{
  "id": "new-industry",
  "name": "新行业名称",
  "icon": "🎯",
  "description": "这是一个新行业",
  "updateTime": "2025-01-20",
  "rankings": []
}
```

### 添加新榜单

在对应行业的 `rankings` 数组中添加：

```json
{
  "id": "new-ranking",
  "title": "新榜单标题",
  "description": "榜单描述",
  "heat": "10万+",
  "category": "分类名称",
  "brands": []
}
```

### 添加新品牌

在对应榜单的 `brands` 数组中添加：

```json
{
  "rank": 1,
  "name": "品牌名称",
  "rating": "★★★★★",
  "score": "9.9分",
  "description": "品牌介绍...",
  "website": "https://www.example.com",
  "highlights": [
    "特点1",
    "特点2",
    "特点3"
  ]
}
```

## 网站特点

### SEO优化
- 语义化HTML标签
- 完整的meta标签
- 清晰的页面结构
- 友好的URL设计

### GEO优化
- 结构化数据展示
- 权威性内容
- 清晰的品牌信息
- 官网链接引导

### 响应式设计
- 自适应各种屏幕尺寸
- 移动端友好
- 流畅的交互体验

## 部署到线上

### 方法一：使用GitHub Pages（免费）

1. 在GitHub创建仓库
2. 上传所有文件
3. 在仓库设置中启用GitHub Pages
4. 访问提供的网址

### 方法二：使用Netlify（免费）

1. 访问 netlify.com
2. 拖拽整个文件夹到网站
3. 自动部署完成

### 方法三：使用传统主机

1. 购买虚拟主机
2. 通过FTP上传所有文件
3. 访问你的域名

## 常见问题

**Q: 为什么数据不显示？**
A: 可能是浏览器安全限制，请使用本地服务器打开。

**Q: 如何修改网站颜色？**
A: 在 `styles.css` 文件顶部的 `:root` 部分修改颜色变量。

**Q: 如何添加更多页面？**
A: 复制现有HTML文件，修改内容即可。

**Q: 数据文件损坏了怎么办？**
A: 使用JSON验证工具（如 jsonlint.com）检查格式是否正确。

## 后续扩展建议

1. **添加搜索功能**: 可以添加一个搜索框来搜索品牌
2. **添加筛选功能**: 按行业、评分等筛选
3. **添加评论功能**: 集成第三方评论系统
4. **数据可视化**: 添加图表展示数据
5. **多语言支持**: 添加英文版本

## 技术支持

如有问题，可以：
1. 查看浏览器控制台的错误信息
2. 检查JSON文件格式是否正确
3. 确保所有文件在同一文件夹内

## 版本信息

- 版本: 1.0.0
- 更新日期: 2025-01-16
- 适用人群: 无编程基础的用户

---

祝你使用愉快！🎉
