(function () {
  'use strict';

  var articleDefinitions = [
    { id: 'section-overview', time: '', title: '项目概述', img: '../static/image/any-icon/home.webp', summary: '了解项目背景、目标，以及团队如何把人类实践反馈转化为工程设计。' },
    { id: 'section-carousel', time: '26/07/31', title: '清华参赛交流', img: '../static/image/HP/tsinghua/1.jpg', summary: '与其他 iGEM 团队交流项目思路、实验经验和后续合作方向。' },
    { id: 'section-southchina', time: '26/08/01', title: '华南交流会', img: '../static/image/HP/southchina/SZU.jpg', summary: '围绕真实应用需求，收集来自高校与产业伙伴的反馈。' },
    { id: 'section-education', time: '26/08/03', title: '中学生科普', img: '../static/image/HP/school1.jpg', summary: '把合成生物学知识带进校园，让更多学生理解生物传感器的价值。' }
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
      if (!article.img) {
        console.warn('[HP carousel] 文章“' + id + '”未提供轮播图片，已跳过。请设置 data-hp-image。');
        return;
      }
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

    function update() {
      var article = articles[index];
      intro.querySelector('.hp-flat-intro-date').textContent = article.time || 'OVERVIEW';
      intro.querySelector('.hp-flat-intro-title').textContent = article.summary;
      intro.querySelector('.hp-flat-intro-count').textContent = (index + 1) + ' / ' + articles.length;
      track.querySelectorAll('.hp-flat-card').forEach(function (card, cardIndex) {
        var active = cardIndex === index;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      detailSlides.forEach(function (slide, slideIndex) {
        var active = slideIndex === index;
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
        slide.inert = !active;
      });
      syncDetailPosition();
    }

    function goTo(next) {
      index = wrapIndex(next, articles.length);
      track.classList.add('is-moving');
      detailTrack.classList.add('is-moving');
      update();
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
      card.innerHTML = '<img loading="lazy" decoding="async" alt=""><span></span>';
      card.querySelector('img').src = article.img;
      card.querySelector('img').alt = article.title;
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
    window.addEventListener('resize', syncDetailPosition);
    if (resizeObserver) detailSlides.forEach(function (slide) { resizeObserver.observe(slide); });
    window.addEventListener('hp:content-resize', syncDetailPosition);
    window.HPFlatCarousel = { goTo: goTo, syncHeight: syncDetailPosition };
    update();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
