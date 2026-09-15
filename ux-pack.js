(() => {
  if (window.__PIXELY_UX_PACK_V1__) return;
  window.__PIXELY_UX_PACK_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const NEW_KEY = 'pixely-new-items-v1';
  const PREF_KEY = 'pixely-ux-prefs-v1';
  const SINGLE_COST = 100;
  const TEN_COST = 950;
  const POWERS = [1,2,3,5,7,10,15,20,30,50];
  const NEED = [3,5,7,9,12,15,19,24,30];
  const LEGACY_UPGRADE_IDS = new Set(['upgrade-stardust-chip','upgrade-shining-star','upgrade-star-crystal','upgrade-rainbow-crystal']);
  let collectionFilter = 'all';
  let batchBusy = false;

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const validColor = (v, fallback='#8fa7c4') => /^#[0-9a-f]{6}$/i.test(String(v||'')) ? String(v) : fallback;

  function read(key, fallback={}) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function core() {
    const value = read(CORE_KEY, {});
    value.owned = value.owned && typeof value.owned === 'object' ? value.owned : {};
    value.gachaItems = Array.isArray(value.gachaItems) ? value.gachaItems : [];
    value.dust = Math.max(0, Number(value.dust) || 0);
    return value;
  }

  function game() {
    const value = { clickLevel:1, clickExp:0, clickPower:1, totalClicks:0, highestCombo:0, combo:0, lastClickAt:0, ...read(GAME_KEY,{}) };
    value.clickLevel = Math.min(10, Math.max(1, Number(value.clickLevel)||1));
    value.clickExp = Math.max(0, Number(value.clickExp)||0);
    value.clickPower = POWERS[value.clickLevel - 1];
    return value;
  }

  function prefs() {
    return { reduceMotion:false, showNew:true, ...read(PREF_KEY,{}) };
  }

  function newSet() {
    const value = read(NEW_KEY, { ids:[] });
    return new Set(Array.isArray(value.ids) ? value.ids.map(String) : []);
  }

  function saveNew(set) {
    write(NEW_KEY, { ids:[...set] });
    refreshNewBadges();
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function syncInMemory(nextCore) {
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') {
        save.dust = nextCore.dust;
        save.owned = { ...nextCore.owned };
        save.lastCardId = nextCore.lastCardId || null;
        if (typeof persistSave === 'function') persistSave();
      }
    } catch {}
  }

  function callIf(name, ...args) {
    try {
      const fn = globalThis[name];
      if (typeof fn === 'function') fn(...args);
    } catch {}
  }

  function refreshStatus() {
    const c = core();
    const g = game();
    $$('[data-ux-dust]').forEach(el => el.textContent = `✦ ${c.dust.toLocaleString('ko-KR')}`);
    $$('[data-ux-level]').forEach(el => el.textContent = `Lv.${g.clickLevel}`);
    $$('[data-ux-power]').forEach(el => el.textContent = `+${g.clickPower}/TOUCH`);
    refreshGachaControls();
    decorateClickGoal();
  }

  function installStatusbar() {
    const bar = $('.app-bar');
    if (!bar || $('.ux-statusbar', bar)) return;
    const node = document.createElement('div');
    node.className = 'ux-statusbar';
    node.innerHTML = `
      <button class="ux-status-chip ux-status-chip--dust" type="button" data-ux-go="click"><small>STARDUST</small><b data-ux-dust>✦ 0</b></button>
      <button class="ux-status-chip ux-status-chip--level" type="button" data-ux-go="click"><small>CLICK</small><b data-ux-level>Lv.1</b></button>
      <span class="ux-status-chip"><small>POWER</small><b data-ux-power>+1/TOUCH</b></span>`;
    const actions = $('.app-bar__actions', bar);
    if (actions) bar.insertBefore(node, actions); else bar.appendChild(node);
    refreshStatus();
  }

  function ensureGachaActions() {
    const play = $('.gacha-play');
    const draw = $('#draw-button');
    if (!play || !draw) return;
    let wrap = $('.ux-gacha-actions', play);
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'ux-gacha-actions';
      draw.parentNode.insertBefore(wrap, draw);
      wrap.appendChild(draw);
      const ten = document.createElement('button');
      ten.id = 'ux-draw-ten';
      ten.className = 'ux-draw-ten';
      ten.type = 'button';
      ten.innerHTML = '<span>✦</span><b>10회 뽑기</b><small>별가루 ✦950 사용</small>';
      wrap.appendChild(ten);
    }
  }

  function refreshGachaControls() {
    ensureGachaActions();
    const c = core();
    const hasItems = c.gachaItems.length > 0;
    const draw = $('#draw-button');
    const again = $('#draw-again');
    const ten = $('#ux-draw-ten');
    if (draw) {
      draw.disabled = !hasItems || c.dust < SINGLE_COST;
      draw.classList.toggle('ux-insufficient', c.dust < SINGLE_COST);
      const b = $('b', draw), small = $('small', draw);
      if (b) b.textContent = '1회 뽑기';
      if (small) small.textContent = c.dust < SINGLE_COST ? `✦ ${c.dust} / ${SINGLE_COST} · 별가루 부족` : `보유 ✦${c.dust.toLocaleString('ko-KR')} · 비용 ✦${SINGLE_COST}`;
    }
    if (again) {
      again.disabled = c.dust < SINGLE_COST || !hasItems;
      again.dataset.uxCost = `✦${SINGLE_COST}`;
      again.textContent = c.dust < SINGLE_COST ? '별가루 부족' : '한 번 더 뽑기';
    }
    if (ten) {
      ten.disabled = !hasItems || c.dust < TEN_COST || batchBusy;
      const small = $('small', ten);
      if (small) small.textContent = c.dust < TEN_COST ? `✦ ${c.dust} / ${TEN_COST} · 부족` : `보유 ✦${c.dust.toLocaleString('ko-KR')} · 비용 ✦${TEN_COST}`;
    }
  }

  function stageCards() {
    const value = Array.isArray(window.PIXELY_LEVEL_UP_CARDS) ? window.PIXELY_LEVEL_UP_CARDS : [];
    return value.map(card => ({ ...card, stage:Number(card.stage)||0, exp:Number(card.exp)||0 }));
  }

  function eligibleItems(items, g) {
    const stages = stageCards();
    const stageIds = new Set(stages.map(card => card.id));
    const allowed = stages.find(card => card.stage === g.clickLevel)?.id || null;
    return items.filter(item => {
      if (LEGACY_UPGRADE_IDS.has(item.id)) return false;
      if (!stageIds.has(item.id)) return true;
      return item.id === allowed;
    });
  }

  function weightedPick(items) {
    if (!items.length) return null;
    const total = items.reduce((sum,item) => sum + Math.max(0, Number(item.weight)||0), 0);
    if (total <= 0) return items[Math.floor(Math.random()*items.length)] || null;
    let value = Math.random() * total;
    for (const item of items) {
      value -= Math.max(0, Number(item.weight)||0);
      if (value <= 0) return item;
    }
    return items[items.length - 1] || null;
  }

  function applyStageCard(g, item) {
    const stage = stageCards().find(card => card.id === item.id && card.stage === g.clickLevel);
    if (!stage || g.clickLevel >= 10) return null;
    const from = g.clickLevel;
    const need = NEED[g.clickLevel - 1];
    g.clickExp += stage.exp;
    if (g.clickExp >= need) {
      g.clickExp -= need;
      g.clickLevel += 1;
      g.clickPower = POWERS[g.clickLevel - 1];
      return { from, to:g.clickLevel, exp:stage.exp };
    }
    g.clickPower = POWERS[g.clickLevel - 1];
    return null;
  }

  function runTenDraw() {
    if (batchBusy) return;
    const c = core();
    if (!c.gachaItems.length) { toast('가챠 카드가 비어 있어요.'); return; }
    if (c.dust < TEN_COST) { toast(`10회 뽑기에는 별가루 ✦ ${TEN_COST}이 필요해요.`); $('[data-tab="series"]')?.click(); return; }

    batchBusy = true;
    refreshGachaControls();
    const beforeDust = c.dust;
    const g = game();
    const fresh = newSet();
    const results = [];
    c.dust -= TEN_COST;

    for (let i=0; i<10; i+=1) {
      const pool = eligibleItems(c.gachaItems, g);
      const item = weightedPick(pool);
      if (!item) break;
      const previous = Number(c.owned[item.id] || 0);
      const duplicate = previous > 0;
      const isNew = previous === 0;
      c.owned[item.id] = previous + 1;
      if (duplicate) c.dust += 10;
      if (isNew) fresh.add(String(item.id));
      const levelUp = applyStageCard(g, item);
      results.push({ item:{...item}, duplicate, isNew, levelUp });
    }

    const last = results[results.length - 1];
    if (last) c.lastCardId = last.item.id;
    write(CORE_KEY, c);
    write(GAME_KEY, g);
    saveNew(fresh);
    syncInMemory(c);
    callIf('renderCollectionSpreads');
    callIf('renderHome');
    callIf('updateStats');
    batchBusy = false;
    refreshStatus();
    showTenModal(results, beforeDust, c.dust, g);
  }

  function tenModal() {
    let modal = $('#ux-ten-modal');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'ux-ten-modal';
    modal.className = 'ux-ten-modal';
    modal.hidden = true;
    document.body.appendChild(modal);
    return modal;
  }

  function showTenModal(results, beforeDust, afterDust, g) {
    const modal = tenModal();
    const newCount = results.filter(r => r.isNew).length;
    const dupCount = results.filter(r => r.duplicate).length;
    const levelCount = results.filter(r => r.levelUp).length;
    modal.innerHTML = `
      <div class="ux-ten-backdrop" data-ux-ten-close></div>
      <section class="ux-ten-sheet" role="dialog" aria-modal="true" aria-label="10회 뽑기 결과">
        <div class="ux-ten-head">
          <div><span>10 DRAW RESULT</span><h2>열 번의 기억을 만났어요!</h2></div>
          <div class="ux-ten-summary">✦ ${beforeDust.toLocaleString('ko-KR')} → ${afterDust.toLocaleString('ko-KR')}<br>NEW ${newCount} · 중복 ${dupCount}${levelCount ? ` · LEVEL UP ${levelCount}` : ''}</div>
        </div>
        <div class="ux-ten-grid">${results.map(({item,duplicate,isNew,levelUp}) => `
          <div class="ux-ten-card" style="--ux-card:${validColor(item.color)}">
            <em>${esc(item.rarity || 'CARD')}</em>
            <span class="ux-ten-symbol">${esc(item.symbol || '✦')}</span>
            <strong>${esc(item.name)}</strong>
            <span class="ux-ten-flags">${isNew ? '<i class="is-new">NEW</i>' : ''}${duplicate ? '<i>DUP +10</i>' : ''}${levelUp ? `<i class="is-level">Lv.${levelUp.to}</i>` : ''}</span>
          </div>`).join('')}</div>
        <div class="ux-ten-actions">
          <button class="secondary" type="button" data-ux-ten-close>닫기</button>
          <button class="secondary" type="button" data-ux-ten-collection>컬렉션 보기</button>
          <button class="primary" type="button" data-ux-ten-again ${afterDust < TEN_COST ? 'disabled' : ''}>10회 더 뽑기 · ✦${TEN_COST}</button>
        </div>
      </section>`;
    modal.hidden = false;
  }

  function closeTenModal() { const modal = $('#ux-ten-modal'); if (modal) modal.hidden = true; }

  function markSingleNew() {
    const modal = $('#result-modal');
    if (!modal || modal.hidden) return;
    const c = core();
    const id = String(c.lastCardId || '');
    if (!id || Number(c.owned[id]||0) !== 1) return;
    const set = newSet();
    if (!set.has(id)) { set.add(id); saveNew(set); }
  }

  function refreshNewBadges() {
    const set = newSet();
    const tab = $('[data-tab="collection"]');
    if (tab) {
      let badge = $('.ux-new-badge', tab);
      if (set.size && !badge) { badge = document.createElement('span'); badge.className='ux-new-badge'; tab.appendChild(badge); }
      if (badge) { badge.textContent = `NEW ${set.size}`; badge.hidden = !set.size; }
    }

    $$('.gc-entry[data-gc-item]').forEach(card => {
      const id = String(card.dataset.gcItem || '');
      let badge = $('.ux-new-badge', card);
      if (set.has(id) && !badge) { badge = document.createElement('span'); badge.className='ux-new-badge'; badge.textContent='NEW'; card.appendChild(badge); }
      if (badge) badge.hidden = !set.has(id);
    });

    $$('.gc-group').forEach(group => {
      const count = $$('.gc-entry[data-gc-item]', group).filter(card => set.has(String(card.dataset.gcItem||''))).length;
      const title = $('.gc-group-head h3', group);
      if (!title) return;
      let badge = $('.gc-group-head .ux-new-badge', group);
      if (count && !badge) { badge = document.createElement('span'); badge.className='ux-new-badge'; title.insertAdjacentElement('afterend', badge); }
      if (badge) { badge.textContent = `NEW ${count}`; badge.hidden = !count; }
    });
  }

  function clearNew(id) {
    const c = core();
    if (Number(c.owned[id]||0) <= 0) return;
    const set = newSet();
    if (!set.delete(String(id))) return;
    saveNew(set);
    applyCollectionFilter();
  }

  function installCollectionTools() {
    const root = $('#collection-spreads');
    const head = root ? $('.gc-collection-head', root) : null;
    if (!root || !head) return;
    if (!$('.ux-collection-tools', root)) {
      const tools = document.createElement('div');
      tools.className = 'ux-collection-tools';
      tools.innerHTML = `<span class="ux-filter-label">COLLECTION FILTER</span><div class="ux-filter-buttons">
        <button type="button" data-ux-filter="all">전체</button>
        <button type="button" data-ux-filter="owned">보유</button>
        <button type="button" data-ux-filter="unowned">미획득</button>
        <button type="button" data-ux-filter="new">NEW</button>
      </div>`;
      head.insertAdjacentElement('afterend', tools);
      const empty = document.createElement('div');
      empty.className = 'ux-filter-empty';
      empty.textContent = '이 조건에 맞는 컬렉션이 아직 없어요.';
      tools.insertAdjacentElement('afterend', empty);
    }
    refreshNewBadges();
    applyCollectionFilter();
  }

  function applyCollectionFilter() {
    const root = $('#collection-spreads');
    if (!root) return;
    const set = newSet();
    $$('.ux-filter-buttons button', root).forEach(btn => btn.classList.toggle('is-active', btn.dataset.uxFilter === collectionFilter));
    let visibleTotal = 0;
    $$('.gc-group', root).forEach(group => {
      let groupVisible = 0;
      $$('.gc-entry[data-gc-item]', group).forEach(card => {
        const id = String(card.dataset.gcItem || '');
        const owned = card.classList.contains('is-owned');
        const visible = collectionFilter === 'all' || (collectionFilter === 'owned' && owned) || (collectionFilter === 'unowned' && !owned) || (collectionFilter === 'new' && set.has(id));
        card.classList.toggle('ux-filter-hidden', !visible);
        if (visible) { groupVisible += 1; visibleTotal += 1; }
      });
      group.classList.toggle('ux-filter-hidden', groupVisible === 0);
    });
    const empty = $('.ux-filter-empty', root);
    if (empty) empty.classList.toggle('is-visible', visibleTotal === 0);
  }

  function decorateCollectionLater() {
    [40,140,350,700].forEach(delay => setTimeout(() => { installCollectionTools(); refreshNewBadges(); }, delay));
  }

  function decorateClickGoal() {
    const card = $('.pcf-upgrade-card');
    if (!card) return;
    const g = game();
    const stage = stageCards().find(item => item.stage === g.clickLevel);
    let goal = $('.ux-next-goal', card);
    const legacy = $('[data-next-level-card]', card);
    if (legacy) { legacy.classList.add('ux-next-goal'); goal = legacy; }
    if (goal) goal.textContent = g.clickLevel >= 10 ? 'MAX LEVEL · 모든 클릭 업그레이드를 완료했어요.' : `다음 목표 · CLICK Lv.${g.clickLevel} → Lv.${g.clickLevel + 1} · LEVEL UP CARD Lv.${g.clickLevel} 필요`;
    let button = $('.ux-next-gacha', card);
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'ux-next-gacha';
      card.appendChild(button);
    }
    button.disabled = g.clickLevel >= 10;
    button.textContent = g.clickLevel >= 10 ? '업그레이드 완료' : `가챠에서 Lv.${stage?.stage || g.clickLevel} 카드 획득하기 →`;
  }

  function applyPrefs() {
    const p = prefs();
    document.body.classList.toggle('ux-reduce-motion', !!p.reduceMotion);
    document.body.classList.toggle('ux-hide-new', p.showNew === false);
  }

  function installSettingsUX() {
    const nav = $('.settings-tabs');
    const content = $('.settings-content');
    if (!nav || !content) return;
    const gachaTab = $('[data-settings-tab="gacha"]', nav);
    const seriesTab = $('[data-settings-tab="series"]', nav);
    const resetTab = $('[data-settings-tab="reset"]', nav);
    if (gachaTab) gachaTab.textContent = '고급 · 가챠';
    if (seriesTab) seriesTab.textContent = '고급 · 시리즈';
    if (resetTab) resetTab.textContent = '데이터 관리';

    let playTab = $('.ux-play-tab', nav);
    if (!playTab) {
      playTab = document.createElement('button');
      playTab.type = 'button';
      playTab.className = 'ux-play-tab';
      playTab.dataset.uxSettingsTab = 'play';
      playTab.textContent = '플레이 설정';
      nav.prepend(playTab);
    }
    if (resetTab) nav.insertBefore(resetTab, gachaTab || null);

    let panel = $('.ux-play-settings', content);
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'settings-section ux-play-settings';
      panel.hidden = true;
      panel.innerHTML = `<div class="settings-section__heading"><div><h3>플레이 설정</h3><p>자주 쓰는 편의 기능만 모아뒀어요. 카드·시리즈 편집은 고급 관리에서 할 수 있어요.</p></div></div>
        <div class="ux-play-card">
          <label class="ux-pref-row"><span><b>애니메이션 줄이기</b><small>페이지 전환과 카드 효과를 빠르게 표시해요.</small></span><span class="ux-switch"><input type="checkbox" data-ux-pref="reduceMotion"><i></i></span></label>
          <label class="ux-pref-row"><span><b>NEW 배지 표시</b><small>새로 얻은 카드와 컬렉션에 NEW 표시를 보여줘요.</small></span><span class="ux-switch"><input type="checkbox" data-ux-pref="showNew"><i></i></span></label>
        </div>`;
      content.prepend(panel);
    }
    const p = prefs();
    const motion = $('[data-ux-pref="reduceMotion"]', panel); if (motion) motion.checked = !!p.reduceMotion;
    const showNew = $('[data-ux-pref="showNew"]', panel); if (showNew) showNew.checked = p.showNew !== false;
  }

  function showPlaySettings() {
    installSettingsUX();
    const panel = $('.ux-play-settings');
    if (!panel) return;
    $$('[data-settings-panel]').forEach(el => { el.hidden = true; el.classList.remove('is-active'); });
    panel.hidden = false;
    panel.classList.add('is-active');
    $$('.settings-tabs button').forEach(btn => btn.classList.toggle('is-active', btn.classList.contains('ux-play-tab')));
  }

  function scheduleRefresh() {
    [0,70,180,850].forEach(delay => setTimeout(() => { refreshStatus(); refreshNewBadges(); }, delay));
  }

  function boot() {
    installStatusbar();
    ensureGachaActions();
    installSettingsUX();
    applyPrefs();
    refreshStatus();
    decorateCollectionLater();

    const resultCard = $('#result-card');
    if (resultCard) new MutationObserver(() => { setTimeout(() => { markSingleNew(); refreshStatus(); }, 0); }).observe(resultCard, { childList:true, subtree:true });

    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-ux-go="click"]')) { event.preventDefault(); $('[data-tab="series"]')?.click(); return; }
      if (event.target.closest?.('#ux-draw-ten')) { event.preventDefault(); runTenDraw(); return; }
      if (event.target.closest?.('[data-ux-ten-close]')) { closeTenModal(); return; }
      if (event.target.closest?.('[data-ux-ten-collection]')) { closeTenModal(); $('[data-tab="collection"]')?.click(); return; }
      if (event.target.closest?.('[data-ux-ten-again]')) { closeTenModal(); runTenDraw(); return; }
      if (event.target.closest?.('.ux-next-gacha')) { $('[data-tab="gacha"]')?.click(); return; }

      const filter = event.target.closest?.('[data-ux-filter]');
      if (filter) { collectionFilter = filter.dataset.uxFilter || 'all'; applyCollectionFilter(); return; }

      const entry = event.target.closest?.('.gc-entry[data-gc-item], .collection-card[data-card-id]');
      if (entry) clearNew(entry.dataset.gcItem || entry.dataset.cardId || '');

      if (event.target.closest?.('[data-tab="collection"], [data-open-tab="collection"], #result-primary-action')) decorateCollectionLater();
      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"]')) [80,180,350].forEach(d => setTimeout(decorateClickGoal,d));

      if (event.target.closest?.('#open-settings')) setTimeout(showPlaySettings, 0);
      const normalSettingsTab = event.target.closest?.('[data-settings-tab]');
      if (normalSettingsTab) {
        $('.ux-play-settings')?.setAttribute('hidden','');
        $('.ux-play-tab')?.classList.remove('is-active');
      }
      if (event.target.closest?.('.ux-play-tab')) { event.preventDefault(); showPlaySettings(); return; }

      scheduleRefresh();
    }, true);

    document.addEventListener('change', event => {
      const input = event.target.closest?.('[data-ux-pref]');
      if (!input) return;
      const p = prefs();
      p[input.dataset.uxPref] = !!input.checked;
      write(PREF_KEY, p);
      applyPrefs();
      refreshNewBadges();
    });

    window.addEventListener('storage', event => {
      if ([CORE_KEY,GAME_KEY,NEW_KEY,PREF_KEY].includes(event.key)) { applyPrefs(); scheduleRefresh(); decorateCollectionLater(); }
    });
    window.addEventListener('pixely:click-upgrade-reset', () => scheduleRefresh());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
