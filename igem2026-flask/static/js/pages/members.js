
(function () {
  'use strict';

  if (!window.iGEMUtils) {
    console.error('[MembersRedesign] 缺少依赖：请先加载 static/js/utils.js');
    return;
  }

  const Utils = window.iGEMUtils;
  const raf = Utils.safeRequestAnimationFrame;

  /**
   * iGEM Layout Strategy: Data-driven rendering keeps member list and detail panel
   * in sync, while grouping by primary role preserves the wet/dry/hp/designer narrative.
   * The selected member's real photo is promoted to a full-bleed background layer
   * with a cross-fade transition, so the story layer can stay frameless.
   */

  /** @typedef {{id:string,name:string,roles:string[],directions:string[],bio:string,photoPosition?:string,photoSize?:string,images?:Object}} Member */

  /**
   * Member data, role constants and grouping logic.
   */
  const MemberData = (function () {
    // 分类顺序即条带分组顺序：指导层（PI → Adviser）置顶，其后是执行层与视觉层。
    const ROLE_ORDER = ['PI', 'Adviser', 'Wet Lab', 'Dry Lab', 'WIKI', 'HP', 'Art', 'Designer'];
    const CLASSIFICATION_ROLES = new Set(ROLE_ORDER);
    const ROLE_COLORS = {
      'PI': '#991B1B',
      'Adviser': '#92400E',
      'Wet Lab': '#1E40AF',
      'Dry Lab': '#065F46',
      'WIKI': '#2563EB',
      'HP': '#9A3412',
      'Art': '#0E7490',
      'Designer': '#7E22CE'
    };

    /* 成员数据：顺序 id → index → name → roles → directions → bio →
       photoPosition → photoSize；组内顺序即数组顺序。index 用于生成 CDN 文件名
       （如 01-xj-photo.webp）。字段含义、标签规则与取景微调方法见 README §5.15。 */
    const members = [
      {
        id: 'xj',
        index: '01',
        name: 'Jie Xia',
        roles: ['Team Leader', 'Wet Lab'],
        directions: ['Comprehensive learner', 'Innovative Explorers'],
        bio: 'As team leader, I hope we can learn and grow through this competition. May we all enjoy the journey, build strong friendships, and achieve great results together!',
        photoPosition: 'center 30%',
        photoSize: '100% auto'
      },
      {
        id: 'gyf',
        index: '02',
        name: 'Yifan Gao',
        roles: ['Wet Lab'],
        directions: ['Idealist'],
        bio: 'From the School of Food and Drug Administration, Class of 2025 Pharmaceutical Engineering. INTP, I enjoy playing badminton, listening to music and playing the guitar. I’m a bit quiet and socially reserved. As a member of the wet lab team, I assist with experiments and support the team’s research.',
        photoPosition: 'center 10%',
        photoSize: '60% auto'
      },
      {
        id: 'lcx',
        index: '03',
        name: 'Chengxi Luo',
        roles: ['Wet Lab', 'Dry Lab', 'HP'],
        directions: ['Bridge Builder', 'Precision Seeker'],
        bio: 'As both wet lab performer and dry lab coordinator of the iGEM team, I build the logistical foundation that turns chaos into order, allowing creativity to flourish and our iGEM dream to become whole.',
        photoPosition: '70% 10%',
        photoSize: '70% auto'
      },
      {
        id: 'sxz',
        index: '04',
        name: 'Xiaozhen Su',
        roles: ['Wet Lab'],
        directions: ['Wet Lab Performer', 'Optimistic Researcher'],
        bio: 'As a wet lab member of the iGEM team, I use experiments to support creativity, strive for goals through collaboration, and witness passion and growth on the competition stage.',
        photoPosition: '55% 10%',
        photoSize: '50% auto'
      },
      {
        id: 'zas',
        index: '05',
        name: 'Aishi Zeng',
        roles: ['Wet Lab'],
        directions: ['Lively', 'Humorous'],
        bio: 'Joining iGEM as a wet lab member can feel a little stressful at times, but I truly believe that with our teachers’ guidance and everyone working together, we’re going to do amazing things. I’m ready to put in 100% effort and fight for our team’s success!',
        photoPosition: '55% 10%',
        photoSize: '60% auto'
      },
      {
        id: 'zyl',
        index: '06',
        name: 'Yuelin Zheng',
        roles: ['Wet Lab'],
        directions: ['Experimental Explorer'],
        bio: 'As a member of the wet lab team, I put my whole heart into every single experiment. I stand side by side with my teammates, grow together through the competition, and go all out to chase for great results!',
        photoPosition: '55% 10%',
        photoSize: '80% auto'
      },
      {
        id: 'xq',
        index: '07',
        name: 'Qi Xu',
        roles: ['Web Developer', 'WIKI'],
        directions: ['Quiet one minute, wild the next'],
        bio: 'As the web developer for our iGEM team, I hope we can work together to build vibrant, engaging web pages that we can all be proud of. Let’s give it our all!',
        photoPosition: '45% 30%',
        photoSize: '60% auto'
      },
      {
        id: 'lyq',
        index: '08',
        name: 'Yuquan Luo',
        roles: ['HP', 'Designer'],
        directions: ['Upper Limb Supremacist', 'Doer'],
        bio: 'I’m into fitness, but I totally skip leg day. I do some cardio occasionally, and I’m obsessed with rice noodles. Here’s to our team marching forward triumphantly — come on, let’s go!',
        photoPosition: '60% 30%',
        photoSize: '60% auto'
      },
      {
        id: 'lr',
        index: '09',
        name: 'Rui Luo',
        roles: ['Dry Lab', 'HP'],
        directions: ['Science Communicator', 'Brand Designer'],
        bio: 'I handle design, writing, and outreach. I aim to make our science clear and engaging. I’m committed to building a strong team brand and supporting every step toward our iGEM success.',
        photoPosition: '60% 30%',
        photoSize: '60% auto'
      },
      {
        id: 'psq',
        index: '10',
        name: 'Siqi Peng',
        roles: ['Art'],
        directions: ['Visual Storyteller', 'Visual Director'],
        bio: 'As a member of the design team of the iGEM group, I use visuals to convey the warmth of scientific research, and with creativity, I build communication bridges. In every layout and picture, I make synthetic biology visible, understandable, and memorable.',
        photoPosition: '60% 30%',
        photoSize: '90% auto'
      },
      {
        id: 'zlz',
        index: '11',
        name: 'Lizhen Zhu',
        roles: ['Adviser'],
        directions: ['Scientific Guidance'],
        bio: 'Adhere to the Scientific Outlook on Development',
        photoPosition: '100% 25%',
        photoSize: '68% auto'
      },
      {
        id: 'zjh',
        index: '12',
        name: 'Jianhua Zhou',
        roles: ['Adviser'],
        directions: ['Scientific Guidance'],
        bio: 'Keep Pushing',
        photoPosition: '100% 15%',
        photoSize: '84% auto'
      },
      // 2026-09-15 新增 PI 两位与 WIKI 两位；2026-09-16 补入 bio（directions 待团队补标签）。
      // 2026-09-21 zjh/tyj/zlj/zlz 四张 _kt 卡通头像到位，统一走默认候选链（<index>-<id>-avatar.webp
      // 优先，缺失时回退 <index>-<id>-photo.webp 本人照片），移除此前为 zlj/tyj 显式指定的头像覆盖。
      // 2026-09-30 与根站对齐：CDN 上 `13-zlj-photo.webp` 是米黄背景版（152,712 B），原始照片被
      // 上传为 `13-zlj-photo-alt.webp`（169,456 B）。根站要的是原始照片，故这里显式给出候选顺序：
      // 原图优先、米黄版兜底。取景同步为 '55% 0%' / '36% auto'（与根站一致）。
      {
        id: 'zlj',
        index: '13',
        name: 'Lijun Zhang',
        roles: ['Primary PI', 'PI'],
        directions: [],
        bio: 'iGEM is far more than a competition, it is a transformative journey on which students explore the boundless possibilities of synthetic biology.',
        photoPosition: '55% 0%',
        photoSize: '36% auto',
        images: {
          photo: {
            candidates: [
              'https://static.igem.wiki/teams/6373/wiki/team/13-zlj-photo-alt.webp',
              'https://static.igem.wiki/teams/6373/wiki/team/13-zlj-photo.webp'
            ]
          }
        }
      },
      {
        id: 'tyj',
        index: '14',
        name: 'Yongjun Tang',
        roles: ['Secondary PI', 'PI'],
        directions: [],
        bio: 'iGEM is never just a competition. It’s a chance to turn curiosity into action, and action into impact. Take it.',
        photoPosition: '100% 10%',
        photoSize: '78% auto'
      },
      {
        id: 'lrx',
        index: '15',
        name: 'Ruoxi Li',
        roles: ['WIKI'],
        directions: [],
        bio: 'Fortune favours the brave',
        photoPosition: '60% 20%',
        photoSize: '60% auto'
      },
      {
        id: 'crq',
        index: '16',
        name: 'Rouqing Chen',
        roles: ['WIKI'],
        directions: [],
        bio: 'I have long admired iGEM. After truly participate in it, I realized that it’s not just a contest, but a journey of refining ideas into reality. It reminds me that true synthetic biology is about perseverance.',
        photoPosition: 'center 34%',
        photoSize: '70% auto'
      }
    ];

    const primaryRoleCache = new Map();
    let cachedGroupedMembers = null;

    /**
     * Determine the first role from ROLE_ORDER that a member holds.
     * @param {Member} member
     * @returns {string}
     */
    function getPrimaryRole(member) {
      if (!member || !Array.isArray(member.roles)) return 'Wet Lab';
      if (primaryRoleCache.has(member)) return primaryRoleCache.get(member);
      for (const role of ROLE_ORDER) {
        if (member.roles.includes(role)) {
          primaryRoleCache.set(member, role);
          return role;
        }
      }
      const fallback = member.roles[0] || 'Wet Lab';
      primaryRoleCache.set(member, fallback);
      return fallback;
    }

    /**
     * Group members by primary role according to ROLE_ORDER.
     * @returns {{role:string,members:Member[]}[]}
     */
    function groupMembers() {
      if (cachedGroupedMembers) return cachedGroupedMembers;
      const groups = {};
      ROLE_ORDER.forEach(role => { groups[role] = []; });
      members.forEach(member => {
        const primary = getPrimaryRole(member);
        if (!groups[primary]) groups[primary] = [];
        groups[primary].push(member);
      });
      cachedGroupedMembers = ROLE_ORDER.map(role => ({ role, members: groups[role] }));
      return cachedGroupedMembers;
    }

    return {
      ROLE_ORDER,
      CLASSIFICATION_ROLES,
      ROLE_COLORS,
      members,
      getPrimaryRole,
      groupMembers
    };
  })();

  /**
   * Image path resolution with templates, brace/wildcard expansion and fallback.
   */
  const ImageResolver = (function () {
    const DEFAULT_PHOTO_POSITION = 'center top';
    const DEFAULT_PHOTO_SIZE = 'cover';

    // 基址 = 队伍实际上传目录 https://static.igem.wiki/teams/6373/wiki/team/。
    // 旧写法 `2026/szpu-china/image/team/webp/` 在 CDN 上一律 403（iGEM 用 403 表示
    // 对象不存在），浏览器里只表现为"图不显示"，所以基址必须按实测结果写死，
    // 不能按根站 static/image/ 的目录结构推算。实测记录见
    // 对话归档/temporary-tools/2026-09/2026-09-30-probe-team-cdn.py（34/34 可达）。
    const IMAGE_PATH_TEMPLATES = {
      photo: {
        template: 'https://static.igem.wiki/teams/6373/wiki/team/${index}-${id}-photo.webp',
        ext: 'webp',
        candidates: ['https://static.igem.wiki/teams/6373/wiki/team/${index}-${id}-photo.webp'],
        wildcardExtensions: ['webp', 'jpg', 'png']
      },
      avatar: {
        template: 'https://static.igem.wiki/teams/6373/wiki/team/${index}-${id}-avatar.webp',
        ext: 'webp',
        candidates: ['https://static.igem.wiki/teams/6373/wiki/team/${index}-${id}-avatar.webp'],
        wildcardExtensions: ['webp', 'jpg', 'png']
      }
    };

    const IMAGE_PATH_MAPPINGS = [
      // Example: { match: { roles: 'Adviser' }, templates: { photo: 'https://static.igem.wiki/teams/6373/wiki/team/adviser-${id}.webp' } }
    ];

    if (typeof window !== 'undefined') {
      window.membersImageFallback = function (img) {
        let candidates = [];
        try {
          candidates = JSON.parse(img.getAttribute('data-candidates') || '[]');
        } catch (e) {
          return;
        }
        if (!candidates.length) return;
        img.src = candidates.shift();
        img.setAttribute('data-candidates', JSON.stringify(candidates));
      };
    }

    function sanitizeImageId(id) {
      if (typeof id !== 'string') return '';
      return id.replace(/[^a-zA-Z0-9_-]/g, '');
    }

    function sanitizePathSegment(value) {
      if (typeof value !== 'string') return '';
      return value.replace(/[^a-zA-Z0-9_\s-]/g, '').trim().replace(/\s+/g, '-');
    }

    /**
     * Expand brace patterns recursively into the Cartesian product of options.
     * @param {string} template
     * @returns {string[]}
     */
    function expandBracePattern(template) {
      if (typeof template !== 'string') return [];
      const match = template.match(/\{([^{}]+)\}/);
      if (!match) return [template];
      const prefix = template.slice(0, match.index);
      const suffix = template.slice(match.index + match[0].length);
      const results = [];
      for (const option of match[1].split(',')) {
        expandBracePattern(prefix + option.trim() + suffix).forEach(t => results.push(t));
      }
      return results;
    }

    /**
     * Expand wildcard extension placeholders into concrete extensions.
     * @param {string} template
     * @param {string[]} extensions
     * @returns {string[]}
     */
    function expandWildcardExtensions(template, extensions) {
      if (typeof template !== 'string') return [];
      if (!template.includes('*')) return [template];
      const exts = Array.isArray(extensions) ? extensions : [];
      if (exts.length === 0) return [template];
      return exts.map(ext => template.replace(/\*/g, String(ext)));
    }

    /**
     * Replace ${key} placeholders with values from vars.
     * @param {string} template
     * @param {Object} vars
     * @returns {string}
     */
    function interpolateTemplate(template, vars) {
      if (typeof template !== 'string') return '';
      return template.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
        return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : '';
      });
    }

    /**
     * Check whether a member satisfies every condition in a mapping match object.
     * @param {Member} member
     * @param {Object} mapping
     * @returns {boolean}
     */
    function matchesMapping(member, mapping) {
      if (!member || !mapping || typeof mapping.match !== 'object' || mapping.match === null) return false;
      const conditions = mapping.match;

      if (conditions.roles !== undefined) {
        const roles = Array.isArray(conditions.roles) ? conditions.roles : [conditions.roles];
        const memberRoles = Array.isArray(member.roles) ? member.roles : [];
        if (!roles.some(role => memberRoles.includes(role))) return false;
      }

      if (conditions.id !== undefined) {
        const id = member.id;
        if (typeof conditions.id === 'string') {
          if (id !== conditions.id) return false;
        } else if (conditions.id instanceof RegExp) {
          if (!conditions.id.test(id)) return false;
        } else if (Array.isArray(conditions.id)) {
          if (!conditions.id.includes(id)) return false;
        } else {
          return false;
        }
      }

      if (conditions.name !== undefined) {
        const memberName = typeof member.name === 'string' ? member.name : '';
        if (typeof conditions.name === 'string') {
          if (memberName !== conditions.name) return false;
        } else if (conditions.name instanceof RegExp) {
          if (!conditions.name.test(memberName)) return false;
        } else if (Array.isArray(conditions.name)) {
          if (!conditions.name.includes(memberName)) return false;
        } else {
          return false;
        }
      }

      if (conditions.flags !== undefined) {
        const memberFlags = Array.isArray(member.flags) ? member.flags : [];
        const flags = Array.isArray(conditions.flags) ? conditions.flags : [conditions.flags];
        if (!flags.some(flag => memberFlags.includes(flag))) return false;
      }

      return true;
    }

    /**
     * Resolve candidate image paths for a member and type in priority order.
     * @param {Member} member
     * @param {string} [type]
     * @returns {string[]}
     */
    function resolveImageCandidates(member, type) {
      const safeType = typeof type === 'string' ? type : 'photo';
      const config = IMAGE_PATH_TEMPLATES[safeType] || IMAGE_PATH_TEMPLATES.photo;

      const vars = {
        id: sanitizeImageId(member && member.id),
        index: sanitizeImageId(member && member.index),
        type: safeType,
        ext: config.ext || 'jpg',
        primaryRole: sanitizePathSegment(MemberData.getPrimaryRole(member))
      };

      if (!vars.id) return [];

      if (member && typeof member.images === 'object' && member.images !== null) {
        const override = member.images[safeType];
        if (typeof override === 'string' && override.length > 0) {
          return [override];
        }
        if (override && typeof override === 'object' && Array.isArray(override.candidates) && override.candidates.length > 0) {
          const perMemberCandidates = [];
          for (const tmpl of override.candidates) {
            const interpolated = interpolateTemplate(tmpl, vars);
            expandBracePattern(interpolated).forEach(braced => {
              expandWildcardExtensions(braced, config.wildcardExtensions).forEach(t => {
                if (t) perMemberCandidates.push(t);
              });
            });
          }
          return perMemberCandidates;
        }
      }

      let mappingTemplate = null;
      for (const mapping of IMAGE_PATH_MAPPINGS) {
        if (matchesMapping(member, mapping) && mapping.templates && typeof mapping.templates === 'object') {
          const template = mapping.templates[safeType];
          if (typeof template === 'string' && template.length > 0) {
            mappingTemplate = template;
            break;
          }
        }
      }

      const baseTemplates = [];
      if (mappingTemplate) {
        baseTemplates.push(mappingTemplate);
      } else if (Array.isArray(config.candidates) && config.candidates.length > 0) {
        baseTemplates.push(...config.candidates);
      } else {
        baseTemplates.push(config.template);
      }

      const candidates = [];
      for (const tmpl of baseTemplates) {
        const interpolated = interpolateTemplate(tmpl, vars);
        expandBracePattern(interpolated).forEach(braced => {
          expandWildcardExtensions(braced, config.wildcardExtensions).forEach(t => {
            if (t) candidates.push(t);
          });
        });
      }

      return candidates;
    }

    /**
     * Return the first candidate path or an empty string.
     * @param {Member} member
     * @param {string} [type]
     * @returns {string}
     */
    function resolveImagePath(member, type) {
      const candidates = resolveImageCandidates(member, type);
      return candidates.length > 0 ? candidates[0] : '';
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    function realPhotoPath(id) {
      return resolveImagePath({ id }, 'photo');
    }

    /**
     * @param {string} id
     * @returns {string}
     */
    function cartoonAvatarPath(id) {
      return resolveImagePath({ id }, 'avatar');
    }

    return {
      DEFAULT_PHOTO_POSITION,
      DEFAULT_PHOTO_SIZE,
      resolveImageCandidates,
      resolveImagePath,
      realPhotoPath,
      cartoonAvatarPath
    };
  })();

  /**
   * Builds the grouped member strip DOM and caches strip elements.
   */
  const Renderer = (function () {
    let stripElements = [];

    /**
     * Escape a string for safe HTML insertion.
     * @param {string} text
     * @returns {string}
     */
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    /**
     * Build a single member strip element.
     * @param {Member} member
     * @param {string} primaryRole
     * @param {Function} onSelect
     * @returns {HTMLElement}
     */
    function buildMemberStrip(member, primaryRole, onSelect) {
      const strip = document.createElement('div');
      strip.className = 'member-strip';
      strip.dataset.id = member.id;
      strip.dataset.role = primaryRole;
      strip.setAttribute('role', 'button');
      strip.setAttribute('tabindex', '0');
      strip.setAttribute('aria-label', `View ${escapeHtml(member.name || '')}'s profile`);

      const avatarCandidates = ImageResolver.resolveImageCandidates(member, 'avatar');
      const avatarSrc = escapeHtml(avatarCandidates[0] || '');
      const avatarFallback = avatarCandidates.length > 1
        ? JSON.stringify(avatarCandidates.slice(1)).replace(/"/g, '&quot;')
        : '[]';
      const safeName = escapeHtml(member.name || '');

      strip.innerHTML = `
        <img class="strip-avatar" src="${avatarSrc}" alt="${safeName}" loading="lazy" data-candidates="${avatarFallback}" onerror="window.membersImageFallback(this)">
        <span class="strip-name">${safeName}</span>
        <span class="ribbon-tail" aria-hidden="true"></span>
      `;

      strip.addEventListener('click', () => onSelect(member.id));
      strip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(member.id);
        }
      });

      return strip;
    }

    /**
     * Render grouped members into the container using DocumentFragments.
     * @param {HTMLElement} container
     * @param {Function} onSelect
     */
    function renderGroups(container, onSelect) {
      const groups = MemberData.groupMembers();
      container.innerHTML = '';
      const groupsFragment = document.createDocumentFragment();
      const strips = [];

      groups.forEach((group, groupIndex) => {
        if (group.members.length === 0) return;

        const groupEl = document.createElement('div');
        groupEl.className = 'strip-group';
        groupEl.dataset.role = group.role;
        if (groupIndex === 0) groupEl.classList.add('is-expanded');

        const header = document.createElement('button');
        header.className = 'group-header';
        header.setAttribute('aria-expanded', groupIndex === 0 ? 'true' : 'false');
        header.innerHTML = `
          <span class="group-title">
            <span class="group-indicator" data-role="${group.role}" aria-hidden="true"></span>
            ${group.role}
            <span class="group-count">${group.members.length}</span>
          </span>
        `;
        header.addEventListener('click', () => {
          const isExpanded = groupEl.classList.toggle('is-expanded');
          header.setAttribute('aria-expanded', String(isExpanded));
        });

        const membersEl = document.createElement('div');
        membersEl.className = 'group-members';
        const membersFragment = document.createDocumentFragment();

        group.members.forEach(member => {
          const strip = buildMemberStrip(member, group.role, onSelect);
          membersFragment.appendChild(strip);
          strips.push(strip);
        });

        membersEl.appendChild(membersFragment);
        groupEl.appendChild(header);
        groupEl.appendChild(membersEl);
        groupsFragment.appendChild(groupEl);
      });

      container.appendChild(groupsFragment);
      stripElements = strips;
    }

    /**
     * @returns {HTMLElement[]}
     */
    function getStrips() {
      return stripElements;
    }

    return { renderGroups, getStrips, escapeHtml };
  })();

  /**
   * Dual-slide background cross-fade with generation guard.
   */
  const BackgroundController = (function () {
    let activeSlide = 'a';
    let generation = 0;
    let lastImg = null;
    let lastSize = null;
    let lastPosition = null;
    let lastDomRefs = null;

    /* 把 "N% auto" 解析为照片相对滑层宽度的百分比 N；cover / 未识别 → null（视为满铺） */
    function parsePhotoSize(str) {
      if (!str) return null;
      const m = /^\s*([\d.]+)%\s+auto\s*$/.exec(str);
      if (m) return parseFloat(m[1]);
      if (/cover/i.test(str)) return null;
      return null;
    }

    /* 把 "X% Y%" / "center top" 等解析为 [X, Y] 百分比（关键字按浏览器规则映射） */
    function parsePhotoPosition(str) {
      const parts = (str || '').trim().split(/\s+/);
      const map = { center: 50, top: 0, bottom: 100, left: 0, right: 100 };
      const x = parts[0], y = parts[1] || 'center';
      const xv = map[x] !== undefined ? map[x] : parseFloat(x);
      const yv = map[y] !== undefined ? map[y] : parseFloat(y);
      return [isNaN(xv) ? 50 : xv, isNaN(yv) ? 50 : yv];
    }

    /* 按照片实际渲染框写入 CSS 变量（.bg-mask 据此做米黄晕影羽化）。
       纯 O(1) 计算 + 一次 CSS 变量写入，不触发强制同步布局，不参与动画。
       缺省（无图 / 滑层尺寸为 0）时退回满铺，不绘制晕影。 */
    function setPhotoBox(img, size, position, domRefs) {
      const layer = domRefs && domRefs.bgLayer;
      if (!layer || !img || !img.naturalWidth) return;
      const rect = layer.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      if (!W || !H) return;

      const N = parsePhotoSize(size);
      let leftPct, rightPct, topPct, bottomPct, fadeX, fadeY;
      if (N === null) {
        leftPct = 0; rightPct = 100; topPct = 0; bottomPct = 100; fadeX = 0; fadeY = 0;
      } else {
        const Xr = parsePhotoPosition(position);
        const w = W * N / 100;
        const h = w * img.naturalHeight / img.naturalWidth;
        const left = (W - w) * (Xr[0] / 100);
        const top = (H - h) * (Xr[1] / 100);
        leftPct = left / W * 100;
        rightPct = (left + w) / W * 100;
        topPct = top / H * 100;
        bottomPct = (top + h) / H * 100;
        const fadePx = Math.min(96, Math.max(24, w * 0.15));
        fadeX = fadePx / W * 100;
        fadeY = fadePx / H * 100;
      }
      const st = layer.style;
      st.setProperty('--photo-left', leftPct + '%');
      st.setProperty('--photo-right', rightPct + '%');
      st.setProperty('--photo-top', topPct + '%');
      st.setProperty('--photo-bottom', bottomPct + '%');
      st.setProperty('--photo-fade-x', fadeX + '%');
      st.setProperty('--photo-fade-y', fadeY + '%');
    }

    /**
     * Preload and display the next background image.
     * @param {string[]} candidates
     * @param {string} [position]
     * @param {string} [size]
     * @param {Object} domRefs
     */
    function updateBackgroundWithCandidates(candidates, position, size, domRefs) {
      const bgLayer = domRefs.bgLayer;
      const slideA = domRefs.slideA;
      const slideB = domRefs.slideB;
      if (!bgLayer || !slideA || !slideB) return;

      const current = activeSlide === 'a' ? slideA : slideB;
      const next = activeSlide === 'a' ? slideB : slideA;
      const bgPosition = position || ImageResolver.DEFAULT_PHOTO_POSITION;
      const bgSize = size || ImageResolver.DEFAULT_PHOTO_SIZE;
      const currentGeneration = ++generation;

      function applyLoaded(path, img) {
        if (currentGeneration !== generation) return;
        const safePath = path
          ? encodeURI(path)
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
          : '';
        next.style.backgroundImage = safePath ? `url('${safePath}')` : '';
        next.style.backgroundPosition = bgPosition;
        next.style.backgroundSize = bgSize;
        next.classList.add('is-active');
        current.classList.remove('is-active');
        activeSlide = activeSlide === 'a' ? 'b' : 'a';
        if (img) {
          lastImg = img;
          lastSize = bgSize;
          lastPosition = bgPosition;
          lastDomRefs = domRefs;
          setPhotoBox(img, bgSize, bgPosition, domRefs);
        }
      }

      function tryCandidate(index) {
        if (currentGeneration !== generation) return;
        if (index >= candidates.length) {
          applyLoaded('');
          return;
        }
        const img = new Image();
        img.onload = () => applyLoaded(candidates[index], img);
        img.onerror = () => tryCandidate(index + 1);
        img.src = candidates[index];
      }

      tryCandidate(0);
    }

    /* 视口变化时重新计算渲染框（照片百分比随滑层尺寸变化），仅 O(1) 计算 */
    function refreshPhotoBox() {
      if (lastImg) setPhotoBox(lastImg, lastSize, lastPosition, lastDomRefs);
    }

    /**
     * Accept a single path or an array of candidate paths.
     * @param {string|string[]} pathOrCandidates
     * @param {string} [position]
     * @param {string} [size]
     * @param {Object} domRefs
     */
    function updateBackground(pathOrCandidates, position, size, domRefs) {
      const candidates = Array.isArray(pathOrCandidates)
        ? pathOrCandidates
        : (typeof pathOrCandidates === 'string' ? [pathOrCandidates] : []);
      updateBackgroundWithCandidates(candidates, position, size, domRefs);
    }

    return { updateBackground, updateBackgroundWithCandidates, refreshPhotoBox };
  })();

  /**
   * Pointer drag-to-dismiss for the bio rail.
   */
  const RailDrag = (function () {
    const DISTANCE_THRESHOLD = 100;
    const VELOCITY_THRESHOLD = 0.6;

    function supportsPointerEvents() {
      return typeof window !== 'undefined' && 'PointerEvent' in window &&
        typeof Element !== 'undefined' && 'setPointerCapture' in Element.prototype;
    }

    /**
     * Bind drag interactions to a rail inner element.
     * @param {HTMLElement} rail
     * @param {HTMLElement} inner
     * @param {{setCollapsed:function(boolean)}} callbacks
     */
    function bind(rail, inner, callbacks) {
      if (!rail || !inner || !supportsPointerEvents()) return;

      let startX = 0;
      let isDragging = false;
      let moveHistory = [];
      let pendingCleanup = null;

      const computeVelocity = () => {
        const now = Date.now();
        const recent = moveHistory.filter(p => now - p.t <= 100);
        if (recent.length < 2) return 0;
        const first = recent[0];
        const last = recent[recent.length - 1];
        const dt = last.t - first.t;
        return dt > 0 ? (last.x - first.x) / dt : 0;
      };

      const onPointerDown = (e) => {
        if (e.button !== 0) return;
        if (!rail.classList.contains('is-visible')) return;
        startX = e.clientX;
        isDragging = true;
        moveHistory = [{ x: startX, t: Date.now() }];
        rail.classList.add('is-dragging');
        inner.setPointerCapture(e.pointerId);
        e.preventDefault();
      };

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        if (moveHistory.length && currentX === moveHistory[moveHistory.length - 1].x) return;
        const deltaX = currentX - startX;
        moveHistory.push({ x: currentX, t: Date.now() });
        if (moveHistory.length > 6) moveHistory.shift();
        inner.style.transform = `translateX(${Math.max(0, deltaX)}px)`;
      };

      const onPointerUp = (e) => {
        if (!isDragging) return;
        isDragging = false;
        inner.releasePointerCapture(e.pointerId);

        const deltaX = e.clientX - startX;
        const velocity = computeVelocity();
        const shouldClose = deltaX > DISTANCE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

        rail.classList.remove('is-dragging');
        callbacks.setCollapsed(shouldClose);

        const targetX = shouldClose ? inner.offsetWidth : 0;
        if (pendingCleanup) {
          inner.removeEventListener('transitionend', pendingCleanup);
          pendingCleanup = null;
        }
        const cleanup = (evt) => {
          if (evt && (evt.target !== inner || evt.propertyName !== 'transform')) return;
          inner.style.transform = '';
          inner.removeEventListener('transitionend', cleanup);
          pendingCleanup = null;
        };
        pendingCleanup = cleanup;
        inner.addEventListener('transitionend', cleanup);
        inner.style.transform = `translateX(${targetX}px)`;
      };

      inner.addEventListener('pointerdown', onPointerDown);
      inner.addEventListener('pointermove', onPointerMove);
      inner.addEventListener('pointerup', onPointerUp);
      inner.addEventListener('pointercancel', onPointerUp);

      return function unbind() {
        inner.removeEventListener('pointerdown', onPointerDown);
        inner.removeEventListener('pointermove', onPointerMove);
        inner.removeEventListener('pointerup', onPointerUp);
        inner.removeEventListener('pointercancel', onPointerUp);
      };
    }

    return { bind };
  })();

  /**
   * Application bootstrap, event binding and selection state.
   */
  const App = (function () {
    /* 必须与 members.css 的堆叠断点(max-width:1099px)一致：> 值为桌面分栏，≤ 值为堆叠布局 */
    const DESKTOP_BREAKPOINT = 1100;

    const domRefs = {
      app: null,
      rail: null,
      railInner: null,
      railToggle: null,
      filler: null,
      bgLayer: null,
      slideA: null,
      slideB: null,
      stripGroups: null,
      stripToggle: null,
      membersStrip: null,
      detailCard: null,
      detailName: null,
      detailRole: null,
      detailRoleTags: null,
      detailDirectionTags: null,
      detailBio: null,
      railName: null,
      railRole: null,
      railRoleTags: null,
      railDirectionTags: null,
      railBio: null
    };

    let selectedId = null;
    let isRailCollapsed = false;
    let cachedScrollbarWidth = null;
    let railResizeObserver = null;
    let railFillerRafId = null;
    let resizeRafId = null;
    let lastWidth = window.innerWidth;

    let resizeHandler = null;
    let orientationchangeHandler = null;
    let scrollHandler = null;
    let stripToggleHandler = null;
    let stripGroupsClickHandler = null;
    let railToggleHandler = null;
    let railDragUnbind = null;

    function measureScrollbarWidth() {
      if (cachedScrollbarWidth !== null) return cachedScrollbarWidth;
      const outer = document.createElement('div');
      outer.style.visibility = 'hidden';
      outer.style.overflow = 'scroll';
      outer.style.width = '100px';
      outer.style.height = '100px';
      outer.style.position = 'absolute';
      outer.style.top = '-9999px';
      document.body.appendChild(outer);

      const inner = document.createElement('div');
      inner.style.width = '100%';
      inner.style.height = '100%';
      outer.appendChild(inner);

      const width = outer.offsetWidth - inner.offsetWidth;
      document.body.removeChild(outer);
      cachedScrollbarWidth = width;
      return width;
    }

    function invalidateScrollbarWidth() {
      cachedScrollbarWidth = null;
    }

    /* 仅把实测滚动条宽度写入 CSS 变量；.rail-edge-filler 的纵向几何已由纯 CSS
       (top:0;bottom:0) 接管，不再需要 JS 回写 top/height，避免展开动画中同步滞后
       造成的右缘短暂脱离视口。 */
    function updateRailEdgeFiller() {
      const scrollbarWidth = measureScrollbarWidth();
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }

    function scheduleRailEdgeFillerUpdate() {
      if (railFillerRafId) return;
      railFillerRafId = raf(() => {
        railFillerRafId = null;
        updateRailEdgeFiller();
      });
    }

    function observeRailContainer() {
      if (railResizeObserver) {
        railResizeObserver.disconnect();
        railResizeObserver = null;
      }
      if (!domRefs.app || typeof ResizeObserver === 'undefined') return;
      railResizeObserver = new ResizeObserver(() => scheduleRailEdgeFillerUpdate());
      railResizeObserver.observe(domRefs.app);
    }

    function setRailCollapsed(collapsed, skipFillerUpdate) {
      if (!domRefs.rail) return;
      if (collapsed) domRefs.rail.classList.remove('is-visible');
      else domRefs.rail.classList.add('is-visible');
      if (domRefs.railToggle) domRefs.railToggle.setAttribute('aria-expanded', String(!collapsed));
      isRailCollapsed = collapsed;
      if (!skipFillerUpdate) updateRailEdgeFiller();
    }

    function openRail() {
      setRailCollapsed(false);
      if (domRefs.railInner) domRefs.railInner.style.transform = '';
    }

    function closeRail() {
      setRailCollapsed(true);
      if (domRefs.railInner) domRefs.railInner.style.transform = '';
    }

    /** 堆叠布局：用实测高度驱动展开动画（CSS 只留兜底上限），详情见 README §5.16 */
    function setStripGroupsExpanded(expanded) {
      const strip = domRefs.membersStrip;
      const groups = domRefs.stripGroups;
      if (!strip || !groups) return;

      if (expanded) {
        /* 折叠态下子元素仍有布局，scrollHeight 即自然高度 */
        groups.style.setProperty('--strip-groups-max', `${groups.scrollHeight}px`);
        strip.classList.add('is-expanded');
      } else {
        strip.classList.remove('is-expanded');
      }

      if (domRefs.stripToggle) {
        domRefs.stripToggle.setAttribute('aria-expanded', String(expanded));
      }
    }

    /** 视口变化或组内折叠后重新测量；切回桌面布局时清理自定义属性 */
    function resyncStripGroupsHeight() {
      const strip = domRefs.membersStrip;
      const groups = domRefs.stripGroups;
      if (!strip || !groups) return;

      if (window.innerWidth > DESKTOP_BREAKPOINT) {
        groups.style.removeProperty('--strip-groups-max');
        strip.classList.remove('is-expanded');
        if (domRefs.stripToggle) domRefs.stripToggle.setAttribute('aria-expanded', 'false');
        return;
      }

      if (!strip.classList.contains('is-expanded')) return;
      const current = parseFloat(groups.style.getPropertyValue('--strip-groups-max'));
      const natural = groups.scrollHeight;
      if (!isFinite(current) || Math.abs(natural - current) > 1) {
        groups.style.setProperty('--strip-groups-max', `${natural}px`);
      }
    }

    /** 堆叠布局下详情卡若完全移出视口则带入，避免"点了没反应"的错觉 */
    function bringDetailIntoView() {
      const card = domRefs.detailCard;
      if (!card || card.hidden) return;
      const rect = card.getBoundingClientRect();
      const viewportH = window.innerHeight || 0;
      if (rect.top >= 0 && rect.top < viewportH) return;
      const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      try {
        card.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      } catch (e) {
        card.scrollIntoView();
      }
    }

    /**
     * Select a member by id and update the UI.
     * @param {string} id
     */
    function selectMember(id) {
      selectedId = id;

      Renderer.getStrips().forEach(strip => {
        strip.classList.toggle('is-selected', strip.dataset.id === id);
      });

      const member = MemberData.members.find(m => m.id === id);
      if (!member) {
        closeRail();
        return;
      }

      if (domRefs.detailCard) {
        domRefs.detailCard.hidden = false;
        domRefs.detailCard.classList.remove('is-animating');
        void domRefs.detailCard.offsetWidth;
        domRefs.detailCard.classList.add('is-animating');
      }

      if (domRefs.detailName) domRefs.detailName.textContent = member.name;
      if (domRefs.detailRole) domRefs.detailRole.style.display = 'none';
      if (domRefs.detailRoleTags) {
        domRefs.detailRoleTags.innerHTML = member.roles
          .filter(role => !MemberData.CLASSIFICATION_ROLES.has(role))
          .map(role => `<span class="detail-tag">${Renderer.escapeHtml(role)}</span>`)
          .join('');
      }
      if (domRefs.detailDirectionTags) {
        domRefs.detailDirectionTags.innerHTML = member.directions
          .map(dir => `<span class="detail-tag">${Renderer.escapeHtml(dir)}</span>`)
          .join('');
      }
      if (domRefs.detailBio) domRefs.detailBio.innerHTML = `<p>${Renderer.escapeHtml(member.bio)}</p>`;

      if (domRefs.railName) domRefs.railName.textContent = member.name;
      if (domRefs.railRole) domRefs.railRole.style.display = 'none';
      if (domRefs.railRoleTags) {
        domRefs.railRoleTags.innerHTML = member.roles
          .filter(role => !MemberData.CLASSIFICATION_ROLES.has(role))
          .map(role => `<span class="rail-tag">${Renderer.escapeHtml(role)}</span>`)
          .join('');
      }
      if (domRefs.railDirectionTags) {
        domRefs.railDirectionTags.innerHTML = member.directions
          .map(dir => `<span class="rail-tag">${Renderer.escapeHtml(dir)}</span>`)
          .join('');
      }
      if (domRefs.railBio) domRefs.railBio.textContent = member.bio;

      /* 桌面布局用右侧信息条承载简介；堆叠布局信息条收起，简介在详情卡内 */
      const stacked = window.innerWidth <= DESKTOP_BREAKPOINT;
      if (stacked) {
        closeRail();
      } else {
        openRail();
      }

      BackgroundController.updateBackground(
        ImageResolver.resolveImageCandidates(member, 'photo'),
        member.photoPosition,
        member.photoSize,
        domRefs
      );

      if (stacked) {
        setStripGroupsExpanded(false);
        bringDetailIntoView();
      }
    }

    function init() {
      destroy();

      domRefs.app = document.getElementById('members-redesign-app');
      domRefs.rail = document.getElementById('bio-rail');
      domRefs.railInner = domRefs.rail ? domRefs.rail.querySelector('.bio-rail-inner') : null;
      domRefs.railToggle = document.getElementById('rail-toggle');
      domRefs.filler = document.getElementById('rail-edge-filler');

      const bgLayer = document.querySelector('.members-bg-layer');
      if (bgLayer) {
        domRefs.bgLayer = bgLayer;
        domRefs.slideA = bgLayer.querySelector('.bg-slide-a');
        domRefs.slideB = bgLayer.querySelector('.bg-slide-b');
      }

      domRefs.stripGroups = document.getElementById('strip-groups');
      domRefs.stripToggle = document.getElementById('strip-toggle');
      domRefs.membersStrip = document.getElementById('members-strip');

      domRefs.detailCard = document.getElementById('detail-card');
      domRefs.detailName = document.getElementById('detail-name');
      domRefs.detailRole = document.getElementById('detail-role');
      domRefs.detailRoleTags = document.getElementById('detail-role-tags');
      domRefs.detailDirectionTags = document.getElementById('detail-direction-tags');
      domRefs.detailBio = document.getElementById('detail-bio');

      domRefs.railName = document.getElementById('rail-name');
      domRefs.railRole = document.getElementById('rail-role');
      domRefs.railRoleTags = document.getElementById('rail-role-tags');
      domRefs.railDirectionTags = document.getElementById('rail-direction-tags');
      domRefs.railBio = document.getElementById('rail-bio');

      if (domRefs.stripGroups) Renderer.renderGroups(domRefs.stripGroups, selectMember);

      if (domRefs.stripToggle && domRefs.membersStrip) {
        stripToggleHandler = function () {
          const willExpand = !domRefs.membersStrip.classList.contains('is-expanded');
          setStripGroupsExpanded(willExpand);
        };
        domRefs.stripToggle.addEventListener('click', stripToggleHandler);
      }

      /* 组内折叠会改变整条列表高度：展开态下重新测量，避免裁掉后面的组 */
      if (domRefs.stripGroups) {
        stripGroupsClickHandler = function (e) {
          const target = e.target;
          if (!target || typeof target.closest !== 'function') return;
          if (!target.closest('.group-header')) return;
          raf(function () { resyncStripGroupsHeight(); });
        };
        domRefs.stripGroups.addEventListener('click', stripGroupsClickHandler);
      }

      if (domRefs.railToggle && domRefs.rail) {
        railToggleHandler = function () { openRail(); };
        domRefs.railToggle.addEventListener('click', railToggleHandler);
      }

      if (domRefs.rail && domRefs.railInner) {
        railDragUnbind = RailDrag.bind(domRefs.rail, domRefs.railInner, {
          setCollapsed: function (collapsed) { setRailCollapsed(collapsed, true); }
        });
      }

      /* 所有断点都默认选中首位成员：桌面端展示其背景与右侧信息条，
         堆叠布局展示 hero 人像与详情卡（此前移动端不选中导致首屏无任何成员内容） */
      if (MemberData.members.length > 0) {
        selectMember(MemberData.members[0].id);
      } else {
        closeRail();
      }

      // 登记首屏关键图给加载遮罩：默认成员形象两种布局都在首屏；条带头像仅桌面端首屏可见
      if (window.PageLoader && typeof window.PageLoader.register === 'function') {
        const critical = [];
        if (MemberData.members.length > 0) {
          critical.push(ImageResolver.resolveImageCandidates(MemberData.members[0], 'photo'));
        }
        if (window.innerWidth > DESKTOP_BREAKPOINT) {
          MemberData.members.slice(0, 6).forEach(function (member) {
            const avatars = ImageResolver.resolveImageCandidates(member, 'avatar');
            if (avatars && avatars.length) critical.push(avatars);
          });
        }
        if (critical.length) window.PageLoader.register(critical);
      }

      function scheduleResizeUpdate() {
        if (resizeRafId) return;
        resizeRafId = raf(function () {
          resizeRafId = null;
          invalidateScrollbarWidth();
          const width = window.innerWidth;
          /* 断点切换：桌面 ↔ 堆叠；同时重新测量条带展开高度 */
          if (domRefs.rail) {
            if (lastWidth > DESKTOP_BREAKPOINT && width <= DESKTOP_BREAKPOINT) {
              closeRail();
            } else if (lastWidth <= DESKTOP_BREAKPOINT && width > DESKTOP_BREAKPOINT && selectedId) {
              openRail();
            }
          }
          lastWidth = width;
          resyncStripGroupsHeight();
          scheduleRailEdgeFillerUpdate();
          BackgroundController.refreshPhotoBox();
        });
      }

      resizeHandler = scheduleResizeUpdate;
      orientationchangeHandler = function () {
        invalidateScrollbarWidth();
        scheduleRailEdgeFillerUpdate();
      };
      scrollHandler = scheduleRailEdgeFillerUpdate;

      window.addEventListener('resize', resizeHandler, { passive: true });
      window.addEventListener('orientationchange', orientationchangeHandler);
      window.addEventListener('scroll', scrollHandler, { passive: true });

      observeRailContainer();
      updateRailEdgeFiller();
    }

    /**
     * 清理所有监听器、Observer、RAF 与 DOM 引用。
     */
    function destroy() {
      if (railResizeObserver) {
        railResizeObserver.disconnect();
        railResizeObserver = null;
      }
      if (railFillerRafId) {
        Utils.safeCancelAnimationFrame(railFillerRafId);
        railFillerRafId = null;
      }
      if (resizeRafId) {
        Utils.safeCancelAnimationFrame(resizeRafId);
        resizeRafId = null;
      }

      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
        resizeHandler = null;
      }
      if (orientationchangeHandler) {
        window.removeEventListener('orientationchange', orientationchangeHandler);
        orientationchangeHandler = null;
      }
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler);
        scrollHandler = null;
      }

      if (stripToggleHandler && domRefs.stripToggle) {
        domRefs.stripToggle.removeEventListener('click', stripToggleHandler);
        stripToggleHandler = null;
      }
      if (stripGroupsClickHandler && domRefs.stripGroups) {
        domRefs.stripGroups.removeEventListener('click', stripGroupsClickHandler);
        stripGroupsClickHandler = null;
      }
      if (railToggleHandler && domRefs.railToggle) {
        domRefs.railToggle.removeEventListener('click', railToggleHandler);
        railToggleHandler = null;
      }

      if (railDragUnbind) {
        railDragUnbind();
        railDragUnbind = null;
      }

      Object.keys(domRefs).forEach(function (key) { domRefs[key] = null; });
      selectedId = null;
      isRailCollapsed = false;
      cachedScrollbarWidth = null;
      lastWidth = window.innerWidth;
    }

    return { init, selectMember, destroy };
  })();

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', App.init);
    } else {
      App.init();
    }
  }
})();
