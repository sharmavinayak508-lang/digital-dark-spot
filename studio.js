/* Insight Studio UI */
(function(){
var root=document.getElementById('studio');if(!root)return;
var T=DDSI.t,L=DDSI.lang(),A=window.DDSAnalysis;
var $=function(i){return document.getElementById(i)};
var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var fname=function(id){var f=A.FACETS.filter(function(x){return x.id===id})[0];return L==='hi'?f.hi:f.en};
var sources=[],last=null,SK='dds_studio';
function save(){try{localStorage.setItem(SK,JSON.stringify({sources:sources,goal:$('goal').value}))}catch(e){}}
function restore(){try{var j=JSON.parse(localStorage.getItem(SK)||'null');if(j&&Array.isArray(j.sources)){sources=j.sources.filter(function(s){return s&&typeof s.text==='string'});$('goal').value=j.goal||''}}catch(e){}}
var DEMO=[{title:'Official scholarship page',date:'2026-09-15',text:'The Merit Scholarship is open to final-year students with a minimum of 75% marks. Applications close on 30 November 2026. The application fee is Rs. 500. Applicants must submit marksheets and an income certificate. The award may cover up to a full tuition waiver.'},
{title:'College blog post',date:'2024-06-10',text:'Want the Merit Scholarship? The last date to apply is 15 December 2026. The processing fee is Rs. 750. Contact the scholarship cell for help.'}];
function renderList(){
  save();$('count').textContent=sources.length;
  $('list').innerHTML=sources.map(function(s,i){return '<li class="src"><div><b>'+esc(s.title)+'</b><small>'+esc(s.date||'')+' - '+s.text.length+' chars</small></div><button class="btn ghost small danger" data-rm="'+i+'" type="button">&times;</button></li>'}).join('')||'<li class="empty">'+esc(T('msg.nosrc'))+'</li>';
}
function add(title,text,date){
  text=(text||'').trim();if(text.length<20){DDSI.toast(T('msg.short'),1);return false}
  sources.push({title:(title||'').trim()||('Source '+(sources.length+1)),text:text,date:date||''});renderList();DDSI.toast(T('msg.add'));return true}
$('list').onclick=function(e){var b=e.target.closest('[data-rm]');if(b){sources.splice(+b.dataset.rm,1);renderList()}};
$('addForm').onsubmit=function(e){e.preventDefault();if(add($('sTitle').value,$('sText').value,$('sDate').value)){$('sTitle').value=$('sText').value=''}};
$('demoBtn').onclick=function(){sources=DEMO.map(function(d){return Object.assign({},d)});$('goal').value='What should I verify before applying for the Merit Scholarship?';renderList();DDSI.toast(T('msg.add'))};
$('clearBtn').onclick=function(){sources=[];last=null;$('out').hidden=true;$('goal').value='';renderList();DDSI.toast(T('msg.clear'))};
function walk(o,out){if(Array.isArray(o))o.forEach(function(x){walk(x,out)});else if(o&&typeof o==='object'){if(typeof o.text==='string'&&o.text.length>20)out.push({title:o.title||o.name||'Imported source',date:o.date||o.updated||'',text:o.text});else Object.keys(o).forEach(function(k){walk(o[k],out)})}}
$('loadBtn').onclick=function(){$('loadFile').click()};
$('loadFile').onchange=function(){var f=this.files[0];if(!f)return;f.text().then(function(t){try{var j=JSON.parse(t),out=[];walk(j,out);if(!out.length)throw 0;out.forEach(function(s){add(s.title,s.text,s.date)});if(j.goal&&typeof j.goal==='string')$('goal').value=j.goal}catch(e){DDSI.toast('Could not find sources in this JSON file',1)}});this.value=''};
function loadScript(src){return new Promise(function(ok,no){var s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=function(){no(new Error('Could not load '+src+'. Check your internet connection.'))};document.head.appendChild(s)})}
async function readFile(f){
  var n=f.name.toLowerCase();
  if(/\.pdf$/.test(n)){await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    var pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise,t='';
    for(var i=1;i<=pdf.numPages;i++){var c=await (await pdf.getPage(i)).getTextContent();t+=c.items.map(function(x){return x.str}).join(' ')+'\n'}
    if(t.trim().length<20)throw new Error('No text found in this PDF. If it is scanned, upload pages as images for OCR.');return t}
  if(/\.(png|jpe?g|webp|bmp)$/.test(n)){DDSI.toast('Reading image text (OCR)... this can take a minute');await loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js');var r=await Tesseract.recognize(f,'eng');return r.data.text}
  var t2=await f.text();if(/\.html?$/.test(n))t2=new DOMParser().parseFromString(t2,'text/html').body.textContent;return t2}
$('up').onchange=async function(){var fs=[].slice.call(this.files);this.value='';
  for(var i=0;i<fs.length;i++){try{add(fs[i].name,await readFile(fs[i]),'')}catch(e){DDSI.toast(e.message||'Could not read file',1)}}};
function bar(n,max,cls){return '<div class="sevrow"><span class="badge '+cls+'">'+cls+'</span><div class="sevbar"><i class="'+cls+'" style="width:'+(max?Math.round(n/max*100):0)+'%"></i></div><b>'+n+'</b></div>'}
function questions(r){
  var q=[];
  r.conflicts.forEach(function(c){q.push(L==='hi'?fname(c.facet)+' के लिए कौन-सा सही है: '+c.values.join(' या ')+'?':'Which '+fname(c.facet).toLowerCase()+' is correct: '+c.values.join(' or ')+'?')});
  r.gaps.forEach(function(g){if(g.detail==='hedged')q.push(L==='hi'?fname(g.facet)+' का सटीक विवरण क्या है?':'What is the exact '+fname(g.facet).toLowerCase()+' (the sources are vague)?');
    else q.push(L==='hi'?fname(g.facet)+' क्या है?':'What is the '+fname(g.facet).toLowerCase()+'?')});
  r.stale.forEach(function(s){q.push((L==='hi'?'पुराने स्रोत की पुष्टि करें: ':'Confirm the old source is still correct: ')+sources[s.src].title+' ('+s.date+')')});
  return q}
function render(r){
  var col=r.score>=75?'var(--green)':r.score>=45?'var(--amber)':'var(--red)',C=2*Math.PI*54,max=Math.max(r.counts.high,r.counts.medium,r.counts.low,1);
  var h='<div class="card"><h2>'+T('res.score')+'</h2><div class="scorewrap"><svg viewBox="0 0 130 130" width="150" height="150" role="img" aria-label="Score '+r.score+' of 100"><circle cx="65" cy="65" r="54" fill="none" stroke="var(--line)" stroke-width="12"/><circle cx="65" cy="65" r="54" fill="none" stroke="'+col+'" stroke-width="12" stroke-linecap="round" stroke-dasharray="'+(C*r.score/100)+' '+C+'" transform="rotate(-90 65 65)"/><text x="65" y="72" text-anchor="middle" font-size="30" font-weight="700" fill="var(--text)" font-family="Space Grotesk,system-ui">'+r.score+'</text></svg>'+
   '<div style="flex:1;min-width:220px"><h3 style="margin-top:0">'+T('res.sev')+'</h3>'+bar(r.counts.high,max,'high')+bar(r.counts.medium,max,'medium')+bar(r.counts.low,max,'low')+'</div></div></div>';
  h+='<div class="card"><h2>'+T('res.matrix')+'</h2><div class="tablewrap"><table class="matrix"><tr><th></th>'+r.facets.map(function(f){return '<th>'+esc(fname(f.id))+'</th>'}).join('')+'</tr>'+
   r.matrix.map(function(row){return '<tr><td>'+esc(row.title)+'</td>'+r.facets.map(function(f){var c=row.cells[f.id],cf=r.conflicts.some(function(x){return x.facet===f.id})&&c.state!=='missing';
     var cls=cf?'conflict':c.state,sym=cf?'!':c.state==='found'?'&#10003;':c.state==='hedged'?'~':'-';return '<td><span class="cell '+cls+'" title="'+esc(c.quote)+'">'+sym+'</span></td>'}).join('')+'</tr>'}).join('')+'</table></div></div>';
  h+='<div class="card"><h2>'+T('res.conf')+' <span class="count">'+r.conflicts.length+'</span></h2><ul class="list">'+(r.conflicts.map(function(c){return '<li class="item conflict"><b>'+esc(fname(c.facet))+'</b> <span class="badge inferred">Inferred</span><p>'+esc(c.values.join('  vs  '))+'</p></li>'}).join('')||'<li class="empty">-</li>')+'</ul></div>';
  h+='<div class="card"><h2>'+T('res.gaps')+' <span class="count">'+r.gaps.length+'</span></h2><ul class="list">'+(r.gaps.map(function(g){var m=g.detail==='all'?(L==='hi'?'किसी भी स्रोत में नहीं':'Not in any source'):g.detail==='hedged'?(L==='hi'?'अस्पष्ट रूप से बताया गया':'Stated vaguely'):(L==='hi'?'कुछ स्रोतों में नहीं: ':'Missing from: ')+g.sources.map(function(i){return sources[i].title}).join(', ');
    return '<li class="item"><b>'+esc(fname(g.facet))+'</b> <span class="badge '+g.sev+'">'+g.sev+'</span> <span class="badge inferred">Inferred</span><p>'+esc(m)+'</p></li>'}).join('')||'<li class="empty">-</li>')+'</ul></div>';
  h+='<div class="card"><h2>'+T('res.hedge')+' <span class="count">'+r.hedges.length+'</span></h2><ul class="list">'+(r.hedges.slice(0,8).map(function(x){return '<li class="item"><span class="badge uncertain">Uncertain</span><span class="quote">'+esc(x.text)+'</span><small class="hint">'+esc(sources[x.src].title)+'</small></li>'}).join('')||'<li class="empty">-</li>')+'</ul></div>';
  if(r.stale.length)h+='<div class="card"><h2>'+T('res.stale')+'</h2><ul class="list">'+r.stale.map(function(s){return '<li class="item"><b>'+esc(sources[s.src].title)+'</b> <span class="badge uncertain">'+esc(s.date)+'</span></li>'}).join('')+'</ul></div>';
  h+='<div class="card"><h2>'+T('res.hl')+'</h2>'+sources.map(function(s,i){return '<details class="facet"'+(i===0?' open':'')+'><summary>'+esc(s.title)+'</summary><div class="body">'+A.sentences(s.text).map(function(x){var hs=A.HEDGE.test(x),fs=A.FACETS.filter(function(f){return f.re.test(x)}).map(function(f){return fname(f.id)});return '<p class="sent'+(hs?' hl-h':fs.length?' hl-f':'')+'">'+esc(x)+(fs.length?' <span class="badge sourced">'+esc(fs.join(', '))+'</span>':'')+(hs?' <span class="badge uncertain">vague</span>':'')+'</p>'}).join('')+'</div></details>'}).join('')+'</div>';
  var q=questions(r);
  h+='<div class="card"><h2>'+T('res.check')+'</h2><p class="progress" id="prog"></p><ul class="list">'+q.map(function(x,i){return '<li class="item check"><input type="checkbox" id="ck'+i+'" aria-label="done"><label for="ck'+i+'" class="t" style="font-size:14px;color:var(--text);margin:0">'+esc(x)+'</label></li>'}).join('')+'</ul>'+
   '<div class="toolbar noprint"><button class="btn" id="mdBtn" type="button">'+T('res.md')+'</button><button class="btn ghost" id="pdfBtn" type="button">'+T('res.pdf')+'</button></div></div>';
  $('out').innerHTML=h;$('out').hidden=false;
  function prog(){var all=$('out').querySelectorAll('.check input'),n=[].filter.call(all,function(c){return c.checked}).length;$('prog').textContent=n+' / '+all.length;[].forEach.call(all,function(c){c.parentNode.classList.toggle('done',c.checked)})}
  $('out').onchange=prog;prog();$('mdBtn').onclick=exportMd;$('pdfBtn').onclick=function(){window.print()};
  $('aiCard').hidden=false;
}
function md(){var r=last,q=questions(r),o='# Digital Dark Spot report\n\n';
  o+='**Goal:** '+($('goal').value||'-')+'\n\n**Completeness score:** '+r.score+'/100\n\n## Conflicts\n'+(r.conflicts.map(function(c){return '- '+fname(c.facet)+': '+c.values.join(' vs ')}).join('\n')||'- None')+'\n\n## Gaps\n'+
  (r.gaps.map(function(g){return '- ['+g.sev+'] '+fname(g.facet)+' ('+g.detail+')'}).join('\n')||'- None')+'\n\n## Vague wording\n'+(r.hedges.map(function(x){return '- "'+x.text+'" ('+sources[x.src].title+')'}).join('\n')||'- None')+
  '\n\n## Verification checklist\n'+q.map(function(x){return '- [ ] '+x}).join('\n')+'\n\nGenerated by Digital Dark Spot. Findings are possible gaps, not verified facts; confirm with the official source.\n';return o}
function exportMd(){var b=new Blob([md()],{type:'text/markdown'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='dark-spot-report.md';a.click();setTimeout(function(){URL.revokeObjectURL(a.href)},500)}
$('analyzeBtn').onclick=function(){if(!sources.length){DDSI.toast(T('msg.none'),1);return}last=A.analyze(sources);render(last);DDSI.toast(T('msg.done'));$('out').scrollIntoView({behavior:'smooth'})};
$('aiBtn').onclick=async function(){
  var key=$('aiKey').value.trim(),url=$('aiUrl').value.trim(),model=$('aiModel').value.trim(),box=$('aiOut');
  if(!last){DDSI.toast(T('msg.none'),1);return}if(!url){DDSI.toast('Enter an endpoint',1);return}
  this.disabled=true;box.textContent='...';
  try{var body=sources.map(function(s){return '## '+s.title+'\n'+s.text.slice(0,3000)}).join('\n\n');
    var r=await fetch(url,{method:'POST',headers:key?{'Content-Type':'application/json','Authorization':'Bearer '+key}:{'Content-Type':'application/json'},body:JSON.stringify({model:model||undefined,messages:[
      {role:'system',content:'You review sources for missing, vague or conflicting information. Be brief. Only use facts in the text. Reply in '+(L==='hi'?'Hindi':'English')+'.'},
      {role:'user',content:'Goal: '+($('goal').value||'general review')+'\n\nAutomatic findings:\n'+md()+'\n\nSources:\n'+body+'\n\nSummarise the 3 most important things to verify.'}]})});
    if(!r.ok)throw new Error('AI service returned '+r.status);var j=await r.json();box.innerHTML='<span class="badge ai">AI</span><p style="white-space:pre-wrap">'+esc(j.choices[0].message.content)+'</p>'}
  catch(e){box.textContent='';DDSI.toast(e.message+' (the service may block browser requests)',1)}
  this.disabled=false};
var PRE={groq:['https://api.groq.com/openai/v1/chat/completions','llama-3.3-70b-versatile'],gemini:['https://generativelanguage.googleapis.com/v1beta/openai/chat/completions','gemini-2.5-flash-lite'],or:['https://openrouter.ai/api/v1/chat/completions','meta-llama/llama-3.3-70b-instruct:free'],proxy:['https://YOUR-WORKER.YOUR-NAME.workers.dev','']};
function saveAi(){try{localStorage.setItem('dds_ai',JSON.stringify({u:$('aiUrl').value,m:$('aiModel').value,p:$('aiPre').value}))}catch(e){}}
$('aiPre').onchange=function(){var p=PRE[this.value];if(p){$('aiUrl').value=p[0];$('aiModel').value=p[1]}saveAi()};
$('aiUrl').onchange=$('aiModel').onchange=saveAi;
try{var ai=JSON.parse(localStorage.getItem('dds_ai')||'null');if(ai){$('aiUrl').value=ai.u||$('aiUrl').value;$('aiModel').value=ai.m||'';$('aiPre').value=ai.p||''}}catch(e){}
$('goal').oninput=save;restore();renderList();
})();
