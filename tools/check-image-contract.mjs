#!/usr/bin/env node
/**
 * 图片契约构建期校验
 *
 * 只读 src/**\/*.njk 的静态文本，不产出、不修改、不拦截任何资源——运行时零参与，
 * 因此**不可能导致任何图片加载不出来**。它要防的是「模板里漏写属性，把问题带到线上」。
 *
 * 规则（error 会让构建失败）：
 *   E1  <img> 缺 width 或 height，且未标 data-allow-no-dims
 *   E2  data-tier 取值不在 l0 / l1 / l2 之内
 *
 * 警告（只打印，不失败）：
 *   W1  单图文件 > 3 MB（本项目不许转码，只提示）
 *   W2  单页 data-tier="l0" 超过 6 张（进页闸门会因此变慢）
 *
 * 存量豁免：tools/image-contract-baseline.json 里列出的「违规指纹」不再报错，
 * 这样一次改造不会把现有页面全部卡死；新增违规才失败。指纹格式：
 *   "<相对模板路径>#<行号>#<规则>"
 *
 * 用法：
 *   node tools/check-image-contract.mjs            校验
 *   node tools/check-image-contract.mjs --update-baseline   把当前违规写成基线
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const BASELINE = path.join(ROOT, 'tools', 'image-contract-baseline.json');
const L0_MAX = 6;
const BIG_BYTES = 3 * 1024 * 1024;
const TIERS = new Set(['l0', 'l1', 'l2']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.njk')) out.push(full);
  }
  return out;
}

function lineOf(text, index) {
  let n = 1;
  for (let i = 0; i < index; i++) if (text[i] === '\n') n += 1;
  return n;
}

const errors = [];
const warnings = [];

/* 注释与 <script>/<style> 里出现的 "<img ...>" 不是真实元素（模板说明文字里就有），
   直接挖掉再扫，避免误报。用等长空白替换以保持行号不变。 */
function maskNonMarkup(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<script\b[\s\S]*?<\/script>/gi, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/<style\b[\s\S]*?<\/style>/gi, (m) => m.replace(/[^\n]/g, ' '));
}

for (const file of walk(SRC)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const text = maskNonMarkup(fs.readFileSync(file, 'utf8'));
  const tags = [...text.matchAll(/<img\b[\s\S]*?>/g)];
  let l0 = 0;

  for (const m of tags) {
    const tag = m[0];
    const line = lineOf(text, m.index);
    const key = `${rel}#${line}`;

    const hasW = /\swidth="/.test(tag);
    const hasH = /\sheight="/.test(tag);
    const allow = /data-allow-no-dims/.test(tag);
    if ((!hasW || !hasH) && !allow) {
      errors.push({ rule: 'E1', key, text: `${key} 缺 ${!hasW ? 'width' : 'height'}` });
    }

    const tier = tag.match(/data-tier="([^"]*)"/);
    if (tier && !TIERS.has(tier[1])) {
      errors.push({ rule: 'E2', key, text: `${key} data-tier="${tier[1]}" 非法（只允许 l0/l1/l2）` });
    }
    if (tier && tier[1] === 'l0') l0 += 1;

    const src = tag.match(/\bsrc="([^"]+)"/);
    if (src && !/^(https?:)?\/\//.test(src[1])) {
      const abs = path.join(ROOT, src[1].replace(/^\.?\//, ''));
      if (fs.existsSync(abs)) {
        const size = fs.statSync(abs).size;
        if (size > BIG_BYTES) {
          warnings.push(`W1 ${path.basename(abs)} ${(size / 1048576).toFixed(1)} MB（> 3 MB）`);
        }
      }
    }
  }

  if (l0 > L0_MAX) {
    warnings.push(`W2 ${rel} 有 ${l0} 张 l0（> ${L0_MAX}），进页闸门会变慢`);
  }
}

const updateBaseline = process.argv.includes('--update-baseline');
if (updateBaseline) {
  fs.writeFileSync(BASELINE, JSON.stringify({ keys: errors.map((e) => e.key) }, null, 1) + '\n', 'utf8');
  console.log(`基线已更新：${errors.length} 条`, JSON.stringify(errors.slice(0, 3).map((e) => e.text)));
  process.exit(0);
}

let baseline = { keys: [] };
if (fs.existsSync(BASELINE)) {
  try {
    baseline = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
  } catch (e) {
    console.warn('基线文件解析失败，按空基线处理');
  }
}
const known = new Set(baseline.keys || []);
const fresh = errors.filter((e) => !known.has(e.key));
const grandfathered = errors.length - fresh.length;

for (const w of warnings) console.log('  ⚠ ' + w);

if (grandfathered) {
  console.log(`  · 存量豁免 ${grandfathered} 条（见 tools/image-contract-baseline.json）`);
}

if (fresh.length) {
  console.error(`\n图片契约校验失败：${fresh.length} 条新增违规`);
  for (const e of fresh.slice(0, 20)) console.error('  ✗ ' + e.text);
  console.error('\n修复方式：给 <img> 补 width/height（真实像素），或加 data-tier="l0|l1|l2"。');
  process.exit(1);
}

console.log(`图片契约通过：无新增违规（存量 ${grandfathered} 条已豁免，警告 ${warnings.length} 条）`);
