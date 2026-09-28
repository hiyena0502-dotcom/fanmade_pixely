const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const directory=path.join(__dirname,"..");
const app=fs.readFileSync(path.join(directory,"app.js"),"utf8");
const storageKey="pixely-lost-sky-saves-v2";
const wardrobeKey="pixely-lost-sky-wardrobe-assets-v1";
const devContentKey="pixely-lost-sky-dev-content-v1";

function boot(saved,initialVersion="15",wardrobeAssets){
  const nodes=new Map();
  const listeners={};
  const requests=[];
  let publishedVersion=initialVersion;
  let confirmResult=true;
  let failStorage=false;
  let interval;
  let elementCount=0;
  function node(key){
    if(!nodes.has(key)){
      const classes=new Set();
      nodes.set(key,{
        hidden:true,style:{},dataset:{},innerHTML:"",textContent:"",children:[],
        listeners:{},
        classList:{toggle(name,on){if(on) classes.add(name);else classes.delete(name)},add(name){classes.add(name)},remove(name){classes.delete(name)},contains(name){return classes.has(name)}},
        setAttribute(name,value){this[name]=value},
        addEventListener(name,callback){this.listeners[name]=callback},
        querySelectorAll(){return []},
        replaceChildren(...children){this.children=children},
        append(child){this.children.push(child)}
      });
    }
    return nodes.get(key);
  }
  const tabs=["cards","items","postcards"].map(key=>{
    const result=node(`tab:${key}`);
    result.dataset.collectionTab=key;
    return result;
  });
  const wardrobeTabs=["outfit","accessory","face","decoration"].map(key=>{
    const result=node(`wardrobe-tab:${key}`);
    result.dataset.wardrobeSlot=key;
    return result;
  });
  const devTabs=["chapters","collection","dialogues","items"].map(key=>{
    const result=node(`dev-tab:${key}`);
    result.dataset.devSection=key;
    return result;
  });
  const devCollectionTabs=["cards","postcards"].map(key=>{
    const result=node(`dev-collection:${key}`);
    result.dataset.devCollectionType=key;
    return result;
  });
  const views=["home","chapters","collection","wardrobe","dev","story"].map(key=>{
    const result=node(`view:${key}`);
    result.dataset.view=key;
    return result;
  });
  const document={
    readyState:"complete",baseURI:"https://example.com/fanmade_pixely/",visibilityState:"visible",
    createElement(tag){return node(`element:${tag}:${++elementCount}`)},
    querySelector(selector){
      const view=selector.match(/^\[data-view=['"]([^'"]+)['"]\]$/);
      return view?views.find(entry=>entry.dataset.view===view[1]):node(selector);
    },
    querySelectorAll(selector){
      if(selector==="[data-view]") return views;
      if(selector===".diary-tabs button") return tabs;
      if(selector==="[data-wardrobe-slot]") return wardrobeTabs;
      if(selector==="[data-dev-section]") return devTabs;
      if(selector==="[data-dev-collection-type]") return devCollectionTabs;
      if(["[data-open-collection]","[data-open-chapters]","[data-open-wardrobe]","[data-open-dev]","[data-go-home]","[data-close-modal]"].includes(selector)) return [node(selector)];
      if(["[data-story-hotspot]","[data-story-exit]","[data-story-drawer]","[data-story-close-panel]","[data-layer-move]","[data-wardrobe-transform]"].includes(selector)) return [];
      return [];
    },
    addEventListener(name,callback){listeners[name]=callback}
  };
  const storage=new Map();
  if(saved!==undefined) storage.set(storageKey,JSON.stringify(saved));
  if(wardrobeAssets!==undefined) storage.set(wardrobeKey,JSON.stringify(wardrobeAssets));
  const context={
    document,URL,console,
    window:{confirm(){return confirmResult},scrollTo(){},location:{reload(){}},addEventListener(name,callback){listeners[name]=callback}},
    localStorage:{getItem(key){return storage.get(key)||null},setItem(key,value){if(failStorage) throw new Error("quota");storage.set(key,value)}},
    fetch(url,options){
      requests.push({url:String(url),options});
      return Promise.resolve({ok:true,json:async()=>({version:publishedVersion})});
    },
    setInterval(callback){interval=callback},setTimeout(){return 1},clearTimeout(){}
  };
  vm.runInNewContext(app,context);
  return {
    node,storage,requests,context,tick:()=>interval(),
    setVersion(value){publishedVersion=value},
    setConfirm(value){confirmResult=value},
    setStorageFailure(value){failStorage=value},
    click(selector){node(selector).listeners.click()},
    slotAction(attribute,index){
      node("#save-slot-list").listeners.click({target:{closest(selector){
        return selector===`[data-${attribute}]` ? {dataset:{[attribute.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]:String(index)}} : null;
      }}});
    }
  };
}

test("saved slots are normalized and escaped before being inserted as HTML",()=>{
  const state=boot({activeSlot:9,slots:[{chapter:"<img src=x>",location:"<script>x</script>",progress:900,playSeconds:-1,collection:{cards:["dreamer"]}},null,null]});
  assert.equal(state.node("#current-slot-label").textContent,"NO DATA");
  state.click("#save-manager-button");
  const markup=state.node("#save-slot-list").innerHTML;
  assert.match(markup,/&lt;img src=x&gt;/);
  assert.match(markup,/&lt;script&gt;x&lt;\/script&gt;/);
  assert.match(markup,/100%/);
  assert.doesNotMatch(markup,/<script>/);
});

test("saving over a different occupied slot requires confirmation",()=>{
  const save=chapter=>({chapter,location:"파티",savedAt:1,collection:{cards:["dreamer"]}});
  const state=boot({activeSlot:0,slots:[save("첫 번째"),save("두 번째"),null]});
  state.click("#quick-save-button");
  state.setConfirm(false);
  state.slotAction("save-slot",1);
  assert.equal(JSON.parse(state.storage.get(storageKey)).slots[1].chapter,"두 번째");
  state.setConfirm(true);
  state.slotAction("save-slot",1);
  assert.equal(JSON.parse(state.storage.get(storageKey)).slots[1].chapter,"첫 번째");
});

test("new game opens the Chapter 1 party room with its first objective",()=>{
  const state=boot();
  state.click("#new-game-button");
  state.slotAction("new-slot",2);
  const saved=JSON.parse(state.storage.get(storageKey));
  assert.equal(saved.activeSlot,2);
  assert.deepEqual(saved.slots[2].collection.cards,["dreamer"]);
  assert.equal(saved.slots[2].missions[0].id,"explore-party-room");
  assert.equal(saved.slots[2].story.scene,"party-room");
  assert.equal(state.node("view:story").hidden,false);
  assert.equal(state.node("#story-current-objective").textContent,"파티방을 둘러보자");
  assert.equal(saved.slots[2].completedChapters.length,0);
});

test("existing saves normalize into the current party-room interface",()=>{
  const saved={activeSlot:0,slots:[{
    chapter:"챕터 1 완료",location:"파티",savedAt:1,progress:15,
    story:{phase:"done",found:["ribbon"],delivered:["ribbon"]},
    completedChapters:["night"],collection:{cards:["dreamer"],items:["ribbon","plush"],postcards:[]}
  },null,null]};
  const state=boot(saved);
  state.click("#continue-button");
  assert.equal(state.node("view:story").hidden,false);
  assert.match(state.node("#story-inventory-list").innerHTML,/치명적으로 귀여운 봉제인형/);
  const normalized=JSON.parse(state.storage.get(storageKey)).slots[0];
  assert.equal(normalized.story.scene,"party-room");
  assert.deepEqual(normalized.story.inspected,[]);
});

test("collection tabs switch without losing the selected state",()=>{
  const state=boot();
  state.click("[data-open-collection]");
  const button=state.node("tab:postcards");
  state.node(".diary-tabs").listeners.click({target:{closest(){return button}}});
  assert.equal(button["aria-selected"],"true");
  assert.equal(state.node("tab:cards")["aria-selected"],"false");
  assert.equal(state.node("#collection-total").textContent,4);
  assert.match(state.node("#collection-grid").className,/postcards/);
});

test("collection filters separate existing characters and show an empty story group",()=>{
  const state=boot({activeSlot:0,slots:[{collection:{cards:["dreamer","philip"],items:[]}},null,null]});
  state.click("[data-open-collection]");
  const filters=state.node("#collection-filters");
  const choose=id=>filters.listeners.click({target:{closest(){return {dataset:{collectionFilter:id}}}}});
  choose("fairy");
  assert.equal(state.node("#collection-total").textContent,9);
  assert.match(state.node("#collection-grid").innerHTML,/필립/);
  assert.doesNotMatch(state.node("#collection-grid").innerHTML,/수상한 비둘기/);
  choose("roleplay");
  assert.equal(state.node("#collection-total").textContent,0);
  assert.match(state.node("#collection-grid").innerHTML,/아직 이 페이지는 비어 있어요/);
});

test("wardrobe saves earned items as multi-select layers and exposes them for future scenes",()=>{
  const state=boot();
  state.click("#new-game-button");
  state.slotAction("new-slot",0);
  state.click("[data-open-wardrobe]");
  const avatar=state.context.window.PixelyAvatar;
  assert.deepEqual(Array.from(avatar.outfitForActiveSave().layers),[]);
  assert.equal(state.context.window.PixelyInventory.grantItem("plush"),true);
  state.node("#wardrobe-tabs").listeners.click({target:{closest(){return state.node("wardrobe-tab:accessory")}}});
  const option=id=>state.node("#wardrobe-options").listeners.click({target:{closest(){return {dataset:{wardrobeItem:id},disabled:false}}}});
  option("plush");
  state.click("#wardrobe-save-button");
  const saved=JSON.parse(state.storage.get(storageKey));
  assert.deepEqual(saved.slots[0].outfit.layers,["plush"]);
  assert.deepEqual(saved.slots[0].collection.items,["plush"]);
  assert.deepEqual(Array.from(avatar.outfitForActiveSave().layers),["plush"]);
  const restored=boot(saved);
  assert.deepEqual(Array.from(restored.context.window.PixelyAvatar.outfitForActiveSave().layers),["plush"]);
  assert.equal(restored.context.window.PixelyInventory.grantItem("not-a-real-item"),false);
});

test("old single-slot save data migrates into layers and still rejects unowned equipment",()=>{
  const state=boot({activeSlot:0,slots:[{collection:{cards:["dreamer"],items:[]},outfit:{accessory:"plush"}},null,null]});
  assert.deepEqual(Array.from(state.context.window.PixelyAvatar.outfitForActiveSave().layers),[]);
  state.click("[data-open-wardrobe]");
  state.node("#wardrobe-tabs").listeners.click({target:{closest(){return state.node("wardrobe-tab:accessory")}}});
  assert.match(state.node("#wardrobe-options").innerHTML,/여행 중 발견/);
  assert.equal(state.context.window.PixelyInventory.grantItem("plush"),true);
  assert.match(state.node("#wardrobe-options").innerHTML,/치명적으로 귀여운 봉제인형/);
});

test("a storage failure leaves the previous save intact and reports the error",()=>{
  const state=boot();
  state.setStorageFailure(true);
  state.click("#new-game-button");
  state.slotAction("new-slot",0);
  assert.equal(state.storage.has(storageKey),false);
  assert.equal(state.node("#current-slot-label").textContent,"NO DATA");
  assert.match(state.node("#toast").textContent,/저장에 실패/);
});

test("update prompt compares the loaded version on the first check and on later checks",async()=>{
  const state=boot();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,true);
  assert.equal(state.requests[0].options.cache,"no-store");
  state.setVersion("24");
  state.tick();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,false);
  state.click("#update-later-button");
  assert.equal(state.node("#update-modal").hidden,true);
  state.tick();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,true);
  const stale=boot(undefined,"24");
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(stale.node("#update-modal").hidden,false);
});

test("deployed version and asset cache keys match the script",()=>{
  const html=fs.readFileSync(path.join(directory,"index.html"),"utf8");
  const version=JSON.parse(fs.readFileSync(path.join(directory,"site-version.json"),"utf8")).version;
  assert.match(app,new RegExp(`SITE_VERSION = "${version}"`));
  assert.match(html,new RegExp(`style\\.css\\?v=${version}`));
  assert.match(html,new RegExp(`app\\.js\\?v=${version}`));
});


test("wardrobe image editor controls and multi-layer upload UI are present",()=>{
  const html=fs.readFileSync(path.join(directory,"index.html"),"utf8");
  assert.match(html,/id="wardrobe-base-file"/);
  assert.match(html,/id="wardrobe-image-file"/);
  assert.match(html,/id="wardrobe-upload-slot"/);
  assert.match(html,/id="wardrobe-part-group"/);
  assert.match(html,/id="wardrobe-layer-select"/);
  assert.match(html,/data-layer-move="down"/);
  assert.match(html,/data-layer-move="up"/);
  assert.match(html,/data-wardrobe-transform="x"/);
  assert.match(html,/data-wardrobe-transform="y"/);
  assert.match(html,/data-wardrobe-transform="scale"/);
  assert.match(html,/data-wardrobe-transform="rotation"/);
  assert.match(app,/WARDROBE_ASSET_KEY/);
  assert.match(app,/wardrobeAssets\.custom/);
});


test("developer wardrobe setup toggles multiple custom parts without a save slot",()=>{
  const assets={
    base:{image:"data:image/png;base64,BASE",name:"베이스",transform:{x:0,y:0,scale:100,rotation:0}},
    custom:[
      {id:"custom-eyes",slot:"face",group:"eyes",name:"기본 눈",image:"data:image/png;base64,EYES",custom:true,transform:{x:0,y:0,scale:100,rotation:0}},
      {id:"custom-mouth",slot:"face",group:"mouth",name:"기본 입",image:"data:image/png;base64,MOUTH",custom:true,transform:{x:0,y:0,scale:100,rotation:0}}
    ],
    layerOrder:["custom-eyes","custom-mouth"],
    setupOutfit:{layers:[]}
  };
  const state=boot(undefined,"24",assets);
  state.click("[data-open-wardrobe]");
  assert.equal(state.node("#wardrobe-slot-label").textContent,"DEV SETUP");
  const faceTab=state.node("wardrobe-tab:face");
  state.node("#wardrobe-tabs").listeners.click({target:{closest(){return faceTab}}});
  const click=id=>state.node("#wardrobe-options").listeners.click({target:{closest(){return {dataset:{wardrobeItem:id},disabled:false}}}});
  click("custom-eyes");
  click("custom-mouth");
  const stored=JSON.parse(state.storage.get(wardrobeKey));
  assert.deepEqual(stored.setupOutfit.layers,["custom-eyes","custom-mouth"]);
  assert.match(state.node("#wardrobe-preview").innerHTML,/data:image\/png;base64,EYES/);
  assert.match(state.node("#wardrobe-preview").innerHTML,/data:image\/png;base64,MOUTH/);
});


test("simplified wardrobe editor keeps all four multi-select categories",()=>{
  const html=fs.readFileSync(path.join(directory,"index.html"),"utf8");
  for(const slot of ["outfit","accessory","face","decoration"]){
    assert.match(html,new RegExp('data-wardrobe-slot="'+slot+'"'));
  }
  assert.match(app,/모든 분류에서 여러 파츠를 동시에 선택할 수 있어요/);
  assert.match(html,/id="wardrobe-add-part-button"/);
  assert.match(html,/등록하고 켜기/);
});


test("developer settings screen exposes chapters collection dialogues and items",()=>{
  const html=fs.readFileSync(path.join(directory,"index.html"),"utf8");
  assert.match(html,/data-open-dev/);
  assert.match(html,/data-view="dev"/);
  for(const section of ["chapters","collection","dialogues","items"]){
    assert.match(html,new RegExp('data-dev-section="'+section+'"'));
  }
  assert.match(html,/id="dev-entry-list"/);
  assert.match(html,/id="dev-editor-fields"/);
  assert.match(app,/DEV_CONTENT_KEY/);
  assert.match(app,/persistDevContent/);
});

test("developer settings can create an item entry without touching source code",()=>{
  const state=boot(undefined,"24");
  state.click("[data-open-dev]");
  const itemTab=state.node("dev-tab:items");
  state.node("#dev-settings-tabs").listeners.click({target:{closest(){return itemTab}}});
  state.click("#dev-new-entry");
  const stored=JSON.parse(state.storage.get(devContentKey));
  assert.equal(Array.isArray(stored.items),true);
  assert.equal(stored.items.some(item=>item.name==="새 아이템"),true);
  assert.equal(state.node("view:dev").hidden,false);
});
