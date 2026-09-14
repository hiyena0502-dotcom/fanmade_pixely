(() => {
  if (window.__PIXELY_GAME_V4__) return;
  window.__PIXELY_GAME_V4__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const GAME_KEY = 'pixely-game-v1';
  const META_KEY = 'pixely-collection-groups-v2';
  const SERIES_ARCHIVE_KEY = 'pixely-series-archive-v1';
  const ONE_COST = 100;
  const TEN_COST = 950;
  const POWERS = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50];
  const COMBO_REWARDS = { 25: 5, 50: 10, 100: 30, 250: 100 };

  const upgrades = [
    { id:'game-upgrade-small', name:'작은 별조각', symbol:'✦', rarity:'CLOUD', color:'#9ebdce', exp:1, shortNote:'CLICK EXP +1', description:'클릭 성장에 사용하는 작은 별조각.' },
    { id:'game-upgrade-shining', name:'빛나는 별조각', symbol:'✧', rarity:'SKY', color:'#79bff2', exp:3, shortNote:'CLICK EXP +3', description:'조금 더 많은 CLICK EXP를 주는 별조각.' },
    { id:'game-upgrade-crystal', name:'별의 결정', symbol:'◆', rarity:'STAR', color:'#d4ad4d', exp:10, shortNote:'CLICK EXP +10', description:'응축된 별빛이 담긴 성장 아이템.' },
    { id:'game-upgrade-rainbow', name:'무지개 결정', symbol:'◇', rarity:'RAINBOW', color:'#a08bd0', exp:20, shortNote:'CLICK EXP +20', description:'아주 많은 CLICK EXP를 주는 희귀 성장 아이템.' },
  ];

  const specials = [
    { id:'game-special-lucky', name:'LUCKY STAR', symbol:'★', rarity:'STAR', color:'#e2bc55', effect:'lucky', shortNote:'다음 5회의 카드 등급 확률 UP', description:'다음 카드 뽑기 5회 동안 높은 등급 확률이 조금 올라갑니다.' },
    { id:'game-special-double', name:'DOUBLE STAR', symbol:'✦', rarity:'STAR', color:'#82bce2', effect:'double', shortNote:'60초 동안 클릭 별가루 ×2', description:'60초 동안 클릭으로 얻는 별가루가 두 배가 됩니다.' },
    { id:'game-special-fever', name:'FEVER TICKET', symbol:'☄', rarity:'STAR', color:'#e88f98', effect:'fever', shortNote:'60초 동안 보너스 클릭 확률 UP', description:'60초 동안 Lucky/Rainbow Click 확률이 올라갑니다.' },
    { id:'game-special-rainbow-fragment', name:'RAINBOW FRAGMENT', symbol:'◇', rarity:'RAINBOW', color:'#a98cda', effect:'fragment', shortNote:'특별 가챠용 조각', description:'나중에 특별 가챠 해금에 사용할 수 있는 조각.' },
    { id:'game-special-key', name:'SECRET KEY', symbol:'⚿', rarity:'STAR', color:'#7f8ca8', effect:'key', shortNote:'비밀 콘텐츠의 열쇠', description:'비밀 머신과 히든 콘텐츠에 사용될 열쇠.' },
  ];
  const GAME_ITEM_IDS = new Set([...upgrades, ...specials].map(item => item.id));

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (value = '') => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function read(key, fallback = {}) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value && typeof value === 'object' ? value : fallback;
    } catch { return fallback; }
  }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

  function readCore() {
    const core = read(CORE_KEY, {});
    core.owned = core.owned && typeof core.owned === 'object' ? core.owned : {};
    core.gachaItems = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    core.seriesItems = Array.isArray(core.seriesItems) ? core.seriesItems : [];
    core.dust = Number.isFinite(Number(core.dust)) ? Math.max(0, Number(core.dust)) : 0;
    return core;
  }

  function powerFor(level) { return POWERS[Math.max(0, Math.min(9, level - 1))]; }
  function expNeeded(level) { return level >= 10 ? 0 : level + 2; }
  function stageFor(level) { return level >= 10 ? 6 : level >= 7 ? 5 : level >= 5 ? 4 : level >= 3 ? 3 : level >= 2 ? 2 : 1; }

  function readGame() {
    const game = {
      version: 1, clickLevel: 1, clickExp: 0, totalClicks: 0, highestCombo: 0,
      combo: 0, lastClickAt: 0, totalDraws: 0, luckyDraws: 0,
      doubleUntil: 0, feverUntil: 0, inventory: {}, gachaHistory: [],
      ...read(GAME_KEY, {})
    };
    game.clickLevel = Math.max(1, Math.min(10, Number(game.clickLevel) || 1));
    game.clickExp = Math.max(0, Number(game.clickExp) || 0);
    game.totalClicks = Math.max(0, Number(game.totalClicks) || 0);
    game.highestCombo = Math.max(0, Number(game.highestCombo) || 0);
    game.combo = Math.max(0, Number(game.combo) || 0);
    game.clickPower = powerFor(game.clickLevel);
    game.clickStage = stageFor(game.clickLevel);
    game.inventory = game.inventory && typeof game.inventory === 'object' ? game.inventory : {};
    game.gachaHistory = Array.isArray(game.gachaHistory) ? game.gachaHistory : [];
    return game;
  }
  function saveGame(game) {
    game.clickPower = powerFor(game.clickLevel);
    game.clickStage = stageFor(game.clickLevel);
    write(GAME_KEY, game);
  }

  function syncCore(core) {
    write(CORE_KEY, core);
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') {
        save.dust = core.dust;
        save.owned = core.owned;
        save.lastCardId = core.lastCardId || null;
        const known = new Set((save.gachaItems || []).map(item => item.id));
        core.gachaItems.forEach(item => { if (!known.has(item.id)) save.gachaItems.push({ ...item }); });
      }
    } catch {}
  }

  function ensureGameItems() {
    const core = readCore();
    if (core.seriesItems.length) {
      const previous = read(SERIES_ARCHIVE_KEY, {});
      write(SERIES_ARCHIVE_KEY, {
        ...previous, version:1, archivedAt:new Date().toISOString(),
        seriesItems: core.seriesItems, recentSeriesId: core.recentSeriesId || null
      });
    }
    core.seriesItems = [];
    core.recentSeriesId = null;
    core.gachaItems = core.gachaItems.map(item => ({ ...item, relatedSeriesId: null }));
    const known = new Set(core.gachaItems.map(item => item.id));
    [...upgrades, ...specials].forEach(item => {
      if (!known.has(item.id)) core.gachaItems.push({
        id:item.id, name:item.name, symbol:item.symbol, rarity:item.rarity, color:item.color,
        weight:1, shortNote:item.shortNote, relatedSeriesId:null, description:item.description, imageUrl:null
      });
    });
    syncCore(core);

    const meta = read(META_KEY, { version:2, groups:[], itemMeta:{}, bonusItems:[], bonusOwned:{}, unlockLog:[] });
    meta.groups = Array.isArray(meta.groups) ? meta.groups : [];
    meta.itemMeta = meta.itemMeta && typeof meta.itemMeta === 'object' ? meta.itemMeta : {};
    if (!meta.groups.some(group => group.id === 'growth')) meta.groups.push({ id:'growth', name:'클릭 성장', subtitle:'CLICK GROWTH', icon:'✦', color:'#79bff2', rewardId:'' });
    if (!meta.groups.some(group => group.id === 'special')) meta.groups.push({ id:'special', name:'특수 아이템', subtitle:'SPECIAL ITEMS', icon:'★', color:'#a08bd0', rewardId:'' });
    upgrades.forEach(item => { meta.itemMeta[item.id] = { ...(meta.itemMeta[item.id] || {}), groupId:'growth', type:'item', imageUrl:meta.itemMeta[item.id]?.imageUrl || '', includeInCompletion:false }; });
    specials.forEach(item => { meta.itemMeta[item.id] = { ...(meta.itemMeta[item.id] || {}), groupId:'special', type:'item', imageUrl:meta.itemMeta[item.id]?.imageUrl || '', includeInCompletion:false }; });
    write(META_KEY, meta);
  }

  function ensureStyles() {
    $('#series-disabled-style')?.remove();
    if (!$('#pixely-game-css')) {
      const link = document.createElement('link');
      link.id = 'pixely-game-css';
      link.rel = 'stylesheet';
      link.href = 'pixely-game.css?v=4';
      document.head.appendChild(link);
    }
  }

  function stageCopy(stage) {
    return ['', '작은 별 하나에서 시작해요.', '주변에 작은 별빛이 생겼어요.', '구름과 별빛이 모이기 시작했어요.', '별빛이 훨씬 강해졌어요.', '무지개 기운이 하늘에 스며들어요.', '완성된 PIXELY 하늘이 열렸어요.'][stage] || '';
  }

  function clickMarkup() {
    const game = readGame();
    const core = readCore();
    const needed = expNeeded(game.clickLevel);
    const pct = game.clickLevel >= 10 ? 100 : Math.min(100, Math.round((game.clickExp / needed) * 100));
    return `<div class="diary-spread click-spread is-active" data-spread="0">
      <div class="paper-page paper-page--left click-info-page">
        <div class="page-number">03</div><div class="washi-tape washi-tape--blue"></div>
        <span class="section-kicker">STAR DUST CLICKER</span><h2>별가루 모으기</h2>
        <p class="click-intro">가운데 별을 눌러 별가루를 모으고, 가챠에서 성장 아이템을 뽑아 CLICK LEVEL을 올려보세요.</p>
        <div class="click-balance-card"><small>STAR DUST</small><b>✦ <em data-game-dust>${core.dust.toLocaleString('ko-KR')}</em></b></div>
        <div class="click-stat-grid">
          <div><small>CLICK LEVEL</small><b data-game-level>Lv.${game.clickLevel}</b></div>
          <div><small>TOUCH POWER</small><b data-game-power>+${game.clickPower}</b></div>
          <div><small>BEST COMBO</small><b data-game-best>${game.highestCombo}</b></div>
          <div><small>TOTAL CLICK</small><b data-game-total>${game.totalClicks.toLocaleString('ko-KR')}</b></div>
        </div>
        <div class="click-exp-block"><div><span>CLICK EXP</span><b data-game-exp>${game.clickLevel >= 10 ? 'MAX' : `${game.clickExp} / ${needed}`}</b></div><span class="click-exp-track"><i data-game-expbar style="width:${pct}%"></i></span><small>강화 아이템은 가챠에서 등장해요.</small></div>
        <div class="click-boost-list"><span data-boost-double>✦ DOUBLE OFF</span><span data-boost-fever>☄ FEVER OFF</span><span data-boost-lucky>★ LUCKY OFF</span></div>
        <div class="click-stage-note"><b data-game-stage>SKY STAGE ${game.clickStage}</b><span data-game-stage-copy>${stageCopy(game.clickStage)}</span></div>
      </div>
      <div class="paper-page paper-page--right click-play-page stage-${game.clickStage}">
        <div class="page-number">04</div><div class="click-combo-badge" data-game-combo>${game.combo > 1 ? `${game.combo} COMBO` : 'READY'}</div>
        <div class="click-sky-decor" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><span class="click-cloud c1"></span><span class="click-cloud c2"></span></div>
        <button class="game-click-orb" id="game-click-orb" type="button" aria-label="별가루 얻기"><span class="click-orb-halo"></span><span class="click-orb-star">✦</span><b>CLICK!</b><small data-game-orb-power>+${game.clickPower} / TOUCH</small></button>
        <p class="click-hint">Lucky 4.5% · Rainbow 0.5% · 빠르게 누르면 COMBO!</p>
        <button class="click-go-gacha" type="button" data-game-open-gacha>별가루로 가챠 돌리기 →</button>
      </div>
    </div>`;
  }

  function ensureClickPage() {
    $('#series-disabled-style')?.remove();
    const tab = $('[data-tab="series"]');
    const panel = $('[data-panel="series"]');
    if (!tab || !panel) return false;
    tab.style.setProperty('display', 'flex', 'important');
    tab.classList.remove('tab--series');
    tab.classList.add('tab--click');
    tab.innerHTML = '<span aria-hidden="true">✦</span><b>CLICK</b>';
    panel.setAttribute('aria-label', '별가루 클릭커');
    if (!$('#pixely-click-app', panel)) {
      panel.innerHTML = `<div class="click-app" id="pixely-click-app">${clickMarkup()}</div>`;
    }
    return true;
  }

  function setClickMode(on) { document.body.classList.toggle('pixely-click-mode', !!on); }
  function openClick() {
    ensureClickPage();
    const tab = $('[data-tab="series"]');
    if (tab) tab.click();
    setTimeout(() => { setClickMode(true); updateClickUI(); }, 0);
  }

  function toast(message) {
    const node = $('#toast'); if (!node) return;
    node.textContent = message; node.classList.add('is-visible');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function updateClickUI() {
    const app = $('#pixely-click-app'); if (!app) return;
    const game = readGame(); const core = readCore(); const needed = expNeeded(game.clickLevel);
    const pct = game.clickLevel >= 10 ? 100 : Math.min(100, Math.round((game.clickExp / needed) * 100));
    $$('[data-game-dust]', app).forEach(el => el.textContent = core.dust.toLocaleString('ko-KR'));
    const set = (sel, text) => { const el=$(sel,app); if(el) el.textContent=text; };
    set('[data-game-level]', `Lv.${game.clickLevel}`); set('[data-game-power]', `+${game.clickPower}`); set('[data-game-best]', String(game.highestCombo));
    set('[data-game-total]', game.totalClicks.toLocaleString('ko-KR')); set('[data-game-exp]', game.clickLevel >= 10 ? 'MAX' : `${game.clickExp} / ${needed}`);
    const bar=$('[data-game-expbar]',app); if(bar) bar.style.width=`${pct}%`; set('[data-game-combo]', game.combo > 1 ? `${game.combo} COMBO` : 'READY');
    set('[data-game-orb-power]', `+${game.clickPower} / TOUCH`); set('[data-game-stage]', `SKY STAGE ${game.clickStage}`); set('[data-game-stage-copy]', stageCopy(game.clickStage));
    const play=$('.click-play-page',app); if(play) play.className=`paper-page paper-page--right click-play-page stage-${game.clickStage}`;
    const now=Date.now();
    const double=$('[data-boost-double]',app); if(double){double.classList.toggle('is-active',game.doubleUntil>now);double.textContent=`✦ DOUBLE ${game.doubleUntil>now?'ON':'OFF'}`;}
    const fever=$('[data-boost-fever]',app); if(fever){fever.classList.toggle('is-active',game.feverUntil>now);fever.textContent=`☄ FEVER ${game.feverUntil>now?'ON':'OFF'}`;}
    const lucky=$('[data-boost-lucky]',app); if(lucky){lucky.classList.toggle('is-active',game.luckyDraws>0);lucky.textContent=`★ LUCKY ${game.luckyDraws>0?`${game.luckyDraws}회`:'OFF'}`;}
  }

  function updateGlobalUI() {
    const core=readCore(), game=readGame();
    $$('[data-dust-count]').forEach(el=>el.textContent=core.dust.toLocaleString('ko-KR'));
    const homeCard=$('.home-recent-series');
    if(homeCard){homeCard.style.setProperty('display','grid','important');homeCard.dataset.openTab='series';const label=$('.feature-card__label',homeCard);if(label)label.textContent='STAR DUST CLICKER';const title=$('#home-recent-series-title');if(title)title.textContent=`CLICK Lv.${game.clickLevel}`;const copy=$('#home-recent-series-copy');if(copy)copy.textContent=`터치당 +${game.clickPower} · 최고 콤보 ${game.highestCombo}`;const art=$('.feature-card__art',homeCard);if(art&&!$('.home-click-star',art))art.innerHTML='<span class="home-click-star">✦</span><i class="home-click-ring"></i>';}
    const stats=$$('.home-stats > div');if(stats[1]){stats[1].style.setProperty('display','flex','important');const l=$('span',stats[1]);if(l)l.textContent='CLICK LEVEL';const v=$('b',stats[1]);if(v)v.innerHTML=`<em>Lv.${game.clickLevel}</em>`;}
    const draw=$('#draw-button');if(draw){const b=$('b',draw),s=$('small',draw);if(b)b.textContent='1회 뽑기';if(s)s.textContent='✦ 100';draw.classList.toggle('is-insufficient',core.dust<ONE_COST);let ten=$('#draw-ten-button');if(!ten){ten=document.createElement('button');ten.id='draw-ten-button';ten.type='button';ten.className='draw-ten-button';ten.innerHTML='<span>✦</span><b>10연속 뽑기</b><small>✦ 950</small>';draw.after(ten);}ten.classList.toggle('is-insufficient',core.dust<TEN_COST);}
    const gh=$('#gacha-heading');if(gh)gh.textContent='PIXELY CAPSULE';const rules=$$('.gacha-rule li');if(rules[0])rules[0].textContent='CLICK에서 별가루를 모아요.';if(rules[1])rules[1].textContent='✦100으로 1회, ✦950으로 10연속 뽑기를 해요.';if(rules[2])rules[2].textContent='카드 82% · 강화 아이템 15% · 특수 아이템 3%';
    $('[data-settings-tab="series"]')?.style.setProperty('display','none','important');$('[data-settings-panel="series"]')?.style.setProperty('display','none','important');$('[data-reset="series"]')?.style.setProperty('display','none','important');
  }

  function spawnFloat(orb,kind,amount,comboBonus){const page=orb.closest('.click-play-page');if(!page)return;const f=document.createElement('span');f.className=`click-float is-${kind.toLowerCase()}`;f.textContent=`${kind==='NORMAL'?'':`${kind}! `}+${amount}${comboBonus?` · COMBO +${comboBonus}`:''}`;f.style.left=`${42+Math.random()*16}%`;f.style.top='41%';page.appendChild(f);setTimeout(()=>f.remove(),900);orb.classList.add('is-hit');setTimeout(()=>orb.classList.remove('is-hit'),100);}
  function doClick(orb){const game=readGame(),now=Date.now();game.combo=now-game.lastClickAt<=1100?game.combo+1:1;game.lastClickAt=now;game.totalClicks+=1;game.highestCombo=Math.max(game.highestCombo,game.combo);const fever=game.feverUntil>now,roll=Math.random();let kind='NORMAL',rm=1;const rc=fever?0.01:0.005,lc=fever?0.12:0.045;if(roll<rc){kind='RAINBOW';rm=10}else if(roll<rc+lc){kind='LUCKY';rm=3}const tm=game.doubleUntil>now?2:1,cb=COMBO_REWARDS[game.combo]||0,amount=game.clickPower*rm*tm+cb;const core=readCore();core.dust+=amount;syncCore(core);saveGame(game);spawnFloat(orb,kind,amount,cb);updateClickUI();updateGlobalUI();}

  function rarityRoll(boosted){const table=boosted?[['CLOUD',55],['SKY',28],['STAR',12],['RAINBOW',4.7],['SECRET',0.3]]:[['CLOUD',70],['SKY',22],['STAR',6.5],['RAINBOW',1.4],['SECRET',0.1]];const roll=Math.random()*100;let sum=0;for(const [r,c] of table){sum+=c;if(roll<sum)return r;}return'CLOUD';}
  function pickCard(core,meta,game){const pool=core.gachaItems.filter(item=>!GAME_ITEM_IDS.has(item.id)&&meta.itemMeta?.[item.id]?.type!=='item');if(!pool.length)return null;const target=rarityRoll(game.luckyDraws>0);if(game.luckyDraws>0)game.luckyDraws-=1;const matched=pool.filter(item=>String(item.rarity||'').toUpperCase()===target),candidates=matched.length?matched:pool;return candidates[Math.floor(Math.random()*candidates.length)];}
  function pickUpgrade(){const r=Math.random()*100;return r<65?upgrades[0]:r<90?upgrades[1]:r<98?upgrades[2]:upgrades[3];}
  function duplicateRefund(r){return{CLOUD:2,SKY:4,STAR:8,RAINBOW:15,SECRET:30}[String(r||'').toUpperCase()]||2;}
  function applyLevelUps(game){let leveled=false;while(game.clickLevel<10){const needed=expNeeded(game.clickLevel);if(game.clickExp<needed)break;game.clickExp-=needed;game.clickLevel+=1;leveled=true;}game.clickPower=powerFor(game.clickLevel);game.clickStage=stageFor(game.clickLevel);return leveled;}
  function outcome(core,game,meta){game.totalDraws+=1;const roll=Math.random();if(roll<0.82){const item=pickCard(core,meta,game);if(item){const before=Number(core.owned[item.id]||0),duplicate=before>0,refund=duplicate?duplicateRefund(item.rarity):0;core.owned[item.id]=before+1;core.lastCardId=item.id;core.dust+=refund;return{kind:'card',...item,duplicate,refund,imageUrl:item.imageUrl||meta.itemMeta?.[item.id]?.imageUrl||''};}}if(roll<0.97){const item=pickUpgrade();core.owned[item.id]=Number(core.owned[item.id]||0)+1;game.inventory[item.id]=Number(game.inventory[item.id]||0)+1;game.clickExp+=item.exp;return{kind:'upgrade',...item,levelUp:applyLevelUps(game)};}const item=specials[Math.floor(Math.random()*specials.length)];core.owned[item.id]=Number(core.owned[item.id]||0)+1;game.inventory[item.id]=Number(game.inventory[item.id]||0)+1;if(item.effect==='lucky')game.luckyDraws+=5;if(item.effect==='double')game.doubleUntil=Date.now()+60000;if(item.effect==='fever')game.feverUntil=Date.now()+60000;return{kind:'special',...item};}

  function resultArt(result){return result.imageUrl?`<img src="${esc(result.imageUrl)}" alt="${esc(result.name)}">`:`<span class="game-result-symbol">${esc(result.symbol||'✦')}</span>`;}
  function showSingle(result,game){const modal=$('#result-modal');if(!modal)return;const card=$('#result-card'),k=$('#result-kicker'),t=$('#result-title'),c=$('#result-copy'),p=$('#result-primary-action');card.innerHTML=`<div class="game-gacha-result is-${result.kind}" style="--game-result-color:${result.color||'#79bff2'}"><span>${esc(result.rarity||result.kind.toUpperCase())}</span><div>${resultArt(result)}</div><b>${esc(result.name)}</b><small>${esc(result.shortNote||'')}</small></div>`;if(result.kind==='card'){k.textContent=result.duplicate?'DUPLICATE':'NEW!';t.textContent=result.name;c.textContent=result.duplicate?`중복 보상 · 별가루 +${result.refund}`:`${result.rarity} CARD · 컬렉션에 저장됐어요.`;p.textContent=result.duplicate?'확인':'컬렉션 보기';}else if(result.kind==='upgrade'){k.textContent=result.levelUp?'LEVEL UP!':'CLICK GROWTH';t.textContent=result.levelUp?`CLICK Lv.${game.clickLevel} 달성!`:result.name;c.textContent=`CLICK EXP +${result.exp}${result.levelUp?` · TOUCH POWER +${game.clickPower}`:''}`;p.textContent='확인';}else{k.textContent='SPECIAL ITEM';t.textContent=result.name;c.textContent=result.shortNote;p.textContent='확인';}modal.hidden=false;}
  function showBatch(results){let modal=$('#game-batch-modal');if(!modal){modal=document.createElement('div');modal.id='game-batch-modal';modal.className='game-batch-modal';modal.hidden=true;modal.innerHTML='<div class="game-batch-backdrop" data-game-close-batch></div><section class="game-batch-sheet"><button class="game-batch-close" type="button" data-game-close-batch>×</button><span>PIXELY CAPSULE · 10 DRAW</span><h2>10연속 뽑기 결과</h2><div class="game-batch-grid"></div><div class="game-batch-actions"><button type="button" data-game-close-batch>확인</button><button type="button" data-game-batch-collection>컬렉션 보기</button></div></section>';document.body.appendChild(modal);}$('.game-batch-grid',modal).innerHTML=results.map(result=>`<article class="game-batch-item"><span>${esc(result.rarity||result.kind.toUpperCase())}</span><div>${resultArt(result)}</div><b>${esc(result.name)}</b><small>${result.kind==='upgrade'?`EXP +${result.exp}`:result.kind==='card'&&result.duplicate?`DUP +${result.refund}`:result.kind==='special'?'SPECIAL':'NEW'}</small></article>`).join('');modal.hidden=false;}
  function draw(count,cost){const core=readCore();if(core.dust<cost){toast(`별가루가 부족해요. CLICK에서 ✦ ${cost.toLocaleString('ko-KR')}까지 모아주세요.`);openClick();return;}const game=readGame(),meta=read(META_KEY,{itemMeta:{}}),results=[];core.dust-=cost;for(let i=0;i<count;i++){const result=outcome(core,game,meta);results.push(result);game.gachaHistory.unshift({at:new Date().toISOString(),kind:result.kind,id:result.id,name:result.name,rarity:result.rarity||null,duplicate:!!result.duplicate});}game.gachaHistory=game.gachaHistory.slice(0,120);syncCore(core);saveGame(game);updateClickUI();updateGlobalUI();if(count===1)showSingle(results[0],game);else showBatch(results);document.dispatchEvent(new CustomEvent('pixely-game-updated'));}

  function bind(){document.addEventListener('click',event=>{const orb=event.target.closest?.('#game-click-orb');if(orb){event.preventDefault();event.stopPropagation();doClick(orb);return;}if(event.target.closest?.('[data-game-open-gacha]')){event.preventDefault();$('[data-tab="gacha"]')?.click();setClickMode(false);return;}if(event.target.closest?.('#draw-button')){event.preventDefault();event.stopImmediatePropagation();draw(1,ONE_COST);return;}if(event.target.closest?.('#draw-ten-button')){event.preventDefault();event.stopImmediatePropagation();draw(10,TEN_COST);return;}if(event.target.closest?.('#draw-again')){event.preventDefault();event.stopImmediatePropagation();const modal=$('#result-modal');if(modal)modal.hidden=true;draw(1,ONE_COST);return;}if(event.target.closest?.('[data-game-close-batch]')){const modal=$('#game-batch-modal');if(modal)modal.hidden=true;return;}if(event.target.closest?.('[data-game-batch-collection]')){const modal=$('#game-batch-modal');if(modal)modal.hidden=true;$('[data-tab="collection"]')?.click();return;}if(event.target.closest?.('[data-tab="series"], [data-open-tab="series"]'))setTimeout(()=>{ensureClickPage();setClickMode(true);updateClickUI();},0);if(event.target.closest?.('[data-tab="home"], [data-tab="gacha"], [data-tab="collection"], [data-go-home]'))setClickMode(false);if(event.target.closest?.('#open-settings'))setTimeout(updateGlobalUI,0);},true);}
  function boot(){ensureStyles();ensureGameItems();ensureClickPage();updateClickUI();updateGlobalUI();bind();setInterval(()=>{const game=readGame();if(game.combo&&Date.now()-game.lastClickAt>1300){game.combo=0;saveGame(game);}updateClickUI();updateGlobalUI();},1000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();