const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const directory=path.join(__dirname,"..");
const app=fs.readFileSync(path.join(directory,"app.js"),"utf8");
const storageKey="pixely-lost-sky-saves-v2";

function boot(saved,initialVersion="15"){
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
  const views=["home","chapters","collection","wardrobe","story"].map(key=>{
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
      if(["[data-open-collection]","[data-open-chapters]","[data-open-wardrobe]","[data-go-home]","[data-close-modal]"].includes(selector)) return [node(selector)];
      return [];
    },
    addEventListener(name,callback){listeners[name]=callback}
  };
  const storage=new Map(saved===undefined?[]:[[storageKey,JSON.stringify(saved)]]);
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

test("new game opens empty mission and inventory interface without starting an intro",()=>{
  const state=boot();
  state.click("#new-game-button");
  state.slotAction("new-slot",2);
  const saved=JSON.parse(state.storage.get(storageKey));
  assert.equal(saved.activeSlot,2);
  assert.deepEqual(saved.slots[2].collection.cards,["dreamer"]);
  assert.deepEqual(saved.slots[2].missions,[]);
  assert.equal(state.node("view:story").hidden,false);
  assert.match(state.node("#mission-list").children[0].textContent,/등록된 미션이 없습니다/);
  assert.match(state.node("#inventory-list").children[0].textContent,/가지고 있는 아이템이 없습니다/);
  assert.equal(saved.slots[2].completedChapters.length,0);
});

test("existing saves open the interface without replaying the removed chapter",()=>{
  const saved={activeSlot:0,slots:[{
    chapter:"챕터 1 완료",location:"파티",savedAt:1,progress:15,
    story:{phase:"done",found:["ribbon"],delivered:["ribbon"]},
    completedChapters:["night"],collection:{cards:["dreamer"],items:["ribbon","plush"],postcards:[]}
  },null,null]};
  const state=boot(saved);
  state.click("#continue-button");
  assert.equal(state.node("view:story").hidden,false);
  assert.match(state.node("#mission-list").children[0].textContent,/등록된 미션이 없습니다/);
  assert.equal(state.node("#inventory-list").children.length,2);
  assert.equal(state.node("#inventory-list").children[1].children[0].textContent,"치명적으로 귀여운 봉제인형");
  assert.deepEqual(JSON.parse(state.storage.get(storageKey)).slots[0].story,saved.slots[0].story);
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

test("wardrobe saves an earned item per slot and exposes equipment for future scenes",()=>{
  const state=boot();
  state.click("#new-game-button");
  state.slotAction("new-slot",0);
  state.click("[data-open-wardrobe]");
  const avatar=state.context.window.PixelyAvatar;
  assert.equal(state.node("#wardrobe-options").innerHTML.includes("치명적으로 귀여운 봉제인형"),false);
  const option=id=>state.node("#wardrobe-options").listeners.click({target:{closest(){return {dataset:{wardrobeItem:id},disabled:false}}}});
  option("plush");
  assert.equal(avatar.outfitForActiveSave().accessory,"none");
  assert.deepEqual(Array.from(avatar.outfitForActiveSave().decorations),[]);
  assert.equal(state.context.window.PixelyInventory.grantItem("plush"),true);
  state.node("#wardrobe-tabs").listeners.click({target:{closest(){return state.node("wardrobe-tab:accessory")}}});
  option("plush");
  state.click("#wardrobe-save-button");
  const saved=JSON.parse(state.storage.get(storageKey));
  assert.equal(saved.slots[0].outfit.accessory,"plush");
  assert.deepEqual(saved.slots[0].collection.items,["plush"]);
  assert.equal(avatar.outfitForActiveSave().accessory,"plush");
  const restored=boot(saved);
  assert.equal(restored.context.window.PixelyAvatar.outfitForActiveSave().accessory,"plush");
  assert.deepEqual(Array.from(restored.context.window.PixelyAvatar.outfitForActiveSave().decorations),[]);
  assert.equal(restored.context.window.PixelyInventory.grantItem("not-a-real-item"),false);
});

test("old save data keeps inventory empty and rejects unowned equipment",()=>{
  const state=boot({activeSlot:0,slots:[{collection:{cards:["dreamer"],items:[]},outfit:{accessory:"plush"}},null,null]});
  state.click("[data-open-wardrobe]");
  assert.equal(state.context.window.PixelyAvatar.outfitForActiveSave().accessory,"none");
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
  state.setVersion("19");
  state.tick();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,false);
  state.click("#update-later-button");
  assert.equal(state.node("#update-modal").hidden,true);
  state.tick();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,true);
  const stale=boot(undefined,"19");
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
  assert.match(html,/id="wardrobe-layer-select"/);
  assert.match(html,/data-wardrobe-transform="x"/);
  assert.match(html,/data-wardrobe-transform="y"/);
  assert.match(html,/data-wardrobe-transform="scale"/);
  assert.match(html,/data-wardrobe-transform="rotation"/);
  assert.match(app,/WARDROBE_ASSET_KEY/);
  assert.match(app,/wardrobeAssets\.custom/);
});
