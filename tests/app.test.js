const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const directory=path.join(__dirname,"..");
const app=fs.readFileSync(path.join(directory,"app.js"),"utf8");
const storageKey="pixely-lost-sky-saves-v2";

function boot(saved,initialVersion="12"){
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
  const views=["home","chapters","collection","story"].map(key=>{
    const result=node(`view:${key}`);
    result.dataset.view=key;
    return result;
  });
  const document={
    readyState:"complete",baseURI:"https://example.com/fanmade_pixely/",visibilityState:"visible",
    createElement(tag){return node(`element:${tag}:${++elementCount}`)},
    querySelector:node,
    querySelectorAll(selector){
      if(selector==="[data-view]") return views;
      if(selector===".diary-tabs button") return tabs;
      if(["[data-open-collection]","[data-open-chapters]","[data-go-home]","[data-close-modal]"].includes(selector)) return [node(selector)];
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
    node,storage,requests,tick:()=>interval(),
    setVersion(value){publishedVersion=value},
    setConfirm(value){confirmResult=value},
    setStorageFailure(value){failStorage=value},
    click(selector){node(selector).listeners.click()},
    dialogueNext(){node("#dialogue-actions").children[0].listeners.click()},
    spot(id){
      const item=node("#room-hotspots").children.find(child=>child.dataset.spot===id);
      assert.ok(item,`missing hotspot: ${id}`);
      node("#room-hotspots").listeners.click({target:{closest(){return item}}});
    },
    selectItem(id){
      const item=node("#story-inventory").children.find(child=>child.dataset.inventory===id);
      assert.ok(item,`missing inventory item: ${id}`);
      node("#story-inventory").listeners.click({target:{closest(){return item}}});
    },
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

test("new game opens chapter one and persists the active slot",()=>{
  const state=boot();
  state.click("#new-game-button");
  state.slotAction("new-slot",2);
  const saved=JSON.parse(state.storage.get(storageKey));
  assert.equal(saved.activeSlot,2);
  assert.deepEqual(saved.slots[2].collection.cards,["dreamer"]);
  assert.equal(state.node("view:story").hidden,false);
  assert.match(state.node("#dialogue-text").textContent,/생일을 하루 앞둔 밤/);
});

test("chapter one delivers found items, records the postcard, and resumes after reload",()=>{
  const state=boot();
  state.click("#new-game-button");
  state.slotAction("new-slot",0);
  for(let i=0;i<6;i++) state.dialogueNext();
  assert.equal(state.node("#room-hotspots").children.length,9);
  state.spot("gongryong");
  for(const [place,item,person] of [["box","ribbon","suhyeon"],["table","candles","deokgae"],["drawer","tape","rader"]]){
    state.spot(place);
    state.selectItem(item);
    state.spot(person);
  }
  assert.equal(state.node("#story-counter").textContent,"준비 3 / 3");
  state.spot("bed");
  const saved=JSON.parse(state.storage.get(storageKey));
  assert.equal(saved.slots[0].story.phase,"done");
  assert.ok(saved.slots[0].completedChapters.includes("night"));
  assert.ok(saved.slots[0].collection.postcards.includes("birthday-prep"));
  assert.ok(saved.slots[0].collection.cards.includes("gongryong"));
  const resumed=boot(saved);
  resumed.click("#continue-button");
  assert.match(resumed.node("#dialogue-text").textContent,/다음 날 아침/);
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
  state.setVersion("13");
  state.tick();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,false);
  state.click("#update-later-button");
  assert.equal(state.node("#update-modal").hidden,true);
  state.tick();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(state.node("#update-modal").hidden,true);
  const stale=boot(undefined,"13");
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
