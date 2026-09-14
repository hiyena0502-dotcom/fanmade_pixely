(() => {
  const CORE_KEY = 'pixely-diary-save-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const COLLAPSE_KEY = 'pixely-collection-collapse-v1';
  let queued = false;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function read(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  }

  function norm(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[._\-–—·•:()\[\]{}]/g, '');
  }

  function isPixelyName(value) {
    const n = norm(value);
    return n === '픽셀리' || n === 'pixely' || n === '픽셀리멤버' || n === 'pixelymembers' || n === '픽셀리컬렉션' || n === 'pixelycollection';
  }

  function duplicateIds(core, meta) {
    const ids = new Set();
    const series = Array.isArray(core.seriesItems) ? core.seriesItems : [];
    for (const item of series) {
      if (item?.id && isPixelyName(item.title)) ids.add(`series-${item.id}`);
    }
    for (const group of Array.isArray(meta.groups) ? meta.groups : []) {
      if (group?.id && group.id !== 'pixely' && isPixelyName(group.name)) ids.add(group.id);
    }
    return ids;
  }

  function normalizeData() {
    const core = read(CORE_KEY, { seriesItems: [], gachaItems: [] });
    const meta = read(META_KEY, {});
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    meta.bonusItems = Array.isArray(meta.bonusItems) ? meta.bonusItems : [];
    meta.bonusOwned = meta.bonusOwned && typeof meta.bonusOwned === 'object' ? meta.bonusOwned : {};
    meta.unlockLog = Array.isArray(meta.unlockLog) ? meta.unlockLog : [];

    let canonical = meta.groups.find(g => g?.id === 'pixely');
    if (!canonical) {
      canonical = { id: 'pixely', name: '픽셀리', subtitle: 'PIXELY MEMBERS', icon: '✦', color: '#79bff2', rewardId: '' };
      meta.groups.unshift(canonical);
    }
    if (!canonical.name) canonical.name = '픽셀리';

    const duplicates = duplicateIds(core, meta);
    if (!duplicates.size) return duplicates;

    for (const group of meta.groups) {
      if (!duplicates.has(group?.id)) continue;
      if (!canonical.rewardId && group.rewardId) canonical.rewardId = group.rewardId;
    }

    for (const item of Object.values(meta.itemMeta)) {
      if (item && duplicates.has(item.groupId)) item.groupId = 'pixely';
    }
    for (const bonus of meta.bonusItems) {
      if (bonus && duplicates.has(bonus.groupId)) bonus.groupId = 'pixely';
    }

    meta.groups = meta.groups.filter(group => !duplicates.has(group?.id));
    localStorage.setItem(META_KEY, JSON.stringify(meta));

    const collapse = read(COLLAPSE_KEY, {});
    collapse.defaults = collapse.defaults || {};
    collapse.collapsed = collapse.collapsed || {};
    for (const id of duplicates) {
      if (!Object.prototype.hasOwnProperty.call(collapse.defaults, 'pixely') && Object.prototype.hasOwnProperty.call(collapse.defaults, id)) {
        collapse.defaults.pixely = !!collapse.defaults[id];
      }
      if (!Object.prototype.hasOwnProperty.call(collapse.collapsed, 'pixely') && Object.prototype.hasOwnProperty.call(collapse.collapsed, id)) {
        collapse.collapsed.pixely = !!collapse.collapsed[id];
      }
      delete collapse.defaults[id];
      delete collapse.collapsed[id];
    }
    localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapse));
    return duplicates;
  }

  function cleanUi() {
    const core = read(CORE_KEY, {});
    const meta = read(META_KEY, {});
    const duplicates = duplicateIds(core, meta);

    const heading = $('.gc-collection-head h2');
    if (heading) heading.textContent = '컬렉션';
    const kicker = $('.gc-collection-head > div > span');
    if (kicker) kicker.textContent = 'COLLECTION';

    $$('.settings-section__heading h3').forEach(el => {
      if (el.textContent.trim() === '컬렉션 그룹 · 시리즈') el.textContent = '컬렉션 그룹';
    });
    const note = $('.gc-settings-note');
    if (note) note.innerHTML = '픽셀리 멤버는 <b>픽셀리</b> 한 그룹으로 통합됩니다. 같은 이름의 시리즈형 그룹이 생겨도 자동으로 이 그룹에 합쳐집니다.';

    $$('[data-group-row]').forEach(row => {
      const id = row.dataset.groupRow;
      const name = row.querySelector('[data-gfield="name"]')?.value;
      if (id !== 'pixely' && (duplicates.has(id) || isPixelyName(name))) row.remove();
    });

    $$('select[data-ifield="groupId"], select[data-bfield="groupId"]').forEach(select => {
      [...select.options].forEach(option => {
        if (option.value !== 'pixely' && (duplicates.has(option.value) || isPixelyName(option.textContent))) option.remove();
      });
      if (![...select.options].some(option => option.value === select.value)) select.value = 'pixely';
    });

    const pixelySections = $$('.gc-group').filter(section => isPixelyName(section.querySelector('.gc-group-head h3')?.textContent));
    pixelySections.slice(1).forEach(section => section.remove());
  }

  function run() {
    queued = false;
    normalizeData();
    cleanUi();
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-tab="collection"], [data-open-tab="collection"], #open-settings, [data-collection-groups-tab], [data-gc-add-group]')) {
      setTimeout(queue, 0);
      setTimeout(queue, 60);
    }
  }, true);

  document.addEventListener('input', event => {
    if (event.target.matches('[data-gfield="name"], [data-ifield="groupId"], [data-bfield="groupId"]')) setTimeout(queue, 0);
  }, true);

  document.addEventListener('change', event => {
    if (event.target.matches('[data-gfield="name"], [data-ifield="groupId"], [data-bfield="groupId"]')) setTimeout(queue, 0);
  }, true);

  window.addEventListener('storage', event => {
    if ([CORE_KEY, META_KEY, COLLAPSE_KEY].includes(event.key)) queue();
  });

  new MutationObserver(queue).observe(document.body, { childList: true, subtree: true });
  run();
})();