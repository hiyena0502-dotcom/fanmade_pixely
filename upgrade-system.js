(() => {
  if (window.__PIXELY_UPGRADE_SYSTEM_V1__) return;
  window.__PIXELY_UPGRADE_SYSTEM_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const APPLIED_KEY = 'pixely-upgrade-applied-v1';
  const MAX_LEVEL = 10;
  const POWERS = [1,2,3,5,7,10,15,20,30,50];
  const NEED = [3,5,7,9,12,15,19,24,30];

  const CARDS = [
    { id:'upgrade-stardust-chip', name:'작은 별조각 카드', symbol:'✦', rarity:'CLOUD', color:'#9bc7e8', weight:5.5, shortNote:'CLICK EXP +1', description:'클릭커를 조금 성장시키는 작은 별조각 카드예요.', exp:1 },
    { id:'upgrade-shining-star', name:'빛나는 별조각 카드', symbol:'✧', rarity:'SKY', color:'#8f9fe8', weight:3.2, shortNote:'CLICK EXP +2', description:'반짝이는 별조각의 힘으로 CLICK EXP를 2 올려요.', exp:2 },
    { id:'upgrade-star-crystal', name:'별의 결정 카드', symbol:'◆', rarity:'STAR', color:'#a785dc', weight:1.5, shortNote:'CLICK EXP +4', description:'응축된 별의 결정. CLICK EXP를 4 올려요.', exp:4 },
    { id:'upgrade-rainbow-crystal', name:'무지개 결정 카드', symbol:'✦', rarity:'RAINBOW', color:'#e08fc9', weight:.45, shortNote:'CLICK EXP +8', description:'아주 희귀한 성장 카드. CLICK EXP를 8 올려요.', exp:8 },
  ];

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
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function seedCards() {
    const core = getCore();
    let changed = false;
    for (const card of CARDS) {
      if (!core.gachaItems.some(item => item.id === card.id)) {
        core.gachaItems.push({
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
        });
        changed = true;
      }
    }
    if (changed) {
      write(CORE_KEY, core);
      try {
        if (typeof save !== 'undefined' && save && Array.isArray(save.gachaItems)) {
          for (const card of CARDS) {
            if (!save.gachaItems.some(item => item.id === card.id)) {
              save.gachaItems.push({
                id:card.id,name:card.name,symbol:card.symbol,rarity:card.rarity,color:card.color,weight:card.weight,
                shortNote:card.shortNote,relatedSeriesId:null,description:card.description,imageUrl:null
              });
            }
          }
          if (typeof persistSave === 'function') persistSave();
        }
      } catch {}
    }

    const meta = read(META_KEY, { version:2, groups:[], itemMeta:{}, bonusItems:[], bonusOwned:{}, unlockLog:[] });
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    if (!meta.groups.some(group => group.id === 'click-growth')) {
      const etcIndex = meta.groups.findIndex(group => group.id === 'etc');
      const group = { id:'click-growth', name:'클릭 성장', subtitle:'CLICK UPGRADE', icon:'⬆', color:'#9b8ee8', rewardId:'', alwaysVisible:true };
      if (etcIndex >= 0) meta.groups.splice(etcIndex,0,group); else meta.groups.push(group);
    }
    for (const card of CARDS) {
      meta.itemMeta[card.id] = { ...(meta.itemMeta[card.id] || {}), groupId:'click-growth', type:'card', imageUrl:'', includeInCompletion:true };
    }
    write(META_KEY, meta);
  }

  function levelUp(game) {
    let levels = 0;
    while (game.clickLevel < MAX_LEVEL) {
      const need = NEED[game.clickLevel - 1];
      if (game.clickExp < need) break;
      game.clickExp -= need;
      game.clickLevel += 1;
      levels += 1;
    }
    game.clickPower = POWERS[game.clickLevel - 1];
    return levels;
  }

  function applyUpgrade(card, token) {
    const applied = read(APPLIED_KEY, {});
    if (applied[token]) return;
    applied[token] = Date.now();
    const keys = Object.keys(applied);
    if (keys.length > 80) keys.sort((a,b)=>applied[b]-applied[a]).slice(80).forEach(key => delete applied[key]);
    write(APPLIED_KEY, applied);

    const game = getGame();
    game.clickExp += card.exp;
    const gained = levelUp(game);
    saveGame(game);
    refreshClickUi();

    if (gained > 0) toast(`LEVEL UP! CLICK Lv.${game.clickLevel} · 터치 파워 +${game.clickPower}`);
    else toast(`${card.name} 획득! CLICK EXP +${card.exp}`);

    const title = $('#result-title');
    const copy = $('#result-copy');
    if (title) title.textContent = gained > 0 ? `CLICK Lv.${game.clickLevel} 달성!` : '성장 카드를 얻었어요!';
    if (copy) copy.textContent = gained > 0 ? `터치 파워가 +${game.clickPower}로 상승했어요.` : `CLICK EXP +${card.exp}`;
  }

  function handleResult() {
    const modal = $('#result-modal');
    if (!modal || modal.hidden) return;
    const core = getCore();
    const id = core.lastCardId;
    const card = CARDS.find(item => item.id === id);
    if (!card) return;
    const count = Number(core.owned[id] || 0);
    applyUpgrade(card, `${id}:${count}`);
  }

  function refreshClickUi() {
    const game = getGame();
    const need = game.clickLevel >= MAX_LEVEL ? 0 : NEED[game.clickLevel - 1];
    $$('[data-pcf-power]').forEach(el => el.textContent = `+${game.clickPower}`);
    $$('[data-pcf-button-power]').forEach(el => el.textContent = `+${game.clickPower} / TOUCH`);
    $$('[data-upgrade-level]').forEach(el => el.textContent = `Lv.${game.clickLevel}`);
    $$('[data-upgrade-exp]').forEach(el => el.textContent = game.clickLevel >= MAX_LEVEL ? 'MAX' : `${game.clickExp} / ${need}`);
    $$('[data-upgrade-bar]').forEach(el => el.style.width = game.clickLevel >= MAX_LEVEL ? '100%' : `${Math.min(100, (game.clickExp / need) * 100)}%`);
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
        <div class="pcf-upgrade-exp"><span><i data-upgrade-bar></i></span><small data-upgrade-exp>0 / 3</small></div>`;
      stats.appendChild(card);
    }
    refreshClickUi();
  }

  function installStyle() {
    if ($('#pixely-upgrade-style')) return;
    const style = document.createElement('style');
    style.id = 'pixely-upgrade-style';
    style.textContent = `
      .pcf-upgrade-card{grid-column:1/-1;padding:14px 15px;border:1px solid #deddf2;border-radius:15px;background:linear-gradient(135deg,#f7f7ff,#fff5fb)}
      .pcf-upgrade-card>div:first-child{display:flex;align-items:center;justify-content:space-between;gap:10px}.pcf-upgrade-card small{color:#8b8eaa;font-size:10px;font-weight:900;letter-spacing:.08em}.pcf-upgrade-card b{color:#6c6ba5;font-size:15px}
      .pcf-upgrade-exp{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:center;margin-top:10px}.pcf-upgrade-exp>span{height:8px;border-radius:99px;background:#e7e7f2;overflow:hidden}.pcf-upgrade-exp i{display:block;height:100%;width:0;border-radius:inherit;background:linear-gradient(90deg,#66c3ef,#908be8,#e78db9);transition:width .25s ease}
    `;
    document.head.appendChild(style);
  }

  function boot() {
    installStyle();
    seedCards();
    const modal = $('#result-modal');
    if (modal) new MutationObserver(() => { if (!modal.hidden) setTimeout(handleResult, 0); }).observe(modal,{attributes:true,attributeFilter:['hidden']});
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"], #pixely-click-star')) setTimeout(decorateClick, 0);
    });
    setTimeout(decorateClick, 120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot,{once:true});
  else boot();
})();