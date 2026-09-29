(() => {
  "use strict";

  const STORAGE_KEY = "pixely-lost-sky-saves-v2";
  const SESSION_SAVE_KEY = STORAGE_KEY+"-session-fallback";
  const WARDROBE_ASSET_KEY = "pixely-lost-sky-wardrobe-assets-v1";
  const DEV_CONTENT_KEY = "pixely-lost-sky-dev-content-v1";
  const SITE_VERSION = "37";
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
  const wardrobeLabels={outfit:"옷",accessory:"소품",face:"얼굴",decoration:"장식"};
  const wardrobeGroups={
    outfit:[["top","상의"],["bottom","하의"],["outer","겉옷"],["shoes","신발"],["other","기타 의상"]],
    accessory:[["hand","손에 드는 소품"],["wear","착용 소품"],["head","머리 소품"],["other","기타 소품"]],
    face:[["eyes","눈"],["mouth","입"],["brows","눈썹"],["cheek","볼·표정"],["other","기타 얼굴"]],
    decoration:[["effect","이펙트"],["sticker","스티커"],["around","주변 장식"],["other","기타 장식"]]
  };
  function builtinWardrobeOptions(slot){
    if(slot==="decoration") return catalogue.items.filter(item=>item.wardrobeSlot==="decoration" || item.wardrobeSlot==="headwear");
    return catalogue.items.filter(item=>item.wardrobeSlot===slot);
  }
  const defaultOutfit={layers:[]};
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
  function legacyLayerIds(value={}){
    if(Array.isArray(value?.layers)) return [...new Set(value.layers.filter(item=>typeof item==="string"))];
    const ids=[];
    const push=value=>{
      if(Array.isArray(value)) value.forEach(push);
      else if(typeof value==="string" && value && value!=="default" && value!=="none") ids.push(value);
    };
    push(value?.outfit);
    push(value?.accessory);
    push(value?.face);
    push(value?.decorations);
    if(value?.headwear && value.headwear!=="none") push(value.headwear);
    return [...new Set(ids)];
  }
  function normalizeSetupOutfit(value={}){
    return {layers:legacyLayerIds(value)};
  }
  function freshWardrobeAssets(){
    return {
      base:{image:"",name:"베이스",transform:{...defaultTransform}},
      custom:[],
      layerOrder:[],
      setupOutfit:{layers:[]}
    };
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
        group:typeof item.group==="string"?item.group:"other",
        name:typeof item.name==="string"&&item.name.trim()?item.name.trim():"내 파츠",
        symbol:"IMG",
        image:item.image,
        custom:true,
        transform:normalizeWardrobeTransform(item.transform)
      })):[];
      const ids=custom.map(item=>item.id);
      const requestedOrder=Array.isArray(raw.layerOrder)?raw.layerOrder.filter(id=>ids.includes(id)):[];
      const layerOrder=[...new Set([...requestedOrder,...ids])];
      return {
        base:{image:typeof raw.base?.image==="string"?raw.base.image:"",name:"베이스",transform:normalizeWardrobeTransform(raw.base?.transform)},
        custom,
        layerOrder,
        setupOutfit:normalizeSetupOutfit(raw.setupOutfit)
      };
    }catch{
      return freshWardrobeAssets();
    }
  }
  let wardrobeAssets=readWardrobeAssets();
  function wardrobeOptionsFor(slot){
    return [...builtinWardrobeOptions(slot),...wardrobeAssets.custom.filter(item=>item.slot===slot)];
  }
  function wardrobeOptionById(slot,id){
    return wardrobeOptionsFor(slot).find(option=>option.id===id);
  }
  function wardrobeOptionByIdAny(id){
    for(const slot of wardrobeSlots){
      const found=wardrobeOptionById(slot,id);
      if(found) return found;
    }
    return null;
  }
  function wardrobeOptionUnlocked(option,owned){
    return Boolean(option?.custom || owned.has(option?.id));
  }
  function orderedLayerIds(ids){
    const rank=new Map(wardrobeAssets.layerOrder.map((id,index)=>[id,index]));
    return [...ids].sort((a,b)=>(rank.get(a)??999999)-(rank.get(b)??999999));
  }
  function developerOutfit(){
    return validOutfit(wardrobeAssets.setupOutfit,[]);
  }
  function rememberDeveloperOutfit(){
    const previous=JSON.parse(JSON.stringify(wardrobeAssets));
    wardrobeAssets.setupOutfit=normalizeSetupOutfit(validOutfit(outfitDraft,[]));
    return persistWardrobeAssets(previous);
  }
  function wardrobeStorageBytes(){
    try{return JSON.stringify(wardrobeAssets).length*2}catch{return 0}
  }
  function formatStorageSize(bytes){
    if(bytes<1024) return bytes+" B";
    if(bytes<1024*1024) return (bytes/1024).toFixed(0)+" KB";
    return (bytes/1024/1024).toFixed(2)+" MB";
  }
  function updateWardrobeStorageMeter(){
    const meter=$("#wardrobe-storage-meter");
    if(!meter) return;
    const bytes=wardrobeStorageBytes();
    meter.textContent="브라우저 저장 "+formatStorageSize(bytes);
    meter.dataset.state=bytes>4.2*1024*1024?"warn":"ok";
  }
  function persistWardrobeAssets(previous){
    try{
      localStorage.setItem(WARDROBE_ASSET_KEY,JSON.stringify(wardrobeAssets));
      updateWardrobeStorageMeter();
      return true;
    }catch{
      if(previous) wardrobeAssets=previous;
      updateWardrobeStorageMeter();
      toast("브라우저 저장 공간이 부족합니다. 큰 이미지를 줄이거나 기존 파츠를 지워 주세요.");
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
    const layers=legacyLayerIds(outfit).filter(id=>{
      const option=wardrobeOptionByIdAny(id);
      return option&&wardrobeOptionUnlocked(option,owned);
    });
    return {layers:[...new Set(layers)]};
  }

  const chapters = [
    {id:"night",no:"01",title:"생일 전날 밤",label:"CHAPTER 01",desc:"내용 준비 중"},
    {id:"morning",no:"02",title:"사라진 생일 주인공",label:"CHAPTER 02",desc:"아침에 잠뜰님을 찾고, 요정들이 발견한 장치를 살펴본다. 다음 업데이트에서 이어진다."},
    {id:"portal",no:"03",title:"처음 열린 문",label:"CHAPTER 03",desc:"수리한 장치가 연 문으로 들어가 첫 세계로 향한다."},
    {id:"journey",no:"04",title:"이야기 속 잠뜰",label:"CHAPTER 04",desc:"여러 세계를 돌아다니며 그곳의 잠뜰을 만난다."},
    {id:"birthday",no:"05",title:"푸른 하늘",label:"FINAL",desc:"현실의 잠뜰님을 데려와 함께 생일을 축하한다."}
  ];

  function cloneData(value){
    return JSON.parse(JSON.stringify(value));
  }

  const BASE_DEV_CONTENT={
    chapters:cloneData(chapters).map(chapter=>({...chapter,interactions:Array.isArray(chapter.interactions)?chapter.interactions:[]})),
    cards:cloneData(catalogue.cards),
    postcards:cloneData(catalogue.postcards),
    items:cloneData(catalogue.items)
  };

  function normalizeDevArray(value,fallback){
    return Array.isArray(value)
      ? value.filter(entry=>entry&&typeof entry==="object"&&!Array.isArray(entry)).map(entry=>({...entry}))
      : cloneData(fallback);
  }

  function normalizeChapterInteractions(value){
    return Array.isArray(value)
      ? value.filter(entry=>entry&&typeof entry==="object"&&!Array.isArray(entry)).map(entry=>({
          id:typeof entry.id==="string"&&entry.id.trim()?entry.id.trim():"interaction-"+Date.now().toString(36),
          type:typeof entry.type==="string"?entry.type:"inspect",
          label:typeof entry.label==="string"?entry.label:"",
          target:typeof entry.target==="string"?entry.target:"",
          scene:typeof entry.scene==="string"?entry.scene:"",
          x:Number.isFinite(Number(entry.x))?Number(entry.x):50,
          y:Number.isFinite(Number(entry.y))?Number(entry.y):50,
          width:Number.isFinite(Number(entry.width))?Number(entry.width):12,
          height:Number.isFinite(Number(entry.height))?Number(entry.height):12,
          text:typeof entry.text==="string"?entry.text:"",
          condition:typeof entry.condition==="string"?entry.condition:"",
          rewardItem:typeof entry.rewardItem==="string"?entry.rewardItem:"",
          next:typeof entry.next==="string"?entry.next:"",
          note:typeof entry.note==="string"?entry.note:""
        }))
      : [];
  }

  function normalizeDevChapters(value,fallback){
    return normalizeDevArray(value,fallback).map(chapter=>({
      ...chapter,
      interactions:normalizeChapterInteractions(chapter.interactions)
    }));
  }

  function readDevContent(){
    try{
      const raw=JSON.parse(localStorage.getItem(DEV_CONTENT_KEY)||"null");
      if(!raw||typeof raw!=="object") return cloneData(BASE_DEV_CONTENT);
      return {
        chapters:normalizeDevChapters(raw.chapters,BASE_DEV_CONTENT.chapters),
        cards:normalizeDevArray(raw.cards,BASE_DEV_CONTENT.cards),
        postcards:normalizeDevArray(raw.postcards,BASE_DEV_CONTENT.postcards),
        items:normalizeDevArray(raw.items,BASE_DEV_CONTENT.items)
      };
    }catch{
      return cloneData(BASE_DEV_CONTENT);
    }
  }

  let devContent=readDevContent();

  function applyDevContent(){
    chapters.splice(0,chapters.length,...cloneData(devContent.chapters));
    catalogue.cards.splice(0,catalogue.cards.length,...cloneData(devContent.cards));
    catalogue.postcards.splice(0,catalogue.postcards.length,...cloneData(devContent.postcards));
    catalogue.items.splice(0,catalogue.items.length,...cloneData(devContent.items));
  }

  function persistDevContent(){
    try{
      localStorage.setItem(DEV_CONTENT_KEY,JSON.stringify(devContent));
      applyDevContent();
      return true;
    }catch{
      toast("개발자 설정 저장에 실패했습니다. 브라우저 저장 공간을 확인해 주세요.");
      return false;
    }
  }

  applyDevContent();

  window.PixelyDevContent={
    all:()=>cloneData(devContent),
    interactionsForChapter:chapterId=>cloneData(devContent.chapters.find(chapter=>chapter.id===chapterId)?.interactions||[])
  };

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
      missions:(()=>{
        const list=Array.isArray(save.missions)
          ? save.missions.filter(mission=>mission && typeof mission.id==="string" && typeof mission.title==="string").map(mission=>({id:mission.id,title:mission.title,done:Boolean(mission.done)}))
          : [];
        return list.length?list:[{id:"explore-party-room",title:"파티방을 둘러보자",done:false}];
      })(),
      story:{
        scene:typeof save.story?.scene==="string" ? save.story.scene : "party-room",
        inspected:strings(save.story?.inspected),
        introSeen:typeof save.story?.introSeen==="boolean" ? save.story.introSeen : true
      },
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

  function parseRoot(rawValue){
    try{
      const parsed=JSON.parse(rawValue||"null");
      if(!parsed||!Array.isArray(parsed.slots)) return null;
      const slots=[0,1,2].map(i=>normalizeSave(parsed.slots[i]));
      const activeSlot=parsed.activeSlot;
      return {activeSlot:Number.isInteger(activeSlot) && activeSlot>=0 && activeSlot<slots.length && slots[activeSlot] ? activeSlot : null,slots};
    }catch{
      return null;
    }
  }

  function readRoot(){
    // localStorage가 옷장 이미지 등으로 가득 찬 경우 직전 임시 세이브를 우선 복구합니다.
    try{
      const sessionRoot=parseRoot(sessionStorage.getItem(SESSION_SAVE_KEY));
      if(sessionRoot) return sessionRoot;
    }catch{}
    try{
      return parseRoot(localStorage.getItem(STORAGE_KEY))||freshRoot();
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
  let pendingWardrobeFile=null;
  let wardrobeEditingId=null;
  let wardrobeEditingSnapshot=null;
  let wardrobeEditingOrderSnapshot=null;
  let wardrobeEditingWasSelected=false;
  let outfitDraft={layers:[]};
  let devSection="chapters";
  let devCollectionType="cards";
  let devSelectedId=null;
  let devSelectedInteractionId=null;
  let devStoryChapterId=null;
  let devStoryPointer=null;
  let devStoryPlacing=false;
  let saveMode="manage";
  let toastTimer=null;
  let dismissedUpdate=null;
  let pendingUpdateKey=null;
  let storySelectedItem=null;
  let storyIntroIndex=0;
  let storyIntroActive=false;
  let saveFallbackWarned=false;

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
    let serialized;
    try{serialized=JSON.stringify(root);}
    catch{
      toast("저장 데이터를 정리하지 못했습니다.");
      return false;
    }

    try{
      localStorage.setItem(STORAGE_KEY,serialized);
      try{sessionStorage.removeItem(SESSION_SAVE_KEY);}catch{}
      lastSavedRoot=serialized;
      renderHome();
      return true;
    }catch{}

    // 옷장 이미지 등으로 localStorage 용량이 부족해도 게임 진행 자체가 막히지 않도록
    // 같은 탭/브라우저 세션에서 유지되는 임시 저장소로 자동 우회합니다.
    try{
      sessionStorage.setItem(SESSION_SAVE_KEY,serialized);
      lastSavedRoot=serialized;
      renderHome();
      if(!saveFallbackWarned){
        saveFallbackWarned=true;
        toast("브라우저 저장 공간이 부족해 현재 세션에 임시 저장 중이에요.");
      }
      return true;
    }catch{}

    // 두 저장소가 모두 막힌 극단적인 경우에도 새 이야기는 현재 탭에서 계속 진행합니다.
    lastSavedRoot=serialized;
    renderHome();
    if(!saveFallbackWarned){
      saveFallbackWarned=true;
      toast("저장 공간을 사용할 수 없어 현재 탭에서만 진행됩니다.");
    }
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
      missions:[{id:"explore-party-room",title:"파티방을 둘러보자",done:false}],
      story:{scene:"party-room",inspected:[],introSeen:false},
      collection:{cards:["dreamer"],items:[],postcards:[]},
      outfit:{layers:[]}
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
    if(name!=="story"&&name!=="dev"&&devStoryChapterId){
      devStoryChapterId=null;
      devSelectedInteractionId=null;
      devStoryPointer=null;
      devStoryPlacing=false;
    }
    if(name==="collection") renderCollection();
    if(name==="chapters") renderChapters();
    if(name==="dev") renderDevSettings();
    if(name==="story") renderGameUI();
    if(name==="wardrobe"){
      const save=activeSave();
      outfitDraft=save
        ? {...validOutfit(save.outfit,save.collection?.items||[])}
        : {...developerOutfit()};
      outfitDraft.layers=[...(outfitDraft.layers||[])];
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

  const storyIntroSteps=[
    {phase:"dark",kind:"narration",text:"내일은 잠뜰님의 생일이다."},
    {phase:"dark",kind:"narration",text:"그래서 나는 오늘, 조금 일찍 이곳에 왔다."},
    {phase:"dark",kind:"narration",text:"이유는 간단하다."},
    {phase:"dark",kind:"narration",text:"생일 축하하러 왔을 뿐이다."},
    {phase:"dark",kind:"narration",text:"……정말 그것뿐이었는데."},

    {phase:"exterior",kind:"dialogue",speaker:"꿈뜰",text:"여기 맞겠지?"},
    {phase:"exterior",kind:"dialogue",speaker:"꿈뜰",text:"생각보다 조용한데……."},

    {phase:"exterior",kind:"house"},

    {phase:"door",kind:"dialogue",speaker:"수현",text:"잠깐만! 그 상자 거기 두면 안 돼!"},
    {phase:"door",kind:"dialogue",speaker:"공룡",text:"아니, 내가 안 뒀다니까?!"},
    {phase:"door",kind:"dialogue",speaker:"덕개",text:"그럼 바닥에 떨어진 리본은 누가 밟았는데?"},
    {phase:"door",kind:"dialogue",speaker:"라더",text:"잠깐, 다들 한 번만 멈춰봐!"},

    {phase:"door",kind:"narration",text:"익숙한 소음과 친근한 목소리다……"},
    {phase:"door",kind:"narration",text:"…잘 찾아온 것 같다."},

    {phase:"chapter",kind:"chapter",kicker:"CHAPTER 1",title:"생일 전날",text:"잠뜰님의 생일 파티를 준비하자."}
  ];

  function shouldPlayStoryIntro(save){
    return Boolean(save && save.story?.introSeen===false && !currentDevStoryChapter());
  }

  function renderStoryIntroStep(){
    const overlay=$("#story-intro");
    const step=storyIntroSteps[storyIntroIndex];
    if(!overlay||!step) return;

    const houseStep=step.kind==="house";
    overlay.classList.toggle("is-exterior",step.phase==="exterior");
    overlay.classList.toggle("is-door",step.phase==="door");
    overlay.classList.toggle("is-chapter",step.phase==="chapter");
    overlay.classList.toggle("is-dark",step.phase==="dark");
    overlay.classList.toggle("is-dialogue",step.kind==="dialogue");
    overlay.classList.toggle("is-narration",step.kind==="narration");
    overlay.classList.toggle("is-house-prompt",houseStep);

    const next=$("#story-intro-next");
    const house=$("#story-intro-house");
    const hint=$("#story-intro-hint-text");
    const copy=$(".story-intro-copy",overlay);

    if(next) next.disabled=houseStep;
    if(house){
      house.hidden=!houseStep;
      house.disabled=!houseStep;
    }
    if(hint) hint.textContent=houseStep?"집을 클릭해 가까이 가기":"CLICK / SPACE";

    $("#story-intro-kicker").textContent=step.speaker||step.kicker||"";
    $("#story-intro-title").textContent=step.title||"";
    $("#story-intro-text").textContent=step.text||"";
    $("#story-intro-voices").innerHTML="";

    if(copy){
      copy.hidden=houseStep;
      copy.classList.remove("is-reveal");
      if(!houseStep){
        void copy.offsetWidth;
        copy.classList.add("is-reveal");
      }
    }
  }

  function startStoryIntro(){
    const overlay=$("#story-intro");
    if(!overlay) return;
    closeStoryPanels();
    const dialogue=$("#story-dialogue");
    if(dialogue) dialogue.hidden=true;

    storyIntroIndex=0;
    storyIntroActive=true;
    overlay.hidden=false;
    overlay.classList.remove("is-approaching");

    const copy=$(".story-intro-copy",overlay);
    if(copy) copy.classList.remove("is-reveal");

    renderStoryIntroStep();
  }

  function approachStoryIntroHouse(){
    if(!storyIntroActive) return;
    const step=storyIntroSteps[storyIntroIndex];
    if(step?.kind!=="house") return;

    const overlay=$("#story-intro");
    const house=$("#story-intro-house");
    if(!overlay||overlay.classList.contains("is-approaching")) return;

    overlay.classList.add("is-approaching");
    if(house) house.disabled=true;

    window.setTimeout(()=>{
      if(!storyIntroActive) return;
      storyIntroIndex+=1;
      renderStoryIntroStep();
      overlay.classList.remove("is-approaching");
    },950);
  }

  function finishStoryIntro(){
    const overlay=$("#story-intro");
    storyIntroActive=false;
    storyIntroIndex=0;
    if(overlay){
      overlay.hidden=true;
      overlay.classList.remove("is-approaching");
    }

    const save=activeSave();
    if(save){
      save.story=save.story||{scene:"party-room",inspected:[]};
      save.story.introSeen=true;
      save.savedAt=Date.now();
      save.savedLabel=nowLabel();
      persist();
    }
    renderGameUI();
  }

  function advanceStoryIntro(){
    if(!storyIntroActive) return;
    const step=storyIntroSteps[storyIntroIndex];
    if(step?.kind==="house") return;

    if(storyIntroIndex<storyIntroSteps.length-1){
      storyIntroIndex+=1;
      renderStoryIntroStep();
      return;
    }
    finishStoryIntro();
  }

  function openStory(){
    const save=activeSave();
    if(!save) return;
    showView("story");
    if(shouldPlayStoryIntro(save)) startStoryIntro();
    else{
      const overlay=$("#story-intro");
      if(overlay) overlay.hidden=true;
      storyIntroActive=false;
    }
  }

  const storyHotspots={
    window:{label:"창문",text:"창밖은 조용한 밤이다. 아직 파티가 시작될 기색은 없다."},
    table:{label:"테이블",text:"넓은 테이블이 비어 있다. 케이크도 선물도 장식도 아직 아무것도 없다."},
    bookshelf:{label:"책장",text:"오래된 책과 작은 소품들이 정리되어 있다. 지금 당장 필요한 물건은 없어 보인다."},
    gramophone:{label:"축음기",text:"오래된 축음기다. 파티 때 음악을 틀 수 있을지도 모르겠다."}
  };

  function currentStoryObjective(save){
    return save?.missions?.find(mission=>!mission.done)?.title || "다음 준비를 기다리자.";
  }

  function storySay(label,text){
    const box=$("#story-dialogue");
    if(!box) return;
    $("#story-dialogue-label").textContent=label;
    $("#story-dialogue-text").textContent=text;
    box.hidden=false;
  }

  function closeStoryPanels(){
    ["story-inventory-panel","story-missions-panel","story-map-panel"].forEach(id=>{
      const node=$("#"+id);
      if(node) node.hidden=true;
    });
  }

  function toggleStoryPanel(type){
    const id={inventory:"story-inventory-panel",missions:"story-missions-panel",map:"story-map-panel"}[type];
    if(!id) return;
    const panel=$("#"+id);
    if(!panel) return;
    const willOpen=panel.hidden;
    closeStoryPanels();
    panel.hidden=!willOpen;
  }

  function inspectStoryHotspot(id){
    const save=activeSave();
    const data=storyHotspots[id];
    if(!save || !data) return;
    save.story=save.story||{scene:"party-room",inspected:[]};
    if(!save.story.inspected.includes(id)){
      save.story.inspected.push(id);
      const inspectedCore=["window","table","bookshelf","gramophone"].filter(key=>save.story.inspected.includes(key)).length;
      if(inspectedCore>=4){
        const mission=save.missions.find(entry=>entry.id==="explore-party-room");
        if(mission) mission.done=true;
        if(!save.missions.some(entry=>entry.id==="wait-crew")){
          save.missions.push({id:"wait-crew",title:"멤버들이 오면 생일 준비에 대해 물어보자",done:false});
        }
      }
      save.savedAt=Date.now();
      save.savedLabel=nowLabel();
      persist();
    }
    renderGameUI();
    storySay(data.label,data.text);
  }

  function selectStoryItem(itemId){
    const save=activeSave();
    if(!save?.collection?.items.includes(itemId)) return;
    storySelectedItem=storySelectedItem===itemId?null:itemId;
    renderGameUI();
    const item=catalogue.items.find(entry=>entry.id===itemId);
    if(item) storySay(item.name,item.desc||"가지고 있는 아이템이다.");
  }

  function quickStorySave(){
    const save=activeSave();
    if(!save) return;
    save.savedAt=Date.now();
    save.savedLabel=nowLabel();
    if(persist()) toast("현재 진행 상황을 저장했어요.");
  }

  function renderGameUI(){
    const save=activeSave();
    const devChapter=currentDevStoryChapter();
    if(!save&&!devChapter) return;

    $("#story-chapter-name").textContent=devChapter?.title||"생일 전날";
    $("#story-location-name").textContent=devChapter?"장면 편집":"파티방";
    $("#story-current-objective").textContent=devChapter?"상호작용을 실제 화면에서 배치하세요.":currentStoryObjective(save);

    const inventoryIds=Array.isArray(save?.collection?.items)?save.collection.items:[];
    $("#story-inventory-count").textContent=inventoryIds.length;

    const quick=$("#story-quick-inventory");
    quick.innerHTML=Array.from({length:5},(_,index)=>{
      const id=inventoryIds[index];
      if(!id) return '<button type="button" class="story-item-slot is-empty" aria-label="빈 인벤토리 칸"></button>';
      const item=catalogue.items.find(entry=>entry.id===id);
      return '<button type="button" class="story-item-slot '+(storySelectedItem===id?"is-selected":"")+'" data-story-item-id="'+escapeHTML(id)+'" title="'+escapeHTML(item?.name||"아이템")+'"><span>'+escapeHTML(item?.symbol||"□")+'</span></button>';
    }).join("");

    const inventory=$("#story-inventory-list");
    if(!inventoryIds.length){
      inventory.innerHTML='<div class="story-panel-empty"><span>□</span><b>가방이 비어 있어요</b><p>멤버들의 부탁을 해결하면 필요한 물건이 이곳에 들어옵니다.</p></div>';
    }else{
      inventory.innerHTML=inventoryIds.map(id=>{
        const item=catalogue.items.find(entry=>entry.id===id);
        return '<button type="button" class="story-inventory-card '+(storySelectedItem===id?"is-selected":"")+'" data-story-item-id="'+escapeHTML(id)+'"><span>'+escapeHTML(item?.symbol||"□")+'</span><div><b>'+escapeHTML(item?.name||"이름 없는 아이템")+'</b><small>'+escapeHTML(item?.type||"ITEM")+'</small></div></button>';
      }).join("");
    }

    const missionList=$("#story-mission-list");
    missionList.innerHTML=(save?.missions||[]).map(mission=>
      '<li class="'+(mission.done?"is-done":"")+'"><span>'+(mission.done?"✓":"○")+'</span><b>'+escapeHTML(mission.title)+'</b></li>'
    ).join("") || '<li><span>○</span><b>아직 등록된 목표가 없습니다.</b></li>';
    renderStoryDevEditor();
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
  function wardrobeGroupLabel(slot,group){
    return wardrobeGroups[slot]?.find(([id])=>id===group)?.[1]||"기타";
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
  function selectedLayerIds(){
    return orderedLayerIds(outfitDraft.layers||[]);
  }
  function renderWardrobePreview(){
    const preview=$("#wardrobe-preview");
    if(!preview) return;
    const parts=[];
    if(wardrobeAssets.base.image){
      parts.push('<img class="wardrobe-image-layer '+(wardrobeEditorTarget==="base"?"is-editing":"")+'" data-preview-layer="base" src="'+escapeHTML(wardrobeAssets.base.image)+'" alt="꿈뜰이 베이스" style="'+imageLayerStyle(wardrobeAssets.base.transform)+';z-index:1">');
    }
    selectedLayerIds().forEach((id,index)=>{
      parts.push(wardrobeLayerMarkup(wardrobeOptionByIdAny(id),id,2+index));
    });
    preview.innerHTML=parts.filter(Boolean).join("") || '<div class="wardrobe-preview-empty"><span aria-hidden="true">✧</span><p>베이스 이미지를 먼저 추가해 주세요.</p><small>PNG 투명 배경을 그대로 겹쳐서 사용할 수 있어요.</small></div>';
  }
  function currentEditorAsset(){
    if(wardrobeEditorTarget==="base") return wardrobeAssets.base;
    return wardrobeAssets.custom.find(item=>item.id===wardrobeEditorTarget)||null;
  }
  function visibleEditableLayers(){
    const selected=new Set(outfitDraft.layers||[]);
    const byId=new Map(wardrobeAssets.custom.filter(item=>selected.has(item.id)&&item.image).map(item=>[item.id,item]));
    return orderedLayerIds([...byId.keys()]).map(id=>byId.get(id)).filter(Boolean);
  }
  function renderUploadGroupOptions(slot=wardrobeSlot,selectedValue=null){
    const group=$("#wardrobe-part-group");
    if(!group) return;
    const targetSlot=wardrobeSlots.includes(slot)?slot:wardrobeSlot;
    const options=wardrobeGroups[targetSlot]||[];
    group.innerHTML=options.map(([id,label])=>'<option value="'+escapeHTML(id)+'">'+escapeHTML(label)+'</option>').join("");
    if(selectedValue && options.some(([id])=>id===selectedValue)) group.value=selectedValue;
  }

  function editingWardrobeAsset(){
    return wardrobeEditingId
      ? wardrobeAssets.custom.find(item=>item.id===wardrobeEditingId)||null
      : null;
  }

  function resetWardrobePartForm(){
    wardrobeEditingId=null;
    wardrobeEditingSnapshot=null;
    wardrobeEditingOrderSnapshot=null;
    wardrobeEditingWasSelected=false;
    pendingWardrobeFile=null;
    const file=$("#wardrobe-image-file");
    if(file) file.value="";
    const name=$("#wardrobe-image-name");
    if(name) name.value="";
    const fileName=$("#wardrobe-file-name");
    if(fileName) fileName.textContent="선택된 파일 없음";
    const heading=$("#wardrobe-upload-heading");
    if(heading) heading.textContent="새 파츠 등록";
    const actionLabel=$("#wardrobe-file-action-label");
    if(actionLabel) actionLabel.textContent="파일 선택";
    const add=$("#wardrobe-add-part-button");
    if(add){
      add.textContent="등록하고 켜기";
      add.disabled=true;
    }
    const cancel=$("#wardrobe-cancel-edit-button");
    if(cancel) cancel.hidden=true;
  }

  function syncWardrobePartEditForm(){
    const asset=editingWardrobeAsset();
    if(!asset) return;

    const heading=$("#wardrobe-upload-heading");
    if(heading) heading.textContent="파츠 수정";
    const actionLabel=$("#wardrobe-file-action-label");
    if(actionLabel) actionLabel.textContent="이미지 교체";

    const slot=$("#wardrobe-upload-slot");
    if(slot) slot.value=asset.slot;
    renderUploadGroupOptions(asset.slot,asset.group);

    const name=$("#wardrobe-image-name");
    if(name) name.value=asset.name||"";

    const fileName=$("#wardrobe-file-name");
    if(fileName) fileName.textContent=pendingWardrobeFile
      ? pendingWardrobeFile.name
      : "현재 이미지 유지 · 새 파일을 고르면 교체";

    const add=$("#wardrobe-add-part-button");
    if(add){
      add.textContent="수정 저장";
      add.disabled=false;
    }
    const cancel=$("#wardrobe-cancel-edit-button");
    if(cancel) cancel.hidden=false;
  }

  function beginWardrobePartEdit(id){
    const asset=wardrobeAssets.custom.find(item=>item.id===id);
    if(!asset) return;

    if(wardrobeEditingId && wardrobeEditingId!==id) cancelWardrobePartEdit(true);

    wardrobeEditingId=id;
    wardrobeEditingSnapshot=JSON.parse(JSON.stringify(asset));
    wardrobeEditingOrderSnapshot=[...wardrobeAssets.layerOrder];
    wardrobeEditingWasSelected=(outfitDraft.layers||[]).includes(id);
    pendingWardrobeFile=null;

    wardrobeSlot=asset.slot;
    wardrobeEditorTarget=id;
    if(!wardrobeAssets.layerOrder.includes(id)) wardrobeAssets.layerOrder.push(id);
    outfitDraft.layers=[...new Set([...(outfitDraft.layers||[]),id])];

    renderWardrobe();
    setUploadStatus(asset.name+" 파츠를 다시 수정 중이에요. 이미지 교체는 선택 사항입니다.","busy");

    const heading=$("#wardrobe-upload-heading");
    const section=heading?.closest?.(".wardrobe-dev-section");
    section?.scrollIntoView?.({behavior:"smooth",block:"center"});
  }

  function cancelWardrobePartEdit(silent=false){
    const id=wardrobeEditingId;
    if(id && wardrobeEditingSnapshot){
      const index=wardrobeAssets.custom.findIndex(item=>item.id===id);
      if(index>=0) wardrobeAssets.custom[index]=JSON.parse(JSON.stringify(wardrobeEditingSnapshot));
      if(Array.isArray(wardrobeEditingOrderSnapshot)) wardrobeAssets.layerOrder=[...wardrobeEditingOrderSnapshot];
      if(!wardrobeEditingWasSelected) outfitDraft.layers=(outfitDraft.layers||[]).filter(itemId=>itemId!==id);
      persistWardrobeAssets();
    }

    resetWardrobePartForm();
    if(wardrobeEditorTarget===id) wardrobeEditorTarget="base";
    renderWardrobe();
    if(!silent){
      setUploadStatus("수정을 취소했어요. 기존 파츠는 그대로 유지됩니다.","idle");
      toast("파츠 수정을 취소했어요.");
    }
  }

  function commitWardrobePartEdit(replacementImage=null){
    const asset=editingWardrobeAsset();
    if(!asset) return;

    const nameInput=$("#wardrobe-image-name");
    const typeInput=$("#wardrobe-upload-slot");
    const groupInput=$("#wardrobe-part-group");
    const targetSlot=wardrobeSlots.includes(typeInput?.value)?typeInput.value:asset.slot;
    const targetGroup=(wardrobeGroups[targetSlot]||[]).some(([id])=>id===groupInput?.value)
      ? groupInput.value
      : "other";
    const name=(nameInput?.value||asset.name||"내 파츠").trim().slice(0,40)||"내 파츠";

    const previous=JSON.parse(JSON.stringify(wardrobeAssets));
    asset.slot=targetSlot;
    asset.group=targetGroup;
    asset.name=name;
    if(replacementImage) asset.image=replacementImage;

    wardrobeSlot=targetSlot;
    wardrobeEditorTarget=asset.id;
    if(!wardrobeAssets.layerOrder.includes(asset.id)) wardrobeAssets.layerOrder.push(asset.id);
    if(!activeSave()) wardrobeAssets.setupOutfit=normalizeSetupOutfit(validOutfit(outfitDraft,[]));

    if(!persistWardrobeAssets(previous)){
      setUploadStatus("수정 저장에 실패했어요. 브라우저 저장 공간을 확인해 주세요.","error");
      return;
    }

    const id=asset.id;
    resetWardrobePartForm();
    wardrobeEditorTarget=id;
    renderWardrobe();
    setUploadStatus(wardrobeLabels[targetSlot]+" / "+wardrobeGroupLabel(targetSlot,targetGroup)+" · "+name+" 수정 완료","ok");
    toast(name+" 파츠 수정을 저장했어요.");
  }

  function saveWardrobePartEdit(){
    const asset=editingWardrobeAsset();
    if(!asset) return;
    if(pendingWardrobeFile){
      setUploadStatus("교체 이미지를 읽는 중…","busy");
      readImageFile(pendingWardrobeFile,image=>commitWardrobePartEdit(image));
      return;
    }
    commitWardrobePartEdit();
  }
  function renderWardrobeEditor(){
    const select=$("#wardrobe-layer-select");
    const layers=visibleEditableLayers();
    const validTarget=wardrobeEditorTarget==="base" || layers.some(item=>item.id===wardrobeEditorTarget);
    if(!validTarget) wardrobeEditorTarget="base";
    select.innerHTML='<option value="base">베이스 이미지 · 항상 맨 아래</option>'+layers.map((item,index)=>
      '<option value="'+escapeHTML(item.id)+'">'+(index+1)+' · '+escapeHTML(wardrobeLabels[item.slot])+' / '+escapeHTML(wardrobeGroupLabel(item.slot,item.group))+' · '+escapeHTML(item.name)+'</option>'
    ).join("");
    select.value=wardrobeEditorTarget;
    const asset=currentEditorAsset();
    const t=normalizeWardrobeTransform(asset?.transform);
    [["x",t.x],["y",t.y],["scale",t.scale],["rotation",t.rotation]].forEach(([key,value])=>{
      const input=$('[data-wardrobe-transform="'+key+'"]');
      const number=$('[data-wardrobe-transform-number="'+key+'"]');
      const output=$('[data-wardrobe-transform-value="'+key+'"]');
      if(input){input.value=String(value);input.disabled=!asset?.image}
      if(number){number.value=String(value);number.disabled=!asset?.image}
      if(output) output.textContent=key==="scale"?Math.round(value)+"%":key==="rotation"?Math.round(value)+"°":Math.round(value);
    });
    const isCustom=wardrobeEditorTarget!=="base" && Boolean(asset?.custom);
    $$("[data-layer-move]").forEach(button=>button.disabled=!isCustom);
    const order=$("#wardrobe-layer-order");
    if(order){
      const visible=visibleEditableLayers();
      const index=visible.findIndex(item=>item.id===wardrobeEditorTarget);
      order.textContent=wardrobeEditorTarget==="base"
        ? "베이스는 항상 맨 아래"
        : index>=0
          ? "현재 레이어 "+(index+1)+" / "+visible.length+" · 뒤쪽일수록 화면 위에 표시"
          : "적용된 파츠를 선택하세요.";
    }
    $("#wardrobe-reset-transform").disabled=!asset?.image;
    $("#wardrobe-delete-image").disabled=!asset?.image;
    $("#wardrobe-delete-image").textContent=wardrobeEditorTarget==="base"?"베이스 이미지 제거":"선택 파츠 삭제";
  }
  function renderWardrobe(){
    const save=activeSave();
    const owned=new Set(save?.collection?.items||[]);
    const selected=selectedLayerIds().map(id=>wardrobeOptionByIdAny(id)).filter(Boolean);
    const equipped=selected.map(item=>item.name).filter(Boolean);
    $("#wardrobe-slot-label").textContent=save?"SLOT "+(root.activeSlot+1):"DEV SETUP";
    $("#wardrobe-equipped").textContent=equipped.join(" · ")||"베이스만 표시";
    const selectedCount=$("#wardrobe-selected-count");
    if(selectedCount) selectedCount.textContent=selected.length+"개 적용 중";
    updateWardrobeStorageMeter();
    $("#wardrobe-save-button").disabled=false;
    $("#wardrobe-save-button").textContent=save?"이 모습 저장하기 ✦":"개발자 기본 모습 저장";
    $("#wardrobe-status").textContent=save
      ? "모든 분류에서 여러 파츠를 동시에 선택할 수 있어요. 저장하면 이 슬롯의 모습으로 기록됩니다."
      : "개발자 설정 모드예요. 세이브 없이 파츠를 등록·겹치기·순서 변경할 수 있고 선택은 자동 저장됩니다.";
    const uploadSlot=$("#wardrobe-upload-slot");
    if(uploadSlot) uploadSlot.value=wardrobeSlot;
    renderUploadGroupOptions();
    const tabNote=$("#wardrobe-tab-note");
    const notes={
      outfit:"의상은 상의·하의·신발·겉옷처럼 여러 레이어를 동시에 켤 수 있어요.",
      accessory:"소품은 캐릭터가 들거나 몸에 착용하는 물건이에요. 여러 개를 함께 켤 수 있어요.",
      face:"얼굴은 눈·입·눈썹·볼 같은 파츠를 따로 등록하고 여러 개를 겹칠 수 있어요.",
      decoration:"장식은 캐릭터 주변의 이펙트·스티커·꾸밈 요소예요. 여러 개를 함께 켤 수 있어요."
    };
    if(tabNote) tabNote.textContent=notes[wardrobeSlot]||"모든 파츠는 여러 개를 함께 선택할 수 있어요.";
    $$("[data-wardrobe-slot]").forEach(button=>{
      const active=button.dataset.wardrobeSlot===wardrobeSlot;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });
    const choices=wardrobeOptionsFor(wardrobeSlot);
    const emptyMessage="아직 등록된 "+wardrobeLabels[wardrobeSlot]+" 파츠가 없어요. 아래 개발자 도구에서 새 이미지를 추가할 수 있습니다.";
    $("#wardrobe-options").innerHTML=(choices.length?choices.map(option=>{
      const unlocked=wardrobeOptionUnlocked(option,owned);
      const selected=(outfitDraft.layers||[]).includes(option.id);
      const editing=wardrobeEditingId===option.id;
      const art=option.image?'<img src="'+escapeHTML(option.image)+'" alt="">':escapeHTML(unlocked?(option.symbol||"IMG"):"?");
      const group=option.custom?'<em class="wardrobe-option-group">'+escapeHTML(wardrobeGroupLabel(option.slot,option.group))+'</em>':"";
      const main='<button type="button" data-wardrobe-item="'+escapeHTML(option.id)+'" class="wardrobe-option '+(selected?"is-selected ":"")+(unlocked?"":"is-locked")+'" aria-pressed="'+selected+'" '+(unlocked?"":"disabled")+'><span class="wardrobe-option-art">'+art+'</span>'+group+'<b>'+escapeHTML(unlocked?option.name:"???")+'</b><small>'+(editing?"수정 중":selected?"레이어 켜짐":unlocked?(option.custom?"눌러서 함께 적용":"획득한 파츠"):"여행 중 발견")+'</small></button>';
      const edit=option.custom?'<button type="button" class="wardrobe-option-edit '+(editing?"is-active":"")+'" data-wardrobe-edit="'+escapeHTML(option.id)+'">'+(editing?"수정 중":"수정")+'</button>':"";
      return '<div class="wardrobe-option-wrap '+(editing?"is-editing":"")+'">'+main+edit+'</div>';
    }).join(""):"")+(choices.length===0?'<p class="wardrobe-empty">'+emptyMessage+'</p>':"");
    renderWardrobePreview();
    renderWardrobeEditor();
    if(wardrobeEditingId) syncWardrobePartEditForm();
  }
  function optimizeWardrobeDataURL(original,callback){
    if(!original || original.length<850000 || typeof Image==="undefined"){
      callback(original);
      return;
    }
    try{
      const image=new Image();
      image.onload=()=>{
        try{
          const maxSide=1400;
          const ratio=Math.min(1,maxSide/Math.max(image.naturalWidth||image.width||1,image.naturalHeight||image.height||1));
          const canvas=document.createElement("canvas");
          if(typeof canvas.getContext!=="function"){callback(original);return}
          canvas.width=Math.max(1,Math.round((image.naturalWidth||image.width||1)*ratio));
          canvas.height=Math.max(1,Math.round((image.naturalHeight||image.height||1)*ratio));
          const context=canvas.getContext("2d");
          if(!context){callback(original);return}
          context.clearRect(0,0,canvas.width,canvas.height);
          context.drawImage(image,0,0,canvas.width,canvas.height);
          let optimized="";
          try{optimized=canvas.toDataURL("image/webp",0.9)}catch{}
          if(!optimized || !optimized.startsWith("data:image/") || optimized.length>=original.length){
            try{optimized=canvas.toDataURL("image/png")}catch{}
          }
          callback(optimized && optimized.length<original.length ? optimized : original);
        }catch{
          callback(original);
        }
      };
      image.onerror=()=>callback(original);
      image.src=original;
    }catch{
      callback(original);
    }
  }
  function readImageFile(file,callback){
    if(!file) return;
    if(!/^image\/(png|webp|jpeg)$/i.test(file.type||"")){
      setUploadStatus("PNG, WEBP, JPG 파일만 등록할 수 있어요.","error");
      toast("PNG, WEBP, JPG 이미지만 추가할 수 있어요.");
      return;
    }
    if(file.size>8000000){
      setUploadStatus("파일이 너무 커요. 8MB 이하 파일을 사용해 주세요.","error");
      toast("이미지 한 장은 8MB 이하만 등록할 수 있어요.");
      return;
    }
    const reader=new FileReader();
    reader.onload=()=>optimizeWardrobeDataURL(String(reader.result||""),callback);
    reader.onerror=()=>{
      setUploadStatus("이미지를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.","error");
      toast("이미지를 읽지 못했습니다.");
    };
    reader.readAsDataURL(file);
  }
  function setUploadStatus(message,state="ok"){
    const node=$("#wardrobe-upload-status");
    if(!node) return;
    node.textContent=message;
    node.dataset.state=state;
  }
  function setBaseImage(file){
    setUploadStatus("베이스 이미지를 읽는 중…","busy");
    readImageFile(file,image=>{
      const previous=JSON.parse(JSON.stringify(wardrobeAssets));
      wardrobeAssets.base={image,name:"베이스",transform:{...defaultTransform}};
      wardrobeEditorTarget="base";
      if(!persistWardrobeAssets(previous)){setUploadStatus("저장 실패 · 브라우저 저장 공간을 확인해 주세요.","error");return}
      renderWardrobe();
      setUploadStatus("베이스 이미지 등록 완료","ok");
      toast("베이스 이미지를 등록했어요.");
    });
  }
  function addWardrobeImage(file){
    setUploadStatus("새 파츠 이미지를 읽는 중…","busy");
    readImageFile(file,image=>{
      const nameInput=$("#wardrobe-image-name");
      const typeInput=$("#wardrobe-upload-slot");
      const groupInput=$("#wardrobe-part-group");
      const targetSlot=wardrobeSlots.includes(typeInput?.value)?typeInput.value:wardrobeSlot;
      const targetGroup=groupInput?.value||"other";
      const fileName=String(file?.name||"").replace(/\.[^.]+$/,"");
      const name=(nameInput?.value||fileName||"내 파츠").trim().slice(0,40)||"내 파츠";
      const id="custom-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
      const previous=JSON.parse(JSON.stringify(wardrobeAssets));
      const asset={id,slot:targetSlot,group:targetGroup,name,symbol:"IMG",image,custom:true,transform:{...defaultTransform}};
      wardrobeAssets.custom.push(asset);
      wardrobeAssets.layerOrder.push(id);
      wardrobeSlot=targetSlot;
      outfitDraft.layers=[...new Set([...(outfitDraft.layers||[]),id])];
      wardrobeEditorTarget=id;
      if(!activeSave()) wardrobeAssets.setupOutfit=normalizeSetupOutfit(validOutfit(outfitDraft,[]));
      if(!persistWardrobeAssets(previous)){
        outfitDraft=activeSave()?validOutfit(outfitDraft,activeSave()?.collection?.items||[]):developerOutfit();
        setUploadStatus("등록 실패 · 저장 공간이 부족할 수 있어요.","error");
        return;
      }
      if(nameInput) nameInput.value="";
      const upload=$("#wardrobe-image-file");if(upload) upload.value="";
      pendingWardrobeFile=null;
      const fileNameNode=$("#wardrobe-file-name");if(fileNameNode) fileNameNode.textContent="선택된 파일 없음";
      const addButton=$("#wardrobe-add-part-button");if(addButton) addButton.disabled=true;
      renderWardrobe();
      setUploadStatus(wardrobeLabels[targetSlot]+" / "+wardrobeGroupLabel(targetSlot,targetGroup)+" · "+name+" 등록 및 적용 완료","ok");
      toast(name+" 파츠를 등록하고 바로 적용했어요.");
    });
  }
  function updateWardrobeTransform(key,value,persist=false){
    const asset=currentEditorAsset();
    if(!asset?.image) return;
    const ranges={x:[-100,100,0],y:[-100,100,0],scale:[20,300,100],rotation:[-180,180,0]};
    const [min,max,fallback]=ranges[key]||[0,0,0];
    asset.transform={...normalizeWardrobeTransform(asset.transform),[key]:clampNumber(value,min,max,fallback)};
    renderWardrobePreview();
    const range=$('[data-wardrobe-transform="'+key+'"]');
    const number=$('[data-wardrobe-transform-number="'+key+'"]');
    const output=$('[data-wardrobe-transform-value="'+key+'"]');
    const next=asset.transform[key];
    if(range) range.value=String(next);
    if(number) number.value=String(next);
    if(output) output.textContent=key==="scale"?Math.round(next)+"%":key==="rotation"?Math.round(next)+"°":Math.round(next);
    if(persist) persistWardrobeAssets();
  }
  function moveWardrobeLayer(mode){
    if(wardrobeEditorTarget==="base") return;
    const order=wardrobeAssets.layerOrder;
    const index=order.indexOf(wardrobeEditorTarget);
    if(index<0) return;
    let target=index;
    if(mode==="up") target=Math.min(order.length-1,index+1);
    if(mode==="down") target=Math.max(0,index-1);
    if(mode==="top") target=order.length-1;
    if(mode==="bottom") target=0;
    if(target===index) return;
    const [id]=order.splice(index,1);
    order.splice(target,0,id);
    persistWardrobeAssets();
    renderWardrobe();
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
      setUploadStatus("베이스 이미지를 제거했어요.","ok");
      toast("베이스 이미지를 제거했어요.");
      return;
    }
    const id=wardrobeEditorTarget;
    const removed=wardrobeAssets.custom.find(item=>item.id===id);
    if(wardrobeEditingId===id){
      wardrobeEditingId=null;
      wardrobeEditingSnapshot=null;
      wardrobeEditingOrderSnapshot=null;
      pendingWardrobeFile=null;
    }
    wardrobeAssets.custom=wardrobeAssets.custom.filter(item=>item.id!==id);
    wardrobeAssets.layerOrder=wardrobeAssets.layerOrder.filter(itemId=>itemId!==id);
    outfitDraft.layers=(outfitDraft.layers||[]).filter(itemId=>itemId!==id);
    wardrobeEditorTarget="base";
    if(!activeSave()) wardrobeAssets.setupOutfit=normalizeSetupOutfit(validOutfit(outfitDraft,[]));
    persistWardrobeAssets();
    renderWardrobe();
    setUploadStatus((removed?.name||"이미지")+" 삭제 완료","ok");
    toast((removed?.name||"이미지")+"를 삭제했어요.");
  }

  function saveOutfit(){
    const save=activeSave();
    if(!save){
      if(rememberDeveloperOutfit()) toast("현재 모습을 개발자 기본 설정으로 저장했어요.");
      renderWardrobe();
      return;
    }
    save.outfit=validOutfit(outfitDraft,save.collection.items);
    save.savedAt=Date.now();
    save.savedLabel=nowLabel();
    if(!persist()){
      outfitDraft=validOutfit(activeSave()?.outfit,activeSave()?.collection?.items||[]);
      outfitDraft.layers=[...(outfitDraft.layers||[])];
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


  const devSchemas={
    chapters:[
      {key:"id",label:"ID",type:"text",placeholder:"chapter-id"},
      {key:"no",label:"번호",type:"text",placeholder:"01"},
      {key:"label",label:"라벨",type:"text",placeholder:"CHAPTER 01"},
      {key:"title",label:"제목",type:"text",placeholder:"챕터 제목"},
      {key:"desc",label:"설명",type:"textarea",placeholder:"챕터 설명"}
    ],
    cards:[
      {key:"id",label:"ID",type:"text",placeholder:"character-id"},
      {key:"name",label:"이름",type:"text",placeholder:"인물 이름"},
      {key:"type",label:"분류 TYPE",type:"text",placeholder:"PERSON / FAIRY / CREATURE"},
      {key:"symbol",label:"표시 문자",type:"text",placeholder:"잠"},
      {key:"color",label:"색상",type:"color"},
      {key:"world",label:"상황극·세계",type:"text",placeholder:"비우면 기본 인물"},
      {key:"desc",label:"설명",type:"textarea",placeholder:"카드 설명"},
      {key:"memo",label:"꿈뜰이 메모",type:"textarea",placeholder:"카드 메모"}
    ],
    postcards:[
      {key:"id",label:"ID",type:"text",placeholder:"postcard-id"},
      {key:"name",label:"이름",type:"text",placeholder:"엽서 제목"},
      {key:"type",label:"분류 TYPE",type:"text",placeholder:"STORY POSTCARD"},
      {key:"symbol",label:"표시 문자",type:"text",placeholder:"✦"},
      {key:"color",label:"색상",type:"color"},
      {key:"desc",label:"설명",type:"textarea",placeholder:"엽서 설명"},
      {key:"caption",label:"캡션",type:"textarea",placeholder:"엽서 한마디"}
    ],
    items:[
      {key:"id",label:"ID",type:"text",placeholder:"item-id"},
      {key:"name",label:"아이템 이름",type:"text",placeholder:"아이템 이름"},
      {key:"type",label:"종류 TYPE",type:"text",placeholder:"KEY ITEM / MEMENTO / GIFT"},
      {key:"symbol",label:"표시 문자",type:"text",placeholder:"✦"},
      {key:"color",label:"색상",type:"color"},
      {key:"desc",label:"아이템 설명",type:"textarea",placeholder:"인벤토리와 컬렉션에 표시되는 설명"},
      {key:"wardrobeSlot",label:"옷장 분류",type:"select",options:[["","사용 안 함"],["outfit","옷"],["accessory","소품"],["face","얼굴"],["decoration","장식"]]},
      {key:"wardrobeGroup",label:"옷장 세부 파츠",type:"text",placeholder:"예: top / eyes / hand"}
    ]
  };

  const interactionSchema=[
    {key:"id",label:"상호작용 ID",type:"text",placeholder:"inspect-window"},
    {key:"type",label:"종류",type:"select",options:[["inspect","조사"],["talk","대화"],["pickup","획득"],["move","이동"],["use","아이템 사용"],["choice","선택지"]]},
    {key:"label",label:"화면 표시 이름",type:"text",placeholder:"창문 조사"},
    {key:"target",label:"대상 ID",type:"text",placeholder:"window / npc-name"},
    {key:"scene",label:"장소·장면 ID",type:"text",placeholder:"party-room"},
    {key:"x",label:"X 위치 %",type:"number",min:0,max:100,step:1},
    {key:"y",label:"Y 위치 %",type:"number",min:0,max:100,step:1},
    {key:"width",label:"가로 크기 %",type:"number",min:1,max:100,step:1},
    {key:"height",label:"세로 크기 %",type:"number",min:1,max:100,step:1},
    {key:"text",label:"실행 시 대사·설명",type:"textarea",placeholder:"상호작용했을 때 보여줄 문장"},
    {key:"condition",label:"실행 조건",type:"textarea",placeholder:"예: item:key 보유 / interaction:abc 완료"},
    {key:"rewardItem",label:"획득 아이템 ID",type:"text",placeholder:"비우면 보상 없음"},
    {key:"next",label:"다음 장면·상호작용 ID",type:"text",placeholder:"선택 사항"},
    {key:"note",label:"개발 메모",type:"textarea",placeholder:"연출, 효과음, 애니메이션 등 메모"}
  ];

  function currentDevKey(){
    return devSection==="collection"?devCollectionType:devSection;
  }

  function currentDevEntries(){
    const key=currentDevKey();
    return devContent[key]||[];
  }

  function devEntryTitle(entry,key=currentDevKey()){
    if(key==="chapters") return entry.title||entry.id||"이름 없는 챕터";
    return entry.name||entry.id||"이름 없는 항목";
  }

  function devNewTemplate(key){
    const id=key.replace(/s$/,"")+"-"+Date.now().toString(36);
    const templates={
      chapters:{id,no:String((devContent.chapters.length+1)).padStart(2,"0"),label:"CHAPTER",title:"새 챕터",desc:"",interactions:[]},
      cards:{id,name:"새 카드",type:"PERSON",symbol:"?",color:"#7894a5",world:"",desc:"",memo:""},
      postcards:{id,name:"새 엽서",type:"STORY POSTCARD",symbol:"✦",color:"#7894a5",desc:"",caption:""},
      items:{id,name:"새 아이템",type:"MEMENTO",symbol:"✦",color:"#7894a5",desc:"",wardrobeSlot:"",wardrobeGroup:""}
    };
    return templates[key]||{id};
  }

  function devFieldMarkup(field,value){
    const safe=value==null?"":String(value);
    if(field.type==="textarea"){
      return '<label class="dev-field dev-field--wide"><span>'+escapeHTML(field.label)+'</span><textarea data-dev-field="'+escapeHTML(field.key)+'" placeholder="'+escapeHTML(field.placeholder||"")+'">'+escapeHTML(safe)+'</textarea></label>';
    }
    if(field.type==="select"){
      const options=(field.options||[]).map(([id,label])=>'<option value="'+escapeHTML(id)+'" '+(safe===id?"selected":"")+'>'+escapeHTML(label)+'</option>').join("");
      return '<label class="dev-field"><span>'+escapeHTML(field.label)+'</span><select data-dev-field="'+escapeHTML(field.key)+'">'+options+'</select></label>';
    }
    const type=field.type==="color"?"color":field.type==="number"?"number":"text";
    const fallback=type==="color" && !/^#[0-9a-f]{6}$/i.test(safe)?"#7894a5":safe;
    const numeric=type==="number"?' min="'+escapeHTML(field.min??"")+'" max="'+escapeHTML(field.max??"")+'" step="'+escapeHTML(field.step??1)+'"':"";
    return '<label class="dev-field"><span>'+escapeHTML(field.label)+'</span><input type="'+type+'" data-dev-field="'+escapeHTML(field.key)+'" value="'+escapeHTML(fallback)+'" placeholder="'+escapeHTML(field.placeholder||"")+'"'+numeric+'></label>';
  }

  function renderDevSettings(){
    $$("[data-dev-section]").forEach(button=>{
      const active=button.dataset.devSection===devSection;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });
    const collectionTypes=$("#dev-collection-types");
    collectionTypes.hidden=devSection!=="collection";
    $$("[data-dev-collection-type]").forEach(button=>{
      const active=button.dataset.devCollectionType===devCollectionType;
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",active?"true":"false");
    });

    const key=currentDevKey();
    const entries=currentDevEntries();
    if(!devSelectedId || !entries.some(entry=>String(entry.id)===String(devSelectedId))){
      devSelectedId=entries[0]?.id||null;
    }
    const selected=entries.find(entry=>String(entry.id)===String(devSelectedId))||null;
    const sectionNames={chapters:"챕터",cards:"컬렉션 카드",postcards:"컬렉션 엽서",items:"아이템"};
    $("#dev-current-section").textContent=sectionNames[key]||key;
    $("#dev-entry-count").textContent=entries.length+"개";
    $("#dev-entry-list").innerHTML=entries.length
      ? entries.map(entry=>'<button type="button" data-dev-entry="'+escapeHTML(entry.id||"")+'" class="'+(String(entry.id)===String(devSelectedId)?"is-active":"")+'"><b>'+escapeHTML(devEntryTitle(entry,key))+'</b><small>'+escapeHTML(entry.id||"NO ID")+'</small></button>').join("")
      : '<p class="dev-empty">아직 등록된 항목이 없습니다.</p>';

    const schema=devSchemas[key]||[];
    $("#dev-editor-title").textContent=selected?"수정 · "+devEntryTitle(selected,key):"항목을 선택하세요";
    $("#dev-editor-fields").innerHTML=selected
      ? schema.map(field=>devFieldMarkup(field,selected[field.key])).join("")
      : '<div class="dev-editor-empty">왼쪽에서 항목을 선택하거나 + 새 항목을 눌러 주세요.</div>';
    $("#dev-save-entry").disabled=!selected;
    $("#dev-delete-entry").disabled=!selected;
    $("#dev-save-status").textContent="브라우저 개발 설정 · "+entries.length+"개";
    const sceneButton=$("#dev-open-chapter-scene");
    if(sceneButton){
      sceneButton.hidden=key!=="chapters"||!selected;
      sceneButton.disabled=key!=="chapters"||!selected;
    }
  }

  function currentDevStoryChapter(){
    return devContent.chapters.find(chapter=>String(chapter.id)===String(devStoryChapterId))||null;
  }

  function currentDevStoryInteraction(){
    const chapter=currentDevStoryChapter();
    return chapter?.interactions?.find(interaction=>String(interaction.id)===String(devSelectedInteractionId))||null;
  }

  function normalizeVisualInteraction(interaction){
    const width=clampNumber(interaction.width,3,80,12);
    const height=clampNumber(interaction.height,3,80,12);
    return {
      ...interaction,
      x:clampNumber(interaction.x,0,100-width,44),
      y:clampNumber(interaction.y,0,100-height,42),
      width,
      height
    };
  }

  function newChapterInteractionAt(x=44,y=42){
    return normalizeVisualInteraction({
      id:"interaction-"+Date.now().toString(36),
      type:"inspect",
      label:"새 상호작용",
      target:"",
      scene:"party-room",
      x,y,width:12,height:12,
      text:"",
      condition:"",
      rewardItem:"",
      next:"",
      note:""
    });
  }

  function storyInteractionFieldMarkup(field,value){
    const safe=value==null?"":String(value);
    if(field.type==="textarea"){
      return '<label class="story-dev-field story-dev-field--wide"><span>'+escapeHTML(field.label)+'</span><textarea data-story-dev-field="'+escapeHTML(field.key)+'" placeholder="'+escapeHTML(field.placeholder||"")+'">'+escapeHTML(safe)+'</textarea></label>';
    }
    if(field.type==="select"){
      const options=(field.options||[]).map(([id,label])=>'<option value="'+escapeHTML(id)+'" '+(safe===id?"selected":"")+'>'+escapeHTML(label)+'</option>').join("");
      return '<label class="story-dev-field"><span>'+escapeHTML(field.label)+'</span><select data-story-dev-field="'+escapeHTML(field.key)+'">'+options+'</select></label>';
    }
    const type=field.type==="number"?"number":"text";
    const numeric=type==="number"?' min="'+escapeHTML(field.min??"")+'" max="'+escapeHTML(field.max??"")+'" step="'+escapeHTML(field.step??1)+'"':"";
    return '<label class="story-dev-field"><span>'+escapeHTML(field.label)+'</span><input type="'+type+'" data-story-dev-field="'+escapeHTML(field.key)+'" value="'+escapeHTML(safe)+'" placeholder="'+escapeHTML(field.placeholder||"")+'"'+numeric+'></label>';
  }

  function setStoryDevStatus(message){
    const node=$("#story-dev-status");
    if(node) node.textContent=message;
  }

  function syncStoryDevSelection(){
    const layer=$("#story-dev-layer");
    if(!layer) return;
    $$("[data-story-dev-interaction]",layer).forEach(box=>{
      box.classList.toggle("is-selected",box.dataset.storyDevInteraction===String(devSelectedInteractionId));
    });
  }

  function renderStoryDevInspector(){
    const inspector=$("#story-dev-inspector");
    if(!inspector) return;
    const interaction=currentDevStoryInteraction();
    inspector.hidden=!devStoryChapterId;
    $("#story-dev-save-interaction").disabled=!interaction;
    $("#story-dev-delete-interaction").disabled=!interaction;
    $("#story-dev-interaction-title").textContent=interaction?(interaction.label||interaction.id):"상호작용을 선택하세요";
    const fields=$("#story-dev-fields");
    if(!interaction){
      fields.innerHTML='<div class="story-dev-empty">왼쪽 화면의 상호작용 박스를 선택하거나 + 상호작용 추가를 눌러 주세요.</div>';
      $("#story-dev-position").textContent="선택 없음";
      return;
    }
    const normalized=normalizeVisualInteraction(interaction);
    Object.assign(interaction,normalized);
    $("#story-dev-position").textContent="X "+Math.round(interaction.x)+" · Y "+Math.round(interaction.y)+" · W "+Math.round(interaction.width)+" · H "+Math.round(interaction.height);
    fields.innerHTML=interactionSchema.map(field=>storyInteractionFieldMarkup(field,interaction[field.key])).join("");
  }

  function renderStoryDevLayer(){
    const layer=$("#story-dev-layer");
    const chapter=currentDevStoryChapter();
    if(!layer) return;
    layer.hidden=!chapter;
    if(!chapter) return;
    chapter.interactions=normalizeChapterInteractions(chapter.interactions).map(normalizeVisualInteraction);
    layer.classList.toggle("is-placing",devStoryPlacing);
    layer.innerHTML=chapter.interactions.map((interaction,index)=>{
      const selected=String(interaction.id)===String(devSelectedInteractionId);
      const style="left:"+interaction.x+"%;top:"+interaction.y+"%;width:"+interaction.width+"%;height:"+interaction.height+"%;";
      return '<button type="button" class="story-dev-hotspot '+(selected?"is-selected":"")+'" data-story-dev-interaction="'+escapeHTML(interaction.id)+'" style="'+style+'"><span><em>'+(index+1)+'</em>'+escapeHTML(interaction.label||interaction.id)+'</span><i data-story-dev-resize aria-hidden="true"></i></button>';
    }).join("");
  }

  function renderStoryDevEditor(){
    const chapter=currentDevStoryChapter();
    const active=Boolean(chapter);
    const room=$("#story-room");
    const stage=$(".story-stage");
    room?.classList.toggle("is-dev-editing",active);
    stage?.classList.toggle("is-dev-editing",active);
    const toolbar=$("#story-dev-toolbar");
    if(toolbar) toolbar.hidden=!active;
    const inspector=$("#story-dev-inspector");
    if(inspector) inspector.hidden=!active;
    if(!active){
      const layer=$("#story-dev-layer");
      if(layer) layer.hidden=true;
      return;
    }
    chapter.interactions=normalizeChapterInteractions(chapter.interactions);
    if(devSelectedInteractionId && !chapter.interactions.some(item=>String(item.id)===String(devSelectedInteractionId))){
      devSelectedInteractionId=null;
    }
    $("#story-dev-chapter-title").textContent=(chapter.label||"CHAPTER")+" · "+(chapter.title||chapter.id);
    setStoryDevStatus(devStoryPlacing?"화면에서 상호작용을 설치할 위치를 클릭하세요.":"박스를 드래그해서 위치를 옮기고 ● 핸들로 크기를 바꿔요.");
    renderStoryDevLayer();
    renderStoryDevInspector();
  }

  function openChapterSceneEditor(){
    if(currentDevKey()!=="chapters") return;
    const chapter=devContent.chapters.find(entry=>String(entry.id)===String(devSelectedId));
    if(!chapter) return;
    chapter.interactions=normalizeChapterInteractions(chapter.interactions);
    devStoryChapterId=chapter.id;
    devSelectedInteractionId=chapter.interactions[0]?.id||null;
    devStoryPlacing=false;
    closeStoryPanels();
    showView("story");
    renderGameUI();
  }

  function closeChapterSceneEditor(){
    devStoryChapterId=null;
    devSelectedInteractionId=null;
    devStoryPointer=null;
    devStoryPlacing=false;
    showView("dev");
  }

  function enterCurrentStorySceneEditor(){
    if(devStoryChapterId){
      renderStoryDevEditor();
      return;
    }
    const save=activeSave();
    const preferredId=save?.story?.scene==="party-room"?"night":devSelectedId;
    const chapter=devContent.chapters.find(entry=>String(entry.id)===String(preferredId))||devContent.chapters[0];
    if(!chapter) return;
    chapter.interactions=normalizeChapterInteractions(chapter.interactions);
    devStoryChapterId=chapter.id;
    devSelectedId=chapter.id;
    devSelectedInteractionId=chapter.interactions[0]?.id||null;
    devStoryPlacing=false;
    renderGameUI();
  }

  function startStoryInteractionPlacement(){
    if(!currentDevStoryChapter()) return;
    devStoryPlacing=true;
    renderStoryDevEditor();
  }

  function placeStoryInteraction(event){
    if(!devStoryPlacing) return false;
    const layer=$("#story-dev-layer");
    const chapter=currentDevStoryChapter();
    if(!layer||!chapter) return false;
    const rect=layer.getBoundingClientRect();
    const width=12, height=12;
    const px=((event.clientX-rect.left)/Math.max(1,rect.width))*100;
    const py=((event.clientY-rect.top)/Math.max(1,rect.height))*100;
    const interaction=newChapterInteractionAt(
      clampNumber(px-width/2,0,100-width,44),
      clampNumber(py-height/2,0,100-height,42)
    );
    chapter.interactions.push(interaction);
    devSelectedInteractionId=interaction.id;
    devStoryPlacing=false;
    persistDevContent();
    renderStoryDevEditor();
    toast("상호작용을 화면에 추가했어요.");
    return true;
  }

  function beginStoryInteractionPointer(event,id,mode){
    const chapter=currentDevStoryChapter();
    const interaction=chapter?.interactions?.find(item=>String(item.id)===String(id));
    const layer=$("#story-dev-layer");
    if(!interaction||!layer) return;
    const normalized=normalizeVisualInteraction(interaction);
    Object.assign(interaction,normalized);
    devSelectedInteractionId=interaction.id;
    const rect=layer.getBoundingClientRect();
    devStoryPointer={
      mode,
      id:interaction.id,
      startClientX:event.clientX,
      startClientY:event.clientY,
      startX:interaction.x,
      startY:interaction.y,
      startWidth:interaction.width,
      startHeight:interaction.height,
      rect
    };
    syncStoryDevSelection();
    renderStoryDevInspector();
    event.preventDefault();
  }

  function updateStoryInteractionPointer(event){
    if(!devStoryPointer) return;
    const interaction=currentDevStoryChapter()?.interactions?.find(item=>String(item.id)===String(devStoryPointer.id));
    if(!interaction) return;
    const rect=devStoryPointer.rect;
    const dx=((event.clientX-devStoryPointer.startClientX)/Math.max(1,rect.width))*100;
    const dy=((event.clientY-devStoryPointer.startClientY)/Math.max(1,rect.height))*100;
    if(devStoryPointer.mode==="resize"){
      interaction.width=clampNumber(devStoryPointer.startWidth+dx,3,100-interaction.x,devStoryPointer.startWidth);
      interaction.height=clampNumber(devStoryPointer.startHeight+dy,3,100-interaction.y,devStoryPointer.startHeight);
    }else{
      interaction.x=clampNumber(devStoryPointer.startX+dx,0,100-interaction.width,devStoryPointer.startX);
      interaction.y=clampNumber(devStoryPointer.startY+dy,0,100-interaction.height,devStoryPointer.startY);
    }
    const layer=$("#story-dev-layer");
    const box=$$("[data-story-dev-interaction]",layer).find(node=>node.dataset.storyDevInteraction===String(interaction.id));
    if(box){
      box.style.left=interaction.x+"%";
      box.style.top=interaction.y+"%";
      box.style.width=interaction.width+"%";
      box.style.height=interaction.height+"%";
    }
    $("#story-dev-position").textContent="X "+Math.round(interaction.x)+" · Y "+Math.round(interaction.y)+" · W "+Math.round(interaction.width)+" · H "+Math.round(interaction.height);
  }

  function finishStoryInteractionPointer(){
    if(!devStoryPointer) return;
    devStoryPointer=null;
    persistDevContent();
    renderStoryDevEditor();
  }

  function saveStoryInteractionDetails(){
    const chapter=currentDevStoryChapter();
    const interaction=currentDevStoryInteraction();
    if(!chapter||!interaction) return;
    const next={...interaction};
    $$("[data-story-dev-field]",$("#story-dev-fields")).forEach(field=>{
      const key=field.dataset.storyDevField;
      next[key]=["x","y","width","height"].includes(key)?Number(field.value):field.value;
    });
    next.id=String(next.id||"").trim();
    if(!next.id){toast("상호작용 ID는 비워둘 수 없습니다.");return}
    if(chapter.interactions.some(item=>item!==interaction&&String(item.id)===next.id)){
      toast("같은 상호작용 ID가 이미 있습니다.");
      return;
    }
    Object.assign(interaction,normalizeVisualInteraction(next));
    devSelectedInteractionId=interaction.id;
    if(persistDevContent()){
      renderStoryDevEditor();
      toast("상호작용 세부 설정을 저장했어요.");
    }
  }

  function deleteStoryInteraction(){
    const chapter=currentDevStoryChapter();
    const interaction=currentDevStoryInteraction();
    if(!chapter||!interaction) return;
    if(!window.confirm((interaction.label||interaction.id)+" 상호작용을 삭제할까요?")) return;
    const index=chapter.interactions.indexOf(interaction);
    chapter.interactions.splice(index,1);
    devSelectedInteractionId=chapter.interactions[Math.min(index,chapter.interactions.length-1)]?.id||null;
    persistDevContent();
    renderStoryDevEditor();
    toast("상호작용을 삭제했어요.");
  }

  function createDevEntry(){
    const key=currentDevKey();
    const entry=devNewTemplate(key);
    devContent[key].push(entry);
    devSelectedId=entry.id;
    devSelectedInteractionId=null;
    if(persistDevContent()){
      renderDevSettings();
      toast("새 "+(key==="items"?"아이템":"항목")+"을 만들었습니다.");
    }
  }

  function saveDevEntry(){
    const key=currentDevKey();
    const entries=devContent[key]||[];
    const index=entries.findIndex(entry=>String(entry.id)===String(devSelectedId));
    if(index<0) return;
    const original=entries[index];
    const next={...original};
    $$("[data-dev-field]",$("#dev-editor-fields")).forEach(field=>{
      next[field.dataset.devField]=field.value;
    });
    next.id=String(next.id||"").trim();
    if(!next.id){
      toast("ID는 비워둘 수 없습니다.");
      return;
    }
    if(entries.some((entry,i)=>i!==index&&String(entry.id)===next.id)){
      toast("같은 ID가 이미 있습니다.");
      return;
    }
    entries[index]=next;
    devSelectedId=next.id;
    if(persistDevContent()){
      renderDevSettings();
      renderHome();
      toast("개발자 설정을 저장했습니다.");
    }
  }

  function deleteDevEntry(){
    const key=currentDevKey();
    const entries=devContent[key]||[];
    const index=entries.findIndex(entry=>String(entry.id)===String(devSelectedId));
    if(index<0) return;
    const name=devEntryTitle(entries[index],key);
    if(!window.confirm(name+" 항목을 삭제할까요?")) return;
    entries.splice(index,1);
    devSelectedId=entries[Math.min(index,entries.length-1)]?.id||null;
    if(persistDevContent()){
      renderDevSettings();
      renderHome();
      toast("항목을 삭제했습니다.");
    }
  }

  function resetDevContent(){
    if(!window.confirm("챕터·컬렉션·아이템 개발 설정을 모두 기본값으로 되돌릴까요?")) return;
    devContent=cloneData(BASE_DEV_CONTENT);
    devSelectedId=null;
    devSelectedInteractionId=null;
    if(persistDevContent()){
      renderDevSettings();
      renderHome();
      toast("개발자 설정을 기본값으로 복원했습니다.");
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

    Array.from(document.querySelectorAll("[data-open-collection]")).forEach(b=>b.addEventListener("click",()=>showView("collection")));
    Array.from(document.querySelectorAll("[data-open-wardrobe]")).forEach(b=>b.addEventListener("click",()=>showView("wardrobe")));
    Array.from(document.querySelectorAll("[data-open-chapters]")).forEach(b=>b.addEventListener("click",()=>showView("chapters")));
    Array.from(document.querySelectorAll("[data-open-dev]")).forEach(b=>b.addEventListener("click",()=>showView("dev")));
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

    Array.from(document.querySelectorAll("[data-story-hotspot]")).forEach(button=>button.addEventListener("click",()=>inspectStoryHotspot(button.dataset.storyHotspot)));
    Array.from(document.querySelectorAll("[data-story-exit]")).forEach(button=>button.addEventListener("click",()=>{
      const side=button.dataset.storyExit==="left"?"왼쪽 문":"오른쪽 문";
      storySay("이동",side+"은 아직 잠겨 있다. 멤버들의 부탁을 받으면 이동할 수 있을 것 같다.");
    }));
    Array.from(document.querySelectorAll("[data-story-drawer]")).forEach(button=>button.addEventListener("click",()=>toggleStoryPanel(button.dataset.storyDrawer)));
    Array.from(document.querySelectorAll("[data-story-close-panel]")).forEach(button=>button.addEventListener("click",closeStoryPanels));
    $("#story-dialogue-close")?.addEventListener("click",()=>$("#story-dialogue").hidden=true);
    $("#story-intro-next")?.addEventListener("click",advanceStoryIntro);
    $("#story-intro-house")?.addEventListener("click",approachStoryIntroHouse);
    $("#story-save-button")?.addEventListener("click",quickStorySave);
    $("#story-quick-inventory")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-story-item-id]");
      if(button) selectStoryItem(button.dataset.storyItemId);
    });
    $("#story-inventory-list")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-story-item-id]");
      if(button) selectStoryItem(button.dataset.storyItemId);
    });
    $("[data-story-map-node='party-room']")?.addEventListener("click",()=>{
      closeStoryPanels();
      toast("현재 파티방에 있어요.");
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
      const editButton=event.target.closest("[data-wardrobe-edit]");
      if(editButton){
        beginWardrobePartEdit(editButton.dataset.wardrobeEdit);
        return;
      }
      const button=event.target.closest("[data-wardrobe-item]");
      if(!button || button.disabled) return;
      const item=wardrobeOptionById(wardrobeSlot,button.dataset.wardrobeItem);
      const owned=new Set(activeSave()?.collection?.items||[]);
      if(!item || !wardrobeOptionUnlocked(item,owned)) return;
      const selected=new Set(outfitDraft.layers||[]);
      if(selected.has(item.id)) selected.delete(item.id);
      else selected.add(item.id);
      outfitDraft.layers=[...selected];
      if(item.custom){
        if(!wardrobeAssets.layerOrder.includes(item.id)) wardrobeAssets.layerOrder.push(item.id);
        wardrobeEditorTarget=item.id;
      }
      if(!activeSave() && !rememberDeveloperOutfit()){
        outfitDraft=developerOutfit();
        outfitDraft.layers=[...(outfitDraft.layers||[])];
      }
      renderWardrobe();
    });
    $("#wardrobe-save-button").addEventListener("click",saveOutfit);
    $("#wardrobe-base-file").addEventListener("change",event=>{
      const file=event.target.files?.[0];
      if(file) setBaseImage(file);
      event.target.value="";
    });
    $("#wardrobe-upload-slot").addEventListener("change",event=>{
      const slot=event.target.value;
      if(!wardrobeSlots.includes(slot)) return;
      if(wardrobeEditingId){
        renderUploadGroupOptions(slot);
        return;
      }
      wardrobeSlot=slot;
      renderWardrobe();
    });
    $("#wardrobe-image-file").addEventListener("change",event=>{
      const file=event.target.files?.[0]||null;
      pendingWardrobeFile=file;
      const name=$("#wardrobe-file-name");
      if(name) name.textContent=file
        ? file.name
        : wardrobeEditingId
          ? "현재 이미지 유지 · 새 파일을 고르면 교체"
          : "선택된 파일 없음";
      const button=$("#wardrobe-add-part-button");
      if(button) button.disabled=wardrobeEditingId?false:!file;
      setUploadStatus(
        file
          ? wardrobeEditingId
            ? "교체 이미지 선택됨 · 수정 저장을 누르세요."
            : "파일 선택됨 · 등록하고 켜기를 누르세요."
          : wardrobeEditingId
            ? "기존 이미지를 유지한 채 다른 설정만 수정할 수 있어요."
            : "파일을 먼저 선택하세요.",
        file?"busy":"idle"
      );
    });
    $("#wardrobe-add-part-button").addEventListener("click",()=>{
      if(wardrobeEditingId){
        saveWardrobePartEdit();
        return;
      }
      if(!pendingWardrobeFile){
        setUploadStatus("먼저 이미지 파일을 선택해 주세요.","error");
        return;
      }
      addWardrobeImage(pendingWardrobeFile);
    });
    $("#wardrobe-cancel-edit-button")?.addEventListener("click",()=>cancelWardrobePartEdit());
    $("#wardrobe-layer-select").addEventListener("change",event=>{
      wardrobeEditorTarget=event.target.value||"base";
      renderWardrobe();
    });
    Array.from(document.querySelectorAll("[data-wardrobe-transform]")).forEach(input=>{
      input.addEventListener("input",event=>updateWardrobeTransform(event.target.dataset.wardrobeTransform,event.target.value,false));
      input.addEventListener("change",event=>updateWardrobeTransform(event.target.dataset.wardrobeTransform,event.target.value,true));
    });
    Array.from(document.querySelectorAll("[data-wardrobe-transform-number]")).forEach(input=>{
      input.addEventListener("input",event=>{
        if(event.target.value==="" || !Number.isFinite(Number(event.target.value))) return;
        updateWardrobeTransform(event.target.dataset.wardrobeTransformNumber,event.target.value,false);
      });
      input.addEventListener("change",event=>{
        if(event.target.value==="" || !Number.isFinite(Number(event.target.value))){
          renderWardrobeEditor();
          return;
        }
        updateWardrobeTransform(event.target.dataset.wardrobeTransformNumber,event.target.value,true);
      });
      input.addEventListener("keydown",event=>{
        if(event.key==="Enter") event.target.blur();
      });
    });
    Array.from(document.querySelectorAll("[data-layer-move]")).forEach(button=>button.addEventListener("click",()=>moveWardrobeLayer(button.dataset.layerMove)));
    $("#wardrobe-reset-transform").addEventListener("click",resetWardrobeTransform);
    $("#wardrobe-delete-image").addEventListener("click",deleteWardrobeImage);
    $("#wardrobe-preview").addEventListener("click",event=>{
      const layer=event.target.closest?.("[data-preview-layer]");
      if(!layer) return;
      wardrobeEditorTarget=layer.dataset.previewLayer||"base";
      renderWardrobe();
    });

    $("#dev-settings-tabs")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-dev-section]");
      if(!button) return;
      devSection=button.dataset.devSection;
      devSelectedId=null;
      devSelectedInteractionId=null;
      renderDevSettings();
    });
    $("#dev-collection-types")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-dev-collection-type]");
      if(!button) return;
      devCollectionType=button.dataset.devCollectionType;
      devSelectedId=null;
      renderDevSettings();
    });
    $("#dev-entry-list")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-dev-entry]");
      if(!button) return;
      devSelectedId=button.dataset.devEntry;
      devSelectedInteractionId=null;
      renderDevSettings();
    });
    $("#dev-open-chapter-scene")?.addEventListener("click",openChapterSceneEditor);
    $("#story-dev-enter")?.addEventListener("click",enterCurrentStorySceneEditor);
    $("#story-dev-add-interaction")?.addEventListener("click",startStoryInteractionPlacement);
    $("#story-dev-exit")?.addEventListener("click",closeChapterSceneEditor);
    $("#story-dev-save-interaction")?.addEventListener("click",saveStoryInteractionDetails);
    $("#story-dev-delete-interaction")?.addEventListener("click",deleteStoryInteraction);
    $("#story-dev-layer")?.addEventListener("pointerdown",event=>{
      const box=event.target.closest?.("[data-story-dev-interaction]");
      if(!box) return;
      const resize=event.target.closest?.("[data-story-dev-resize]");
      beginStoryInteractionPointer(event,box.dataset.storyDevInteraction,resize?"resize":"move");
    });
    $("#story-dev-layer")?.addEventListener("click",event=>{
      const box=event.target.closest?.("[data-story-dev-interaction]");
      if(box){
        devSelectedInteractionId=box.dataset.storyDevInteraction;
        syncStoryDevSelection();
        renderStoryDevInspector();
        return;
      }
      placeStoryInteraction(event);
    });
    document.addEventListener("pointermove",updateStoryInteractionPointer);
    document.addEventListener("pointerup",finishStoryInteractionPointer);
    $("#dev-new-entry")?.addEventListener("click",createDevEntry);
    $("#dev-save-entry")?.addEventListener("click",saveDevEntry);
    $("#dev-delete-entry")?.addEventListener("click",deleteDevEntry);
    $("#dev-reset-content")?.addEventListener("click",resetDevContent);
    $("#dev-editor-fields")?.addEventListener("input",()=>{
      $("#dev-save-status").textContent="수정됨 · 저장 필요";
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
      if(storyIntroActive && (event.key===" " || event.key==="Enter")){
        event.preventDefault();
        advanceStoryIntro();
        return;
      }
      if(event.key!=="Escape") return;
      if(!$("#save-modal").hidden) closeSaveModal();
      else if(!$("#story-inventory-panel")?.hidden || !$("#story-missions-panel")?.hidden || !$("#story-map-panel")?.hidden){closeStoryPanels();}
      else if(!$("#story-dialogue")?.hidden){$("#story-dialogue").hidden=true;}
      else if(devStoryChapterId && !$("[data-view='story']").hidden){closeChapterSceneEditor();}
      else if(!$("[data-view='collection']").hidden || !$("[data-view='chapters']").hidden || !$("[data-view='story']").hidden || !$("[data-view='wardrobe']").hidden || !$("[data-view='dev']").hidden) showView("home");
    });
  }

  function runDiagnostics(){
    const requiredIds=[
      "new-game-button","save-modal","save-slot-list",
      "story-room","story-current-objective","story-quick-inventory",
      "story-inventory-list","story-mission-list","story-save-button",
      "collection-grid","wardrobe-preview"
    ];
    const missing=requiredIds.filter(id=>!document.getElementById(id));
    const result={
      ok:missing.length===0,
      missing,
      activeSave:Boolean(activeSave()),
      views:$$("[data-view]").map(view=>view.dataset.view),
      localSaveAvailable:(()=>{
        try{
          const key="__pixely_storage_test__";
          localStorage.setItem(key,"1");
          localStorage.removeItem(key);
          return true;
        }catch{return false;}
      })(),
      sessionSaveAvailable:(()=>{
        try{
          const key="__pixely_session_test__";
          sessionStorage.setItem(key,"1");
          sessionStorage.removeItem(key);
          return true;
        }catch{return false;}
      })()
    };
    if(!result.ok) console.error("[PIXELY] UI diagnostics failed",result);
    return result;
  }

  window.PixelyDiagnostics={run:runDiagnostics};

  function boot(){
    renderHome();
    bind();
    const diagnostics=runDiagnostics();
    if(!diagnostics.ok) toast("화면 구성 오류가 발견되었습니다. 새로고침해 주세요.");
    startUpdateWatcher();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();
