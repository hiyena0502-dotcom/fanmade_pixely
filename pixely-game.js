(() => {
  if (window.__PIXELY_CLICK_OVERLAY_V1__) return;
  window.__PIXELY_CLICK_OVERLAY_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function read(key, fallback = {}) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getCore() {
    const value = read(CORE_KEY, {});
    value.dust = Math.max(0, Number(value.dust) || 0);
    return value;
  }

  function getGame() {
    const value = {
      clickLevel: 1,
      clickPower: 1,
      totalClicks: 0,
      highestCombo: 0,
      combo: 0,
      lastClickAt: 0,
      ...read(GAME_KEY, {})
    };
    value.clickLevel = Math.max(1, Number(value.clickLevel) || 1);
    value.clickPower = Math.max(1, Number(value.clickPower) || 1);
    value.totalClicks = Math.max(0, Number(value.totalClicks) || 0);
    value.highestCombo = Math.max(0, Number(value.highestCombo) || 0);
    value.combo = Math.max(0, Number(value.combo) || 0);
    return value;
  }

  function saveCore(value) {
    write(CORE_KEY, value);
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') save.dust = value.dust;
      if (typeof persistSave === 'function') persistSave();
    } catch {}
  }

  function installStyle() {
    if ($('#pixely-click-overlay-style')) return;
    const style = document.createElement('style');
    style.id = 'pixely-click-overlay-style';
    style.textContent = `
      .tab--click{background:#8d8bd8!important}
      #pixely-click-overlay[hidden]{display:none!important}
      #pixely-click-overlay{position:absolute;inset:0;z-index:30;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;border-radius:22px;background:#fffdf5;color:#405f74}
      #pixely-click-overlay::after{content:'';position:absolute;top:0;bottom:0;left:50%;width:2px;background:rgba(110,96,78,.12);transform:translateX(-50%);pointer-events:none}
      .pco-page{position:relative;min-width:0;padding:58px 62px;background-color:#fffdf5;background-image:linear-gradient(rgba(103,143,168,.07) 1px,transparent 1px);background-size:100% 29px}
      .pco-left{display:flex;flex-direction:column;justify-content:center}
      .pco-kicker{font-size:11px;font-weight:900;letter-spacing:.18em;color:#7aa2ba}
      .pco-left h2{margin:8px 0 10px;font:700 36px Georgia,'Batang',serif;color:#38586d}
      .pco-left>p{margin:0 0 24px;color:#7d8e98;font-size:13px;line-height:1.75}
      .pco-dust{margin-bottom:18px;padding:18px 20px;border:1px solid #d7e6ee;border-radius:16px;background:#edf8fe}
      .pco-dust small{display:block;color:#7394a8;font-size:10px;font-weight:900;letter-spacing:.14em}
      .pco-dust b{display:block;margin-top:6px;color:#456b83;font:700 38px Georgia,serif}
      .pco-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pco-stat{padding:14px;border:1px solid #e1e6e4;border-radius:13px;background:rgba(255,255,255,.78)}
      .pco-stat small{display:block;color:#98a4aa;font-size:10px}.pco-stat b{display:block;margin-top:5px;color:#5b7484;font-size:16px}
      .pco-right{display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 43%,rgba(255,230,125,.22),transparent 27%),#fffdf5}
      .pco-combo{position:absolute;top:32px;right:36px;padding:8px 12px;border:1px solid #dce7ec;border-radius:999px;background:#fff;color:#78919f;font-size:11px;font-weight:900}
      #pixely-click-star{display:flex;flex-direction:column;align-items:center;justify-content:center;width:290px;height:290px;border:0;border-radius:50%;background:radial-gradient(circle at 38% 30%,#fffef3 0 9%,#ffe99d 16%,#efc85b 56%,#dca348 76%);box-shadow:0 0 0 18px rgba(244,207,99,.12),0 22px 42px rgba(120,97,45,.19);cursor:pointer;user-select:none;transition:transform .08s ease}
      #pixely-click-star:hover{transform:scale(1.025)}#pixely-click-star:active{transform:scale(.94)}
      .pco-star{font-size:118px;line-height:1;filter:drop-shadow(0 7px 8px rgba(118,89,34,.14))}
      #pixely-click-star b{margin-top:7px;color:#805f3e;font-size:17px;letter-spacing:.14em}
      #pixely-click-star small{margin-top:5px;color:#967757;font-size:12px;font-weight:800}
      .pco-right>p{margin:23px 0 11px;color:#8a999f;font-size:12px}
      .pco-gacha{padding:10px 16px;border:1px solid #d8e5ec;border-radius:999px;background:#fff;color:#6589a0;font-weight:800;cursor:pointer}
      .pco-float{position:absolute;z-index:50;color:#c18b30;font-size:24px;font-weight:900;pointer-events:none;animation:pcoFloat .8s ease-out forwards}
      @keyframes pcoFloat{0%{opacity:0;transform:translate(-50%,0)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-92px)}}
      body.pixely-click-overlay-active #spread-page-controls{display:none!important}
      @media(max-width:900px){#pixely-click-overlay{grid-template-columns:1fr}.pco-left{display:none}.pco-right{min-height:100%}}
    `;
    document.head.appendChild(style);
  }

  function overlayMarkup() {
    const core = getCore();
    const game = getGame();
    return `
      <section class="pco-page pco-left">
        <span class="pco-kicker">STAR DUST CLICKER · UX TEST</span>
        <h2>별가루 모으기</h2>
        <p>지금은 UX 테스트 단계예요. 오른쪽의 큰 별이 보이고, 눌렀을 때 숫자가 오르는지만 먼저 확인해요.</p>
        <div class="pco-dust"><small>STAR DUST</small><b>✦ <span data-pco-dust>${core.dust.toLocaleString('ko-KR')}</span></b></div>
        <div class="pco-stats">
          <div class="pco-stat"><small>CLICK LEVEL</small><b>Lv.${game.clickLevel}</b></div>
          <div class="pco-stat"><small>TOUCH POWER</small><b data-pco-power>+${game.clickPower}</b></div>
          <div class="pco-stat"><small>BEST COMBO</small><b data-pco-best>${game.highestCombo}</b></div>
          <div class="pco-stat"><small>TOTAL CLICK</small><b data-pco-total>${game.totalClicks.toLocaleString('ko-KR')}</b></div>
        </div>
      </section>
      <section class="pco-page pco-right">
        <div class="pco-combo" data-pco-combo>${game.combo > 1 ? `${game.combo} COMBO` : 'READY'}</div>
        <button id="pixely-click-star" type="button" aria-label="별가루 얻기">
          <span class="pco-star">⭐</span>
          <b>CLICK!</b>
          <small data-pco-button-power>+${game.clickPower} / TOUCH</small>
        </button>
        <p>별을 눌러 별가루를 모아보세요.</p>
        <button class="pco-gacha" type="button" data-pco-gacha>GACHA로 가기 →</button>
      </section>`;
  }

  function ensureTab() {
    const tab = $('[data-tab="series"]');
    if (!tab) return null;
    tab.style.setProperty('display', 'flex', 'important');
    tab.classList.remove('tab--series');
    tab.classList.add('tab--click');
    tab.innerHTML = '<span aria-hidden="true">✦</span><b>CLICK</b>';
    return tab;
  }

  function ensureOverlay() {
    installStyle();
    const book = $('#diary-book');
    if (!book) return null;
    let overlay = $('#pixely-click-overlay', book);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pixely-click-overlay';
      overlay.hidden = true;
      book.appendChild(overlay);
    }
    return overlay;
  }

  function refresh() {
    const core = getCore();
    const game = getGame();
    $$('[data-pco-dust]').forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));
    $$('[data-dust-count]').forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));
    $$('[data-pco-power]').forEach(el => el.textContent = `+${game.clickPower}`);
    $$('[data-pco-button-power]').forEach(el => el.textContent = `+${game.clickPower} / TOUCH`);
    $$('[data-pco-best]').forEach(el => el.textContent = game.highestCombo);
    $$('[data-pco-total]').forEach(el => el.textContent = game.totalClicks.toLocaleString('ko-KR'));
    $$('[data-pco-combo]').forEach(el => el.textContent = game.combo > 1 ? `${game.combo} COMBO` : 'READY');
  }

  function showClick() {
    const tab = ensureTab();
    const overlay = ensureOverlay();
    if (!tab || !overlay) return;
    overlay.innerHTML = overlayMarkup();
    overlay.hidden = false;
    overlay.style.display = 'grid';
    document.body.classList.add('pixely-click-overlay-active');
    $$('[data-tab]').forEach(button => {
      const active = button === tab;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    const controls = $('#spread-page-controls');
    if (controls) controls.hidden = true;
    refresh();
  }

  function hideClick() {
    const overlay = $('#pixely-click-overlay');
    if (overlay) {
      overlay.hidden = true;
      overlay.style.display = 'none';
    }
    document.body.classList.remove('pixely-click-overlay-active');
  }

  function handleStar(button) {
    const core = getCore();
    const game = getGame();
    const now = Date.now();
    game.combo = now - game.lastClickAt <= 1100 ? game.combo + 1 : 1;
    game.lastClickAt = now;
    game.totalClicks += 1;
    game.highestCombo = Math.max(game.highestCombo, game.combo);
    core.dust += game.clickPower;
    saveCore(core);
    write(GAME_KEY, game);
    refresh();

    const page = button.closest('.pco-right');
    if (page) {
      const float = document.createElement('span');
      float.className = 'pco-float';
      float.textContent = `+${game.clickPower}`;
      const br = button.getBoundingClientRect();
      const pr = page.getBoundingClientRect();
      float.style.left = `${br.left - pr.left + br.width / 2}px`;
      float.style.top = `${br.top - pr.top + 36}px`;
      page.appendChild(float);
      setTimeout(() => float.remove(), 850);
    }
  }

  function boot() {
    ensureTab();
    ensureOverlay();

    document.addEventListener('click', event => {
      const star = event.target.closest?.('#pixely-click-star');
      if (star) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        handleStar(star);
        return;
      }

      if (event.target.closest?.('[data-pco-gacha]')) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        hideClick();
        $('[data-tab="gacha"]')?.click();
        return;
      }

      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"]')) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showClick();
        return;
      }

      if (event.target.closest?.('[data-tab="home"], [data-tab="gacha"], [data-tab="collection"], [data-go-home]')) {
        hideClick();
      }

      const draw = event.target.closest?.('#draw-button');
      if (draw && getCore().dust < 100) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        const toast = $('#toast');
        if (toast) {
          toast.textContent = '별가루가 부족해요. CLICK에서 별을 눌러 모아주세요!';
          toast.classList.add('is-visible');
          setTimeout(() => toast.classList.remove('is-visible'), 1800);
        }
        showClick();
      }
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();