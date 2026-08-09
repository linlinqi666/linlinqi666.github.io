/* 由 search-index-generator.js 自动生成，请勿手动修改 */
window.iGEMSearchIndex = [
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "iGEM SZPU-2026 工程化酿酒酵母H1N1 流感病毒生物传感器 PAGER 策略 · 抗 HA 纳米抗体 · 人源化 GPCR/G 蛋白 · 双模式 FUS1 报告系统 Start Journey 为什么是 H1N1？面向快速广谱监测 甲型流感病毒（Influenza A virus, IAV）是季节性流行与反复引发公共卫生应急事件的主要病原体之一。H1N1 亚型在历史上多次造成大流行，其快速变异与呼吸道传播特性使得早期、低成本的现场筛查成为疫情防控的关键缺口。现有临床检测方法在灵敏度、成本、通量与便携性之间难以兼顾，限制了基层医疗、校园、口岸等场景的快速响应能力。 qRT-PCR：灵敏度与特异性的金标准，但需要昂贵荧光定"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "临床检测方法在灵敏度、成本、通量与便携性之间难以兼顾，限制了基层医疗、校园、口岸等场景的快速响应能力。 qRT-PCR：灵敏度与特异性的金标准，但需要昂贵荧光定量仪、专业实验室与较长周转时间，难以下沉到资源有限地区； ELISA：适合高通量筛查，但灵敏度偏低、孵育与洗脱步骤繁琐，对操作人员培训要求高； 胶体金试纸条：操作简便、无需设备，但多为定性结果，在低病毒载量样本中容易出现假阴性； 细胞培养/鸡胚分离：周期长达数天至数周，主要用于科研与毒株鉴定，无法满足现场即时诊断需求。 纳米抗体（Nanobody）：源自骆驼科重链抗体的可变区（VHH），分子量约 12–15 kDa，具有热稳定性高、可溶性好、易于原核/真核表达等优势，是构建模"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "纳米抗体（Nanobody）：源自骆驼科重链抗体的可变区（VHH），分子量约 12–15 kDa，具有热稳定性高、可溶性好、易于原核/真核表达等优势，是构建模块化抗原识别单元的理想候选。 [待补充：目标地区流感发病率、检测可及性调研与具体使用场景] 设计策略：PAGER 重布线人源 GPCR 我们在酿酒酵母 Saccharomyces cerevisiae BY4741 中搭建基于 PAGER（Protein-fragment Assisted Interaction Reporter）策略的 H1N1 血凝素（HA）识别回路。该设计将酵母天然交配信息素通路改造为“抗原解锁-发光”检测平台：无 HA 抗原时，MT1 抑制肽持续占据"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "porter）策略的 H1N1 血凝素（HA）识别回路。该设计将酵母天然交配信息素通路改造为“抗原解锁-发光”检测平台：无 HA 抗原时，MT1 抑制肽持续占据人源化 hM1Dq 受体的正构位点，下游 G 蛋白级联处于关闭状态；当病毒 HA 被膜表面展示抗 HA 纳米抗体捕获后，产生的空间位阻将 MT1 抑制肽物理推开，解除自抑制，DCZ 激动剂即可激活 hM1Dq，进而通过 Gpa1-Gαq 嵌合蛋白触发 FUS1 启动子，驱动 yEGFP 或 lacZ 报告基因表达。 底盘：S. cerevisiae BY4741，经 CRISPR-Cas9 敲除 STE2、FAR1、Sst2 以降低背景、解除细胞周期阻滞并放大信号； 识别元件"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "盘：S. cerevisiae BY4741，经 CRISPR-Cas9 敲除 STE2、FAR1、Sst2 以降低背景、解除细胞周期阻滞并放大信号； 识别元件：抗 H1N1 HA 纳米抗体（VHH），通过 α-factor 信号肽引导并锚定在酵母膜表面； 信号模块：人源化 hM1Dq 受体与 Gpa1-Gαq 嵌合蛋白（Gpa1 C 端 KIGII → 人源 Gαq EYNLV）； 输出模块：FUS1p-yEGFP（流式细胞术定量）与 FUS1p-lacZ（X-Gal 显色定性）双模式报告。 Design → Build → Test → Learn GPCR（G 蛋白偶联受体）：七跨膜受体超家族，可将胞外化学信号转导至胞内异源三"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "定性）双模式报告。 Design → Build → Test → Learn GPCR（G 蛋白偶联受体）：七跨膜受体超家族，可将胞外化学信号转导至胞内异源三聚体 G 蛋白，进而调控下游效应器与基因表达。本项目利用其高度可工程化特性，将病毒抗原识别事件转化为可定量的荧光输出。 [待补充：各元件完整序列、Western Blot 表达验证与剂量-反应曲线] 构建与测试：模块化湿实验流程 项目以 Design–Build–Test–Learn（DBTL）工程循环为框架，将复杂的合成生物学目标拆分为可独立验证的模块。整个湿实验链从 PAGER 融合蛋白基因的设计与合成出发，经过大肠杆菌质粒扩增与酶切验证、酵母底盘 CRISPR 改造与同"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "合成生物学目标拆分为可独立验证的模块。整个湿实验链从 PAGER 融合蛋白基因的设计与合成出发，经过大肠杆菌质粒扩增与酶切验证、酵母底盘 CRISPR 改造与同源重组人源化、蛋白表达验证，最终进入生物传感器的功能诱导与双模式信号检测。 Design：对 α-factor-(GGGS)₃-MT1-(GGGS)₃-anti-HA-TEVcs-hM1Dq 串联融合蛋白进行酿酒酵母密码子优化，两端引入 NdeI/BamHI 酶切位点； Build：全基因合成后克隆至 pGADT7，经 Top10 大肠杆菌转化、质粒小提与双酶切验证获得阳性克隆；同步构建 pML104-sgRNA 质粒与 URA3 标记的人源化 Gpa1 整合片段； Test"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "Top10 大肠杆菌转化、质粒小提与双酶切验证获得阳性克隆；同步构建 pML104-sgRNA 质粒与 URA3 标记的人源化 Gpa1 整合片段； Test：通过 LiAc/PEG 化学转化将 PAGER 质粒导入改造后的酵母底盘，Western Blot 验证膜蛋白表达，DCZ 梯度诱导后使用流式细胞术与 X-Gal 染色读取信号； Learn：根据信号背景、响应幅度与剂量-反应曲线，迭代优化 sgRNA 效率、诱导剂浓度与培养条件。 Orthogonality（正交性）：指外源信号通路与宿主内源通路之间的交叉干扰最小化。敲除 STE2 消除内源 α-factor 受体信号、敲除 Sst2 解除 G 蛋白负调控、敲除 FAR1"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "）：指外源信号通路与宿主内源通路之间的交叉干扰最小化。敲除 STE2 消除内源 α-factor 受体信号、敲除 Sst2 解除 G 蛋白负调控、敲除 FAR1 解除细胞周期阻滞，均是为了在维持细胞正常生长的同时，让 PAGER 通路成为主导且可控的信号来源。 [待补充：原始实验记录（Team Member, Lab Notebook Date）与原始数据文件] Gpa1 人源基因 实验进展与待表征数据 截至目前，项目已完成 PAGER 融合蛋白基因的合成与大肠杆菌层面的质粒验证，为后续酵母转化与底盘改造奠定了材料基础。CRISPR-Cas9 三基因敲除模块在首次酶切验证失败后，正在进行 sgRNA 载体重建与转化条件优化。所有荧光"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "验证，为后续酵母转化与底盘改造奠定了材料基础。CRISPR-Cas9 三基因敲除模块在首次酶切验证失败后，正在进行 sgRNA 载体重建与转化条件优化。所有荧光定量结果将在完成底盘改造、获得不少于三次独立重复、设置完整对照组并标注误差棒（SD 或 SEM）后统一上传。 PAGER 融合蛋白基因合成：已完成，克隆质粒 ID ABX63942，全长测序与设计序列一致，无突变； 大肠杆菌转化与质粒验证：已完成，4 个阳性克隆浓度 297.15–408.45 ng/μL，A260/A280 ≈ 1.9，NdeI/BamHI 双酶切显示 7939 bp 骨架与 2063 bp 插入片段，符合理论值； CRISPR 三敲除 STE2/FAR1/"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "280 ≈ 1.9，NdeI/BamHI 双酶切显示 7939 bp 骨架与 2063 bp 插入片段，符合理论值； CRISPR 三敲除 STE2/FAR1/Sst2：进行中，首次酶切验证未达预期，已重新设计 sgRNA 并构建 pML104 载体； Gpa1 人源化同源重组：待三敲除底盘完成后进行，已准备 500 bp 同源臂-突变 Gpa1-URA3 cassette-500 bp 同源臂线性片段； 蛋白表达与功能测试：待酵母转化完成后，通过 Western Blot、DCZ 梯度诱导、流式细胞术与 X-Gal 染色分层验证。 [待补充：流式细胞术定量数据（n ≥ 3，含阴性/空载体/阳性对照）、剂量-反应曲线、误差棒定义与统"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "DCZ 梯度诱导、流式细胞术与 X-Gal 染色分层验证。 [待补充：流式细胞术定量数据（n ≥ 3，含阴性/空载体/阳性对照）、剂量-反应曲线、误差棒定义与统计分析] 安全与结构验证 本项目严格遵循 iGEM 安全白皮书与所在学校生物安全管理制度。所有遗传操作均在标准分子生物学实验室内完成，使用 BSL-1 模式生物酿酒酵母 BY4741；病毒相关实验仅使用灭活病毒组分或假病毒系统，不涉及活病毒释放、环境暴露或人类细胞感染实验。 生物安全等级：底盘为常见食品级酵母 BY4741，BSL-1 模式生物，无已知致病性，已完成团队生物安全培训； 遗传材料：识别元件仅表达病毒表面 HA 蛋白特异性纳米抗体，不包含完整病毒基因组或具有复制能"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "41，BSL-1 模式生物，无已知致病性，已完成团队生物安全培训； 遗传材料：识别元件仅表达病毒表面 HA 蛋白特异性纳米抗体，不包含完整病毒基因组或具有复制能力的病毒颗粒； 废弃物管理：菌液、培养基与一次性耗材经 121℃ 高压灭菌 30 min 后统一处置，限制性内切酶、DCZ 与 X-Gal 等化学品按 MSDS 要求佩戴手套与护目镜操作； 结构辅助设计：通过同源建模预测抗 HA 纳米抗体与 H1N1 HA 蛋白的互作界面，为突变设计与亲和力优化提供结构依据。 Containment（生物安全防护）：通过物理隔离（生物安全柜）、生物屏障（营养缺陷型与温度敏感型设计）和标准化废弃物处理，防止工程生物体意外释放或对环境造成影响的综"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "ainment（生物安全防护）：通过物理隔离（生物安全柜）、生物屏障（营养缺陷型与温度敏感型设计）和标准化废弃物处理，防止工程生物体意外释放或对环境造成影响的综合实验管理策略。 [待补充：iGEM 安全审查表、结构建模所用 PDB 模板、序列一致性、模型置信度评估（pLDDT/QMEANDisCo）] 人类实践：从专家到公众 项目通过专家访谈、问卷调研与科普 outreach 活动，将技术设计与真实社会需求持续对齐。来自临床检验、疾控与基层医疗的反馈帮助我们识别出现有检测在基层可及性、成本与周转时间上的痛点；面向中学生的科普活动则让我们意识到“可视化、低成本、无需复杂设备”是公众对生物传感器最直观的期待。这些输入共同将项目目标校准为"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "层可及性、成本与周转时间上的痛点；面向中学生的科普活动则让我们意识到“可视化、低成本、无需复杂设备”是公众对生物传感器最直观的期待。这些输入共同将项目目标校准为“快速、可部署、可模块化的广谱呼吸道病原体监测平台”。 专家访谈：围绕流感病毒监测的工作流程、现有方法瓶颈、现场部署需求与样本前处理挑战展开，反馈直接影响了传感器输出形式与使用场景设计； 公众与科普 outreach：通过合成生物学科普讲座与互动实验，收集中学生与公众对“便携式检测”的期望，强化可视化读数与易用性的设计优先级； 社会价值：面向资源有限地区的低成本、无仪器依赖的可视化传感方案，助力基层医疗能力提升； 平台拓展：通过替换膜表面纳米抗体识别单元，可将同一套酵母传感平"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "优先级； 社会价值：面向资源有限地区的低成本、无仪器依赖的可视化传感方案，助力基层医疗能力提升； 平台拓展：通过替换膜表面纳米抗体识别单元，可将同一套酵母传感平台扩展至 H5、H7 等流感亚型，乃至 COVID-19、RSV 等其他呼吸道病原体。 [待补充：访谈对象单位与职称、问卷样本量、反馈编码方法与主要主题提炼] 未来愿景：从 H1N1 到广谱平台 完成 H1N1 概念验证后，PAGER-Yeast 平台的核心价值在于其模块化与可替换性：膜表面的纳米抗体识别单元可针对不同抗原快速迭代，而下游的 GPCR 信号重布线与双模式报告系统保持通用。结合低成本便携式荧光读数设备，该体系有望从实验室原型走向基层可用的现场检测工具。 模块化识"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "抗原快速迭代，而下游的 GPCR 信号重布线与双模式报告系统保持通用。结合低成本便携式荧光读数设备，该体系有望从实验室原型走向基层可用的现场检测工具。 模块化识别单元：保留 α-factor 分泌锚定与 linker 框架，仅替换 VHH 序列即可覆盖 H5、H7 等流感亚型，乃至 SARS-CoV-2、RSV 等呼吸道病原体； 信号优化：通过 DCZ 浓度梯度与诱导时间优化，建立荧光强度与病毒载量的对应关系，实现半定量检测，匹配便携式荧光读数仪； 多场景应用：面向基层诊所初筛、校园晨检、出入境检疫口岸与家庭自测等需要快速、低成本结果的场景； 开源与标准化：以 iGEM Registry 兼容形式提交启动子、报告基因、信号模块等标准"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "筛、校园晨检、出入境检疫口岸与家庭自测等需要快速、低成本结果的场景； 开源与标准化：以 iGEM Registry 兼容形式提交启动子、报告基因、信号模块等标准化生物元件，并整理可复现的实验方案与质粒地图。 [待补充：目标拓展亚型列表、硬件原型参数、产品化时间表与监管路径初步评估] 团队亮点 跨学科协作 合成生物学、计算机建模、硬件设计与社会调查成员协同推进，形成从元件到社会的完整闭环。 DBTL 工程思维 每个设计决策均对应可测试假设与迭代计划，确保项目可追溯、可复现、可改进。 社会反馈驱动 专家与公众反馈持续塑造项目目标与产品形态，使技术方案贴近真实使用场景。 探索我们的 Wiki Description Design Engi"
  },
  {
    "type": "text",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "content": "进。 社会反馈驱动 专家与公众反馈持续塑造项目目标与产品形态，使技术方案贴近真实使用场景。 探索我们的 Wiki Description Design Engineering Results Safety Human Practices Dry Lab Team"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast1.svg",
    "content": "yeast1.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast2.svg",
    "content": "yeast2.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast3.svg",
    "content": "yeast3.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast4.svg",
    "content": "yeast4.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/line.svg",
    "content": "line.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/line.svg",
    "content": "line.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/webp/DNA-transparent.webp",
    "content": "DNA-transparent.webp"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/webp/Gpa1.webp",
    "content": "Gpa1.webp"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/webp/human-derived genes.webp",
    "content": "human-derived genes.webp"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast5.svg",
    "content": "yeast5.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast6.svg",
    "content": "yeast6.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast7.svg",
    "content": "yeast7.svg"
  },
  {
    "type": "image",
    "pageUrl": "index.html",
    "pageTitle": "iGEM SZPU-2026 - 首页",
    "src": "static/image/Animation/index/yeast8.svg",
    "content": "yeast8.svg"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "实验导航 EchoYeast 项目背景与动机 问题与潜在影响 项目目标 为何选择此项目 核心设计思路：PAGER策略 抗原门控受体原理 双模式报告系统 生物元件库 PAGER膜融合蛋白 底盘改造靶点 报告系统元件 载体与筛选标记 实验设计与模块化构建 模块一：底盘细胞改造 模块二：报告体系构建 模块三：Gpa1-Gα人源化 模块四：PAGER识别融合蛋白 创新点与社会价值 三大创新点 社会价值与展望 参考文献 0% 发酵进度 执行摘要：针对甲型流感病毒（IAV）现场快速检测的临床瓶颈，本项目以酿酒酵母 BY4741 为底盘，利用 PAGER 可编程抗原门控受体技术将 HA 抗原识别事件转化为绿色荧光信号，构建低成本、高灵敏度的 PO"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "临床瓶颈，本项目以酿酒酵母 BY4741 为底盘，利用 PAGER 可编程抗原门控受体技术将 HA 抗原识别事件转化为绿色荧光信号，构建低成本、高灵敏度的 POCT 生物传感器。 项目背景与动机 问题与潜在影响 流感作为全球重大公共卫生威胁，快速、准确的现场筛查是控制疫情传播的关键环节。现有临床检测方法存在以下局限： qRT-PCR：高准确度，但成本高、依赖专业实验设备、检测周期长，难以满足基层与现场需求。 ELISA：可高通量检测，但灵敏度偏低、孵育步骤复杂，对操作环境要求较高。 胶体金试纸条：操作简便、现场快速，但只能定性判读，低病毒载量样本易漏检。 上述方法在成本控制、灵敏度与便携性之间存在难以兼顾的矛盾，迫切需要开发一种低成"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "较高。 胶体金试纸条：操作简便、现场快速，但只能定性判读，低病毒载量样本易漏检。 上述方法在成本控制、灵敏度与便携性之间存在难以兼顾的矛盾，迫切需要开发一种低成本、高灵敏度、可现场部署的新型检测平台。 项目目标 本项目核心目标为：将 PAGER（Protein-fragment Assisted Interaction Reporter）可编程抗原门控受体技术应用于酿酒酵母，构建膜表面抗原识别融合蛋白，实现甲型流感病毒 HA 抗原的快速可视化检测。 当样本中存在 IAV HA 抗原时，酵母细胞表面的纳米抗体捕获抗原，通过空间位阻解除受体自抑制，在 DCZ 激动剂存在下激活下游 G 蛋白信号通路，驱动 FUS1 启动子表达 yEGFP"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "抗原时，酵母细胞表面的纳米抗体捕获抗原，通过空间位阻解除受体自抑制，在 DCZ 激动剂存在下激活下游 G 蛋白信号通路，驱动 FUS1 启动子表达 yEGFP/lacZ 报告基因，发出绿色荧光或蓝色显色信号，实现“抗原结合—荧光发光”的直接转换。 为何选择此项目 选择酿酒酵母作为生物传感器底盘基于以下考量：BY4741 遗传背景清晰、分子操作成熟、培养条件简单、生物安全等级为 BSL-1，适合规模化发酵生产。PAGER 系统将抗原识别与受体激活解耦，仅通过替换纳米抗体即可拓展至其他病原体检测，具有高度的模块化与可扩展性。 执行摘要：PAGER 策略通过“MT1 抑制肽—hM1Dq 受体—anti-HA 纳米抗体”三元嵌合设计实现抗"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "展至其他病原体检测，具有高度的模块化与可扩展性。 执行摘要：PAGER 策略通过“MT1 抑制肽—hM1Dq 受体—anti-HA 纳米抗体”三元嵌合设计实现抗原门控：无 HA 时通路关闭，有 HA 时空间位阻解除抑制并激活双模式报告系统。 核心设计思路：PAGER策略 抗原门控受体原理 PAGER（Protein-fragment Assisted Interaction Reporter，蛋白片段辅助互作报告系统）是一种基于空间位阻调控的可编程抗原门控受体策略。其核心是将抑制肽、抗原识别纳米抗体与 G 蛋白偶联受体（GPCR）整合为单一膜融合蛋白。 PAGER 膜融合蛋白结构（N→C 端） α-factor 信号肽 (GGGS)"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "抑制肽、抗原识别纳米抗体与 G 蛋白偶联受体（GPCR）整合为单一膜融合蛋白。 PAGER 膜融合蛋白结构（N→C 端） α-factor 信号肽 (GGGS)₃ MT1 抑制肽 (GGGS)₃ anti-HA 纳米抗体 (GGGS)₃ TEVcs Linker hM1Dq 受体 完整组装结构：α-factor-(GGGS)₃-MT1-(GGGS)₃-anti-HA-TEVcs-hM1Dq。柔性 (GGGS)₃ 接头作为空间延长臂，确保纳米抗体能够穿透酵母细胞壁孔隙并接触病毒颗粒抗原。 1 静息关闭状态 无 IAV HA 抗原时，MT1 抑制肽持续占据 hM1Dq 受体的正构位点，下游 G 蛋白级联被钳制在“关闭”状态，无荧光信号产"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "颗粒抗原。 1 静息关闭状态 无 IAV HA 抗原时，MT1 抑制肽持续占据 hM1Dq 受体的正构位点，下游 G 蛋白级联被钳制在“关闭”状态，无荧光信号产生。 → 2 抗原识别与位阻解锁 HA 抗原与膜表面 anti-HA 纳米抗体结合，产生的空间位阻将 MT1 抑制肽从 hM1Dq 结合口袋中物理位移，解除自抑制。 → 3 DCZ 激活与信号输出 DCZ 小分子激动剂激活 hM1Dq，Gpa1-Gαq 嵌合蛋白触发 MAPK 通路，FUS1 启动子驱动 yEGFP/lacZ 表达，产生绿色荧光或蓝色显色。 双模式报告系统 项目同时构建荧光与显色两套报告体系，以满足定量分析、高通量筛选与肉眼定性判读的不同需求： 荧光报告体系"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "acZ 表达，产生绿色荧光或蓝色显色。 双模式报告系统 项目同时构建荧光与显色两套报告体系，以满足定量分析、高通量筛选与肉眼定性判读的不同需求： 荧光报告体系 pFUS1-yEGFP yEGFP 作为绿色荧光报告基因，可通过流式细胞术定量荧光强度，灵敏度高、动态范围宽，适用于精确定量与高通量筛选。 显色报告体系 pFUS1-lacZ lacZ 编码 β-半乳糖苷酶，经 X-Gal 底物染色后呈现蓝色，无需昂贵仪器即可实现肉眼定性观察，适合资源有限的现场环境。 两套系统共享 FUS1 启动子，仅在报告基因上存在差异，可通过同一信号通路同时或独立验证传感器响应。 执行摘要：项目生物元件库包括 PAGER 膜融合蛋白、底盘改造靶点（STE"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "US1 启动子，仅在报告基因上存在差异，可通过同一信号通路同时或独立验证传感器响应。 执行摘要：项目生物元件库包括 PAGER 膜融合蛋白、底盘改造靶点（STE2/FAR1/Sst2 敲除与 Gpa1 C 端人源化）、双模式报告系统以及载体与筛选标记四大类。 生物元件库 PAGER膜融合蛋白 完整组装结构：α-factor-(GGGS)₃-MT1-(GGGS)₃-anti-HA-TEVcs-hM1Dq。各结构域功能与序列信息如下： Part Name Core Function Sequence Information α-factor signal peptide 引导融合蛋白分泌并锚定在酵母细胞膜 MRFPSIFTAVLFAAS"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "n Sequence Information α-factor signal peptide 引导融合蛋白分泌并锚定在酵母细胞膜 MRFPSIFTAVLFAASSALA (GGGS)₃ linker 分隔功能结构域，保证独立折叠 人工柔性接头 MT1 inhibitory toxin 自抑制开关，无抗原时阻断 hM1Dq LTCVTSKSIFGITTENCPDGQNLCFKKWYYIVPRYSDITWGCAATCPKPTNVRETIRCCETD anti-H1N1_HA nanobody 特异性结合 IAV HA 抗原，核心识别单元 QVQLVESGGGLVQPGGSLRLSCAASGSFFSRYRMGWYRQAPGEQRELVAS"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "nobody 特异性结合 IAV HA 抗原，核心识别单元 QVQLVESGGGLVQPGGSLRLSCAASGSFFSRYRMGWYRQAPGEQRELVASIAYDGSTSYADPVKGRFTISRDNANTVHLQMYSLKPDDTAVYYCNLDPPGILYWGQGTQVTVSS TEVcs (TEV cleavage site) 功能验证分子开关，体外模拟抗原解锁 ENLYFQS hM1Dq human DREADD receptor 接收上游信号，偶联下游 G 蛋白通路，可被 DCZ 激活 人源化 M1 毒蕈碱受体 底盘改造靶点 为消除内源信号干扰、放大通路响应并重建人源 GPCR 信号偶联，对 BY4741 底盘进行以"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "白通路，可被 DCZ 激活 人源化 M1 毒蕈碱受体 底盘改造靶点 为消除内源信号干扰、放大通路响应并重建人源 GPCR 信号偶联，对 BY4741 底盘进行以下基因工程改造： STE2 编码酵母内源 α-factor 受体 改造策略：CRISPR-Cas9 单靶点 sgRNA 介导移码突变，实现全基因敲除。 改造目的：消除内源 α-factor 受体，降低背景噪音。 FAR1 信息素信号通路下游细胞周期抑制蛋白 改造策略：CRISPR-Cas9 单靶点 sgRNA 介导移码突变，实现全基因敲除。 改造目的：解除交配信号诱导的细胞周期停滞，维持细胞生长以进行实时监测。 Sst2 G 蛋白信号负调控因子 改造策略：CRISPR-Cas"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "突变，实现全基因敲除。 改造目的：解除交配信号诱导的细胞周期停滞，维持细胞生长以进行实时监测。 Sst2 G 蛋白信号负调控因子 改造策略：CRISPR-Cas9 单靶点 sgRNA 介导移码突变，实现全基因敲除。 改造目的：去除 G 蛋白负调控因子，放大荧光信号。 此外，Gpa1 并非敲除，而是通过同源重组进行 C 端 5 个氨基酸定点替换：将天然序列 KIGII 替换为人源 Gαq 序列 EYNLV，从而使人源化 hM1Dq 受体能够有效偶联酵母 MAPK 信号通路。 Gene Modification Method Purpose STE2 CRISPR knockout 消除内源 α-factor 受体，降低背景噪音 FAR"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "ene Modification Method Purpose STE2 CRISPR knockout 消除内源 α-factor 受体，降低背景噪音 FAR1 CRISPR knockout 解除交配信号诱导的细胞周期停滞，维持细胞生长以进行实时监测 Sst2 CRISPR knockout 去除 G 蛋白负调控因子，放大荧光信号 Gpa1 C 端 5 个氨基酸定点替换 天然 KIGII → 人源 Gαq EYNLV，实现 hM1Dq 与酵母 MAPK 通路偶联 报告系统元件 Part Function Detection Method FUS1 promoter G 蛋白响应型启动子，信号激活后启动转录 通路开关 yEGFP"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "元件 Part Function Detection Method FUS1 promoter G 蛋白响应型启动子，信号激活后启动转录 通路开关 yEGFP 绿色荧光报告基因 流式细胞术定量荧光强度 lacZ β-半乳糖苷酶报告基因 X-Gal 染色定性验证 载体与筛选标记 Vector/Marker Application pML104 CRISPR-Cas9 酵母敲除质粒，表达 Cas9 + sgRNA pESC-HIS 酵母报告骨架，携带 FUS1-yEGFP/lacZ 盒 pGADT7 PAGER 融合蛋白基因克隆骨架 URA3 尿嘧啶营养筛选标记，在 SD-Ura 平板上筛选改造菌株 Ampᴿ 氨苄青霉素抗性，用于大肠杆"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "Z 盒 pGADT7 PAGER 融合蛋白基因克隆骨架 URA3 尿嘧啶营养筛选标记，在 SD-Ura 平板上筛选改造菌株 Ampᴿ 氨苄青霉素抗性，用于大肠杆菌扩增筛选 执行摘要：项目遵循“基因合成 → 大肠杆菌扩增验证 → 酵母底盘改造 → 蛋白表达与功能测试”四阶段流程，以模块化方式构建完整生物传感器。 实验设计与模块化构建 整体实验被划分为四个功能模块，各模块独立开发、逐步整合，最终形成可响应 HA 抗原的完整酵母生物传感器。 01 底盘细胞改造——消除内源干扰并放大信号 目标：通过 CRISPR-Cas9 对 BY4741 进行 STE2、FAR1、Sst2 三基因敲除，重构“零背景”高灵敏度信号宿主。 利用 pML104"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "信号 目标：通过 CRISPR-Cas9 对 BY4741 进行 STE2、FAR1、Sst2 三基因敲除，重构“零背景”高灵敏度信号宿主。 利用 pML104 载体表达 Cas9 与单靶点 sgRNA，通过 LiAc/PEG 化学转化入酵母，SD-Ura 营养缺陷平板筛选阳性克隆，并经菌落 PCR 与 Sanger 测序验证。当前进度：进行中，酶切失败后重建 sgRNA 载体。 02 报告体系构建——FUS1 驱动的双模式输出 目标：构建 pFUS1-yEGFP 与 pFUS1-lacZ 报告质粒，实现信号的可视化与定量检测。 以 pESC-HIS 为骨架，将 FUS1 启动子分别与 yEGFP 或 lacZ 报告基因连接。报告菌"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "S1-lacZ 报告质粒，实现信号的可视化与定量检测。 以 pESC-HIS 为骨架，将 FUS1 启动子分别与 yEGFP 或 lacZ 报告基因连接。报告菌株接受上游 G 蛋白信号后启动转录：yEGFP 用于流式细胞术定量，lacZ 用于 X-Gal 染色定性。 03 Gpa1-Gα人源化——重建人源 GPCR 信号偶联 目标：利用酿酒酵母同源重组机制，将 Gpa1 C 末端 KIGII 替换为人源 Gαq 的 EYNLV，实现 hM1Dq 与酵母 MAPK 通路的偶联。 线性整合片段结构为：500 bp 上游同源臂—人源化 Gpa1 突变序列—URA3 筛选盒—500 bp 下游同源臂。BY4741 为 ura3 营养缺陷型菌"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "线性整合片段结构为：500 bp 上游同源臂—人源化 Gpa1 突变序列—URA3 筛选盒—500 bp 下游同源臂。BY4741 为 ura3 营养缺陷型菌株，可通过 SD-Ura 平板筛选阳性整合克隆，最终经菌落 PCR 与 Sanger 测序确认替换。当前进度：待底盘敲除完成后进行。 04 PAGER识别融合蛋白——核心传感器元件的组装与表达 目标：完成 PAGER 融合蛋白基因的合成、大肠杆菌扩增与酵母转化，验证膜表面表达及抗原响应功能。 融合基因经酿酒酵母密码子优化后，两端添加 NdeI 与 BamHI 位点，全基因合成并克隆至 pGADT7（质粒编号 ABX63942）。通过 Top10 感受态细胞转化、质粒提取与双酶"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "化后，两端添加 NdeI 与 BamHI 位点，全基因合成并克隆至 pGADT7（质粒编号 ABX63942）。通过 Top10 感受态细胞转化、质粒提取与双酶切验证确认构建正确：4 个阳性克隆质粒浓度为 408.45 / 404.85 / 297.15 / 355.90 ng/μL，A260/A280 ≈ 1.9，电泳条带与理论值（骨架 7939 bp，插入片段 2063 bp）一致。后续将通过 LiAc/PEG 转化入酵母，Western Blot 验证蛋白表达，并以 DCZ（10 nM、100 nM、1 μM）梯度诱导优化检测条件。 执行摘要：项目在技术、底盘与平台三个维度实现创新，并具备降低公共卫生检测成本、赋能基层医疗与构"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "CZ（10 nM、100 nM、1 μM）梯度诱导优化检测条件。 执行摘要：项目在技术、底盘与平台三个维度实现创新，并具备降低公共卫生检测成本、赋能基层医疗与构建通用病原体检测平台的社会价值。 创新点与社会价值 三大创新点 技术创新：首次将 PAGER 系统拓展至酵母中大分子病毒抗原检测，通过空间位阻实现抗原门控受体开关。 底盘创新：STE2/FAR1/Sst2 三基因敲除联合人源化 Gpa1-Gαq 嵌合蛋白，显著降低背景噪音并提升信号灵敏度。 平台创新：模块化设计使纳米抗体识别单元可替换，可快速拓展至 COVID-19、RSV、IAV 变异株等多种呼吸道病原体检测。 社会价值与展望 降低公共卫生检测成本：酿酒酵母可大规模发酵生产"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "体识别单元可替换，可快速拓展至 COVID-19、RSV、IAV 变异株等多种呼吸道病原体检测。 社会价值与展望 降低公共卫生检测成本：酿酒酵母可大规模发酵生产，无需昂贵 PCR 仪器，适合大规模人群筛查。 基层医疗赋能：检测流程不依赖标准实验室条件，适用于社区诊所、校园、口岸等现场快速筛查场景。 合成生物学产业化：构建模块化通用检测平台，支撑国家传染病防控体系建设。 长期拓展方向：优化信号输出实现半定量病毒载量检测，匹配便携式荧光读数仪；替换膜表面纳米抗体可拓展至 COVID-19、RSV、IAV 变异株等呼吸道病原体；最终开发标准化检测试剂盒用于商业用途。 执行摘要：本页面内容基于项目实验记录与已发表文献整理，完整引用列表将在后"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "D-19、RSV、IAV 变异株等呼吸道病原体；最终开发标准化检测试剂盒用于商业用途。 执行摘要：本页面内容基于项目实验记录与已发表文献整理，完整引用列表将在后续 Wiki 冻结前补充并核对 DOI/PubMed ID。 参考文献 [1] 作者. PAGER-based biosensor design for viral antigen detection. Journal of Synthetic Biology. 2025. [DOI/PubMed ID] [2] 作者. Engineering Gαq chimeric G proteins in Saccharomyces cerevisiae. Yeast. 2024."
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": ". Engineering Gαq chimeric G proteins in Saccharomyces cerevisiae. Yeast. 2024. [DOI/PubMed ID] [3] 作者. CRISPR-Cas9 genome editing in budding yeast for signal pathway reconstruction. Methods in Molecular Biology. 2024. [DOI/PubMed ID] [4] 作者. Nanobody-mediated detection of influenza A hemagglutinin. Protein Engineering"
  },
  {
    "type": "text",
    "pageUrl": "project/description.html",
    "pageTitle": "Description - iGEM SZPU-2026",
    "content": "者. Nanobody-mediated detection of influenza A hemagglutinin. Protein Engineering, Design and Selection. 2023. [DOI/PubMed ID]"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "Design Navigation EchoYeast Overview Chassis Selection Gene Knockout Strategy Sensing System Nanobody Selection Fusion Protein Design Signal Transduction PAGER Mechanism GPCR Selection G-Protein Engineering Reporter System Dual-Mode Reporter Surface Display Fusion Architecture Proof of Concept Sensing Validation Displa"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "r Surface Display Fusion Architecture Proof of Concept Sensing Validation Display Validation Virus Mimic Detection 0% Progress Executive Summary: This project constructs an Influenza A virus biosensor based on engineered Saccharomyces cerevisiae BY4741, using the PAGER strategy to convert viral antigen recognition into"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "isiae BY4741, using the PAGER strategy to convert viral antigen recognition into detectable cellular signal output. Influenza A virus biosensor based on engineered yeast Chassis Selection We selected Saccharomyces cerevisiae BY4741 (MATa) as the engineering chassis strain. This strain is one of the most well-establishe"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "s the engineering chassis strain. This strain is one of the most well-established model eukaryotes in synthetic biology, offering abundant genetic manipulation tools, a thoroughly characterized signal transduction pathway, and non-pathogenicity (Biosafety Level 1). Gene Knockout Strategy To eliminate interference from"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "city (Biosafety Level 1). Gene Knockout Strategy To eliminate interference from endogenous signaling pathways and prevent cell cycle arrest, we performed the following gene knockouts: Table 1 (Table content will be added after you provide the image) Executive Summary: Using anti-H1N1 HA protein nanobody R1a-B6 as the r"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "he image) Executive Summary: Using anti-H1N1 HA protein nanobody R1a-B6 as the recognition element, fused with the signal transduction module through a flexible linker to achieve broad-spectrum antigen recognition. Sensing System: Nanobody-based Recognition of Influenza A virus HA Protein Nanobody Selection We selected"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "based Recognition of Influenza A virus HA Protein Nanobody Selection We selected the anti-H1N1 influenza A virus hemagglutinin (HA) stem nanobody R1a-B6 as the recognition element. This nanobody binds with high affinity to the conserved stem region of HA proteins from multiple H1 subtype influenza viruses, offering bro"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "m region of HA proteins from multiple H1 subtype influenza viruses, offering broad-spectrum recognition potential. Fusion Protein Design The nanobody is fused to the downstream signaling module via a (GGGS)n flexible linker. An α-factor signal peptide directs the fusion protein into the secretory pathway, relying on th"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "nal peptide directs the fusion protein into the secretory pathway, relying on the transmembrane receptor hM1Dq for self-anchoring to the plasma membrane. The construct retains a TEVcs cleavage site, allowing the recognition module to be separated from the signaling module via TEV protease when needed, enabling backgrou"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "arated from the signaling module via TEV protease when needed, enabling background reduction or signal amplification. Executive Summary: Using the PAGER strategy, human GPCR (hM1Dq) and humanized G protein (Gpa1-Gαq) to achieve antigen binding event transduction into intracellular signals. Signal Transduction System: H"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "ing event transduction into intracellular signals. Signal Transduction System: Humanized GPCR and G-Protein Engineering (PAGER-Gq Architecture) PAGER Mechanism We adopted the PAGER (Protein-coupled Antigen-induced GPCR Engineering Remodeling) strategy. Its basic principle is: Nanobody binds antigen → steric hindrance d"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "g) strategy. Its basic principle is: Nanobody binds antigen → steric hindrance displaces the antagonist protein (MT1) → orthosteric site is exposed → small-molecule agonist (DCZ) activates GPCR → intracellular signaling pathway is turned on. GPCR Selection: Human M1 Receptor (hM1Dq) Full-length 460 amino acids, contain"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": ". GPCR Selection: Human M1 Receptor (hM1Dq) Full-length 460 amino acids, containing 7 transmembrane domains Its orthosteric site can be occupied by the high-affinity antagonist MT1, keeping it silent in the absence of antigen Activation can be induced by adding the cell-permeable small-molecule agonist DCZ G-Protein En"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "be induced by adding the cell-permeable small-molecule agonist DCZ G-Protein Engineering: Gpa1-Gαq Fusion Protein The endogenous GPA1 gene is knocked out, and a Gpa1-Gαq fusion protein is introduced Engineering method: Replace the last 5 amino acids of the yeast Gpa1 protein C-terminus, KIGII (Lys-Ile-Gly-Ile-Ile), wi"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "mino acids of the yeast Gpa1 protein C-terminus, KIGII (Lys-Ile-Gly-Ile-Ile), with the human Gαq C-terminal sequence EYNLV (Glu-Tyr-Asn-Leu-Val) The engineered humanized G protein can be effectively activated by hM1Dq, transmitting the signal to the downstream FUS1 pathway Executive Summary: Based on FUS1 promoter to c"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "al to the downstream FUS1 pathway Executive Summary: Based on FUS1 promoter to construct dual-mode reporter system, achieving both fluorescent and colorimetric visualization outputs. Reporter System: Dual-Mode Visual Output Dual-Mode Reporter System Based on the FUS1 promoter (naturally activated by the mating signalin"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "er System Based on the FUS1 promoter (naturally activated by the mating signaling pathway), we constructed two reporter systems: Table 2 (Table content will be added after you provide the image) Both reporter systems share the same expression framework, only the reporter gene is replaced. α-factor is used as a positive"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "on framework, only the reporter gene is replaced. α-factor is used as a positive control stimulus to validate the response sensitivity and dynamic range of the reporter systems. Executive Summary: Design complete fusion protein architecture, including signal peptide, antagonist peptide, tag, nanobody, cleavage site, an"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": ", including signal peptide, antagonist peptide, tag, nanobody, cleavage site, and receptor functional elements. Surface Display & Fusion Protein Design Fusion Protein Architecture α-factor signal peptide – (GGGS)n – MT1 – ALFA tag – (GGGS)n – anti-H1N1-HA nanobody – TEVcs – hM1Dq Table 3 (Table content will be added af"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "– anti-H1N1-HA nanobody – TEVcs – hM1Dq Table 3 (Table content will be added after you provide the image) Executive Summary: Through substitution experiments validate sensing system, display efficiency, and virus detection capability, gradually constructing complete functional validation workflow. Proof of Concept: Ke"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "ually constructing complete functional validation workflow. Proof of Concept: Key Experiments & Substitutions Sensing System Validation Use histamine as a surrogate inducer (natural ligand of hM1Dq) to validate the functionality of the GPCR-G protein-reporter pathway Gradient concentration stimulation (0, 30, 120, 600"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "-G protein-reporter pathway Gradient concentration stimulation (0, 30, 120, 600 nM, 3, 15 μM), detect GFP fluorescence intensity using a plate reader Observe nanobody-ALFA tag localization on the cell surface using confocal microscopy Display Validation Western Blot: Detect full-length fusion protein expression using a"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "ay Validation Western Blot: Detect full-length fusion protein expression using an anti-ALFA tag antibody Immunofluorescence: Directly visualize nanobody display efficiency on the yeast surface using fluorescently labeled HA protein or anti-nanobody secondary antibody Virus Mimic Detection Use purified recombinant HA pr"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "nanobody secondary antibody Virus Mimic Detection Use purified recombinant HA protein or inactivated H1N1 virus as antigen; incubate with the culture Add the small-molecule agonist DCZ and detect whether GFP signal is significantly higher than in the control group without antigen Compare the signal-to-noise ratio, resp"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "han in the control group without antigen Compare the signal-to-noise ratio, response time, and detection limit of the two schemes at different antigen concentrations Directory / Footer Information (iGEM Wiki Structure) Table 4 (Table content will be added after you provide the image)"
  },
  {
    "type": "text",
    "pageUrl": "project/design.html",
    "pageTitle": "Design - iGEM SZPU-2026",
    "content": "t will be added after you provide the image)"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "工程导航 DBTL Engineering Success 工程循环概览 Design 问题定义 解决方案设计 设计规格 Build 元件构建 底盘改造 系统组装 Test 检测方法 对照设置 数据记录 Learn 结果分析 失败与改进 下一步迭代 未来方向 0% 发酵进度 执行摘要：本页面向 iGEM Engineering Success（银牌标准 #1）要求，记录 PAGER-Yeast 项目至少完成一轮 Design → Build → Test → Learn 工程循环，并展示如何基于实验反馈改进设计。 Engineering Success iGEM 鼓励队伍通过工程化思维推进项目：识别问题、设计解决方案、构建原型、测试"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "循环，并展示如何基于实验反馈改进设计。 Engineering Success iGEM 鼓励队伍通过工程化思维推进项目：识别问题、设计解决方案、构建原型、测试性能、总结经验，并进入下一轮迭代。本页面需清晰展示这一循环如何在 PAGER-Yeast 生物传感器的开发中落地。 [待补充：概述已完成的工程循环轮次、每轮核心目标与关键结论。] 执行摘要：用可视化方式呈现 DBTL 循环各阶段的目标、输入与输出，帮助评审快速理解迭代逻辑。 工程循环概览 本项目采用 Design-Build-Test-Learn（DBTL）循环指导生物传感器开发： Design：基于临床检测瓶颈与 PAGER 机制，设计融合蛋白、底盘改造与检测方案。 Bui"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "ild-Test-Learn（DBTL）循环指导生物传感器开发： Design：基于临床检测瓶颈与 PAGER 机制，设计融合蛋白、底盘改造与检测方案。 Build：通过基因合成、质粒构建、酵母转化与基因组编辑实现设计。 Test：利用流式细胞术、X-Gal 显色等方法评估系统响应与灵敏度。 Learn：分析实验结果，识别设计缺陷并规划下一轮改进。 [待补充：建议上传 DBTL 循环流程图，尺寸 1200×600px，.webp 格式并压缩至 150KB 以下。] 执行摘要：明确本阶段要解决的工程问题、提出的解决方案及设计指标。 Design 问题定义 现有 IAV 检测方法在成本、灵敏度、便携性之间存在矛盾。 需要一种可在基层现场"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "明确本阶段要解决的工程问题、提出的解决方案及设计指标。 Design 问题定义 现有 IAV 检测方法在成本、灵敏度、便携性之间存在矛盾。 需要一种可在基层现场部署、低成本、高灵敏度的抗原检测方案。 [待补充：结合 human practices 调研结果，量化问题优先级与约束条件。] 解决方案设计 选择酿酒酵母 BY4741 作为可培养、低成本的生物传感器底盘。 采用 PAGER 抗原门控受体策略，将 HA 抗原结合事件转化为荧光信号。 设计双报告系统（yEGFP + lacZ）兼顾定量检测与裸眼判读。 设计规格 检测对象：甲型流感病毒 HA 抗原 报告输出：绿色荧光（yEGFP）/ 蓝色显色（lacZ） 性能目标：[待补充：灵敏"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "cZ）兼顾定量检测与裸眼判读。 设计规格 检测对象：甲型流感病毒 HA 抗原 报告输出：绿色荧光（yEGFP）/ 蓝色显色（lacZ） 性能目标：[待补充：灵敏度、响应时间、检测下限等] 执行摘要：记录设计如何被实现，包括关键元件构建、底盘改造与系统组装。 Build 元件构建 PAGER 融合蛋白基因合成并克隆至 pGADT7。 FUS1-yEGFP / FUS1-lacZ 报告盒构建至 pESC-HIS。 [待补充：具体的构建策略、限制性酶切位点、测序验证结果。] 底盘改造 CRISPR-Cas9 敲除 STE2、FAR1、Sst2 以降低背景并放大信号。 通过同源重组将 Gpa1 C 末端 KIGII 替换为人类 Gαq EY"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "造 CRISPR-Cas9 敲除 STE2、FAR1、Sst2 以降低背景并放大信号。 通过同源重组将 Gpa1 C 末端 KIGII 替换为人类 Gαq EYNLV。 [待补充：各改造步骤的成功率、验证方法与菌株编号。] 系统组装 [待补充：将 PAGER 质粒与报告质粒共转化至改造底盘的策略、选择标记与培养条件。] 执行摘要：说明测试方法、对照设置与数据采集过程，确保结果可复现。 Test 检测方法 流式细胞术：定量检测 yEGFP 荧光强度，评估不同 HA 浓度下的响应。 X-Gal 显色：定性观察 lacZ 表达，用于快速初筛。 [待补充：详细的实验协议、仪器型号、采集参数。] 对照设置 阴性对照：未转化的野生型 BY474"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "。 X-Gal 显色：定性观察 lacZ 表达，用于快速初筛。 [待补充：详细的实验协议、仪器型号、采集参数。] 对照设置 阴性对照：未转化的野生型 BY4741。 空载体对照：仅含 pESC-HIS 空质粒的菌株。 阳性对照：已知能稳定激活报告通路的工程菌株。 [待补充：所有对照组的重复次数 n ≥ 3 与统计方法。] 数据记录 [待补充：原始数据文件链接、数据整理表格、关键测量值与误差定义（SD/SEM）。] 执行摘要：基于测试结果进行分析，识别成功与失败，并明确下一轮迭代方向。 Learn 结果分析 [待补充：实验结果是否达到设计规格？关键参数（信噪比、响应幅度、检测下限）如何？] 失败与改进 [待补充：第一轮构建中遇到的问题"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "代方向。 Learn 结果分析 [待补充：实验结果是否达到设计规格？关键参数（信噪比、响应幅度、检测下限）如何？] 失败与改进 [待补充：第一轮构建中遇到的问题，例如转化效率低、背景信号高、诱导条件未优化等] [待补充：针对每个问题采取的改进措施及其效果] [待补充：iGEM 重视对失败的诚实记录，请详细说明未达预期的实验及其原因。] 下一步迭代 [待补充：基于本轮学习，下一轮 Design 将如何调整] [待补充：计划优化的元件、条件或检测流程] 执行摘要：总结工程循环对项目整体发展的指导意义，并展望未来优化方向。 未来方向 [待补充：如何进一步降低检测下限、缩短响应时间] [待补充：是否计划整合 Hardware 页面中的便携检"
  },
  {
    "type": "text",
    "pageUrl": "project/engineering.html",
    "pageTitle": "Engineering - iGEM SZPU-2026",
    "content": "目整体发展的指导意义，并展望未来优化方向。 未来方向 [待补充：如何进一步降低检测下限、缩短响应时间] [待补充：是否计划整合 Hardware 页面中的便携检测设备] [待补充：是否计划扩展至其他呼吸道病原体的检测]"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "2026 iGEM Project Log Experiment Record Wet Lab Dry Lab HP Wiki Meeting XX 总日志数 10 团队成员 Wet Lab 29 March PI Meeting: Experimental Record-Keeping & Next Steps The students of the experimental group convened a meeting with the PI to discuss the implementation of experimental documentation and subsequent experimental plan"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "he implementation of experimental documentation and subsequent experimental planning. 2 April ~ 4 April Parallel Controlled Experiment & Full-Process OD Measurement This week, we completed the scale-up culture of yeast. Incubation was performed at 30°C for 20h11min, and we set up two parallel groups: an experimental gr"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "rmed at 30°C for 20h11min, and we set up two parallel groups: an experimental group (6 streak-inoculated samples) and a blank control group (2 blank samples). We also collected a series of OD measurements of the yeast cultures throughout the experiment. 6 April ~ 10 April Project Coordination & Yeast Genetic Remodellin"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "e experiment. 6 April ~ 10 April Project Coordination & Yeast Genetic Remodelling Our current project focuses on overall coordination and experimental progress. We are conducting experimental literature research, collaborating across teams, and clarifying work directions and deadlines. We plan to humanize the C‑terminu"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "and clarifying work directions and deadlines. We plan to humanize the C‑terminus of the yeast GPA1 gene via homology arm replacement, advance yeast chassis engineering and Gpa1‑Gα fusion protein construction, and remodel the G‑protein signaling pathway to respond to the human receptor hM1 agonist DCZ for an influenza"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "aling pathway to respond to the human receptor hM1 agonist DCZ for an influenza virus sensor. We are also optimizing gene sequences, comparing FLAG tag sequences, designing PAGER fusion protein experiments with restriction sites, advancing modules on schedule, and ensuring logistics support. 15 April ~ 19 April Strain"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "modules on schedule, and ensuring logistics support. 15 April ~ 19 April Strain Culture, Plasmid Validation & Yeast Transformation Prior to the 18th, we prepared ampicillin for experiments, completed the first and second yeast subcultures, extracted PAGER plasmids, and performed plasmid agarose gel electrophoresis. Cul"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "extracted PAGER plasmids, and performed plasmid agarose gel electrophoresis. Cultures were incubated at 30 °C with shaking at 250 rpm, and we successfully obtained the required BY4741 yeast strain. After the 18th day, we added diluted plasmids to competent cells, conducted yeast transformation and double restriction en"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ids to competent cells, conducted yeast transformation and double restriction enzyme digestion electrophoresis, and finally measured the OD600 values of the cultures. 21 April ~ 23 April Medium Preparation and Bacterial Transformation During this period, our key tasks included media preparation, microbial cultivation,"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "g this period, our key tasks included media preparation, microbial cultivation, and plasmid dilution. On 21 April, we prepared 100 mL of LB solid medium and 50 mL of liquid medium, and diluted the PAGER‑containing plasmid to 100 ng/μL. On 22 April, the plasmid was further diluted to 20 ng/μL and transformed into E. col"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "2 April, the plasmid was further diluted to 20 ng/μL and transformed into E. coli Top10 competent cells, followed by inverted incubation at 18:28. On 23 April, the cultures were incubated at 37 °C for approximately 23 hours; single colonies were selected and inoculated into 5 mL of liquid medium, then incubated at 37 °"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "were selected and inoculated into 5 mL of liquid medium, then incubated at 37 °C with shaking at 220 rpm from 18:30. 22 April ~ 29 April PAGER Plasmid Validation & Yeast Transformation Success We completed the full workflow of PAGER plasmid-related experiments, including the transformation of the PAGER plasmid into E."
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "d-related experiments, including the transformation of the PAGER plasmid into E. coli Top10, single colony picking and scale-up culture. 4 groups of plasmids were extracted with concentrations of 297.15–408.45 ng/μL and A260/A280 purity of 1.890–1.927, which were verified by BamHI and NdeI double digestion with bands f"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "1.890–1.927, which were verified by BamHI and NdeI double digestion with bands fully matching expectations. Meanwhile, we finished the scale-up culture of BY4741 yeast, and completed plasmid transformation and spread plating after the OD600 reached the required standard. The negative and blank controls were free of con"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "reached the required standard. The negative and blank controls were free of contamination, and the 2 test plates showed good growth, meaning the transformation experiment initially met our expectations. Dry Lab 21 May ~ 3 June Preliminary Mathematical Modelling and Pending Validation Over the past two weeks, I gained"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "Mathematical Modelling and Pending Validation Over the past two weeks, I gained a foundational understanding of mathematical modelling. Based on the relevant literature, I have developed a relatively basic and versatile model. However, this model is still awaiting validation and further optimisation once the experiment"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "model is still awaiting validation and further optimisation once the experimental results are available. Human Practices 25 March ~ 3 April Comprehensive Human Practices Framework for Yeast-Based Influenza Biosensor Project We have built a complete human practices plan for our yeast-based influenza biosensor project,"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "complete human practices plan for our yeast-based influenza biosensor project, including stakeholder interviews, public surveys, science popularization activities, and biosafety and regulatory compliance work to better meet real clinical and social needs. We also prepared a structured interview guide for Dr. Tang Shum"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "nd social needs. We also prepared a structured interview guide for Dr. Tang Shuming from Shenzhen First People’s Hospital Longhua Branch, with 25 targeted questions about influenza A testing demands, limitations of current detection methods, and the feasibility of our yeast sensor, to provide clear clinical support for"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": ", and the feasibility of our yeast sensor, to provide clear clinical support for our project development. 2 April ~ 5 April Influenza Surveillance Data Analysis Based on influenza surveillance data from WHO FluNet and China CDC (2021-2026), we conducted comprehensive analysis revealing that COVID-19 containment measure"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "we conducted comprehensive analysis revealing that COVID-19 containment measures suppressed influenza A transmission to historically low levels, while the post-pandemic era has seen a significant rebound with record-high positivity rates and rapid viral mutations. Current detection methods rely on clinical sampling, s"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "nd rapid viral mutations. Current detection methods rely on clinical sampling, suffer from reporting delays, and cannot monitor airborne viruses, presenting clear application limitations. 6 April ~ 12 April Public Demand Survey Based on these findings, we determined our project direction: abandoning the highly mutable"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "se findings, we determined our project direction: abandoning the highly mutable H3N2 subtype in favor of developing a reprogrammable yeast biosensor targeting the more stable H1N1 subtype. This design allows adaptation to new strains simply by replacing the recognition module. Concurrently, we conducted a public questi"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "by replacing the recognition module. Concurrently, we conducted a public questionnaire survey to assess public awareness of influenza A, demand for household airborne influenza detection tools, and preferences regarding detection speed, result display methods, operational procedures, pricing, and usage scenarios. Thes"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "sult display methods, operational procedures, pricing, and usage scenarios. These insights are guiding our product optimization toward creating a rapid, low-cost, and user-friendly household airborne influenza detection solution. 19 April ~ 23 April Project Promotion and Public Demand Analysis During this period, I com"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "23 April Project Promotion and Public Demand Analysis During this period, I completed the overall content planning and organization of the project poster, presenting a comprehensive overview of the EchoYeast project, including core information such as the dual-pathway engineering strategy, biosafety characteristics, t"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "tion such as the dual-pathway engineering strategy, biosafety characteristics, target products, and cooperation models, fully demonstrating the value of the project. Secondly, I conducted a public demand survey, collecting 155 valid questionnaires. The survey systematically gathered data on the public's awareness of in"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "nnaires. The survey systematically gathered data on the public's awareness of influenza A, willingness to use airborne influenza A detection tools, display preferences, price acceptance, usage scenarios, and operational acceptance. I completed the questionnaire analysis and extracted core user needs, providing authenti"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ted the questionnaire analysis and extracted core user needs, providing authentic and reliable user data support for the product positioning and technical optimization of the project. Wiki 26 March ~ 31 March Framework Construction, Navigation Setup & Reusable JS Template Creation This week, I completed the foundationa"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ion Setup & Reusable JS Template Creation This week, I completed the foundational framework of our team wiki, implemented page navigation and redirection, and clearly delineated the layout of each section to support subsequent development. Additionally, I revised the image referencing approach by replacing the initial"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "Additionally, I revised the image referencing approach by replacing the initial absolute path configuration with relative paths across all pages. I also developed a reusable basic JavaScript page template to streamline repetitive development workflows. 2 April ~ 7 April JS Lag Resolution, Static Page Conversion & Visua"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "t workflows. 2 April ~ 7 April JS Lag Resolution, Static Page Conversion & Visual Enhancement We identified that extensive JavaScript code was causing page lag. Consequently, we removed the JS-driven template generation script and converted all wiki pages to static pages. We further optimized the visual interface and e"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "all wiki pages to static pages. We further optimized the visual interface and established our exclusive team colour scheme.The primary development task was the implementation of the Team Members page, alongside the integration of interactive switching functionality. 9 April ~ 14 April Page Polishing, Footer Constructi"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ve switching functionality. 9 April ~ 14 April Page Polishing, Footer Construction & Team Page Animations Over this period, I refined the overall page layout and constructed a foundational footer framework to support future development, which incorporates an animated scrolling effect.I also completed the basic project"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ch incorporates an animated scrolling effect.I also completed the basic project description page and designed a sidebar navigation menu by referencing the wiki structures of previous iGEM teams.Finally, I added a number of engaging interactive animations to the Team Members page. 15 April ~ 22 April Exclusive Poster In"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ive animations to the Team Members page. 15 April ~ 22 April Exclusive Poster Integration, Custom Sidebar & Log Page Addition In the new week, our team designed our own exclusive poster, which I incorporated into our wiki homepage. Additionally, I optimised the style of the sidebar navigation for the description sectio"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ally, I optimised the style of the sidebar navigation for the description section, transforming it into our team’s unique and exclusive sidebar. Furthermore, we added a new log page to facilitate the recording of every bit of work done by each member of our team. Finally, I redesigned the layout of the Team Members pag"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ach member of our team. Finally, I redesigned the layout of the Team Members page to enhance its visual presentation. 23 April ~ 5 May Wiki Mobile Adaptation for Exchange Meeting As the upcoming exchange meeting approaches, I realize the urgent need to establish a mobile-friendly version of our wiki webpage for more co"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "gent need to establish a mobile-friendly version of our wiki webpage for more convenient mobile browsing. For this reason, I have completed modifications and adjustments and open-sourced my code to ensure that the webpage is fully optimized and seamlessly mobile 30 May ~ 10 June Major error discovery Recently, I uncove"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "and seamlessly mobile 30 May ~ 10 June Major error discovery Recently, I uncovered a major flaw on our Wiki homepage. We previously used a background image approach, which unfortunately caused severe compatibility issues during mobile optimization. This setback has dealt a significant blow to our original Wiki design"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "mization. This setback has dealt a significant blow to our original Wiki design strategy. Consequently, we are shifting to a brand-new design concept for the Wiki homepage and have thoroughly optimized our mobile responsiveness. During this process, I developed several key JavaScript files to elevate the user experienc"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "process, I developed several key JavaScript files to elevate the user experience. These include a smart navigation bar that automatically collapses as users scroll down, as well as web-loading and page-reading progress bars. As a result, the layout, typography, and interactive details across most pages are now signifi"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "he layout, typography, and interactive details across most pages are now significantly cleaner, sleeker, and more cohesive. 30 May ~ 10 June JS file During this period, I primarily focused on developing several JavaScript files to enhance the wiki user experience. Key improvements include a smart navigation bar that au"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "he wiki user experience. Key improvements include a smart navigation bar that automatically collapses as users scroll down, alongside the integration of loading and page-reading progress bars. Meeting 25 March EchoYeastTeam Building! After several rounds of screening within the institute, we have decided on the staffin"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "several rounds of screening within the institute, we have decided on the staffing configuration for our team 25 March Kick-Off Team Session: Framework, Roles & Strategic Refinement We held our first iGEM team meeting, outlining the experimental framework, assigning group tasks, and setting goals for the upcoming South"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ntal framework, assigning group tasks, and setting goals for the upcoming South China Exchange meeting. We discussed key improvements such as safety systems and protein validation, along with competition strategies like wiki documentation. With clear roles and responsibilities and a tight schedule, we left ready to wor"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "With clear roles and responsibilities and a tight schedule, we left ready to work together as a team. 1 April Task Alignment & Biosensor Project Progression We convened our second team meeting to further clarify the roles and responsibilities of each team member. Our discussions covered a broad spectrum of workstreams,"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "es of each team member. Our discussions covered a broad spectrum of workstreams, ranging from experimental design and gene sequence construction to safety documentation, social outreach, branding, and wiki development.With a clear and robust division of labour now in place, we are fully prepared to progress with our ye"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "t division of labour now in place, we are fully prepared to progress with our yeast‑based biosensor project. 8 April Lab Work Launch & Project Optimisation During our third team meeting, we formally initiated laboratory work by culturing the BY4741 yeast strain and refining our experimental protocols. Concurrently, the"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "e BY4741 yeast strain and refining our experimental protocols. Concurrently, the publicity and wiki development teams advanced work on the project logo, promotional posters, and the overall wiki framework. In accordance with our advisers’ recommendations, we plan to recruit additional team members, ensure full citation"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ecommendations, we plan to recruit additional team members, ensure full citation of all sources in our social media content, and integrate a kill switch into our design to enhance biosafety. 15 April Protocol Finalisation and Multidimensional Iteration We finalised experimental protocols for primer design, chassis engi"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "al Iteration We finalised experimental protocols for primer design, chassis engineering, plasmid preparation and dual reporter system construction. We advanced wiki development, team branding, social media operation and questionnaire collection, and drafted biosafety forms and human practices plans. Following advisor g"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "tion, and drafted biosafety forms and human practices plans. Following advisor guidance, we will accelerate experiments, prioritise sequencing validation, optimise lab workflows and focus wiki content on core technology to achieve key progress before the mid‑May South China Regional Meeting. 22 April Experimental Progr"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "ess before the mid‑May South China Regional Meeting. 22 April Experimental Progress, Multi-Group Coordination & Advisor Guidance Experimental work: We advanced multiple designs including GPA1 humanisation, ste2/FAR1 knockout, PAGER fusion protein construction, and reporter system primer design. Electrophoresis showed a"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "rotein construction, and reporter system primer design. Electrophoresis showed abnormal bands and suspected plasmid fragmentation; some experiments are pending validation and optimisation. Publicity: We progressed with poster production, team uniform pattern redesign, schematic diagram drawing, and science popularisati"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "am uniform pattern redesign, schematic diagram drawing, and science popularisation video preparation. Questionnaire responses reached 155, and we refined our new media operations and exchange meeting materials. PI feedback: We were advised to clarify gene knockout logic, strengthen multi-dimensional validation, optimis"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "to clarify gene knockout logic, strengthen multi-dimensional validation, optimise plasmid preservation, and advance on-campus science popularisation and talent cultivation in parallel. 29 April PPT Revision Specification, Wiki Benchmarking & Promotional Material Confirmation During the meeting, we presented and explain"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "& Promotional Material Confirmation During the meeting, we presented and explained the PPT on our experimental direction, and confirmed the revision plan for the South China Exchange Meeting PPT. We set clear revision requirements: prioritise visual images with concise keyword-only text, clarify the logical thread of o"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "se visual images with concise keyword-only text, clarify the logical thread of our experiments, highlight the core PAGER module, avoid excessive professional content, and insert detailed experimental protocols via hyperlinks. We also studied outstanding entries from previous iGEM competitions, and finalised the directi"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "d outstanding entries from previous iGEM competitions, and finalised the direction for content supplementation and optimisation of our Wiki. In addition, we discussed promotional materials for the South China Exchange Meeting, and confirmed the core merchandise categories including badges, blind bags, and stamps. 29 Ap"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "the core merchandise categories including badges, blind bags, and stamps. 29 April PPT Revision Specification, Wiki Benchmarking & Promotional Material Confirmation During the meeting, we presented and explained the PPT on our experimental direction, and confirmed the revision plan for the South China Exchange Meeting"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "direction, and confirmed the revision plan for the South China Exchange Meeting PPT. We set clear revision requirements: prioritise visual images with concise keyword-only text, clarify the logical thread of our experiments, highlight the core PAGER module, avoid excessive professional content, and insert detailed exp"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "core PAGER module, avoid excessive professional content, and insert detailed experimental protocols via hyperlinks. We also studied outstanding entries from previous iGEM competitions, and finalised the direction for content supplementation and optimisation of our Wiki. In addition, we discussed promotional materials f"
  },
  {
    "type": "text",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "content": "and optimisation of our Wiki. In addition, we discussed promotional materials for the South China Exchange Meeting, and confirmed the core merchandise categories including badges, blind bags, and stamps."
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w1/3.29-e1.jpg",
    "content": "PI meeting with wet lab team members discussing experimental documentation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w1/3.29-e2.jpg",
    "content": "Team discussion on experimental planning and next steps"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w2/4.2/4.2-e1.jpg",
    "content": "Yeast culture setup for parallel controlled experiment"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w2/4.2/4.2-y9.jpg",
    "content": "OD600 measurement of yeast cultures"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w2/4.4/4.4-e9.jpg",
    "content": "Yeast culture growth monitoring"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w2/4.4/4.4-e11.jpg",
    "content": "Experimental setup for yeast OD measurement series"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.15/4.15-e4.jpg",
    "content": "Yeast subculture preparation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.15/4.15-e9.jpg",
    "content": "Agarose gel electrophoresis of PAGER plasmid"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.16/4.16-e4.jpg",
    "content": "Yeast strain culture at 30°C with shaking"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.18/4.18-e7.jpg",
    "content": "Yeast transformation and OD600 measurement"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.21/6.jpg",
    "content": "LB solid medium preparation (100 mL)"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w5/4.23/4.23-e1.jpg",
    "content": "Plasmid dilution to 20 ng/μL for transformation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w5/4.24/3.jpg",
    "content": "E. coli Top10 transformation setup"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w5/4.24/17.jpg",
    "content": "Single colony selection and liquid culture inoculation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/4.29/1.jpg",
    "content": "LB solid medium preparation (100 mL)"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/Dry Lab/mm1.png",
    "content": "PI meeting with wet lab team members discussing experimental documentation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/Dry Lab/mm2.png",
    "content": "Team discussion on experimental planning and next steps"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/HP/WHO1.png",
    "content": "WHO and China CDC influenza surveillance data analysis"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/HP/WHO2.png",
    "content": "User preference analysis for detection features"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/HP/WHO3.png",
    "content": "Product design optimization based on survey findings"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/HP/wenjuan.png",
    "content": "Public questionnaire survey results on influenza awareness"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/HP/poster1.png",
    "content": "WHO and China CDC influenza surveillance data analysis"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/HP/wenjuan3.jpg",
    "content": "User preference analysis for detection features"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w1-1.png",
    "content": "Wiki framework structure and navigation setup"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w1-2.png",
    "content": "Page layout and section delineation for wiki"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w2-1.png",
    "content": "Static page conversion and JS optimization result"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w2-2.png",
    "content": "Team Members page with interactive switching functionality"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w3-1.png",
    "content": "Page layout refinement and footer framework"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w3-2.png",
    "content": "Project description page with sidebar navigation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w3-3.png",
    "content": "Team Members page with interactive animations"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w4-1.png",
    "content": "Exclusive team poster integrated into wiki homepage"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w4-2.png",
    "content": "Custom sidebar navigation for description section"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w4-3.png",
    "content": "New log page for team work recording"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w4-4.png",
    "content": "Redesigned Team Members page layout"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w6-1.jpg",
    "content": "New log page for team work recording"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w6-2.jpg",
    "content": "Redesigned Team Members page layout"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/wiki/w6-3.png",
    "content": "Redesigned Team Members page layout"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w1/3.25-1.jpg",
    "content": "Kick-off team meeting discussing framework and roles"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w1/3.25-4.jpg",
    "content": "Team strategy planning for South China Exchange meeting"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w2/4.1-4.jpg",
    "content": "Team meeting clarifying roles and responsibilities"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w2/4.1-8.jpg",
    "content": "Discussion on biosensor project progression"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w3/4.8-3.jpg",
    "content": "Lab work initiation with BY4741 yeast strain culturing"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w3/4.8-9.jpg",
    "content": "Team discussion on experimental protocols and project optimization"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.15-1.jpg",
    "content": "Team meeting on protocol finalisation and multidimensional iteration"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.15-3.jpg",
    "content": "Discussion on wiki development and team branding progress"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w4/4.15-9.jpg",
    "content": "Planning for South China Regional Meeting preparation"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w5/4.22-5.jpg",
    "content": "iGEM 5th team meeting discussing experimental progress"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w5/4.22-9.jpg",
    "content": "Multi-group coordination and advisor guidance session"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w5/4.22-16.jpg",
    "content": "Multi-group coordination and advisor guidance session"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/1.jpg",
    "content": "iGEM 5th team meeting discussing experimental progress"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/4.jpg",
    "content": "Multi-group coordination and advisor guidance session"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/7.jpg",
    "content": "Multi-group coordination and advisor guidance session"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/1.jpg",
    "content": "iGEM 5th team meeting discussing experimental progress"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/4.jpg",
    "content": "Multi-group coordination and advisor guidance session"
  },
  {
    "type": "image",
    "pageUrl": "project/log.html",
    "pageTitle": "Log - iGEM SZPU-2026",
    "src": "static/image/team-photo/w6/7.jpg",
    "content": "Multi-group coordination and advisor guidance session"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "贡献导航 iGEM Contribution 概览 Parts 注册贡献 新增 BioBrick 改进元件 表征数据 实验方案与方法 克隆与验证 酵母操作 检测方法 软件与工具 数据分析 模型代码 文档资源 协作与社区 队伍合作 科普与教育 致未来队伍 0% 发酵进度 执行摘要：本页面记录 PAGER-Yeast 项目对 iGEM 社区与合成生物学领域的贡献，包括提交至 Registry 的元件、共享的实验方案、软件工具、协作成果以及可供未来队伍复用的经验。 Contribution 概览 iGEM Contribution 板块用于展示团队如何回馈社区。贡献形式不限于新元件，也包括优化现有元件、提供详细表征数据、开源代码、标准化协"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "tion 概览 iGEM Contribution 板块用于展示团队如何回馈社区。贡献形式不限于新元件，也包括优化现有元件、提供详细表征数据、开源代码、标准化协议以及跨队协作。 核心贡献方向：新型 PAGER 抗原门控受体元件、酵母底盘改造策略、检测流程标准化。 可复用成果：[待补充：列出计划提交或可共享的具体资源，如质粒、菌株、代码仓库链接。] 社区影响：[待补充：与哪些队伍或机构合作，开展了哪些科普与教育活动。] 执行摘要：说明提交至 iGEM Registry 的 BioBrick 元件、改进元件及其表征数据，确保其他队伍能够复现和使用。 Parts 注册贡献 新增 BioBrick PAGER 融合蛋白表达盒：α-facto"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "oBrick 元件、改进元件及其表征数据，确保其他队伍能够复现和使用。 Parts 注册贡献 新增 BioBrick PAGER 融合蛋白表达盒：α-factor-(GGGS)₃-MT1-(GGGS)₃-anti-HA-TEVcs-hM1Dq，克隆于 pGADT7。 FUS1-yEGFP 报告盒：用于定量荧光检测的 G 蛋白响应启动子报告系统。 FUS1-lacZ 报告盒：用于裸眼定性判读的 β-半乳糖苷酶报告系统。 [待补充：Registry 上的 Part 编号、物理样本状态、序列验证文件链接。] 改进元件 [待补充：是否对现有 Registry 元件进行了优化，例如启动子强度调整、RBS 优化、密码子优化等] [待补充：改进前"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "状态、序列验证文件链接。] 改进元件 [待补充：是否对现有 Registry 元件进行了优化，例如启动子强度调整、RBS 优化、密码子优化等] [待补充：改进前后的性能对比数据] 表征数据 [待补充：为每个新/改进元件提供的定量表征数据，包括测量条件、重复次数 n ≥ 3、误差定义（SD/SEM）、对照组设置。] 执行摘要：公开团队开发或优化的实验协议，包含材料、设备、浓度、温控时间等结构化信息，便于其他研究者复现。 实验方案与方法 克隆与验证 PAGER 融合蛋白基因的合成、限制性酶切（NdeI/BamHI）与克隆流程。 双酶切验证与 Sanger 测序确认插入片段大小与序列正确性。 [待补充：详细的反应体系、循环条件、琼脂糖凝胶"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "、限制性酶切（NdeI/BamHI）与克隆流程。 双酶切验证与 Sanger 测序确认插入片段大小与序列正确性。 [待补充：详细的反应体系、循环条件、琼脂糖凝胶参数与测序引物。] 酵母操作 LiAc/PEG 化学转化法制备 PAGER-Yeast 工程菌株。 CRISPR-Cas9 三敲除（STE2/FAR1/Sst2）与 Gpa1 人源化改造方案。 [待补充：选择标记、筛选培养基、菌落 PCR 验证引物与培养条件。] 检测方法 流式细胞术检测 yEGFP 荧光响应。 X-Gal 显色法定性检测 lacZ 表达。 [待补充：诱导剂 DCZ 浓度梯度、孵育时间、仪器型号与采集参数。] 执行摘要：汇总团队开发的软件、模型代码、数据分析脚"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "al 显色法定性检测 lacZ 表达。 [待补充：诱导剂 DCZ 浓度梯度、孵育时间、仪器型号与采集参数。] 执行摘要：汇总团队开发的软件、模型代码、数据分析脚本及配套文档，并提供访问链接与使用说明。 软件与工具 数据分析 [待补充：用于处理流式数据、计算荧光强度、绘制剂量-反应曲线的脚本或工具；建议提供 GitHub/GitLab 链接与依赖说明。] 模型代码 [待补充：G 蛋白信号通路或抗原-抗体结合动力学模型的代码、参数来源与运行环境。] 文档资源 [待补充：面向未来队伍的 Wiki 模板、实验记录模板、安全操作清单等可下载资源。] 执行摘要：记录与其他 iGEM 队伍、研究机构、社区组织的协作成果，以及团队开展的科普教育活动"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "伍的 Wiki 模板、实验记录模板、安全操作清单等可下载资源。] 执行摘要：记录与其他 iGEM 队伍、研究机构、社区组织的协作成果，以及团队开展的科普教育活动。 协作与社区 队伍合作 [待补充：与其他高校 iGEM 队伍的合作内容、共享资源、联合实验或互相验证结果。] 科普与教育 [待补充：面向中学生、公众或基层医务人员的合成生物学与流感检测科普活动；附上活动日期、地点、参与人数与反馈。] 致未来队伍 [待补充：本项目中最值得复用的经验或教训] [待补充：建议后续队伍优先验证的关键步骤] [待补充：联系人与资源获取方式]"
  },
  {
    "type": "text",
    "pageUrl": "project/contribution.html",
    "pageTitle": "Contribution - iGEM SZPU-2026",
    "content": "证的关键步骤] [待补充：联系人与资源获取方式]"
  },
  {
    "type": "text",
    "pageUrl": "team/members.html",
    "pageTitle": "Members - iGEM SZPU-2026",
    "content": "Team Members ▼ ◀"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "Team Attributions SZPU-2026 Team Contributions, External Support, and Project Timeline Quick Navigation Team Members External Support Project Timeline Team Member Contributions Core team members and their specialized roles in the SZPU-2026 project All Members Primary Investigator Advisers Wet Lab Dry Lab Human Practice"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "project All Members Primary Investigator Advisers Wet Lab Dry Lab Human Practices Design & Wiki Yongjun Tang Primary Investigator Key Tasks [待补充] Specific Contributions [待补充] Jie Xia Team Leader Wet Lab Key Tasks Team Coordination Wet Lab Execution Project Management Specific Contributions Leads overall team organizati"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "xecution Project Management Specific Contributions Leads overall team organization and project timeline management. Coordinates wet lab experimental operations, including molecular cloning and protein expression experiments. Oversees inter-group communication between wet lab, dry lab, and human practices teams to ensur"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "group communication between wet lab, dry lab, and human practices teams to ensure project progress stays on track. Yifan Gao Wet Lab Student Researcher Key Tasks Experiment Execution Data Collection Specific Contributions Conducts wet lab experiments including PCR, plasmid extraction, and agarose gel electrophoresis. A"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "xperiments including PCR, plasmid extraction, and agarose gel electrophoresis. Assists with data collection and maintenance of laboratory equipment. Supports team research through meticulous experimental record-keeping and reagent preparation. Chengxi Luo Wet Lab & Dry Lab HP Coordinator Key Tasks Experiment Execution"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "on. Chengxi Luo Wet Lab & Dry Lab HP Coordinator Key Tasks Experiment Execution Dry Lab Coordination Logistics Specific Contributions Performs wet lab experiments while coordinating dry lab modeling activities. Manages team logistics including meeting scheduling, reagent inventory, and supply procurement. Bridges commu"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ing meeting scheduling, reagent inventory, and supply procurement. Bridges communication between experimental work and computational modeling teams to ensure data flows effectively between groups. Rui Luo HP Designer Key Tasks Design Content Writing Outreach Specific Contributions Manages visual design for team present"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "t Writing Outreach Specific Contributions Manages visual design for team presentations and wiki layout. Drafts and edits project description content for the team wiki. Coordinates external outreach activities including science communication events and inter-team collaboration initiatives. Yuquan Luo Dry Lab HP Key Task"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "events and inter-team collaboration initiatives. Yuquan Luo Dry Lab HP Key Tasks Computational Analysis Outreach Support Specific Contributions Conducts computational analysis for the project, including sequence alignment and data visualization. Assists with human practices activities including stakeholder interviews"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ation. Assists with human practices activities including stakeholder interviews and community engagement. Provides technical support for dry lab data processing and analysis workflows. Siqi Peng Designer HP Key Tasks Visual Design Science Communication Illustration Specific Contributions Creates visual design assets in"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ommunication Illustration Specific Contributions Creates visual design assets including team logo, poster layouts, and illustration diagrams for the project wiki. Designs presentation materials for science communication activities. Develops visual content that makes synthetic biology concepts accessible and engaging fo"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "visual content that makes synthetic biology concepts accessible and engaging for non-technical audiences. Xiaozhen Su Wet Lab Chassis Strain Engineering Key Tasks CRISPR/Cas9 Gene Editing Strain Engineering Genotype Validation Specific Contributions Engineers Saccharomyces cerevisiae BY4741 chassis strain using CRISPR"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "tributions Engineers Saccharomyces cerevisiae BY4741 chassis strain using CRISPR/Cas9-mediated gene knockout to establish an optimized cellular host for exogenous signaling pathways. Knocks out STE2 to block endogenous α-factor mating signal input, FAR1 to release α-factor-induced cell cycle arrest enabling sustained g"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "l input, FAR1 to release α-factor-induced cell cycle arrest enabling sustained growth during long-term monitoring, and SST2 to remove the G-protein signaling negative regulator and amplify GPCR-mediated signal response. Implements sgRNA design, pML104 vector cloning, LiAc/PEG chemical transformation, SD-Ura selection s"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ign, pML104 vector cloning, LiAc/PEG chemical transformation, SD-Ura selection screening, and PCR sequencing validation. Qi Xu Web Developer Dry Lab Key Tasks Frontend Development Wiki Implementation Interactive Design Specific Contributions Develops the team wiki frontend including responsive layouts, interactive comp"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "s Develops the team wiki frontend including responsive layouts, interactive components, and CSS animations. Implements JavaScript functionality for timeline interactions, filtering systems, and dynamic content switching. Ensures cross-browser compatibility and accessibility compliance across all wiki pages. Aishi Zeng"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "er compatibility and accessibility compliance across all wiki pages. Aishi Zeng Wet Lab PAGER Sensor Construction Key Tasks Fusion Protein Design Molecular Cloning Sensor Assembly Specific Contributions Designs and constructs the PAGER membrane-display fusion sensor protein implementing the molecular gating logic of \"a"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "rane-display fusion sensor protein implementing the molecular gating logic of \"antigen-free autoinhibition, antigen-present disinhibition.\" Assembles the multi-component fusion protein from N- to C-terminus: α-factor signal peptide for membrane anchoring, MT1 autoinhibitory peptide for background suppression, anti-HA n"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "rane anchoring, MT1 autoinhibitory peptide for background suppression, anti-HA nanobody for specific influenza antigen recognition, TEV cleavage site for functional verification, and hM1Dq receptor for downstream G-protein signaling. Establishes the sensing mechanism where HA antigen binding sterically removes MT1 inhi"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ishes the sensing mechanism where HA antigen binding sterically removes MT1 inhibition, enabling DCZ-mediated receptor activation. Yuelin Zheng Wet Lab Chimeric G-protein Engineering Key Tasks Gpa1/Gαq Chimeric Design Homologous Recombination Genomic Integration Specific Contributions Constructs humanized Gpa1/Gαq chim"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "on Genomic Integration Specific Contributions Constructs humanized Gpa1/Gαq chimeric protein to establish a signal transduction bridge between human GPCR receptors and the yeast endogenous MAPK signaling pathway. Replaces the 5 C-terminal amino acids (KIGII) of yeast Gpa1 with the corresponding human Gαq sequence (EYNL"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "mino acids (KIGII) of yeast Gpa1 with the corresponding human Gαq sequence (EYNLV), preserving the main functional domain of Gpa1 while conferring human G-protein receptor binding specificity. Implements homologous recombination-based genomic integration at the GPA1 locus using ~500bp upstream/downstream homology arms"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ic integration at the GPA1 locus using ~500bp upstream/downstream homology arms and URA3 selection marker, with SD-Ura screening to identify positive integrants. Chenxi Luo Wet Lab Reporter System Construction Key Tasks FUS1 Reporter Design Plasmid Construction Functional Validation Specific Contributions Builds MAPK-r"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "Plasmid Construction Functional Validation Specific Contributions Builds MAPK-responsive reporter systems converting upstream antigen recognition signals into measurable outputs. Constructs two parallel reporter plasmids using pESC-HIS as the backbone: the FUS1 promoter-driven yEGFP reporter for quantitative fluoresce"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "the backbone: the FUS1 promoter-driven yEGFP reporter for quantitative fluorescence detection by flow cytometry, and the FUS1 promoter-driven lacZ reporter for colorimetric visualization by X-Gal staining. Implements restriction digestion and Gibson assembly cloning, chemical transformation into engineered yeast strain"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "nd Gibson assembly cloning, chemical transformation into engineered yeast strains, and functional validation with gradient DCZ agonist induction (10nM to 1μM) alongside proper control groups. Lizhen Zhu Adviser Molecular Biology Guidance Key Tasks Cloning Strategy Guidance Protocol Development Result Interpretation Spe"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "y Tasks Cloning Strategy Guidance Protocol Development Result Interpretation Specific Contributions Provides hands-on guidance for molecular cloning workflows including primer design. Reviews and refines experimental protocols to ensure reproducibility and proper controls are established before each major experiment. J"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "roducibility and proper controls are established before each major experiment. Jianhua Zhou Adviser Protein Expression Guidance Key Tasks Protein Expression Optimization Assay Design Troubleshooting Specific Contributions Advises on characterization assay design. Helps identify experimental bottlenecks and recommends t"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "erization assay design. Helps identify experimental bottlenecks and recommends troubleshooting approaches when expression yields are low. Cross-Team Collaboration Our team operates through integrated cross-functional collaboration. Wet lab members provide experimental data that informs dry lab modeling, while human pra"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "members provide experimental data that informs dry lab modeling, while human practices activities are integrated into the project's design cycle. This interdisciplinary approach ensures that our engineering solutions are grounded in both scientific rigor and real-world applicability. External Contributions Organization"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ientific rigor and real-world applicability. External Contributions Organizations and individuals who provided valuable support to our project All Types Academic Industry Community [待补充 - 姓名/机构] Institution Type: Academic Relationship to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构] Ins"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "e Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构] Institution Type: Academic Relationship to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构] Institution Type: Industry Relationship to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构]"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "o the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构] Institution Type: Industry Relationship to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构] Institution Type: Community Relationship to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "hip to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] [待补充 - 姓名/机构] Institution Type: Community Relationship to the Team: Collaborator Tasks [待补充] Specific Tasks [待补充 - 具体贡献说明] Special Acknowledgments We sincerely thank all individuals and organizations who have contributed their time, expertise, and"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "l individuals and organizations who have contributed their time, expertise, and resources to support our iGEM journey. Your generosity and guidance have been instrumental to our project's success. Project Timeline Key milestones and activities throughout our 2026 iGEM season — click bars for details Activity Feb Mar Ap"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "ies throughout our 2026 iGEM season — click bars for details Activity Feb Mar Apr May Jun Jul Aug Sep Oct Team Formation Feb 1 – Mar 18 Project Planning Mar 18 – May 1 Active Period Click any bar to view detailed information Activity Details Start — End — Duration — Worked — Details — Start — End — Duration — Worked —"
  },
  {
    "type": "text",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "content": "s Start — End — Duration — Worked — Details — Start — End — Duration — Worked — Details — Click any bar again to close"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/xj.jpg",
    "content": "Jie Xia"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/gyf.jpg",
    "content": "Yifan Gao"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/lcx.jpg",
    "content": "Chengxi Luo"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/lr.jpg",
    "content": "Rui Luo"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/lyq.jpg",
    "content": "Yuquan Luo"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/psq.jpg",
    "content": "Siqi Peng"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/sxz.jpg",
    "content": "Xiaozhen Su"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/xq.jpg",
    "content": "Qi Xu"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/zas.jpg",
    "content": "Aishi Zeng"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/zyl.jpg",
    "content": "Yuelin Zheng"
  },
  {
    "type": "image",
    "pageUrl": "team/attributions.html",
    "pageTitle": "Attributions - iGEM SZPU-2026",
    "src": "static/image/character/lcx.jpg",
    "content": "Chenxi Luo"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/model.html",
    "pageTitle": "Model - iGEM SZPU-2026",
    "content": "模型导航 Dry Lab Best Model Award Overview 模型假设 生物学假设 数学假设 数据与参数 模型结果 剂量-反应曲线 动力学模拟 模型验证 0% 发酵进度 执行摘要：本页面向 iGEM Best Model 奖项要求，展示用于理解、预测和指导 PAGER-Yeast 生物传感器设计的数学模型与计算机模拟工作。 Best Model Award 机制模型、机器学习或其他计算方法可以帮助项目设计、预测系统行为或解释实验结果。本页面需以任何人都能理解的方式解释模型的假设、数据、参数和结果。 [待补充：说明本队模型工作的核心目标，以及它如何与湿实验结果相互印证。] 执行摘要：概述建模动机、模型类型（如 ODE、"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/model.html",
    "pageTitle": "Model - iGEM SZPU-2026",
    "content": "方式解释模型的假设、数据、参数和结果。 [待补充：说明本队模型工作的核心目标，以及它如何与湿实验结果相互印证。] 执行摘要：概述建模动机、模型类型（如 ODE、 agent-based、统计模型）及其在 DBTL 循环中的位置。 Overview 建模目的：预测 PAGER 受体在 HA 抗原存在下的激活效率、信号放大倍数及检测下限。 模型类型：[待补充：常微分方程组 / 随机模拟 / 机器学习 / 组合模型] 与湿实验的对应：模型预测将通过流式细胞术 yEGFP 荧光强度与 X-Gal 显色结果进行验证。 [待补充：建议上传模型流程图或 DBTL 循环图，尺寸 1200×600px，.webp 格式并压缩至 150KB 以下。]"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/model.html",
    "pageTitle": "Model - iGEM SZPU-2026",
    "content": "X-Gal 显色结果进行验证。 [待补充：建议上传模型流程图或 DBTL 循环图，尺寸 1200×600px，.webp 格式并压缩至 150KB 以下。] 执行摘要：明确列出模型简化假设及其适用范围，确保评审能够理解模型的边界条件。 模型假设 生物学假设 酵母细胞均匀悬浮，不考虑细胞间异质性（或计划通过单细胞模型引入）。 HA 抗原与 anti-HA 纳米抗体结合符合质量作用定律。 MT1 抑制肽与 hM1Dq 受体的结合/解离处于快速平衡。 DCZ 激动剂浓度在诱导期间保持恒定。 数学假设 采用确定性 ODE 描述信号通路的平均行为。 忽略细胞生长对报告基因表达的稀释效应（或作为参数纳入）。 参数估计基于文献值与湿实验拟合。"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/model.html",
    "pageTitle": "Model - iGEM SZPU-2026",
    "content": "保持恒定。 数学假设 采用确定性 ODE 描述信号通路的平均行为。 忽略细胞生长对报告基因表达的稀释效应（或作为参数纳入）。 参数估计基于文献值与湿实验拟合。 [待补充：为每条假设标注依据来源（文献 DOI 或实验数据）。] 执行摘要：列出模型所需的输入数据、参数表及其单位，确保可复现性。 数据与参数 输入数据：[待补充：HA 抗原浓度范围、DCZ 浓度、酵母接种密度、培养时间等] 关键参数：[待补充：结合速率常数 kon/koff、受体表达量、G 蛋白激活速率、报告基因表达速率、降解速率等] 参数来源：[待补充：文献值 / 拟合得到 / 待实验测定] [待补充：建议以表格形式呈现参数名、符号、数值、单位、来源与不确定性。] 执行摘"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/model.html",
    "pageTitle": "Model - iGEM SZPU-2026",
    "content": "速率、降解速率等] 参数来源：[待补充：文献值 / 拟合得到 / 待实验测定] [待补充：建议以表格形式呈现参数名、符号、数值、单位、来源与不确定性。] 执行摘要：展示模型输出结果，重点呈现对项目设计有指导意义的预测。 模型结果 剂量-反应曲线 [待补充：模拟不同 HA 抗原浓度下的 yEGFP 荧光输出曲线；需标注坐标轴单位、误差定义（SD/SEM）、样本量 n、对照组。] 动力学模拟 [待补充：模拟抗原结合、MT1 位移、hM1Dq 激活、报告基因表达随时间变化的过程；建议用动态线图或阶段注释框呈现。] [待补充：所有图表需包含误差棒定义、样本量、对照组说明，并优先使用原生 JS 交互式图表。] 执行摘要：说明模型预测与实验结果"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/model.html",
    "pageTitle": "Model - iGEM SZPU-2026",
    "content": "议用动态线图或阶段注释框呈现。] [待补充：所有图表需包含误差棒定义、样本量、对照组说明，并优先使用原生 JS 交互式图表。] 执行摘要：说明模型预测与实验结果或已有文献的对比，评估模型可靠性。 模型验证 实验对照：[待补充：野生型 BY4741、空载体对照、阳性对照的预测与实测对比] 敏感性分析：[待补充：识别对输出影响最大的关键参数] 模型局限：[待补充：当前未考虑的生物学细节及未来改进方向] [待补充：建议采用“预测 vs 实测”镜像卡片布局，高亮重合区域。]"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "硬件导航 Dry Lab Best Hardware Award Overview 设计需求 应用场景 技术指标 约束条件 系统架构 核心组件 光学模块 电控模块 结构外壳 原型与测试 设计迭代 校准与验证 与传感器整合 文档与 BOM 未来工作 0% 发酵进度 执行摘要：本页面向 iGEM Best Hardware 奖项要求，介绍团队为 PAGER-Yeast 生物传感器配套设计或制作的硬件设备。 Best Hardware Award iGEM 鼓励队伍开发与 synthetic biology 项目紧密结合的硬件装置。硬件可以是用于检测、培养、采样或自动化的定制设备，需说明设计动机、实现过程与可复现性。 [待补充：明确本队硬"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "hetic biology 项目紧密结合的硬件装置。硬件可以是用于检测、培养、采样或自动化的定制设备，需说明设计动机、实现过程与可复现性。 [待补充：明确本队硬件的核心定位，例如“便携式 yEGFP 荧光读取盒”或“低成本酵母培养与检测一体化装置”。] 执行摘要：概述硬件要解决什么问题、面向哪些用户，以及它在 PAGER-Yeast 项目中的角色。 Overview 硬件名称：[待补充] 开发动机：[待补充：例如流式细胞仪昂贵、基层缺乏荧光检测设备等] 目标用户：[待补充：实验室快速筛查、社区诊所、现场检测人员等] 与项目的关系：[待补充：如何与酵母传感器、软件工具协同工作] [待补充：建议上传硬件渲染图或实物照片，尺寸 1200×"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "验室快速筛查、社区诊所、现场检测人员等] 与项目的关系：[待补充：如何与酵母传感器、软件工具协同工作] [待补充：建议上传硬件渲染图或实物照片，尺寸 1200×600px，.webp 格式并压缩至 150KB 以下。] 执行摘要：明确硬件的设计需求、应用场景与技术指标，为后续设计选择提供依据。 设计需求 应用场景 [待补充：场景 1，例如实验室快速初筛] [待补充：场景 2，例如现场/基层环境部署] [待补充：场景 3，例如与标准流式细胞仪的结果对照] 技术指标 检测对象：[待补充：yEGFP 绿色荧光 / X-Gal 蓝色显色] 检测范围：[待补充：浓度或荧光强度范围] 分辨率/灵敏度：[待补充：需基于实验标定] 尺寸与重量：[待"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "待补充：yEGFP 绿色荧光 / X-Gal 蓝色显色] 检测范围：[待补充：浓度或荧光强度范围] 分辨率/灵敏度：[待补充：需基于实验标定] 尺寸与重量：[待补充：便于便携的约束] 供电方式：[待补充：USB / 电池 / 市电] 约束条件 [待补充：成本控制、材料可获取性、生物安全、环境耐受性等约束。] 执行摘要：展示硬件的系统架构、核心模块及其相互连接关系。 系统架构 核心组件 [待补充：主控板 / 微控制器型号] [待补充：激发光源与滤光片] [待补充：光电传感器 / 摄像头] [待补充：温控或培养模块（如有）] 光学模块 [待补充：激发波长、发射波长、滤光片参数、光路设计说明。] 电控模块 [待补充：电路原理图说明、传感器"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "摄像头] [待补充：温控或培养模块（如有）] 光学模块 [待补充：激发波长、发射波长、滤光片参数、光路设计说明。] 电控模块 [待补充：电路原理图说明、传感器接口、通信方式（UART/I2C/USB/蓝牙）。] 结构外壳 [待补充：外壳材料、3D 打印文件、样品舱设计、遮光与便携性考虑。] 执行摘要：说明硬件原型的迭代过程、测试方法与项目整合情况。 原型与测试 设计迭代 [待补充：从概念草图到原型机的迭代记录，包括遇到的问题与改进方案。] 校准与验证 标准品：[待补充：用于校准的荧光标准品或参考样本] 对照实验：[待补充：阴性/阳性对照设置] 重复性：[待补充：n ≥ 3 的重复测量计划] 与传感器整合 [待补充：如何将硬件与 P"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "校准的荧光标准品或参考样本] 对照实验：[待补充：阴性/阳性对照设置] 重复性：[待补充：n ≥ 3 的重复测量计划] 与传感器整合 [待补充：如何将硬件与 PAGER-Yeast 酵母检测体系结合使用，例如样本加载、 incubation 与读数流程。] 执行摘要：提供硬件的文档、物料清单（BOM）与开源资料，确保可复现性。 文档与 BOM 物料清单（BOM）：[待补充：包含型号、厂家、数量、成本的表格] 设计文件：[待补充：3D 模型、电路图、PCB 文件链接] 组装指南：[待补充：分步装配说明] 开源协议：[待补充：CERN-OHL / MIT / 其他硬件开源协议] 执行摘要：说明硬件的后续优化方向与潜在应用拓展。 未来工作"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/hardware.html",
    "pageTitle": "Hardware - iGEM SZPU-2026",
    "content": "：[待补充：分步装配说明] 开源协议：[待补充：CERN-OHL / MIT / 其他硬件开源协议] 执行摘要：说明硬件的后续优化方向与潜在应用拓展。 未来工作 [待补充：小型化、低成本化或智能化改进方向] [待补充：与 Software 页面工具的数据联动计划] [待补充：面向基层医疗或家庭自测场景的应用潜力]"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "软件导航 Dry Lab Best Software Award Overview 功能与特性 核心功能 用户界面 兼容性与扩展 使用说明 安装与运行环境 快速开始 示例与教程 代码与仓库 文档与 API 未来工作 0% 发酵进度 执行摘要：本页面向 iGEM Best Software Tool 奖项要求，介绍团队为 PAGER-Yeast 项目开发的软件工具、算法或可视化平台。 Best Software Award iGEM 鼓励队伍开发能够帮助 synthetic biology 研究、设计或教育的软件工具。软件可以是新的数据分析流程、可视化平台、硬件配套程序、教育应用或建模工具等。 [待补充：明确本队软件的核心定位，例如“"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "iology 研究、设计或教育的软件工具。软件可以是新的数据分析流程、可视化平台、硬件配套程序、教育应用或建模工具等。 [待补充：明确本队软件的核心定位，例如“用于分析流式细胞术数据的阈值判定与剂量-反应曲线拟合工具”。] 执行摘要：概述软件要解决什么问题、面向哪些用户，以及它在项目中的角色。 Overview 软件名称：[待补充] 开发动机：[待补充：例如流式数据批量处理繁琐、缺乏开源的酵母荧光响应分析工具等] 目标用户：[待补充： wet lab 成员、其他 iGEM 队伍、基层检测人员等] 与项目的关系：[待补充：如何支持 PAGER-Yeast 的数据分析、模型验证或硬件控制] [待补充：建议上传软件架构图或界面截图，尺寸"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "伍、基层检测人员等] 与项目的关系：[待补充：如何支持 PAGER-Yeast 的数据分析、模型验证或硬件控制] [待补充：建议上传软件架构图或界面截图，尺寸 1200×600px，.webp 格式并压缩至 150KB 以下。] 执行摘要：列出软件的主要功能、界面特点与兼容性，帮助评审快速理解工具价值。 功能与特性 核心功能 [待补充：功能 1，例如上传 .fcs 流式数据并自动提取荧光强度分布] [待补充：功能 2，例如绘制剂量-反应曲线并计算 EC₅₀] [待补充：功能 3，例如与数学模型结果进行对比并输出残差图] 用户界面 [待补充：界面布局说明、交互流程、是否支持中英文切换、移动端适配情况等。] 兼容性与扩展 运行平台：[待"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "3，例如与数学模型结果进行对比并输出残差图] 用户界面 [待补充：界面布局说明、交互流程、是否支持中英文切换、移动端适配情况等。] 兼容性与扩展 运行平台：[待补充：Web / Windows / macOS / Linux / 移动端] 依赖环境：[待补充：Python 3.10+ / Node.js / Docker 等] 输入输出格式：[待补充：支持 .fcs / .csv / .json / .xlsx 等] 可扩展性：[待补充：模块化插件、API 接口、是否便于其他队伍复用] 执行摘要：提供软件的安装、运行与使用指南，确保评审和外部用户能够复现。 使用说明 安装与运行环境 [待补充：分步骤说明安装命令或部署方式，例如 gi"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "队伍复用] 执行摘要：提供软件的安装、运行与使用指南，确保评审和外部用户能够复现。 使用说明 安装与运行环境 [待补充：分步骤说明安装命令或部署方式，例如 git clone、pip install、docker run 等。] 快速开始 [待补充：最小可运行示例，包括输入文件、运行命令与预期输出。] 示例与教程 [待补充：提供 1-2 个典型使用场景，例如“分析 DCZ 诱导梯度下的 yEGFP 响应数据”。] 执行摘要：说明代码仓库地址、开源协议与核心代码结构。 代码与仓库 仓库链接：[待补充：GitHub / GitLab 地址] 开源协议：[待补充：MIT / GPL / Apache 等] 目录结构：[待补充：src/、d"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "库 仓库链接：[待补充：GitHub / GitLab 地址] 开源协议：[待补充：MIT / GPL / Apache 等] 目录结构：[待补充：src/、docs/、tests/、examples/ 等说明] 贡献指南：[待补充：是否接受 issue 与 pull request] 执行摘要：提供文档、API 说明与测试覆盖情况，展示软件工程规范性。 文档与 API 用户文档：[待补充：README、Wiki、视频教程链接] API 文档：[待补充：函数/接口列表、参数说明、返回值] 测试：[待补充：单元测试覆盖率、示例数据验证] 版本控制：[待补充：版本号、changelog] 执行摘要：说明软件的后续迭代方向与对 iGEM"
  },
  {
    "type": "text",
    "pageUrl": "dry-lab/software.html",
    "pageTitle": "Software - iGEM SZPU-2026",
    "content": "明、返回值] 测试：[待补充：单元测试覆盖率、示例数据验证] 版本控制：[待补充：版本号、changelog] 执行摘要：说明软件的后续迭代方向与对 iGEM 社区的潜在贡献。 未来工作 [待补充：计划新增功能或优化点] [待补充：如何与 Hardware 页面中的便携检测设备联动] [待补充：是否计划发布为 iGEM 社区通用工具或提交至 Registry]"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "实验导航 EchoYeast 概述 实验 1：PAGER融合蛋白基因设计与合成 实验 2：质粒大肠杆菌转化、提取与双酶切验证 实验 3：CRISPR-Cas9三基因敲除 实验 4：人源化Gpa1嵌合蛋白修饰 实验 5：PAGER质粒转化与WB验证 实验 6：PAGER生物传感器诱导与信号检测 试剂与设备清单 安全说明 实验进度汇总 故障排除与经验教训 0% 实验进度 概述 PAGER-Yeast 项目通过“基因合成 → 大肠杆菌质粒扩增与验证 → 酵母底盘基因工程 → 蛋白表达与生物传感器功能测试”的完整实验链，构建用于检测甲型流感病毒（IAV）的酿酒酵母生物传感器。 项目名：PAGER-Yeast: Engineered Sacc"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "达与生物传感器功能测试”的完整实验链，构建用于检测甲型流感病毒（IAV）的酿酒酵母生物传感器。 项目名：PAGER-Yeast: Engineered Saccharomyces cerevisiae Biosensor for Influenza A Virus Detection 团队：SZPU-China ECHOYeast 完整实验设计覆盖四个阶段： PAGER 融合蛋白基因的密码子优化设计与全基因合成； 克隆质粒在大肠杆菌中的转化、扩增与双酶切验证； 酿酒酵母 BY4741 底盘的 CRISPR-Cas9 三基因敲除（STE2 / FAR1 / Sst2）与人源化 Gpa1 嵌合蛋白修饰； PAGER 质粒转化、蛋白表达"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "4741 底盘的 CRISPR-Cas9 三基因敲除（STE2 / FAR1 / Sst2）与人源化 Gpa1 嵌合蛋白修饰； PAGER 质粒转化、蛋白表达 Western Blot 验证及 DCZ 诱导的荧光 / 显色信号检测。 实验 1：PAGER 融合蛋白基因设计与合成 完成 PAGER 融合蛋白基因的密码子优化、全基因合成与克隆质粒交付，测序结果确认无突变，可作为后续酵母转化模板。 Objective 合成完整串联融合蛋白基因，构建克隆质粒作为酵母转化模板。 Design 针对酿酒酵母（S. cerevisiae）表达系统进行密码子优化； 两端添加限制位点：5'-NdeI 与 3'-BamHI； 全基因合成并克隆至 pGA"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "ign 针对酿酒酵母（S. cerevisiae）表达系统进行密码子优化； 两端添加限制位点：5'-NdeI 与 3'-BamHI； 全基因合成并克隆至 pGADT7 载体； 交付物：4 μg 质粒干粉 + 甘油菌 + 完整测序报告。 Measured Data / Result 质粒编号 ABX63942；全测序结果与设计序列一致，无突变。 Progress Status 已完成 ✅ 实验 2：质粒大肠杆菌转化、提取与双酶切验证 通过热激转化、质粒小提与 NdeI/BamHI 双酶切验证，4 个阳性克隆浓度与纯度均达标，电泳条带符合理论分子量。 Objective 将 PAGER 合成质粒转化至大肠杆菌中扩增，提取质粒并通过限制性"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "I 双酶切验证，4 个阳性克隆浓度与纯度均达标，电泳条带符合理论分子量。 Objective 将 PAGER 合成质粒转化至大肠杆菌中扩增，提取质粒并通过限制性酶切验证插入片段大小。 Materials Top10 感受态大肠杆菌； 氨苄青霉素 100 μg/mL； TIANGEN DP103 小量质粒提取试剂盒； NdeI-HF、BamHI-HF（NEB）。 Protocol 热激转化：取 2.5 μL 质粒与 Top10 感受态细胞混合，冰浴 30 min → 42 ℃ 热激 90 s → 冰浴 2 min；无抗 LB 复苏 1 h，涂 Amp 平板，37 ℃ 培养 12–16 h。 液体培养：挑取单菌落，5 mL LB-Amp"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "热激 90 s → 冰浴 2 min；无抗 LB 复苏 1 h，涂 Amp 平板，37 ℃ 培养 12–16 h。 液体培养：挑取单菌落，5 mL LB-Amp 培养基过夜培养。 质粒提取：裂解 → DNA 结合 → 洗涤 → 65 ℃ 预温 EB 缓冲液洗脱，二次洗脱以提高浓度。 双酶切验证：50 μL 反应体系，37 ℃ 酶切 1 h；0.8 % 琼脂糖凝胶电泳 80 V 70 min。 Measured Data / Result 4 个阳性克隆质粒浓度分别为 408.45 / 404.85 / 297.15 / 355.90 ng/μL，A260/A280 ≈ 1.9，纯度合格；电泳条带显示骨架 7939 bp、插入片段 2"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "45 / 404.85 / 297.15 / 355.90 ng/μL，A260/A280 ≈ 1.9，纯度合格；电泳条带显示骨架 7939 bp、插入片段 2063 bp，与理论值一致。 Progress Status 已完成 ✅ 实验 3：CRISPR-Cas9 三基因敲除（STE2 / FAR1 / Sst2） 通过单靶点 sgRNA 介导的移码突变，重构野生型 BY4741 酵母底盘以消除内源 mating 信号干扰；当前因初次酶切失败，正在重建 sgRNA 载体。 Objective 重构野生型 BY4741 酵母底盘，消除内源信号干扰并放大通路响应。 Design 单靶点 sgRNA 设计，通过移码突变实现全基因敲除；s"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "Objective 重构野生型 BY4741 酵母底盘，消除内源信号干扰并放大通路响应。 Design 单靶点 sgRNA 设计，通过移码突变实现全基因敲除；sgRNA 克隆至 pML104 载体； LiAc/PEG 化学转化入酵母；SD-Ura 营养缺陷平板筛选； 菌落 PCR + Sanger 测序验证阳性菌株。 Progress Status 进行中 🔄（酶切失败后重建 sgRNA 载体） 实验 4：人源化 Gpa1 嵌合蛋白修饰（同源重组定点整合） 利用酿酒酵母同源重组，将 Gpa1 C 末端 KIGII 替换为人源 Gαq 的 EYNLV，构建可偶联人源 hM1Dq 受体的 G 蛋白底盘。 Objective 将酿酒酵母"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "重组，将 Gpa1 C 末端 KIGII 替换为人源 Gαq 的 EYNLV，构建可偶联人源 hM1Dq 受体的 G 蛋白底盘。 Objective 将酿酒酵母 Gpa1 蛋白 C 末端人源化，使其能够响应 hM1Dq 受体下游信号。 Principle 酿酒酵母同源重组介导基因组定点替换。BY4741 为 ura3 营养缺陷型菌株，利用 URA3 标记筛选阳性整合克隆。 Design 线性整合片段结构：500 bp 上游同源臂 - 人源化 Gpa1 突变序列 - URA3 筛选盒 - 500 bp 下游同源臂 突变位点：将 Gpa1 C 末端最后 5 个氨基酸 KIGII 替换为人源 Gαq 序列 EYNLV Verificati"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "筛选盒 - 500 bp 下游同源臂 突变位点：将 Gpa1 C 末端最后 5 个氨基酸 KIGII 替换为人源 Gαq 序列 EYNLV Verification 菌落 PCR + Sanger 测序确认整合位点与突变序列。 Progress Status 待进行 ⏳ 实验 5：PAGER 质粒转化与 WB 蛋白表达验证 采用 LiAc/PEG 化学转化将 PAGER 质粒导入酵母，随后通过 Western Blot 验证融合蛋白表达。 Objective 将 PAGER 表达质粒转化至工程酵母底盘，并验证目标融合蛋白表达。 Transformation Method LiAc/PEG 化学转化。 Western Blot Pro"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "表达质粒转化至工程酵母底盘，并验证目标融合蛋白表达。 Transformation Method LiAc/PEG 化学转化。 Western Blot Procedure 酵母总蛋白提取； SDS-PAGE 分离； 转膜封闭； 一抗 / 二抗孵育； 显色成像。 Progress Status 待进行 ⏳ 实验 6：PAGER 生物传感器诱导与信号检测 使用 DCZ 小分子激动剂诱导 hM1Dq 通路，结合流式细胞术与 X-Gal 显色，定量 / 定性评估 PAGER 生物传感器对 IAV HA 抗原的响应。 Objective 在 HA 抗原存在与否的条件下，验证 PAGER 生物传感器的诱导响应与信号输出。 Inducer DC"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "感器对 IAV HA 抗原的响应。 Objective 在 HA 抗原存在与否的条件下，验证 PAGER 生物传感器的诱导响应与信号输出。 Inducer DCZ 小分子激动剂；浓度梯度：10 nM、100 nM、1 μM，测试最佳诱导浓度。 Control Groups 阴性对照：未转化野生型 BY4741 酵母； 空载体对照：转化空白 pESC-HIS 质粒的菌株； 阳性对照：确认通路稳定激活的工程酵母菌株。 Detection Methods 流式细胞术：定量 yEGFP 绿色荧光强度； X-Gal 染色：检测 lacZ β-半乳糖苷酶活性，肉眼定性观察蓝色信号。 Response Mechanism 无 IAV HA 抗原时"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "P 绿色荧光强度； X-Gal 染色：检测 lacZ β-半乳糖苷酶活性，肉眼定性观察蓝色信号。 Response Mechanism 无 IAV HA 抗原时：MT1 抑制肽持续结合并抑制 hM1Dq，下游通路关闭，无荧光 / 蓝色信号； 有 HA 抗原时：HA 结合膜表面纳米抗体，空间位阻将 MT1 抑制肽推开；DCZ 激活 hM1Dq，G 蛋白级联触发 FUS1 启动子，大量表达 yEGFP / lacZ，产生荧光 / 蓝色信号。 Progress Status 待进行 ⏳ 试剂与设备清单 汇总本实验链所需核心菌株、培养基、抗生素、酶试剂、试剂盒、功能化学品、电泳耗材及关键设备，确保实验可复现。 核心试剂 Category N"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "⏳ 试剂与设备清单 汇总本实验链所需核心菌株、培养基、抗生素、酶试剂、试剂盒、功能化学品、电泳耗材及关键设备，确保实验可复现。 核心试剂 Category Name Remark Strains Top10 competent E. coli, BY4741 S. cerevisiae Safe model organism, non-pathogenic Culture Medium LB solid/liquid, YPD complete yeast medium, SD-Ura selective medium Antibiotic Ampicillin stock solution 100 mg/mL Enzymes N"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "SD-Ura selective medium Antibiotic Ampicillin stock solution 100 mg/mL Enzymes NdeI, BamHI restriction enzyme, Taq DNA polymerase NEB brand Kits Mini plasmid extraction kit, magnetic bead yeast genomic DNA extraction kit SZD003 Functional Chemicals DCZ agonist, X-Gal chromogenic substrate Electrophoresis Consumables DL"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "hemicals DCZ agonist, X-Gal chromogenic substrate Electrophoresis Consumables DL15000 DNA Marker, SuperRed nucleic acid stain 实验设备 生物安全柜、恒温摇床、冷冻高速离心机、高压灭菌锅、电泳系统、凝胶成像系统、NanoDrop 分光光度计、流式细胞仪、金属浴。 安全说明 所有实验均在 BSL-1 标准分子生物学实验室进行，使用非致病性模式生物，废弃物经高压灭菌后统一处置。 所用酿酒酵母为生物安全一级（BSL-1）模式生物，无致病风险； 所有基因工程操作在标准化分子生物学实验室完成； 菌液与固体培养基废物经高压"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "高压灭菌后统一处置。 所用酿酒酵母为生物安全一级（BSL-1）模式生物，无致病风险； 所有基因工程操作在标准化分子生物学实验室完成； 菌液与固体培养基废物经高压灭菌后统一处置； 限制酶、DCZ 等化学试剂避免直接接触皮肤，操作时佩戴手套和护目镜。 故障排除与经验教训 记录实验 3 中 sgRNA 载体酶切失败后的排查与重建经验，为后续 CRISPR 三敲除实验提供参考。 问题：实验 3 初次 sgRNA 载体酶切验证失败，条带不符合预期。 排查：检查引物退火温度、sgRNA 寡核苷酸磷酸化效率及 BsaI 酶切活性；发现寡核苷酸退火不完全导致克隆效率下降。 解决：重新设计并合成 sgRNA 寡核苷酸，优化退火程序（梯度降温），更换新"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "寡核苷酸磷酸化效率及 BsaI 酶切活性；发现寡核苷酸退火不完全导致克隆效率下降。 解决：重新设计并合成 sgRNA 寡核苷酸，优化退火程序（梯度降温），更换新鲜限制酶后重新克隆至 pML104 载体。 经验：CRISPR 载体构建中，sgRNA 寡核苷酸的退火质量与酶切反应新鲜度是关键质控点；建议每次设置空载体与无插入片段的阴性对照。 实验进度汇总 当前已完成基因合成与大肠杆菌验证阶段；CRISPR 三敲除正在推进，其余酵母工程与功能测试阶段待进行。 Module Status Key Achievement PAGER 融合蛋白基因合成 ✅ Completed 测序验证，4 μg 质粒干粉保存 大肠杆菌转化 + 质粒提取 + 双"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/experiments.html",
    "pageTitle": "Experiments - iGEM SZPU-2026",
    "content": "us Key Achievement PAGER 融合蛋白基因合成 ✅ Completed 测序验证，4 μg 质粒干粉保存 大肠杆菌转化 + 质粒提取 + 双酶切 ✅ Completed 浓度与纯度合格，电泳条带符合理论值 CRISPR 三敲除 STE2/FAR1/Sst2 🔄 In progress 酶切失败后重建 sgRNA 载体 Gpa1 人源化同源重组修饰 ⏳ Pending 酵母转化与 WB 蛋白表达验证 ⏳ Pending DCZ 诱导荧光功能测试 ⏳ Pending"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "结果导航 Wet Lab Results 概览 关键实验结果 质粒构建验证 底盘改造验证 传感器响应检测 数据可视化 荧光强度数据 剂量-反应曲线 显色与成像 分析与讨论 结果意义 趋势与模式 局限性与不确定性 未来计划与反思 后续实验 改进方向 经验总结 0% 发酵进度 执行摘要：本页面展示 PAGER-Yeast 项目的实验结果，包括数据可视化、结果分析、科学意义讨论以及未来计划。所有数据需客观呈现，避免夸大结论。 Results 概览 Results 页面应清晰、客观地描述实验和研究结果，使用表格、图形和图像进行可视化，并在项目目标背景下讨论其意义。 核心问题：PAGER-Yeast 生物传感器能否有效检测 IAV HA 抗原"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "描述实验和研究结果，使用表格、图形和图像进行可视化，并在项目目标背景下讨论其意义。 核心问题：PAGER-Yeast 生物传感器能否有效检测 IAV HA 抗原？ 主要方法：流式细胞术（yEGFP 荧光）、X-Gal 显色、分子克隆验证。 数据状态：[待补充：当前已完成的实验与待补充的数据] 执行摘要：分模块呈现实验获得的关键结果，每个结果需有对应的对照、重复与误差说明。 关键实验结果 质粒构建验证 PAGER 融合蛋白基因克隆至 pGADT7，测序结果与设计一致。 双酶切验证显示插入片段 2063 bp、骨架 7939 bp，与理论值相符。 质粒浓度：408.45 / 404.85 / 297.15 / 355.90 ng/μL；"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "证显示插入片段 2063 bp、骨架 7939 bp，与理论值相符。 质粒浓度：408.45 / 404.85 / 297.15 / 355.90 ng/μL；A260/A280 ≈ 1.9。 [待补充：上传电泳图与测序报告，标注泳道、Marker 与条带大小。] 底盘改造验证 CRISPR-Cas9 三敲除（STE2/FAR1/Sst2）与 Gpa1 人源化改造正在进行中。 [待补充：菌落 PCR + Sanger 测序验证结果] [待补充：Western Blot 验证 PAGER 融合蛋白表达] 传感器响应检测 [待补充：DCZ 诱导与 HA 抗原刺激下的 yEGFP 荧光响应、X-Gal 显色结果；需包含阴性/阳性对照、重复"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "PAGER 融合蛋白表达] 传感器响应检测 [待补充：DCZ 诱导与 HA 抗原刺激下的 yEGFP 荧光响应、X-Gal 显色结果；需包含阴性/阳性对照、重复次数与统计显著性。] 执行摘要：使用图表呈现数据，确保每张图都有明确的坐标轴标签、单位、误差定义与图例。 数据可视化 荧光强度数据 [待补充：流式细胞术得到的 yEGFP 荧光强度分布图或平均荧光强度柱状图；X 轴为样本/HA 浓度，Y 轴为荧光强度（a.u. 或 MFI），误差棒定义为 SD/SEM，n ≥ 3。] 剂量-反应曲线 [待补充：不同 HA 抗原浓度下的响应曲线，标注检测下限（LOD）、线性范围与饱和浓度；建议用原生 JS 交互式图表实现。] 显色与成像 [待补"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "剂量-反应曲线 [待补充：不同 HA 抗原浓度下的响应曲线，标注检测下限（LOD）、线性范围与饱和浓度；建议用原生 JS 交互式图表实现。] 显色与成像 [待补充：X-Gal 显色照片、荧光显微镜或肉眼观察图像；图片需使用 .webp 格式并压缩至 150KB 以下，附比例尺与拍摄条件。] 执行摘要：解释结果背后的生物学意义，讨论趋势、模式、意外发现及实验局限。 分析与讨论 结果意义 [待补充：实验结果如何支持或修正 PAGER-Yeast 的设计假设？与项目目标（低成本、高灵敏度现场检测）的关联是什么？] 趋势与模式 [待补充：随 HA 浓度升高的荧光响应趋势] [待补充：DCZ 诱导浓度与响应幅度的关系] [待补充：不同对照组之"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "灵敏度现场检测）的关联是什么？] 趋势与模式 [待补充：随 HA 浓度升高的荧光响应趋势] [待补充：DCZ 诱导浓度与响应幅度的关系] [待补充：不同对照组之间的信号差异] 局限性与不确定性 [待补充：当前数据的限制，例如样本量、背景信号、批次差异、未优化的诱导条件等；避免隐瞒负面结果。] 执行摘要：基于实验结果提出后续计划、潜在应用方向与团队反思。 未来计划与反思 后续实验 [待补充：优化诱导条件与检测体系] [待补充：扩大样本量并引入更多 HA 浓度梯度] [待补充：与 Model 页面预测结果进行对照验证] 改进方向 [待补充：降低背景信号的策略] [待补充：提高响应速度或灵敏度的可能途径] [待补充：与 Hardware"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/result.html",
    "pageTitle": "Results - iGEM SZPU-2026",
    "content": "Model 页面预测结果进行对照验证] 改进方向 [待补充：降低背景信号的策略] [待补充：提高响应速度或灵敏度的可能途径] [待补充：与 Hardware 便携检测设备的整合计划] 经验总结 [待补充：实验过程中遇到的关键问题、解决方案与团队学习；强调科学诚实与透明度。]"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/parts.html",
    "pageTitle": "Parts - iGEM SZPU-2026",
    "content": "Parts 这里展示了项目中使用的生物元件信息。"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "安全导航 Wet Lab Safety and Security Award 潜在风险识别 生物风险 化学风险 物理风险 安保风险 风险缓解与安全管理 设计内置安全特性 非致病底盘 低危害元件选择 Kill-switch 等控制 设计选择 rationale iGEM Safety Policies 遵循 0% 发酵进度 执行摘要：本页面向 iGEM Safety and Security 奖项要求，系统梳理 PAGER-Yeast 项目在设计、实验与部署全周期中的生物安全与生物安保风险，并说明已采取或计划采取的风险缓解措施。 Safety and Security Award iGEM 安全与安保委员会鼓励各队伍运用生物工程手段识"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "生物安保风险，并说明已采取或计划采取的风险缓解措施。 Safety and Security Award iGEM 安全与安保委员会鼓励各队伍运用生物工程手段识别并管理项目潜在风险。本页面需展示团队对合成生物学负责任创新的理解，以及将安全理念融入项目设计的具体做法。 [待补充：结合项目特色，简要说明本页将如何回应奖项评审维度。] 执行摘要：从生物、化学、物理及技术安保四个维度识别项目潜在风险，为后续缓解措施提供依据。 潜在风险识别 生物风险 所用底盘为 Saccharomyces cerevisiae BY4741，属 BSL-1 模式生物，无致病性。 抗原识别对象：灭活或重组 IAV HA 抗原（如有活病毒操作需单独说明生物安全等"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "es cerevisiae BY4741，属 BSL-1 模式生物，无致病性。 抗原识别对象：灭活或重组 IAV HA 抗原（如有活病毒操作需单独说明生物安全等级与审批）。 基因改造后的酵母释放到环境中的潜在生态影响。 [待补充：具体生物安全等级、实验操作等级、菌种保存与废弃物处理方案。] 化学风险 限制酶、连接酶、DNA 染料等分子生物学试剂的安全使用。 DCZ 小分子激动剂、X-Gal 显色底物等化学品的储存与操作规范。 有机溶剂（如乙醇、异丙醇）的防火与通风要求。 [待补充：每种危险化学品的安全数据表（SDS）与 PPE 要求。] 物理风险 高压灭菌锅、离心机、电泳仪等设备的规范操作。 紫外透射仪、激光扫描仪等光辐射防护。 实"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "补充：每种危险化学品的安全数据表（SDS）与 PPE 要求。] 物理风险 高压灭菌锅、离心机、电泳仪等设备的规范操作。 紫外透射仪、激光扫描仪等光辐射防护。 实验室用电、用水与消防安全。 [待补充：设备操作规程与实验室安全培训记录。] 安保风险 基因序列、菌株与质粒的获取、使用和分发合规性。 技术信息对外传播前的脱敏与审查机制。 防止技术被恶意滥用的设计考量（如选择安全底盘、避免毒性元件）。 [待补充：项目遵循的 iGEM White List 与 Do Not Release 条款声明。] 执行摘要：针对已识别风险，说明实验室管理、操作规范、应急响应与培训机制。 风险缓解与安全管理措施 实验室准入与培训：所有成员须完成生物安全培训"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "e 条款声明。] 执行摘要：针对已识别风险，说明实验室管理、操作规范、应急响应与培训机制。 风险缓解与安全管理措施 实验室准入与培训：所有成员须完成生物安全培训并通过考核。 个人防护装备（PPE）：实验服、手套、护目镜的佩戴要求。 废弃物处理：菌液、培养基、枪头等经高压灭菌后统一处置。 化学品管理：专人专柜、分类存放、定期清点。 应急预案：溅洒、泄漏、割伤、火灾等事故的处置流程。 [待补充：实验室安全手册摘要、培训签到表、废弃物处理记录等可验证材料。] 执行摘要：从项目设计层面说明如何通过底盘选择、元件选择与遗传控制降低风险。 设计内置安全特性 非致病底盘 本项目选用酿酒酵母 BY4741 作为传感器底盘。该菌株为实验室常用模式生物"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "面说明如何通过底盘选择、元件选择与遗传控制降低风险。 设计内置安全特性 非致病底盘 本项目选用酿酒酵母 BY4741 作为传感器底盘。该菌株为实验室常用模式生物，遗传背景清晰、无人类致病性、无环境定植优势，且易于通过标准灭菌程序灭活。 低危害元件选择 报告基因 yEGFP / lacZ 均为成熟、安全的标记基因。 anti-HA 纳米抗体仅用于抗原识别，不编码毒素或致病因子。 人源化 hM1Dq 受体与 Gpa1-Gαq 嵌合蛋白仅在酵母细胞内表达，不进入人类细胞。 Kill-switch 与其它安全控制 [待补充：若设计中包含营养缺陷型依赖、温度敏感型致死基因或其它 kill-switch 机制，请在此详细说明原理与验证计划。]"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "-switch 与其它安全控制 [待补充：若设计中包含营养缺陷型依赖、温度敏感型致死基因或其它 kill-switch 机制，请在此详细说明原理与验证计划。] 执行摘要：解释上述安全设计选择背后的科学依据与工程权衡。 设计选择 rationale 为何选择 BY4741 而非其它酵母或细菌底盘？ 为何采用 yEGFP + lacZ 双报告系统？ 为何通过 CRISPR 三敲除而非其他方式降低背景？ [待补充：将每个设计选择与安全性、可生产性、可检测性之间的权衡进行说明。] 执行摘要：确认本项目遵循 iGEM 官方安全政策，并提供相关表格或审批链接。 iGEM Safety Policies 遵循 本项目承诺遵守 iGEM 官方 Sa"
  },
  {
    "type": "text",
    "pageUrl": "wet-lab/safety.html",
    "pageTitle": "Safety - iGEM SZPU-2026",
    "content": "行摘要：确认本项目遵循 iGEM 官方安全政策，并提供相关表格或审批链接。 iGEM Safety Policies 遵循 本项目承诺遵守 iGEM 官方 Safety Policies 与 Do Not Release 条款。 [待补充：安全表格（Safety Form）提交状态与编号] [待补充：生物安全委员会或学校伦理/生物安全审批文件] [待补充：所有涉及活病毒或高致病性样本操作的审批记录]"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "00 概述 下面这张交互地图记录了团队在项目过程中接触过的部分 Human Practices 合作者与专家。点击图钉即可查看每位专家的方向与贡献。 全球专家交互地图 点击图钉查看专家详情 Filter by sector − Science and academia Policy Industry Public 底图：MapSVG CC0 中国地图 × 01 清华大学合成生物学创意大赛参赛交流 HP 比赛篇 · 在清华赛场与外界对话 为什么参加这场比赛 项目推进到需要对外表达时，团队发现一个在实验室里不容易察觉的问题：我们自以为了解的项目，和外部观众——其他合成生物学团队、评审、跨学科师生——眼里的项目，未必是一回事。封闭环境里的"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "达时，团队发现一个在实验室里不容易察觉的问题：我们自以为了解的项目，和外部观众——其他合成生物学团队、评审、跨学科师生——眼里的项目，未必是一回事。封闭环境里的讨论容易走进思维定势，而一场跨校比赛正好把项目摆到\"陌生人\"面前接受检验。 第一届清华大学合成生物学创意大赛由清华主办，主打\"创意为核心、零门槛为底色\"，吸引了清华、北大、同济、南方科技大学等 44 所高校团队参加。这样一个跨校、跨背景的赛场，让项目第一次不再只面对熟悉的实验室同伴，而是要向陌生同行讲清楚\"我们在做什么、为什么值得做\"。 赛场上的收获与反馈 团队凭项目的新意和现场展示互动，拿到了赛事设置的\"最具人气魅力奖\"。不过比起奖项，更值得记下来的是成员在交流中的真实反思"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "、为什么值得做\"。 赛场上的收获与反馈 团队凭项目的新意和现场展示互动，拿到了赛事设置的\"最具人气魅力奖\"。不过比起奖项，更值得记下来的是成员在交流中的真实反思——这些反思才是这次活动最核心的 HP 价值。 不少同学在赛后总结里不约而同地提到\"表达\"和\"理解\"：反复改稿、模拟答辩，让成员把项目彻底吃透，介绍时从生疏变得顺手；而在向不同团队讲解的过程中，成员也反过来加深了对自己工作的理解。其他团队提出的问题，常常能点出那些由于我们内部思维惯性而被忽略的新角度。 更关键的是，跨团队的平行交流暴露了项目在应用层面的薄弱。有成员想到，团队此前对\"项目落地场景\"\"社会价值需求\"这类现实问题的思考还比较浅；也有成员说，看了其他队伍的改造路线，才"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "队的平行交流暴露了项目在应用层面的薄弱。有成员想到，团队此前对\"项目落地场景\"\"社会价值需求\"这类现实问题的思考还比较浅；也有成员说，看了其他队伍的改造路线，才意识到许多此前没设想过的创新角度，给后续研发打开了新思路。这些反馈没有直接指向某个实验改动，但一致地把团队引向同一个问题：技术方案之外，项目还得认真回答\"它将在什么场景下、被谁、为了解决什么问题而使用\"。 对项目的意义 这场比赛没有改变我们的技术路线，却从几个不同层面重塑了团队对项目的理解。 在表达上，外部反馈印证了\"把项目讲清楚\"本身就是一门要专门打磨的能力——奖项认可的风采展示和生动表达，本质上是项目叙事对观众的吸引力。这让团队在后续工作里更舍得在表达策略上下功夫，而不只"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "把项目讲清楚\"本身就是一门要专门打磨的能力——奖项认可的风采展示和生动表达，本质上是项目叙事对观众的吸引力。这让团队在后续工作里更舍得在表达策略上下功夫，而不只盯着技术细节。 在应用上，队员自省和其他团队的提问这两个独立来源，指向了同一个盲区：项目对真实使用场景和社会需求的思考还不够深。团队据此把\"调研真实使用需求、完善落地方案\"列为了后续重点推进的方向，同时也如实说明，配套的硬件目前还停留在构想阶段，欢迎外部合作。 在协作上，和同行的碰撞让团队尝到了开放交流的甜头，也补足了项目在创意来源和创新角度上的外部输入。这些体会让团队相信：HP 不该是赛后才补的材料，而是贯穿项目始终、不断修正团队判断的过程。 02 HP探险篇—这次我们来到"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "项目在创意来源和创新角度上的外部输入。这些体会让团队相信：HP 不该是赛后才补的材料，而是贯穿项目始终、不断修正团队判断的过程。 02 HP探险篇—这次我们来到了华南交流会！ HP 探险篇系列 · 华南地区科普交流活动记录 活动照片 为什么参加华南交流会 项目推进到中期，团队意识到一个绕不开的问题：我们自己对项目的理解，和外部受众——尤其是其他 iGEM 团队和评审——对项目的理解，可能并不一致。实验室里的讨论容易形成思维定势，我们觉得已经讲清楚的话，在别人听来未必如此。 华南地区 iGEM 交流会正好给了团队一个外部评价环境，到场的有华南多所高校的 iGEM 团队，也有经验丰富的评审嘉宾。我们决定参加，就是想在同行的互动里检验项目"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "南地区 iGEM 交流会正好给了团队一个外部评价环境，到场的有华南多所高校的 iGEM 团队，也有经验丰富的评审嘉宾。我们决定参加，就是想在同行的互动里检验项目表达是否清晰，并从外部视角捞出那些团队此前没太在意的问题。 交流中的发现 整场交流按自己的节奏推进，但比流程更值钱的是其中浮现的几类反馈。 海报展示：一次即时的表达测试 交流会以线下海报展示开场。团队带着项目海报，向其他队伍和评审介绍 SZPU-ECHOYeast 的方向和技术路线。海报不只是往外倒信息，更像一个即时反馈窗口——看驻足的人最先盯哪里、问什么，就能直接判断项目表达里哪些部分最抓人、哪些最让人犯迷糊。 展示过程中，团队注意到多数来访者对项目的实际应用场景很感兴趣，"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "馈窗口——看驻足的人最先盯哪里、问什么，就能直接判断项目表达里哪些部分最抓人、哪些最让人犯迷糊。 展示过程中，团队注意到多数来访者对项目的实际应用场景很感兴趣，反而很少追着问技术细节。这给团队提了个醒：后面的项目表达，应该先把\"解决什么问题\"讲明白，而不是一上来就堆方法。 队际交流：平行视角的对照 海报之后是自由的队际交流时间。团队和其他参赛队伍一对一线下聊，各自讲进展、说瓶颈、谈解法。这种平行视角的对照尤其有用——别的队踩的坑（实验进度管理、跨学科协作效率、HP 活动设计等）常常和我们的高度重合，但应对路子各不相同。 和好几支队伍对比下来，团队发现大家在项目叙事结构上的差别很大：有人以技术突破为主线，有人从社会需求切入，还有人从伦"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "）常常和我们的高度重合，但应对路子各不相同。 和好几支队伍对比下来，团队发现大家在项目叙事结构上的差别很大：有人以技术突破为主线，有人从社会需求切入，还有人从伦理讨论开场。这种差别让团队忍不住回头想，自己的叙事是不是真的把项目的核心价值讲清楚了。 提问环节：来自评审的反馈 提问环节是整场信息密度最高的部分。评审和其他团队抛来不少问题，其中有三类最值得我们记下来： 关于检测目标的界定：有提问指出，团队对\"广谱病毒监测\"的覆盖范围讲得偏宽，建议先明确优先针对的病毒类别和应用场景（比如医疗机构、公共场所、家庭自测三者的区分）。这让我们意识到，\"广谱\"不等于模糊——在保持技术通用性的同时，也得给出具体的应用入口。 关于生物安全性的考量：不止"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "比如医疗机构、公共场所、家庭自测三者的区分）。这让我们意识到，\"广谱\"不等于模糊——在保持技术通用性的同时，也得给出具体的应用入口。 关于生物安全性的考量：不止一位参会者关心项目里生物材料处理的安全性，尤其是放到非实验室环境里用的可能。这个问题团队内部其实聊过，但一直没放到项目表达的核心位置。交流会的反馈说明，安全性论证得成为项目可信度的一块基石。 关于 HP 与项目的关联性：有评审追问，团队的 Human Practices 活动到底怎么具体回过头影响了项目设计。这个问题点醒我们，HP 不是独立于技术工作的\"附加模块\"，要在叙述里把\"HP 反馈 → 技术决策\"的逻辑链摆明白。 此次交流对项目的意义 华南交流会没有直接改动实验方案或"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "醒我们，HP 不是独立于技术工作的\"附加模块\"，要在叙述里把\"HP 反馈 → 技术决策\"的逻辑链摆明白。 此次交流对项目的意义 华南交流会没有直接改动实验方案或技术路线，但帮团队在好几个层面重新理解了项目： 表达层面的优化：外部反馈显示，项目叙述的优先级得重排——从\"先讲技术再讲应用\"改成\"先点明问题再引出方案\"。这不动技术本身，却会影响评审和公众对项目的第一印象，以及他们能理解到多深。 安全性认知的强化：生物安全这条反馈来自多个独立来源，说明它不是团队自己在吓自己，而是外部受众普遍在意的议题。团队打算在后续补上和安全性相关的实验设计与论证材料。 HP 叙事结构的反思：被问到\"HP 怎么和项目挂钩\"之后，团队重新打量了现在 HP 页"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "受众普遍在意的议题。团队打算在后续补上和安全性相关的实验设计与论证材料。 HP 叙事结构的反思：被问到\"HP 怎么和项目挂钩\"之后，团队重新打量了现在 HP 页面的组织方式——每篇 HP 文章，是不是都清楚体现了\"拿到反馈 → 调整理解\"这条链。而这次交流本身的记录，也正是照着这个思路写的。 我们走进职业高中做科普宣讲，把合成生物学从实验室里带出来；而学生们对便携性和检测速度的那几句反馈，也把\"负责任的研究与创新\"这个理念，落成了具体的产品优化方向。 03 面向中学生的科学传播与项目交流：让合成生物学走近未来的探索者 深圳市第一职业技术学校坪山校区 · 高二学生科普交流活动 活动合影 课堂全景 项目讲解 科普展示 图 2. 校园宣讲"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "播与项目交流：让合成生物学走近未来的探索者 深圳市第一职业技术学校坪山校区 · 高二学生科普交流活动 活动合影 课堂全景 项目讲解 科普展示 图 2. 校园宣讲现场：团队向高二学生介绍 iGEM 理念与工程化酵母生物传感器项目 为了践行 iGEM 所提倡的科学传播与社会责任，也为了摸清普通学生对甲型流感病毒检测技术到底知道多少、又盼着什么，我们走进深圳市第一职业技术学校坪山校区，和一群高二学生做了一次项目科普交流。活动一方面向非专业听众讲清国际基因工程机器大赛（iGEM）的理念和价值，另一方面展示我们的\"基于工程化酵母的甲型流感病毒生物传感器\"项目，让更多年轻学生看到，合成生物学怎样靠跨学科创新去碰现实里的社会问题。 我们分享了什么"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "念和价值，另一方面展示我们的\"基于工程化酵母的甲型流感病毒生物传感器\"项目，让更多年轻学生看到，合成生物学怎样靠跨学科创新去碰现实里的社会问题。 我们分享了什么 从 iGEM 比赛的来由、团队的组建方式，到项目的研究意义、实验原理和往后的应用场景，我们试着打破\"科研只关在实验室里\"的刻板印象，让学生看到：生命科学研究同样离不开编程、设计、传播这些跨领域的本事。 同学们关心什么 学生们站在实际使用者那头，问得很直接：检测设备能不能更便携？出结果能不能更快？这些来自潜在用户的反馈，逼着团队重新去想，传感器在做成产品时，到底该在便捷性、响应速度和场景适配上做到什么程度。 双向学习与成长 对学生来说，这是一次近距离碰合成生物学和科研创新的机"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "，逼着团队重新去想，传感器在做成产品时，到底该在便捷性、响应速度和场景适配上做到什么程度。 双向学习与成长 对学生来说，这是一次近距离碰合成生物学和科研创新的机会；对团队来说，把绕来绕去的生物学原理翻成听得懂的话，也逼着我们自己把项目逻辑再理一遍，反而对技术路线和社会价值想得更透。 Responsible Research and Innovation 这次活动不只是一次项目展示，更是一次双向的学习和沟通。我们越发明白，一个有社会价值的生物技术项目，光靠实验室里的技术突破不够，还得和公众把话讲通、把真实需求听进去，再不断调整。这次实践把项目从单纯的技术研发，推到了更开放、也更负责任的创新路径上，正好呼应了 iGEM 提倡的\"负责任的"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "content": "，还得和公众把话讲通、把真实需求听进去，再不断调整。这次实践把项目从单纯的技术研发，推到了更开放、也更负责任的创新路径上，正好呼应了 iGEM 提倡的\"负责任的研究与创新\"理念。"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/tsinghua/1.webp",
    "content": "清华交流 1"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/tsinghua/2.webp",
    "content": "清华交流 2"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/tsinghua/3.webp",
    "content": "清华交流 3"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/tsinghua/4.webp",
    "content": "清华交流 4"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/tsinghua/5.webp",
    "content": "清华交流 5"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/tsinghua/6.webp",
    "content": "清华交流 6"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/southchina/spark3.jpg",
    "content": "华南交流会现场合影"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/southchina/spark1.jpg",
    "content": "spark1.jpg"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/southchina/spark2.jpg",
    "content": "spark2.jpg"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/southchina/spark4.jpg",
    "content": "spark4.jpg"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/school1.jpg",
    "content": "团队与学生合影"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/school2.jpg",
    "content": "宣讲课堂全景"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/school3.jpg",
    "content": "项目展示讲解"
  },
  {
    "type": "image",
    "pageUrl": "human-practices/integrated human-practices.html",
    "pageTitle": "Human Practices - iGEM SZPU-2026",
    "src": "static/image/HP/school4.jpg",
    "content": "团队科普展示"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/education.html",
    "pageTitle": "Education - iGEM SZPU-2026",
    "content": "教育导航 Human Practices Education Award Overview 目标受众 公众科普 学生群体 专业利益相关方 教育活动与材料 线下活动 线上内容 教学工具包 影响与评估 覆盖人数与反馈 效果评估方法 可持续资源 未来计划 0% 发酵进度 执行摘要：本页面向 iGEM Education Award 要求，系统展示团队围绕 PAGER-Yeast 项目开展的合成生物学教育、科普与公众沟通工作。 Education Award iGEM 高度重视队伍将 synthetic biology 知识传播给不同受众的能力。教育页面需展示团队如何识别目标人群、设计教育活动、评估影响，并确保教育资源的可持续性。 [待补充"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/education.html",
    "pageTitle": "Education - iGEM SZPU-2026",
    "content": "synthetic biology 知识传播给不同受众的能力。教育页面需展示团队如何识别目标人群、设计教育活动、评估影响，并确保教育资源的可持续性。 [待补充：简要说明本队教育工作的核心理念与总体目标。] 执行摘要：概述教育活动的目标、策略及其与项目整体目标的关联。 Overview 教育目标：[待补充：提升公众对合成生物学的理解、培养青少年科学兴趣、促进负责任的科学讨论等] 核心信息：[待补充：希望受众带走的关键信息，例如“合成生物学可用于低成本病原体检测”] 与项目的关联：[待补充：教育内容如何呼应 PAGER-Yeast 的技术路线与社会价值] 合作伙伴：[待补充：学校、社区、博物馆、医院、其他 iGEM 队伍等] [待补充"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/education.html",
    "pageTitle": "Education - iGEM SZPU-2026",
    "content": "联：[待补充：教育内容如何呼应 PAGER-Yeast 的技术路线与社会价值] 合作伙伴：[待补充：学校、社区、博物馆、医院、其他 iGEM 队伍等] [待补充：建议上传教育活动合影或宣传材料照片，尺寸 1200×600px，.webp 格式并压缩至 150KB 以下。] 执行摘要：明确不同教育活动所面向的受众群体及其需求差异。 目标受众 公众科普 [待补充：面向普通公众的内容设计，例如如何解释“抗原门控受体”“酵母生物传感器”等概念。] 学生群体 [待补充：面向中小学生或大学生的活动形式、难度分层与互动设计。] 专业利益相关方 [待补充：面向医护人员、基层检测人员、政策制定者等群体的沟通重点。] 执行摘要：具体列出已开展或计划开展"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/education.html",
    "pageTitle": "Education - iGEM SZPU-2026",
    "content": "学生的活动形式、难度分层与互动设计。] 专业利益相关方 [待补充：面向医护人员、基层检测人员、政策制定者等群体的沟通重点。] 执行摘要：具体列出已开展或计划开展的教育活动、材料与传播渠道。 教育活动与材料 线下活动 [待补充：活动 1，例如校园科普讲座/开放日] [待补充：活动 2，例如社区/医院健康宣教] [待补充：活动 3，例如 workshop 或实验体验营] 线上内容 [待补充：社交媒体推送、科普视频、直播链接] [待补充：微信公众号 / Bilibili / 微博等平台内容规划] 教学工具包 [待补充：是否开发了可复用的课件、手册、模型或实验套件，并提供下载链接。] 执行摘要：展示教育活动的覆盖范围、反馈收集方法与效果评估"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/education.html",
    "pageTitle": "Education - iGEM SZPU-2026",
    "content": "平台内容规划] 教学工具包 [待补充：是否开发了可复用的课件、手册、模型或实验套件，并提供下载链接。] 执行摘要：展示教育活动的覆盖范围、反馈收集方法与效果评估。 影响与评估 覆盖人数与反馈 [待补充：活动参与人数、线上内容浏览量/互动量] [待补充：受众反馈摘要（问卷、访谈、评论）] 效果评估方法 [待补充：采用前测/后测、问卷、访谈、焦点小组等何种方法评估教育效果。] 执行摘要：说明教育资源的可持续性与对外开放方式。 可持续资源 开放获取：[待补充：课件、海报、视频等资源是否开源/可下载] 多语言支持：[待补充：是否提供中英文版本] 长期维护：[待补充：后续是否持续更新内容与回应公众问题] 执行摘要：说明教育工作的后续计划与对"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/education.html",
    "pageTitle": "Education - iGEM SZPU-2026",
    "content": "是否开源/可下载] 多语言支持：[待补充：是否提供中英文版本] 长期维护：[待补充：后续是否持续更新内容与回应公众问题] 执行摘要：说明教育工作的后续计划与对 iGEM 社区的潜在贡献。 未来计划 [待补充：计划开展的后续活动或拓展受众] [待补充：如何与 Integrated Human Practices 页面中的调研结果相互支撑] [待补充：是否计划将教育材料提交至 iGEM 教育资源库或与其他队伍共享]"
  },
  {
    "type": "text",
    "pageUrl": "human-practices/social-groups.html",
    "pageTitle": "Social Groups - iGEM SZPU-2026",
    "content": "社会群体 这里介绍了项目与社会群体的互动，包括社区调研、公众参与等内容。"
  }
];
