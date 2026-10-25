/**
 * Parts 页面双语数据源（Wet Lab › Parts）
 *
 * 来源：iGEM Registry 本队登记条目（SZPU-CHINA 2026），逐条回查登记页抓取。
 * 字段口径与 Registry 页面保持一致：
 * - id / slug：Registry 编号与页面地址后缀（26 年为小写连写后缀）
 * - type：Registry 的 Role（SO 术语），如 Engineered Region / Promoter / CDS …
 * - composition：Basic Part / Composite Part
 * - length：Registry 标注的 bp 数（含逗号仅为展示，此处存数值）
 * - fn：Registry 的 Functional Description 提要（双语）
 * - source：Registry 的 Source 提要（双语）
 * - uses：Composite Part 的 Construct 组成元件编号
 * - pending：Registry 仍为 Drafting、页面上要以 † 标注的条目（当前无）
 * - hidden：暂时不在页面上列出的条目（见下方各条 ⚠ 说明）。改回 false 即恢复，
 *   计数、筛选与統計格由文件末尾按「可见条目」自动推导，不需要手改数字。
 *
 * 语言口径（2026-10-18 第五轮）：页面与站内 safety / result / model 等标准内容页一致，只出英文。
 *   数据源里的 zh 字段全部保留（本轮未同步更新，属上一版译文），日后若要恢复中文显示，
 *   先按 en 回填 zh 再把模板的 pair() 宏改回双语。
 *
 * 基因写法口径：按 .codebuddy/rules/text-standards.mdc 第 1 节，基因符号按基因语境写
 *   斜体大写（<i>FAR1</i>、<i>SST2</i>、<i>GPA1</i>），蛋白产物写正体 Gpa1。
 *   本轮只改了 en（页面可见文本），zh 未同步。
 *
 * 2026-10-19（第八轮）：按用户给的 Registry 完整清单扩到 25 条，四个模块全覆盖。
 *   底盘改造 7 / GPA1 人源化 5 / 报告体系 3 / 抗原识别模块 10（本轮新增）。
 * 2026-10-21：BBa_26TMZ10V 与 BBa_26HNBAXY 在 Registry 仍为 Draft，加 hidden 下架，
 *   页面上现为 17 基础 + 6 复合 = 23 条；两者仍被复合件的 uses 以旧编号引用
 *   （BBa_K3221207 / BBa_K3939012），组成链不受影响。
 * ⚠ 核验：底盘敲除目标为 <i>FAR1</i> 与 <i>SST2</i> 两个基因，本页与之对应；<i>STE2</i> 敲除仅存在于
 *   src/project/description.njk（该页尚未按现行方案更新，本次不动）。
 * ⚠ 组成链口径：复合件的 uses 一律照录 Registry 的 Construct 字段。
 *   因此 BBa_26D8D1SG 仍写 BBa_K3221207、BBa_266K1VDV 仍写 BBa_K3939012，
 *   不是笔误。
 * ⚠ references 字段保留但模板已不再渲染（参考文献板块已按要求移除）；
 *   正文角标同步删除，来源信息仍写在各条的 source 与 fn 里。
 */

const data = {
  overview: {
    intro: {
      en: 'This collection gathers the biological parts PAGER-Yeast contributed to the iGEM Registry. They cover the re-engineered <i>Saccharomyces cerevisiae</i> chassis, the humanised G-protein interface, the reporter that reads the pathway out, and the antigen-recognition module that gates the receptor; below they are listed the way the Registry itself classifies them, as basic parts and composite parts.',
      zh: '本页收录 PAGER-Yeast 向 iGEM Registry 提交的全部生物元件，覆盖改造 <i>Saccharomyces cerevisiae</i> 底盘、人源化 G 蛋白接口、读出通路的报告元件，以及负责门控的抗原识别模块；下面按 Registry 自身的分类方式，分为基础元件与复合元件两组列出。'
    },
    note: {
      en: 'Every part number links to its Registry page, where the full sequence, annotations and any future characterisation data are kept.',
      zh: '每个编号都指向对应的 Registry 页面，序列全文、注释与后续表征数据以 Registry 为准。'
    },
    footnote: {
      en: 'Marked †: these entries are still being prepared for release, so their Registry pages carry no public sequence yet. Use the existing equivalent in the meantime.',
      zh: '带 † 的条目仍在办理发布，Registry 页面暂未公开序列；在此之前可改用 Registry 中的同等功能元件。'
    }
  },

  /* 集合的分组说明：按 Registry 的 Basic / Composite 二分（见 CJUH-JLU-China 2025 parts 页做法）。
     desc 由 collections 段落引用；tail 说明未提交的部分。 */
  organisation: {
    en: 'Every entry below is one Registry part, and the two sections follow the Registry classification rather than the order of the experiments. Basic parts are single functional units — a guide sequence, a homology arm, the EYNLV swap, a promoter — that can be used on their own or recombined freely. Composite parts are assemblies of two or more basic parts, submitted so that a combination which is known to work can be taken as a single piece. Each composite entry lists what it is built from.',
    zh: '下面每一条都是一个 Registry 元件，两个分组沿用 Registry 自身的分类，而非实验顺序。基础元件是单一功能单元——向导序列、同源臂、EYNLV 片段、启动子——可单独使用，也可自由重组；复合元件由两个以上基础元件组装而成，作为「已知可用」的组合整体提交，每条都列出它的组成。',
    tail: {
      en: 'All four modules of the project are represented here: chassis engineering, <i>GPA1</i> humanisation, the reporter system, and the antigen-recognition module that gates the receptor.',
      zh: '项目的四个模块均已收录：底盘改造、GPA1 人源化、报告体系，以及接在受体前面、负责门控的抗原识别模块。'
    }
  },

  /* modules 只用于给两组的条目排一个合理顺序，不在页面上作为分组呈现 */
  modules: [
    {
      id: 'chassis-engineering',
      en: 'Chassis Engineering',
      zh: '底盘改造元件',
      desc: {
        en: 'Everything needed to cut two genes out of the BY4741 chassis: one guide per target, one sgRNA expression cassette per target, and one repair template per target that leaves a short deletion and a mutated PAM behind.',
        zh: '把 BY4741 底盘里的两个基因敲掉所需的一整套元件：每个靶点一条向导序列、一个 sgRNA 表达盒、一份同源修复模板（留下短缺失与突变 PAM，不引入外源序列与筛选标记）。'
      },
      parts: [
        {
          id: 'BBa_267ZCE19',
          slug: 'bba-267zce19',
          // 2026-10-19：随 25 条完整清单恢复显示（此前因与他人同源支架撞车暂下架）
          pending: false,
          en: 'SpCas9 sgRNA scaffold (pML104)',
          zh: 'SpCas9 sgRNA 支架（源自 pML104）',
          type: { en: 'Non-coding RNA', zh: '非编码 RNA' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 79,
          fn: {
            en: 'The constant 79 bp scaffold of the SpCas9-compatible sgRNA used in the pML104 CRISPR-Cas9 system. It supplies the structured RNA region that lets the sgRNA fold and bind SpCas9; it does not decide which locus gets cut.',
            zh: 'pML104 CRISPR-Cas9 系统中 sgRNA 的固定支架，长 79 bp。它提供 sgRNA 折叠并结合 SpCas9 所需的结构区，不决定切割哪个位点。'
          },
          source: {
            en: 'Chimeric sgRNA scaffold taken from the pML104 CRISPR-Cas9 system.',
            zh: '取自 pML104 CRISPR-Cas9 系统的嵌合 sgRNA 支架。'
          }
        },
        {
          id: 'BBa_262TZXV3',
          slug: 'bba-262tzxv3',
          pending: false,
          en: '<i>FAR1</i>-targeting guide sequence (crRNA_FAR1_KO_up)',
          zh: '<i>FAR1</i> 靶向向导序列（crRNA_FAR1_KO_up）',
          type: { en: 'Guide RNA', zh: '向导 RNA' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 20,
          fn: {
            en: 'A 20 bp guide sequence aimed at the <i>FAR1</i>/YJL157C locus of <i>Saccharomyces cerevisiae</i> BY4741. It carries the targeting information for a pML104-based SpCas9 sgRNA cassette, so a <i>FAR1</i> knockout needs nothing beyond this spacer plus the shared scaffold; the adjacent TGG PAM sits outside the part and is not included here. <i>FAR1</i> encodes the cell-cycle inhibitor that arrests G1 after pheromone stimulation, which is why removing it keeps the strain dividing through a long fluorescence read-out.',
            zh: '靶向 <i>Saccharomyces cerevisiae</i> BY4741 中 <i>FAR1</i>/YJL157C 位点的 20 bp 向导序列，为基于 pML104 的 SpCas9 sgRNA 表达盒提供靶向特异性，用于敲除 <i>FAR1</i>；相邻的 TGG PAM 不在本序列内。'
          },
          source: {
            en: 'Designed in CRISPOR and picked on predicted on-target scores together with off-target analysis.',
            zh: '用 CRISPOR 设计，按预测的打靶得分与脱靶分析筛出。'
          }
        },
        {
          id: 'BBa_26IKMSKO',
          slug: 'bba-26ikmsko',
          pending: false,
          en: '<i>FAR1</i> sgRNA expression cassette (SNR52p–guide–scaffold–SUP4t)',
          zh: '<i>FAR1</i> sgRNA 表达盒（SNR52p–向导–支架–SUP4t）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 388,
          fn: {
            en: 'A complete expression cassette that puts the <i>FAR1</i> guide under RNA polymerase III control in yeast: the SNR52 promoter drives transcription, the 20 bp spacer confers specificity, the SpCas9 scaffold supplies the RNA structure Cas9 binds, and the SUP4 terminator ends the transcript. Together with the matching repair template it turns the target locus into a frameshift after a single Cas9 cut. The cassette is designed for the pML104 CRISPR-Cas9 system used throughout the chassis work.',
            zh: '由 RNA 聚合酶 III 驱动表达 <i>FAR1</i> 靶向 sgRNA 的表达盒：SNR52 启动子负责转录，向导序列决定特异性，支架提供 SpCas9 结合所需结构，SUP4 终止子界定转录本 3′ 边界。用于基于 pML104 的 <i>FAR1</i>/YJL157C 敲除。'
          },
          source: {
            en: 'Assembled from Registry parts plus a computationally designed <i>FAR1</i> spacer.',
            zh: '由 Registry 既有元件与计算设计的 <i>FAR1</i> 间隔序列组装而成。'
          },
          uses: ['BBa_K2926004', 'BBa_262TZXV3', 'BBa_267ZCE19', 'BBa_K4278714']
        },
        {
          id: 'BBa_26HN2W3G',
          slug: 'bba-26hn2w3g',
          pending: false,
          en: '<i>FAR1</i> homology repair template (4 bp deletion, PAM mutated)',
          zh: '<i>FAR1</i> 同源修复模板（4 bp 缺失 + PAM 突变）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 1142,
          fn: {
            en: 'The donor that repairs <i>FAR1</i> once Cas9 has cut it. It carries 4 bp missing (CACT) inside the guide site GCGTCACGATCTCCACTTGG and a PAM changed from TGG to TAG, so the repaired chromosome is no longer recognised by the same guide. The short deletion shifts the reading frame and knocks the gene out; the PAM edit is the safeguard against a second cut. No foreign sequence and no selection marker are introduced, so the chassis stays marker-free apart from later integration steps.',
            zh: '用于 CRISPR-Cas9 破坏 <i>Saccharomyces cerevisiae</i> BY4741 中 <i>FAR1</i> 的线性同源修复模板。它在 GCGTCACGATCTCCACTTGG 靶位点内删去 4 bp（CACT），并把相邻 PAM 由 TGG 改为 TAG：缺失用来打断 <i>FAR1</i> 编码序列，PAM 突变用来阻止 Cas9 二次切割修复后的位点。不残留任何外源序列，也不带筛选标记。'
          },
          source: {
            en: '<i>S. cerevisiae</i> <i>FAR1</i> locus, modified with a 4 bp deletion and a PAM mutation on top of the CRISPR target GCGTCACGATCTCCACTTGG.',
            zh: '以酿酒酵母 <i>FAR1</i> 位点为底本，在靶序列 GCGTCACGATCTCCACTTGG 上做 4 bp 缺失与 PAM 突变。'
          }
        },
        {
          id: 'BBa_2658B1ZA',
          slug: 'bba-2658b1za',
          pending: false,
          en: '<i>SST2</i>-targeting guide sequence (crRNA_SST2_KO)',
          zh: '<i>SST2</i> 靶向向导序列（crRNA_SST2_KO）',
          type: { en: 'Guide RNA', zh: '向导 RNA' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 20,
          fn: {
            en: 'The <i>SST2</i> counterpart of the <i>FAR1</i> guide: 20 bp aimed at the <i>SST2</i> locus of <i>Saccharomyces cerevisiae</i> BY4741 and used the same way in a pML104 sgRNA cassette. <i>SST2</i> is the principal negative regulator of mating-pheromone signalling, so taking it out is what lifts the ceiling on how strongly the pathway can respond. The CGG PAM next to this target is not part of the part.',
            zh: '靶向 <i>Saccharomyces cerevisiae</i> BY4741 中 <i>SST2</i> 位点的 20 bp 向导序列，为基于 pML104 的 SpCas9 sgRNA 表达盒提供靶向特异性，用于敲除 <i>SST2</i>；对应的 CGG PAM 不在本序列内。'
          },
          source: {
            en: 'Designed computationally with a CRISPR design tool and selected for SpCas9 knockout in the pML104 system.',
            zh: '用 CRISPR 设计工具计算得到，适配 pML104 系统的 SpCas9 敲除。'
          }
        },
        {
          id: 'BBa_26YVX4QT',
          slug: 'bba-26yvx4qt',
          pending: false,
          en: '<i>SST2</i> sgRNA expression cassette (SNR52p–guide–scaffold–SUP4t)',
          zh: '<i>SST2</i> sgRNA 表达盒（SNR52p–向导–支架–SUP4t）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 388,
          fn: {
            en: 'The <i>SST2</i> twin of the <i>FAR1</i> sgRNA cassette, built from the same four Registry parts in the same order — SNR52 promoter, <i>SST2</i> spacer, SpCas9 scaffold, SUP4 terminator — for RNA polymerase III expression in yeast. Paired with the <i>SST2</i> repair template it gives a frameshift knockout after one Cas9 cut, and because the scaffold is shared with the <i>FAR1</i> cassette the two targets differ only in their 20 bp spacers.',
            zh: '由 RNA 聚合酶 III 驱动表达 <i>SST2</i> 靶向 sgRNA 的表达盒：SNR52 启动子负责转录，向导序列决定特异性，支架提供 SpCas9 结合所需结构，SUP4 终止子界定转录本 3′ 边界。用于基于 pML104 的 <i>SST2</i> 敲除。'
          },
          source: {
            en: 'Assembled from four Registry parts; the <i>SST2</i> spacer was designed computationally from the <i>Saccharomyces cerevisiae</i> <i>SST2</i> locus.',
            zh: '由四个 Registry 元件组装而成；<i>SST2</i> 间隔序列依据 <i>Saccharomyces cerevisiae</i> <i>SST2</i> 位点计算设计。'
          },
          uses: ['BBa_K2926004', 'BBa_2658B1ZA', 'BBa_267ZCE19', 'BBa_K4278714']
        },
        {
          id: 'BBa_262SR0ED',
          slug: 'bba-262sr0ed',
          pending: false,
          en: '<i>SST2</i> homology repair template (4 bp deletion, PAM mutated)',
          zh: '<i>SST2</i> 同源修复模板（4 bp 缺失 + PAM 突变）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 989,
          fn: {
            en: 'The donor that repairs <i>SST2</i> once Cas9 has cut it, mirroring the <i>FAR1</i> template: 4 bp missing (TCTG) inside the target site TCGCCACGAGTTCTGTCCTG, and the adjacent PAM changed from CGG to CAG so the repaired locus is no longer a valid target. The deletion shifts the reading frame and knocks the gene out; the PAM edit makes a second cut unlikely. Nothing foreign and no selection marker are introduced.',
            zh: '用于 CRISPR-Cas9 破坏 <i>Saccharomyces cerevisiae</i> BY4741 中 <i>SST2</i> 位点的线性同源修复模板。它在 TCGCCACGAGTTCTGTCCTG 靶位点内删去 4 bp（TCTG），并把相邻 PAM 由 CGG 改为 CAG：缺失用来打断 <i>SST2</i> 编码序列，PAM 突变用来降低修复后被再次切割的概率。不残留任何外源序列，也不带筛选标记。'
          },
          source: {
            en: '<i>S. cerevisiae</i> <i>SST2</i> locus, modified with a 4 bp deletion and a PAM mutation on top of the CRISPR target TCGCCACGAGTTCTGTCCTG.',
            zh: '以酿酒酵母 <i>SST2</i> 位点为底本，在靶序列 TCGCCACGAGTTCTGTCCTG 上做 4 bp 缺失与 PAM 突变。'
          }
        }
      ]
    },

    {
      id: 'gpa1-humanisation',
      en: 'GPA1 Humanisation',
      zh: 'GPA1 人源化改造元件',
      desc: {
        en: 'Two homology arms, the five-residue swap itself, and the donor cassette that puts them together. Used as a set, they replace the last five residues of Gpa1 so a heterologous receptor has something to couple to.',
        zh: '两条同源臂、待替换的五残基片段，以及把三者串起来的供体盒。整套使用，把 GPA1P 末端五个残基换掉，让异源受体能与之偶联。'
      },
      parts: [
        {
          id: 'BBa_26HUBYAY',
          slug: 'bba-26hubyay',
          pending: false,
          en: '<i>GPA1</i> upstream homology arm',
          zh: 'GPA1 上游同源臂',
          type: { en: 'Homologous region', zh: '同源重组臂' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 500,
          fn: {
            en: '500 bp taken from directly upstream of <i>GPA1</i>/YHR005C. Its only job is to be recognised: <i>Saccharomyces cerevisiae</i> recombines where the sequence matches, so this arm is what delivers the replacement to the right place on chromosome VIII. It pairs with the downstream arm to bracket the region being rewritten.',
            zh: '取自 GPA1/YHR005C 上游基因组区域的 500 bp 同源臂，用于把供体盒锚定到该位点，使同源重组把人源化 GPA1 C 端与 <i>URA3</i> 筛选盒换入基因组。'
          },
          source: {
            en: 'The <i>GPA1</i>/YHR005C locus on chromosome VIII of <i>Saccharomyces cerevisiae</i> S288C.',
            zh: '<i>Saccharomyces cerevisiae</i> S288C 八号染色体上的 GPA1/YHR005C 位点。'
          }
        },
        {
          id: 'BBa_26EG2LOR',
          slug: 'bba-26eg2lor',
          pending: false,
          en: '<i>GPA1</i> C-terminal Gαq-derived EYNLV sequence with stop codon',
          zh: 'GPA1 C 端人源化片段（EYNLV + 终止密码子）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 18,
          fn: {
            en: 'The 18 bp at the centre of the swap: five Gαq-derived residues, EYNLV, followed by a stop codon. The C-terminus of a Gα protein is what decides which receptor it can work with, so replacing the yeast KIGII with this sequence is the whole point of the humanisation step. The design follows the Gαq chimera reported by Komatsuzaki and colleagues (1997).',
            zh: '长 18 bp 的工程化序列，编码源自 Gαq 的五个残基 EYNLV 并带终止密码子。它替掉 <i>Saccharomyces cerevisiae</i> GPA1P 末端五个残基，目的是改善异源受体与交配信号通路的偶联。'
          },
          source: {
            en: 'Designed from the C-terminal five-residue Gαq chimera reported by Komatsuzaki et al. (1997); C-terminal sequence of <i>Homo sapiens</i> GNAQ (Gαq).',
            zh: '依据 Komatsuzaki 等（1997）报道的 Gαq C 端五残基嵌合体设计；取自 <i>Homo sapiens</i> GNAQ（Gαq）C 端序列。'
          }
        },
        {
          id: 'BBa_26YEUKXX',
          slug: 'bba-26yeukxx',
          pending: false,
          en: '<i>GPA1</i> downstream homology arm',
          zh: 'GPA1 下游同源臂',
          type: { en: 'Homologous region', zh: '同源重组臂' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 500,
          fn: {
            en: '500 bp from the region downstream of <i>GPA1</i>/YHR005C, closing the other side of the target. Together with the upstream arm it defines exactly which stretch of the locus is replaced, so the edited allele carries the humanised C-terminus and nothing else from the original sequence.',
            zh: '取自 GPA1/YHR005C 下游基因组区域的 500 bp 同源臂。它与上游臂一起界定替换区间，使同源重组把天然 GPA1 C 端换成人源化 Gαq 序列连同 <i>URA3</i> 筛选盒。'
          },
          source: {
            en: 'The genomic region downstream of the <i>GPA1</i>/YHR005C locus on chromosome VIII of <i>Saccharomyces cerevisiae</i> S288C.',
            zh: '<i>Saccharomyces cerevisiae</i> S288C 八号染色体上 GPA1/YHR005C 位点下游的基因组区域。'
          }
        },
        {
          id: 'BBa_266K1VDV',
          slug: 'bba-266k1vdv',
          pending: false,
          en: '<i>GPA1</i> C-terminal humanisation cassette with <i>URA3</i> selection marker',
          zh: '带 <i>URA3</i> 筛选标记的 GPA1 C 端人源化盒',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 2280,
          fn: {
            en: 'The complete donor cassette for editing <i>GPA1</i> in a single transformation. Running in order: the upstream homology arm, the humanised EYNLV sequence, the <i>URA3</i> promoter, the <i>URA3</i> gene, the <i>URA3</i> terminator, a short connecting sequence, and the downstream homology arm. In BY4741, which is <i>URA3</i> auxotrophic, the embedded <i>URA3</i> cassette is what lets transformants be recovered on uracil-deficient medium, while the flanking arms alone decide where the construct lands.',
            zh: '用于 GPA1/YHR005C 位点同源重组的线性供体盒，依次为：上游同源臂、人源化 EYNLV 序列、<i>URA3</i> 启动子、<i>URA3</i> 基因、<i>URA3</i> 终止子、一段连接序列、下游同源臂。两侧同源臂负责在靶位点整合，<i>URA3</i> 盒负责转化子筛选。'
          },
          source: {
            en: 'Assembled from BBa_26HUBYAY, BBa_26EG2LOR, BBa_K3939012, BBa_Y1007, BBa_K2407302, a custom linker and BBa_26YEUKXX.',
            zh: '由 BBa_26HUBYAY、BBa_26EG2LOR、BBa_K3939012、BBa_Y1007、BBa_K2407302、一段自建连接序列与 BBa_26YEUKXX 组装。'
          },
          uses: ['BBa_26HUBYAY', 'BBa_26EG2LOR', 'BBa_K3939012', 'BBa_Y1007', 'BBa_K2407302', 'BBa_26YEUKXX']
        },
        {
          id: 'BBa_26HNBAXY',
          slug: 'bba-26hnbaxy',
          // 2026-10-21：Registry 仍为 Draft，按要求不列入页面；改回 false 即恢复。
          // 注：Registry 曾判定与 BBa_K3939012 / BBa_K3112018 重复，复合件 BBa_266K1VDV 的组成链仍沿用 BBa_K3939012。
          hidden: true,
          pending: false,
          en: '<i>URA3</i> promoter for yeast selection',
          zh: '用于酵母筛选的 <i>URA3</i> 启动子',
          type: { en: 'Promoter', zh: '启动子' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 221,
          fn: {
            en: 'A <i>Saccharomyces cerevisiae</i> <i>URA3</i> promoter that drives the <i>URA3</i> selectable marker. Inside the GPA1 humanisation donor cassette it sits just upstream of the <i>URA3</i> coding sequence, so that cells carrying the replacement can be picked out on uracil-deficient medium.',
            zh: '<i>Saccharomyces cerevisiae</i> 的 <i>URA3</i> 启动子，负责驱动 <i>URA3</i> 筛选标记表达。在 GPA1 人源化供体盒中它紧邻 <i>URA3</i> 编码序列上游，使完成替换的细胞能在缺尿嘧啶培养基上被筛出。'
          },
          source: {
            en: '<i>S. cerevisiae</i> <i>URA3</i> promoter derived from pRS426.',
            zh: '取自 pRS426 的酿酒酵母 <i>URA3</i> 启动子。'
          }
        }
      ]
    },

    {
      id: 'reporter-system',
      en: 'Reporter System',
      zh: '报告体系元件',
      desc: {
        en: 'The promoter that listens to the mating MAPK cascade, the coding sequence that fluoresces, and the composite that puts the first directly in front of the second.',
        zh: '监听交配 MAPK 级联的启动子、产生荧光的编码序列，以及把前者直接接到后者前面的复合元件。'
      },
      parts: [
        {
          id: 'BBa_26J53MF4',
          slug: 'bba-26j53mf4',
          pending: false,
          en: '<i>FUS1</i> promoter (435 bp)',
          zh: '<i>FUS1</i> 启动子（435 bp）',
          type: { en: 'Promoter', zh: '启动子' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 435,
          fn: {
            en: 'A 435 bp fragment of the <i>FUS1</i> upstream region from <i>Saccharomyces cerevisiae</i> S288C. <i>FUS1</i> is one of the genes the mating pathway switches on, which makes its promoter a convenient readout: whatever activates the cascade upstream ends up written out here as transcription. This part is the promoter only — no reporter, no terminator, no backbone — so it can be paired with whichever output a construct needs.',
            zh: '取自 <i>Saccharomyces cerevisiae</i> S288C 的 435 bp <i>FUS1</i> 上游片段，用于在交配信息素通路被激活后驱动下游基因转录。它自身不含报告基因、终止子与骨架，实际表达量取决于宿主基因型与所处表达环境；本项目分别以 <i>yEGFP</i> 与 <i>MEL1</i> 作为两种备选下游报告。'
          },
          source: {
            en: '<i>Saccharomyces cerevisiae</i> S288C chromosome III, NCBI RefSeq NC_001135.5, positions 71,368–71,802 on the forward strand.',
            zh: '<i>Saccharomyces cerevisiae</i> S288C 三号染色体，NCBI RefSeq NC_001135.5，正链第 71,368–71,802 位。'
          }
        },
        {
          id: 'BBa_26TMZ10V',
          slug: 'bba-26tmz10v',
          // 2026-10-21：Registry 仍为 Draft，按要求不列入页面；改回 false 即恢复。
          // 注：Registry 曾判定与 BBa_K3221207 重复，复合件 BBa_26D8D1SG 的组成链仍沿用 BBa_K3221207。
          hidden: true,
          pending: false,
          en: '<i>yEGFP</i> coding sequence (yeast-optimised EGFP)',
          zh: '<i>yEGFP</i> 编码序列（酵母优化型增强绿荧光蛋白）',
          type: { en: 'Coding sequence', zh: '编码序列' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 717,
          fn: {
            en: 'The coding sequence of yeast-optimised enhanced green fluorescent protein. Transcribed and translated in <i>Saccharomyces cerevisiae</i> it gives enhanced GFP, which fluoresces green on excitation. The part is meant as a fluorescence read-out placed behind an inducible promoter such as the <i>FUS1</i> promoter in yeast biosensor constructs, and it carries no promoter, terminator or backbone.',
            zh: '酵母优化型增强绿荧光蛋白的编码序列。在 <i>Saccharomyces cerevisiae</i> 中转录翻译后产生增强型 GFP，激发时发出绿色荧光。该元件用作读数模块，放在酵母生物传感器构建体中 <i>FUS1</i> 等诱导型启动子之后；不含启动子、终止子与载体骨架。'
          },
          source: {
            en: 'GenBank: AQK76557.1 (<i>yEGFP</i>, cloning vector pPC_040_GFP); the sequence was retrieved and checked in SnapGene.',
            zh: 'GenBank：AQK76557.1（<i>yEGFP</i>，克隆载体 pPC_040_GFP）；序列经 SnapGene 调取与核对。'
          }
        },
        {
          id: 'BBa_26D8D1SG',
          slug: 'bba-26d8d1sg',
          pending: false,
          en: '<i>FUS1</i> promoter–<i>yEGFP</i> reporter fragment',
          zh: '<i>FUS1</i> 启动子–<i>yEGFP</i> 报告片段',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 1152,
          fn: {
            en: 'A composite reporter that pairs the <i>FUS1</i> promoter with the <i>yEGFP</i> reporter CDS. The promoter answers to the yeast mating-response MAPK cascade, so once the pathway is active it drives <i>yEGFP</i> transcription and translation and the cell fluoresces green. It is the output module used to characterise both the re-engineered chassis and the humanised G-protein interface.',
            zh: '把 <i>FUS1</i> 启动子与 <i>yEGFP</i> 编码序列接在一起的复合报告元件。该启动子受酵母交配应答 MAPK 级联调控，通路一旦激活即驱动 <i>yEGFP</i> 转录翻译，细胞发出绿色荧光。'
          },
          source: {
            en: 'Assembled from the truncated <i>FUS1</i> promoter BBa_26J53MF4 and the <i>yEGFP</i> reporter CDS.',
            zh: '由截短 <i>FUS1</i> 启动子 BBa_26J53MF4 与 <i>yEGFP</i> 报告基因 CDS 组装而成。'
          },
          uses: ['BBa_26J53MF4', 'BBa_K3221207']
        }
      ]
    },
    {
      id: 'recognition-module',
      en: 'Recognition Module',
      zh: '抗原识别模块',
      desc: {
        en: 'The antigen-recognition half of the receptor: a secretion signal, an auto-inhibitory peptide, a flexible linker, the anti-H1N1 HA nanobody, a TEV cleavage site and an epitope tag — plus the two receptor assemblies that string them together.',
        zh: '受体的抗原识别部分：分泌信号肽、自抑制肽、柔性连接子、抗 H1N1 HA 纳米抗体、TEV 酶切位点与表位标签，以及把它们串起来的两个受体构件。'
      },
      parts: [
        {
          id: 'BBa_266CQI7L',
          slug: 'bba-266cqi7l',
          pending: false,
          en: '<i>S. cerevisiae</i> α-factor pre-signal peptide',
          zh: '酿酒酵母 α-factor 前导信号肽',
          type: { en: 'Signal peptide', zh: '信号肽' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 57,
          fn: {
            en: 'The pre-region of the <i>S. cerevisiae</i> α-factor precursor, used as an N-terminal signal peptide to route a downstream fusion protein into the secretory pathway. In the PAGER receptor designs it carries the extracellular sensing module toward the plasma membrane, so the antigen-binding domain ends up facing the outside of the cell.',
            zh: '酿酒酵母 α-factor 前体的前导区，用作 N 端信号肽，把下游融合蛋白导入分泌途径。在 PAGER 受体设计中负责把胞外传感模块递送到质膜，使抗原结合结构域朝向细胞外侧。'
          },
          source: {
            en: 'Derived from the <i>S. cerevisiae</i> α-factor (MFα1) pre-sequence.',
            zh: '取自酿酒酵母 α-factor（MFα1）前导序列。'
          }
        },
        {
          id: 'BBa_26DI50C2',
          slug: 'bba-26di50c2',
          pending: false,
          en: 'STE2P antagonist peptide CRGPQLKPGQPMY',
          zh: 'STE2P 拮抗肽 CRGPQLKPGQPMY',
          type: { en: 'Polypeptide', zh: '多肽' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 39,
          fn: {
            en: 'Encodes the 13-residue STE2P antagonist peptide CRGPQLKPGQPMY, designed from structure–activity studies of the α-factor–STE2P interaction. It is the auto-inhibitory element of the PAGER-<i>STE2</i> design: without H1N1 HA it occupies the STE2P ligand-binding region and suppresses basal signalling, and antigen binding to the fused nanobody is expected to relieve that inhibition.',
            zh: '编码 13 个氨基酸的 STE2P 拮抗肽 CRGPQLKPGQPMY，依据 α-factor–STE2P 相互作用的结构-活性研究设计。它是 PAGER-<i>STE2</i> 设计中的自抑制元件：无 H1N1 HA 时占据 STE2P 配体结合区、压低基础信号；抗原与融合的纳米抗体结合后解除抑制。'
          },
          source: {
            en: 'Sequence taken from published structure–activity studies of α-factor analogues (doi:10.1128/MCB.16.9.4700; doi:10.1016/j.peptides.2003.11.028).',
            zh: '序列依据已发表的 α-factor 类似物结构-活性研究（doi:10.1128/MCB.16.9.4700；doi:10.1016/j.peptides.2003.11.028）。'
          }
        },
        {
          id: 'BBa_26J0YWR7',
          slug: 'bba-26j0ywr7',
          pending: false,
          en: 'Flexible Gly-Ser linker (11 aa)',
          zh: '柔性 Gly-Ser 连接子（11 个氨基酸）',
          type: { en: 'Polypeptide', zh: '多肽' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 33,
          fn: {
            en: 'A flexible Gly-Ser-rich linker placed between the extracellular regulatory module and hM1Dq. It gives the two domains conformational freedom and enough spatial separation to fold independently, while keeping steric interference with receptor function low.',
            zh: '一段富含甘氨酸-丝氨酸的柔性连接子，接在胞外调控模块与 hM1Dq 之间。它给两侧结构域留出构象自由度与足够的空间间隔，使二者能各自折叠，同时尽量减少对受体功能的空间干扰。'
          },
          source: {
            en: 'Synthetic Gly-Ser linker, 11 residues.',
            zh: '人工合成的 Gly-Ser 连接子，11 个氨基酸。'
          }
        },
        {
          id: 'BBa_26U5OU4I',
          slug: 'bba-26u5ou4i',
          pending: false,
          en: 'Anti-H1N1 HA nanobody',
          zh: '抗 H1N1 HA 纳米抗体',
          type: { en: 'Coding sequence', zh: '编码序列' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 342,
          fn: {
            en: 'A single-domain antibody that specifically recognises the haemagglutinin of influenza A H1N1. In the PAGER receptor it sits in the extracellular region and serves as the antigen-recognition module: HA binding is meant to relieve steric inhibition of the receptor and let the downstream pathway fire.',
            zh: '特异性识别甲型流感 H1N1 血凝素的单域抗体。在 PAGER 受体中位于胞外区，承担抗原识别功能：结合 HA 后解除受体的空间位阻抑制，使下游通路被激活。'
          },
          source: {
            en: 'Nanobody raised against H1N1 haemagglutinin, codon-optimised for <i>S. cerevisiae</i>.',
            zh: '针对 H1N1 血凝素的纳米抗体，已按酿酒酵母做密码子优化。'
          }
        },
        {
          id: 'BBa_26I4T75I',
          slug: 'bba-26i4t75i',
          pending: false,
          en: 'TEV protease cleavage site',
          zh: 'TEV 蛋白酶酶切位点',
          type: { en: 'Protease site', zh: '酶切位点' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 21,
          fn: {
            en: 'A TEV protease recognition site placed between the extracellular antigen-binding module and the receptor-associated domain. Cleaving it removes the upstream module, so receptor activation can be tested with and without the antigen-gated half in place.',
            zh: '位于胞外抗原结合模块与受体结构域之间的 TEV 蛋白酶识别位点。酶切掉上游模块后，可在有、无抗原门控部分两种情形下分别检验受体激活。'
          },
          source: {
            en: 'Standard TEV protease recognition sequence (ENLYFQG).',
            zh: '标准 TEV 蛋白酶识别序列（ENLYFQG）。'
          }
        },
        {
          id: 'BBa_2624TRUA',
          slug: 'bba-2624trua',
          pending: false,
          en: 'ALFA-tag (13-aa epitope)',
          zh: 'ALFA 标签（13 氨基酸表位）',
          type: { en: 'Tag', zh: '标签' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 39,
          fn: {
            en: 'Encodes the 13-residue ALFA-tag, an epitope recognised by ALFA-specific antibodies and binding reagents. In the PAGER receptor it sits between the TEV site and the flexible linker and is used to confirm that the fusion is expressed and reaches the membrane.',
            zh: '编码 13 个氨基酸的 ALFA 标签，可被 ALFA 特异抗体与结合试剂识别。在 PAGER 受体中位于 TEV 位点与柔性连接子之间，用于确认融合蛋白已表达并到达质膜。'
          },
          source: {
            en: 'Synthetic ALFA epitope tag.',
            zh: '人工合成的 ALFA 表位标签。'
          }
        },
        {
          id: 'BBa_266RB3HX',
          slug: 'bba-266rb3hx',
          pending: false,
          en: 'Muscarinic toxin 1 (MT1) auto-inhibitory domain',
          zh: '毒蕈碱毒素 1（MT1）自抑制结构域',
          type: { en: 'Coding sequence', zh: '编码序列' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 198,
          fn: {
            en: 'Muscarinic toxin 1, an extracellular auto-inhibitory domain used in the PAGERGq design. Fused to the N-terminus of hM1Dq it holds the receptor shut while no antigen is present; binding of the anti-H1N1 HA nanobody to its antigen is expected to relieve that block and let an orthogonal DREADD ligand activate hM1Dq.',
            zh: '毒蕈碱毒素 1，PAGERGq 设计中位于胞外的自抑制结构域。融合在 hM1Dq 的 N 端，无抗原时把受体压住；抗 H1N1 HA 纳米抗体结合抗原后解除这一阻断，hM1Dq 才能被正交 DREADD 配体激活。'
          },
          source: {
            en: 'Muscarinic toxin 1 from mamba venom, used here as a steric gate.',
            zh: '源自曼巴蛇毒的毒蕈碱毒素 1，本项目用作空间位阻开关。'
          }
        },
        {
          id: 'BBa_267G8SJJ',
          slug: 'bba-267g8sjj',
          pending: false,
          en: 'Engineered hM1Dq receptor for yeast Gq signalling',
          zh: '酵母 Gq 信号用改造型 hM1Dq 受体',
          type: { en: 'Coding sequence', zh: '编码序列' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 1038,
          fn: {
            en: 'The engineered hM1Dq DREADD receptor adapted for expression in <i>S. cerevisiae</i>. It is the transmembrane signalling core of the PAGERGq system: once MT1-mediated auto-inhibition is relieved by antigen binding, it activates Gq-coupled signalling in response to an orthogonal DREADD ligand. The part carries the receptor modifications used in this project.',
            zh: '为在酿酒酵母中表达而改造的 hM1Dq DREADD 受体。它是 PAGERGq 系统的跨膜信号核心：抗原结合解除 MT1 介导的自抑制后，它响应正交 DREADD 配体并激活 Gq 偶联信号。本元件包含本项目所用到的受体改造。'
          },
          source: {
            en: 'Engineered from the hM1Dq DREADD receptor for yeast expression.',
            zh: '由 hM1Dq DREADD 受体改造而来，适配酵母表达。'
          }
        },
        {
          id: 'BBa_26YO211V',
          slug: 'bba-26yo211v',
          pending: false,
          en: 'PAGER-<i>STE2</i> H1N1 HA-gated yeast signalling module',
          zh: 'PAGER-<i>STE2</i> 型 H1N1 HA 门控酵母信号模块',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 623,
          fn: {
            en: 'The H1N1 HA-gated module that plugs into the native yeast STE2P mating pathway. Reading N- to C-terminus it carries the α-factor pre-sequence, the STE2P antagonist peptide, a flexible linker, the anti-H1N1 HA nanobody, a TEV site and an ALFA-tag. The nanobody provides HA recognition while the antagonist peptide gates STE2P signalling; the STE2P receptor itself is supplied by the chassis and is not part of this construct.',
            zh: '接入酵母天然 STE2P 交配通路的 H1N1 HA 门控模块。由 N 端到 C 端依次为 α-factor 前导序列、STE2P 拮抗肽、柔性连接子、抗 H1N1 HA 纳米抗体、TEV 位点与 ALFA 标签。纳米抗体负责识别 HA，拮抗肽负责门控 STE2P 信号；STE2P 受体本身由底盘提供，不在本构件内。'
          },
          source: {
            en: 'Assembled from BBa_266CQI7L, BBa_26DI50C2, BBa_26J0YWR7, BBa_26U5OU4I, BBa_26I4T75I and BBa_2624TRUA.',
            zh: '由 BBa_266CQI7L、BBa_26DI50C2、BBa_26J0YWR7、BBa_26U5OU4I、BBa_26I4T75I 与 BBa_2624TRUA 组装。'
          },
          uses: ['BBa_266CQI7L', 'BBa_26DI50C2', 'BBa_26J0YWR7', 'BBa_26U5OU4I', 'BBa_26I4T75I', 'BBa_2624TRUA']
        },
        {
          id: 'BBa_26CKZT2G',
          slug: 'bba-26ckzt2g',
          pending: false,
          en: 'PAGERGq H1N1 HA-responsive engineered hM1Dq receptor',
          zh: 'PAGERGq 型 H1N1 HA 响应改造 hM1Dq 受体',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 1740,
          fn: {
            en: 'The antigen-responsive receptor assembly of the PAGERGq design. The α-factor pre-sequence targets the construct to the secretory pathway, MT1 keeps the receptor auto-inhibited until antigen arrives, the anti-H1N1 HA nanobody provides recognition, the TEV site makes the gating module removable for controls, and the engineered hM1Dq receptor couples activation to the engineered Gpa1/Gαq interface. An ALFA-tag is carried for detection.',
            zh: 'PAGERGq 设计的抗原响应型受体构件。α-factor 前导序列把构件导入分泌途径，MT1 在抗原到来前维持自抑制，抗 H1N1 HA 纳米抗体负责识别，TEV 位点便于切除门控模块做对照，改造后的 hM1Dq 受体把激活耦合到工程化的 GPA1/Gαq 界面；另带 ALFA 标签用于检测。'
          },
          source: {
            en: 'Assembled from BBa_266CQI7L, BBa_266RB3HX, BBa_26J0YWR7, BBa_26U5OU4I, BBa_26I4T75I, BBa_2624TRUA and BBa_267G8SJJ.',
            zh: '由 BBa_266CQI7L、BBa_266RB3HX、BBa_26J0YWR7、BBa_26U5OU4I、BBa_26I4T75I、BBa_2624TRUA 与 BBa_267G8SJJ 组装。'
          },
          uses: ['BBa_266CQI7L', 'BBa_266RB3HX', 'BBa_26J0YWR7', 'BBa_26U5OU4I', 'BBa_26I4T75I', 'BBa_2624TRUA', 'BBa_267G8SJJ']
        }
      ]
    }
  ],

  /* 配套载体：不占注册元件数，仅说明这批元件的操作载体 */
  vectors: {
    en: 'These are the vectors the parts were handled in. They are not registered as Registry parts and are listed only so the constructs above can be rebuilt.',
    zh: '以下为上述元件在实验中所用的载体，未作为 Registry 元件登记，列出仅为便于复现构建过程。',
    items: [
      { en: 'pGADT7 (ZB56914)', zh: 'pGADT7（ZB56914）', fn: { en: 'Cloning backbone for the PAGER fusion gene.', zh: 'PAGER 融合基因的克隆骨架。' } },
      { en: 'pUC57', zh: 'pUC57', fn: { en: 'Delivery vector for the synthesised gene fragment.', zh: '合成基因片段的递送载体。' } },
      { en: 'pRS426', zh: 'pRS426', fn: { en: 'Yeast episomal vector.', zh: '酵母附加体型载体。' } },
      { en: 'pML104', zh: 'pML104', fn: { en: 'CRISPR-Cas9 yeast knockout plasmid carrying Cas9 and the sgRNA cassette.', zh: '携带 Cas9 与 sgRNA 表达盒的酵母 CRISPR-Cas9 敲除质粒。' } },
      { en: 'pESC-HIS', zh: 'pESC-HIS', fn: { en: 'Yeast reporter backbone carrying the <i>FUS1</i> reporter cassette.', zh: '承载 <i>FUS1</i> 报告盒的酵母报告骨架。' } },
      { en: 'pRS415', zh: 'pRS415', fn: { en: 'Yeast centromeric vector.', zh: '酵母着丝粒型载体。' } }
    ]
  },

  /* 参考来源：只列 Registry 条目里实际写明的出处，以及本站 Design 页已引的同一篇，
     不新增未在登记条目中出现过的文献。num 与正文角标一一对应；
     link 仅存档 DOI/NCBI 链接（溯源用），页面按 iGEM 要求不渲染外链。 */
  references: {
    en: 'Sources named in the Registry entries above, plus the one design reference already cited on our Design page.',
    items: [
      {
        num: 1,
        text: 'Komatsuzaki K, Murayama Y, Giambarella U, Ogata E, Seino S, Nishimoto I. A novel system that reports the G-proteins linked to a given receptor: a study of type 3 somatostatin receptor. FEBS Lett. 1997;406(1-2):165-70. doi:10.1016/s0014-5793(97)00266-4.',
        link: 'https://doi.org/10.1016/s0014-5793(97)00266-4'
      },
      {
        num: 2,
        text: 'NCBI RefSeq NC_001135.5 — <i>Saccharomyces cerevisiae</i> S288C chromosome III, the source of the <i>FUS1</i> upstream fragment.',
        link: 'https://www.ncbi.nlm.nih.gov/nuccore/NC_001135.5'
      },
      {
        num: 3,
        text: 'NCBI GenBank AQK76557.1 — <i>yEGFP</i> coding sequence from cloning vector pPC_040_GFP, the reference the <i>yEGFP</i> CDS entry was checked against.',
        link: 'https://www.ncbi.nlm.nih.gov/nuccore/AQK76557.1'
      },
      {
        num: 4,
        text: 'pML104 — the yeast CRISPR-Cas9 vector used throughout the chassis work, carrying the Cas9 expression cassette and the sgRNA cassette.',
        link: null
      }
    ]
  }
};

/* ────────────────────────────────────────────────────────────
   计数推导：只按「页面上会显示出来的条目」算，
   上文某条加了 hidden: true 之后这里自动跟着变，不需要手改任何数字。
   ──────────────────────────────────────────────────────────── */
const visibleGroups = data.modules.filter(function (g) {
  return g.parts.some(function (p) { return !p.hidden; });
});
const visibleParts = visibleGroups.reduce(function (acc, g) {
  return acc.concat(g.parts.filter(function (p) { return !p.hidden; }));
}, []);
const compositeCount = visibleParts.filter(function (p) { return !!p.uses; }).length;

data.overview.totalParts = visibleParts.length;
data.overview.groupCount = visibleGroups.length;
data.overview.compositeCount = compositeCount;
data.overview.basicCount = visibleParts.length - compositeCount;
data.overview.hasPending = visibleParts.some(function (p) { return !!p.pending; });

/* 页面分组：按 Registry 的 Basic / Composite 二分，不按项目模块。
   条目顺序沿用 modules 的排列（敲除 → GPA1 → 报告），但分组标题不出现模块名。 */
data.basicParts = visibleParts.filter(function (p) { return !p.uses; });
data.compositeParts = visibleParts.filter(function (p) { return !!p.uses; });
data.collections = [
  {
    id: 'basic',
    en: 'Basic Parts',
    desc: {
      en: 'The single units this project is built from — {{ n }} parts, each usable on its own or as the building block of one of the composites below.',
      zh: '本项目的基本单元——共 {{ n }} 条，可单独使用，也可作为下述复合元件的构件。'
    },
    parts: data.basicParts
  },
  {
    id: 'composite',
    en: 'Composite Parts',
    desc: {
      en: 'The {{ n }} assembled entries. Each one is a combination of parts from the section above or from the wider Registry, and each lists its components.',
      zh: '组装好的 {{ n }} 条。每条由上一节的元件或 Registry 中的其他元件组合而成，并各自列出组成。'
    },
    parts: data.compositeParts
  }
];
data.collections.forEach(function (c) {
  c.desc = {
    en: c.desc.en.replace('{{ n }}', String(c.parts.length)),
    zh: c.desc.zh.replace('{{ n }}', String(c.parts.length))
  };
});
data.overview.collectionCount = data.collections.length;

/* 页内锚点表：复合元件的「Composed of」里，凡本页面也收录的元件就跳页内，
   其余（既有 Registry 元件）才走外链。键统一为 Registry 的小写连写后缀。 */
data.localAnchors = {};
visibleParts.forEach(function (p) {
  data.localAnchors[p.slug] = 'parts-' + p.slug;
});

module.exports = data;
