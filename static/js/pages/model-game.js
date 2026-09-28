/**
 * Model 页交互演示：纳米抗体 – 甲流 HA 对接卡牌
 *
 * 数据来源：页面内联的 window.MODEL_DOCKING_DATA（由模板从
 * static/data/dry-lab/model/model-docking.json 内联而来，与本页正文表格同源）。
 * 三维库：static/js/3dmol/3Dmol-min.js，**只在点击「载入三维结构」后**动态注入，
 * 避免首屏下载 0.5 MB 级脚本。
 *
 * 设计约束（迁移到官方提交工程时同样适用）：
 *   - 无内联事件属性，全部 addEventListener；
 *   - 路径一律用容器上的 data-base-path 拼接，不硬编码站点前缀；
 *   - 不依赖外部网络（三维库与结构文件都自托管）；
 *   - 结构缺失或加载失败时给可读提示并只告警一次，不重试、不刷屏。
 */
(function () {
  'use strict';

  var root = document.getElementById('model-game');
  if (!root) {
    return;
  }

  var data = window.MODEL_DOCKING_DATA;
  var fallback = document.getElementById('model-game-fallback');
  if (!data || !data.candidates) {
    if (fallback) {
      fallback.hidden = false;
      fallback.textContent = '交互演示的数据未能载入，页面下方的表格与结论仍是完整内容。';
    }
    return;
  }

  var basePath = root.getAttribute('data-base-path') || '';
  var warned = false;

  var el = {
    antibodies: document.getElementById('model-game-antibodies'),
    antigens: document.getElementById('model-game-antigens'),
    slotAntibody: document.getElementById('model-game-slot-antibody'),
    slotAntigen: document.getElementById('model-game-slot-antigen'),
    result: document.getElementById('model-game-result'),
    ranking: document.getElementById('model-game-ranking'),
    viewer: document.getElementById('model-game-viewer'),
    load3d: document.getElementById('model-game-load3d'),
    styleBtn: document.getElementById('model-game-style'),
    reset: document.getElementById('model-game-reset'),
    status: document.getElementById('model-game-status')
  };

  var state = {
    candidate: null,
    antigen: null,
    style: 'cartoon',
    viewer: null,
    libLoading: false,
    structureCache: {}
  };

  // 三维面板的空态占位（模板里写好的），重置时用它恢复
  var viewerPlaceholder = el.viewer && el.viewer.firstElementChild
    ? el.viewer.firstElementChild.cloneNode(true)
    : null;

  var STYLE_LABEL = { cartoon: '卡通', stick: '棒状', sphere: '球状' };
  var OUTCOME_LABEL = { lead: '入选', rejected: '淘汰' };
  // 特异性指数的量程：取数据里绝对值最大的那个（含处理后抗原），用于画像刻度条
  var maxAbsIndex = (function () {
    var max = 1;
    for (var i = 0; i < data.candidates.length; i++) {
      var c = data.candidates[i];
      max = Math.max(max, Math.abs(c.cluspro.untreated.specificityIndex), Math.abs(c.cluspro.treated.specificityIndex));
    }
    return max;
  }());

  /* ------------------------------------------------------------------ 工具 */

  function announce(text) {
    if (el.status) {
      el.status.textContent = text;
    }
  }

  function warnOnce(message) {
    if (!warned && window.console && window.console.warn) {
      warned = true;
      window.console.warn('[model-game] ' + message);
    }
  }

  // 演示区的高度会随选择与三维载入变化，而侧边栏滚动高亮用的是缓存的章节偏移；
  // 布局一变必须重建缓存，否则下方小节的偏移全部失准（与 section-fold 的联动同理）。
  var layoutFrame = null;
  function syncLayout() {
    if (!window.SidebarProgress || typeof window.SidebarProgress.recalculate !== 'function') {
      return;
    }
    if (layoutFrame) {
      return;
    }
    layoutFrame = window.requestAnimationFrame(function () {
      layoutFrame = null;
      window.SidebarProgress.recalculate();
    });
  }

  function findCandidate(id) {
    for (var i = 0; i < data.candidates.length; i++) {
      if (data.candidates[i].id === id) {
        return data.candidates[i];
      }
    }
    return null;
  }

  function findAntigen(id) {
    for (var i = 0; i < data.antigens.length; i++) {
      if (data.antigens[i].id === id) {
        return data.antigens[i];
      }
    }
    return null;
  }

  function fmt(value, digits) {
    if (typeof value !== 'number') {
      return '—';
    }
    var text = value.toFixed(typeof digits === 'number' ? digits : 2);
    return text.replace('-', '−');
  }

  /* ------------------------------------------------------------- 卡牌构建 */

  function buildCard(kind, item) {
    var card = document.createElement('button');
    card.type = 'button';
    card.className = 'model-card model-card--' + kind;
    card.setAttribute('draggable', 'true');
    card.setAttribute('aria-pressed', 'false');
    card.dataset.kind = kind;
    card.dataset.id = item.id;

    var name = document.createElement('span');
    name.className = 'model-card__name';
    name.textContent = item.name || item.id;
    card.appendChild(name);

    var meta = document.createElement('span');
    meta.className = 'model-card__meta';
    if (kind === 'antibody') {
      meta.textContent = '特异性指数排名 #' + item.verdict.rank;
    } else {
      meta.textContent = item.pdbId + ' · ' + item.resolution;
    }
    card.appendChild(meta);

    if (kind === 'antibody') {
      var badge = document.createElement('span');
      badge.className = 'model-card__badge model-card__badge--' + item.verdict.outcome;
      badge.textContent = OUTCOME_LABEL[item.verdict.outcome] || item.verdict.outcome;
      card.appendChild(badge);
    } else if (item.roleLabel) {
      // 让「目标亚型 / 对照亚型」的筛选逻辑在卡面上直接可见
      var tag = document.createElement('span');
      tag.className = 'model-card__tag model-card__tag--' + (item.role || 'control');
      tag.textContent = item.roleLabel;
      card.appendChild(tag);
    }

    card.addEventListener('click', function () {
      select(kind, item.id);
    });
    card.addEventListener('dragstart', function (event) {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', kind + ':' + item.id);
        event.dataTransfer.effectAllowed = 'copy';
      }
      card.classList.add('is-dragging');
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('is-dragging');
    });
    return card;
  }

  function renderCards() {
    var i;
    for (i = 0; i < data.candidates.length; i++) {
      el.antibodies.appendChild(buildCard('antibody', data.candidates[i]));
    }
    for (i = 0; i < data.antigens.length; i++) {
      el.antigens.appendChild(buildCard('antigen', data.antigens[i]));
    }
  }

  /* --------------------------------------------------------------- 选择态 */

  function select(kind, id) {
    if (kind === 'antibody') {
      state.candidate = state.candidate === id ? null : id;
    } else {
      state.antigen = state.antigen === id ? null : id;
    }
    syncSelection();
    renderResult();
    renderRanking();
    renderViewerNote();
    syncLayout();
  }

  function syncSelection() {
    var cards = root.querySelectorAll('.model-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var selected = (card.dataset.kind === 'antibody' && card.dataset.id === state.candidate) ||
        (card.dataset.kind === 'antigen' && card.dataset.id === state.antigen);
      card.classList.toggle('is-selected', selected);
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');
    }
    var antibody = state.candidate ? findCandidate(state.candidate) : null;
    var antigen = state.antigen ? findAntigen(state.antigen) : null;
    el.slotAntibody.textContent = antibody ? antibody.id : '拖入或点击左侧纳米抗体卡';
    el.slotAntigen.textContent = antigen ? antigen.name : '拖入或点击右侧抗原卡';
    el.slotAntibody.classList.toggle('is-filled', !!antibody);
    el.slotAntigen.classList.toggle('is-filled', !!antigen);
  }

  /* --------------------------------------------------------------- 结果面板 */

  function row(label, value, muted) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.scope = 'row';
    th.textContent = label;
    var td = document.createElement('td');
    td.textContent = value;
    if (muted) {
      td.className = 'is-muted';
    }
    tr.appendChild(th);
    tr.appendChild(td);
    return tr;
  }

  function renderResult() {
    var candidate = state.candidate ? findCandidate(state.candidate) : null;
    var antigen = state.antigen ? findAntigen(state.antigen) : null;
    el.result.textContent = '';

    if (!candidate || !antigen) {
      var hint = document.createElement('p');
      hint.className = 'model-game__hint';
      hint.textContent = candidate || antigen
        ? '还差一张卡：' + (candidate ? '请选一个抗原' : '请选一个纳米抗体') + '，选定后这里会显示该组合的对接结果。'
        : '选一个纳米抗体和一种甲流 HA 抗原，这里会显示该组合的对接打分、特异性指数与交叉反应风险。';
      el.result.appendChild(hint);
      announce('交互演示：尚未选定组合。');
      return;
    }

    var title = document.createElement('h3');
    title.className = 'model-game__result-title';
    title.textContent = candidate.id + ' × ' + antigen.name;
    el.result.appendChild(title);

    var untreated = candidate.cluspro.untreated;
    var treated = candidate.cluspro.treated;
    var cross = candidate.crossReactivity;
    var index = untreated.specificityIndex;
    var isPositive = index > 0;

    // 主指标：特异性指数放大显示，并给一条以 0 为中点的刻度条，让「越负越特异」一眼可见
    var hero = document.createElement('div');
    hero.className = 'model-game__hero';
    var heroLabel = document.createElement('p');
    heroLabel.className = 'model-game__hero-label';
    heroLabel.textContent = '特异性指数（未处理抗原）';
    var heroValue = document.createElement('p');
    heroValue.className = 'model-game__hero-value' + (isPositive ? ' is-positive' : '');
    heroValue.textContent = fmt(index, 2);
    var heroNote = document.createElement('p');
    heroNote.className = 'model-game__hero-note';
    heroNote.textContent = isPositive
      ? '为正值，说明该候选对 H1N1 的结合反而不如两种对照亚型'
      : '越负表示对 H1N1 越特异，两种对照亚型的打分低于 H1N1';
    hero.appendChild(heroLabel);
    hero.appendChild(heroValue);
    hero.appendChild(heroNote);
    el.result.appendChild(hero);

    var gauge = document.createElement('div');
    gauge.className = 'model-game__gauge';
    var bar = document.createElement('span');
    bar.className = 'model-game__gauge-bar' + (isPositive ? ' is-positive' : '');
    bar.style.width = Math.max(3, Math.min(50, Math.abs(index) / maxAbsIndex * 50)) + '%';
    if (isPositive) {
      bar.style.left = '50%';
    } else {
      bar.style.right = '50%';
    }
    gauge.appendChild(bar);
    el.result.appendChild(gauge);

    var scale = document.createElement('p');
    scale.className = 'model-game__gauge-scale';
    var left = document.createElement('span');
    left.textContent = '← 更特异';
    var middle = document.createElement('span');
    middle.textContent = '0';
    var right = document.createElement('span');
    right.textContent = '更不特异 →';
    scale.appendChild(left);
    scale.appendChild(middle);
    scale.appendChild(right);
    el.result.appendChild(scale);

    var verdict = document.createElement('p');
    verdict.className = 'model-game__verdict model-game__verdict--' + candidate.verdict.outcome;
    verdict.textContent = '文档结论：' + (OUTCOME_LABEL[candidate.verdict.outcome] || candidate.verdict.outcome)
      + '。' + candidate.verdict.zh;
    el.result.appendChild(verdict);

    var table = document.createElement('table');
    table.className = 'model-game__table';
    var tbody = document.createElement('tbody');

    tbody.appendChild(row('ClusPro 打分（' + antigen.id + '，未处理抗原）', fmt(untreated[antigen.id], 1)));
    tbody.appendChild(row('ClusPro 打分（' + antigen.id + '，复合物处理后抗原）', fmt(treated[antigen.id], 1)));
    tbody.appendChild(row('特异性指数（复合物处理后抗原）', fmt(treated.specificityIndex, 2)));
    tbody.appendChild(row('交叉反应平均结合能（SARS / HIV1 / RSVF）', fmt(cross.mean, 1) + '（' + cross.risk + '）'));

    if (antigen.id === 'H1N1') {
      tbody.appendChild(row('HADDOCK score', fmt(candidate.haddock.score, 1)));
      tbody.appendChild(row('HADDOCK 聚类大小', String(candidate.haddock.clusterSize)));
      tbody.appendChild(row('BSA', fmt(candidate.haddock.bsa, 1) + ' Å²'));
    } else {
      tbody.appendChild(row('HADDOCK score', '仅对 H1N1 做了半柔性精修', true));
    }

    table.appendChild(tbody);
    el.result.appendChild(table);

    var cap = document.createElement('p');
    cap.className = 'model-game__caption';
    cap.textContent = '判读：特异性指数越负表示对 H1N1 越特异；HADDOCK score 越负表示界面质量越好。'
      + '以上数值来自建模文档的分子对接与模拟结果，属于计算预测。';
    el.result.appendChild(cap);

    if (antigen.id === 'H1N1' && candidate.id === 'R1aB6') {
      var detail = document.createElement('div');
      detail.className = 'model-game__detail';
      var dh = document.createElement('p');
      dh.className = 'model-game__detail-title';
      dh.textContent = '界面热点残基（PyMOL + SPICE，文档仅对 R1aB6 × H1N1 给出）';
      detail.appendChild(dh);
      var list = document.createElement('ul');
      list.className = 'model-game__residues';
      for (var i = 0; i < data.interface.hotspots.length; i++) {
        var h = data.interface.hotspots[i];
        var li = document.createElement('li');
        li.textContent = h.nanobody + ' – ' + h.ha + '：' + h.type + '，' + fmt(h.distance, 3) + ' Å';
        list.appendChild(li);
      }
      detail.appendChild(list);
      el.result.appendChild(detail);
    } else if (antigen.id === 'H1N1') {
      var only = document.createElement('p');
      only.className = 'model-game__caption';
      only.textContent = '界面残基与相互作用统计在本项目的建模文档中只对 R1aB6 × H1N1 给出，故此处不展开。';
      el.result.appendChild(only);
    }

    announce('交互演示结果：' + candidate.id + ' 与 ' + antigen.name + '，特异性指数 '
      + fmt(untreated.specificityIndex, 2) + '，交叉反应风险' + cross.risk + '。');
  }

  /* --------------------------------------------------------------- 排名视图 */

  function renderRanking() {
    el.ranking.textContent = '';
    var sorted = data.candidates.slice().sort(function (a, b) {
      return a.cluspro.untreated.specificityIndex - b.cluspro.untreated.specificityIndex;
    });
    var max = Math.abs(sorted[0].cluspro.untreated.specificityIndex) || 1;

    var list = document.createElement('ul');
    list.className = 'model-game__ranking-list';
    for (var i = 0; i < sorted.length; i++) {
      var c = sorted[i];
      var index = c.cluspro.untreated.specificityIndex;
      var li = document.createElement('li');
      li.className = 'model-game__ranking-item' + (c.id === state.candidate ? ' is-active' : '');

      var name = document.createElement('span');
      name.className = 'model-game__ranking-name';
      name.textContent = c.id;
      li.appendChild(name);

      var track = document.createElement('span');
      track.className = 'model-game__ranking-track';
      var bar = document.createElement('span');
      bar.className = 'model-game__ranking-bar' + (index > 0 ? ' is-positive' : '');
      bar.style.width = Math.max(4, Math.round(Math.abs(index) / max * 100)) + '%';
      track.appendChild(bar);
      li.appendChild(track);

      var value = document.createElement('span');
      value.className = 'model-game__ranking-value';
      value.textContent = fmt(index, 2);
      li.appendChild(value);

      var tag = document.createElement('span');
      tag.className = 'model-game__badge model-game__badge--' + c.verdict.outcome;
      tag.textContent = OUTCOME_LABEL[c.verdict.outcome] || c.verdict.outcome;
      li.appendChild(tag);

      list.appendChild(li);
    }
    el.ranking.appendChild(list);

    var note = document.createElement('p');
    note.className = 'model-game__caption';
    note.textContent = '按未处理抗原的特异性指数升序（越负越特异）。入选与淘汰的判定理由见下方「筛选与排名」小节。';
    el.ranking.appendChild(note);
  }

  /* ----------------------------------------------------------------- 三维 */

  function currentAntigen() {
    return state.antigen ? findAntigen(state.antigen) : data.antigens[0];
  }

  function renderViewerNote() {
    var antigen = currentAntigen();
    var note = document.getElementById('model-game-viewer-note');
    if (!note) {
      return;
    }
    note.textContent = '将显示 ' + antigen.name + '（RCSB ' + antigen.pdbId + '，' + antigen.resolution + '）'
      + '，并高亮文档列出的界面活性残基。共结晶的结合体不是本项目筛出的 R1aB6；'
      + '本项目的对接复合物结构尚未公开，因此这里展示的是抗原结构，不是本项目的对接结果。';
  }

  function loadLibrary(callback) {
    if (window.$3Dmol) {
      callback(null);
      return;
    }
    if (state.libLoading) {
      return;
    }
    state.libLoading = true;
    var script = document.createElement('script');
    script.src = basePath + 'static/js/3dmol/3Dmol-min.js';
    script.async = true;
    script.onload = function () {
      state.libLoading = false;
      callback(window.$3Dmol ? null : new Error('三维库载入后仍未暴露 $3Dmol'));
    };
    script.onerror = function () {
      state.libLoading = false;
      callback(new Error('三维库载入失败'));
    };
    document.head.appendChild(script);
  }

  function fetchStructure(antigen, callback) {
    if (state.structureCache[antigen.id]) {
      callback(null, state.structureCache[antigen.id]);
      return;
    }
    var url = basePath + data.structureBase + antigen.structure;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status >= 200 && request.status < 300 && request.responseText) {
        state.structureCache[antigen.id] = request.responseText;
        callback(null, request.responseText);
      } else {
        callback(new Error('结构文件请求失败（' + request.status + '）'));
      }
    };
    request.send();
  }

  function applyViewerStyle() {
    if (!state.viewer) {
      return;
    }
    var antigen = currentAntigen();
    var base;
    if (state.style === 'stick') {
      base = { stick: { radius: 0.12, colorscheme: 'chain' } };
    } else if (state.style === 'sphere') {
      base = { sphere: { scale: 0.28, colorscheme: 'chain' } };
    } else {
      base = { cartoon: { color: 'spectrum' } };
    }
    state.viewer.setStyle({}, base);

    var highlight = { stick: { radius: 0.22, colorscheme: 'greenCarbon' } };
    if (antigen.activeResiduesHA1.length) {
      state.viewer.addStyle({ chain: 'A', resi: antigen.activeResiduesHA1 }, highlight);
    }
    if (antigen.activeResiduesHA2.length) {
      state.viewer.addStyle({ chain: 'B', resi: antigen.activeResiduesHA2 }, highlight);
    }
    state.viewer.render();
  }

  function renderStructure(antigen, pdbText) {
    if (!el.viewer) {
      return;
    }
    el.viewer.textContent = '';
    el.viewer.classList.add('is-ready');
    state.viewer = window.$3Dmol.createViewer(el.viewer, { backgroundColor: 'white' });
    state.viewer.addModel(pdbText, 'pdb');
    applyViewerStyle();
    state.viewer.zoomTo();
    state.viewer.render();
    syncLayout();
  }

  function show3DMessage(text) {
    var box = document.getElementById('model-game-viewer-message');
    if (box) {
      box.textContent = text;
      box.hidden = false;
    }
  }

  function request3D() {
    var antigen = currentAntigen();
    if (el.load3d) {
      el.load3d.disabled = true;
      el.load3d.textContent = '正在载入…';
    }
    loadLibrary(function (libError) {
      if (libError) {
        if (el.load3d) {
          el.load3d.disabled = false;
          el.load3d.textContent = '载入三维结构';
        }
        show3DMessage('三维库未能载入（' + libError.message + '）。结构文件已在站点内自托管，可刷新后重试。');
        warnOnce(libError.message);
        return;
      }
      fetchStructure(antigen, function (fetchError, pdbText) {
        if (el.load3d) {
          el.load3d.disabled = false;
          el.load3d.textContent = '重载三维结构';
        }
        if (fetchError) {
          show3DMessage('结构文件未能载入（' + fetchError.message + '）。');
          warnOnce(fetchError.message);
          return;
        }
        try {
          renderStructure(antigen, pdbText);
          announce('三维结构已载入：' + antigen.name + '（RCSB ' + antigen.pdbId + '）。');
        } catch (err) {
          show3DMessage('结构渲染失败：' + err.message);
          warnOnce('渲染失败：' + err.message);
        }
      });
    });
  }

  /* ----------------------------------------------------------------- 事件 */

  function bindSlot(slot, kind) {
    if (!slot) {
      return;
    }
    slot.addEventListener('dragover', function (event) {
      event.preventDefault();
      slot.classList.add('is-over');
    });
    slot.addEventListener('dragleave', function () {
      slot.classList.remove('is-over');
    });
    slot.addEventListener('drop', function (event) {
      event.preventDefault();
      slot.classList.remove('is-over');
      var payload = event.dataTransfer ? event.dataTransfer.getData('text/plain') : '';
      var parts = payload.split(':');
      if (parts.length === 2 && parts[0] === kind) {
        if (kind === 'antibody') {
          state.candidate = parts[1];
        } else {
          state.antigen = parts[1];
        }
        syncSelection();
        renderResult();
        renderRanking();
        renderViewerNote();
        syncLayout();
      }
    });
    slot.addEventListener('click', function () {
      if (kind === 'antibody') {
        state.candidate = null;
      } else {
        state.antigen = null;
      }
      syncSelection();
      renderResult();
      renderRanking();
      renderViewerNote();
    });
  }

  function bindEvents() {
    bindSlot(el.slotAntibody, 'antibody');
    bindSlot(el.slotAntigen, 'antigen');

    if (el.load3d) {
      el.load3d.addEventListener('click', request3D);
    }
    if (el.styleBtn) {
      el.styleBtn.addEventListener('click', function () {
        var order = ['cartoon', 'stick', 'sphere'];
        state.style = order[(order.indexOf(state.style) + 1) % order.length];
        el.styleBtn.textContent = '显示模式：' + STYLE_LABEL[state.style];
        applyViewerStyle();
      });
    }
    if (el.reset) {
      el.reset.addEventListener('click', function () {
        state.candidate = null;
        state.antigen = null;
        if (state.viewer) {
          state.viewer.clear();
          state.viewer = null;
        }
        if (el.viewer) {
          el.viewer.textContent = '';
          el.viewer.classList.remove('is-ready');
          if (viewerPlaceholder) {
            el.viewer.appendChild(viewerPlaceholder.cloneNode(true));
          }
        }
        var message = document.getElementById('model-game-viewer-message');
        if (message) {
          message.hidden = true;
        }
        if (el.load3d) {
          el.load3d.textContent = '载入三维结构';
        }
        syncSelection();
        renderResult();
        renderRanking();
        renderViewerNote();
        announce('交互演示已重置。');
        syncLayout();
      });
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (!state.viewer) {
        return;
      }
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        if (state.viewer) {
          state.viewer.resize();
          state.viewer.render();
        }
      }, 150);
    });
  }

  /* ----------------------------------------------------------------- 启动 */

  renderCards();
  bindEvents();
  syncSelection();
  renderResult();
  renderRanking();
  renderViewerNote();
}());
