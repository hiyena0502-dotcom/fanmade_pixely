(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'collection-collapse.css?v=1';
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
      document.head.appendChild(unify);
    };
    document.head.appendChild(collapse);
  };
  document.head.appendChild(core);
})();