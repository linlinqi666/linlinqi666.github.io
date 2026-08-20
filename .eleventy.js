/**
 * Eleventy 配置（根站静态生成 / 模板化）
 *
 * 设计目标（见 OPERATION_PLAN_root_static_refactor.md）：
 * - 引入已在 package.json 声明并安装的 @11ty/eleventy 作为构建层；
 * - 单一事实源放在 src/_includes/（layouts + partials），消除 18 个页面各自
 *   全量复制的 <head> / 导航 / 页脚；
 * - 构建产物回写根目录原路径，保持部署目录结构不变（Frozen-Flask 兼容理念）；
 * - clean:false 保证非破坏性：不删除根目录任何既有文件。
 */

module.exports = function (eleventyConfig) {
  // 注：不启用 addPassthroughCopy。static/ 已作为源文件提交在仓库根目录，
  // 构建产物（output: "."）直接复用根目录下的 static/，无需复制；clean:false
  // 保证非破坏性，绝不删除根目录任何既有文件。

  // 搜索功能（nav-search 标记已保留在 nav.njk）：索引由
  // static/js/core/search-index-generator.js 生成、样式补 search.css（见重构计划阶段 5）。

  return {
    dir: {
      input: "src",
      output: ".", // 产物回写根目录，部署路径不变
      includes: "_includes",
    },
    clean: false, // 非破坏：绝不删除根目录既有文件
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "html", "md"],
  };
};
