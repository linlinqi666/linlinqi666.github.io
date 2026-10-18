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
 * - pending：Registry 仍为 Drafting 状态的两个元件（第 2、15 条），序列尚未公开
 * - hidden：暂时不在页面上列出的条目（见下方各条 ⚠ 说明）。改回 false 即恢复，
 *   计数、筛选与統計格由文件末尾按「可见条目」自动推导，不需要手改数字。
 *
 * 语言口径（2026-10-18 第五轮）：页面与站内 safety / result / model 等标准内容页一致，只出英文。
 *   数据源里的 zh 字段全部保留（本轮未同步更新，属上一版译文），日后若要恢复中文显示，
 *   先按 en 回填 zh 再把模板的 pair() 宏改回双语。
 *
 * ⚠ 暂存待定（2026-10-18 用户口径：有重复风险的先不放）：
 *   BBa_267ZCE19 · pML104 sgRNA 支架属公共序列，与他队同源登记撞车，是否算本队贡献待定
 *   BBa_26TMZ10V · Registry 判定与 BBa_K3221207 重复，仍为 Drafting，序列未公开
 *   BBa_26HNBAXY · Registry 判定与 BBa_K3939012 / BBa_K3112018 重复，仍为 Drafting，序列未公开
 *   三者均已下架；复合元件的 uses 链保留 Registry Construct 字段原样（含 BBa_267ZCE19）。
 * ⚠ 核验：底盘敲除目标为 FAR1 与 SST2 两个基因，本页与之对应；STE2 敲除仅存在于
 *   src/project/description.njk（该页尚未按现行方案更新，本次不动）。
 * ⚠ 核验：信号识别模块（α-factor 信号肽、MT1、抗 HA 纳米抗体、TEVcs、hM1Dq）未登记，
 *   故本页不出现该部分内容。
 */

const data = {
  overview: {
    intro: {
      en: 'This collection gathers the biological parts PAGER-Yeast contributed to the iGEM Registry. They cover the re-engineered <i>Saccharomyces cerevisiae</i> chassis, the humanised G-protein interface and the reporter that reads the pathway out; below they are listed the way the Registry itself classifies them, as basic parts and composite parts.',
      zh: '本页收录 PAGER-Yeast 向 iGEM Registry 提交的全部生物元件，覆盖改造 <i>Saccharomyces cerevisiae</i> 底盘、人源化 G 蛋白接口与读出通路的报告元件；下面按 Registry 自身的分类方式，分为基础元件与复合元件两组列出。'
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
      en: 'Parts for the recognition module itself are not part of this submission and therefore do not appear below.',
      zh: '识别模块本身的元件不在本次提交范围内，因此未出现在下表中。'
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
          // ⚠ 暂存待定：pML104 sgRNA 支架为公共序列，与他队同源登记撞车，是否列入本队清单待确认
          hidden: true,
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
          en: 'FAR1-targeting guide sequence (crRNA_FAR1_KO_up)',
          zh: 'FAR1 靶向向导序列（crRNA_FAR1_KO_up）',
          type: { en: 'Guide RNA', zh: '向导 RNA' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 20,
          fn: {
            en: 'A 20 bp guide sequence aimed at the FAR1/YJL157C locus of <i>Saccharomyces cerevisiae</i> BY4741. It carries the targeting information for a pML104-based SpCas9 sgRNA cassette, so a FAR1 knockout needs nothing beyond this spacer plus the shared scaffold; the adjacent TGG PAM sits outside the part and is not included here. FAR1 encodes the cell-cycle inhibitor that arrests G1 after pheromone stimulation, which is why removing it keeps the strain dividing through a long fluorescence read-out.',
            zh: '靶向 <i>Saccharomyces cerevisiae</i> BY4741 中 FAR1/YJL157C 位点的 20 bp 向导序列，为基于 pML104 的 SpCas9 sgRNA 表达盒提供靶向特异性，用于敲除 FAR1；相邻的 TGG PAM 不在本序列内。'
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
          en: 'FAR1 sgRNA expression cassette (SNR52p–guide–scaffold–SUP4t)',
          zh: 'FAR1 sgRNA 表达盒（SNR52p–向导–支架–SUP4t）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 388,
          fn: {
            en: 'A complete expression cassette that puts the FAR1 guide under RNA polymerase III control in yeast: the SNR52 promoter drives transcription, the 20 bp spacer confers specificity, the SpCas9 scaffold supplies the RNA structure Cas9 binds, and the SUP4 terminator ends the transcript. Together with the matching repair template it turns the target locus into a frameshift after a single Cas9 cut. The cassette is designed for the pML104 CRISPR-Cas9 system used throughout the chassis work.',
            zh: '由 RNA 聚合酶 III 驱动表达 FAR1 靶向 sgRNA 的表达盒：SNR52 启动子负责转录，向导序列决定特异性，支架提供 SpCas9 结合所需结构，SUP4 终止子界定转录本 3′ 边界。用于基于 pML104 的 FAR1/YJL157C 敲除。'
          },
          source: {
            en: 'Assembled from Registry parts plus a computationally designed FAR1 spacer.',
            zh: '由 Registry 既有元件与计算设计的 FAR1 间隔序列组装而成。'
          },
          uses: ['BBa_K2926004', 'BBa_262TZXV3', 'BBa_267ZCE19', 'BBa_K4278714']
        },
        {
          id: 'BBa_26HN2W3G',
          slug: 'bba-26hn2w3g',
          pending: false,
          en: 'FAR1 homology repair template (4 bp deletion, PAM mutated)',
          zh: 'FAR1 同源修复模板（4 bp 缺失 + PAM 突变）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 1142,
          fn: {
            en: 'The donor that repairs FAR1 once Cas9 has cut it. It carries 4 bp missing (CACT) inside the guide site GCGTCACGATCTCCACTTGG and a PAM changed from TGG to TAG, so the repaired chromosome is no longer recognised by the same guide. The short deletion shifts the reading frame and knocks the gene out; the PAM edit is the safeguard against a second cut. No foreign sequence and no selection marker are introduced, so the chassis stays marker-free apart from later integration steps.',
            zh: '用于 CRISPR-Cas9 破坏 <i>Saccharomyces cerevisiae</i> BY4741 中 FAR1 的线性同源修复模板。它在 GCGTCACGATCTCCACTTGG 靶位点内删去 4 bp（CACT），并把相邻 PAM 由 TGG 改为 TAG：缺失用来打断 FAR1 编码序列，PAM 突变用来阻止 Cas9 二次切割修复后的位点。不残留任何外源序列，也不带筛选标记。'
          },
          source: {
            en: 'S. cerevisiae FAR1 locus, modified with a 4 bp deletion and a PAM mutation on top of the CRISPR target GCGTCACGATCTCCACTTGG.',
            zh: '以酿酒酵母 FAR1 位点为底本，在靶序列 GCGTCACGATCTCCACTTGG 上做 4 bp 缺失与 PAM 突变。'
          }
        },
        {
          id: 'BBa_2658B1ZA',
          slug: 'bba-2658b1za',
          pending: false,
          en: 'SST2-targeting guide sequence (crRNA_SST2_KO)',
          zh: 'SST2 靶向向导序列（crRNA_SST2_KO）',
          type: { en: 'Guide RNA', zh: '向导 RNA' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 20,
          fn: {
            en: 'The SST2 counterpart of the FAR1 guide: 20 bp aimed at the SST2 locus of <i>Saccharomyces cerevisiae</i> BY4741 and used the same way in a pML104 sgRNA cassette. SST2 is the principal negative regulator of mating-pheromone signalling, so taking it out is what lifts the ceiling on how strongly the pathway can respond. The CGG PAM next to this target is not part of the part.',
            zh: '靶向 <i>Saccharomyces cerevisiae</i> BY4741 中 SST2 位点的 20 bp 向导序列，为基于 pML104 的 SpCas9 sgRNA 表达盒提供靶向特异性，用于敲除 SST2；对应的 CGG PAM 不在本序列内。'
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
          en: 'SST2 sgRNA expression cassette (SNR52p–guide–scaffold–SUP4t)',
          zh: 'SST2 sgRNA 表达盒（SNR52p–向导–支架–SUP4t）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 388,
          fn: {
            en: 'The SST2 twin of the FAR1 sgRNA cassette, built from the same four Registry parts in the same order — SNR52 promoter, SST2 spacer, SpCas9 scaffold, SUP4 terminator — for RNA polymerase III expression in yeast. Paired with the SST2 repair template it gives a frameshift knockout after one Cas9 cut, and because the scaffold is shared with the FAR1 cassette the two targets differ only in their 20 bp spacers.',
            zh: '由 RNA 聚合酶 III 驱动表达 SST2 靶向 sgRNA 的表达盒：SNR52 启动子负责转录，向导序列决定特异性，支架提供 SpCas9 结合所需结构，SUP4 终止子界定转录本 3′ 边界。用于基于 pML104 的 SST2 敲除。'
          },
          source: {
            en: 'Assembled from four Registry parts; the SST2 spacer was designed computationally from the <i>Saccharomyces cerevisiae</i> SST2 locus.',
            zh: '由四个 Registry 元件组装而成；SST2 间隔序列依据 <i>Saccharomyces cerevisiae</i> SST2 位点计算设计。'
          },
          uses: ['BBa_K2926004', 'BBa_2658B1ZA', 'BBa_267ZCE19', 'BBa_K4278714']
        },
        {
          id: 'BBa_262SR0ED',
          slug: 'bba-262sr0ed',
          pending: false,
          en: 'SST2 homology repair template (4 bp deletion, PAM mutated)',
          zh: 'SST2 同源修复模板（4 bp 缺失 + PAM 突变）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 989,
          fn: {
            en: 'The donor that repairs SST2 once Cas9 has cut it, mirroring the FAR1 template: 4 bp missing (TCTG) inside the target site TCGCCACGAGTTCTGTCCTG, and the adjacent PAM changed from CGG to CAG so the repaired locus is no longer a valid target. The deletion shifts the reading frame and knocks the gene out; the PAM edit makes a second cut unlikely. Nothing foreign and no selection marker are introduced.',
            zh: '用于 CRISPR-Cas9 破坏 <i>Saccharomyces cerevisiae</i> BY4741 中 SST2 位点的线性同源修复模板。它在 TCGCCACGAGTTCTGTCCTG 靶位点内删去 4 bp（TCTG），并把相邻 PAM 由 CGG 改为 CAG：缺失用来打断 SST2 编码序列，PAM 突变用来降低修复后被再次切割的概率。不残留任何外源序列，也不带筛选标记。'
          },
          source: {
            en: 'S. cerevisiae SST2 locus, modified with a 4 bp deletion and a PAM mutation on top of the CRISPR target TCGCCACGAGTTCTGTCCTG.',
            zh: '以酿酒酵母 SST2 位点为底本，在靶序列 TCGCCACGAGTTCTGTCCTG 上做 4 bp 缺失与 PAM 突变。'
          }
        }
      ]
    },

    {
      id: 'gpa1-humanisation',
      en: 'GPA1 Humanisation',
      zh: 'GPA1 人源化改造元件',
      desc: {
        en: 'Two homology arms, the five-residue swap itself, and the donor cassette that puts them together. Used as a set, they replace the last five residues of Gpa1p so a heterologous receptor has something to couple to.',
        zh: '两条同源臂、待替换的五残基片段，以及把三者串起来的供体盒。整套使用，把 Gpa1p 末端五个残基换掉，让异源受体能与之偶联。'
      },
      parts: [
        {
          id: 'BBa_26HUBYAY',
          slug: 'bba-26hubyay',
          pending: false,
          en: 'GPA1 upstream homology arm',
          zh: 'GPA1 上游同源臂',
          type: { en: 'Homologous region', zh: '同源重组臂' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 500,
          fn: {
            en: '500 bp taken from directly upstream of GPA1/YHR005C. Its only job is to be recognised: <i>Saccharomyces cerevisiae</i> recombines where the sequence matches, so this arm is what delivers the replacement to the right place on chromosome VIII. It pairs with the downstream arm to bracket the region being rewritten.',
            zh: '取自 GPA1/YHR005C 上游基因组区域的 500 bp 同源臂，用于把供体盒锚定到该位点，使同源重组把人源化 GPA1 C 端与 URA3 筛选盒换入基因组。'
          },
          source: {
            en: 'The GPA1/YHR005C locus on chromosome VIII of <i>Saccharomyces cerevisiae</i> S288C.',
            zh: '<i>Saccharomyces cerevisiae</i> S288C 八号染色体上的 GPA1/YHR005C 位点。'
          }
        },
        {
          id: 'BBa_26EG2LOR',
          slug: 'bba-26eg2lor',
          pending: false,
          en: 'GPA1 C-terminal Gαq-derived EYNLV sequence with stop codon',
          zh: 'GPA1 C 端人源化片段（EYNLV + 终止密码子）',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 18,
          fn: {
            en: 'The 18 bp at the centre of the swap: five Gαq-derived residues, EYNLV, followed by a stop codon. The C-terminus of a Gα protein is what decides which receptor it can work with, so replacing the yeast KIGII with this sequence is the whole point of the humanisation step. The design follows the Gαq chimera reported by Komatsuzaki and colleagues (1997).',
            zh: '长 18 bp 的工程化序列，编码源自 Gαq 的五个残基 EYNLV 并带终止密码子。它替掉 <i>Saccharomyces cerevisiae</i> Gpa1p 末端五个残基，目的是改善异源受体与交配信号通路的偶联。'
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
          en: 'GPA1 downstream homology arm',
          zh: 'GPA1 下游同源臂',
          type: { en: 'Homologous region', zh: '同源重组臂' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 500,
          fn: {
            en: '500 bp from the region downstream of GPA1/YHR005C, closing the other side of the target. Together with the upstream arm it defines exactly which stretch of the locus is replaced, so the edited allele carries the humanised C-terminus and nothing else from the original sequence.',
            zh: '取自 GPA1/YHR005C 下游基因组区域的 500 bp 同源臂。它与上游臂一起界定替换区间，使同源重组把天然 GPA1 C 端换成人源化 Gαq 序列连同 URA3 筛选盒。'
          },
          source: {
            en: 'The genomic region downstream of the GPA1/YHR005C locus on chromosome VIII of <i>Saccharomyces cerevisiae</i> S288C.',
            zh: '<i>Saccharomyces cerevisiae</i> S288C 八号染色体上 GPA1/YHR005C 位点下游的基因组区域。'
          }
        },
        {
          id: 'BBa_266K1VDV',
          slug: 'bba-266k1vdv',
          pending: false,
          en: 'GPA1 C-terminal humanisation cassette with URA3 selection marker',
          zh: '带 URA3 筛选标记的 GPA1 C 端人源化盒',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 2280,
          fn: {
            en: 'The complete donor cassette for editing GPA1 in a single transformation. Running in order: the upstream homology arm, the humanised EYNLV sequence, the URA3 promoter, the URA3 gene, the URA3 terminator, a short connecting sequence, and the downstream homology arm. In BY4741, which is ura3 auxotrophic, the embedded URA3 cassette is what lets transformants be recovered on uracil-deficient medium, while the flanking arms alone decide where the construct lands.',
            zh: '用于 GPA1/YHR005C 位点同源重组的线性供体盒，依次为：上游同源臂、人源化 EYNLV 序列、URA3 启动子、URA3 基因、URA3 终止子、一段连接序列、下游同源臂。两侧同源臂负责在靶位点整合，URA3 盒负责转化子筛选。'
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
          // ⚠ 暂存待定：Registry 判定与 BBa_K3939012 / BBa_K3112018 重复且仍为 Drafting；复合件 BBa_266K1VDV 已改用 BBa_K3939012
          hidden: true,
          pending: true,
          en: 'URA3 promoter for yeast selection',
          zh: '用于酵母筛选的 URA3 启动子',
          type: { en: 'Promoter', zh: '启动子' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 221,
          fn: {
            en: 'A <i>Saccharomyces cerevisiae</i> URA3 promoter that drives the URA3 selectable marker. Inside the GPA1 humanisation donor cassette it sits just upstream of the URA3 coding sequence, so that cells carrying the replacement can be picked out on uracil-deficient medium.',
            zh: '<i>Saccharomyces cerevisiae</i> 的 URA3 启动子，负责驱动 URA3 筛选标记表达。在 GPA1 人源化供体盒中它紧邻 URA3 编码序列上游，使完成替换的细胞能在缺尿嘧啶培养基上被筛出。'
          },
          source: {
            en: 'S. cerevisiae URA3 promoter derived from pRS426.',
            zh: '取自 pRS426 的酿酒酵母 URA3 启动子。'
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
          en: 'FUS1 promoter (435 bp)',
          zh: 'FUS1 启动子（435 bp）',
          type: { en: 'Promoter', zh: '启动子' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 435,
          fn: {
            en: 'A 435 bp fragment of the FUS1 upstream region from <i>Saccharomyces cerevisiae</i> S288C. FUS1 is one of the genes the mating pathway switches on, which makes its promoter a convenient readout: whatever activates the cascade upstream ends up written out here as transcription. This part is the promoter only — no reporter, no terminator, no backbone — so it can be paired with whichever output a construct needs.',
            zh: '取自 <i>Saccharomyces cerevisiae</i> S288C 的 435 bp FUS1 上游片段，用于在交配信息素通路被激活后驱动下游基因转录。它自身不含报告基因、终止子与骨架，实际表达量取决于宿主基因型与所处表达环境；本项目分别以 yEGFP 与 MEL1 作为两种备选下游报告。'
          },
          source: {
            en: '<i>Saccharomyces cerevisiae</i> S288C chromosome III, NCBI RefSeq NC_001135.5, positions 71,368–71,802 on the forward strand.',
            zh: '<i>Saccharomyces cerevisiae</i> S288C 三号染色体，NCBI RefSeq NC_001135.5，正链第 71,368–71,802 位。'
          }
        },
        {
          id: 'BBa_26TMZ10V',
          slug: 'bba-26tmz10v',
          // ⚠ 暂存待定：Registry 判定与 BBa_K3221207 重复且仍为 Drafting；复合件 BBa_26D8D1SG 已改用 BBa_K3221207
          hidden: true,
          pending: true,
          en: 'yEGFP coding sequence (yeast-optimised EGFP)',
          zh: 'yEGFP 编码序列（酵母优化型增强绿荧光蛋白）',
          type: { en: 'Coding sequence', zh: '编码序列' },
          composition: { en: 'Basic part', zh: '基础元件' },
          length: 717,
          fn: {
            en: 'The coding sequence of yeast-optimised enhanced green fluorescent protein. Transcribed and translated in <i>Saccharomyces cerevisiae</i> it gives enhanced GFP, which fluoresces green on excitation. The part is meant as a fluorescence read-out placed behind an inducible promoter such as the FUS1 promoter in yeast biosensor constructs, and it carries no promoter, terminator or backbone.',
            zh: '酵母优化型增强绿荧光蛋白的编码序列。在 <i>Saccharomyces cerevisiae</i> 中转录翻译后产生增强型 GFP，激发时发出绿色荧光。该元件用作读数模块，放在酵母生物传感器构建体中 FUS1 等诱导型启动子之后；不含启动子、终止子与载体骨架。'
          },
          source: {
            en: 'GenBank: AQK76557.1 (yEGFP, cloning vector pPC_040_GFP); the sequence was retrieved and checked in SnapGene.',
            zh: 'GenBank：AQK76557.1（yEGFP，克隆载体 pPC_040_GFP）；序列经 SnapGene 调取与核对。'
          }
        },
        {
          id: 'BBa_26D8D1SG',
          slug: 'bba-26d8d1sg',
          pending: false,
          en: 'FUS1 promoter–yEGFP reporter fragment',
          zh: 'FUS1 启动子–yEGFP 报告片段',
          type: { en: 'Engineered region', zh: '工程化区域' },
          composition: { en: 'Composite part', zh: '复合元件' },
          length: 1152,
          fn: {
            en: 'A composite reporter that pairs the FUS1 promoter with the yEGFP reporter CDS. The promoter answers to the yeast mating-response MAPK cascade, so once the pathway is active it drives yEGFP transcription and translation and the cell fluoresces green. It is the output module used to characterise both the re-engineered chassis and the humanised G-protein interface.',
            zh: '把 FUS1 启动子与 yEGFP 编码序列接在一起的复合报告元件。该启动子受酵母交配应答 MAPK 级联调控，通路一旦激活即驱动 yEGFP 转录翻译，细胞发出绿色荧光。'
          },
          source: {
            en: 'Assembled from the truncated FUS1 promoter BBa_26J53MF4 and the yEGFP reporter CDS.',
            zh: '由截短 FUS1 启动子 BBa_26J53MF4 与 yEGFP 报告基因 CDS 组装而成。'
          },
          uses: ['BBa_26J53MF4', 'BBa_K3221207']
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
      { en: 'pESC-HIS', zh: 'pESC-HIS', fn: { en: 'Yeast reporter backbone carrying the FUS1 reporter cassette.', zh: '承载 FUS1 报告盒的酵母报告骨架。' } },
      { en: 'pRS415', zh: 'pRS415', fn: { en: 'Yeast centromeric vector.', zh: '酵母着丝粒型载体。' } }
    ]
  },

  /* 参考来源：只列 Registry 条目里实际写明的出处，以及本站 Design 页已引的同一篇，
     不新增未在登记条目中出现过的文献。 */
  references: {
    en: 'Sources named in the Registry entries above, plus the one design reference already cited on our Design page.',
    items: [
      {
        key: 'komatsuzaki',
        text: 'Komatsuzaki K, Murayama Y, Giambarella U, Ogata E, Seino S, Nishimoto I. A novel system that reports the G-proteins linked to a given receptor: a study of type 3 somatostatin receptor. FEBS Lett. 1997;406(1-2):165-70. doi:10.1016/s0014-5793(97)00266-4.'
      },
      {
        key: 'refseq',
        text: 'NCBI RefSeq NC_001135.5 — <i>Saccharomyces cerevisiae</i> S288C chromosome III, the source of the FUS1 upstream fragment.'
      },
      {
        key: 'genbank',
        text: 'NCBI GenBank AQK76557.1 — yEGFP coding sequence from cloning vector pPC_040_GFP, the reference the yEGFP CDS entry was checked against.'
      },
      {
        key: 'pml104',
        text: 'pML104 — the yeast CRISPR-Cas9 vector used throughout the chassis work, carrying the Cas9 expression cassette and the sgRNA cassette.'
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
