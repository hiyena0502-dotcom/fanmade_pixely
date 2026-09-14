const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const intro = $("#intro");
const diaryApp = $("#diary-app");
const diaryBook = $("#diary-book");
const enterButton = $("#enter-button");
const backToSkyButton = $("#back-to-sky");
const tabs = $$('[data-tab]');
const panels = $$('[data-panel]');
const seriesSpreads = $("#series-spreads");
const collectionSpreads = $("#collection-spreads");
const spreadControls = $("#spread-page-controls");
const spreadPrev = $("#spread-page-prev");
const spreadNext = $("#spread-page-next");
const spreadLabel = $("#spread-page-label");

const drawButton = $("#draw-button");
const drawAgainButton = $("#draw-again");
const gachaMachine = $("#gacha-machine");
const gachaMessage = $("#gacha-message");
const resultModal = $("#result-modal");
const resultCard = $("#result-card");
const resultKicker = $("#result-kicker");
const resultTitle = $("#result-title");
const resultCopy = $("#result-copy");
const resultPrimaryAction = $("#result-primary-action");

const settingsModal = $("#settings-modal");
const openSettingsButton = $("#open-settings");
const settingsTabs = $$('[data-settings-tab]');
const settingsPanels = $$('[data-settings-panel]');
const gachaSettingsList = $("#gacha-settings-list");
const seriesSettingsList = $("#series-settings-list");
const settingsSummary = $("#settings-summary");
const recordSeriesSelect = $("#record-series-select");
const recordTypeTabs = $$('[data-record-type]');
const recordManagerCopy = $("#record-manager-copy");
const recordSettingsList = $("#record-settings-list");
const addRecordButton = $("#add-record");
const exportSettingsButton = $("#export-settings");
const importSettingsInput = $("#import-settings");

const editorModal = $("#editor-modal");
const editorForm = $("#item-editor-form");
const editorTitle = $("#editor-title");
const editorType = $("#editor-type");
const editorId = $("#editor-id");
const editorSeriesId = $("#editor-series-id");
const editorFields = $("#editor-fields");

const confirmModal = $("#confirm-modal");
const confirmTitle = $("#confirm-title");
const confirmCopy = $("#confirm-copy");
const confirmBackupButton = $("#confirm-backup");
const confirmActionButton = $("#confirm-action");

const cardDetailModal = $("#card-detail-modal");
const cardDetailPreview = $("#card-detail-preview");
const cardDetailRarity = $("#card-detail-rarity");
const cardDetailTitle = $("#card-detail-title");
const cardDetailNote = $("#card-detail-note");
const cardDetailSeries = $("#card-detail-series");
const cardDetailCount = $("#card-detail-count");
const cardDetailDescription = $("#card-detail-description");
const toast = $("#toast");

const saveKey = "pixely-diary-save-v1";
const tabOrder = ["home", "series", "gacha", "collection"];
const recordOrder = ["characters", "episodes", "moments", "relationships"];
const recordsPerSpread = 5;
const cardsPerLeaf = 4;
const cardsPerSpread = cardsPerLeaf * 2;

const recordDefinitions = {
  characters: { label: "등장인물", singular: "등장인물", icon: "♙", copy: "이름, 한 줄 설명과 본문 메모를 기록해요." },
  episodes: { label: "에피소드", singular: "에피소드", icon: "EP", copy: "회차와 줄거리, 상세 감상을 기록해요." },
  moments: { label: "명장면", singular: "명장면", icon: "✦", copy: "관련 에피소드와 기억하고 싶은 장면을 기록해요." },
  relationships: { label: "관계성", singular: "관계", icon: "↔", copy: "관련 인물과 관계에 대한 생각을 기록해요." },
};

const emptyRecords = () => ({ characters: [], episodes: [], moments: [], relationships: [] });

const defaultGachaItems = [
  { id: "jam", name: "잠뜰", symbol: "☾", rarity: "SKY", color: "#829fda", weight: 13, shortNote: "하늘빛 멤버 카드", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "gak", name: "각별", symbol: "✦", rarity: "SKY", color: "#ddb956", weight: 13, shortNote: "별빛 멤버 카드", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "gong", name: "공룡", symbol: "◆", rarity: "SKY", color: "#79b783", weight: 13, shortNote: "초록빛 멤버 카드", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "soo", name: "수현", symbol: "♢", rarity: "SKY", color: "#75bcd3", weight: 13, shortNote: "맑은빛 멤버 카드", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "ra", name: "라더", symbol: "♠", rarity: "SKY", color: "#d96f77", weight: 13, shortNote: "붉은빛 멤버 카드", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "deok", name: "덕개", symbol: "♣", rarity: "SKY", color: "#dc9967", weight: 13, shortNote: "주황빛 멤버 카드", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "cloud-note", name: "구름 메모", symbol: "☁", rarity: "CLOUD", color: "#a9b9c4", weight: 7, shortNote: "포근한 일상의 조각", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "sky-letter", name: "하늘 편지", symbol: "✉", rarity: "CLOUD", color: "#9ebdce", weight: 7, shortNote: "하늘에서 도착한 편지", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "case-file", name: "사건 파일", symbol: "?", rarity: "STAR", color: "#506f88", weight: 3, shortNote: "어딘가 수상한 기록", relatedSeriesId: "mystery", description: "", imageUrl: null },
  { id: "golden-key", name: "황금 열쇠", symbol: "⚿", rarity: "STAR", color: "#d4ad4d", weight: 2.5, shortNote: "잠긴 이야기를 여는 열쇠", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "star-fragment", name: "별의 조각", symbol: "★", rarity: "STAR", color: "#8e8ac7", weight: 1.8, shortNote: "밤하늘에서 떨어진 조각", relatedSeriesId: null, description: "", imageUrl: null },
  { id: "rainbow-memory", name: "무지개 기억", symbol: "✧", rarity: "RAINBOW", color: "#a08bd0", weight: .7, shortNote: "아주 희귀한 행운", relatedSeriesId: null, description: "", imageUrl: null },
];

const defaultSeriesItems = [
  {
    id: "mystery",
    title: "미스터리 수사반",
    subtitle: "사건 기록 파일",
    icon: "?",
    color: "#526d84",
    description: "소개, 등장인물, 에피소드와 명장면을 이 페이지에 차곡차곡 기록해요.",
    records: emptyRecords(),
  },
];

let save = loadSave();
let activeTabName = "home";
let spreadState = { home: 0, series: 0, gacha: 0, collection: 0 };
let currentSeriesId = save.recentSeriesId || save.seriesItems[0]?.id || null;
let settingsSeriesId = currentSeriesId;
let settingsRecordType = "characters";
let selectedRecordIds = {};
let drawing = false;
let transitioning = false;
let spreadTransitioning = false;
let pendingConfirmAction = null;
let lastDrawResult = null;
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

function createId(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) chunks.push(items.slice(index, index + size));
  return chunks;
}

function rarityWeight(rarity) {
  return { CLOUD: 7, SKY: 13, STAR: 2.5, RAINBOW: .7 }[rarity] || 7;
}

function sanitizeGachaItems(items) {
  if (!Array.isArray(items)) return clone(defaultGachaItems);
  return items.filter((item) => item?.name).map((item, index) => {
    const rarity = ["CLOUD", "SKY", "STAR", "RAINBOW"].includes(item.rarity) ? item.rarity : "CLOUD";
    return {
      id: String(item.id || `card-${index}-${Date.now()}`),
      name: String(item.name).slice(0, 40),
      symbol: String(item.symbol || "✦").slice(0, 4),
      rarity,
      color: validColor(item.color),
      weight: Number(item.weight) > 0 ? Number(item.weight) : rarityWeight(rarity),
      shortNote: String(item.shortNote || "").slice(0, 80),
      relatedSeriesId: item.relatedSeriesId ? String(item.relatedSeriesId) : null,
      description: String(item.description || "").slice(0, 500),
      imageUrl: item.imageUrl ? String(item.imageUrl) : null,
    };
  });
}

function sanitizeRecords(records) {
  const source = records && typeof records === "object" ? records : {};
  return {
    characters: Array.isArray(source.characters) ? source.characters.filter((item) => item?.name).map((item) => ({
      id: String(item.id || createId("character")), name: String(item.name).slice(0, 40), tagline: String(item.tagline || "").slice(0, 80),
      memo: String(item.memo || "").slice(0, 1000), symbol: String(item.symbol || "♙").slice(0, 4), color: validColor(item.color), imageUrl: item.imageUrl || null,
    })) : [],
    episodes: Array.isArray(source.episodes) ? source.episodes.filter((item) => item?.title).map((item) => ({
      id: String(item.id || createId("episode")), title: String(item.title).slice(0, 60), number: String(item.number || "").slice(0, 30),
      summary: String(item.summary || "").slice(0, 140), details: String(item.details || "").slice(0, 1500), symbol: String(item.symbol || "EP").slice(0, 4), color: validColor(item.color, "#668ba5"), imageUrl: item.imageUrl || null,
    })) : [],
    moments: Array.isArray(source.moments) ? source.moments.filter((item) => item?.title).map((item) => ({
      id: String(item.id || createId("moment")), title: String(item.title).slice(0, 60), episodeId: item.episodeId ? String(item.episodeId) : null,
      memo: String(item.memo || "").slice(0, 1200), symbol: String(item.symbol || "✦").slice(0, 4), color: validColor(item.color, "#d6aa54"), imageUrl: item.imageUrl || null,
    })) : [],
    relationships: Array.isArray(source.relationships) ? source.relationships.filter((item) => item?.name).map((item) => ({
      id: String(item.id || createId("relationship")), name: String(item.name).slice(0, 60), people: String(item.people || "").slice(0, 100),
      description: String(item.description || "").slice(0, 1500), symbol: String(item.symbol || "↔").slice(0, 4), color: validColor(item.color, "#c68f9a"), imageUrl: item.imageUrl || null,
    })) : [],
  };
}

function sanitizeSeriesItems(items) {
  if (!Array.isArray(items)) return clone(defaultSeriesItems);
  return items.filter((item) => item?.title).map((item, index) => ({
    id: String(item.id || `series-${index}-${Date.now()}`),
    title: String(item.title).slice(0, 40),
    subtitle: String(item.subtitle || "새로운 이야기").slice(0, 70),
    icon: String(item.icon || "✦").slice(0, 4),
    color: validColor(item.color, "#526d84"),
    description: String(item.description || "새로운 시리즈 기록을 채워보세요.").slice(0, 600),
    records: sanitizeRecords(item.records),
  }));
}

function loadSave() {
  try {
    const stored = JSON.parse(localStorage.getItem(saveKey));
    return {
      owned: stored?.owned && typeof stored.owned === "object" ? stored.owned : {},
      dust: Number.isFinite(stored?.dust) ? Math.max(0, stored.dust) : 0,
      gachaItems: sanitizeGachaItems(stored?.gachaItems),
      seriesItems: sanitizeSeriesItems(stored?.seriesItems),
      recentSeriesId: stored?.recentSeriesId || null,
      lastCardId: stored?.lastCardId || null,
      todayNote: String(stored?.todayNote || "").slice(0, 120),
    };
  } catch {
    return { owned: {}, dust: 0, gachaItems: clone(defaultGachaItems), seriesItems: clone(defaultSeriesItems), recentSeriesId: null, lastCardId: null, todayNote: "" };
  }
}

function persistSave() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(save));
  } catch {
    showToast("브라우저 저장 공간을 확인해주세요.");
  }
}

function currentSeries() {
  return save.seriesItems.find((series) => series.id === currentSeriesId) || save.seriesItems[0] || null;
}

function recordTitle(type, item) {
  if (type === "characters" || type === "relationships") return item.name;
  return item.title;
}

function recordMeta(type, item, series) {
  if (type === "characters") return item.tagline || "한 줄 설명이 아직 없어요.";
  if (type === "episodes") return item.number || "회차 미정";
  if (type === "moments") return series.records.episodes.find((episode) => episode.id === item.episodeId)?.title || "관련 에피소드 없음";
  return item.people || "관련 인물 미정";
}

function recordBody(type, item) {
  if (type === "characters" || type === "moments") return item.memo;
  if (type === "episodes") return item.details;
  return item.description;
}

function recordSymbol(type, item) {
  return item.symbol || recordDefinitions[type].icon;
}

function seriesStructure(series = currentSeries()) {
  const indexChunks = chunk(save.seriesItems, recordsPerSpread);
  const structure = (indexChunks.length ? indexChunks : [[]]).map((items) => ({ kind: "index", items }));
  if (!series) return structure;
  structure.push({ kind: "intro" });
  recordOrder.forEach((type) => {
    const groups = chunk(series.records[type], recordsPerSpread);
    (groups.length ? groups : [[]]).forEach((items) => structure.push({ kind: "records", type, items }));
  });
  return structure;
}

function sectionSpreadCounts() {
  return {
    home: 1,
    series: seriesStructure().length,
    gacha: 1,
    collection: Math.max(1, Math.ceil(save.gachaItems.length / cardsPerSpread)),
  };
}

function sectionStartPage(tabName) {
  const counts = sectionSpreadCounts();
  let start = 1;
  for (const name of tabOrder) {
    if (name === tabName) return start;
    start += counts[name] * 2;
  }
  return start;
}

function pageNumber(tabName, spreadIndex, side = 0) {
  return String(sectionStartPage(tabName) + spreadIndex * 2 + side).padStart(2, "0");
}

function pageNumberMarkup(tabName, spreadIndex, side) {
  return `<div class="page-number">${pageNumber(tabName, spreadIndex, side)}</div>`;
}

function enterDiary() {
  window.scrollTo(0, 0);
  diaryApp.classList.add("is-visible");
  diaryApp.setAttribute("aria-hidden", "false");
  intro.classList.add("is-leaving");
  updateSpreadControls();
  window.setTimeout(() => {
    intro.hidden = true;
    $(".brand")?.focus({ preventScroll: true });
  }, 420);
}

function returnToSky() {
  closeSettings();
  diaryApp.classList.remove("is-visible");
  diaryApp.setAttribute("aria-hidden", "true");
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

function panelSpreads(tabName = activeTabName) {
  const panel = panels.find((item) => item.dataset.panel === tabName);
  return panel ? [...panel.querySelectorAll(".diary-spread")] : [];
}

function ensureActiveSpread(tabName = activeTabName) {
  const spreads = panelSpreads(tabName);
  if (!spreads.length) return;
  spreadState[tabName] = Math.max(0, Math.min(spreadState[tabName] || 0, spreads.length - 1));
  spreads.forEach((spread, index) => {
    const active = index === spreadState[tabName];
    spread.hidden = !active;
    spread.classList.toggle("is-active", active);
  });
}

function openTab(tabName, options = {}) {
  const target = panels.find((panel) => panel.dataset.panel === tabName);
  const current = panels.find((panel) => panel.dataset.panel === activeTabName && !panel.hidden);
  if (!target || transitioning) return;
  if (Number.isInteger(options.spreadIndex)) spreadState[tabName] = options.spreadIndex;
  ensureActiveSpread(tabName);

  if (tabName === activeTabName) {
    updateSpreadControls();
    if (options.highlightCardId) window.setTimeout(() => highlightCollectionCard(options.highlightCardId), 120);
    return;
  }

  transitioning = true;
  const direction = tabOrder.indexOf(tabName) >= tabOrder.indexOf(activeTabName) ? "forward" : "backward";
  activeTabName = tabName;
  updateTabs(tabName);
  target.hidden = false;
  target.classList.add("is-active", `is-entering-${direction}`);
  current?.classList.add(`is-leaving-${direction}`);
  updateSpreadControls();

  window.setTimeout(() => {
    panels.forEach((panel) => {
      const active = panel === target;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
      panel.classList.remove("is-entering-forward", "is-entering-backward", "is-leaving-forward", "is-leaving-backward");
    });
    transitioning = false;
    if (options.highlightCardId) highlightCollectionCard(options.highlightCardId);
  }, 560);
}

function goToSpread(nextIndex) {
  if (spreadTransitioning) return;
  const spreads = panelSpreads();
  const currentIndex = spreadState[activeTabName] || 0;
  if (nextIndex < 0 || nextIndex >= spreads.length) return;
  if (nextIndex === currentIndex) return;

  spreadTransitioning = true;
  const current = spreads[currentIndex];
  const target = spreads[nextIndex];
  const motion = nextIndex > currentIndex ? "forward" : "backward";
  target.hidden = false;
  target.classList.add("is-active", `is-entering-${motion}`);
  current.classList.add(`is-leaving-${motion}`);
  spreadState[activeTabName] = nextIndex;
  updateSpreadControls();

  window.setTimeout(() => {
    current.hidden = true;
    current.classList.remove("is-active", `is-leaving-${motion}`);
    target.classList.remove(`is-entering-${motion}`);
    spreadTransitioning = false;
  }, 540);
}

function changeSpread(direction) {
  goToSpread((spreadState[activeTabName] || 0) + direction);
}

function updateSpreadControls() {
  const spreads = panelSpreads();
  const index = Math.max(0, Math.min(spreadState[activeTabName] || 0, Math.max(0, spreads.length - 1)));
  spreadState[activeTabName] = index;
  const multiple = spreads.length > 1;
  spreadControls.hidden = !multiple;
  if (!spreads.length) return;
  spreadPrev.disabled = index === 0;
  spreadNext.disabled = index === spreads.length - 1;
  spreadLabel.textContent = `${pageNumber(activeTabName, index, 0)}–${pageNumber(activeTabName, index, 1)} · ${index + 1} / ${spreads.length}`;
}

function seriesIndexSpreadMarkup(items, spreadIndex) {
  const series = currentSeries();
  const list = items.length ? items.map((item, index) => `
    <button class="series-item ${item.id === currentSeriesId ? "is-active" : ""}" type="button" data-select-series="${escapeHtml(item.id)}">
      <span class="series-item__number">${String(save.seriesItems.indexOf(item) + 1).padStart(2, "0")}</span>
      <span class="series-item__thumb" style="background:${validColor(item.color)};color:#fff">${escapeHtml(item.icon)}</span>
      <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.subtitle)}</small></span><i>→</i>
    </button>`).join("") : `<div class="empty-page-note"><span>▤</span><p>아직 시리즈가 없어요.</p><button type="button" data-open-series-settings>설정에서 추가하기</button></div>`;

  const cover = series ? `
    <article class="series-view is-active">
      <div class="case-cover" style="background:${validColor(series.color, "#526d84")}">
        <div class="case-cover__top"><span>SERIES FILE</span><b>NO. ${String(save.seriesItems.indexOf(series) + 1).padStart(3, "0")}</b></div>
        <div class="case-cover__icon">${escapeHtml(series.icon)}</div>
        <h3>${escapeHtml(series.title)}</h3><p>${escapeHtml(series.subtitle).toUpperCase()}</p><div class="case-cover__tape"></div>
      </div>
      <div class="series-summary"><span class="status-stamp">RECORDING</span><div><b>나의 시리즈 기록</b><p>${escapeHtml(series.description)}</p></div></div>
      <div class="series-chips">${recordOrder.map((type) => `<button type="button" data-jump-record-type="${type}"># ${recordDefinitions[type].label}</button>`).join("")}</div>
      <button class="coming-button" type="button" data-edit-series-from-page="${escapeHtml(series.id)}">설정에서 이 시리즈 수정하기</button>
    </article>` : `<div class="empty-series"><span>＋</span><h3>첫 번째 이야기를 기다리는 중</h3><p>설정창에서 메인 시리즈를 추가해주세요.</p></div>`;

  return `<div class="diary-spread" data-spread="${spreadIndex}">
    <div class="paper-page paper-page--left series-index">${pageNumberMarkup("series", spreadIndex, 0)}<div class="washi-tape washi-tape--yellow"></div><span class="section-kicker">TABLE OF CONTENTS</span><h2>메인 시리즈</h2><p>간직하고 싶은 이야기를 골라 기록을 펼쳐보세요.</p><div class="series-list" role="list">${list}</div><div class="index-memo"><span>✎</span><p>시리즈가 많아지면 목차도 다음 펼침면으로 이어집니다.</p></div></div>
    <div class="paper-page paper-page--right series-detail">${pageNumberMarkup("series", spreadIndex, 1)}${cover}</div>
  </div>`;
}

function seriesIntroSpreadMarkup(series, spreadIndex) {
  const totalRecords = recordOrder.reduce((sum, type) => sum + series.records[type].length, 0);
  return `<div class="diary-spread" data-spread="${spreadIndex}" data-series-section="intro">
    <div class="paper-page paper-page--left series-intro-page">${pageNumberMarkup("series", spreadIndex, 0)}<div class="washi-tape washi-tape--blue"></div><span class="section-kicker">BASIC PROFILE</span><div class="series-mini-cover" style="--series-color:${validColor(series.color)}"><span>${escapeHtml(series.icon)}</span></div><h2>${escapeHtml(series.title)}</h2><p class="series-intro-subtitle">${escapeHtml(series.subtitle)}</p><div class="series-long-note">${escapeHtml(series.description)}</div></div>
    <div class="paper-page paper-page--right series-toc-page">${pageNumberMarkup("series", spreadIndex, 1)}<span class="section-kicker">RECORD INDEX</span><h3>이야기 속 기록</h3><p>한 장씩 넘기며 쌓아 둔 기록을 살펴보세요.</p><div class="record-toc">${recordOrder.map((type) => `<button type="button" data-jump-record-type="${type}"><span>${recordDefinitions[type].icon}</span><b>${recordDefinitions[type].label}</b><small>${series.records[type].length}개의 기록</small><i>→</i></button>`).join("")}</div><div class="record-total-note">지금까지 <b>${totalRecords}</b>개의 기록을 모았어요.</div></div>
  </div>`;
}

function recordDetailMarkup(type, item, series) {
  if (!item) return `<div class="empty-record-detail"><span>${recordDefinitions[type].icon}</span><h3>아직 기록이 없어요</h3><p>설정에서 첫 ${recordDefinitions[type].singular} 기록을 추가하면 이 페이지에 나타나요.</p><button type="button" data-open-record-settings="${type}">기록 추가하기</button></div>`;
  return `<article class="record-detail-card" data-record-detail-id="${escapeHtml(item.id)}"><div class="record-detail-symbol" style="--record-color:${validColor(item.color)}">${escapeHtml(recordSymbol(type, item))}</div><span class="record-detail-type">${recordDefinitions[type].label.toUpperCase()} NOTE</span><h3>${escapeHtml(recordTitle(type, item))}</h3><p class="record-detail-meta">${escapeHtml(recordMeta(type, item, series))}</p><div class="record-detail-body">${escapeHtml(recordBody(type, item) || "아직 상세 메모가 없어요.")}</div><button type="button" data-edit-record-from-page="${type}" data-record-id="${escapeHtml(item.id)}">이 기록 수정하기</button></article>`;
}

function recordSpreadMarkup(series, descriptor, spreadIndex) {
  const { type, items } = descriptor;
  const definition = recordDefinitions[type];
  const selectedId = selectedRecordIds[type];
  const selected = items.find((item) => item.id === selectedId) || items[0] || null;
  if (selected) selectedRecordIds[type] = selected.id;
  const list = items.length ? items.map((item, index) => `
    <button class="record-list-item ${item.id === selected?.id ? "is-active" : ""}" type="button" data-series-record-type="${type}" data-series-record-id="${escapeHtml(item.id)}">
      <span style="--record-color:${validColor(item.color)}">${escapeHtml(recordSymbol(type, item))}</span><i>${String(index + 1).padStart(2, "0")}</i><b>${escapeHtml(recordTitle(type, item))}</b><small>${escapeHtml(recordMeta(type, item, series))}</small>
    </button>`).join("") : `<div class="empty-page-note"><span>${definition.icon}</span><p>아직 ${definition.label} 기록이 없어요.</p><button type="button" data-open-record-settings="${type}">첫 기록 추가하기</button></div>`;

  return `<div class="diary-spread" data-spread="${spreadIndex}" data-record-spread="${type}">
    <div class="paper-page paper-page--left record-list-page">${pageNumberMarkup("series", spreadIndex, 0)}<div class="washi-tape ${type === "moments" ? "washi-tape--pink" : "washi-tape--blue"}"></div><span class="section-kicker">${definition.label.toUpperCase()} INDEX</span><h2>${definition.label}</h2><p>${definition.copy}</p><div class="series-record-list">${list}</div></div>
    <div class="paper-page paper-page--right record-detail-page">${pageNumberMarkup("series", spreadIndex, 1)}${recordDetailMarkup(type, selected, series)}</div>
  </div>`;
}

function renderSeriesSpreads({ preserveSpread = false } = {}) {
  const series = currentSeries();
  if (series && currentSeriesId !== series.id) currentSeriesId = series.id;
  const structure = seriesStructure(series);
  if (!preserveSpread) spreadState.series = 0;
  seriesSpreads.innerHTML = structure.map((descriptor, index) => {
    if (descriptor.kind === "index") return seriesIndexSpreadMarkup(descriptor.items, index);
    if (descriptor.kind === "intro") return seriesIntroSpreadMarkup(series, index);
    return recordSpreadMarkup(series, descriptor, index);
  }).join("");
  ensureActiveSpread("series");
  updateStaticPageNumbers();
}

function collectionCardMarkup(card, index) {
  const count = save.owned[card.id] || 0;
  const locked = count <= 0;
  return `<button class="collection-card ${locked ? "is-locked" : ""} ${card.rarity === "RAINBOW" ? "is-rainbow" : ""}" type="button" ${locked ? `data-locked-card="${escapeHtml(card.id)}"` : `data-card-id="${escapeHtml(card.id)}"`} style="--tilt:${(index % 3 - 1) * .7}deg">
    ${count > 1 ? `<span class="collection-card__count">×${count}</span>` : ""}<div class="collection-card__inner" style="--card-color:${validColor(card.color)};background:${validColor(card.color)}"><span class="collection-card__rarity">${escapeHtml(card.rarity)}</span><span class="collection-card__symbol">${locked ? "?" : escapeHtml(card.symbol)}</span><span class="collection-card__name">${locked ? "아직 만나지 못한 기록" : escapeHtml(card.name)}</span><span class="collection-card__number">NO.${String(index + 1).padStart(2, "0")}</span></div></button>`;
}

function collectionLeafMarkup(items, spreadIndex, side, globalOffset) {
  const owned = save.gachaItems.filter((card) => (save.owned[card.id] || 0) > 0).length;
  const title = spreadIndex === 0 && side === 0 ? `<span class="section-kicker">MY LITTLE TREASURES</span><h2>픽셀 컬렉션</h2><p>가챠에서 만난 기록을 한 장씩 눌러 살펴보세요.</p>` : `<span class="section-kicker">COLLECTION CONTINUED</span><h3>이어지는 기록</h3><p>다음 페이지에 붙여 둔 카드들이에요.</p>`;
  const cards = items.length ? items.map((card, index) => collectionCardMarkup(card, globalOffset + index)).join("") : `<div class="empty-page-note"><span>✦</span><p>이 페이지는 새로운 카드를 기다리고 있어요.</p><button type="button" data-open-tab="gacha">가챠로 이동하기</button></div>`;
  return `<div class="paper-page paper-page--${side === 0 ? "left" : "right"} collection-leaf">${pageNumberMarkup("collection", spreadIndex, side)}<div class="collection-leaf-heading">${title}<div><b>${owned}</b><small>/ ${save.gachaItems.length}</small></div></div><div class="collection-leaf-grid">${cards}</div><div class="collection-leaf-footer"><span>✦ 별가루 <b>${save.dust}</b></span><small>${spreadIndex + 1}번째 컬렉션 펼침면</small></div></div>`;
}

function renderCollectionSpreads({ preserveSpread = true } = {}) {
  const groups = chunk(save.gachaItems, cardsPerSpread);
  const pages = groups.length ? groups : [[]];
  if (!preserveSpread) spreadState.collection = 0;
  collectionSpreads.innerHTML = pages.map((items, spreadIndex) => {
    const leftItems = items.slice(0, cardsPerLeaf);
    const rightItems = items.slice(cardsPerLeaf, cardsPerSpread);
    return `<div class="diary-spread collection-spread" data-spread="${spreadIndex}">${collectionLeafMarkup(leftItems, spreadIndex, 0, spreadIndex * cardsPerSpread)}${collectionLeafMarkup(rightItems, spreadIndex, 1, spreadIndex * cardsPerSpread + cardsPerLeaf)}</div>`;
  }).join("");
  ensureActiveSpread("collection");
  updateStaticPageNumbers();
}

function updateStaticPageNumbers() {
  const homePages = panels.find((panel) => panel.dataset.panel === "home")?.querySelectorAll(".page-number") || [];
  homePages.forEach((node, index) => { node.textContent = pageNumber("home", 0, index); });
  const gachaPages = panels.find((panel) => panel.dataset.panel === "gacha")?.querySelectorAll(".page-number") || [];
  gachaPages.forEach((node, index) => { node.textContent = pageNumber("gacha", 0, index); });
  updateSpreadControls();
}

function jumpToRecordType(type) {
  const spreads = panelSpreads("series");
  const index = spreads.findIndex((spread) => spread.dataset.recordSpread === type);
  if (index < 0) return;
  if (activeTabName !== "series") openTab("series", { spreadIndex: index });
  else goToSpread(index);
}

function selectSeries(id) {
  const series = save.seriesItems.find((item) => item.id === id);
  if (!series) return;
  currentSeriesId = id;
  settingsSeriesId = id;
  save.recentSeriesId = id;
  persistSave();
  renderSeriesSpreads({ preserveSpread: true });
  renderHome();
}

function selectRecord(type, id, button) {
  selectedRecordIds[type] = id;
  const spread = button.closest(".diary-spread");
  spread.querySelectorAll("[data-series-record-id]").forEach((item) => item.classList.toggle("is-active", item.dataset.seriesRecordId === id));
  const series = currentSeries();
  const record = series?.records[type].find((item) => item.id === id);
  const detailPage = spread.querySelector(".record-detail-page");
  const pageNo = detailPage.querySelector(".page-number")?.outerHTML || "";
  detailPage.innerHTML = pageNo + recordDetailMarkup(type, record, series);
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
  return `<div class="collection-card__inner" style="--card-color:${validColor(card.color)};background:${validColor(card.color)}"><span class="collection-card__rarity">${escapeHtml(card.rarity)}</span><span class="collection-card__symbol">${escapeHtml(card.symbol)}</span><span class="collection-card__name">${escapeHtml(card.name)}</span><span class="collection-card__number">NO.${String(index + 1).padStart(2, "0")}</span></div>`;
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
    save.lastCardId = card.id;
    lastDrawResult = { cardId: card.id, duplicate };
    persistSave();
    renderCollectionSpreads();
    renderHome();
    updateStats();
    showResult(card, duplicate);
    gachaMachine.classList.remove("is-drawing");
    drawButton.disabled = false;
    gachaMessage.textContent = duplicate ? `${card.name} 카드가 별가루 10개와 함께 찾아왔어요!` : `${card.name} 카드를 다이어리에 붙일 수 있어요!`;
    drawing = false;
  }, 720);
}

function showResult(card, duplicate) {
  lastFocusedElement = document.activeElement;
  const index = save.gachaItems.findIndex((item) => item.id === card.id);
  resultKicker.textContent = duplicate ? "WELCOME BACK!" : "NEW MEMORY!";
  resultTitle.textContent = duplicate ? "중복 카드를 다시 만났어요." : "새로운 카드를 만났어요!";
  resultCopy.textContent = duplicate ? "별가루 +10" : "카드를 컬렉션 페이지에 붙여보세요.";
  resultPrimaryAction.textContent = duplicate ? "확인" : "다이어리에 붙이기";
  resultCard.classList.toggle("is-rainbow", card.rarity === "RAINBOW");
  resultCard.innerHTML = cardInnerMarkup(card, index);
  resultModal.hidden = false;
  resultPrimaryAction.focus();
}

function closeResult() {
  if (resultModal.hidden) return;
  resultModal.hidden = true;
  lastFocusedElement?.focus();
}

function handleResultPrimaryAction() {
  const result = lastDrawResult;
  closeResult();
  if (!result || result.duplicate) return;
  const cardIndex = save.gachaItems.findIndex((card) => card.id === result.cardId);
  const targetSpread = Math.max(0, Math.floor(cardIndex / cardsPerSpread));
  spreadState.collection = targetSpread;
  ensureActiveSpread("collection");
  openTab("collection", { spreadIndex: targetSpread, highlightCardId: result.cardId });
}

function highlightCollectionCard(cardId) {
  const card = [...collectionSpreads.querySelectorAll("[data-card-id]")].find((item) => item.dataset.cardId === cardId);
  if (!card) return;
  card.classList.remove("is-newly-attached");
  requestAnimationFrame(() => card.classList.add("is-newly-attached"));
  window.setTimeout(() => card.classList.remove("is-newly-attached"), 2400);
  card.focus({ preventScroll: true });
}

function openCardDetail(cardId) {
  const card = save.gachaItems.find((item) => item.id === cardId);
  const count = save.owned[cardId] || 0;
  if (!card || count <= 0) { showToast("아직 만나지 못한 카드예요."); return; }
  const index = save.gachaItems.indexOf(card);
  const relatedSeries = save.seriesItems.find((series) => series.id === card.relatedSeriesId);
  cardDetailPreview.classList.toggle("is-rainbow", card.rarity === "RAINBOW");
  cardDetailPreview.innerHTML = cardInnerMarkup(card, index);
  cardDetailRarity.textContent = `${card.rarity} CARD`;
  cardDetailTitle.textContent = card.name;
  cardDetailNote.textContent = card.shortNote || "짧은 메모가 아직 없어요.";
  cardDetailSeries.textContent = relatedSeries?.title || "연결된 시리즈 없음";
  cardDetailCount.textContent = `${count}장`;
  cardDetailDescription.textContent = card.description || "상세 설명이 아직 없어요.";
  lastFocusedElement = document.activeElement;
  cardDetailModal.hidden = false;
  cardDetailModal.querySelector(".card-detail-close")?.focus();
}

function closeCardDetail() {
  if (cardDetailModal.hidden) return;
  cardDetailModal.hidden = true;
  lastFocusedElement?.focus();
}

function renderHome() {
  const recentSeries = save.seriesItems.find((series) => series.id === save.recentSeriesId) || save.seriesItems[0];
  const recentCard = save.gachaItems.find((card) => card.id === save.lastCardId && (save.owned[card.id] || 0) > 0);
  $("#home-recent-series-title").textContent = recentSeries?.title || "메인 시리즈를 추가해보세요";
  $("#home-recent-series-copy").textContent = recentSeries ? `최근 펼친 기록 · ${recentSeries.subtitle}` : "설정에서 첫 번째 이야기를 만들어보세요.";
  $("#home-recent-card-title").textContent = recentCard?.name || "아직 만난 카드가 없어요";
  $("#home-recent-card-copy").textContent = recentCard ? `${recentCard.rarity} · ${recentCard.shortNote || "최근에 얻은 카드"}` : "가챠에서 첫 번째 추억을 만나보세요.";
  $("#today-note").value = save.todayNote || "";
  const ownedCount = save.gachaItems.filter((card) => (save.owned[card.id] || 0) > 0).length;
  const progress = save.gachaItems.length ? Math.round((ownedCount / save.gachaItems.length) * 100) : 0;
  $("#collection-progress-bar").style.width = `${progress}%`;
  $("#collection-progress-copy").textContent = `컬렉션 ${progress}% 완성`;
}

function updateStats() {
  const validIds = new Set(save.gachaItems.map((item) => item.id));
  const ownedCount = Object.entries(save.owned).filter(([id, count]) => validIds.has(id) && count > 0).length;
  $$('[data-owned-count]').forEach((element) => { element.textContent = ownedCount; });
  $$('[data-total-cards]').forEach((element) => { element.textContent = save.gachaItems.length; });
  $$('[data-dust-count]').forEach((element) => { element.textContent = save.dust; });
  $$('[data-series-count]').forEach((element) => { element.textContent = save.seriesItems.length; });
  drawButton.disabled = save.gachaItems.length === 0;
  if (!save.gachaItems.length) gachaMessage.textContent = "설정에서 가챠 카드를 추가해주세요.";
  const recordCount = save.seriesItems.reduce((sum, series) => sum + recordOrder.reduce((inner, type) => inner + series.records[type].length, 0), 0);
  settingsSummary.textContent = `카드 ${save.gachaItems.length}개 · 시리즈 ${save.seriesItems.length}개 · 기록 ${recordCount}개`;
}

function settingsItemMarkup(type, item, meta, extra = "") {
  const isGacha = type === "gacha";
  const label = isGacha ? "카드" : "시리즈";
  const title = isGacha ? item.name : item.title;
  const symbol = isGacha ? item.symbol : item.icon;
  return `<article class="settings-item"><span class="settings-item__preview" style="--preview-color:${validColor(item.color)}">${escapeHtml(symbol)}</span><span class="settings-item__copy"><b>${escapeHtml(title)}</b><small>${escapeHtml(meta)}</small>${extra}</span><span class="settings-item__actions"><button type="button" data-edit-item="${type}" data-item-id="${escapeHtml(item.id)}" aria-label="${label} 수정">✎</button><button type="button" data-delete-item="${type}" data-item-id="${escapeHtml(item.id)}" aria-label="${label} 삭제">×</button></span></article>`;
}

function renderSettingsLists() {
  gachaSettingsList.innerHTML = save.gachaItems.length ? save.gachaItems.map((item) => settingsItemMarkup("gacha", item, item.rarity, item.shortNote ? `<em>${escapeHtml(item.shortNote)}</em>` : "")).join("") : `<div class="empty-setting-list"><span>✦</span><p>가챠 카드가 비어 있어요.<br />‘카드 추가’를 눌러 시작해보세요.</p></div>`;
  seriesSettingsList.innerHTML = save.seriesItems.length ? save.seriesItems.map((item) => settingsItemMarkup("series", item, item.subtitle)).join("") : `<div class="empty-setting-list"><span>▤</span><p>메인 시리즈가 비어 있어요.<br />‘시리즈 추가’를 눌러 시작해보세요.</p></div>`;
  renderRecordManager();
  updateStats();
}

function renderRecordManager() {
  if (!save.seriesItems.some((series) => series.id === settingsSeriesId)) settingsSeriesId = save.seriesItems[0]?.id || null;
  recordSeriesSelect.innerHTML = save.seriesItems.length ? save.seriesItems.map((series) => `<option value="${escapeHtml(series.id)}" ${series.id === settingsSeriesId ? "selected" : ""}>${escapeHtml(series.title)}</option>`).join("") : `<option value="">시리즈를 먼저 추가해주세요</option>`;
  recordSeriesSelect.disabled = !save.seriesItems.length;
  addRecordButton.disabled = !settingsSeriesId;
  recordTypeTabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.recordType === settingsRecordType));
  const definition = recordDefinitions[settingsRecordType];
  recordManagerCopy.textContent = definition.copy;
  addRecordButton.textContent = `＋ ${definition.singular} 추가`;
  const series = save.seriesItems.find((item) => item.id === settingsSeriesId);
  const records = series?.records[settingsRecordType] || [];
  recordSettingsList.innerHTML = records.length ? records.map((item) => {
    const title = recordTitle(settingsRecordType, item);
    const meta = recordMeta(settingsRecordType, item, series);
    return `<article class="settings-item"><span class="settings-item__preview" style="--preview-color:${validColor(item.color)}">${escapeHtml(recordSymbol(settingsRecordType, item))}</span><span class="settings-item__copy"><b>${escapeHtml(title)}</b><small>${escapeHtml(meta)}</small></span><span class="settings-item__actions"><button type="button" data-edit-record="${settingsRecordType}" data-item-id="${escapeHtml(item.id)}" data-series-id="${escapeHtml(series.id)}" aria-label="기록 수정">✎</button><button type="button" data-delete-record="${settingsRecordType}" data-item-id="${escapeHtml(item.id)}" data-series-id="${escapeHtml(series.id)}" aria-label="기록 삭제">×</button></span></article>`;
  }).join("") : `<div class="empty-setting-list compact"><span>${definition.icon}</span><p>아직 ${definition.label} 기록이 없어요.</p></div>`;
}

function refreshAll({ preserveSpreads = true } = {}) {
  persistSave();
  renderSeriesSpreads({ preserveSpread: preserveSpreads });
  renderCollectionSpreads({ preserveSpread: preserveSpreads });
  renderSettingsLists();
  renderHome();
  updateStats();
  updateStaticPageNumbers();
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
  settingsPanels.forEach((panel) => { const active = panel.dataset.settingsPanel === tabName; panel.hidden = !active; panel.classList.toggle("is-active", active); });
}

function seriesOptions(selectedId, includeEmpty = true) {
  const empty = includeEmpty ? `<option value="">연결하지 않음</option>` : "";
  return empty + save.seriesItems.map((series) => `<option value="${escapeHtml(series.id)}" ${series.id === selectedId ? "selected" : ""}>${escapeHtml(series.title)}</option>`).join("");
}

function episodeOptions(series, selectedId) {
  return `<option value="">관련 에피소드 없음</option>` + (series?.records.episodes || []).map((episode) => `<option value="${escapeHtml(episode.id)}" ${episode.id === selectedId ? "selected" : ""}>${escapeHtml(episode.number ? `${episode.number} · ${episode.title}` : episode.title)}</option>`).join("");
}

function field(label, name, value = "", options = {}) {
  const wide = options.wide === false ? "" : " field--wide";
  const required = options.required === false ? "" : " required";
  const maxlength = options.maxlength ? ` maxlength="${options.maxlength}"` : "";
  const placeholder = options.placeholder ? ` placeholder="${escapeHtml(options.placeholder)}"` : "";
  return `<label class="field${wide}"><span>${label}</span><input name="${name}" type="${options.type || "text"}" value="${escapeHtml(value)}"${maxlength}${placeholder}${required} /></label>`;
}

function textareaField(label, name, value = "", placeholder = "", maxlength = 1500) {
  return `<label class="field field--wide"><span>${label}</span><textarea name="${name}" rows="4" maxlength="${maxlength}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea></label>`;
}

function editorFieldsMarkup(type, item, series) {
  if (type === "gacha") return `${field("카드 이름", "name", item?.name, { maxlength: 40, placeholder: "예: 별빛 카드" })}${field("카드 기호", "symbol", item?.symbol || "✦", { maxlength: 4, wide: false })}${field("대표 색상", "color", validColor(item?.color), { type: "color", wide: false })}<label class="field field--wide"><span>가챠 등급</span><select name="rarity"><option value="CLOUD" ${item?.rarity === "CLOUD" ? "selected" : ""}>CLOUD · 일반</option><option value="SKY" ${item?.rarity === "SKY" ? "selected" : ""}>SKY · 멤버</option><option value="STAR" ${item?.rarity === "STAR" ? "selected" : ""}>STAR · 희귀</option><option value="RAINBOW" ${item?.rarity === "RAINBOW" ? "selected" : ""}>RAINBOW · 특별</option></select></label>${field("카드 짧은 메모", "shortNote", item?.shortNote, { maxlength: 80, required: false, placeholder: "카드 아래에 표시할 짧은 기록" })}<label class="field field--wide"><span>관련 시리즈</span><select name="relatedSeriesId">${seriesOptions(item?.relatedSeriesId)}</select></label>${textareaField("상세 설명", "description", item?.description, "카드를 클릭했을 때 보여줄 상세 기록", 500)}<p class="future-image-note">이미지 필드는 이후 확장할 수 있도록 데이터 구조에 준비되어 있어요.</p>`;
  if (type === "series") return `${field("시리즈 제목", "title", item?.title, { maxlength: 40, placeholder: "예: 미스터리 수사반" })}${field("표지 기호", "icon", item?.icon || "✦", { maxlength: 4, wide: false })}${field("표지 색상", "color", validColor(item?.color, "#526d84"), { type: "color", wide: false })}${field("한 줄 설명", "subtitle", item?.subtitle, { maxlength: 70, placeholder: "예: 사건 기록 파일" })}${textareaField("기본 소개", "description", item?.description, "시리즈의 기본 소개와 메모", 600)}`;
  if (type === "characters") return `${field("이름", "name", item?.name, { maxlength: 40 })}${field("기호", "symbol", item?.symbol || "♙", { maxlength: 4, wide: false })}${field("대표 색상", "color", validColor(item?.color), { type: "color", wide: false })}${field("한 줄 설명", "tagline", item?.tagline, { maxlength: 80, required: false })}${textareaField("본문 메모", "memo", item?.memo, "인물에 대해 기록하고 싶은 내용을 적어주세요.")}`;
  if (type === "episodes") return `${field("에피소드 이름", "title", item?.title, { maxlength: 60 })}${field("회차 또는 번호", "number", item?.number, { maxlength: 30, wide: false, required: false, placeholder: "예: EP.01" })}${field("대표 색상", "color", validColor(item?.color, "#668ba5"), { type: "color", wide: false })}${field("짧은 설명", "summary", item?.summary, { maxlength: 140, required: false })}${textareaField("상세 기록", "details", item?.details, "줄거리, 감상과 기억하고 싶은 내용을 적어주세요.")}`;
  if (type === "moments") return `${field("명장면 제목", "title", item?.title, { maxlength: 60 })}<label class="field field--wide"><span>관련 에피소드</span><select name="episodeId">${episodeOptions(series, item?.episodeId)}</select></label>${field("기호", "symbol", item?.symbol || "✦", { maxlength: 4, wide: false })}${field("대표 색상", "color", validColor(item?.color, "#d6aa54"), { type: "color", wide: false })}${textareaField("메모", "memo", item?.memo, "이 장면을 좋아하는 이유와 기억을 적어주세요.")}`;
  return `${field("관계 이름", "name", item?.name, { maxlength: 60 })}${field("관련 인물", "people", item?.people, { maxlength: 100, required: false, placeholder: "예: 잠뜰 · 각별" })}${field("기호", "symbol", item?.symbol || "↔", { maxlength: 4, wide: false })}${field("대표 색상", "color", validColor(item?.color, "#c68f9a"), { type: "color", wide: false })}${textareaField("관계 설명", "description", item?.description, "관계의 특징과 좋아하는 포인트를 적어주세요.")}`;
}

function openEditor(type, id = null, seriesId = null) {
  const isRecord = recordOrder.includes(type);
  const series = save.seriesItems.find((item) => item.id === seriesId) || (isRecord ? save.seriesItems.find((item) => item.id === settingsSeriesId) : null);
  let item = null;
  if (type === "gacha") item = save.gachaItems.find((entry) => entry.id === id);
  else if (type === "series") item = save.seriesItems.find((entry) => entry.id === id);
  else item = series?.records[type].find((entry) => entry.id === id);
  const label = type === "gacha" ? "카드" : type === "series" ? "시리즈" : recordDefinitions[type].singular;
  editorType.value = type;
  editorId.value = item?.id || "";
  editorSeriesId.value = series?.id || "";
  editorTitle.textContent = `${item ? label + " 수정" : "새 " + label + " 추가"}`;
  editorFields.innerHTML = editorFieldsMarkup(type, item, series);
  editorModal.hidden = false;
  editorFields.querySelector("input, select, textarea")?.focus();
}

function closeEditor() {
  if (!editorModal.hidden) editorModal.hidden = true;
}

function saveEditorItem(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(editorForm).entries());
  const type = editorType.value;
  const id = editorId.value || createId(type === "gacha" ? "card" : type === "series" ? "series" : type.slice(0, -1));
  if (type === "gacha") {
    const rarity = data.rarity || "CLOUD";
    const old = save.gachaItems.find((item) => item.id === id);
    const next = { id, name: data.name.trim(), symbol: data.symbol.trim() || "✦", color: validColor(data.color), rarity, weight: rarityWeight(rarity), shortNote: data.shortNote?.trim() || "", relatedSeriesId: data.relatedSeriesId || null, description: data.description?.trim() || "", imageUrl: old?.imageUrl || null };
    const index = save.gachaItems.findIndex((item) => item.id === id);
    if (index >= 0) save.gachaItems[index] = next; else save.gachaItems.push(next);
  } else if (type === "series") {
    const old = save.seriesItems.find((item) => item.id === id);
    const next = { id, title: data.title.trim(), icon: data.icon.trim() || "✦", color: validColor(data.color, "#526d84"), subtitle: data.subtitle?.trim() || "새로운 이야기", description: data.description?.trim() || "새로운 시리즈 기록을 채워보세요.", records: old?.records || emptyRecords() };
    const index = save.seriesItems.findIndex((item) => item.id === id);
    if (index >= 0) save.seriesItems[index] = next; else save.seriesItems.push(next);
    currentSeriesId = id; settingsSeriesId = id; save.recentSeriesId = id;
  } else {
    const series = save.seriesItems.find((item) => item.id === editorSeriesId.value);
    if (!series) return;
    const old = series.records[type].find((item) => item.id === id);
    let next;
    if (type === "characters") next = { id, name: data.name.trim(), tagline: data.tagline?.trim() || "", memo: data.memo?.trim() || "", symbol: data.symbol.trim() || "♙", color: validColor(data.color), imageUrl: old?.imageUrl || null };
    if (type === "episodes") next = { id, title: data.title.trim(), number: data.number?.trim() || "", summary: data.summary?.trim() || "", details: data.details?.trim() || "", symbol: "EP", color: validColor(data.color, "#668ba5"), imageUrl: old?.imageUrl || null };
    if (type === "moments") next = { id, title: data.title.trim(), episodeId: data.episodeId || null, memo: data.memo?.trim() || "", symbol: data.symbol.trim() || "✦", color: validColor(data.color, "#d6aa54"), imageUrl: old?.imageUrl || null };
    if (type === "relationships") next = { id, name: data.name.trim(), people: data.people?.trim() || "", description: data.description?.trim() || "", symbol: data.symbol.trim() || "↔", color: validColor(data.color, "#c68f9a"), imageUrl: old?.imageUrl || null };
    const index = series.records[type].findIndex((item) => item.id === id);
    if (index >= 0) series.records[type][index] = next; else series.records[type].push(next);
    selectedRecordIds[type] = id;
  }
  closeEditor();
  refreshAll();
  showToast("다이어리 기록을 저장했어요.");
}

function requestDelete(type, id, seriesId = null) {
  const isRecord = recordOrder.includes(type);
  const series = save.seriesItems.find((item) => item.id === seriesId);
  const item = type === "gacha" ? save.gachaItems.find((entry) => entry.id === id) : type === "series" ? save.seriesItems.find((entry) => entry.id === id) : series?.records[type].find((entry) => entry.id === id);
  if (!item) return;
  const name = type === "gacha" ? item.name : type === "series" ? item.title : recordTitle(type, item);
  askConfirm(`‘${name}’을 삭제할까요?`, type === "gacha" ? "이 카드의 컬렉션 기록도 함께 사라져요." : type === "series" ? "시리즈 안에 작성한 모든 기록도 함께 사라져요." : "이 기록은 현재 시리즈에서 사라져요.", () => {
    if (type === "gacha") { save.gachaItems = save.gachaItems.filter((entry) => entry.id !== id); delete save.owned[id]; }
    else if (type === "series") {
      save.seriesItems = save.seriesItems.filter((entry) => entry.id !== id);
      save.gachaItems.forEach((card) => { if (card.relatedSeriesId === id) card.relatedSeriesId = null; });
      if (currentSeriesId === id) currentSeriesId = save.seriesItems[0]?.id || null;
      if (settingsSeriesId === id) settingsSeriesId = save.seriesItems[0]?.id || null;
      if (save.recentSeriesId === id) save.recentSeriesId = currentSeriesId;
    } else if (isRecord && series) series.records[type] = series.records[type].filter((entry) => entry.id !== id);
    refreshAll();
    showToast("기록을 삭제했어요.");
  });
}

function askConfirm(title, copy, action, { showBackup = false, actionLabel = "확인" } = {}) {
  pendingConfirmAction = action;
  confirmTitle.textContent = title;
  confirmCopy.textContent = copy;
  confirmBackupButton.hidden = !showBackup;
  confirmActionButton.textContent = actionLabel;
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
    gacha: ["기본 카드로 되돌릴까요?", "직접 만든 카드가 사라지고 기본 카드 12개로 돌아가요."],
    series: ["기본 시리즈로 되돌릴까요?", "직접 만든 시리즈와 내부 기록이 사라지고 기본 목록으로 돌아가요."],
    all: ["다이어리 전체를 초기화할까요?", "카드, 시리즈, 내부 기록, 컬렉션과 메모가 모두 처음 상태로 돌아가요."],
  }[type];
  if (!resetContent) return;
  askConfirm(resetContent[0], resetContent[1], () => {
    if (type === "collection" || type === "all") {
      save.owned = {};
      save.dust = 0;
      save.lastCardId = null;
    }
    if (type === "gacha" || type === "all") {
      save.gachaItems = clone(defaultGachaItems);
      const defaultIds = new Set(save.gachaItems.map((card) => card.id));
      save.owned = Object.fromEntries(Object.entries(save.owned).filter(([id]) => defaultIds.has(id)));
      if (!defaultIds.has(save.lastCardId)) save.lastCardId = null;
    }
    if (type === "series" || type === "all") {
      save.seriesItems = clone(defaultSeriesItems);
      currentSeriesId = "mystery";
      settingsSeriesId = "mystery";
      save.recentSeriesId = "mystery";
      save.gachaItems.forEach((card) => { if (card.relatedSeriesId && card.relatedSeriesId !== "mystery") card.relatedSeriesId = null; });
    }
    if (type === "all") save.todayNote = "";
    spreadState = { home: 0, series: 0, gacha: 0, collection: 0 };
    refreshAll({ preserveSpreads: false });
    showToast("초기화를 완료했어요.");
  }, { showBackup: type === "all", actionLabel: type === "all" ? "전체 초기화" : "초기화" });
}

function exportSettings() {
  const data = { version: 3, exportedAt: new Date().toISOString(), data: save };
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
    save = { owned: data.owned && typeof data.owned === "object" ? data.owned : {}, dust: Number.isFinite(data.dust) ? Math.max(0, data.dust) : 0, gachaItems: sanitizeGachaItems(data.gachaItems), seriesItems: sanitizeSeriesItems(data.seriesItems), recentSeriesId: data.recentSeriesId || null, lastCardId: data.lastCardId || null, todayNote: String(data.todayNote || "").slice(0, 120) };
    currentSeriesId = save.recentSeriesId || save.seriesItems[0]?.id || null;
    settingsSeriesId = currentSeriesId;
    spreadState = { home: 0, series: 0, gacha: 0, collection: 0 };
    refreshAll({ preserveSpreads: false });
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
  $("#today-date").textContent = `${month}.${day}`;
  $("#intro-sky-status").textContent = `${month}.${day} · CLEAR SKY`;
}

enterButton.addEventListener("click", enterDiary);
backToSkyButton.addEventListener("click", returnToSky);
openSettingsButton.addEventListener("click", () => openSettings());
tabs.forEach((tab) => tab.addEventListener("click", () => openTab(tab.dataset.tab)));
$$('[data-go-home]').forEach((button) => button.addEventListener("click", () => openTab("home")));
$$('[data-open-tab]').forEach((button) => button.addEventListener("click", () => openTab(button.dataset.openTab)));
spreadPrev.addEventListener("click", () => changeSpread(-1));
spreadNext.addEventListener("click", () => changeSpread(1));
drawButton.addEventListener("click", drawCard);
drawAgainButton.addEventListener("click", () => { closeResult(); drawCard(); });
resultPrimaryAction.addEventListener("click", handleResultPrimaryAction);
$$('[data-close-modal]').forEach((button) => button.addEventListener("click", closeResult));

seriesSpreads.addEventListener("click", (event) => {
  const seriesButton = event.target.closest("[data-select-series]");
  if (seriesButton) selectSeries(seriesButton.dataset.selectSeries);
  const recordButton = event.target.closest("[data-series-record-id]");
  if (recordButton) selectRecord(recordButton.dataset.seriesRecordType, recordButton.dataset.seriesRecordId, recordButton);
  const jumpButton = event.target.closest("[data-jump-record-type]");
  if (jumpButton) jumpToRecordType(jumpButton.dataset.jumpRecordType);
  const editSeriesButton = event.target.closest("[data-edit-series-from-page]");
  if (editSeriesButton) { openSettings("series"); openEditor("series", editSeriesButton.dataset.editSeriesFromPage); }
  const openSeriesSettings = event.target.closest("[data-open-series-settings]");
  if (openSeriesSettings) openSettings("series");
  const openRecordSettings = event.target.closest("[data-open-record-settings]");
  if (openRecordSettings) { settingsRecordType = openRecordSettings.dataset.openRecordSettings; settingsSeriesId = currentSeriesId; openSettings("series"); renderRecordManager(); }
  const editRecordButton = event.target.closest("[data-edit-record-from-page]");
  if (editRecordButton) { openSettings("series"); openEditor(editRecordButton.dataset.editRecordFromPage, editRecordButton.dataset.recordId, currentSeriesId); }
});

collectionSpreads.addEventListener("click", (event) => {
  const card = event.target.closest("[data-card-id]");
  if (card) openCardDetail(card.dataset.cardId);
  if (event.target.closest("[data-locked-card]")) showToast("아직 만나지 못한 카드예요.");
  const tabButton = event.target.closest("[data-open-tab]");
  if (tabButton) openTab(tabButton.dataset.openTab);
});

$("#today-note").addEventListener("input", (event) => { save.todayNote = event.target.value.slice(0, 120); persistSave(); });
settingsTabs.forEach((tab) => tab.addEventListener("click", () => switchSettingsTab(tab.dataset.settingsTab)));
recordTypeTabs.forEach((tab) => tab.addEventListener("click", () => { settingsRecordType = tab.dataset.recordType; renderRecordManager(); }));
recordSeriesSelect.addEventListener("change", () => { settingsSeriesId = recordSeriesSelect.value || null; renderRecordManager(); });
addRecordButton.addEventListener("click", () => { if (settingsSeriesId) openEditor(settingsRecordType, null, settingsSeriesId); });
$$('[data-close-settings]').forEach((button) => button.addEventListener("click", closeSettings));
$$('[data-close-editor]').forEach((button) => button.addEventListener("click", closeEditor));
$$('[data-cancel-confirm]').forEach((button) => button.addEventListener("click", closeConfirm));
$$('[data-close-card-detail]').forEach((button) => button.addEventListener("click", closeCardDetail));
confirmActionButton.addEventListener("click", runConfirmedAction);
confirmBackupButton.addEventListener("click", () => { exportSettings(); confirmCopy.textContent = "백업 파일을 만들었어요. 보관한 뒤 초기화를 진행해주세요."; });
editorForm.addEventListener("submit", saveEditorItem);
exportSettingsButton.addEventListener("click", exportSettings);
importSettingsInput.addEventListener("change", importSettings);
$$('[data-add-item]').forEach((button) => button.addEventListener("click", () => openEditor(button.dataset.addItem)));
$$('[data-reset]').forEach((button) => button.addEventListener("click", () => requestReset(button.dataset.reset)));

settingsModal.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-item]");
  if (editButton) openEditor(editButton.dataset.editItem, editButton.dataset.itemId);
  const deleteButton = event.target.closest("[data-delete-item]");
  if (deleteButton) requestDelete(deleteButton.dataset.deleteItem, deleteButton.dataset.itemId);
  const editRecordButton = event.target.closest("[data-edit-record]");
  if (editRecordButton) openEditor(editRecordButton.dataset.editRecord, editRecordButton.dataset.itemId, editRecordButton.dataset.seriesId);
  const deleteRecordButton = event.target.closest("[data-delete-record]");
  if (deleteRecordButton) requestDelete(deleteRecordButton.dataset.deleteRecord, deleteRecordButton.dataset.itemId, deleteRecordButton.dataset.seriesId);
});

document.addEventListener("keydown", (event) => {
  const editing = event.target.closest?.("input, textarea, select, [contenteditable='true']");
  if (event.key === "ArrowLeft" && !editing && settingsModal.hidden && resultModal.hidden && cardDetailModal.hidden) changeSpread(-1);
  if (event.key === "ArrowRight" && !editing && settingsModal.hidden && resultModal.hidden && cardDetailModal.hidden) changeSpread(1);
  if (event.key !== "Escape") return;
  if (!confirmModal.hidden) closeConfirm();
  else if (!editorModal.hidden) closeEditor();
  else if (!cardDetailModal.hidden) closeCardDetail();
  else if (!settingsModal.hidden) closeSettings();
  else if (!resultModal.hidden) closeResult();
});

setToday();
refreshAll({ preserveSpreads: false });
