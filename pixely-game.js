(() => {
  if (window.__PIXELY_CLICK_UX_TEST__) return;
  window.__PIXELY_CLICK_UX_TEST__ = true;

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

  function core() {
    const value = read(CORE_KEY, {});
    value.dust = Math.max(0, Number(value.dust) || 0);
    value.owned = value.owned && typeof value.owned === 'object' ? value.owned : {};
    value.gachaItems = Array.isArray(value.gachaItems) ? value.gachaItems : [];
    return value;
  }

  function game() {
    const value = {
      clickLevel: 1,
      clickExp: 0,
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

  function syncCore(value) {
    write(CORE_KEY, value);
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') {
        save.dust = value.dust;
      }
    } catch {}
  }

  function installStyle() {
    let style = $('#pixely-click-ux-style');
    if (style) return;
    style = document.createElement('style');
    style.id = 'pixely-click-ux-style';
    style.textContent = `
      body.pixely-click-mode #spread-page-controls{display:none!important}
      body.pixely-click-mode [data-panel="series"]{display:block!important;position:relative!important;overflow:hidden!important;background:#fffdf5!important;border-radius:18px!important;min-height:680px!important}
      body.pixely-click-mode [data-panel="series"]::before{content:none!important}
      #pixely-click-test{position:absolute;inset:0;z-index:50;display:grid;grid-template-columns:1fr 1fr;background:linear-gradient(90deg,#fffdf5 0 49.8%,#eee7d8 49.9%,#fffdf5 50.2% 100%);color:#3f6075}
      .pct-info{padding:56px 62px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(90,110,120,.10)}
      .pct-kicker{font-size:11px;letter-spacing:.18em;font-weight:900;color:#7ca3ba}
      .pct-info h2{margin:8px 0 10px;font:700 34px Georgia,'Batang',serif;color:#38586d}
      .pct-info p{margin:0 0 26px;color:#7b8c96;line-height:1.75;font-size:13px}
      .pct-dust{padding:18px 20px;border:1px solid #d8e7ef;border-radius:18px;background:#eef8fe;margin-bottom:18px}
      .pct-dust small{display:block;font-size:10px;letter-spacing:.14em;color:#7294a9;font-weight:900}
      .pct-dust b{display:block;margin-top:6px;font:700 36px Georgia,serif;color:#456b83}
      .pct-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .pct-stat{padding:14px;border:1px solid #e1e6e4;border-radius:14px;background:rgba(255,255,255,.72)}
      .pct-stat small{display:block;color:#97a4aa;font-size:10px}.pct-stat b{display:block;margin-top:5px;font-size:16px;color:#5b7484}
      .pct-play{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;background:radial-gradient(circle at 50% 44%,rgba(255,231,132,.24),transparent 26%)}
      .pct-combo{position:absolute;top:34px;right:38px;padding:8px 12px;border-radius:999px;background:#fff;border:1px solid #dde7ec;color:#7891a0;font-size:11px;font-weight:900}
      #pixely-click-star{width:280px;height:280px;border:0;border-radius:50%;background:radial-gradient(circle at 38% 30%,#fffdf0 0 9%,#ffeaa1 15%,#efc95c 56%,#dca447 75%);box-shadow:0 0 0 18px rgba(244,207,99,.12),0 20px 40px rgba(122,100,48,.18);cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform .08s ease;user-select:none}
      #pixely-click-star:active{transform:scale(.95)}
      .pct-star-emoji{font-size:112px;line-height:1;filter:drop-shadow(0 7px 8px rgba(118,89,34,.14))}
      #pixely-click-star b{margin-top:8px;color:#805f3d;font-size:16px;letter-spacing:.14em}
      #pixely-click-star small{margin-top:5px;color:#947657;font-size:12px;font-weight:800}
      .pct-hint{margin:22px 0 10px;color:#89989e;font-size:12px}
      .pct-go{padding:10px 15px;border:1px solid #d8e5ec;border-radius:999px;background:white;color:#668ba2;font-weight:800;cursor:pointer}
      .pct-float{position:absolute;z-index:80;font-size:22px;font-weight:900;color:#c18b30;pointer-events:none;animation:pctFloat .8s ease-out forwards}
      @keyframes pctFloat{0%{opacity:0;transform:translate(-50%,0)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-90px)}}
      .tab--click{background:#8d8bd8!important}
      @media(max-width:900px){#pixely-click-test{grid-template-columns:1fr}.pct-info{display:none}.pct-play{min-height:620px}}
    `;
    document.head.appendChild(style);
  }

  function markup() {
    const c = core();
    const g = game();
    return `
      <div id="pixely-click-test">
        <section class="pct-info">
          <span class="pct-kicker">STAR DUST CLICKER · UX TEST</span>
          <h2>별가루 모으기</h2>
          <p>지금은 기능 확인용 테스트 화면이에요. 오른쪽의 별을 눌러 별가루가 정상적으로 쌓이는지만 먼저 확인해봐요.</p>
          <div class="pct-dust"><small>STAR DUST</small><b>✦ <span data-pct-dust>${c.dust.toLocaleString('ko-KR')}</span></b></div>
          <div class="pct-stats">
            <div class="pct-stat"><small>CLICK LEVEL</small><b data-pct-level>Lv.${g.clickLevel}</b></div>
            <div class="pct-stat"><small>TOUCH POWER</small><b data-pct-power>+${g.clickPower}</b></div>
            <div class="pct-stat"><small>BEST COMBO</small><b data-pct-best>${g.highestCombo}</b></div>
            <div class="pct-stat"><small>TOTAL CLICK</small><b data-pct-total>${g.totalClicks.toLocaleString('ko-KR')}</b></div>
          </div>
        </section>
        <section class="pct-play">
          <div class="pct-combo" data-pct-combo>${g.combo > 1 ? `${g.combo} COMBO` : 'READY'}</div>
          <button id="pixely-click-star" type="button" aria-label="별가루 얻기">
            <span class="pct-star-emoji">⭐</span>
            <b>CLICK!</b>
            <small data-pct-button-power>+${g.clickPower} / TOUCH</small>
          </button>
          <p class="pct-hint">별을 눌러 별가루를 모아보세요.</p>
          <button class="pct-go" type="button" data-pct-gacha>GACHA로 가기 →</button>
        </section>
      </div>`;
  }

  function ensurePage() {
    installStyle();
    $('#series-disabled-style')?.remove();
    const tab = $('[data-tab="series"]');
    const panel = $('[data-panel="series"]');
    if (!tab || !panel) return false;

    tab.style.setProperty('display', 'flex', 'important');
    tab.classList.remove('tab--series');
    tab.classList.add('tab--click');
    tab.innerHTML = '<span aria-hidden="true">✦</span><b>CLICK</b>';

    if (!$('#pixely-click-test', panel)) {
      panel.innerHTML = markup();
    }
    return true;
  }

  function setClickMode(on) {
    document.body.classList.toggle('pixely-click-mode', !!on);
  }

  function refreshNumbers() {
    const c = core();
    const g = game();
    $$('[data-pct-dust]').forEach(el => el.textContent = c.dust.toLocaleString('ko-KR'));
    $$('[data-dust-count]').forEach(el => el.textContent = c.dust.toLocaleString('ko-KR'));
    $$('[data-pct-level]').forEach(el => el.textContent = `Lv.${g.clickLevel}`);
    $$('[data-pct-power]').forEach(el => el.textContent = `+${g.clickPower}`);
    $$('[data-pct-button-power]').forEach(el => el.textContent = `+${g.clickPower} / TOUCH`);
    $$('[data-pct-best]').forEach(el => el.textContent = g.highestCombo);
    $$('[data-pct-total]').forEach(el => el.textContent = g.totalClicks.toLocaleString('ko-KR'));
    $$('[data-pct-combo]').forEach(el => el.textContent = g.combo > 1 ? `${g.combo} COMBO` : 'READY');
  }

  function clickStar(button) {
    const c = core();
    const g = game();
    const now = Date.now();
    g.combo = now - g.lastClickAt <= 1100 ? g.combo + 1 : 1;
    g.lastClickAt = now;
    g.totalClicks += 1;
    g.highestCombo = Math.max(g.highestCombo, g.combo);

    const amount = g.clickPower;
    c.dust += amount;
    syncCore(c);
    write(GAME_KEY, g);
    refreshNumbers();

    const play = button.closest('.pct-play');
    if (play) {
      const float = document.createElement('span');
      float.className = 'pct-float';
      float.textContent = `+${amount}`;
      const rect = button.getBoundingClientRect();
      const parent = play.getBoundingClientRect();
      float.style.left = `${rect.left - parent.left + rect.width / 2}px`;
      float.style.top = `${rect.top - parent.top + 30}px`;
      play.appendChild(float);
      setTimeout(() => float.remove(), 850);
    }
  }

  function openClick() {
    ensurePage();
    const tab = $('[data-tab="series"]');
    if (tab) tab.click();
    setTimeout(() => {
      setClickMode(true);
      ensurePage();
      refreshNumbers();
    }, 0);
  }

  function boot() {
    ensurePage();

    document.addEventListener('click', event => {
      const star = event.target.closest?.('#pixely-click-star');
      if (star) {
        event.preventDefault();
        event.stopPropagation();
        clickStar(star);
        return;
      }

      if (event.target.closest?.('[data-pct-gacha]')) {
        event.preventDefault();
        $('[data-tab="gacha"]')?.click();
        setClickMode(false);
        return;
      }

      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"]')) {
        setTimeout(() => {
          setClickMode(true);
          ensurePage();
          refreshNumbers();
        }, 0);
        return;
      }

      if (event.target.closest?.('[data-tab="home"], [data-tab="gacha"], [data-tab="collection"], [data-go-home]')) {
        setClickMode(false);
      }
    }, true);

    /* If the user presses the old gacha button without enough dust, move to the visible CLICK test page. */
    const draw = $('#draw-button');
    if (draw) {
      draw.addEventListener('click', event => {
        const c = core();
        if (c.dust >= 100) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        const toast = $('#toast');
        if (toast) {
          toast.textContent = '별가루가 부족해요. CLICK에서 별을 눌러 모아주세요!';
          toast.classList.add('is-visible');
          setTimeout(() => toast.classList.remove('is-visible'), 1800);
        }
        openClick();
      }, true);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();