(() => {
  if (window.__PIXELY_GACHA_UPGRADE_V1__) return;
  window.__PIXELY_GACHA_UPGRADE_V1__ = true;

  const CORE_KEY = 'pixely-diary-save-v1';
  const DRAW_COST = 100;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function readCore() {
    try {
      const data = JSON.parse(localStorage.getItem(CORE_KEY) || '{}');
      return data && typeof data === 'object' ? data : {};
    } catch {
      return {};
    }
  }

  function writeCore(core) {
    core.dust = Math.max(0, Number(core.dust) || 0);
    localStorage.setItem(CORE_KEY, JSON.stringify(core));
    try {
      if (typeof save !== 'undefined' && save && typeof save === 'object') save.dust = core.dust;
      if (typeof persistSave === 'function') persistSave();
    } catch {}
    $$('[data-dust-count], [data-pcf-dust]').forEach(node => {
      node.textContent = core.dust.toLocaleString('ko-KR');
    });
  }

  function toast(message) {
    const node = $('#toast');
    if (!node) return;
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => node.classList.remove('is-visible'), 1900);
  }

  function goClick() {
    const tab = $('[data-tab="series"]');
    if (tab) tab.click();
  }

  function installStyle() {
    if ($('#pixely-gacha-upgrade-style')) return;
    const style = document.createElement('style');
    style.id = 'pixely-gacha-upgrade-style';
    style.textContent = `
      [data-panel="gacha"] .diary-spread{
        position:relative;
        overflow:hidden;
        background:linear-gradient(135deg,#eef9ff 0%,#f7f3ff 52%,#fff4f8 100%)!important;
      }
      [data-panel="gacha"] .paper-page{
        overflow:hidden;
        isolation:isolate;
      }
      [data-panel="gacha"] .gacha-info{
        padding:46px 54px!important;
        background:
          radial-gradient(circle at 14% 18%,rgba(255,255,255,.95) 0 70px,transparent 72px),
          radial-gradient(circle at 88% 12%,rgba(133,199,255,.30) 0 92px,transparent 94px),
          linear-gradient(145deg,#e8f8ff 0%,#eef0ff 52%,#f8eaff 100%)!important;
      }
      [data-panel="gacha"] .gacha-play{
        padding:34px 38px 38px!important;
        display:flex!important;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        background:
          radial-gradient(circle at 78% 16%,rgba(255,255,255,.82) 0 72px,transparent 74px),
          radial-gradient(circle at 12% 78%,rgba(255,175,209,.24) 0 110px,transparent 112px),
          linear-gradient(155deg,#eef7ff 0%,#ebe8ff 48%,#ffeaf2 100%)!important;
      }
      [data-panel="gacha"] .gacha-info::before,
      [data-panel="gacha"] .gacha-info::after,
      [data-panel="gacha"] .gacha-play::before,
      [data-panel="gacha"] .gacha-play::after{
        content:'';
        position:absolute;
        z-index:0;
        pointer-events:none;
      }
      [data-panel="gacha"] .gacha-info::before{
        width:210px;height:210px;border-radius:50%;
        left:-90px;bottom:-78px;
        border:26px solid rgba(118,192,239,.16);
      }
      [data-panel="gacha"] .gacha-info::after{
        width:80px;height:80px;right:42px;bottom:58px;
        border-radius:24px;
        background:linear-gradient(135deg,rgba(127,167,242,.22),rgba(201,145,235,.24));
        transform:rotate(28deg);
      }
      [data-panel="gacha"] .gacha-play::before{
        width:170px;height:170px;border-radius:50%;
        right:-58px;top:72px;
        background:linear-gradient(145deg,rgba(119,201,255,.20),rgba(176,139,241,.18));
      }
      [data-panel="gacha"] .gacha-play::after{
        width:86px;height:86px;left:44px;top:112px;
        clip-path:polygon(50% 0,61% 36%,100% 50%,61% 64%,50% 100%,39% 64%,0 50%,39% 36%);
        background:linear-gradient(135deg,rgba(255,255,255,.9),rgba(255,194,222,.45));
        filter:drop-shadow(0 8px 20px rgba(122,143,196,.16));
      }
      [data-panel="gacha"] .gacha-info > *,
      [data-panel="gacha"] .gacha-play > *{position:relative;z-index:2}
      [data-panel="gacha"] .section-kicker{
        display:inline-flex!important;
        width:max-content;
        padding:7px 12px;
        border-radius:999px;
        background:rgba(255,255,255,.65);
        box-shadow:inset 0 0 0 1px rgba(114,151,195,.14);
        color:#758cb7!important;
      }
      [data-panel="gacha"] .gacha-info h2{
        margin-top:12px!important;
        font-size:clamp(31px,2.5vw,43px)!important;
        line-height:1.12!important;
        color:#455f86!important;
        text-shadow:0 2px 0 rgba(255,255,255,.75);
      }
      [data-panel="gacha"] .gacha-info>p{
        max-width:430px;
        color:#70829b!important;
        font-size:14px!important;
        line-height:1.75!important;
      }
      [data-panel="gacha"] .rarity-list{
        display:grid!important;
        grid-template-columns:1fr 1fr;
        gap:10px!important;
        margin-top:20px!important;
      }
      [data-panel="gacha"] .rarity-list>div{
        min-height:68px;
        padding:12px 14px!important;
        border:1px solid rgba(117,151,190,.14)!important;
        border-radius:18px!important;
        background:linear-gradient(135deg,rgba(255,255,255,.78),rgba(255,255,255,.46))!important;
        box-shadow:0 8px 24px rgba(70,104,145,.07)!important;
        backdrop-filter:blur(6px);
      }
      [data-panel="gacha"] .gacha-rule{
        margin-top:18px!important;
        padding:16px 18px!important;
        border:1px solid rgba(142,123,207,.13)!important;
        border-radius:20px!important;
        background:linear-gradient(135deg,rgba(255,255,255,.62),rgba(247,239,255,.68))!important;
        box-shadow:0 10px 28px rgba(91,78,145,.07)!important;
      }
      [data-panel="gacha"] .gacha-counts{
        width:min(92%,470px)!important;
        margin:0 auto 18px!important;
        display:flex!important;
        justify-content:center!important;
        gap:10px!important;
      }
      [data-panel="gacha"] .gacha-counts>span{
        flex:1;
        padding:10px 14px!important;
        border:1px solid rgba(105,143,190,.15)!important;
        border-radius:999px!important;
        background:rgba(255,255,255,.72)!important;
        box-shadow:0 8px 22px rgba(81,105,154,.08)!important;
        text-align:center;
        backdrop-filter:blur(7px);
      }
      [data-panel="gacha"] .gacha-machine{
        transform:scale(1.24)!important;
        transform-origin:center center!important;
        margin:36px auto 40px!important;
        filter:drop-shadow(0 22px 24px rgba(87,92,151,.18));
      }
      [data-panel="gacha"] .machine-glass{
        border-color:rgba(255,255,255,.8)!important;
        background:linear-gradient(155deg,rgba(255,255,255,.92),rgba(205,233,255,.78) 45%,rgba(230,210,255,.72))!important;
        box-shadow:inset 0 0 0 2px rgba(132,177,222,.16),inset 0 18px 30px rgba(255,255,255,.45)!important;
      }
      [data-panel="gacha"] .machine-base{
        background:linear-gradient(145deg,#9bb9ef,#a990e3 55%,#ec9dbc)!important;
        box-shadow:inset 0 2px 0 rgba(255,255,255,.42),0 12px 26px rgba(100,88,157,.18)!important;
      }
      [data-panel="gacha"] .machine-knob{
        background:linear-gradient(145deg,#fff7ca,#ffd36e)!important;
        box-shadow:0 6px 15px rgba(119,88,35,.22),inset 0 1px 0 #fff!important;
      }
      [data-panel="gacha"] .draw-button{
        width:min(86%,460px)!important;
        min-height:86px!important;
        margin:16px auto 0!important;
        padding:15px 28px!important;
        border:0!important;
        border-radius:28px!important;
        background:linear-gradient(120deg,#65bff4 0%,#8b91ef 42%,#b77de2 68%,#ee8fb7 100%)!important;
        box-shadow:0 16px 34px rgba(111,104,196,.28),inset 0 1px 0 rgba(255,255,255,.48)!important;
        color:white!important;
        transform:none!important;
        transition:transform .16s ease,box-shadow .16s ease,filter .16s ease!important;
      }
      [data-panel="gacha"] .draw-button:hover{
        transform:translateY(-3px) scale(1.015)!important;
        box-shadow:0 20px 38px rgba(111,104,196,.34),inset 0 1px 0 rgba(255,255,255,.5)!important;
        filter:saturate(1.08);
      }
      [data-panel="gacha"] .draw-button:active{transform:translateY(1px) scale(.985)!important}
      [data-panel="gacha"] .draw-button>span{
        display:grid!important;
        place-items:center;
        width:42px;height:42px;
        border-radius:50%;
        background:rgba(255,255,255,.18)!important;
        box-shadow:inset 0 0 0 1px rgba(255,255,255,.26);
        font-size:22px!important;
      }
      [data-panel="gacha"] .draw-button b{font-size:18px!important;letter-spacing:.04em}
      [data-panel="gacha"] .draw-button small{color:rgba(255,255,255,.86)!important;font-size:11px!important;font-weight:800!important}
      [data-panel="gacha"] .gacha-message{
        margin-top:14px!important;
        padding:8px 14px;
        border-radius:999px;
        background:rgba(255,255,255,.52);
        color:#7587a1!important;
      }
      .result-box{
        width:min(540px,calc(100vw - 32px))!important;
        padding:34px 38px 32px!important;
        border-radius:32px!important;
        border:1px solid rgba(255,255,255,.68)!important;
        background:
          radial-gradient(circle at 18% 10%,rgba(255,255,255,.96) 0 70px,transparent 72px),
          linear-gradient(145deg,#eef9ff 0%,#f1edff 52%,#fff0f6 100%)!important;
        box-shadow:0 28px 80px rgba(60,77,128,.28)!important;
      }
      .result-card{transform:scale(1.12);margin:18px auto 26px!important}
      .result-button--again,.result-button--close{
        min-height:48px!important;
        border-radius:16px!important;
      }
      .result-button--close{
        background:linear-gradient(120deg,#71c4f1,#9b8eea,#e891b8)!important;
        color:#fff!important;
        border:0!important;
      }
      @media(max-width:900px){
        [data-panel="gacha"] .gacha-info{padding:34px!important}
        [data-panel="gacha"] .rarity-list{grid-template-columns:1fr!important}
        [data-panel="gacha"] .gacha-machine{transform:scale(1.08)!important;margin:24px auto 28px!important}
        [data-panel="gacha"] .draw-button{width:92%!important}
      }
    `;
    document.head.appendChild(style);
  }

  function decorate() {
    const draw = $('#draw-button');
    if (draw) {
      const label = $('b', draw);
      const sub = $('small', draw);
      if (label) label.textContent = '1회 뽑기';
      if (sub) sub.textContent = `별가루 ✦ ${DRAW_COST} 사용`;
    }
    const infoTitle = $('[data-panel="gacha"] .gacha-info h2');
    if (infoTitle) infoTitle.textContent = '하늘빛 캡슐 뽑기';
  }

  document.addEventListener('click', event => {
    const draw = event.target.closest?.('#draw-button, #draw-again');
    if (!draw || draw.disabled || event.__pixelyDustCharged) return;

    const core = readCore();
    const items = Array.isArray(core.gachaItems) ? core.gachaItems : [];
    if (!items.length) return;

    const dust = Math.max(0, Number(core.dust) || 0);
    if (dust < DRAW_COST) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      toast(`별가루가 부족해요. 1회 뽑기에는 ✦ ${DRAW_COST}이 필요해요.`);
      if (draw.id === 'draw-again') $('#result-modal')?.setAttribute('hidden', '');
      setTimeout(goClick, 100);
      return;
    }

    event.__pixelyDustCharged = true;
    core.dust = dust - DRAW_COST;
    writeCore(core);
    if (draw.id === 'draw-button') {
      const message = $('#gacha-message');
      if (message) message.textContent = `별가루 ✦ ${DRAW_COST}을 사용했어요. 캡슐을 열고 있어요…`;
    }
  }, true);

  function boot() {
    installStyle();
    decorate();
    const panel = $('[data-panel="gacha"]');
    if (panel) new MutationObserver(decorate).observe(panel, { childList:true, subtree:true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true });
  else boot();
})();