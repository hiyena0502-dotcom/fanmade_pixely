(() => {
  const SAVE_KEY = 'pixely-diary-save-v1';
  const ARCHIVE_KEY = 'pixely-series-archive-v1';

  function read(key, fallback = null) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function archiveAndDisableSeries() {
    const stored = read(SAVE_KEY, {});
    if (!stored || typeof stored !== 'object') return;

    const seriesItems = Array.isArray(stored.seriesItems) ? stored.seriesItems : [];
    const gachaItems = Array.isArray(stored.gachaItems) ? stored.gachaItems : [];
    const links = gachaItems
      .filter(item => item?.id && item.relatedSeriesId)
      .map(item => ({ id: item.id, relatedSeriesId: item.relatedSeriesId }));

    if (seriesItems.length || links.length) {
      const previous = read(ARCHIVE_KEY, {});
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify({
        version: 1,
        archivedAt: new Date().toISOString(),
        recentSeriesId: stored.recentSeriesId || previous.recentSeriesId || null,
        seriesItems: seriesItems.length ? seriesItems : (Array.isArray(previous.seriesItems) ? previous.seriesItems : []),
        gachaSeriesLinks: links.length ? links : (Array.isArray(previous.gachaSeriesLinks) ? previous.gachaSeriesLinks : []),
      }));
    }

    stored.seriesItems = [];
    stored.recentSeriesId = null;
    if (Array.isArray(stored.gachaItems)) {
      stored.gachaItems = stored.gachaItems.map(item => ({ ...item, relatedSeriesId: null }));
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(stored));

    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') {
        save.seriesItems = [];
        save.recentSeriesId = null;
        if (Array.isArray(save.gachaItems)) save.gachaItems.forEach(item => { item.relatedSeriesId = null; });
      }
      if (typeof currentSeriesId !== 'undefined') currentSeriesId = null;
      if (typeof settingsSeriesId !== 'undefined') settingsSeriesId = null;
    } catch {}
  }

  function installStyles() {
    if (document.getElementById('series-disabled-style')) return;
    const style = document.createElement('style');
    style.id = 'series-disabled-style';
    style.textContent = `
      [data-tab="series"],
      [data-panel="series"],
      [data-open-tab="series"],
      .home-recent-series,
      [data-settings-tab="series"],
      [data-settings-panel="series"],
      [data-reset="series"] { display:none !important; }
      .home-stats > div:nth-child(2) { display:none !important; }
      .home-right .feature-card--gacha { min-height:190px; }
      .home-right .feature-card--gacha .mini-capsules { transform:scale(1.16); }
      .home-stats { margin-top:4px; }
      .diary-tabs { gap:11px; }
    `;
    document.head.appendChild(style);
  }

  function cleanCopy() {
    const intro = document.querySelector('.home-intro');
    if (intro) intro.textContent = '좋아하는 순간과 카드, 그리고 우연히 만난 작은 행운까지. 이곳은 픽셀리 덕질을 차곡차곡 모아두는 팬메이드 다이어리예요.';

    const recentLabel = document.querySelector('.feature-card--gacha .feature-card__label');
    if (recentLabel) recentLabel.textContent = 'MY COLLECTION';

    const gachaHeading = document.querySelector('[data-settings-panel="gacha"] .settings-section__heading p');
    if (gachaHeading) gachaHeading.textContent = '카드와 아이템의 기본 정보와 컬렉션용 메모를 관리해요.';

    const backupCopy = document.querySelector('.backup-card small');
    if (backupCopy) backupCopy.textContent = '카드와 컬렉션 데이터를 파일로 보관해요.';

    const summary = document.querySelector('#settings-summary');
    if (summary) summary.textContent = summary.textContent.replace(/\s*·\s*시리즈\s*\d+개?/g, '');

    const related = document.querySelector('#card-detail-series');
    const relatedRow = related?.closest('div');
    if (relatedRow) relatedRow.style.display = 'none';

    document.querySelectorAll('#editor-fields label').forEach(label => {
      const title = label.querySelector('span')?.textContent?.trim();
      if (title === '관련 시리즈') label.style.display = 'none';
    });
  }

  function keepSeriesUiHidden() {
    cleanCopy();
    const seriesTab = document.querySelector('[data-settings-tab="series"]');
    if (seriesTab?.classList.contains('is-active')) document.querySelector('[data-settings-tab="gacha"]')?.click();
  }

  archiveAndDisableSeries();
  installStyles();
  keepSeriesUiHidden();

  new MutationObserver(() => keepSeriesUiHidden()).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
