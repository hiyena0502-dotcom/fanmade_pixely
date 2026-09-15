(() => {
  if (window.__PIXELY_UX_TIDY_V1__) return;
  window.__PIXELY_UX_TIDY_V1__ = true;

  function tidySettingsLabels() {
    const nav = document.querySelector('.settings-tabs');
    if (!nav) return;
    const gacha = nav.querySelector('[data-settings-tab="gacha"]');
    const series = nav.querySelector('[data-settings-tab="series"]');
    const reset = nav.querySelector('[data-settings-tab="reset"]');
    if (gacha && gacha.textContent !== '가챠 카드') gacha.textContent = '가챠 카드';
    if (series && series.textContent !== '메인 시리즈') series.textContent = '메인 시리즈';
    if (reset && reset.textContent !== '백업·초기화') reset.textContent = '백업·초기화';
  }

  function boot() {
    [0,80,220,600].forEach(delay => setTimeout(tidySettingsLabels, delay));
    document.addEventListener('click', event => {
      if (event.target.closest?.('#open-settings,.settings-tabs button')) {
        [0,50,160].forEach(delay => setTimeout(tidySettingsLabels, delay));
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();
