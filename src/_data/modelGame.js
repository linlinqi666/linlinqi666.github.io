// Model page interactive demo data bridge (dry lab)
//
// The demo reads static/data/dry-lab/model/game-docking.json, which is generated from the raw
// computational output under static/expriments/drylab/model/ (see REQ-20261015-004 section 6):
//   flexible  HADDOCK 2.5  new_model/card_game/card_game/柔性/<job>/clusters_haddock-sorted.stat_best4
//   rigid     ClusPro      card_game/scores/rigid/*.csv
// Every number here is read from those files; nothing is filled in by hand. Flexible clusters can be
// bound to their own HADDOCK score because the cluster number is in the file name and in the stat file.
// Rigid models are NOT bound to a ClusPro cluster: rigid{N}.pdb carries no cluster number and the
// ClusPro csv numbers clusters 0-25, so there is no derivable mapping. The demo therefore shows the
// full per-cluster score table and labels the 3D selector "Model N" without a cluster.
//
// The page body tables keep using model-docking.json; this file is only for the interactive demo,
// so the two never disagree about the prose numbers.

const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, '..', '..', 'static', 'data', 'dry-lab', 'model', 'game-docking.json');
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Display format: the source files use ASCII minus signs, the page uses U+2212 like the docx tables.
function num(value, digits) {
  if (typeof value !== 'number') {
    return '—';
  }
  return value.toFixed(digits).replace('-', '\u2212');
}

const flexAntigen = raw.flexible.antigen;

const client = {
  meta: raw.meta,
  structureBase: raw.structureBase,
  flexAntigen: flexAntigen,
  antibodies: raw.antibodies,
  antigens: raw.antigens,
  flexible: raw.flexible.byAntibody,
  rigid: raw.rigid
};

// Per-antibody summary for the card faces and the ranking panel.
const cards = raw.antibodies.map((ab) => {
  const flex = raw.flexible.byAntibody[ab.id];
  const h1n1 = raw.rigid[ab.id + '|' + flexAntigen];
  const best = flex.clusters.find((c) => c.cluster === flex.bestCluster);
  return {
    id: ab.id,
    file: ab.file,
    haddockScore: num(best.score, 1),
    haddockCluster: best.cluster,
    clusterSize: best.nstruc,
    clusproScore: h1n1 && h1n1.best ? num(h1n1.best.score, 1) : '—',
    clusproCluster: h1n1 && h1n1.best ? h1n1.best.cluster : '—',
    flexClusters: flex.clusters.length,
    rigidModels: h1n1 ? h1n1.models.length : 0
  };
});

// Flexible cluster options per antibody, ordered by HADDOCK score (more negative is better).
const flexOptions = {};
Object.keys(raw.flexible.byAntibody).forEach((id) => {
  flexOptions[id] = raw.flexible.byAntibody[id].clusters
    .slice()
    .sort((a, b) => a.score - b.score)
    .map((c) => ({
      cluster: c.cluster,
      score: num(c.score, 3),
      scoreSd: num(c.scoreSd, 3),
      rmsd: num(c.rmsd, 3),
      nstruc: c.nstruc,
      models: c.models.map((m) => m.model)
    }));
});

module.exports = {
  client,
  cards,
  flexOptions,
  flexAntigen,
  // Report-facing counts for the demo caption.
  stats: {
    antibodies: raw.antibodies.length,
    antigens: raw.antigens.length,
    flexClusters: Object.values(raw.flexible.byAntibody)
      .reduce((n, v) => n + v.clusters.length, 0),
    flexModels: Object.values(raw.flexible.byAntibody)
      .reduce((n, v) => n + v.clusters.reduce((m, c) => m + c.models.length, 0), 0),
    rigidModels: Object.values(raw.rigid).reduce((n, v) => n + v.models.length, 0)
  }
};
