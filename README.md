# 李纪仪个人信息平台

这是一个适合部署到 GitHub Pages 的纯前端个人信息平台，用于展示个人简历、教育经历、实习经历、项目作品集和学习笔记。

## 目录结构

```text
.
├── index.html
├── experience.html
├── portfolio.html
├── notes.html
├── styles.css
├── scripts.js
├── data/
│   └── profile.json
├── assets/
│   ├── profile-white.jpg
│   ├── profile-blue.jpg
│   └── resume-li-jiyi.pdf
└── notes/
    └── machine-learning-index.md
```

## 内容维护

- 个人信息、经历、项目、技能、作品集和笔记入口集中维护在 `data/profile.json`。
- 证件照和 PDF 简历放在 `assets/`。
- 学习笔记可以继续放在 `notes/`，再把对应链接添加到 `data/profile.json` 的 `notes` 字段。
- `.md` 和 `.ipynb` 笔记会通过 `note-viewer.html?file=...` 在网页中渲染，避免直接打开 notebook JSON。
- 首页的“下载 PDF 简历”会根据 `data/profile.json` 生成打印版简历，浏览器弹出打印窗口后选择“另存为 PDF”即可。

## 本地预览

由于页面会读取 `data/profile.json`，建议使用本地服务器预览：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## GitHub Pages 部署

1. 新建 GitHub 仓库。
2. 上传本目录下的 `index.html`、`styles.css`、`scripts.js`、`data/`、`assets/`、`notes/`。
3. 在仓库 Settings -> Pages 中选择部署分支。
4. 发布后访问 GitHub Pages 地址。
