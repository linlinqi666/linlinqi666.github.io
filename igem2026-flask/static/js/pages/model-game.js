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
    status: document.getElementById('model-game-status'),
    modeRigid: document.getElementById('model-game-mode-rigid'),
    modeFlex: document.getElementById('model-game-mode-flex'),
    drawBtn: document.getElementById('model-game-draw'),
    randomPair: document.getElementById('model-game-random-pair')
  };

  var state = {
    candidate: null,
    antigen: null,
    mode: 'rigid',       // 'rigid' = ClusPro, 'flexible' = HADDOCK 2.5 (H1N1 only)
    draw: null,          // {n, rank, label, score, bsa, nstruc, file} of the drawn result
    style: 'cartoon',
    numbersFace: false,
    viewType: 'receptor',
    viewer: null,
    viewers: [],         // rigid mode shows two components, so up to two viewers exist
    libLoading: false,
    structureCache: {}
  };

  var game = data.game || null;

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

  /* ------------------------------------------- Docking modes & drawn results */

  function modeMeta(mode) {
    if (game && game.modes) {
      for (var i = 0; i < game.modes.length; i++) {
        if (game.modes[i].id === mode) {
          return game.modes[i];
        }
      }
    }
    return null;
  }

  function antigensAllowed(mode) {
    var meta = modeMeta(mode);
    if (meta && meta.antigens) {
      return meta.antigens.slice();
    }
    var all = [];
    for (var i = 0; i < data.antigens.length; i++) {
      all.push(data.antigens[i].id);
    }
    return all;
  }

  function isAntigenAllowed(id) {
    return antigensAllowed(state.mode).indexOf(id) !== -1;
  }

  function iconUrl(kind, id) {
    if (!game || !game.icons) {
      return '';
    }
    var map = kind === 'antibody' ? game.icons.candidates : game.icons.antigens;
    var file = map && map[id];
    return file ? game.icons.base + file : '';
  }

  function pad3(n) {
    var s = String(n);
    while (s.length < 3) { s = '0' + s; }
    return s;
  }

  // The results available for one combination, in display order.
  //   flexible: the six published HADDOCK clusters, ranked by HADDOCK score.
  //   rigid:    the six exported ClusPro models; no per-model energy exists in the
  //             export, so the rank is the export index (model.000.000 = best of the top cluster).
  function resultsFor(mode, ab, ag) {
    if (!game) { return []; }
    var out = [];
    var i;
    if (mode === 'flexible') {
      var combo = game.combos.flexible[ab] && game.combos.flexible[ab][ag];
      var rows = combo && combo.results2 ? combo.results2 : [];
      for (i = 0; i < rows.length; i++) {
        out.push({
          n: rows[i].cluster,
          rank: rows[i].rank,
          label: 'HADDOCK cluster ' + rows[i].cluster,
          score: rows[i].score,
          bsa: rows[i].bsa,
          nstruc: rows[i].nstruc,
          file: rows[i].file
        });
      }
    } else {
      var info = game.combos.rigid[ab] && game.combos.rigid[ab][ag];
      var count = info ? info.results : 0;
      for (i = 1; i <= count; i++) {
        out.push({
          n: i,
          rank: i,
          label: 'ClusPro model.000.' + pad3(i - 1),
          score: info ? info.topLowest : null,
          bsa: null,
          nstruc: null,
          file: null
        });
      }
    }
    return out;
  }

  // Draw one of the combination's results at random and remember it.
  function drawResult() {
    var results = resultsFor(state.mode, state.candidate, state.antigen);
    if (!results.length) {
      state.draw = null;
      return null;
    }
    state.draw = results[Math.floor(Math.random() * results.length)];
    return state.draw;
  }

  function setMode(mode) {
    if (mode !== 'rigid' && mode !== 'flexible') { return; }
    state.mode = mode;
    state.draw = null;
    if (state.antigen && !isAntigenAllowed(state.antigen)) {
      state.antigen = null;
    }
    disposeViewers();
    showViewerPlaceholder();
    updateModeButtons();
    syncSelection();
    renderResult();
    renderRanking();
    renderViewerNote();
    syncLayout();
    var meta = modeMeta(mode);
    announce('Docking mode: ' + (meta ? meta.label : mode) + '.');
  }

  function updateModeButtons() {
    if (el.modeRigid) {
      var on = state.mode === 'rigid';
      el.modeRigid.classList.toggle('is-active', on);
      el.modeRigid.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (el.modeFlex) {
      var flex = state.mode === 'flexible';
      el.modeFlex.classList.toggle('is-active', flex);
      el.modeFlex.setAttribute('aria-pressed', flex ? 'true' : 'false');
    }
  }

  function randomPair() {
    var ab = data.candidates[Math.floor(Math.random() * data.candidates.length)];
    var allowed = antigensAllowed(state.mode);
    var pickId = allowed[Math.floor(Math.random() * allowed.length)];
    var ag = null;
    for (var i = 0; i < data.antigens.length; i++) {
      if (data.antigens[i].id === pickId) { ag = data.antigens[i]; }
    }
    state.candidate = ab.id;
    state.antigen = ag ? ag.id : null;
    state.draw = null;
    disposeViewers();
    showViewerPlaceholder();
    syncSelection();
    renderResult();
    renderRanking();
    renderViewerNote();
    syncLayout();
  }

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

    // Card art in front of the name. It lives on the team CDN; if a file has not
    // been uploaded yet, hide it rather than show a broken-image placeholder.
    var iconSrc = iconUrl(kind, item.id);
    if (iconSrc) {
      var icon = document.createElement('img');
      icon.className = 'model-card__icon';
      icon.src = iconSrc;
      icon.alt = '';
      icon.width = 28;
      icon.height = 28;
      icon.setAttribute('aria-hidden', 'true');
      icon.loading = 'lazy';
      icon.decoding = 'async';
      icon.addEventListener('error', function () {
        icon.hidden = true;
      });
      card.appendChild(icon);
    }

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

  // Once both cards are chosen, draw one of the combination's results at random.
  function autoDraw() {
    if (state.candidate && state.antigen) {
      drawResult();
    } else {
      state.draw = null;
    }
  }

  function select(kind, id) {
    if (kind === 'antigen' && !isAntigenAllowed(id)) {
      var blocked = findAntigen(id);
      announce((blocked ? blocked.name : id) + ' has no semi-flexible refinement: HADDOCK 2.5 was run against H1N1 HA only.');
      return;
    }
    if (kind === 'antibody') {
      state.candidate = state.candidate === id ? null : id;
    } else {
      state.antigen = state.antigen === id ? null : id;
    }
    autoDraw();
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
      // Antigens outside the current mode (H3N2/H5N1 in semi-flexible mode) stay visible but unusable
      var unavailable = card.dataset.kind === 'antigen' && !isAntigenAllowed(card.dataset.id);
      card.classList.toggle('is-unavailable', unavailable);
      card.disabled = unavailable;
      card.setAttribute('aria-disabled', unavailable ? 'true' : 'false');
      if (unavailable) {
        card.title = 'Semi-flexible refinement was run against H1N1 HA only';
      } else if (card.title) {
        card.removeAttribute('title');
      }
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

  // The drawn result plus its rank among this combination's results.
  function buildDrawBlock(results, draw) {
    var wrap = document.createElement('div');
    wrap.className = 'model-game__draw';

    var meta = modeMeta(state.mode);
    var head = document.createElement('p');
    head.className = 'model-game__draw-head';
    head.textContent = 'Drawn docking result (' + (meta ? meta.shortLabel : state.mode) + ')';
    wrap.appendChild(head);

    if (draw) {
      var pick = document.createElement('p');
      pick.className = 'model-game__draw-pick';
      pick.textContent = draw.label + ' — rank ' + draw.rank + ' of ' + results.length;
      wrap.appendChild(pick);

      var bits = [];
      if (typeof draw.score === 'number') {
        bits.push((state.mode === 'flexible' ? 'HADDOCK score ' : 'ClusPro score ') + fmt(draw.score, 2));
      }
      if (typeof draw.nstruc === 'number' && draw.nstruc) {
        bits.push('cluster size ' + draw.nstruc);
      }
      if (bits.length) {
        var metrics = document.createElement('p');
        metrics.className = 'model-game__draw-metrics';
        metrics.textContent = bits.join(' · ');
        wrap.appendChild(metrics);
      }
    }

    var list = document.createElement('ol');
    list.className = 'model-game__draw-list';
    for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var li = document.createElement('li');
      li.className = 'model-game__draw-item' + (draw && r.n === draw.n ? ' is-drawn' : '');
      var label = document.createElement('span');
      label.className = 'model-game__draw-label';
      label.textContent = '#' + r.rank + ' ' + r.label;
      li.appendChild(label);
      if (typeof r.score === 'number') {
        var score = document.createElement('span');
        score.className = 'model-game__draw-score';
        score.textContent = fmt(r.score, 2);
        li.appendChild(score);
      }
      list.appendChild(li);
    }
    wrap.appendChild(list);

    var note = document.createElement('p');
    note.className = 'model-game__draw-note';
    note.textContent = state.mode === 'flexible'
      ? 'Ranked by HADDOCK score (more negative is better). The drawn row is highlighted; the 3D panel shows this cluster as the real docked complex.'
      : 'Ranked by the ClusPro export index of the best cluster: no per-model energy exists in the export, and the files contain the antigen only, so the 3D panel shows the antigen and the predicted nanobody separately rather than a pose.';
    wrap.appendChild(note);
    return wrap;
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

    // Drawn docking result: one of this combination's results chosen at random,
    // shown together with its place among them.
    var results = resultsFor(state.mode, state.candidate, state.antigen);
    if (results.length) {
      if (!state.draw) {
        drawResult();
      }
      el.result.appendChild(buildDrawBlock(results, state.draw));
    }

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

  // Drop every 3Dmol viewer we created. Re-creating viewers on the same element
  // without this leaves a stale canvas behind, which is why "Reload 3D Structure"
  // looked like it did nothing.
  function disposeViewers() {
    for (var i = 0; i < state.viewers.length; i++) {
      try {
        state.viewers[i].clear();
      } catch (err) {
        warnOnce('viewer clear failed: ' + err.message);
      }
    }
    state.viewers = [];
    state.viewer = null;
    if (el.viewer) {
      el.viewer.textContent = '';
    }
  }

  function showViewerPlaceholder() {
    if (!el.viewer) { return; }
    el.viewer.classList.remove('is-ready');
    if (viewerPlaceholder) {
      el.viewer.appendChild(viewerPlaceholder.cloneNode(true));
    }
  }

  // Structures published as .pdb.gz are inflated in the browser.
  function fetchGz(relPath, callback) {
    var url = basePath + data.structureBase + relPath;
    if (state.structureCache[url]) {
      callback(null, state.structureCache[url]);
      return;
    }
    if (!window.fetch || typeof window.DecompressionStream !== 'function' || !window.Response) {
      callback(new Error('this browser cannot inflate compressed structure files'));
      return;
    }
    window.fetch(url)
      .then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.arrayBuffer();
      })
      .then(function (buf) {
        // Some hosts (and the offline single-file build) hand back the plain PDB
        // text instead of the gzip stream; accept it as is.
        var sig = '';
        try {
          sig = String.fromCharCode.apply(null, new Uint8Array(buf.slice(0, 6)));
        } catch (sigErr) {
          sig = '';
        }
        if (sig.indexOf('HEADER') === 0 || sig.indexOf('ATOM') === 0) {
          return new window.Response(new window.Blob([buf])).text();
        }
        var stream = new window.DecompressionStream('gzip');
        var inflated = new window.Response(new window.Blob([buf]).stream().pipeThrough(stream));
        return inflated.text();
      })
      .then(function (text) {
        state.structureCache[url] = text;
        callback(null, text);
      })
      .catch(function (err) {
        callback(err || new Error('unknown fetch error'));
      });
  }

  function styleFor(kind, extra) {
    var base;
    if (kind === 'nanobody') {
      if (state.style === 'stick') { base = { stick: { radius: 0.12, color: '#2a7f9e' } }; }
      else if (state.style === 'sphere') { base = { sphere: { scale: 0.28, color: '#2a7f9e' } }; }
      else { base = { cartoon: { color: '#2a7f9e' } }; }
    } else {
      if (state.style === 'stick') { base = { stick: { radius: 0.12, colorscheme: 'chain' } }; }
      else if (state.style === 'sphere') { base = { sphere: { scale: 0.28, colorscheme: 'chain' } }; }
      else { base = { cartoon: { color: 'spectrum' } }; }
    }
    return extra || base;
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
    var meta = modeMeta(state.mode);
    var parts = [];
    parts.push('Docking mode: ' + (meta ? meta.label : state.mode) + '.');
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
    if (state.mode === 'flexible') {
      parts.push('The panel shows the drawn HADDOCK cluster, which contains both partners (chain A = HA, chain B = nanobody).');
    } else {
      parts.push('The exported rigid-docking files contain the antigen only, so the panel shows the antigen and the predicted nanobody as two separate components, not a binding pose.');
    }
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
    // Recreating a viewer on the same element without disposing the old one leaves a
    // stale canvas, so "Reload 3D Structure" appeared to do nothing.
    disposeViewers();
    el.viewer.classList.add('is-ready');
    var pane = document.createElement('div');
    pane.className = 'model-game__viewer-pane';
    el.viewer.appendChild(pane);
    state.viewType = desc.type;
    state.viewer = window.$3Dmol.createViewer(pane, { backgroundColor: 'white' });
    state.viewers.push(state.viewer);
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

  function finishLoad() {
    if (el.load3d) {
      el.load3d.disabled = false;
      el.load3d.textContent = 'Reload 3D Structure';
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

      // 1) Semi-flexible + a drawn result: show the real HADDOCK complex (HA + nanobody)
      if (state.mode === 'flexible' && state.draw && state.draw.file) {
        fetchGz(state.draw.file, function (gzError, text) {
          finishLoad();
          if (gzError) {
            show3DMessage('The docked complex could not be loaded (' + gzError.message + ').');
            warnOnce(gzError.message);
            return;
          }
          try {
            renderComplex(text);
            announce('Docked complex loaded: ' + state.draw.label
              + ', rank ' + state.draw.rank + ' of ' + resultsFor(state.mode, state.candidate, state.antigen).length + '.');
          } catch (err) {
            show3DMessage('Failed to render the complex: ' + err.message);
            warnOnce('render failed: ' + err.message);
          }
        });
        return;
      }

      // 2) Rigid: the exported files hold the antigen only, so the antigen and the
      //    candidate's predicted nanobody are shown as two separate components.
      if (state.mode === 'rigid' && state.candidate && state.antigen) {
        var antigen = currentAntigen();
        var cand = findCandidate(state.candidate);
        fetchStructure({ type: 'receptor', id: antigen.id, path: antigen.structure }, function (e1, agText) {
          if (e1) {
            finishLoad();
            show3DMessage('The antigen structure could not be loaded (' + e1.message + ').');
            warnOnce(e1.message);
            return;
          }
          fetchStructure({ type: 'nanobody', id: 'nb-' + cand.id, path: cand.structure.nanobody }, function (e2, nbText) {
            finishLoad();
            if (e2) {
              show3DMessage('The nanobody structure could not be loaded (' + e2.message + ').');
              warnOnce(e2.message);
              return;
            }
            try {
              renderSideBySide(agText, nbText, antigen, cand);
              announce('Both components loaded: ' + antigen.name + ' and the predicted '
                + cand.id + ' nanobody. They are shown separately, not as a docking pose.');
            } catch (err) {
              show3DMessage('Failed to render the components: ' + err.message);
              warnOnce('render failed: ' + err.message);
            }
          });
        });
        return;
      }

      // 3) Fallback: a single component (nanobody or antigen)
      fetchStructure(desc, function (fetchError, pdbText) {
        finishLoad();
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

  // A real docking result: chain A is HA, chain B is the nanobody.
  function renderComplex(pdbText) {
    if (!el.viewer) { return; }
    disposeViewers();
    el.viewer.classList.add('is-ready');
    var pane = document.createElement('div');
    pane.className = 'model-game__viewer-pane';
    el.viewer.appendChild(pane);
    var viewer = window.$3Dmol.createViewer(pane, { backgroundColor: 'white' });
    state.viewers.push(viewer);
    state.viewer = viewer;
    state.viewType = 'complex';
    viewer.addModel(pdbText, 'pdb');
    viewer.setStyle({ chain: 'A' }, styleFor('receptor'));
    viewer.setStyle({ chain: 'B' }, styleFor('nanobody'));
    // ARGB:31 is the hotspot the document proposes for the R31A mutant study
    viewer.addStyle({ chain: 'B', resi: [31] }, { stick: { radius: 0.25, colorscheme: 'greenCarbon' } });
    var antigen = currentAntigen();
    if (antigen && antigen.activeResiduesHA1 && antigen.activeResiduesHA1.length) {
      viewer.addStyle({ chain: 'A', resi: antigen.activeResiduesHA1 }, { stick: { radius: 0.22, colorscheme: 'yellowCarbon' } });
    }
    viewer.zoomTo();
    viewer.render();
    updateViewButtons();
  }

  // Two separate components side by side (rigid mode): no binding pose is implied.
  function renderSideBySide(agText, nbText, antigen, cand) {
    if (!el.viewer) { return; }
    disposeViewers();
    el.viewer.classList.add('is-ready');
    var wrap = document.createElement('div');
    wrap.className = 'model-game__viewer-split';
    el.viewer.appendChild(wrap);

    var parts = [
      {
        text: agText,
        caption: antigen.name + ' (RCSB ' + antigen.pdbId + ', experimental)',
        kind: 'receptor',
        highlight: [
          { sel: { chain: 'A', resi: antigen.activeResiduesHA1 }, style: { stick: { radius: 0.22, colorscheme: 'greenCarbon' } } }
        ]
      },
      {
        text: nbText,
        caption: cand.id + ' (predicted nanobody, not an experimental structure)',
        kind: 'nanobody',
        highlight: [
          { sel: { chain: 'A', resi: expandRanges(cdrRanges()) }, style: { stick: { radius: 0.25, colorscheme: 'yellowCarbon' } } }
        ]
      }
    ];

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var box = document.createElement('div');
      box.className = 'model-game__viewer-part';
      var caption = document.createElement('p');
      caption.className = 'model-game__viewer-caption';
      caption.textContent = part.caption;
      var pane = document.createElement('div');
      pane.className = 'model-game__viewer-pane';
      box.appendChild(caption);
      box.appendChild(pane);
      wrap.appendChild(box);

      var viewer = window.$3Dmol.createViewer(pane, { backgroundColor: 'white' });
      state.viewers.push(viewer);
      viewer.addModel(part.text, 'pdb');
      viewer.setStyle({}, styleFor(part.kind));
      for (var h = 0; h < part.highlight.length; h++) {
        if (part.highlight[h].sel.resi && part.highlight[h].sel.resi.length) {
          viewer.addStyle(part.highlight[h].sel, part.highlight[h].style);
        }
      }
      viewer.zoomTo();
      viewer.render();
    }
    state.viewer = state.viewers[0];
    state.viewType = 'split';
    updateViewButtons();
  }

  function cdrRanges() {
    if (data.interface && data.interface.nanobodySide && data.interface.nanobodySide.cdr) {
      return data.interface.nanobodySide.cdr.map(function (c) { return c.range; });
    }
    return [];
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
        if (kind === 'antigen' && !isAntigenAllowed(parts[1])) {
          announce('That antigen has no result in the current docking mode.');
          return;
        }
        if (kind === 'antibody') {
          state.candidate = parts[1];
        } else {
          state.antigen = parts[1];
        }
        autoDraw();
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
      autoDraw();
      syncSelection();
      renderResult();
      renderRanking();
      renderViewerNote();
    });
  }

  function bindEvents() {
    bindSlot(el.slotAntibody, 'antibody');
    bindSlot(el.slotAntigen, 'antigen');

    if (el.modeRigid) {
      el.modeRigid.addEventListener('click', function () { setMode('rigid'); });
    }
    if (el.modeFlex) {
      el.modeFlex.addEventListener('click', function () { setMode('flexible'); });
    }
    if (el.drawBtn) {
      el.drawBtn.addEventListener('click', function () {
        if (!state.candidate || !state.antigen) {
          announce('Select a nanobody and an antigen first, then draw a result.');
          return;
        }
        drawResult();
        renderResult();
        syncLayout();
        if (state.draw) {
          announce('Drawn ' + state.draw.label + ': rank ' + state.draw.rank + ' of '
            + resultsFor(state.mode, state.candidate, state.antigen).length + '.');
        }
      });
    }
    if (el.randomPair) {
      el.randomPair.addEventListener('click', function () {
        randomPair();
        if (state.draw) {
          announce('Random pair: ' + state.candidate + ' × ' + state.antigen
            + '. Drawn ' + state.draw.label + ' (rank ' + state.draw.rank + ').');
        } else {
          announce('Random pair: ' + state.candidate + ' × ' + state.antigen + '.');
        }
      });
    }

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
        state.draw = null;
        disposeViewers();
        showViewerPlaceholder();
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
