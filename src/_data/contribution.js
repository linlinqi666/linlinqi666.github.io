// Contribution 页内容数据（中英双语源）
// 结构依据：static/expriments/The extreme/contribution/output/15-Contribution页面内容大纲.md
// 分章：概览 → 1 部件（4 条）→ 2 协议与方法（4 条）→ 3 其他贡献（3 条）→ 获取与许可 → 归属与致谢
// 每条贡献按「是什么 / 为什么对后续队伍有用 / 怎么拿到」三件套写，另附证据与归属来源。
// 内部备注：证据与归属里的待核项以源码注释保留，不渲染（2026-09-16 规则：状态与进度不渲染）。
// 版式约定：zh 在前为源文本，en 为对照译文；渲染顺序由模板决定（en 主视觉 / zh 辅助）。

module.exports = {
  nav: [
    { id: 'contribution-overview', zh: 'Contribution 概览', en: 'Contribution Overview' },
    {
      id: 'contribution-parts',
      zh: '1. 部件（Parts）',
      en: '1. Parts',
      children: [
        { id: 'parts-deltafar1', zh: 'Δfar1 底盘菌株', en: 'Δfar1 chassis strain' },
        { id: 'parts-pager', zh: 'PAGER 识别融合受体', en: 'PAGER recognition fusion receptor' },
        { id: 'parts-gpa1', zh: '人源化 Gpa1 接口工程菌', en: 'Humanised Gpa1 interface strain' },
        { id: 'parts-reporter', zh: 'FUS1 启动子报告盒', en: 'FUS1 promoter reporter cassette' }
      ]
    },
    {
      id: 'contribution-protocols',
      zh: '2. 协议与方法',
      en: '2. Protocols and Methods',
      children: [
        { id: 'protocol-crispr', zh: '酵母 CRISPR/Cas9 敲除流程', en: 'Yeast CRISPR/Cas9 knockout workflow' },
        { id: 'protocol-donor', zh: '长片段供体两条制备路线', en: 'Two routes for long linear donor fragments' },
        { id: 'protocol-readout', zh: 'α-factor 梯度三种读出', en: 'Three readouts under an α-factor gradient' },
        { id: 'protocol-pager', zh: 'PAGER 受体表达与功能验证流程', en: 'PAGER receptor expression and functional assay workflow' }
      ]
    },
    {
      id: 'contribution-others',
      zh: '3. 其他贡献',
      en: '3. Other Contributions',
      children: [
        { id: 'other-verification', zh: '验证纪律：菌落 PCR + 测序', en: 'Verification discipline: colony PCR plus sequencing' },
        { id: 'other-afactor', zh: 'α-factor 浓度体系提醒', en: 'Note on α-factor concentration systems' },
        { id: 'other-mispair', zh: '长片段 PCR 错配教训', en: 'Lesson on long-fragment PCR mispairing' }
      ]
    },
    { id: 'contribution-access', zh: '获取与许可', en: 'Access and Licence' },
    { id: 'contribution-attribution', zh: '归属与致谢', en: 'Attribution' }
  ],

  cards: [
    // ============ 概览 ============
    {
      id: 'contribution-overview',
      title: { zh: 'Contribution 概览', en: 'Contribution Overview' },
      summary: {
        zh: '我们做的是一个酵母底盘的抗原传感项目，过程中积累了可复用的底盘菌株、构建流程、验证记录与排错经验。本页按部件、协议与方法、其他三类列出，每条给「是什么、为什么对后续队伍有用、怎么拿到」。',
        en: 'This project builds an antigen-sensing yeast chassis, and along the way it produced reusable strains, construction workflows, verification records and troubleshooting notes. This page lists them under parts, protocols and methods, and other contributions, with what each item is, why it is useful to later teams, and how to obtain it.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '这些产出不只对本项目有意义，也能帮后续队伍少走弯路。页面里能直接拿走的三样：酵母里做 Gα 亚基 C 端人源化的两条路线对照（含被实测判否的那条）、菌落 PCR 判据必须以测序为准的教训、α-factor 梯度读出的三套浓度体系如何避免混用。',
            en: 'These outputs are meant to save later teams time. Three things can be taken directly: the side-by-side comparison of two routes for C-terminal humanisation of a yeast Gα subunit (including the one that measurement ruled out), the lesson that colony PCR is only a screening criterion with sequencing as the final word, and how to keep the three α-factor concentration systems from being mixed up.'
          }
        },
        {
          type: 'links',
          items: [
            { href: '#parts-deltafar1', zh: 'Δfar1 底盘菌株（FAR1 敲除，测序确认）', en: 'Δfar1 chassis strain (FAR1 knockout, sequencing-confirmed)' },
            { href: '#protocol-crispr', zh: '酵母 CRISPR/Cas9 敲除流程（参数齐全）', en: 'Yeast CRISPR/Cas9 knockout workflow (full parameters)' },
            { href: '#other-verification', zh: '验证纪律：菌落 PCR 初筛 + 测序确认', en: 'Verification discipline: colony PCR screening plus sequencing confirmation' }
          ]
        },
        {
          type: 'p',
          cls: 'content-intro',
          text: {
            zh: '本页只写本队实际做过的产出与对应记录；第三方来源的序列在归属栏单独注明，不写成自研；未完成的部分按计划表述，不写成已验证。',
            en: 'This page only covers outputs this team actually produced, together with the matching records. Third-party sequences are marked in the attribution field rather than presented as our own, and unfinished work is described as a plan, not as a verified result.'
          }
        }
      ]
    },

    // ============ 1. 部件（章导语） ============
    {
      id: 'contribution-parts',
      title: { zh: '1. 部件（Parts）', en: '1. Parts' },
      summary: {
        zh: '本队拟提交至 iGEM Registry 的元件，以及可供后续队伍复用的底盘改造产物。四条：Δfar1 底盘、PAGER 受体、人源化 Gpa1 工程菌、FUS1 报告盒。',
        en: 'Parts intended for submission to the iGEM Registry, plus chassis engineering outputs later teams can reuse. Four items: the Δfar1 chassis, the PAGER receptor, the humanised Gpa1 strain and the FUS1 reporter cassette.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '每条部件卡都回答同样三个问题：是什么、为什么对后续队伍有用、怎么拿到。第三方来源的序列在归属栏单独注明。',
            en: 'Every part entry answers the same three questions: what it is, why it is useful to later teams, and how to obtain it. Third-party sequences are marked separately in the attribution field.'
          }
        }
      ]
    },

    // ============ 1.1 Δfar1 底盘菌株 ============
    {
      id: 'parts-deltafar1',
      title: { zh: '1.1 Δfar1 底盘菌株（BY4741 背景）', en: '1.1 Δfar1 chassis strain (BY4741 background)' },
      summary: {
        zh: 'FAR1 被 CRISPR/Cas9 敲除的酿酒酵母底盘，经测序确认；不含 SST2 敲除。',
        en: 'A <i>Saccharomyces cerevisiae</i> chassis with FAR1 knocked out by CRISPR/Cas9 and confirmed by sequencing. It does not carry an SST2 knockout.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '部件', en: 'Part' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '酿酒酵母 BY4741 背景、FAR1 基因被 CRISPR/Cas9 敲除的工程底盘，基因型 <code>MATa his3Δ1 leu2Δ0 met15Δ0 ura3Δ0</code>。FAR1 敲除解除交配信号诱导的细胞周期阻滞，使细胞在监测状态下持续分裂。',
                en: 'An engineered chassis on a BY4741 background with FAR1 knocked out by CRISPR/Cas9, genotype <code>MATa his3Δ1 leu2Δ0 met15Δ0 ura3Δ0</code>. Removing FAR1 lifts the cell-cycle arrest induced by mating signal, so the cells keep dividing during monitoring.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '任何需要做酵母实时监测、不希望细胞被交配信号拖停的队伍，都可以直接拿这株底盘，省去自己设计 sgRNA、同源臂与验证克隆的功夫。',
                en: 'Any team that needs real-time monitoring in yeast and does not want its cells stopped by mating signal can take this chassis directly, instead of designing sgRNA, homology arms and verification clones from scratch.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '本页把它列为拟提交 iGEM Registry 的产出，编号与链接以登记结果为准；sgRNA、同源臂与验证参数见 Protocol 页底盘模块。',
                en: 'It is listed here as an output intended for submission to the iGEM Registry, with numbers and links to follow the registration outcome; sgRNA, homology arms and verification parameters are in the chassis module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: 'F2、F10 两克隆测序确认 4 bp 缺失（CACT → TGGT）造成移码。SST2 敲除十个克隆全部未成功，本株不含 SST2 敲除，不把未成功的部分算进本部件。',
                en: 'Clones F2 and F10 were sequenced and confirmed to carry a 4 bp deletion (CACT to TGGT) causing a frameshift. Ten SST2 knockout clones all failed, so this strain carries no SST2 knockout and that part is not counted into this item.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队构建；pML104（CRISPR/Cas9 骨架）来自 Addgene #67638。',
                en: 'Built by this team; the pML104 CRISPR/Cas9 backbone comes from Addgene #67638.'
              }
            }
          ]
        }
      ]
    },

    // ============ 1.2 PAGER 识别融合受体 ============
    {
      id: 'parts-pager',
      title: { zh: '1.2 PAGER 识别融合受体（pGADT7 载体）', en: '1.2 PAGER recognition fusion receptor (pGADT7 vector)' },
      summary: {
        zh: '克隆在 pGADT7 中的抗原门控融合受体；克隆与转化链路走通，蛋白与功能验证未完成。',
        en: 'An antigen-gated fusion receptor cloned in pGADT7. The cloning and transformation chain works; protein-level and functional verification are not finished.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '部件', en: 'Part' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '克隆在 pGADT7 中的 PAGER 融合受体，序列方向为 α-factor 信号肽 → (GGGS)₃ linker → MT1 抑制毒素 → (GGGS)₃ linker → anti-H1N1_HA 纳米抗体 → TEVcs → hM1Dq 人源 DREADD 受体。',
                en: 'A PAGER fusion receptor cloned in pGADT7, ordered as α-factor signal peptide → (GGGS)₃ linker → MT1 inhibitory toxin → (GGGS)₃ linker → anti-H1N1_HA nanobody → TEVcs → hM1Dq human DREADD receptor.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '提供了一套「抗原门控受体」的可装配骨架。后续队伍只要替换膜表面纳米抗体识别元件，就能改去识别别的抗原，不必从零设计融合结构与载体。',
                en: 'It provides an assemblable scaffold for an antigen-gated receptor. By swapping the surface nanobody recognition element, later teams can retarget it to a different antigen without designing the fusion architecture and vector from scratch.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '本页把它列为拟提交 iGEM Registry 的产出，编号与链接以登记结果为准；克隆与转化参数见 Protocol 页受体模块。',
                en: 'It is listed here as an output intended for submission to the iGEM Registry, with numbers and links to follow the registration outcome; cloning and transformation parameters are in the receptor module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '克隆与转化链路有 472 bp 一步克隆、689 bp 菌落 PCR 正确条带、酵母转化成功等记录。蛋白层（WB 在 60 kD 附近有条带、杂带较多）与 DCZ 功能验证（读板只有图片）尚未完成，因此「能否在酵母中稳定表达并输出信号」未完全验证，页面写明克隆验证完成、蛋白与功能验证未完成。',
                en: 'The cloning and transformation chain is backed by records: a 472 bp one-step cloning product, a correct 689 bp colony PCR band, and successful yeast transformation. The protein level (a band near 60 kD with many extra bands on WB) and the DCZ functional assay (plate readings available only as images) are not finished, so stable expression and signal output in yeast remain unverified; the page states that cloning is verified while protein and function are not.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: 'MT1 抑制毒素与 anti-H1N1_HA 纳米抗体为第三方序列，来源与授权状态需在提交 Registry 前确认，不写成自研；hM1Dq 为人源 DREADD 受体。',
                en: 'The MT1 inhibitory toxin and the anti-H1N1_HA nanobody are third-party sequences; their provenance and permission status must be confirmed before Registry submission and they are not presented as our own. hM1Dq is a human DREADD receptor.'
              }
            }
          ]
        }
      ]
    },

    // ============ 1.3 人源化 Gpa1 接口工程菌 ============
    {
      id: 'parts-gpa1',
      title: { zh: '1.3 人源化 Gpa1 接口工程菌（12 号 / 17 号）', en: '1.3 Humanised Gpa1 interface strain (clone 12 and 17)' },
      summary: {
        zh: 'GPA1 基因 C 端 5 个氨基酸人源化（KIGII → EYNLV）的工程菌，两株测序与设计序列完全一致。',
        en: 'An engineered strain with the last five residues of the GPA1 C-terminus humanised (KIGII to EYNLV); two clones match the designed sequence exactly.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '部件', en: 'Part' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: 'GPA1 基因 C 端 5 个氨基酸替换为人源序列（KIGII → EYNLV）并引入终止密码子的工程菌，筛选标记 URA3。12 号与 17 号两株测序与设计序列完全一致。',
                en: 'An engineered strain in which the last five residues of GPA1 are replaced with the human sequence (KIGII to EYNLV) followed by a stop codon, selected with URA3. Clones 12 and 17 match the designed sequence exactly.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '给出一条在酵母里做 Gα 亚基 C 端人源化、接通人源 GPCR 与酵母 MAPK 通路的可用菌株与制备路线（多片段融合 PCR），避开了「用质粒 PCR 制备长供体片段」累积错配的坑。',
                en: 'It gives later teams a usable strain and a preparation route (multi-fragment fusion PCR) for C-terminal humanisation of a yeast Gα subunit to link a human GPCR to the yeast MAPK pathway, avoiding the mispairing trap of preparing long donor fragments by plasmid PCR.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '本页把它列为拟提交 iGEM Registry 的产出，编号与链接以登记结果为准；融合 PCR 引物与验证参数见 Protocol 页接口模块。',
                en: 'It is listed here as an output intended for submission to the iGEM Registry, with numbers and links to follow the registration outcome; fusion PCR primers and verification parameters are in the interface module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '12 号、17 号测序一致；表型三层（形态 / 生长 / 荧光）方向一致，显示改造后 α-factor 响应减弱。路线二的最终结论以实验组确认为准，本页不写成已验证通路耦联。<!-- GC-1 菌株口径 / GC-10 方案二结论待核 -->',
                en: 'Clones 12 and 17 match the design; three phenotypic layers (morphology, growth, fluorescence) point the same way, showing a weakened α-factor response after the edit. The final conclusion of route two is subject to confirmation by the lab team, and this page does not claim a verified pathway coupling.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队构建；pRS426 为实验室常规载体。',
                en: 'Built by this team; pRS426 is a routine laboratory vector.'
              }
            }
          ]
        }
      ]
    },

    // ============ 1.4 FUS1 启动子报告盒 ============
    {
      id: 'parts-reporter',
      title: { zh: '1.4 FUS1 启动子报告盒（pESC-HIS / MEL1 / yEGFP）', en: '1.4 FUS1 promoter reporter cassette (pESC-HIS / MEL1 / yEGFP)' },
      summary: {
        zh: '以 FUS1 启动子驱动报告基因的酵母报告盒，两套读出并行；方案就绪，表征未完成。',
        en: 'A yeast reporter cassette driving reporters from the FUS1 promoter, with two parallel readouts. The plans are ready; characterisation is not finished.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '部件', en: 'Part' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '以 FUS1 启动子驱动报告基因的酵母报告盒，pESC-HIS 载体（HIS3 标记，两端 40 bp 同源臂），两套读出：MEL1 + X-α-gal 蓝白斑显色，以及 yEGFP + 酶标仪荧光。',
                en: 'A yeast reporter cassette driving reporters from the FUS1 promoter, on a pESC-HIS backbone (HIS3 marker, 40 bp homology arms at both ends), with two readouts: MEL1 with X-α-gal blue-white colouring, and yEGFP read on a plate reader.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '提供一套「G 蛋白响应型启动子 → 报告基因」的即用骨架。后续队伍可以替换报告基因、改浓度梯度，快速搭起自己的诱导读出。',
                en: 'It provides a ready scaffold from a G-protein-responsive promoter to a reporter gene. Later teams can swap the reporter or change the gradient to build their own induction readout quickly.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '本页把它列为拟提交 iGEM Registry 的产出，编号与链接以登记结果为准；六份方案与参数见 Protocol 页报告模块。',
                en: 'It is listed here as an output intended for submission to the iGEM Registry, with numbers and links to follow the registration outcome; the six plans and their parameters are in the reporter module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '目前只有六份实验方案与预期结果，尚无实测数据；方案 01 含 PRE1 / PRE2 位点突变建库设计，用两轮筛选挑低泄露、可诱导的突变体。本页写明方案就绪、表征未完成，不把预期写成已验证。<!-- RC-12 -->',
                en: 'So far there are six experimental plans with expected results and no measured data. Plan 01 includes a PRE1 / PRE2 site-directed mutation library screened in two rounds for low-leakage, inducible mutants. The page states that the plans are ready and characterisation is unfinished, and does not present expectations as verified results.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队设计；两套读出体系（MEL1 + X-α-gal，与团队既有文档的 lacZ + X-Gal / ONPG）并存，引用时须注明是哪一套。<!-- RC-2 -->',
                en: 'Designed by this team. Two readout systems coexist (MEL1 with X-α-gal here, and lacZ with X-Gal / ONPG in earlier team documents); when citing, state which one is meant.'
              }
            }
          ]
        }
      ]
    },

    // ============ 2. 协议与方法（章导语） ============
    {
      id: 'contribution-protocols',
      title: { zh: '2. 协议与方法（Protocols & Methods）', en: '2. Protocols and Methods' },
      summary: {
        zh: '本队实际执行过、参数完整的四套流程：酵母 CRISPR/Cas9 敲除、长片段供体两条制备路线、α-factor 梯度三种读出、PAGER 受体表达与功能验证。',
        en: 'Four workflows actually carried out by this team with full parameters: yeast CRISPR/Cas9 knockout, the two routes for long donor fragments, three readouts under an α-factor gradient, and PAGER receptor expression and functional assays.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '每条协议卡写清分步参数、改动点与实测卡点；参数细节在 Protocol 页对应模块。',
            en: 'Each protocol entry gives stepwise parameters, modifications and measured bottlenecks; the parameter details sit in the matching modules of the Protocol page.'
          }
        }
      ]
    },

    // ============ 2.1 酵母 CRISPR/Cas9 敲除流程 ============
    {
      id: 'protocol-crispr',
      title: { zh: '2.1 酵母 CRISPR/Cas9 双基因敲除流程', en: '2.1 Yeast CRISPR/Cas9 knockout workflow' },
      summary: {
        zh: 'pML104 递送 sgRNA、配同源臂融合修复模板，在 BY4741 中敲除目标基因：菌落 PCR 初筛、测序确认。',
        en: 'pML104 delivers sgRNA together with a fusion homology-arm repair template to knock out target genes in BY4741: colony PCR for screening, sequencing for confirmation.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '协议', en: 'Protocol' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '用 pML104（URA3 标记）递送 sgRNA、配同源臂融合修复模板，在 BY4741 中敲除目标基因，经菌落 PCR 初筛、测序确认的全流程。含质粒提取、反向 PCR 构建 sgRNA、两轮融合 PCR 做修复模板、酵母感受态与转化、菌落 PCR、测序、α-factor 梯度功能验证的参数。',
                en: 'A complete workflow for knocking out target genes in BY4741 with pML104 (URA3 marker) delivering sgRNA plus a fusion homology-arm repair template, screened by colony PCR and confirmed by sequencing. It covers plasmid extraction, inverse PCR for sgRNA construction, two-round fusion PCR for the repair template, yeast competence and transformation, colony PCR, sequencing, and an α-factor gradient functional test, all with parameters.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '一套可以直接照做的酵母基因敲除 SOP：每一步的温度、时间、体积、浓度、循环数都写死了。它还把「菌落 PCR 无条带不等于一定敲除成功，必须以测序为准」写进流程，帮后续队伍少一次误判。',
                en: 'A yeast knockout SOP that can be followed as written: temperature, time, volume, concentration and cycle numbers are fixed at every step. It also builds in the rule that a missing colony PCR band does not prove a knockout and sequencing has the final word, which spares later teams a common misreading.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '完整协议与分步参数见 Protocol 页底盘模块；反向引物序列在源文档中缺失，引用前向本队索取。<!-- KQ-2 -->',
                en: 'The full protocol and stepwise parameters are in the chassis module of the Protocol page; the reverse primer sequences are missing from the source document and should be requested from this team before use.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: 'FAR1 敲除经测序确认成功，SST2 敲除十个克隆未成功。协议本身可复用，单基因结果不代表协议普适。',
                en: 'The FAR1 knockout was confirmed by sequencing while ten SST2 knockout clones failed. The protocol itself is reusable; a result at one locus does not make it universal.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队实验流程；pML104 来自 Addgene #67638。',
                en: 'This team workflow; pML104 comes from Addgene #67638.'
              }
            }
          ]
        }
      ]
    },

    // ============ 2.2 长片段供体两条制备路线 ============
    {
      id: 'protocol-donor',
      title: { zh: '2.2 长片段线性供体片段的两条制备路线对照', en: '2.2 Two routes for preparing a long linear donor fragment' },
      summary: {
        zh: '把 C 端人源化供体片段做出来的两种方案：pRS426 二次线性化，与多片段融合 PCR；附实测卡点与结论。',
        en: 'Two ways to build the C-terminal humanisation donor fragment: second-round linearisation of pRS426, and multi-fragment fusion PCR, with the measured bottlenecks and outcomes.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '协议', en: 'Protocol' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '把 C 端人源化供体片段做出来的两种方案：路线一先把重组环状质粒建出来再 PCR 释放片段，路线二用三段 PCR 产物靠末端重叠直接拼。附两条路线的优缺点、实测卡点与结论。',
                en: 'Two ways to build the C-terminal humanisation donor fragment: route one builds a recombinant circular plasmid first and then releases the fragment by PCR; route two joins three PCR products directly through terminal overlaps. Pros, cons, measured bottlenecks and outcomes are included for both.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '长片段（超过 2 kb）供体在酵母同源重组里很常见，两条路线的坑都写清楚了：路线一的多轮长片段 PCR 会累积错配，构建完成后需要多对引物做全长测序；否则转化容易失败且难以定位原因。路线二流程短，但产物无法保藏、每次要重做。后续队伍按自己的片段长度与周期选路线时有据可依。',
                en: 'Long donors above 2 kb are common in yeast homologous recombination, and the pitfalls of both routes are written down. Route one accumulates mispairing over repeated long PCR runs and needs full-length sequencing with several primer pairs once assembled, otherwise transformation tends to fail without a clear cause. Route two is shorter but the product cannot be stored and must be rebuilt each time. Later teams can pick a route based on fragment length and timeline.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '路线对照与参数见 Protocol 页接口模块与 Results 页第三节；引物与切胶回收记录随实验记录归档。',
                en: 'The route comparison and parameters are in the interface module of the Protocol page and section three of the Results page; primers and gel extraction records are archived with the experimental records.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '路线一被测序判否，原文写「判定该质粒 PCR 扩增制备供体片段的策略可行性较差」，这是一手负面结论，照写不淡化；路线二拼成完整片段并转化酵母，得到 12 号、17 号两株测序一致的工程菌。',
                en: 'Route one was ruled out by sequencing: the original record judges the strategy of preparing the donor fragment by plasmid PCR as of poor feasibility, and that negative conclusion is reported as written. Route two produced the full fragment, was transformed into yeast, and gave clones 12 and 17 with matching sequences.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队实验方案；pRS426 为实验室常规载体。',
                en: 'This team protocol; pRS426 is a routine laboratory vector.'
              }
            }
          ]
        }
      ]
    },

    // ============ 2.3 α-factor 梯度三种读出 ============
    {
      id: 'protocol-readout',
      title: { zh: '2.3 α-factor 梯度诱导的三种读出协议', en: '2.3 Three readouts under an α-factor gradient' },
      summary: {
        zh: '同一浓度梯度下的三套并行读出：MEL1 + X-α-gal 显色、yEGFP 荧光、OD₆₀₀ 生长曲线。',
        en: 'Three parallel readouts under one concentration gradient: MEL1 with X-α-gal colouring, yEGFP fluorescence, and OD₆₀₀ growth curves.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '协议', en: 'Protocol' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '同一 α-factor 八档浓度梯度下三套并行读出：MEL1 + X-α-gal 蓝白斑显色动态（8 h 每小时观察）、yEGFP 荧光（黑色 96 孔板、488 nm 激发 / 507 nm 发射、以荧光值 / OD₆₀₀ 归一化，连续 16 h）、OD₆₀₀ 生长曲线（8 h，看诱导剂是否抑制生长）。',
                en: 'Three parallel readouts under one eight-step α-factor gradient: MEL1 with X-α-gal blue-white colouring followed hourly for 8 h, yEGFP fluorescence on black 96-well plates (488 nm excitation, 507 nm emission, normalised to OD₆₀₀, hourly for 16 h), and OD₆₀₀ growth curves over 8 h to see whether the inducer suppresses growth.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '给了一套「诱导剂梯度 + 多读出」的模板。读板与显色的时间点、重复方式、对照设置都写好了，后续队伍可以直接套到自己的诱导系统上：先用显色看有没有，再用荧光看多少，最后用生长曲线判断诱导剂本身的影响。',
                en: 'It is a template for inducer-gradient plus multi-readout experiments. Time points, replication and control set-ups for both the colour assay and the plate readings are specified, so later teams can port it to their own inducible system: colour first for presence, fluorescence for magnitude, and growth curves to judge the effect of the inducer itself.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '三份方案与分步参数见 Protocol 页报告模块。',
                en: 'The three plans and stepwise parameters are in the reporter module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '方案层面完整。有四处引用时必须一并注明：α-factor 浓度单位与常规有效浓度相差 10³–10⁴ 倍，数值核实前不引用；两套读出体系（MEL1 与 lacZ）不是同一读出，不得互换；方案 01、02、03 未给重复数；方案 04 的空白组定义与其他方案不同。<!-- RC-1 / RC-2 / RC-4 / RC-9 / RC-10 -->',
                en: 'The plans are complete at the design level. Four caveats must travel with them: the stated α-factor concentrations differ from typical effective levels by 10³ to 10⁴ fold, so the numbers should not be cited until checked; the two readout systems (MEL1 and lacZ) are not interchangeable; plans 01, 02 and 03 give no replicate numbers; and the blank definition in plan 04 differs from the others.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队撰写的六份实验方案；读出体系的两套口径见 1.4 的归属说明。',
                en: 'Six experimental plans written by this team; the two readout conventions are described in the attribution of item 1.4.'
              }
            }
          ]
        }
      ]
    },

    // ============ 2.4 PAGER 受体表达与功能验证流程 ============
    {
      id: 'protocol-pager',
      title: { zh: '2.4 PAGER 受体克隆、表达与功能验证流程', en: '2.4 PAGER receptor cloning, expression and functional assay workflow' },
      summary: {
        zh: '从大肠杆菌转化到 DCZ 功能读板的完整链路，含各步温度、时间、酶量与破壁条件。',
        en: 'The full chain from E. coli transformation to DCZ plate-reader assays, with temperatures, times, enzyme amounts and cell-wall digestion conditions.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '协议', en: 'Protocol' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: 'PAGER 受体从 pGADT7 大肠杆菌转化、质粒提取、双酶切、酵母转化、酵母质粒抽提、菌落 PCR、WB、免疫荧光到 DCZ 功能验证（酶标仪读板）的完整链路，含各步温度、时间、酶量与破壁条件。',
                en: 'The complete chain for the PAGER receptor: transformation into E. coli from pGADT7, plasmid extraction, double digestion, yeast transformation, yeast plasmid preparation, colony PCR, WB, immunofluorescence, and the DCZ functional assay read on a plate reader, with temperatures, times, enzyme amounts and cell-wall digestion conditions at each step.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '一条「膜受体在酵母里表达并做功能读出」的 SOP。破壁（蜗牛酶、融壁酶）与 DCZ 工作浓度梯度（25 / 50 / 100 / 250 / 500 / 1000 nM）都给了具体值，后续队伍可以少踩表达与检测的坑。',
                en: 'An SOP for expressing a membrane receptor in yeast and reading its function. Cell-wall digestion (snailase, lyticase) and the DCZ working gradient (25 / 50 / 100 / 250 / 500 / 1000 nM) are given as concrete values, so later teams can avoid common expression and detection pitfalls.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '完整流程与参数见 Protocol 页受体模块。',
                en: 'The full workflow and parameters are in the receptor module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '克隆链走通（472 bp 一步克隆到酵母转化成功）；WB 分子量不符、免疫荧光阴性、读板结果仅以图片存在——这三条都是真实结果，写进流程的经验部分。另有酵母质粒提取 A260/280 异常、4 月 29 日染菌后处理未记录等缺口一并注明。<!-- SQ-6 / SQ-7 / SQ-10 / SQ-13 -->',
                en: 'The cloning chain works (from the 472 bp one-step product to successful yeast transformation). The WB molecular weight mismatch, the negative immunofluorescence and the image-only plate readings are all reported as they happened, in the lessons part of the workflow. Two further gaps are noted: abnormal A260/280 values from yeast plasmid preparations, and no record of how the April 29 contamination was handled afterwards.'
              }
            },
            {
              label: { zh: '归属与来源', en: 'Attribution' },
              value: {
                zh: '本队实验方案；pGADT7 来自 Sangon Biotech ZB56914；抗体清单见 Protocol 页受体模块材料表。',
                en: 'This team protocol; pGADT7 comes from Sangon Biotech ZB56914; the antibody list is in the materials table of the receptor module on the Protocol page.'
              }
            }
          ]
        }
      ]
    },

    // ============ 3. 其他贡献（章导语） ============
    {
      id: 'contribution-others',
      title: { zh: '3. 其他贡献（Other）', en: '3. Other Contributions' },
      summary: {
        zh: '三条不带实物的产出：验证纪律、α-factor 浓度体系提醒、长片段 PCR 错配教训。它们来自本队走过的弯路，写成条目供后续队伍直接参考。',
        en: 'Three contributions that are not physical outputs: the verification discipline, the note on α-factor concentration systems, and the lesson on long-fragment PCR mispairing. Each comes from a detour this team took and is written up for later teams.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            zh: '这一章只写本队有实证的经验；每条都指回对应的实验记录或结果页面。',
            en: 'This chapter only records lessons backed by this team own measurements, and each entry points back to the matching experimental record or results section.'
          }
        }
      ]
    },

    // ============ 3.1 验证纪律 ============
    {
      id: 'other-verification',
      title: { zh: '3.1 「菌落 PCR 初筛 + 测序确认」的验证纪律', en: '3.1 Verification discipline: colony PCR screening plus sequencing confirmation' },
      summary: {
        zh: '一条明确的原则：菌落 PCR 无条带只是初筛判据，最终结论必须以测序为准。',
        en: 'One clear rule: a missing colony PCR band is only a screening criterion, and the final conclusion rests on sequencing.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '其他（经验 / 指南）', en: 'Other (lesson / guidance)' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '酵母基因编辑里「菌落 PCR 无条带 = 敲除成功」只是初筛判据，无条带也可能来自 PCR 本身失败；最终结论必须以测序为准。附 F2 / F10 的实证：两株无条带，测序确认 4 bp 缺失造成移码。',
                en: 'In yeast genome editing, a missing colony PCR band as a marker of successful knockout is only a screening criterion: an absent band can also come from a failed reaction. Sequencing has the final word. The evidence is clones F2 and F10, which showed no band and were sequenced to confirm a 4 bp deletion causing a frameshift.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '这是酵母编辑里很容易误判的一点。写清它，可以帮后续队伍避免把「PCR 没扩出来」当成「编辑成功了」，也避免像本队 SST2 那样，十个克隆全有条带还以为转化完成就等于敲除成功。',
                en: 'This is an easy place to misread in yeast editing. Writing it down helps later teams avoid reading a failed PCR as a successful edit, and avoid the inverse mistake seen here with SST2, where all ten clones showed bands and transformation was almost taken as proof of knockout.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '本条依据见 Protocol 页底盘模块的对照与重复表，以及 Results 页第一节。',
                en: 'The basis for this item is in the controls and replicates table of the chassis module on the Protocol page, and in section one of the Results page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: 'F2 / F10 测序确认 4 bp 缺失；SST2 十个克隆全部有条带即未成功。属本队验证记录。',
                en: 'Sequencing of F2 and F10 confirmed a 4 bp deletion; ten SST2 clones all showed bands and therefore failed. This is this team own verification record.'
              }
            }
          ]
        }
      ]
    },

    // ============ 3.2 α-factor 浓度体系提醒 ============
    {
      id: 'other-afactor',
      title: { zh: '3.2 跨模块 α-factor 浓度体系不可直接比较的提醒', en: '3.2 Note: α-factor concentration systems are not directly comparable across modules' },
      summary: {
        zh: '底盘用三档、报告与接口用八档梯度，数值不能直接横向比大小；并列呈现须各自注明体系。',
        en: 'The chassis module uses three steps while the reporter and interface modules use an eight-step gradient; the numbers cannot be compared across modules, and each must be labelled with its own system.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '其他（指南）', en: 'Other (guidance)' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '本项目三套 α-factor 浓度体系并存：底盘功能验证用 0 / 1 / 10 μM 三档，报告体系与接口表型验证用八档梯度。数值不能直接横向比大小，并列呈现时必须各自注明体系。另有边界说明：改造后 α-factor 响应减弱，不等于传感功能已验证。',
                en: 'Three α-factor concentration systems coexist in this project: the chassis functional test uses three steps (0 / 1 / 10 μM), while the reporter system and the interface phenotyping use an eight-step gradient. Numbers cannot be compared across them and each must be labelled with its own system. One further boundary: a weakened α-factor response after the interface edit is not evidence of sensing performance.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '后续队伍如果复用本项目的任一部分，不会被不同浓度档位误导；也避免把接口改造的副作用误读成检测能力的证据。',
                en: 'Teams reusing any part of this project will not be misled by different concentration steps, and will not read the side effect of the interface edit as evidence of detection capability.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '三套体系的计数证据见 Design 页实验总体设计与 Protocol 页各模块对照表，以及 Results 页综合讨论。',
                en: 'The evidence for the three systems is in the overall design on the Design page and the module control tables on the Protocol page, and in the discussion section of the Results page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '底盘模块三档与报告、接口模块八档并存；报告模块的浓度单位与常规有效浓度相差 10³–10⁴ 倍，本页不引用其数值。<!-- RC-1 -->',
                en: 'Three steps in the chassis module coexist with eight-step gradients in the reporter and interface modules. The concentration units in the reporter plans differ from typical effective levels by 10³ to 10⁴ fold, so their numbers are not cited here.'
              }
            }
          ]
        }
      ]
    },

    // ============ 3.3 长片段 PCR 错配教训 ============
    {
      id: 'other-mispair',
      title: { zh: '3.3 长片段 PCR 累积错配的实证教训', en: '3.3 Lesson: accumulated mispairing in long-fragment PCR' },
      summary: {
        zh: '路线一体外组装顺利，但多轮长片段 PCR 累积错配、体内转化失败，最终被测序判否。',
        en: 'Route one assembled cleanly in vitro, but repeated long-fragment PCR accumulated mispairing, the in vivo step failed, and sequencing finally ruled the route out.'
      },
      blocks: [
        {
          type: 'fields',
          items: [
            { label: { zh: '类型', en: 'Type' }, value: { zh: '其他（经验）', en: 'Other (lesson)' } },
            {
              label: { zh: '是什么', en: 'What it is' },
              value: {
                zh: '路线一（pRS426 二次线性化）体外组装顺利，但多轮长片段 PCR 累积错配、体内转化失败，最终被测序判否。这是一次「设计预判（长片段 PCR 易错配）与实测结果对上」的实例。',
                en: 'Route one (second-round linearisation of pRS426) assembled cleanly in vitro, yet repeated long-fragment PCR accumulated mispairing, the in vivo step failed, and sequencing ruled it out. It is a case where a design prediction (long PCR tends to mispair) matched what was measured.'
              }
            },
            {
              label: { zh: '为什么对后续队伍有用', en: 'Why it helps later teams' },
              value: {
                zh: '给「什么时候该放弃建质粒、改用无质粒融合 PCR」提供一个具体判据：体外拼上了不等于能用，先测序再决定要不要继续。后续队伍可以省去在长片段供体上反复试错的时间。',
                en: 'It offers a concrete criterion for when to abandon plasmid construction and switch to plasmid-free fusion PCR: a product that assembles in vitro is not necessarily usable, so sequence it before deciding to continue. That saves later teams from repeated trial and error on long donor fragments.'
              }
            },
            {
              label: { zh: '怎么拿到', en: 'How to obtain it' },
              value: {
                zh: '过程与数据见 Results 页第三节，以及 Protocol 页接口模块。',
                en: 'The process and data are in section three of the Results page and the interface module of the Protocol page.'
              }
            },
            {
              label: { zh: '证据', en: 'Evidence' },
              value: {
                zh: '线性片段 500 bp 之后出现大量错配；一步克隆产物转 TOP10 六种浓度均无目标菌落；原文判定「可行性较差」。',
                en: 'The linear fragment showed extensive mispairing beyond 500 bp; the one-step cloning product gave no target colonies at six different concentrations in TOP10; the original record judges the route as of poor feasibility.'
              }
            }
          ]
        }
      ]
    },

    // ============ 获取与许可 ============
    {
      id: 'contribution-access',
      title: { zh: '获取与许可（Access & License）', en: 'Access and Licence' },
      summary: {
        zh: '部件与协议的获取入口，以及第三方序列的授权说明。',
        en: 'Where to obtain the parts and protocols, and the permission status of third-party sequences.'
      },
      blocks: [
        {
          type: 'ul',
          items: [
            {
              label: { zh: '部件', en: 'Parts' },
              text: {
                zh: 'Δfar1 底盘、PAGER 受体、人源化 Gpa1 工程菌与 FUS1 报告盒均列为拟提交 iGEM Registry 的产出，编号与下载链接以登记结果为准。',
                en: 'The Δfar1 chassis, the PAGER receptor, the humanised Gpa1 strain and the FUS1 reporter cassette are all listed as outputs intended for submission to the iGEM Registry; numbers and download links follow the registration outcome.'
              }
            },
            {
              label: { zh: '协议与方法', en: 'Protocols and methods' },
              text: {
                zh: '四条协议的分步参数已在 Protocol 页对应模块完整列出，可查阅、可复现；改动点在各卡写明。',
                en: 'Stepwise parameters for the four protocols are listed in full in the matching modules of the Protocol page and can be consulted and reproduced; the modifications are noted in each entry.'
              }
            },
            {
              label: { zh: '第三方序列', en: 'Third-party sequences' },
              text: {
                zh: 'MT1 抑制毒素、anti-H1N1_HA 纳米抗体与 hM1Dq 为第三方来源，授权状态在提交 Registry 前确认，不写成自研。',
                en: 'The MT1 inhibitory toxin, the anti-H1N1_HA nanobody and hM1Dq come from third parties; permission is confirmed before Registry submission and none of them is presented as our own.'
              }
            },
            {
              label: { zh: '外链口径', en: 'Link policy' },
              text: {
                zh: '本页所有外链使用公开可达地址，不使用本机路径。',
                en: 'All external links on this page point to publicly reachable addresses, never to local paths.'
              }
            }
          ]
        }
      ]
    },

    // ============ 归属与致谢 ============
    {
      id: 'contribution-attribution',
      title: { zh: '归属与致谢（Attribution）', en: 'Attribution' },
      summary: {
        zh: '各模块的试剂、载体与方案来源；人员与机构致谢见 Attributions 页。',
        en: 'Sources of reagents, vectors and plans by module; personnel and institutional thanks are on the Attributions page.'
      },
      blocks: [
        {
          type: 'ul',
          items: [
            {
              label: { zh: '底盘模块', en: 'Chassis module' },
              text: {
                zh: 'pML104 来自 Addgene #67638；试剂盒与酶供应商见 Protocol 页底盘模块材料表。',
                en: 'pML104 comes from Addgene #67638; kit and enzyme suppliers are listed in the materials table of the chassis module on the Protocol page.'
              }
            },
            {
              label: { zh: '受体模块', en: 'Receptor module' },
              text: {
                zh: 'pGADT7 来自 Sangon Biotech ZB56914；抗体清单见受体模块材料表。',
                en: 'pGADT7 comes from Sangon Biotech ZB56914; the antibody list is in the receptor module materials table.'
              }
            },
            {
              label: { zh: '接口模块', en: 'Interface module' },
              text: {
                zh: 'pRS426 为实验室常规载体；菌株背景口径（S288C 与 BY4741 并存）以实验组统一结果为准。',
                en: 'pRS426 is a routine laboratory vector; the strain background convention (S288C and BY4741 both appear) follows the lab team unified record.'
              }
            },
            {
              label: { zh: '报告模块', en: 'Reporter module' },
              text: {
                zh: '六份实验方案为本队撰写；两套读出体系并存的说明见 1.4。',
                en: 'The six experimental plans were written by this team; the coexistence of two readout systems is described in item 1.4.'
              }
            }
          ]
        },
        {
          type: 'links',
          items: [
            { href: 'team/attributions.html', zh: '人员与机构致谢见团队 Attributions 页', en: 'Personnel and institutional thanks are on the team Attributions page' },
            { href: 'wet-lab/protocol.html', zh: '实验参数与材料清单见 Protocol 页', en: 'Experimental parameters and materials lists are on the Protocol page' },
            { href: 'wet-lab/result.html', zh: '结果与原始数据见 Results 页', en: 'Results and raw data are on the Results page' }
          ]
        }
      ]
    }
  ]
};
