const intro = document.querySelector("#intro");
const diaryApp = document.querySelector("#diary-app");
const diaryBook = document.querySelector("#diary-book");
const enterButton = document.querySelector("#enter-button");
const backToSkyButton = document.querySelector("#back-to-sky");
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const drawButton = document.querySelector("#draw-button");
const drawAgainButton = document.querySelector("#draw-again");
const gachaMachine = document.querySelector("#gacha-machine");
const gachaMessage = document.querySelector("#gacha-message");
const resultModal = document.querySelector("#result-modal");
const resultCard = document.querySelector("#result-card");
const resultKicker = document.querySelector("#result-kicker");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const collectionGrid = document.querySelector("#collection-grid");
const seriesList = document.querySelector("#series-list");
const seriesDetail = document.querySelector("#series-detail");
const mobilePagePrev = document.querySelector("#mobile-page-prev");
const mobilePageNext = document.querySelector("#mobile-page-next");
const mobilePageLabel = document.querySelector("#mobile-page-label");

const settingsModal = document.querySelector("#settings-modal");
const openSettingsButton = document.querySelector("#open-settings");
const settingsTabs = [...document.querySelectorAll("[data-settings-tab]")];
const settingsPanels = [...document.querySelectorAll("[data-settings-panel]")];
const gachaSettingsList = document.querySelector("#gacha-settings-list");
const seriesSettingsList = document.querySelector("#series-settings-list");
const settingsSummary = document.querySelector("#settings-summary");
const exportSettingsButton = document.querySelector("#export-settings");
const importSettingsInput = document.querySelector("#import-settings");

const editorModal = document.querySelector("#editor-modal");
const editorForm = document.querySelector("#item-editor-form");
const editorTitle = document.querySelector("#editor-title");
const editorType = document.querySelector("#editor-type");
const editorId = document.querySelector("#editor-id");
const editorNameLabel = document.querySelector("#editor-name-label");
const editorSymbolLabel = document.querySelector("#editor-symbol-label");
const editorName = document.querySelector("#editor-name");
const editorSymbol = document.querySelector("#editor-symbol");
const editorColor = document.querySelector("#editor-color");
const editorRarity = document.querySelector("#editor-rarity");
const editorRarityField = document.querySelector("#editor-rarity-field");
const editorSubtitle = document.querySelector("#editor-subtitle");
const editorSubtitleField = document.querySelector("#editor-subtitle-field");
const editorDescription = document.querySelector("#editor-description");
const editorDescriptionField = document.querySelector("#editor-description-field");

const confirmModal = document.querySelector("#confirm-modal");
const confirmTitle = document.querySelector("#confirm-title");
const confirmCopy = document.querySelector("#confirm-copy");
const confirmActionButton = document.querySelector("#confirm-action");
const toast = document.querySelector("#toast");

const saveKey = "pixely-diary-save-v1";
const tabOrder = ["home", "series", "gacha", "collection"];

const defaultGachaItems = [
  { id: "jam", name: "잠뜰", symbol: "☾", rarity: "SKY", color: "#829fda", weight: 13 },
  { id: "gak", name: "각별", symbol: "✦", rarity: "SKY", color: "#ddb956", weight: 13 },
  { id: "gong", name: "공룡", symbol: "◆", rarity: "SKY", color: "#79b783", weight: 13 },
  { id: "soo", name: "수현", symbol: "♢", rarity: "SKY", color: "#75bcd3", weight: 13 },
  { id: "ra", name: "라더", symbol: "♠", rarity: "SKY", color: "#d96f77", weight: 13 },
  { id: "deok", name: "덕개", symbol: "♣", rarity: "SKY", color: "#dc9967", weight: 13 },
  { id: "cloud-note", name: "구름 메모", symbol: "☁", rarity: "CLOUD", color: "#a9b9c4", weight: 7 },
  { id: "sky-letter", name: "하늘 편지", symbol: "✉", rarity: "CLOUD", color: "#9ebdce", weight: 7 },
  { id: "case-file", name: "사건 파일", symbol: "?", rarity: "STAR", color: "#506f88", weight: 3 },
  { id: "golden-key", name: "황금 열쇠", symbol: "⚿", rarity: "STAR", color: "#d4ad4d", weight: 2.5 },
  { id: "star-fragment", name: "별의 조각", symbol: "★", rarity: "STAR", color: "#8e8ac7", weight: 1.8 },
  { id: "rainbow-memory", name: "무지개 기억", symbol: "✧", rarity: "RAINBOW", color: "#a08bd0", weight: .7 },
];

const defaultSeriesItems = [
  {
    id: "mystery",
    title: "미스터리 수사반",
    subtitle: "사건 기록 파일",
    icon: "?",
    color: "#526d84",
    description: "소개, 등장인물, 에피소드와 명장면을 이 페이지에 차곡차곡 기록해요.",
  },
];

let save = loadSave();
let activeTabName = "home";
let currentSeriesId = save.seriesItems[0]?.id || null;
let mobilePageIndex = 0;
let drawing = false;
let transitioning = false;
let pendingConfirmAction = null;
let lastFocusedElement = null;
let toastTimer = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validColor(value, fallback = "#76aee8") {
  return /^#[0-9a-f]{6}$/i.test(String(value)) ? String(value) : fallback;
}

function rarityWeight(rarity) {
  return { CLOUD: 7, SKY: 13, STAR: 2.5, RAINBOW: .7 }[rarity] || 7;
}

function sanitizeGachaItems(items) {
  if (!Array.isArray(items)) return clone(defaultGachaItems);
  return items
    .filter((item) => item && item.name)
    .map((item, index) => {
      const rarity = ["CLOUD", "SKY", "STAR", "RAINBOW"].includes(item.rarity) ? item.rarity : "CLOUD";
      return {
        id: String(item.id || `card-${index}-${Date.now()}`),
        name: String(item.name).slice(0, 30),
        symbol: String(item.symbol || "✦").slice(0, 4),
        rarity,
        color: validColor(item.color),
        weight: Number(item.weight) > 0 ? Number(item.weight) : rarityWeight(rarity),
      };
    });
}

function sanitizeSeriesItems(items) {
  if (!Array.isArray(items)) return clone(defaultSeriesItems);
  return items
    .filter((item) => item && item.title)
    .map((item, index) => ({
      id: String(item.id || `series-${index}-${Date.now()}`),
      title: String(item.title).slice(0, 30),
      subtitle: String(item.subtitle || "새로운 이야기").slice(0, 45),
      icon: String(item.icon || "✦").slice(0, 4),
      color: validColor(item.color, "#526d84"),
      description: String(item.description || "새로운 시리즈 기록을 채워보세요.").slice(0, 140),
    }));
}

function loadSave() {
  try {
    const stored = JSON.parse(localStorage.getItem(saveKey));
    const owned = stored?.owned && typeof stored.owned === "object" ? stored.owned : {};
    return {
      owned,
      dust: Number.isFinite(stored?.dust) ? Math.max(0, stored.dust) : 0,
      gachaItems: sanitizeGachaItems(stored?.gachaItems),
      seriesItems: sanitizeSeriesItems(stored?.seriesItems),
    };
  } catch {
    return {
      owned: {},
      dust: 0,
      gachaItems: clone(defaultGachaItems),
      seriesItems: clone(defaultSeriesItems),
    };
  }
}

function persistSave() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(save));
  } catch {
    showToast("브라우저 저장 공간을 확인해주세요.");
  }
}

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function enterDiary() {
  window.scrollTo(0, 0);
  diaryApp.classList.add("is-visible");
  diaryApp.setAttribute("aria-hidden", "false");
  document.body.classList.add("diary-open");
  intro.classList.add("is-leaving");
  updateMobilePages();

  window.setTimeout(() => {
    intro.hidden = true;
    document.querySelector(".brand")?.focus({ preventScroll: true });
  }, 420);
}

function returnToSky() {
  closeSettings();
  diaryApp.classList.remove("is-visible");
  diaryApp.setAttribute("aria-hidden", "true");
  document.body.classList.remove("diary-open");
  intro.hidden = false;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    intro.classList.remove("is-leaving");
    enterButton.focus({ preventScroll: true });
  });
}

function updateTabs(tabName) {
  tabs.forEach((tab) => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", active);
    active ? tab.setAttribute("aria-current", "page") : tab.removeAttribute("aria-current");
  });
}

function openTab(tabName, options = {}) {
  const target = panels.find((panel) => panel.dataset.panel === tabName);
  const current = panels.find((panel) => panel.dataset.panel === activeTabName && !panel.hidden);
  if (!target || transitioning) return;

  const requestedMobilePage = Number.isInteger(options.mobilePage) ? options.mobilePage : 0;
  if (tabName === activeTabName) {
    mobilePageIndex = requestedMobilePage;
    updateMobilePages();
    return;
  }

  transitioning = true;
  const direction = tabOrder.indexOf(tabName) >= tabOrder.indexOf(activeTabName) ? "forward" : "backward";
  activeTabName = tabName;
  mobilePageIndex = requestedMobilePage;
  updateTabs(tabName);
  if (tabName === "collection") renderCollection();

  target.hidden = false;
  target.classList.add("is-active", `is-entering-${direction}`);
  current?.classList.add(`is-leaving-${direction}`);
  updateMobilePages();

  window.setTimeout(() => {
    panels.forEach((panel) => {
      const active = panel === target;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
      panel.classList.remove(
        "is-entering-forward",
        "is-entering-backward",
        "is-leaving-forward",
        "is-leaving-backward",
      );
    });
    transitioning = false;
  }, 560);
}

function activePages() {
  const panel = panels.find((item) => item.dataset.panel === activeTabName);
  return panel ? [...panel.querySelectorAll(":scope > .paper-page")] : [];
}

function updateMobilePages() {
  const pages = activePages();
  const isMobile = window.matchMedia("(max-width: 720px)").matches;
  if (!pages.length) return;
  mobilePageIndex = Math.max(0, Math.min(mobilePageIndex, pages.length - 1));

  panels.forEach((panel) => {
    [...panel.querySelectorAll(":scope > .paper-page")].forEach((page, index) => {
      page.classList.toggle(
        "is-mobile-current",
        !isMobile || (panel.dataset.panel === activeTabName && index === mobilePageIndex),
      );
    });
  });

  mobilePageLabel.textContent = `${mobilePageIndex + 1} / ${pages.length}`;
  const tabIndex = tabOrder.indexOf(activeTabName);
  mobilePagePrev.disabled = tabIndex === 0 && mobilePageIndex === 0;
  mobilePageNext.disabled = tabIndex === tabOrder.length - 1 && mobilePageIndex === pages.length - 1;
}

function moveMobilePage(direction) {
  const pages = activePages();
  const nextPage = mobilePageIndex + direction;
  if (nextPage >= 0 && nextPage < pages.length) {
    mobilePageIndex = nextPage;
    updateMobilePages();
    return;
  }

  const currentTabIndex = tabOrder.indexOf(activeTabName);
  const nextTabName = tabOrder[currentTabIndex + direction];
  if (!nextTabName) return;
  const nextPanel = panels.find((panel) => panel.dataset.panel === nextTabName);
  const nextPanelPages = nextPanel ? [...nextPanel.querySelectorAll(":scope > .paper-page")] : [];
  openTab(nextTabName, { mobilePage: direction > 0 ? 0 : Math.max(0, nextPanelPages.length - 1) });
}

function pickCard() {
  if (!save.gachaItems.length) return null;
  const total = save.gachaItems.reduce((sum, card) => sum + card.weight, 0);
  let value = Math.random() * total;
  for (const card of save.gachaItems) {
    value -= card.weight;
    if (value <= 0) return card;
  }
  return save.gachaItems[0];
}

function cardInnerMarkup(card, index) {
  return `
    <div class="collection-card__inner" style="--card-color:${validColor(card.color)};background:${validColor(card.color)}">
      <span class="collection-card__rarity">${escapeHtml(card.rarity)}</span>
      <span class="collection-card__symbol">${escapeHtml(card.symbol)}</span>
      <span class="collection-card__name">${escapeHtml(card.name)}</span>
      <span class="collection-card__number">NO.${String(index + 1).padStart(2, "0")}</span>
    </div>`;
}

function cardMarkup(card, index, { locked = false, count = 0 } = {}) {
  if (locked) {
    return `
      <div class="collection-card is-locked" style="--tilt:0deg">
        <div class="collection-card__inner">
          <span class="collection-card__rarity">${escapeHtml(card.rarity)}</span>
          <span class="collection-card__symbol">?</span>
          <span class="collection-card__name">아직 만나지 못한 기록</span>
          <span class="collection-card__number">NO.${String(index + 1).padStart(2, "0")}</span>
        </div>
      </div>`;
  }

  return `
    <div class="collection-card ${card.rarity === "RAINBOW" ? "is-rainbow" : ""}" style="--tilt:${(index % 3 - 1) * .7}deg">
      ${count > 1 ? `<span class="collection-card__count">×${count}</span>` : ""}
      ${cardInnerMarkup(card, index)}
    </div>`;
}

function drawCard() {
  if (drawing || !save.gachaItems.length) {
    if (!save.gachaItems.length) showToast("설정에서 가챠 카드를 먼저 추가해주세요.");
    return;
  }

  drawing = true;
  drawButton.disabled = true;
  gachaMachine.classList.add("is-drawing");
  gachaMessage.textContent = "구름 사이에서 캡슐을 찾고 있어요…";

  window.setTimeout(() => {
    const card = pickCard();
    const previousCount = save.owned[card.id] || 0;
    const duplicate = previousCount > 0;
    save.owned[card.id] = previousCount + 1;
    if (duplicate) save.dust += 10;
    persistSave();
    updateStats();
    showResult(card, duplicate);

    gachaMachine.classList.remove("is-drawing");
    drawButton.disabled = false;
    gachaMessage.textContent = duplicate
      ? `${card.name} 카드가 별가루 10개와 함께 찾아왔어요!`
      : `${card.name} 카드가 컬렉션에 새로 추가됐어요!`;
    drawing = false;
  }, 720);
}

function showResult(card, duplicate) {
  lastFocusedElement = document.activeElement;
  const index = save.gachaItems.findIndex((item) => item.id === card.id);
  resultKicker.textContent = duplicate ? "WELCOME BACK!" : "NEW MEMORY!";
  resultTitle.textContent = duplicate ? "반가운 카드를 다시 만났어요!" : "새로운 카드를 만났어요!";
  resultCopy.textContent = duplicate ? "중복 카드와 함께 별가루 10개를 받았어요." : "컬렉션에 소중히 보관했어요.";
  resultCard.classList.toggle("is-rainbow", card.rarity === "RAINBOW");
  resultCard.innerHTML = cardInnerMarkup(card, index);
  resultModal.hidden = false;
  drawAgainButton.focus();
}

function closeResult() {
  if (resultModal.hidden) return;
  resultModal.hidden = true;
  lastFocusedElement?.focus();
}

function renderCollection() {
  if (!save.gachaItems.length) {
    collectionGrid.innerHTML = `<div class="empty-setting-list"><span>✦</span><p>아직 카드가 없어요.<br />설정에서 첫 가챠 카드를 추가해주세요.</p></div>`;
    return;
  }

  collectionGrid.innerHTML = save.gachaItems
    .map((card, index) => {
      const count = save.owned[card.id] || 0;
      return cardMarkup(card, index, { locked: count === 0, count });
    })
    .join("");
}

function renderSeries() {
  if (!save.seriesItems.length) {
    currentSeriesId = null;
    seriesList.innerHTML = `<div class="empty-setting-list"><span>▤</span><p>등록된 시리즈가 없어요.<br />설정에서 새 시리즈를 추가해주세요.</p></div>`;
    seriesDetail.innerHTML = `
      <article class="series-view is-active">
        <div class="empty-series">
          <span aria-hidden="true">＋</span>
          <h3>첫 번째 이야기를 기다리는 중</h3>
          <p>설정창에서 메인 시리즈를 추가하면 이 페이지에 표지가 생겨요.</p>
          <button class="coming-button" type="button" data-open-series-settings>설정에서 추가하기</button>
        </div>
      </article>`;
    return;
  }

  if (!save.seriesItems.some((item) => item.id === currentSeriesId)) currentSeriesId = save.seriesItems[0].id;

  seriesList.innerHTML = save.seriesItems
    .map((item, index) => `
      <button class="series-item ${item.id === currentSeriesId ? "is-active" : ""}" type="button" data-select-series="${escapeHtml(item.id)}" role="listitem">
        <span class="series-item__number">${String(index + 1).padStart(2, "0")}</span>
        <span class="series-item__thumb" style="background:${validColor(item.color)};color:#fff" aria-hidden="true">${escapeHtml(item.icon)}</span>
        <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.subtitle)}</small></span>
        <i>→</i>
      </button>`)
    .join("");

  renderSeriesDetail();
}

function renderSeriesDetail() {
  const item = save.seriesItems.find((series) => series.id === currentSeriesId);
  if (!item) return;
  const index = save.seriesItems.indexOf(item);
  seriesDetail.innerHTML = `
    <article class="series-view is-active">
      <div class="case-cover" style="background:${validColor(item.color, "#526d84")}">
        <div class="case-cover__top"><span>SERIES FILE</span><b>NO. ${String(index + 1).padStart(3, "0")}</b></div>
        <div class="case-cover__icon" aria-hidden="true">${escapeHtml(item.icon)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.subtitle).toUpperCase()}</p>
        <div class="case-cover__tape" aria-hidden="true"></div>
      </div>
      <div class="series-summary">
        <span class="status-stamp">RECORDING</span>
        <div><b>나의 시리즈 기록</b><p>${escapeHtml(item.description)}</p></div>
      </div>
      <div class="series-chips"><span># 등장인물</span><span># 에피소드</span><span># 명장면</span><span># 관계성</span></div>
      <button class="coming-button" type="button" data-edit-series-from-page="${escapeHtml(item.id)}">설정에서 이 시리즈 수정하기</button>
    </article>`;
}

function selectSeries(id) {
  if (!save.seriesItems.some((item) => item.id === id)) return;
  currentSeriesId = id;
  renderSeries();
}

function updateStats() {
  const validIds = new Set(save.gachaItems.map((item) => item.id));
  const ownedCount = Object.entries(save.owned).filter(([id, count]) => validIds.has(id) && count > 0).length;

  document.querySelectorAll("[data-owned-count]").forEach((element) => { element.textContent = ownedCount; });
  document.querySelectorAll("[data-total-cards]").forEach((element) => { element.textContent = save.gachaItems.length; });
  document.querySelectorAll("[data-dust-count]").forEach((element) => { element.textContent = save.dust; });

  drawButton.disabled = save.gachaItems.length === 0;
  if (!save.gachaItems.length) gachaMessage.textContent = "설정에서 가챠 카드를 추가해주세요.";
  settingsSummary.textContent = `카드 ${save.gachaItems.length}개 · 시리즈 ${save.seriesItems.length}개`;
}

function renderSettingsLists() {
  gachaSettingsList.innerHTML = save.gachaItems.length
    ? save.gachaItems.map((item) => settingsItemMarkup("gacha", item, item.rarity)).join("")
    : `<div class="empty-setting-list"><span>✦</span><p>가챠 카드가 비어 있어요.<br />‘카드 추가’를 눌러 시작해보세요.</p></div>`;
  seriesSettingsList.innerHTML = save.seriesItems.length
    ? save.seriesItems.map((item) => settingsItemMarkup("series", item, item.subtitle)).join("")
    : `<div class="empty-setting-list"><span>▤</span><p>메인 시리즈가 비어 있어요.<br />‘시리즈 추가’를 눌러 시작해보세요.</p></div>`;
  updateStats();
}

function settingsItemMarkup(type, item, meta) {
  const label = type === "gacha" ? "카드" : "시리즈";
  const symbol = type === "gacha" ? item.symbol : item.icon;
  return `
    <article class="settings-item">
      <span class="settings-item__preview" style="--preview-color:${validColor(item.color)}">${escapeHtml(symbol)}</span>
      <span class="settings-item__copy"><b>${escapeHtml(type === "gacha" ? item.name : item.title)}</b><small>${escapeHtml(meta)}</small></span>
      <span class="settings-item__actions">
        <button type="button" data-edit-item="${type}" data-item-id="${escapeHtml(item.id)}" aria-label="${label} 수정">✎</button>
        <button type="button" data-delete-item="${type}" data-item-id="${escapeHtml(item.id)}" aria-label="${label} 삭제">×</button>
      </span>
    </article>`;
}

function refreshAll() {
  persistSave();
  renderSeries();
  renderCollection();
  renderSettingsLists();
  updateMobilePages();
}

function openSettings(initialTab = "gacha") {
  lastFocusedElement = document.activeElement;
  renderSettingsLists();
  switchSettingsTab(initialTab);
  settingsModal.hidden = false;
  settingsModal.querySelector(".settings-header [data-close-settings]")?.focus();
}

function closeSettings() {
  if (settingsModal.hidden) return;
  closeEditor();
  closeConfirm();
  settingsModal.hidden = true;
  lastFocusedElement?.focus();
}

function switchSettingsTab(tabName) {
  settingsTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.settingsTab === tabName));
  settingsPanels.forEach((panel) => {
    const active = panel.dataset.settingsPanel === tabName;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });
}

function openEditor(type, id = null) {
  const isGacha = type === "gacha";
  const collection = isGacha ? save.gachaItems : save.seriesItems;
  const item = id ? collection.find((entry) => entry.id === id) : null;

  editorForm.reset();
  editorType.value = type;
  editorId.value = item?.id || "";
  editorTitle.textContent = item ? `${isGacha ? "카드" : "시리즈"} 수정` : `새 ${isGacha ? "카드" : "시리즈"} 추가`;
  editorNameLabel.textContent = isGacha ? "카드 이름" : "시리즈 제목";
  editorSymbolLabel.textContent = isGacha ? "카드 기호" : "표지 기호";
  editorRarityField.hidden = !isGacha;
  editorSubtitleField.hidden = isGacha;
  editorDescriptionField.hidden = isGacha;

  editorName.value = item ? (isGacha ? item.name : item.title) : "";
  editorSymbol.value = item ? (isGacha ? item.symbol : item.icon) : "✦";
  editorColor.value = validColor(item?.color, isGacha ? "#76aee8" : "#526d84");
  editorRarity.value = isGacha ? (item?.rarity || "CLOUD") : "CLOUD";
  editorSubtitle.value = !isGacha && item ? item.subtitle : "";
  editorDescription.value = !isGacha && item ? item.description : "";

  editorModal.hidden = false;
  editorName.focus();
}

function closeEditor() {
  if (!editorModal.hidden) editorModal.hidden = true;
}

function saveEditorItem(event) {
  event.preventDefault();
  const type = editorType.value;
  const id = editorId.value;
  const isGacha = type === "gacha";
  const name = editorName.value.trim();
  const symbol = editorSymbol.value.trim();
  if (!name || !symbol) return;

  if (isGacha) {
    const rarity = editorRarity.value;
    const nextItem = { id: id || createId("card"), name, symbol, color: validColor(editorColor.value), rarity, weight: rarityWeight(rarity) };
    const index = save.gachaItems.findIndex((item) => item.id === id);
    if (index >= 0) save.gachaItems[index] = nextItem;
    else save.gachaItems.push(nextItem);
  } else {
    const nextItem = {
      id: id || createId("series"), title: name, icon: symbol,
      color: validColor(editorColor.value, "#526d84"),
      subtitle: editorSubtitle.value.trim() || "새로운 이야기",
      description: editorDescription.value.trim() || "새로운 시리즈 기록을 채워보세요.",
    };
    const index = save.seriesItems.findIndex((item) => item.id === id);
    if (index >= 0) save.seriesItems[index] = nextItem;
    else { save.seriesItems.push(nextItem); currentSeriesId = nextItem.id; }
  }

  closeEditor();
  refreshAll();
  showToast(`${isGacha ? "카드" : "시리즈"}를 저장했어요.`);
}

function requestDelete(type, id) {
  const isGacha = type === "gacha";
  const collection = isGacha ? save.gachaItems : save.seriesItems;
  const item = collection.find((entry) => entry.id === id);
  if (!item) return;
  const name = isGacha ? item.name : item.title;

  askConfirm(
    `‘${name}’을 삭제할까요?`,
    isGacha ? "이 카드의 컬렉션 기록도 함께 사라져요." : "다이어리 목차와 표지에서 이 시리즈가 사라져요.",
    () => {
      if (isGacha) { save.gachaItems = save.gachaItems.filter((entry) => entry.id !== id); delete save.owned[id]; }
      else {
        save.seriesItems = save.seriesItems.filter((entry) => entry.id !== id);
        if (currentSeriesId === id) currentSeriesId = save.seriesItems[0]?.id || null;
      }
      refreshAll();
      showToast("삭제했어요.");
    },
  );
}

function askConfirm(title, copy, action) {
  pendingConfirmAction = action;
  confirmTitle.textContent = title;
  confirmCopy.textContent = copy;
  confirmModal.hidden = false;
  confirmActionButton.focus();
}

function closeConfirm() {
  if (confirmModal.hidden) return;
  confirmModal.hidden = true;
  pendingConfirmAction = null;
}

function runConfirmedAction() {
  const action = pendingConfirmAction;
  confirmModal.hidden = true;
  pendingConfirmAction = null;
  action?.();
}

function requestReset(type) {
  const resetContent = {
    collection: ["컬렉션을 비울까요?", "뽑은 카드와 별가루가 모두 0으로 돌아가요."],
    gacha: ["카드 목록을 복구할까요?", "직접 만든 카드가 사라지고 기본 카드 12개로 돌아가요."],
    series: ["시리즈 목록을 복구할까요?", "직접 만든 시리즈가 사라지고 기본 목록으로 돌아가요."],
    all: ["다이어리 전체를 초기화할까요?", "카드, 시리즈, 컬렉션과 별가루가 모두 처음 상태로 돌아가요."],
  }[type];
  if (!resetContent) return;

  askConfirm(resetContent[0], resetContent[1], () => {
    if (type === "collection" || type === "all") { save.owned = {}; save.dust = 0; }
    if (type === "gacha" || type === "all") {
      save.gachaItems = clone(defaultGachaItems);
      const defaultIds = new Set(defaultGachaItems.map((item) => item.id));
      save.owned = Object.fromEntries(Object.entries(save.owned).filter(([id]) => defaultIds.has(id)));
    }
    if (type === "series" || type === "all") { save.seriesItems = clone(defaultSeriesItems); currentSeriesId = save.seriesItems[0].id; }
    refreshAll();
    showToast("초기화를 완료했어요.");
  });
}

function exportSettings() {
  const data = { version: 2, exportedAt: new Date().toISOString(), data: save };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pixely-diary-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("다이어리 백업 파일을 만들었어요.");
}

async function importSettings(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const data = parsed?.data || parsed;
    if (!data || !Array.isArray(data.gachaItems) || !Array.isArray(data.seriesItems)) throw new Error("Invalid backup");
    save = {
      owned: data.owned && typeof data.owned === "object" ? data.owned : {},
      dust: Number.isFinite(data.dust) ? Math.max(0, data.dust) : 0,
      gachaItems: sanitizeGachaItems(data.gachaItems),
      seriesItems: sanitizeSeriesItems(data.seriesItems),
    };
    currentSeriesId = save.seriesItems[0]?.id || null;
    refreshAll();
    showToast("백업한 다이어리를 불러왔어요.");
  } catch {
    showToast("올바른 다이어리 백업 파일이 아니에요.");
  } finally {
    importSettingsInput.value = "";
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function setToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  document.querySelector("#today-date").textContent = `${month}.${day}`;
}

enterButton.addEventListener("click", enterDiary);
backToSkyButton.addEventListener("click", returnToSky);
openSettingsButton.addEventListener("click", () => openSettings());
document.querySelectorAll("[data-go-home]").forEach((button) => button.addEventListener("click", () => openTab("home")));
tabs.forEach((tab) => tab.addEventListener("click", () => openTab(tab.dataset.tab)));
document.querySelectorAll("[data-open-tab]").forEach((button) => button.addEventListener("click", () => openTab(button.dataset.openTab)));
drawButton.addEventListener("click", drawCard);
drawAgainButton.addEventListener("click", () => { closeResult(); drawCard(); });
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeResult));
mobilePagePrev.addEventListener("click", () => moveMobilePage(-1));
mobilePageNext.addEventListener("click", () => moveMobilePage(1));

seriesList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-select-series]");
  if (button) selectSeries(button.dataset.selectSeries);
});

seriesDetail.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-series-from-page]");
  if (editButton) { openSettings("series"); openEditor("series", editButton.dataset.editSeriesFromPage); }
  if (event.target.closest("[data-open-series-settings]")) openSettings("series");
});

settingsTabs.forEach((tab) => tab.addEventListener("click", () => switchSettingsTab(tab.dataset.settingsTab)));
document.querySelectorAll("[data-close-settings]").forEach((button) => button.addEventListener("click", closeSettings));
document.querySelectorAll("[data-close-editor]").forEach((button) => button.addEventListener("click", closeEditor));
document.querySelectorAll("[data-cancel-confirm]").forEach((button) => button.addEventListener("click", closeConfirm));
confirmActionButton.addEventListener("click", runConfirmedAction);
editorForm.addEventListener("submit", saveEditorItem);
exportSettingsButton.addEventListener("click", exportSettings);
importSettingsInput.addEventListener("change", importSettings);
document.querySelectorAll("[data-add-item]").forEach((button) => button.addEventListener("click", () => openEditor(button.dataset.addItem)));
document.querySelectorAll("[data-reset]").forEach((button) => button.addEventListener("click", () => requestReset(button.dataset.reset)));

settingsModal.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-item]");
  if (editButton) openEditor(editButton.dataset.editItem, editButton.dataset.itemId);
  const deleteButton = event.target.closest("[data-delete-item]");
  if (deleteButton) requestDelete(deleteButton.dataset.deleteItem, deleteButton.dataset.itemId);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!confirmModal.hidden) closeConfirm();
  else if (!editorModal.hidden) closeEditor();
  else if (!settingsModal.hidden) closeSettings();
  else if (!resultModal.hidden) closeResult();
});

window.addEventListener("resize", updateMobilePages);
setToday();
refreshAll();
