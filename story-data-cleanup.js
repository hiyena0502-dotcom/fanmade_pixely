(() => {
  if (window.__PIXELY_STORY_DATA_CLEANUP_V1__) return;
  window.__PIXELY_STORY_DATA_CLEANUP_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const STATE_KEY = 'pixely-story-card-pack-v1';
  const EXCLUDED = new Set(['도티','쵸쵸우','코아','연다']);
  const CHARACTER_EMOJI = {
    '잠뜰':'🌙','각별':'⭐','라더':'🔥','덕개':'🐾','공룡':'🦖','수현':'💜'
  };
  const GROUP_EMOJI = {
    'story-psychic-lab':'🧪',
    'story-ddl-detective':'🔎',
    'story-makis-maze':'🧭',
    'story-atlantis':'🌊',
    'story-three-siblings':'👨‍👩‍👧',
    'story-night-eyes':'🌙',
    'story-operation-black':'🕶️',
    'story-star-child':'⭐',
    'story-water-flag':'🌊',
    'story-winter-myth':'❄️',
    'story-revolution':'🚩',
    'story-steel-heart':'🤖',
    'story-psychic-world-tour':'🌍',
    'story-outsider':'🚪',
    'story-sunny-side-town':'☀️',
    'story-galaxy-store':'🌌',
    'story-suspicious-neighbor':'🏠',
    'story-blind':'👁️',
    'story-mystery-investigation':'🕵️',
    'story-3days':'📅',
    'story-school-seven-mysteries':'🏫',
    'story-dead-fathers':'☠️',
    'story-labyrinth':'🧩',
    'story-neighbor-zombie':'🧟',
    'story-lady-young-master':'🎀',
    'story-runners':'🏃',
    'story-underweb':'🕸️'
  };

  const read = (key, fallback={}) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const rename = value => String(value ?? '').replaceAll('칠각별','각별');

  function emojiFor(item, type='card') {
    const name = rename(item?.name || '');
    if (CHARACTER_EMOJI[name]) return CHARACTER_EMOJI[name];
    if (name.includes('이야기 기록')) return '📖';
    const text = `${name} ${item?.shortNote || ''} ${item?.description || ''}`;
    const rules = [
      [/보석|결정|크리스탈/,'💎'],[/열쇠/,'🔑'],[/펜던트|목걸이/,'📿'],[/디스크|백업/,'💾'],
      [/리시버|무전|라디오/,'📻'],[/연구소|실험|시약|약품/,'🧪'],[/탐정|수사|사건|단서/,'🔎'],
      [/사당|신전/,'⛩️'],[/미로|미궁/,'🧭'],[/숲|나무/,'🌲'],[/바다|해역|물|아뜰란티스/,'🌊'],
      [/별|은하|우주/,'⭐'],[/겨울|눈|얼음/,'❄️'],[/왕관|왕|황제/,'👑'],[/검|칼|무기/,'⚔️'],
      [/기계|로봇|스틸|장치/,'🤖'],[/세계|여행|지도/,'🌍'],[/학교|교실/,'🏫'],[/좀비/,'🧟'],
      [/죽음|데드|해골/,'☠️'],[/웹|인터넷|거미/,'🕸️'],[/편지|우편/,'✉️'],[/사진|카메라/,'📷'],
      [/전화|휴대폰/,'📱'],[/컴퓨터|노트북/,'💻'],[/시계|시간/,'⏳'],[/책|기록|일지|파일/,'📚'],
      [/집|마을|타운|이웃/,'🏠'],[/상점|잡화점|가게/,'🛍️'],[/혁명|깃발|플래그/,'🚩'],
      [/블랙|작전|요원/,'🕶️'],[/문|입구|이방인/,'🚪'],[/밤|달/,'🌙'],[/아이|아이들/,'🧒']
    ];
    for (const [pattern, emoji] of rules) if (pattern.test(text)) return emoji;
    return type === 'item' ? '🎒' : '👤';
  }

  function clean() {
    const core = read(CORE_KEY, {});
    const meta = read(META_KEY, {});
    const state = read(STATE_KEY, {});
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    core.owned = core.owned && typeof core.owned === 'object' ? core.owned : {};
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];

    const removedIds = new Set();
    core.gachaItems = core.gachaItems.filter(item => {
      const id = String(item?.id || '');
      if (!id.startsWith('storycard-')) return true;
      item.name = rename(item.name);
      item.shortNote = rename(item.shortNote);
      item.description = rename(item.description);
      if (EXCLUDED.has(item.name)) {
        removedIds.add(id);
        return false;
      }
      const type = meta.itemMeta[id]?.type === 'item' ? 'item' : 'card';
      item.symbol = emojiFor(item, type);
      return true;
    });

    removedIds.forEach(id => {
      delete core.owned[id];
      delete meta.itemMeta[id];
      if (core.lastCardId === id) core.lastCardId = null;
    });

    meta.groups.forEach(group => {
      if (GROUP_EMOJI[group?.id]) group.icon = GROUP_EMOJI[group.id];
    });

    if (Array.isArray(state.seededIds)) {
      state.seededIds = state.seededIds.filter(id => !removedIds.has(String(id)));
    }
    state.cleanupVersion = 1;
    state.cleanedAt = new Date().toISOString();

    write(CORE_KEY, core);
    write(META_KEY, meta);
    write(STATE_KEY, state);

    try {
      if (typeof save !== 'undefined' && save) {
        save.gachaItems = core.gachaItems;
        save.owned = core.owned;
        if (typeof persistSave === 'function') persistSave();
      }
    } catch {}

    window.dispatchEvent(new CustomEvent('pixely:story-data-cleaned', { detail:{ removed:[...removedIds] } }));
  }

  window.addEventListener('pixely:story-cards-seeded', clean);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(clean, 150), {once:true});
  else setTimeout(clean, 150);
})();