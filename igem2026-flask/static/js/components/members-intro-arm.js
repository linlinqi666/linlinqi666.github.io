/* members-intro-arm.js — 成员页全屏引导封面 arm（flask 侧，与根站
 * src/_includes/head-extra/team-members.njk 内的内联 arm 同款逻辑）。
 *
 * 为什么必须是同步脚本：要在 <body> 渲染前给 <html> 打 members-intro-armed，
 * 否则会先闪出成员页再被封面盖住。由 wiki/pages/members.html 的 head_extra 块
 * 按页引入（不在 layout.html 全站加载，因此天然只作用于成员页）。
 *
 * - 触发：进入成员页即显示（如需"每会话只显示一次"，把 ONCE_PER_SESSION 改 true）
 * - 降级：无 JS 时不 arm，.members-intro 默认 display:none，页面照常可用
 * - 看门狗：控制器 members-intro.js 未启动时 8s 后强制收尾，页面不会被永久遮挡
 */
(function () {
  'use strict';
  try {
    var ONCE_PER_SESSION = false;
    var SESSION_KEY = 'szpu-members-intro-seen';
    var root = document.documentElement;

    if (ONCE_PER_SESSION) {
      try {
        if (window.sessionStorage && sessionStorage.getItem(SESSION_KEY) === '1') return;
      } catch (e) { /* 隐私模式下忽略 */ }
    }

    root.classList.add('members-intro-armed');

    setTimeout(function () {
      if (root.classList.contains('members-intro-ready')) return;
      root.classList.add('members-intro-finished');
    }, 8000);
  } catch (e) { /* 降级：封面不显示，成员页正常运行 */ }
})();
