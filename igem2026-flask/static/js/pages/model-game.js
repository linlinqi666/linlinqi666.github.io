/**
 * Model page interactive demo: nanobody – influenza A HA docking cards
 *
 * Data source: window.MODEL_DOCKING_DATA inlined by the template from
 * static/data/dry-lab/model/model-docking.json, the same source as the page body tables.
 * 3D library: static/js/3dmol/3Dmol-min.js, injected dynamically **only after "Load 3D Structure" is clicked**,
 * avoiding a first-paint download of a 0.5 MB-class script.
 *
 * Design constraints (also apply when migrating to the official submission project):
 *   - no inline event attributes; all handlers bound with addEventListener;
 *   - paths are always joined with the container's data-base-path; no hardcoded site prefix;
 *   - no external network dependency (the 3D library and structure files are both self-hosted);
 *   - on a missing or failed structure, show a readable notice and warn only once; no retry, no console spam.
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
      fallback.textContent = 'The interactive demo data could not be loaded; the tables and conclusions below are still complete.';
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
    viewerBlock: root.querySelector('.model-game__viewer-block'),
    viewerToggle: document.getElementById('model-game-viewer-toggle'),
    load3d: document.getElementById('model-game-load3d'),
    styleBtn: document.getElementById('model-game-style'),
    viewNanobody: document.getElementById('model-game-view-nanobody'),
    viewReceptor: document.getElementById('model-game-view-receptor'),
    reset: document.getElementById('model-game-reset'),
    status: document.getElementById('model-game-status')
  };

  var state = {
    candidate: null,
    antigen: null,
    style: 'cartoon',
    numbersFace: false,
    viewType: 'receptor',
    viewer: null,
    libLoading: false,
    structureCache: {}
  };

  // Empty-state placeholder for the 3D panel (written in the template), restored on reset
  var viewerPlaceholder = el.viewer && el.viewer.firstElementChild
    ? el.viewer.firstElementChild.cloneNode(true)
    : null;

  var STYLE_LABEL = { cartoon: 'Cartoon', stick: 'Stick', sphere: 'Sphere' };
  var OUTCOME_LABEL = { lead: 'Selected', rejected: 'Rejected' };
  // Specificity-index range: the largest absolute value in the data (including the processed antigen), used for the gauge bar
  var maxAbsIndex = (function () {
    var max = 1;
    for (var i = 0; i < data.candidates.length; i++) {
      var c = data.candidates[i];
      max = Math.max(max, Math.abs(c.cluspro.untreated.specificityIndex), Math.abs(c.cluspro.treated.specificityIndex));
    }
    return max;
  }());

  /* --------------------------------------------------------------- Utilities */

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

  // The demo area height changes with selection and 3D loading, while sidebar scroll highlighting uses cached section offsets;
  // any layout change must rebuild the cache, or all offsets below become stale (same coupling as with section-fold).
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

  /* ------------------------------------------------------------ Card building */

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
      meta.textContent = 'Specificity-index rank #' + item.verdict.rank;
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
      // Make the "target subtype / control subtype" screening logic directly visible on the card
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

  /* ------------------------------------------------------------ Selection state */

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
    el.slotAntibody.textContent = antibody ? antibody.id : 'Drag in or click a nanobody card on the left';
    el.slotAntigen.textContent = antigen ? antigen.name : 'Drag in or click an antigen card on the right';
    el.slotAntibody.classList.toggle('is-filled', !!antibody);
    el.slotAntigen.classList.toggle('is-filled', !!antigen);
    // Default to the nanobody view when a candidate is selected, otherwise the antigen view; also refresh the view-toggle buttons' enabled/highlight state
    state.viewType = state.candidate ? 'nanobody' : 'receptor';
    updateViewButtons();
  }

  /* -------------------------------------------------------------- Result panel */

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
        ? 'One card missing: ' + (candidate ? 'select an antigen' : 'select a nanobody') + '. Once both are selected, the docking result for the combination appears here.'
        : 'Select a nanobody and an influenza A HA antigen; the docking score, specificity index, and cross-reactivity risk for the combination appear here.';
      el.result.appendChild(hint);
      announce('Interactive demo: no combination selected yet.');
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

    // Main metric: show the specificity index prominently with a gauge centered at 0, so "more negative is more specific" is visible at a glance
    var hero = document.createElement('div');
    hero.className = 'model-game__hero';
    var heroLabel = document.createElement('p');
    heroLabel.className = 'model-game__hero-label';
    heroLabel.textContent = 'Specificity index (untreated antigen)';
    var heroValue = document.createElement('p');
    heroValue.className = 'model-game__hero-value' + (isPositive ? ' is-positive' : '');
    heroValue.textContent = fmt(index, 2);
    var heroNote = document.createElement('p');
    heroNote.className = 'model-game__hero-note';
    heroNote.textContent = isPositive
      ? 'Positive: the candidate binds H1N1 less well than the two control subtypes'
      : 'More negative means more specific for H1N1; both control subtypes score below H1N1';
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
    left.textContent = '← More specific';
    var middle = document.createElement('span');
    middle.textContent = '0';
    var right = document.createElement('span');
    right.textContent = 'Less specific →';
    scale.appendChild(left);
    scale.appendChild(middle);
    scale.appendChild(right);
    el.result.appendChild(scale);

    var verdict = document.createElement('p');
    verdict.className = 'model-game__verdict model-game__verdict--' + candidate.verdict.outcome;
    verdict.textContent = 'Document conclusion: ' + (OUTCOME_LABEL[candidate.verdict.outcome] || candidate.verdict.outcome)
      + '. ' + candidate.verdict.zh;
    el.result.appendChild(verdict);

    var table = document.createElement('table');
    table.className = 'model-game__table';
    var tbody = document.createElement('tbody');

    tbody.appendChild(row('ClusPro score (' + antigen.id + ', untreated antigen)', fmt(untreated[antigen.id], 1)));
    tbody.appendChild(row('ClusPro score (' + antigen.id + ', post-complex-processing antigen)', fmt(treated[antigen.id], 1)));
    tbody.appendChild(row('Specificity index (post-complex-processing antigen)', fmt(treated.specificityIndex, 2)));
    tbody.appendChild(row('Mean cross-reactivity binding energy (SARS / HIV1 / RSVF)', fmt(cross.mean, 1) + ' (' + cross.risk + ')'));

    if (antigen.id === 'H1N1') {
      tbody.appendChild(row('HADDOCK score', fmt(candidate.haddock.score, 1)));
      tbody.appendChild(row('HADDOCK cluster size', String(candidate.haddock.clusterSize)));
      tbody.appendChild(row('BSA', fmt(candidate.haddock.bsa, 1) + ' Å²'));
    } else {
      tbody.appendChild(row('HADDOCK score', 'semi-flexible refinement was run for H1N1 only', true));
    }

    table.appendChild(tbody);
    el.result.appendChild(table);

    var cap = document.createElement('p');
    cap.className = 'model-game__caption';
    cap.textContent = 'Reading: a more negative specificity index means greater specificity for H1N1; a more negative HADDOCK score means better interface quality. '
      + 'These values come from the molecular docking and simulation results in the modeling document and are computational predictions.';
    el.result.appendChild(cap);

    if (antigen.id === 'H1N1' && candidate.id === 'R1aB6') {
      // 默认折叠：6 条热点残基会把结果面板明显拉长
      var detail = document.createElement('details');
      detail.className = 'model-game__detail';
      var dh = document.createElement('summary');
      dh.className = 'model-game__detail-title';
      dh.textContent = 'Interface hotspot residues (' + data.interface.hotspots.length
        + ') — PyMOL + SPICE; the document gives these for R1aB6 × H1N1 only';
      detail.appendChild(dh);
      var list = document.createElement('ul');
      list.className = 'model-game__residues';
      for (var i = 0; i < data.interface.hotspots.length; i++) {
        var h = data.interface.hotspots[i];
        var li = document.createElement('li');
        li.textContent = h.nanobody + ' – ' + h.ha + ': ' + h.type + ', ' + fmt(h.distance, 3) + ' Å';
        list.appendChild(li);
      }
      detail.appendChild(list);
      // 展开/收起改变页面高度，必须让侧栏重算章节偏移（与 syncLayout 的既有约定一致）
      detail.addEventListener('toggle', syncLayout);
      el.result.appendChild(detail);
    } else if (antigen.id === 'H1N1') {
      var only = document.createElement('p');
      only.className = 'model-game__caption';
      only.textContent = 'In the project modeling document, interface residues and interaction statistics are given only for R1aB6 × H1N1, so they are not expanded here.';
      el.result.appendChild(only);
    }

    announce('Interactive demo result: ' + candidate.id + ' with ' + antigen.name + ', specificity index '
      + fmt(untreated.specificityIndex, 2) + ', cross-reactivity risk ' + cross.risk + '.');
  }

  /* -------------------------------------------------------------- Ranking view */

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
    note.textContent = 'Sorted ascending by untreated-antigen specificity index (more negative is more specific). See the "Screening & Ranking" section below for why candidates were selected or rejected.';
    el.ranking.appendChild(note);
  }

  /* ------------------------------------------------------------- 3D viewer */

  function currentAntigen() {
    return state.antigen ? findAntigen(state.antigen) : data.antigens[0];
  }

  // Expand range strings like "27–37" into arrays of residue numbers (handles en dashes and hyphens)
  function expandRanges(ranges) {
    var out = [];
    for (var i = 0; i < ranges.length; i++) {
      var nums = (String(ranges[i]).match(/\d+/g) || []).map(Number);
      if (nums.length >= 2) {
        for (var n = nums[0]; n <= nums[1]; n++) { out.push(n); }
      } else if (nums.length === 1) {
        out.push(nums[0]);
      }
    }
    return out;
  }

  // Decide what the 3D panel shows based on the current selection: candidate → its predicted nanobody; otherwise → antigen
  function getViewDescriptor() {
    if (state.viewType === 'nanobody' && state.candidate) {
      var cand = findCandidate(state.candidate);
      if (cand && cand.structure && cand.structure.nanobody) {
        return {
          type: 'nanobody',
          id: 'nb-' + cand.id,
          name: cand.id + ' (predicted nanobody)',
          path: cand.structure.nanobody,
          candidate: cand
        };
      }
    }
    var antigen = currentAntigen();
    return {
      type: 'receptor',
      id: antigen.id,
      name: antigen.name + ' (RCSB ' + antigen.pdbId + ')',
      path: antigen.structure,
      antigen: antigen
    };
  }

  // View-toggle button enabled/highlight state: nanobody requires a selected candidate, antigen requires a selected antigen
  function updateViewButtons() {
    if (el.viewNanobody) {
      el.viewNanobody.disabled = !state.candidate;
      el.viewNanobody.classList.toggle('is-active', state.viewType === 'nanobody');
    }
    if (el.viewReceptor) {
      el.viewReceptor.disabled = !state.antigen;
      el.viewReceptor.classList.toggle('is-active', state.viewType === 'receptor');
    }
  }

  // 翻转卡：正面 3D 结构 / 背面特异性指数排名；翻回 3D 面时画布需重新量尺寸再渲染
  var parkTimer = null;
  function setNumbersFace(showNumbers) {
    if (!el.viewerBlock || !el.viewerToggle) {
      return;
    }
    state.numbersFace = showNumbers;
    el.viewerBlock.classList.toggle('is-flipped', showNumbers);
    el.viewerToggle.setAttribute('aria-expanded', showNumbers ? 'true' : 'false');
    el.viewerToggle.textContent = showNumbers ? 'Show 3D' : 'Show Numbers';
    var face3d = el.viewerBlock.querySelector('.model-game__flip-face--3d');
    var faceNumbers = el.viewerBlock.querySelector('.model-game__flip-face--numbers');
    if (face3d) {
      face3d.classList.remove('is-parked');
    }
    if (faceNumbers) {
      faceNumbers.classList.remove('is-parked');
    }
    if (parkTimer) {
      window.clearTimeout(parkTimer);
    }
    parkTimer = window.setTimeout(function () {
      if (face3d) {
        face3d.classList.toggle('is-parked', showNumbers);
      }
      if (faceNumbers) {
        faceNumbers.classList.toggle('is-parked', !showNumbers);
      }
    }, 540);
    if (!showNumbers && state.viewer) {
      window.requestAnimationFrame(function () {
        state.viewer.resize();
        state.viewer.render();
      });
    }
    syncLayout();
  }

  function renderViewerNote() {
    var note = document.getElementById('model-game-viewer-note');
    if (!note) {
      return;
    }
    var antigen = currentAntigen();
    var parts = [];
    if (state.candidate) {
      var cand = findCandidate(state.candidate);
      var hasNb = cand && cand.structure && cand.structure.nanobody;
      // 说明必须短：本块是翻转卡面板，长句会撑高背面排名面
      parts.push(hasNb
        ? 'Candidate ' + state.candidate + ': predicted nanobody, single chain, not an experimental structure.'
        : 'No self-hosted structure file for candidate ' + state.candidate + '.');
    }
    parts.push('Antigen ' + antigen.name + ' (RCSB ' + antigen.pdbId + ', ' + antigen.resolution
      + '): experimental structure, interfacial active residues highlighted.');
    parts.push('Single components only: no binding pose, and not the docking complex (HADDOCK exports contain no antibody chain).');
    note.textContent = parts.join(' ');
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
      callback(window.$3Dmol ? null : new Error('$3Dmol was still not exposed after the 3D library loaded'));
    };
    script.onerror = function () {
      state.libLoading = false;
      callback(new Error('failed to load the 3D library'));
    };
    document.head.appendChild(script);
  }

  function fetchStructure(desc, callback) {
    if (state.structureCache[desc.id]) {
      callback(null, state.structureCache[desc.id]);
      return;
    }
    var url = basePath + data.structureBase + desc.path;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status >= 200 && request.status < 300 && request.responseText) {
        state.structureCache[desc.id] = request.responseText;
        callback(null, request.responseText);
      } else {
        callback(new Error('structure file request failed (' + request.status + ')'));
      }
    };
    request.send();
  }

  function applyViewerStyle() {
    if (!state.viewer) {
      return;
    }
    var base;
    if (state.viewType === 'nanobody') {
      // Nanobody: uniform cyan (distinct from the green antigen highlight)
      if (state.style === 'stick') {
        base = { stick: { radius: 0.12, color: '#2a7f9e' } };
      } else if (state.style === 'sphere') {
        base = { sphere: { scale: 0.28, color: '#2a7f9e' } };
      } else {
        base = { cartoon: { color: '#2a7f9e' } };
      }
      state.viewer.setStyle({}, base);
      // Highlight the CDR regions (CDR1/2/3 ranges given in the document) as yellow sticks
      if (data.interface && data.interface.nanobodySide && data.interface.nanobodySide.cdr) {
        var cdr = expandRanges(data.interface.nanobodySide.cdr.map(function (c) { return c.range; }));
        if (cdr.length) {
          state.viewer.addStyle({ chain: 'A', resi: cdr }, { stick: { radius: 0.25, colorscheme: 'yellowCarbon' } });
        }
      }
    } else {
      if (state.style === 'stick') {
        base = { stick: { radius: 0.12, colorscheme: 'chain' } };
      } else if (state.style === 'sphere') {
        base = { sphere: { scale: 0.28, colorscheme: 'chain' } };
      } else {
        base = { cartoon: { color: 'spectrum' } };
      }
      state.viewer.setStyle({}, base);
      var antigen = currentAntigen();
      var highlight = { stick: { radius: 0.22, colorscheme: 'greenCarbon' } };
      if (antigen.activeResiduesHA1.length) {
        state.viewer.addStyle({ chain: 'A', resi: antigen.activeResiduesHA1 }, highlight);
      }
      if (antigen.activeResiduesHA2.length) {
        state.viewer.addStyle({ chain: 'B', resi: antigen.activeResiduesHA2 }, highlight);
      }
    }
    state.viewer.render();
  }

  function renderStructure(desc, pdbText) {
    if (!el.viewer) {
      return;
    }
    el.viewer.textContent = '';
    el.viewer.classList.add('is-ready');
    state.viewType = desc.type;
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
    var desc = getViewDescriptor();
    if (el.load3d) {
      el.load3d.disabled = true;
      el.load3d.textContent = 'Loading…';
    }
    loadLibrary(function (libError) {
      if (libError) {
        if (el.load3d) {
          el.load3d.disabled = false;
          el.load3d.textContent = 'Load 3D Structure';
        }
        show3DMessage('The 3D library could not be loaded (' + libError.message + '). The structure files are self-hosted in the site; refresh and try again.');
        warnOnce(libError.message);
        return;
      }
      fetchStructure(desc, function (fetchError, pdbText) {
        if (el.load3d) {
          el.load3d.disabled = false;
          el.load3d.textContent = 'Reload 3D Structure';
        }
        if (fetchError) {
          show3DMessage('The structure file could not be loaded (' + fetchError.message + ').');
          warnOnce(fetchError.message);
          return;
        }
        try {
          renderStructure(desc, pdbText);
          var tag = desc.type === 'nanobody'
            ? ' (predicted nanobody from structure prediction, not an experimental structure)'
            : ' (RCSB experimental structure)';
          announce('3D structure loaded: ' + desc.name + tag + '.');
          updateViewButtons();
        } catch (err) {
          show3DMessage('Failed to render the structure: ' + err.message);
          warnOnce('render failed: ' + err.message);
        }
      });
    });
  }

  /* ----------------------------------------------------------------- Events */

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
    slot.addEventListener('click', function (event) {
      // The 3D controls (load / display mode / view-toggle buttons and the viewer panel) are nested in the slot; clicking them must not clear the selected cards
      if (event.target.closest('.model-game__viewer-block')) {
        return;
      }
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
        el.styleBtn.textContent = 'Display Mode: ' + STYLE_LABEL[state.style];
        applyViewerStyle();
      });
    }
    if (el.viewerToggle) {
      el.viewerToggle.addEventListener('click', function () {
        setNumbersFace(!state.numbersFace);
      });
    }
    if (el.viewNanobody) {
      el.viewNanobody.addEventListener('click', function () {
        if (!state.candidate) {
          return;
        }
        state.viewType = 'nanobody';
        updateViewButtons();
        request3D();
      });
    }
    if (el.viewReceptor) {
      el.viewReceptor.addEventListener('click', function () {
        if (!state.antigen) {
          return;
        }
        state.viewType = 'receptor';
        updateViewButtons();
        request3D();
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
          el.load3d.textContent = 'Load 3D Structure';
        }
        setNumbersFace(false);
        syncSelection();
        renderResult();
        renderRanking();
        renderViewerNote();
        announce('Interactive demo reset.');
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

  /* ----------------------------------------------------------------- Startup */

  renderCards();
  bindEvents();
  syncSelection();
  renderResult();
  renderRanking();
  renderViewerNote();
}());
