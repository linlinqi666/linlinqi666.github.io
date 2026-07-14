// Standalone verification of the path resolution logic copied from
// static/js/members-redesign.js. This exercises the pure functions without
// requiring a real browser.

const ROLE_ORDER = ['Wet Lab', 'Dry Lab', 'WIKI', 'HP', 'Designer', 'Adviser'];

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
  },
  wildcard: {
    template: '../static/image/character/${id}.*',
    ext: 'jpg',
    candidates: ['../static/image/character/${id}.*'],
    wildcardExtensions: ['jpg', 'webp', 'png']
  }
};

const IMAGE_PATH_MAPPINGS = [
  // More specific combination rules are listed first so they take precedence
  // over broader role-based rules.
  { match: { roles: 'Adviser', id: ['zzz'] }, templates: { photo: '../static/image/adviser-combo/${id}.jpg', avatar: '../static/image/adviser-combo/${id}_kt.jpg' } },
  { match: { roles: 'Adviser' }, templates: { photo: '../static/image/adviser/${id}.jpg', avatar: '../static/image/adviser/${id}_kt.jpg' } },
  { match: { name: 'Named Person' }, templates: { photo: '../static/image/named/${id}.jpg', avatar: '../static/image/named/${id}_kt.jpg' } },
  { match: { flags: 'alumni' }, templates: { photo: '../static/image/flags/${id}.jpg' } }
];

function sanitizeImageId(id) {
  if (typeof id !== 'string') return '';
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

function sanitizePathSegment(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[^a-zA-Z0-9_\s-]/g, '').trim().replace(/\s+/g, '-');
}

function getPrimaryRole(member) {
  if (!member || !Array.isArray(member.roles)) return 'Wet Lab';
  for (const role of ROLE_ORDER) {
    if (member.roles.includes(role)) return role;
  }
  return member.roles[0] || 'Wet Lab';
}

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

function expandWildcardExtensions(template, extensions) {
  if (typeof template !== 'string') return [];
  if (!template.includes('*')) return [template];
  const exts = Array.isArray(extensions) ? extensions : [];
  if (exts.length === 0) return [template];
  return exts.map(ext => template.replace(/\*/g, String(ext)));
}

function interpolateTemplate(template, vars) {
  if (typeof template !== 'string') return '';
  return template.replace(/\$\{([a-zA-Z0-9_]+)\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : '';
  });
}

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

function resolveImageCandidates(member, type) {
  const safeType = typeof type === 'string' ? type : 'photo';
  const config = IMAGE_PATH_TEMPLATES[safeType] || IMAGE_PATH_TEMPLATES.photo;

  const vars = {
    id: sanitizeImageId(member && member.id),
    type: safeType,
    ext: config.ext || 'jpg',
    primaryRole: sanitizePathSegment(getPrimaryRole(member))
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

function resolveImagePath(member, type) {
  const candidates = resolveImageCandidates(member, type);
  return candidates.length > 0 ? candidates[0] : '';
}

function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${message}: expected ${e}, got ${a}`);
  }
}

// Tests
assertEqual(resolveImagePath({ id: 'xj', roles: ['Wet Lab'] }, 'photo'), '../static/image/character/xj.jpg', 'default photo');
assertEqual(resolveImagePath({ id: 'xj', roles: ['Wet Lab'] }, 'avatar'), '../static/image/character/xj_kt.jpg', 'default avatar');
assertEqual(resolveImageCandidates({ id: 'xj', roles: ['Wet Lab'] }, 'photo'), [
  '../static/image/character/xj.jpg',
  '../static/image/character/xj.webp'
], 'photo candidates');
assertEqual(resolveImageCandidates({ id: 'xj', roles: ['Wet Lab'] }, 'avatar'), [
  '../static/image/character/xj_kt.jpg',
  '../static/image/character/xj_kt.png'
], 'avatar candidates');
assertEqual(resolveImagePath({ id: 'xq', roles: ['Web Developer', 'WIKI'], images: { photo: '../static/image/backup/xq.png' } }, 'photo'), '../static/image/backup/xq.png', 'per-member string override');
assertEqual(resolveImageCandidates({ id: 'zlz', roles: ['Adviser'] }, 'photo'), ['../static/image/adviser/zlz.jpg'], 'role mapping');
assertEqual(resolveImageCandidates({ id: 'zlz', roles: ['Adviser'] }, 'avatar'), ['../static/image/adviser/zlz_kt.jpg'], 'role mapping avatar');
assertEqual(expandBracePattern(interpolateTemplate('../path/${id}.{jpg,png,webp}', { id: 'xj' })), ['../path/xj.jpg', '../path/xj.png', '../path/xj.webp'], 'brace expansion after interpolation');
assertEqual(resolveImageCandidates({ id: 'test', roles: ['Wet Lab'], images: { photo: { candidates: ['../a/${id}.jpg', '../a/${id}.webp'] } } }, 'photo'), ['../a/test.jpg', '../a/test.webp'], 'per-member candidates');
assertEqual(resolveImageCandidates({ id: '../etc/passwd', roles: ['Wet Lab'] }, 'photo'), ['../static/image/character/etcpasswd.jpg', '../static/image/character/etcpasswd.webp'], 'path traversal id sanitized');
assertEqual(resolveImageCandidates({ id: '', roles: ['Wet Lab'] }, 'photo'), [], 'empty id returns no candidates');

// New matching tests
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Wet Lab'] }, { match: { name: 'Named Person' } }), true, 'name string match');
assertEqual(matchesMapping({ id: 'a', name: 'Other', roles: ['Wet Lab'] }, { match: { name: 'Named Person' } }), false, 'name string mismatch');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Wet Lab'] }, { match: { name: /^Named/ } }), true, 'name regex match');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Wet Lab'] }, { match: { name: ['Named Person', 'Other'] } }), true, 'name array match');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Wet Lab'], flags: ['alumni'] }, { match: { flags: 'alumni' } }), true, 'flags string match');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Wet Lab'], flags: ['alumni'] }, { match: { flags: ['alumni', 'external'] } }), true, 'flags array match');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Wet Lab'] }, { match: { flags: 'alumni' } }), false, 'missing flags treated as empty');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Adviser'] }, { match: { roles: 'Adviser', id: 'a' } }), true, 'combined conditions match');
assertEqual(matchesMapping({ id: 'a', name: 'Named Person', roles: ['Adviser'] }, { match: { roles: 'Adviser', id: 'b' } }), false, 'combined conditions fail');

assertEqual(resolveImageCandidates({ id: 'named', name: 'Named Person', roles: ['Wet Lab'] }, 'photo'), ['../static/image/named/named.jpg'], 'name mapping');
assertEqual(resolveImageCandidates({ id: 'flagged', name: 'Flagged', roles: ['Wet Lab'], flags: ['alumni'] }, 'photo'), ['../static/image/flags/flagged.jpg'], 'flags mapping');
assertEqual(resolveImageCandidates({ id: 'zzz', name: 'Zzz', roles: ['Adviser'] }, 'photo'), ['../static/image/adviser-combo/zzz.jpg'], 'combined role and id mapping');

// Wildcard expansion tests
assertEqual(expandWildcardExtensions('../path/${id}.*', ['jpg', 'png']), ['../path/${id}.jpg', '../path/${id}.png'], 'wildcard expansion');
assertEqual(expandWildcardExtensions('../path/${id}.jpg', ['jpg', 'png']), ['../path/${id}.jpg'], 'no wildcard returns template unchanged');
assertEqual(resolveImageCandidates({ id: 'xj', roles: ['Wet Lab'] }, 'wildcard'), [
  '../static/image/character/xj.jpg',
  '../static/image/character/xj.webp',
  '../static/image/character/xj.png'
], 'wildcardExtensions config generates multi-format candidates');
assertEqual(resolveImageCandidates({ id: 'wild', roles: ['Wet Lab'], images: { photo: { candidates: ['../static/image/character/${id}.*'] } } }, 'photo'), [
  '../static/image/character/wild.jpg',
  '../static/image/character/wild.webp',
  '../static/image/character/wild.png'
], 'wildcard in per-member candidates');

// Recursive multi-brace expansion tests
assertEqual(expandBracePattern('../path/x_{a,b}.{jpg,png}'), [
  '../path/x_a.jpg',
  '../path/x_a.png',
  '../path/x_b.jpg',
  '../path/x_b.png'
], 'recursive multi-brace expansion');
assertEqual(resolveImageCandidates({ id: 'brace', roles: ['Wet Lab'], images: { photo: { candidates: ['../static/image/character/${id}_{small,large}.{jpg,png}'] } } }, 'photo'), [
  '../static/image/character/brace_small.jpg',
  '../static/image/character/brace_small.png',
  '../static/image/character/brace_large.jpg',
  '../static/image/character/brace_large.png'
], 'multi-brace in per-member candidates');

console.log('All path-resolution tests passed.');
