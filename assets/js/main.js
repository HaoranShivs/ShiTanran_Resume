/* ==========================================================================
   史浩然 · 个人主页交互脚本
   依赖：assets/js/resume-data.js（window.RESUME）
   ========================================================================== */
(function () {
  'use strict';

  const DATA = window.RESUME || {};

  /* ------------------------------- 图标库 ------------------------------- */
  const ICONS = {
    code:   '<path d="M8.5 8.5 5 12l3.5 3.5M15.5 8.5 19 12l-3.5 3.5"/>',
    brain:  '<path d="M9.5 4.5A3 3 0 0 0 6.5 7.5a2.8 2.8 0 0 0-1.6 5A2.8 2.8 0 0 0 6.6 17.4 3 3 0 0 0 12 18.6V5.9a3 3 0 0 0-2.5-1.4Z"/><path d="M14.5 4.5a3 3 0 0 1 3 3 2.8 2.8 0 0 1 1.6 5 2.8 2.8 0 0 1-1.7 4.9A3 3 0 0 1 12 18.6"/>',
    globe:  '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.3-5.1-3.3-8.5S9.8 5.8 12 3.5Z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 5.5H5.5V7A3 3 0 0 0 8 9.9M16 5.5h2.5V7a3 3 0 0 1-2.5 2.9"/><path d="M12 13v3.5M8.5 20h7l-.8-3.5h-5.4L8.5 20Z"/>',
    spark:  '<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5 10.1 12.8 4.5 10.9 10.1 9 12 3.5Z"/>',
    user:   '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5a7 7 0 0 1 14 0"/>',
    pin:    '<path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"/><circle cx="12" cy="11" r="2.3"/>',
    cake:   '<path d="M5 20h14v-6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v6Z"/><path d="M5 15.5c1.6 1.2 3.1 1.2 4.7 0 1.5 1.2 3 1.2 4.6 0 1.5 1.2 3 1.2 4.7 0"/><path d="M12 8V5.2M12 2.8v.6"/>',
    mail:   '<rect x="3.2" y="5.5" width="17.6" height="13" rx="2.4"/><path d="m3.8 7 7.2 5.4a2 2 0 0 0 2 0L20.2 7"/>',
    phone:  '<path d="M8.4 3.8 6.2 4.6A2 2 0 0 0 5 6.9c.5 3.6 1.9 6.6 4.2 8.9 2.3 2.3 5.3 3.7 8.9 4.2a2 2 0 0 0 2.3-1.2l.8-2.2-4.3-1.8-1.5 1.6a11.6 11.6 0 0 1-3.6-3.6l1.6-1.5L8.4 3.8Z"/>',
    github: '<path d="M9.3 20.2v-2.6c-3 .5-3.7-1.4-3.7-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-2.9-.1-.3-.5-1.4.1-2.8 0 0 .9-.3 3 1.1a10 10 0 0 1 5.4 0c2.1-1.4 3-1.1 3-1.1.6 1.4.2 2.5.1 2.8.7.7 1.1 1.7 1.1 2.9 0 4.2-2.5 5.1-4.9 5.4.4.3.7 1 .7 2v3.8"/>',
    link:   '<path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1"/><path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1"/>',
    doc:    '<path d="M14 3.5H7.5A2 2 0 0 0 5.5 5.5v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8l-4.5-4.5Z"/><path d="M14 3.5V8h4.5M8.5 13h7M8.5 16.5h4.5"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
    layers: '<path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5Z"/><path d="m4 12.5 8 4.3 8-4.3M4 16.5l8 4.3 8-4.3"/>',
    cap:    '<path d="m2.8 8.5 9.2-4.6 9.2 4.6-9.2 4.6L2.8 8.5Z"/><path d="M6.5 10.4v4.4c0 1.5 2.5 2.7 5.5 2.7s5.5-1.2 5.5-2.7v-4.4M20.5 9v5.5"/>',
    send:   '<path d="M20.5 3.5 10.8 13.2M20.5 3.5 14.4 20.5l-3.6-7.3-7.3-3.6L20.5 3.5Z"/>',
    copy:   '<rect x="9" y="9" width="11.5" height="11.5" rx="2.4"/><path d="M15 6.2V5.5a2 2 0 0 0-2-2H5.5a2 2 0 0 0-2 2V13a2 2 0 0 0 2 2h.7"/>'
  };

  const svg = (name, cls) =>
    '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' +
    (ICONS[name] || ICONS.spark) + '</svg>';

  const esc = (s) =>
    String(s == null ? '' : s).replace(/[&<>"']/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
    );

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  /* --------------------------- 静态占位符绑定 --------------------------- */
  function bindStatic() {
    const p = DATA.profile || {};
    $$('[data-bind]').forEach((el) => {
      const v = p[el.getAttribute('data-bind')];
      if (v) el.textContent = v;
    });
    $$('[data-bind-src]').forEach((el) => {
      const v = p[el.getAttribute('data-bind-src')];
      if (v) el.setAttribute('src', v);
    });
  }

  /* ------------------------------- 首屏信息 ------------------------------ */
  function renderHeroFacts() {
    const p = DATA.profile || {};
    const facts = [
      p.location && { icon: 'pin', text: p.location },
      p.age && { icon: 'cake', text: p.age },
      p.gender && { icon: 'user', text: p.gender },
      { icon: 'cap', text: '硕士在读 · 2026 届' }
    ].filter(Boolean);

    $('#heroFacts').innerHTML = facts
      .map((f) => '<li>' + svg(f.icon) + '<span>' + esc(f.text) + '</span></li>')
      .join('');
  }

  function renderHeroActions() {
    const p = DATA.profile || {};
    const btns = [];

    btns.push(
      '<a class="btn btn-primary" href="#projects">' + svg('layers') + '查看项目经验</a>'
    );
    btns.push(
      '<a class="btn btn-ghost" href="mailto:' + esc(p.email) + '">' + svg('mail') + '邮件联系</a>'
    );
    if (p.resumeFile) {
      btns.push(
        '<a class="btn btn-ghost" href="' + esc(p.resumeFile) + '" download>' +
        svg('doc') + '下载简历 PDF</a>'
      );
    }
    if (p.github) {
      btns.push(
        '<a class="btn btn-ghost" href="' + esc(p.github) + '" target="_blank" rel="noopener noreferrer">' +
        svg('github') + 'GitHub</a>'
      );
    }
    $('#heroActions').innerHTML = btns.join('');
  }

  /* -------------------------------- 关于我 ------------------------------- */
  function renderAbout() {
    const p = DATA.profile || {};
    const facts = [
      { k: '求职岗位', v: p.title },
      { k: '求职状态', v: '2026 届校园招聘' },
      { k: '所在地区', v: p.location },
      { k: '邮箱', v: p.email }
    ].filter((f) => f.v);

    $('#aboutCard').innerHTML =
      '<h3 class="card-title">个人简介</h3>' +
      '<p>' + esc(p.summary) + '</p>' +
      '<div class="fact-grid">' +
      facts.map((f) =>
        '<div class="fact-item"><small>' + esc(f.k) + '</small><strong>' + esc(f.v) + '</strong></div>'
      ).join('') +
      '</div>';

    $('#profileCard').innerHTML =
      '<h3 class="card-title">基本信息</h3>' +
      '<ul class="info-list">' +
      [
        { icon: 'user', k: '姓名', v: p.name },
        { icon: 'cake', k: '年龄', v: p.age },
        { icon: 'user', k: '性别', v: p.gender },
        { icon: 'pin', k: '所在地', v: p.location },
        { icon: 'phone', k: '电话', v: p.phone },
        { icon: 'mail', k: '邮箱', v: p.email }
      ].filter((i) => i.v).map((i) =>
        '<li><span class="info-icon">' + svg(i.icon) + '</span>' +
        '<span><small>' + esc(i.k) + '</small><strong>' + esc(i.v) + '</strong></span></li>'
      ).join('') +
      '</ul>';
  }

  /* ------------------------------- 教育背景 ------------------------------ */
  function renderEducation() {
    const list = DATA.education || [];
    $('#educationTimeline').innerHTML = list
      .map((e) =>
        '<li class="timeline-item reveal">' +
          '<div class="timeline-card">' +
            '<div class="timeline-top">' +
              '<div><div class="timeline-school">' + esc(e.school) + '</div>' +
              '<div class="timeline-degree">' + esc(e.degree) + '</div></div>' +
              '<span class="period">' + esc(e.period) + '</span>' +
            '</div>' +
            (e.details && e.details.length
              ? '<ul class="timeline-details">' +
                e.details.map((d) =>
                  '<li><span class="label">' + esc(d.label) + '</span><span>' + esc(d.value) + '</span></li>'
                ).join('') +
                '</ul>'
              : '') +
          '</div>' +
        '</li>'
      )
      .join('');
  }

  /* ------------------------------- 技能证书 ------------------------------ */
  function renderSkills() {
    const list = DATA.skills || [];
    $('#skillsGrid').innerHTML = list
      .map((s) =>
        '<article class="card skill-card reveal">' +
          '<div class="skill-head">' +
            '<span class="skill-icon">' + svg(s.icon) + '</span>' +
            '<h3>' + esc(s.title) + '</h3>' +
          '</div>' +
          '<ul class="skill-list">' +
            s.items.map((i) => '<li>' + esc(i) + '</li>').join('') +
          '</ul>' +
        '</article>'
      )
      .join('');

    // 荣誉奖项与技能同区块展示
    const awards = DATA.awards || [];
    $('#awardList').innerHTML = awards
      .map((a) =>
        '<li><span class="award-icon">' + svg('trophy') + '</span><span>' +
        '<strong>' + esc(a.title) + '</strong>' +
        (a.note ? '<small>' + esc(a.note) + '</small>' : '') +
        '</span></li>'
      )
      .join('');
  }

  /* ------------------------------- 项目经验 ------------------------------ */
  function renderProjects() {
    const list = DATA.projects || [];
    $('#projectsList').innerHTML = list
      .map((p) =>
        '<article class="project-card reveal">' +
          '<div class="project-head">' +
            '<div>' +
              '<h3 class="project-name">' + esc(p.name) + '</h3>' +
              '<p class="project-role">' + svg('user') + esc(p.role) + '</p>' +
            '</div>' +
            '<div class="project-head-right">' +
              '<span class="period">' + esc(p.period) + '</span>' +
            '</div>' +
          '</div>' +

          '<p class="project-desc">' + esc(p.description) + '</p>' +

          (p.stack && p.stack.length
            ? '<div class="stack-row"><span class="stack-label">技术栈</span>' +
              '<div class="tags">' +
              p.stack.map((t) => '<span class="tag">' + esc(t) + '</span>').join('') +
              '</div></div>'
            : '') +

          (p.highlights && p.highlights.length
            ? '<h4 class="highlights-title">' + svg('target') + esc(p.highlightsTitle || '核心工作') + '</h4>' +
              '<ul class="highlight-list">' +
              p.highlights.map((h) =>
                '<li><b>' + esc(h.label) + '：</b>' + esc(h.text) + '</li>'
              ).join('') +
              '</ul>'
            : '') +
        '</article>'
      )
      .join('');
  }

  /* ------------------------------- 联系方式 ------------------------------ */
  function renderContact() {
    const p = DATA.profile || {};
    const items = [
      p.email  && { icon: 'mail',  k: '邮箱', v: p.email,  href: 'mailto:' + p.email },
      p.phone  && { icon: 'phone', k: '电话', v: p.phone,  href: 'tel:' + p.phone },
      p.location && { icon: 'pin', k: '所在地', v: p.location },
      p.github && { icon: 'github', k: 'GitHub', v: p.github.replace(/^https?:\/\//, ''), href: p.github }
    ].filter(Boolean);

    const actions = [
      '<a class="btn btn-primary" href="mailto:' + esc(p.email) + '">' + svg('send') + '发送邮件</a>',
      p.resumeFile
        ? '<a class="btn btn-ghost" href="' + esc(p.resumeFile) + '" download>' + svg('doc') + '下载简历</a>'
        : ''
    ].join('');

    $('#contactCard').innerHTML =
      '<p class="contact-lead">目前正在寻找 2026 届 C++ 开发相关的校招机会，欢迎通过邮件或电话与我联系。</p>' +
      '<div class="contact-actions">' + actions + '</div>' +
      '<div class="contact-grid">' +
      items.map((i) => {
        const inner =
          '<span class="ci-icon">' + svg(i.icon) + '</span><span><small>' + esc(i.k) + '</small>' +
          '<strong>' + esc(i.v) + '</strong></span>';
        return i.href
          ? '<a class="contact-item" href="' + esc(i.href) + '">' + inner + '</a>'
          : '<div class="contact-item">' + inner + '</div>';
      }).join('') +
      '</div>';
  }

  /* ------------------------------- 导航渲染 ------------------------------ */
  function renderNav() {
    const nav = DATA.nav || [];
    const html = nav
      .map((n) => '<a href="#' + esc(n.id) + '" data-target="' + esc(n.id) + '">' + esc(n.label) + '</a>')
      .join('');
    $('#mainNav').innerHTML = html;
    $('#mobileNav').innerHTML = html;
  }

  /* --------------------------------- 主题 -------------------------------- */
  function initTheme() {
    const btn = $('#themeToggle');
    if (!btn) return;

    const sync = () => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
    };
    sync();

    btn.addEventListener('click', function () {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
      sync();
    });

    // 跟随系统（用户未手动选择时）
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) { /* ignore */ }
      if (!saved) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        sync();
      }
    });
  }

  /* ------------------------------- 滚动效果 ------------------------------ */
  function initScroll() {
    const header = $('#siteHeader');
    const bar = $('#scrollProgress');
    const toTop = $('#toTop');

    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (header) header.classList.toggle('is-stuck', y > 8);
      if (bar) bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      if (toTop) toTop.classList.toggle('is-visible', y > 520);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    }
  }

  /* --------------------------- 当前区块高亮 ----------------------------- */
  function initScrollSpy() {
    const links = $$('#mainNav a, #mobileNav a');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = (DATA.nav || [])
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);

    const visible = new Set();
    const io = new IntersectionObserver(function (entries) {
      entries.forEach((en) => {
        if (en.isIntersecting) visible.add(en.target.id);
        else visible.delete(en.target.id);
      });
      const current = sections.filter((s) => visible.has(s.id))[0];
      links.forEach((a) => {
        a.classList.toggle('is-active', !!current && a.getAttribute('data-target') === current.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((s) => io.observe(s));
  }

  /* ------------------------------- 滚动入场 ------------------------------ */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(function (entries, obs) {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        setTimeout(() => el.classList.add('is-visible'), Math.min(i, 5) * 70);
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach((el) => io.observe(el));

    // 兜底：任何原因导致未触发，2.5s 后强制显示
    setTimeout(() => items.forEach((el) => el.classList.add('is-visible')), 2500);
  }

  /* ------------------------------ 移动端目录 ----------------------------- */
  function initMobileMenu() {
    const btn = $('#menuBtn');
    const panel = $('#mobileNav');
    if (!btn || !panel) return;

    const close = () => {
      panel.classList.remove('is-open');
      panel.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };

    const toggle = () => {
      const open = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', open);
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    };

    btn.addEventListener('click', toggle);

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 960) close();
    });

    // 初始状态：确保收起
    close();
  }

  /* --------------------------------- 启动 -------------------------------- */
  function init() {
    bindStatic();
    renderHeroFacts();
    renderHeroActions();
    renderAbout();
    renderEducation();
    renderSkills();
    renderProjects();
    renderContact();
    renderNav();

    initTheme();
    initScroll();
    initScrollSpy();
    initMobileMenu();

    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();

    // 内容就绪后再注册动画，确保动态插入的 .reveal 也能生效
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
