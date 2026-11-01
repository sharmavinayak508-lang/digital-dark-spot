/* Digital Dark Spot - pure analysis engine for Insight Studio (works in browser and Node) */
(function(g){
var MONTHS={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,oct:10,nov:11,dec:12};
var MN='(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)';
function pad(n){return String(n).padStart(2,'0')}
function iso(y,m,d){if(m<1||m>12||d<1||d>31)return null;return y+'-'+pad(m)+'-'+pad(d)}
function parseDates(s){
  var out=[],m,r;
  r=/\b(\d{4})-(\d{2})-(\d{2})\b/g;while((m=r.exec(s)))out.push(iso(+m[1],+m[2],+m[3]));
  r=new RegExp('\\b(\\d{1,2})(?:st|nd|rd|th)?\\s+'+MN+'[a-z]*\\.?,?\\s+(\\d{4})\\b','gi');
  while((m=r.exec(s)))out.push(iso(+m[3],MONTHS[m[2].toLowerCase()],+m[1]));
  r=new RegExp('\\b'+MN+'[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})\\b','gi');
  while((m=r.exec(s)))out.push(iso(+m[3],MONTHS[m[1].toLowerCase()],+m[2]));
  r=/\b(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})\b/g;while((m=r.exec(s)))out.push(iso(+m[3],+m[2],+m[1]));
  return out.filter(Boolean);
}
function parseAmounts(s){
  var out=[],m,r=/(?:₹|rs\.?|inr|\$|usd)\s?(\d[\d,]*(?:\.\d+)?)/gi;
  while((m=r.exec(s)))out.push(m[1].replace(/,/g,''));
  return out;
}
var FACETS=[
 {id:'deadline',en:'Deadline',hi:'अंतिम तिथि',sev:'high',re:/\b(deadline|last date|closes?|closing|due date|due by|apply by|apply before|submit by)\b/i,ex:parseDates},
 {id:'fee',en:'Fees / cost',hi:'शुल्क / लागत',sev:'high',re:/(\bfees?\b|\bcost|\bprice|tuition|charges?\b|₹|\brs\.?\s?\d|\binr\b|\$\s?\d|\busd\b|free of charge)/i,ex:parseAmounts},
 {id:'eligibility',en:'Eligibility',hi:'पात्रता',sev:'high',re:/\b(eligib\w*|qualif\w*|requirements?|criteria|minimum|must be|open to)\b/i},
 {id:'howto',en:'How to apply',hi:'आवेदन कैसे करें',sev:'medium',re:/\b(how to apply|apply|application|register|submit|documents?|procedure|steps?)\b/i},
 {id:'contact',en:'Contact',hi:'संपर्क',sev:'medium',re:/([\w.+-]+@[\w-]+\.[\w.]+|\bphone\b|\bcall\b|\bcontact\b|helpline|\+?\d[\d\s-]{9,}\d)/i},
 {id:'terms',en:'Terms / obligations',hi:'शर्तें / दायित्व',sev:'medium',re:/\b(refund|cancel\w*|terms|conditions|penalt\w*|obligation|bond|renew\w*)\b/i}
];
var HEDGE=/\b(may|might|up to|approximately|approx|around|subject to|tbd|to be announced|to be decided|usually|typically|expected|depending|tentative|likely)\b/i;
function sentences(t){return String(t||'').replace(/\b(rs|inr|approx|no|dr|mr|mrs|vs|etc)\./gi,'$1\u0001').split(/(?<=[.!?])\s+|\n+/).map(function(s){return s.replace(/\u0001/g,'.').trim()}).filter(function(s){return s.length>3})}
function analyze(sources,now){
  now=now||new Date();
  var res={sourceCount:sources.length,matrix:[],gaps:[],conflicts:[],hedges:[],stale:[],counts:{high:0,medium:0,low:0},score:100,facets:FACETS};
  var per={};
  sources.forEach(function(s,si){
    var sents=sentences(s.text),row={title:s.title||('Source '+(si+1)),cells:{}};
    FACETS.forEach(function(f){
      var hit=sents.filter(function(x){return f.re.test(x)}),state='missing';
      if(hit.length)state=hit.every(function(x){return HEDGE.test(x)})?'hedged':'found';
      row.cells[f.id]={state:state,quote:hit[0]||''};
      if(f.ex){var set={};hit.forEach(function(x){f.ex(x).forEach(function(v){set[v]=1})});(per[f.id]=per[f.id]||[]).push(Object.keys(set))}
    });
    res.matrix.push(row);
    sents.forEach(function(x){if(HEDGE.test(x))res.hedges.push({src:si,text:x})});
    if(s.date){var d=new Date(s.date);if(!isNaN(d)&&(now-d)/864e5>365)res.stale.push({src:si,date:s.date})}
  });
  FACETS.forEach(function(f){
    if(!f.ex)return;
    var lists=(per[f.id]||[]),withVals=lists.filter(function(a){return a.length}),all={};
    lists.forEach(function(a){a.forEach(function(v){all[v]=1})});
    var vals=Object.keys(all);
    if(withVals.length>=2&&vals.length>1)res.conflicts.push({facet:f.id,values:vals});
  });
  FACETS.forEach(function(f){
    var miss=[],hed=0;
    res.matrix.forEach(function(r,i){var c=r.cells[f.id].state;if(c==='missing')miss.push(i);if(c==='hedged')hed++});
    if(miss.length===res.matrix.length&&res.matrix.length)res.gaps.push({facet:f.id,sev:f.sev,detail:'all'});
    else if(miss.length)res.gaps.push({facet:f.id,sev:f.sev==='high'?'medium':'low',detail:'some',sources:miss});
    if(hed)res.gaps.push({facet:f.id,sev:'low',detail:'hedged'});
  });
  res.gaps.forEach(function(g){res.counts[g.sev]++});
  res.counts.high+=res.conflicts.length;
  res.score=Math.max(0,Math.min(100,100-res.counts.high*14-res.counts.medium*7-res.counts.low*3-res.stale.length*5));
  return res;
}
var api={HEDGE:HEDGE,analyze:analyze,parseDates:parseDates,parseAmounts:parseAmounts,FACETS:FACETS,sentences:sentences};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else g.DDSAnalysis=api;
})(typeof window!=='undefined'?window:globalThis);
