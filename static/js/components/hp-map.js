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
    "CN-44": { top: 87.0, left: 66.0 },
    "CN-33": { top: 62.0, left: 75.5 },
    "CN-43": { top: 76.0, left: 62.5 }
  };
  const chinaExperts = [
    {
      slug: "wang-wenjie",
      name: "王文杰",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 79.5, left: 69.0 },
      photo: "../static/image/HP/expert_img/wangwenjie.jpg",
      org: "深圳市妇幼保健院 · 南方科技大学医学院",
      role: "检验科主任 · 教学督导",
      desc: "长期从事新型生物学诊断标志物、肿瘤与自噬等方向研究；担任多个医学检验相关专业委员会职务，在临床检验与体外诊断领域具有丰富经验。",
      why: `为了弄清甲型流感病毒检测在真实医疗环境里到底需要满足哪些需求，也为了进一步确认我们"基于工程化酵母的甲型流感病毒生物传感器"项目究竟有什么用，我们访谈了一位临床检验专家。访谈里，我们聊了甲型流感病毒的变异特点、现有检测技术的局限、抗病毒治疗策略，以及检测设备往后的发展方向。`,
      what: `甲型流感病毒主要通过血凝素（HA）和神经氨酸酶（NA）蛋白发生变异，而当前医院检测的重点主要在于判断病毒感染情况，而非区分具体亚型。现有核酸检测和快速抗原检测通常需要在患者出现症状并达到一定病毒载量后才能发挥作用，检测技术的发展仍存在一定滞后性。未来检测技术的重点不只是认出病毒种类，而是在更早就发现病毒的存在；如果在学校、幼儿园、地铁这类人员密集场所做环境监测、提前捕捉传播迹象，公共卫生管理就有机会从"被动治疗"转向"主动预防"。专家也提醒我们充分考虑实际应用中的限制因素，例如检测范围、环境变量以及病毒浓度变化等问题，并建议在后续实验设计中进一步控制变量、明确应用场景。`,
      how: "这次交流把实验室里的工程设计和真实的临床需求连了起来。专家的话让我们重新打量传感器的检测目标：与其死磕病毒亚型识别，不如去做更广谱、更快、更省事的病毒监测方案。和一线临床专家聊过之后我们也更清楚了，一个真正用得上的生物技术产品，光在实验室里把性能磨好还不够，得先接住现实里的医疗需求和公共健康挑战。"
    },
    {
      slug: "gu-kai",
      name: "顾凯",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Guangzhou, Guangdong",
      category: "science",
      coord: { top: 73.0, left: 63.5 },
      photo: "../static/image/HP/expert_img/fukai.jpg",
      org: "中山大学",
      role: "临床医学博士",
      desc: "研究方向涉及肺部疾病、呼吸道感染与临床诊断，就本项目的技术可行性与临床应用场景提出了系统性建议。",
      why: `为验证我们"基于工程化酵母的甲型流感病毒生物传感器"项目的技术可行性与临床适配性，团队向一位中山大学临床医学博士介绍了项目的三大模块（信号识别、信号传导、信号报告）与两种装置形态（环境被动吸入 / 单人主动呼气），并就技术方案、临床应用场景及未来拓展方向展开深入交流。`,
      what: `专家围绕核心技术提出了荧光是否实时上传、能否裸眼观察、荧光（1-2 小时）与蓝白斑表达时间差异、酵母存活周期（复苏后 2-3 天活性高峰、可维持 1-2 周）与培养基更换、装置整体成本（主动呼气模式预计约 10 元）等关键问题，并比较了项目相对 PCR / 试纸条"操作便捷、灵敏度高、假阳性率低"的差异化优势。在团队请教部分，专家解答：呼吸道感染者呼出气体含病毒气溶胶，本装置对该人群检测效果更好；呼吸道黏膜受损后病毒更易侵入但会被免疫清除，呈动态变化；甲流不诱发肺癌但会加重已患肺癌者病情；肺癌标志物特异性不足、低剂量螺旋 CT 仍是金标准，呼气检测肺癌尚处实验阶段；基层推广的关键在于成本可控。专家综合评价该技术"用有机生物检测另一有机生物"构思新颖，并给出四点建议：提升检测时效性、坚定单人呼气模式、成本决定基层可行性、与呼吸科及生物医学工程等多领域专家交叉访谈。`,
      how: `这次交流形成了明确的项目反馈闭环：检测响应 1-2 小时偏长 → 优化信号通路缩短响应时间；呼气样本病毒更富集 → 主推单人呼气模式并辅以富集装置；肿瘤标志物特异性不足 → 暂缓肺癌检测、聚焦呼吸道病毒；成本是基层推广的决定因素 → 聚焦主动呼气低成本方案。专家认可了项目技术方向，并使"单人呼气模式在临床可行性上优于环境采样"成为后续设计的核心依据，后续将着力压缩检测响应时间、控制硬件成本，并审慎评估应用场景的临床适配性。`
    },
    {
      slug: "qiu-xinyuan",
      name: "邱鑫源",
      provinceId: "CN-43",
      provinceName: "湖南省",
      region: "Changsha, Hunan",
      category: "science",
      coord: { top: 69.0, left: 59.5 },
      photo: "",
      org: "国防科技大学",
      role: "副研究员 · 多年 iGEM 参赛与指导经验",
      desc: "拥有多年 iGEM 参赛与团队指导经验，在基因线路设计与合成生物学竞赛评审方面具有专业视角；本次为项目中期指导访谈。",
      why: `为走出实验与 iGEM 事项上的瓶颈，团队邀请国防科技大学副研究员邱鑫源老师进行中期指导，就底盘选择、技术路线、数学模型与人类实践反馈等方面获取专业 critique 与优化建议。`,
      what: `专家指出：酵母细胞壁较厚，病毒颗粒能否穿透到达 GPCR 受体尚未验证，建议优先验证该前提，否则考虑更换底盘；现有 PAGERs 的 GPCR 人源化过于复杂，可改酵母自身 RTK 胞外区识别甲流蛋白并以 Western Blot 验证磷酸化；灵敏度应按实际病毒颗粒数定义，团队缺定量数据；需补充 MAPK 磷酸化等分子证据、降低 FUS1 启动子泄漏、CRISPR 改用 Golden Gate。模型方面，参数须来自实验或文献、不可随意设定，宜用 ODE 并让模型反过来指导实验。HP 方面，评审看重"为什么做"，专家访谈不能替代事实数据、应避免诉诸权威；HP 价值在反馈是否真实影响决策且可追溯；当前优先级是完成第一个简单清楚的 DBTL 循环。`,
      how: `访谈后，团队将项目背景论证与底盘/受体验证列为最高优先级，明确先完成第一个能工作的 DBTL 循环、再推进下游；并以"越简单越好"的减法思维重新审视技术路线。需说明：以上为专家 critique 与团队后续计划，属设计调整方向，不代表实验已验证或底盘已更换。`
    },
    {
      slug: "luo-juan",
      name: "罗娟",
      provinceId: "CN-33",
      provinceName: "浙江省",
      region: "Hangzhou, Zhejiang",
      category: "industry",
      coord: { top: 57.5, left: 80.0 },
      photo: "",
      org: "杭州三甲医院",
      role: "重症监护室一线护理人员",
      desc: "重症监护室（ICU）一线护理人员，日常执行呼吸机管理、气管插管/切开患者吸痰等高频操作，对医院空气管理、防护流程与院感防控具有一线视角。",
      why: `为验证甲流病毒环境检测装置在临床场景中的实际需求与落地可行性，团队邀请杭州三甲医院重症监护室一线护理人员进行深度访谈，从院感防控一线视角确认装置的应用价值与产品化挑战。`,
      what: `医院现有空气消毒无法全面消杀气溶胶病毒；吸痰等高危操作需分级防护，确诊传染病用密闭式吸痰。防控最头疼"有病而不自知"的探视家属。若入口/病房实时显示空气病毒指标并按低/中/高危分级，可减轻家属顾虑；将装置微缩集成至呼吸机呼气阀可实现个体化监测。临床检测以咽/鼻拭子为主、约 2-4 小时，居家快检易假阳性仅作初筛。医院引进设备质量首位且操作不宜繁琐，定期更换酵母干粉与培养基方案可接受。医院存在鲍曼不动杆菌、肺炎克雷伯菌等耐药菌，酵母传感器换纳米抗体可拓展多病原体；但公立医院设备须公开招标、纳入诊断须权威认证，需对接疾控中心并争取学校背书。`,
      how: `访谈后，团队将呼吸机呼气阀集成与结果分级显示纳入应用设计重点，并把权威认证、招标流程、监管沟通及模块化多病原体拓展列为产品化落地后续方向。需说明：装置尚未进入医院体系，相关准入与认证均为待办，非已达成结果。`
    },
    {
      slug: "shenzhen-cdc",
      name: "房师松",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "policy",
      coord: { top: 79.5, left: 69.0 },
      photo: "",
      org: "深圳市疾控中心病原所",
      role: "流感监测与病原检测方向专家",
      desc: "长期从事流感病原学与监测相关工作，从公共卫生监测体系与病原检测流程的角度，就项目选题范围、空气采样可行性与检测结果的适用边界提出反馈。",
      why: `前几轮访谈已帮我们确认了临床需求与使用装置场景，但公共卫生系统自身的运行逻辑——流感数据是怎么产生的、一个检测结果被允许用在哪里——我们一直没有真正对上话。带着"只认甲流 HA 这一个靶点在真实流感监测中是否成立"和"空气里到底测不测得到病毒"这两个正在拖慢项目的问题，团队访谈了深圳市疾控中心病原所专家。`,
      what: `专家强调三点：其一，甲流与乙流是循环流行，不能主观认定甲流感染规模一定更大，临床也存在乙型重症病例，主流做法是甲流 + 乙流双重检测，只做甲流就无法排除乙流感染，汇报时必须正视该缺陷，并厘清型、亚种、亚系的概念（乙型分 Victoria 系与 Yamagata 系）。其二，型别层面诊断应优先选择保守区段（M/NP/NS），只有做亚型区分才动用高变异的 HA/NA；HA 头部受体结合区变异大、颈区相对保守；抗原–抗体识别依赖蛋白空间四级结构，不能靠截取线性序列代表抗原；扩大毒株覆盖可参考马赛克（Mosaic）算法。其三，空气检测的瓶颈在前端采样：病毒颗粒粒径小、普通滤膜截留有限、细菌与病毒的收集方案不能通用，需解决采样器选型、干法/湿法收集、滤膜选型与病毒浓缩工艺；PCR 存在拷贝数下限而空气病毒载量普遍偏低；不建议进入 ICU 等临床患者场景（伦理与风险障碍），更推荐医院急诊、地铁、公交、学校、养殖场等人群密集公共场所。落地方面：科研设备无需严苛注册流程，但结果仅作科研参考、不具备临床诊断效力；进入临床需三类医疗器械注册证、至少三家临床试验基地与足量样本比对；即便不进临床，公共环境使用仍需第三方机构校准验证。科研方法上要求用真实临床样本、统计学指标论证性能，并与成熟手段在灵敏度、特异性、成本、操作难度、抗污染能力上多维度横向对比。`,
      how: `团队据此把"当前仅针对甲型流感 HA 抗原"从隐含前提改写为需要明确写出的项目边界，乙型流感是否纳入检测范围记为待定；将抗原构象表达与保守区段评估写入识别验证待办（属设计方向，尚未实验验证）；把空气采样与浓缩从配套环节提升为前端关键路径，并重新评估 ICU / 呼吸机呼气阀设想（与既有访谈结论存在冲突，尚未定论）；注册、第三方校准与临床比对列为产品化后续路径。需说明：以上内容来自团队访谈纪要，涉及检测范围、灵敏度与注册路径的表述均待后续实验与一手资料复核。`
    },
    {
      slug: "deng-gong",
      name: "邓工",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Dapeng, Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 79.5, left: 69.0 },
      photo: "",
      org: "医疗器械硬件开发",
      role: "医疗器械硬件开发工程师 · 多年医疗器械研发经验",
      desc: "长期从事医疗器械硬件研发，从工程实现、研发流程与合规角度，就空气病毒富集方案、参赛交付形态、生物安全与知识产权边界提出反馈。",
      why: `装置的技术路线在纸上已经闭合——定时抽气、液相富集、酵母检测、定性预警——但工程实现上团队完全是外行：气体里的病毒到底怎么进入液体，以及在 8–11 月的竞赛周期里究竟该交付什么。带着这两个问题，团队在深圳大鹏向一位有多年医疗器械研发经验的硬件工程师做了一次方案问诊。`,
      what: `专家把风险全部压在富集环节：化学与光学部分难度相对可控，真正的难点是空气中病毒的捕获与液相富集；病毒粒径小，直接通气进入反应液大多以气泡逸出，长时间通气还会造成试剂挥发损耗。可行思路包括涡旋搅拌（气液旋流充分接触）与多层膜过滤（上层截留细菌等大颗粒、下层纳米膜截留病毒后洗脱），膜过滤的痛点是病毒易穿膜、压力过高易堵膜，可用脉冲加压与震荡缓解；并以尿液外泌体富集作类比，指出实验室可实现但工程化会撞上时间、堵塞与杂质干扰。流程上要求先输出《产品技术要求》，量化采样时长、气泵流量、液体体积、温湿度范围、接口需求、假阳性/假阴性指标与验证方法，检索药监局器械数据库、区分一/二/三类器械与强制/行业/企业标准；先搭简易模拟装置验证"病毒能否进入液相"与"富集效率"，再拆下位机（气泵、电磁阀、温控驱动）与上位机（设置采样时间、显示结果）并定义通信协议。竞赛现实评估：2–3 个月做出完整可工作样机难度很高，建议优先交付外观图、工作原理框图、分模块原理图与局部核心功能演示件，但团队必须吃透原理，只拿图纸讲不清会被判定作假。风险与合规：设备内会富集活病毒，必须有内部灭活方案与验证手段；商业化前须做专利检索与规避设计，可研究竞品原理做改进创新，严禁照抄复刻；创新可以是场景创新或局部改进，优先复用成熟子模块。另指出酵母识别 HA 蛋白的同类商业化产品他未调研过，需团队自行查文献。`,
      how: `团队据此把富集从配套环节提升为独立的硬件子模块，将"病毒能否有效进入液相"与"富集效率"设为先行的原理验证节点（先搭简易模拟装置，不做整机）；把 50 ㎡房间、每小时采样一次、洗脱至 1 mL、检测温度 25–28 ℃ 等口头约定整理成待逐条确认的《产品技术要求》条目（属设计输入，非实测结果）；参赛交付改为图纸 + 局部演示件，并把"上台成员能解释富集与检测两段原理"写入备赛要求；设备内部病毒灭活方案与验证手段列为硬件强制项，需与学校/实验室生物安全流程对接；专利检索与规避设计列为商业化前置。定性输出与 ICU 访谈提出的分级显示诉求之间存在张力，记为待权衡。以上均为设计参考与后续计划，有待原理验证实验复核。`
    },
    {
      slug: "liu-xiaolong",
      name: "刘小龙",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "science",
      coord: { top: 79.5, left: 69.0 },
      photo: "",
      org: "分子对接与建模方向指导",
      role: "纳米抗体分子对接与建模指导教师",
      desc: "在纳米抗体结构建模、分子对接方法学与计算验证流程方面给予指导，就项目干实验的工具选择、建模质量评估与结果呈现提出系统性批评与改进方向。",
      why: `干实验这边，团队已跑完一轮看似完整的流程：16 个纳米抗体结构预测、从 NCBI 取得 H1N1/H2N2/H3N2 三个亚型的 HA 结构、在线对接、再用玻尔兹曼分布自建公式处理结合能。但团队自己对这些数字能否支撑纳米抗体的选择没有把握，于是把整套流程拿去请一位做分子对接与建模的老师把关。`,
      what: `指导老师提出四类问题：其一，方法学适用性——现用在线对接平台未必针对蛋白–蛋白、更未必针对抗体–抗原对接设计，纳米抗体是完整抗体的单链片段、与 Y 字型 IgG 不同，通用算法可能不适用；必须查原始论文确认采样算法与适用范围，工具过小众、缺少同行引用会导致评审质疑可信度（比喻：用错误方法算 1+1=2 看似正确，换成 2+3 未必算得对）。其二，建模与预处理——Swiss-Model 等同源建模在模板同源性偏低（如低于 25%）时不可靠，建议改用 AlphaFold 3.0 并给出置信度，建模后需做拉氏图等质量评估（要求 95% 以上残基落在允许区）；PDB 下载的 HA 结构未做去水、去金属离子、去盐离子、加氢与电荷平衡，对接环境不准确。其三，结果深度——仅展示总结合能不够，需做 MM/GBSA 自由能拆解、逐残基分析贡献并验证关键作用是否集中在 CDR 区；需设定阈值与基线（如结合能低于 −150 kcal/mol），用热图、PyMOL 与 PLIP 呈现氢键、疏水与静电细节，而非缺乏逻辑关联的柱状图。其四，验证闭环——对接仅为刚性/半柔性状态，需补至少 100 ns 分子动力学模拟验证溶剂化环境中的稳定性以排除假阳性，最终用 SPR 或 MST 实测亲和力；团队目前尚未做过任何分子互作湿实验。工具建议：Rosetta、Boltz 权威性高但部署门槛大，现阶段优先选用被广泛引用的在线工具，相互作用解析用 PLIP。对 AI 辅助计算可接受，但方法必须来自已开源且经同行验证的来源，不得自创未经验证的方法。`,
      how: `团队据此把"核查现有对接工具的方法学原始文献、确认是否支持纳米抗体—蛋白对接"列为第一步待办，并把改用被广泛引用的对接工具、后续视条件部署 Rosetta 纳入路线（现阶段以公共在线工具为主）；将 AlphaFold 3.0 重新建模 16 个纳米抗体、补拉氏图与置信度评估、对 HA 结构做去离子/加氢/电荷平衡预处理列为返工项；把 MM/GBSA 逐残基拆解、阈值与基线、热图与 PyMOL 可视化写入结果呈现规范；将 100 ns MD 模拟与 SPR/MST 湿实验列为计算—实验闭环的必要环节，并明确当前尚未开展任何互作湿实验。以上均为交流形成的改进方案与待办，返工尚未完成，涉及结合能与亲和力的表述均为模型计算结果，有待 MD 与湿实验复核。`
    }
  ];

  function getInitial(name) {
    return name.replace(/^(Dr\.|Prof\.)\s*/, "").charAt(0).toUpperCase();
  }

  // 专家详情卡与地图是同一篇文章中的相邻区块，不能限制在 #hzMap 内查询。
  const articleSlide = root.closest(".detail-slide");
  const detailCard = articleSlide && articleSlide.querySelector(".hz-details-card.hz-details");
  const detailPanel = detailCard && detailCard.querySelector("#hzDetailPanel");
  const detailViewport = detailCard && detailCard.querySelector("#hzDetailViewport");
  const detailTrack = detailCard && detailCard.querySelector("#hzDetailTrack");
  const detailsIntro = detailCard && detailCard.querySelector("#hzDetailsIntro");
  if (!detailCard || !detailPanel || !detailViewport || !detailTrack || !detailsIntro) {
    console.warn("[HP map] 未找到专家详情容器，地图图钉交互未初始化。");
    return;
  }
  const detailSlides = Array.from(detailTrack.querySelectorAll(":scope > .hz-detail-slide"));
  const detailSlidesByExpert = new Map();
  detailSlides.forEach(slide => {
    const slug = slide.dataset.hzExpert;
    if (!slug || detailSlidesByExpert.has(slug)) {
      console.warn("[HP map] 忽略缺失或重复 data-hz-expert 的专家详情。", slide);
      return;
    }
    detailSlidesByExpert.set(slug, slide);
  });

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
    const slide = detailSlidesByExpert.get(expert.slug);
    if (!slide) {
      console.warn("[HP map] 未找到专家“" + expert.slug + "”的详情，无法切换。");
      return;
    }
    const slideIndex = detailSlides.indexOf(slide);
    detailPanel.hidden = false;
    detailsIntro.hidden = true;
    detailTrack.style.transform = "translate3d(" + (-slideIndex * detailViewport.clientWidth) + "px, 0, 0)";
    detailViewport.style.height = slide.offsetHeight + "px";
    detailSlides.forEach((item, index) => {
      const active = index === slideIndex;
      item.setAttribute("aria-hidden", active ? "false" : "true");
      item.inert = !active;
    });
    root.querySelectorAll(".hz-cluster").forEach(item => item.classList.toggle("is-active", item === pin));
    detailPanel.setAttribute("aria-label", expert.name + "的访谈记录");
    syncOuterArticleHeight();
  }

  function getVisibleClusters() {
    const active = new Set(Array.from(root.querySelectorAll('#hzFilter input[type="checkbox"]:checked')).map(cb => cb.value));
    const clusters = new Map();
    chinaExperts.forEach(expert => {
      if (!expert.provinceId || !active.has(expert.category)) return;
      if (!expert.slug || !detailSlidesByExpert.has(expert.slug)) {
        console.warn("[HP map] 专家 “" + (expert.name || expert.slug) + "” 缺少可映射的详情卡，已跳过渲染。");
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
    popover.setAttribute("aria-label", cluster.name + "专家列表");
    popover.innerHTML = '<div class="hz-cluster-popover__header"><strong>' + cluster.name + '</strong><span>' + cluster.experts.length + ' 位专家</span></div><ul></ul>';
    const list = popover.querySelector("ul");
    cluster.experts.forEach(expert => {
      const item = document.createElement("li");
      const expertButton = document.createElement("button");
      expertButton.type = "button";
      expertButton.className = "hz-cluster-expert";
      expertButton.dataset.category = expert.category;
      expertButton.innerHTML = '<span class="hz-cluster-expert__name">' + expert.name + '</span><span class="hz-cluster-expert__meta">' + categoryNames[expert.category] + ' · ' + expert.region + '</span>';
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
    popover.style.left = Math.max(12, Math.min(mapWidth - popover.offsetWidth - 12, buttonLeft - popover.offsetWidth / 2)) + "px";
    popover.style.top = buttonTop > popoverHeight + 20 ? buttonTop - popoverHeight - 20 + "px" : Math.min(mapHeight - popoverHeight - 12, buttonTop + 38) + "px";
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
      button.setAttribute("aria-label", onlyExpert.name + "，1 位专家");
    } else {
      button.setAttribute("aria-label", cluster.name + "，" + cluster.experts.length + " 位专家");
    }
    const categoryList = Array.from(cluster.categories.keys());
    const primaryColor = onlyExpert ? categoryColors[onlyExpert.category] || "#8B7355" : categoryColors[categoryList[0]] || "#8B7355";
    button.style.setProperty("--cluster-color", primaryColor);
    button.classList.remove("hz-cluster--mixed");
    if (onlyExpert) button.classList.add("hz-cluster--single");
    if (onlyExpert) {
      button.innerHTML = '<span class="hz-cluster__count">1</span><span class="hz-cluster__name">' + onlyExpert.name + '</span>';
    } else {
      button.innerHTML = '<span class="hz-cluster__count">' + cluster.experts.length + '</span><span class="hz-cluster__name">' + cluster.name.replace("省", "") + '</span>';
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
    getVisibleClusters().forEach(cluster => createCluster(cluster, chinaPins));
    root.dispatchEvent(new CustomEvent("hz:pins-rendered", { bubbles: true }));
  }

  if (typeof ResizeObserver === "function") {
    new ResizeObserver(() => {
      const activeSlide = detailSlides.find(slide => slide.getAttribute("aria-hidden") === "false");
      if (activeSlide && !detailPanel.hidden) {
        detailViewport.style.height = activeSlide.offsetHeight + "px";
        syncOuterArticleHeight();
      }
    }).observe(detailTrack);
  }

  root.querySelector("#hzFilter").addEventListener("change", renderPins);
  document.addEventListener("click", event => {
    if (activeCluster && !activeCluster.popover.contains(event.target) && !activeCluster.button.contains(event.target)) closeCluster(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCluster(true);
  });

  const filterEl = root.querySelector("#hzFilter");
  const filterToggle = root.querySelector("#hzFilterToggle");
  filterToggle.addEventListener("click", () => {
    const isCollapsed = filterEl.classList.toggle("collapsed");
    filterToggle.setAttribute("aria-expanded", String(!isCollapsed));
    filterToggle.textContent = isCollapsed ? "+" : "−";
    filterToggle.setAttribute("aria-label", isCollapsed ? "展开筛选面板" : "收起筛选面板");
  });

  renderPins();
  }

  // 直接初始化：DOM 就绪后立即渲染图钉，避免 IntersectionObserver 与 content-visibility 等优化策略冲突导致图钉不显示。
  initMap();
})();

