/* Demo-only login gate. Credentials are shown on the login page by design. */
(function(){
  var KEY='dds_user',USER='demo',PASS='dark2026';
  function get(){try{return sessionStorage.getItem(KEY)}catch(e){return null}}
  window.DDS={
    login:function(u,p){if(u===USER&&p===PASS){try{sessionStorage.setItem(KEY,u)}catch(e){}return true}return false},
    logout:function(){try{sessionStorage.removeItem(KEY)}catch(e){}location.href='login.html'}};
  var page=(location.pathname.split('/').pop()||'index.html');
  if(page!=='login.html'&&!get()){location.replace('login.html');return}
  document.addEventListener('DOMContentLoaded',function(){
    var n=document.getElementById('siteNav');if(!n)return;
    var T=window.DDSI?DDSI.t:function(k){return k},L=window.DDSI?DDSI.lang():'en';
    var links=[['home.html','nav.home'],['home.html#slides','nav.slides'],['index.html','nav.analyzer'],['studio.html','nav.studio'],['about.html','nav.about']];
    n.className='nav';
    n.innerHTML='<div class="wrap"><a class="logo" href="home.html"><span class="spot" aria-hidden="true"></span>Digital Dark Spot</a>'+
      links.map(function(l){return '<a class="l'+(l[0]===page?' on':'')+'" href="'+l[0]+'">'+T(l[1])+'</a>'}).join('')+
      '<span id="tswNav"></span>'+'<button class="btn ghost small" id="langBtn" type="button" aria-label="Change language">'+(L==='en'?'हिन्दी':'English')+'</button>'+
      '<span class="who">'+T('nav.as')+' '+(get()||'')+'</span><button class="btn ghost small" id="outBtn" type="button">'+T('nav.out')+'</button></div>';
    document.getElementById('outBtn').onclick=DDS.logout;
    DDST.mount(document.getElementById('tswNav'));
    document.getElementById('langBtn').onclick=function(){DDSI.set(L==='en'?'hi':'en')};
  });
})();
