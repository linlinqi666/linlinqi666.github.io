/**
 * Contribution 页面双语内容源（中文 + 英文）
 *
 * 结构说明：
 * - nav：左侧目录，每项含 id / zh / en，可带 children
 * - cards：正文卡片，每项含 id / title / summary / blocks
 *   blocks 支持四种类型：
 *     p      单段落（可带 cls）
 *     fields 字段列表（label + value 双语）
 *     links  页内索引链接
 *     table  表格（heading + head + rows，单元格支持 HTML 如 <code>）
 *
 * 术语保持一致：待填 = To fill，待补 = To obtain，待核 = To verify。
 * 英文段落由 .i18n-en 包裹，search-index-generator.js 会排除该类，避免双语内容重复进索引。
 */

const L = {
  type: { zh: '类型', en: 'Type' },
  what: { zh: '是什么', en: 'What it is' },
  why: { zh: '为什么对后续队伍有用', en: 'Why it is useful to later teams' },
  how: { zh: '后续队伍怎么用', en: 'How later teams use it' },
  get: { zh: '怎么拿到', en: 'How to obtain it' },
  evidence: { zh: '证据', en: 'Evidence' },
  attribution: { zh: '归属与来源', en: 'Attribution and source' },
  progress: { zh: '进度', en: 'Progress' },
  fact: { zh: 'factStatus', en: 'factStatus' },
  verify: { zh: '核验', en: 'Verification' }
};

const V = {
  pending: { zh: '待定', en: 'Pending' },
  secondary: { zh: 'secondary-source-only', en: 'secondary-source-only' },
  toVerifyPerson: { zh: '【待补：核验人 + 核验日期】', en: '【To obtain: verifier + verification date】' },
  partCat1: { zh: '部件（官方示例第 1 类）', en: 'Part (iGEM example category 1)' },
  protoCat3: { zh: '协议（官方示例第 3 类）', en: 'Protocol (iGEM example category 3)' },
  otherCat4: { zh: '其他贡献（官方示例第 4 类）', en: 'Other contribution (iGEM example category 4)' }
};

// 关键参数表头（协议卡片复用）
const paramHead = [
  { zh: '参数', en: 'Parameter' },
  { zh: '取值', en: 'Value' }
];

module.exports = {
  nav: [
    { id: 'contribution-overview', zh: 'Contribution 概览', en: 'Contribution Overview' },
    {
      id: 'parts-overview',
      zh: '1. 部件（Parts）',
      en: '1. Parts',
      children: [
        { id: 'parts-p1', zh: 'P1 PAGER 融合受体', en: 'P1 PAGER fusion receptor' },
        { id: 'parts-p2', zh: 'P2 人源化 Gpa1 变体', en: 'P2 Humanised Gpa1 variant' },
        { id: 'parts-p3', zh: 'P3 FUS1 报告盒', en: 'P3 FUS1 reporter cassettes' },
        { id: 'parts-p4', zh: 'P4 三靶点 sgRNA', en: 'P4 sgRNAs for three targets' },
        { id: 'parts-p5', zh: 'P5 三敲底盘菌株', en: 'P5 Triple-knockout chassis strain' }
      ]
    },
    {
      id: 'protocols-overview',
      zh: '2. 协议与方法',
      en: '2. Protocols and Methods',
      children: [
        { id: 'protocols-t1', zh: 'T1 大肠杆菌热激转化', en: 'T1 E. coli heat-shock transformation' },
        { id: 'protocols-t2', zh: 'T2 质粒提取', en: 'T2 Plasmid extraction' },
        { id: 'protocols-t3', zh: 'T3 双酶切验证', en: 'T3 Double-digestion verification' },
        { id: 'protocols-t4', zh: 'T4 酵母 LiAc/PEG 转化', en: 'T4 Yeast LiAc/PEG transformation' },
        { id: 'protocols-t5', zh: 'T5 CRISPR-Cas9 三基因敲除', en: 'T5 CRISPR-Cas9 triple knockout' },
        { id: 'protocols-t6', zh: 'T6 Gpa1 同源重组整合', en: 'T6 Gpa1 integration by homologous recombination' },
        { id: 'protocols-t7', zh: 'T7 总蛋白提取与 WB', en: 'T7 Total protein extraction and WB' },
        { id: 'protocols-t8', zh: 'T8 DCZ 诱导与检测', en: 'T8 DCZ induction and detection' }
      ]
    },
    {
      id: 'other-overview',
      zh: '3. 其他贡献',
      en: '3. Other contributions',
      children: [
        { id: 'other-o1', zh: 'O1 底盘改造设计说明', en: 'O1 Chassis engineering design notes' },
        { id: 'other-o2', zh: 'O2 酶切排错经验', en: 'O2 Digestion troubleshooting notes' },
        { id: 'other-o3', zh: 'O3 三组对照设置方案', en: 'O3 Three-control setup' },
        { id: 'other-o4', zh: 'O4 质粒构建与验证记录', en: 'O4 Plasmid construction and verification record' }
      ]
    },
    { id: 'access-license', zh: '获取与许可', en: 'Access and License' },
    { id: 'attribution', zh: '归属与致谢', en: 'Attribution' }
  ],

  cards: [
    // ============ 概览 ============
    {
      id: 'contribution-overview',
      title: { zh: 'Contribution 概览', en: 'Contribution Overview' },
      summary: {
        zh: '本页记录 PAGER-Yeast 项目向 iGEM 社区公开的可复用成果，按部件、协议与方法、其他贡献归置，并给出获取方式、来源归属与当前的验证状态。',
        en: 'This page records the reusable outputs that the PAGER-Yeast project is making public to the iGEM community, organised into parts, protocols and methods, and other contributions, together with how to obtain each item, its attribution and its current verification status.'
      },
      blocks: [
        {
          type: 'p',
          cls: 'content-intro',
          text: {
            zh: 'iGEM 的很多元件、方案与经验来自往届队伍的公开分享，本项目在设计与实验中也使用了公开的元件与协议。把可复用的部分整理在本页，供后续队伍直接取用，或在上面继续改动。',
            en: 'Much of iGEM parts, protocols and experience comes from previous teams sharing their work openly, and this project also used public parts and protocols during design and experiments. The reusable parts are collected here so that later teams can use them directly or keep modifying them.'
          }
        },
        {
          type: 'p',
          text: {
            zh: '本页按官方 Contribution 页的两条要求组织：一是记录贡献，二是说明它对同行有什么用。每条贡献都回答四个问题：是什么、为什么对后续队伍有用、后续队伍怎么用、怎么拿到。官方给出的四类示例中，本队目前有部件与协议两类，另有若干设计与排错记录；本队暂无自研软件、工具与硬件产出，相应章节不设，避免留下空节。',
            en: 'This page follows the two requirements of the official Contribution page: document the contribution, and explain why it is a contribution to fellow iGEMers. Every item answers four questions: what it is, why it is useful to later teams, how later teams use it, and how to obtain it. Of the four example categories given by iGEM, this team currently has parts and protocols, plus several design and troubleshooting records. The team has no in-house software, tool or hardware output, so those sections are omitted rather than left empty.'
          }
        },
        {
          type: 'p',
          text: {
            zh: '各条目的完成度不同。已经完成并有记录的标为 <code>secondary-source-only</code>，尚未验证或尚未执行的标为「待定」。团队尚未提供的数据，统一用 <code>【待填：…】</code>、<code>【待补：…】</code>、<code>【待核：…】</code> 标出，待补齐后回填。',
            en: 'Items differ in how complete they are. Completed work with records is marked <code>secondary-source-only</code>; work not yet verified or not yet carried out is marked &ldquo;Pending&rdquo;. Data the team has not supplied is marked with <code>【To fill: …】</code>, <code>【To obtain: …】</code> or <code>【To verify: …】</code>, to be filled in later.'
          }
        },
        {
          type: 'ul',
          items: [
            {
              label: { zh: '部件', en: 'Parts' },
              text: {
                zh: 'PAGER 膜表面融合受体全长复合部件及其子元件、人源化 Gpa1 变体、FUS1 报告盒、三个靶点的 sgRNA、三敲底盘菌株。',
                en: 'The full PAGER surface fusion receptor composite part and its sub-components, the humanised Gpa1 variant, FUS1 reporter cassettes, sgRNAs for three targets, and the triple-knockout chassis strain.'
              }
            },
            {
              label: { zh: '协议与方法', en: 'Protocols and methods' },
              text: {
                zh: '本类主推已完成的三项，即大肠杆菌热激转化、质粒提取与双酶切验证；另有五项实验方案待完成后补齐参数。',
                en: 'The three completed procedures highlighted here, namely E. coli heat-shock transformation, plasmid extraction and double-digestion verification, plus five experimental protocols whose parameters will be added once the work is done.'
              }
            },
            {
              label: { zh: '其他贡献', en: 'Other contributions' },
              text: {
                zh: '底盘改造与人源化 Gpa1 的设计说明、酶切排错经验、三组对照设置方案、质粒构建与验证记录。',
                en: 'Design notes for chassis engineering and Gpa1 humanisation, troubleshooting notes for a failed digestion, the three-control setup, and the plasmid construction and verification record.'
              }
            }
          ]
        }
      ]
    },

    // ============ 1. 部件 ============
    {
      id: 'parts-overview',
      title: { zh: '1. 部件（Parts）', en: '1. Parts' },
      summary: {
        zh: '本类为本队拟提交至 iGEM Registry 的元件，以及可供后续队伍复用的底盘改造靶点。',
        en: 'Parts the team intends to submit to the iGEM Registry, plus chassis engineering targets that later teams can reuse.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '<strong>本类主推：</strong>P1 PAGER 膜表面融合受体全长复合部件。它已完成基因合成与全序列测序，是复现本队识别模块时最完整的一份材料。',
            en: '<strong>Highlight of this section:</strong> P1, the full PAGER surface fusion receptor composite part. Gene synthesis and full sequencing are complete, so it is the most complete material available for reproducing this team recognition module.'
          }
        },
        {
          type: 'p',
          text: {
            zh: '以下每条按统一字段列出。尚未获得 Registry 编号与链接的条目先留占位符，待团队登记后回填。第三方来源的序列已在归属栏注明，公开提交前需确认授权。',
            en: 'Every item below uses the same set of fields. Items without a Registry number and link yet are left with placeholders until the team registers them. Sequences obtained from third parties are noted in the attribution field and require permission checks before public submission.'
          }
        },
        {
          type: 'links',
          items: [
            { href: '#parts-p1', zh: 'P1 PAGER 膜表面融合受体全长复合部件', en: 'P1 Full PAGER surface fusion receptor composite part' },
            { href: '#parts-p2', zh: 'P2 人源化 Gpa1 变体（C 端 KIGII→EYNLV）', en: 'P2 Humanised Gpa1 variant (C-terminus KIGII to EYNLV)' },
            { href: '#parts-p3', zh: 'P3 FUS1-yEGFP 与 FUS1-lacZ 报告盒', en: 'P3 FUS1-yEGFP and FUS1-lacZ reporter cassettes' },
            { href: '#parts-p4', zh: 'P4 STE2 / FAR1 / Sst2 靶向 sgRNA', en: 'P4 sgRNAs targeting STE2 / FAR1 / Sst2' },
            { href: '#parts-p5', zh: 'P5 三敲底盘菌株 BY4741 Δste2 Δfar1 Δsst2', en: 'P5 Triple-knockout chassis strain BY4741 Δste2 Δfar1 Δsst2' }
          ]
        }
      ]
    },

    // ---- P1 ----
    {
      id: 'parts-p1',
      title: { zh: 'P1 PAGER 膜表面融合受体全长复合部件', en: 'P1 Full PAGER surface fusion receptor composite part' },
      summary: {
        zh: '一段编码膜表面融合受体的完整设计，由信号肽、连接肽、抑制域、纳米抗体、蛋白酶切位点与受体依次连接，用于在酵母细胞膜表面展示抗原识别单元。',
        en: 'A complete design encoding a surface fusion receptor, consisting of a signal peptide, linkers, an inhibitory domain, a nanobody, a protease cleavage site and a receptor joined in sequence, intended to display the antigen-recognition unit on the yeast cell surface.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.partCat1 },
            {
              label: L.what,
              value: {
                zh: 'α-factor-(GGGS)₃-MT1-(GGGS)₃-anti-HA-TEVcs-hM1Dq 的全长融合蛋白表达盒。无抗原时 MT1 抑制域维持对 hM1Dq 的抑制，抗原与纳米抗体结合后解除该抑制，属于设计机制，本项目中尚未验证。',
                en: 'The full-length fusion protein expression cassette α-factor-(GGGS)₃-MT1-(GGGS)₃-anti-HA-TEVcs-hM1Dq. Without antigen the MT1 inhibitory domain is designed to keep hM1Dq suppressed, with the suppression released once antigen binds the nanobody. This is a design mechanism and has not been verified in this project.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要搭建抗原门控的酵母受体系统，可直接取用这条完整设计及其子元件，省去从零组合功能域与反复设计连接肽的工作。',
                en: 'Teams building an antigen-gated yeast receptor system can take this complete design and its sub-components directly, rather than assembling the functional domains from scratch and iterating on linker design.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节子元件表依次克隆到目标载体；若要更换识别对象，替换其中的纳米抗体编码区即可，替换后需自行验证各功能域仍能正确折叠。【待核：替换识别域是否已在实验中验证可行】',
                en: 'Clone the parts into the target vector in the order given in the sub-component table below; to change the recognition target, replace the nanobody coding region and verify on your own that each domain still folds correctly. 【To verify: whether replacing the recognition domain has been shown to work in experiments】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待填：Registry 部件编号与链接】。编码该融合蛋白的质粒编号为 ABX63942，克隆骨架为 pGADT7，两端酶切位点为 5&#39;-NdeI 与 3&#39;-BamHI。',
                en: '【To fill: Registry part number and link】. The plasmid encoding this fusion protein is ABX63942, the cloning backbone is pGADT7, and the flanking restriction sites are 5&prime;-NdeI and 3&prime;-BamHI.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '已完成基因合成与全序列测序，记录显示序列与设计一致、未见突变。尚无功能表征，荧光响应与抗原响应均未验证。',
                en: 'Gene synthesis and full sequencing are complete; records show the sequence matches the design with no mutations observed. There is no functional characterisation yet, and neither the fluorescence response nor the antigen response has been verified.'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '融合蛋白由本队设计并组合；MT1、anti-H1N1_HA 纳米抗体与 TEVcs 为第三方来源序列，【待核：来源文献】，公开提交前需确认授权。',
                en: 'The fusion protein was designed and assembled by this team. MT1, the anti-H1N1_HA nanobody and TEVcs are third-party sequences, 【To verify: source references】, and permission must be confirmed before public submission.'
              }
            },
            { label: L.progress, value: { zh: '已完成基因合成与全测序', en: 'Gene synthesis and full sequencing complete' } },
            { label: L.fact, value: V.secondary },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '子元件', en: 'Sub-components' },
          head: [
            { zh: '子元件', en: 'Sub-component' },
            { zh: '作用', en: 'Function' },
            { zh: '序列', en: 'Sequence' },
            { zh: '来源与归属', en: 'Source and attribution' }
          ],
          rows: [
            [
              { zh: 'α-factor 信号肽', en: 'α-factor signal peptide' },
              { zh: '引导融合蛋白分泌并定位到酵母细胞膜', en: 'Directs secretion of the fusion protein and its localisation to the yeast cell membrane' },
              { zh: '<code>MRFPSIFTAVLFAASSALA</code>', en: '' },
              { zh: '【待核：来源文献】', en: '【To verify: source reference】' }
            ],
            [
              { zh: '(GGGS)₃ 连接肽', en: '(GGGS)₃ linker' },
              { zh: '分隔功能域，支持相对独立折叠', en: 'Separates functional domains so they fold relatively independently' },
              { zh: '人工柔性连接肽', en: 'Engineered flexible linker' },
              { zh: '本队设计', en: 'Designed by this team' }
            ],
            [
              { zh: 'MT1 抑制域', en: 'MT1 inhibitory domain' },
              { zh: '无抗原时抑制 hM1Dq，构成自抑制开关', en: 'Suppresses hM1Dq in the absence of antigen, forming the self-inhibition switch' },
              { zh: '<code>LTCVTSKSIFGITTENCPDGQNLCFKKWYYIVPRYSDITWGCAATCPKPTNVRETIRCCETD</code>', en: '' },
              { zh: '第三方序列，【待核：来源文献】', en: 'Third-party sequence, 【To verify: source reference】' }
            ],
            [
              { zh: 'anti-H1N1_HA 纳米抗体', en: 'anti-H1N1_HA nanobody' },
              { zh: '特异结合甲型流感病毒 HA 抗原，是识别单元', en: 'Binds influenza A virus HA antigen specifically and is the recognition unit' },
              { zh: '<code>QVQLVESGGGLVQPGGSLRLSCAASGSFFSRYRMGWYRQAPGEQRELVASIAYDGSTSYADPVKGRFTISRDNANTVHLQMYSLKPDDTAVYYCNLDPPGILYWGQGTQVTVSS</code>', en: '' },
              { zh: '第三方序列，【待核：来源文献】；公开提交前需确认授权', en: 'Third-party sequence, 【To verify: source reference】; permission must be confirmed before public submission' }
            ],
            [
              { zh: 'TEVcs 切点', en: 'TEVcs cleavage site' },
              { zh: '用于体外模拟抗原解锁的分子开关', en: 'Molecular switch used to mimic antigen unlocking in vitro' },
              { zh: '<code>ENLYFQS</code>', en: '' },
              { zh: '第三方序列，【待核：来源文献】', en: 'Third-party sequence, 【To verify: source reference】' }
            ],
            [
              { zh: 'hM1Dq 受体', en: 'hM1Dq receptor' },
              { zh: '接收上游状态并耦联下游 G 蛋白通路，可由 DCZ 激活', en: 'Receives the upstream state and couples to the downstream G-protein pathway; can be activated by DCZ' },
              { zh: '【待补：全长序列，向实验组取】', en: '【To obtain: full-length sequence, ask the wet-lab group】' },
              { zh: '第三方序列，【待核：来源文献】', en: 'Third-party sequence, 【To verify: source reference】' }
            ]
          ]
        },
        {
          type: 'p',
          text: {
            zh: '复现提示：该融合蛋白的密码子是否针对酿酒酵母做过优化【待核】；完整序列文件或 Registry 链接【待补：向实验组取】。',
            en: 'Reproduction notes: whether the codons were optimised for <em>Saccharomyces cerevisiae</em> 【To verify】; the full sequence file or Registry link 【To obtain: ask the wet-lab group】.'
          }
        }
      ]
    },

    // ---- P2 ----
    {
      id: 'parts-p2',
      title: { zh: 'P2 人源化 Gpa1 变体（C 端 KIGII→EYNLV）', en: 'P2 Humanised Gpa1 variant (C-terminus KIGII to EYNLV)' },
      summary: {
        zh: '把酵母 Gpa1 的 C 端最后 5 个氨基酸由 KIGII 替换为人源 Gαq 对应的 EYNLV，用于把 hM1Dq 的信号接到酵母 MAPK 通路上。',
        en: 'Replaces the last five residues of the yeast Gpa1 C-terminus, KIGII, with EYNLV from human Gαq, to couple the hM1Dq signal into the yeast MAPK pathway.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.partCat1 },
            {
              label: L.what,
              value: {
                zh: '对 Gpa1 的 C 端做定点替换（KIGII → EYNLV），使受体与酵母下游通路之间的信号接口对齐。Gpa1 是接口改造对象，不是敲除对象。',
                en: 'A targeted substitution at the Gpa1 C-terminus (KIGII to EYNLV) that aligns the signalling interface between the receptor and the yeast downstream pathway. Gpa1 is the interface being engineered, not a knockout target.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要在酵母中接入人源 GPCR 或 DREADD 受体，可直接参考这处 C 端替换的位点与序列，减少自行摸索接口序列的工作。',
                en: 'Teams wanting to connect a human GPCR or DREADD receptor in yeast can refer to this C-terminal substitution and sequence instead of searching for an interface sequence themselves.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '在自己的底盘上以同源重组方式替换 Gpa1 的 C 端序列，再验证下游报告是否被受体激活。【待核：该替换是否足以重建信号偶联】',
                en: 'Replace the Gpa1 C-terminal sequence in your own chassis by homologous recombination, then check whether the downstream reporter is activated by the receptor. 【To verify: whether this substitution alone is enough to rebuild signal coupling】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待填：Registry 编号与链接】；【待补：完整序列、载体与整合策略，向实验组取】。',
                en: '【To fill: Registry number and link】; 【To obtain: full sequence, vector and integration strategy, ask the wet-lab group】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚未验证。整合是否成功、通路是否被激活，目前都无实验数据。',
                en: 'Not yet verified. There are no experimental data on whether integration succeeded or whether the pathway is activated.'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '人源化位点参考人源 Gαq 序列，【待核：来源文献】。',
                en: 'The humanised site follows the human Gαq sequence, 【To verify: source reference】.'
              }
            },
            { label: L.progress, value: { zh: '待完成（依赖底盘敲除完成）', en: 'Not started (depends on the chassis knockouts being finished)' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ---- P3 ----
    {
      id: 'parts-p3',
      title: { zh: 'P3 FUS1-yEGFP 与 FUS1-lacZ 报告盒', en: 'P3 FUS1-yEGFP and FUS1-lacZ reporter cassettes' },
      summary: {
        zh: '以 FUS1 启动子驱动两种报告输出，绿色荧光用于定量，lacZ 用于显色判读，属于拟构建的报告体系。',
        en: 'Two reporter outputs driven by the FUS1 promoter: green fluorescence for quantification and lacZ for a visual colour readout. This reporter system is planned, not built.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.partCat1 },
            {
              label: L.what,
              value: {
                zh: '两个报告盒。FUS1-yEGFP 用流式细胞术读绿色荧光强度，FUS1-lacZ 用 X-Gal 显色做定性判读；骨架使用 pESC-HIS。【待核：FUS1 启动子序列与盒结构】',
                en: 'Two reporter cassettes. FUS1-yEGFP is read as green fluorescence intensity by flow cytometry; FUS1-lacZ is judged qualitatively by X-Gal staining. The backbone is pESC-HIS. 【To verify: FUS1 promoter sequence and cassette structure】'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要用酵母 G 蛋白通路做报告，可直接取用同一套启动子加报告基因的组合，同时得到定量与肉眼判读两种读出方式。',
                en: 'Teams using the yeast G-protein pathway for reporting can take this promoter-plus-reporter combination and get both a quantitative and a visual readout.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '把报告盒克隆到目标底盘，替换上游受体后即可复用同一读出方式；更换报告基因时注意保留 FUS1 启动子区域。【待核：启动子区域边界】',
                en: 'Clone the cassette into your chassis and reuse the same readout after swapping the upstream receptor; keep the FUS1 promoter region when changing the reporter gene. 【To verify: promoter region boundaries】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待填：Registry 编号与链接】；【待补：盒结构图与序列，向实验组取】。',
                en: '【To fill: Registry number and link】; 【To obtain: cassette map and sequence, ask the wet-lab group】.'
              }
            },
            { label: L.evidence, value: { zh: '尚未构建，无任何表征数据。', en: 'Not yet constructed; no characterisation data.' } },
            {
              label: L.attribution,
              value: {
                zh: 'FUS1 启动子与报告基因为公开元件，具体来源【待核】。',
                en: 'The FUS1 promoter and reporter genes are public parts; exact source 【To verify】.'
              }
            },
            { label: L.progress, value: { zh: '待构建', en: 'To be constructed' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ---- P4 ----
    {
      id: 'parts-p4',
      title: { zh: 'P4 STE2 / FAR1 / Sst2 靶向 sgRNA', en: 'P4 sgRNAs targeting STE2 / FAR1 / Sst2' },
      summary: {
        zh: '针对底盘改造三个靶点设计的 sgRNA，用于 CRISPR-Cas9 敲除；目前处于载体构建阶段。',
        en: 'sgRNAs designed against the three chassis engineering targets, for CRISPR-Cas9 knockout. Currently at the vector construction stage.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.partCat1 },
            {
              label: L.what,
              value: {
                zh: '三条分别靶向 STE2、FAR1、Sst2 的 sgRNA，拟克隆至 pML104 骨架，用于对 BY4741 底盘做三基因敲除。STE2 敲除用于消除内源 α-factor 受体，FAR1 敲除用于解除交配信号诱导的细胞周期停滞，Sst2 敲除用于移除 G 蛋白负调节因子。',
                en: 'Three sgRNAs targeting STE2, FAR1 and Sst2 respectively, to be cloned into the pML104 backbone for triple knockout in the BY4741 chassis. The STE2 knockout is intended to remove the endogenous α-factor receptor, the FAR1 knockout to release the mating-signal-induced cell-cycle arrest, and the Sst2 knockout to remove the G-protein negative regulator.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要改造同一底盘，可直接取用这三条靶向序列，省去重新设计 sgRNA 与筛选靶点的工作。',
                en: 'Teams engineering the same chassis can use these three targeting sequences directly instead of redesigning sgRNAs and screening targets.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '把 sgRNA 克隆进自己的 CRISPR 载体，按靶点分别验证切割效率后再做多基因敲除。【待核：是否可同时使用三条 sgRNA】',
                en: 'Clone the sgRNAs into your own CRISPR vector, verify the cutting efficiency of each target separately, then move on to multiplex knockout. 【To verify: whether all three sgRNAs can be used simultaneously】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待填：Registry 编号与链接】；【待补：sgRNA 序列与靶点位置，向实验组取】。',
                en: '【To fill: Registry number and link】; 【To obtain: sgRNA sequences and target positions, ask the wet-lab group】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚无切割效率数据与敲除验证结果。归档记录显示首次酶切失败，正在重建 sgRNA 载体。',
                en: 'No cutting-efficiency data and no knockout verification yet. Archived records show the first digestion failed and the sgRNA vector is being rebuilt.'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: 'sgRNA 由本队设计，靶点序列来自酿酒酵母 BY4741 基因组，【待核：序列与坐标】。',
                en: 'The sgRNAs were designed by this team; the target sequences come from the <em>Saccharomyces cerevisiae</em> BY4741 genome, 【To verify: sequences and coordinates】.'
              }
            },
            { label: L.progress, value: { zh: '进行中', en: 'In progress' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ---- P5 ----
    {
      id: 'parts-p5',
      title: { zh: 'P5 三敲底盘菌株 BY4741 Δste2 Δfar1 Δsst2', en: 'P5 Triple-knockout chassis strain BY4741 Δste2 Δfar1 Δsst2' },
      summary: {
        zh: '在 BY4741 上依次敲除 STE2、FAR1 与 Sst2 得到的底盘菌株，拟用于降低内源信号干扰；敲除是否完成尚在验证。',
        en: 'A chassis strain obtained by knocking out STE2, FAR1 and Sst2 in BY4741, intended to reduce endogenous signal interference. Whether the knockouts are complete is still being verified.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            {
              label: L.type,
              value: {
                zh: '部件或底盘资源（官方示例第 1 类或第 4 类）【待核：Registry 是否接收菌株】',
                en: 'Part or chassis resource (iGEM example category 1 or 4) 【To verify: whether the Registry accepts strains】'
              }
            },
            {
              label: L.what,
              value: {
                zh: '对野生型 BY4741 做三个基因的敲除。STE2 敲除用于消除内源 α-factor 受体，FAR1 敲除用于解除交配信号诱导的细胞周期停滞，Sst2 敲除用于移除 G 蛋白负调节因子。这些改动是设计意图，本项目尚未完成验证，也未证明它们必然改善任何性能指标。',
                en: 'Knockout of three genes in wild-type BY4741. The STE2 knockout is intended to remove the endogenous α-factor receptor, the FAR1 knockout to release the mating-signal-induced cell-cycle arrest, and the Sst2 knockout to remove the G-protein negative regulator. These changes are design intentions; this project has not finished verifying them and has not shown that they necessarily improve any performance metric.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要在酵母里使用外源受体，可参考这三处改造靶点，把内源交配通路的干扰先降下来。',
                en: 'Teams wanting to use a heterologous receptor in yeast can refer to these three engineering targets to reduce interference from the endogenous mating pathway first.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '以本页 P4 的 sgRNA 做敲除，用菌落 PCR 与测序逐步验证每个位点；获得双敲或三敲菌株后再评估是否需要全部三处改动。【待核：逐位点验证引物与条件】',
                en: 'Knock out using the sgRNAs in P4 above and verify each locus step by step with colony PCR and sequencing; once double or triple knockouts are obtained, reassess whether all three changes are needed. 【To verify: primers and conditions for per-locus verification】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待填：菌株保藏方式与获取条件】；【待补：敲除验证结果】。',
                en: '【To fill: strain deposit method and access conditions】; 【To obtain: knockout verification results】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚无敲除验证结果，菌株是否获得三敲未确认。',
                en: 'No knockout verification results yet; it is not confirmed that the strain carries all three knockouts.'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '底盘为 BY4741，敲除靶点由本队确定。',
                en: 'The chassis is BY4741; the knockout targets were chosen by this team.'
              }
            },
            { label: L.progress, value: { zh: '进行中', en: 'In progress' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ============ 2. 协议与方法 ============
    {
      id: 'protocols-overview',
      title: { zh: '2. 协议与方法（Protocols &amp; Methods）', en: '2. Protocols and Methods' },
      summary: {
        zh: '本类为已走通或有方案记录的实验流程，按完成度列出；未完成的部分只写拟采用的做法，不写成结果。',
        en: 'Experimental procedures that either worked or have a recorded protocol, listed by how complete they are. Work not yet done is written as a plan, not as a result.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '<strong>本类主推：</strong>T1 至 T3。这三步是目前参数最完整、有实际记录的一串流程，从质粒导入大肠杆菌到双酶切判读，后续队伍可以照此复现并自行核对。',
            en: '<strong>Highlight of this section:</strong> T1 to T3. These three steps have the most complete parameters and real records of anything so far, running from plasmid introduction into E. coli to double-digestion readout, so later teams can reproduce them and check their own results.'
          }
        },
        {
          type: 'links',
          items: [
            { href: '#protocols-t1', zh: 'T1 PAGER 质粒的大肠杆菌热激转化', en: 'T1 Heat-shock transformation of the PAGER plasmid into E. coli' },
            { href: '#protocols-t2', zh: 'T2 质粒提取', en: 'T2 Plasmid extraction' },
            { href: '#protocols-t3', zh: 'T3 双酶切验证', en: 'T3 Double-digestion verification' },
            { href: '#protocols-t4', zh: 'T4 酵母 LiAc/PEG 化学转化（拟采用）', en: 'T4 LiAc/PEG chemical transformation of yeast (planned)' },
            { href: '#protocols-t5', zh: 'T5 CRISPR-Cas9 三基因敲除与验证（进行中）', en: 'T5 CRISPR-Cas9 triple knockout and verification (in progress)' },
            { href: '#protocols-t6', zh: 'T6 Gpa1 同源重组定点整合（拟采用）', en: 'T6 Site-directed integration of Gpa1 by homologous recombination (planned)' },
            { href: '#protocols-t7', zh: 'T7 酵母总蛋白提取与 WB（拟采用）', en: 'T7 Yeast total protein extraction and Western blot (planned)' },
            { href: '#protocols-t8', zh: 'T8 DCZ 诱导与信号检测（拟采用）', en: 'T8 DCZ induction and signal detection (planned)' }
          ]
        }
      ]
    },

    // ---- T1 ----
    {
      id: 'protocols-t1',
      title: { zh: 'T1 PAGER 质粒的大肠杆菌热激转化', en: 'T1 Heat-shock transformation of the PAGER plasmid into E. coli' },
      summary: {
        zh: '把 PAGER 质粒导入大肠杆菌 Top10，用于后续扩增与验证；本步已完成并得到阳性克隆。',
        en: 'Introduction of the PAGER plasmid into E. coli Top10 for later amplification and verification. This step is complete and yielded positive clones.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '常规热激转化流程，感受态为 Top10，抗性筛选用 Amp 100 μg/mL，用于把 PAGER 质粒导入大肠杆菌扩增。',
                en: 'A standard heat-shock transformation using Top10 competent cells with selection on Amp 100 μg/mL, used to introduce the PAGER plasmid into E. coli for amplification.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍可直接照此条件把同类质粒导入大肠杆菌完成扩增，省去自行确定抗性与感受态条件的工作。',
                en: 'Teams can follow these conditions to introduce a similar plasmid into E. coli and amplify it, without working out the antibiotic and competent-cell conditions themselves.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节「关键参数」表的条件执行热激，挑取单菌落做菌落 PCR 或提质粒确认；结果与本节记录一致即视为可用。',
                en: 'Carry out the heat shock under the conditions in the key parameters table below, pick single colonies and confirm by colony PCR or miniprep; results matching the record here mean the step worked.'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：完整协议文件或页面链接，向实验组取】；本页给出关键参数。',
                en: '【To obtain: full protocol file or page link, ask the wet-lab group】; key parameters are given here.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '已完成并得到阳性克隆。【待补：感受态批号、转化效率、重复数】',
                en: 'Complete, with positive clones obtained. 【To obtain: competent cell lot, transformation efficiency, number of replicates】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '常规分子克隆方法，本队按实验室流程执行。',
                en: 'Standard molecular cloning method, carried out by this team following lab procedures.'
              }
            },
            { label: L.progress, value: { zh: '已完成', en: 'Complete' } },
            { label: L.fact, value: V.secondary },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '感受态菌株', en: 'Competent strain' }, { zh: 'Top10', en: '' }],
            [{ zh: '抗性筛选', en: 'Selection' }, { zh: 'Amp 100 μg/mL', en: '' }],
            [{ zh: '热激条件', en: 'Heat-shock conditions' }, { zh: '【待补：温度与时间，向实验组取】', en: '【To obtain: temperature and duration, ask the wet-lab group】' }],
            [{ zh: '恢复培养', en: 'Recovery culture' }, { zh: '【待补：培养基与时长】', en: '【To obtain: medium and duration】' }],
            [{ zh: '重复数', en: 'Replicates' }, { zh: '【待补：重复数】', en: '【To obtain: number of replicates】' }]
          ]
        }
      ]
    },

    // ---- T2 ----
    {
      id: 'protocols-t2',
      title: { zh: 'T2 质粒提取', en: 'T2 Plasmid extraction' },
      summary: {
        zh: '从大肠杆菌中提取 PAGER 质粒，用于酶切验证与后续酵母转化；本步已完成并留下浓度与纯度记录。',
        en: 'Extraction of the PAGER plasmid from E. coli for digestion checks and later yeast transformation. This step is complete and concentration and purity were recorded.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '常规质粒小提流程，使用试剂盒 TIANGEN DP103，以 65 ℃ 的 EB 洗脱。',
                en: 'A standard miniprep using the TIANGEN DP103 kit with elution in EB at 65 ℃.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍可按同一试剂盒与洗脱条件提取质粒，并对照本节记录的浓度与纯度范围判断提取是否正常。',
                en: 'Teams can use the same kit and elution conditions and compare their concentration and purity with the range recorded here.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节「关键参数」表执行，取 1 至 2 μL 测浓度与 A260/A280，落在常见可用区间即可进入酶切验证。',
                en: 'Follow the key parameters table below, measure concentration and A260/A280 on 1 to 2 μL, and proceed to digestion once the values fall in the usual usable range.'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：完整协议文件或页面链接】；本页给出关键参数与结果。',
                en: '【To obtain: full protocol file or page link】; key parameters and results are given here.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '4 个克隆的浓度记录为 408.45 / 404.85 / 297.15 / 355.90 ng/μL，A260/A280 记录为 1.9。【待补：洗脱体积、是否二次洗脱、重复数】',
                en: 'Concentrations were recorded for four clones as 408.45 / 404.85 / 297.15 / 355.90 ng/μL, with A260/A280 recorded as 1.9. 【To obtain: elution volume, whether a second elution was done, number of replicates】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '试剂盒厂商标准流程，本队按说明执行。',
                en: 'Standard kit protocol from the manufacturer, followed by this team.'
              }
            },
            { label: L.progress, value: { zh: '已完成', en: 'Complete' } },
            { label: L.fact, value: V.secondary },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '提取试剂盒', en: 'Extraction kit' }, { zh: 'TIANGEN DP103', en: '' }],
            [{ zh: '洗脱条件', en: 'Elution conditions' }, { zh: '65 ℃ EB 洗脱', en: 'EB elution at 65 ℃' }],
            [{ zh: '洗脱体积', en: 'Elution volume' }, { zh: '【待补：洗脱体积】', en: '【To obtain: elution volume】' }],
            [{ zh: '重复数', en: 'Replicates' }, { zh: '【待补：重复数】', en: '【To obtain: number of replicates】' }]
          ]
        }
      ]
    },

    // ---- T3 ----
    {
      id: 'protocols-t3',
      title: { zh: 'T3 双酶切验证', en: 'T3 Double-digestion verification' },
      summary: {
        zh: '用 NdeI-HF 与 BamHI-HF 对提取的质粒做双酶切，经琼脂糖凝胶确认骨架与插入片段大小；本步已完成，条带与理论值一致。',
        en: 'Double digestion of the extracted plasmid with NdeI-HF and BamHI-HF, with agarose gel confirmation of the backbone and insert sizes. This step is complete and the bands match the expected sizes.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '50 μL 双酶切体系，37 ℃ 反应 1 h，随后用 0.8% 琼脂糖凝胶在 80 V 下电泳 70 min 判读条带。',
                en: 'A 50 μL double-digestion reaction incubated at 37 ℃ for 1 h, followed by electrophoresis on a 0.8% agarose gel at 80 V for 70 min to read the bands.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍可用同一对酶与电泳条件快速确认同类质粒是否构建正确，直接对照本节记录的理论条带判断结果。',
                en: 'Teams can use the same enzyme pair and electrophoresis conditions to confirm quickly whether a similar plasmid was built correctly, comparing directly against the expected bands recorded here.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节「关键参数」表配置反应，跑胶后与 DNA Marker 比对；骨架与插入片段大小与理论一致即可进入下一步。',
                en: 'Set up the reaction as in the key parameters table below, run the gel and compare with a DNA marker; once the backbone and insert sizes match expectations, move on to the next step.'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：完整协议文件或页面链接】；本页给出关键参数与结果。',
                en: '【To obtain: full protocol file or page link】; key parameters and results are given here.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '骨架 7939 bp 与插入片段 2063 bp，与理论值一致。【待补：酶切体系完整配方、凝胶原图】',
                en: 'The 7939 bp backbone and 2063 bp insert match the expected sizes. 【To obtain: complete digestion reaction recipe, original gel image】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '常规酶切与电泳方法，本队按实验室流程执行。',
                en: 'Standard digestion and electrophoresis methods, carried out by this team following lab procedures.'
              }
            },
            { label: L.progress, value: { zh: '已完成', en: 'Complete' } },
            { label: L.fact, value: V.secondary },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '限制酶', en: 'Restriction enzymes' }, { zh: 'NdeI-HF / BamHI-HF', en: '' }],
            [{ zh: '反应体系', en: 'Reaction volume' }, { zh: '50 μL', en: '' }],
            [{ zh: '酶切条件', en: 'Digestion conditions' }, { zh: '37 ℃，1 h', en: '37 ℃ for 1 h' }],
            [{ zh: '凝胶与电泳', en: 'Gel and electrophoresis' }, { zh: '0.8% 琼脂糖，80 V，70 min', en: '0.8% agarose, 80 V, 70 min' }],
            [{ zh: '重复数', en: 'Replicates' }, { zh: '【待补：重复数】', en: '【To obtain: number of replicates】' }]
          ]
        }
      ]
    },

    // ---- T4 ----
    {
      id: 'protocols-t4',
      title: { zh: 'T4 酵母 LiAc/PEG 化学转化', en: 'T4 LiAc/PEG chemical transformation of yeast' },
      summary: {
        zh: '把 PAGER 质粒导入酵母底盘，是后续蛋白表达与功能测试的前置步骤；目前方案已定，尚未验证。',
        en: 'Introduction of the PAGER plasmid into the yeast chassis, a prerequisite for later protein expression and functional tests. The protocol is decided but not yet verified.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '拟采用 LiAc/PEG 化学转化把质粒导入酵母，配合营养缺陷平板筛选转化子。',
                en: 'LiAc/PEG chemical transformation is planned to introduce the plasmid into yeast, with transformants selected on drop-out plates.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍可参考本队的转化与筛选思路，用于把外源质粒导入酿酒酵母。',
                en: 'Teams can follow this team approach to transformation and selection when introducing a foreign plasmid into <em>Saccharomyces cerevisiae</em>.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节参数完成转化并在筛选平板上挑取单菌落，再做菌落 PCR 确认。【待核：各步参数】',
                en: 'Carry out transformation under the parameters below, pick single colonies on selection plates, then confirm by colony PCR. 【To verify: parameters for each step】'
              }
            },
            {
              label: L.get,
              value: { zh: '【待补：完整协议，向实验组取】。', en: '【To obtain: full protocol, ask the wet-lab group】.' }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚未验证。【待补：PEG 浓度、热激时间、恢复培养、转化效率】',
                en: 'Not yet verified. 【To obtain: PEG concentration, heat-shock duration, recovery culture, transformation efficiency】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '常规酵母转化方法，本队按实验室流程执行。',
                en: 'Standard yeast transformation method, carried out by this team following lab procedures.'
              }
            },
            { label: L.progress, value: { zh: '待验证', en: 'To be verified' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '转化方法', en: 'Transformation method' }, { zh: 'LiAc/PEG 化学转化（拟采用）', en: 'LiAc/PEG chemical transformation (planned)' }],
            [{ zh: 'PEG 浓度', en: 'PEG concentration' }, { zh: '【待补】', en: '【To obtain】' }],
            [{ zh: '热激时间', en: 'Heat-shock duration' }, { zh: '【待补】', en: '【To obtain】' }],
            [{ zh: '筛选标记', en: 'Selection marker' }, { zh: '【待补：营养缺陷标记与平板】', en: '【To obtain: auxotrophic marker and plate】' }]
          ]
        }
      ]
    },

    // ---- T5 ----
    {
      id: 'protocols-t5',
      title: { zh: 'T5 CRISPR-Cas9 三基因敲除与验证', en: 'T5 CRISPR-Cas9 triple knockout and verification' },
      summary: {
        zh: '在底盘上敲除 STE2、FAR1 与 Sst2，并逐步验证每个位点；归档记录显示首次酶切失败后正在重建载体，尚未得到敲除菌株。',
        en: 'Knockout of STE2, FAR1 and Sst2 in the chassis with step-by-step verification at each locus. Archived records show the first digestion failed and the vector is being rebuilt; no knockout strain yet.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '以 P4 的三条 sgRNA 做 CRISPR-Cas9 敲除，敲除后用菌落 PCR 与 Sanger 测序逐步确认每个位点。STE2 敲除用于消除内源 α-factor 受体，FAR1 敲除用于解除交配信号诱导的细胞周期停滞，Sst2 敲除用于移除 G 蛋白负调节因子。',
                en: 'CRISPR-Cas9 knockout using the three sgRNAs from P4, with colony PCR and Sanger sequencing to confirm each locus step by step. The STE2 knockout is intended to remove the endogenous α-factor receptor, the FAR1 knockout to release the mating-signal-induced cell-cycle arrest, and the Sst2 knockout to remove the G-protein negative regulator.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若改造同一底盘，可参考本队的靶点选择与验证顺序，并了解在载体构建阶段可能出现的问题。',
                en: 'Teams engineering the same chassis can follow this team target choice and verification order, and see what can go wrong during vector construction.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '先构建并验证单基因敲除，再逐步叠加，避免一次性做三基因敲除后难以定位失败位点。【待核：逐位点验证引物与条件】',
                en: 'Build and verify single knockouts first, then stack them, to avoid having to locate a failure after attempting all three at once. 【To verify: primers and conditions for per-locus verification】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：完整协议与排错记录，向实验组取】。',
                en: '【To obtain: full protocol and troubleshooting record, ask the wet-lab group】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '目前只有首次酶切失败的记录，敲除是否成功尚无结果。【待补：sgRNA 切割效率、菌落 PCR 与测序结果】',
                en: 'Only the first failed digestion is recorded so far; whether the knockout succeeded is unknown. 【To obtain: sgRNA cutting efficiency, colony PCR and sequencing results】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '方法参考 CRISPR-Cas9 酵母敲除的常规做法，【待核：具体参考来源】。',
                en: 'The method follows common practice for CRISPR-Cas9 knockout in yeast, 【To verify: specific source】.'
              }
            },
            { label: L.progress, value: { zh: '进行中', en: 'In progress' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '靶点', en: 'Targets' }, { zh: 'STE2 / FAR1 / Sst2', en: '' }],
            [{ zh: 'sgRNA 序列与靶点位置', en: 'sgRNA sequences and target positions' }, { zh: '【待补：向实验组取】', en: '【To obtain: ask the wet-lab group】' }],
            [{ zh: '切割效率', en: 'Cutting efficiency' }, { zh: '【待补：尚无数据】', en: '【To obtain: no data yet】' }],
            [{ zh: '验证方式', en: 'Verification method' }, { zh: '菌落 PCR 与 Sanger 测序【待补：引物】', en: 'Colony PCR and Sanger sequencing 【To obtain: primers】' }]
          ]
        }
      ]
    },

    // ---- T6 ----
    {
      id: 'protocols-t6',
      title: { zh: 'T6 Gpa1 同源重组定点整合', en: 'T6 Site-directed integration of Gpa1 by homologous recombination' },
      summary: {
        zh: '以同源重组把人源化 Gpa1 整合到基因组，是重建信号接口的关键一步；目前只有设计方案，尚未执行。',
        en: 'Integrating the humanised Gpa1 into the genome by homologous recombination, a key step in rebuilding the signalling interface. Only a design exists so far; not carried out.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '拟用 500 bp 上游同源臂与人源化 Gpa1 加 URA3 标记再加 500 bp 下游同源臂的构建方式，对 Gpa1 位点做定点替换。',
                en: 'The planned construct is a 500 bp upstream homology arm, the humanised Gpa1, a URA3 marker, and a 500 bp downstream homology arm, used for site-directed replacement at the Gpa1 locus.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要在酵母里替换 G 蛋白 C 端以接入人源受体，可参考这套同源臂与筛选标记的设计。',
                en: 'Teams replacing the G-protein C-terminus in yeast to connect a human receptor can refer to this homology arm and selection marker design.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节结构与参数构建供体片段，转化后在筛选平板上挑取转化子，再测序确认整合位点。【待核：同源臂序列与整合验证方法】',
                en: 'Build the donor fragment as described, transform, pick colonies on selection plates, then sequence to confirm the integration site. 【To verify: homology arm sequences and integration verification method】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：完整协议与质粒信息，向实验组取】。',
                en: '【To obtain: full protocol and plasmid information, ask the wet-lab group】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚未执行，无整合结果。【待补：同源臂序列、整合验证结果】',
                en: 'Not carried out; no integration results. 【To obtain: homology arm sequences, integration verification results】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '同源重组方法为本队按常规做法设计。',
                en: 'The homologous recombination approach was designed by this team following common practice.'
              }
            },
            { label: L.progress, value: { zh: '待完成', en: 'Not started' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '上游同源臂', en: 'Upstream homology arm' }, { zh: '500 bp（拟采用）', en: '500 bp (planned)' }],
            [{ zh: '下游同源臂', en: 'Downstream homology arm' }, { zh: '500 bp（拟采用）', en: '500 bp (planned)' }],
            [{ zh: '筛选标记', en: 'Selection marker' }, { zh: 'URA3', en: '' }],
            [{ zh: '整合验证', en: 'Integration verification' }, { zh: '【待补：验证方法与引物】', en: '【To obtain: method and primers】' }]
          ]
        }
      ]
    },

    // ---- T7 ----
    {
      id: 'protocols-t7',
      title: { zh: 'T7 酵母总蛋白提取与 Western Blot', en: 'T7 Yeast total protein extraction and Western blot' },
      summary: {
        zh: '用于确认 PAGER 融合蛋白在酵母中的表达，目前方案已定，尚未执行。',
        en: 'Used to confirm expression of the PAGER fusion protein in yeast. The protocol is decided but not yet carried out.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '拟从酵母中提取总蛋白，经 SDS-PAGE、转膜与封闭，再孵育一抗与二抗并显色，验证融合蛋白是否表达。',
                en: 'Total protein is to be extracted from yeast, separated by SDS-PAGE, transferred and blocked, then probed with primary and secondary antibodies and developed, to check whether the fusion protein is expressed.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍可参考本队的蛋白提取与杂交流程，用于确认膜表面受体在酵母中的表达情况。',
                en: 'Teams can follow this team protein extraction and blotting workflow to confirm expression of a surface receptor in yeast.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节参数完成提取与杂交，用对应分子量的条带判断融合蛋白是否表达。【待核：抗体与稀释比】',
                en: 'Carry out extraction and blotting under the parameters below and judge expression from the band at the expected molecular weight. 【To verify: antibodies and dilution ratios】'
              }
            },
            {
              label: L.get,
              value: { zh: '【待补：完整协议，向实验组取】。', en: '【To obtain: full protocol, ask the wet-lab group】.' }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚未执行，无显色结果。【待补：抗体货号、稀释比、膜与显色条件】',
                en: 'Not carried out; no development results. 【To obtain: antibody catalogue numbers, dilution ratios, membrane and development conditions】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '常规蛋白免疫印迹方法，本队按实验室流程执行。',
                en: 'Standard western blotting method, carried out by this team following lab procedures.'
              }
            },
            { label: L.progress, value: { zh: '待完成', en: 'Not started' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '一抗', en: 'Primary antibody' }, { zh: '【待补：抗体货号与稀释比】', en: '【To obtain: catalogue number and dilution ratio】' }],
            [{ zh: '二抗', en: 'Secondary antibody' }, { zh: '【待补：抗体货号与稀释比】', en: '【To obtain: catalogue number and dilution ratio】' }],
            [{ zh: '膜与显色条件', en: 'Membrane and development conditions' }, { zh: '【待补】', en: '【To obtain】' }]
          ]
        }
      ]
    },

    // ---- T8 ----
    {
      id: 'protocols-t8',
      title: { zh: 'T8 DCZ 诱导与信号检测', en: 'T8 DCZ induction and signal detection' },
      summary: {
        zh: '用 DCZ 激活 hM1Dq 并检测下游报告输出，是功能测试的核心步骤；目前只有方案，尚未执行。',
        en: 'Activating hM1Dq with DCZ and measuring the downstream reporter output, the core step of functional testing. Only a plan exists so far; not carried out.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.protoCat3 },
            {
              label: L.what,
              value: {
                zh: '拟设置 DCZ 诱导梯度，用流式细胞术读 yEGFP 绿色荧光，或用 X-Gal 染色判读 lacZ 表达。',
                en: 'A DCZ induction gradient is planned, reading yEGFP green fluorescence by flow cytometry or judging lacZ expression by X-Gal staining.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍若要测试类似受体门控系统，可参考本队对齐的两个读出方式，一套定量、一套显色判读。',
                en: 'Teams testing a similar receptor-gated system can follow these two aligned readouts, one quantitative and one visual.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本节参数设置诱导梯度，分别采集荧光与显色结果，并与对照比较。【待核：门限与判读标准】',
                en: 'Set up the induction gradient as below, collect fluorescence and staining results, and compare with controls. 【To verify: thresholds and judgement criteria】'
              }
            },
            {
              label: L.get,
              value: { zh: '【待补：完整协议，向实验组取】。', en: '【To obtain: full protocol, ask the wet-lab group】.' }
            },
            {
              label: L.evidence,
              value: {
                zh: '尚未执行，无荧光或显色结果。【待补：DCZ 梯度实际设置、流式门限、X-Gal 染色条件】',
                en: 'Not carried out; no fluorescence or staining results. 【To obtain: actual DCZ gradient settings, flow cytometry gating, X-Gal staining conditions】'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: 'DCZ 与检测方法参考公开资料，【待核：来源】。',
                en: 'DCZ and the detection methods follow public sources, 【To verify: source】.'
              }
            },
            { label: L.progress, value: { zh: '待完成', en: 'Not started' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        },
        {
          type: 'table',
          heading: { zh: '关键参数', en: 'Key parameters' },
          head: paramHead,
          rows: [
            [{ zh: '诱导剂', en: 'Inducer' }, { zh: 'DCZ', en: '' }],
            [{ zh: '拟设置梯度', en: 'Planned gradient' }, { zh: '10 nM/mL、100 nM/mL、1 μM/mL（归档方案记载，未执行）【待核：单位与最终设置】', en: '10 nM/mL, 100 nM/mL, 1 μM/mL (from the archived protocol, not carried out) 【To verify: units and final settings】' }],
            [{ zh: '荧光读出', en: 'Fluorescence readout' }, { zh: '流式细胞术读 yEGFP【待补：门限与采集参数】', en: 'yEGFP read by flow cytometry 【To obtain: gating and acquisition parameters】' }],
            [{ zh: '显色读出', en: 'Colour readout' }, { zh: 'X-Gal 染色判读 lacZ【待补：染色条件】', en: 'lacZ judged by X-Gal staining 【To obtain: staining conditions】' }]
          ]
        }
      ]
    },

    // ============ 3. 其他贡献 ============
    {
      id: 'other-overview',
      title: { zh: '3. 其他贡献（Other）', en: '3. Other contributions' },
      summary: {
        zh: '本类为记录、设计说明与排错经验，不属部件或协议，但对改造同类底盘的队伍有参考价值。',
        en: 'Records, design notes and troubleshooting experience. These are not parts or protocols, but are useful to teams engineering a similar chassis.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '以下条目按统一字段列出。尚未执行或尚未整理原始记录的部分，先留占位符。',
            en: 'The items below use the same set of fields. Work not yet carried out and raw records not yet organised are left with placeholders.'
          }
        },
        {
          type: 'links',
          items: [
            { href: '#other-o1', zh: 'O1 酵母底盘改造与人源化 Gpa1 设计说明', en: 'O1 Design notes for chassis engineering and Gpa1 humanisation' },
            { href: '#other-o2', zh: 'O2 质粒构建与酶切排错经验', en: 'O2 Plasmid construction and digestion troubleshooting notes' },
            { href: '#other-o3', zh: 'O3 三组对照设置方案', en: 'O3 Three-control setup' },
            { href: '#other-o4', zh: 'O4 质粒构建与双酶切验证记录', en: 'O4 Plasmid construction and double-digestion record' }
          ]
        }
      ]
    },

    // ---- O1 ----
    {
      id: 'other-o1',
      title: { zh: 'O1 酵母底盘改造与人源化 Gpa1 设计说明', en: 'O1 Design notes for chassis engineering and Gpa1 humanisation' },
      summary: {
        zh: '把底盘改造与人源化 Gpa1 的改造意图、靶点与位点整理成说明，方便后续队伍判断哪些改动与其项目相关。',
        en: 'The intent, targets and sites behind the chassis engineering and Gpa1 humanisation, written up so that later teams can judge which changes are relevant to their own project.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.otherCat4 },
            {
              label: L.what,
              value: {
                zh: '一份设计说明，覆盖 STE2、FAR1、Sst2 三个敲除靶点的用途，以及 Gpa1 C 端 KIGII 换成 EYNLV 的位点。以上均为设计意图，本项目尚未完成改造，也未验证相关性能变化。',
                en: 'A design note covering the purpose of the three knockout targets STE2, FAR1 and Sst2, and the Gpa1 C-terminal site where KIGII is replaced by EYNLV. All of this is design intent; this project has not completed the engineering and has not verified any associated change in performance.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍在改造酵母底盘前，可先看这份说明判断哪些改动与其目标一致，避免照搬不需要的敲除。',
                en: 'Before engineering a yeast chassis, teams can read this note to decide which changes fit their goal, and avoid copying knockouts they do not need.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按说明逐项确认自己的项目是否需要该改动，再决定敲除或替换哪些位点。【待核：各位点坐标与设计依据】',
                en: 'Go through the note item by item to decide which changes your project needs, then decide which loci to knock out or replace. 【To verify: coordinates and design basis for each site】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：说明文档与位点示意图】。',
                en: '【To obtain: design document and site diagram】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '设计已定，改造未完成，无实验数据。',
                en: 'Design fixed, engineering not finished, no experimental data.'
              }
            },
            {
              label: L.attribution,
              value: {
                zh: '本队设计；人源化位点参考人源 Gαq，【待核：来源文献】。',
                en: 'Designed by this team; the humanised site follows human Gαq, 【To verify: source reference】.'
              }
            },
            { label: L.progress, value: { zh: '设计已定，改造未完成', en: 'Design fixed, engineering not finished' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ---- O2 ----
    {
      id: 'other-o2',
      title: { zh: 'O2 质粒构建与酶切排错经验', en: 'O2 Plasmid construction and digestion troubleshooting notes' },
      summary: {
        zh: '记录一次酶切失败后排查与重做的过程，供后续队伍在遇到类似问题时对照。',
        en: 'A record of how one failed digestion was investigated and redone, for teams to compare against when they hit the same problem.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.otherCat4 },
            {
              label: L.what,
              value: {
                zh: '一次酶切失败的现象、当时的判断、采取的改动与改动后的结果。',
                en: 'The symptom of one failed digestion, the judgement made at the time, the changes applied, and the outcome.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '酶切失败是常见问题，后续队伍可对照本记录快速定位是模板、酶还是体系的问题，少走弯路。',
                en: 'Failed digestions are common; teams can use this record to locate quickly whether the problem lies with the template, the enzyme or the reaction setup.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按本记录的顺序逐项排查自己的酶切体系。【待核：排查清单与判断依据】',
                en: 'Work through your own digestion setup in the order given here. 【To verify: checklist and basis for each judgement】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：排错记录与原始现象描述】。',
                en: '【To obtain: troubleshooting record and original symptom description】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '【待补：现象、判断、改动与结果的原始记录】',
                en: '【To obtain: raw record of symptom, judgement, changes and outcome】'
              }
            },
            { label: L.attribution, value: { zh: '本队实验记录。', en: 'This team experimental record.' } },
            { label: L.progress, value: { zh: '进行中', en: 'In progress' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ---- O3 ----
    {
      id: 'other-o3',
      title: { zh: 'O3 三组对照设置方案', en: 'O3 Three-control setup' },
      summary: {
        zh: '给出功能测试时使用的三组对照设置，供后续队伍在测试同类系统时直接参考。',
        en: 'The three controls used during functional testing, for teams testing a similar system.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.otherCat4 },
            {
              label: L.what,
              value: {
                zh: '阴性对照为未转化的野生型 BY4741，空载体对照为空 pESC-HIS，阳性对照为已确认具有稳定通路激活的工程菌。该方案已定，尚未执行。',
                en: 'The negative control is untransformed wild-type BY4741, the empty-vector control is empty pESC-HIS, and the positive control is an engineered strain confirmed to show stable pathway activation. The setup is decided but not yet carried out.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '功能测试容易出现假阳性或背景偏高，后续队伍可照这套对照判断信号是否来自目标通路。',
                en: 'Functional tests easily give false positives or high background; these controls let teams judge whether a signal comes from the intended pathway.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '在同一批实验中并行设置三组对照，与样品一起读数后比较。【待核：各组具体构建方式】',
                en: 'Run all three controls alongside the samples in the same batch and compare readings. 【To verify: how each control is constructed】'
              }
            },
            {
              label: L.get,
              value: { zh: '【待补：对照设置说明】。', en: '【To obtain: control setup description】.' }
            },
            {
              label: L.evidence,
              value: {
                zh: '方案已定，未执行，无对照比较结果。',
                en: 'Setup decided, not carried out, no comparative results.'
              }
            },
            { label: L.attribution, value: { zh: '本队设计。', en: 'Designed by this team.' } },
            { label: L.progress, value: { zh: '方案已定，未执行', en: 'Setup decided, not carried out' } },
            { label: L.fact, value: V.pending },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ---- O4 ----
    {
      id: 'other-o4',
      title: { zh: 'O4 质粒构建与双酶切验证记录', en: 'O4 Plasmid construction and double-digestion record' },
      summary: {
        zh: '记录 PAGER 质粒构建后的双酶切结果，作为同类质粒是否构建正确的参照。',
        en: 'The double-digestion result after PAGER plasmid construction, as a reference for whether a similar plasmid was built correctly.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: L.type, value: V.otherCat4 },
            {
              label: L.what,
              value: {
                zh: '质粒构建完成后的双酶切验证记录，骨架 7939 bp，插入片段 2063 bp，均与理论值一致。',
                en: 'The double-digestion verification record after construction, with a 7939 bp backbone and a 2063 bp insert, both matching the expected sizes.'
              }
            },
            {
              label: L.why,
              value: {
                zh: '后续队伍构建或索取同一质粒时，可用这组条带大小确认质粒是否正确。',
                en: 'Teams constructing or requesting the same plasmid can use these band sizes to confirm it is correct.'
              }
            },
            {
              label: L.how,
              value: {
                zh: '按 T3 的条件做双酶切，将条带与本节记录比对。【待核：酶切图谱文件位置】',
                en: 'Digest under the conditions in T3 and compare the bands with the record here. 【To verify: location of the digestion map file】'
              }
            },
            {
              label: L.get,
              value: {
                zh: '【待补：凝胶原图与酶切图谱文件】。',
                en: '【To obtain: original gel image and digestion map file】.'
              }
            },
            {
              label: L.evidence,
              value: {
                zh: '骨架与插入片段大小与理论值一致。【待补：凝胶原图】',
                en: 'The backbone and insert sizes match the expected values. 【To obtain: original gel image】'
              }
            },
            { label: L.attribution, value: { zh: '本队实验记录。', en: 'This team experimental record.' } },
            { label: L.progress, value: { zh: '已完成', en: 'Complete' } },
            { label: L.fact, value: V.secondary },
            { label: L.verify, value: V.toVerifyPerson }
          ]
        }
      ]
    },

    // ============ 获取与许可 ============
    {
      id: 'access-license',
      title: { zh: '获取与许可（Access &amp; License）', en: 'Access and License' },
      summary: {
        zh: '汇总本页各成果的获取入口与许可说明，未确定的入口先留占位符。',
        en: 'Access points and licensing for everything on this page. Undecided access points are left as placeholders.'
      },
      blocks: [
        {
          type: 'ul',
          items: [
            {
              label: { zh: '部件', en: 'Parts' },
              text: {
                zh: '【待填：Registry 部件编号与链接】。登记完成后在此更新。',
                en: '【To fill: Registry part numbers and links】. This will be updated once registration is complete.'
              }
            },
            {
              label: { zh: '协议与记录', en: 'Protocols and records' },
              text: { zh: '【待补：下载或查阅入口】。', en: '【To obtain: download or view access】.' }
            },
            {
              label: { zh: '菌株', en: 'Strains' },
              text: { zh: '【待补：获取条件与保藏方式】。', en: '【To obtain: access conditions and deposit method】.' }
            },
            {
              label: { zh: '许可', en: 'License' },
              text: { zh: '【待填：本页及相关资源的 License】。', en: '【To fill: licence for this page and related resources】.' }
            },
            {
              label: { zh: '第三方序列', en: 'Third-party sequences' },
              text: {
                zh: 'MT1、anti-H1N1_HA 纳米抗体与 TEVcs 为第三方来源，公开提交前需确认授权，【待核：授权状态】。',
                en: 'MT1, the anti-H1N1_HA nanobody and TEVcs come from third parties; permission must be confirmed before public submission, 【To verify: permission status】.'
              }
            }
          ]
        }
      ]
    },

    // ============ 归属与致谢 ============
    {
      id: 'attribution',
      title: { zh: '归属与致谢（Attribution）', en: 'Attribution' },
      summary: {
        zh: '说明本页各成果的来源归属与致谢对象，区分本队原创与第三方来源。',
        en: 'Sources, attribution and acknowledgements for everything here, separating this team own work from third-party material.'
      },
      blocks: [
        {
          type: 'ul',
          items: [
            {
              label: { zh: '本队完成', en: 'Done by this team' },
              text: {
                zh: 'PAGER 融合蛋白的序列组合与合成、Gpa1 人源化位点的选择、三个靶点的 sgRNA 设计；以上归属栏均标注【待核】的部分有待与原始记录核对。',
                en: 'Assembling and synthesising the PAGER fusion protein sequence, choosing the Gpa1 humanisation site, and designing the sgRNAs for the three targets. Items marked 【To verify】 in the attribution fields still need checking against the original records.'
              }
            },
            {
              label: { zh: '第三方来源', en: 'Third-party material' },
              text: {
                zh: 'MT1、anti-H1N1_HA 纳米抗体、TEVcs 与 hM1Dq 为第三方序列，来源文献与授权状态【待核】。',
                en: 'MT1, the anti-H1N1_HA nanobody, TEVcs and hM1Dq are third-party sequences; source references and permission status 【To verify】.'
              }
            },
            {
              label: { zh: '公开资源与工具', en: 'Public resources and tools' },
              text: {
                zh: '【待补：本项目使用到的公开协议、软件或数据库及其出处】。',
                en: '【To obtain: public protocols, software or databases used in this project and their sources】.'
              }
            },
            {
              label: { zh: '联系与获取', en: 'Contact and access' },
              text: {
                zh: '【待补：团队联系人、资源索取方式】。',
                en: '【To obtain: team contact and how to request materials】.'
              }
            }
          ]
        }
      ]
    }
  ]
};
