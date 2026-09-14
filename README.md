# 史浩然 · 个人主页

2026 届校招 C++ 开发工程师的个人信息介绍主页。纯静态站点（HTML + CSS + 原生 JavaScript，零依赖、零构建），可直接托管在 **GitHub Pages** 上。

> 内容来源：`resume.pdf`（个人简历），已完整提取并结构化。

---

## 目录结构

```
.
├── index.html                 # 页面结构（语义化标签 + SEO/分享 meta）
├── resume.pdf                 # 简历原文件，供页面「下载简历」按钮使用
├── .nojekyll                  # 告诉 GitHub Pages 跳过 Jekyll 处理
├── assets/
│   ├── css/style.css          # 全部样式：设计令牌 / 深浅主题 / 响应式 / 打印
│   ├── js/
│   │   ├── resume-data.js     # ★ 简历数据源：改文案只需改这个文件
│   │   └── main.js            # 渲染与交互（主题、滚动、导航、动画）
│   └── img/avatar.jpg         # 从 PDF 中提取的证件照（360×420）
└── _tools/                    # 开发校验脚本（PDF 提取、DOM 校验、截图），非站点内容
```

## 页面区块

| 区块 | 内容 |
| --- | --- |
| 首屏 | 姓名、求职岗位、个人简介、基本信息标签、行动按钮、证件照 |
| 01 关于我 | 个人简介 + 基本信息 + 求职状态 |
| 02 教育背景 | 桂林电子科技大学（硕士）、杭州电子科技大学（本科）、GPA、主修课程 |
| 03 技能证书 | 编程能力、算法与模型、语言能力 + 荣誉奖项 |
| 04 项目经验 | 高性能内存查询引擎、基于 MindSpore 的前沿模型复现（含核心优化要点） |
| 05 联系方式 | 邮箱 / 电话 / 所在地 + 邮件与简历下载 |

## 功能特性

- **深浅色主题**：右上角一键切换，记忆到 `localStorage`，首次访问跟随系统设置；内联脚本在首屏前套用主题，无闪白。
- **完全响应式**：桌面三栏 / 平板两栏 / 手机单栏，移动端为抽屉式导航，无横向溢出。
- **滚动体验**：顶部阅读进度条、当前章节导航高亮（ScrollSpy）、元素滚动入场动画。
- **无障碍**：语义化标签、ARIA 属性、键盘可操作、跳转链接、`prefers-reduced-motion` 适配。
- **打印友好**：`@media print` 自动隐藏导航与按钮，可直接打印成 PDF。

---

## 本地预览

直接双击 `index.html` 即可打开。若想更接近线上环境，起一个静态服务器：

```bash
# 任选其一
python3 -m http.server 8000
npx serve .
```

然后访问 <http://localhost:8000>。

## 部署到 GitHub Pages

### 方式一：仓库根目录（最简单）

1. 在 GitHub 新建仓库，例如 `resume`（若想用 `用户名.github.io` 作为站点地址，仓库名必须为 `用户名.github.io`）。
2. 推送到 `main` 分支：

   ```bash
   git init
   git add .
   git commit -m "feat: 个人主页"
   git branch -M main
   git remote add origin git@github.com:<你的用户名>/<仓库名>.git
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages**，`Source` 选择 `Deploy from a branch`，分支选 `main`、目录选 `/ (root)`，保存。
4. 等待约 1 分钟后访问 `https://<你的用户名>.github.io/<仓库名>/`。

> 本仓库当前采用**方式一**（分支根目录），因此没有启用 Actions 自动部署。
> 根目录的 `.nojekyll` 用于让 GitHub Pages 跳过 Jekyll 处理。

### 方式二：GitHub Actions 自动部署（可选）

现成的 workflow 保存在 **`_tools/optional-workflows/pages.yml`**（未启用）。若想改用自动部署：

```bash
mkdir -p .github/workflows
cp _tools/optional-workflows/pages.yml .github/workflows/pages.yml
git add .github && git commit -m "ci: 启用 GitHub Actions 自动部署" && git push
```

然后在 **Settings → Pages → Source** 选择 `GitHub Actions`，之后每次 push 到 `main` 都会自动重新发布。

---

## 如何修改内容

### 改文字 / 加项目

所有内容集中在 **`assets/js/resume-data.js`**，编辑后刷新页面即可：

- `profile`：姓名、岗位、简介、年龄、电话、邮箱
- `education`：教育经历（按时间倒序）
- `skills`：技能分组（`icon` 可选 `code` / `brain` / `globe`）
- `awards`：荣誉奖项
- `projects`：项目（`highlights` 为要点列表）
- `nav`：顶部导航

### 换成自己的照片

替换 `assets/img/avatar.jpg` 即可，建议竖版（比例 6:7，如 360×420）。

### 填上 GitHub / 博客链接

`resume-data.js` 里把 `github`、`blog` 填上地址，页面会自动出现对应按钮；留空则不显示。

```js
github: 'https://github.com/你的用户名',
```

### 换主题色

`assets/css/style.css` 顶部 `:root` 中的 `--brand-500`（主色）等变量，改一处全站生效。

### 部署后建议（社交分享预览）

`index.html` 里的 `og:image` / `og:url` 用的是相对路径，微信、Twitter 等抓取分享卡片时建议改成**绝对地址**，例如：

```html
<meta property="og:url" content="https://<你的用户名>.github.io/<仓库名>/" />
<meta property="og:image" content="https://<你的用户名>.github.io/<仓库名>/assets/img/avatar.jpg" />
```

---

## 浏览器支持

Chrome / Edge / Firefox / Safari 近两年版本（用到 `IntersectionObserver`、CSS 自定义属性、`color-mix()`）。不支持时页面内容仍可正常阅读，仅动画与部分配色降级。

## 说明

- 页面不加载任何第三方资源（字体、图标均为系统字体与内联 SVG），首屏无外部请求，隐私友好。
- `_tools/` 仅为开发期校验脚本，不影响线上页面；如不需要可直接删除。
