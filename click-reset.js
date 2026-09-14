(() => {
  if (window.__PIXELY_CLICK_RESET_V1__) return;
  window.__PIXELY_CLICK_RESET_V1__ = true;

  const GAME_KEY = 'pixely-game-v1';
  const APPLIED_KEYS = ['pixely-upgrade-applied-v1', 'pixely-upgrade-applied-v2'];
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  function readGame() {
    try {
      const value = JSON.parse(localStorage.getItem(GAME_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch { return {}; }
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function refreshVisibleUi() {
    $$('[data-pcf-power]').forEach(el => el.textContent = '+1');
    $$('[data-pcf-button-power]').forEach(el => el.textContent = '+1 / TOUCH');
    $$('[data-pcf-combo]').forEach(el => el.textContent = 'READY');
    $$('[data-upgrade-level]').forEach(el => el.textContent = 'Lv.1');
    $$('[data-upgrade-exp]').forEach(el => el.textContent = '0 / 3');
    $$('[data-upgrade-bar]').forEach(el => el.style.width = '0%');
    $$('[data-next-level-card]').forEach(el => el.textContent = '다음 후보 · Lv.1 카드 · EXP +3');
  }

  function resetClickUpgrade() {
    const ok = window.confirm(
      'CLICK 레벨업 진행을 초기화할까요?\n\nLv.1 · EXP 0 · 터치 파워 +1로 돌아갑니다.\n별가루, 카드 컬렉션, 누적 클릭과 최고 콤보 기록은 유지됩니다.'
    );
    if (!ok) return;

    const game = readGame();
    game.clickLevel = 1;
    game.clickExp = 0;
    game.clickPower = 1;
    game.combo = 0;
    game.lastClickAt = 0;
    localStorage.setItem(GAME_KEY, JSON.stringify(game));

    APPLIED_KEYS.forEach(key => localStorage.removeItem(key));
    refreshVisibleUi();
    window.dispatchEvent(new CustomEvent('pixely:click-upgrade-reset'));
    toast('CLICK 성장 초기화 완료 · Lv.1부터 다시 시작해요!');
  }

  function installStyle() {
    if ($('#click-reset-style')) return;
    const style = document.createElement('style');
    style.id = 'click-reset-style';
    style.textContent = `
      .reset-grid .reset-click-upgrade{
        border-color:#d8d4ef!important;
        background:linear-gradient(135deg,#f5f7ff,#fff3fa)!important;
      }
      .reset-grid .reset-click-upgrade>span{
        background:linear-gradient(135deg,#8ebbe8,#a78be3)!important;
        color:#fff!important;
      }
      .reset-grid .reset-click-upgrade:hover{
        border-color:#9d91d7!important;
        background:linear-gradient(135deg,#eef4ff,#fceef8)!important;
      }
    `;
    document.head.appendChild(style);
  }

  function injectButton() {
    installStyle();
    const grid = $('[data-settings-panel="reset"] .reset-grid');
    if (!grid || $('[data-reset-click-upgrade]', grid)) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'reset-click-upgrade';
    button.setAttribute('data-reset-click-upgrade', '');
    button.innerHTML = '<span>⬆</span><b>CLICK 성장 초기화</b><small>레벨 · EXP · 터치 파워를 Lv.1로 돌려요.</small>';

    const resetAll = $('.reset-all', grid);
    if (resetAll) grid.insertBefore(button, resetAll);
    else grid.appendChild(button);
  }

  function boot() {
    injectButton();
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-reset-click-upgrade]')) {
        event.preventDefault();
        resetClickUpgrade();
        return;
      }
      if (event.target.closest?.('#open-settings, [data-settings-tab="reset"]')) {
        setTimeout(injectButton, 0);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();