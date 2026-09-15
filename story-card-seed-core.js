(() => {
  if (window.__PIXELY_STORY_PACK_CORE_V2__) return;
  window.__PIXELY_STORY_PACK_CORE_V2__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const STATE_KEY = 'pixely-story-card-pack-v1';
  const packs = {};
  let seedTimer = 0;

  const EXCLUDED_CHARACTERS = new Set(['도티','쵸쵸우','코아','연다']);
  const CHARACTER_EMOJI = {
    '잠뜰':'🌙',
    '각별':'⭐',
    '라더':'🔥',
    '덕개':'🐾',
    '공룡':'🦖',
    '수현':'💜',
  };

  const read = (key, fallback={}) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const renameText = value => String(value ?? '').replaceAll('칠각별','각별');

  function inferEmoji(name, type='card', note='', description='') {
    const n = renameText(name);
    if (CHARACTER_EMOJI[n]) return CHARACTER_EMOJI[n];
    if (n.includes('이야기 기록')) return '📖';
    const text = `${n} ${note} ${description}`;
    const rules = [
      [/보석|결정|크리스탈/, '💎'],
      [/열쇠/, '🔑'],
      [/펜던트|목걸이/, '📿'],
      [/디스크|백업/, '💾'],
      [/리시버|무전|라디오/, '📻'],
      [/연구소|실험|약품|시약/, '🧪'],
      [/탐정|수사|사건|단서/, '🔎'],
      [/사당|신전/, '⛩️'],
      [/미로|미궁/, '🧭'],
      [/숲|나무/, '🌲'],
      [/바다|해역|물|아뜰란티스/, '🌊'],
      [/별|은하|우주/, '⭐'],
      [/겨울|눈|얼음/, '❄️'],
      [/왕관|왕|황제/, '👑'],
      [/검|칼|무기/, '⚔️'],
      [/기계|로봇|스틸|장치/, '🤖'],
      [/세계|여행|지도/, '🌍'],
      [/학교|교실/, '🏫'],
      [/좀비/, '🧟'],
      [/죽음|데드|해골/, '☠️'],
      [/웹|인터넷|거미/, '🕸️'],
      [/편지|우편/, '✉️'],
      [/사진|카메라/, '📷'],
      [/전화|휴대폰/, '📱'],
      [/컴퓨터|노트북/, '💻'],
      [/시계|시간/, '⏳'],
      [/책|기록|일지|파일/, '📚'],
      [/집|마을|타운|이웃/, '🏠'],
      [/상점|잡화점|가게/, '🛍️'],
      [/혁명|깃발|플래그/, '🚩'],
      [/블랙|작전|요원/, '🕶️'],
      [/문|입구|이방인/, '🚪'],
      [/밤|달|눈/, '🌙'],
      [/아이|아이들/, '🧒'],
    ];
    for (const [pattern, emoji] of rules) if (pattern.test(text)) return emoji;
    return type === 'item' ? '🎒' : '👤';
  }

  function normalizeRaw(raw) {
    const name = renameText(raw?.name || '');
    if (!name || EXCLUDED_CHARACTERS.has(name)) return null;
    const type = raw?.type === 'item' ? 'item' : 'card';
    return {
      ...raw,
      name,
      shortNote:renameText(raw?.shortNote || ''),
      description:renameText(raw?.description || ''),
      symbol:inferEmoji(name, type, raw?.shortNote || '', raw?.description || ''),
      type,
    };
  }

  function register(data) {
    if (!data || typeof data !== 'object') return;
    Object.entries(data).forEach(([groupId, cards]) => {
      if (!Array.isArray(cards)) return;
      const cleaned = cards.map(normalizeRaw).filter(Boolean);
      packs[groupId] = [...(packs[groupId] || []), ...cleaned];
    });
    scheduleSeed();
  }

  function storyGroupsReady() {
    const meta = read(META_KEY, {});
    const groups = Array.isArray(meta.groups) ? meta.groups : [];
    const known = new Set(groups.map(g => g?.id));
    const wanted = Object.keys(packs);
    return wanted.length > 0 && wanted.every(id => known.has(id));
  }

  function scheduleSeed() {
    clearTimeout(seedTimer);
    seedTimer = setTimeout(() => waitAndSeed(0), 80);
  }

  function waitAndSeed(attempt) {
    if (!storyGroupsReady() && attempt < 60) {
      seedTimer = setTimeout(() => waitAndSeed(attempt + 1), 100);
      return;
    }
    seed();
  }

  function migrateExisting(core, meta, state) {
    const removedIds = new Set();
    core.gachaItems = core.gachaItems.filter(item => {
      const id = String(item?.id || '');
      if (!id.startsWith('storycard-')) return true;
      item.name = renameText(item.name || '');
      item.shortNote = renameText(item.shortNote || '');
      item.description = renameText(item.description || '');
      if (EXCLUDED_CHARACTERS.has(item.name)) {
        removedIds.add(id);
        return false;
      }
      const type = meta.itemMeta?.[id]?.type === 'item' ? 'item' : 'card';
      item.symbol = inferEmoji(item.name, type, item.shortNote, item.description);
      return true;
    });

    removedIds.forEach(id => {
      delete core.owned[id];
      delete meta.itemMeta[id];
      if (core.lastCardId === id) core.lastCardId = null;
    });

    if (Array.isArray(state.seededIds)) {
      state.seededIds = state.seededIds.filter(id => !removedIds.has(String(id)));
    }
    return removedIds;
  }

  function seed() {
    const core = read(CORE_KEY, {});
    core.owned = core.owned && typeof core.owned === 'object' ? core.owned : {};
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];

    const meta = read(META_KEY, {version:2,groups:[],itemMeta:{},bonusItems:[],bonusOwned:{},unlockLog:[]});
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};

    const state = read(STATE_KEY, {version:2,seededIds:[]});
    migrateExisting(core, meta, state);

    const seeded = new Set(Array.isArray(state.seededIds) ? state.seededIds.map(String) : []);
    const existing = new Map(core.gachaItems.map(item => [String(item.id), item]));
    let added = 0;

    Object.entries(packs).forEach(([groupId, cards]) => {
      cards.forEach(raw => {
        const clean = normalizeRaw(raw);
        if (!clean) return;
        const id = String(clean.id || '');
        if (!id) return;

        if (seeded.has(id) && existing.has(id)) return;

        if (!existing.has(id)) {
          const card = {
            id,
            name:clean.name,
            symbol:clean.symbol,
            rarity:String(clean.rarity || 'SKY'),
            color:/^#[0-9a-f]{6}$/i.test(String(clean.color || '')) ? String(clean.color) : '#829fda',
            weight:Math.max(0.01, Number(clean.weight) || 0.08),
            shortNote:clean.shortNote,
            relatedSeriesId:null,
            description:clean.description,
            imageUrl:null,
          };
          core.gachaItems.push(card);
          existing.set(id, card);
          added += 1;
        }

        if (!meta.itemMeta[id]) {
          meta.itemMeta[id] = {
            groupId,
            type:clean.type,
            imageUrl:'',
            includeInCompletion:true,
          };
        }
        seeded.add(id);
      });
    });

    state.version = 2;
    state.seededIds = [...seeded];
    state.seededAt = state.seededAt || new Date().toISOString();
    state.migratedAt = new Date().toISOString();
    state.total = state.seededIds.length;
    write(CORE_KEY, core);
    write(META_KEY, meta);
    write(STATE_KEY, state);

    try {
      if (typeof save !== 'undefined' && save && Array.isArray(save.gachaItems)) {
        save.gachaItems = core.gachaItems;
        save.owned = core.owned;
        if (typeof persistSave === 'function') persistSave();
      }
    } catch {}

    window.PIXELY_STORY_CARDS = Object.entries(packs).flatMap(([groupId,cards]) => cards.map(normalizeRaw).filter(Boolean).map(card => ({...card,groupId})));
    window.dispatchEvent(new CustomEvent('pixely:story-cards-seeded', {detail:{added,total:state.total,migrated:true}}));

    [80,240,700].forEach(delay => setTimeout(() => {
      const tab = document.querySelector('[data-tab="collection"]');
      const panel = document.querySelector('[data-panel="collection"]');
      if (tab && panel && !panel.hidden) tab.click();
    }, delay));
  }

  window.PIXELY_STORY_PACK = { register, seed, get packs(){ return packs; } };
})();