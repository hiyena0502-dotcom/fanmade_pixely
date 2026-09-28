(() => {
  "use strict";

  const STORAGE_KEY = "pixely-lost-sky-saves-v2";
  const WARDROBE_ASSET_KEY = "pixely-lost-sky-wardrobe-assets-v1";
  const SITE_VERSION = "17";
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
      {id:"plush",symbol:"✦",name:"치명적으로 귀여운 봉제인형",type:"MEMENTO",color:"#9c8295",desc:"창고 어딘가에서 발견한 작은 봉제인형. 옷장에선 소품으로 들 수 있다.",wardrobeSlot:"accessory"},
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

  const wardrobeSlots=["outfit","accessory","face","decoration"];
  const singleWardrobeSlots=["outfit","accessory","face"];
  const wardrobeBuiltins={
    outfit:[{id:"default",name:"기본 옷",symbol:"◇"},...catalogue.items.filter(item=>item.wardrobeSlot==="outfit")],
    accessory:[{id:"none",name:"소품 없음",symbol:"·"},...catalogue.items.filter(item=>item.wardrobeSlot==="accessory")],
    face:[{id:"default",name:"기본 얼굴",symbol:"☺"},...catalogue.items.filter(item=>item.wardrobeSlot==="face")],
    decoration:catalogue.items.filter(item=>item.wardrobeSlot==="decoration" || item.wardrobeSlot==="headwear")
  };
  const defaultOutfit={outfit:"default",accessory:"none",face:"default",decorations:[]};
  const defaultTransform={x:0,y:0,scale:100,rotation:0};

  function clampNumber(value,min,max,fallback){
    const number=Number(value);
    return Number.isFinite(number)?Math.min(max,Math.max(min,number)):fallback;
  }
  function normalizeWardrobeTransform(value={}){
    return {
      x:clampNumber(value.x,-100,100,0),
      y:clampNumber(value.y,-100,100,0),
      scale:clampNumber(value.scale,20,300,100),
      rotation:clampNumber(value.rotation,-180,180,0)
    };
  }
  function freshWardrobeAssets(){
    return {base:{image:"",name:"베이스",transform:{...defaultTransform}},custom:[]};
  }
  function readWardrobeAssets(){
    try{
      const raw=JSON.parse(localStorage.getItem(WARDROBE_ASSET_KEY)||"null");
      if(!raw||typeof raw!=="object") return freshWardrobeAssets();
      const custom=Array.isArray(raw.custom)?raw.custom.filter(item=>
        item&&typeof item.id==="string"&&wardrobeSlots.includes(item.slot)&&typeof item.image==="string"
      ).map(item=>({
        id:item.id,
        slot:item.slot,
        name:typeof item.name==="string"&&item.name.trim()?item.name.trim():"내 파츠",
        symbol:"IMG",
        image:item.image,
        custom:true,
        transform:normalizeWardrobeTransform(item.transform)
      })):[];
      return {
        base:{image:typeof raw.base?.image==="string"?raw.base.image:"",name:"베이스",transform:normalizeWardrobeTransform(raw.base?.transform)},
        custom
      };
    }catch{
      return freshWardrobeAssets();
    }
  }
  let wardrobeAssets=readWardrobeAssets();
  function wardrobeOptionsFor(slot){
    return [...(wardrobeBuiltins[slot]||[]),...wardrobeAssets.custom.filter(item=>item.slot===slot)];
  }
  function wardrobeOptionById(slot,id){
    return wardrobeOptionsFor(slot).find(option=>option.id===id);
  }
  function wardrobeOptionUnlocked(option,owned){
    return Boolean(option?.custom || option?.id==="none" || option?.id==="default" || owned.has(option?.id));
  }
  function persistWardrobeAssets(previous){
    try{
      localStorage.setItem(WARDROBE_ASSET_KEY,JSON.stringify(wardrobeAssets));
      return true;
    }catch{
      if(previous) wardrobeAssets=previous;
      toast("이미지를 저장하지 못했습니다. 파일 크기를 줄이거나 기존 이미지를 정리해 주세요.");
      return false;
    }
  }
  const collectionFilters={
    cards:[{id:"all",label:"전체"},{id:"crew",label:"잠뜰 멤버"},{id:"roleplay",label:"상황극 인물"},{id:"fairy",label:"요정"},{id:"other",label:"기타 인물·생물"}],
    items:[{id:"all",label:"전체"},{id:"key",label:"중요 물건"},{id:"memento",label:"기념품"},{id:"gift",label:"선물·편지"},{id:"wardrobe",label:"꾸미기"},{id:"unknown",label:"미확인"}]
  };

  function categoryFor(item,tab){
    if(tab==="cards") return item.world?"roleplay":item.type==="FAIRY"?"fairy":item.type==="CREATURE" || item.id==="dreamer"?"other":"crew";
    return item.wardrobeSlot?"wardrobe":({"KEY ITEM":"key",MEMENTO:"memento",GIFT:"gift",UNKNOWN:"unknown"}[item.type]||"unknown");
  }

  function validOutfit(outfit,items){
    const owned=new Set(items);
    const normalized={outfit:"default",accessory:"none",face:"default",decorations:[]};
    singleWardrobeSlots.forEach(slot=>{
      const choice=outfit?.[slot];
      const option=wardrobeOptionById(slot,choice);
      normalized[slot]=option&&wardrobeOptionUnlocked(option,owned)?choice:defaultOutfit[slot];
    });
    const requestedDecorations=Array.isArray(outfit?.decorations)
      ? outfit.decorations
      : outfit?.headwear && outfit.headwear!=="none"
        ? [outfit.headwear]
        : [];
    normalized.decorations=[...new Set(requestedDecorations.map(String))].filter(choice=>{
      const option=wardrobeOptionById("decoration",choice);
      return option&&wardrobeOptionUnlocked(option,owned);
    });
    return normalized;
  }

  const chapters = [
    {id:"night",no:"01",title:"생일 전날 밤",label:"CHAPTER 01",desc:"내용 준비 중"},
    {id:"morning",no:"02",title:"사라진 생일 주인공",label:"CHAPTER 02",desc:"아침에 잠뜰님을 찾고, 요정들이 발견한 장치를 살펴본다. 다음 업데이트에서 이어진다."},
    {id:"portal",no:"03",title:"처음 열린 문",label:"CHAPTER 03",desc:"수리한 장치가 연 문으로 들어가 첫 세계로 향한다."},
    {id:"journey",no:"04",title:"이야기 속 잠뜰",label:"CHAPTER 04",desc:"여러 세계를 돌아다니며 그곳의 잠뜰을 만난다."},
    {id:"birthday",no:"05",title:"푸른 하늘",label:"FINAL",desc:"현실의 잠뜰님을 데려와 함께 생일을 축하한다."}
  ];

  function freshRoot(){ return {activeSlot:null,slots:[null,null,null]}; }

  function normalizeSave(save){
    if(!save || typeof save!=="object" || Array.isArray(save)) return null;
    const strings=value=>Array.isArray(value) ? value.filter(item=>typeof item==="string") : [];
    const oldChapters=strings(save.unlockedChapters);
    return {
      ...save,
      completedGame:Boolean(save.completedGame),
      progress:Number.isFinite(save.progress) ? Math.max(0,Math.min(100,save.progress)) : 0,
      playSeconds:Number.isFinite(save.playSeconds) ? Math.max(0,save.playSeconds) : 0,
      savedAt:Number.isFinite(save.savedAt) ? save.savedAt : 0,
      chapter:typeof save.chapter==="string" && save.chapter!=="프롤로그" ? save.chapter : "챕터 1 · 생일 전날 밤",
      location:typeof save.location==="string" ? save.location : "생일 파티 준비 장소",
      savedLabel:typeof save.savedLabel==="string" ? save.savedLabel : "",
      unlockedChapters:[...new Set(["night",...oldChapters.filter(id=>id!=="prologue")])],
      completedChapters:strings(save.completedChapters),
      missions:Array.isArray(save.missions) ? save.missions.filter(mission=>mission && typeof mission.id==="string" && typeof mission.title==="string").map(mission=>({id:mission.id,title:mission.title,done:Boolean(mission.done)})) : [],
      collection:{
        cards:Array.isArray(save.collection?.cards)
          ? strings(save.collection.cards)
          : Array.isArray(save.collection?.characters)
            ? strings(save.collection.characters)
            : ["dreamer"],
        items:strings(save.collection?.items),
        postcards:strings(save.collection?.postcards)
      },
      outfit:validOutfit(save.outfit,strings(save.collection?.items))
    };
  }

  function readRoot(){
    try{
      const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      if(!parsed||!Array.isArray(parsed.slots)) return freshRoot();
      const slots=[0,1,2].map(i=>normalizeSave(parsed.slots[i]));
      const activeSlot=parsed.activeSlot;
      return {activeSlot:Number.isInteger(activeSlot) && activeSlot>=0 && activeSlot<slots.length && slots[activeSlot] ? activeSlot : null,slots};
    }catch{
      return freshRoot();
    }
  }

  let root=readRoot();
  let lastSavedRoot=JSON.stringify(root);
  let collectionTab="cards";
  let collectionFilter="all";
  let wardrobeSlot="outfit";
  let wardrobeEditorTarget="base";
  let outfitDraft={...defaultOutfit,decorations:[]};
  let saveMode="manage";
  let toastTimer=null;
  let dismissedUpdate=null;
  let pendingUpdateKey=null;

  function escapeHTML(value){
    return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[char]);
  }

  // Future dialogue scenes can read the saved equipment and apply the user's images.
  window.PixelyAvatar={
    outfitForSave:save=>validOutfit(save?.outfit,save?.collection?.items||[]),
    outfitForActiveSave:()=>validOutfit(activeSave()?.outfit,activeSave()?.collection?.items||[]),
    assets:()=>JSON.parse(JSON.stringify(wardrobeAssets))
  };

  function persist(){
    const serialized=JSON.stringify(root);
    try{ localStorage.setItem(STORAGE_KEY,serialized); }
    catch{
      root=JSON.parse(lastSavedRoot);
      toast("저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.");
      renderHome();
      return false;
    }
    lastSavedRoot=serialized;
    renderHome();
    return true;
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
      chapter:"챕터 1 · 생일 전날 밤",
      location:"생일 파티 준비 장소",
      completedGame:false,
      unlockedChapters:["night"],
      completedChapters:[],
      missions:[],
      collection:{cards:["dreamer"],items:[],postcards:[]},
      outfit:{...defaultOutfit,decorations:[]}
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
    if(name==="wardrobe"){
      outfitDraft={...validOutfit(activeSave()?.outfit,activeSave()?.collection?.items||[])};
      renderWardrobe();
    }
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
        ? `<b>${escapeHTML(slot.chapter)} · ${slot.progress}%</b><small>${escapeHTML(slot.location)} · ${formatPlaytime(slot.playSeconds)} · ${escapeHTML(slot.savedLabel||"저장됨")}</small>`
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
    if(!persist()) return;
    closeSaveModal();
    openStory();
  }

  function loadSlot(index){
    if(!root.slots[index]) return;
    root.activeSlot=index;
    if(!persist()) return;
    closeSaveModal();
    openStory();
  }

  function saveToSlot(index){
    if(root.slots[index] && index!==root.activeSlot && !window.confirm("SLOT "+(index+1)+"의 기존 데이터를 덮어쓸까요?")) return;
    const copied=JSON.parse(JSON.stringify(activeSave()||newSave()));
    copied.savedAt=Date.now();
    copied.savedLabel=nowLabel();
    root.slots[index]=copied;
    root.activeSlot=index;
    if(!persist()) return;
    closeSaveModal();
    toast("SLOT "+(index+1)+"에 저장했습니다.");
  }

  function deleteSlot(index){
    if(!root.slots[index]) return;
    if(!window.confirm("SLOT "+(index+1)+"의 저장 데이터를 삭제할까요?")) return;
    root.slots[index]=null;
    if(root.activeSlot===index) root.activeSlot=null;
    if(!persist()) return;
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
    if(!persist()) return;
    openStory();
  }

  function openStory(){
    if(!activeSave()) return;
    showView("story");
    renderGameUI();
  }

  function renderGameUI(){
    const save=activeSave();
    const missions=$("#mission-list");
    missions.replaceChildren();
    if(!save?.missions.length){
      const empty=document.createElement("li");
      empty.className="game-ui-empty";
      empty.textContent="등록된 미션이 없습니다.";
      missions.append(empty);
    }else{
      save.missions.forEach(mission=>{
        const row=document.createElement("li");
        row.className=mission.done?"is-done":"";
        row.textContent=(mission.done?"✓ ":"○ ")+mission.title;
        missions.append(row);
      });
    }

    const inventory=$("#inventory-list");
    inventory.replaceChildren();
    if(!save?.collection.items.length){
      const empty=document.createElement("p");
      empty.className="game-ui-empty";
      empty.textContent="가지고 있는 아이템이 없습니다.";
      inventory.append(empty);
    }else{
      save.collection.items.forEach(id=>{
        const item=catalogue.items.find(entry=>entry.id===id);
        const row=document.createElement("article");
        row.className="inventory-entry";
        const name=document.createElement("strong");
        name.textContent=item?.name||"이름 없는 아이템";
        const description=document.createElement("p");
        description.textContent=item?.desc||"아이템 정보를 준비 중입니다.";
        row.append(name,description);
        inventory.append(row);
      });
    }
  }

  function collectionOwnedSet(){
    const save=activeSave();
    if(!save) return new Set();
    return new Set(save.collection?.[collectionTab]||[]);
  }

  function renderCollection(){
    const allItems=catalogue[collectionTab]||[];
    const filters=collectionFilters[collectionTab]||[];
    const worlds=[...new Set(allItems.filter(item=>item.world).map(item=>item.world))];
    const filterOptions=collectionTab==="cards"
      ? [...filters,...worlds.map(world=>({id:"world:"+world,label:"↳ "+world}))]
      : filters;
    const items=collectionFilter==="all" || collectionTab==="postcards"
      ? allItems
      : allItems.filter(item=>collectionFilter.startsWith("world:")
        ? item.world===collectionFilter.slice(6)
        : categoryFor(item,collectionTab)===collectionFilter);
    const owned=collectionOwnedSet();
    const labels={
      cards:["CARD FILE","만난 카드","여행 중 직접 만난 인물과 생물이 카드로 기록됩니다."],
      items:["ITEM SCRAP","손에 넣은 아이템","주운 물건과 받은 기념품을 스크랩처럼 한 장씩 남겨둡니다."],
      postcards:["POSTCARD ALBUM","모아둔 엽서","챕터의 끝이나 특별한 이벤트에서 남은 순간을 엽서로 보관합니다."]
    };

    $("#collection-eyebrow").textContent=labels[collectionTab][0];
    $("#collection-heading").textContent=labels[collectionTab][1];
    $("#collection-description").textContent=labels[collectionTab][2];
    document.querySelectorAll(".diary-tabs button").forEach(b=>{
      const active=b.dataset.collectionTab===collectionTab;
      b.classList.toggle("is-active",active);
      b.setAttribute("aria-selected",active?"true":"false");
    });
    $("#collection-filters").hidden=collectionTab==="postcards";
    $("#collection-filters").innerHTML=filterOptions.map(filter=>{
      const count=filter.id==="all"?allItems.length:allItems.filter(item=>filter.id.startsWith("world:")?item.world===filter.id.slice(6):categoryFor(item,collectionTab)===filter.id).length;
      return `<button type="button" data-collection-filter="${escapeHTML(filter.id)}" class="${collectionFilter===filter.id?"is-active":""}" aria-pressed="${collectionFilter===filter.id}">${escapeHTML(filter.label)} <span>${count}</span></button>`;
    }).join("");
    $("#collection-owned").textContent=items.filter(item=>owned.has(item.id)).length;
    $("#collection-total").textContent=items.length;

    const grid=$("#collection-grid");
    grid.className="collection-grid collection-grid--"+collectionTab;

    if(!items.length){
      grid.innerHTML=`<div class="collection-empty"><span>✧</span><b>아직 이 페이지는 비어 있어요</b><p>${collectionTab==="cards"?"상황극 세계를 여행하고 새로운 인물을 만나면 작품별 기록이 이곳에 모입니다.":"여행에서 새로운 물건을 찾으면 이 분류에 기록됩니다."}</p></div>`;
      return;
    }

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

  function wardrobeOptionName(slot,id){
    return wardrobeOptionById(slot,id)?.name||"";
  }
  function imageLayerStyle(transform={}){
    const t=normalizeWardrobeTransform(transform);
    return "--layer-x:"+t.x+"%;--layer-y:"+t.y+"%;--layer-scale:"+(t.scale/100)+";--layer-rotate:"+t.rotation+"deg";
  }
  function wardrobeLayerMarkup(option,target,z){
    if(!option?.image) return "";
    const selected=wardrobeEditorTarget===target;
    return '<img class="wardrobe-image-layer '+(selected?"is-editing":"")+'" data-preview-layer="'+escapeHTML(target)+'" src="'+escapeHTML(option.image)+'" alt="" style="'+imageLayerStyle(option.transform)+';z-index:'+z+'">';
  }
  function renderWardrobePreview(){
    const preview=$("#wardrobe-preview");
    if(!preview) return;
    const parts=[];
    if(wardrobeAssets.base.image){
      parts.push('<img class="wardrobe-image-layer '+(wardrobeEditorTarget==="base"?"is-editing":"")+'" data-preview-layer="base" src="'+escapeHTML(wardrobeAssets.base.image)+'" alt="꿈뜰이 베이스" style="'+imageLayerStyle(wardrobeAssets.base.transform)+';z-index:1">');
    }
    const outfit=wardrobeOptionById("outfit",outfitDraft.outfit);
    const accessory=wardrobeOptionById("accessory",outfitDraft.accessory);
    const face=wardrobeOptionById("face",outfitDraft.face);
    parts.push(wardrobeLayerMarkup(outfit,outfit?.id||"",2));
    parts.push(wardrobeLayerMarkup(accessory,accessory?.id||"",3));
    parts.push(wardrobeLayerMarkup(face,face?.id||"",4));
    (outfitDraft.decorations||[]).forEach((id,index)=>parts.push(wardrobeLayerMarkup(wardrobeOptionById("decoration",id),id,10+index)));
    preview.innerHTML=parts.filter(Boolean).join("") || '<div class="wardrobe-preview-empty"><span aria-hidden="true">✧</span><p>베이스 이미지를 먼저 추가해 주세요.</p><small>PNG 투명 배경을 그대로 겹쳐서 사용할 수 있어요.</small></div>';
  }
  function currentEditorAsset(){
    if(wardrobeEditorTarget==="base") return wardrobeAssets.base;
    return wardrobeAssets.custom.find(item=>item.id===wardrobeEditorTarget)||null;
  }
  function visibleEditableLayers(){
    const ids=new Set([outfitDraft.outfit,outfitDraft.accessory,outfitDraft.face,...(outfitDraft.decorations||[])]);
    return wardrobeAssets.custom.filter(item=>ids.has(item.id)&&item.image);
  }
  function renderWardrobeEditor(){
    const select=$("#wardrobe-layer-select");
    const layers=visibleEditableLayers();
    const validTarget=wardrobeEditorTarget==="base" || layers.some(item=>item.id===wardrobeEditorTarget);
    if(!validTarget) wardrobeEditorTarget="base";
    select.innerHTML='<option value="base">베이스 이미지</option>'+layers.map(item=>'<option value="'+escapeHTML(item.id)+'">'+escapeHTML(item.name)+'</option>').join("");
    select.value=wardrobeEditorTarget;
    const asset=currentEditorAsset();
    const t=normalizeWardrobeTransform(asset?.transform);
    [["x",t.x],["y",t.y],["scale",t.scale],["rotation",t.rotation]].forEach(([key,value])=>{
      const input=$('[data-wardrobe-transform="'+key+'"]');
      const output=$('[data-wardrobe-transform-value="'+key+'"]');
      if(input){input.value=String(value);input.disabled=!asset?.image}
      if(output) output.textContent=key==="scale"?Math.round(value)+"%":key==="rotation"?Math.round(value)+"°":Math.round(value);
    });
    $("#wardrobe-reset-transform").disabled=!asset?.image;
    $("#wardrobe-delete-image").disabled=!asset?.image;
    $("#wardrobe-delete-image").textContent=wardrobeEditorTarget==="base"?"베이스 이미지 제거":"선택 파츠 삭제";
  }
  function renderWardrobe(){
    const save=activeSave();
    const owned=new Set(save?.collection?.items||[]);
    const decorationNames=(outfitDraft.decorations||[]).map(id=>wardrobeOptionName("decoration",id)).filter(Boolean);
    const equipped=[wardrobeOptionName("outfit",outfitDraft.outfit),wardrobeOptionName("accessory",outfitDraft.accessory),wardrobeOptionName("face",outfitDraft.face),...decorationNames].filter(Boolean);
    $("#wardrobe-slot-label").textContent=save?"SLOT "+(root.activeSlot+1):"NO SAVE";
    $("#wardrobe-equipped").textContent=equipped.join(" · ")||"기본 모습";
    $("#wardrobe-save-button").disabled=!save;
    $("#wardrobe-status").textContent=save
      ? wardrobeSlot==="decoration"
        ? "장식은 여러 개를 동시에 선택할 수 있어요. 이미지 위치는 아래 편집기에서 각각 조절할 수 있습니다."
        : "파츠 이미지를 추가한 뒤 위치와 크기를 맞추고 현재 슬롯에 저장하세요."
      : "먼저 새 이야기를 시작하고 슬롯을 선택해 주세요.";
    $$("[data-wardrobe-slot]").forEach(button=>{
      const active=button.dataset.wardrobeSlot===wardrobeSlot;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });
    const choices=wardrobeOptionsFor(wardrobeSlot);
    const emptyMessage=wardrobeSlot==="decoration"?"아직 등록된 장식이 없어요. 아래에서 PNG를 추가하면 여러 개를 함께 고를 수 있습니다.":"아직 이 파츠에 등록된 이미지가 없어요. 아래에서 직접 추가할 수 있습니다.";
    $("#wardrobe-options").innerHTML=(choices.length?choices.map(option=>{
      const unlocked=wardrobeOptionUnlocked(option,owned);
      const selected=wardrobeSlot==="decoration"?(outfitDraft.decorations||[]).includes(option.id):outfitDraft[wardrobeSlot]===option.id;
      const art=option.image?'<img src="'+escapeHTML(option.image)+'" alt="">':escapeHTML(unlocked?option.symbol:"?");
      return '<button type="button" data-wardrobe-item="'+escapeHTML(option.id)+'" class="wardrobe-option '+(selected?"is-selected ":"")+(unlocked?"":"is-locked")+'" aria-pressed="'+selected+'" '+(unlocked&&save?"":"disabled")+'><span class="wardrobe-option-art">'+art+'</span><b>'+escapeHTML(unlocked?option.name:"???")+'</b><small>'+(selected?(wardrobeSlot==="decoration"?"함께 착용 중":"착용 중"):unlocked?(option.custom?"내 이미지":"선택 가능"):"여행 중 발견")+'</small></button>';
    }).join(""):"")+(choices.length<=(wardrobeSlot==="decoration"?0:1)?'<p class="wardrobe-empty">'+emptyMessage+'</p>':"");
    renderWardrobePreview();
    renderWardrobeEditor();
  }
  function readImageFile(file,callback){
    if(!file) return;
    if(!/^image\/(png|webp|jpeg)$/i.test(file.type||"")){toast("PNG, WEBP, JPG 이미지만 추가할 수 있어요.");return}
    if(file.size>1800000){toast("이미지 한 장은 1.8MB 이하로 줄여 주세요.");return}
    const reader=new FileReader();
    reader.onload=()=>callback(String(reader.result||""));
    reader.onerror=()=>toast("이미지를 읽지 못했습니다.");
    reader.readAsDataURL(file);
  }
  function setBaseImage(file){
    readImageFile(file,image=>{
      const previous=JSON.parse(JSON.stringify(wardrobeAssets));
      wardrobeAssets.base={image,name:"베이스",transform:{...defaultTransform}};
      wardrobeEditorTarget="base";
      if(!persistWardrobeAssets(previous)) return;
      renderWardrobe();
      toast("베이스 이미지를 등록했어요.");
    });
  }
  function addWardrobeImage(file){
    readImageFile(file,image=>{
      const nameInput=$("#wardrobe-image-name");
      const fileName=String(file?.name||"").replace(/\.[^.]+$/,"");
      const name=(nameInput?.value||fileName||"내 파츠").trim().slice(0,40)||"내 파츠";
      const id="custom-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
      const previous=JSON.parse(JSON.stringify(wardrobeAssets));
      const asset={id,slot:wardrobeSlot,name,symbol:"IMG",image,custom:true,transform:{...defaultTransform}};
      wardrobeAssets.custom.push(asset);
      if(wardrobeSlot==="decoration") outfitDraft.decorations=[...(outfitDraft.decorations||[]),id];
      else outfitDraft[wardrobeSlot]=id;
      wardrobeEditorTarget=id;
      if(!persistWardrobeAssets(previous)){outfitDraft=validOutfit(outfitDraft,activeSave()?.collection?.items||[]);return}
      if(nameInput) nameInput.value="";
      const upload=$("#wardrobe-image-file");if(upload) upload.value="";
      renderWardrobe();
      toast(name+" 이미지를 추가했어요.");
    });
  }
  function updateWardrobeTransform(key,value,persist=false){
    const asset=currentEditorAsset();
    if(!asset?.image) return;
    const ranges={x:[-100,100,0],y:[-100,100,0],scale:[20,300,100],rotation:[-180,180,0]};
    const [min,max,fallback]=ranges[key]||[0,0,0];
    asset.transform={...normalizeWardrobeTransform(asset.transform),[key]:clampNumber(value,min,max,fallback)};
    renderWardrobePreview();
    const output=$('[data-wardrobe-transform-value="'+key+'"]');
    const next=asset.transform[key];
    if(output) output.textContent=key==="scale"?Math.round(next)+"%":key==="rotation"?Math.round(next)+"°":Math.round(next);
    if(persist) persistWardrobeAssets();
  }
  function resetWardrobeTransform(){
    const asset=currentEditorAsset();
    if(!asset?.image) return;
    asset.transform={...defaultTransform};
    persistWardrobeAssets();
    renderWardrobe();
  }
  function deleteWardrobeImage(){
    const asset=currentEditorAsset();
    if(!asset?.image) return;
    if(wardrobeEditorTarget==="base"){
      wardrobeAssets.base=freshWardrobeAssets().base;
      persistWardrobeAssets();
      renderWardrobe();
      toast("베이스 이미지를 제거했어요.");
      return;
    }
    const id=wardrobeEditorTarget;
    const removed=wardrobeAssets.custom.find(item=>item.id===id);
    wardrobeAssets.custom=wardrobeAssets.custom.filter(item=>item.id!==id);
    if(outfitDraft.outfit===id) outfitDraft.outfit="default";
    if(outfitDraft.accessory===id) outfitDraft.accessory="none";
    if(outfitDraft.face===id) outfitDraft.face="default";
    outfitDraft.decorations=(outfitDraft.decorations||[]).filter(itemId=>itemId!==id);
    wardrobeEditorTarget="base";
    persistWardrobeAssets();
    renderWardrobe();
    toast((removed?.name||"이미지")+"를 삭제했어요.");
  }

  function saveOutfit(){
    const save=activeSave();
    if(!save){ toast("먼저 새 이야기를 시작하세요."); return; }
    save.outfit=validOutfit(outfitDraft,save.collection.items);
    save.savedAt=Date.now();
    save.savedLabel=nowLabel();
    if(!persist()){
      outfitDraft={...validOutfit(activeSave()?.outfit,activeSave()?.collection?.items||[])};
      renderWardrobe();
      return;
    }
    renderWardrobe();
    toast("꿈뜰이의 모습이 SLOT "+(root.activeSlot+1)+"에 저장됐어요.");
  }

  function grantItem(itemId){
    const save=activeSave();
    if(!save || !catalogue.items.some(item=>item.id===itemId)) return false;
    if(save.collection.items.includes(itemId)) return true;
    save.collection.items.push(itemId);
    save.savedAt=Date.now();
    save.savedLabel=nowLabel();
    if(!persist()) return false;
    if(!$('[data-view="wardrobe"]').hidden) renderWardrobe();
    if(!$('[data-view="collection"]').hidden) renderCollection();
    if(!$('[data-view="story"]').hidden) renderGameUI();
    return true;
  }
  window.PixelyInventory={grantItem};

  function renderChapters(){
    const save=activeSave();
    const unlocked=new Set(save?.unlockedChapters||[]);
    const completed=new Set(save?.completedChapters||[]);

    $("#chapters-progress").textContent=(save?.progress||0)+"%";

    $("#chapter-list").innerHTML=chapters.map(ch=>{
      const isComplete=completed.has(ch.id) || (ch.id==="birthday" && save?.completedGame);
      const isOpen=isComplete || unlocked.has(ch.id);
      const cls=isComplete?"is-complete":isOpen?"is-open":"is-locked";
      const status=isComplete?"COMPLETE":ch.id==="morning"&&isOpen?"NEXT · 준비 중":isOpen?"OPEN":"LOCKED";

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

  async function checkForSiteUpdate(){
    try{
      const response=await fetch(new URL("./site-version.json",document.baseURI),{cache:"no-store"});
      if(!response.ok) return;
      const {version}=await response.json();
      if(typeof version==="string" && version && version!==SITE_VERSION) showUpdatePrompt(version);
    }catch{
      // 네트워크가 잠시 끊긴 경우에는 조용히 다음 확인을 기다립니다.
    }
  }

  function startUpdateWatcher(){
    checkForSiteUpdate();
    setInterval(()=>{
      if(document.visibilityState==="visible") checkForSiteUpdate();
    },60000);

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
    $$("[data-open-wardrobe]").forEach(b=>b.addEventListener("click",()=>showView("wardrobe")));
    $$("[data-open-chapters]").forEach(b=>b.addEventListener("click",()=>showView("chapters")));
    $$("[data-go-home]").forEach(b=>b.addEventListener("click",()=>showView("home")));
    $$("[data-close-modal]").forEach(b=>b.addEventListener("click",closeSaveModal));

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
      collectionFilter="all";
      renderCollection();
    });

    $("#collection-filters").addEventListener("click",event=>{
      const button=event.target.closest("[data-collection-filter]");
      if(!button) return;
      collectionFilter=button.dataset.collectionFilter;
      renderCollection();
    });
    $("#wardrobe-tabs").addEventListener("click",event=>{
      const button=event.target.closest("[data-wardrobe-slot]");
      if(!button || !wardrobeSlots.includes(button.dataset.wardrobeSlot)) return;
      wardrobeSlot=button.dataset.wardrobeSlot;
      renderWardrobe();
    });
    $("#wardrobe-options").addEventListener("click",event=>{
      const button=event.target.closest("[data-wardrobe-item]");
      if(!button || button.disabled || !activeSave()) return;
      const item=wardrobeOptionById(wardrobeSlot,button.dataset.wardrobeItem);
      const owned=new Set(activeSave().collection.items||[]);
      if(!item || !wardrobeOptionUnlocked(item,owned)) return;
      if(wardrobeSlot==="decoration"){
        const selected=new Set(outfitDraft.decorations||[]);
        if(selected.has(item.id)) selected.delete(item.id);
        else selected.add(item.id);
        outfitDraft.decorations=[...selected];
      }else{
        outfitDraft[wardrobeSlot]=item.id;
      }
      if(item.custom) wardrobeEditorTarget=item.id;
      renderWardrobe();
    });
    $("#wardrobe-save-button").addEventListener("click",saveOutfit);
    $("#wardrobe-base-file").addEventListener("change",event=>{
      const file=event.target.files?.[0];
      if(file) setBaseImage(file);
      event.target.value="";
    });
    $("#wardrobe-image-file").addEventListener("change",event=>{
      const file=event.target.files?.[0];
      if(file) addWardrobeImage(file);
    });
    $("#wardrobe-layer-select").addEventListener("change",event=>{
      wardrobeEditorTarget=event.target.value||"base";
      renderWardrobe();
    });
    $("[data-wardrobe-transform]").forEach(input=>{
      input.addEventListener("input",event=>updateWardrobeTransform(event.target.dataset.wardrobeTransform,event.target.value,false));
      input.addEventListener("change",event=>updateWardrobeTransform(event.target.dataset.wardrobeTransform,event.target.value,true));
    });
    $("#wardrobe-reset-transform").addEventListener("click",resetWardrobeTransform);
    $("#wardrobe-delete-image").addEventListener("click",deleteWardrobeImage);
    $("#wardrobe-preview").addEventListener("click",event=>{
      const layer=event.target.closest?.("[data-preview-layer]");
      if(!layer) return;
      wardrobeEditorTarget=layer.dataset.previewLayer||"base";
      renderWardrobe();
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
      if(!$("#save-modal").hidden) closeSaveModal();
      else if(!$("[data-view='collection']").hidden || !$("[data-view='chapters']").hidden || !$("[data-view='story']").hidden || !$("[data-view='wardrobe']").hidden) showView("home");
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
