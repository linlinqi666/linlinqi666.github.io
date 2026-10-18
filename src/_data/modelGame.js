// Model page card game data bridge (dry lab)
//
// The card game is semi-flexible only: HADDOCK 2.5 against H1N1 HA, 5 nanobodies.
// Data source: static/data/dry-lab/model/game-docking.json, regenerated from the raw
// computational output under static/expriments/drylab/model/new_model/card_game/:
//   scores   flexible/<Ab>_H1N1_cluster.out            簇成员表
//   柔性/<job>/clusters_haddock-sorted.stat_best4        每个簇的 HADDOCK 打分与能量项
//   complexes/半柔性/<job>/                              簇代表结构
//   抗体图标/纳米抗体1..5.png、 antigen 抗原图标/抗原1.png  卡牌图标（按卡牌顺序配对）
// 页面引用的是 static/image/dry-lab/model/icons/ 下的副本，原始文件保持原名原格式不动。
//
// The page body tables keep using model-docking.json (document data, still includes the
// ClusPro screening tables); this file is only for the card game, so the two never disagree.

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

// 每个纳米抗体只展示一个结构：HADDOCK 半柔性 run 的最佳簇代表模型，
// 簇下拉里保留该抗体的全部簇（带分数、RMSD、结构数与能量项）。
const flexAntigen = raw.flexible.antigen;
const byAb = raw.flexible.byAntibody;

const client = {
  meta: raw.meta,
  structureBase: raw.structureBase,
  flexAntigen: flexAntigen,
  antibodies: raw.antibodies,
  antigens: raw.antigens,
  flexible: byAb,
  icons: raw.icons
};

// Per-antibody summary for the card faces and the ranking panel.
const cards = raw.antibodies.map((ab) => {
  const flex = byAb[ab.id];
  const best = flex.clusters.filter((c) => c.cluster === flex.bestCluster)[0] || flex.clusters[0];
  return {
    id: ab.id,
    file: ab.file,
    icon: raw.icons.antibodies[ab.id] || null,
    haddockScore: num(best.score, 1),
    haddockCluster: best.cluster,
    clusterSize: best.nstruc,
    flexClusters: flex.clusters.length
  };
});

// 每个抗体的簇选项（供页面/调试复用，形状与原来一致）
const flexOptions = {};
Object.keys(byAb).forEach((id) => {
  flexOptions[id] = byAb[id].clusters.map((c) => ({
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
  // 卡面图标基址：与 model.njk 的 data-icon-base 同源（iGEM CDN 上的 AVIF 唯一一份）
  iconBase: raw.icons.base,
  // Report-facing counts for the card game caption.
  stats: {
    antibodies: raw.antibodies.length,
    antigens: raw.antigens.length,
    flexClusters: Object.values(byAb).reduce((n, v) => n + v.clusters.length, 0),
    flexModels: Object.values(byAb).reduce((n, v) => n + v.clusters.reduce((m, c) => m + c.models.length, 0), 0)
  }
};