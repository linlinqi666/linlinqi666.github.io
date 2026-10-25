// Model page docking-report entry metadata (dry lab)
//
// The twelve analysis reports under static/reports/model/ are third-party exports that were re-themed
// from static/expriments/drylab/model/new_model/. Only the colour scheme changed; the analyses, tables
// and 3D models are the original outputs.
//
// They are deliberately NOT site pages:
//   - not in src/, so Eleventy never processes them;
//   - not in the search-index generator's PAGES whitelist, so site search never surfaces them;
//   - not in nav.njk nor in any sidebar;
//   - the only way in is the jump links on the Model page.
// They are standalone pages reached from here, not navigable site content.
//
// Placement follows the guidance in static/expriments/drylab/model/new_model/model5(1).docx:
//   cluster5 -> section 1.6 interface analysis  (figure 1.6a)
//   hM1Dq    -> Path A section A.7              (figure A.7a)
//   Ste2p    -> Path B section B.4              (figure B.4a)
//
// Each link label is written here rather than read from the report's own <title>, because
// cluster5/sasa.html carries a title left over from Contact Analysis in the original export.

const GROUPS = [
  {
    id: 'cluster5',
    anchor: 'model-report-cluster5',
    label: 'R1aB6 × H1N1 HA (Cluster 5)',
    system: 'HADDOCK 2.5 semi-flexible complex',
    title: 'Interaction Reports: R1aB6 × H1N1 HA Cluster 5',
    desc: 'Four analyses of the same complex, each opening as a standalone report page.',
    links: [
      {
        key: 'contact',
        label: 'Contact Analysis',
        file: 'cluster5/contact.html',
        note: '3D view plus every residue contact, grouped by bond type.'
      },
      {
        key: 'interface',
        label: 'Interface Analysis',
        file: 'cluster5/interface.html',
        note: 'Interface residue grid with per-residue contact detail.'
      },
      {
        key: 'sasa',
        label: 'SASA Analysis',
        file: 'cluster5/sasa.html',
        note: 'Burial-depth and per-residue surface-area plots.',
        caveat: 'The file supplied for this slot in the source folder is byte-identical to the Contact '
          + 'Analysis report (sha256 b9487783ee3055c1), so no separate SASA report exists for this complex.'
      },
      {
        key: 'tabular',
        label: 'Tabular Data',
        file: 'cluster5/tabular.html',
        note: 'The same numbers as sortable tables, one tab per chain, with CSV export.'
      }
    ]
  },
  {
    id: 'hM1Dq',
    anchor: 'model-report-hm1dq',
    label: 'hM1Dq × MT1 (Cluster 1)',
    system: 'Path A gating complex',
    title: 'Interaction Reports: hM1Dq × MT1 Cluster 1',
    desc: 'Four analyses of the Path A gating complex. MT1 occupies the extracellular orthosteric site of '
      + 'hM1Dq, which is where the inhibitory toxin acts before antigen arrival.',
    links: [
      {
        key: 'contact',
        label: 'Contact Analysis',
        file: 'hM1Dq/contact.html',
        note: '3D view plus every residue contact, grouped by bond type.'
      },
      {
        key: 'interface',
        label: 'Interface Analysis',
        file: 'hM1Dq/interface.html',
        note: 'Interface residue grid with per-residue contact detail.'
      },
      {
        key: 'sasa',
        label: 'SASA Analysis',
        file: 'hM1Dq/sasa.html',
        note: 'Burial-depth and per-residue surface-area plots.'
      },
      {
        key: 'tabular',
        label: 'Tabular Data',
        file: 'hM1Dq/tabular.html',
        note: 'The same numbers as a sortable table, with CSV export.'
      }
    ]
  },
  {
    id: 'Ste2p',
    anchor: 'model-report-ste2p',
    label: 'Ste2 × pep5 (Cluster 1)',
    system: 'Path B gating complex',
    title: 'Interaction Reports: Ste2 × pep5 Cluster 1',
    desc: 'Four analyses of the Path B gating complex. The auto-inhibitory peptide pep5 binds '
      + 'mainly through ECL2, ECL3 and TM7 of Ste2.',
    links: [
      {
        key: 'contact',
        label: 'Contact Analysis',
        file: 'Ste2p/contact.html',
        note: '3D view plus every residue contact, grouped by bond type.'
      },
      {
        key: 'interface',
        label: 'Interface Analysis',
        file: 'Ste2p/interface.html',
        note: 'Interface residue grid with per-residue contact detail.'
      },
      {
        key: 'sasa',
        label: 'SASA Analysis',
        file: 'Ste2p/sasa.html',
        note: 'Burial-depth and per-residue surface-area plots.'
      },
      {
        key: 'tabular',
        label: 'Tabular Data',
        file: 'Ste2p/tabular.html',
        note: 'The same numbers as a sortable table, with CSV export.'
      }
    ]
  }
];

module.exports = {
  base: 'static/reports/model/',
  groups: GROUPS
};
