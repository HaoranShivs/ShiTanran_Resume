/**
 * 真实浏览器截图：桌面/移动 × 浅色/深色，并做几项运行时检查。
 */
const path = require('path');
const { chromium } = require('playwright-core');

const OUT = path.resolve(__dirname, 'shots');
require('fs').mkdirSync(OUT, { recursive: true });
const BASE = 'http://127.0.0.1:8765/index.html';

(async () => {
  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
  });

  const problems = [];
  const shots = [
    { name: 'desktop-light', w: 1440, h: 1000, theme: 'light' },
    { name: 'desktop-dark',  w: 1440, h: 1000, theme: 'dark'  },
    { name: 'mobile-light',  w: 390,  h: 844,  theme: 'light' }
  ];

  for (const s of shots) {
    const ctx = await browser.newContext({
      viewport: { width: s.w, height: s.h },
      deviceScaleFactor: s.name.startsWith('mobile') ? 2 : 1.4,
      colorScheme: s.theme
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => problems.push('[' + s.name + '] pageerror: ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error') problems.push('[' + s.name + '] console: ' + m.text()); });
    page.on('requestfailed', (r) => problems.push('[' + s.name + '] 请求失败: ' + r.url()));

    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), s.theme);
    // 触发所有滚动动画
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);

    // 首屏
    await page.screenshot({ path: path.join(OUT, s.name + '-hero.png') });
    // 整页
    await page.screenshot({ path: path.join(OUT, s.name + '-full.png'), fullPage: true });

    // 逐区块截图（便于逐段核对视觉效果）
    if (s.name === 'desktop-light') {
      for (const id of ['about', 'education', 'skills', 'projects', 'contact']) {
        const el = await page.$('#' + id);
        if (el) await el.screenshot({ path: path.join(OUT, 'sec-' + id + '.png') });
      }
      // 折叠/展开单个项目卡片
      const card = await page.$('#projectsList .project-card');
      if (card) await card.screenshot({ path: path.join(OUT, 'sec-project-card.png') });
    }

    // ---- 移动端抽屉可见性（回归检查） ----
    const navState = await page.evaluate(() => {
      const panel = document.getElementById('mobileNav');
      const btn = document.getElementById('menuBtn');
      const cs = getComputedStyle(panel);
      return {
        display: cs.display,
        visible: cs.display !== 'none',
        expanded: btn.getAttribute('aria-expanded')
      };
    });
    const isNarrow = s.w <= 960;
    if (isNarrow) {
      if (navState.visible) problems.push('[' + s.name + '] 移动端菜单初始应为收起，实际可见');
      await page.click('#menuBtn');
      await page.waitForTimeout(320);
      const opened = await page.evaluate(() => {
        const panel = document.getElementById('mobileNav');
        const btn = document.getElementById('menuBtn');
        return {
          display: getComputedStyle(panel).display,
          expanded: btn.getAttribute('aria-expanded')
        };
      });
      if (opened.display === 'none' || opened.expanded !== 'true') {
        problems.push('[' + s.name + '] 点击菜单按钮后未展开: ' + JSON.stringify(opened));
      } else {
        await page.screenshot({ path: path.join(OUT, s.name + '-menu-open.png') });
      }
    } else if (navState.visible) {
      problems.push('[' + s.name + '] 桌面端不应显示移动端抽屉菜单');
    }
    console.log('   移动端抽屉: ' + JSON.stringify(navState) + (isNarrow ? ' → 点击后展开正常' : ' （桌面隐藏 ✅）'));

    // ---- 运行时测量 ----
    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const overflowing = [];
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > de.clientWidth + 2 || r.left < -2)) {
          overflowing.push(el.tagName + '.' + (el.className || '').toString().split(' ')[0] +
            ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']');
        }
      });
      const img = document.querySelector('[data-bind-src="avatar"]');
      return {
        docW: de.clientWidth,
        scrollW: de.scrollWidth,
        hOverflow: de.scrollWidth > de.clientWidth + 1,
        overflowing: overflowing.slice(0, 8),
        avatarLoaded: img ? img.complete && img.naturalWidth > 0 : false,
        avatarNatural: img ? img.naturalWidth + 'x' + img.naturalHeight : 'n/a',
        height: document.body.scrollHeight,
        revealsHidden: Array.from(document.querySelectorAll('.reveal'))
          .filter((e) => !e.classList.contains('is-visible')).length
      };
    });

    console.log('── ' + s.name + ' (' + s.w + 'px, ' + s.theme + ')');
    console.log('   页面高 %dpx · 文档宽 %d / 滚动宽 %d · 横向溢出: %s',
      metrics.height, metrics.docW, metrics.scrollW, metrics.hOverflow ? '有 ❌' : '无 ✅');
    console.log('   头像加载: %s (%s) · 未显示动画元素: %d',
      metrics.avatarLoaded ? '✅' : '❌', metrics.avatarNatural, metrics.revealsHidden);
    if (metrics.overflowing.length) console.log('   溢出元素: ' + metrics.overflowing.join(' | '));
    if (metrics.hOverflow || !metrics.avatarLoaded || metrics.revealsHidden) {
      problems.push('[' + s.name + '] 布局问题: ' + JSON.stringify(metrics));
    }

    await ctx.close();
  }

  await browser.close();

  console.log('\n========================================');
  if (problems.length) {
    console.log('  ❌ 发现问题 ' + problems.length);
    problems.forEach((p) => console.log('   - ' + p));
    process.exit(1);
  }
  console.log('  ✅ 桌面 + 移动 + 浅色 + 深色 均正常渲染，无报错、无横向溢出');
  console.log('========================================');
})();
