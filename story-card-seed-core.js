(() => {
  if (window.__PIXELY_STORY_PACK_CORE_V1__) return;
  window.__PIXELY_STORY_PACK_CORE_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const STATE_KEY = 'pixely-story-card-pack-v1';
  const packs = {};
  let seedTimer = 0;

  const read = (key, fallback={}) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  function register(data) {
    if (!data || typeof data !== 'object') return;
    Object.entries(data).forEach(([groupId, cards]) => {
      if (!Array.isArray(cards)) return;
      packs[groupId] = [...(packs[groupId] || []), ...cards];
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

  function seed() {
    const core = read(CORE_KEY, {});
    core.owned = core.owned && typeof core.owned === 'object' ? core.owned : {};
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];

    const meta = read(META_KEY, {version:2,groups:[],itemMeta:{},bonusItems:[],bonusOwned:{},unlockLog:[]});
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};

    const state = read(STATE_KEY, {version:1,seededIds:[]});
    const seeded = new Set(Array.isArray(state.seededIds) ? state.seededIds.map(String) : []);
    const existing = new Map(core.gachaItems.map(item => [String(item.id), item]));
    let added = 0;

    Object.entries(packs).forEach(([groupId, cards]) => {
      cards.forEach(raw => {
        const id = String(raw?.id || '');
        if (!id) return;

        // Previously seeded cards are user-managed from this point onward. If a user
        // deliberately deletes one, do not silently restore it on every page load.
        if (seeded.has(id)) return;

        if (!existing.has(id)) {
          const card = {
            id,
            name:String(raw.name || '이야기 카드'),
            symbol:String(raw.symbol || '✦').slice(0,4),
            rarity:String(raw.rarity || 'SKY'),
            color:/^#[0-9a-f]{6}$/i.test(String(raw.color || '')) ? String(raw.color) : '#829fda',
            weight:Math.max(0.01, Number(raw.weight) || 0.08),
            shortNote:String(raw.shortNote || ''),
            relatedSeriesId:null,
            description:String(raw.description || ''),
            imageUrl:null,
          };
          core.gachaItems.push(card);
          existing.set(id, card);
          added += 1;
        }

        if (!meta.itemMeta[id]) {
          meta.itemMeta[id] = {
            groupId,
            type:raw.type === 'item' ? 'item' : 'card',
            imageUrl:'',
            includeInCompletion:true,
          };
        }
        seeded.add(id);
      });
    });

    state.version = 1;
    state.seededIds = [...seeded];
    state.seededAt = state.seededAt || new Date().toISOString();
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

    window.PIXELY_STORY_CARDS = Object.entries(packs).flatMap(([groupId,cards]) => cards.map(card => ({...card,groupId})));
    window.dispatchEvent(new CustomEvent('pixely:story-cards-seeded', {detail:{added,total:state.total}}));

    if (added > 0) {
      [80,240,700].forEach(delay => setTimeout(() => {
        const tab = document.querySelector('[data-tab="collection"]');
        const panel = document.querySelector('[data-panel="collection"]');
        if (tab && panel && !panel.hidden) tab.click();
      }, delay));
    }
  }

  window.PIXELY_STORY_PACK = { register, seed, get packs(){ return packs; } };
})();