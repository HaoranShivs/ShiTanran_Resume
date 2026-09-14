/**
 * 真实渲染校验：用 jsdom 加载 index.html、执行脚本，检查渲染结果。
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.resolve(__dirname, '..', '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => errors.push('jsdomError: ' + e.message));
vc.on('error', (...a) => errors.push('console.error: ' + a.join(' ')));

// jsdom 未实现 IntersectionObserver / matchMedia 的部分能力，补最小桩
const dom = new JSDOM(html, {
  url: 'http://127.0.0.1:8765/index.html',
  runScripts: 'dangerously',
  resources: 'usable',
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    window.matchMedia = window.matchMedia || function (q) {
      return {
        matches: false, media: q,
        addEventListener() {}, removeEventListener() {},
        addListener() {}, removeListener() {}
      };
    };
    window.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
      unobserve() {} disconnect() {}
    };
    // 记录 localStorage 写入
    window.__store = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (k) => (k in window.__store ? window.__store[k] : null),
        setItem: (k, v) => { window.__store[k] = String(v); },
        removeItem: (k) => { delete window.__store[k]; }
      },
      configurable: true
    });
  }
});

const { window } = dom;
const { document } = window;

function run() {
  const out = [];
  let pass = 0, fail = 0;
  const check = (name, cond, extra) => {
    if (cond) { pass++; out.push('  PASS  ' + name); }
    else { fail++; out.push('  FAIL  ' + name + (extra ? '  → ' + extra : '')); }
  };

  // ---- 1. 脚本无报错 ----
  check('脚本执行无 JS 错误', errors.length === 0, errors.join(' | '));

  // ---- 2. 关键内容渲染 ----
  const text = document.body.textContent;
  const mustHave = [
    '史浩然', 'C++', '桂林电子科技大学', '杭州电子科技大学',
    'MindSpore', 'RoIPool3d', 'AVX2', '蓝桥杯', '华为 ICT',
    '13429799216', '13429799216@163.com', '3.89'
  ];
  mustHave.forEach((k) => check('正文包含「' + k + '」', text.includes(k)));

  // ---- 3. 无未绑定占位 ----
  check('无 undefined / [object Object] 残留',
    !/undefined|\[object Object\]|NaN/.test(text));

  // ---- 4. 头像 ----
  const img = document.querySelector('[data-bind-src="avatar"]');
  check('头像 src 已绑定', img && /avatar\.jpg$/.test(img.getAttribute('src')),
    img && img.getAttribute('src'));
  check('头像文件存在', fs.existsSync(path.join(ROOT, 'assets/img/avatar.jpg')));

  // ---- 5. 结构与数量 ----
  const edu = document.querySelectorAll('#educationTimeline .timeline-item');
  check('教育经历 2 条', edu.length === 2, 'got ' + edu.length);
  const skills = document.querySelectorAll('#skillsGrid .skill-card');
  check('技能卡片 3 组', skills.length === 3, 'got ' + skills.length);
  check('基本信息卡已渲染', !!document.querySelector('#profileCard .info-list li'));
  const projects = document.querySelectorAll('#projectsList .project-card');
  check('项目 2 个', projects.length === 2, 'got ' + projects.length);
  const awards = document.querySelectorAll('#awardList li');
  check('奖项 2 条', awards.length === 2, 'got ' + awards.length);
  const facts = document.querySelectorAll('#heroFacts li');
  check('首屏信息标签 ≥3 个', facts.length >= 3, 'got ' + facts.length);
  const hi = document.querySelectorAll('.highlight-list li');
  check('项目要点 7 条', hi.length === 7, 'got ' + hi.length);

  // ---- 6. 导航链接有效（锚点存在） ----
  const navLinks = Array.from(document.querySelectorAll('#mainNav a'));
  check('主导航有 5 项', navLinks.length === 5, 'got ' + navLinks.length);
  navLinks.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    check('导航锚点 #' + id + ' 存在', !!document.getElementById(id));
  });

  // 移动端导航内容应一致
  const mobile = document.querySelectorAll('#mobileNav a');
  check('移动端导航 5 项', mobile.length === 5, 'got ' + mobile.length);

  // ---- 7. 按钮与链接 ----
  const mail = document.querySelector('#heroActions a[href^="mailto:"]');
  check('邮件按钮存在', !!mail, mail && mail.getAttribute('href'));
  const dw = document.querySelector('#heroActions a[download]');
  check('简历下载按钮存在', !!dw, dw && dw.getAttribute('href'));
  if (dw) check('简历 PDF 存在', fs.existsSync(path.join(ROOT, dw.getAttribute('href'))));
  check('无空 href 链接',
    Array.from(document.querySelectorAll('a[href]')).every((a) => a.getAttribute('href').length > 0));

  // ---- 8. 所有 .reveal 已可见（避免内容被动画隐藏） ----
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  check('存在滚动动画元素', reveals.length > 0, 'got ' + reveals.length);
  check('全部动画元素已 is-visible',
    reveals.every((el) => el.classList.contains('is-visible')),
    reveals.filter((e) => !e.classList.contains('is-visible')).length + ' 个未显示');

  // ---- 9. 主题切换 ----
  const before = document.documentElement.getAttribute('data-theme');
  document.getElementById('themeToggle').dispatchEvent(
    new window.MouseEvent('click', { bubbles: true })
  );
  const after = document.documentElement.getAttribute('data-theme');
  check('点击可切换主题', before !== after, before + ' → ' + after);
  check('主题写入 localStorage', window.__store.theme === after, JSON.stringify(window.__store));

  // ---- 10. 移动端菜单开合 ----
  const menuBtn = document.getElementById('menuBtn');
  const panel = document.getElementById('mobileNav');
  const wasHidden = panel.hidden;
  menuBtn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  check('菜单按钮可开合', panel.hidden !== wasHidden,
    'hidden ' + wasHidden + ' → ' + panel.hidden);
  check('aria-expanded 同步', menuBtn.getAttribute('aria-expanded') === String(!panel.hidden));

  // ---- 11. 年份 ----
  const year = document.getElementById('year');
  check('页脚年份已填充', year && /^\d{4}$/.test(year.textContent), year && year.textContent);

  // ---- 12. 资源引用可解析 ----
  ['assets/css/style.css', 'assets/js/resume-data.js', 'assets/js/main.js']
    .forEach((f) => check('资源存在 ' + f, fs.existsSync(path.join(ROOT, f))));

  // ---- 13. 无障碍 ----
  check('img 有 alt', !!img.getAttribute('alt'));
  check('html lang=zh-CN', document.documentElement.getAttribute('lang') === 'zh-CN');
  check('title 非空', !!document.title.trim());

  console.log(out.join('\n'));
  console.log('\n========================================');
  console.log('  通过 ' + pass + ' / ' + (pass + fail) + (fail ? '  ❌ 失败 ' + fail : '  ✅ 全部通过'));
  console.log('========================================');
  return fail;
}

// 等待外部脚本加载完成
window.addEventListener('load', () => {
  setTimeout(() => process.exit(run() ? 1 : 0), 120);
});
setTimeout(() => { if (!window.document.readyState) return; }, 0);
