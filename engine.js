
/* Value Date — page engine. Carries your ledger in the address bar (?s=...). */
var VD = (function(){
  function clean(s){ return (/^[A-Za-z-]{11}$/.test(s||"")) ? s : "-----------"; }
  function C(s,i){ return s.charAt(i-1); }
  function inSet(ch,set){ return set.indexOf(ch) >= 0; }
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
  function complete(s){ return s.slice(0,9).indexOf("-")===-1; }
  function resolveEnding(s){
    if(inSet(C(s,3),"wW")) return 46;
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
    9:{label:"The audit channel", page:37, val:{t:"tuned and on", m:"muted"}}
  };
  function bookedAt(i,s){ return (i===3 && C(s,3)==="W") ? 26 : ROW[i].page; }
  var HOLDS = [
    [2,"o","the sandbox stayed on — nothing the model ran saw a credential"],
    [1,"k","the keys never sat in a file"],
    [3,"p","no inbound path existed"],
    [3,"t","inbound came through one authenticated door"],
    [4,"r","the key could not move money"],
    [4,"a","a person stood between every batch and the wire"],
    [5,"v","you knew exactly what you had granted"],
    [5,"d","the skill's reach stayed the reduced reach you chose"],
    [6,"t","the rates tool reached two hosts and nothing else"],
    [7,"c","the ceilings existed, and one of them was a spend cap"],
    [7,"l","the rate limit existed; the spend cap did not"],
    [8,"s","memory search ended at the dispute prefix"],
    [9,"t","you saw the morning while it was still morning"]
  ];
  var GUIDE = {
    1:{a:"keys",         t:"Secrets at rest"},
    2:{a:"sandbox",      t:"Execution isolation"},
    3:{a:"inbound",      t:"Inbound exposure"},
    4:{a:"key-scope",    t:"Credential scope"},
    5:{a:"skill-trust",  t:"Skill trust"},
    6:{a:"allowlist",    t:"Network allowlisting"},
    7:{a:"limits",       t:"Guardrails and ceilings"},
    8:{a:"memory-scope", t:"Memory scope"},
    9:{a:"audit",        t:"Observability"}
  };
  function suggest(s,end){
    var causal=causalRows(end,s), h="";
    if(causal.length){
      var seen={}, rows=causal.filter(function(i){ if(seen[i]) return false; seen[i]=true; return true; });
      h+="<h3>Before you choose again</h3>";
      h+="<p>This ending was not luck. It has a "+(rows.length>1?"few names":"name")+", and the Builder's Guide teaches "+(rows.length>1?"them":"it")+".</p>";
      rows.forEach(function(i){
        h+='<a class="choice" href="builders.html?s='+s+'#'+GUIDE[i].a+'">'+GUIDE[i].t+' — the decision you booked on page '+bookedAt(i,s)+'. <span class="pg">Open the Builder\'s Guide.</span></a>';
      });
    } else {
      h+="<h3>After a Thursday like that</h3>";
      h+="<p>Every wall held, and it held because you built it. The nine choices you just made are real ones, and the wizard that asks them is real too.</p>";
      h+='<a class="choice" href="https://docs.ironclaw.com/quickstart" target="_blank" rel="noopener">Build one for real — install IronClaw and answer the nine questions for your own Thursday. <span class="pg">Open Getting Started.</span></a>';
    }
    return h;
  }
  function tone(s,end){
    if(end===52) return "";
    var e1=(end===53), out=[];
    var c1={
      f: e1 ? "You froze forty-one honest payments for a thing the walls had already stopped. Marisol forgives you by Monday. Mostly."
            : "You froze the queue. Some people minded at the time. Nobody questions it afterwards.",
      b: e1 ? "You let the batch in flight finish, and it finished clean. You got a little lucky, and you know exactly how much."
            : "You let the batch in flight finish. The report is kind about that call. At two in the morning, for a while, you are not.",
      r: "You shut off the key first. It made the morning loud — the processor called Theo before you could — but it was the hardest stop there was, and by Friday everyone says so."
    }[C(s,10)];
    var c2={
      d:"You called the processor first, with numbers that later changed. The record holds both sets of numbers, and it is better for it.",
      t:"You built the timeline first and called at noon with numbers that held. The processor noticed the two hours. So did you.",
      i:"Noor answered from her trip in nine minutes and ran the first hour by phone. The whole company spoke with one voice — a little late, but together."
    }[C(s,11)];
    if(c1) out.push(c1); if(c2) out.push(c2);
    return out.length ? "<p><em>What you did next:</em> "+out.join(" ")+"</p>" : "";
  }
  function readback(s,end){
    var causal=causalRows(end,s), h='<div class="readback"><h3>Your ledger, read back</h3>';
    if(causal.length===0){
      h+="<p>No single choice caused this ending. Look at your ledger. Every line is a wall that held.</p>";
    } else {
      h+="<p>This ending was decided when you chose:</p><ul>";
      causal.forEach(function(i){
        h+="<li><strong>Page "+bookedAt(i,s)+"</strong> — "+ROW[i].label.toLowerCase()+": "+ROW[i].val[C(s,i)]+".</li>";
      });
      h+="</ul>";
    }
    var holds=HOLDS.filter(function(x){ return C(s,x[0])===x[1] && causal.indexOf(x[0])<0; });
    if(holds.length){
      h+="<h3>What kept it this small</h3><ul>";
      holds.forEach(function(x){ h+="<li>"+x[2]+" (page "+bookedAt(x[0],s)+")</li>"; });
      h+="</ul>";
    }
    return h+"</div>";
  }
  function ledgerTable(s){
    var h="<table>";
    for(var i=1;i<=9;i++){
      var ch=C(s,i), v=(ch==="-")?"—":(ROW[i].val[ch]+" (page "+bookedAt(i,s)+")");
      h+="<tr><td>"+i+". "+ROW[i].label+"</td><td>"+v+"</td></tr>";
    }
    return h+"</table>";
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
        var miss=[]; for(var i=1;i<=9;i++) if(C(s,i)==="-") miss.push(i);
        box.innerHTML="Your ledger has empty lines. A promise you never made cannot come due. Go back to page "
          + miss.map(function(i){ return '<a data-turn href="'+String(ROW[i].page).padStart(2,"0")+'.html">'+ROW[i].page+"</a>"; }).join(", page ")
          + " and choose.";
      } else {
        var end=resolveEnding(s), first=true;
        document.querySelectorAll(".q").forEach(function(el){
          var hit=evalCond(s,el.getAttribute("data-cond"));
          if(hit && first){ el.classList.add("yes"); first=false; }
          else if(!first){ el.classList.add("dim"); }
        });
        box.innerHTML='<a class="choice" data-turn href="'+end+'.html">Your first true line is marked above. <span class="pg">Turn to page '+end+'.</span></a>';
      }
    }
    if(role==="ending"){
      var endNo=+document.body.getAttribute("data-ending");
      var t=document.getElementById("tone"); if(t) t.innerHTML=tone(s,endNo);
      var r=document.getElementById("readback"); if(r) r.innerHTML=readback(s,endNo);
      var g=document.getElementById("suggest"); if(g){ g.className="suggest"; g.innerHTML=suggest(s,endNo); }
    }
    var led=document.getElementById("ledger"); if(led) led.innerHTML=ledgerTable(s);
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
  return {clean:clean, evalCond:evalCond, withSet:withSet, resolveEnding:resolveEnding, causalRows:causalRows, complete:complete, GUIDE:GUIDE};
})();
if(typeof module!=="undefined") module.exports=VD;
