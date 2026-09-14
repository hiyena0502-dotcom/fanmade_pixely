(() => {
  const introFix = document.createElement('link');
  introFix.rel = 'stylesheet';
  introFix.href = 'intro-layout-fix.css?v=1';
  document.head.appendChild(introFix);

  const theme = document.createElement('link');
  theme.rel = 'stylesheet';
  theme.href = 'collection-groups.css?v=6';
  document.head.appendChild(theme);

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'collection-collapse.css?v=5';
  document.head.appendChild(css);

  const members = document.createElement('script');
  members.src = 'member-order.js?v=2';
  members.async = false;
  members.onload = () => {
    const core = document.createElement('script');
    core.src = 'collection-groups-core.js?v=4';
    core.async = false;
    core.onload = () => {
      const collapse = document.createElement('script');
      collapse.src = 'collection-collapse.js?v=4';
      collapse.async = false;
      collapse.onload = () => {
        const unify = document.createElement('script');
        unify.src = 'collection-unify.js?v=4';
        unify.async = false;
        unify.onload = () => {
          const routeFix = document.createElement('script');
          routeFix.src = 'collection-route-fix.js?v=4';
          routeFix.async = false;
          routeFix.onload = () => {
            const storyGroups = document.createElement('script');
            storyGroups.src = 'scenario-groups.js?v=3';
            storyGroups.async = false;
            document.head.appendChild(storyGroups);
          };
          document.head.appendChild(routeFix);
        };
        document.head.appendChild(unify);
      };
      document.head.appendChild(collapse);
    };
    document.head.appendChild(core);
  };
  document.head.appendChild(members);
})();