# 开发期校验脚本

这些脚本只用于开发时核对页面，**不会发布到 GitHub Pages**（部署 workflow 只复制 `index.html`、`assets/`、`resume.pdf` 等站点文件）。不需要可直接删除整个 `_tools/` 目录。

## 目录说明

| 文件 | 作用 |
| --- | --- |
| `full.py` | 从 `../resume.pdf` 提取正文（FlateDecode + ToUnicode CMap + 字宽定位），输出 `items.txt` |
| `resume_text.txt` | 提取出的简历纯文本，可从 `items.txt` 重建：`python3 full.py` 后运行下面的片段 |
| `photo.jpg` | 从 PDF 中提取的原始证件照，已复制为 `assets/img/avatar.jpg` |
| `extract.py` / `dump.py` / `pdftext.py` | PDF 结构探查的中间脚本（调试用） |
| `verify/check.js` | 用 jsdom 真实执行页面，断言 47 项（内容、结构、锚点、主题、菜单、资源） |
| `verify/shots.js` | 用 headless Chromium 截图（桌面/移动 × 深色/浅色）并检查横向溢出 |

## 重建文本

`items.txt` 每行为 `y \t x \t 字号 \t 字体 \t 字符`，按 y 分行、按 x 排序即可还原：

```python
import collections
L = collections.defaultdict(list)
for ln in open('items.txt'):
    y, x, fs, f, s = ln.rstrip('\n').split('\t')
    L[float(y)].append((float(x), float(fs), f, s))
for y in sorted(L, reverse=True):
    g = sorted(L[y]); out = []; prev = None
    for x, fs, f, s in g:
        if prev is not None and x - prev > 0.18 * fs: out.append(' ')
        out.append(s); prev = x + fs
    print(f"[{y:7.1f}] {''.join(out)}")
```

## 运行校验

```bash
cd _tools/verify
npm install                 # 需要 jsdom 与 playwright-core
python3 -m http.server 8765 --bind 127.0.0.1 --directory ../.. &   # 起静态服务
node check.js               # DOM / 内容 / 交互校验

npx playwright install chromium --only-shell
node shots.js               # 截图到 shots/
```

> 若系统缺少 Chromium 运行库，可把 `libnspr4`、`libnss3`、`libatk*`、`libxcomposite1`、`libxdamage1`、`libxrandr2`、`libxrender1` 等 deb 解包到某个目录，再用
> `LD_LIBRARY_PATH=<root>/usr/lib/x86_64-linux-gnu` 启动；中文渲染还需一份 CJK 字体（如 `fonts-noto-cjk`）配合自定义 `FONTCONFIG_FILE`。
