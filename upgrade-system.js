(() => {
  if (window.__PIXELY_UPGRADE_SYSTEM_V3__) return;
  window.__PIXELY_UPGRADE_SYSTEM_V3__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const APPLIED_KEY = 'pixely-upgrade-applied-v2';
  const MAX_LEVEL = 10;
  const POWERS = [1,2,3,5,7,10,15,20,30,50];
  const NEED = [3,5,7,9,12,15,19,24,30];

  const LEGACY_CARDS = [
    { id:'upgrade-stardust-chip', name:'작은 별조각 카드', exp:1 },
    { id:'upgrade-shining-star', name:'빛나는 별조각 카드', exp:2 },
    { id:'upgrade-star-crystal', name:'별의 결정 카드', exp:4 },
    { id:'upgrade-rainbow-crystal', name:'무지개 결정 카드', exp:8 },
  ];
  const LEGACY_IDS = new Set(LEGACY_CARDS.map(card => card.id));

  const STAGE_CARDS = [
    { stage:1, id:'level-up-card-1', name:'LEVEL UP CARD · Lv.1', symbol:'Ⅰ', rarity:'CLOUD', color:'#9bc7e8', weight:4.8, exp:3 },
    { stage:2, id:'level-up-card-2', name:'LEVEL UP CARD · Lv.2', symbol:'Ⅱ', rarity:'CLOUD', color:'#8fc3e9', weight:4.3, exp:5 },
    { stage:3, id:'level-up-card-3', name:'LEVEL UP CARD · Lv.3', symbol:'Ⅲ', rarity:'SKY', color:'#8fa7e8', weight:3.7, exp:7 },
    { stage:4, id:'level-up-card-4', name:'LEVEL UP CARD · Lv.4', symbol:'Ⅳ', rarity:'SKY', color:'#9699e8', weight:3.2, exp:9 },
    { stage:5, id:'level-up-card-5', name:'LEVEL UP CARD · Lv.5', symbol:'Ⅴ', rarity:'STAR', color:'#a88ade', weight:2.7, exp:12 },
    { stage:6, id:'level-up-card-6', name:'LEVEL UP CARD · Lv.6', symbol:'Ⅵ', rarity:'STAR', color:'#b080dc', weight:2.25, exp:15 },
    { stage:7, id:'level-up-card-7', name:'LEVEL UP CARD · Lv.7', symbol:'Ⅶ', rarity:'STAR', color:'#c27fd6', weight:1.85, exp:19 },
    { stage:8, id:'level-up-card-8', name:'LEVEL UP CARD · Lv.8', symbol:'Ⅷ', rarity:'RAINBOW', color:'#d887cf', weight:1.35, exp:24 },
    { stage:9, id:'level-up-card-9', name:'LEVEL UP CARD · Lv.9', symbol:'Ⅸ', rarity:'RAINBOW', color:'#e88fc3', weight:.9, exp:30 },
  ].map(card => ({
    ...card,
    shortNote:`Lv.${card.stage} → Lv.${card.stage + 1} · CLICK EXP +${card.exp}`,
    description:`순차 레벨업 카드예요. CLICK Lv.${card.stage}일 때만 가챠에서 등장하며, 획득하면 CLICK EXP +${card.exp}가 정확히 적용됩니다.`
  }));
  const STAGE_IDS = new Set(STAGE_CARDS.map(card => card.id));
  const ALL_UPGRADE_IDS = new Set([...LEGACY_IDS, ...STAGE_IDS]);

  window.PIXELY_LEVEL_UP_CARDS = STAGE_CARDS.map(card => ({ ...card }));

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function read(key, fallback={}) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function getCore() {
    const core = read(CORE_KEY, {});
    core.owned = core.owned && typeof core.owned === 'object' ? core.owned : {};
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    core.dust = Math.max(0, Number(core.dust) || 0);
    return core;
  }

  function getGame() {
    const game = { clickLevel:1, clickExp:0, clickPower:1, totalClicks:0, highestCombo:0, combo:0, lastClickAt:0, ...read(GAME_KEY,{}) };
    game.clickLevel = Math.min(MAX_LEVEL, Math.max(1, Number(game.clickLevel) || 1));
    game.clickExp = Math.max(0, Number(game.clickExp) || 0);
    const need = game.clickLevel < MAX_LEVEL ? NEED[game.clickLevel - 1] : 0;
    if (need > 0 && game.clickExp >= need) game.clickExp = Math.max(0, need - 1);
    game.clickPower = POWERS[game.clickLevel - 1];
    return game;
  }

  function saveGame(game) {
    game.clickPower = POWERS[Math.max(0, Math.min(MAX_LEVEL - 1, game.clickLevel - 1))];
    write(GAME_KEY, game);
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2400);
  }

  function stageCardForLevel(level) {
    return level >= MAX_LEVEL ? null : STAGE_CARDS[level - 1] || null;
  }

  function toGachaItem(card) {
    return {
      id:card.id,
      name:card.name,
      symbol:card.symbol,
      rarity:card.rarity,
      color:card.color,
      weight:card.weight,
      shortNote:card.shortNote,
      relatedSeriesId:null,
      description:card.description,
      imageUrl:null,
    };
  }

  function migrateAndSeedCards() {
    const core = getCore();
    let changed = false;

    const filtered = core.gachaItems.filter(item => !LEGACY_IDS.has(item.id) || Number(core.owned[item.id] || 0) > 0);
    if (filtered.length !== core.gachaItems.length) {
      core.gachaItems = filtered;
      changed = true;
    }

    for (const card of STAGE_CARDS) {
      const existing = core.gachaItems.find(item => item.id === card.id);
      if (!existing) {
        core.gachaItems.push(toGachaItem(card));
        changed = true;
      } else {
        Object.assign(existing, toGachaItem(card));
        changed = true;
      }
    }

    if (changed) write(CORE_KEY, core);

    try {
      if (typeof save !== 'undefined' && save && Array.isArray(save.gachaItems)) {
        const owned = save.owned && typeof save.owned === 'object' ? save.owned : core.owned;
        save.gachaItems = save.gachaItems.filter(item => !LEGACY_IDS.has(item.id) || Number(owned[item.id] || 0) > 0);
        for (const card of STAGE_CARDS) {
          const existing = save.gachaItems.find(item => item.id === card.id);
          if (existing) Object.assign(existing, toGachaItem(card));
          else save.gachaItems.push(toGachaItem(card));
        }
        if (typeof persistSave === 'function') persistSave();
      }
    } catch {}

    const meta = read(META_KEY, { version:2, groups:[], itemMeta:{}, bonusItems:[], bonusOwned:{}, unlockLog:[] });
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    if (!meta.groups.some(group => group.id === 'click-growth')) {
      const etcIndex = meta.groups.findIndex(group => group.id === 'etc');
      const group = { id:'click-growth', name:'클릭 성장', subtitle:'LEVEL UP SEQUENCE', icon:'⬆', color:'#9b8ee8', rewardId:'', alwaysVisible:true };
      if (etcIndex >= 0) meta.groups.splice(etcIndex,0,group); else meta.groups.push(group);
    }
    for (const card of STAGE_CARDS) {
      meta.itemMeta[card.id] = { ...(meta.itemMeta[card.id] || {}), groupId:'click-growth', type:'card', imageUrl:'', includeInCompletion:true };
    }
    for (const card of LEGACY_CARDS) {
      if (meta.itemMeta[card.id]) meta.itemMeta[card.id].includeInCompletion = false;
    }
    write(META_KEY, meta);
  }

  function weightedPick(items) {
    if (!items.length) return null;
    const total = items.reduce((sum, item) => sum + Math.max(0, Number(item.weight) || 0), 0);
    if (total <= 0) return items[Math.floor(Math.random() * items.length)] || null;
    let value = Math.random() * total;
    for (const item of items) {
      value -= Math.max(0, Number(item.weight) || 0);
      if (value <= 0) return item;
    }
    return items[items.length - 1] || null;
  }

  function installSequentialPicker() {
    if (window.__PIXELY_SEQUENTIAL_PICKER__) return;
    window.__PIXELY_SEQUENTIAL_PICKER__ = true;
    const original = typeof window.pickCard === 'function' ? window.pickCard : null;

    window.pickCard = function sequentialPickCard() {
      let items = [];
      try {
        if (typeof save !== 'undefined' && save && Array.isArray(save.gachaItems)) items = save.gachaItems;
      } catch {}
      if (!items.length) items = getCore().gachaItems;
      if (!items.length) return original ? original() : null;

      const game = getGame();
      const allowedUpgradeId = stageCardForLevel(game.clickLevel)?.id || null;
      const eligible = items.filter(item => {
        if (!ALL_UPGRADE_IDS.has(item.id)) return true;
        return item.id === allowedUpgradeId;
      });
      return weightedPick(eligible);
    };
  }

  function applyExpCard(card, token, { sequential=false } = {}) {
    const applied = read(APPLIED_KEY, {});
    if (applied[token]) return;
    applied[token] = Date.now();
    const keys = Object.keys(applied);
    if (keys.length > 100) keys.sort((a,b)=>applied[b]-applied[a]).slice(100).forEach(key => delete applied[key]);
    write(APPLIED_KEY, applied);

    const game = getGame();
    const beforeLevel = game.clickLevel;
    const beforeExp = game.clickExp;
    const beforeNeed = beforeLevel < MAX_LEVEL ? NEED[beforeLevel - 1] : 0;
    const addedExp = Number(card.exp) || 0;

    game.clickExp += addedExp;
    let gained = 0;
    while (game.clickLevel < MAX_LEVEL) {
      const need = NEED[game.clickLevel - 1];
      if (game.clickExp < need) break;
      game.clickExp -= need;
      game.clickLevel += 1;
      gained += 1;
      if (sequential) break;
    }
    game.clickPower = POWERS[game.clickLevel - 1];
    saveGame(game);
    refreshClickUi();

    const title = $('#result-title');
    const copy = $('#result-copy');
    if (gained > 0) {
      const nextNeed = game.clickLevel < MAX_LEVEL ? NEED[game.clickLevel - 1] : 0;
      if (title) title.textContent = `LEVEL UP! CLICK Lv.${game.clickLevel}`;
      if (copy) copy.textContent = game.clickLevel >= MAX_LEVEL
        ? `CLICK EXP +${addedExp} 정확히 적용 · MAX LEVEL 달성 · 터치 파워 +${game.clickPower}`
        : `CLICK EXP +${addedExp} 정확히 적용 · 레벨업 비용 ${beforeNeed} 사용 · 남은 EXP ${game.clickExp} / ${nextNeed}`;
      toast(`EXP +${addedExp} 적용 → CLICK Lv.${game.clickLevel} · 터치 파워 +${game.clickPower}`);
    } else {
      if (title) title.textContent = '성장 EXP가 적용됐어요!';
      if (copy) copy.textContent = `CLICK EXP +${addedExp} 정확히 적용 · ${beforeExp} → ${game.clickExp} / ${beforeNeed}`;
      toast(`${card.name} · CLICK EXP +${addedExp} 적용`);
    }
  }

  function handleResult() {
    const modal = $('#result-modal');
    if (!modal || modal.hidden) return;
    const core = getCore();
    const id = core.lastCardId;
    const stageCard = STAGE_CARDS.find(item => item.id === id);
    const legacyCard = LEGACY_CARDS.find(item => item.id === id);
    const card = stageCard || legacyCard;
    if (!card) return;
    const count = Number(core.owned[id] || 0);
    applyExpCard(card, `${id}:${count}`, { sequential: !!stageCard });
  }

  function refreshClickUi() {
    const game = getGame();
    const need = game.clickLevel >= MAX_LEVEL ? 0 : NEED[game.clickLevel - 1];
    const next = stageCardForLevel(game.clickLevel);
    $$('[data-pcf-power]').forEach(el => el.textContent = `+${game.clickPower}`);
    $$('[data-pcf-button-power]').forEach(el => el.textContent = `+${game.clickPower} / TOUCH`);
    $$('[data-upgrade-level]').forEach(el => el.textContent = `Lv.${game.clickLevel}`);
    $$('[data-upgrade-exp]').forEach(el => el.textContent = game.clickLevel >= MAX_LEVEL ? 'MAX' : `${game.clickExp} / ${need}`);
    $$('[data-upgrade-bar]').forEach(el => el.style.width = game.clickLevel >= MAX_LEVEL ? '100%' : `${Math.min(100, (game.clickExp / need) * 100)}%`);
    $$('[data-next-level-card]').forEach(el => el.textContent = next ? `다음 후보 · Lv.${next.stage} 카드 · EXP +${next.exp}` : '모든 레벨업 카드 완료');
  }

  function decorateClick() {
    const overlay = $('#pixely-click-fixed');
    if (!overlay || overlay.hidden) return;
    const stats = $('.pcf-stats', overlay);
    if (stats && !$('.pcf-upgrade-card', stats)) {
      const card = document.createElement('div');
      card.className = 'pcf-upgrade-card';
      card.innerHTML = `
        <div><small>CLICK UPGRADE</small><b data-upgrade-level>Lv.1</b></div>
        <div class="pcf-upgrade-exp"><span><i data-upgrade-bar></i></span><small data-upgrade-exp>0 / 3</small></div>
        <p data-next-level-card>다음 후보 · Lv.1 카드 · EXP +3</p>`;
      stats.appendChild(card);
    }
    refreshClickUi();
  }

  function installStyle() {
    if ($('#pixely-upgrade-style-v2')) return;
    document.getElementById('pixely-upgrade-style')?.remove();
    const style = document.createElement('style');
    style.id = 'pixely-upgrade-style-v2';
    style.textContent = `
      .pcf-upgrade-card{grid-column:1/-1;padding:14px 15px;border:1px solid #deddf2;border-radius:15px;background:linear-gradient(135deg,#f7f7ff,#fff5fb)}
      .pcf-upgrade-card>div:first-child{display:flex;align-items:center;justify-content:space-between;gap:10px}.pcf-upgrade-card small{color:#8b8eaa;font-size:10px;font-weight:900;letter-spacing:.08em}.pcf-upgrade-card b{color:#6c6ba5;font-size:15px}
      .pcf-upgrade-exp{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:center;margin-top:10px}.pcf-upgrade-exp>span{height:8px;border-radius:99px;background:#e7e7f2;overflow:hidden}.pcf-upgrade-exp i{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#66c3ef,#908be8,#e78db9);transition:width .25s ease}
      .pcf-upgrade-card p{margin:9px 0 0;color:#8d829f;font-size:10px;font-weight:800;letter-spacing:.02em}
    `;
    document.head.appendChild(style);
  }

  function loadClickReset() {
    if (document.querySelector('script[data-click-reset-loader]')) return;
    const script = document.createElement('script');
    script.src = 'click-reset.js?v=1';
    script.async = false;
    script.setAttribute('data-click-reset-loader', '');
    document.head.appendChild(script);
  }

  function boot() {
    installStyle();
    migrateAndSeedCards();
    installSequentialPicker();
    loadClickReset();
    const modal = $('#result-modal');
    if (modal) new MutationObserver(() => { if (!modal.hidden) setTimeout(handleResult, 0); }).observe(modal,{attributes:true,attributeFilter:['hidden']});
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"], #pixely-click-star')) setTimeout(decorateClick, 0);
    });
    window.addEventListener('pixely:click-upgrade-reset', () => setTimeout(refreshClickUi, 0));
    setTimeout(decorateClick, 120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot,{once:true});
  else boot();
})();