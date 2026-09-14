(() => {
  const META_KEY = 'pixely-collection-groups-v2';
  const COLLAPSE_KEY = 'pixely-collection-collapse-v1';
  const SOURCE_URL = 'https://namu.wiki/w/%EC%9E%A0%EB%9C%B0/%EC%BD%98%ED%85%90%EC%B8%A0';

  // Source-backed collection skeleton. No cards, characters or items are created here.
  const STORY_GROUPS = [
    // 공식 장기 상황극
    { id:'story-psychic-lab', name:'초능력 연구소', category:'official-roleplay', subtitle:'OFFICIAL ROLEPLAY', icon:'✦', color:'#79bff2' },
    { id:'story-ddl-detective', name:'뜰빛탐정', category:'official-roleplay', subtitle:'OFFICIAL ROLEPLAY', icon:'✦', color:'#79bff2' },
    { id:'story-makis-maze', name:'메이키스의 미로', category:'official-roleplay', subtitle:'OFFICIAL ROLEPLAY', icon:'✦', color:'#79bff2' },
    { id:'story-atlantis', name:'아뜰란티스', category:'official-roleplay', subtitle:'OFFICIAL ROLEPLAY', icon:'✦', color:'#79bff2' },
    { id:'story-three-siblings', name:'이세계 삼남매', category:'official-roleplay', subtitle:'OFFICIAL ROLEPLAY', icon:'✦', color:'#79bff2' },
    { id:'story-night-eyes', name:'밤을 보는 눈', category:'official-roleplay', subtitle:'OFFICIAL ROLEPLAY', icon:'✦', color:'#79bff2' },

    // 공식 단기 상황극 + 단기 진행 상황극
    { id:'story-operation-black', name:'작전명 블랙', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-star-child', name:'별의 아이', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-water-flag', name:'워터 플래그', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-winter-myth', name:'겨울 신화', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-revolution', name:'혁명', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-steel-heart', name:'스틸 하트', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-psychic-world-tour', name:'초능력 세계여행', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-outsider', name:'이방인', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-sunny-side-town', name:'써니 사이드 타운', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },
    { id:'story-galaxy-store', name:'은하수 잡화점', category:'short-roleplay', subtitle:'SHORT ROLEPLAY', icon:'◇', color:'#b69bd8' },

    // 같은 출처에서 별도 '콘텐츠/상황극'으로 관리되는 스토리형 시리즈.
    // 상황극으로 단정하지 않고 STORY SERIES로 구분해 기억한다.
    { id:'story-suspicious-neighbor', name:'수상한 이웃집', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-blind', name:'블라인드', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-mystery-investigation', name:'미스터리 수사반', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-3days', name:'3 DAYS: 3일간의 기록', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-school-seven-mysteries', name:'학교 7대 불가사의', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-dead-fathers', name:'데드 파더스', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-labyrinth', name:'미궁', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-neighbor-zombie', name:'이웃집 좀비', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-lady-young-master', name:'아가씨와 도련님', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-runners', name:'도망자들', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
    { id:'story-underweb', name:'언더웹', category:'story-series', subtitle:'STORY SERIES', icon:'▤', color:'#e7a5bd' },
  ];

  window.PIXELY_STORY_GROUPS = STORY_GROUPS.map(item => ({ ...item, sourceUrl: SOURCE_URL }));

  function read(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  }

  function seedGroups() {
    const meta = read(META_KEY, { version:2, groups:[], itemMeta:{}, bonusItems:[], bonusOwned:{}, unlockLog:[] });
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];

    const etcIndex = meta.groups.findIndex(g => g?.id === 'etc');
    let insertAt = etcIndex >= 0 ? etcIndex : meta.groups.length;
    let changed = false;

    STORY_GROUPS.forEach(seed => {
      // Reuse an existing manually-created group with the same title instead of duplicating it.
      let group = meta.groups.find(g => g?.id === seed.id) || meta.groups.find(g => String(g?.name || '').trim() === seed.name);
      if (!group) {
        group = {
          id: seed.id,
          name: seed.name,
          subtitle: seed.subtitle,
          icon: seed.icon,
          color: seed.color,
          rewardId: '',
          alwaysVisible: true,
          storySeed: true,
          sourceCategory: seed.category,
          sourceUrl: SOURCE_URL,
        };
        meta.groups.splice(insertAt, 0, group);
        insertAt += 1;
        changed = true;
      } else {
        const before = JSON.stringify([group.alwaysVisible, group.storySeed, group.sourceCategory, group.sourceUrl]);
        group.alwaysVisible = true;
        group.storySeed = true;
        group.sourceCategory = seed.category;
        group.sourceUrl = SOURCE_URL;
        if (!group.subtitle) group.subtitle = seed.subtitle;
        if (!group.icon) group.icon = seed.icon;
        if (!group.color) group.color = seed.color;
        if (JSON.stringify([group.alwaysVisible, group.storySeed, group.sourceCategory, group.sourceUrl]) !== before) changed = true;
      }
    });

    if (changed) localStorage.setItem(META_KEY, JSON.stringify(meta));

    // New empty story groups start folded so the collection remains easy to scan.
    const state = read(COLLAPSE_KEY, { defaults:{}, collapsed:{} });
    state.defaults = state.defaults || {};
    state.collapsed = state.collapsed || {};
    let stateChanged = false;
    STORY_GROUPS.forEach(seed => {
      const group = meta.groups.find(g => g?.id === seed.id) || meta.groups.find(g => String(g?.name || '').trim() === seed.name);
      if (!group?.id) return;
      if (!Object.prototype.hasOwnProperty.call(state.defaults, group.id)) {
        state.defaults[group.id] = true;
        stateChanged = true;
      }
    });
    if (stateChanged) localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state));
    return meta;
  }

  function hasContent(groupId, meta) {
    const core = read('pixely-diary-save-v1', {});
    const items = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    const itemMeta = meta.itemMeta || {};
    const bonus = Array.isArray(meta.bonusItems) ? meta.bonusItems : [];
    const group = meta.groups.find(g => g.id === groupId);
    return items.some(item => (itemMeta[item.id]?.groupId || 'etc') === groupId) ||
      bonus.some(item => item.groupId === groupId) || !!group?.rewardId;
  }

  function collapsed(groupId) {
    const state = read(COLLAPSE_KEY, { defaults:{}, collapsed:{} });
    if (Object.prototype.hasOwnProperty.call(state.collapsed || {}, groupId)) return !!state.collapsed[groupId];
    return !!state.defaults?.[groupId];
  }

  function insertEmptyGroups() {
    const root = document.querySelector('#collection-spreads .gc-book-view');
    if (!root) return;
    const meta = seedGroups();
    const existingNames = new Set([...root.querySelectorAll('.gc-group h3')].map(el => el.textContent.trim()));
    const existingIds = new Set([...root.querySelectorAll('.gc-group[data-story-group]')].map(el => el.dataset.storyGroup));

    STORY_GROUPS.forEach(seed => {
      const group = meta.groups.find(g => g?.id === seed.id) || meta.groups.find(g => String(g?.name || '').trim() === seed.name);
      if (!group || hasContent(group.id, meta) || existingNames.has(group.name) || existingIds.has(group.id)) return;
      const section = document.createElement('section');
      section.className = `gc-group gc-story-empty${collapsed(group.id) ? ' is-collapsed' : ''}`;
      section.dataset.storyGroup = group.id;
      section.dataset.collapseGroup = group.id;
      section.style.setProperty('--group-color', group.color || seed.color);
      section.innerHTML = `
        <header class="gc-group-head" data-story-collapse-toggle="${group.id}" role="button" tabindex="0" aria-expanded="${String(!collapsed(group.id))}">
          <span class="gc-group-icon">${group.icon || seed.icon}</span>
          <div><small>${group.subtitle || seed.subtitle}</small><h3>${group.name}</h3></div>
          <div class="gc-progress"><b>0 / 0</b><span><i style="width:0%"></i></span><small>준비 중</small></div>
          <span class="gc-collapse-toggle" aria-hidden="true"></span>
        </header>
        <div class="gc-grid"><p class="gc-empty-settings" style="grid-column:1/-1;margin:12px 0 4px">아직 등록된 카드가 없어요.</p></div>`;
      const etc = [...root.querySelectorAll('.gc-group')].find(el => el.querySelector('h3')?.textContent.trim() === '기타 컬렉션');
      if (etc) root.insertBefore(section, etc); else root.appendChild(section);
    });
  }

  function toggleEmpty(groupId) {
    const state = read(COLLAPSE_KEY, { defaults:{}, collapsed:{} });
    state.defaults = state.defaults || {};
    state.collapsed = state.collapsed || {};
    state.collapsed[groupId] = !collapsed(groupId);
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify(state));
    const section = document.querySelector(`.gc-story-empty[data-story-group="${CSS.escape(groupId)}"]`);
    if (section) {
      const isCollapsed = !!state.collapsed[groupId];
      section.classList.toggle('is-collapsed', isCollapsed);
      section.querySelector('[data-story-collapse-toggle]')?.setAttribute('aria-expanded', String(!isCollapsed));
    }
  }

  function boot() {
    seedGroups();
    let queued = false;
    const queue = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; insertEmptyGroups(); });
    };
    const root = document.getElementById('collection-spreads');
    if (root) new MutationObserver(queue).observe(root, { childList:true, subtree:true });
    document.addEventListener('click', event => {
      const head = event.target.closest?.('[data-story-collapse-toggle]');
      if (head) { event.preventDefault(); toggleEmpty(head.dataset.storyCollapseToggle); return; }
      if (event.target.closest?.('[data-tab="collection"], [data-open-tab="collection"]')) setTimeout(queue, 60);
    });
    document.addEventListener('keydown', event => {
      const head = event.target.closest?.('[data-story-collapse-toggle]');
      if (!head || !['Enter',' '].includes(event.key)) return;
      event.preventDefault();
      toggleEmpty(head.dataset.storyCollapseToggle);
    });
    setTimeout(queue, 100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();