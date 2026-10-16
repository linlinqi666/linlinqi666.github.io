/**
 * Hardware 页表格数据（2026-10-15 建立，仿 modelDocking.js 的「内容即数据」做法）。
 * 数值、单位与措辞逐字取自 static/expriments/drylab/hardware/ 下四份源文件，
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

  // 表 3：十个里程碑
  milestones: {
    caption: 'Table 3. Milestones of the build from the first AutoCAD drawing to the rewired circuit.',
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
      ['11 October', 'Circuit rewired, power and signal runs separated', '—']
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
      ['Power', 'DC 24 V / 2 A, stepped down internally to 12 V / 5 V']
    ]
  },

  // 表 5：按功能分类的元件概览
  categories: {
    caption: 'Table 5. Components by functional category.',
    head: ['Category', 'Items', 'Main components'],
    rows: [
      ['Structure and printing', '1', 'PLA filament (white / black)'],
      ['Temperature control', '7', 'PI heating film, PT100 + MAX31865, KSD9700, IRF520, thermal pad, 40 mm fan, aluminium heat sink'],
      ['Optics', '7', '485 nm LED, constant-current driver, BPW34, Ø10 mm narrow-band filters (485 / 528 nm), OPA350, focusing lenses, black heat-shrink tubing'],
      ['Electronics and signal', '4', 'Arduino Nano, ADS1115, SOT89 / SOT223 adapter boards'],
      ['Power and wiring', '9', '24 V adapter, LM2596, perfboard, jumpers, electrolytic capacitors, resistor kit, indicator LEDs, KF301 terminals, 30 AWG silicone wire'],
      ['Tools and consumables', '8', 'Thermal adhesive, PI thermal tape, 22 AWG silicone wire, desoldering wick, multimeter, 936 soldering station, hot glue gun, solder']
    ]
  },

  // 表 6：逐项采购清单（含合计行）
  bom: {
    caption: 'Table 6. Itemised purchase list, 14 October 2026. Unit prices are the amounts actually paid, in CNY.',
    head: ['No.', 'Category', 'Item', 'Specification / model', 'Qty', 'Unit price', 'Subtotal', 'Purpose'],
    rows: [
      ['1', 'Structural parts & printing consumables', '3D printing filament (PLA)', 'PLA Basic, white 1000 g + black 1000 g (without spool)', '1 spool each', '77.38', '77.38', 'FDM printing of the collection cup, the heater-block body and the three plug-in modules'],
      ['2', 'Temperature control', 'Heat-resistant thermal silicone pad', '200 × 400 × 0.3 mm, 6 W/(m·K)', '1 sheet', '25', '25', 'Thermal interface between the heating film and the heater block; cut to size'],
      ['3', 'Temperature control', 'PI heating film', '60 × 70 mm, 12 V / 25 W', '2 pcs', '24.64', '24.64', 'Bonded to the underside of the heater block as the heating element'],
      ['4', 'Temperature control', 'MAX31865 module + PT100', 'MAX31865 converter module + PT100 platinum RTD (3-wire)', '1 set', '33.5', '33.5', 'Temperature acquisition: PT100 resistance converted to a digital temperature by a 16-bit ADC'],
      ['5', 'Temperature control', 'KSD9700 thermal cut-off', '60 °C, 250 V / 10 A, metal case, normally closed', '1 pc', '6.12', '6.12', 'Hardware-level over-temperature protection; in series with the heater so it physically cuts the circuit'],
      ['6', 'Temperature control', 'MOSFET driver module', 'IRF520', '1 pc', '3.29', '3.29', 'Takes the PWM signal and drives the heating film to implement PID power control'],
      ['7', 'Temperature control', 'Cooling fan', '40 × 40 × 10 mm, 12 V, quiet', '1 pc', '10', '10', 'Mounted on the heat sink to keep the electronics underneath and the block from overheating'],
      ['8', 'Temperature control', 'Heat sink', 'Aluminium, 70 × 36 × 100 mm', '1 pc', '23', '23', 'Dissipates heat downwards and protects the circuit underneath'],
      ['9', 'Optics', 'LED light source', '485 nm high-brightness LED', '3 pcs', '17.34', '17.34', 'Excitation light source; spares kept for wavelength margin'],
      ['10', 'Optics', 'LED constant-current driver', 'Adjustable constant-current driver board, 350 / 500 mA', '1 pc', '36.38', '36.38', 'Provides a stable current for the 485 nm LED and reduces intensity drift'],
      ['11', 'Optics', 'Photodiode', 'BPW34, through-hole package', '4 pcs', '8.1', '8.1', 'Detects the 528 nm fluorescence at the receiver end; spares kept'],
      ['12', 'Optics', 'Narrow-band filters', 'Ø10 mm, 30 nm bandwidth, OD3; 485 nm × 2 + 528 nm × 2', '4 pcs', '154', '154', 'One at each end separates the excitation light from the fluorescence spectrum'],
      ['13', 'Optics', 'Op-amp', 'OPA350UA (SOIC-8)', '2 pcs', '18.8', '18.8', 'Forms the transimpedance amplifier with the photodiode and outputs a measurable voltage'],
      ['14', 'Optics', 'Light shield (black heat-shrink tubing)', '12 mm bore, 10× thick wall', '1 pack', '8', '8', 'Wraps the emitter and receiver plugs to exclude ambient light'],
      ['15', 'Optics', 'Focusing lenses for emitter and receiver', 'Matched to the 485 nm emitter and the 528 nm receiver (newly ordered)', '2 sets', 'TBD', 'TBD', 'Focus the LED output onto the centre of the vessel and the fluorescence onto the photodiode active area'],
      ['16', 'Electronics & signal', 'Microcontroller', 'Arduino Nano V4 (board + USB cable)', '1 pc', '62.84', '62.84', 'Timing control, ADC readout and the PID temperature algorithm'],
      ['17', 'Electronics & signal', 'ADS1115 high-precision ADC', 'ADS1115 module, 16-bit, 4-channel differential, I²C (newly ordered)', '1 pc', 'TBD', 'TBD', 'Reads the amplified photodiode voltage with high precision'],
      ['18', 'Electronics & signal', 'SOT89 adapter board', 'SOT89 to DIP through-hole adapter (newly ordered)', 'TBD', 'TBD', 'TBD', 'Lets SOT89 SMD parts be soldered through-hole'],
      ['19', 'Electronics & signal', 'SOT223 adapter board', 'SOT223 to DIP through-hole adapter (newly ordered)', 'TBD', 'TBD', 'TBD', 'Lets SOT223 SMD parts be soldered through-hole'],
      ['20', 'Power & wiring', 'Power adapter', '24 V / 2 A (48 W), with mains lead', '1 pc', '12.87', '12.87', 'Supplies the instrument; 24 V bus'],
      ['21', 'Power & wiring', 'LM2596 buck module', 'LM2596S DC-DC adjustable step-down', '1 pc', '4.49', '4.49', 'Steps 24 V down to 12 V (heating film, fan) and 5 V (logic)'],
      ['22', 'Power & wiring', 'Breadboard / protoboard', 'Single-sided, rosin-coated green, 12 × 18 cm', '2 pcs', '10.87', '10.87', 'Prototyping during debugging, then soldered permanently'],
      ['23', 'Power & wiring', 'Jumper wires', '21 cm, male–male / male–female / female–female, 120 pcs total', '1 set', '9.87', '9.87', 'Temporary connections between boards and modules'],
      ['24', 'Power & wiring', 'Electrolytic capacitors', '16 V / 100 µF, 5 × 11 mm', '2 pcs', '6.74', '6.74', 'Supply filtering; suppresses switching noise'],
      ['25', 'Power & wiring', 'Resistor kit', '1/4 W metal film, 25 common values, 500 pcs total', '1 set', '7.9', '7.9', 'Current limiting, voltage division and transimpedance feedback'],
      ['26', 'Power & wiring', 'Indicator LEDs', '5 mm red / green / yellow, 60 pcs total', '1 set', '3.46', '3.46', 'Power and run-status indication'],
      ['27', 'Power & wiring', 'Terminal blocks', 'KF301-2P × 10 + 3P × 10, 5.08 mm', '1 pack each', '7.17', '7.17', 'Power input and load wiring'],
      ['28', 'Power & wiring', '30 AWG silicone wire', 'Extra-flexible silicone wire for wiring inside the plugs and for signals (newly ordered)', 'TBD', 'TBD', 'TBD', 'Fine wiring inside the plugs keeps them compact and flexible'],
      ['29', 'Tools & consumables', 'Thermal silicone adhesive', 'Kafuter K-5204K, fast-curing, white', '1 tube', '13.2', '13.2', 'Fixes the heating film, PT100 and heat sink; also seals against light'],
      ['30', 'Tools & consumables', 'Heat-resistant double-sided tape', 'PI polyimide tape, 0.1 mm thick, 3 mm × 10 m', '1 roll', '10.7', '10.7', 'Holds the heating film onto the heater-block surface'],
      ['31', 'Tools & consumables', 'Silicone wire', '22 AWG red + black, rated ≥ 105 °C', '1 roll each', '13.05', '13.05', 'Power wiring for the heater and supply circuits'],
      ['32', 'Tools & consumables', 'Desoldering wick', 'For desoldering and rework (newly ordered)', '1 roll', 'TBD', 'TBD', 'Rework and clearing of mis-soldered joints'],
      ['33', 'Tools & consumables', 'Multimeter', 'UNI-T UT33A, auto-ranging', '1 pc', '73', '73', 'Voltage, current, continuity and resistance measurement'],
      ['34', 'Tools & consumables', 'Soldering station (936)', '60 W adjustable constant temperature, standard model', '1 set', '66', '66', 'Soldering the circuits and plug-in modules'],
      ['35', 'Tools & consumables', 'Hot-melt glue gun', '40 W, with glue sticks', '1 pc', '15.35', '15.35', 'Securing components and sealing light leaks'],
      ['36', 'Tools & consumables', 'Solder wire', 'Lead-free, 63% tin, 0.8 mm, rosin core', '1 roll', '27.65', '27.65', 'Soldering consumable']
    ],
    total: {
      label: 'Total, items already ordered (CNY)',
      amount: '790.71',
      note: 'Newly ordered items will be added once prices are known'
    }
  },

  // 表 7：整机关键指标
  instrument: {
    caption: 'Table 7. Key figures of the complete instrument as specified.',
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
    caption: 'Table 8. Tests the module has to pass, with the method and the criterion for each one.',
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
  }
,
  // 图 1–27：硬件日志的原始截图与照片（顺序与源稿 Figure 编号一致）
  figures: [
    { src: "static/image/hardware/image1.jpg", alt: "Figure 1. First collection-cup design drawn in AutoCAD, with a supporting skirt at the base", caption: "Figure 1. First collection-cup design drawn in AutoCAD, with a supporting skirt at the base", width: 664, height: 915 },
    { src: "static/image/hardware/image2.jpg", alt: "Figure 2. The first 3D collection-cup model, built in SolidWorks", caption: "Figure 2. The first 3D collection-cup model, built in SolidWorks", width: 1100, height: 652 },
    { src: "static/image/hardware/image3.jpg", alt: "Figure 3. Profile sketch of the first collection-cup version", caption: "Figure 3. Profile sketch of the first collection-cup version", width: 380, height: 895 },
    { src: "static/image/hardware/image4.jpg", alt: "Figure 4. Dimensioned drawing of the second collection-cup version, with optical windows added on the conical face", caption: "Figure 4. Dimensioned drawing of the second collection-cup version, with optical windows added on the conical face", width: 639, height: 805 },
    { src: "static/image/hardware/image5.jpg", alt: "Figure 5. 3D model of the second collection-cup version", caption: "Figure 5. 3D model of the second collection-cup version", width: 1100, height: 652 },
    { src: "static/image/hardware/image6.jpg", alt: "Figure 6. Sketch of the second version, showing the position of the optical windows", caption: "Figure 6. Sketch of the second version, showing the position of the optical windows", width: 1100, height: 653 },
    { src: "static/image/hardware/image7.jpg", alt: "Figure 7. 3D model of the heated block, with the vessel cavity and optical channels reserved", caption: "Figure 7. 3D model of the heated block, with the vessel cavity and optical channels reserved", width: 1100, height: 652 },
    { src: "static/image/hardware/image8.jpg", alt: "Figure 8. 2D layout drawing of the heated block", caption: "Figure 8. 2D layout drawing of the heated block", width: 1100, height: 653 },
    { src: "static/image/hardware/image9.jpg", alt: "Figure 9. The first 3D-printed collection cup; print quality was poor", caption: "Figure 9. The first 3D-printed collection cup; print quality was poor", width: 1100, height: 824 },
    { src: "static/image/hardware/image10.jpg", alt: "Figure 10. The first printed cup, held for scale", caption: "Figure 10. The first printed cup, held for scale", width: 824, height: 1100 },
    { src: "static/image/hardware/image11.jpg", alt: "Figure 11. The first complete printed hardware module, with supports still inside the optical channel", caption: "Figure 11. The first complete printed hardware module, with supports still inside the optical channel", width: 1100, height: 824 },
    { src: "static/image/hardware/image12.jpg", alt: "Figure 12. Assembly check of the collection cup and the heated block", caption: "Figure 12. Assembly check of the collection cup and the heated block", width: 1100, height: 824 },
    { src: "static/image/hardware/image13.jpg", alt: "Figure 13. The revised EH2.0 heated block, with the optical channel widened to 8 mm", caption: "Figure 13. The revised EH2.0 heated block, with the optical channel widened to 8 mm", width: 1100, height: 652 },
    { src: "static/image/hardware/image14.jpg", alt: "Figure 14. 2D layout of EH2.0, showing the optical channels and the plug interfaces", caption: "Figure 14. 2D layout of EH2.0, showing the optical channels and the plug interfaces", width: 1100, height: 653 },
    { src: "static/image/hardware/image15.jpg", alt: "Figure 15. The printed EH2.0 block", caption: "Figure 15. The printed EH2.0 block", width: 1100, height: 824 },
    { src: "static/image/hardware/image16.jpg", alt: "Figure 16. Re-checking the fit between EH2.0 and the collection cup", caption: "Figure 16. Re-checking the fit between EH2.0 and the collection cup", width: 1100, height: 824 },
    { src: "static/image/hardware/image17.jpg", alt: "Figure 17. Internal layout sketch of the emitter end", caption: "Figure 17. Internal layout sketch of the emitter end", width: 1100, height: 653 },
    { src: "static/image/hardware/image18.jpg", alt: "Figure 18. Internal layout sketch of the receiver end", caption: "Figure 18. Internal layout sketch of the receiver end", width: 1100, height: 653 },
    { src: "static/image/hardware/image19.jpg", alt: "Figure 19. First version of the circuit design", caption: "Figure 19. First version of the circuit design", width: 1100, height: 653 },
    { src: "static/image/hardware/image20.jpg", alt: "Figure 20. The driver and indicator circuit during soldering", caption: "Figure 20. The driver and indicator circuit during soldering", width: 1100, height: 824 },
    { src: "static/image/hardware/image21.jpg", alt: "Figure 21. 3D model of Emitter_Plug", caption: "Figure 21. 3D model of Emitter_Plug", width: 998, height: 719 },
    { src: "static/image/hardware/image22.jpg", alt: "Figure 22. Dimensioned drawing of Emitter_Plug", caption: "Figure 22. Dimensioned drawing of Emitter_Plug", width: 1100, height: 647 },
    { src: "static/image/hardware/image23.jpg", alt: "Figure 23. 3D model of Heater_Plug", caption: "Figure 23. 3D model of Heater_Plug", width: 1100, height: 650 },
    { src: "static/image/hardware/image24.jpg", alt: "Figure 24. Dimensioned drawing of Heater_Plug", caption: "Figure 24. Dimensioned drawing of Heater_Plug", width: 1100, height: 649 },
    { src: "static/image/hardware/image25.jpg", alt: "Figure 25. 3D model of Receiver_Plug", caption: "Figure 25. 3D model of Receiver_Plug", width: 1100, height: 653 },
    { src: "static/image/hardware/image26.jpg", alt: "Figure 26. Dimensioned drawing of Receiver_Plug", caption: "Figure 26. Dimensioned drawing of Receiver_Plug", width: 1100, height: 652 },
    { src: "static/image/hardware/image27.jpg", alt: "Figure 27. The circuit after rewiring", caption: "Figure 27. The circuit after rewiring", width: 1100, height: 777 },
  ],

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
      text: "Cormack BP, Bertram G, Egerton M, Gow NAR, Falkow S, Brown AJP. Yeast-enhanced green fluorescent protein (yEGFP): a reporter of gene expression in Candida albicans. Microbiology, 1997, 143(2): 303–311.",
      link: "https://doi.org/10.1099/00221287-143-2-303"
    }
  ]
};
