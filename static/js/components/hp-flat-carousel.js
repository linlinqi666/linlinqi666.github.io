(function () {
  'use strict';

  var articleDefinitions = [
    { id: 'section-overview', time: '', title: '项目概述', img: '../static/image/any-icon/home.webp', summary: '了解项目背景、目标，以及团队如何把人类实践反馈转化为工程设计。' },
    { id: 'section-framework', time: '26/07/31', title: '行动研究框架', summary: '以行动研究螺旋循环组织人类实践，把专家反馈转化为可追溯的工程决策。' },
    { id: 'section-stakeholder', time: '26/07/31', title: '利益相关者', summary: '梳理七类关键利益相关者，从多视角校准项目需求与风险边界。' },
    { id: 'section-interviewees', time: '26/07/31', title: '访谈对象清单', summary: '列出全部访谈专家与群体，点击地图图钉查看详细记录。' },
    { id: 'section-southchina', time: '26/08/01', title: '华南交流会', img: '../static/image/any-icon/HP/southchina/hp-southchina--exchange-group-photo.jpg', summary: '与华南多支 iGEM 队伍面对面交流，收集来自高校与评审的反馈。' },
    { id: 'section-apic', time: '26/08/02', title: 'APiC 交流会', summary: '第一届亚太 iGEM 交流会，在南科大与港大两阶段打磨项目。' },
    { id: 'section-education', time: '26/08/03', title: '中职学校科普', img: '../static/image/any-icon/HP/hp--outreach-students.jpg', summary: '把合成生物学带进校园，让更多学生理解生物传感器的价值。' },
    { id: 'section-freshman', time: '26/08/03', title: '新生科普分享', summary: '面向 2026 级新生科普合成生物学与甲流空气检测项目。' }
  ];

  function wrapIndex(value, length) {
    return (value + length) % length;
  }

  function init() {
    var root = document.getElementById('hpFlatCarousel');
    var track = document.getElementById('hpFlatTrack');
    var intro = document.getElementById('hpFlatIntro');
    var detailTrack = document.getElementById('detailTrack');
    if (!root || !track || !intro || !detailTrack) return;

    var detailViewport = detailTrack.parentElement;
    var allDetailSlides = Array.prototype.slice.call(detailTrack.querySelectorAll(':scope > .detail-slide')).filter(function (slide) {
      return Boolean(slide.getAttribute('data-hp-article'));
    });
    if (allDetailSlides.length < articleDefinitions.length) {
      allDetailSlides = Array.prototype.slice.call(detailTrack.querySelectorAll('.detail-slide')).filter(function (slide) {
        return Boolean(slide.getAttribute('data-hp-article'));
      });
    }
    allDetailSlides.forEach(function (slide) {
      if (slide.parentElement !== detailTrack) detailTrack.appendChild(slide);
    });
    var slidesById = new Map();
    allDetailSlides.forEach(function (slide) {
      var id = slide.getAttribute('data-hp-article');
      if (!id || slidesById.has(id)) {
        console.warn('[HP carousel] 忽略缺失或重复 data-hp-article 的文章详情。', slide);
        return;
      }
      slidesById.set(id, slide);
    });
    articleDefinitions.forEach(function (article) {
      var slide = slidesById.get(article.id);
      if (slide) detailTrack.appendChild(slide);
    });

    var definitionsById = new Map(articleDefinitions.map(function (article) { return [article.id, article]; }));
    var articles = [];
    articleDefinitions.forEach(function (definition) {
      var id = definition.id;
      var slide = slidesById.get(id);
      if (!slide) return;
      var articleDefinition = definitionsById.get(id) || {};
      var heading = slide.querySelector('h2, h3');
      var image = slide.querySelector('img');
      var article = {
        id: id,
        time: slide.getAttribute('data-hp-time') || articleDefinition.time || '',
        title: slide.getAttribute('data-hp-title') || articleDefinition.title || (heading ? heading.textContent.trim() : id),
        img: slide.getAttribute('data-hp-image') || articleDefinition.img || (image ? image.currentSrc || image.src : ''),
        summary: slide.getAttribute('data-hp-summary') || articleDefinition.summary || (heading ? heading.textContent.trim() : '')
      };
      articles.push(article);
    });
    articleDefinitions.forEach(function (article) {
      if (!slidesById.has(article.id)) console.warn('[HP carousel] 未找到文章“' + article.id + '”的详情，已跳过对应轮播卡片。');
    });
    if (!articles.length) return;

    var detailSlides = articles.map(function (article) { return slidesById.get(article.id); });
    var index = 0;
    var resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(function () { syncDetailPosition(); }) : null;

    function syncDetailHeight() {
      if (!detailSlides[index]) return;
      detailViewport.style.height = detailSlides[index].offsetHeight + 'px';
    }

    function syncDetailPosition() {
      if (!detailSlides[index]) return;
      detailTrack.style.transform = 'translate3d(' + (-index * detailViewport.clientWidth) + 'px, 0, 0)';
      syncDetailHeight();
    }

    // 卡片条跟随滚动：让当前激活卡片始终可见（第 5 张起从右侧滑入视野）
    function syncStripPosition() {
      var cards = track.querySelectorAll('.hp-flat-card');
      var card = cards[index];
      var viewport = track.parentElement;
      if (!card || !viewport) return;
      var trackRect = track.getBoundingClientRect();
      var cardRect = card.getBoundingClientRect();
      var view = viewport.clientWidth;
      var maxScroll = Math.max(0, track.scrollWidth - view);
      // 目标：激活卡片右缘对齐视口右缘（新卡“从右边滚出来”），并夹在可滚动范围内
      var target = Math.min(Math.max(0, cardRect.left - trackRect.left + cardRect.width - view), maxScroll);
      track.style.transform = 'translate3d(' + (-target) + 'px, 0, 0)';
    }

    // 到位特效：激活卡片闪环 + 回弹一次，提示“已切换到该板块”
    function pulseActiveCard() {
      var cards = track.querySelectorAll('.hp-flat-card');
      var card = cards[index];
      if (!card) return;
      card.classList.remove('is-arriving');
      void card.offsetWidth; // 强制重排，让到位动画可重复触发
      card.classList.add('is-arriving');
    }

    function update() {
      var article = articles[index];
      intro.querySelector('.hp-flat-intro-date').textContent = article.time || 'OVERVIEW';
      intro.querySelector('.hp-flat-intro-title').textContent = article.summary;
      intro.querySelector('.hp-flat-intro-count').textContent = (index + 1) + ' / ' + articles.length;
      track.querySelectorAll('.hp-flat-card').forEach(function (card, cardIndex) {
        var active = cardIndex === index;
        card.classList.toggle('is-active', active);
        card.classList.remove('is-arriving');
        card.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      detailSlides.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.inert = !active;
      });
      syncDetailPosition();
      syncStripPosition();
    }

    function replayIntro() {
      intro.classList.remove('is-switching');
      void intro.offsetWidth; // 强制重排，让淡入关键帧可重复触发
      intro.classList.add('is-switching');
    }

    function goTo(next) {
      index = wrapIndex(next, articles.length);
      track.classList.add('is-moving');
      detailTrack.classList.add('is-moving');
      update();
      replayIntro();
      pulseActiveCard();
      window.dispatchEvent(new CustomEvent('hp:article-change', { detail: { index: index, id: articles[index].id } }));
      window.setTimeout(function () {
        track.classList.remove('is-moving');
        detailTrack.classList.remove('is-moving');
      }, 460);
    }

    articles.forEach(function (article, articleIndex) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'hp-flat-card';
      card.setAttribute('aria-label', '查看' + article.title);
      if (article.img) {
        card.innerHTML = '<img loading="lazy" decoding="async" alt=""><span></span>';
        card.querySelector('img').src = article.img;
        card.querySelector('img').alt = article.title;
      } else {
        card.classList.add('hp-flat-card--text');
        card.innerHTML = '<span></span>';
      }
      card.querySelector('span').textContent = article.title;
      card.addEventListener('click', function () {
        goTo(articleIndex);
        window.history.replaceState(null, '', '#' + article.id);
      });
      track.appendChild(card);
    });

    root.querySelector('.hp-flat-prev').addEventListener('click', function () { goTo(index - 1); });
    root.querySelector('.hp-flat-next').addEventListener('click', function () { goTo(index + 1); });
    root.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    });
    window.addEventListener('resize', function () { syncDetailPosition(); syncStripPosition(); });
    if (resizeObserver) detailSlides.forEach(function (slide) { resizeObserver.observe(slide); });
    window.addEventListener('hp:content-resize', function () { syncDetailPosition(); syncStripPosition(); });
    window.HPFlatCarousel = { goTo: goTo, syncHeight: syncDetailPosition };
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
