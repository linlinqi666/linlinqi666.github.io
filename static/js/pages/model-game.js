/**
 * Model page: interactive docking card game (semi-flexible only).
 *
 * The payload is inlined by the page template:
 *   window.MODEL_GAME_DATA   real HADDOCK 2.5 output (static/data/dry-lab/model/game-docking.json)
 *
 * The game covers HADDOCK 2.5 semi-flexible refinement of 5 nanobodies against H1N1 HA only.
 *
 * Behaviour the page promises:
 *   - picking one card draws that molecule on its own; adding the antigen card draws the docked complex
 *   - each nanobody card shows the HADDOCK score of its best cluster
 *   - the cluster selector lists that nanobody's clusters with score, RMSD, structure count and energy terms
 *   - card faces carry the antibody / antigen artwork from the project's card-game icon set
 */
(function () {
  'use strict';

  var DATA = window.MODEL_GAME_DATA;
  var root = document.getElementById('model-game');
  if (!DATA || !root) {
    return;
  }

  // CDN 姿态载荷脚本直接写 window.MODEL_POSE_DATA[key]；页面自身不定义该对象时，
  // 每个载荷脚本都会抛 TypeError，3D 只能退回本地 .pdb.gz 回退（线上无此文件）。
  window.MODEL_POSE_DATA = window.MODEL_POSE_DATA || {};

  var basePath = root.getAttribute('data-base-path') || '';

  // 站点根不能用 data-base-path 的相对值推算：线上同一个页面有两种 URL 形态
  // （/szpu-chuna/model 与 /szpu-chuna/model/），相对基准在前者下会被当成文件名而丢掉一级，
  // 3Dmol 曾因此被请求成 https://2026.igem.wiki/static/js/3dmol/... 直接 404。
  // 改用本脚本自身的绝对地址反推站点根：.../static/js/pages/model-game.js -> 站点根。
  var SITE_ROOT = (function () {
    var self = document.currentScript && document.currentScript.src;
    if (self) {
      var m = self.match(/^(.*?)static\/js\/pages\/[^/]*$/);
      if (m) {
        return m[1];
      }
    }
    return basePath;
  }());

  var structBase = SITE_ROOT + DATA.structureBase;
  var PALETTE = ['#8B5A2B', '#3F6B7A', '#A8442F', '#4F7A3A'];

  var el = {
    antibodies: document.getElementById('model-game-antibodies'),
    antigens: document.getElementById('model-game-antigens'),
    slotAb: document.getElementById('model-game-slot-antibody'),
    slotAg: document.getElementById('model-game-slot-antigen'),
    viewer: document.getElementById('model-game-viewer'),
    note: document.getElementById('model-game-viewer-note'),
    message: document.getElementById('model-game-viewer-message'),
    ranking: document.getElementById('model-game-ranking'),
    result: document.getElementById('model-game-result'),
    select: document.getElementById('model-game-select'),
    selectLabel: document.getElementById('model-game-select-label'),
    status: document.getElementById('model-game-status'),
    fallback: document.getElementById('model-game-fallback'),
    rail: document.getElementById('model-game-rail'),
    railToggle: document.getElementById('model-game-rail-toggle'),
    load3d: document.getElementById('model-game-load3d'),
    style: document.getElementById('model-game-style'),
    flip: document.getElementById('model-game-viewer-toggle')
  };

  var state = { antibody: null, antigen: null, cluster: null, model: null, style: 'cartoon' };
  var viewer = null;
  var molPromise = null;
  var lastPdb = '';
  var lastSplit = false;

  // ------------------------------------------------------------------ helpers
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) {
      n.className = cls;
    }
    if (text !== undefined && text !== null) {
      n.textContent = String(text);
    }
    return n;
  }

  function minus(value, digits) {
    return typeof value === 'number'
      ? value.toFixed(digits === undefined ? 2 : digits).replace('-', MINUS)
      : EMDASH;
  }

  function say(text) {
    if (el.status) {
      el.status.textContent = text || '';
    }
  }

  function warn(text) {
    if (!el.message) {
      return;
    }
    el.message.textContent = text || '';
    el.message.hidden = !text;
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i += 1) {
      if (list[i].id === id) {
        return list[i];
      }
    }
    return null;
  }

  /** 半柔性只跑过 H1N1，卡牌抗原列表就是数据里的全部抗原。 */
  function allowedAntigens() {
    return DATA.antigens.slice();
  }

  /** 卡牌图标：模型页把图标目录作为 data 属性挂在容器上。 */
  function iconUrl(file) {
    if (!file) {
      return '';
    }
    if (/^(https?:)?\//.test(file)) {
      return file;
    }
    var base = root.getAttribute('data-icon-base') || '';
    return base + file;
  }

  // ------------------------------------------------------------------ 3D
  var MINUS = '−';
  var EMDASH = '—';
  var TIMES = '×';
  var EMD = '—';
  var ELL = '…';
  var DOT = '·';
  var DEG = 'Å';
  var PM = '±';

  function load3Dmol() {
    if (window.$3Dmol) {
      return Promise.resolve(window.$3Dmol);
    }
    if (molPromise) {
      return molPromise;
    }
    molPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = SITE_ROOT + 'static/js/3dmol/3Dmol-min.js';
      s.onload = function () {
        window.$3Dmol ? resolve(window.$3Dmol) : reject(new Error('3Dmol did not initialise'));
      };
      s.onerror = function () {
        reject(new Error('3Dmol could not be loaded'));
      };
      document.head.appendChild(s);
    });
    return molPromise;
  }

  /* 结构载荷：复合物与单分子都压成 pose-*.js 放在 iGEM CDN
     （§16.5 合规：数据走 static.igem.wiki，仓库内不放结构二进制）。
     线上取 CDN；本地预览若 CDN 不可达则回退到仓库内 .pdb.gz。 */
  var POSE_BASE = (window.MEDIA_BASE || 'https://static.igem.wiki/teams/6373/wiki') +
    '/lab/drylab/model/pose-js-payload/';
  var poseLoading = {};

  function poseRef(rel) {
    // complexes/flex/R1aA5_H1N1_c1_m1.pdb.gz -> R1aA5_H1N1_flex -> pose-r1a5-h1n1-flex.js
    var m = /([A-Za-z0-9]+)_(H1N1)_(c\d+_m\d+)\.pdb\.gz$/i.exec(rel);
    if (m) {
      var key = m[1] + '_' + m[2] + '_flex';
      return { key: key, file: 'pose-' + key.toLowerCase().replace(/_/g, '-') + '.js' };
    }
    // nanobodies/R1aB6.pdb.gz -> R1aB6_nanobody
    m = /(?:^|\/)(?:nanobodies|antibodies)\/([A-Za-z0-9]+)\.pdb\.gz$/i.exec(rel);
    if (m) {
      return { key: m[1] + '_nanobody', file: 'pose-nanobody-' + m[1].toLowerCase() + '.js' };
    }
    // antigens/native/H1N1_native.pdb.gz -> H1N1_native
    m = /(?:^|\/)antigens\/(native|processed)\/([A-Za-z0-9]+)_\1\.pdb\.gz$/i.exec(rel);
    if (m) {
      var variant = m[1].toLowerCase();
      return {
        key: m[2] + '_' + variant,
        file: 'pose-antigen-' + m[2].toLowerCase() + '-' + variant + '.js'
      };
    }
    return null;
  }

  function b64Floats(b64) {
    var bin = window.atob(b64);
    var u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i += 1) {
      u8[i] = bin.charCodeAt(i);
    }
    return new Float32Array(u8.buffer);
  }

  function pad(v, n) {
    var s = String(v);
    while (s.length < n) {
      s = ' ' + s;
    }
    return s.slice(-n);
  }

  function pdbFromPayload(p) {
    var xyz = b64Floats(p.xyz);
    var atom = p.atom.split('|');
    var resn = p.resn.split('|');
    var resi = p.resi.split('|');
    var elem = p.elem.split('|');
    var lines = [];
    for (var i = 0; i < p.n; i += 1) {
      var name = atom[i] || 'C';
      // 13-16 列：长度 <=3 时右对齐（与标准 PDB 一致）
      var nm = name.length >= 4 ? name.slice(0, 4) : (' ' + name);
      var f = function (v) {
        return pad(v.toFixed(3), 8);
      };
      lines.push(
        'ATOM  ' + pad(i + 1, 5) + ' ' + pad(nm, 4) + ' ' + pad(resn[i] || 'UNK', 3) + ' ' +
        (p.chain ? p.chain.charAt(i) || 'A' : 'A') + pad(resi[i] || 1, 4) + '    ' +
        f(xyz[i * 3]) + f(xyz[i * 3 + 1]) + f(xyz[i * 3 + 2]) +
        '  1.00  0.00          ' + pad(elem[i] || 'C', 2)
      );
    }
    lines.push('END');
    return lines.join('\n');
  }

  function loadPoseScript(ref) {
    if (window.MODEL_POSE_DATA && window.MODEL_POSE_DATA[ref.key]) {
      return Promise.resolve(window.MODEL_POSE_DATA[ref.key]);
    }
    if (!poseLoading[ref.key]) {
      poseLoading[ref.key] = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = POSE_BASE + ref.file;
        s.onload = function () {
          if (window.MODEL_POSE_DATA && window.MODEL_POSE_DATA[ref.key]) {
            resolve(window.MODEL_POSE_DATA[ref.key]);
          } else {
            reject(new Error('pose payload missing: ' + ref.file));
          }
        };
        s.onerror = function () {
          reject(new Error('pose payload could not be loaded: ' + ref.file));
        };
        document.head.appendChild(s);
      });
    }
    return poseLoading[ref.key];
  }

  function fetchStructureFallback(rel) {
    return fetch(structBase + rel).then(function (res) {
      if (!res.ok) {
        throw new Error('HTTP ' + res.status);
      }
      if (!/\.gz$/i.test(rel)) {
        return res.text();
      }
      if (typeof DecompressionStream === 'function' && res.body) {
        return new Response(res.body.pipeThrough(new DecompressionStream('gzip'))).text();
      }
      return res.text();
    });
  }

  function fetchStructure(rel) {
    var ref = poseRef(rel);
    if (!ref) {
      return fetchStructureFallback(rel);
    }
    return loadPoseScript(ref).then(pdbFromPayload).catch(function (err) {
      if (window.console && console.warn) {
        console.warn('[model-game] CDN pose unavailable, falling back to local:', err.message);
      }
      return fetchStructureFallback(rel);
    });
  }

  function chainIds(pdb) {
    var seen = {};
    var out = [];
    var lines = pdb.split('\n');
    for (var i = 0; i < lines.length; i += 1) {
      var l = lines[i];
      if (l.slice(0, 4) === 'ATOM' || l.slice(0, 6) === 'HETATM') {
        var c = l.charAt(21);
        if (c && c !== ' ' && !seen[c]) {
          seen[c] = 1;
          out.push(c);
        }
      }
    }
    return out;
  }

  function styleFor(color) {
    return state.style === 'cartoon'
      ? { cartoon: { color: color || PALETTE[0] } }
      : { stick: { colorscheme: 'grayCarbon', radius: 0.16 } };
  }

  function paint(pdb, split) {
    if (!split) {
      viewer.setStyle({}, styleFor());
      return;
    }
    var chains = chainIds(pdb);
    if (!chains.length) {
      viewer.setStyle({}, styleFor());
      return;
    }
    chains.forEach(function (c, i) {
      viewer.setStyle({ chain: c }, styleFor(PALETTE[i % PALETTE.length]));
    });
  }

  function draw(rel, label, split) {
    warn('');
    if (el.note) {
      el.note.textContent = 'Loading ' + label + ELL;
    }
    return fetchStructure(rel)
      .then(function (pdb) {
        return load3Dmol().then(function (mol) {
          var empty = el.viewer.querySelector('.model-game__viewer-empty');
          if (empty) {
            empty.remove();
          }
          if (viewer) {
            try {
              viewer.clear();
            } catch (err) {
              viewer = null;
            }
          }
          viewer = mol.createViewer(el.viewer, { backgroundColor: '#FFFCF2' });
          // 展示区激活：虚线框改实线（高度由 CSS flex 接管，不在此设）
          el.viewer.classList.add('is-ready');
          viewer.addModel(pdb, 'pdb');
          lastPdb = pdb;
          lastSplit = split;
          paint(pdb, split);
          viewer.zoomTo();
          viewer.render();
          if (el.note) {
            el.note.textContent = label;
          }
        });
      })
      .catch(function (err) {
        if (el.note) {
          el.note.textContent = '';
        }
        warn('Could not load this structure: ' + err.message);
      });
  }

  /** One card -> that molecule on its own; two cards -> the docked complex. */
  function currentStructure() {
    var ab = state.antibody;
    var ag = state.antigen;
    if (ab && ag) {
      var flex = DATA.flexible[ab];
      var cluster = null;
      for (var i = 0; i < flex.clusters.length; i += 1) {
        if (flex.clusters[i].cluster === state.cluster) {
          cluster = flex.clusters[i];
        }
      }
      if (!cluster) {
        return null;
      }
      var model = cluster.models.filter(function (m) {
        return m.model === state.model;
      })[0] || cluster.models[0];
      state.model = model.model;
      return {
        rel: model.file,
        label: 'Complex ' + ab + ' ' + TIMES + ' ' + ag + ' — Cluster ' + cluster.cluster + ', Model ' + model.model,
        split: true
      };
    }
    if (ab) {
      return { rel: byId(DATA.antibodies, ab).file, label: 'Nanobody ' + ab + ' — predicted structure', split: false };
    }
    if (ag) {
      var antigen = byId(DATA.antigens, ag);
      return {
        rel: antigen.processed,
        label: ag + ' HA — complex-processed antigen',
        split: false
      };
    }
    return null;
  }

  // ------------------------------------------------------------------ cards
  function cardNode(kind, item, stats, icon) {
    var b = h('button', 'model-card model-card--' + kind);
    b.type = 'button';
    b.draggable = true;
    b.setAttribute('data-kind', kind);
    b.setAttribute('data-id', item.id);
    var url = iconUrl(icon);
    if (url) {
      var img = document.createElement('img');
      img.className = 'model-card__icon';
      img.src = url;
      img.alt = '';
      img.loading = 'lazy';
      img.decoding = 'async';
      b.appendChild(img);
    }
    var body = h('span', 'model-card__body');
    body.appendChild(h('span', 'model-card__name', item.label || item.id));
    stats.forEach(function (row) {
      var line = h('span', 'model-card__stat');
      line.appendChild(h('span', 'model-card__stat-k', row[0]));
      line.appendChild(h('span', 'model-card__stat-v', row[1]));
      body.appendChild(line);
    });
    b.appendChild(body);
    return b;
  }

  function renderCards() {
    var icons = DATA.icons || {};
    var abIcons = icons.antibodies || {};
    var agIcons = icons.antigens || {};
    if (el.antibodies) {
      el.antibodies.innerHTML = '';
      DATA.antibodies.forEach(function (ab) {
        var flex = DATA.flexible[ab.id];
        var best = flex.clusters.filter(function (c) {
          return c.cluster === flex.bestCluster;
        })[0];
        el.antibodies.appendChild(cardNode('antibody', ab, [
          ['HADDOCK', minus(best.score, 1) + ' (C' + best.cluster + ')']
        ], abIcons[ab.id]));
      });
    }
    if (el.antigens) {
      el.antigens.innerHTML = '';
      DATA.antigens.forEach(function (ag) {
        el.antigens.appendChild(cardNode('antigen', ag, [], agIcons[ag.id]));
      });
    }
  }

  // ------------------------------------------------------------------ selector
  function syncSelector() {
    if (!el.select || !el.selectLabel) {
      return;
    }
    var options = [];
    var label = 'HADDOCK cluster';
    if (state.antibody) {
      options = DATA.flexible[state.antibody].clusters.slice().sort(function (a, b) {
        return a.score - b.score;
      }).map(function (c) {
        return {
          value: c.cluster,
          text: 'Cluster ' + c.cluster + '  ' + DOT + '  ' + minus(c.score, 3) + '  (' + c.nstruc + ' structures)'
        };
      });
    }
    el.selectLabel.textContent = label;
    el.select.innerHTML = '';
    options.forEach(function (o) {
      var opt = h('option', null, o.text);
      opt.value = String(o.value);
      el.select.appendChild(opt);
    });
    el.select.disabled = !options.length;
    if (!options.length) {
      return;
    }
    var want = state.cluster;
    var has = options.some(function (o) {
      return String(o.value) === String(want);
    });
    if (!has) {
      want = options[0].value;
    }
    el.select.value = String(want);
    state.cluster = Number(want);
    var c = DATA.flexible[state.antibody].clusters.filter(function (x) {
      return x.cluster === state.cluster;
    })[0];
    state.model = c && c.models.length ? c.models[0].model : null;
  }

  // ------------------------------------------------------------------ results
  function metricTable(rows) {
    var t = h('table', 'model-game__table');
    var tb = h('tbody');
    rows.forEach(function (r) {
      var tr = h('tr');
      tr.appendChild(h('th', null, r[0]));
      tr.appendChild(h('td', null, r[1]));
      tb.appendChild(tr);
    });
    t.appendChild(tb);
    return t;
  }

  function renderResult() {
    if (!el.result) {
      return;
    }
    el.result.innerHTML = '';
    var ab = state.antibody;
    var ag = state.antigen;

    if (!ab && !ag) {
      el.result.appendChild(h('p', 'model-game__result-hint', 'Pick a nanobody card, an antigen card, or both.'));
      return;
    }
    if (ab && !ag) {
      el.result.appendChild(h('p', 'model-game__result-hint',
        'Nanobody ' + ab + ' selected, its predicted structure is drawn above. Add an antigen card for the docking result.'));
      return;
    }
    if (!ab && ag) {
      el.result.appendChild(h('p', 'model-game__result-hint',
        ag + ' HA selected, its antigen structure is drawn above. Add a nanobody card for the docking result.'));
      return;
    }

    var flex = DATA.flexible[ab];
    var c = flex.clusters.filter(function (x) {
      return x.cluster === state.cluster;
    })[0];
    if (!c) {
      el.result.appendChild(h('p', 'model-game__result-hint', 'No cluster selected for this nanobody.'));
      return;
    }
    el.result.appendChild(h('h4', 'model-game__result-title',
      'HADDOCK 2.5 ' + DOT + ' ' + ab + ' ' + TIMES + ' ' + ag + ' ' + DOT + ' Cluster ' + c.cluster));
    el.result.appendChild(metricTable([
      ['HADDOCK score', minus(c.score, 3) + ' ' + PM + ' ' + minus(c.scoreSd, 3)],
      ['Cluster RMSD', minus(c.rmsd, 3) + ' ' + PM + ' ' + minus(c.rmsdSd, 3) + ' ' + DEG],
      ['Structures in cluster', String(c.nstruc)],
      ['Intermolecular energy', minus(c.einter, 2) + ' kcal/mol'],
      ['van der Waals + 0.1 electrostatic', minus(c.evdwEelec, 2) + ' kcal/mol'],
      ['van der Waals', minus(c.evdw, 2) + ' kcal/mol'],
      ['Electrostatic', minus(c.ediel, 2) + ' kcal/mol'],
      ['Cluster shown', 'Cluster ' + c.cluster + ' representative structure']
    ]));
    el.result.appendChild(h('p', 'model-game__result-note',
      'Semi-flexible refinement was run against ' + DATA.flexAntigen + ' HA only. Each nanobody card defaults to the '
      + 'best cluster of its run; the cluster selector switches to any other cluster of the same run, and score, '
      + 'RMSD, structure count and energy terms are the HADDOCK values for the selected cluster.'));
  }

  /** 数字面板：与卡牌同一数据源的半柔性结果排名（每个抗体的最佳簇）。 */
  function renderRanking() {
    if (!el.ranking || !DATA.flexible) {
      return;
    }
    var rows = DATA.antibodies.map(function (ab) {
      var flex = DATA.flexible[ab.id];
      var best = flex.clusters.filter(function (c) {
        return c.cluster === flex.bestCluster;
      })[0] || flex.clusters[0];
      return { id: ab.id, best: best, clusters: flex.clusters.length };
    }).sort(function (a, b) {
      return a.best.score - b.best.score;
    });
    el.ranking.innerHTML = '';
    el.ranking.appendChild(h('p', 'model-game__panel-title',
      'Best HADDOCK cluster per nanobody (' + DATA.flexAntigen + ' HA)'));
    var table = h('table', 'model-game__table');
    var thead = h('thead');
    var hr = h('tr');
    ['Nanobody', 'Cluster', 'HADDOCK score', 'RMSD', 'Structures'].forEach(function (t) {
      hr.appendChild(h('th', null, t));
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tb = h('tbody');
    rows.forEach(function (r) {
      var tr = h('tr');
      if (state.antibody === r.id) {
        tr.className = 'is-best';
      }
      tr.appendChild(h('td', null, r.id));
      tr.appendChild(h('td', null, 'C' + r.best.cluster));
      tr.appendChild(h('td', null, minus(r.best.score, 3)));
      tr.appendChild(h('td', null, minus(r.best.rmsd, 3) + ' ' + DEG));
      tr.appendChild(h('td', null, String(r.best.nstruc)));
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    el.ranking.appendChild(table);
    el.ranking.appendChild(h('p', 'model-game__result-note',
      'HADDOCK 2.5 semi-flexible scores against ' + DATA.flexAntigen + ' HA; a more negative score is a better '
      + 'interface. This ranking is independent of the cluster selector.'));
  }

  // ------------------------------------------------------------------ 可折叠结果栏
  // 收起态只留一条窄边，board 拿回全部宽度；展开态以覆盖层浮出，不推开 board。
  // 每次选择卡牌后自动展开一次，省得用户先点开才有反馈；之后可随时手动收起。
  function setRail(open) {
    if (!el.rail || !el.railToggle) {
      return;
    }
    var next = open ? 'open' : 'closed';
    if (el.rail.getAttribute('data-rail-state') === next) {
      return;
    }
    el.rail.setAttribute('data-rail-state', next);
    el.rail.classList.toggle('is-open', open);
    el.railToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function markRailHasResult(has) {
    if (el.rail) {
      el.rail.setAttribute('data-has-result', has ? 'true' : 'false');
    }
  }

  // ------------------------------------------------------------------ sync
  // 槽位按钮内含箭头指示与文本两个子节点，只改文本节点，避免把箭头一起抹掉。
  // 文案保持短句：槽位上方的 Nanobody / Antigen 小标签已经说明了归属，
  // 按钮内再写全称会在窄栏里换行。
  function setSlot(slot, text, filled) {
    if (!slot) {
      return;
    }
    var label = slot.querySelector('.model-game__slot-text');
    if (label) {
      label.textContent = text;
    } else {
      slot.textContent = text;
    }
    slot.classList.toggle('is-filled', filled);
  }

  function paintSlots() {
    var ab = byId(DATA.antibodies, state.antibody);
    var ag = byId(DATA.antigens, state.antigen);
    setSlot(el.slotAb,
      ab ? ab.id : (state.antigen ? 'Drop one here' : 'Drop here'), !!ab);
    setSlot(el.slotAg,
      ag ? ag.label : (state.antibody ? 'Drop one here' : 'Drop here'), !!ag);
    Array.prototype.forEach.call(root.querySelectorAll('.model-card'), function (c) {
      var on = (c.getAttribute('data-kind') === 'antibody' && c.getAttribute('data-id') === state.antibody)
        || (c.getAttribute('data-kind') === 'antigen' && c.getAttribute('data-id') === state.antigen);
      c.classList.toggle('is-selected', on);
    });
  }

  function sync() {
    var hadPair = !!(state.antibody && state.antigen);
    paintSlots();
    syncSelector();
    renderResult();
    // 有成对结果时才点亮窄条上的小圆点
    markRailHasResult(hadPair);
    // 选了卡牌就自动展开结果面板一次，让用户立刻看到反馈
    if (hadPair) {
      setRail(true);
    }
    var target = currentStructure();
    if (!target) {
      say('');
      return;
    }
    say(target.label);
    draw(target.rel, target.label, target.split);
  }

  function setCard(kind, id) {
    if (kind === 'antibody') {
      state.antibody = state.antibody === id ? null : id;
      if (state.antibody) {
        state.cluster = DATA.flexible[state.antibody].bestCluster;
        state.model = null;
      }
    } else {
      var ok = allowedAntigens().some(function (a) {
        return a.id === id;
      });
      if (!ok) {
        say('Semi-flexible refinement was only run against ' + DATA.flexAntigen + ' HA.');
        return;
      }
      state.antigen = state.antigen === id ? null : id;
    }
    sync();
  }

  // ------------------------------------------------------------------ wiring
  function onCardEvent(ev) {
    var card = ev.target.closest ? ev.target.closest('.model-card') : null;
    if (!card || !root.contains(card) || card.disabled) {
      return;
    }
    if (ev.type === 'dragstart') {
      ev.dataTransfer.setData('text/plain', card.getAttribute('data-kind') + ':' + card.getAttribute('data-id'));
      ev.dataTransfer.effectAllowed = 'copy';
      card.classList.add('is-dragging');
      root.classList.add('is-dragging');
      return;
    }
    if (ev.type === 'dragend') {
      card.classList.remove('is-dragging');
      root.classList.remove('is-dragging');
      return;
    }
    setCard(card.getAttribute('data-kind'), card.getAttribute('data-id'));
  }

  function wireDeck(node) {
    if (!node) {
      return;
    }
    ['click', 'dragstart', 'dragend'].forEach(function (type) {
      node.addEventListener(type, onCardEvent);
    });
  }

  function wireDropZone(node, kind) {
    if (!node) {
      return;
    }
    node.addEventListener('dragover', function (ev) {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = 'copy';
      node.classList.add('is-over');
    });
    node.addEventListener('dragleave', function () {
      node.classList.remove('is-over');
    });
    node.addEventListener('drop', function (ev) {
      ev.preventDefault();
      node.classList.remove('is-over');
      root.classList.remove('is-dragging');
      var payload = (ev.dataTransfer.getData('text/plain') || '').split(':');
      if (payload.length === 2) {
        setCard(payload[0], payload[1]);
      }
    });
    node.addEventListener('click', function () {
      if (kind === 'antibody') {
        state.antibody = null;
      } else {
        state.antigen = null;
      }
      sync();
    });
  }

  function restyle() {
    if (viewer && lastPdb) {
      paint(lastPdb, lastSplit);
      viewer.render();
    }
  }

  function init() {
    renderCards();
    renderRanking();
    wireDeck(el.antibodies);
    wireDeck(el.antigens);
    wireDropZone(el.slotAb, 'antibody');
    wireDropZone(el.slotAg, 'antigen');

    // 3Dmol 画布不随容器尺寸自动重排：展示区高度由 CSS flex 接管后，
    // 窗口缩放、断点切换、结果栏开合都会改变容器高度，需手动同步画布。
    if (el.viewer && typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () {
        if (viewer) {
          try {
            viewer.resize();
            viewer.render();
          } catch (err) {
            /* 画布尚未就绪或已销毁时忽略 */
          }
        }
      });
      ro.observe(el.viewer);
    }

    if (el.railToggle) {
      el.railToggle.addEventListener('click', function () {
        setRail(el.rail.getAttribute('data-rail-state') !== 'open');
      });
    }
    if (el.select) {
      el.select.addEventListener('change', function () {
        var v = Number(el.select.value);
        state.cluster = v;
        var c = DATA.flexible[state.antibody].clusters.filter(function (x) {
          return x.cluster === v;
        })[0];
        state.model = c && c.models.length ? c.models[0].model : null;
        sync();
      });
    }
    if (el.load3d) {
      el.load3d.addEventListener('click', function () {
        var t = currentStructure();
        if (t) {
          draw(t.rel, t.label, t.split);
        } else {
          say('Pick a card first.');
        }
      });
    }
    if (el.style) {
      el.style.addEventListener('click', function () {
        state.style = state.style === 'cartoon' ? 'stick' : 'cartoon';
        // 按钮文案保持短词，才能和另外两个按钮排在一行；全称放进 title 与 aria-label。
        var label = state.style === 'cartoon' ? 'Cartoon' : 'Stick';
        var full = 'Display Mode: ' + label;
        el.style.textContent = label;
        el.style.title = full;
        el.style.setAttribute('aria-label', full);
        restyle();
      });
    }
    if (el.flip) {
      el.flip.addEventListener('click', function () {
        var on = el.flip.getAttribute('aria-expanded') === 'true';
        var block = root.querySelector('.model-game__viewer-block');
        el.flip.setAttribute('aria-expanded', on ? 'false' : 'true');
        if (block) {
          block.classList.toggle('is-flipped', !on);
        }
        var short = on ? 'Scores' : '3D';
        var full = on ? 'Show the HADDOCK score ranking instead of the 3D view'
          : 'Show the 3D structure instead of the ranking';
        el.flip.textContent = short;
        el.flip.title = full;
        el.flip.setAttribute('aria-label', full);
        if (!on) {
          renderRanking();
        }
      });
    }

    var random = document.getElementById('model-game-random-pair');
    if (random) {
      random.addEventListener('click', function () {
        var ab = DATA.antibodies[Math.floor(Math.random() * DATA.antibodies.length)].id;
        var pool = allowedAntigens();
        var ag = pool[Math.floor(Math.random() * pool.length)].id;
        state.antibody = ab;
        state.antigen = ag;
        state.cluster = DATA.flexible[ab].bestCluster;
        state.model = null;
        sync();
      });
    }
    var reset = document.getElementById('model-game-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        state.antibody = null;
        state.antigen = null;
        state.cluster = null;
        state.model = null;
        say('');
        if (el.note) {
          el.note.textContent = '';
        }
        if (viewer) {
          try {
            viewer.clear();
          } catch (err) {
            viewer = null;
          }
        }
        lastPdb = '';
        el.viewer.classList.remove('is-ready');
        var empty = el.viewer.querySelector('.model-game__viewer-empty');
        if (!empty) {
          var slot = document.createElement('div');
          slot.className = 'model-game__viewer-empty';
          slot.innerHTML = '<p>Pick a card to draw its structure. The 3D library is downloaded only at that step.</p>';
          el.viewer.appendChild(slot);
        }
        sync();
      });
    }

    renderCards();
    syncSelector();
    renderResult();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
