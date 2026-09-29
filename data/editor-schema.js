(() => {
  "use strict";

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

  window.PixelyEditorSchema={devSchemas,interactionSchema};
})();
