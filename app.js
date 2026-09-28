(() => {
  "use strict";

  const STORAGE_KEY = "pixely-lost-sky-saves-v2";
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];

  const catalogue = {
    characters: [
      {id:"dreamer",symbol:"YOU",name:"꿈뜰이",type:"PLAYER",color:"#5d87a8",desc:"잠뜰님의 생일을 축하하기 위해 여행을 시작한 플레이어."},
      {id:"jamtteul",symbol:"잠",name:"잠뜰",type:"CHARACTER",color:"#4f86b3",desc:"여행의 끝에서 가장 만나고 싶은 사람."},
      {id:"rader",symbol:"라",name:"라더",type:"CHARACTER",color:"#8d5c68",desc:"이야기 속에서 만나면 기록됩니다."},
      {id:"deokgae",symbol:"덕",name:"덕개",type:"CHARACTER",color:"#9b744d",desc:"이야기 속에서 만나면 기록됩니다."},
      {id:"gakbyeol",symbol:"각",name:"각별",type:"CHARACTER",color:"#6e659c",desc:"이야기 속에서 만나면 기록됩니다."},
      {id:"gongryong",symbol:"공",name:"공룡",type:"CHARACTER",color:"#4f7f61",desc:"이야기 속에서 만나면 기록됩니다."},
      {id:"suhyeon",symbol:"수",name:"수현",type:"CHARACTER",color:"#607e98",desc:"이야기 속에서 만나면 기록됩니다."},
      {id:"fairy",symbol:"✧",name:"요정들",type:"CHARACTER",color:"#638da0",desc:"이야기와 이야기 사이의 문을 발견하는 존재들."}
    ],
    items: [
      {id:"portal-device",symbol:"◇",name:"정체불명의 장치",type:"KEY ITEM",color:"#537a9a",desc:"요정들이 발견한 이상한 장치. 각별이 작동시키게 된다."},
      {id:"unknown-piece",symbol:"?",name:"의미를 알 수 없는 물건",type:"UNKNOWN",color:"#6b7191",desc:"여러 세계를 돌아다니다 우연히 발견하게 되는 물건."},
      {id:"birthday-gift",symbol:"□",name:"생일 선물",type:"GIFT",color:"#9a7c5a",desc:"상황극 세계에서 현실 잠뜰님께 전해달라고 받은 선물."},
      {id:"letter",symbol:"✉",name:"축하 편지",type:"GIFT",color:"#73849b",desc:"여행 중 모이게 될 여러 세계의 축하 메시지."}
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
        characters:Array.isArray(save.collection?.characters) ? save.collection.characters : ["dreamer"],
        items:Array.isArray(save.collection?.items) ? save.collection.items : []
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
  let collectionTab="characters";
  let saveMode="manage";
  let toastTimer=null;

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
      collection:{characters:["dreamer"],items:[]}
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
    const items=catalogue[collectionTab];
    const owned=collectionOwnedSet();
    const labels={
      characters:["CHARACTER NOTE","만난 인물","이야기 속에서 직접 만난 인물이 하나씩 다이어리에 기록됩니다."],
      items:["ITEM NOTE","발견한 아이템","조사하거나 누군가에게 받은 물건을 한 장씩 붙여둡니다."]
    };

    $("#collection-eyebrow").textContent=labels[collectionTab][0];
    $("#collection-heading").textContent=labels[collectionTab][1];
    $("#collection-description").textContent=labels[collectionTab][2];
    $$(".diary-tabs button").forEach(b=>b.classList.toggle("is-active",b.dataset.collectionTab===collectionTab));
    $("#collection-owned").textContent=owned.size;
    $("#collection-total").textContent=items.length;

    $("#collection-grid").innerHTML=items.map(item=>{
      const open=owned.has(item.id);
      return `<article class="collection-card ${open?"":"is-locked"}">
        <div class="card-art" style="--card:${open?item.color:"#b9b0a5"}">${open?item.symbol:"?"}</div>
        <small>${open?item.type:"LOCKED"}</small>
        <b>${open?item.name:"아직 기록되지 않았습니다"}</b>
        <p>${open?item.desc:"이야기를 진행하면 이 페이지가 채워집니다."}</p>
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
    $$("[data-close-notice]").forEach(b=>b.addEventListener("click",()=>$("#notice-modal").hidden=true));

    $$(".diary-tabs button").forEach(b=>b.addEventListener("click",()=>{
      collectionTab=b.dataset.collectionTab;
      renderCollection();
    }));

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
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();