(() => {
  if (window.__PIXELY_MEMBER_ORDER_V1__) return;
  window.__PIXELY_MEMBER_ORDER_V1__ = true;

  const SAVE_KEY = 'pixely-diary-save-v1';
  const MEMBERS = [
    { id:'ra',   name:'라더', color:'#df747b', tone:'RED' },
    { id:'deok', name:'덕개', color:'#df9c68', tone:'ORANGE' },
    { id:'gak',  name:'각별', color:'#e5bd50', tone:'YELLOW' },
    { id:'gong', name:'공룡', color:'#83bd82', tone:'GREEN' },
    { id:'jam',  name:'잠뜰', color:'#79bff2', tone:'SKY BLUE' },
    { id:'soo',  name:'수현', color:'#9b8ee8', tone:'PURPLE' },
  ];
  const ORDER = new Map(MEMBERS.map((member, index) => [member.id, index]));
  const MEMBER_BY_ID = new Map(MEMBERS.map(member => [member.id, member]));
  const MEMBER_BY_NAME = new Map(MEMBERS.map(member => [member.name, member]));

  window.PIXELY_MEMBERS = MEMBERS.map(member => ({ ...member }));
  window.PIXELY_MEMBER_ORDER = MEMBERS.map(member => member.id);

  function readSave() {
    try {
      const value = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }

  function migrateSavedCards() {
    const save = readSave();
    if (!Array.isArray(save.gachaItems)) return;

    let changed = false;
    save.gachaItems.forEach(item => {
      const member = MEMBER_BY_ID.get(item?.id);
      if (!member) return;
      if (item.color !== member.color) {
        item.color = member.color;
        changed = true;
      }
      const note = `${member.tone === 'SKY BLUE' ? '하늘빛' : member.tone === 'PURPLE' ? '보랏빛' : member.tone === 'RED' ? '붉은빛' : member.tone === 'ORANGE' ? '주황빛' : member.tone === 'YELLOW' ? '노란빛' : '초록빛'} 멤버 카드`;
      if (item.shortNote !== note) {
        item.shortNote = note;
        changed = true;
      }
    });

    const original = save.gachaItems.map(item => item?.id).join('|');
    const members = save.gachaItems
      .filter(item => ORDER.has(item?.id))
      .sort((a, b) => ORDER.get(a.id) - ORDER.get(b.id));
    const others = save.gachaItems.filter(item => !ORDER.has(item?.id));
    const sorted = [...members, ...others];
    if (sorted.map(item => item?.id).join('|') !== original) {
      save.gachaItems = sorted;
      changed = true;
    }

    if (changed) localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  }

  function reorderHomeDots() {
    const wrap = document.querySelector('.member-dots');
    if (!wrap) return;
    const dots = [...wrap.querySelectorAll('.member-dot')];
    const byName = new Map(dots.map(dot => [dot.getAttribute('title') || dot.textContent.trim(), dot]));
    MEMBERS.forEach(member => {
      const dot = byName.get(member.name);
      if (!dot) return;
      dot.style.background = member.color;
      dot.style.order = String(ORDER.get(member.id));
      wrap.appendChild(dot);
    });
  }

  function recolorVisibleMemberCards(root = document) {
    const cards = root.querySelectorAll?.('.collection-card') || [];
    cards.forEach(card => {
      const text = card.textContent || '';
      const member = MEMBERS.find(item => text.includes(item.name));
      if (!member) return;
      card.style.setProperty('--card-color', member.color);
    });
  }

  function boot() {
    migrateSavedCards();
    reorderHomeDots();
    recolorVisibleMemberCards();

    const collection = document.querySelector('#collection-spreads');
    if (collection) {
      new MutationObserver(() => recolorVisibleMemberCards(collection)).observe(collection, { childList:true, subtree:true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();