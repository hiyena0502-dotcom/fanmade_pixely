(() => {
  if (window.__PIXELY_MEMBER_ORDER_V2__) return;
  window.__PIXELY_MEMBER_ORDER_V2__ = true;

  const SAVE_KEY = 'pixely-diary-save-v1';

  // Site-wide canonical PIXELY order: red → orange → yellow → green → sky blue → purple.
  const MEMBERS = [
    { id:'ra',   name:'라더', color:'#df5f68', tone:'붉은빛' },
    { id:'deok', name:'덕개', color:'#ed9852', tone:'주황빛' },
    { id:'gak',  name:'각별', color:'#e7c64f', tone:'노란빛' },
    { id:'gong', name:'공룡', color:'#72b978', tone:'초록빛' },
    { id:'jam',  name:'잠뜰', color:'#73bff0', tone:'하늘빛' },
    { id:'soo',  name:'수현', color:'#9a7ed8', tone:'보랏빛' },
  ];

  const ORDER = new Map(MEMBERS.map((member, index) => [member.id, index]));
  const BY_ID = new Map(MEMBERS.map(member => [member.id, member]));
  const BY_NAME = new Map(MEMBERS.map(member => [member.name, member]));

  window.PIXELY_MEMBERS = MEMBERS.map(member => ({ ...member }));
  window.PIXELY_MEMBER_ORDER = MEMBERS.map(member => member.id);

  function readSave() {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }

  function normalizeItems(items) {
    if (!Array.isArray(items)) return items;

    items.forEach(item => {
      const member = BY_ID.get(item?.id);
      if (!member) return;
      item.name = member.name;
      item.color = member.color;
      item.shortNote = `${member.tone} 멤버 카드`;
    });

    const memberItems = items
      .filter(item => ORDER.has(item?.id))
      .sort((a, b) => ORDER.get(a.id) - ORDER.get(b.id));
    const otherItems = items.filter(item => !ORDER.has(item?.id));
    return [...memberItems, ...otherItems];
  }

  function syncData() {
    const stored = readSave();
    if (Array.isArray(stored.gachaItems)) {
      stored.gachaItems = normalizeItems(stored.gachaItems);
      localStorage.setItem(SAVE_KEY, JSON.stringify(stored));
    }

    // script.js keeps its own in-memory save object. Keep it in sync so a later persistSave()
    // cannot put the old colors/order back into localStorage.
    try {
      if (typeof save !== 'undefined' && save && Array.isArray(save.gachaItems)) {
        save.gachaItems = normalizeItems(save.gachaItems);
        if (typeof persistSave === 'function') persistSave();
      }
    } catch {}

    // Also correct the defaults used by reset/new-save flows.
    try {
      if (typeof defaultGachaItems !== 'undefined' && Array.isArray(defaultGachaItems)) {
        const sorted = normalizeItems(defaultGachaItems);
        defaultGachaItems.splice(0, defaultGachaItems.length, ...sorted);
      }
    } catch {}
  }

  function reorderHomeDots() {
    const wrap = document.querySelector('.member-dots');
    if (!wrap) return;
    const dots = [...wrap.querySelectorAll('.member-dot')];
    const byName = new Map(dots.map(dot => [dot.getAttribute('title') || dot.textContent.trim(), dot]));

    MEMBERS.forEach(member => {
      const dot = byName.get(member.name);
      if (!dot) return;
      dot.style.setProperty('background', member.color, 'important');
      dot.style.order = String(ORDER.get(member.id));
      wrap.appendChild(dot);
    });
  }

  function fixLegacyCards(root = document) {
    root.querySelectorAll?.('.collection-card').forEach(card => {
      const id = card.getAttribute('data-gc-item');
      let member = id ? BY_ID.get(id) : null;
      if (!member) member = MEMBERS.find(item => (card.textContent || '').includes(item.name));
      if (!member) return;
      card.style.setProperty('--card-color', member.color);
      card.style.setProperty('--entry-color', member.color);
    });
  }

  function fixGroupedPixely() {
    const groups = [...document.querySelectorAll('.gc-group')];
    const pixelyGroup = groups.find(group => group.querySelector('.gc-group-head h3')?.textContent.trim() === '픽셀리');
    if (!pixelyGroup) return;

    const grid = pixelyGroup.querySelector('.gc-grid');
    if (!grid) return;

    const cards = [...grid.children].filter(node => node.matches?.('[data-gc-item]'));
    const memberCards = new Map();

    cards.forEach(card => {
      const id = card.getAttribute('data-gc-item');
      const member = BY_ID.get(id);
      if (!member) return;
      memberCards.set(id, card);
      card.style.setProperty('--entry-color', member.color);
      card.style.setProperty('--card-color', member.color);
    });

    const desired = [
      ...MEMBERS.map(member => memberCards.get(member.id)).filter(Boolean),
      ...cards.filter(card => !ORDER.has(card.getAttribute('data-gc-item'))),
    ];
    const current = cards.map(card => card.getAttribute('data-gc-item')).join('|');
    const next = desired.map(card => card.getAttribute('data-gc-item')).join('|');
    if (current !== next) desired.forEach(card => grid.appendChild(card));
  }

  function fixVisibleUi() {
    reorderHomeDots();
    fixLegacyCards(document);
    fixGroupedPixely();
  }

  function scheduleFixes() {
    [0, 60, 180, 500].forEach(delay => setTimeout(fixVisibleUi, delay));
  }

  function boot() {
    syncData();
    scheduleFixes();

    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="collection"], [data-open-tab="collection"], [data-go-home]')) scheduleFixes();
    });

    window.addEventListener('storage', event => {
      if (event.key === SAVE_KEY) {
        syncData();
        scheduleFixes();
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();