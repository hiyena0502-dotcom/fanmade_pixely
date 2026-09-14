(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function installStyles() {
    if ($('#series-fan-mode-style')) return;
    const style = document.createElement('style');
    style.id = 'series-fan-mode-style';
    style.textContent = `
      .fan-perspective-note{margin:14px 0 0;padding:10px 12px;border-left:3px solid #8fc4e8;background:rgba(121,191,242,.08);color:#6f8797;font-size:11px;line-height:1.65}
      .series-intro-page .series-long-note{white-space:pre-line}
      .record-detail-type{letter-spacing:.11em}
    `;
    document.head.appendChild(style);
  }

  function updateDefinitions() {
    if (typeof recordDefinitions === 'undefined') return false;
    recordDefinitions.characters = {
      label: '최애 캐릭터', singular: '최애 캐릭터', icon: '♡',
      copy: '좋아하는 캐릭터와 마음에 든 포인트를 내 시선으로 기록해요.'
    };
    recordDefinitions.episodes = {
      label: '에피소드 감상', singular: '에피소드 감상', icon: 'EP',
      copy: '줄거리 정리보다 보고 느낀 점과 다시 보고 싶은 포인트를 남겨요.'
    };
    recordDefinitions.moments = {
      label: '최애 장면', singular: '최애 장면', icon: '✦',
      copy: '웃겼던 장면, 벅찼던 장면, 계속 생각나는 순간을 모아둬요.'
    };
    recordDefinitions.relationships = {
      label: '덕질 메모', singular: '덕질 메모', icon: '✎',
      copy: '정답을 정하지 않고 떠오른 생각, 키워드, 감상을 자유롭게 적어요.'
    };
    return true;
  }

  function installFunctionOverrides() {
    if (window.__pixelyFanSeriesInstalled) return;
    if (!updateDefinitions()) return;
    window.__pixelyFanSeriesInstalled = true;

    if (typeof recordMeta === 'function') {
      const originalRecordMeta = recordMeta;
      recordMeta = function(type, item, series) {
        if (type === 'characters') return item.tagline || '좋아하는 포인트를 아직 적지 않았어요.';
        if (type === 'relationships') return item.people || '자유 덕질 메모';
        return originalRecordMeta(type, item, series);
      };
    }

    if (typeof editorFieldsMarkup === 'function') {
      const originalEditorFieldsMarkup = editorFieldsMarkup;
      editorFieldsMarkup = function(type, item, series) {
        if (type === 'series') {
          return `${field('시리즈 제목', 'title', item?.title, { maxlength: 40, placeholder: '예: 미스터리 수사반' })}` +
            `${field('표지 기호', 'icon', item?.icon || '✦', { maxlength: 4, wide: false })}` +
            `${field('표지 색상', 'color', validColor(item?.color, '#526d84'), { type: 'color', wide: false })}` +
            `${field('나만의 한 줄 태그', 'subtitle', item?.subtitle, { maxlength: 70, placeholder: '예: 다시 보고 싶은 최애 시리즈' })}` +
            `${textareaField('내 감상 메모', 'description', item?.description, '이 시리즈를 좋아하게 된 이유, 첫인상, 기억하고 싶은 점을 자유롭게 적어주세요.', 600)}` +
            `<p class="future-image-note">공식 설정을 정리하는 칸이 아니라, 팬으로서 남기는 개인 감상 기록이에요.</p>`;
        }
        if (type === 'characters') {
          return `${field('캐릭터 이름', 'name', item?.name, { maxlength: 40, placeholder: '좋아하는 캐릭터 이름' })}` +
            `${field('애정 기호', 'symbol', item?.symbol || '♡', { maxlength: 4, wide: false })}` +
            `${field('대표 색상', 'color', validColor(item?.color), { type: 'color', wide: false })}` +
            `${field('좋아하는 포인트', 'tagline', item?.tagline, { maxlength: 80, required: false, placeholder: '예: 말투가 좋음 / 활약이 멋있음 / 웃긴 장면이 많음' })}` +
            `${textareaField('덕질 메모', 'memo', item?.memo, '이 캐릭터를 좋아하는 이유나 기억하고 싶은 순간을 자유롭게 적어주세요.')}`;
        }
        if (type === 'episodes') {
          return `${field('에피소드 제목', 'title', item?.title, { maxlength: 60, placeholder: '내가 기억하는 제목이나 별명도 괜찮아요.' })}` +
            `${field('회차 또는 번호', 'number', item?.number, { maxlength: 30, wide: false, required: false, placeholder: '예: EP.01' })}` +
            `${field('대표 색상', 'color', validColor(item?.color, '#668ba5'), { type: 'color', wide: false })}` +
            `${field('한 줄 감상', 'summary', item?.summary, { maxlength: 140, required: false, placeholder: '보고 바로 떠오른 한마디' })}` +
            `${textareaField('감상 노트', 'details', item?.details, '재밌었던 점, 웃겼던 부분, 다시 보고 싶은 포인트 등 팬으로서 느낀 걸 적어주세요.')}`;
        }
        if (type === 'moments') {
          return `${field('장면 이름', 'title', item?.title, { maxlength: 60, placeholder: '예: ○○가 웃었던 장면' })}` +
            `<label class="field field--wide"><span>관련 에피소드</span><select name="episodeId">${episodeOptions(series, item?.episodeId)}</select></label>` +
            `${field('기호', 'symbol', item?.symbol || '✦', { maxlength: 4, wide: false })}` +
            `${field('대표 색상', 'color', validColor(item?.color, '#d6aa54'), { type: 'color', wide: false })}` +
            `${textareaField('왜 좋아하는지', 'memo', item?.memo, '이 장면이 왜 좋았는지, 어떤 기분이 들었는지, 다시 보고 싶은 이유를 적어주세요.')}`;
        }
        if (type === 'relationships') {
          return `${field('메모 제목', 'name', item?.name, { maxlength: 60, placeholder: '예: 오늘 다시 보고 든 생각' })}` +
            `${field('키워드 · 태그', 'people', item?.people, { maxlength: 100, required: false, placeholder: '예: 웃김, 복선?, 다시보기, 좋아함' })}` +
            `${field('기호', 'symbol', item?.symbol || '✎', { maxlength: 4, wide: false })}` +
            `${field('대표 색상', 'color', validColor(item?.color, '#c68f9a'), { type: 'color', wide: false })}` +
            `${textareaField('자유 덕질 메모', 'description', item?.description, '공식 해석이나 정답을 정하지 않아도 돼요. 떠오른 생각과 감상을 편하게 적어주세요.')}`;
        }
        return originalEditorFieldsMarkup(type, item, series);
      };
    }

    if (typeof seriesIndexSpreadMarkup === 'function') {
      const originalSeriesIndexSpreadMarkup = seriesIndexSpreadMarkup;
      seriesIndexSpreadMarkup = function(items, spreadIndex) {
        return originalSeriesIndexSpreadMarkup(items, spreadIndex)
          .replace('간직하고 싶은 이야기를 골라 기록을 펼쳐보세요.', '좋아하는 시리즈를 골라 나만의 덕질 기록을 펼쳐보세요.')
          .replace('시리즈가 많아지면 목차도 다음 펼침면으로 이어집니다.', '좋아하는 작품이 늘어날수록 나만의 팬북도 함께 늘어나요.');
      };
    }

    if (typeof seriesIntroSpreadMarkup === 'function') {
      const originalSeriesIntroSpreadMarkup = seriesIntroSpreadMarkup;
      seriesIntroSpreadMarkup = function(series, spreadIndex) {
        let html = originalSeriesIntroSpreadMarkup(series, spreadIndex)
          .replace('BASIC PROFILE', 'MY FAN PAGE')
          .replace('RECORD INDEX', 'FAN NOTE INDEX')
          .replace('이야기 속 기록', '나의 덕질 기록')
          .replace('한 장씩 넘기며 쌓아 둔 기록을 살펴보세요.', '좋았던 캐릭터와 에피소드, 장면을 내 방식대로 모아보세요.');
        const marker = '</div></div>\n    <div class="paper-page paper-page--right series-toc-page">';
        if (html.includes(marker)) {
          html = html.replace(marker, '<p class="fan-perspective-note">※ 공식 설정집이 아니라, 한 팬이 좋아했던 순간과 감상을 모아두는 개인 팬북이에요.</p></div></div>\n    <div class="paper-page paper-page--right series-toc-page">');
        }
        return html;
      };
    }
  }

  function updateStaticCopy() {
    const labels = {
      characters: '최애 캐릭터',
      episodes: '에피소드 감상',
      moments: '최애 장면',
      relationships: '덕질 메모'
    };
    Object.entries(labels).forEach(([type, label]) => {
      const button = $(`[data-record-type="${type}"]`);
      if (button) button.textContent = label;
    });

    const managerTitle = $('#record-manager .record-manager__header h3');
    if (managerTitle) managerTitle.textContent = '시리즈 덕질 기록';
    const managerKicker = $('#record-manager .record-manager__header span');
    if (managerKicker) managerKicker.textContent = 'FAN RECORDS';

    const homeCopy = $('#home-recent-series-copy');
    if (homeCopy) homeCopy.textContent = '좋아하는 캐릭터와 에피소드, 최애 장면을 한 권에';

    const seriesHeading = $('#series-heading');
    if (seriesHeading) seriesHeading.textContent = '나의 시리즈 팬북';
  }

  function refreshSeriesUi() {
    updateDefinitions();
    updateStaticCopy();
    if (typeof renderSeriesSpreads === 'function') renderSeriesSpreads({ preserveSpread: true });
    if (typeof renderRecordManager === 'function') renderRecordManager();
    updateStaticCopy();
  }

  function boot() {
    installStyles();
    installFunctionOverrides();
    refreshSeriesUi();
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-tab="series"], [data-open-tab="series"], #open-settings, [data-settings-tab="series"], [data-settings-tab="records"]')) {
        setTimeout(refreshSeriesUi, 30);
      }
    }, true);
    new MutationObserver(() => updateStaticCopy()).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
