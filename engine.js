
/* Value Date — page engine. Carries the reader's place in the address bar (?s=...). */
var VD = (function(){
  function clean(s){ s=s||""; if(/^[A-Za-z-]{11}$/.test(s)) s+="--"; return (/^[A-Za-z-]{13}$/.test(s)) ? s : "-------------"; }
  function C(s,i){ return s.charAt(i-1); }
  function inSet(ch,set){ return !!ch && set.indexOf(ch) >= 0; }
  function evalCond(s,str){
    if(!str) return true;
    if(str.charAt(0)==="!") return !evalCond(s,str.slice(1));
    if(str.indexOf("|")>=0) return str.split("|").some(function(alt){ return evalCond(s,alt); });
    return str.split("&").every(function(t){
      var m=t.match(/^(\d+)(=|!)([A-Za-z-]+)$/); if(!m) return true;
      var ch=C(s,+m[1]);
      return m[2]==="=" ? inSet(ch,m[3]) : !inSet(ch,m[3]);
    });
  }
  function withSet(s,spec){
    var a=s.split("");
    spec.split(";").forEach(function(p){ var kv=p.split(":"); a[+kv[0]-1]=kv[1]; });
    return a.join("");
  }
  var DECIDE=[1,2,3,4,5,6,7,8,9,12,13];
  function complete(s){ return DECIDE.every(function(i){ return C(s,i)!=="-"; }); }
  function resolveEnding(s){
    if(inSet(C(s,3),"wW")) return 46;
    if(C(s,12)==="o") return 62;
    if(C(s,13)==="d") return 63;
    if(C(s,5)==="u" && C(s,4)==="u") return 47;
    if(inSet(C(s,1),"ef") && C(s,2)==="x" && (C(s,5)==="u"||C(s,6)==="y")) return 48;
    if(C(s,7)==="n") return 49;
    if(C(s,8)==="a" && (C(s,5)!=="v"||C(s,6)!=="t")) return 50;
    if(C(s,5)!=="v" || C(s,6)!=="t" || C(s,4)==="u") return 51;
    if(C(s,9)==="m") return 52;
    return 53;
  }
  function causalRows(end,s){
    switch(end){
      case 46: return [3];
      case 47: return [5,4];
      case 48: var c=[1,2]; if(C(s,5)==="u")c.push(5); if(C(s,6)==="y")c.push(6); return c;
      case 49: return [7];
      case 50: var d=[8]; if(C(s,5)!=="v")d.push(5); if(C(s,6)!=="t")d.push(6); return d;
      case 51: var e=[]; if(C(s,5)!=="v")e.push(5); if(C(s,6)!=="t")e.push(6); if(C(s,4)==="u")e.push(4); return e;
      case 52: return [9];
      case 62: return [12];
      case 63: return [13];
      default: return [];
    }
  }
  var ROW = {
    1:{label:"Where the keys live", page:2, val:{k:"the locked keyring", e:"an environment variable", f:"a plain file"}},
    2:{label:"The sandbox", page:6, val:{o:"on", x:"off"}},
    3:{label:"How the feed reaches Bursar", page:9, val:{p:"Bursar calls out; nothing comes in", t:"one locked tunnel", w:"open to the internet", W:"open to the internet"}},
    4:{label:"What the money key can do", page:13, val:{r:"look only", a:"prepare; a person presses the button", u:"move money by itself"}},
    5:{label:"The add-on", page:28, val:{v:"read before installing", d:"installed with reduced powers", u:"installed unread"}},
    6:{label:"The rates tool may talk to", page:18, val:{t:"two websites only", s:"its own long list, unread", y:"any website"}},
    7:{label:"Limits on payments", page:32, val:{c:"all three limits", l:"speed limit only", n:"none"}},
    8:{label:"Customer records", page:22, val:{s:"one case at a time", a:"all ten years, searchable"}},
    9:{label:"The audit channel", page:37, val:{t:"tuned and on", m:"muted"}},
    12:{label:"Who may speak to Bursar", page:55, val:{p:"paired phones only", l:"a short list you wrote", o:"anyone with the handle"}},
    13:{label:"The update", page:59, val:{u:"applied Wednesday night", d:"deferred until after quarter-end"}}
  };
  function bookedAt(i,s){ return (i===3 && C(s,3)==="W") ? 26 : ROW[i].page; }
  var GUIDE = {
    1:{p:65, l:"where the keys should have lived"},
    2:{p:66, l:"what the sandbox is for"},
    3:{p:67, l:"why open doors get found"},
    4:{p:68, l:"what a money key should be allowed to do"},
    5:{p:72, l:"what installing unread really grants"},
    6:{p:69, l:"why a tool needs a short list"},
    7:{p:73, l:"why every routine needs ceilings"},
    8:{p:70, l:"how much memory one task should see"},
    9:{p:74, l:"what the alarms would have told you"},
    12:{p:71, l:"who may speak to an agent"},
    13:{p:75, l:"why the fix must be running"}
  };
  function suggest(s,end){
    var causal=causalRows(end,s), h="";
    if(causal.length){
      var seen={}, rows=causal.filter(function(i){ if(seen[i]) return false; seen[i]=true; return true; });
      rows.forEach(function(i){
        h+='<a class="choice" href="'+GUIDE[i].p+'.html?s='+s+'">If you want to learn '+GUIDE[i].l+', <span class="pg">turn to page '+GUIDE[i].p+'.</span></a>';
      });
    } else {
      h+='<a class="choice" href="https://docs.ironclaw.com/quickstart" target="_blank" rel="noopener">If you are ready to build a real one, <span class="pg">open the IronClaw quickstart.</span></a>';
    }
    return h;
  }
  function nightDest(s){
    var end=resolveEnding(s);
    if(end===47||end===49||end===46||end===62) return end;
    if(end===63&&C(s,3)==="t") return end;
    if(end===48&&C(s,5)==="u") return end;
    return 40;
  }
  var NIGHTTEASE = {
    47:"At seven minutes past two in the morning, money moves.",
    48:"The phone rings at 11:52. It is the processor's fraud desk, which does not sleep.",
    49:"At 8:02, a routine wakes up, and nothing you built tells it to stop.",
    63:"At 4:51, something finds the door. The door's software is three weeks old.",
    46:"This story ended days ago. You are only now finding out.",
    62:"This story ended yesterday afternoon. You are only now finding out.",
    40:"The night passes the way nights are supposed to. At 8:47, Thursday begins."
  };
  function tone(s,end){
    if(end===52) return "";
    var e1=(end===53), out=[];
    var c1={
      f: e1 ? "You froze forty-one honest payments for a thing the walls had already stopped. Marisol forgives you by Monday. Mostly."
            : "You froze the queue. Some people minded at the time. Nobody questions it afterwards.",
      b: e1 ? "You let the batch in flight finish, and it finished clean. That was partly luck."
            : "You let the batch in flight finish. The report is kind about that call. At two in the morning, for a while, you are not.",
      r: "You shut off the key first. It made the morning loud — the processor called Theo before you could — but it was the hardest stop there was, and by Friday everyone says so."
    }[C(s,10)];
    var c2={
      d:"You called the processor first, with numbers that later changed. The record holds both sets of numbers.",
      t:"You built the timeline first and called at noon with numbers that held. The processor noticed the two hours. So did you.",
      i:"Noor answered from her trip in nine minutes and ran the first hour by phone. The whole company spoke with one voice — a little late, but together."
    }[C(s,11)];
    if(c1) out.push(c1); if(c2) out.push(c2);
    return out.length ? "<p><em>What you did next:</em> "+out.join(" ")+"</p>" : "";
  }
  function init(){
    var q=new URLSearchParams(location.search), s=clean(q.get("s"));
    document.querySelectorAll("[data-if]").forEach(function(el){
      if(!evalCond(s,el.getAttribute("data-if"))) el.parentNode.removeChild(el);
    });
    var role=document.body.getAttribute("data-role");
    if(role==="reckon"){
      var box=document.getElementById("verdict");
      if(!complete(s)){
        var miss=DECIDE.filter(function(i){ return C(s,i)==="-"; });
        box.innerHTML="Wednesday is not finished. A promise you never made cannot come due. Go back to page "
          + miss.map(function(i){ return '<a data-turn href="'+String(ROW[i].page).padStart(2,"0")+'.html">'+ROW[i].page+"</a>"; }).join(", page ")
          + " and choose.";
      } else {
        var end=resolveEnding(s);
        box.innerHTML='<a class="choice" data-turn href="'+end+'.html"><span class="pg">Turn to page '+end+'.</span></a>';
      }
    }
    if(role==="nightgate"){
      var nbox=document.getElementById("nightverdict");
      if(nbox){
        var nd=nightDest(s);
        nbox.innerHTML='<a class="choice" data-turn href="'+String(nd).padStart(2,"0")+'.html">'+NIGHTTEASE[nd]+' <span class="pg">Turn to page '+nd+'.</span></a>';
      }
    }
    if(role==="ending"){
      var endNo=+document.body.getAttribute("data-ending");
      var t=document.getElementById("tone"); if(t) t.innerHTML=tone(s,endNo);
      var g=document.getElementById("suggest"); if(g) g.innerHTML=suggest(s,endNo);
    }
    document.querySelectorAll("a[data-turn]").forEach(function(a){
      var ns=s, set=a.getAttribute("data-set");
      if(set) ns=withSet(s,set);
      var base=a.getAttribute("href").split("?")[0];
      a.setAttribute("href", base+"?s="+ns);
    });
  }
  if(typeof document!=="undefined"){
    if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
  }
  return {clean:clean, evalCond:evalCond, withSet:withSet, resolveEnding:resolveEnding, causalRows:causalRows, complete:complete, GUIDE:GUIDE, nightDest:nightDest};
})();
if(typeof module!=="undefined") module.exports=VD;
