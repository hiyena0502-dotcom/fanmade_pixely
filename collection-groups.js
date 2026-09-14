(() => {
  const game = document.createElement('script');
  game.src = 'pixely-game.js?v=2';
  game.async = false;
  document.head.appendChild(game);

  const theme = document.createElement('link');
  theme.rel = 'stylesheet';
  theme.href = 'collection-groups.css?v=2';
  document.head.appendChild(theme);

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'collection-collapse.css?v=2';
  document.head.appendChild(css);

  const core = document.createElement('script');
  core.src = 'collection-groups-core.js?v=1';
  core.async = false;
  core.onload = () => {
    const collapse = document.createElement('script');
    collapse.src = 'collection-collapse.js?v=1';
    collapse.async = false;
    collapse.onload = () => {
      const unify = document.createElement('script');
      unify.src = 'collection-unify.js?v=1';
      unify.async = false;
      unify.onload = () => {
        const routeFix = document.createElement('script');
        routeFix.src = 'collection-route-fix.js?v=1';
        routeFix.async = false;
        document.head.appendChild(routeFix);
      };
      document.head.appendChild(unify);
    };
    document.head.appendChild(collapse);
  };
  document.head.appendChild(core);
})();