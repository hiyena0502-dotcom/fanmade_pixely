(() => {
  if (window.__PIXELY_GACHA_UPGRADE_V4__) return;
  window.__PIXELY_GACHA_UPGRADE_V4__ = true;

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

    // Keep script.js's in-memory save object in sync before its draw logic persists again.
    // This prevents the old dust value from being written back after the charge.
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

    const again = $('#draw-again');
    if (again) {
      again.dataset.drawCost = String(DRAW_COST);
      again.title = `별가루 ${DRAW_COST} 사용`;
    }

    setText($('[data-panel="gacha"] .gacha-info h2'), '하늘빛 캡슐 뽑기');

    const rules = $('[data-panel="gacha"] .gacha-rule ol');
    if (rules) {
      const wanted = [
        'CLICK에서 별가루를 모아요.',
        '1회 뽑기마다 별가루 100을 사용해요.',
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

  function rejectDraw(draw) {
    toast(`별가루가 부족해요. 1회 뽑기에는 ✦ ${DRAW_COST}이 필요해요.`);
    if (draw.id === 'draw-again') $('#result-modal')?.setAttribute('hidden','');
    setTimeout(goClick, 80);
  }

  function chargeForDraw(draw, event) {
    if (!draw || draw.disabled || event.__pixelyDustCharged) return true;

    const core = readCore();
    if (!Array.isArray(core.gachaItems) || !core.gachaItems.length) return true;

    const dust = Math.max(0, Number(core.dust) || 0);
    if (dust < DRAW_COST) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      rejectDraw(draw);
      return false;
    }

    event.__pixelyDustCharged = true;
    const after = syncDust(dust - DRAW_COST);
    setText($('#gacha-message'), `별가루 ✦ ${DRAW_COST} 사용 · 남은 별가루 ✦ ${after.toLocaleString('ko-KR')}`);
    return true;
  }

  // Charge at the start of EVERY draw request. The old implementation waited for the
  // result modal to change hidden state, but "draw again" keeps that modal open, so
  // repeat draws were never charged. Both buttons now share this exact payment path.
  document.addEventListener('click', event => {
    const draw = event.target.closest?.('#draw-button, #draw-again');
    if (!draw) return;
    chargeForDraw(draw, event);
  }, true);

  function boot() {
    decorate();

    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="gacha"], [data-open-tab="gacha"]')) {
        setTimeout(decorate, 0);
      }
    });

    // Result content can be replaced without closing the modal. Keep the cost hint
    // current without observing/mutating the whole gacha subtree.
    const modal = $('#result-modal');
    if (modal) {
      new MutationObserver(() => {
        if (!modal.hidden) setTimeout(decorate, 0);
      }).observe(modal, { attributes:true, attributeFilter:['hidden'] });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot,{once:true});
  else boot();
})();