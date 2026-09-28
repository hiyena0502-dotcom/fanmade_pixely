(() => {
  "use strict";

  const STORAGE_KEY = "pixely-lost-sky-saves-v2";
  const SITE_VERSION = "12";
  const $ = (q, root = document) => root.querySelector(q);
  const $$ = (q, root = document) => [...root.querySelectorAll(q)];

  const catalogue = {
    cards: [
      {id:"dreamer",symbol:"YOU",name:"꿈뜰이",type:"PLAYER",color:"#5d87a8",desc:"잠뜰님의 생일을 축하하기 위해 여행을 시작한 플레이어.",memo:"생일 축하하러 왔을 뿐인데 일이 커졌다."},
      {id:"jamtteul",symbol:"잠",name:"잠뜰",type:"PERSON",color:"#4f86b3",desc:"깜짝 생일 파티의 주인공.",memo:"내일 파티를 들키지 않게 준비하자."},
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
      {id:"ribbon",symbol:"〰",name:"리본 묶음",type:"PARTY ITEM",color:"#9a789c",desc:"풍선을 묶을 때 쓰는 리본. 수현에게 건넸다."},
      {id:"candles",symbol:"♢",name:"생일 초",type:"PARTY ITEM",color:"#b98c67",desc:"케이크 위에 올릴 초. 덕개에게 건넸다."},
      {id:"tape",symbol:"▤",name:"장식용 테이프",type:"PARTY ITEM",color:"#668b9d",desc:"흘러내리는 현수막을 고정한 테이프."},
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
    {id:"night",no:"01",title:"생일 전날 밤",label:"CHAPTER 01",desc:"멤버들과 함께 깜짝 파티를 준비하고 잠자리에 든다."},
    {id:"morning",no:"02",title:"사라진 생일 주인공",label:"CHAPTER 02",desc:"아침에 잠뜰님을 찾고, 요정들이 발견한 장치를 살펴본다. 다음 업데이트에서 이어진다."},
    {id:"portal",no:"03",title:"처음 열린 문",label:"CHAPTER 03",desc:"수리한 장치가 연 문으로 들어가 첫 세계로 향한다."},
    {id:"journey",no:"04",title:"이야기 속 잠뜰",label:"CHAPTER 04",desc:"여러 세계를 돌아다니며 그곳의 잠뜰을 만난다."},
    {id:"birthday",no:"05",title:"푸른 하늘",label:"FINAL",desc:"현실의 잠뜰님을 데려와 함께 생일을 축하한다."}
  ];

  const partyTasks = [
    {id:"ribbon",person:"suhyeon",label:"수현의 풍선 묶기",place:"상자",found:"리본 묶음을 찾았다. 수현에게 건네자.",thanks:"좋아, 이제 풍선들이 천장으로 도망가진 않겠네. 하나는 공룡 쪽으로 날려 볼까?"},
    {id:"candles",person:"deokgae",label:"덕개의 케이크 초",place:"식탁",found:"생일 초를 찾았다. 덕개에게 건네자.",thanks:"휴, 초 없으면 그냥 큰 빵을 들고 축하할 뻔했잖아. 이제 케이크는 내가 지킨다!"},
    {id:"tape",person:"rader",label:"라더의 현수막 고정",place:"서랍",found:"장식용 테이프를 찾았다. 라더에게 건네자.",thanks:"됐어. 아침까지는 안 떨어지겠네. 공룡이 잡아당기지만 않으면."}
  ];

  const introLines = [
    {speaker:"이야기",text:"잠뜰님의 생일을 하루 앞둔 밤. 깜짝 파티 장소에는 아직 끝내지 못한 준비가 한가득이다."},
    {speaker:"수현",text:"꿈뜰이 왔어? 잘됐다! 잠뜰님 오시기 전에 풍선부터 묶어야 하는데, 리본이 안 보여."},
    {speaker:"공룡",text:"다들 조용히! 제 완벽한 파티 계획을 발표하겠습니다. 첫째, 절대 들키지 않기. 둘째… 어, 잠깐. 계획서 어디 갔지?"},
    {speaker:"라더",text:"계획서는 됐고. 지금 필요한 건 테이프야. 현수막이 자꾸 내려와."},
    {speaker:"덕개",text:"케이크도 준비됐거든? 그런데 초를 못 찾으면 내가 만든 게 그냥 야식이 돼."},
    {speaker:"각별",text:"다들 준비물부터 찾자. 누가 현수막에 계획서를 붙일 생각은 하지 말고."}
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
      story:normalizeStory(save.story),
      collection:{
        cards:Array.isArray(save.collection?.cards)
          ? strings(save.collection.cards)
          : Array.isArray(save.collection?.characters)
            ? strings(save.collection.characters)
            : ["dreamer"],
        items:strings(save.collection?.items),
        postcards:strings(save.collection?.postcards)
      }
    };
  }

  function normalizeStory(story){
    const valid=id=>partyTasks.some(task=>task.id===id);
    return {
      phase:story?.phase==="done"?"done":story?.phase==="room"?"room":"intro",
      introIndex:Math.min(introLines.length,Math.max(0,Number(story?.introIndex)||0)),
      found:Array.isArray(story?.found)?story.found.filter(valid):[],
      delivered:Array.isArray(story?.delivered)?story.delivered.filter(valid):[],
      met:Array.isArray(story?.met)?story.met:[],
      secret:Boolean(story?.secret)
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
  let saveMode="manage";
  let toastTimer=null;
  let dismissedUpdate=null;
  let pendingUpdateKey=null;
  let selectedItem=null;

  function escapeHTML(value){
    return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[char]);
  }

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
      story:normalizeStory(),
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

  function storyState(){return activeSave()?.story;}

  function speak(speaker,message,actions=[]){
    $("#dialogue-speaker").textContent=speaker;
    $("#dialogue-text").textContent=message;
    const holder=$("#dialogue-actions");
    holder.replaceChildren();
    actions.forEach(({label,action})=>{
      const button=document.createElement("button");
      button.type="button";
      button.textContent=label;
      button.addEventListener("click",action);
      holder.append(button);
    });
  }

  function openStory(){
    if(!activeSave()) return;
    selectedItem=null;
    showView("story");
    renderStory();
    if(storyState().phase==="intro") showIntroLine();
    else if(storyState().phase==="done") speak("이야기","파티 준비를 끝내고 잠자리에 들었다. 다음 날 아침의 이야기는 챕터 2에서 이어진다.");
    else speak("꿈뜰이","멤버들의 부탁을 듣고 물건을 찾아보자. 가방에서 물건을 골라 해당 멤버에게 건네면 된다.");
  }

  function showIntroLine(){
    const story=storyState();
    if(story.introIndex>=introLines.length){
      story.phase="room";
      persist();
      renderStory();
      speak("꿈뜰이","세 가지 준비물을 찾아 멤버들에게 건네자. 주변을 눌러 살펴볼 수 있다.");
      return;
    }
    const line=introLines[story.introIndex];
    speak(line.speaker,line.text,[{label:"계속 ▶",action:()=>{
      story.introIndex++;
      persist();
      showIntroLine();
    }}]);
  }

  function renderStory(){
    const story=storyState();
    if(!story) return;
    const complete=story.delivered.length;
    $("#story-counter").textContent="준비 "+complete+" / 3";
    $("#story-heading").textContent=story.phase==="done"?"파티 준비 완료":"깜짝 파티 준비";
    $("#story-objective").textContent=story.phase==="done"
      ? "모든 준비를 마치고 잠자리에 들었다. 다음 이야기는 챕터 2에서 이어진다."
      : story.phase==="intro"?"오늘 밤의 이야기를 듣고 있습니다.":complete===3
        ? "준비가 끝났다. 잠자리에 들면 챕터 1이 완료된다."
        : "물건을 찾고 가방에서 선택한 다음 필요한 멤버에게 건네주세요.";
    $("#story-quests").replaceChildren(...partyTasks.map(task=>{
      const li=document.createElement("li");
      li.textContent=(story.delivered.includes(task.id)?"✓ ":"○ ")+task.label;
      if(story.delivered.includes(task.id)) li.classList.add("is-done");
      return li;
    }));

    const inventory=$("#story-inventory");
    inventory.replaceChildren();
    const held=story.found.filter(id=>!story.delivered.includes(id));
    if(!held.length){
      const empty=document.createElement("p");
      empty.textContent="지금 가지고 있는 준비물이 없습니다.";
      inventory.append(empty);
    }
    held.forEach(id=>{
      const task=partyTasks.find(entry=>entry.id===id);
      const button=document.createElement("button");
      button.type="button";
      button.dataset.inventory=id;
      button.textContent=catalogue.items.find(item=>item.id===id).name;
      button.classList.toggle("is-selected",selectedItem===id);
      button.setAttribute("aria-pressed",String(selectedItem===id));
      inventory.append(button);
    });

    const hotspots=$("#room-hotspots");
    hotspots.replaceChildren();
    if(story.phase!=="room") return;
    const spots=[
      ["suhyeon","수현","person"],["deokgae","덕개","person"],["rader","라더","person"],
      ["gongryong","공룡","person"],["gakbyeol","각별","person"],
      ["box","파티 상자","object"],["table","케이크 식탁","object"],["drawer","작은 서랍","object"],
      ["window","밤하늘","object"]
    ];
    spots.forEach(([id,label,type])=>{
      const button=document.createElement("button");
      button.type="button";
      button.className="room-spot room-spot--"+type+" room-spot--"+id;
      button.dataset.spot=id;
      button.textContent=label;
      hotspots.append(button);
    });
    if(complete===3){
      const bed=document.createElement("button");
      bed.type="button";
      bed.className="room-spot room-spot--bed";
      bed.dataset.spot="bed";
      bed.textContent="잠자리에 들기 →";
      hotspots.append(bed);
    }
  }

  function grantCollection(kind,id){
    const owned=activeSave().collection[kind];
    if(!owned.includes(id)) owned.push(id);
  }

  function findItem(id){
    const story=storyState();
    const task=partyTasks.find(entry=>entry.id===id);
    if(story.found.includes(id)){
      speak("꿈뜰이",story.delivered.includes(id)?"이 물건은 이미 건네줬다.":"여기 있던 물건은 가방에 넣었다.");
      return;
    }
    story.found.push(id);
    grantCollection("items",id);
    speak("꿈뜰이",task.found);
    persist();
    renderStory();
  }

  function talkTo(person){
    const story=storyState();
    const task=partyTasks.find(entry=>entry.person===person);
    const names={suhyeon:"수현",deokgae:"덕개",rader:"라더",gongryong:"공룡",gakbyeol:"각별"};
    if(!story.met.includes(person)){
      story.met.push(person);
      grantCollection("cards",person);
      persist();
    }
    if(selectedItem){
      if(task?.id===selectedItem){
        story.delivered.push(selectedItem);
        selectedItem=null;
        activeSave().progress=story.delivered.length*4;
        speak(names[person],task.thanks);
        persist();
        renderStory();
        return;
      }
      speak(names[person],person==="gongryong"?"그거 제 거예요? 아니면 저한테 떠넘기는 거예요?":"이건 다른 사람이 필요할 것 같은데?");
      return;
    }
    const lines={
      suhyeon:story.delivered.includes("ribbon")?"풍선은 끝! 저쪽 케이크는 아직 무사한 거지?":"풍선은 있는데 묶을 리본이 없어. 파티 상자부터 봐 줄래?",
      deokgae:story.delivered.includes("candles")?"케이크는 건드리지 마. 아, 맛보기 한 입은 내 거고!":"케이크는 내가 보고 있어. 초가 식탁 어딘가에 있을 텐데… 잠깐, 진짜 있었나?",
      rader:story.delivered.includes("tape")?"장식은 끝났어. 이제 들키지만 않으면 돼.":"현수막이 한쪽만 내려와. 작은 서랍에 테이프가 있을 거야.",
      gongryong:"이 완벽한 파티의 총책임자는 저입니다. 방금부터요. …왜 다들 못 들은 척하지?",
      gakbyeol:"준비물 세 가지면 끝날 거야. 공룡의 '완벽한 계획'은 숫자에 안 넣었어."
    };
    speak(names[person],lines[person]);
  }

  function finishNight(){
    const story=storyState();
    if(story.delivered.length!==3 || story.phase!=="room") return;
    story.phase="done";
    activeSave().chapter="챕터 1 완료";
    activeSave().location="파티 준비 장소 · 밤";
    activeSave().progress=15;
    activeSave().completedChapters.push("night");
    activeSave().unlockedChapters.push("morning");
    grantCollection("postcards","birthday-prep");
    persist();
    renderStory();
    speak("이야기","리본도, 케이크 초도, 현수막도 제자리를 찾았다. 모두 조용히 내일을 기다리기로 하고 잠자리에 든다. 창밖에는 아직 별이 떠 있다.");
  }

  function interactWithSpot(id){
    const story=storyState();
    if(story.phase!=="room") return;
    if(["suhyeon","deokgae","rader","gongryong","gakbyeol"].includes(id)) return talkTo(id);
    if(id==="box") return findItem("ribbon");
    if(id==="table") return findItem("candles");
    if(id==="drawer") return findItem("tape");
    if(id==="bed") return finishNight();
    if(id==="window"){
      if(!story.secret){
        story.secret=true;
        grantCollection("cards","pigeon");
        grantCollection("items","pigeon-feather");
        persist();
        speak("꿈뜰이","창틀에 앉은 비둘기와 눈이 마주쳤다. 녀석은 깃털 하나를 두고 아주 당당하게 떠났다. 왜 나를 심사한 것 같지?");
      }else speak("꿈뜰이","비둘기는 떠났다. 눈을 다시 마주치지 않아서 다행이다.");
    }
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
    document.querySelectorAll(".diary-tabs button").forEach(b=>{
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
    $$("[data-open-chapters]").forEach(b=>b.addEventListener("click",()=>showView("chapters")));
    $$("[data-go-home]").forEach(b=>b.addEventListener("click",()=>showView("home")));
    $("#room-hotspots").addEventListener("click",event=>{
      const spot=event.target.closest("[data-spot]");
      if(spot) interactWithSpot(spot.dataset.spot);
    });
    $("#story-inventory").addEventListener("click",event=>{
      const item=event.target.closest("[data-inventory]");
      if(!item) return;
      selectedItem=selectedItem===item.dataset.inventory?null:item.dataset.inventory;
      renderStory();
      if(selectedItem){
        const task=partyTasks.find(entry=>entry.id===selectedItem);
        speak("꿈뜰이",catalogue.items.find(entry=>entry.id===selectedItem).name+"을(를) 골랐다. "+catalogue.cards.find(entry=>entry.id===task.person).name+"에게 건네 보자.");
      }
    });
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
      if(!$("#save-modal").hidden) closeSaveModal();
      else if(!$("[data-view='collection']").hidden || !$("[data-view='chapters']").hidden || !$("[data-view='story']").hidden) showView("home");
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
