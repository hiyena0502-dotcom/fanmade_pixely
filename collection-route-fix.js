(() => {
  const $ = (s, r = document) => r.querySelector(s);

  function routeToUnifiedCollection() {
    const modal = $('#result-modal');
    if (modal) modal.hidden = true;

    const root = $('#collection-spreads');
    if (root) {
      root.innerHTML = '';
      root.classList.remove('grouped-collection');
    }

    const tab = $('[data-tab="collection"]');
    if (!tab) return;
    tab.focus({ preventScroll: true });
    tab.click();
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest?.('#result-primary-action');
    if (!button) return;

    const label = (button.textContent || '').trim();
    if (!label || label === '확인') return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    setTimeout(routeToUnifiedCollection, 0);
  }, true);
})();
