/* 通用人格测试引擎：页面里先定义 window.QUIZ = {...}，再引入本文件 */
(function(){
const C=window.QUIZ, K=C.colors, TYPES=C.types, QS=C.questions;
document.title=C.title;

/* ---------- 样式 ---------- */
const css=`
:root{--paper:${K.paper};--card:${K.card};--ink:${K.ink};--muted:${K.muted};--acc:${K.accent};--acc-soft:${K.accentSoft};--dark:${K.dark};--line:${K.line}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--paper);color:var(--ink)}
body{font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;line-height:1.6;min-height:100vh;-webkit-tap-highlight-color:transparent}
.wrap{max-width:480px;margin:0 auto;padding:24px 16px 40px}
.screen{display:none}.screen.on{display:block;animation:fade .35s ease}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.ticket{background:var(--card);border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.07)}
.ticket-top{background:var(--dark);color:var(--paper);padding:22px 22px 18px}
.ticket-top small{letter-spacing:.2em;opacity:.75;font-size:12px}
.ticket-top h1{font-size:28px;line-height:1.3;margin-top:8px;font-weight:700}
.route{display:flex;align-items:center;gap:10px;margin-top:14px;font-size:14px;opacity:.9}
.route i{flex:1;border-top:1px dashed currentColor;opacity:.6}
.perf{border-top:2px dashed var(--line);margin:0 18px}
.ticket-body{padding:20px 22px 24px}
.ticket-body p{color:var(--muted);font-size:15px}
.meta{display:flex;gap:16px;margin:16px 0 20px;font-size:13px;color:var(--muted)}
.meta b{display:block;color:var(--ink);font-size:16px}
.btn{display:block;width:100%;border:0;border-radius:999px;padding:15px;font-size:17px;font-weight:600;background:var(--acc);color:#fff;cursor:pointer;font-family:inherit}
.btn:active{transform:scale(.98)}
.btn.ghost{background:transparent;color:var(--acc);border:1.5px solid var(--acc)}
.note{font-size:12px;color:var(--muted);text-align:center;margin-top:18px}
.bar{height:6px;background:var(--line);border-radius:3px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--acc);width:0;transition:width .3s}
.qhead{display:flex;justify-content:space-between;align-items:center;margin:14px 0 18px;font-size:13px;color:var(--muted)}
.back{background:none;border:0;color:var(--muted);font-size:13px;cursor:pointer;font-family:inherit}
.back[disabled]{visibility:hidden}
.qtext{font-size:20px;font-weight:600;line-height:1.5;margin-bottom:20px}
.opt{display:block;width:100%;text-align:left;background:var(--card);border:1.5px solid var(--line);border-radius:14px;padding:15px 16px;margin-bottom:12px;font-size:16px;color:var(--ink);cursor:pointer;font-family:inherit;line-height:1.5;transition:border-color .15s,background .15s}
.opt:active,.opt.picked{border-color:var(--acc);background:var(--acc-soft)}
.loading{text-align:center;padding-top:30vh}
.spin{font-size:44px;display:inline-block;animation:bob 1.2s ease-in-out infinite}
@keyframes bob{0%,100%{transform:translateY(-8px)}50%{transform:translateY(8px)}}
.loading p{margin-top:16px;color:var(--muted)}
.res-card{background:var(--card);border-radius:18px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.07)}
.res-top{background:var(--dark);color:var(--paper);padding:22px;text-align:center}
.res-top small{letter-spacing:.2em;opacity:.75;font-size:12px}
.res-emoji{font-size:52px;line-height:1.2;margin-top:10px}
.res-name{font-size:30px;font-weight:700;margin-top:4px}
.res-alias{opacity:.85;font-size:14px}
.tags{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:14px}
.tags span{border:1px solid currentColor;border-radius:999px;padding:2px 12px;font-size:13px;opacity:.85}
.res-body{padding:20px 22px 24px}
.quote{font-size:17px;font-weight:600;color:var(--acc);text-align:center;margin-bottom:16px}
.sec{margin-top:18px}.sec h3{font-size:14px;color:var(--dark);letter-spacing:.05em;margin-bottom:6px}.sec p{font-size:15px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}
.pair div{background:var(--paper);border-radius:12px;padding:10px 12px;font-size:14px}
.pair b{display:block;font-size:12px;color:var(--muted);font-weight:500}
.dims .row{display:flex;align-items:center;gap:10px;font-size:13px;margin-top:6px}
.dims .row span:first-child{width:96px;flex:none}.dims .row .bar{flex:1}
.dims .row span:last-child{width:36px;text-align:right;color:var(--muted)}
.actions{display:grid;gap:12px;margin-top:22px}
.modal{position:fixed;inset:0;background:rgba(15,12,10,.75);display:none;align-items:center;justify-content:center;flex-direction:column;padding:20px;z-index:10}
.modal.on{display:flex}.modal img{max-width:100%;max-height:78vh;border-radius:12px}
.modal p{color:#fff;margin-top:12px;font-size:14px}
.modal button{margin-top:10px;background:none;border:1px solid #fff;color:#fff;border-radius:999px;padding:6px 20px;font-family:inherit}`;
const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
const mc=document.createElement('meta'); mc.name='color-scheme'; mc.content='light'; document.head.appendChild(mc);

/* ---------- 页面结构 ---------- */
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
document.body.innerHTML=`<div class="wrap">
<section class="screen on" id="s-cover"><div class="ticket">
  <div class="ticket-top"><small>${esc(C.eyebrow)}</small><h1>${C.h1}</h1>
  <div class="route"><span>${esc(C.from)}</span><i></i><span>${esc(C.to)}</span></div></div>
  <div class="perf"></div>
  <div class="ticket-body"><p>${esc(C.intro)}</p>
  <div class="meta"><div><b>${QS.length} 题</b>情景选择</div><div><b>${Object.keys(TYPES).length} 种</b>${esc(C.typeWord)}</div><div><b>约 3 分钟</b>凭直觉选</div></div>
  <button class="btn" id="startBtn">${esc(C.start)}</button></div></div>
  <p class="note">${esc(C.note)}</p></section>
<section class="screen" id="s-quiz"><div class="bar"><i id="prog"></i></div>
  <div class="qhead"><button class="back" id="backBtn">‹ 上一题</button><span id="qnum"></span></div>
  <div class="qtext" id="qtext"></div><div id="opts"></div></section>
<section class="screen" id="s-loading"><div class="loading"><div class="spin">${C.loadEmoji}</div><p>${esc(C.loadText)}</p></div></section>
<section class="screen" id="s-result"><div class="res-card">
  <div class="res-top"><small>${esc(C.resultLabel)}</small><div class="res-emoji" id="rEmoji"></div><div class="res-name" id="rName"></div><div class="res-alias" id="rAlias"></div><div class="tags" id="rTags"></div></div>
  <div class="res-body"><div class="quote" id="rQuote"></div>
  <div class="sec"><h3>✦ ${esc(C.descLabel)}</h3><p id="rDesc"></p></div>
  <div class="sec"><h3>✦ 你的闪光点</h3><p id="rGood"></p></div>
  <div class="sec"><h3>✦ 小心这一点</h3><p id="rWarn"></p></div>
  <div class="sec"><h3>✦ ${esc(C.extraLabel)}</h3><p id="rExtra"></p></div>
  <div class="sec"><h3>✦ ${esc(C.pairLabel)}</h3><div class="pair"><div><b>最合拍</b><span id="rBest"></span></div><div><b>容易擦出火花</b><span id="rSpark"></span></div></div></div>
  <div class="sec dims"><h3>✦ ${esc(C.dimsLabel)}</h3><div id="rDims"></div></div></div></div>
  <div class="actions"><button class="btn" id="saveBtn">${esc(C.saveText)}</button><button class="btn ghost" id="againBtn">再测一次</button></div>
  <p class="note">${esc(C.note)}</p></section></div>
<div class="modal" id="modal"><img id="shot" alt="结果图"><p>${esc(C.modalText)}</p><button id="closeModal">关闭</button></div>`;

/* ---------- 计分 ---------- */
const MAX={}; Object.keys(TYPES).forEach(k=>MAX[k]=0);
QS.forEach(([,opts])=>Object.keys(TYPES).forEach(k=>{MAX[k]+=Math.max(...opts.map(o=>o[1][k]||0));}));
const $=id=>document.getElementById(id);
let idx=0,picks=[],last=null,busy=false;
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));$(id).classList.add('on');window.scrollTo(0,0);}
function renderQ(){
  const [q,opts]=QS[idx];
  $('qtext').textContent=q; $('qnum').textContent=(idx+1)+' / '+QS.length;
  $('prog').style.width=(idx/QS.length*100)+'%'; $('backBtn').disabled=idx===0;
  const box=$('opts'); box.innerHTML='';
  opts.forEach((o,i)=>{const b=document.createElement('button');b.className='opt'+(picks[idx]===i?' picked':'');b.textContent=o[0];
    b.onclick=()=>{if(busy)return;busy=true;b.classList.add('picked');picks[idx]=i;setTimeout(()=>{busy=false;next();},180);};box.appendChild(b);});
}
function next(){ if(idx<QS.length-1){idx++;renderQ();} else {$('prog').style.width='100%';show('s-loading');setTimeout(finish,1600);} }
function finish(){
  const raw={}; Object.keys(TYPES).forEach(k=>raw[k]=0);
  picks.forEach((p,i)=>{const w=QS[i][1][p][1];for(const k in w)raw[k]+=w[k];});
  const pct={}; for(const k in raw)pct[k]=Math.round(raw[k]/MAX[k]*100);
  const order=Object.keys(pct).sort((a,b)=>pct[b]-pct[a]||raw[b]-raw[a]);
  last={key:order[0],order,pct}; renderResult(); show('s-result');
}
const nm=k=>TYPES[k].emoji+' '+TYPES[k].name;
function renderResult(){
  const {key,order,pct}=last,t=TYPES[key];
  $('rEmoji').textContent=t.emoji;$('rName').textContent=t.name;$('rAlias').textContent=t.alias;
  $('rTags').innerHTML=t.tags.map(x=>'<span>'+esc(x)+'</span>').join('');
  $('rQuote').textContent=t.quote;$('rDesc').textContent=t.desc;$('rGood').textContent=t.good;$('rWarn').textContent=t.warn;$('rExtra').textContent=t.extra;
  $('rBest').textContent=nm(t.best);$('rSpark').textContent=nm(t.spark);
  $('rDims').innerHTML=order.slice(0,4).map(k=>'<div class="row"><span>'+esc(nm(k))+'</span><div class="bar"><i style="width:'+pct[k]+'%"></i></div><span>'+pct[k]+'%</span></div>').join('');
}

/* ---------- 结果图 ---------- */
const NO_START='，。、！？：；」”』）…';
function wrap(x,text,px,y,maxW,lh){let line='';for(const ch of text){if(x.measureText(line+ch).width>maxW&&!NO_START.includes(ch)){x.fillText(line,px,y);line=ch;y+=lh;}else line+=ch;}if(line){x.fillText(line,px,y);y+=lh;}return y;}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
function drawCard(H){
  const {key,order,pct}=last,t=TYPES[key],W=1080,c=document.createElement('canvas');c.width=W;c.height=H;
  const x=c.getContext('2d'),F='"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif';
  x.fillStyle=K.paper;x.fillRect(0,0,W,H);rr(x,60,60,W-120,H-120,40);x.fillStyle=K.card;x.fill();
  x.save();rr(x,60,60,W-120,620,40);x.clip();x.fillStyle=K.dark;x.fillRect(60,60,W-120,620);x.restore();
  x.textAlign='center';x.globalAlpha=.75;x.fillStyle=K.paper;x.font='32px '+F;x.fillText(C.imgTitle,W/2,150);x.globalAlpha=1;
  x.font='140px '+F;x.fillText(t.emoji,W/2,320);
  x.fillStyle=K.paper;x.font='bold 96px '+F;x.fillText(t.name,W/2,450);
  x.globalAlpha=.85;x.font='38px '+F;x.fillText(t.alias,W/2,510);x.globalAlpha=1;
  x.font='32px '+F;const tw=t.tags.map(s=>x.measureText(s).width+56),tot=tw.reduce((a,b)=>a+b,0)+20*(tw.length-1);let tx=(W-tot)/2;
  t.tags.forEach((s,i)=>{rr(x,tx,560,tw[i],60,30);x.strokeStyle=K.paper;x.globalAlpha=.6;x.lineWidth=2;x.stroke();x.globalAlpha=1;x.fillStyle=K.paper;x.fillText(s,tx+tw[i]/2,601);tx+=tw[i]+20;});
  x.setLineDash([14,12]);x.strokeStyle=K.line;x.lineWidth=4;x.beginPath();x.moveTo(110,700);x.lineTo(W-110,700);x.stroke();x.setLineDash([]);
  x.fillStyle=K.accent;x.font='bold 44px '+F;let y=wrap(x,t.quote,W/2,790,W-260,62);
  x.textAlign='left';x.fillStyle=K.ink;x.font='36px '+F;y=wrap(x,t.desc,130,y+30,W-260,58);
  y+=40;x.fillStyle=K.dark;x.font='bold 34px '+F;x.fillText('✦ '+C.dimsLabel,130,y);y+=30;
  order.slice(0,3).forEach(k=>{y+=56;x.fillStyle=K.ink;x.font='32px '+F;x.fillText(nm(k),130,y);
    rr(x,450,y-24,400,22,11);x.fillStyle=K.line;x.fill();rr(x,450,y-24,Math.max(22,400*pct[k]/100),22,11);x.fillStyle=K.accent;x.fill();
    x.fillStyle=K.muted;x.textAlign='right';x.fillText(pct[k]+'%',W-130,y);x.textAlign='left';});
  y+=80;x.fillStyle=K.muted;x.font='30px '+F;x.fillText('最合拍：'+nm(t.best),130,y);y+=50;x.fillText('容易擦出火花：'+nm(t.spark),130,y);
  x.textAlign='center';x.fillStyle=K.accent;x.font='bold 36px '+F;x.fillText(C.imgCTA,W/2,H-150);
  x.fillStyle=K.muted;x.font='26px '+F;x.fillText('娱乐向性格测试 · 非专业心理测评',W/2,H-100);
  return {canvas:c,end:y};
}
function makeImage(){const h=drawCard(2400).end+240;return drawCard(h).canvas.toDataURL('image/png');}

$('startBtn').onclick=()=>{idx=0;picks=[];renderQ();show('s-quiz');};
$('backBtn').onclick=()=>{if(idx>0){idx--;renderQ();}};
$('againBtn').onclick=()=>{idx=0;picks=[];show('s-cover');};
$('saveBtn').onclick=()=>{$('shot').src=makeImage();$('modal').classList.add('on');};
$('closeModal').onclick=()=>$('modal').classList.remove('on');
/* 测试钩子：?auto=类型字母 时自动按该类型作答并显示结果图（仅用于生成配图） */
const auto=new URLSearchParams(location.search).get('auto');
if(auto&&TYPES[auto]){picks=QS.map(([,o])=>{let b=0,m=-1;o.forEach((q,i)=>{const v=q[1][auto]||0;if(v>m){m=v;b=i;}});return b;});finish();
  const im=new Image();im.onload=()=>{document.body.style.margin='0';document.body.innerHTML='';im.style.cssText='width:1080px;display:block';document.body.appendChild(im);};im.src=makeImage();}
})();
