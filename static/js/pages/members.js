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
    const ROLE_ORDER = ['Wet Lab', 'Dry Lab', 'WIKI', 'HP', 'Designer', 'Adviser'];
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
        photoSize: '80% auto'
      },
      {
        id: 'zjh',
        name: 'Jianhua Zhou',
        roles: ['Adviser'],
        directions: ['Scientific Guidance'],
        bio: 'Keep Pushing',
        photoPosition: 'center top',
        photoSize: '80% auto'
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

    const IMAGE_PATH_MAPPINGS = [
      // Example: { match: { roles: 'Adviser' }, templates: { photo: '../static/image/adviser/${id}.jpg', avatar: '../static/image/adviser/${id}_kt.jpg' } }
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

      function applyLoaded(path) {
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
      }

      function tryCandidate(index) {
        if (currentGeneration !== generation) return;
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

    return { updateBackground, updateBackgroundWithCandidates };
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
    const DESKTOP_BREAKPOINT = 1024;

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
    let lastRailRect = null;
    let railResizeObserver = null;
    let railFillerRafId = null;
    let resizeRafId = null;
    let lastWidth = window.innerWidth;

    let resizeHandler = null;
    let orientationchangeHandler = null;
    let scrollHandler = null;
    let stripToggleHandler = null;
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
      lastRailRect = null;
    }

    function updateRailEdgeFiller() {
      const filler = domRefs.filler;
      const rail = domRefs.rail;
      if (!filler || !rail) return;

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
      if (lastRailRect &&
        Math.round(lastRailRect.top) === Math.round(railRect.top) &&
        Math.round(lastRailRect.height) === Math.round(railRect.height)) {
        return;
      }
      lastRailRect = railRect;

      const top = `${Math.round(railRect.top)}px`;
      const height = `${Math.round(railRect.height)}px`;
      if (filler.style.top !== top) filler.style.top = top;
      if (filler.style.height !== height) filler.style.height = height;
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

      openRail();

      BackgroundController.updateBackground(
        ImageResolver.resolveImageCandidates(member, 'photo'),
        member.photoPosition,
        member.photoSize,
        domRefs
      );

      if (domRefs.membersStrip && window.innerWidth <= DESKTOP_BREAKPOINT) {
        domRefs.membersStrip.classList.remove('is-expanded');
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
          const isExpanded = domRefs.membersStrip.classList.toggle('is-expanded');
          domRefs.stripToggle.setAttribute('aria-expanded', String(isExpanded));
        };
        domRefs.stripToggle.addEventListener('click', stripToggleHandler);
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

      if (MemberData.members.length > 0 && window.innerWidth > DESKTOP_BREAKPOINT) {
        selectMember(MemberData.members[0].id);
      } else {
        closeRail();
      }

      function scheduleResizeUpdate() {
        if (resizeRafId) return;
        resizeRafId = raf(function () {
          resizeRafId = null;
          invalidateScrollbarWidth();
          const width = window.innerWidth;
          if (!domRefs.rail) return;
          if (lastWidth > DESKTOP_BREAKPOINT && width <= DESKTOP_BREAKPOINT) {
            closeRail();
          } else if (lastWidth <= DESKTOP_BREAKPOINT && width > DESKTOP_BREAKPOINT && selectedId) {
            openRail();
          }
          lastWidth = width;
          scheduleRailEdgeFillerUpdate();
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
      lastRailRect = null;
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
