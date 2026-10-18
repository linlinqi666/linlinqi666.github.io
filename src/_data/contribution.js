// Contribution 页内容数据（英文单语）
// 结构依据：static/expriments/The extreme/contribution/output/13-Contribution页面撰写大纲.md（本队撰写大纲）
// 与 output/15-Contribution页面内容大纲.md、output/contribution-{底盘,信号识别,GPA1,报告体系}.docx。
// 五个大目录：1 Protocol（6 套）→ 2 Parts（4 件）→ 3 Model（4 条）→ 4 HP（4 条）→ 5 Troubleshooting（6 条）
// 写法：不设统一字段表，条目按内容分量决定长度；每条都交代做到了哪一步、以及别人拿到能用在哪。
// 第三方序列与设计（MT1、anti-H1N1_HA 纳米抗体、hM1Dq、Gαq C 端嵌合体、pML104）在对应条目内署名。
// 每个大节末尾挂一条本队对应页面链接，小目录不再单独挂链接。

module.exports = {
  nav: [
    { id: 'contribution-overview', en: 'Overview' },
    {
      id: 'contribution-protocols',
      en: '1. Protocols',
      children: [
        { id: 'protocol-pager-chain', en: 'PAGER receptor: cloning to read-out' },
        { id: 'protocol-crispr', en: 'Yeast CRISPR-Cas9 knockout' },
        { id: 'protocol-donor', en: 'Two routes to a long donor' },
        { id: 'protocol-gradient', en: 'Three read-outs, one gradient' },
        { id: 'protocol-colony-pcr', en: 'Fast colony PCR screen' },
        { id: 'protocol-yeast-plasmid', en: 'Yeast plasmid extraction' }
      ]
    },
    {
      id: 'contribution-parts',
      en: '2. Parts',
      children: [
        { id: 'parts-pager', en: 'PAGER recognition fusion receptor' },
        { id: 'parts-gpa1', en: 'Humanised Gpa1 interface strains' },
        { id: 'parts-deltafar1', en: 'Δfar1 chassis strain' },
        { id: 'parts-reporter', en: 'FUS1 promoter reporter cassette' }
      ]
    },
    {
      id: 'contribution-model',
      en: '3. Model',
      children: [
        { id: 'model-screening', en: 'Seventeen candidates, one lead' },
        { id: 'model-gating', en: 'Both gating interfaces' },
        { id: 'model-hotspot', en: 'One hotspot, one hypothesis' },
        { id: 'model-reproducibility', en: 'The pipeline as files' }
      ]
    },
    {
      id: 'contribution-hp',
      en: '4. Human Practices',
      children: [
        { id: 'hp-yeast-workshop', en: 'The yeast workshop' },
        { id: 'hp-apic', en: 'A card exercise others can run' },
        { id: 'hp-southchina', en: 'South China Meetup' },
        { id: 'hp-together', en: 'Together with iGEM' }
      ]
    },
    {
      id: 'contribution-troubleshooting',
      en: '5. Troubleshooting',
      children: [
        { id: 'ts-cloning', en: 'No colonies at six concentrations' },
        { id: 'ts-donor', en: 'Mismatches after 500 bp' },
        { id: 'ts-western', en: 'Western blot at 40 kD' },
        { id: 'ts-sst2', en: 'SST2: ten clones, no knockout' },
        { id: 'ts-immuno', en: 'Immunofluorescence showed nothing' },
        { id: 'ts-ratio', en: 'A260/280 of 2.848 and 3.800' }
      ]
    }
  ],

  cards: [
    // ============ 概览 ============
    {
      id: 'contribution-overview',
      section: true,
      title: { en: 'Contribution' },
      summary: {
        en: 'Six protocol sets, four parts, a modelling pipeline, four team exchanges, and six records of where we got stuck.'
      },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'iGEM asks two things of this page: document the contribution, and explain why it is a contribution to fellow iGEMers. There is no fixed definition. The examples given are new or improved parts, software or tools, optimised protocols, and anything else with a clear benefit to later teams.'
          }
        },
        {
          type: 'p',
          cls: 'content-intro',
          text: {
            en: 'Everything below is something we actually did, and every entry says how far it got. Section 5 is the part we would read first if we were starting again: six things that did not work. This page does not report detection sensitivity, specificity or limits of detection, because we have not measured them.'
          }
        }
      ]
    },

    // ============ 1. Protocols ============
    {
      id: 'contribution-protocols',
      section: true,
      title: { en: '1. Protocols' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Six sets, all written from our own runs. Three belong to the gating chain: getting a membrane receptor to appear in yeast, editing the chassis underneath it, and reading the pathway out. The other three are the small ones that keep a large batch of clones moving.'
          }
        }
      ]
    },

    {
      id: 'protocol-pager-chain',
      title: { en: '1.1 PAGER receptor: cloning to read-out' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'The hard part of a yeast receptor project is not the design. It is making the protein appear, proving it did, and then getting a signal out of it. This set walks the whole way: pGADT7 into <i>Escherichia coli</i>, plasmid prep, double digest, yeast transformation, plasmid recovery from yeast, colony PCR, Western blot, immunofluorescence, and the DCZ read on a plate reader.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Temperatures, times, enzyme amounts, cell-wall lysis conditions and the DCZ working gradient sit at the step they belong to. Snail enzyme and lyticase are not interchangeable here, and the difference is written where it matters rather than collected in a notes section at the end.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Where it got to. The cloning chain closed: a 472 bp one-step product, a 689 bp colony PCR band, transformation worked. The protein layer did not close. The blot band sits near 60 kD with a lot of non-specific signal, immunofluorescence came back negative, and the plate read-out exists only as photographs. Treat the first half as working and the second half as a starting point.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'It is on the Protocol page as Protocols 6, 13, 17, 18, 20, 21 and 22, and in the 47-page handbook.'
          }
        }
      ]
    },

    {
      id: 'protocol-crispr',
      title: { en: '1.2 Yeast CRISPR-Cas9 knockout' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'A complete knockout in BY4741: plasmid prep from pML104, inverse PCR for the sgRNA, two rounds of fusion PCR for the repair template, competent cells, transformation, colony PCR, sequencing, and an α-factor gradient check at the end. The repair template is two arms of 658 and 528 bp fused into a 1146 bp product over 40 bp of overlap. pML104 came from Addgene #67638.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Every number is fixed, so it can be followed as written. The sentence that matters most is a judgement rather than a parameter: a missing colony PCR band does not mean the knockout worked, because the band can also be missing because the PCR failed. Sequencing decides. Read the gel as the result and you will eventually report a knockout you do not have.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'FAR1 came out; SST2 did not, in ten clones. One gene working does not make a protocol universal, and the reverse primer sequence is missing from the source record, so that gap is left visible. Protocol 19 on the Protocol page carries the flow; the arm lengths and overlap are in the chassis module record.'
          }
        }
      ]
    },

    {
      id: 'protocol-donor',
      title: { en: '1.3 Two routes to a long donor' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'We built the Gpa1 donor twice, and the first route lost. Route one: build a circular plasmid on pRS426, then release the fragment by PCR. Route two: multi-fragment fusion PCR, three products joined by their terminal overlaps.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The two routes fail in different places, which is why keeping both is worth more than keeping the winner. Route one accumulates mismatches over repeated long PCR and tends to fail at the in-vivo step. Route two is short, but has to be repeated every time. A team can now choose by fragment length instead of by trial.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Sequencing rejected route one, and the source record calls its feasibility poor. It is written that way here rather than softened into "needs optimisation". Route two produced the fragment and gave strains 12 and 17. Protocol 8 on overlap extension PCR is the relevant page; the route comparison stays with the Gpa1 module record.'
          }
        }
      ]
    },

    {
      id: 'protocol-gradient',
      title: { en: '1.4 Three read-outs, one gradient' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'One α-factor series, eight points from 24 down to 0 μM, read three ways at once: MEL1 with X-α-gal blue-white development over time, yEGFP fluorescence in a black 96-well plate at 488/507 nm normalised to OD<sub>600</sub>, and an OD<sub>600</sub> growth curve to see whether the inducer is suppressing growth on its own.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Time points, replication and controls are already specified, so the template transfers to another induction system without redesign. Three things to know before reusing it:'
          }
        },
        {
          type: 'bullets',
          items: [
            { en: 'The α-factor scale is in the tens of μM, which is 10<sup>3</sup> to 10<sup>4</sup> above the nM range usually quoted. It still needs checking and should not be copied into a figure as if it were a standard curve.' },
            { en: 'MEL1 and lacZ are not interchangeable. A number from one does not mean the same thing in the other.' },
            { en: 'Replicate numbers for schemes 01 to 03 are missing from the record.' }
          ]
        },
        {
          type: 'p',
          text: {
            en: 'Protocols 14, 25 and 26 on the Protocol page.'
          }
        }
      ]
    },

    {
      id: 'protocol-colony-pcr',
      title: { en: '1.5 Fast colony PCR screen' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'NaOH lysis in 10 μL, 98 °C for 3 minutes and 4 °C for 2 minutes over five cycles. Built for the first pass over dozens of candidates, before committing to culture and plasmid prep.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'It is a screen and not a verdict, which is why it sits next to 1.2 rather than replacing the sequencing step there. Its false-negative rate has not been measured. Protocols 6 and 13 on the Protocol page.'
          }
        }
      ]
    },

    {
      id: 'protocol-yeast-plasmid',
      title: { en: '1.6 Yeast plasmid extraction' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Snail enzyme lysis at 37 °C for 3 hours, lysis held under 3 minutes, elution with buffer pre-warmed to 60 °C, written for plasmids near 10 kb.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Conditions that carry a 5 kb bacterial plasmid lose a 10 kb yeast plasmid, and the elution temperature accounts for most of the difference. Some of our batches gave A260/280 of 2.848 and 3.800, well above the ~1.8 that pure DNA should show; another gave 1.289, low enough to suggest protein carryover. The numbers are recorded without an explanation. Protocol 23 on the Protocol page.'
          }
        },
        {
          type: 'links',
          cls: 'link-list--section-end',
          items: [
            { href: '../wet-lab/protocol.html', en: 'All 26 protocols and the 47-page handbook PDF — Protocol page' }
          ]
        }
      ]
    },

    // ============ 2. Parts ============
    {
      id: 'contribution-parts',
      section: true,
      title: { en: '2. Parts' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Four things we built. Two carry sequences that are not ours, and those are named where they appear instead of being left implicit. Registry numbers and repository links are not listed here because submission is still open; the Parts page carries the registered elements.'
          }
        }
      ]
    },

    {
      id: 'parts-pager',
      title: { en: '2.1 PAGER recognition fusion receptor' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'The PAGER fusion receptor, cloned in pGADT7 and ordered: α-factor signal peptide, (GGGS)<sub>3</sub> linker, MT1 inhibitory toxin, (GGGS)<sub>3</sub> linker, anti-H1N1_HA nanobody, TEV cleavage site, hM1Dq human DREADD receptor.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The point of it is the joint, not the sequence. Recognition sits at one end and the output interface at the other, so replacing the nanobody retargets the whole receptor to another antigen without touching the fusion architecture or the vector. That is the piece worth borrowing, even by a project that looks nothing like ours.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Where it got to: cloning closed, protein and function open. A 472 bp one-step product and a successful yeast transformation on one side; a blot band near 60 kD full of non-specific signal, and a DCZ plate read-out that exists only as images, on the other.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'MT1 and the anti-H1N1_HA nanobody are third-party sequences. Their source and licence have to be confirmed before any Registry submission, and neither is ours to hand on quietly. hM1Dq is the human DREADD receptor.'
          }
        }
      ]
    },

    {
      id: 'parts-gpa1',
      title: { en: '2.2 Humanised Gpa1 interface strains' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Five residues, KIGII to EYNLV, with a stop codon behind them, URA3 marker, in BY4741. Strains 12 and 17 match the design exactly by sequencing. The swap follows the Gαq C-terminal chimera reported by Komatsuzaki and colleagues in 1997, and that is stated in the record rather than absorbed into "our construct".'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The C-terminus decides which receptor a Gα subunit can couple to. If a project needs a human GPCR to talk to the yeast mating pathway, this is the interface, and section 1.3 shows both ways of building the donor including the one that lost.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'What we can say: both strains match the design, and three phenotype layers, morphology, growth and fluorescence, point the same way, with the α-factor response weaker after the swap. What we cannot say: that the pathway coupling works. A weaker α-factor response is not evidence of sensing function, and the source record does not settle whether route two counts as a success. The background is recorded as BY4741 in most places and S288C in the materials section; that conflict is still open.'
          }
        }
      ]
    },

    {
      id: 'parts-deltafar1',
      title: { en: '2.3 Δfar1 chassis strain' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'BY4741, <code>MATa his3Δ1 leu2Δ0 met15Δ0 ura3Δ0</code>, FAR1 removed by CRISPR/Cas9. Clones F2 and F10 carry the 4 bp deletion that shifts the reading frame, confirmed by sequencing.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Every yeast monitoring project meets the same wall: pheromone signalling arrests the cell cycle and the culture stops dividing, which is fatal for a device meant to keep reporting. Removing FAR1 lifts that, and starting from this strain skips designing sgRNA, homology arms and a clone screen. One thing to be clear about: SST2 was not knocked out. All ten clones kept the band, the line was dropped, and this strain carries no SST2 edit. pML104 came from Addgene #67638.'
          }
        }
      ]
    },

    {
      id: 'parts-reporter',
      title: { en: '2.4 FUS1 promoter reporter cassette' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'A FUS1 promoter driving a reporter, on pESC-HIS with 40 bp homology arms, in two versions that do not have data yet: MEL1 with X-α-gal blue-white screening, and yEGFP with plate-reader fluorescence.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Six schemes exist with expected outcomes and nothing measured. The two read-out systems are not interchangeable and the project has not settled which is primary, so both are kept. What can be borrowed now is the skeleton and the scheme design, not a characterised part. Designed by this team; the PRE1/PRE2 promoter library scheme stays with the reporter module record.'
          }
        },
        {
          type: 'links',
          cls: 'link-list--section-end',
          items: [
            { href: '../wet-lab/parts.html', en: 'Registered elements, sequences and Registry links — Parts page' }
          ]
        }
      ]
    },

    // ============ 3. Model ============
    {
      id: 'contribution-model',
      section: true,
      title: { en: '3. Model' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Computational from end to end, which makes it the part another team can run without a lab. Three outputs: a docking pipeline that narrows a candidate panel, an atomic-level account of how the gating peptides sit on their receptors, and the files that reproduce both.'
          }
        }
      ]
    },

    {
      id: 'model-screening',
      title: { en: '3.1 Seventeen candidates, one lead' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Screening a nanobody panel costs reagent and weeks. We replaced the first pass with two docking stages, a rigid ClusPro sweep over the whole panel and HADDOCK 2.5 semi-flexible refinement on what survived, and added a specificity index so that H1N1-selective binders separate from cross-reactive ones instead of everything ranking by docking score. Seventeen candidates became one lead, R1aB6, with no binding assay run.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'A team with a panel and no structures can repeat this on predicted models and order a shortlist instead of a library. The specificity index is the part worth taking, because without it the ranking collapses back into "best score wins", which is how cross-reactive binders get ordered. No binding assay has confirmed the ranking; the Model page carries the inputs and parameters.'
          }
        }
      ]
    },

    {
      id: 'model-gating',
      title: { en: '3.2 Both gating interfaces' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'An inhibitory-peptide gate only works if blocking the outside leaves the inside intact. We tested that on both systems: hM1Dq with the MT1 peptide and Ste2p with MT1_5, each membrane-aligned before docking, refined in HADDOCK, then run through CHARMM-GUI membrane building, 100 ns GROMACS dynamics, SPICE interface analysis and gmx_MMPBSA. Both come out the same way, with the peptide in the orthosteric site and the intracellular G-protein interface left free.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'That is a check on an assumption, not a demonstration of gating in cells, and it is written as the former. The workflow is the reusable part: it transfers to any receptor and peptide pair, including ones with no experimental structure. Path A and Path B on the Model page.'
          }
        }
      ]
    },

    {
      id: 'model-hotspot',
      title: { en: '3.3 One hotspot, one hypothesis' },
      blocks: [
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
        }
      ]
    },

    {
      id: 'model-reproducibility',
      title: { en: '3.4 The pipeline as files' },
      blocks: [
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
            { href: '../dry-lab/model.html', en: 'The full modelling record, parameters and results — Model page' }
          ]
        }
      ]
    },

    // ============ 4. Human Practices ============
    {
      id: 'contribution-hp',
      section: true,
      title: { en: '4. Human Practices — working with other teams' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Only the exchanges between teams: what we learned, what we gave back, and the two formats we built that another team could run itself. The interviews, the survey and the education work are on the Integrated Human Practices page.'
          }
        }
      ]
    },

    {
      id: 'hp-yeast-workshop',
      title: { en: '4.1 The yeast workshop' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'CAU-China called a themed online meeting for teams doing yeast chassis engineering. Six came: CAU-China, NEFU-China, SZPU-China, Keystone, NKU and SHSID. Each reported its design and its blockers, then the discussion went to transformation efficiency, knockout, reporter leak, membrane protein expression and biosafety.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'What we gave. CAU-China asked why CRISPR-Cas9 rather than homologous recombination, and how long a round takes. The answer came with a trap worth passing on: when the linear fragment and the CRISPR plasmid go in together, the fragment can circularise on its own and finish the knockout by homologous recombination. A frameshift at the target site therefore does not prove that Cas9 cut. Read the sequencing result as proof and you will eventually report an edit you cannot attribute.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'What we took. Low transformation efficiency, unstable auxotrophic selection, low CRISPR success rates, high reporter background: the same five problems in six labs. That changed how we read our own failures, and the practical notes, longer homology arms, more fragment, direct PCR recovery when the bands are clean, went into section 1.2. Recorded on the Human Practices page under the Online Yeast Workshop.'
          }
        }
      ]
    },

    {
      id: 'hp-apic',
      title: { en: '4.2 A card exercise others can run' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'APiC, the first Asia-Pacific iGEM Community Conference, hosted by SUSTech and HKU, gave us a table. We used it for something other than a poster: the iGEM Project Prism Program, fifteen cards, one per special award, ten questions on the back of each.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The exercise is mechanical on purpose. Pick the two cards that match where your project actually stands. Read all ten questions. Check the award criteria against past winning wikis and judges comments. Answer every question against your own evidence. Report back in a few sentences. The proposal and the step-by-step note were written in Chinese and English so visiting teams could follow without a translator.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'It is a format rather than a report, which is why it belongs here. Five award tracks came back filled in and the questions and answers are recorded on the Human Practices page. The card set and the process note can be reused at any meetup; that was the point of writing them down.'
          }
        }
      ]
    },

    {
      id: 'hp-southchina',
      title: { en: '4.3 South China Meetup' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'We presented the project from chassis to read-out at the South China meetup and then sat through a mock review. The questions are the output, and they came in four groups: response time, pathway validation and virus concentration thresholds; model calculations, cost control and chassis replacement; where a device would sit, data coverage in a large space, and home self-testing; and the standing two, advantage over existing methods and biosafety approval.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Collected in one place, that is a rehearsal set for any yeast biosensor defence, which is what it was for us. They are questions, not answers. Human Practices page, South China Meetup section.'
          }
        }
      ]
    },

    {
      id: 'hp-together',
      title: { en: '4.4 Together with iGEM' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'JLU-FBH (Jilin University) edited <em>Together with iGEM</em>, a handbook in which each team takes one common misconception about synthetic biology and explains why it misleads. Seventeen teams contributed; JLU-FBH collected, organised and laid it out. Our six entries are all on influenza A, two of them on the design itself: that environmental monitoring complements clinical testing rather than competing with it, and that engineered yeast is not a pathogen and can run safely inside a sealed device.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'It is a model for a multi-team publication that needs no laboratory, and the six entries are reusable public-communication text on influenza A. The full PDF is embedded on the Human Practices page.'
          }
        },
        {
          type: 'links',
          cls: 'link-list--section-end',
          items: [
            { href: '../human-practices/integrated human-practices.html', en: 'The full exchange records — Integrated Human Practices page' }
          ]
        }
      ]
    },

    // ============ 5. Troubleshooting ============
    {
      id: 'contribution-troubleshooting',
      section: true,
      title: { en: '5. Troubleshooting' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Six places where we stopped. Each gives what we saw, what we concluded at the time, and what we did next. Three of them are not good news. They are here because when a team hits the same phenomenon, knowing that someone else also stopped there is worth more than knowing everything went smoothly for us.'
          }
        }
      ]
    },

    {
      id: 'ts-cloning',
      title: { en: '5.1 No colonies at six concentrations' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'The one-step cloning product went into <i>Escherichia coli</i> at six plating concentrations. Not one target colony.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The assembly itself had worked, since the verification PCR gave the expected band, so the failure was in the transformation. The positive-control plate grew something we judged to be contaminant, which made the control worthless. We stopped repeating the transformation, skipped recovering the intermediate plasmid in cells, and used the reaction mixture directly as template for the next step.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'The transferable part is the rule rather than the failure: once assembly is confirmed in vitro, stop trying to get the intermediate plasmid back out of cells.'
          }
        }
      ]
    },

    {
      id: 'ts-donor',
      title: { en: '5.2 Mismatches after 500 bp' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Sequencing the linear donor showed heavy mismatching past 500 bp.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Repeated rounds of long-fragment PCR accumulate mutations. Compounding it, no second primer set had been designed for the 2289 bp fragment, so one primer pair gave 800 to 1000 bp of usable read and the rest of the fragment was never covered. The route was judged poor in feasibility and dropped for fusion PCR.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Two criteria come out of it: when to stop building a plasmid and go plasmid-free, and the reminder that a single primer pair will not verify a fragment of this length however clean the gel looks.'
          }
        }
      ]
    },

    {
      id: 'ts-western',
      title: { en: '5.3 Western blot at 40 kD' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'We expected a little over 60 kD and measured near 40 kD. Not resolved at the time, recorded as it happened. Later batches moved the band nearer 60 kD, with a lot of non-specific signal still in the lane.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'A weight shift on a yeast membrane protein has several causes and is common. Seeing that another team hit it and did not clear it on the first pass makes it less likely to be read as a successful expression result, and pushes the next check toward lysis and antibody before anything else. Protocol 18 on the Protocol page.'
          }
        }
      ]
    },

    {
      id: 'ts-sst2',
      title: { en: '5.4 SST2: ten clones, no knockout' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'For SST2, clones S1 through S10 all produced a band. The knockout did not happen. The record is kept and the line was dropped.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Ten clean negatives are data. Anyone attempting the same target now knows it did not fall over here, which is worth knowing before a season goes into it, and it is why the Δfar1 strain in section 2.3 is described without an SST2 edit. The chassis module record holds this; the FAR1 half is Protocol 19.'
          }
        }
      ]
    },

    {
      id: 'ts-immuno',
      title: { en: '5.5 Immunofluorescence showed nothing' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Samples 1 to 4 and the negative control all showed no clear fluorescence. Recorded as it stands.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Negative imaging results rarely get written down, which makes them look like operator error when they happen to you. Having one on record lets the next team compare instead of assume, and it is why section 1.1 pairs the blot with localisation rather than treating one as a proxy for the other. Protocol 17 on the Protocol page.'
          }
        }
      ]
    },

    {
      id: 'ts-ratio',
      title: { en: '5.6 A260/280 of 2.848 and 3.800' },
      blocks: [
        {
          type: 'p',
          text: {
            en: 'Some yeast plasmid batches gave A260/280 of 2.848 and 3.800. Pure DNA sits near 1.8, so anything above 2.0 does not mean much. Another batch gave 1.289, low enough to suggest protein carryover. The source record notes the values without interpreting them.'
          }
        },
        {
          type: 'p',
          text: {
            en: 'Read the ratio before trusting the yield. Two batches failing in opposite directions under one protocol says the variance is in the execution rather than the recipe, which is a more useful conclusion than either number. Protocol 23 on the Protocol page.'
          }
        },
        {
          type: 'links',
          cls: 'link-list--section-end',
          items: [
            { href: '../wet-lab/notebook.html', en: 'The four module notebooks behind these records — Notebook page' }
          ]
        }
      ]
    }
  ]
};
