(() => {
  if (window.__PIXELY_GACHA_UPGRADE_V2__) return;
  window.__PIXELY_GACHA_UPGRADE_V2__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const DRAW_COST = 100;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function readCore() {
    try {
      const value = JSON.parse(localStorage.getItem(CORE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }

  function syncDust(dust) {
    const value = Math.max(0, Number(dust) || 0);
    const core = readCore();
    core.dust = value;
    localStorage.setItem(CORE_KEY, JSON.stringify(core));
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') save.dust = value;
      if (typeof persistSave === 'function') persistSave();
    } catch {}
    $$('[data-dust-count], [data-pcf-dust]').forEach(node => node.textContent = value.toLocaleString('ko-KR'));
    return value;
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2000);
  }

  function goClick() { $('[data-tab="series"]')?.click(); }

  function decorate() {
    const draw = $('#draw-button');
    if (draw) {
      $('b', draw).textContent = '1회 뽑기';
      $('small', draw).textContent = `별가루 ✦ ${DRAW_COST} 사용`;
    }
    const title = $('[data-panel="gacha"] .gacha-info h2');
    if (title) title.textContent = '하늘빛 캡슐 뽑기';
    const rules = $('[data-panel="gacha"] .gacha-rule ol');
    if (rules) rules.innerHTML = '<li>CLICK에서 별가루를 모아요.</li><li>1회 뽑기에 별가루 100을 사용해요.</li><li>카드와 성장 카드는 컬렉션에 저장돼요.</li>';
    const core = readCore();
    $$('[data-dust-count], [data-pcf-dust]').forEach(node => node.textContent = Math.max(0, Number(core.dust)||0).toLocaleString('ko-KR'));
  }

  document.addEventListener('click', event => {
    const draw = event.target.closest?.('#draw-button, #draw-again');
    if (!draw || draw.disabled || event.__pixelyDustCharged) return;

    const core = readCore();
    if (!Array.isArray(core.gachaItems) || !core.gachaItems.length) return;
    const dust = Math.max(0, Number(core.dust) || 0);

    if (dust < DRAW_COST) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      toast(`별가루가 부족해요. 1회 뽑기에는 ✦ ${DRAW_COST}이 필요해요.`);
      if (draw.id === 'draw-again') $('#result-modal')?.setAttribute('hidden','');
      setTimeout(goClick, 80);
      return;
    }

    event.__pixelyDustCharged = true;
    const after = syncDust(dust - DRAW_COST);
    const message = $('#gacha-message');
    if (message) message.textContent = `별가루 ✦ ${DRAW_COST} 사용 · 남은 별가루 ✦ ${after.toLocaleString('ko-KR')}`;
  }, true);

  function boot() {
    decorate();
    const panel = $('[data-panel="gacha"]');
    if (panel) new MutationObserver(decorate).observe(panel,{childList:true,subtree:true});
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="gacha"], [data-open-tab="gacha"]')) setTimeout(decorate, 0);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot,{once:true});
  else boot();
})();