/**
 * 日志页文档清单（唯一需要随 PDF 变更的文件）。
 *
 * 使用方式：
 *   1. 将 PDF 上传至 CDN（iGEM 工程为 static.igem.wiki），取得 https 地址。
 *   2. 把地址填入对应条目的 src，并把 title 改成实际文档标题。
 *   3. src 留空时，阅读区显示「文档待上传」占位，不会发起任何请求。
 *
 * 字段说明：
 *   id    —— 与侧边栏 a.nav-main-link 的 href="#id" 对应，不要随意更改。
 *   label —— 侧边栏显示名称。
 *   title —— 阅读区标题（缺省时回退为 label）。
 *   desc  —— 该模块的实验记录概述，支持 <i> 标记；留空则不显示。
 *   src   —— PDF 的地址（线上为 https 地址）。
 */
window.LogPdfDocs = {
  defaultId: 'chassis-engineering',
  docs: [
    {
      id: 'chassis-engineering',
      label: 'Chassis Engineering',
      title: 'Notebook - Construction of the FAR1SST2 Knockout Yeast Strain',
      desc: 'This notebook records wet-lab procedures for chassis optimization of our yeast biosensor. We performed CRISPR-Cas9-mediated knockout of endogenous FAR1 and SST2 in <i>Saccharomyces cerevisiae</i> BY4741, aiming to eliminate cell-cycle arrest and G-protein-signaling negative feedback, so as to improve signal sensitivity for our downstream PAGER antigen-gated receptor system.',
      src: '../static/pdf/notebook/Notebook -Construction of the FAR1SST2 Knockout Yeast Strain(1).pdf'
    },
    {
      id: 'humanized-g-protein-chimera',
      label: 'Humanized G-Protein Chimera',
      title: '',
      desc: '',
      src: ''
    },
    {
      id: 'pager-fusion-receptor',
      label: 'PAGER Fusion Receptor',
      title: '',
      desc: '',
      src: ''
    },
    {
      id: 'reporter-module',
      label: 'Reporter Module',
      title: '',
      desc: '',
      src: ''
    }
  ]
};
