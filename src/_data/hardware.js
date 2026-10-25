/**
 * Hardware 页表格数据（2026-10-15 建立，2026-10-21 随 01–04 四份新版源文件同步更新）。
 * 数值、单位与措辞逐字取自 static/expriments/drylab/hardware/ 下四份源文件
 * （01_Wiki page content / 02_Module technical requirements / 03_Purchase list /
 * 04_Complete instrument technical requirements，01 标注 2026-10-21、02 标注 19 October 2026），
 * 不在此处改写事实；模板只负责渲染。
 * 页面：src/dry-lab/hardware.njk
 */
module.exports = {
  // 表 1：既有检测路线及其局限
  methods: {
    caption: 'Table 1. Established detection routes and what limits each one for on-site monitoring of airborne influenza A virus.',
    head: ['Method', 'Principle', 'Limitation for on-site monitoring of airborne IAV'],
    rows: [
      ['Virus isolation', 'Inoculation into cells or embryonated eggs, observation of cytopathic effect', 'Typically 3–7 days; requires a BSL-2 laboratory and cell-culture facilities; unsuitable for screening'],
      ['qRT-PCR / RT-LAMP', 'Nucleic acid extraction followed by amplification', 'Highest sensitivity and specificity, but needs extraction, a thermal cycler, cold-chain reagents and trained staff; samples must go back to a central laboratory, so results are retrospective; detecting nucleic acid is not the same as detecting infectious virus'],
      ['Rapid antigen test (immunochromatography)', 'Antibody capture of viral antigen with a colour readout', 'Cheap, fast and field-usable, but typically 2–3 orders of magnitude less sensitive than nucleic acid methods; antibody batches vary and need cold chain; mostly used after symptoms appear'],
      ['ELISA / immunoassay', 'Antibody-enzyme colour or fluorescence readout', 'Quantitative and high-throughput, but needs a plate reader and laboratory conditions; antibody reagents are costly; sensitivity limits still apply'],
      ['Conventional bioaerosol sampling + laboratory analysis', 'Sampler collects airborne particles, which are then sent to a laboratory', 'The accepted paradigm, but sampling and analysis are separated: transport and laboratory turnaround sit between the two steps, there is no on-site readout, and cost per test is high']
    ]
  },

  // 表 2：传统流程与一体化流程对照
  comparison: {
    caption: 'Table 2. The conventional aerosol-sampling-plus-laboratory workflow against what this hardware folds into one cup.',
    head: ['Step', 'Conventional paradigm (aerosol sampling + laboratory qRT-PCR)', 'Our hardware'],
    rows: [
      ['Sampling', 'A sampler collects airborne particles onto liquid or a filter', 'The cyclone spins airborne particles straight into the yeast medium in the cup'],
      ['Sample transfer', 'Transfer to a tube, labelling, cold-chain transport', 'Not needed: the sampling cup is the culture cup and the detection cell'],
      ['Signal generation', 'Nucleic acid extracted and amplified in a laboratory', 'Engineered yeast in the cup are induced by the antigen and express the fluorescent protein themselves'],
      ['Readout', 'qPCR instrument in a laboratory', '485 nm excitation / 528 nm collection at 90°, converted to an electrical signal on site'],
      ['Time to result', 'Hours to 1–2 days including transport and queueing', 'Sampling and expression overlap; total time on the order of hours'],
      ['Cost per test', 'Reagents + instrument amortisation + specialist labour', 'Medium + disposable structural parts (the yeast amplifies itself)'],
      ['Retargeting', 'Redesign primers and probes, revalidate', 'Replace the nanobody domain only; heating and optics hardware unchanged']
    ]
  },

  // 表 3：十二个里程碑
  milestones: {
    caption: 'Table 3. Milestones of the build from the first AutoCAD drawing to the first self-test and the revised schematic.',
    head: ['Date', 'Milestone', 'Output'],
    rows: [
      ['14 September', 'First collection cup in AutoCAD (with supporting skirt)', 'Drawing1.dwg'],
      ['21 September', 'First 3D model in SolidWorks (skirt removed, cone shortened, bottom cone radius increased)', 'Collection_Cup.SLDPRT'],
      ['22 September', 'Second collection-cup version (optical windows added on the conical face)', 'Collection_Cup_2.SLDPRT'],
      ['25 September', 'Heated block modelled (vessel cavity + optical channels)', '—'],
      ['30 September', 'First 3D print of the cup (poor print quality)', '—'],
      ['2 October', 'First complete print of the hardware module and dimensional check by assembly', '—'],
      ['4 October', 'Optical channel widened to 8 mm; filters, lenses, LED and photodiode made detachable; EH2.0 finalised and printed; emitter and receiver drawn; first circuit design completed', 'EH 2.0 10.3.SLDPRT, Emitter_End 10.3.SLDPRT, Receiver_End 10.4.SLDPRT'],
      ['5 October', 'Soldering started, beginning with the power section', '—'],
      ['9 October', 'Three plug-in parts finalised', 'Emitter_Plug, Receiver_Plug, Heater_Plug'],
      ['11 October', 'Circuit rewired, power and signal runs separated', '—'],
      ['18 October', 'First soldering batch completed and self-test run; after clearing an I²C solder bridge the ADS1115 answered at 0x48; the microcontroller was then found destroyed', 'EchoYeast_6_selftest.ino'],
      ['19 October', 'Microcontroller replaced; constant-current board dropped in favour of a 200 Ω resistor driving the 485 nm LED directly, lit at 8.5 mA; transimpedance receiver and grounding settled', 'EchoYeast_6_selftest_v2.ino, EchoYeast_8_led_test.ino']
    ]
  },

  // 表 4：当前模块指标
  specs: {
    caption: 'Table 4. Key figures of the module as it stands in this revision.',
    rows: [
      ['Set point', '30 °C'],
      ['Temperature accuracy', '±0.5 °C (steady state)'],
      ['Heat-up time', 'Room temperature to 30 °C in ≤ 5 min'],
      ['Excitation', '485 ± 5 nm'],
      ['Emission', '528 ± 10 nm'],
      ['Optical channel', 'Single channel; excitation and collection axes at 90°; 8 mm bore'],
      ['Filters', 'Ø10 mm narrow-band, 30 nm FWHM, OD3; 485 nm at the emitter, 528 nm at the receiver'],
      ['Detection', 'BPW34 silicon PIN photodiode with OPA350 transimpedance amplifier'],
      ['ADC', 'ADS1115, 16-bit, 4 differential channels, I²C'],
      ['Temperature sensing', 'PT100 (Class A, 3-wire) with MAX31865 (16-bit, SPI)'],
      ['Heating', 'PI film 60 × 70 mm, 12 V / 25 W × 2; IRF520 PWM drive'],
      ['Over-temperature', 'KSD9700 (60 °C, 10 A) in series plus a 45 °C software threshold'],
      ['Vessel', 'Test stage: standard 10 mm path-length cuvette; project stage: in-house collection cup'],
      ['Power', 'DC 24 V / 2 A, stepped down internally to 12 V / 5 V / 3.3 V']
    ]
  },

  // 表 5：按功能分类的元件概览
  categories: {
    caption: 'Table 5. Components by functional category.',
    head: ['Category', 'Items', 'Main components'],
    rows: [
      ['Structure and printing', '1', 'PLA filament (white / black)'],
      ['Temperature control', '7', 'PI heating film, PT100 + MAX31865, KSD9700, IRF520, thermal pad, 40 mm fan, aluminium heat sink'],
      ['Optics', '7', '485 nm LED, 200 Ω current-limiting resistor, BPW34, Ø10 mm narrow-band filters (485 / 528 nm), OPA350, focusing lenses, black heat-shrink tubing'],
      ['Electronics and signal', '4', 'Arduino Nano, ADS1115, SOT89 / SOT223 adapter boards'],
      ['Power and wiring', '9', '24 V adapter, LM2596, perfboard, jumpers, electrolytic capacitors, resistor kit, indicator LEDs, KF301 terminals, 30 AWG silicone wire'],
      ['Tools and consumables', '8', 'Thermal adhesive, PI thermal tape, 22 AWG silicone wire, desoldering wick, multimeter, 936 soldering station, hot glue gun, solder']
    ]
  },

  // 表 7：整机关键指标
  instrument: {
    caption: 'Table 6. Key figures of the complete instrument as specified.',
    rows: [
      ['Format', 'Wet-wall cyclone bioaerosol sampling + liquid collection + yeast whole-cell detection + optical readout, integrated in one unit'],
      ['Sampling flow', '100–300 L/min (adjustable)'],
      ['Sampling time', '15–30 min for viral aerosols'],
      ['Working volume', '20 mL liquid medium (with yeast)'],
      ['Collection cell', 'Custom medical-grade optical COC injection moulding, M28×1.5-6g thread, Ø32 / Ø36 mm cylindrical section, 12° half cone angle, two orthogonal Ø10 mm optical windows at 90°, 2 mm wall'],
      ['Temperature control', 'PI heating film 100 × 100 mm, 24 V / 50–100 W; CNC aluminium block (6061 / 7075), 4–9 bores Ø22–25 mm, 30 mm deep; PT100 + MAX31865; ±0.5 °C'],
      ['Optics', '485 nm excitation, 480/30 and 530/20 filters, BPW34 / SFH203 detection, OPA350 transimpedance stage, ADS1115 acquisition'],
      ['Size and weight', 'approx. 300 × 250 × 200 mm, ≤ 5 kg'],
      ['Power', 'AC 220 V ± 10%, 50 Hz; or DC 24 V / 5 A']
    ]
  },

  // 表 8：测试计划
  testPlan: {
    caption: 'Table 7. Tests the module has to pass, with the method and the criterion for each one.',
    head: ['Test', 'Method and criterion'],
    rows: [
      ['Fit and assembly', 'Insert / remove each plug 20 times and reassemble the vessel 5 times; check for play and reading drift (drift ≤ 5%)'],
      ['Temperature accuracy', 'Set 30 °C; after 20 min stabilisation measure inside the vessel bore with a calibrated thermometer; deviation ≤ ±0.5 °C'],
      ['Temperature uniformity', 'Measure at several heights in the vessel bore; difference ≤ 0.5 °C'],
      ['Over-temperature protection', 'Break the temperature feedback so heating runs continuously; confirm the KSD9700 cuts the heater circuit before 60 °C'],
      ['Light-tightness and dark noise', 'With the excitation source off under room lighting, acquire for 5 min; drift ≤ 1% of full scale'],
      ['Optical alignment', 'Insert and remove the plugs 10 times; spot position repeatability on a paper screen ≤ 0.5 mm'],
      ['Background and fluorescence response', 'Compare against blank medium; then compare HA-induced and uninduced yeast samples on the 528 nm channel'],
      ['Repeatability', 'Measure the same positive sample ≥ 5 times; RSD ≤ 5% (target, to be confirmed by data)'],
      ['Co-culture compatibility', 'Aerate and stir the medium in the cup for 30 min; observe foaming, evaporation and yeast viability, and record readout stability']
    ]
  },

  // 参考文献（2026-10-15 改版新增）：逐条取自 Hardware Wiki page content 2026.10.14 (1).pdf
  // 末节。编号与正文中的 [n] 引用一一对应。
  // link 字段仅存档 DOI/官网地址（溯源用），页面按 iGEM 要求不渲染外链（2026-10-16）。
  references: [
    {
      num: 1,
      text: "World Health Organization. Global Influenza Strategy 2019–2030. Geneva: WHO, 2019.",
      link: "https://www.who.int/news-room/detail/11-03-2019-who-launches-new-global-influenza-strategy"
    },
    {
      num: 2,
      text: "Yang W, Elankumaran S, Marr LC. Concentrations and size distributions of airborne influenza A viruses measured indoors at a health centre, a day-care centre and on aeroplanes. Journal of the Royal Society Interface, 2011, 8(61): 1176–1184.",
      link: "https://doi.org/10.1098/rsif.2010.0686"
    },
    {
      num: 3,
      text: "Ladhani L, Pardon G, Meeuws H, et al. Sampling and detection of airborne influenza virus towards point-of-care applications. PLOS ONE, 2017, 12(3): e0174314.",
      link: "https://doi.org/10.1371/journal.pone.0174314"
    },
    {
      num: 4,
      text: "Ma X, Fang Z, Li F, Hu K. Determination of performance-parameter design and impact factors of sampling efficiency for bioaerosol cyclones. Biotechnology & Biotechnological Equipment, 2020.",
      link: "https://doi.org/10.1080/13102818.2020.1797529"
    },
    {
      num: 5,
      text: "Martin-Yken H. Yeast-based biosensors: current applications and new developments. Biosensors, 2020, 10(5): 51.",
      link: "https://doi.org/10.3390/bios10050051"
    },
    {
      num: 6,
      text: "Bean BDM, Mulvihill CJ, Garge RK, et al. Functional expression of opioid receptors and other human GPCRs in yeast engineered to produce human sterols. Nature Communications, 2022, 13: 2882.",
      link: "https://doi.org/10.1038/s41467-022-30570-7"
    },
    {
      num: 7,
      text: "Kalogriopoulos NA, Tei R, Yan Y, et al. Synthetic GPCRs for programmable sensing and control of cell behaviour. Nature, 2025, 637(8044): 230–239.",
      link: "https://doi.org/10.1038/s41586-024-08282-3"
    },
    {
      num: 8,
      text: "Erlenbach I, Kostenis E, Schmidt C, et al. Functional expression of M1, M3 and M5 muscarinic acetylcholine receptors in yeast. Journal of Neurochemistry, 2001, 77(5): 1327–1337.",
      link: "https://doi.org/10.1046/j.1471-4159.2001.00344.x"
    },
    {
      num: 9,
      text: "Armbruster BN, Li X, Pausch MH, Herlitze S, Roth BL. Evolving the lock to fit the key to create a family of G protein-coupled receptors potently activated by an inert ligand. PNAS, 2007, 104(12): 5163–5168.",
      link: "https://doi.org/10.1073/pnas.0700293104"
    },
    {
      num: 10,
      text: "Nagai Y, Miyakawa N, Takuwa H, et al. Deschloroclozapine, a potent and selective chemogenetic actuator enables rapid neuronal and behavioral modulations in mice and monkeys. Nature Neuroscience, 2020.",
      link: "https://doi.org/10.1038/s41593-020-0661-3"
    },
    {
      num: 11,
      text: "Trueheart J, Boeke JD, Fink GR. Two genes required for cell fusion during yeast conjugation: evidence for a pheromone-induced surface protein. Molecular and Cellular Biology, 1987, 7(7): 2316–2328.",
      link: "https://doi.org/10.1128/mcb.7.7.2316-2328.1987"
    },
    {
      num: 12,
      text: "Cormack BP, Bertram G, Egerton M, Gow NAR, Falkow S, Brown AJP. Yeast-enhanced green fluorescent protein (<i>yEGFP</i>): a reporter of gene expression in Candida albicans. Microbiology, 1997, 143(2): 303–311.",
      link: "https://doi.org/10.1099/00221287-143-2-303"
    }
  ]
};
