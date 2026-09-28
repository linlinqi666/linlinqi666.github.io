// Model 页数据桥接（dry lab）
// 唯一数据源是 static/data/dry-lab/model/model-docking.json —— 页面正文表格与
// static/js/pages/model-game.js 的交互演示读的是同一份数据，避免两处数字漂移。
// 之所以用「JSON 文件 + 本桥接」而不是直接把对象写在这里：
//   1) 客户端（浏览器）也需要这份数据，JSON 可由模板内联进页面（Nunjucks: | dump）；
//   2) 后续迁移到官方提交工程（Flask）时，同一份 JSON 可直接复用，模板用 Jinja2 的 | tojson。
// 数值口径与出处见 static/expriments/drylab/model/md/10-一手分析.md。
//
// 排序口径：特异性指数、交叉反应平均结合能、HADDOCK score 都是「越负越好」，故升序。
// 显示口径：docx 原文用 U+2212 减号（−）与固定小数位，故本桥接统一预格式化，
//           模板只渲染字符串，避免两处各写一次格式化规则。

const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', '..', 'static', 'data', 'dry-lab', 'model', 'model-docking.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const OUTCOME_ZH = { lead: '入选', rejected: '淘汰' };

// 与 docx 一致的显示格式：负数用 U+2212，小数位按原表保留
function num(value, digits) {
  if (typeof value !== 'number') {
    return '—';
  }
  return value.toFixed(digits).replace('-', '\u2212');
}

data.tables = {
  untreated: data.candidates
    .slice()
    .sort((a, b) => a.cluspro.untreated.specificityIndex - b.cluspro.untreated.specificityIndex)
    .map((c) => ({
      id: c.id,
      H1N1: num(c.cluspro.untreated.H1N1, 1),
      H3N2: num(c.cluspro.untreated.H3N2, 1),
      H5N1: num(c.cluspro.untreated.H5N1, 1),
      index: num(c.cluspro.untreated.specificityIndex, 2),
      outcome: OUTCOME_ZH[c.verdict.outcome] || c.verdict.outcome
    })),
  treated: data.candidates
    .slice()
    .sort((a, b) => a.cluspro.treated.specificityIndex - b.cluspro.treated.specificityIndex)
    .map((c) => ({
      id: c.id,
      H1N1: num(c.cluspro.treated.H1N1, 1),
      H3N2: num(c.cluspro.treated.H3N2, 1),
      H5N1: num(c.cluspro.treated.H5N1, 1),
      index: num(c.cluspro.treated.specificityIndex, 2)
    })),
  cross: data.candidates
    .slice()
    .sort((a, b) => a.crossReactivity.mean - b.crossReactivity.mean)
    .map((c) => ({
      id: c.id,
      SARS: num(c.crossReactivity.SARS, 1),
      HIV1: num(c.crossReactivity.HIV1, 1),
      RSVF: num(c.crossReactivity.RSVF, 1),
      mean: num(c.crossReactivity.mean, 1),
      risk: c.crossReactivity.risk
    })),
  haddock: data.candidates
    .slice()
    .sort((a, b) => a.haddock.score - b.haddock.score)
    .map((c) => ({
      id: c.id,
      score: num(c.haddock.score, 1),
      clusterSize: String(c.haddock.clusterSize),
      bsa: num(c.haddock.bsa, 1)
    }))
};

// 表头与单元格共用同一套内联样式（沿用 design 页既有表格写法）
data.tableStyle = {
  table: 'width:100%; border-collapse:collapse; margin:1rem 0;',
  headRow: 'border-bottom:2px solid #333;',
  th: 'border:1px solid #ccc; padding:8px; text-align:left;',
  row: 'border-bottom:1px solid #ddd;',
  td: 'border:1px solid #ccc; padding:8px;'
};

data.display = {
  interactions: [
    { label: '总接触点', value: String(data.interface.interactions.contacts) },
    { label: '氢键', value: String(data.interface.interactions.hbonds) },
    { label: '盐桥', value: String(data.interface.interactions.saltBridges) },
    { label: '疏水作用', value: String(data.interface.interactions.hydrophobic) }
  ],
  hotspots: data.interface.hotspots.map((h) => ({
    nanobody: h.nanobody,
    ha: h.ha,
    type: h.type,
    distance: num(h.distance, 3)
  })),
  mmgbsa: data.mmgbsa.items.map((i) => ({ term: i.term, value: num(i.value, 2) })),
  md: data.md.items.map((i) => ({ metric: i.metric, value: i.value })),
  antigens: data.antigens.map((a) => ({
    id: a.id,
    name: a.name,
    strain: a.strain,
    pdbId: a.pdbId,
    source: a.source,
    resolution: a.resolution,
    chainMap: a.chainMap,
    structureNote: a.structureNote
  })),
  leads: data.candidates.filter((c) => c.verdict.outcome === 'lead').map((c) => ({ id: c.id, zh: c.verdict.zh })),
  rejected: data.candidates.filter((c) => c.verdict.outcome === 'rejected').map((c) => ({ id: c.id, zh: c.verdict.zh })),
  pipeline: data.pipeline.map((p) => ({
    stage: String(p.stage),
    question: p.question,
    method: p.method,
    output: p.output
  }))
};

// 客户端内联用的精简载荷：只带交互演示需要的字段（原始数值，由前端自行格式化）
data.client = {
  funnel: data.funnel,
  scoring: data.scoring,
  antigens: data.antigens,
  candidates: data.candidates,
  interface: data.interface,
  md: data.md,
  mmgbsa: data.mmgbsa,
  structureBase: data.meta.structureBase
};

module.exports = data;
