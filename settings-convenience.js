(() => {
  if (window.__PIXELY_SETTINGS_CONVENIENCE_V1__) return;
  window.__PIXELY_SETTINGS_CONVENIENCE_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const MEMBER_IDS = new Set(['ra','deok','gak','gong','jam','soo']);
  const selected = new Set();
  let groupFilter = 'all';
  let typeFilter = 'all';
  let searchText = '';
  let classificationOpen = false;
  let decorateTimer = 0;

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const esc = (v='') => String(v ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function read(key, fallback={}) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function getCore() {
    const core = read(CORE_KEY, {});
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    return core;
  }

  function getMeta() {
    const meta = read(META_KEY, {version:2,groups:[],itemMeta:{},bonusItems:[],bonusOwned:{},unlockLog:[]});
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    return meta;
  }

  function fallbackMeta(id) {
    return { groupId: MEMBER_IDS.has(id) ? 'pixely' : 'etc', type: MEMBER_IDS.has(id) ? 'card' : 'item', imageUrl:'', includeInCompletion:true };
  }

  function itemMeta(meta, id) {
    return meta.itemMeta[id] || fallbackMeta(id);
  }

  function groupOptions(meta, selectedId='') {
    return meta.groups.map(group => `<option value="${esc(group.id)}" ${group.id === selectedId ? 'selected' : ''}>${esc(group.name)}</option>`).join('');
  }

  function groupName(meta, id) {
    return meta.groups.find(group => group.id === id)?.name || '기타 컬렉션';
  }

  function saveItemMeta(id, patch) {
    const meta = getMeta();
    const current = { ...fallbackMeta(id), ...(meta.itemMeta[id] || {}) };
    meta.itemMeta[id] = { ...current, ...patch };
    write(META_KEY, meta);
    syncVisibleCollectionRow(id, meta.itemMeta[id]);
    scheduleDecorate();
  }

  function saveManyGroup(ids, groupId) {
    const meta = getMeta();
    ids.forEach(id => {
      const current = { ...fallbackMeta(id), ...(meta.itemMeta[id] || {}) };
      meta.itemMeta[id] = { ...current, groupId };
    });
    write(META_KEY, meta);
    ids.forEach(id => syncVisibleCollectionRow(id, meta.itemMeta[id]));
    selected.clear();
    scheduleDecorate();
  }

  function syncVisibleCollectionRow(id, data) {
    const row = $(`[data-item-row="${CSS.escape(id)}"]`);
    if (!row) return;
    const group = $('[data-ifield="groupId"]', row);
    const type = $('[data-ifield="type"]', row);
    const completion = $('[data-ifield="includeInCompletion"]', row);
    if (group && group.value !== data.groupId) group.value = data.groupId;
    if (type && type.value !== data.type) type.value = data.type;
    if (completion) completion.checked = data.includeInCompletion !== false;
  }

  function ensureGachaToolbar() {
    const panel = $('[data-settings-panel="gacha"]');
    const list = $('#gacha-settings-list');
    if (!panel || !list) return;
    let toolbar = $('.sc-toolbar', panel);
    const meta = getMeta();
    if (!toolbar) {
      toolbar = document.createElement('div');
      toolbar.className = 'sc-toolbar';
      toolbar.innerHTML = `
        <div class="sc-toolbar-main">
          <label class="sc-search"><span>⌕</span><input type="search" data-sc-search placeholder="카드 이름 검색"></label>
          <select data-sc-group-filter aria-label="그룹 필터"></select>
          <select data-sc-type-filter aria-label="타입 필터">
            <option value="all">CARD + ITEM</option><option value="card">CARD만</option><option value="item">ITEM만</option>
          </select>
        </div>
        <div class="sc-batch" data-sc-batch hidden>
          <b data-sc-selected-count>0개 선택</b>
          <select data-sc-batch-group aria-label="선택한 항목 이동할 그룹"></select>
          <button type="button" data-sc-batch-move>선택 항목 이동</button>
          <button type="button" class="sc-ghost" data-sc-clear-selection>선택 해제</button>
        </div>`;
      list.insertAdjacentElement('beforebegin', toolbar);
    }
    const groupFilterSelect = $('[data-sc-group-filter]', toolbar);
    const batchGroup = $('[data-sc-batch-group]', toolbar);
    const groupHtml = `<option value="all">전체 그룹</option>${meta.groups.map(g => `<option value="${esc(g.id)}">${esc(g.name)}</option>`).join('')}`;
    if (groupFilterSelect && groupFilterSelect.innerHTML !== groupHtml) groupFilterSelect.innerHTML = groupHtml;
    const batchHtml = `<option value="">이동할 그룹…</option>${meta.groups.map(g => `<option value="${esc(g.id)}">${esc(g.name)}</option>`).join('')}`;
    if (batchGroup && batchGroup.innerHTML !== batchHtml) batchGroup.innerHTML = batchHtml;
    if (groupFilterSelect) groupFilterSelect.value = meta.groups.some(g => g.id === groupFilter) ? groupFilter : 'all';
    const typeSelect = $('[data-sc-type-filter]', toolbar); if (typeSelect) typeSelect.value = typeFilter;
    const search = $('[data-sc-search]', toolbar); if (search && search.value !== searchText) search.value = searchText;
  }

  function decorateGachaRows() {
    const list = $('#gacha-settings-list');
    if (!list) return;
    const meta = getMeta();
    const core = getCore();
    const itemsById = new Map(core.gachaItems.map(item => [String(item.id), item]));

    $$('.settings-item', list).forEach(row => {
      const edit = $('[data-edit-item="gacha"]', row);
      const id = String(edit?.dataset.itemId || '');
      if (!id) return;
      const item = itemsById.get(id);
      if (!item) return;
      const m = itemMeta(meta, id);
      row.dataset.scItemId = id;
      row.dataset.scGroupId = m.groupId;
      row.dataset.scType = m.type;

      let selectBox = $('.sc-select-box', row);
      if (!selectBox) {
        selectBox = document.createElement('label');
        selectBox.className = 'sc-select-box';
        selectBox.title = '여러 카드를 선택해서 한 번에 그룹 이동';
        selectBox.innerHTML = `<input type="checkbox" data-sc-select-card aria-label="${esc(item.name)} 선택"><i></i>`;
        row.prepend(selectBox);
      }
      const checkbox = $('[data-sc-select-card]', row); if (checkbox) checkbox.checked = selected.has(id);

      let quick = $('.sc-quick-controls', row);
      if (!quick) {
        quick = document.createElement('div');
        quick.className = 'sc-quick-controls';
        const actions = $('.settings-item__actions', row);
        if (actions) row.insertBefore(quick, actions); else row.appendChild(quick);
      }
      const signature = `${m.groupId}|${m.type}|${m.includeInCompletion !== false ? 1 : 0}|${meta.groups.map(g=>g.id).join(',')}`;
      if (quick.dataset.signature !== signature) {
        quick.dataset.signature = signature;
        quick.innerHTML = `
          <label><small>그룹</small><select data-sc-quick-group>${groupOptions(meta, m.groupId)}</select></label>
          <label><small>종류</small><select data-sc-quick-type><option value="card" ${m.type === 'card' ? 'selected' : ''}>CARD</option><option value="item" ${m.type === 'item' ? 'selected' : ''}>ITEM</option></select></label>
          <label class="sc-completion"><input type="checkbox" data-sc-quick-completion ${m.includeInCompletion !== false ? 'checked' : ''}><span>완성도</span></label>`;
      }

      let chip = $('.sc-group-chip', row);
      if (!chip) {
        chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'sc-group-chip';
        $('.settings-item__copy', row)?.appendChild(chip);
      }
      chip.dataset.scOpenGroup = m.groupId;
      chip.textContent = groupName(meta, m.groupId);
    });
    applyGachaFilter();
    refreshBatchBar();
  }

  function applyGachaFilter() {
    const list = $('#gacha-settings-list');
    if (!list) return;
    const q = searchText.trim().toLowerCase();
    let visible = 0;
    $$('.settings-item[data-sc-item-id]', list).forEach(row => {
      const text = row.textContent.toLowerCase();
      const groupOk = groupFilter === 'all' || row.dataset.scGroupId === groupFilter;
      const typeOk = typeFilter === 'all' || row.dataset.scType === typeFilter;
      const searchOk = !q || text.includes(q);
      const show = groupOk && typeOk && searchOk;
      row.hidden = !show;
      if (show) visible += 1;
    });
    let empty = $('.sc-filter-empty', list);
    if (!empty) {
      empty = document.createElement('div');
      empty.className = 'sc-filter-empty';
      empty.textContent = '조건에 맞는 카드가 없어요.';
      list.appendChild(empty);
    }
    empty.hidden = visible !== 0;
  }

  function refreshBatchBar() {
    const toolbar = $('.sc-toolbar');
    if (!toolbar) return;
    const batch = $('[data-sc-batch]', toolbar);
    const count = $('[data-sc-selected-count]', toolbar);
    if (batch) batch.hidden = selected.size === 0;
    if (count) count.textContent = `${selected.size}개 선택`;
  }

  function decorateGroupSettings() {
    const panel = $('#collection-group-settings');
    if (!panel) return;
    const meta = getMeta();
    const core = getCore();
    const itemsByGroup = new Map(meta.groups.map(group => [group.id, []]));
    core.gachaItems.forEach(item => {
      const m = itemMeta(meta, String(item.id));
      if (!itemsByGroup.has(m.groupId)) itemsByGroup.set(m.groupId, []);
      itemsByGroup.get(m.groupId).push(item);
    });

    $$('.gc-setting-group[data-group-row]', panel).forEach(row => {
      const id = row.dataset.groupRow;
      const items = itemsByGroup.get(id) || [];
      let summary = $('.sc-group-summary', row);
      if (!summary) {
        summary = document.createElement('div');
        summary.className = 'sc-group-summary';
        row.appendChild(summary);
      }
      const names = items.map(item=>item.name).join('|');
      const signature = `${items.length}:${names}`;
      if (summary.dataset.signature !== signature) {
        summary.dataset.signature = signature;
        summary.innerHTML = `<div class="sc-group-summary-head"><b>${items.length}개</b><button type="button" data-sc-view-group="${esc(id)}">가챠 카드에서 이 그룹 보기 →</button></div>
          <div class="sc-item-chips">${items.length ? items.slice(0,8).map(item => `<span>${esc(item.name)}</span>`).join('') : '<em>아직 들어있는 카드가 없어요.</em>'}${items.length > 8 ? `<span>+${items.length - 8}</span>` : ''}</div>`;
      }
    });

    const manager = $('.gc-item-manager', panel);
    if (manager) {
      let toggle = $('[data-sc-toggle-classification]', panel);
      if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'sc-classification-toggle';
        toggle.dataset.scToggleClassification = '1';
        const heading = [...$$('.settings-section__heading', panel)].find(h => h.querySelector('h3')?.textContent.includes('카드 · 아이템 분류'));
        heading?.appendChild(toggle);
      }
      if (toggle) toggle.textContent = classificationOpen ? '분류 목록 접기 ↑' : '상세 분류 목록 펼치기 ↓';
      manager.hidden = !classificationOpen;
    }
  }

  function openGachaForGroup(groupId) {
    groupFilter = groupId || 'all';
    $('[data-settings-tab="gacha"]')?.click();
    setTimeout(() => {
      ensureGachaToolbar();
      const select = $('[data-sc-group-filter]');
      if (select) select.value = groupFilter;
      decorateGachaRows();
    }, 50);
  }

  function scheduleDecorate() {
    clearTimeout(decorateTimer);
    decorateTimer = setTimeout(() => {
      ensureGachaToolbar();
      decorateGachaRows();
      decorateGroupSettings();
    }, 50);
  }

  function bind() {
    document.addEventListener('input', event => {
      const search = event.target.closest?.('[data-sc-search]');
      if (search) { searchText = search.value; applyGachaFilter(); }
    });

    document.addEventListener('change', event => {
      const target = event.target;
      if (target.matches('[data-sc-group-filter]')) { groupFilter = target.value; applyGachaFilter(); return; }
      if (target.matches('[data-sc-type-filter]')) { typeFilter = target.value; applyGachaFilter(); return; }

      const row = target.closest?.('[data-sc-item-id]');
      const id = row?.dataset.scItemId;
      if (!id) return;
      if (target.matches('[data-sc-select-card]')) {
        if (target.checked) selected.add(id); else selected.delete(id);
        refreshBatchBar();
        return;
      }
      if (target.matches('[data-sc-quick-group]')) { row.dataset.scGroupId = target.value; saveItemMeta(id, {groupId:target.value}); return; }
      if (target.matches('[data-sc-quick-type]')) { row.dataset.scType = target.value; saveItemMeta(id, {type:target.value}); return; }
      if (target.matches('[data-sc-quick-completion]')) { saveItemMeta(id, {includeInCompletion:!!target.checked}); }
    });

    document.addEventListener('click', event => {
      const move = event.target.closest?.('[data-sc-batch-move]');
      if (move) {
        const group = $('[data-sc-batch-group]')?.value || '';
        if (!group) return;
        saveManyGroup([...selected], group);
        return;
      }
      if (event.target.closest?.('[data-sc-clear-selection]')) {
        selected.clear();
        scheduleDecorate();
        return;
      }
      const view = event.target.closest?.('[data-sc-view-group]');
      if (view) { openGachaForGroup(view.dataset.scViewGroup); return; }
      const chip = event.target.closest?.('[data-sc-open-group]');
      if (chip) {
        const groupTab = $('[data-collection-groups-tab]');
        groupTab?.click();
        setTimeout(() => {
          decorateGroupSettings();
          const target = $(`[data-group-row="${CSS.escape(chip.dataset.scOpenGroup || '')}"]`);
          target?.scrollIntoView({behavior:'smooth', block:'center'});
          target?.classList.add('sc-highlight');
          setTimeout(() => target?.classList.remove('sc-highlight'), 1500);
        }, 80);
        return;
      }
      if (event.target.closest?.('[data-sc-toggle-classification]')) {
        classificationOpen = !classificationOpen;
        decorateGroupSettings();
        return;
      }
      if (event.target.closest?.('#open-settings,[data-settings-tab],[data-collection-groups-tab],[data-add-item="gacha"],[data-edit-item="gacha"],[data-gc-add-group],[data-gc-delete-group],[data-gc-add-bonus],[data-gc-delete-bonus]')) scheduleDecorate();
    });

    document.addEventListener('submit', event => {
      if (event.target.matches?.('#item-editor-form')) setTimeout(scheduleDecorate, 80);
    });
  }

  function boot() {
    bind();
    scheduleDecorate();
    const modal = $('#settings-modal');
    if (modal) new MutationObserver(() => { if (!modal.hidden) scheduleDecorate(); }).observe(modal, {attributes:true, attributeFilter:['hidden']});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();