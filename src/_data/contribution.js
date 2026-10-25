// Contribution 页内容数据（英文单语）
// 结构依据：static/expriments/The extreme/contribution/output/13-Contribution页面撰写大纲.md（本队撰写大纲）
// 与 output/15-Contribution页面内容大纲.md、output/contribution-{底盘,GPA1人源化}.docx，
// 以及 2026-10-19 用户提供的「Wet-Lab Contributions」三级目录英文稿。
//
// 结构：
//   Wet-Lab Contributions（三级：L1 节 → L2 子目 → L3 条目，卡内用 h3/h4 嵌套）
//     · 可复用 Parts 四条：报告模块 / FAR1-SST2 编辑组件 / Gpa1 C 端模块 / 构造与排查记录
//       图文取自 Wet contuibution.docx，配图存 static/image/contribution/
//     · 既有两节接在其后：From Engineering to Validation、Reusable Design Resources
//   Model / Human Practices（每节一张卡片，h2 标题 + h3 子目）
//
// 选材口径：
//   门控（信号识别）模块未完成，不作为贡献列出；
//   只保留做成的两块湿实验——底盘基因敲除（<i>FAR1</i> / <i>SST2</i>）与 GPA1 人源化；
//   HP 只保留 APiC 交流会与酵母专题线上会，其余略过。
//   Wet-Lab 一节含真实 Registry 编号（BBa_…）。
//
// 写法：不设统一字段表，小节按内容分量决定段数；每条都交代做到哪一步、别人拿到能用在哪。
// 第三方序列与设计（Komatsuzaki 1997 Gαq C 端嵌合体、Addgene #67638 pML104）在条目内署名。
// 每个大节末尾挂「More details on the … page.」。

// 正文段末的页面指引词在原稿里写作 Parts / Engineering / Results / Design，
// 渲染成站内链接，供读者从条目跳到对应的 Parts、Engineering、Results、Design 页。
const PAGE_LINKS = {
  Parts: '../wet-lab/parts.html',
  Engineering: '../project/engineering.html',
  Results: '../wet-lab/result.html',
  Design: '../project/design.html'
};

const refs = (...labels) =>
  '<span class="contrib-refs">' +
  labels.map((label) => `<a href="${PAGE_LINKS[label]}">${label}</a>`).join(' · ') +
  '</span>';

module.exports = {
  nav: [
    {
      id: 'contribution-wetlab',
      en: 'Wet-Lab Contributions',
      children: [
        { id: 'wetlab-reporter-parts', en: 'Pheromone-responsive reporter parts', flat: true },
        { id: 'wetlab-far1-sst2', en: '<i>FAR1</i>/<i>SST2</i> editing components', flat: true },
        { id: 'wetlab-gpa1-module', en: 'Gpa1 C-terminal engineering module', flat: true },
        { id: 'wetlab-records', en: 'Construction and troubleshooting records', flat: true },
        {
          id: 'wetlab-validation',
          en: 'From Engineering to Validation',
          children: [
            { id: 'wetlab-genediting', en: 'Translating Gene Editing into Verifiable Phenotypes' },
            { id: 'wetlab-construction', en: 'Refining Construction Methods' },
            { id: 'wetlab-connecting', en: 'Connecting Modifications to Behavior' }
          ]
        },
        {
          id: 'wetlab-resources',
          en: 'Reusable Design Resources',
          children: [
            { id: 'wetlab-strategy', en: 'A Genetic Engineering Strategy for Yeast' },
            { id: 'wetlab-starting', en: 'A Starting Point for Cross-Species Coupling' }
          ]
        }
      ]
    },
    {
      id: 'contribution-model',
      en: 'Model',
      children: [
        { id: 'model-screening', en: 'Seventeen candidates, one lead' },
        { id: 'model-gating', en: 'Both gating interfaces' },
        { id: 'model-hotspot', en: 'One hotspot, one hypothesis' },
        { id: 'model-reproducibility', en: 'The pipeline as files' }
      ]
    },
    {
      id: 'contribution-hp',
      en: 'Human Practices',
      children: [
        { id: 'hp-apic', en: 'APiC question cards' },
        { id: 'hp-yeast-workshop', en: 'The workshop record' },
        { id: 'hp-sharing-lessons', en: 'Sharing knowledge' }
      ]
    }
  ],

  cards: [
    // ============ Wet-Lab Contributions（三级目录） ============
    // 顺序：先列可复用的 Parts 与构造记录（报告模块 / FAR1-SST2 编辑组件 / GPA1 模块 / 失败与改法），
    // 再接既有的验证与资源两节，形成「先交付物、后验证过程」的阅读顺序。
    {
      id: 'contribution-wetlab',
      section: true,
      title: { en: 'Wet-Lab Contributions: Reusable Parts for Yeast Engineering' },
      blocks: [
        {
          type: 'p',
          text: {
            en: `Our wet-lab contribution is a set of documented genetic components and characterization results that future teams can use when engineering yeast signaling systems. The parts cover pheromone-responsive reporting, <i>FAR1</i>/<i>SST2</i> editing and <i>GPA1</i> C-terminal modification. Their sequences and intended roles are indexed on our Parts page, while construction and experimental evidence are documented on our Engineering and Results pages. ${refs('Parts', 'Engineering', 'Results')}`
          }
        },
        {
          type: 'h3',
          id: 'wetlab-reporter-parts',
          text: { en: '1. Pheromone-responsive reporter parts' }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Featured parts:</strong> BBa_26J53MF4 — <i>FUS1</i> promoter · BBa_26D8D1SG — <i>FUS1</i>–<i>yEGFP</i> reporter fragment`
          }
        },
        {
          type: 'figure',
          src: 'static/image/contribution/fig1-pesc-his-fus1-yegfp-map.png',
          alt: 'Annotated plasmid map of pESC-HIS-P_FUS1-yEGFP with the FUS1 promoter, the yEGFP reporter gene, the CYC1 terminator and the vector backbone elements labelled.',
          width: 1188,
          height: 1150,
          caption: 'Figure 1. Plasmid map of pESC-HIS-P_FUS1-yEGFP.',
          desc: 'The 7,181-bp plasmid contains the <i>FUS1</i> promoter, the <i>yEGFP</i> reporter gene, and a downstream <i>CYC1</i> terminator, together with the annotated backbone elements. The map shows the plasmid context of the <i>FUS1</i> promoter and <i>FUS1</i>–<i>yEGFP</i> reporter fragment contributed by our team, rather than the boundaries of either individual Registry part. Map generated using SnapGene.'
        },
        {
          type: 'p',
          text: {
            en: `We provide a defined 435-bp <i>FUS1</i> promoter fragment and a 1,152-bp composite fragment combining this promoter with the <i>yEGFP</i> coding sequence. The promoter is recorded separately from the reporter, allowing future teams to reuse the regulatory element or the assembled fluorescence readout according to their own designs. ${refs('Parts')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `We characterized the reporter in BY4741 using α-factor induction, fluorescence imaging, time-course measurements and growth assays. These experiments provide a reference for evaluating downstream yeast pheromone-pathway output and comparing engineered chassis strains. ${refs('Results')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Value for future teams:</strong> a characterized reporter starting point for yeast signaling studies. The composite is a reporter fragment, not a complete standalone expression system; a suitable vector and transcriptional termination context must be supplied. Its α-factor characterization does not establish HA detection. ${refs('Parts', 'Design')}`
          }
        },
        {
          type: 'h3',
          id: 'wetlab-far1-sst2',
          text: { en: '2. <i>FAR1</i>/<i>SST2</i> editing components' }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Featured composite parts:</strong> BBa_26IKMSKO — <i>FAR1</i> sgRNA expression cassette · BBa_26YVX4QT — <i>SST2</i> sgRNA expression cassette`
          }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Matching repair templates:</strong> BBa_26HN2W3G — <i>FAR1</i> repair template · BBa_262SR0ED — <i>SST2</i> repair template`
          }
        },
        {
          type: 'figure',
          src: 'static/image/contribution/fig2-pml104-vector-map.png',
          alt: 'Annotated map of the pML104 vector used for yeast editing, showing URA3, the SNR52 promoter, the SUP4 terminator and other labelled vector features.',
          width: 1058,
          height: 1142,
          caption: 'Figure 2. Map of the pML104 vector used in the yeast-editing workflow.',
          desc: 'The 11,258-bp map displays annotated vector features, including <i>URA3</i>, the <i>SNR52</i> promoter, and the <i>SUP4</i> terminator. The <i>FAR1</i>- and <i>SST2</i>-targeting sequences are not explicitly identified in this view; therefore, this figure presents the vector context rather than a target-specific sgRNA part map. Map generated using SnapGene.'
        },
        {
          type: 'p',
          text: {
            en: `We provide target-specific sgRNA expression cassettes and matching repair templates for <i>FAR1</i> and <i>SST2</i> editing in BY4741. Each cassette combines a yeast RNA polymerase III promoter, a target-specific spacer, the SpCas9 sgRNA scaffold and a terminator. The repair templates are designed to introduce frameshift-producing four-base-pair deletions. ${refs('Parts')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `Following an unsuccessful initial construction round, we revised guide assembly and repair-template design. Colony screening and Sanger sequencing subsequently identified the intended <i>FAR1</i> and <i>SST2</i> edits, and growth and fluorescence measurements characterized the resulting chassis under α-factor induction. ${refs('Engineering', 'Results')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Value for future teams:</strong> matched targeting and repair components, together with a documented editing workflow and genotype-to-phenotype evaluation. These components require Cas9 and the appropriate donor and host context; the sgRNA cassette alone is not a complete knockout system. ${refs('Parts', 'Engineering')}`
          }
        },
        {
          type: 'h3',
          id: 'wetlab-gpa1-module',
          text: { en: '3. A Gpa1 C-terminal engineering module' }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Featured basic part:</strong> BBa_26EG2LOR — Gαq-derived EYNLV sequence with stop codon`
          }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Associated composite:</strong> BBa_266K1VDV — <i>GPA1</i> C-terminal humanization cassette`
          }
        },
        {
          type: 'figure',
          src: 'static/image/contribution/fig4-gpa1-humanization-map.png',
          alt: 'Partial annotated map of the GPA1 C-terminal humanization construct, showing the humanization sequence and the adjacent URA3-associated annotations.',
          width: 1704,
          height: 296,
          caption: 'Figure 4. Partial annotated map of the <i>GPA1</i> C-terminal humanization construct.',
          desc: 'The view shows the region labeled as the humanization sequence and the adjacent <i>URA3</i>-associated annotations. It provides local construct context but does not delineate the complete donor boundaries or both homology arms. Map generated using SnapGene.'
        },
        {
          type: 'p',
          text: {
            en: `BBa_26EG2LOR is an 18-bp module encoding the Gαq-derived C-terminal sequence EYNLV followed by a stop codon. We used this sequence in a <i>GPA1</i>-editing design intended to replace the native Gpa1 C-terminal pentapeptide KIGII. It is a replacement segment, not a complete G-protein coding sequence. ${refs('Parts')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `After revising the donor-construction strategy to overlap-extension fusion PCR, we obtained strains 12 and 17 with the expected target-region sequence. The humanized chassis was further characterized through α-factor-induced morphology, growth and <i>FUS1</i>–<i>yEGFP</i> fluorescence measurements, which showed attenuated native pheromone responses. ${refs('Engineering', 'Results')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Value for future teams:</strong> a defined replacement module and a documented starting point for studying yeast G-protein interfaces. The evidence supports the edited-chassis phenotype; it does not independently establish hM1Dq coupling or attribute every observed change solely to the 18-bp replacement. ${refs('Results')}`
          }
        },
        {
          type: 'h3',
          id: 'wetlab-records',
          text: { en: 'Reusable construction and troubleshooting records' }
        },
        {
          type: 'p',
          text: {
            en: `Alongside these parts, we document unsuccessful construction attempts and the design changes that followed, including revised sgRNA assembly, repair-template redesign and the switch from a multi-round donor-construction route to overlap-extension fusion PCR. These records give future teams practical alternatives to evaluate rather than only presenting the final successful constructs. ${refs('Engineering')}`
          }
        },
        {
          type: 'p',
          text: {
            en: `<strong>Explore the resources:</strong> ${refs('Parts', 'Engineering', 'Results')}`
          }
        },
        {
          type: 'h3',
          id: 'wetlab-validation',
          text: { en: 'From Successful Engineering to Functional Validation' }
        },
        {
          type: 'p',
          text: {
            en: 'Our experimental work addresses two specific questions: how can the native signaling regulation of yeast be reliably modified, and how can we determine whether precise engineering of the G-protein interface changes cellular signaling behavior?'
          }
        },
        {
          type: 'h4',
          id: 'wetlab-genediting',
          text: { en: 'Translating Gene Editing into Verifiable Phenotypes' }
        },
        {
          type: 'p',
          text: {
            en: 'Obtaining the target strain was not the endpoint of our work. During the editing of <i>FAR1</i> and <i>SST2</i>, our initial construction attempt failed to yield the desired strains, prompting us to revise our construction strategy. We ultimately confirmed the intended genetic modifications by sequencing. The resulting strains carried a 4-bp deletion in each target gene, providing clear sequence-level evidence for subsequent validation.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'More importantly, we combined genotype verification with growth and fluorescence characterization under α-factor induction. Comparing the wild-type, single-knockout, and double-knockout strains allowed us to determine whether the effects of gene deletion extended beyond the DNA level to cellular growth and reporter output. Our results showed that the double knockout altered the growth response to stimulation and produced higher reporter fluorescence under the tested conditions. These findings support the functional characterization of the engineered chassis beyond successful strain construction alone.'
          }
        },
        {
          type: 'h4',
          id: 'wetlab-construction',
          text: { en: 'Refining Construction Methods to Ensure Sequence Accuracy' }
        },
        {
          type: 'p',
          text: {
            en: 'Unlike the double-knockout strategy, <i>GPA1</i> engineering required precise replacement of five amino acids at the C-terminus of the protein. Our initial strategy, which combined Gibson Assembly with multiple rounds of PCR, resulted in sequence errors in the donor fragment. We subsequently adopted overlap-extension fusion PCR to reorganize the homology arms and selection cassette. This revised strategy yielded strains 12 and 17, whose target sequences were confirmed by sequencing. The modification replaced the native C-terminal pentapeptide KIGII with EYNLV, corresponding to the human Gαq C-terminal sequence.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The value of this work lies not only in obtaining the correctly modified strains, but also in documenting why the construction strategy was changed, how the alternative approach addressed the initial problem, and how the final sequence was verified. These details provide a practical reference for researchers undertaking precise genomic modifications in yeast, offering more transferable information than a positive PCR result alone.'
          }
        },
        {
          type: 'h4',
          id: 'wetlab-connecting',
          text: { en: 'Connecting Sequence Modifications to Cellular Behavior' }
        },
        {
          type: 'p',
          text: {
            en: 'Both engineering strategies required us to address a question beyond successful construction: did the modified cells exhibit the expected functional changes? For the double-knockout strategy, growth curves and fluorescence output were used to examine the relationship between signaling responses and cellular state. For <i>GPA1</i> humanization, we further investigated growth and morphological changes under α-factor induction.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The current results indicate that <i>GPA1</i>-humanized yeast exhibits altered phenotypes associated with native pheromone stimulation. However, these changes do not by themselves demonstrate that a heterologous GPCR has successfully coupled to the downstream yeast signaling pathway. In addition, the descriptions of fluorescence responses in different sections of our Wiki are inconsistent. The direction and magnitude of this response must therefore be determined by re-examining the original data before a definitive conclusion can be drawn. Distinguishing confirmed findings from observations that remain unresolved is an important part of the experimental knowledge we make available to future researchers.'
          }
        },
        {
          type: 'h3',
          id: 'wetlab-resources',
          text: { en: 'Reusable Design Resources for Yeast Signaling Chassis Engineering' }
        },
        {
          type: 'p',
          text: {
            en: 'We organized two core aspects of our yeast chassis engineering—native signaling regulation and G-protein input-interface reprogramming—into biological parts that can be independently accessed, adapted, combined, and further validated. These resources provide concrete sequence references and starting points for future yeast signaling engineering projects.'
          }
        },
        {
          type: 'h4',
          id: 'wetlab-strategy',
          text: { en: 'A Directly Accessible Genetic Engineering Strategy for Yeast' }
        },
        {
          type: 'p',
          text: {
            en: 'We submitted the <i>FAR1</i> and <i>SST2</i> sgRNA expression cassettes (BBa_26IKMSKO and BBa_26YVX4QT, respectively), together with their corresponding repair templates (BBa_26HN2W3G and BBa_262SR0ED), to the iGEM Registry. Each repair template incorporates a 4-bp deletion and a PAM-site modification designed to disrupt the target gene and reduce the likelihood of repeated recognition by the same sgRNA following editing.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'These parts provide sequence-level design references for researchers seeking to modify cell-cycle responses or negative regulation of G-protein signaling in yeast. By consulting the published sequences and construct information, users can assess their suitability after checking the target locus, PAM sequence, and homology regions in their own strain, rather than designing the entire editing system from scratch.'
          }
        },
        {
          type: 'h4',
          id: 'wetlab-starting',
          text: { en: 'A Sequence-Level Starting Point for Cross-Species Receptor Coupling' }
        },
        {
          type: 'p',
          text: {
            en: 'We submitted the <i>GPA1</i> C-terminal humanization cassette with a <i>URA3</i> selection marker (BBa_266K1VDV), as well as a basic part encoding the Gαq-derived pentapeptide EYNLV followed by a stop codon (BBa_26EG2LOR). The composite cassette contains upstream and downstream homology arms, the target replacement sequence, and the <i>URA3</i> selection module, providing a defined construct for targeted modification of the yeast <i>GPA1</i> locus.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The target sequences in strains 12 and 17 were verified, providing experimental evidence that the intended sequence replacement was achieved. For teams seeking to connect heterologous GPCRs to yeast signaling networks, this construct offers a concrete starting point for further design and comparison. Nevertheless, successful sequence replacement does not establish effective coupling of the human receptor to the yeast signaling pathway; downstream signal transmission must be validated independently.'
          }
        },
        {
          type: 'links',
          cls: 'link-list--section-end',
          items: [
            { href: '../wet-lab/protocol.html', en: 'More details on the Protocol page.' },
            { href: '../wet-lab/parts.html', en: 'More details on the Parts page.' }
          ]
        }
      ]
    },

    // ============ Model ============
    {
      id: 'contribution-model',
      section: true,
      title: { en: 'Model' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Computational from end to end, which makes it the part another team can run without a lab. Three outputs: a docking pipeline that narrows a candidate panel, an atomic-level account of how the gating peptides sit on their receptors, and the files that reproduce both.'
          }
        },
        {
          type: 'h3',
          id: 'model-screening',
          text: { en: 'Seventeen candidates, one lead' }
        },
        {
          type: 'p',
          text: {
            en: 'Screening a nanobody panel costs reagent and weeks. We replaced the first pass with two docking stages, a rigid ClusPro sweep over the whole panel and HADDOCK 2.5 semi-flexible refinement on what survived, and added a specificity index so that H1N1-selective binders separate from cross-reactive ones instead of everything ranking by docking score. Seventeen candidates became one lead, R1aB6, with no binding assay run.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'A team with a panel and no structures can repeat this on predicted models and order a shortlist instead of a library. The specificity index is the part worth taking, because without it the ranking collapses back into "best score wins", which is how cross-reactive binders get ordered. No binding assay has confirmed the ranking.'
          }
        },
        {
          type: 'h3',
          id: 'model-gating',
          text: { en: 'Both gating interfaces' }
        },
        {
          type: 'p',
          text: {
            en: 'An inhibitory-peptide gate only works if blocking the outside leaves the inside intact. We tested that on both systems: hM1Dq with the MT1 peptide and STE2P with MT1_5, each membrane-aligned before docking, refined in HADDOCK, then run through CHARMM-GUI membrane building, 100 ns GROMACS dynamics, SPICE interface analysis and gmx_MMPBSA. Both come out the same way, with the peptide in the orthosteric site and the intracellular G-protein interface left free.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'That is a check on an assumption, not a demonstration of gating in cells, and it is written as the former. The workflow is the reusable part: it transfers to any receptor and peptide pair, including ones with no experimental structure.'
          }
        },
        {
          type: 'h3',
          id: 'model-hotspot',
          text: { en: 'One hotspot, one hypothesis' }
        },
        {
          type: 'p',
          text: {
            en: 'One number did most of the work here. Per-residue decomposition of the R1aB6–HA complex puts ARG-B:31 at −5.46 kcal/mol, well clear of its neighbours, which turns into a single experiment: make R31A and measure it by SPR or ELISA.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'That is what a model is good for, choosing the next experiment rather than illustrating the last one. A team with a docked complex and no assay capacity can run the same decomposition and come out with one residue to mutate, which is far cheaper than scanning an interface. The mutation is designed and the measurement is planned; neither has been run.'
          }
        },
        {
          type: 'h3',
          id: 'model-reproducibility',
          text: { en: 'The pipeline as files' }
        },
        {
          type: 'p',
          text: {
            en: 'A pipeline published without its inputs is a figure, not a tool. HADDOCK and ClusPro inputs, parameter files and analysis scripts are kept with the work, and the 9VH4 complex is re-docked through the same pipeline as a positive control so the numbers have something to sit against.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The docking results also became an interactive card game, which is the form we use when the audience is not a modelling audience. Both are on the Model page; the game runs there rather than as a download.'
          }
        },
        {
          type: 'links',
          cls: 'link-list--section-end',
          items: [
            { href: '../dry-lab/model.html', en: 'More details on the Model page.' }
          ]
        }
      ]
    },

    // ============ Human Practices（三级目录） ============
    {
      id: 'contribution-hp',
      section: true,
      title: { en: 'Human Practices Contributions' },
      blocks: [
        {
          type: 'p',
          text: {
            en: '<em>Preface to Influenza A in the Air.</em> After our social practice, we recognised that many important questions about influenza A virus in the air — how it is transmitted, how long it can persist in air and on surfaces, how environmental conditions affect it, and what different detection signals can actually establish — draw on several fields and are dispersed across the literature. We therefore read the relevant studies and organised what we learned into this <i>Influenza A in the Air</i> contribution, bringing together the evidence, key data, study conditions and references needed to examine these questions. The document does not present new experimental findings; it structures existing research into a continuous, accessible and traceable resource that can help readers develop an overall understanding of airborne transmission, environmental persistence, detection and control of influenza A. In this way, it provides a reference for learning, discussion and project development, reduces duplicated searching, and makes the material available for further use, checking and improvement within the iGEM community.'
          }
        },
        {
          type: 'pdf',
          url: 'static/pdf/contribution/influenza-a-in-the-air-contribution.pdf',
          label: 'Influenza A in the Air — a knowledge base on airborne transmission, detection and control, compiled as a contribution to the iGEM community',
          fallback: 'The Influenza A in the Air document is not available here yet.'
        },
        {
          type: 'h3',
          id: 'hp-apic',
          text: { en: 'The discussion format: APiC question cards' }
        },
        {
          type: 'p',
          text: {
            en: 'Our Human Practices work produced a second, less obvious contribution: a format for peer discussion. At the APiC project exchange we replaced the usual sequence of project presentations with structured question cards built around iGEM award tracks. Each card directed discussion through five dimensions — value positioning, design rationale, analysis of previous projects, critical self-evaluation, and future optimisation — so that teams spent their time examining why a design was appropriate rather than describing what it aimed to do.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The format proved reusable because it does not depend on shared subject matter. Teams working on different biological questions can use the same cards, because the questions are about reasoning rather than about pathogens. The cards and the process are documented so that future organisers can adapt them to other award tracks, exchange events and review sessions.'
          }
        },
        {
          type: 'links',
          items: [
            { href: '../human-practices/integrated human-practices.html#section-apic', en: 'Related resource: Human Practices — APiC Conference' }
          ]
        },
        {
          type: 'h3',
          id: 'hp-yeast-workshop',
          text: { en: 'The workshop record: making experimental experience shareable' }
        },
        {
          type: 'p',
          text: {
            en: 'The third contribution came out of an online yeast workshop that brought together CAU-China, NEFU-China, SZPU-China, Keystone, NKU and SHSID. The discussion covered transformation efficiency, gene knockout, selection stability, reporter leakage, membrane-protein expression and localisation, product formats and biosafety. Much of what made it useful was not the methods themselves but the troubleshooting attached to them: which failure modes were recognised, which controls distinguished them, and what remained unresolved.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Two lessons from that discussion are recorded in the workshop write-up. The first is a methodological caution: a mutation at a target site does not by itself establish that Cas9 cleavage caused it, so controls and independent genotype verification are needed before a knockout is claimed. The second is that methods shared by other teams should be preserved with their attribution — CAU-China\'s combination of fluorescently tagged receptors, FM4-64 membrane staining and confocal microscopy, and the alginate microsphere and freeze-dried colour-card formats discussed by Keystone and NKU, are recorded as theirs. None of the methods discussed originated with us; the value of the record lies in the exchange itself and in keeping each method attached to the team that described it.'
          }
        },
        {
          type: 'links',
          items: [
            { href: '../human-practices/integrated human-practices.html#expert-yeast-online', en: 'Related resource: Human Practices — Online Yeast Workshop' }
          ]
        },
        {
          type: 'h3',
          id: 'hp-sharing-lessons',
          text: { en: 'What we learned about sharing knowledge' }
        },
        {
          type: 'p',
          text: {
            en: 'Three things became clear across these activities. Structured questions produce better exchanges than presentations, because they force specificity. Documented troubleshooting is more valuable than documented success, because most teams fail in similar ways. And a contribution is strongest when it preserves attribution, because that is what allows the next team to build on it rather than repeat it.'
          }
        },

      ]
    }
  ]
};