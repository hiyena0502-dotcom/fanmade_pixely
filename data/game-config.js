(() => {
  "use strict";

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

const collectionFilters={
  cards:[{id:"all",label:"전체"},{id:"crew",label:"잠뜰 멤버"},{id:"roleplay",label:"상황극 인물"},{id:"fairy",label:"요정"},{id:"other",label:"기타 인물·생물"}],
  items:[{id:"all",label:"전체"},{id:"key",label:"중요 물건"},{id:"memento",label:"기념품"},{id:"gift",label:"선물·편지"},{id:"wardrobe",label:"꾸미기"},{id:"unknown",label:"미확인"}]
};

const chapters = [
  {id:"night",no:"01",title:"생일 전날 밤",label:"CHAPTER 01",desc:"내용 준비 중"},
  {id:"morning",no:"02",title:"사라진 생일 주인공",label:"CHAPTER 02",desc:"아침에 잠뜰님을 찾고, 요정들이 발견한 장치를 살펴본다. 다음 업데이트에서 이어진다."},
  {id:"portal",no:"03",title:"처음 열린 문",label:"CHAPTER 03",desc:"수리한 장치가 연 문으로 들어가 첫 세계로 향한다."},
  {id:"journey",no:"04",title:"이야기 속 잠뜰",label:"CHAPTER 04",desc:"여러 세계를 돌아다니며 그곳의 잠뜰을 만난다."},
  {id:"birthday",no:"05",title:"푸른 하늘",label:"FINAL",desc:"현실의 잠뜰님을 데려와 함께 생일을 축하한다."}
];

const storyIntroSteps=[
  {phase:"dark",kind:"narration",text:"내일은 잠뜰님의 생일이다."},
  {phase:"dark",kind:"narration",text:"그래서 나는 오늘, 조금 일찍 이곳에 왔다."},
  {phase:"dark",kind:"narration",text:"이유는 간단하다."},
  {phase:"dark",kind:"narration",text:"생일 축하하러 왔을 뿐이다."},
  {phase:"dark",kind:"narration",text:"……정말 그것뿐이었는데."},

  {phase:"exterior",kind:"dialogue",speaker:"꿈뜰이",text:"여기 맞겠지?"},
  {phase:"exterior",kind:"dialogue",speaker:"꿈뜰이",text:"생각보다 조용한데……."},

  {phase:"exterior",kind:"house"},

  {phase:"door",kind:"dialogue",speaker:"수현",text:"잠깐만! 그 상자 거기 두면 안 돼!"},
  {phase:"door",kind:"dialogue",speaker:"공룡",text:"아니, 내가 안 뒀다니까?!"},
  {phase:"door",kind:"dialogue",speaker:"덕개",text:"그럼 바닥에 떨어진 리본은 누가 밟았는데?"},
  {phase:"door",kind:"dialogue",speaker:"라더",text:"잠깐, 다들 한 번만 멈춰봐!"},

  {phase:"door",kind:"narration",text:"익숙한 소음과 친근한 목소리다……"},
  {phase:"door",kind:"narration",text:"…잘 찾아온 것 같다."},

  {phase:"chapter",kind:"chapter",kicker:"CHAPTER 1",title:"생일 전날",text:"잠뜰님의 생일 파티를 준비하자."}
];

const storyHotspots={
  window:{label:"창문",text:"창밖은 조용한 밤이다. 아직 파티가 시작될 기색은 없다."},
  table:{label:"테이블",text:"넓은 테이블이 비어 있다. 케이크도 선물도 장식도 아직 아무것도 없다."},
  bookshelf:{label:"책장",text:"오래된 책과 작은 소품들이 정리되어 있다. 지금 당장 필요한 물건은 없어 보인다."},
  gramophone:{label:"축음기",text:"오래된 축음기다. 파티 때 음악을 틀 수 있을지도 모르겠다."}
};

  window.PixelyGameConfig={
    catalogue,
    wardrobeSlots,
    wardrobeLabels,
    wardrobeGroups,
    collectionFilters,
    chapters,
    storyIntroSteps,
    storyHotspots
  };
})();
