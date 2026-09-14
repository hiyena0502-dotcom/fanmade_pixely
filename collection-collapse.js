(() => {
  const META_KEY = 'pixely-collection-groups-v2';
  const CORE_KEY = 'pixely-diary-save-v1';
  const STATE_KEY = 'pixely-collection-collapse-v1';
  let queued = false;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function json(key, fallback = {}) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; }
    catch { return fallback; }
  }

  function state() {
    const value = json(STATE_KEY);
    value.defaults = value.defaults || {};
    value.collapsed = value.collapsed || {};
    return value;
  }

  function save(value) { localStorage.setItem(STATE_KEY, JSON.stringify(value)); }

  function visibleGroups() {
    const meta = json(META_KEY);
    const core = json(CORE_KEY);
    const groups = Array.isArray(meta.groups) ? meta.groups : [];
    const items = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    const itemMeta = meta.itemMeta || {};
    const bonus = Array.isArray(meta.bonusItems) ? meta.bonusItems : [];
    return groups.filter(group =>
      items.some(item => (itemMeta[item.id]?.groupId || 'etc') === group.id) ||
      bonus.some(item => item.groupId === group.id) ||
      group.rewardId
    );
  }

  function collapsed(id, value) {
    if (Object.prototype.hasOwnProperty.call(value.collapsed, id)) return !!value.collapsed[id];
    return !!value.defaults[id];
  }

  function decorateCollection() {
    const groups = visibleGroups();
    const value = state();
    $$('.gc-group').forEach((section, index) => {
      const group = groups[index];
      const head = $('.gc-group-head', section);
      if (!group || !head) return;
      const isCollapsed = collapsed(group.id, value);
      section.dataset.collapseGroup = group.id;
      section.classList.toggle('is-collapsed', isCollapsed);
      head.dataset.gcCollapseToggle = group.id;
      head.setAttribute('role', 'button');
      head.tabIndex = 0;
      head.setAttribute('aria-expanded', String(!isCollapsed));
      if (!$('.gc-collapse-toggle', head)) {
        const icon = document.createElement('span');
        icon.className = 'gc-collapse-toggle';
        icon.setAttribute('aria-hidden', 'true');
        head.appendChild(icon);
      }
    });
  }

  function decorateSettings() {
    const value = state();
    $$('[data-group-row]').forEach(row => {
      const id = row.dataset.groupRow;
      if (!id) return;
      row.classList.add('gc-has-collapse');
      let label = $('.gc-collapse-setting', row);
      if (!label) {
        label = document.createElement('label');
        label.className = 'gc-collapse-setting';
        label.innerHTML = '<input type="checkbox" data-gc-default-collapsed> 기본 접힘';
        const remove = $('[data-gc-delete-group]', row);
        if (remove) row.insertBefore(label, remove); else row.appendChild(label);
      }
      const input = $('[data-gc-default-collapsed]', label);
      if (input) input.checked = !!value.defaults[id];
    });
  }

  function toggle(id) {
    const value = state();
    value.collapsed[id] = !collapsed(id, value);
    save(value);
    decorateCollection();
  }

  function setDefault(id, checked) {
    const value = state();
    value.defaults[id] = checked;
    value.collapsed[id] = checked;
    save(value);
    decorateCollection();
  }

  function refresh() {
    queued = false;
    decorateCollection();
    decorateSettings();
  }

  function queueRefresh() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(refresh);
  }

  document.addEventListener('click', event => {
    const head = event.target.closest('[data-gc-collapse-toggle]');
    if (head) toggle(head.dataset.gcCollapseToggle);
  });

  document.addEventListener('keydown', event => {
    const head = event.target.closest?.('[data-gc-collapse-toggle]');
    if (!head || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    toggle(head.dataset.gcCollapseToggle);
  });

  document.addEventListener('change', event => {
    const input = event.target.closest?.('[data-gc-default-collapsed]');
    if (!input) return;
    const row = input.closest('[data-group-row]');
    if (row?.dataset.groupRow) setDefault(row.dataset.groupRow, input.checked);
  });

  new MutationObserver(queueRefresh).observe(document.body, { childList: true, subtree: true });
  queueRefresh();
})();