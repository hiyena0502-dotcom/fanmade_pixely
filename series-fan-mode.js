(() => {
  document.getElementById('series-disabled-style')?.remove();
  if (window.__PIXELY_GAME_V4__) return;
  if (document.querySelector('script[data-pixely-game-compat]')) return;
  const script = document.createElement('script');
  script.dataset.pixelyGameCompat = '1';
  script.src = 'pixely-game.js?v=4';
  script.async = false;
  document.head.appendChild(script);
})();