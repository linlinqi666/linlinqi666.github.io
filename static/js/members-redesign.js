(function () {
  'use strict';

  // iGEM Layout Strategy: Data-driven rendering keeps member list and detail panel
  // in sync, while grouping by primary role preserves the wet/dry/hp/designer narrative.
  // The selected member's real photo is promoted to a full-bleed background layer
  // with a cross-fade transition, so the story layer can stay frameless.

  const ROLE_ORDER = ['Wet Lab', 'Dry Lab', 'WIKI', 'HP', 'Designer', 'Adviser'];

  // Roles used for left-hand grouping; these are not shown as personalized
  // tags in the right-hand detail panel.
  const CLASSIFICATION_ROLES = new Set(ROLE_ORDER);
  const ROLE_COLORS = {
    'Wet Lab': '#1E40AF',
    'Dry Lab': '#065F46',
    'WIKI': '#2563EB',
    'HP': '#9A3412',
    'Designer': '#7E22CE',
    'Adviser': '#92400E'
  };

  const members = [
    {
      id: 'xj',
      name: 'Jie Xia',
      roles: ['Team Leader', 'Wet Lab'],
      directions: ['Comprehensive learner', 'Innovative Explorers'],
      bio: 'As team leader, I hope we can learn and grow through this competition. May we all enjoy the journey, build strong friendships, and achieve great results together!',
      photoPosition: 'center 30%',
      photoSize: '100% auto'
    },
    {
      id: 'gyf',
      name: 'Yifan Gao',
      roles: ['Wet Lab'],
      directions: ['Idealist'],
      bio: 'From the School of Food and Drug Administration, Class of 2025 Pharmaceutical Engineering. INTP, I enjoy playing badminton, listening to music and playing the guitar. I’m a bit quiet and socially reserved. As a member of the wet lab team, I assist with experiments and support the team’s research.',
      photoPosition: 'center 10%',
      photoSize: '60% auto'
    },
    {
      id: 'lcx',
      name: 'Chengxi Luo',
      roles: ['Wet Lab', 'Dry Lab', 'HP'],
      directions: ['Bridge Builder', 'Precision Seeker'],
      bio: 'As both wet lab performer and dry lab coordinator of the iGEM team, I build the logistical foundation that turns chaos into order, allowing creativity to flourish and our iGEM dream to become whole.',
      photoPosition: '70% 10%',
      photoSize: '70% auto'
    },
    {
      id: 'sxz',
      name: 'Xiaozhen Su',
      roles: ['Wet Lab'],
      directions: ['Wet Lab Performer', 'Optimistic Researcher'],
      bio: 'As a wet lab member of the iGEM team, I use experiments to support creativity, strive for goals through collaboration, and witness passion and growth on the competition stage.',
      photoPosition: '55% 10%',
      photoSize: '50% auto'
    },
    {
      id: 'zas',
      name: 'Aishi Zeng',
      roles: ['Wet Lab'],
      directions: ['Lively', 'Humorous'],
      bio: 'Joining iGEM as a wet lab member can feel a little stressful at times, but I truly believe that with our teachers’ guidance and everyone working together, we’re going to do amazing things. I’m ready to put in 100% effort and fight for our team’s success!',
      photoPosition: '55% 10%',
      photoSize: '60% auto'
    },
    {
      id: 'zyl',
      name: 'Yuelin Zheng',
      roles: ['Wet Lab'],
      directions: ['Experimental Explorer'],
      bio: 'As a member of the wet lab team, I put my whole heart into every single experiment. I stand side by side with my teammates, grow together through the competition, and go all out to chase for great results!',
      photoPosition: '55% 10%',
      photoSize: '80% auto'
    },
    {
      id: 'xq',
      name: 'Qi Xu',
      roles: ['Web Developer', 'WIKI'],
      directions: ['Quiet one minute, wild the next'],
      bio: 'As the web developer for our iGEM team, I hope we can work together to build vibrant, engaging web pages that we can all be proud of. Let’s give it our all!',
      photoPosition: '45% 30%',
      photoSize: '60% auto'
    },
    {
      id: 'lyq',
      name: 'Yuquan Luo',
      roles: ['Dry Lab', 'HP'],
      directions: ['Upper Limb Supremacist', 'Doer'],
      bio: 'I’m into fitness, but I totally skip leg day. I do some cardio occasionally, and I’m obsessed with rice noodles. Here’s to our team marching forward triumphantly — come on, let’s go!',
      photoPosition: '60% 30%',
      photoSize: '60% auto'
    },
    {
      id: 'lr',
      name: 'Rui Luo',
      roles: ['HP', 'Designer'],
      directions: ['Science Communicator', 'Brand Designer'],
      bio: 'I handle design, writing, and outreach. I aim to make our science clear and engaging. I’m committed to building a strong team brand and supporting every step toward our iGEM success.',
      photoPosition: '60% 30%',
      photoSize: '60% auto'
    },
    {
      id: 'psq',
      name: 'Siqi Peng',
      roles: ['HP', 'Designer'],
      directions: ['Visual Storyteller', 'Visual Director'],
      bio: 'As a member of the design team of the iGEM group, I use visuals to convey the warmth of scientific research, and with creativity, I build communication bridges. In every layout and picture, I make synthetic biology visible, understandable, and memorable.',
      photoPosition: '60% 30%',
      photoSize: '90% auto'
    },
    {
      id: 'zlz',
      name: 'Lizhen Zhu',
      roles: ['Adviser'],
      directions: ['Scientific Guidance'],
      bio: 'Adhere to the Scientific Outlook on Development',
      photoPosition: 'center top',
      photoSize: 'cover'
    },
    {
      id: 'zjh',
      name: 'Jianhua Zhou',
      roles: ['Adviser'],
      directions: ['Scientific Guidance'],
      bio: 'Keep Pushing',
      photoPosition: 'center top',
      photoSize: 'cover'
    }
  ];

  // Image path helpers: real photos are .jpg; cartoon avatars prefer _kt.jpg.
  const DEFAULT_PHOTO_POSITION = 'center top';
  const DEFAULT_PHOTO_SIZE = 'cover';

  // iGEM Layout Strategy: Centralized path templates let us swap formats
  // (e.g. webp) or directories without touching rendering code, while still
  // defaulting to the legacy {id}.jpg / {id}_kt.jpg layout.
  const IMAGE_PATH_TEMPLATES = {
    photo: {
      template: '../static/image/character/${id}.jpg',
      ext: 'jpg',
      candidates: ['../static/image/character/${id}.jpg', '../static/image/character/${id}.webp'],
      wildcardExtensions: ['jpg', 'webp', 'png']
    },
    avatar: {
      template: '../static/image/character/${id}_kt.jpg',
      ext: 'jpg',
      candidates: ['../static/image/character/${id}_kt.jpg', '../static/image/character/${id}_kt.png'],
      wildcardExtensions: ['jpg', 'webp', 'png']
    }
  };

  // Role- or id-based path overrides. Empty by default so it has no effect
  // unless the team configures explicit mappings.
  const IMAGE_PATH_MAPPINGS = [
    // Example (commented out): { match: { roles: 'Adviser' }, templates: { photo: '../static/image/adviser/${id}.jpg', avatar: '../static/image/adviser/${id}_kt.jpg' } }
  ];

  // Browser-level fallback: try the next candidate when an image fails to load.
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

  // Keep only basic safe characters in member ids so interpolated paths cannot
  // traverse outside the intended asset directory.
  function sanitizeImageId(id) {
    if (typeof id !== 'string') return '';
    return id.replace(/[^a-zA-Z0-9_-]/g, '');
  }

  // Sanitize role names and other path segments; spaces are allowed for
  // directory-style variables such as ${primaryRole}.
  function sanitizePathSegment(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/[^a-zA-Z0-9_\s-]/g, '').trim().replace(/\s+/g, '-');
  }

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

  // Expand brace patterns like '../path/${id}.{jpg,png,webp}' into an array
  // of fully expanded templates. The expansion is recursive, so templates with
  // multiple brace groups (e.g. '${id}_{size}.{jpg,png}') resolve to the
  // Cartesian product of all groups.
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

  // Expand a single template containing '*' into one template per configured
  // extension. If the template has no wildcard, it is returned unchanged so
  // existing templates keep their exact behavior.
  function expandWildcardExtensions(template, extensions) {
    if (typeof template !== 'string') return [];
    if (!template.includes('*')) return [template];
    const exts = Array.isArray(extensions) ? extensions : [];
    if (exts.length === 0) return [template];
    return exts.map(ext => template.replace(/\*/g, String(ext)));
  }

  // Replace ${key} placeholders with values from the vars object.
  function interpolateTemplate(template, vars) {
    if (typeof template !== 'string') return '';
    return template.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
      return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : '';
    });
  }

  // Check whether a member satisfies every condition in mapping.match.
  // Supports roles, id, name and flags; all present conditions must match.
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

  // Resolve the full list of candidate image paths for a member and type,
  // in priority order. Supports per-member overrides, role/id/name/flags
  // mappings, recursive brace expansion, wildcard extension expansion, and
  // template interpolation.
  function resolveImageCandidates(member, type) {
    const safeType = typeof type === 'string' ? type : 'photo';
    const config = IMAGE_PATH_TEMPLATES[safeType] || IMAGE_PATH_TEMPLATES.photo;

    const vars = {
      id: sanitizeImageId(member && member.id),
      type: safeType,
      ext: config.ext || 'jpg',
      primaryRole: sanitizePathSegment(getPrimaryRole(member))
    };

    // A member without a valid id cannot produce a meaningful asset path.
    if (!vars.id) return [];

    // 1. Per-member string override takes precedence.
    if (member && typeof member.images === 'object' && member.images !== null) {
      const override = member.images[safeType];
      if (typeof override === 'string' && override.length > 0) {
        return [override];
      }

      // 2. Per-member candidate list.
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

    // 3. Find the first matching path mapping.
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

    // 4. Build base templates from mapping, config candidates, or config template.
    const baseTemplates = [];
    if (mappingTemplate) {
      baseTemplates.push(mappingTemplate);
    } else if (Array.isArray(config.candidates) && config.candidates.length > 0) {
      baseTemplates.push(...config.candidates);
    } else {
      baseTemplates.push(config.template);
    }

    // 5. Resolve variables first, then expand brace patterns, then expand
    // wildcard extensions so templates like '${id}.*' and
    // '${id}_{size}.{jpg,png}' both resolve correctly.
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

  // Keep for backward compatibility; returns the first candidate or empty string.
  function resolveImagePath(member, type) {
    const candidates = resolveImageCandidates(member, type);
    return candidates.length > 0 ? candidates[0] : '';
  }

  // Kept for backward compatibility; new code should use resolveImagePath().
  function realPhotoPath(id) {
    return resolveImagePath({ id }, 'photo');
  }

  function cartoonAvatarPath(id) {
    return resolveImagePath({ id }, 'avatar');
  }

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

  let selectedId = null;
  let activeBackgroundSlide = 'a';
  let isRailCollapsed = false;
  let railFillerRafId = null;
  let backgroundGeneration = 0;

  const DESKTOP_BREAKPOINT = 1024;
  let cachedScrollbarWidth = null;
  let railResizeObserver = null;
  let cachedGroupedMembers = null;
  const primaryRoleCache = new Map();
  let lastRailRect = null;
  let resizeRafId = null;

  // Cached DOM references populated during init to avoid repeated queries.
  const domRefs = {
    rail: null,
    filler: null,
    bgLayer: null,
    slideA: null,
    slideB: null
  };

  // Measure the real scrollbar width on this browser/os, accounting for
  // hidden/overlay scrollbars and high-DPI sub-pixel differences.
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
    lastRailRect = null;
  }

  // iGEM Layout Strategy: The rail-edge-filler is a fixed-position strip that
  // covers the narrow track between the absolute-positioned bio-rail and the
  // viewport right edge. Because the rail scrolls with the page while the
  // filler is fixed, we sync its top/height to the rail's viewport geometry
  // on resize, scroll and layout shifts.
  function updateRailEdgeFiller() {
    const filler = domRefs.filler;
    const rail = domRefs.rail;
    if (!filler || !rail) return;

    // No filler needed when the rail itself is hidden (either by breakpoint CSS
    // or by the collapsed state).
    if (!rail.classList.contains('is-visible')) {
      if (filler.style.top !== '' || filler.style.height !== '') {
        filler.style.top = '';
        filler.style.height = '';
        lastRailRect = null;
      }
      return;
    }

    const scrollbarWidth = measureScrollbarWidth();
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);

    const railRect = rail.getBoundingClientRect();
    // Skip writes when the rail geometry has not changed since the last frame.
    if (lastRailRect &&
      Math.round(lastRailRect.top) === Math.round(railRect.top) &&
      Math.round(lastRailRect.height) === Math.round(railRect.height)) {
      return;
    }
    lastRailRect = railRect;

    // Round to whole pixels so the filler stays pixel-perfect with the rail
    // and keeps any sub-pixel drift within the 1px tolerance.
    const top = `${Math.round(railRect.top)}px`;
    const height = `${Math.round(railRect.height)}px`;
    if (filler.style.top !== top) filler.style.top = top;
    if (filler.style.height !== height) filler.style.height = height;
  }

  function scheduleRailEdgeFillerUpdate() {
    if (railFillerRafId) return;
    railFillerRafId = requestAnimationFrame(() => {
      railFillerRafId = null;
      updateRailEdgeFiller();
    });
  }

  function observeRailContainer() {
    if (railResizeObserver) {
      railResizeObserver.disconnect();
      railResizeObserver = null;
    }
    const app = document.getElementById('members-redesign-app');
    if (!app || typeof ResizeObserver === 'undefined') return;
    railResizeObserver = new ResizeObserver(() => scheduleRailEdgeFillerUpdate());
    railResizeObserver.observe(app);
  }

  function renderGroups(container) {
    const groups = groupMembers();
    container.innerHTML = '';

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

      group.members.forEach(member => {
        const strip = document.createElement('div');
        strip.className = 'member-strip';
        strip.dataset.id = member.id;
        strip.dataset.role = group.role;
        strip.setAttribute('role', 'button');
        strip.setAttribute('tabindex', '0');
        strip.setAttribute('aria-label', `View ${member.name}'s profile`);

        const avatarCandidates = resolveImageCandidates(member, 'avatar');
        const avatarSrc = escapeHtml(avatarCandidates[0] || '');
        const avatarFallback = avatarCandidates.length > 1 ? JSON.stringify(avatarCandidates.slice(1)).replace(/"/g, '&quot;') : '[]';
        const safeName = escapeHtml(member.name || '');
        strip.innerHTML = `
          <img class="strip-avatar" src="${avatarSrc}" alt="${safeName}" loading="lazy" data-candidates="${avatarFallback}" onerror="window.membersImageFallback(this)">
          <span class="strip-name">${safeName}</span>
          <span class="ribbon-tail" aria-hidden="true"></span>
        `;

        strip.addEventListener('click', () => selectMember(member.id));
        strip.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectMember(member.id);
          }
        });

        membersEl.appendChild(strip);
      });

      groupEl.appendChild(header);
      groupEl.appendChild(membersEl);
      container.appendChild(groupEl);
    });
  }

  // 切换中间人物大背景图；如需调整背景图样式，请修改 .members-bg-layer、.bg-slide、.bg-mask
  // position 支持每个成员单独指定焦点，例如 'center 30%'、'center center'、'40% 20%'。
  // size 支持单独缩放，例如 'cover'、'contain'、'120% auto'（人脸变小）、'80% auto'（人脸变大）。
  function updateBackground(photoPathOrCandidates, position, size) {
    const candidates = Array.isArray(photoPathOrCandidates)
      ? photoPathOrCandidates
      : (typeof photoPathOrCandidates === 'string' ? [photoPathOrCandidates] : []);
    updateBackgroundWithCandidates(candidates, position, size);
  }

  function updateBackgroundWithCandidates(candidates, position, size) {
    const bgLayer = domRefs.bgLayer;
    const slideA = domRefs.slideA;
    const slideB = domRefs.slideB;
    if (!bgLayer || !slideA || !slideB) return;

    const current = activeBackgroundSlide === 'a' ? slideA : slideB;
    const next = activeBackgroundSlide === 'a' ? slideB : slideA;
    const bgPosition = position || DEFAULT_PHOTO_POSITION;
    const bgSize = size || DEFAULT_PHOTO_SIZE;

    // Ignore stale callbacks when the user selects another member before the
    // current background finishes loading.
    const generation = ++backgroundGeneration;

    function applyLoaded(path) {
      if (generation !== backgroundGeneration) return;
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
      activeBackgroundSlide = activeBackgroundSlide === 'a' ? 'b' : 'a';
    }

    // Preload so a missing image does not leave the previous member's photo.
    // Try candidates in order and fall back to a blank background if all fail.
    function tryCandidate(index) {
      if (generation !== backgroundGeneration) return;
      if (index >= candidates.length) {
        applyLoaded('');
        return;
      }

      const img = new Image();
      img.onload = () => applyLoaded(candidates[index]);
      img.onerror = () => tryCandidate(index + 1);
      img.src = candidates[index];
    }

    tryCandidate(0);
  }

  function openRail(rail) {
    if (!rail) return;
    rail.classList.add('is-visible');
    const inner = rail.querySelector('.bio-rail-inner');
    if (inner) inner.style.transform = '';
    const toggle = rail.querySelector('.rail-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    isRailCollapsed = false;
    updateRailEdgeFiller();
  }

  function closeRail(rail) {
    if (!rail) return;
    rail.classList.remove('is-visible');
    const inner = rail.querySelector('.bio-rail-inner');
    if (inner) inner.style.transform = '';
    const toggle = rail.querySelector('.rail-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    isRailCollapsed = true;
    updateRailEdgeFiller();
  }

  function bindRailDrag(rail) {
    if (!rail) return;
    const inner = rail.querySelector('.bio-rail-inner');
    if (!inner) return;

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
      if (dt <= 0) return 0;
      return (last.x - first.x) / dt;
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
      // Skip redundant move events to reduce per-frame writes.
      if (moveHistory.length > 0 && currentX === moveHistory[moveHistory.length - 1].x) return;
      const deltaX = currentX - startX;
      moveHistory.push({ x: currentX, t: Date.now() });
      if (moveHistory.length > 6) moveHistory.shift();

      // Only allow dragging to the right (dismiss direction).
      const visualDelta = Math.max(0, deltaX);
      inner.style.transform = `translateX(${visualDelta}px)`;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      inner.releasePointerCapture(e.pointerId);

      const deltaX = e.clientX - startX;
      const velocity = computeVelocity();
      const distanceThreshold = 100;
      const velocityThreshold = 0.6;
      const shouldClose = deltaX > distanceThreshold || velocity > velocityThreshold;

      rail.classList.remove('is-dragging');

      // Animate from the current dragged offset to the target position. We
      // change the state class first so the matching CSS timing function is
      // applied, then set an inline target that overrides the CSS transform
      // just long enough for the transition to interpolate from the dragged
      // offset. The inline override is cleared once the transition ends.
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

      if (shouldClose) {
        rail.classList.remove('is-visible');
        const toggle = rail.querySelector('.rail-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        isRailCollapsed = true;
      } else {
        rail.classList.add('is-visible');
        isRailCollapsed = false;
      }

      inner.style.transform = `translateX(${targetX}px)`;
    };

    inner.addEventListener('pointerdown', onPointerDown);
    inner.addEventListener('pointermove', onPointerMove);
    inner.addEventListener('pointerup', onPointerUp);
    inner.addEventListener('pointercancel', onPointerUp);
  }

  function selectMember(id) {
    selectedId = id;

    document.querySelectorAll('.member-strip').forEach(strip => {
      strip.classList.toggle('is-selected', strip.dataset.id === id);
    });

    const member = members.find(m => m.id === id);
    const rail = document.getElementById('bio-rail');

    if (!member) {
      closeRail(rail);
      return;
    }

    const card = document.getElementById('detail-card');
    if (card) {
      card.hidden = false;
      // Re-trigger the fade-in animation without cloning the whole card.
      card.classList.remove('is-animating');
      void card.offsetWidth;
      card.classList.add('is-animating');
    }

    // Populate the mobile/tablet detail card.
    const detailName = document.getElementById('detail-name');
    const detailRole = document.getElementById('detail-role');
    const detailRoleTags = document.getElementById('detail-role-tags');
    const detailDirectionTags = document.getElementById('detail-direction-tags');
    const detailBio = document.getElementById('detail-bio');

    if (detailName) detailName.textContent = member.name;
    if (detailRole) detailRole.style.display = 'none';
    if (detailRoleTags) {
      detailRoleTags.innerHTML = member.roles
        .filter(role => !CLASSIFICATION_ROLES.has(role))
        .map(role => `<span class="detail-tag">${escapeHtml(role)}</span>`)
        .join('');
    }
    if (detailDirectionTags) {
      detailDirectionTags.innerHTML = member.directions
        .map(dir => `<span class="detail-tag">${escapeHtml(dir)}</span>`)
        .join('');
    }
    if (detailBio) detailBio.innerHTML = `<p>${escapeHtml(member.bio)}</p>`;

    // Populate the desktop sticky rail.
    const railName = document.getElementById('rail-name');
    const railRole = document.getElementById('rail-role');
    const railRoleTags = document.getElementById('rail-role-tags');
    const railDirectionTags = document.getElementById('rail-direction-tags');
    const railBio = document.getElementById('rail-bio');

    if (railName) railName.textContent = member.name;
    if (railRole) railRole.style.display = 'none';
    if (railRoleTags) {
      railRoleTags.innerHTML = member.roles
        .filter(role => !CLASSIFICATION_ROLES.has(role))
        .map(role => `<span class="rail-tag">${escapeHtml(role)}</span>`)
        .join('');
    }
    if (railDirectionTags) {
      railDirectionTags.innerHTML = member.directions
        .map(dir => `<span class="rail-tag">${escapeHtml(dir)}</span>`)
        .join('');
    }
    if (railBio) railBio.textContent = member.bio;

    openRail(rail);

    // Promote the member's real photo to the full-bleed background layer.
    // Use the member-specific focal point and zoom if provided, otherwise fall
    // back to the global defaults defined at the top of this file.
    updateBackground(resolveImageCandidates(member, 'photo'), member.photoPosition, member.photoSize);

    // Mobile: collapse the strip after selection so the detail panel is visible.
    const strip = document.getElementById('members-strip');
    if (strip && window.innerWidth <= DESKTOP_BREAKPOINT) {
      strip.classList.remove('is-expanded');
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function init() {
    // Clean up any observer from a previous init (e.g. hot reload).
    if (railResizeObserver) {
      railResizeObserver.disconnect();
      railResizeObserver = null;
    }

    // Cache DOM references that are used repeatedly outside this function.
    domRefs.rail = document.getElementById('bio-rail');
    domRefs.filler = document.getElementById('rail-edge-filler');
    const bgLayer = document.querySelector('.members-bg-layer');
    if (bgLayer) {
      domRefs.bgLayer = bgLayer;
      domRefs.slideA = bgLayer.querySelector('.bg-slide-a');
      domRefs.slideB = bgLayer.querySelector('.bg-slide-b');
    }

    const stripGroups = document.getElementById('strip-groups');
    const stripToggle = document.getElementById('strip-toggle');
    const membersStrip = document.getElementById('members-strip');
    const rail = domRefs.rail;
    const railToggle = document.getElementById('rail-toggle');

    if (stripGroups) renderGroups(stripGroups);

    if (stripToggle && membersStrip) {
      stripToggle.addEventListener('click', () => {
        const isExpanded = membersStrip.classList.toggle('is-expanded');
        stripToggle.setAttribute('aria-expanded', String(isExpanded));
      });
    }

    if (railToggle && rail) {
      railToggle.addEventListener('click', () => openRail(rail));
    }

    if (rail) {
      bindRailDrag(rail);
    }

    // Select the first member by default on desktop.
    if (members.length > 0 && window.innerWidth > DESKTOP_BREAKPOINT) {
      selectMember(members[0].id);
    } else if (rail) {
      closeRail(rail);
    }

    // Reset rail visibility when crossing the desktop breakpoint.
    let lastWidth = window.innerWidth;
    function scheduleResizeUpdate() {
      if (resizeRafId) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        invalidateScrollbarWidth();
        const width = window.innerWidth;
        if (!rail) return;
        if (lastWidth > DESKTOP_BREAKPOINT && width <= DESKTOP_BREAKPOINT) {
          closeRail(rail);
        } else if (lastWidth <= DESKTOP_BREAKPOINT && width > DESKTOP_BREAKPOINT && selectedId) {
          openRail(rail);
        }
        lastWidth = width;
        scheduleRailEdgeFillerUpdate();
      });
    }

    window.addEventListener('resize', scheduleResizeUpdate, { passive: true });
    window.addEventListener('orientationchange', () => {
      invalidateScrollbarWidth();
      scheduleRailEdgeFillerUpdate();
    });

    window.addEventListener('scroll', scheduleRailEdgeFillerUpdate, { passive: true });
    observeRailContainer();
    updateRailEdgeFiller();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
