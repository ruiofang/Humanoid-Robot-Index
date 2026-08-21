# Humanoid Atlas

一个国内外人形机器人公司与产品官网导航。纯静态实现，无构建步骤，适合直接部署到 GitHub Pages。

## 本地预览

直接打开 `index.html`，或在项目目录运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 新建 GitHub 仓库，将本目录文件提交并推送到 `main` 分支。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. Branch 选择 `main` 和 `/ (root)`，保存后等待部署完成。

站点将发布在 `https://<你的用户名>.github.io/<仓库名>/`。

首次推送可在本目录执行（将最后一行替换为你的仓库地址）：

```bash
git init
git add .
git commit -m "Build Humanoid Atlas directory"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

## 更新目录

所有机器人资料位于 `data.js` 的 `window.ROBOT_DATA` 数组。复制已有对象即可新增条目；支持以下字段：公司中英文名、代表产品、地区、国家或城市、阶段、应用方向、官网网址、字母标识和简介。

> 产品阶段仅用于快速索引，实际状态请以企业官网为准。提交新站点前，请确认链接为企业官方来源且可正常访问。

## 文件结构

```text
├── index.html   # 页面结构与 SEO 信息
├── styles.css   # 视觉样式和响应式布局
├── data.js      # 机器人目录数据
├── app.js       # 搜索、筛选与视图交互
└── README.md    # 使用及部署说明
```

## License

目录内容仅作信息索引。企业名称及商标归各自权利人所有。
