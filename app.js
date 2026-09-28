(() => {
  "use strict";

  const SAVE_KEY = "pixely-lost-sky-v1";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const characters = [
    { id:"rader", name:"라더", role:"미수반 멤버", initial:"라", color:"#bb5e68",
      lines:{
        default:["경위가 말도 없이 자리를 비울 사람은 아닌데.", "책상 쪽은 아직 그대로야. 건드리기 전에 잘 살펴봐."],
        notebook:["이 수첩, 경위가 늘 가지고 다니던 거야. 그런데 마지막 장이 이상하네."],
        clue:["세계가 여러 개라고? ...농담으로 넘기기엔 흔적이 너무 선명한데."]
      }},
    { id:"deokgae", name:"덕개", role:"미수반 멤버", initial:"덕", color:"#d99142",
      lines:{
        default:["나도 아침부터 못 봤어. 진짜야.", "왜 그렇게 쳐다봐? 설마 나부터 의심하는 거야?"],
        notebook:["수첩 뒤집어 봤어? ...아, 별거 없네. 괜히 기대했잖아."],
        clue:["잠깐, 이 문양은 어디선가 본 것 같은데... 아니, 과자 포장이었나?"]
      }},
    { id:"gakbyeol", name:"각별", role:"미수반 멤버", initial:"각", color:"#8177c9",
      lines:{
        default:["사람 한 명이 사라졌는데 기록까지 동시에 비었다면, 우연은 아니겠지.", "경위 자리 주변에 평소 없던 물건이 있는지 찾아봐."],
        notebook:["이 표시를 봐. 같은 문양이 페이지마다 반복돼. 좌표처럼 보이는데."],
        clue:["이건 장소 하나를 가리키는 게 아니야. 서로 다른 기록들이 겹친 흔적에 가까워."]
      }},
    { id:"gongryong", name:"공룡", role:"미수반 멤버", initial:"공", color:"#4fa66f",
      lines:{
        default:["경위님이 없어졌다고 내가 범인은 아니거든?!", "그래도 이상하긴 해. 어제까지만 해도 여기 있었는데."],
        notebook:["잠깐, 이 수첩 나한테 왜 보여줘? 혹시 여기 내 이름 적혀 있어?", "없다고? ...그럼 다행이고."],
        clue:["다른 세계의 경위님도 없다고? 그건 좀 무서운데."]
      }},
    { id:"suhyeon", name:"수현", role:"미수반 멤버", initial:"수", color:"#6f9ab8",
      lines:{
        default:["경위님 책상은 손댄 사람이 없어요. 마지막으로 본 건 어제 저녁이었고요.", "다른 기록도 확인해볼게요. 혹시 같은 일이 더 있었을지도 몰라요."],
        notebook:["수첩에 적힌 날짜가 오늘이 아니네요. 그런데 마지막 기록만 방금 쓴 것처럼 선명해요."],
        clue:["확인했어요. 이상한 건 경위님만이 아니에요. 다른 이야기의 '잠뜰' 기록도 전부 비어 있어요."]
      }}
  ];

  const capsuleCards = [
    { id:"memory-rader", name:"라더 · 조사 준비", rarity:"MEMORY", weight:18, symbol:"라", color:"#7b3f52", description:"사건이 시작되자 가장 먼저 상황을 정리한 기록." },
    { id:"memory-deokgae", name:"덕개 · 억울한 용의자", rarity:"MEMORY", weight:18, symbol:"덕", color:"#9a673b", description:"아무도 범인이라 하지 않았는데 먼저 억울해한 순간." },
    { id:"memory-gakbyeol", name:"각별 · 좌표 분석", rarity:"SKY", weight:12, symbol:"각", color:"#5f5aa0", description:"수첩 속 반복되는 문양을 가장 먼저 눈치챈 기록." },
    { id:"memory-gongryong", name:"공룡 · 일단 부정", rarity:"MEMORY", weight:18, symbol:"공", color:"#3f8059", description:"조사가 시작되자마자 범인이 아니라고 외친 기록." },
    { id:"memory-suhyeon", name:"수현 · 기록 확인", rarity:"SKY", weight:12, symbol:"수", color:"#537b9b", description:"다른 세계의 기록까지 확인해 사건의 크기를 알아낸 순간." },
    { id:"item-notebook", name:"잠뜰 경위의 수첩", rarity:"SKY", weight:10, symbol:"▤", color:"#356a91", description:"사라진 경위의 책상에서 발견된 낡은 수첩." },
    { id:"scene-empty-seat", name:"비어 있는 자리", rarity:"STAR", weight:6, symbol:"?", color:"#6e4778", description:"누군가 분명 있어야 할 자리. 그런데 모든 기록에서 그 사람만 없다." },
    { id:"scene-blue-mark", name:"푸른 문양", rarity:"STAR", weight:6, symbol:"✦", color:"#2e6f9c", description:"서로 다른 세계를 이어주는 듯한 낯선 문양." }
  ];

  const worlds = [
    { id:"mystery", name:"미스터리 수사반", status:"조사 중", symbol:"⌕", open:true },
    { id:"psychic", name:"초능력 연구소", status:"잠김", symbol:"✧" },
    { id:"blind", name:"블라인드", status:"잠김", symbol:"◐" },
    { id:"3days", name:"3 DAYS", status:"잠김", symbol:"Ⅲ" },
    { id:"labyrinth", name:"미궁", status:"잠김", symbol:"◇" },
    { id:"atlantis", name:"아뜰란티스", status:"잠김", symbol:"≈" }
  ];

  const defaultState = {
    dust: 150,
    shards: 0,
    clicks: 0,
    bestCombo: 0,
    combo: 0,
    lastClickAt: 0,
    clickPower: 1,
    owned: {},
    story: {
      started: false,
      completedPrologue: false,
      selectedCharacter: "suhyeon",
      inspectedDesk: false,
      items: [],
      clues: [],
      talked: {}
    }
  };

  function clone(value){ return JSON.parse(JSON.stringify(value)); }
  function load(){
    try{
      const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if(!parsed || typeof parsed !== "object") return clone(defaultState);
      return {
        ...clone(defaultState),
        ...parsed,
        owned: parsed.owned && typeof parsed.owned === "object" ? parsed.owned : {},
        story: { ...clone(defaultState.story), ...(parsed.story || {}) }
      };
    }catch{ return clone(defaultState); }
  }
  let state = load();
  let notebookTab = "items";
  let archiveTab = "memories";
  let toastTimer = null;

  function save(){
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    renderHud();
  }
  function renderHud(){
    $$("[data-dust]").forEach(el => el.textContent = state.dust.toLocaleString("ko-KR"));
    $$("[data-shards]").forEach(el => el.textContent = state.shards.toLocaleString("ko-KR"));
    $$("[data-clue-count]").forEach(el => el.textContent = state.story.clues.length);
    $$("[data-item-count]").forEach(el => el.textContent = state.story.items.length);
    const ownedCount = Object.keys(state.owned).filter(id => state.owned[id] > 0).length;
    $$("[data-owned-count]").forEach(el => el.textContent = ownedCount);
    $("#archive-total").textContent = capsuleCards.length;
    $("#total-clicks").textContent = state.clicks.toLocaleString("ko-KR");
    $("#best-combo").textContent = state.bestCombo;
    $("#click-power").textContent = state.clickPower;
    $("#star-gain").textContent = "+" + state.clickPower + " STAR DUST";
    const progress = storyProgress();
    $("#home-progress-bar").style.width = progress + "%";
    $("#home-progress-copy").textContent = progress + "%";
    $("#home-story-action").querySelector("b").textContent = state.story.started ? "조사 계속하기" : "첫 조사 시작";
    $("#home-story-action").querySelector("small").textContent = state.story.completedPrologue ? "프롤로그 완료 · 다음 세계 준비 중" : "미스터리 수사반 · 하늘 경찰청";
  }

  function storyProgress(){
    let score = 0;
    if(state.story.started) score += 20;
    if(state.story.inspectedDesk) score += 25;
    if(state.story.clues.includes("cross-world")) score += 35;
    if(state.story.completedPrologue) score = 100;
    return score;
  }

  function route(name){
    $$("[data-screen]").forEach(screen => {
      const active = screen.dataset.screen === name;
      screen.hidden = !active;
      screen.classList.toggle("is-active", active);
    });
    $$("[data-route]").forEach(button => button.classList.toggle("is-active", button.dataset.route === name && button.classList.contains("nav-item")));
    if(name === "story"){ state.story.started = true; save(); renderStory(); }
    if(name === "archive") renderArchive();
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function toast(message){
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove("is-visible"), 1900);
  }

  function addItem(id){
    if(state.story.items.includes(id)) return false;
    state.story.items.push(id);
    save();
    return true;
  }
  function addClue(id){
    if(state.story.clues.includes(id)) return false;
    state.story.clues.push(id);
    save();
    return true;
  }

  function selectedCharacter(){
    return characters.find(c => c.id === state.story.selectedCharacter) || characters[0];
  }

  function setDialogue(character, text){
    $("#speaker-avatar").textContent = character?.initial || "!";
    $("#speaker-avatar").style.setProperty("--avatar", character?.color || "#41668a");
    $("#speaker-name").textContent = character?.name || "수사 기록";
    $("#dialogue-text").textContent = text;
  }

  function characterLine(character, type){
    const list = character.lines[type] || character.lines.default;
    const count = Number(state.story.talked[character.id + ":" + type] || 0);
    state.story.talked[character.id + ":" + type] = count + 1;
    save();
    return list[count % list.length];
  }

  function renderCharacters(){
    $("#character-list").innerHTML = characters.map(c => `
      <button class="character-button ${c.id === state.story.selectedCharacter ? "is-active" : ""}" type="button" data-character="${c.id}">
        <span class="character-avatar" style="--avatar:${c.color}">${c.initial}</span>
        <span><b>${c.name}</b><small>${c.role}</small></span><i>›</i>
      </button>`).join("");
  }

  function renderStory(){
    renderCharacters();
    renderNotebook();
    const c = selectedCharacter();
    const choices = [];
    choices.push({id:"ask-last", label:"잠뜰을 마지막으로 본 때를 묻는다"});
    choices.push({id:"ask-weird", label:"최근 이상한 일이 있었는지 묻는다"});
    if(state.story.items.includes("notebook")) choices.push({id:"show-notebook", label:"「잠뜰 경위의 수첩」을 보여준다"});
    choices.push({id:"joke", label:"혹시 네가 범인인지 물어본다"});
    $("#choice-list").innerHTML = choices.map(ch => `<button class="choice-button" type="button" data-choice="${ch.id}"><span>${ch.label}</span><i>→</i></button>`).join("");

    if(state.story.completedPrologue){
      $("#story-objective").textContent = "프롤로그 조사 완료. 수첩의 좌표가 가리키는 첫 번째 세계를 확인할 준비가 되었습니다.";
      $("#finish-prologue").hidden = false;
    }else if(state.story.clues.includes("cross-world")){
      $("#story-objective").textContent = "수첩의 문양이 여러 세계의 기록과 연결되어 있다는 사실을 확인했다.";
      $("#finish-prologue").hidden = false;
    }else if(state.story.inspectedDesk){
      $("#story-objective").textContent = "발견한 수첩을 멤버들에게 보여주고, 문양에 대해 아는 사람이 있는지 확인하자.";
      $("#finish-prologue").hidden = true;
    }else{
      $("#story-objective").textContent = "사무실에 남은 사람들에게 말을 걸고 잠뜰 경위의 책상을 조사하자.";
      $("#finish-prologue").hidden = true;
    }
  }

  function renderNotebook(){
    $$(".notebook-tabs button").forEach(b => b.classList.toggle("is-active", b.dataset.notebook === notebookTab));
    const list = $("#notebook-list");
    const items = notebookTab === "items"
      ? state.story.items.map(id => id === "notebook" ? {type:"INVESTIGATION ITEM", title:"잠뜰 경위의 수첩", copy:"마지막 페이지에 반복되는 푸른 문양이 그려져 있다."} : null).filter(Boolean)
      : state.story.clues.map(id => id === "cross-world" ? {type:"CASE CLUE", title:"겹쳐진 세계의 흔적", copy:"수첩의 문양은 한 장소가 아니라 서로 다른 이야기의 기록을 가리킨다."} : null).filter(Boolean);
    if(!items.length){ list.innerHTML = '<p class="notebook-empty">아직 기록된 내용이 없어요.<br>조사와 대화를 진행해보세요.</p>'; return; }
    list.innerHTML = items.map(item => `<article class="note-item"><small>${item.type}</small><b>${item.title}</b><p>${item.copy}</p></article>`).join("");
  }

  function handleChoice(id){
    const c = selectedCharacter();
    if(id === "ask-last"){
      setDialogue(c, characterLine(c, "default"));
    }else if(id === "ask-weird"){
      const lines = {
        rader:"어제부터 경위 관련 전산 기록 일부가 비어 있어. 단순한 외출은 아닌 것 같아.",
        deokgae:"이상한 일? 네가 갑자기 날 범인처럼 보는 게 제일 이상한데?",
        gakbyeol:"기록이 사라진 순서가 이상해. 사람보다 이름이 먼저 지워진 느낌이야.",
        gongryong:"어제 경위님이 창밖을 계속 보긴 했어. 근데 그게 이상한 건가?",
        suhyeon:"다른 사건 자료도 확인 중이에요. 잠뜰이라는 이름만 검색 결과가 비는 자료가 있어요."
      };
      setDialogue(c, lines[c.id]);
    }else if(id === "show-notebook"){
      const line = characterLine(c, state.story.clues.includes("cross-world") ? "clue" : "notebook");
      setDialogue(c, line);
      if(c.id === "gakbyeol" || c.id === "suhyeon"){
        if(addClue("cross-world")){
          state.dust += 40;
          save();
          toast("새 단서 발견 · 겹쳐진 세계의 흔적 + 별가루 40");
        }
      }
    }else if(id === "joke"){
      const jokes = {
        rader:"증거부터 가져와. ...아니, 진짜로 날 의심한 건 아니지?",
        deokgae:"봐! 결국 나부터 의심했잖아! 내가 그럴 줄 알았어!",
        gakbyeol:"그 가능성을 검토하려면 최소한 근거가 하나는 필요하겠는데.",
        gongryong:"아니라고!! 내가 왜 경위님을 숨겨!",
        suhyeon:"수사 절차상 가능성은 열어두겠지만... 지금은 근거가 전혀 없어요."
      };
      setDialogue(c, jokes[c.id]);
      state.dust += 3; save(); toast("엉뚱한 질문 보너스 · 별가루 +3");
    }
    renderStory();
  }

  function inspectDesk(){
    state.story.inspectedDesk = true;
    const isNew = addItem("notebook");
    const narrator = {name:"수사 기록",initial:"⌕",color:"#355f82"};
    setDialogue(narrator, isNew
      ? "서랍 안쪽에서 낡은 수첩을 발견했다. 마지막 장에는 익숙하지 않은 푸른 문양이 여러 번 그려져 있다."
      : "책상은 이미 충분히 살펴봤다. 지금 중요한 건 발견한 수첩을 누군가에게 보여주는 일이다.");
    if(isNew){ state.dust += 25; save(); toast("조사 물건 획득 · 잠뜰 경위의 수첩 + 별가루 25"); }
    renderStory();
  }

  function finishPrologue(){
    if(!state.story.clues.includes("cross-world")){ toast("아직 확인해야 할 단서가 남아 있어요."); return; }
    state.story.completedPrologue = true;
    state.dust += 100;
    save();
    setDialogue({name:"수사 기록",initial:"✓",color:"#3c7b69"}, "프롤로그 조사 완료. 모든 세계에서 같은 이름이 사라지고 있다는 첫 번째 증거를 확보했다. 다음 목적지는 수첩의 좌표가 가리키는 세계다.");
    renderStory();
    toast("CASE 00 프롤로그 완료 · 별가루 +100");
  }

  function clickStar(event){
    const now = Date.now();
    state.combo = now - state.lastClickAt <= 900 ? state.combo + 1 : 1;
    state.lastClickAt = now;
    state.clicks += 1;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    let gain = state.clickPower;
    if(state.combo > 0 && state.combo % 20 === 0) gain += 10;
    state.dust += gain;
    save();
    $("#combo-pill").textContent = state.combo > 1 ? state.combo + " COMBO" : "READY";
    const zone = $(".click-zone");
    const btn = $("#star-button");
    const zr = zone.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const float = document.createElement("span");
    float.className = "click-float";
    float.textContent = "+" + gain;
    float.style.left = (br.left - zr.left + br.width / 2) + "px";
    float.style.top = (br.top - zr.top + br.height * .42) + "px";
    zone.appendChild(float);
    setTimeout(() => float.remove(), 800);
  }

  function weightedCard(){
    const total = capsuleCards.reduce((sum,c) => sum + c.weight, 0);
    let value = Math.random() * total;
    for(const card of capsuleCards){ value -= card.weight; if(value <= 0) return card; }
    return capsuleCards[capsuleCards.length - 1];
  }

  function drawCapsule(){
    const cost = 100;
    if(state.dust < cost){ $("#capsule-message").textContent = "별가루가 부족해요. CLICK이나 STORY에서 조금 더 모아주세요."; toast("별가루가 부족해요."); return; }
    state.dust -= cost;
    const card = weightedCard();
    const duplicate = !!state.owned[card.id];
    state.owned[card.id] = (state.owned[card.id] || 0) + 1;
    if(duplicate) state.shards += card.rarity === "STAR" ? 8 : card.rarity === "SKY" ? 5 : 3;
    save();
    $("#result-rarity").textContent = duplicate ? "DUPLICATE · " + card.rarity : "NEW MEMORY · " + card.rarity;
    $("#result-symbol").textContent = card.symbol;
    $("#result-symbol").style.background = "linear-gradient(145deg," + card.color + ",#132d4d)";
    $("#result-title").textContent = card.name;
    $("#result-copy").textContent = duplicate ? "이미 가진 기록이에요. 기억 조각으로 변환했습니다." : card.description;
    $("#result-modal").hidden = false;
    $("#capsule-message").textContent = duplicate ? "중복 기록이 기억 조각으로 변환됐어요." : "새 기록이 ARCHIVE에 추가됐어요.";
  }

  function renderArchive(){
    $$(".archive-tabs button").forEach(b => b.classList.toggle("is-active", b.dataset.archiveTab === archiveTab));
    const root = $("#archive-grid");
    if(archiveTab === "memories"){
      root.innerHTML = capsuleCards.map(card => {
        const owned = !!state.owned[card.id];
        return `<article class="archive-card ${owned ? "" : "is-locked"}">
          <div class="archive-card__art" style="--card:${owned ? card.color : "#223247"}">${owned ? card.symbol : "?"}</div>
          <small>${owned ? card.rarity : "LOCKED"}</small>
          <b>${owned ? card.name : "아직 발견하지 못한 기록"}</b>
          <p>${owned ? card.description : "기억 캡슐에서 발견할 수 있습니다."}</p>
        </article>`;
      }).join("");
    }else if(archiveTab === "case"){
      const entries = [];
      entries.push({open:state.story.items.includes("notebook"),symbol:"▤",label:"ITEM",title:"잠뜰 경위의 수첩",copy:"마지막 장에 정체불명의 푸른 문양이 반복된다.",color:"#356a91"});
      entries.push({open:state.story.clues.includes("cross-world"),symbol:"✦",label:"CLUE",title:"겹쳐진 세계의 흔적",copy:"문양은 여러 이야기의 기록을 동시에 가리키고 있다.",color:"#3a709e"});
      root.innerHTML = entries.map(e => `<article class="archive-card ${e.open ? "" : "is-locked"}">
        <div class="archive-card__art" style="--card:${e.open ? e.color : "#223247"}">${e.open ? e.symbol : "?"}</div>
        <small>${e.open ? e.label : "LOCKED"}</small><b>${e.open ? e.title : "미확인 사건 기록"}</b><p>${e.open ? e.copy : "스토리를 조사하면 기록됩니다."}</p>
      </article>`).join("");
    }else{
      root.innerHTML = worlds.map(world => `<article class="archive-card world-card ${world.open ? "" : "is-locked"}">
        <div class="archive-card__art" style="--card:${world.open ? "#315f86" : "#223247"}">${world.symbol}</div>
        <small>${world.open ? "WORLD FILE" : "LOCKED"}</small><b>${world.name}</b><p>${world.status}</p>
      </article>`).join("");
    }
  }

  function bind(){
    $$("[data-route]").forEach(button => button.addEventListener("click", () => route(button.dataset.route)));
    $("#home-story-action").addEventListener("click", () => route("story"));
    $("#character-list").addEventListener("click", event => {
      const btn = event.target.closest("[data-character]");
      if(!btn) return;
      state.story.selectedCharacter = btn.dataset.character;
      save(); renderStory();
      const c = selectedCharacter();
      setDialogue(c, characterLine(c, "default"));
    });
    $("#choice-list").addEventListener("click", event => {
      const btn = event.target.closest("[data-choice]");
      if(btn) handleChoice(btn.dataset.choice);
    });
    $("#inspect-desk").addEventListener("click", inspectDesk);
    $("#finish-prologue").addEventListener("click", finishPrologue);
    $$(".notebook-tabs button").forEach(button => button.addEventListener("click", () => { notebookTab = button.dataset.notebook; renderNotebook(); }));
    $("#star-button").addEventListener("click", clickStar);
    $("#draw-button").addEventListener("click", drawCapsule);
    $$(".archive-tabs button").forEach(button => button.addEventListener("click", () => { archiveTab = button.dataset.archiveTab; renderArchive(); }));
    $$("[data-close-modal]").forEach(button => button.addEventListener("click", () => { $("#result-modal").hidden = true; renderArchive(); }));
    document.addEventListener("keydown", event => {
      if(event.key === "Escape" && !$("#result-modal").hidden) $("#result-modal").hidden = true;
    });
  }

  function boot(){
    renderHud();
    renderStory();
    renderArchive();
    bind();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, {once:true});
  else boot();
})();
