(() => {
  if (window.__PIXELY_GACHA_UPGRADE_V3__) return;
  window.__PIXELY_GACHA_UPGRADE_V3__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const DRAW_COST = 100;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  let pendingCharges = 0;

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
    $$('[data-dust-count], [data-pcf-dust]').forEach(node => {
      const next = value.toLocaleString('ko-KR');
      if (node.textContent !== next) node.textContent = next;
    });
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

  function setText(node, text) {
    if (node && node.textContent !== text) node.textContent = text;
  }

  function decorate() {
    const draw = $('#draw-button');
    if (draw) {
      setText($('b', draw), '1회 뽑기');
      setText($('small', draw), `별가루 ✦ ${DRAW_COST} 사용`);
    }
    setText($('[data-panel="gacha"] .gacha-info h2'), '하늘빛 캡슐 뽑기');

    const rules = $('[data-panel="gacha"] .gacha-rule ol');
    if (rules) {
      const wanted = [
        'CLICK에서 별가루를 모아요.',
        '1회 뽑기에 별가루 100을 사용해요.',
        '카드와 성장 카드는 컬렉션에 저장돼요.'
      ];
      const current = [...rules.children].map(li => li.textContent.trim());
      if (current.length !== wanted.length || wanted.some((text, i) => current[i] !== text)) {
        rules.replaceChildren(...wanted.map(text => {
          const li = document.createElement('li');
          li.textContent = text;
          return li;
        }));
      }
    }

    const core = readCore();
    const dust = Math.max(0, Number(core.dust)||0).toLocaleString('ko-KR');
    $$('[data-dust-count], [data-pcf-dust]').forEach(node => {
      if (node.textContent !== dust) node.textContent = dust;
    });
  }

  function commitCharge() {
    if (pendingCharges <= 0) return;
    pendingCharges -= 1;
    const core = readCore();
    const before = Math.max(0, Number(core.dust) || 0);
    const after = syncDust(Math.max(0, before - DRAW_COST));
    const message = $('#gacha-message');
    setText(message, `뽑기 완료 · 별가루 ✦ ${DRAW_COST} 사용 · 남은 별가루 ✦ ${after.toLocaleString('ko-KR')}`);
  }

  document.addEventListener('click', event => {
    const draw = event.target.closest?.('#draw-button, #draw-again');
    if (!draw || draw.disabled || event.__pixelyDustChecked) return;

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

    event.__pixelyDustChecked = true;
    pendingCharges += 1;
    setText($('#gacha-message'), `별가루 ✦ ${DRAW_COST}을 사용해 캡슐을 열고 있어요…`);
    setTimeout(() => {
      if (pendingCharges > 0 && $('#result-modal')?.hidden) pendingCharges -= 1;
    }, 3500);
  }, true);

  function boot() {
    decorate();

    // IMPORTANT: Do not watch the whole gacha subtree. decorate() changes that subtree,
    // so observing it creates a self-triggering render loop and freezes tab transitions.
    const modal = $('#result-modal');
    if (modal) new MutationObserver(() => {
      if (!modal.hidden && pendingCharges > 0) setTimeout(commitCharge, 0);
    }).observe(modal,{attributes:true,attributeFilter:['hidden']});

    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="gacha"], [data-open-tab="gacha"]')) {
        setTimeout(decorate, 0);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot,{once:true});
  else boot();
})();