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
 *   src   —— PDF 的 https 地址。
 */
window.LogPdfDocs = {
  defaultId: 'wet-lab',
  docs: [
    { id: 'wet-lab', label: 'Wet Lab', title: '', src: '' },
    { id: 'dry-lab', label: 'Dry Lab', title: '', src: '' },
    { id: 'human-practices', label: 'Human Practices', title: '', src: '' },
    { id: 'wiki', label: 'Wiki', title: '', src: '' },
    { id: 'team-management', label: 'Team Management', title: '', src: '' }
  ]
};
