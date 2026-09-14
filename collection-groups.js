(() => {
  const CORE_KEY = 'pixely-diary-save-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const MEMBER_IDS = ['jam', 'gak', 'gong', 'soo', 'ra', 'deok'];
  const CARD_RARITIES = ['CLOUD', 'SKY', 'STAR', 'RAINBOW', 'HIDDEN'];
  let renderingCollection = false;
  let rerenderTimer = null;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v = '') => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const uid = (p = 'id') => `${p}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const safeColor = (v, fallback = '#76aee8') => /^#[0-9a-f]{6}$/i.test(String(v || '')) ? String(v) : fallback;

  function readCore() {
    try {
      const raw = JSON.parse(localStorage.getItem(CORE_KEY) || '{}');
      return {
        ...raw,
        owned: raw?.owned && typeof raw.owned === 'object' ? raw.owned : {},
        gachaItems: Array.isArray(raw?.gachaItems) ? raw.gachaItems : [],
        seriesItems: Array.isArray(raw?.seriesItems) ? raw.seriesItems : [],
      };
    } catch {
      return { owned: {}, gachaItems: [], seriesItems: [] };
    }
  }

  function defaultMeta(core) {
    const groups = [
      { id: 'pixely', name: '픽셀리', subtitle: 'PIXELY MEMBERS', icon: '✦', color: '#79bff2', rewardId: '' },
      { id: 'etc', name: '기타 컬렉션', subtitle: 'EXTRA TREASURES', icon: '☁', color: '#a9b9c4', rewardId: '' },
    ];
    const known = new Set(groups.map(g => g.id));
    for (const series of core.seriesItems) {
      if (!series?.id || !series?.title) continue;
      const id = `series-${series.id}`;
      if (known.has(id)) continue;
      groups.push({
        id,
        name: String(series.title),
        subtitle: String(series.subtitle || 'SERIES COLLECTION'),
        icon: String(series.icon || '▤').slice(0, 4),
        color: safeColor(series.color, '#7a98b7'),
        rewardId: '',
      });
      known.add(id);
    }

    const itemMeta = {};
    for (const item of core.gachaItems) {
      let groupId = MEMBER_IDS.includes(item.id) ? 'pixely' : 'etc';
      if (item.relatedSeriesId && known.has(`series-${item.relatedSeriesId}`)) groupId = `series-${item.relatedSeriesId}`;
      itemMeta[item.id] = {
        groupId,
        type: MEMBER_IDS.includes(item.id) ? 'card' : 'item',
        imageUrl: item.imageUrl || '',
        includeInCompletion: true,
      };
    }
    return { version: 2, groups, itemMeta, bonusItems: [], bonusOwned: {}, unlockLog: [] };
  }

  function readMeta() {
    const core = readCore();
    let meta;
    try { meta = JSON.parse(localStorage.getItem(META_KEY) || 'null'); } catch { meta = null; }
    if (!meta || typeof meta !== 'object') meta = defaultMeta(core);
    meta.version = 2;
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    meta.bonusItems = Array.isArray(meta.bonusItems) ? meta.bonusItems : [];
    meta.bonusOwned = meta.bonusOwned && typeof meta.bonusOwned === 'object' ? meta.bonusOwned : {};
    meta.unlockLog = Array.isArray(meta.unlockLog) ? meta.unlockLog : [];

    if (!meta.groups.some(g => g.id === 'pixely')) meta.groups.unshift({ id:'pixely', name:'픽셀리', subtitle:'PIXELY MEMBERS', icon:'✦', color:'#79bff2', rewardId:'' });
    if (!meta.groups.some(g => g.id === 'etc')) meta.groups.push({ id:'etc', name:'기타 컬렉션', subtitle:'EXTRA TREASURES', icon:'☁', color:'#a9b9c4', rewardId:'' });

    const groupIds = new Set(meta.groups.map(g => g.id));
    for (const series of core.seriesItems) {
      if (!series?.id || !series?.title) continue;
      const gid = `series-${series.id}`;
      if (!groupIds.has(gid)) {
        meta.groups.push({ id:gid, name:String(series.title), subtitle:String(series.subtitle || 'SERIES COLLECTION'), icon:String(series.icon || '▤').slice(0,4), color:safeColor(series.color, '#7a98b7'), rewardId:'' });
        groupIds.add(gid);
      }
    }

    for (const item of core.gachaItems) {
      if (!meta.itemMeta[item.id]) {
        let groupId = MEMBER_IDS.includes(item.id) ? 'pixely' : 'etc';
        if (item.relatedSeriesId && groupIds.has(`series-${item.relatedSeriesId}`)) groupId = `series-${item.relatedSeriesId}`;
        meta.itemMeta[item.id] = { groupId, type: MEMBER_IDS.includes(item.id) ? 'card' : 'item', imageUrl:item.imageUrl || '', includeInCompletion:true };
      }
      if (!groupIds.has(meta.itemMeta[item.id].groupId)) meta.itemMeta[item.id].groupId = 'etc';
      meta.itemMeta[item.id].type = meta.itemMeta[item.id].type === 'item' ? 'item' : 'card';
      meta.itemMeta[item.id].includeInCompletion = meta.itemMeta[item.id].includeInCompletion !== false;
    }
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    return meta;
  }

  function saveMeta(meta) {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function getItemMeta(id, meta = readMeta()) {
    return meta.itemMeta[id] || { groupId:'etc', type:'card', imageUrl:'', includeInCompletion:true };
  }

  function allEntries(core = readCore(), meta = readMeta()) {
    const base = core.gachaItems.map(item => {
      const extra = getItemMeta(item.id, meta);
      return { ...item, ...extra, isBonus:false, ownedCount:Number(core.owned[item.id] || 0) };
    });
    const bonus = meta.bonusItems.map(item => ({
      rarity:'HIDDEN', symbol:'★', color:'#b78ed0', shortNote:'그룹 완성 보상', description:'', imageUrl:'', type:'card', groupId:'etc', ...item,
      isBonus:true,
      ownedCount:Number(meta.bonusOwned[item.id] || 0),
    }));
    return [...base, ...bonus];
  }

  function groupStats(groupId, core = readCore(), meta = readMeta()) {
    const required = core.gachaItems.filter(item => {
      const m = getItemMeta(item.id, meta);
      return m.groupId === groupId && m.includeInCompletion !== false;
    });
    const owned = required.filter(item => Number(core.owned[item.id] || 0) > 0);
    return { total:required.length, owned:owned.length, complete:required.length > 0 && owned.length === required.length };
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => node.classList.remove('is-visible'), 2300);
  }

  function checkCompletions({ notify = true } = {}) {
    const core = readCore();
    const meta = readMeta();
    let changed = false;
    for (const group of meta.groups) {
      if (!group.rewardId) continue;
      const reward = meta.bonusItems.find(x => x.id === group.rewardId);
      if (!reward || Number(meta.bonusOwned[reward.id] || 0) > 0) continue;
      const stats = groupStats(group.id, core, meta);
      if (!stats.complete) continue;
      meta.bonusOwned[reward.id] = 1;
      meta.unlockLog.unshift({ id:uid('unlock'), groupId:group.id, rewardId:reward.id, date:new Date().toISOString() });
      changed = true;
      if (notify) toast(`✦ ${group.name} 완성! 히든 ${reward.type === 'item' ? '아이템' : '카드'}가 열렸어요.`);
    }
    if (changed) saveMeta(meta);
    return changed;
  }

  function imageMarkup(entry, locked = false) {
    const url = String(entry.imageUrl || '').trim();
    if (locked) return `<span class="gc-secret-mark">?</span>`;
    if (url) return `<img src="${esc(url)}" alt="${esc(entry.name)}" loading="lazy" onerror="this.remove()">`;
    return `<span class="gc-symbol">${esc(entry.symbol || (entry.type === 'item' ? '◆' : '✦'))}</span>`;
  }

  function entryCard(entry, index) {
    const lockedBonus = entry.isBonus && entry.ownedCount < 1;
    const owned = entry.ownedCount > 0;
    const cls = entry.type === 'item' ? 'gc-entry gc-item' : 'gc-entry gc-card';
    return `<button type="button" class="${cls} ${owned ? 'is-owned' : 'is-locked'} ${lockedBonus ? 'is-secret' : ''}" data-gc-item="${esc(entry.id)}" style="--entry-color:${safeColor(entry.color)}">
      <span class="gc-entry-top"><b>${esc(lockedBonus ? 'HIDDEN' : (entry.rarity || 'CLOUD'))}</b><em>${entry.type === 'item' ? 'ITEM' : 'CARD'}</em></span>
      <span class="gc-art ${entry.type === 'item' ? 'gc-art--item' : 'gc-art--card'}">${imageMarkup(entry, lockedBonus)}</span>
      <span class="gc-entry-copy"><strong>${esc(lockedBonus ? '???' : entry.name)}</strong><small>${lockedBonus ? '그룹을 완성하면 공개됩니다.' : esc(entry.shortNote || '')}</small></span>
      <span class="gc-entry-foot"><i>NO.${String(index + 1).padStart(2,'0')}</i><b>${owned ? `×${entry.ownedCount}` : 'LOCKED'}</b></span>
    </button>`;
  }

  function renderGroupedCollection() {
    const root = $('#collection-spreads');
    const panel = $('[data-panel="collection"]');
    if (!root || !panel || panel.hidden) return;
    renderingCollection = true;
    checkCompletions({ notify:false });
    const core = readCore();
    const meta = readMeta();
    const entries = allEntries(core, meta);
    const visibleGroups = meta.groups.filter(g => entries.some(e => e.groupId === g.id) || g.rewardId);
    root.classList.add('grouped-collection');
    root.innerHTML = `<div class="gc-book-view">
      <div class="gc-collection-head">
        <div><span>COLLECTION SERIES</span><h2>시리즈별 컬렉션</h2><p>카드와 아이템을 그룹별로 모아 완성 보상을 열어보세요.</p></div>
        <div class="gc-legend"><span>▣ CARD</span><span>◆ ITEM</span><span>✦ HIDDEN</span></div>
      </div>
      ${visibleGroups.length ? visibleGroups.map((group, gi) => {
        const baseEntries = entries.filter(e => !e.isBonus && e.groupId === group.id);
        const reward = group.rewardId ? entries.find(e => e.id === group.rewardId) : null;
        const shown = reward ? [...baseEntries, reward] : baseEntries;
        const stats = groupStats(group.id, core, meta);
        const pct = stats.total ? Math.round(stats.owned / stats.total * 100) : 0;
        return `<section class="gc-group" style="--group-color:${safeColor(group.color, '#79bff2')}">
          <header class="gc-group-head">
            <span class="gc-group-icon">${esc(group.icon || '✦')}</span>
            <div><small>${esc(group.subtitle || 'COLLECTION SERIES')}</small><h3>${esc(group.name)}</h3></div>
            <div class="gc-progress"><b>${stats.owned} / ${stats.total}</b><span><i style="width:${pct}%"></i></span><small>${stats.complete ? 'COMPLETE' : `${pct}%`}</small></div>
          </header>
          ${reward ? `<p class="gc-reward-note ${stats.complete ? 'is-complete' : ''}">✦ 완성 보상 · ${stats.complete ? `${esc(reward.name)} 획득 완료` : '모든 기본 컬렉션을 모으면 히든 보상이 열려요.'}</p>` : ''}
          <div class="gc-grid">${shown.map((entry, i) => entryCard(entry, i)).join('')}</div>
        </section>`;
      }).join('') : `<div class="gc-empty">아직 컬렉션 그룹이 없습니다. 설정에서 그룹을 만들어주세요.</div>`}
    </div>`;
    document.body.classList.add('collection-groups-active');
    requestAnimationFrame(() => { renderingCollection = false; updateGlobalStats(); });
  }

  function updateGlobalStats() {
    const core = readCore();
    const meta = readMeta();
    const baseTotal = core.gachaItems.length;
    const baseOwned = core.gachaItems.filter(x => Number(core.owned[x.id] || 0) > 0).length;
    const bonusTotal = meta.bonusItems.filter(b => meta.groups.some(g => g.rewardId === b.id)).length;
    const bonusOwned = meta.bonusItems.filter(b => Number(meta.bonusOwned[b.id] || 0) > 0).length;
    const total = baseTotal + bonusTotal;
    const owned = baseOwned + bonusOwned;
    $$('[data-owned-count]').forEach(el => el.textContent = owned);
    $$('[data-total-cards]').forEach(el => el.textContent = total);
    const bar = $('#collection-progress-bar');
    if (bar) bar.style.width = `${total ? Math.round(owned / total * 100) : 0}%`;
    const copy = $('#collection-progress-copy');
    if (copy) copy.textContent = `컬렉션 ${total ? Math.round(owned / total * 100) : 0}% 완성`;
    const statLabel = $('.home-stats > div:first-child > span');
    if (statLabel) statLabel.textContent = '모은 컬렉션';
    const rule = $('.gacha-rule ol li:nth-child(2)');
    if (rule) rule.textContent = '처음 만난 카드와 아이템은 컬렉션에 저장돼요.';
  }

  function openDetail(id) {
    const core = readCore();
    const meta = readMeta();
    const entry = allEntries(core, meta).find(e => e.id === id);
    const modal = $('#grouped-detail-modal');
    if (!entry || !modal) return;
    const locked = entry.isBonus && entry.ownedCount < 1;
    const group = meta.groups.find(g => g.id === entry.groupId);
    modal.innerHTML = `<div class="gc-detail-backdrop" data-gc-close></div><section class="gc-detail-sheet ${entry.type === 'item' ? 'is-item' : 'is-card'}" style="--entry-color:${safeColor(entry.color)}">
      <button class="gc-detail-close" type="button" data-gc-close>×</button>
      <div class="gc-detail-art ${entry.type === 'item' ? 'gc-art--item' : 'gc-art--card'}">${imageMarkup(entry, locked)}</div>
      <div class="gc-detail-copy"><span>${esc(locked ? 'HIDDEN REWARD' : `${entry.rarity || 'CLOUD'} · ${entry.type === 'item' ? 'ITEM' : 'CARD'}`)}</span><h2>${esc(locked ? '???' : entry.name)}</h2>
      <p>${esc(locked ? '이 그룹의 기본 컬렉션을 전부 모으면 공개됩니다.' : (entry.shortNote || ''))}</p>
      <dl><div><dt>그룹</dt><dd>${esc(group?.name || '기타')}</dd></div><div><dt>보유</dt><dd>${entry.ownedCount > 0 ? `${entry.ownedCount}개` : '미획득'}</dd></div></dl>
      <p class="gc-detail-description">${esc(locked ? '히든 보상입니다.' : (entry.description || '상세 설명이 아직 없어요.'))}</p></div>
    </section>`;
    modal.hidden = false;
  }

  function closeDetail() {
    const modal = $('#grouped-detail-modal');
    if (modal) modal.hidden = true;
  }

  function groupOptions(meta, selected = '') {
    return meta.groups.map(g => `<option value="${esc(g.id)}" ${g.id === selected ? 'selected' : ''}>${esc(g.name)}</option>`).join('');
  }

  function rewardOptions(meta, selected = '') {
    return `<option value="">없음</option>${meta.bonusItems.map(x => `<option value="${esc(x.id)}" ${x.id === selected ? 'selected' : ''}>${esc(x.name)} (${x.type === 'item' ? '아이템' : '카드'})</option>`).join('')}`;
  }

  function renderGroupSettings() {
    const panel = $('#collection-group-settings');
    if (!panel) return;
    const core = readCore();
    const meta = readMeta();
    panel.innerHTML = `<div class="settings-section__heading"><div><h3>컬렉션 그룹 · 시리즈</h3><p>카드와 아이템을 시리즈별로 묶고, 그룹 완성 시 히든 보상을 열 수 있어요.</p></div><button class="add-setting-button" type="button" data-gc-add-group>＋ 그룹 추가</button></div>
      <div class="gc-settings-note">기본으로 픽셀리 멤버 6명은 <b>픽셀리</b> 그룹에 들어갑니다. 메인 시리즈에 연결된 가챠 항목은 같은 이름의 그룹도 자동 생성됩니다.</div>
      <div class="gc-settings-groups">${meta.groups.map(g => `<article class="gc-setting-group" data-group-row="${esc(g.id)}">
        <div class="gc-setting-group-main"><input data-gfield="name" value="${esc(g.name)}" aria-label="그룹 이름"><input data-gfield="subtitle" value="${esc(g.subtitle || '')}" aria-label="그룹 부제"><input data-gfield="icon" value="${esc(g.icon || '✦')}" maxlength="4" aria-label="아이콘"><input data-gfield="color" type="color" value="${safeColor(g.color)}" aria-label="그룹 색상"></div>
        <label>완성 히든 보상<select data-gfield="rewardId">${rewardOptions(meta, g.rewardId || '')}</select></label>
        ${['pixely','etc'].includes(g.id) ? '<small>기본 그룹</small>' : '<button type="button" class="gc-mini-danger" data-gc-delete-group>그룹 삭제</button>'}
      </article>`).join('')}</div>
      <div class="gc-settings-divider"></div>
      <div class="settings-section__heading"><div><h3>카드 · 아이템 분류</h3><p>가챠 항목마다 CARD/ITEM, 소속 그룹과 이미지 주소를 지정해요. 투명 PNG 아이템은 여백 없이 오브젝트 중심으로 표시됩니다.</p></div></div>
      <div class="gc-item-manager">${core.gachaItems.map(item => {
        const m = getItemMeta(item.id, meta);
        return `<article class="gc-item-setting" data-item-row="${esc(item.id)}"><span class="gc-setting-symbol">${esc(item.symbol || '✦')}</span><div class="gc-setting-copy"><b>${esc(item.name)}</b><small>${esc(item.rarity || '')}</small></div>
          <select data-ifield="type"><option value="card" ${m.type === 'card' ? 'selected' : ''}>CARD</option><option value="item" ${m.type === 'item' ? 'selected' : ''}>ITEM</option></select>
          <select data-ifield="groupId">${groupOptions(meta, m.groupId)}</select>
          <input data-ifield="imageUrl" value="${esc(m.imageUrl || item.imageUrl || '')}" placeholder="이미지 URL (PNG/JPG/WebP)">
          <label class="gc-check"><input data-ifield="includeInCompletion" type="checkbox" ${m.includeInCompletion !== false ? 'checked' : ''}> 완성도 포함</label>
        </article>`;
      }).join('')}</div>
      <div class="gc-settings-divider"></div>
      <div class="settings-section__heading"><div><h3>히든 완성 보상</h3><p>그룹을 100% 모았을 때 자동으로 공개할 카드 또는 아이템을 만들어요.</p></div><button class="add-setting-button" type="button" data-gc-add-bonus>＋ 히든 보상 추가</button></div>
      <div class="gc-bonus-manager">${meta.bonusItems.length ? meta.bonusItems.map(b => `<article class="gc-bonus-setting" data-bonus-row="${esc(b.id)}">
        <input data-bfield="name" value="${esc(b.name)}" placeholder="히든 보상 이름">
        <select data-bfield="type"><option value="card" ${b.type === 'card' ? 'selected' : ''}>CARD</option><option value="item" ${b.type === 'item' ? 'selected' : ''}>ITEM</option></select>
        <select data-bfield="groupId">${groupOptions(meta, b.groupId)}</select>
        <input data-bfield="symbol" value="${esc(b.symbol || '★')}" maxlength="4" placeholder="기호">
        <input data-bfield="color" type="color" value="${safeColor(b.color, '#b78ed0')}">
        <input class="gc-wide" data-bfield="imageUrl" value="${esc(b.imageUrl || '')}" placeholder="히든 이미지 URL">
        <input class="gc-wide" data-bfield="shortNote" value="${esc(b.shortNote || '')}" placeholder="짧은 메모">
        <textarea class="gc-wide" data-bfield="description" rows="2" placeholder="상세 설명">${esc(b.description || '')}</textarea>
        <button type="button" class="gc-mini-danger" data-gc-delete-bonus>삭제</button>
      </article>`).join('') : '<p class="gc-empty-settings">아직 히든 보상이 없습니다.</p>'}</div>`;
  }

  function injectSettings() {
    const nav = $('.settings-tabs');
    const content = $('.settings-content');
    if (!nav || !content || $('#collection-group-settings')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.collectionGroupsTab = '1';
    btn.textContent = '컬렉션 그룹';
    const resetBtn = $('[data-settings-tab="reset"]', nav);
    nav.insertBefore(btn, resetBtn || null);
    const section = document.createElement('section');
    section.className = 'settings-section';
    section.id = 'collection-group-settings';
    section.hidden = true;
    content.appendChild(section);
    renderGroupSettings();
  }

  function showGroupSettings() {
    $$('.settings-tabs button').forEach(b => b.classList.toggle('is-active', !!b.dataset.collectionGroupsTab));
    $$('.settings-content > .settings-section').forEach(p => { p.hidden = p.id !== 'collection-group-settings'; p.classList.toggle('is-active', p.id === 'collection-group-settings'); });
    renderGroupSettings();
  }

  function addGroup() {
    const meta = readMeta();
    const group = { id:uid('group'), name:'새 그룹', subtitle:'COLLECTION SERIES', icon:'✦', color:'#79bff2', rewardId:'' };
    meta.groups.push(group);
    saveMeta(meta);
    renderGroupSettings();
    renderGroupedCollection();
  }

  function addBonus() {
    const meta = readMeta();
    const groupId = meta.groups[0]?.id || 'pixely';
    meta.bonusItems.push({ id:uid('hidden'), name:'히든 보상', type:'card', groupId, symbol:'★', rarity:'HIDDEN', color:'#b78ed0', imageUrl:'', shortNote:'그룹 완성 보상', description:'' });
    saveMeta(meta);
    renderGroupSettings();
  }

  function handleSettingsChange(target) {
    const meta = readMeta();
    const groupRow = target.closest('[data-group-row]');
    const itemRow = target.closest('[data-item-row]');
    const bonusRow = target.closest('[data-bonus-row]');
    if (groupRow && target.dataset.gfield) {
      const g = meta.groups.find(x => x.id === groupRow.dataset.groupRow); if (!g) return;
      g[target.dataset.gfield] = target.value;
    } else if (itemRow && target.dataset.ifield) {
      const id = itemRow.dataset.itemRow;
      const m = meta.itemMeta[id] || (meta.itemMeta[id] = { groupId:'etc', type:'card', imageUrl:'', includeInCompletion:true });
      m[target.dataset.ifield] = target.dataset.ifield === 'includeInCompletion' ? !!target.checked : target.value;
    } else if (bonusRow && target.dataset.bfield) {
      const b = meta.bonusItems.find(x => x.id === bonusRow.dataset.bonusRow); if (!b) return;
      b[target.dataset.bfield] = target.value;
    } else return;
    saveMeta(meta);
    checkCompletions({ notify:false });
    scheduleCollectionRender();
  }

  function deleteGroup(id) {
    const meta = readMeta();
    if (['pixely','etc'].includes(id)) return;
    meta.groups = meta.groups.filter(g => g.id !== id);
    Object.values(meta.itemMeta).forEach(m => { if (m.groupId === id) m.groupId = 'etc'; });
    meta.bonusItems.forEach(b => { if (b.groupId === id) b.groupId = 'etc'; });
    saveMeta(meta);
    renderGroupSettings();
    renderGroupedCollection();
  }

  function deleteBonus(id) {
    const meta = readMeta();
    meta.bonusItems = meta.bonusItems.filter(b => b.id !== id);
    delete meta.bonusOwned[id];
    meta.groups.forEach(g => { if (g.rewardId === id) g.rewardId = ''; });
    saveMeta(meta);
    renderGroupSettings();
    renderGroupedCollection();
  }

  function patchResultModal() {
    const modal = $('#result-modal');
    if (!modal || modal.hidden) return;
    const core = readCore();
    const meta = readMeta();
    const id = core.lastCardId;
    const item = core.gachaItems.find(x => x.id === id);
    if (!item) return;
    const m = getItemMeta(id, meta);
    const entry = { ...item, ...m, ownedCount:Number(core.owned[id] || 0) };
    const art = $('#result-card');
    if (art) {
      art.classList.toggle('gc-result-item', entry.type === 'item');
      art.classList.toggle('gc-result-card', entry.type !== 'item');
      art.style.setProperty('--entry-color', safeColor(entry.color));
      art.innerHTML = `<div class="gc-result-inner ${entry.type === 'item' ? 'gc-art--item' : 'gc-art--card'}">${imageMarkup(entry, false)}<span>${esc(entry.name)}</span><small>${esc(entry.rarity || '')} · ${entry.type === 'item' ? 'ITEM' : 'CARD'}</small></div>`;
    }
    const duplicate = Number(core.owned[id] || 0) > 1;
    const title = $('#result-title');
    const copy = $('#result-copy');
    const action = $('#result-primary-action');
    if (entry.type === 'item') {
      if (title) title.textContent = duplicate ? '중복 아이템을 다시 만났어요.' : '새로운 아이템을 얻었어요!';
      if (copy) copy.textContent = duplicate ? '별가루 +10' : '아이템을 컬렉션에 보관했어요.';
      if (action) action.textContent = duplicate ? '확인' : '컬렉션에 보관하기';
    }
    checkCompletions({ notify:true });
    updateGlobalStats();
  }

  function scheduleCollectionRender() {
    clearTimeout(rerenderTimer);
    rerenderTimer = setTimeout(() => {
      if (renderingCollection) return;
      renderGroupedCollection();
      updateGlobalStats();
    }, 40);
  }

  function injectDetailModal() {
    if ($('#grouped-detail-modal')) return;
    const div = document.createElement('div');
    div.id = 'grouped-detail-modal';
    div.className = 'gc-detail-modal';
    div.hidden = true;
    document.body.appendChild(div);
  }

  function bind() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-collection-groups-tab]')) { showGroupSettings(); return; }
      const tab = t.closest('[data-tab]');
      if (tab) {
        if (tab.dataset.tab === 'collection') setTimeout(renderGroupedCollection, 30);
        else document.body.classList.remove('collection-groups-active');
      }
      const openTab = t.closest('[data-open-tab]');
      if (openTab?.dataset.openTab === 'collection') setTimeout(renderGroupedCollection, 30);
      const card = t.closest('[data-gc-item]');
      if (card) { openDetail(card.dataset.gcItem); return; }
      if (t.closest('[data-gc-close]')) { closeDetail(); return; }
      if (t.closest('[data-gc-add-group]')) { addGroup(); return; }
      if (t.closest('[data-gc-add-bonus]')) { addBonus(); return; }
      const delGroup = t.closest('[data-gc-delete-group]');
      if (delGroup) { const row = delGroup.closest('[data-group-row]'); if (row && confirm('이 그룹을 삭제하고 안의 항목을 기타 컬렉션으로 옮길까요?')) deleteGroup(row.dataset.groupRow); return; }
      const delBonus = t.closest('[data-gc-delete-bonus]');
      if (delBonus) { const row = delBonus.closest('[data-bonus-row]'); if (row && confirm('이 히든 보상을 삭제할까요?')) deleteBonus(row.dataset.bonusRow); return; }
      const originalTab = t.closest('[data-settings-tab]');
      if (originalTab) {
        const ours = $('#collection-group-settings');
        if (ours) { ours.hidden = true; ours.classList.remove('is-active'); }
        $('[data-collection-groups-tab]')?.classList.remove('is-active');
      }
    });
    document.addEventListener('input', (e) => {
      if (e.target.matches('[data-gfield],[data-ifield],[data-bfield]')) handleSettingsChange(e.target);
    });
    document.addEventListener('change', (e) => {
      if (e.target.matches('[data-gfield],[data-ifield],[data-bfield]')) handleSettingsChange(e.target);
    });

    const result = $('#result-modal');
    if (result) new MutationObserver(() => { if (!result.hidden) setTimeout(patchResultModal, 0); }).observe(result, { attributes:true, attributeFilter:['hidden'] });
    const settings = $('#settings-modal');
    if (settings) new MutationObserver(() => { if (!settings.hidden) { injectSettings(); renderGroupSettings(); } }).observe(settings, { attributes:true, attributeFilter:['hidden'] });
    const collectionRoot = $('#collection-spreads');
    if (collectionRoot) new MutationObserver(() => {
      if (renderingCollection) return;
      const panel = $('[data-panel="collection"]');
      if (panel && !panel.hidden && !collectionRoot.classList.contains('grouped-collection')) scheduleCollectionRender();
    }).observe(collectionRoot, { childList:true });
  }

  function boot() {
    readMeta();
    injectSettings();
    injectDetailModal();
    bind();
    checkCompletions({ notify:false });
    updateGlobalStats();
    if (!$('[data-panel="collection"]')?.hidden) renderGroupedCollection();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
