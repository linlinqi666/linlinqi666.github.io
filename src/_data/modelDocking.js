// Model page data bridge (dry lab)
// The single data source is static/data/dry-lab/model/model-docking.json — the page body tables and
// the interactive demo in static/js/pages/model-game.js read the same file, avoiding numeric drift between the two.
// We use a "JSON file + this bridge" instead of writing the object directly here because:
//   1) the client (browser) also needs this data, and the JSON can be inlined into the page (Nunjucks: | dump);
//   2) when migrating to the official submission project (Flask), the same JSON can be reused with Jinja2's | tojson.
// Numeric conventions and provenance: see static/expriments/drylab/model/md/10-一手分析.md.
//
// Sorting: the specificity index, mean cross-reactivity binding energy, and HADDOCK score are all "more negative is better," hence ascending order.
// Display: the docx source uses the U+2212 minus sign (−) and fixed decimal places, so this bridge pre-formats uniformly,
//           and templates render only strings, avoiding duplicate formatting rules in two places.

const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', '..', 'static', 'data', 'dry-lab', 'model', 'model-docking.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const OUTCOME_LABEL = { lead: 'Selected', rejected: 'Rejected' };

// Display format matching the docx: negative numbers use U+2212, decimals kept as in the original table
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
      outcome: OUTCOME_LABEL[c.verdict.outcome] || c.verdict.outcome
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

// Table headers and cells share the same inline styles (following the existing table style on the design page)
data.tableStyle = {
  table: 'width:100%; border-collapse:collapse; margin:1rem 0; background:#FFFFFF;',
  headRow: 'border-bottom:2px solid #8B5A2B; background:#FCE7CB;',
  th: 'border:1px solid #D4A574; padding:8px; text-align:left; color:#5D3A1A; font-weight:700;',
  row: 'border-bottom:1px solid #D4A574;',
  td: 'border:1px solid #D4A574; padding:8px; color:#333333;'
};

data.display = {
  interactions: [
    { label: 'Total contacts', value: String(data.interface.interactions.contacts) },
    { label: 'Hydrogen bonds', value: String(data.interface.interactions.hbonds) },
    { label: 'Salt bridges', value: String(data.interface.interactions.saltBridges) },
    { label: 'Hydrophobic interactions', value: String(data.interface.interactions.hydrophobic) }
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

// Slim payload for client-side inlining: only the fields the interactive demo needs (raw values, formatted by the front end)
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
