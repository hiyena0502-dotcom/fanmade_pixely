(() => {
  "use strict";

  const STORAGE_KEY = "pixely-lost-sky-saves-v2";
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];

  const catalogue = {
    cards: [
      {id:"dreamer",symbol:"YOU",name:"꿈뜰이",type:"PLAYER",color:"#5d87a8",desc:"잠뜰님의 생일을 축하하기 위해 여행을 시작한 플레이어.",memo:"생일 축하하러 왔을 뿐인데 일이 커졌다."},
      {id:"jamtteul",symbol:"잠",name:"잠뜰",type:"PERSON",color:"#4f86b3",desc:"이번 여행에서 가장 먼저 찾아야 하는 사람.",memo:"생일의 주인공은 대체 어디에 있는 걸까?"},
      {id:"rader",symbol:"라",name:"라더",type:"PERSON",color:"#8d5c68",desc:"생일 준비를 함께하는 멤버.",memo:"장식 쪽은 믿고 맡겨도 될 것 같다."},
      {id:"deokgae",symbol:"덕",name:"덕개",type:"PERSON",color:"#9b744d",desc:"생일 준비를 함께하는 멤버.",memo:"케이크는 무사히 지킬 수 있겠지?"},
      {id:"gakbyeol",symbol:"각",name:"각별",type:"PERSON",color:"#6e659c",desc:"생일 준비를 함께하는 멤버. 기계나 장치를 만지면 일이 생기곤 한다.",memo:"고친다고 했지 포탈을 열겠다고 하진 않았는데."},
      {id:"gongryong",symbol:"공",name:"공룡",type:"PERSON",color:"#4f7f61",desc:"생일 준비를 함께하는 멤버.",memo:"폭죽 위치부터 기억해 줬으면 좋겠다."},
      {id:"suhyeon",symbol:"수",name:"수현",type:"PERSON",color:"#607e98",desc:"생일 준비를 함께하는 멤버.",memo:"풍선 준비는 생각보다 손이 많이 간다."},
      {id:"philip",symbol:"필",name:"필립",type:"FAIRY",color:"#6d91a8",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"뭔가 발견하면 일단 들고 오는 편인 것 같다."},
      {id:"woojae",symbol:"우",name:"우재",type:"FAIRY",color:"#7997a3",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"이번 발견은 정말 평범하지 않았다."},
      {id:"ttoni",symbol:"또",name:"또니",type:"FAIRY",color:"#8c83a6",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"말보다 표정이 먼저 수상함을 알려준다."},
      {id:"titi",symbol:"티",name:"티티",type:"FAIRY",color:"#9a7f95",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"이상한 건 이상하다고 바로 말해주는 편."},
      {id:"isin",symbol:"이",name:"이신",type:"FAIRY",color:"#687f9d",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"장치를 가까이서 본 사람 중 하나."},
      {id:"hayul",symbol:"하",name:"하율",type:"FAIRY",color:"#77998d",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"아침부터 꽤 큰 사건을 만났다."},
      {id:"yukto",symbol:"육",name:"육토",type:"FAIRY",color:"#8e856e",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"발견물보다 주변 반응이 더 재미있어 보인다."},
      {id:"hoodie",symbol:"후",name:"후디",type:"FAIRY",color:"#657a8b",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"포탈이 열릴 줄은 아무도 몰랐다."},
      {id:"fritz",symbol:"프",name:"프리츠",type:"FAIRY",color:"#8a7894",desc:"이상한 물건을 발견한 요정 중 한 명.",memo:"이상한 아침의 목격자가 되었다."},
      {id:"pigeon",symbol:"◎",name:"수상한 비둘기",type:"CREATURE",color:"#7f8991",desc:"절대 눈을 마주치고 싶지 않은 비둘기.",memo:"왜 카드까지 생긴 거지?"}
    ],
    items: [
      {id:"portal-device",symbol:"◇",name:"정체불명의 장치",type:"KEY ITEM",color:"#537a9a",desc:"요정들이 발견한 이상한 장치. 고친 뒤에는 포탈을 만들어낸다."},
      {id:"plush",symbol:"✦",name:"치명적으로 귀여운 봉제인형",type:"MEMENTO",color:"#9c8295",desc:"창고 어딘가에서 발견한 작은 봉제인형. 특별한 쓰임은 없어 보인다."},
      {id:"plant-seed",symbol:"❧",name:"이상한 씨앗",type:"MEMENTO",color:"#698b72",desc:"원하는 모습으로 자랄 것만 같은 수상한 씨앗."},
      {id:"pigeon-feather",symbol:"〆",name:"비둘기 깃털",type:"MEMENTO",color:"#7a858f",desc:"싸운 적도 없는데 전리품처럼 손에 들어왔다."},
      {id:"ticket-scrap",symbol:"券",name:"놀이공원 티켓 조각",type:"MEMENTO",color:"#9a745d",desc:"오래된 게임쇼의 흔적처럼 보이는 낡은 티켓 조각."},
      {id:"gold-button",symbol:"▣",name:"골드버튼 미니어처",type:"MEMENTO",color:"#a68b57",desc:"어딘가 익숙한 금빛 기념품. 반짝임은 아직 선명하다."},
      {id:"unknown-piece",symbol:"?",name:"의미를 알 수 없는 물건",type:"UNKNOWN",color:"#6b7191",desc:"여행 중 우연히 발견한 정체불명의 조각."},
      {id:"birthday-gift",symbol:"□",name:"생일 선물",type:"GIFT",color:"#9a7c5a",desc:"누군가가 잠뜰님께 전해달라며 건넨 선물."},
      {id:"letter",symbol:"✉",name:"축하 편지",type:"GIFT",color:"#73849b",desc:"여행 중 손에 들어온 축하 메시지."}
    ],
    postcards: [
      {id:"birthday-prep",symbol:"✦",name:"생일 준비 완료!",type:"CHAPTER POSTCARD",color:"#9a7c67",desc:"밤늦게까지 모두와 함께 생일 파티 준비를 마무리한 순간.",caption:"내일이면 잠뜰님도 좋아하시겠지?"},
      {id:"morning-guests",symbol:"☀",name:"생일날의 손님들",type:"EVENT POSTCARD",color:"#7894a5",desc:"아침부터 여기저기 돌아다니며 만난 반가운 얼굴들.",caption:"정작 생일의 주인공만 보이지 않는다."},
      {id:"pigeon-stare",symbol:"!",name:"눈을 마주치지 마시오",type:"SECRET POSTCARD",color:"#777d84",desc:"굳이 끝까지 비둘기를 건드린 사람만 남길 수 있는 한 장.",caption:"다시는 눈을 마주치지 말자."},
      {id:"first-portal",symbol:"◇",name:"처음 열린 문",type:"STORY POSTCARD",color:"#596f91",desc:"고쳐진 장치가 처음으로 낯선 세계의 문을 열어젖힌 순간.",caption:"이 문 너머에 잠뜰님이 있을까?"}
    ]
  };

  const chapters = [
    {id:"prologue",no:"00",title:"생일의 주인공",label:"PROLOGUE",desc:"생일 파티를 준비하던 날, 정작 잠뜰님이 보이지 않는다."},
    {id:"portal",no:"01",title:"처음 열린 문",label:"CHAPTER 01",desc:"요정들이 발견한 장치를 각별이 작동시키며 여행이 시작된다."},
    {id:"mystery",no:"02",title:"첫 번째 상황극",label:"CHAPTER 02",desc:"처음 도착한 이야기의 세계에서 그곳의 잠뜰을 찾아본다."},
    {id:"journey",no:"03",title:"이어지는 이야기들",label:"CHAPTER 03",desc:"여러 상황극과 짧은 세계를 돌아다니며 사람과 물건을 만난다."},
    {id:"maze",no:"04",title:"모인 것들의 의미",label:"CHAPTER 04",desc:"그동안 의미를 몰랐던 물건들이 하나의 장소를 가리키기 시작한다."},
    {id:"birthday",no:"05",title:"푸른 하늘",label:"FINAL",desc:"현실의 잠뜰님을 데려와 모두가 함께 생일을 축하한다."}
  ];

  function freshRoot(){ return {activeSlot:null,slots:[null,null,null]}; }

  function normalizeSave(save){
    if(!save) return null;
    return {
      ...save,
      completedGame:Boolean(save.completedGame),
      unlockedChapters:Array.isArray(save.unlockedChapters) ? save.unlockedChapters : ["prologue"],
      completedChapters:Array.isArray(save.completedChapters) ? save.completedChapters : [],
      collection:{
        cards:Array.isArray(save.collection?.cards)
          ? save.collection.cards
          : Array.isArray(save.collection?.characters)
            ? save.collection.characters
            : ["dreamer"],
        items:Array.isArray(save.collection?.items) ? save.collection.items : [],
        postcards:Array.isArray(save.collection?.postcards) ? save.collection.postcards : []
      }
    };
  }

  function readRoot(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      if(!parsed||!Array.isArray(parsed.slots)) return freshRoot();
      return {
        activeSlot:Number.isInteger(parsed.activeSlot)?parsed.activeSlot:null,
        slots:[0,1,2].map(i=>normalizeSave(parsed.slots[i]))
      };
    }catch{
      return freshRoot();
    }
  }

  let root=readRoot();
  let collectionTab="cards";
  let saveMode="manage";
  let toastTimer=null;
  let siteVersion=null;
  let siteFingerprint=null;
  let dismissedUpdate=null;
  let pendingUpdateKey=null;
  let updateCheckTimer=null;

  function persist(){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(root));
    renderHome();
  }

  function nowLabel(){
    return new Intl.DateTimeFormat("ko-KR",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date());
  }

  function newSave(){
    return {
      createdAt:Date.now(),
      savedAt:Date.now(),
      savedLabel:nowLabel(),
      playSeconds:0,
      progress:0,
      chapter:"프롤로그",
      location:"생일 파티 준비 장소",
      completedGame:false,
      unlockedChapters:["prologue"],
      completedChapters:[],
      collection:{cards:["dreamer"],items:[],postcards:[]}
    };
  }

  function activeSave(){
    return Number.isInteger(root.activeSlot) ? root.slots[root.activeSlot] : null;
  }

  function mostRecentSlot(){
    let best=null;
    root.slots.forEach((slot,i)=>{
      if(!slot) return;
      if(best===null || slot.savedAt > root.slots[best].savedAt) best=i;
    });
    return best;
  }

  function formatPlaytime(seconds){
    const total=Math.max(0,Number(seconds)||0);
    const h=Math.floor(total/3600);
    const m=Math.floor((total%3600)/60);
    if(h>0) return String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");
    return String(m).padStart(2,"0")+":"+String(total%60).padStart(2,"0");
  }

  function renderHome(){
    const recent=mostRecentSlot();
    const save=activeSave();

    const continueBtn=$("#continue-button");
    continueBtn.classList.toggle("is-disabled",recent===null);
    continueBtn.setAttribute("aria-disabled",recent===null?"true":"false");
    $("#continue-subtitle").textContent=recent===null
      ? "저장된 이야기가 없습니다"
      : "SLOT "+(recent+1)+" · "+root.slots[recent].chapter;

    const quickSaveBtn=$("#quick-save-button");
    quickSaveBtn.classList.toggle("is-disabled",!save);
    quickSaveBtn.setAttribute("aria-disabled",save?"false":"true");
    $("#quick-save-subtitle").textContent=save
      ? "SLOT "+(root.activeSlot+1)+"에 현재 진행 저장"
      : "먼저 새 이야기를 시작하세요";

    $(".title-view").classList.toggle("is-cleared",Boolean(save?.completedGame));

    if(!save){
      $("#current-slot-label").textContent="NO DATA";
      $("#summary-progress-bar").style.width="0%";
      $("#summary-progress-text").textContent="0%";
      $("#summary-location").textContent="―";
      $("#summary-playtime").textContent="00:00";
      $("#summary-saved-at").textContent="―";
      return;
    }

    $("#current-slot-label").textContent="SLOT "+(root.activeSlot+1)+" · "+save.chapter;
    $("#summary-progress-bar").style.width=save.progress+"%";
    $("#summary-progress-text").textContent=save.progress+"%";
    $("#summary-location").textContent=save.location;
    $("#summary-playtime").textContent=formatPlaytime(save.playSeconds);
    $("#summary-saved-at").textContent=save.savedLabel||"―";
  }

  function showView(name){
    $$("[data-view]").forEach(view=>{
      const active=view.dataset.view===name;
      view.hidden=!active;
      view.classList.toggle("is-active",active);
    });
    if(name==="collection") renderCollection();
    if(name==="chapters") renderChapters();
    window.scrollTo(0,0);
  }

  function openSaveModal(mode="manage"){
    saveMode=mode;
    $("#save-modal-title").textContent=mode==="new"?"새 이야기":mode==="save"?"현재 이야기 저장":"저장 관리";
    $("#save-modal-guide").textContent=mode==="new"
      ? "새 이야기를 시작할 슬롯을 선택하세요. 이미 데이터가 있으면 덮어씁니다."
      : mode==="save"
        ? "현재 진행 상황을 저장할 슬롯을 선택하세요."
        : "세이브 데이터를 불러오거나 삭제할 수 있습니다.";
    renderSaveSlots();
    $("#save-modal").hidden=false;
  }

  function closeSaveModal(){
    $("#save-modal").hidden=true;
  }

  function renderSaveSlots(){
    $("#save-slot-list").innerHTML=root.slots.map((slot,index)=>{
      const active=root.activeSlot===index;
      const copy=slot
        ? `<b>${slot.chapter} · ${slot.progress}%</b><small>${slot.location} · ${formatPlaytime(slot.playSeconds)} · ${slot.savedLabel||"저장됨"}</small>`
        : `<b>빈 슬롯</b><small>저장 데이터가 없습니다.</small>`;

      let actions="";
      if(saveMode==="new"){
        actions=`<button type="button" data-new-slot="${index}">${slot?"덮어쓰기":"시작"}</button>`;
      }else if(saveMode==="save"){
        actions=`<button type="button" data-save-slot="${index}">저장</button>`;
      }else{
        actions=`<button type="button" data-load-slot="${index}" ${slot?"":"disabled"}>불러오기</button><button class="danger" type="button" data-delete-slot="${index}" ${slot?"":"disabled"}>삭제</button>`;
      }

      return `<article class="save-slot ${active?"is-active":""}">
        <div class="slot-number">SLOT<br>${index+1}</div>
        <div class="slot-copy">${copy}</div>
        <div class="slot-actions">${actions}</div>
      </article>`;
    }).join("");
  }

  function startNewGame(index){
    if(root.slots[index] && !window.confirm("SLOT "+(index+1)+"의 기존 데이터를 덮어쓸까요?")) return;
    root.slots[index]=newSave();
    root.activeSlot=index;
    persist();
    closeSaveModal();
    showStoryNotice("새 이야기를 시작했습니다.","프롤로그 세이브를 만들었습니다.\n다음 작업에서 실제 포인트앤클릭 장면을 이곳에 연결합니다.");
  }

  function loadSlot(index){
    if(!root.slots[index]) return;
    root.activeSlot=index;
    persist();
    closeSaveModal();
    toast("SLOT "+(index+1)+"을 불러왔습니다.");
  }

  function saveToSlot(index){
    const copied=JSON.parse(JSON.stringify(activeSave()||newSave()));
    copied.savedAt=Date.now();
    copied.savedLabel=nowLabel();
    root.slots[index]=copied;
    root.activeSlot=index;
    persist();
    closeSaveModal();
    toast("SLOT "+(index+1)+"에 저장했습니다.");
  }

  function deleteSlot(index){
    if(!root.slots[index]) return;
    if(!window.confirm("SLOT "+(index+1)+"의 저장 데이터를 삭제할까요?")) return;
    root.slots[index]=null;
    if(root.activeSlot===index) root.activeSlot=null;
    persist();
    renderSaveSlots();
    toast("저장 데이터를 삭제했습니다.");
  }

  function continueStory(){
    const recent=mostRecentSlot();
    if(recent===null){
      toast("저장된 이야기가 없습니다.");
      return;
    }
    root.activeSlot=recent;
    persist();
    const save=root.slots[recent];
    showStoryNotice(
      "이야기 이어하기",
      "SLOT "+(recent+1)+" · "+save.chapter+"\n현재 위치: "+save.location+"\n\nHOME 시스템을 먼저 제작하는 단계라 실제 포인트앤클릭 스토리는 다음 작업에서 이곳에 연결됩니다."
    );
  }

  function showStoryNotice(title,copy){
    $("#notice-title").textContent=title;
    $("#notice-copy").textContent=copy;
    $("#notice-modal").hidden=false;
  }

  function collectionOwnedSet(){
    const save=activeSave();
    if(!save) return new Set();
    return new Set(save.collection?.[collectionTab]||[]);
  }

  function renderCollection(){
    const items=catalogue[collectionTab]||[];
    const owned=collectionOwnedSet();
    const labels={
      cards:["CARD FILE","만난 카드","여행 중 직접 만난 인물과 생물이 카드로 기록됩니다."],
      items:["ITEM SCRAP","손에 넣은 아이템","주운 물건과 받은 기념품을 스크랩처럼 한 장씩 남겨둡니다."],
      postcards:["POSTCARD ALBUM","모아둔 엽서","챕터의 끝이나 특별한 이벤트에서 남은 순간을 엽서로 보관합니다."]
    };

    $("#collection-eyebrow").textContent=labels[collectionTab][0];
    $("#collection-heading").textContent=labels[collectionTab][1];
    $("#collection-description").textContent=labels[collectionTab][2];
    $(".diary-tabs button").forEach(b=>{
      const active=b.dataset.collectionTab===collectionTab;
      b.classList.toggle("is-active",active);
      b.setAttribute("aria-selected",active?"true":"false");
    });
    $("#collection-owned").textContent=owned.size;
    $("#collection-total").textContent=items.length;

    const grid=$("#collection-grid");
    grid.className="collection-grid collection-grid--"+collectionTab;

    grid.innerHTML=items.map(item=>{
      const open=owned.has(item.id);

      if(collectionTab==="postcards"){
        return `<article class="collection-card collection-card--postcard ${open?"":"is-locked"}">
          <div class="postcard-art" style="--card:${open?item.color:"#b9b0a5"}">
            <span class="postcard-stamp">${open?"POST":"LOCKED"}</span>
            <strong>${open?item.symbol:"?"}</strong>
            <i aria-hidden="true"></i>
          </div>
          <div class="postcard-copy">
            <small>${open?item.type:"POSTCARD"}</small>
            <b>${open?item.name:"아직 남기지 못한 순간"}</b>
            <p>${open?item.desc:"특별한 장면을 만나면 이 자리에 엽서가 꽂힙니다."}</p>
            ${open&&item.caption?`<blockquote>${item.caption}</blockquote>`:""}
          </div>
        </article>`;
      }

      return `<article class="collection-card collection-card--${collectionTab==="cards"?"card":"item"} ${open?"":"is-locked"}">
        <div class="card-art" style="--card:${open?item.color:"#b9b0a5"}">
          <span class="card-symbol">${open?item.symbol:"?"}</span>
          <span class="card-kind">${open?item.type:"LOCKED"}</span>
        </div>
        <small>${open?item.type:"LOCKED"}</small>
        <b>${open?item.name:"아직 기록되지 않았습니다"}</b>
        <p>${open?item.desc:"여행을 진행하고 주변을 조사하면 이 페이지가 채워집니다."}</p>
        ${collectionTab==="cards"&&open&&item.memo?`<p class="card-memo"><span>꿈뜰이 메모</span>${item.memo}</p>`:""}
      </article>`;
    }).join("");
  }

  function renderChapters(){
    const save=activeSave();
    const unlocked=new Set(save?.unlockedChapters||[]);
    const completed=new Set(save?.completedChapters||[]);

    $("#chapters-progress").textContent=(save?.progress||0)+"%";

    $("#chapter-list").innerHTML=chapters.map(ch=>{
      const isComplete=completed.has(ch.id) || (ch.id==="birthday" && save?.completedGame);
      const isOpen=isComplete || unlocked.has(ch.id);
      const cls=isComplete?"is-complete":isOpen?"is-open":"is-locked";
      const status=isComplete?"COMPLETE":isOpen?"OPEN":"LOCKED";

      return `<article class="chapter-card ${cls}">
        <div class="chapter-number">${ch.no}</div>
        <div class="chapter-copy">
          <small>${isOpen?ch.label:"UNKNOWN"}</small>
          <b>${isOpen?ch.title:"아직 열리지 않은 이야기"}</b>
          <p>${isOpen?ch.desc:"이야기를 진행하면 새로운 챕터가 열립니다."}</p>
        </div>
        <span class="chapter-status">${status}</span>
      </article>`;
    }).join("");
  }


  async function fetchTextNoCache(path){
    const url=new URL(path,document.baseURI);
    url.searchParams.set("_update_check",Date.now().toString());
    const response=await fetch(url.toString(),{cache:"no-store"});
    if(!response.ok) throw new Error("update-check failed");
    return response.text();
  }

  async function hashText(text){
    if(window.crypto?.subtle){
      const data=new TextEncoder().encode(text);
      const digest=await crypto.subtle.digest("SHA-256",data);
      return [...new Uint8Array(digest)].map(v=>v.toString(16).padStart(2,"0")).join("");
    }
    let hash=2166136261;
    for(let i=0;i<text.length;i++){
      hash^=text.charCodeAt(i);
      hash=Math.imul(hash,16777619);
    }
    return (hash>>>0).toString(16);
  }

  async function getSiteFingerprint(){
    const files=await Promise.all([
      fetchTextNoCache("./index.html"),
      fetchTextNoCache("./style.css"),
      fetchTextNoCache("./app.js")
    ]);
    return hashText(files.join("\n/* file-boundary */\n"));
  }

  async function getPublishedVersion(){
    try{
      const raw=await fetchTextNoCache("./site-version.json");
      const parsed=JSON.parse(raw);
      return String(parsed.version||"").trim()||null;
    }catch{
      return null;
    }
  }

  function showUpdatePrompt(versionKey){
    if(!versionKey || dismissedUpdate===versionKey) return;
    const modal=$("#update-modal");
    if(!modal || !modal.hidden) return;
    pendingUpdateKey=versionKey;
    modal.hidden=false;
  }

  function hideUpdatePrompt(){
    const modal=$("#update-modal");
    if(modal) modal.hidden=true;
  }

  async function checkForSiteUpdate({initial=false}={}){
    try{
      const [version,fingerprint]=await Promise.all([
        getPublishedVersion(),
        getSiteFingerprint()
      ]);

      if(initial || (siteVersion===null && siteFingerprint===null)){
        siteVersion=version;
        siteFingerprint=fingerprint;
        return;
      }

      const versionChanged=Boolean(version && siteVersion && version!==siteVersion);
      const fingerprintChanged=Boolean(fingerprint && siteFingerprint && fingerprint!==siteFingerprint);

      if(versionChanged || fingerprintChanged){
        const key=version||fingerprint;
        showUpdatePrompt(key);
      }
    }catch{
      // 네트워크가 잠시 끊긴 경우에는 조용히 다음 확인을 기다립니다.
    }
  }

  function startUpdateWatcher(){
    checkForSiteUpdate({initial:true});
    updateCheckTimer=setInterval(()=>checkForSiteUpdate(),30000);

    document.addEventListener("visibilitychange",()=>{
      if(document.visibilityState==="visible") checkForSiteUpdate();
    });

    window.addEventListener("focus",()=>checkForSiteUpdate());
  }

  function toast(message){
    const node=$("#toast");
    node.textContent=message;
    node.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>node.classList.remove("is-visible"),1800);
  }

  function bind(){
    $("#continue-button").addEventListener("click",continueStory);
    $("#new-game-button").addEventListener("click",()=>openSaveModal("new"));
    $("#quick-save-button").addEventListener("click",()=>{
      if(!activeSave()){
        toast("먼저 새 이야기를 시작하세요.");
        return;
      }
      openSaveModal("save");
    });
    $("#save-manager-button").addEventListener("click",()=>openSaveModal("manage"));

    $$("[data-open-collection]").forEach(b=>b.addEventListener("click",()=>showView("collection")));
    $$("[data-open-chapters]").forEach(b=>b.addEventListener("click",()=>showView("chapters")));
    $$("[data-go-home]").forEach(b=>b.addEventListener("click",()=>showView("home")));
    $$("[data-close-modal]").forEach(b=>b.addEventListener("click",closeSaveModal));
    $("[data-close-notice]").forEach(b=>b.addEventListener("click",()=>$("#notice-modal").hidden=true));

    $("#update-refresh-button")?.addEventListener("click",()=>{
      window.location.reload();
    });
    $("#update-later-button")?.addEventListener("click",()=>{
      dismissedUpdate=pendingUpdateKey||"dismissed";
      pendingUpdateKey=null;
      hideUpdatePrompt();
    });

    $(".diary-tabs")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-collection-tab]");
      if(!button) return;
      const nextTab=button.dataset.collectionTab;
      if(!catalogue[nextTab]) return;
      collectionTab=nextTab;
      renderCollection();
    });

    $("#save-slot-list").addEventListener("click",event=>{
      const newBtn=event.target.closest("[data-new-slot]");
      const loadBtn=event.target.closest("[data-load-slot]");
      const saveBtn=event.target.closest("[data-save-slot]");
      const deleteBtn=event.target.closest("[data-delete-slot]");
      if(newBtn) startNewGame(Number(newBtn.dataset.newSlot));
      if(loadBtn) loadSlot(Number(loadBtn.dataset.loadSlot));
      if(saveBtn) saveToSlot(Number(saveBtn.dataset.saveSlot));
      if(deleteBtn) deleteSlot(Number(deleteBtn.dataset.deleteSlot));
    });

    document.addEventListener("keydown",event=>{
      if(event.key!=="Escape") return;
      if(!$("#notice-modal").hidden) $("#notice-modal").hidden=true;
      else if(!$("#save-modal").hidden) closeSaveModal();
      else if(!$("[data-view='collection']").hidden || !$("[data-view='chapters']").hidden) showView("home");
    });
  }

  function boot(){
    renderHome();
    bind();
    startUpdateWatcher();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();