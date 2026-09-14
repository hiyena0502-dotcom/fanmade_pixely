(() => {
  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const ARCHIVE_KEY = 'pixely-series-archive-v1';
  const ONE_COST = 100;
  const TEN_COST = 950;
  const POWERS = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50];
  const COMBO_REWARDS = { 25: 5, 50: 10, 100: 30, 250: 100 };

  const upgradeItems = [
    { id:'game-upgrade-small', name:'작은 별조각', symbol:'✦', rarity:'CLOUD', color:'#9ebdce', exp:1, shortNote:'CLICK EXP +1', description:'클릭 성장에 사용하는 작은 별조각.' },
    { id:'game-upgrade-shining', name:'빛나는 별조각', symbol:'✧', rarity:'SKY', color:'#79bff2', exp:3, shortNote:'CLICK EXP +3', description:'조금 더 강한 빛을 품은 성장 아이템.' },
    { id:'game-upgrade-crystal', name:'별의 결정', symbol:'◆', rarity:'STAR', color:'#d4ad4d', exp:10, shortNote:'CLICK EXP +10', description:'CLICK LEVEL을 크게 성장시키는 별의 결정.' },
    { id:'game-upgrade-rainbow', name:'무지개 결정', symbol:'◇', rarity:'RAINBOW', color:'#a08bd0', exp:20, shortNote:'CLICK EXP +20', description:'아주 희귀한 고급 성장 아이템.' },
  ];

  const specialItems = [
    { id:'game-special-lucky', name:'LUCKY STAR', symbol:'★', rarity:'STAR', color:'#e2bc55', shortNote:'다음 5회 카드의 고등급 확률 UP', description:'다음 다섯 번의 카드 결과에서 STAR 이상 확률이 올라갑니다.', effect:'lucky' },
    { id:'game-special-double', name:'DOUBLE STAR', symbol:'✦', rarity:'STAR', color:'#82bce2', shortNote:'60초 동안 클릭 별가루 ×2', description:'60초 동안 클릭으로 얻는 별가루가 두 배가 됩니다.', effect:'double' },
    { id:'game-special-fever', name:'FEVER TICKET', symbol:'☄', rarity:'STAR', color:'#e88f98', shortNote:'60초 동안 보너스 클릭 확률 UP', description:'60초 동안 Lucky / Rainbow Click 확률이 조금 더 높아집니다.', effect:'fever' },
    { id:'game-special-rainbow-fragment', name:'RAINBOW FRAGMENT', symbol:'◇', rarity:'RAINBOW', color:'#a98cda', shortNote:'특별 가챠용 조각', description:'향후 RAINBOW 계열 콘텐츠에 사용하는 수집 아이템.', effect:'fragment' },
    { id:'game-special-key', name:'SECRET KEY', symbol:'⚿', rarity:'STAR', color:'#7f8ca8', shortNote:'비밀 콘텐츠의 열쇠', description:'향후 SECRET STORAGE와 히든 콘텐츠 해금에 사용하는 열쇠.', effect:'key' },
  ];
  const GAME_ITEM_IDS = new Set([...upgradeItems, ...specialItems].map(item => item.id));

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function read(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function archiveSeriesOnce(core) {
    if (!Array.isArray(core.seriesItems) || !core.seriesItems.length) return;
    const previous = read(ARCHIVE_KEY, {});
    write(ARCHIVE_KEY, {
      version: 1,
      archivedAt: new Date().toISOString(),
      recentSeriesId: core.recentSeriesId || previous.recentSeriesId || null,
      seriesItems: core.seriesItems,
      gachaSeriesLinks: Array.isArray(core.gachaItems) ? core.gachaItems.filter(x => x?.relatedSeriesId).map(x => ({ id:x.id, relatedSeriesId:x.relatedSeriesId })) : [],
    });
  }

  function coreData() {
    const core = read(CORE_KEY, {});
    core.owned = core.owned && typeof core.owned === 'object' ? core.owned : {};
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    core.seriesItems = Array.isArray(core.seriesItems) ? core.seriesItems : [];
    core.dust = Number.isFinite(core.dust) ? Math.max(0, core.dust) : 0;
    return core;
  }

  function defaultGame() {
    return {
      version: 1,
      clickLevel: 1,
      clickExp: 0,
      clickPower: 1,
      clickStage: 1,
      totalClicks: 0,
      highestCombo: 0,
      combo: 0,
      lastClickAt: 0,
      totalDraws: 0,
      luckyDraws: 0,
      doubleUntil: 0,
      feverUntil: 0,
      inventory: {},
      gachaHistory: [],
      hiddenUnlockHistory: [],
    };
  }

  function gameData() {
    const raw = read(GAME_KEY, defaultGame());
    const game = { ...defaultGame(), ...raw };
    game.clickLevel = Math.max(1, Math.min(10, Number(game.clickLevel) || 1));
    game.clickExp = Math.max(0, Number(game.clickExp) || 0);
    game.clickPower = POWERS[game.clickLevel - 1];
    game.clickStage = stageForLevel(game.clickLevel);
    game.inventory = game.inventory && typeof game.inventory === 'object' ? game.inventory : {};
    game.gachaHistory = Array.isArray(game.gachaHistory) ? game.gachaHistory : [];
    return game;
  }

  function saveGame(game) {
    game.clickPower = POWERS[game.clickLevel - 1];
    game.clickStage = stageForLevel(game.clickLevel);
    write(GAME_KEY, game);
  }

  function stageForLevel(level) {
    if (level >= 10) return 6;
    if (level >= 7) return 5;
    if (level >= 5) return 4;
    if (level >= 3) return 3;
    if (level >= 2) return 2;
    return 1;
  }

  function expNeeded(level) { return level >= 10 ? 0 : level + 2; }

  function syncGlobalCore(core) {
    write(CORE_KEY, core);
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') {
        save.dust = core.dust;
        save.owned = core.owned;
        save.lastCardId = core.lastCardId || null;
        save.seriesItems = [];
        save.recentSeriesId = null;
        if (Array.isArray(save.gachaItems)) {
          const known = new Set(save.gachaItems.map(x => x.id));
          core.gachaItems.forEach(item => { if (!known.has(item.id)) save.gachaItems.push({ ...item }); });
          save.gachaItems.forEach(item => { item.relatedSeriesId = null; });
        }
      }
    } catch {}
  }

  function ensureGameItems() {
    const core = coreData();
    archiveSeriesOnce(core);
    core.seriesItems = [];
    core.recentSeriesId = null;
    core.gachaItems = core.gachaItems.map(item => ({ ...item, relatedSeriesId: null }));
    const known = new Set(core.gachaItems.map(item => item.id));
    [...upgradeItems, ...specialItems].forEach(item => {
      if (!known.has(item.id)) {
        core.gachaItems.push({
          id:item.id, name:item.name, symbol:item.symbol, rarity:item.rarity,
          color:item.color, weight:1, shortNote:item.shortNote,
          relatedSeriesId:null, description:item.description, imageUrl:null,
        });
      }
    });
    syncGlobalCore(core);

    const meta = read(META_KEY, { version:2, groups:[], itemMeta:{}, bonusItems:[], bonusOwned:{}, unlockLog:[] });
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    meta.bonusItems = Array.isArray(meta.bonusItems) ? meta.bonusItems : [];
    meta.bonusOwned = meta.bonusOwned && typeof meta.bonusOwned === 'object' ? meta.bonusOwned : {};
    meta.unlockLog = Array.isArray(meta.unlockLog) ? meta.unlockLog : [];
    if (!meta.groups.some(g => g.id === 'growth')) meta.groups.push({ id:'growth', name:'클릭 성장', subtitle:'CLICK GROWTH', icon:'✦', color:'#79bff2', rewardId:'' });
    if (!meta.groups.some(g => g.id === 'special')) meta.groups.push({ id:'special', name:'특수 아이템', subtitle:'SPECIAL ITEMS', icon:'★', color:'#a08bd0', rewardId:'' });
    upgradeItems.forEach(item => {
      meta.itemMeta[item.id] = { ...(meta.itemMeta[item.id] || {}), groupId:'growth', type:'item', imageUrl:meta.itemMeta[item.id]?.imageUrl || '', includeInCompletion:false };
    });
    specialItems.forEach(item => {
      meta.itemMeta[item.id] = { ...(meta.itemMeta[item.id] || {}), groupId:'special', type:'item', imageUrl:meta.itemMeta[item.id]?.imageUrl || '', includeInCompletion:false };
    });
    write(META_KEY, meta);
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function addDust(amount) {
    const core = coreData();
    core.dust = Math.max(0, core.dust + amount);
    syncGlobalCore(core);
    return core.dust;
  }

  function levelUp(game) {
    let leveled = false;
    while (game.clickLevel < 10) {
      const need = expNeeded(game.clickLevel);
      if (game.clickExp < need) break;
      game.clickExp -= need;
      game.clickLevel += 1;
      leveled = true;
    }
    game.clickPower = POWERS[game.clickLevel - 1];
    game.clickStage = stageForLevel(game.clickLevel);
    return leveled;
  }

  function renderClickPage() {
    const tab = $('[data-tab="series"]');
    const panel = $('[data-panel="series"]');
    if (!tab || !panel) return;
    tab.style.display = '';
    tab.classList.remove('tab--series');
    tab.classList.add('tab--click');
    tab.innerHTML = '<span aria-hidden="true">✦</span><b>CLICK</b>';
    panel.removeAttribute('aria-labelledby');

    let app = $('#pixely-click-app', panel);
    if (!app) {
      const old = $('#series-spreads', panel);
      if (old) old.style.display = 'none';
      app = document.createElement('div');
      app.id = 'pixely-click-app';
      app.className = 'click-app';
      panel.appendChild(app);
    }

    const game = gameData();
    const core = coreData();
    const need = expNeeded(game.clickLevel);
    const pct = game.clickLevel >= 10 ? 100 : Math.min(100, Math.round(game.clickExp / need * 100));
    app.innerHTML = `
      <div class="diary-spread click-spread is-active" data-spread="0">
        <div class="paper-page paper-page--left click-info-page">
          <div class="page-number">03</div>
          <div class="washi-tape washi-tape--blue" aria-hidden="true"></div>
          <span class="section-kicker">STAR DUST CLICKER</span>
          <h2>별가루 모으기</h2>
          <p class="click-intro">직접 별빛을 눌러 별가루를 모으고, 가챠에서 성장 아이템을 뽑아 CLICK LEVEL을 올려보세요.</p>
          <div class="click-balance-card"><small>STAR DUST</small><b>✦ <em data-game-dust>${core.dust.toLocaleString('ko-KR')}</em></b></div>
          <div class="click-stat-grid">
            <div><small>CLICK LEVEL</small><b>Lv.${game.clickLevel}</b></div>
            <div><small>TOUCH POWER</small><b>+${game.clickPower}</b></div>
            <div><small>BEST COMBO</small><b>${game.highestCombo}</b></div>
            <div><small>TOTAL CLICK</small><b>${game.totalClicks.toLocaleString('ko-KR')}</b></div>
          </div>
          <div class="click-exp-block">
            <div><span>CLICK EXP</span><b>${game.clickLevel >= 10 ? 'MAX' : `${game.clickExp} / ${need}`}</b></div>
            <span class="click-exp-track"><i style="width:${pct}%"></i></span>
            <small>${game.clickLevel >= 10 ? 'CLICK Lv.10 · MAX LEVEL' : '강화 아이템을 뽑으면 EXP가 올라가요.'}</small>
          </div>
          <div class="click-boost-list">
            <span class="${game.doubleUntil > Date.now() ? 'is-active' : ''}">✦ DOUBLE ${game.doubleUntil > Date.now() ? 'ON' : 'OFF'}</span>
            <span class="${game.feverUntil > Date.now() ? 'is-active' : ''}">☄ FEVER ${game.feverUntil > Date.now() ? 'ON' : 'OFF'}</span>
            <span class="${game.luckyDraws > 0 ? 'is-active' : ''}">★ LUCKY ${game.luckyDraws > 0 ? `${game.luckyDraws}회` : 'OFF'}</span>
          </div>
          <div class="click-stage-note"><b>SKY STAGE ${game.clickStage}</b><span>${stageCopy(game.clickStage)}</span></div>
        </div>
        <div class="paper-page paper-page--right click-play-page stage-${game.clickStage}">
          <div class="page-number">04</div>
          <div class="click-combo-badge" data-game-combo>${game.combo > 1 ? `${game.combo} COMBO` : 'READY'}</div>
          <div class="click-sky-decor" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <button class="game-click-orb" id="game-click-orb" type="button" aria-label="별가루 얻기">
            <span class="click-orb-halo"></span><span class="click-orb-star">✦</span><b>CLICK!</b><small>+${game.clickPower} / TOUCH</small>
          </button>
          <p class="click-hint">빠르게 연속 클릭하면 COMBO 보너스가 열려요.</p>
          <button class="click-go-gacha" type="button" data-game-open-gacha>별가루로 가챠 돌리기 →</button>
        </div>
      </div>`;
  }

  function stageCopy(stage) {
    return {
      1:'작은 별 하나에서 시작해요.', 2:'주변에 작은 별빛이 생겼어요.', 3:'구름과 별빛이 함께 모이기 시작했어요.',
      4:'별빛이 더 강하게 빛나요.', 5:'무지개 기운이 하늘에 스며들어요.', 6:'완성된 PIXELY 하늘이 열렸어요.'
    }[stage] || '';
  }

  function updateClickNumbers() {
    if ($('#pixely-click-app')) renderClickPage();
    updateHomeAndGacha();
  }

  function handleClicker(event) {
    const orb = event.target.closest?.('#game-click-orb');
    if (!orb) return;
    const now = Date.now();
    const game = gameData();
    game.combo = now - game.lastClickAt <= 1100 ? game.combo + 1 : 1;
    game.lastClickAt = now;
    game.totalClicks += 1;
    game.highestCombo = Math.max(game.highestCombo, game.combo);

    const multiplier = game.doubleUntil > now ? 2 : 1;
    const fever = game.feverUntil > now;
    const roll = Math.random();
    let kind = 'NORMAL';
    let randomMultiplier = 1;
    const rainbowChance = fever ? 0.01 : 0.005;
    const luckyChance = fever ? 0.12 : 0.05;
    if (roll < rainbowChance) { kind = 'RAINBOW'; randomMultiplier = 10; }
    else if (roll < luckyChance) { kind = 'LUCKY'; randomMultiplier = 3; }

    let amount = game.clickPower * multiplier * randomMultiplier;
    const comboBonus = COMBO_REWARDS[game.combo] || 0;
    amount += comboBonus;
    addDust(amount);
    saveGame(game);
    clickFloat(orb, kind, amount, comboBonus);
    updateClickNumbers();
  }

  function clickFloat(orb, kind, amount, comboBonus) {
    const page = orb.closest('.click-play-page');
    if (!page) return;
    const node = document.createElement('span');
    node.className = `click-float is-${kind.toLowerCase()}`;
    node.textContent = `${kind === 'NORMAL' ? '' : kind + '! '}+${amount}${comboBonus ? ` · COMBO +${comboBonus}` : ''}`;
    const rect = orb.getBoundingClientRect();
    const parent = page.getBoundingClientRect();
    node.style.left = `${rect.left - parent.left + rect.width * (.28 + Math.random() * .44)}px`;
    node.style.top = `${rect.top - parent.top + rect.height * .25}px`;
    page.appendChild(node);
    setTimeout(() => node.remove(), 900);
    orb.classList.remove('is-hit');
    void orb.offsetWidth;
    orb.classList.add('is-hit');
  }

  function rarityRoll(boosted = false) {
    const r = Math.random() * 100;
    const table = boosted
      ? [['CLOUD',55],['SKY',28],['STAR',12],['RAINBOW',4.7],['SECRET',.3]]
      : [['CLOUD',70],['SKY',22],['STAR',6.5],['RAINBOW',1.4],['SECRET',.1]];
    let sum = 0;
    for (const [rarity, chance] of table) { sum += chance; if (r < sum) return rarity; }
    return table[table.length - 1][0];
  }

  function weightedUpgrade() {
    const r = Math.random() * 100;
    if (r < 65) return upgradeItems[0];
    if (r < 90) return upgradeItems[1];
    if (r < 98) return upgradeItems[2];
    return upgradeItems[3];
  }

  function chooseSpecial() { return specialItems[Math.floor(Math.random() * specialItems.length)]; }

  function chooseCard(core, meta, game) {
    const itemMeta = meta.itemMeta || {};
    const pool = core.gachaItems.filter(item => !GAME_ITEM_IDS.has(item.id) && itemMeta[item.id]?.type !== 'item');
    if (!pool.length) return null;
    const boosted = game.luckyDraws > 0;
    const rarity = rarityRoll(boosted);
    if (boosted) game.luckyDraws = Math.max(0, game.luckyDraws - 1);
    let candidates = pool.filter(item => String(item.rarity || '').toUpperCase() === rarity);
    if (!candidates.length) candidates = pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function duplicateReward(rarity) {
    return { CLOUD:2, SKY:4, STAR:8, RAINBOW:15, SECRET:30 }[String(rarity || '').toUpperCase()] || 2;
  }

  function oneOutcome(core, game, meta) {
    const typeRoll = Math.random();
    game.totalDraws += 1;

    if (typeRoll < .82) {
      const card = chooseCard(core, meta, game);
      if (!card) return oneUpgrade(core, game);
      const before = Number(core.owned[card.id] || 0);
      const duplicate = before > 0;
      core.owned[card.id] = before + 1;
      core.lastCardId = card.id;
      const refund = duplicate ? duplicateReward(card.rarity) : 0;
      if (refund) core.dust += refund;
      const result = { kind:'card', id:card.id, name:card.name, rarity:card.rarity, symbol:card.symbol, color:card.color, imageUrl:card.imageUrl || meta.itemMeta?.[card.id]?.imageUrl || '', duplicate, refund, exp:0, levelUp:false };
      pushHistory(game, result);
      return result;
    }
    if (typeRoll < .97) return oneUpgrade(core, game);
    return oneSpecial(core, game);
  }

  function oneUpgrade(core, game) {
    const item = weightedUpgrade();
    core.owned[item.id] = Number(core.owned[item.id] || 0) + 1;
    game.inventory[item.id] = Number(game.inventory[item.id] || 0) + 1;
    game.clickExp += item.exp;
    const didLevel = levelUp(game);
    const result = { kind:'upgrade', ...item, duplicate:false, refund:0, levelUp:didLevel };
    pushHistory(game, result);
    return result;
  }

  function oneSpecial(core, game) {
    const item = chooseSpecial();
    core.owned[item.id] = Number(core.owned[item.id] || 0) + 1;
    game.inventory[item.id] = Number(game.inventory[item.id] || 0) + 1;
    if (item.effect === 'lucky') game.luckyDraws += 5;
    if (item.effect === 'double') game.doubleUntil = Date.now() + 60000;
    if (item.effect === 'fever') game.feverUntil = Date.now() + 60000;
    const result = { kind:'special', ...item, duplicate:false, refund:0, exp:0, levelUp:false };
    pushHistory(game, result);
    return result;
  }

  function pushHistory(game, result) {
    game.gachaHistory.unshift({
      at:new Date().toISOString(), kind:result.kind, id:result.id, name:result.name,
      rarity:result.rarity || null, duplicate:!!result.duplicate, refund:result.refund || 0,
    });
    game.gachaHistory = game.gachaHistory.slice(0, 120);
  }

  function performDraw(count, cost) {
    const core = coreData();
    if (core.dust < cost) {
      toast(`별가루가 부족해요. ✦ ${cost.toLocaleString('ko-KR')} 필요`);
      $('[data-tab="series"]')?.click();
      return;
    }
    const game = gameData();
    const meta = read(META_KEY, { itemMeta:{} });
    core.dust -= cost;
    const results = [];
    for (let i = 0; i < count; i += 1) results.push(oneOutcome(core, game, meta));
    syncGlobalCore(core);
    saveGame(game);
    updateHomeAndGacha();
    if (count === 1) showSingleResult(results[0], game);
    else showBatchResult(results);
    document.dispatchEvent(new CustomEvent('pixely-game-updated'));
  }

  function resultArt(result) {
    const url = String(result.imageUrl || '').trim();
    if (url) return `<img src="${esc(url)}" alt="${esc(result.name)}">`;
    return `<span class="game-result-symbol">${esc(result.symbol || '✦')}</span>`;
  }

  function showSingleResult(result, game) {
    const modal = $('#result-modal');
    const card = $('#result-card');
    const kicker = $('#result-kicker');
    const title = $('#result-title');
    const copy = $('#result-copy');
    const primary = $('#result-primary-action');
    if (!modal || !card || !kicker || !title || !copy || !primary) return;

    card.classList.remove('is-rainbow');
    card.style.setProperty('--game-result-color', result.color || '#79bff2');
    card.innerHTML = `<div class="game-gacha-result is-${result.kind}"><span>${result.rarity || (result.kind === 'upgrade' ? 'GROWTH ITEM' : 'SPECIAL ITEM')}</span><div>${resultArt(result)}</div><b>${esc(result.name)}</b><small>${esc(result.shortNote || '')}</small></div>`;

    if (result.kind === 'card') {
      kicker.textContent = result.duplicate ? 'DUPLICATE' : 'NEW!';
      title.textContent = result.duplicate ? `${result.name} 카드를 다시 만났어요.` : `${result.name} 카드를 획득했어요!`;
      copy.textContent = result.duplicate ? `중복 보상 · 별가루 +${result.refund}` : `${result.rarity} CARD · 컬렉션에 저장됐어요.`;
      primary.textContent = result.duplicate ? '확인' : '컬렉션 보기';
    } else if (result.kind === 'upgrade') {
      kicker.textContent = result.levelUp ? 'LEVEL UP!' : 'CLICK GROWTH';
      title.textContent = result.levelUp ? `CLICK Lv.${game.clickLevel} 달성!` : result.name;
      copy.textContent = `CLICK EXP +${result.exp}${result.levelUp ? ` · TOUCH POWER +${game.clickPower}` : ''}`;
      primary.textContent = '확인';
    } else {
      kicker.textContent = 'SPECIAL ITEM';
      title.textContent = result.name;
      copy.textContent = result.shortNote || '특수 효과가 활성화됐어요.';
      primary.textContent = '확인';
    }
    modal.hidden = false;
    primary.focus();
  }

  function ensureBatchModal() {
    let modal = $('#game-batch-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'game-batch-modal';
    modal.className = 'game-batch-modal';
    modal.hidden = true;
    modal.innerHTML = '<div class="game-batch-backdrop" data-game-close-batch></div><section class="game-batch-sheet"><button type="button" class="game-batch-close" data-game-close-batch>×</button><span>PIXELY CAPSULE · 10 DRAW</span><h2>10연속 뽑기 결과</h2><div class="game-batch-grid"></div><div class="game-batch-actions"><button type="button" data-game-close-batch>확인</button><button type="button" data-game-batch-collection>컬렉션 보기</button></div></section>';
    document.body.appendChild(modal);
    return modal;
  }

  function showBatchResult(results) {
    const modal = ensureBatchModal();
    const grid = $('.game-batch-grid', modal);
    grid.innerHTML = results.map(result => `<article class="game-batch-item is-${result.kind}" style="--batch-color:${result.color || '#79bff2'}"><span>${esc(result.rarity || result.kind.toUpperCase())}</span><div>${resultArt(result)}</div><b>${esc(result.name)}</b><small>${result.kind === 'card' && result.duplicate ? `DUP +${result.refund}` : result.kind === 'upgrade' ? `EXP +${result.exp}` : result.kind === 'special' ? 'SPECIAL' : 'NEW'}</small></article>`).join('');
    modal.hidden = false;
  }

  function updateHomeAndGacha() {
    const core = coreData();
    const game = gameData();
    $$('[data-dust-count]').forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));
    $$('[data-game-dust]').forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));

    const homeCard = $('.home-recent-series');
    if (homeCard) {
      homeCard.style.display = '';
      homeCard.dataset.openTab = 'series';
      const label = $('.feature-card__label', homeCard); if (label) label.textContent = 'STAR DUST CLICKER';
      const title = $('#home-recent-series-title'); if (title) title.textContent = `CLICK Lv.${game.clickLevel}`;
      const copy = $('#home-recent-series-copy'); if (copy) copy.textContent = `터치당 +${game.clickPower} · 최고 콤보 ${game.highestCombo}`;
      const art = $('.feature-card__art', homeCard); if (art) art.innerHTML = '<span class="home-click-star">✦</span><i class="home-click-ring"></i>';
    }
    const statBlocks = $$('.home-stats > div');
    if (statBlocks[1]) {
      statBlocks[1].style.display = '';
      const label = $('span', statBlocks[1]); if (label) label.textContent = 'CLICK LEVEL';
      const value = $('b', statBlocks[1]); if (value) value.innerHTML = `<em>Lv.${game.clickLevel}</em>`;
    }

    const drawButton = $('#draw-button');
    if (drawButton) {
      const small = $('small', drawButton); if (small) small.textContent = `✦ ${ONE_COST.toLocaleString('ko-KR')}`;
      drawButton.classList.toggle('is-insufficient', core.dust < ONE_COST);
    }
    let ten = $('#draw-ten-button');
    if (drawButton && !ten) {
      ten = document.createElement('button');
      ten.id = 'draw-ten-button';
      ten.type = 'button';
      ten.className = 'draw-ten-button';
      ten.innerHTML = `<span>✦</span><b>10연속 뽑기</b><small>✦ ${TEN_COST.toLocaleString('ko-KR')}</small>`;
      drawButton.insertAdjacentElement('afterend', ten);
    }
    ten?.classList.toggle('is-insufficient', core.dust < TEN_COST);

    const gachaTitle = $('#gacha-heading'); if (gachaTitle) gachaTitle.textContent = 'PIXELY CAPSULE';
    const gachaIntro = $('.gacha-info > p'); if (gachaIntro) gachaIntro.textContent = '별가루를 모아 카드, 성장 아이템, 특수 아이템을 뽑아보세요.';
    const ruleItems = $$('.gacha-rule li');
    if (ruleItems[0]) ruleItems[0].textContent = 'CLICK에서 별가루를 모아요.';
    if (ruleItems[1]) ruleItems[1].textContent = '✦ 100으로 1회, ✦ 950으로 10연속 뽑기를 해요.';
    if (ruleItems[2]) ruleItems[2].textContent = '카드 82% · 강화 아이템 15% · 특수 아이템 3%';
  }

  function hideOldSeriesSettings() {
    $('[data-settings-tab="series"]')?.style.setProperty('display','none','important');
    $('[data-settings-panel="series"]')?.style.setProperty('display','none','important');
    $('[data-reset="series"]')?.style.setProperty('display','none','important');
    $$('#editor-fields label').forEach(label => {
      if (label.querySelector('span')?.textContent?.trim() === '관련 시리즈') label.style.display = 'none';
    });
    const relatedRow = $('#card-detail-series')?.closest('div');
    if (relatedRow) relatedRow.style.display = 'none';
  }

  function installCss() {
    if ($('#pixely-game-css')) return;
    const link = document.createElement('link');
    link.id = 'pixely-game-css';
    link.rel = 'stylesheet';
    link.href = 'pixely-game.css?v=1';
    document.head.appendChild(link);
  }

  function installHandlers() {
    document.addEventListener('click', event => {
      if (event.target.closest?.('#game-click-orb')) {
        event.preventDefault();
        event.stopPropagation();
        handleClicker(event);
        return;
      }
      if (event.target.closest?.('[data-game-open-gacha]')) {
        event.preventDefault();
        $('[data-tab="gacha"]')?.click();
        return;
      }
      if (event.target.closest?.('#draw-button')) {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
        performDraw(1, ONE_COST); return;
      }
      if (event.target.closest?.('#draw-ten-button')) {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
        performDraw(10, TEN_COST); return;
      }
      if (event.target.closest?.('#draw-again')) {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
        const modal = $('#result-modal'); if (modal) modal.hidden = true;
        performDraw(1, ONE_COST); return;
      }
      if (event.target.closest?.('[data-game-close-batch]')) {
        event.preventDefault();
        const modal = $('#game-batch-modal'); if (modal) modal.hidden = true;
        return;
      }
      if (event.target.closest?.('[data-game-batch-collection]')) {
        event.preventDefault();
        const modal = $('#game-batch-modal'); if (modal) modal.hidden = true;
        $('[data-tab="collection"]')?.click();
        return;
      }
      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"]')) setTimeout(renderClickPage, 0);
      if (event.target.closest?.('#open-settings')) setTimeout(hideOldSeriesSettings, 20);
    }, true);
  }

  function boot() {
    installCss();
    ensureGameItems();
    renderClickPage();
    updateHomeAndGacha();
    hideOldSeriesSettings();
    installHandlers();

    const observer = new MutationObserver(() => {
      updateHomeAndGacha();
      hideOldSeriesSettings();
      const panel = $('[data-panel="series"]');
      if (panel && !$('#pixely-click-app', panel)) renderClickPage();
    });
    observer.observe(document.body, { childList:true, subtree:true });
    setInterval(() => {
      if ($('#pixely-click-app') || $('[data-panel="gacha"]:not([hidden])')) updateClickNumbers();
    }, 1000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
