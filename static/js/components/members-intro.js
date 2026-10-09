/* members-intro.js — 成员页全屏引导封面控制器（根站）
 *
 * 与 <head> 内同步 arm 脚本（src/_includes/head-extra/team-members.njk）配套：
 *   arm   —— 首帧即给 <html> 打 members-intro-armed：封面显示、锁滚动、页面内容 inert
 *   本文件 —— 绑定进入交互（点击任意处 / Enter / Space / Esc / 按钮），淡出封面、
 *             解锁滚动、恢复页面可交互、把焦点交给成员条带，并派发 membersintro:done
 *
 * 兜底：arm 脚本内置 8s 看门狗，控制器未启动（脚本 404/被拦截）时强制
 *       members-intro-finished，页面绝不会被永久遮挡；无 JS 时不 arm，页面照常显示。
 */
(function () {
  'use strict';

  var html = document.documentElement;
  var overlay = document.getElementById('members-intro');
  if (!overlay) return;

  var enterBtn = document.getElementById('members-intro-enter');
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var finished = false;

  /* 未 arm：无 JS 降级路径或显式关闭，保证封面不残留、页面照常可用 */
  if (!html.classList.contains('members-intro-armed')) {
    overlay.setAttribute('hidden', '');
    return;
  }

  /* 告诉 arm 脚本内的看门狗：控制器已就位，不要强制收尾 */
  html.classList.add('members-intro-ready');
  var SESSION_KEY = 'szpu-members-intro-seen';

  /* 首屏封面照片就绪揭幕（2026-10-08 加载改造）：<head> 里的 preload 已让图
     尽早开始下载；此处等 img load 后给 overlay 加 is-photo-ready 触发淡入，
     保证"页面动画过后看到的就是照片"，而不是先空着再慢慢出现。
     4s 超时或加载失败也放行（模糊衬层兜底），不阻塞进入交互。 */
  var photo = document.getElementById('members-intro-photo');
  var photoSettled = false;
  function markPhotoReady() {
    if (photoSettled) return;
    photoSettled = true;
    overlay.classList.add('is-photo-ready');
  }
  if (photo) {
    if (photo.complete && photo.naturalWidth > 0) {
      markPhotoReady();
    } else {
      photo.addEventListener('load', markPhotoReady, { once: true });
      photo.addEventListener('error', markPhotoReady, { once: true });
      setTimeout(markPhotoReady, 4000);
    }
  } else {
    markPhotoReady();
  }

  var inertTargets = [
    document.querySelector('nav'),
    document.getElementById('members-redesign-app'),
    document.getElementById('footer')
  ].filter(Boolean);

  function setPageInert(on) {
    inertTargets.forEach(function (el) {
      if (on) {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    });
  }

  /* 把焦点交给条带容器（tabindex=-1）：键盘下一步 Tab 自然落到首位成员，
     且不触发成员条上的浏览器默认焦点环（成员条自身有 :focus-visible 样式）。 */
  function focusPage() {
    var target = document.getElementById('members-strip');
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    try {
      target.focus({ preventScroll: true });
    } catch (e) {
      target.focus();
    }
  }

  function finish(reason) {
    if (finished) return;
    finished = true;

    overlay.classList.add('is-leaving');
    html.classList.add('members-intro-finished');
    setPageInert(false);
    document.removeEventListener('keydown', onKeydown, true);
    if (enterBtn) enterBtn.setAttribute('tabindex', '-1');

    var settle = function () {
      overlay.setAttribute('hidden', '');
      overlay.classList.remove('is-leaving');
      /* 供 arm 脚本 ONCE_PER_SESSION = true 时判断"本会话已看过" */
      try {
        if (window.sessionStorage) sessionStorage.setItem(SESSION_KEY, '1');
      } catch (e) { /* 隐私模式下忽略 */ }
      /* 解锁滚动后滚动条回归，通知页面重新测量（rail 边缘填充、条带高度等） */
      try {
        window.dispatchEvent(new Event('resize'));
      } catch (e) { /* 极老环境忽略 */ }
      try {
        document.dispatchEvent(new CustomEvent('membersintro:done', { detail: { reason: reason } }));
      } catch (e) { /* 极老环境忽略 */ }
      focusPage();
    };

    if (reduced) {
      settle();
      return;
    }

    var timer = setTimeout(settle, 800);
    overlay.addEventListener('transitionend', function onEnd(evt) {
      if (evt.target !== overlay) return;
      clearTimeout(timer);
      overlay.removeEventListener('transitionend', onEnd);
      settle();
    });
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      finish(e.key);
    }
  }

  overlay.addEventListener('click', function () { finish('click'); });
  document.addEventListener('keydown', onKeydown, true);

  setPageInert(true);
  if (enterBtn) {
    try {
      enterBtn.focus({ preventScroll: true });
    } catch (e) {
      enterBtn.focus();
    }
  }
})();
