/* Shared: language (EN/HI), toasts, shortcuts, PWA */
(function(){
var D={en:{
'nav.home':'Home','nav.slides':'Slides','nav.analyzer':'Analyzer','nav.studio':'Studio','nav.about':'About','nav.out':'Log out','nav.as':'Signed in as',
'studio.title':'Insight Studio','studio.sub':'Add sources, upload files or scanned images, and get a gap score, conflicts, a checklist and a report.',
'studio.goal':'Your goal','studio.goalph':'e.g. What should I verify before applying?','studio.src':'Sources','studio.t':'Title','studio.d':'Published / updated','studio.x':'Source text',
'studio.add':'Add source','studio.demo':'Load demo','studio.load':'Load session JSON','studio.clear':'Clear all','studio.up':'Upload .txt .md .html .csv .json .pdf or an image (OCR)','studio.go':'Analyze sources',
'res.score':'Completeness score','res.sev':'Gaps by severity','res.matrix':'Coverage heatmap','res.conf':'Conflicts','res.gaps':'Gaps','res.hedge':'Vague wording','res.stale':'Old sources','res.check':'Verification checklist','res.hl':'Source highlights','res.ai':'AI summary (optional)','res.md':'Download report (.md)','res.pdf':'Print / save as PDF',
'msg.nosrc':'No sources yet. Add text, upload a file or load the demo.','msg.add':'Source added','msg.short':'Add at least 20 characters of text','msg.done':'Analysis complete','msg.none':'Add a source first','msg.clear':'Cleared'},
hi:{
'nav.home':'होम','nav.slides':'स्लाइड','nav.analyzer':'विश्लेषक','nav.studio':'स्टूडियो','nav.about':'परिचय','nav.out':'लॉग आउट','nav.as':'लॉग इन:',
'studio.title':'इनसाइट स्टूडियो','studio.sub':'स्रोत जोड़ें, फ़ाइल या स्कैन की गई तस्वीर अपलोड करें और गैप स्कोर, टकराव, चेकलिस्ट व रिपोर्ट पाएँ।',
'studio.goal':'आपका लक्ष्य','studio.goalph':'जैसे: आवेदन से पहले मुझे क्या जाँचना चाहिए?','studio.src':'स्रोत','studio.t':'शीर्षक','studio.d':'प्रकाशित / अपडेट तिथि','studio.x':'स्रोत का पाठ',
'studio.add':'स्रोत जोड़ें','studio.demo':'डेमो लोड करें','studio.load':'सेशन JSON लोड करें','studio.clear':'सब हटाएँ','studio.up':'.txt .md .html .csv .json .pdf या तस्वीर (OCR) अपलोड करें','studio.go':'स्रोतों का विश्लेषण करें',
'res.score':'पूर्णता स्कोर','res.sev':'गंभीरता के अनुसार गैप','res.matrix':'कवरेज हीटमैप','res.conf':'टकराव','res.gaps':'गैप','res.hedge':'अस्पष्ट शब्द','res.stale':'पुराने स्रोत','res.check':'सत्यापन चेकलिस्ट','res.hl':'स्रोत हाइलाइट','res.ai':'AI सारांश (वैकल्पिक)','res.md':'रिपोर्ट डाउनलोड (.md)','res.pdf':'प्रिंट / PDF सहेजें',
'msg.nosrc':'अभी कोई स्रोत नहीं। पाठ जोड़ें, फ़ाइल अपलोड करें या डेमो लोड करें।','msg.add':'स्रोत जोड़ा गया','msg.short':'कम से कम 20 अक्षर का पाठ जोड़ें','msg.done':'विश्लेषण पूरा','msg.none':'पहले एक स्रोत जोड़ें','msg.clear':'हटा दिया गया'}};
/* Themes: midnight, daylight, aurora */
var TH=['midnight','daylight','aurora'],TL={midnight:'Midnight',daylight:'Daylight',aurora:'Aurora'};
function curTheme(){try{var t=localStorage.getItem('dds_theme');if(t==='dark')t='midnight';if(t==='light')t='daylight';return TH.indexOf(t)>-1?t:'midnight'}catch(e){return 'midnight'}}
function paint(){var t=curTheme();if(document.documentElement.getAttribute('data-theme')!==t)document.documentElement.setAttribute('data-theme',t);
  [].forEach.call(document.querySelectorAll('.tsw button'),function(b){b.setAttribute('aria-pressed',b.dataset.t===t)})}
window.DDST={list:TH,get:curTheme,
  set:function(t){if(TH.indexOf(t)<0)return;try{localStorage.setItem('dds_theme',t)}catch(e){}paint()},
  mount:function(el){if(!el)return;el.className='tsw';el.setAttribute('role','group');el.setAttribute('aria-label','Theme');
    el.innerHTML=TH.map(function(t){return '<button type="button" data-t="'+t+'" title="'+TL[t]+'" aria-label="'+TL[t]+' theme"></button>'}).join('');
    [].forEach.call(el.children,function(b){b.onclick=function(){DDST.set(b.dataset.t)}});paint()}};
paint();
/* keep our theme even if the original app.js tries to set its own */
new MutationObserver(paint).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
document.addEventListener('DOMContentLoaded',function(){var b=document.body;function strip(){if(b.hasAttribute('data-theme'))b.removeAttribute('data-theme')}strip();new MutationObserver(strip).observe(b,{attributes:true,attributeFilter:['data-theme']})});
function lang(){try{return localStorage.getItem('dds_lang')||'en'}catch(e){return 'en'}}
window.DDSI={lang:lang,
  t:function(k,f){var l=lang();return (D[l]&&D[l][k])||D.en[k]||f||k},
  set:function(l){try{localStorage.setItem('dds_lang',l)}catch(e){}location.reload()},
  toast:function(m,bad){var h=document.getElementById('toasts');if(!h){h=document.createElement('div');h.id='toasts';h.setAttribute('role','status');document.body.appendChild(h)}
    var t=document.createElement('div');t.className='toast'+(bad?' bad':'');t.textContent=m;h.appendChild(t);setTimeout(function(){t.remove()},3200)}};
document.addEventListener('DOMContentLoaded',function(){
  document.documentElement.lang=lang();
  [].forEach.call(document.querySelectorAll('[data-i18n]'),function(e){e.textContent=DDSI.t(e.getAttribute('data-i18n'))});
  [].forEach.call(document.querySelectorAll('[data-i18n-ph]'),function(e){e.placeholder=DDSI.t(e.getAttribute('data-i18n-ph'))});
  var l=document.createElement('link');l.rel='manifest';l.href='manifest.webmanifest';document.head.appendChild(l);
});
document.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){var b=document.getElementById('analyzeBtn');if(b){e.preventDefault();b.click()}}});
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
})();
