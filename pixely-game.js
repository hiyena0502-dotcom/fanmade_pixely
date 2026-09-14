(() => {
  if (window.__PIXELY_CLICK_FIXED_V11__) return;
  window.__PIXELY_CLICK_FIXED_V11__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function read(key, fallback = {}) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
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
    document.getElementById('pixely-click-fixed-style')?.remove();
    const style = document.createElement('style');
    style.id = 'pixely-click-fixed-style';
    style.textContent = `
      .tab--click{background:#8d8bd8!important}
      #pixely-click-fixed[hidden]{display:none!important}
      #pixely-click-fixed{position:fixed!important;z-index:15!important;display:grid!important;grid-template-columns:1fr 1fr!important;overflow:hidden!important;border:2px solid rgba(83,122,148,.18)!important;border-radius:22px!important;background:#fffdf5!important;box-shadow:0 28px 70px rgba(34,72,98,.30)!important;color:#405f74!important}
      #pixely-click-fixed::after{content:'';position:absolute;top:0;bottom:0;left:50%;width:2px;background:rgba(110,96,78,.12);transform:translateX(-50%);pointer-events:none}
      .pcf-page{position:relative;min-width:0;padding:54px 58px;background-color:#fffdf5;background-image:linear-gradient(rgba(103,143,168,.07) 1px,transparent 1px);background-size:100% 29px}
      .pcf-left{display:flex;flex-direction:column;justify-content:center}
      .pcf-kicker{font-size:11px;font-weight:900;letter-spacing:.18em;color:#7aa2ba}
      .pcf-left h2{margin:8px 0 10px;font:700 36px Georgia,'Batang',serif;color:#38586d}
      .pcf-left>p{margin:0 0 24px;color:#7d8e98;font-size:13px;line-height:1.75}
      .pcf-dust{margin-bottom:18px;padding:18px 20px;border:1px solid #d7e6ee;border-radius:16px;background:#edf8fe}
      .pcf-dust small{display:block;color:#7394a8;font-size:10px;font-weight:900;letter-spacing:.14em}
      .pcf-dust b{display:block;margin-top:6px;color:#456b83;font:700 38px Georgia,serif}
      .pcf-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pcf-stat{padding:14px;border:1px solid #e1e6e4;border-radius:13px;background:rgba(255,255,255,.78)}
      .pcf-stat small{display:block;color:#98a4aa;font-size:10px}.pcf-stat b{display:block;margin-top:5px;color:#5b7484;font-size:16px}
      .pcf-right{display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 43%,rgba(255,230,125,.24),transparent 27%),#fffdf5}
      .pcf-combo{position:absolute;top:30px;right:34px;padding:8px 12px;border:1px solid #dce7ec;border-radius:999px;background:#fff;color:#78919f;font-size:11px;font-weight:900}
      #pixely-click-star{display:flex;flex-direction:column;align-items:center;justify-content:center;width:280px;height:280px;border:0;border-radius:50%;background:radial-gradient(circle at 38% 30%,#fffef3 0 9%,#ffe99d 16%,#efc85b 56%,#dca348 76%);box-shadow:0 0 0 18px rgba(244,207,99,.12),0 22px 42px rgba(120,97,45,.19);cursor:pointer;user-select:none;transition:transform .08s ease}
      #pixely-click-star:hover{transform:scale(1.025)}#pixely-click-star:active{transform:scale(.94)}
      .pcf-star{font-size:112px;line-height:1;filter:drop-shadow(0 7px 8px rgba(118,89,34,.14))}
      #pixely-click-star b{margin-top:7px;color:#805f3e;font-size:17px;letter-spacing:.14em}
      #pixely-click-star small{margin-top:5px;color:#967757;font-size:12px;font-weight:800}
      .pcf-right>p{margin:23px 0 11px;color:#8a999f;font-size:12px}
      .pcf-gacha{padding:10px 16px;border:1px solid #d8e5ec;border-radius:999px;background:#fff;color:#6589a0;font-weight:800;cursor:pointer}
      .pcf-float{position:absolute;z-index:16;color:#c18b30;font-size:24px;font-weight:900;pointer-events:none;animation:pcfFloat .8s ease-out forwards}
      @keyframes pcfFloat{0%{opacity:0;transform:translate(-50%,0)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-92px)}}
      body.pixely-click-fixed-active #spread-page-controls{visibility:hidden!important}
      @media(max-width:900px){#pixely-click-fixed{grid-template-columns:1fr!important}.pcf-left{display:none}.pcf-right{min-height:100%}#pixely-click-star{width:240px;height:240px}.pcf-star{font-size:92px}}
    `;
    document.head.appendChild(style);
  }

  function markup() {
    const core = getCore();
    const game = getGame();
    return `
      <section class="pcf-page pcf-left">
        <span class="pcf-kicker">STAR DUST CLICKER · UX TEST</span>
        <h2>별가루 모으기</h2>
        <p>지금은 UX 테스트 단계예요. 오른쪽의 큰 별을 눌러 별가루가 정상적으로 쌓이는지 먼저 확인해봐요.</p>
        <div class="pcf-dust"><small>STAR DUST</small><b>✦ <span data-pcf-dust>${core.dust.toLocaleString('ko-KR')}</span></b></div>
        <div class="pcf-stats">
          <div class="pcf-stat"><small>CLICK LEVEL</small><b>Lv.${game.clickLevel}</b></div>
          <div class="pcf-stat"><small>TOUCH POWER</small><b data-pcf-power>+${game.clickPower}</b></div>
          <div class="pcf-stat"><small>BEST COMBO</small><b data-pcf-best>${game.highestCombo}</b></div>
          <div class="pcf-stat"><small>TOTAL CLICK</small><b data-pcf-total>${game.totalClicks.toLocaleString('ko-KR')}</b></div>
        </div>
      </section>
      <section class="pcf-page pcf-right">
        <div class="pcf-combo" data-pcf-combo>${game.combo > 1 ? `${game.combo} COMBO` : 'READY'}</div>
        <button id="pixely-click-star" type="button" aria-label="별가루 얻기">
          <span class="pcf-star">⭐</span>
          <b>CLICK!</b>
          <small data-pcf-button-power>+${game.clickPower} / TOUCH</small>
        </button>
        <p>별을 눌러 별가루를 모아보세요.</p>
        <button class="pcf-gacha" type="button" data-pcf-gacha>GACHA로 가기 →</button>
      </section>`;
  }

  function ensureTab() {
    document.getElementById('series-disabled-style')?.remove();
    const tab = $('[data-tab="series"]');
    if (!tab) return null;
    tab.style.setProperty('display', 'flex', 'important');
    tab.classList.remove('tab--series');
    tab.classList.add('tab--click');
    tab.innerHTML = '<span aria-hidden="true">✦</span><b>CLICK</b>';
    return tab;
  }

  function placeOverlay() {
    installStyle();
    let overlay = $('#pixely-click-fixed');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pixely-click-fixed';
      overlay.hidden = true;
      document.body.appendChild(overlay);
    }
    const book = $('#diary-book');
    if (book) {
      const rect = book.getBoundingClientRect();
      overlay.style.left = `${Math.max(8, rect.left)}px`;
      overlay.style.top = `${Math.max(8, rect.top)}px`;
      overlay.style.width = `${Math.max(320, rect.width)}px`;
      overlay.style.height = `${Math.max(420, rect.height)}px`;
    } else {
      overlay.style.left = '8vw';
      overlay.style.top = '14vh';
      overlay.style.width = '84vw';
      overlay.style.height = '76vh';
    }
    return overlay;
  }

  function refresh() {
    const core = getCore();
    const game = getGame();
    $$('[data-pcf-dust]').forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));
    $$('[data-dust-count]').forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));
    $$('[data-pcf-power]').forEach(el => el.textContent = `+${game.clickPower}`);
    $$('[data-pcf-button-power]').forEach(el => el.textContent = `+${game.clickPower} / TOUCH`);
    $$('[data-pcf-best]').forEach(el => el.textContent = game.highestCombo);
    $$('[data-pcf-total]').forEach(el => el.textContent = game.totalClicks.toLocaleString('ko-KR'));
    $$('[data-pcf-combo]').forEach(el => el.textContent = game.combo > 1 ? `${game.combo} COMBO` : 'READY');
  }

  function showClick() {
    const tab = ensureTab();
    const overlay = placeOverlay();
    if (!tab || !overlay) return;
    overlay.innerHTML = markup();
    overlay.hidden = false;
    overlay.style.setProperty('display', 'grid', 'important');
    document.body.classList.add('pixely-click-fixed-active');
    $$('[data-tab]').forEach(button => {
      const active = button === tab;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    refresh();
  }

  function hideClick() {
    const overlay = $('#pixely-click-fixed');
    if (overlay) {
      overlay.hidden = true;
      overlay.style.setProperty('display', 'none', 'important');
    }
    document.body.classList.remove('pixely-click-fixed-active');
  }

  function clickStar(button) {
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

    const page = button.closest('.pcf-right');
    if (page) {
      const float = document.createElement('span');
      float.className = 'pcf-float';
      float.textContent = `+${game.clickPower}`;
      const br = button.getBoundingClientRect();
      const pr = page.getBoundingClientRect();
      float.style.left = `${br.left - pr.left + br.width / 2}px`;
      float.style.top = `${br.top - pr.top + 42}px`;
      page.appendChild(float);
      setTimeout(() => float.remove(), 850);
    }
  }

  function boot() {
    ensureTab();
    placeOverlay();

    document.addEventListener('click', event => {
      const star = event.target.closest?.('#pixely-click-star');
      if (star) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        clickStar(star);
        return;
      }

      if (event.target.closest?.('[data-pcf-gacha]')) {
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

      if (event.target.closest?.('[data-tab="home"], [data-tab="gacha"], [data-tab="collection"], [data-go-home], #back-to-sky, .sky-button')) {
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

    window.addEventListener('resize', () => {
      if (!$('#pixely-click-fixed')?.hidden) placeOverlay();
    });

    const diaryApp = $('#diary-app');
    if (diaryApp) {
      new MutationObserver(() => {
        if (diaryApp.getAttribute('aria-hidden') === 'true' || !diaryApp.classList.contains('is-visible')) hideClick();
      }).observe(diaryApp, { attributes:true, attributeFilter:['aria-hidden','class'] });
    }

    setTimeout(() => {
      const tab = ensureTab();
      if (tab?.classList.contains('is-active')) showClick();
    }, 120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();