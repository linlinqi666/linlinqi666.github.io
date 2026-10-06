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
    "CN-44": { top: 87.7, left: 65.0 }, // 广东（几何质心）
    "CN-33": { top: 73.3, left: 76.0 }, // 浙江（几何质心）
    "CN-43": { top: 77.2, left: 62.3 }, // 湖南（几何质心）
    "CN-35": { top: 80.8, left: 72.5 }, // 福建（几何质心）
    "CN-21": { top: 40.3, left: 80.1 }, // 辽宁（几何质心）
    "CN-32": { top: 63.5, left: 74.9 }, // 江苏（几何质心）
    "CN-11": { top: 43.6, left: 70.0 }  // 北京（几何质心）
  };
  const chinaExperts = [
    {
      slug: "wang-wenjie",
      name: "王文杰",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 92.5, left: 70.5 },
      photo: "../static/image/any-icon/HP/expert_img/wangwenjie.jpg",
      org: "深圳某二甲医院",
      role: "医技科主任",
      desc: "长期从事临床检验与体外诊断相关工作，从一线医疗场景出发，就甲流检测痛点、治疗策略与预防需求提供反馈。",
      why: "作为团队成立后的第一次正式社会实践，我们带着一套还停留在纸面构想的酵母传感器去找了王文杰老师，最想弄明白两件事：真实医疗场景里甲流到底是怎么被检、怎么被治的，以及我们的装置究竟该瞄准“区分亚型”还是“先检得到空气里的病毒”。",
      what: "王文杰医生指出现有 IVD 产业总是在病毒于人体爆发、达到检测阈值后才发挥作用，而我们的空气监测传感器有望将防控逻辑从被动诊治转向主动预防，在病毒侵入人体前发出预警。但也指出：空气检测变量多、开放环境病毒浓度低；有效范围与限制条件尚不明确；假阳性与特异性风险突出，自检类试剂假阳性率可能达 50%—70%；临床以病毒阴阳性指导治疗、不区分亚型，分型由疾控发布；项目仍处实验室原型阶段，生产、成本、标准化与部署仍需补充。",
      how: "团队将专家建议转化为：坚定选择 HA 茎部保守区实现广谱检测、弱化亚型区分；优先设计密闭空间实验、建立变量控制方案；把特异性与假阳性控制作为后续优化重点；明确有效测量范围与环境限制条件。这次访谈让项目从技术构想走向问题导向，也让我们认识到：一个前沿传感器要真正服务公共卫生，既需要创新，更需要经得起临床场景、环境变量与实际应用的检验。"
    },
    {
      slug: "fu-kai",
      name: "付凯",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Guangzhou, Guangdong",
      category: "industry",
      coord: { top: 89.5, left: 68.3 },
      photo: "../static/image/any-icon/HP/expert_img/fukai.jpg",
      org: "中山大学",
      role: "临床医学博士",
      desc: "从临床可行性与基层推广角度，就空气监测与单人呼气检测、装置成本与未来拓展提出系统性建议。",
      why: "项目已聚焦 HA 茎部保守区、弱化亚型区分，并初探空气监测方向，但酵母传感器响应时间、报告体系、成本、酵母存活周期、与现有技术对比、环境空气与人体呼气孰优、能否拓展乙流或肺癌等问题仍需校准，于是访谈中山大学临床医学博士付凯。",
      what: "付凯博士认可“用有机生物检测另一有机生物”的构思，认为在合成生物学领域有独到价值，并指出呼吸道感染或肺部感染者呼出的气体会携带随气溶胶排出的病毒颗粒，装置对这类人群检测效果更好。但他也提醒：酵母信号通路从接收信号到表达荧光约需 1—2 小时，时间过长则时效性不高；环境空气病毒会被稀释且甲流在空气中只能维持几个小时，人体内病毒更富集、检测更方便。",
      how: "团队由此确认：主推单人呼气模式、辅以富集装置；优化信号通路、缩短响应时间；控制硬件成本（主动呼气装置预计可降至 10 元左右）；与多领域专家交叉访谈，暂缓肺癌检测、聚焦甲流等呼吸道病毒。已得到的是技术方向获认可、单人呼气优于环境采样；仍需补充蓝白斑表达时间、完整装置成本、酵母长期存活与更换方案、特异性与灵敏度定量数据等。"
    },
    {
      slug: "deng-manqing",
      name: "邓蔓青",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 92.7, left: 70.7 },
      photo: "",
      org: "深圳某三甲医院药学部",
      role: "副主任药师",
      desc: "从儿科临床与用药安全角度，就产品定位、易感人群适配、目标受众、生物安全与临床转化提出反馈。",
      why: "我们清晰了解了应用技术方向，但不等于项目能落地，于是询问一位儿科临床医生：儿童能否配合呼气检测、家长态度、校园场景是否欢迎、产品算检测试剂还是药品、进入医院或校园需过哪些流程、生物安全与伦理要求、目标受众与定价。",
      what: "邓老师认可项目的预防定位，认为本质是检测试剂而非药品，属于“预防”环节；若能在低病毒载量阶段识别病毒，对及早隔离有重要价值。生物安全方面，营养缺陷型培养基 + 过滤膜 + 自杀系统的措施，只要不向人体内喷洒、仅作环境/呼气检测，生物危害可控。",
      how: "团队进一步确认项目作为检测试剂、面向预防的定位，并认识到 B 端（学校、政府公共卫生项目等机构端）应优先于 C 端（家庭个人用户）；低载量灵敏度、活病毒与碎片区分、成本控制与合规审查，是决定项目能否落地的关键。市场与落地应优先 B 端，并将生物元件做成可替换模块以拓展其他病毒、细菌或支原体耐药检测。"
    },
    {
      slug: "deng-gong",
      name: "邓荣康",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "industry",
      coord: { top: 92.3, left: 70.3 },
      photo: "",
      org: "深圳某生物科技公司",
      role: "经理",
      desc: "从医疗器械硬件开发与工程化、研发流程与竞赛交付策略角度，就空气病毒富集瓶颈与产品化路径提出反馈。",
      why: "项目计划开发可采集环境空气中甲流病毒、富集后检测并给出风险预警的设备，面向学校、游轮等密闭空间，但团队在硬件工程化方面经验不足，尤其空气病毒富集、器件选型、研发流程与比赛交付方式都不清楚，因此请邓工从医疗器械开发角度把关。",
      what: "邓工指出检测化学与光学难度可控，真正的瓶颈是空气里病毒的捕获和液相富集：病毒粒径太小，直接通气进反应液大多以气泡逸出；两种方案：涡旋搅拌、多层膜过滤（上层截细菌、下层纳米膜截病毒再洗脱）。膜过滤病毒易穿膜、压力高易堵，可用脉冲加压或震荡缓解。建议先写《产品技术要求》量化各项指标，再定技术路线、拆硬件软件、做样机迭代；涉及活病毒须提前考虑内部灭活方案与安全验证。",
      how: "团队意识到主要困难在于空气病毒富集，后续将优先完成产品技术要求文档，基于它绘制外观图、工作原理框图与分模块原理图作为参赛材料，同时制作局部核心功能演示件；器件选型优先复用成熟子模块，专利方面做好检索与规避设计；答辩须吃透整套方案逻辑，避免被判定作假。"
    },
    {
      slug: "qiu-xinyuan",
      name: "邱鑫源",
      provinceId: "CN-43",
      provinceName: "湖南省",
      region: "Changsha, Hunan",
      category: "science",
      coord: { top: 76.5, left: 64.5 },
      photo: "",
      org: "合成生物学专家 · 多年 iGEM 指导经验",
      role: "iGEM 中期指导",
      desc: "在底盘工程、信号通路与 iGEM 评审策略方面给予指导，指出项目当前关键问题并提供宝贵意见。",
      why: "团队以酿酒酵母（S. cerevisiae）为底盘、基于 PAGERs 系统构建空气传播的甲型流感生物传感器，已完成部分遗传元件构建，但在实验设计、底盘工程与 iGEM 评审策略上屡遇瓶颈，于是邀请邱鑫源老师指导。",
      what: "专家提出一个长期被忽视的前提：“完整病毒能否穿过细胞壁抵达细胞膜？”酵母细胞壁较厚，目前并无证据表明完整病毒颗粒能穿透细胞壁并与受体结合；若验证失败应果断更换底盘。核心建议是“越简单越好”：改造酵母自身 RTK 系统、仅更换胞外结构域，并用 Western Blot 验证下游磷酸化；灵敏度须用单位体积可检病毒颗粒数定义。模型方面，Hill 函数近似可接受但参数须来自实验或文献；HP 不看数量与形式，更看重实践是否真正影响项目并推动改进。",
      how: "访谈带来三点转变：必要性优先（流行病学依据、酵母底盘不可替代性、差异化优势都缺乏数据证明）；复盘反思（曾忽略“病毒能否穿过细胞壁”的前提，应反复审视简化路线）；数据是唯一的论证语言。访谈后，团队将项目背景研究与底盘/受体可行性验证提升至最高优先级，并持续迭代优化。"
    },
    {
      slug: "shenzhen-cdc",
      name: "房师松",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "policy",
      coord: { top: 92.6, left: 70.6 },
      photo: "",
      org: "深圳市疾控中心病原所",
      role: "副所长",
      desc: "从公共卫生监测与疾控视角，就选题严谨性、检测靶基因选择、空气采样瓶颈、注册路径与科研验证方法提供判断标准。",
      why: "项目技术路线虽已确定，但想从疾控与公共卫生视角检验选题与技术设计的严谨性，访谈房师松专家，审视“先聚焦甲流识别、再逐步拓展”这一思路是否站得住脚，并指出技术设计与落地中容易被忽略的规范问题。",
      what: "专家提醒仅检测甲流存在漏检风险，临床主流为甲流+乙流双重检测；型别诊断优先选用 M/NP/NS 等保守基因，抗原表达优先选 HA 颈部保守区，并可参考马赛克算法覆盖流行毒株；须与抗原快检、荧光 PCR 等成熟手段做多维度横向对比。空气病毒检测核心难点在样本采集（收集器选型、干湿法收集、滤膜与浓缩工艺）。落地方面，科研设备与临床医疗器械两条路径注册要求不同；科研须依靠真实样本与统计学验证。",
      how: "团队确认：将甲流+乙流双重检测纳入后续规划；靶基因优先保守区、抗原表达选 HA 颈部、参考马赛克算法；空气采样前端捕获是链路瓶颈，须重点研究；科研设备与临床医疗器械两条路径注册要求不同，须尽早明确目标；真实样本、统计学验证、横向对比、可重复性成为后续实验与汇报的基本准则。"
    },
    {
      slug: "luo-zhouqing",
      name: "罗周卿",
      provinceId: "CN-35",
      provinceName: "福建省",
      region: "Xiamen, Fujian",
      category: "science",
      coord: { top: 85.3, left: 75.8 },
      photo: "",
      org: "厦门大学",
      role: "生命科学学院教授",
      desc: "在酵母工程改造、膜蛋白检测与受体路线方面经验丰富，就实验操作、受体改造、报告系统、细胞壁通透性与信号放大提供咨询。",
      why: "项目在 WB 膜蛋白表征、蛋白表达膜定位、报告系统稳定性、细胞壁屏障等方面遇到较大阻力，尤其膜蛋白检测非特异性条带多、人源 GPCR 在酵母中能否正确折叠与定位不确定，希望借罗老师在酵母工程改造方面的经验识别根源。",
      what: "罗老师建议膜蛋白 50—70℃ 短时间温和加热、优先机械破碎法提取、搭配专用膜蛋白溶解试剂、引入 HA 标签；受体方面更推荐改造酵母内源 Ste2（α-因子受体），信号肽替换为酵母表面展示信号肽。细胞壁方面不推荐原生质体方案，可选用细胞壁合成缺陷酵母突变株；HA 蛋白仅三四十 kDa，穿透并非主要障碍，前期可用抗原表位短肽跑通系统。报告系统建议基因组整合以消除拷贝数波动。",
      how: "团队调整：转向酵母内源 Ste2 受体改造，前期用抗原表位短肽跑通系统；报告系统规划基因组整合；调研细胞间通讯正反馈信号放大；膜蛋白检测改用温和加热与机械破碎并评估 HA 标签。HP 组将整理资料发给罗老师审阅，并提炼本技术相比现有检测手段的独特优势。"
    },
    {
      slug: "luo-yiwu",
      name: "罗义武",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "policy",
      coord: { top: 92.4, left: 70.4 },
      photo: "",
      org: "深圳市卫生健康委员会审批处",
      role: "四级调研员",
      desc: "从卫生健康行业管理与政策视角，就空气病毒监测现状、产品合规归类、生物安全法规要求与竞赛答辩策略提供指导。",
      why: "项目在技术路线、检测场景与产品落地策略上已有初步方向，但在空气病毒监测的行业标准、产品合规归类、生物安全法规要求以及竞赛答辩策略上，仍缺乏来自卫生健康行业管理视角的指导，于是访谈罗义武专家。",
      what: "罗老师指出卫生系统日常没有空气病毒常规检测业务，国内也没有官方标准与检测方法，这类设备不能作为医学诊断依据，只能做环境普筛与风险预警、不属于医疗器械；高价值场景是发热门诊、电梯、高铁、大巴、密闭教室等，其中发热门诊价值最高，可联动消杀设备形成管理闭环。实验验证建议实验室模拟箱体与现场测试结合，并建立风险浓度参照阈值。",
      how: "团队划清边界：只做密闭环境风险预警、不做人体诊断设备；锁定发热门诊、电梯、高铁、密闭教室等核心场景；重点研究空气消毒机配套传感配件路线；设计实验室模拟与现场测试两套验证方案，把生物安全与合规设计写进项目材料与答辩 PPT。"
    },
    {
      slug: "wu-hui",
      name: "吴辉",
      provinceId: "CN-21",
      provinceName: "辽宁省",
      region: "Dalian, Liaoning",
      category: "science",
      coord: { top: 46.8, left: 81.6 },
      photo: "",
      org: "大连理工大学",
      role: "教授",
      desc: "在信号识别、传导、响应各模块与 iGEM 策略方面给予指导，就实验优化、通路打通与元件提交提出具体建议。",
      why: "项目推进中 WB 检测膜蛋白条带不理想、人源化受体在酵母中表达不佳、MEL1 报告系统泄漏严重、CRISPR 敲除效率不稳定，希望借吴老师指导判断问题根源，明确当前阶段最该优先做什么。",
      what: "吴老师肯定项目想法新颖，但指出从信号识别到传导再到响应每个节点都有问题、不确定性较大，建议先重复文献中已成功的条件，不要所有元件都自己创新；当务之急是先打通一条完整通路、实现可视化响应，再考虑替换元件。膜蛋白表达建议参考文献条件；WB 建议液氮研磨破壁；报告系统可加抑制子或换更严谨启动子；CRISPR 建议多设计几个靶点同时做。",
      how: "团队重新调整优先级：不再追求各模块同时完美，而是先打通一条完整通路、实现可视化响应；实验上改用液氮研磨破壁、优化膜蛋白提取、尝试报告系统加抑制子或换启动子、CRISPR 多靶点并行；整理有初步趋势的元件提交 iGEM，并设计标准曲线实验评估冻干粉检测形式。"
    },
    {
      slug: "jia-honghua",
      name: "贾红华",
      provinceId: "CN-32",
      provinceName: "江苏省",
      region: "Nanjing, Jiangsu",
      category: "science",
      coord: { top: 66.0, left: 71.3 },
      photo: "",
      org: "南京工业大学",
      role: "生命与制药工程学院研究员",
      desc: "从合成生物学工程化视角审视项目设计、效果指标与验证方法，就文献对比、膜蛋白验证、报告系统、底盘选择与 iGEM 策略提供反馈。",
      why: "项目构建已完成，但功能表达与验证仍未完全走通，希望请贾老师从合成生物学工程化角度判断当前设计的核心问题，以及接下来最该优先验证什么。",
      what: "贾老师研究方向不是酵母，但认为项目思路有意思、工作量不小，部分环节尚未完全走通。他特别提到 2024 年 9 月 ACS Synthetic Biology 上魏娜团队用酵母生物传感器检测 H1N1 的工作，建议团队比较表面展示与膜结合方案的差异、明确自身新意。iGEM 既看重创新也看重最终效果；生物传感器最终要落实灵敏度与检测线/线性度两个关键指标，效果为王。",
      how: "团队从“埋头做复杂设计”转向“先验证、再优化、看效果”：查阅 ACS Synthetic Biology 相关文献比较方案；用荧光蛋白融合验证膜蛋白是否上膜并用共聚焦定位；评估溶壁酶处理细胞壁的可行性；继续尝试报告系统泄漏解决方案；梳理灵敏度、检测线、线性度等效果指标；联系刘光娜、刘万龙老师请教 iGEM 与酵母经验。"
    },
    {
      slug: "zhang-haili",
      name: "张海丽",
      provinceId: "CN-11",
      provinceName: "北京市",
      region: "Beijing",
      category: "science",
      coord: { top: 43.5, left: 70.1 },
      photo: "",
      org: "中国科学院数学与系统科学研究院",
      role: "博士",
      desc: "就可选建模模块、数据统计方法、建模与实验双向验证及现实约束提供咨询，帮助团队明确建模优先级。",
      why: "项目已有人源化改造和信号报告的部分实验数据（α-factor 梯度下的 OD 时序与荧光时序），但如何提炼出可支撑 iGEM 建模板块的内容并不清楚，多个建模方向并行、缺乏优先级，于是访谈张海丽老师。",
      what: "张老师认为 ODE 模型依赖完整实验数据、现阶段数据不足；空气扩散模型与本项目耦合弱、优先级靠后；启动子筛选模型可参考但非最紧迫。最推荐的是基于现有 OD-荧光时序数据做统计分析与时间序列预测：用假设检验计算 P 值提供定量证据；利用曲线一阶、二阶导数仅依靠前期数据预测后期走向，缩短检测时长。建模须服务湿实验、避免过度复杂。",
      how: "团队明确建模优先级：最高是基于现有 OD-荧光时序数据做导数-时间序列预测；次优先是对人源化改造和对照实验补充统计假设检验给出 P 值；ODE 作为备选，优先复用文献参数；空气富集与病毒空间扩散模型若时间紧张可暂缓。后续继续收集数据，产出时序预测模型初步结果后预约二次访谈复核。"
    },
    {
      slug: "sz-vocational",
      name: "深圳市第一职业技术学校",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "public",
      coord: { top: 92.8, left: 70.8 },
      photo: "",
      org: "深圳市第一职业技术学校（坪山校区）",
      role: "科普宣讲合作学校",
      desc: "面向制药相关专业学生开展合成生物学科普宣讲，团队分享项目灵感、背景、实验构思、硬件设计与 Wiki/IP 视觉设计。",
      why: "为把合成生物学带出实验室、让更多青年了解前沿领域，团队面向深圳市第一职业技术学校学生开展宣讲，这些同学日常学习偏向传统制药工艺，很少接触合成生物学前沿内容。",
      what: "团队优先围绕合成生物学开展科普，结合制药行业发展现状讲解其在药物合成、生物检测等方向的应用前景；介绍 iGEM 竞赛以及青少年科创实践的价值，并以空气甲流病毒生物传感器为实例讲解项目灵感与实验构思。互动环节解答同学疑问，收集到提升设备便携性、缩短检测耗时等来自终端用户的真实建议。",
      how: "对参与学生而言，这次分享让他们近距离接触科研内容、提前看到专业对应的科研与行业发展方向；对团队而言，为了面向非专业群体讲清项目，重新梳理并简化了复杂技术逻辑。不足的是时间有限，未能开展深度动手实践工作坊，未来希望搭建面向青年群体的常态化科普交流渠道。"
    },
    {
      slug: "freshman",
      name: "2026 新生宣传",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "public",
      coord: { top: 92.2, left: 70.2 },
      photo: "",
      org: "本校 2026 级药学和制药工程技术本科新生",
      role: "新生科普分享会",
      desc: "由 iGEM 学生团队与指导老师共同完成，面向 2026 级本科新生科普合成生物学与甲流空气检测项目。",
      why: "在推进项目研究的同时，团队也希望把合成生物学带出实验室，于是面向本校 2026 级药学和制药工程技术本科新生开展宣讲，介绍甲流空气检测项目设计思路，并科普合成生物学基本概念、研究方式与应用前景。",
      what: "分享会从合成生物学本身切入，帮助同学建立“设计—构建—测试—学习”的工程化思维；介绍科研项目、学科竞赛、学术会议、社会实践等内容，并重点介绍空气甲流病毒生物传感器项目及其面向密闭空间感染风险预警的定位，分享对接疾控、卫健委、硬件开发等领域专家的访谈经历。活动中发放团队自主编写的甲流防护科普手册。",
      how: "大部分参与者建立起对合成生物学、iGEM 竞赛和甲流检测传感器项目的基础认知，也初步了解基因工程相关内容，破除了“科研距离青年学习者十分遥远”的固有印象，同时完成甲流防护科普。不足的是受宣讲时长限制无法细致讲解实验原理与硬件细节，后续计划开放咨询渠道、开展小型主题沙龙并收集手册反馈。"
    },
    {
      slug: "liu-xiaolong",
      name: "刘小龙",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "science",
      coord: { top: 92.5, left: 70.5 },
      photo: "",
      org: "纳米抗体分子对接与建模方向",
      role: "指导教师",
      desc: "在纳米抗体结构建模、分子对接方法学与计算验证流程方面给予指导，就干实验方法选择、建模质量与结果呈现提出系统性批评与改进方向。",
      why: "干实验已跑完一轮流程：16 个纳米抗体结构预测、取得 H1N1/H2N2/H3N2 三个亚型 HA 抗原、在线对接、自建公式处理结合能，但团队对这些数字能否支撑纳米抗体选择没有把握，于是请刘小龙老师把关方法学与验证流程。",
      what: "刘老师指出当前在线对接网站未必适用于纳米抗体—蛋白体系，必须核查原始文献与适用范围；模板同源性低于 25% 时同源建模不可靠，建议改用 AlphaFold 3.0 并做拉氏图评估；PDB 的 HA 结构需去水、去金属/盐离子、加氢与电荷平衡。仅展示总结合能不够，应做 MM/GBSA 自由能拆解答疑关键作用是否集中 CDR 区；对接结果仅刚性/半柔性，需补至少 100 ns 分子动力学模拟，最终通过 SPR/MST 湿实验验证亲和力，形成“建模—对接—分析—MD—湿实验”闭环。",
      how: "团队意识到分子对接不是“跑出结果”就算完成：后续将用 AlphaFold 3.0 重新建模 16 个纳米抗体并补拉氏图评估；对 HA 蛋白做去离子/加氢/电荷平衡预处理；核查对接网站原始文献；进行 MM/GBSA 拆解并制作残基贡献热图；补充 MD 模拟；最终通过 SPR/MST 湿实验形成闭环。刘小龙老师也将持续指导数学建模工作。"
    },
    {
      slug: "huang-linsen",
      name: "黄林森",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Shenzhen, Guangdong",
      category: "science",
      coord: { top: 92.1, left: 70.1 },
      photo: "",
      org: "合成生物学与计算指导",
      role: "项目指导教师 / 顾问",
      desc: "作为项目指导与顾问团队成员之一，参与项目方向与跨学科协作的讨论与把关。",
      why: "在项目推进过程中，黄林森老师作为指导与顾问团队成员，参与项目方向与关键决策的讨论，为团队提供来自合成生物学与跨学科视角的反馈。",
      what: "黄林森老师结合其在合成生物学与跨学科指导方面的经验，就项目整体方向与阶段性重点与团队交流，帮助团队在专家访谈、实验设计与竞赛准备之间保持连贯。",
      how: "相关反馈已纳入团队的项目推进与内部协作安排，作为内部项目支持的一部分持续发挥作用。"
    },
    {
      slug: "yeast-online",
      name: "酵母线上交流会",
      provinceId: "CN-44",
      provinceName: "广东省",
      region: "Online · 多校联合",
      category: "science",
      coord: { top: 92.9, left: 70.9 },
      photo: "",
      org: "多所高校共同组织",
      role: "酵母专题线上交流会",
      desc: "与多所高校共同组织的酵母专题交流会，团队在同行反馈中分享项目、讨论困难、借鉴经验。",
      why: "在项目推进过程中，团队不仅通过专家访谈获得指导，也积极与其他 iGEM 队伍展开交流。酵母专题线上交流会是其中跨校同行交流的重要一环。",
      what: "在酵母专题线上交流会上，团队与多所高校的队伍围绕酵母底盘、信号通路、报告系统与硬件富集等共同关心的技术难题展开讨论，分享各自在酵母工程化与生物传感器构建中的经验与踩坑。",
      how: "这些交流让团队看到其他队伍的亮点，也帮助团队正视自身不足；在讨论各自项目困难的同时，从其他队伍获得不少启发，并据此校准后续研究方向。"
    },
    {
      slug: "luo-juan",
      name: "罗娟",
      provinceId: "CN-33",
      provinceName: "浙江省",
      region: "Hangzhou, Zhejiang",
      category: "industry",
      coord: { top: 70.0, left: 75.8 },
      photo: "",
      org: "杭州三甲医院",
      role: "重症监护室一线护理人员",
      desc: "重症监护室（ICU）一线护理人员，日常执行呼吸机管理、气管插管/切开患者吸痰等高频操作，对医院空气管理、防护流程与院感防控具有一线视角。（本页原有节，docx 未单列，按用户要求保留。）",
      why: "为验证甲流病毒环境检测装置在临床场景中的实际需求与落地可行性，团队邀请杭州三甲医院重症监护室一线护理人员进行深度访谈，从院感防控一线视角确认装置的应用价值与产品化挑战。",
      what: "医院现有空气消毒无法全面消杀气溶胶病毒；吸痰等高危操作需分级防护。防控最头疼“有病而不自知”的探视家属。若入口/病房实时显示空气病毒指标并按低/中/高危分级，可减轻家属顾虑；将装置微缩集成至呼吸机呼气阀可实现个体化监测。医院引进设备质量首位且操作不宜繁琐；医院存在鲍曼不动杆菌、肺炎克雷伯菌等耐药菌，酵母传感器换纳米抗体可拓展多病原体；但公立医院设备须公开招标、纳入诊断须权威认证。",
      how: "访谈后，团队将呼吸机呼气阀集成与结果分级显示纳入应用设计重点，并把权威认证、招标流程、监管沟通及模块化多病原体拓展列为产品化落地后续方向。需说明：装置尚未进入医院体系，相关准入与认证均为待办，非已达成结果。"
    }
  ];

  function getInitial(name) {
    return name.replace(/^(Dr\.|Prof\.)\s*/, "").charAt(0).toUpperCase();
  }

  // 默认人像剪影：替代不方便出镜的专家头像（针头与浮层小头像共用）
  const SILHOUETTE_SVG = '<svg class="hz-cluster__silhouette" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.4" r="4.1"></circle><path d="M3.6 20.6c0-4.5 3.9-6.7 8.4-6.7s8.4 2.2 8.4 6.7z"></path></svg>';

  function faceHTML(expert) {
    if (expert && expert.photo) {
      return '<img class="hz-cluster__photo" src="' + expert.photo + '" alt="" loading="lazy" decoding="async">';
    }
    return SILHOUETTE_SVG;
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
    // 图钉以针尖对准坐标（translate(-50%,-100%)）；避让需覆盖「图钉全高 + hover 放大(1.14)」
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
      // 单专家：针头内放该专家照片（或默认人像剪影）
      button.innerHTML = '<span class="hz-cluster__head">' + faceHTML(onlyExpert) + '</span>';
    } else {
      // 多专家同省：优先用首位有照片的专家头像，缺照片时回退人数
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

