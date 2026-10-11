(function () {
  "use strict";
  window.HPMapLoaded = true;

  function initMap() {
    var pinLayer = document.getElementById('chinaPins');
    if (!pinLayer) return;
    pinLayer.setAttribute('aria-live', 'polite');
  const root = document.getElementById("hzMap");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const categoryNames = {
    science: "Science and academia",
    policy: "Policy",
    industry: "Industry",
    public: "Public"
  };
  const categoryColors = {
    science: "#4A90E2",
    policy: "#E94B3C",
    industry: "#9013FE",
    public: "#F5A623"
  };
  const provinceCoordinates = {
    "CN-44": { top: 83.2, left: 13.7 }, // Guangdong (geometric centroid)
    "CN-33": { top: 60.4, left: 40.9 }, // Zhejiang (geometric centroid)
    "CN-43": { top: 66.6, left: 7.1 }, // Hunan (geometric centroid)
    "CN-35": { top: 72.3, left: 32.2 }, // Fujian (geometric centroid)
    "CN-21": { top: 8.2, left: 51.0 }, // Liaoning (geometric centroid)
    "CN-32": { top: 44.9, left: 38.1 }, // Jiangsu (geometric centroid)
    "CN-11": { top: 13.4, left: 26.1 }  // Beijing (geometric centroid)
  };
  const chinaExperts = [
    {
      slug: "wang-wenjie",
      name: "Wenjie Wang",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 90.8, left: 27.3 },
      photo: "../static/image/any-icon/HP/expert_img/wangwenjie.png",
      org: "A Grade II Class A hospital in Shenzhen",
      role: "Director of the Medical Technology Department",
      desc: "Long engaged in clinical laboratory testing and in vitro diagnostics; provides frontline feedback on influenza A testing pain points, treatment strategies and prevention needs.",
      why: "As the team's first formal social practice after its founding, we brought a yeast sensor that existed only on paper to Dr. Wenjie Wang, hoping to clarify two things: how influenza A is actually tested and treated in real medical settings, and whether our device should aim at distinguishing subtypes or at first detecting the virus in the air.",
      what: "Dr. Wenjie Wang pointed out that the existing IVD industry always acts only after the virus has broken out in the human body and reached the detection threshold, whereas our air-monitoring sensor could shift prevention and control from passive diagnosis and treatment to proactive prevention, issuing a warning before the virus enters the body. He also noted: air testing involves many variables and virus concentrations in open environments are low; the effective range and limiting conditions remain unclear; false-positive and specificity risks are prominent, and the false-positive rate of self-test reagents can reach 50%-70%; clinically, viral positive/negative results guide treatment without subtyping, which is announced by the CDC; the project is still at the laboratory prototype stage, and production, cost, standardization and deployment remain to be addressed.",
      how: "The team translated the expert's advice into action: firmly choosing the conserved HA stalk region for broad-spectrum detection while de-emphasizing subtyping; prioritizing enclosed-space experiments with variable-control plans; making specificity and false-positive control the focus of subsequent optimization; and defining the effective measurement range and environmental limits. This interview moved the project from a technical concept toward problem orientation, and taught us that a cutting-edge sensor serving public health needs not only innovation but also validation against clinical scenarios, environmental variables and real-world application."
    },
    {
      slug: "fu-kai",
      name: "Kai Fu",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Guangzhou, Guangdong",
      category: "industry",
      coord: { top: 86.1, left: 21.9 },
      photo: "../static/image/any-icon/HP/expert_img/fukai.jpg",
      org: "Sun Yat-sen University",
      role: "MD in clinical medicine",
      desc: "Offers systematic advice on air monitoring versus single-person breath testing, device cost and future expansion from the perspective of clinical feasibility and grassroots adoption.",
      why: "The project had already focused on the conserved HA stalk region, de-emphasized subtyping and begun exploring air monitoring, but questions such as the yeast sensor's response time, reporter system, cost, yeast survival period, comparison with existing technologies, ambient air versus human breath, and possible extension to influenza B or lung cancer still needed calibration, so we interviewed Dr. Kai Fu, MD in clinical medicine at Sun Yat-sen University.",
      what: "Dr. Kai Fu endorsed the concept of ”using an organic organism to detect another organic organism” as uniquely valuable in synthetic biology, and noted that the breath of people with respiratory or lung infections carries virus particles expelled with aerosols, so the device would work better for such groups. He also cautioned: the yeast signaling pathway takes about 1-2 hours from receiving a signal to expressing fluorescence, which limits timeliness; airborne virus is diluted and influenza A survives in air for only a few hours, while virus inside the human body is more concentrated and easier to detect.",
      how: "The team accordingly confirmed: prioritizing the single-person breath mode supported by an enrichment device; optimizing the signaling pathway to shorten response time; controlling hardware cost (an active breath device is expected to come down to around 10 yuan); and conducting cross-disciplinary interviews while deferring lung cancer testing and focusing on respiratory viruses such as influenza A. What has been obtained is recognition of the technical direction and that single-person breath outperforms ambient sampling; still to be supplemented are blue-white screening expression time, total device cost, long-term yeast survival and replacement plans, and quantitative specificity and sensitivity data."
    },
    {
      slug: "deng-manqing",
      name: "Manqing Deng",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 91.1, left: 27.8 },
      photo: "../static/image/any-icon/HP/expert_img/dengmanqing.png",
      org: "Pharmacy Department of a Grade III Class A hospital in Shenzhen",
      role: "Associate Chief Pharmacist",
      desc: "Provides feedback on product positioning, adaptation for susceptible populations, target audiences, biosafety and clinical translation from a pediatric clinical and medication-safety perspective.",
      why: "Understanding the applied technical direction does not mean the project can land in the real world, so we asked a pediatric clinician: whether children can cooperate with breath testing, how parents feel, whether campuses would welcome it, whether the product counts as a diagnostic reagent or a drug, what procedures are needed to enter hospitals or schools, biosafety and ethics requirements, and target audiences and pricing.",
      what: "Dr. Deng recognized the project's prevention-oriented positioning, holding that it is essentially a diagnostic reagent rather than a drug and belongs to the ”prevention” link; identifying the virus at a low viral load stage would be highly valuable for early isolation. On biosafety, with auxotrophic medium plus filtration membranes plus a kill switch, the biological hazard is controllable as long as nothing is sprayed into the human body and the device is used only for environmental/breath testing.",
      how: "The team further confirmed the project's positioning as a prevention-oriented diagnostic reagent, and recognized that the B side (institutional customers such as schools and government public health programs) should take priority over the C side (household individual users); low-load sensitivity, distinguishing live virus from fragments, cost control and compliance review are key to whether the project can land. Market entry should prioritize the B side, and biological parts should be built as replaceable modules to extend to other viruses, bacteria or mycoplasma resistance testing."
    },
    {
      slug: "deng-gong",
      name: "Rongkang Deng",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 90.5, left: 26.8 },
      photo: "",
      org: "A biotechnology company in Shenzhen",
      role: "Manager",
      desc: "Provides feedback on the air-virus enrichment bottleneck and the path to productization from the perspective of medical-device hardware development, engineering, R&D processes and competition deliverables.",
      why: "The project plans to develop a device that captures influenza A virus from ambient air, enriches it for detection and issues risk warnings for enclosed spaces such as schools and cruise ships, but the team lacks hardware engineering experience and was unclear about air-virus enrichment, component selection, R&D processes and competition deliverables, so we asked Engineer Deng to review the plan from a medical-device development perspective.",
      what: "Engineer Deng noted that the detection chemistry and optics are manageable, and the real bottleneck is capturing virus from air and enriching it into liquid: virus particles are so small that blowing air directly into the reaction liquid mostly lets them escape as bubbles. Two options exist: vortex stirring, and multi-layer membrane filtration (the upper layer intercepts bacteria, the lower nano-membrane intercepts virus for subsequent elution). With membrane filtration, virus easily passes through and high pressure causes clogging, which pulse pressurization or shaking can mitigate. He advised writing a Product Technical Requirements document to quantify each indicator first, then fixing the technical route, splitting hardware and software, and iterating prototypes; work involving live virus requires an internal inactivation plan and safety verification in advance.",
      how: "The team realized the main difficulty lies in air-virus enrichment. Next it will prioritize completing the product technical requirements document, and based on it draw the appearance design, working-principle block diagram and per-module schematics as competition materials, while building demonstration pieces of core local functions; component selection should reuse mature submodules, patents require thorough searching and design-around work; and for the defense the team must fully master the whole solution logic to avoid being judged as fabrication."
    },
    {
      slug: "qiu-xinyuan",
      name: "Xinyuan Qiu",
      provinceId: "CN-43",
      provinceName: "Hunan",
      region: "Changsha, Hunan",
      category: "science",
      coord: { top: 65.5, left: 12.5 },
      photo: "",
      org: "Synthetic biology expert with years of iGEM mentoring experience",
      role: "Mid-term iGEM advisor",
      desc: "Advises on chassis engineering, signaling pathways and iGEM judging strategy, identifying the project's current key problems and offering valuable opinions.",
      why: "The team uses Saccharomyces cerevisiae as the chassis and builds an airborne influenza A biosensor based on the PAGERs system. Having completed part of the genetic part construction, we repeatedly hit bottlenecks in experiment design, chassis engineering and iGEM judging strategy, so we invited Mr. Xinyuan Qiu to advise us.",
      what: "The expert raised a long-overlooked premise: ”Can an intact virus pass through the cell wall and reach the cell membrane?” The yeast cell wall is fairly thick, and there is currently no evidence that intact virus particles can penetrate it and bind receptors; if validation fails, the chassis should be changed decisively. The core advice was ”the simpler the better”: engineer yeast's own RTK system by swapping only the extracellular domain, and verify downstream phosphorylation by Western Blot; sensitivity must be defined as the number of detectable virus particles per unit volume. On modeling, a Hill-function approximation is acceptable but parameters must come from experiments or literature; HP does not judge by quantity or format but by whether the practice genuinely influences the project and drives improvement.",
      how: "The interview brought three shifts: necessity first (epidemiological evidence, the irreplaceability of the yeast chassis and differentiated advantages all lack data-based proof); retrospective reflection (we had overlooked the premise of whether virus can pass through the cell wall and should repeatedly re-examine the simplified route); and data as the only language of argument. Afterwards, the team raised project background research and chassis/receptor feasibility validation to top priority and kept iterating."
    },
    {
      slug: "shenzhen-cdc",
      name: "Shisong Fang",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "policy",
      coord: { top: 91.0, left: 27.5 },
      photo: "../static/image/any-icon/HP/expert_img/fangshisong.png",
      org: "Institute of Pathogen Biology, Shenzhen CDC",
      role: "Deputy Director",
      desc: "Provides judgment criteria on topic rigor, target gene selection, air-sampling bottlenecks, registration pathways and scientific validation methods from a public-health surveillance and CDC perspective.",
      why: "Although the technical route was settled, we wanted to examine the rigor of the topic and technical design from a CDC and public-health perspective, so we interviewed Expert Shisong Fang to test whether the idea of ”focusing on influenza A first, then expanding step by step” holds up, and to surface regulatory issues easily overlooked in technical design and implementation.",
      what: "The expert cautioned that testing influenza A alone risks missed detections and that the clinical mainstream is dual influenza A+B testing; for typing diagnosis, conserved genes such as M/NP/NS should be preferred, for antigen expression the conserved HA stalk region should be chosen, and mosaic algorithms can be referenced to cover circulating strains; multi-dimensional comparison with mature methods such as antigen rapid tests and fluorescent PCR is required. The core difficulty of air-virus detection lies in sampling (collector selection, dry/wet collection, filtration membranes and concentration processes). For implementation, research equipment and clinical medical devices follow different registration pathways; research must rely on real samples and statistical validation.",
      how: "The team confirmed: incorporating dual influenza A+B testing into subsequent planning; preferring conserved regions for target genes, choosing the HA stalk for antigen expression, and referencing mosaic algorithms; treating front-end air-sampling capture as the pipeline bottleneck requiring focused research; clarifying early between the research-equipment and clinical-device registration pathways; and making real samples, statistical validation, horizontal comparison and reproducibility the ground rules for subsequent experiments and reporting."
    },
    {
      slug: "luo-zhouqing",
      name: "Zhouqing Luo",
      provinceId: "CN-35",
      provinceName: "Fujian",
      region: "Xiamen, Fujian",
      category: "science",
      coord: { top: 79.4, left: 40.4 },
      photo: "../static/image/any-icon/HP/expert_img/luozhouqing.jpg",
      org: "Xiamen University",
      role: "Professor, School of Life Sciences",
      desc: "Experienced in yeast engineering, membrane-protein detection and receptor routes; consults on experimental operations, receptor engineering, reporter systems, cell-wall permeability and signal amplification.",
      why: "The project met significant obstacles in WB membrane-protein characterization, membrane localization of expressed protein, reporter-system stability and the cell-wall barrier — especially many nonspecific bands in membrane-protein detection and uncertainty about whether the humanized GPCR can fold and localize correctly in yeast — so we hoped Professor Luo's yeast-engineering experience would help identify the root causes.",
      what: "Professor Luo suggested mild short-time heating of membrane proteins at 50-70 degrees C, preferring mechanical disruption for extraction with dedicated membrane-protein solubilization reagents and introducing an HA tag; for the receptor he recommended engineering yeast's endogenous Ste2 (alpha-factor receptor) with the signal peptide replaced by a yeast surface-display signal peptide. For the cell wall he did not recommend the protoplast route; a yeast mutant defective in cell-wall synthesis could be used. HA protein is only 30-40 kDa, so penetration is not the main obstacle, and antigen-epitope short peptides can be used early on to get the system running. For the reporter system he advised genomic integration to eliminate copy-number fluctuation.",
      how: "The team adjusted course: switching to engineering yeast's endogenous Ste2 receptor and using antigen-epitope short peptides early to get the system running; planning genomic integration for the reporter system; investigating positive-feedback signal amplification via cell-cell communication; and adopting mild heating and mechanical disruption for membrane-protein detection while evaluating the HA tag. The HP group will compile materials for Professor Luo's review and distill this technology's unique advantages over existing detection methods."
    },
    {
      slug: "luo-yiwu",
      name: "Yiwu Luo",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "policy",
      coord: { top: 90.7, left: 27.0 },
      photo: "",
      org: "Approval Division, Shenzhen Municipal Health Commission",
      role: "Level-IV Researcher",
      desc: "Guides on the current state of air-virus monitoring, product compliance classification, biosafety regulations and competition defense strategy from a health-industry administration and policy perspective.",
      why: "The project had preliminary directions for its technical route, testing scenarios and productization strategy, but lacked guidance from the health-administration perspective on industry standards for air-virus monitoring, product compliance classification, biosafety regulations and defense strategy, so we interviewed Expert Yiwu Luo.",
      what: "Mr. Luo pointed out that the health system has no routine air-virus testing service and China has no official standards or testing methods; such a device cannot serve as a basis for medical diagnosis and can only do environmental screening and risk warning, so it does not count as a medical device. High-value scenarios include fever clinics, elevators, high-speed rail, coaches and enclosed classrooms, with fever clinics the most valuable, where linkage with disinfection equipment can form a closed management loop. For experimental validation he recommended combining laboratory simulation chambers with field tests and establishing reference thresholds for risk concentrations.",
      how: "The team drew clear boundaries: only enclosed-environment risk warning, no human diagnostic device; locking onto core scenarios such as fever clinics, elevators, high-speed rail and enclosed classrooms; focusing on the air-disinfector companion sensor accessory route; and designing both laboratory-simulation and field-test validation plans, writing biosafety and compliance design into project materials and the defense slides."
    },
    {
      slug: "wu-hui",
      name: "Hui Wu",
      provinceId: "CN-21",
      provinceName: "Liaoning",
      region: "Dalian, Liaoning",
      category: "science",
      coord: { top: 18.5, left: 54.7 },
      photo: "../static/image/any-icon/HP/expert_img/wuhui.jpg",
      org: "Dalian University of Technology",
      role: "Professor",
      desc: "Advises on the signal-recognition, transduction and response modules and iGEM strategy, with concrete suggestions on experiment optimization, pathway completion and part submission.",
      why: "As the project advanced, WB membrane-protein bands were unsatisfactory, the humanized receptor expressed poorly in yeast, the MEL1 reporter system leaked badly and CRISPR knockout efficiency was unstable, so we hoped Professor Wu's guidance would help diagnose the root causes and clarify what to prioritize at this stage.",
      what: "Professor Wu affirmed the novelty of the idea but noted that every node from signal recognition through transduction to response has problems and high uncertainty, advising us to first replicate conditions already proven in the literature rather than innovating on every part; the urgent task is to complete one full pathway with a visualizable response before considering part replacement. For membrane-protein expression he suggested following literature conditions; for WB, liquid-nitrogen grinding to break the cell wall; the reporter system could add an inhibitor or use a tighter promoter; and for CRISPR he suggested designing several targets in parallel.",
      how: "The team re-prioritized: no longer pursuing perfection in all modules simultaneously, but first completing one full pathway with a visualizable response; experimentally switching to liquid-nitrogen grinding, optimizing membrane-protein extraction, trying reporter-system inhibitors or promoter swaps, and running CRISPR with multiple targets in parallel; organizing parts with preliminary trends for iGEM submission and designing standard-curve experiments to evaluate the freeze-dried powder detection format."
    },
    {
      slug: "jia-honghua",
      name: "Honghua Jia",
      provinceId: "CN-32",
      provinceName: "Jiangsu",
      region: "Nanjing, Jiangsu",
      category: "science",
      coord: { top: 48.9, left: 29.3 },
      photo: "../static/image/any-icon/HP/expert_img/jiahonghua.png",
      org: "Nanjing Tech University",
      role: "Researcher, College of Life Sciences and Pharmaceutical Engineering",
      desc: "Reviews the project design, performance metrics and validation methods from a synthetic-biology engineering perspective, with feedback on literature comparison, membrane-protein verification, reporter systems, chassis choice and iGEM strategy.",
      why: "The project's construction was complete, but functional expression and validation had not fully worked, so we hoped Professor Jia would judge, from a synthetic-biology engineering angle, the core problems of the current design and what should be validated first.",
      what: "Professor Jia's research is not on yeast, but he found the project idea interesting and the workload substantial, with some steps not yet fully working. He specifically mentioned the September 2024 ACS Synthetic Biology work by Wei Na's team using a yeast biosensor to detect H1N1, and suggested the team compare surface-display versus membrane-bound schemes and clarify its own novelty. iGEM values both innovation and final performance; a biosensor must ultimately deliver two key metrics — sensitivity and detection limit/linearity. Performance is king.",
      how: "The team shifted from ”burying ourselves in complex design” to ”validate first, then optimize, then look at performance”: reviewing ACS Synthetic Biology literature to compare schemes; verifying membrane localization with fluorescent-protein fusion and confocal imaging; assessing the feasibility of lyticase treatment of the cell wall; continuing to try solutions for reporter-system leakage; sorting out performance metrics such as sensitivity, detection limit and linearity; and reaching out to Liu Guangna and Liu Wanlong for iGEM and yeast experience."
    },
    {
      slug: "zhang-haili",
      name: "Haili Zhang",
      provinceId: "CN-11",
      provinceName: "Beijing",
      region: "Beijing",
      category: "science",
      coord: { top: 13.3, left: 26.3 },
      photo: "",
      org: "Academy of Mathematics and Systems Science, Chinese Academy of Sciences",
      role: "PhD",
      desc: "Consults on optional modeling modules, statistical methods, two-way modeling-experiment validation and real-world constraints, helping the team clarify modeling priorities.",
      why: "The project already had partial experimental data on humanization and signal reporting (OD and fluorescence time series under alpha-factor gradients), but it was unclear how to distill content supporting the iGEM modeling section; several modeling directions ran in parallel without priorities, so we interviewed Dr. Haili Zhang.",
      what: "Dr. Zhang held that ODE models depend on complete experimental data, which is insufficient at this stage; the air-diffusion model couples weakly with this project and ranks low in priority; the promoter-screening model is referenceable but not the most urgent. What she recommended most was statistical analysis and time-series prediction based on the existing OD-fluorescence time-series data: using hypothesis testing to compute P values as quantitative evidence, and using first- and second-order derivatives of the curves to predict later trends from early data alone, shortening detection time. Modeling must serve wet-lab experiments and avoid excessive complexity.",
      how: "The team set modeling priorities: highest is derivative-based time-series prediction on the existing OD-fluorescence data; next is supplementing humanization and control experiments with statistical hypothesis tests giving P values; ODE as a fallback, reusing literature parameters first; air enrichment and viral spatial-diffusion models can wait if time is tight. Data collection continues, and a second interview will be scheduled to review the preliminary time-series prediction results."
    },
    {
      slug: "sz-vocational",
      onMap: false,
      name: "Shenzhen First Vocational Technical School",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "public",
      coord: { top: 91.3, left: 28.0 },
      photo: "",
      org: "Shenzhen First Vocational Technical School (Pingshan Campus)",
      role: "Partner school for science outreach",
      desc: "Gave a synthetic-biology outreach talk to pharmaceutical students, sharing the project's inspiration, background, experimental concept, hardware design and Wiki/IP visual design.",
      why: "To bring synthetic biology out of the laboratory and help more young people learn about the frontier, the team gave a talk to students of Shenzhen First Vocational Technical School, whose daily coursework leans toward traditional pharmaceutical processes and rarely touches synthetic biology.",
      what: "The team focused its outreach on synthetic biology, explaining its application prospects in drug synthesis and biological detection against the current state of the pharmaceutical industry; introduced the iGEM competition and the value of youth science-practice activities, and used the airborne influenza A biosensor as a case to explain the project's inspiration and experimental concept. In the Q&A session we answered questions and collected real end-user suggestions such as improving device portability and shortening detection time.",
      how: "For the students, the session offered close contact with research content and an early view of the research and industry directions their major maps to; for the team, explaining the project to a non-specialist audience forced us to reorganize and simplify complex technical logic. The limitation was time — no in-depth hands-on workshop was possible — and in future we hope to build a regular outreach channel for young audiences."
    },
    {
      slug: "freshman",
      onMap: false,
      name: "2026 Freshman Outreach",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "public",
      coord: { top: 90.3, left: 26.6 },
      photo: "",
      org: "2026 freshman undergraduates in pharmacy and pharmaceutical engineering at our school",
      role: "Freshman science outreach session",
      desc: "Delivered jointly by the iGEM student team and advisors, introducing synthetic biology and the airborne influenza A detection project to 2026 freshmen.",
      why: "While advancing the research, the team also wanted to bring synthetic biology out of the laboratory, so we gave a session to 2026 freshmen in pharmacy and pharmaceutical engineering, introducing the design thinking of the airborne influenza A detection project and popularizing basic concepts, research approaches and application prospects of synthetic biology.",
      what: "Starting from synthetic biology itself, the session helped students build the ”design-build-test-learn” engineering mindset; introduced research projects, academic competitions, conferences and social practice, highlighted the airborne influenza A biosensor project and its positioning for infection-risk warning in enclosed spaces, and shared our interview experiences with experts from the CDC, health commission and hardware development. The team's self-written influenza A protection handbook was distributed.",
      how: "Most participants built a basic understanding of synthetic biology, the iGEM competition and the influenza A detection sensor project, gained initial exposure to genetic engineering, broke the fixed impression that research is far removed from young learners, and received influenza A protection education. The limitation was session length, which did not allow detailed explanation of experimental principles and hardware details; next we plan to open consultation channels, hold small themed salons and collect handbook feedback."
    },
    {
      slug: "liu-xiaolong",
      name: "Xiaolong Liu",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "science",
      coord: { top: 90.8, left: 27.3 },
      photo: "",
      org: "Nanobody molecular docking and modeling",
      role: "Advisor",
      desc: "Advises on nanobody structural modeling, molecular-docking methodology and computational validation workflows, with systematic critique and improvement directions on dry-lab method choice, modeling quality and result presentation.",
      why: "The dry lab had completed one round: structure prediction of 16 nanobodies, obtaining HA antigens of the H1N1/H2N2/H3N2 subtypes, online docking, and self-built formulas to process binding energies — but the team was unsure whether these numbers could support nanobody selection, so we asked Mr. Xiaolong Liu to review the methodology and validation workflow.",
      what: "Mr. Liu pointed out that current online docking websites are not necessarily applicable to nanobody-protein systems and the original literature and scope of applicability must be checked; homology modeling is unreliable when template identity is below 25%, and he suggested switching to AlphaFold 3.0 with Ramachandran plot evaluation; HA structures from the PDB need water removal, metal/salt-ion removal, hydrogen addition and charge equilibration. Showing only total binding energy is insufficient — MM/GBSA free-energy decomposition should be done to answer whether key interactions concentrate in the CDR region; docking results are rigid/semi-flexible only and at least 100 ns of molecular dynamics simulation is needed, with affinity finally validated by SPR/MST wet-lab experiments, closing the loop of ”modeling-docking-analysis-MD-wet lab”.",
      how: "The team realized molecular docking is not ”done” once results are produced: next we will remodel the 16 nanobodies with AlphaFold 3.0 and add Ramachandran plot evaluation; preprocess HA proteins with desalting/hydrogenation/charge equilibration; verify the docking websites' original literature; perform MM/GBSA decomposition with residue-contribution heatmaps; add MD simulations; and finally close the loop with SPR/MST wet-lab validation. Mr. Xiaolong Liu will continue advising the mathematical modeling work."
    },
    {
      slug: "huang-linsen",
      name: "Linsen Huang",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Shenzhen, Guangdong",
      category: "science",
      coord: { top: 90.2, left: 26.3 },
      photo: "",
      org: "Synthetic biology and computation advisory",
      role: "Project advisor / consultant",
      desc: "As a member of the project's advising and consulting team, participates in discussions and reviews of project direction and interdisciplinary collaboration.",
      why: "During the project, Mr. Linsen Huang, as a member of the advising and consulting team, participated in discussions of project direction and key decisions, providing feedback from synthetic-biology and interdisciplinary perspectives.",
      what: "Drawing on his experience in synthetic biology and interdisciplinary mentoring, Mr. Linsen Huang discussed the project's overall direction and stage priorities with the team, helping keep expert interviews, experiment design and competition preparation coherent.",
      how: "The relevant feedback has been incorporated into the team's project advancement and internal collaboration arrangements, continuing to serve as part of internal project support."
    },
    {
      slug: "yeast-online",
      onMap: false,
      name: "Online Yeast Workshop",
      provinceId: "CN-44",
      provinceName: "Guangdong",
      region: "Online · multi-university",
      category: "science",
      coord: { top: 91.4, left: 28.3 },
      photo: "",
      org: "Co-organized by multiple universities",
      role: "Online yeast-themed exchange meeting",
      desc: "A yeast-themed online exchange co-organized with multiple universities, where the team shared the project, discussed difficulties and learned from peers.",
      why: "While advancing the project, the team not only gained guidance from expert interviews but also actively exchanged with other iGEM teams. The online yeast workshop was a key part of this cross-university peer exchange.",
      what: "At the online yeast workshop, the team discussed shared technical challenges — yeast chassis, signaling pathways, reporter systems and hardware enrichment — with teams from multiple universities, sharing experiences and pitfalls in yeast engineering and biosensor construction.",
      how: "These exchanges let the team see other teams' strengths and face its own shortcomings; while discussing each project's difficulties, the team gained considerable inspiration and calibrated subsequent research directions accordingly."
    },
    {
      slug: "luo-juan",
      name: "Juan Luo",
      provinceId: "CN-33",
      provinceName: "Zhejiang",
      region: "Hangzhou, Zhejiang",
      category: "industry",
      coord: { top: 55.2, left: 40.4 },
      photo: "",
      org: "A Grade III Class A hospital in Hangzhou",
      role: "Frontline ICU nurse",
      desc: "A frontline ICU nurse who daily performs high-frequency procedures such as ventilator management and sputum suction for intubated/tracheostomized patients, with a frontline perspective on hospital air management, protection workflows and infection control. (An original section of this page, not listed separately in the docx; kept at the user's request.)",
      why: "To verify the real clinical demand and implementation feasibility of the airborne influenza A detection device, the team conducted an in-depth interview with a frontline ICU nurse at a Grade III Class A hospital in Hangzhou, confirming the device's application value and productization challenges from the front line of hospital infection control.",
      what: "The hospital's current air disinfection cannot fully eliminate aerosolized virus, and high-risk procedures such as sputum suction require tiered protection. The hardest part of control is visitors ”who are sick without knowing it”. If entrances/wards displayed real-time air-virus indicators graded low/medium/high risk, families' concerns could be eased; miniaturizing the device into a ventilator exhalation valve would enable individualized monitoring. Quality comes first for hospital equipment purchases and operation should not be cumbersome; drug-resistant bacteria such as Acinetobacter baumannii and Klebsiella pneumoniae exist in hospitals, and swapping the yeast sensor's nanobody could extend coverage to multiple pathogens; but public-hospital equipment requires open tendering, and inclusion in diagnosis requires authoritative certification.",
      how: "After the interview, the team made ventilator exhalation-valve integration and graded result display priorities of the application design, and listed authoritative certification, tendering procedures, regulatory communication and modular multi-pathogen expansion as subsequent productization directions. Note: the device has not entered the hospital system; the relevant access and certification items are all to-do, not achieved results."
    }
  ];

  function getInitial(name) {
    return name.replace(/^(Dr\.|Prof\.)\s*/, "").charAt(0).toUpperCase();
  }

  // Default portrait silhouette: fallback for experts without photos (shared by pin head and popover avatar)
  const SILHOUETTE_SVG = '<svg class="hz-cluster__silhouette" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.4" r="4.1"></circle><path d="M3.6 20.6c0-4.5 3.9-6.7 8.4-6.7s8.4 2.2 8.4 6.7z"></path></svg>';

  function faceHTML(expert) {
    if (expert && expert.photo) {
      return '<img class="hz-cluster__photo" src="' + expert.photo + '" alt="" loading="lazy" decoding="async">';
    }
    return SILHOUETTE_SVG;
  }

  // Expert detail cards and the map are adjacent blocks of the same article; queries must not be scoped to #hzMap.
  const articleSlide = root.closest(".detail-slide");
  const detailCard = articleSlide && articleSlide.querySelector(".hz-details-card.hz-details");
  const expertStack = detailCard && detailCard.querySelector(".hz-expert-stack");
  const expertIndex = articleSlide && articleSlide.querySelector("#hzExpertIndex");
  if (!detailCard || !expertStack) {
    console.warn("[HP map] Expert detail container not found; pin interactions skipped.");
    return;
  }
  const detailSlides = Array.from(expertStack.querySelectorAll(".hz-detail-slide"));
  const detailSlidesByExpert = new Map();
  detailSlides.forEach(slide => {
    const slug = slide.dataset.hzExpert;
    if (!slug || detailSlidesByExpert.has(slug)) {
      console.warn("[HP map] Ignored expert detail with missing/duplicate data-hz-expert.", slide);
      return;
    }
    detailSlidesByExpert.set(slug, slide);
  });

  /** Expand an expert's fold and scroll to it (anchor expert-<slug>). */
  function navigateToExpert(slug) {
    const anchor = document.getElementById("expert-" + slug);
    if (!anchor) {
      console.warn("[HP map] Anchor for expert '" + slug + "' not found; cannot scroll.");
      return;
    }
    const fold = anchor.closest ? anchor.closest("details.section-fold") : null;
    if (fold && !fold.open) {
      fold.open = true;
      window.requestAnimationFrame(function () { scrollToExpert(anchor); });
    } else {
      scrollToExpert(anchor);
    }
    if (window.location.hash !== "#expert-" + slug) {
      window.history.replaceState(null, "", "#expert-" + slug);
    }
  }

  function scrollToExpert(anchor) {
    const sp = window.SidebarProgress;
    if (sp && typeof sp.scrollToElement === "function") {
      // Use the site-wide reanchored scroll so the landing point clears the sticky nav (incl. progress section)
      sp.scrollToElement(anchor);
    } else if (typeof anchor.scrollIntoView === "function") {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (sp && typeof sp.recalculate === "function") sp.recalculate();
  }

  /** Left expert index: grouped and colored by category, avatar + name only, click to navigate. */
  function renderExpertIndex() {
    if (!expertIndex) return;
    expertIndex.innerHTML = "";
    const categoryOrder = ["science", "industry", "policy", "public"];
    const groups = new Map();
    chinaExperts.forEach(expert => {
      if (expert.onMap === false) return;
      if (!groups.has(expert.category)) groups.set(expert.category, []);
      groups.get(expert.category).push(expert);
    });
    categoryOrder.forEach(cat => {
      const members = groups.get(cat);
      if (!members || !members.length) return;
      const head = document.createElement("div");
      head.className = "hz-expert-index__group";
      head.innerHTML = '<span class="hz-legend-dot ' + cat + '"></span><span>' + (categoryNames[cat] || cat) + '</span>';
      expertIndex.appendChild(head);
      members.forEach(expert => {
        const link = document.createElement("a");
        link.className = "hz-expert-index__item";
        link.href = "#expert-" + expert.slug;
        link.setAttribute("aria-label", "View the interview with " + expert.name);
        link.innerHTML = '<span class="hz-expert-index__avatar">' + faceHTML(expert) +
          '</span><span class="hz-expert-index__name">' + expert.name + '</span>';
        link.addEventListener("click", function (event) {
          event.preventDefault();
          navigateToExpert(expert.slug);
        });
        expertIndex.appendChild(link);
      });
    });
  }
  renderExpertIndex();

  /** Keep the expert index exactly as tall as the map (map height scales with width; synced via JS). */
  function syncIndexHeight() {
    if (!expertIndex) return;
    const mapBox = document.getElementById("hzMapContainer");
    if (mapBox) expertIndex.style.maxHeight = mapBox.offsetHeight + "px";
  }
  syncIndexHeight();
  window.addEventListener("resize", syncIndexHeight);
  if (typeof ResizeObserver === "function") {
    const mapBox = document.getElementById("hzMapContainer");
    if (mapBox) new ResizeObserver(() => { syncIndexHeight(); }).observe(mapBox);
  }

  function syncOuterArticleHeight() {
    window.dispatchEvent(new CustomEvent("hp:content-resize"));
  }

  let activeCluster = null;
  let closeClusterTimer = null;
  let closeGeneration = 0;

  function scheduleCloseCluster() {
    if (!activeCluster) return;
    window.clearTimeout(closeClusterTimer);
    const generation = closeGeneration;
    closeClusterTimer = window.setTimeout(function () {
      if (generation !== closeGeneration) return;
      closeCluster(false);
    }, 80);
  }

  function cancelCloseCluster() {
    window.clearTimeout(closeClusterTimer);
    closeClusterTimer = null;
  }

  function closeCluster(returnFocus) {
    if (!activeCluster) return;
    cancelCloseCluster();
    const { button, popover } = activeCluster;
    button.setAttribute("aria-expanded", "false");
    popover.hidden = true;
    popover.remove();
    activeCluster = null;
    if (returnFocus && button.isConnected) button.focus();
    syncOuterArticleHeight();
  }

  function selectExpert(expert, pin) {
    root.querySelectorAll(".hz-cluster").forEach(item => item.classList.toggle("is-active", item === pin));
    navigateToExpert(expert.slug);
  }

  function getVisibleClusters() {
    const clusters = new Map();
    chinaExperts.forEach(expert => {
      if (expert.onMap === false) return;
      if (!expert.provinceId) return;
      if (!expert.slug || !detailSlidesByExpert.has(expert.slug)) {
        console.warn("[HP map] Expert '" + (expert.name || expert.slug) + "' has no matching detail card; skipped.");
        return;
      }
      if (!clusters.has(expert.provinceId)) {
        clusters.set(expert.provinceId, {
          id: expert.provinceId,
          name: expert.provinceName,
          coord: provinceCoordinates[expert.provinceId] || expert.coord,
          experts: [],
          categories: new Map()
        });
      }
      const cluster = clusters.get(expert.provinceId);
      cluster.experts.push(expert);
      cluster.categories.set(expert.category, (cluster.categories.get(expert.category) || 0) + 1);
    });
    return Array.from(clusters.values());
  }

  function openCluster(cluster, button, mode) {
    closeGeneration += 1;
    if (activeCluster && activeCluster.button === button) {
      if (mode === "click") {
        closeCluster(false);
        return;
      }
      cancelCloseCluster();
      return;
    }
    if (activeCluster) closeCluster(false);
    cancelCloseCluster();
    const popover = document.createElement("div");
    popover.className = "hz-cluster-popover";
    popover.id = "hz-cluster-popover-" + cluster.id;
    popover.setAttribute("role", "dialog");
    popover.setAttribute("aria-label", "Experts in " + cluster.name);
    popover.innerHTML = '<div class="hz-cluster-popover__header"><strong>' + cluster.name + '</strong><span>' + cluster.experts.length + (cluster.experts.length > 1 ? ' experts' : ' expert') + '</span></div><ul></ul>';
    const list = popover.querySelector("ul");
    cluster.experts.forEach(expert => {
      const item = document.createElement("li");
      const expertButton = document.createElement("button");
      expertButton.type = "button";
      expertButton.className = "hz-cluster-expert";
      expertButton.dataset.category = expert.category;
      expertButton.innerHTML = '<span class="hz-cluster-expert__avatar">' + faceHTML(expert) + '</span><span class="hz-cluster-expert__body"><span class="hz-cluster-expert__name">' + expert.name + '</span><span class="hz-cluster-expert__meta">' + categoryNames[expert.category] + ' · ' + expert.region + '</span></span>';
      expertButton.addEventListener("click", () => {
        closeCluster(false);
        selectExpert(expert, button);
      });
      item.appendChild(expertButton);
      list.appendChild(item);
    });
    root.querySelector("#chinaPins").appendChild(popover);
    const mapWidth = root.querySelector("#chinaPins").clientWidth;
    const mapHeight = root.querySelector("#chinaPins").clientHeight;
    const popoverWidth = Math.min(280, Math.max(220, mapWidth - 24));
    const buttonLeft = (parseFloat(button.style.left) / 100) * mapWidth;
    const buttonTop = (parseFloat(button.style.top) / 100) * mapHeight;
    popover.style.width = Math.min(popoverWidth, mapWidth - 24) + "px";
    const popoverHeight = popover.offsetHeight;
    // Pin tip sits on the coordinate (translate(-50%,-100%)); clearance covers full pin height + hover scale (1.14)
    const pinClearance = 60;
    popover.style.left = Math.max(12, Math.min(mapWidth - popover.offsetWidth - 12, buttonLeft - popover.offsetWidth / 2)) + "px";
    popover.style.top = buttonTop > popoverHeight + pinClearance ? buttonTop - popoverHeight - pinClearance + "px" : Math.min(mapHeight - popoverHeight - 12, buttonTop + 10) + "px";
    popover.addEventListener("mouseenter", cancelCloseCluster);
    popover.addEventListener("mouseleave", scheduleCloseCluster);
    button.addEventListener("mouseenter", cancelCloseCluster);
    button.addEventListener("mouseleave", scheduleCloseCluster);
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-controls", popover.id);
    popover.hidden = false;
    activeCluster = { button, popover };
    syncOuterArticleHeight();
  }

  function createCluster(cluster, container) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hz-cluster";
    button.dataset.province = cluster.id;
    button.style.left = cluster.coord.left + "%";
    button.style.top = cluster.coord.top + "%";
    button.setAttribute("aria-expanded", "false");
    const onlyExpert = cluster.experts.length === 1 ? cluster.experts[0] : null;
    if (onlyExpert) {
      button.setAttribute("aria-label", onlyExpert.name + ", 1 expert");
    } else {
      button.setAttribute("aria-label", cluster.experts.length + (cluster.experts.length > 1 ? " experts" : " expert") + " in " + cluster.name);
    }
    const categoryList = Array.from(cluster.categories.keys());
    const primaryColor = onlyExpert ? categoryColors[onlyExpert.category] || "#8B7355" : categoryColors[categoryList[0]] || "#8B7355";
    button.style.setProperty("--cluster-color", primaryColor);
    button.classList.remove("hz-cluster--mixed");
    if (onlyExpert) button.classList.add("hz-cluster--single");
    if (onlyExpert) {
      // Single expert: show the expert's photo (or default silhouette) inside the pin head
      button.innerHTML = '<span class="hz-cluster__head">' + faceHTML(onlyExpert) + '</span>';
    } else {
      // Multiple experts in one province: prefer the first expert with a photo, else fall back to a count
      const withPhoto = cluster.experts.find(expert => expert.photo);
      button.innerHTML = withPhoto
        ? '<span class="hz-cluster__head">' + faceHTML(withPhoto) + '</span><span class="hz-cluster__badge">' + cluster.experts.length + '</span>'
        : '<span class="hz-cluster__head hz-cluster__head--count">' + cluster.experts.length + '</span>';
    }
    button.addEventListener("mouseenter", () => openCluster(cluster, button, "hover"));
    button.addEventListener("mouseleave", scheduleCloseCluster);
    button.addEventListener("keydown", event => {
      if (event.key === "Escape") closeCluster(true);
    });
    button.addEventListener("focus", () => openCluster(cluster, button, "focus"));
    button.addEventListener("click", () => openCluster(cluster, button, "click"));
    container.appendChild(button);
    return button;
  }

  function renderPins() {
    const chinaPins = root.querySelector("#chinaPins");
    closeGeneration += 1;
    cancelCloseCluster();
    closeCluster(false);
    chinaPins.innerHTML = "";
    getVisibleClusters().forEach((cluster, idx) => {
      const button = createCluster(cluster, chinaPins);
      if (button) button.style.animationDelay = (idx * 70) + "ms";
    });
    root.dispatchEvent(new CustomEvent("hz:pins-rendered", { bubbles: true }));
  }

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(() => {
      syncOuterArticleHeight();
    }).observe(expertStack);
  }

  document.addEventListener("click", event => {
    if (activeCluster && !activeCluster.popover.contains(event.target) && !activeCluster.button.contains(event.target)) closeCluster(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCluster(true);
  });

  /** "Back to the map" inside expert cards: collapse the fold and scroll back to the map. */
  function setupBackToMap() {
    if (!detailCard) return;
    detailCard.querySelectorAll(".hz-back-to-map").forEach(btn => {
      btn.addEventListener("click", function () {
        const slide = btn.closest(".hz-detail-slide");
        const fold = slide ? slide.closest("details.section-fold") : null;
        if (fold) fold.open = false;   // auto-collapse the big fold
        const target = document.getElementById("hzMap") || document.getElementById("section-experts");
        if (!target) return;
        const sp = window.SidebarProgress;
        if (sp && typeof sp.scrollToElement === "function") {
          // let the collapse settle into layout first, then reanchored-scroll back to the map
          window.requestAnimationFrame(function () { sp.scrollToElement(target); });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if ((window.location.hash || "").indexOf("#expert-") === 0) {
          window.history.replaceState(null, "", "#section-experts");
        }
      });
    });
  }
  setupBackToMap();

  renderPins();
  }

  // Initialize directly: render pins as soon as DOM is ready, avoiding conflicts with IntersectionObserver / content-visibility that could hide pins.
  initMap();
})();

