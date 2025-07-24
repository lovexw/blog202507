# 简洁博客系统

这是一个使用纯HTML、CSS和JavaScript构建的简洁博客系统，不依赖任何框架或CMS。博客内容使用Markdown格式编写，可以托管在GitHub上并通过Cloudflare部署，实现自动更新。

## 功能特点

- **简洁设计**：主页只显示文章标题、内容简介和日期
- **Markdown支持**：所有文章使用Markdown格式编写
- **自动提取摘要**：自动提取文章前200字作为文章简介
- **分类与标签**：支持文章分类和标签功能
- **分页功能**：每页显示15篇文章，自动分页
- **归档功能**：按年月展示文章标题，方便导航
- **关于我页面**：从Markdown文件生成个人信息展示
- **响应式设计**：适配各种屏幕尺寸的设备
- **无需数据库**：纯静态网站，无需后端服务器

## 项目结构
blog202507/
├── index.html          # 主页
├── archive.html        # 归档页面
├── about.html          # 关于我页面
├── post.html           # 文章页面
├── posts/              # 文章目录
│   ├── about.md        # 关于我的内容
│   ├── hello-world.md  # 示例文章1
│   ├── markdown-guide.md # 示例文章2
│   └── index.json      # 文章索引
├── css/                # 样式文件
│   ├── style.css       # 主样式
│   └── markdown.css    # Markdown样式
├── js/                 # JavaScript文件
│   ├── main.js         # 主要脚本
│   ├── parser.js       # Markdown解析器
│   └── pagination.js   # 分页功能
└── assets/             # 资源文件
└── avatar.jpg      # 头像图片

## 使用方法

### 添加新文章

1. 在`posts`目录下创建新的Markdown文件（例如`my-new-post.md`）
2. 在文件开头添加元数据：

```markdown
---
title: "文章标题"
date: 2023-07-28
tags: ["标签1", "标签2"]
categories: ["分类"]
---

# 文章内容

这里是文章正文...
```

3. 在`posts/index.json`中添加新文章的引用：

```json
[
  ...
  {
    "filename": "my-new-post.md"
  }
]
```

### 修改个人信息

编辑`posts/about.md`文件，更新您的个人信息、头像和社交媒体链接。

### 本地预览

您可以使用任何静态文件服务器在本地预览博客。例如，使用Python的内置HTTP服务器：

```bash
python -m http.server
```

然后在浏览器中访问`http://localhost:8000`。

### 部署到GitHub Pages

1. 创建GitHub仓库
2. 将代码推送到仓库：

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/您的用户名/blog202507.git
git push -u origin main
```

3. 在GitHub仓库设置中启用GitHub Pages，选择main分支作为源

### 配置Cloudflare

1. 在Cloudflare中添加您的域名
2. 设置DNS记录，将您的域名指向GitHub Pages
3. 启用Cloudflare的CDN和SSL功能

## 自定义

### 修改样式

编辑`css/style.css`文件，根据您的喜好调整博客的外观。

### 修改布局

编辑HTML文件（`index.html`、`archive.html`等）来调整页面布局。

### 添加新功能

您可以通过修改JavaScript文件来添加新功能，如搜索、评论系统等。

## 许可证

本项目采用MIT许可证。您可以自由使用、修改和分发本项目。

## 贡献

欢迎提交问题和改进建议！如果您想贡献代码，请提交拉取请求。