/**
 * 一次性迁移脚本：将根站 18 个手写 HTML 页面转换为 Eleventy 内容型 .njk。
 *
 * 转换策略（保证视觉等价）：
 * - 抽取 <head> 中的 title / meta description / 页级 CSS（排除标准集）/ 页级 JS（排除核心集）；
 * - 抽取 <main> 内部 HTML 作为页面正文（index.html 的页脚位于 <main> 内，一并保留；
 *   index 通过 front matter footer:false 关闭 footer 局部，避免重复）；
 * - 抽取无 src 的内联 <script> 放入 {% block scripts %}；
 * - 通过 front matter 声明 basePath / lang / htmlClass / bodyClass / mainClass / footer 等，
 *   由 src/_includes 单一事实源（base.njk + partials）统一渲染 <head>/导航/页脚/核心脚本。
 *
 * 运行：node tools/migrate-to-njk.js
 * 之后执行：npm run build （产物回写根目录，clean:false 非破坏）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..').replace(/[\\/]$/, '');

// 清空 head-extra 生成目录，避免残留带脚本的旧 partial（脚本现统一由 base.njk 加载）
const HEAD_EXTRA_DIR = path.join(ROOT, 'src/_includes/head-extra');
if (fs.existsSync(HEAD_EXTRA_DIR)) {
  fs.rmSync(HEAD_EXTRA_DIR, { recursive: true, force: true });
}

// 每页差异配置；css/js/title/description 由脚本自动抽取
const PAGES = [
  { in: 'index.html', out: 'src/index.njk', basePath: '', footer: false, htmlClass: 'home-scroll-snap', bodyClass: 'home-page', mainClass: 'long-page', lang: 'zh-CN' },
  { in: 'project/description.html', out: 'src/project/description.njk', basePath: '../', lang: 'en', footerBg: false },
  { in: 'project/design.html', out: 'src/project/design.njk', basePath: '../', lang: 'en' },
  { in: 'project/engineering.html', out: 'src/project/engineering.njk', basePath: '../', lang: 'zh-CN' },
  { in: 'project/log.html', out: 'src/project/log.njk', basePath: '../', mainClass: 'log-container', lang: 'zh-CN' },
  { in: 'project/contribution.html', out: 'src/project/contribution.njk', basePath: '../', lang: 'zh-CN' },
  { in: 'team/members.html', out: 'src/team/members.njk', basePath: '../', lang: 'en' },
  { in: 'team/attributions.html', out: 'src/team/attributions.njk', basePath: '../', mainClass: 'attributions-main', lang: 'en' },
  { in: 'human-practices/integrated human-practices.html', out: 'src/human-practices/integrated human-practices.njk', basePath: '../', lang: 'zh-CN' },
  { in: 'human-practices/education.html', out: 'src/human-practices/education.njk', basePath: '../', lang: 'en' },
  { in: 'human-practices/social-groups.html', out: 'src/human-practices/social-groups.njk', basePath: '../', lang: 'en' },
  { in: 'dry-lab/software.html', out: 'src/dry-lab/software.njk', basePath: '../', lang: 'en' },
  { in: 'dry-lab/model.html', out: 'src/dry-lab/model.njk', basePath: '../', lang: 'en' },
  { in: 'dry-lab/hardware.html', out: 'src/dry-lab/hardware.njk', basePath: '../', lang: 'en' },
  { in: 'wet-lab/experiments.html', out: 'src/wet-lab/experiments.njk', basePath: '../', lang: 'en', footerBg: false },
  { in: 'wet-lab/result.html', out: 'src/wet-lab/result.njk', basePath: '../', lang: 'zh-CN' },
  { in: 'wet-lab/parts.html', out: 'src/wet-lab/parts.njk', basePath: '../', lang: 'en' },
  { in: 'wet-lab/safety.html', out: 'src/wet-lab/safety.njk', basePath: '../', lang: 'en' },
];

const STANDARD_CSS = new Set([
  'static/iconfont/iconfont.css',
  'static/css/navigation/navigation.css',
  'static/css/index.css',
  'static/css/components/page-progress-bar.css',
  'static/css/components/scroll-progress-bar.css',
  'static/css/mobile.css',
]);

const CORE_JS = new Set([
  'static/js/core/utils.js',
  'static/js/core/mobile-menu.js',
  'static/js/core/nav-scroll-behavior.js',
  'static/js/core/page-progress-bar.js',
  'static/js/core/scroll-progress-bar.js',
  'static/js/core/search-index.js',
  'static/js/core/search.js',
]);

function normalize(href) {
  // 子页面用 ../static/...；统一规整为根相对路径（front matter 再按 basePath 加前缀）
  return href.replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');
}

function extract(html) {
  const titleM = html.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleM ? titleM[1].trim() : '';

  const descM = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const description = descM ? descM[1] : '';

  const css = [];
  const linkRe = /<link\b[^>]*\brel=["']stylesheet["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = linkRe.exec(html))) {
    const norm = normalize(m[1]);
    if (!STANDARD_CSS.has(norm)) css.push(norm);
  }

  const js = [];
  const inline = [];
  const scriptRe = /<script\b[^>]*>[\s\S]*?<\/script>/gi;
  while ((m = scriptRe.exec(html))) {
    const tag = m[0];
    const srcM = tag.match(/\bsrc=["']([^"']+)["']/i);
    if (srcM) {
      const norm = normalize(srcM[1]);
      if (!CORE_JS.has(norm)) js.push(norm);
    } else {
      const inner = tag.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '');
      if (inner.trim()) inline.push(inner.trim());
    }
  }

  const mainM = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const main = mainM ? mainM[1].trim() : '';

  // 抽取 <head> 内、但 head.njk 标准集未覆盖的额外内容（额外 meta、
  // preconnect/preload/dns-prefetch、内联 <style>（含 <noscript> 包裹的回退样式）等），
  // 避免迁移时静默丢失导致视觉/功能回退。
  let headExtra = '';
  const headM = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headM) {
    let hi = headM[1];
    hi = hi.replace(/<title>[\s\S]*?<\/title>/gi, '');
    hi = hi.replace(/<meta[^>]*\bcharset[^>]*>/gi, '');
    hi = hi.replace(/<meta[^>]*\bname="viewport"[^>]*>/gi, '');
    hi = hi.replace(/<meta[^>]*\bname="description"[^>]*>/gi, '');
    hi = hi.replace(/<meta[^>]*\bname="author"[^>]*>/gi, '');
    hi = hi.replace(/<meta[^>]*\bname="theme-color"[^>]*>/gi, '');
    hi = hi.replace(/<meta[^>]*\bname="msapplication-TileColor"[^>]*>/gi, '');
    hi = hi.replace(/<link[^>]*\brel="stylesheet"[^>]*>/gi, '');
    // 脚本（含旧 normalize-scripts 注入的“标准化脚本”块）一律不进 head 额外内容，
    // 统一由 base.njk 末尾加载，避免重复加载与顺序冲突。
    hi = hi.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    hi = hi.replace(/<!--\s*标准化脚本[\s\S]*?-->/gi, '');
    headExtra = hi.trim();
  }

  return { title, description, css, js, inline, main, headExtra };
}

function yml(v) {
  return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function frontMatter(p, ex) {
  const lines = ['---'];
  // 显式 permalink，强制输出为扁平 .html（与原始部署路径一致，覆盖 Eleventy 默认的目录式 /index.html）
  lines.push('permalink: ' + yml(p.in));
  if (ex.title) lines.push('title: ' + yml(ex.title));
  if (ex.description) lines.push('description: ' + yml(ex.description));
  if (p.lang) lines.push('lang: ' + yml(p.lang));
  if (p.htmlClass) lines.push('htmlClass: ' + yml(p.htmlClass));
  if (typeof p.footer === 'boolean') lines.push('footer: ' + p.footer);
  if (typeof p.footerBg === 'boolean') lines.push('footerBg: ' + p.footerBg);
  if (p._headExtraPartial) lines.push('headExtraPartial: ' + yml(p._headExtraPartial));
  if (p.bodyClass) lines.push('bodyClass: ' + yml(p.bodyClass));
  if (p.mainClass) lines.push('mainClass: ' + yml(p.mainClass));
  if (p.basePath) lines.push('basePath: ' + yml(p.basePath));
  if (ex.css.length) {
    lines.push('css:');
    ex.css.forEach((c) => lines.push('  - ' + c));
  }
  if (ex.js.length) {
    lines.push('js:');
    ex.js.forEach((j) => lines.push('  - ' + j));
  }
  lines.push('---');
  return lines.join('\n');
}

function main() {
  let count = 0;
  for (const p of PAGES) {
    // 始终从备份（原始手写版本）抽取，避免反复迁移时读到已被上一轮生成的干净版本
    const html = fs.readFileSync(path.join(ROOT, '对话归档', 'backups', 'backup-pre-refactor', p.in), 'utf8');
    const ex = extract(html);

    // 将 <head> 内额外内容（内联 style/noscript/preconnect 等）写入独立 partial，
    // 再由 head.njk 通过 front matter 的 headExtraPartial 条件 include，避免 YAML 转义问题且保持可读。
    if (ex.headExtra) {
      const slug = p.in.replace(/[\\/]/g, '-').replace(/\s+/g, '-').replace(/\.html$/, '');
      const partialRel = 'head-extra/' + slug + '.njk';
      const partialAbs = path.join(ROOT, 'src/_includes', partialRel);
      fs.mkdirSync(path.dirname(partialAbs), { recursive: true });
      fs.writeFileSync(partialAbs, ex.headExtra + '\n', 'utf8');
      p._headExtraPartial = partialRel;
    }

    let out = frontMatter(p, ex) + '\n\n';
    out += '{% extends "layouts/base.njk" %}\n\n';
    out += '{% block main %}\n' + ex.main + '\n{% endblock %}\n';
    if (ex.inline.length) {
      out += '\n{% block scripts %}\n';
      ex.inline.forEach((s) => {
        out += '<script>\n' + s + '\n</script>\n';
      });
      out += '{% endblock %}\n';
    }

    const outPath = path.join(ROOT, p.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, out, 'utf8');
    count++;
    console.log(
      `migrated ${p.in} -> ${p.out} | css:${ex.css.length} js:${ex.js.length} inline:${ex.inline.length} main:${ex.main.length}ch`
    );
  }
  console.log(`Done. Migrated ${count} pages.`);
}

main();
