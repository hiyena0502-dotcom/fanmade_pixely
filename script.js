const intro = document.querySelector("#intro");
const diaryApp = document.querySelector("#diary-app");
const diaryBook = document.querySelector("#diary-book");
const enterButton = document.querySelector("#enter-button");
const backToSkyButton = document.querySelector("#back-to-sky");
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const seriesButtons = [...document.querySelectorAll("[data-series]")];
const seriesViews = [...document.querySelectorAll("[data-series-view]")];
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
const saveKey = "pixely-diary-save-v1";

const cards = [
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
  { id: "rainbow-memory", name: "무지개 기억", symbol: "✧", rarity: "RAINBOW", color: "linear-gradient(145deg,#7dbce7,#9acb9a,#f1cd68,#e48b98,#a08bd0)", weight: 0.7 },
];

let save = loadSave();
let drawing = false;
let lastFocusedElement = null;

function loadSave() {
  try {
    const stored = JSON.parse(localStorage.getItem(saveKey));
    return {
      owned: stored?.owned && typeof stored.owned === "object" ? stored.owned : {},
      dust: Number.isFinite(stored?.dust) ? stored.dust : 0,
    };
  } catch {
    return { owned: {}, dust: 0 };
  }
}

function persistSave() {
  localStorage.setItem(saveKey, JSON.stringify(save));
}

function enterDiary() {
  intro.classList.add("is-leaving");
  window.setTimeout(() => {
    intro.hidden = true;
    diaryApp.classList.add("is-visible");
    diaryApp.setAttribute("aria-hidden", "false");
    document.body.classList.add("diary-open");
    document.querySelector(".brand")?.focus({ preventScroll: true });
  }, 480);
}

function returnToSky() {
  diaryApp.classList.remove("is-visible");
  diaryApp.setAttribute("aria-hidden", "true");
  document.body.classList.remove("diary-open");
  intro.hidden = false;
  requestAnimationFrame(() => {
    intro.classList.remove("is-leaving");
    enterButton.focus({ preventScroll: true });
  });
}

function openTab(tabName) {
  const target = panels.find((panel) => panel.dataset.panel === tabName);
  if (!target) return;

  tabs.forEach((tab) => {
    const active = tab.dataset.tab === tabName;
    tab.classList.toggle("is-active", active);
    active ? tab.setAttribute("aria-current", "page") : tab.removeAttribute("aria-current");
  });

  panels.forEach((panel) => {
    const active = panel === target;
    panel.hidden = !active;
    panel.classList.toggle("is-active", active);
  });

  diaryBook.querySelectorAll(".diary-panel").forEach((panel) => panel.classList.remove("is-turning"));
  target.classList.add("is-turning");
  window.setTimeout(() => target.classList.remove("is-turning"), 380);

  if (tabName === "collection") renderCollection();
  if (window.innerWidth <= 720) diaryBook.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectSeries(seriesName) {
  seriesButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.series === seriesName));
  seriesViews.forEach((view) => {
    const active = view.dataset.seriesView === seriesName;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
}

function pickCard() {
  const total = cards.reduce((sum, card) => sum + card.weight, 0);
  let value = Math.random() * total;
  for (const card of cards) {
    value -= card.weight;
    if (value <= 0) return card;
  }
  return cards[0];
}

function cardMarkup(card, { locked = false, count = 0 } = {}) {
  if (locked) {
    return `
      <div class="collection-card is-locked" style="--tilt: 0deg">
        <div class="collection-card__inner">
          <span class="collection-card__rarity">${card.rarity}</span>
          <span class="collection-card__symbol">?</span>
          <span class="collection-card__name">아직 만나지 못한 기록</span>
          <span class="collection-card__number">NO.${String(cards.indexOf(card) + 1).padStart(2, "0")}</span>
        </div>
      </div>`;
  }

  const isRainbow = card.rarity === "RAINBOW";
  return `
    <div class="collection-card ${isRainbow ? "is-rainbow" : ""}" style="--tilt: ${(cards.indexOf(card) % 3 - 1) * 0.7}deg">
      ${count > 1 ? `<span class="collection-card__count">×${count}</span>` : ""}
      <div class="collection-card__inner" style="--card-color: ${card.color}; background: ${card.color}">
        <span class="collection-card__rarity">${card.rarity}</span>
        <span class="collection-card__symbol">${card.symbol}</span>
        <span class="collection-card__name">${card.name}</span>
        <span class="collection-card__number">NO.${String(cards.indexOf(card) + 1).padStart(2, "0")}</span>
      </div>
    </div>`;
}

function drawCard() {
  if (drawing) return;
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
  resultKicker.textContent = duplicate ? "WELCOME BACK!" : "NEW MEMORY!";
  resultTitle.textContent = duplicate ? "반가운 카드를 다시 만났어요!" : "새로운 카드를 만났어요!";
  resultCopy.textContent = duplicate ? "중복 카드와 함께 별가루 10개를 받았어요." : "컬렉션에 소중히 보관했어요.";
  resultCard.innerHTML = cardMarkup(card);
  const cardElement = resultCard.firstElementChild;
  if (cardElement) {
    cardElement.classList.add("result-card__display");
    while (cardElement.firstChild) resultCard.appendChild(cardElement.firstChild);
    cardElement.remove();
  }
  resultModal.hidden = false;
  document.body.style.overflow = "hidden";
  drawAgainButton.focus();
}

function closeResult() {
  resultModal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

function renderCollection() {
  collectionGrid.innerHTML = cards
    .map((card) => {
      const count = save.owned[card.id] || 0;
      return cardMarkup(card, { locked: count === 0, count });
    })
    .join("");
}

function updateStats() {
  const ownedCount = Object.keys(save.owned).filter((id) => save.owned[id] > 0).length;
  document.querySelectorAll("[data-owned-count]").forEach((element) => {
    element.textContent = ownedCount;
  });
  document.querySelectorAll("[data-dust-count]").forEach((element) => {
    element.textContent = save.dust;
  });
}

function setToday() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  document.querySelector("#today-date").textContent = `${month}.${day}`;
}

enterButton.addEventListener("click", enterDiary);
backToSkyButton.addEventListener("click", returnToSky);
document.querySelectorAll("[data-go-home]").forEach((button) => button.addEventListener("click", () => openTab("home")));
tabs.forEach((tab) => tab.addEventListener("click", () => openTab(tab.dataset.tab)));
document.querySelectorAll("[data-open-tab]").forEach((button) => button.addEventListener("click", () => openTab(button.dataset.openTab)));
seriesButtons.forEach((button) => button.addEventListener("click", () => selectSeries(button.dataset.series)));
drawButton.addEventListener("click", drawCard);
drawAgainButton.addEventListener("click", () => {
  closeResult();
  drawCard();
});
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeResult));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !resultModal.hidden) closeResult();
  if (event.key === "Enter" && !intro.hidden && document.activeElement === document.body) enterDiary();
});

setToday();
updateStats();
renderCollection();
