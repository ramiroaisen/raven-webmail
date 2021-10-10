import{S as s,i as e,s as a,aA as o,aB as t,a as l,d as i,ax as r,b as c,f as d,H as n,D as m,a4 as v,ba as f,j as u,m as p,o as $,x as h,u as w,v as b,k as x,e as g,t as k,l as D,b0 as E,n as I,c as V,g as y,h as q,w as _,E as M,F as P,P as B,I as U,V as G,Q as N,r as S}from"../chunks/vendor-dd04488f.js";import{n as A,b as j,d as C,c as R}from"../chunks/util-b32c90e7.js";import{M as F}from"../chunks/MenuItem-338ffe8c.js";import{P as O}from"../chunks/Password-af8ca37b.js";import{D as T}from"../chunks/Dialog-073a6c6c.js";import{R as W}from"../chunks/Ripple-5f31ea97.js";import{T as H}from"../chunks/TextField-d5fffffc.js";import{l as Q}from"../chunks/locale-5d944b89.js";import"../chunks/singletons-12a22614.js";function Y(s){let e,a,v;return{c(){e=o("svg"),a=o("circle"),v=o("path"),this.h()},l(s){e=t(s,"svg",{height:!0,width:!0,viewBox:!0,preserveAspectRatio:!0});var o=l(e);a=t(o,"circle",{style:!0,cx:!0,cy:!0,r:!0}),l(a).forEach(i),v=t(o,"path",{d:!0,style:!0}),l(v).forEach(i),o.forEach(i),this.h()},h(){r(a,"stroke","rgba(0,0,0,0.075)"),r(a,"stroke-width",s[2]),r(a,"fill","transparent"),c(a,"cx",50),c(a,"cy",50),c(a,"r",35),c(v,"d",s[5]),r(v,"stroke",s[3]),r(v,"fill",s[4]),r(v,"stroke-width",s[2]),r(v,"stroke-linecap","round"),c(e,"height",s[1]),c(e,"width",s[0]),c(e,"viewBox","0 0 100 100"),c(e,"preserveAspectRatio","xMidYMid meet")},m(s,o){d(s,e,o),n(e,a),n(e,v)},p(s,[o]){4&o&&r(a,"stroke-width",s[2]),32&o&&c(v,"d",s[5]),8&o&&r(v,"stroke",s[3]),16&o&&r(v,"fill",s[4]),4&o&&r(v,"stroke-width",s[2]),2&o&&c(e,"height",s[1]),1&o&&c(e,"width",s[0])},i:m,o:m,d(s){s&&i(e)}}}function z(s,e,a){let o,{start:t}=e,{end:l}=e,{width:i=null}=e,{height:r=null}=e,{strokeWidth:c="var(--stroke-width, 5)"}=e,{stroke:d="var(--red)"}=e,{fill:n="transparent"}=e;const m=(s,e,a,o)=>{const t=(o-180)*Math.PI/180;return{x:s+a*Math.cos(t),y:e+a*Math.sin(t)}};return s.$$set=s=>{"start"in s&&a(6,t=s.start),"end"in s&&a(7,l=s.end),"width"in s&&a(0,i=s.width),"height"in s&&a(1,r=s.height),"strokeWidth"in s&&a(2,c=s.strokeWidth),"stroke"in s&&a(3,d=s.stroke),"fill"in s&&a(4,n=s.fill)},s.$$.update=()=>{192&s.$$.dirty&&a(5,o=((s,e,a,o,t)=>{const l=m(s,e,a,t),i=m(s,e,a,o),r=t-o<=180?"0":"1";return`\n          M ${l.x}, ${l.y}\n          A ${a} ${a} 0 ${r} 0 ${i.x} ${i.y}\n      `})(50,50,35,360*t+90,360*l+90))},[i,r,c,d,n,o,t,l]}class J extends s{constructor(s){super(),e(this,s,z,Y,a,{start:6,end:7,width:0,height:1,strokeWidth:2,stroke:3,fill:4})}}function K(s){let e,a=s[9].Edit_your_name+"";return{c(){e=k(a)},l(s){e=y(s,a)},m(s,a){d(s,e,a)},p(s,o){512&o&&a!==(a=s[9].Edit_your_name+"")&&q(e,a)},d(s){s&&i(e)}}}function L(s){let e,a=s[9].Update_your_password+"";return{c(){e=k(a)},l(s){e=y(s,a)},m(s,a){d(s,e,a)},p(s,o){512&o&&a!==(a=s[9].Update_your_password+"")&&q(e,a)},d(s){s&&i(e)}}}function X(s){let e,a;return e=new T({props:{onClose:s[18],width:"500px",title:s[9].Update_your_password,$$slots:{default:[Z]},$$scope:{ctx:s}}}),{c(){u(e.$$.fragment)},l(s){p(e.$$.fragment,s)},m(s,o){$(e,s,o),a=!0},p(s,a){const o={};4&a&&(o.onClose=s[18]),512&a&&(o.title=s[9].Update_your_password),4194872&a&&(o.$$scope={dirty:a,ctx:s}),e.$set(o)},i(s){a||(h(e.$$.fragment,s),a=!0)},o(s){w(e.$$.fragment,s),a=!1},d(s){b(e,s)}}}function Z(s){let e,a,o,t,r,m,v,f,D,E,_,M,S,A,j,C,R,F,T,H,Q,Y=s[9].Send+"";function z(e){s[15](e)}let J={label:s[9].Current_password};function K(e){s[16](e)}void 0!==s[3]&&(J.value=s[3]),o=new O({props:J}),P.push((()=>B(o,"value",z)));let L={label:s[9].New_password};function X(e){s[17](e)}void 0!==s[4]&&(L.value=s[4]),v=new O({props:L}),P.push((()=>B(v,"value",K)));let Z={label:s[9].Confirm_password};return void 0!==s[5]&&(Z.value=s[5]),_=new O({props:Z}),P.push((()=>B(_,"value",X))),F=new W({}),{c(){e=g("form"),a=g("div"),u(o.$$.fragment),r=x(),m=g("div"),u(v.$$.fragment),D=x(),E=g("div"),u(_.$$.fragment),S=x(),A=g("div"),j=g("button"),C=k(Y),R=x(),u(F.$$.fragment),this.h()},l(s){e=V(s,"FORM",{class:!0});var t=l(e);a=V(t,"DIV",{class:!0});var c=l(a);p(o.$$.fragment,c),c.forEach(i),r=I(t),m=V(t,"DIV",{class:!0});var d=l(m);p(v.$$.fragment,d),d.forEach(i),D=I(t),E=V(t,"DIV",{class:!0});var n=l(E);p(_.$$.fragment,n),n.forEach(i),S=I(t),A=V(t,"DIV",{class:!0});var f=l(A);j=V(f,"BUTTON",{class:!0});var u=l(j);C=y(u,Y),R=I(u),p(F.$$.fragment,u),u.forEach(i),f.forEach(i),t.forEach(i),this.h()},h(){c(a,"class","field svelte-bkcxoo"),c(m,"class","field svelte-bkcxoo"),c(E,"class","field svelte-bkcxoo"),c(j,"class","btn-light btn-primary elev2"),c(A,"class","send svelte-bkcxoo"),c(e,"class","password-dialog svelte-bkcxoo")},m(t,l){d(t,e,l),n(e,a),$(o,a,null),n(e,r),n(e,m),$(v,m,null),n(e,D),n(e,E),$(_,E,null),n(e,S),n(e,A),n(A,j),n(j,C),n(j,R),$(F,j,null),T=!0,H||(Q=U(e,"submit",G(s[11])),H=!0)},p(s,e){const a={};512&e&&(a.label=s[9].Current_password),!t&&8&e&&(t=!0,a.value=s[3],N((()=>t=!1))),o.$set(a);const l={};512&e&&(l.label=s[9].New_password),!f&&16&e&&(f=!0,l.value=s[4],N((()=>f=!1))),v.$set(l);const i={};512&e&&(i.label=s[9].Confirm_password),!M&&32&e&&(M=!0,i.value=s[5],N((()=>M=!1))),_.$set(i),(!T||512&e)&&Y!==(Y=s[9].Send+"")&&q(C,Y)},i(s){T||(h(o.$$.fragment,s),h(v.$$.fragment,s),h(_.$$.fragment,s),h(F.$$.fragment,s),T=!0)},o(s){w(o.$$.fragment,s),w(v.$$.fragment,s),w(_.$$.fragment,s),w(F.$$.fragment,s),T=!1},d(s){s&&i(e),b(o),b(v),b(_),b(F),H=!1,Q()}}}function ss(s){let e,a;return e=new T({props:{title:s[9].Edit_your_name,onClose:s[20],width:"500px",$$slots:{default:[es]},$$scope:{ctx:s}}}),{c(){u(e.$$.fragment)},l(s){p(e.$$.fragment,s)},m(s,o){$(e,s,o),a=!0},p(s,a){const o={};512&a&&(o.title=s[9].Edit_your_name),64&a&&(o.onClose=s[20]),4194944&a&&(o.$$scope={dirty:a,ctx:s}),e.$set(o)},i(s){a||(h(e.$$.fragment,s),a=!0)},o(s){w(e.$$.fragment,s),a=!1},d(s){b(e,s)}}}function es(s){let e,a,o,t,r,m,v,f,D,E,_,M,S,A=s[9].Send+"";function j(e){s[19](e)}let C={label:s[9].New_name};return void 0!==s[7]&&(C.value=s[7]),o=new H({props:C}),P.push((()=>B(o,"value",j))),E=new W({}),{c(){e=g("form"),a=g("div"),u(o.$$.fragment),r=x(),m=g("div"),v=g("button"),f=k(A),D=x(),u(E.$$.fragment),this.h()},l(s){e=V(s,"FORM",{class:!0});var t=l(e);a=V(t,"DIV",{class:!0});var c=l(a);p(o.$$.fragment,c),c.forEach(i),r=I(t),m=V(t,"DIV",{class:!0});var d=l(m);v=V(d,"BUTTON",{class:!0});var n=l(v);f=y(n,A),D=I(n),p(E.$$.fragment,n),n.forEach(i),d.forEach(i),t.forEach(i),this.h()},h(){c(a,"class","field svelte-bkcxoo"),c(v,"class","btn-light btn-primary elev2"),c(m,"class","send svelte-bkcxoo"),c(e,"class","password-dialog svelte-bkcxoo")},m(t,l){d(t,e,l),n(e,a),$(o,a,null),n(e,r),n(e,m),n(m,v),n(v,f),n(v,D),$(E,v,null),_=!0,M||(S=U(e,"submit",G(s[12])),M=!0)},p(s,e){const a={};512&e&&(a.label=s[9].New_name),!t&&128&e&&(t=!0,a.value=s[7],N((()=>t=!1))),o.$set(a),(!_||512&e)&&A!==(A=s[9].Send+"")&&q(f,A)},i(s){_||(h(o.$$.fragment,s),h(E.$$.fragment,s),_=!0)},o(s){w(o.$$.fragment,s),w(E.$$.fragment,s),_=!1},d(s){s&&i(e),b(o),b(E),M=!1,S()}}}function as(s){let e,a,o,t,r,m,M,P,B,U,G,N,A,j,C,R,O,T,W,H,Q,Y,z,Z,es,as,os,ts,ls,is,rs,cs,ds,ns,ms,vs,fs,us,ps,$s,hs,ws,bs,xs,gs,ks,Ds,Es,Is,Vs,ys,qs,_s,Ms,Ps,Bs,Us,Gs,Ns,Ss,As,js,Cs,Rs,Fs,Os,Ts,Ws,Hs,Qs,Ys,zs,Js,Ks,Ls,Xs,Zs,se,ee,ae,oe,te,le,ie,re,ce,de,ne,me,ve,fe,ue,pe,$e,he,we,be,xe,ge,ke,De,Ee,Ie,Ve,ye,qe,_e,Me,Pe,Be,Ue,Ge,Ne,Se,Ae,je,Ce,Re,Fe,Oe,Te,We,He,Qe,Ye,ze,Je,Ke,Le,Xe,Ze,sa,ea,aa,oa,ta,la,ia,ra,ca,da,na,ma,va,fa,ua,pa,$a,ha,wa,ba,xa,ga,ka,Da,Ea,Ia,Va,ya,qa,_a,Ma,Pa,Ba,Ua,Ga,Na,Sa,Aa,ja,Ca,Ra,Fa,Oa,Ta,Wa,Ha,Qa,Ya,za,Ja,Ka,La,Xa,Za,so,eo,ao,oo,to,lo,io,ro,co,no,mo,vo,fo,uo,po,$o,ho,wo,bo,xo,go,ko,Do,Eo,Io=s[0].username+"",Vo=s[0].address+"",yo=s[9].Common_actions+"",qo=s[9].Storage+"",_o=Math.round(s[0].limits.quota.used/s[0].limits.quota.allowed*100)+"",Mo=s[10](s[0].limits.quota.used)+"",Po=s[9].of+"",Bo=s[10](s[0].limits.quota.allowed)+"",Uo=s[9].IMAP_Download+"",Go=s[9].daily+"",No=Math.round(s[0].limits.imapDownload.used/s[0].limits.imapDownload.allowed*100)+"",So=s[10](s[0].limits.imapDownload.used)+"",Ao=s[9].of+"",jo=s[10](s[0].limits.imapDownload.allowed)+"",Co=s[9].IMAP_Upload+"",Ro=s[9].daily+"",Fo=Math.round(s[0].limits.imapUpload.used/s[0].limits.imapUpload.allowed*100)+"",Oo=s[10](s[0].limits.imapUpload.used)+"",To=s[9].of+"",Wo=s[10](s[0].limits.imapUpload.allowed)+"",Ho=s[9].POP3_Download+"",Qo=s[9].daily+"",Yo=Math.round(s[0].limits.pop3Download.used/s[0].limits.pop3Download.allowed*100)+"",zo=s[10](s[0].limits.pop3Download.used)+"",Jo=s[9].of+"",Ko=s[10](s[0].limits.pop3Download.allowed)+"",Lo=s[9].Received+"",Xo=s[9].by_minute+"",Zo=Math.round(s[0].limits.received.used/s[0].limits.received.allowed*100)+"",st=s[0].limits.received.used+"",et=1===s[0].limits.received.used?"message":"messages",at=s[9].of+"",ot=s[0].limits.received.allowed+"",tt=1===s[0].limits.received.allowed?"message":"messages",lt=s[9].Sent+"",it=s[9].daily+"",rt=Math.round(s[0].limits.recipients.used/s[0].limits.recipients.allowed*100)+"",ct=s[0].limits.recipients.used+"",dt=(1===s[0].limits.recipients.used?s[9].message:s[9].messages)+"",nt=s[9].of+"",mt=s[0].limits.recipients.allowed+"",vt=(1===s[0].limits.recipients.allowed?s[9].message:s[9].messages)+"",ft=s[9].Forwarded+"",ut=s[9].daily+"",pt=Math.round(s[0].limits.forwards.used/s[0].limits.forwards.allowed*100)+"",$t=s[0].limits.forwards.used+"",ht=(s[0].limits.forwards.used,s[9].messages+""),wt=s[9].of+"",bt=s[0].limits.forwards.allowed+"",xt=(1===s[0].limits.forwards.allowed?s[9].message:s[9].messages)+"";document.title=e=s[9].My_account,z=new F({props:{icon:v,$$slots:{default:[K]},$$scope:{ctx:s}}}),z.$on("click",s[13]),es=new F({props:{icon:f,$$slots:{default:[L]},$$scope:{ctx:s}}}),es.$on("click",s[14]),cs=new J({props:{start:0,end:s[0].limits.quota.used/s[0].limits.quota.allowed}}),Us=new J({props:{start:0,end:s[0].limits.imapDownload.used/s[0].limits.imapDownload.allowed}}),te=new J({props:{start:0,end:s[0].limits.imapUpload.used/s[0].limits.imapUpload.allowed}}),_e=new J({props:{start:0,end:s[0].limits.pop3Download.used/s[0].limits.pop3Download.allowed}}),sa=new J({props:{start:0,end:s[0].limits.received.used/s[0].limits.received.allowed}}),ya=new J({props:{start:0,end:s[0].limits.recipients.used/s[0].limits.recipients.allowed}}),so=new J({props:{start:0,end:s[0].limits.forwards.used/s[0].limits.forwards.allowed}});let gt=s[2]&&X(s),kt=s[6]&&ss(s);return{c(){a=x(),o=g("div"),t=g("div"),r=g("div"),m=k(s[8]),M=x(),P=g("div"),B=g("div"),U=k(s[1]),G=x(),N=g("div"),A=k(Io),j=x(),C=g("div"),R=k(Vo),O=x(),T=g("div"),W=g("div"),H=k(yo),Q=x(),Y=g("div"),u(z.$$.fragment),Z=x(),u(es.$$.fragment),as=x(),os=g("div"),ts=g("div"),ls=k(qo),is=x(),rs=g("div"),u(cs.$$.fragment),ds=x(),ns=g("div"),ms=g("div"),vs=k(_o),fs=k("%"),us=x(),ps=g("div"),$s=k(Mo),hs=k(" GB"),ws=x(),bs=g("div"),xs=k(Po),gs=x(),ks=k(Bo),Ds=k(" GB"),Es=x(),Is=g("div"),Vs=g("div"),ys=k(Uo),qs=x(),_s=g("span"),Ms=k(Go),Ps=x(),Bs=g("div"),u(Us.$$.fragment),Gs=x(),Ns=g("div"),Ss=g("div"),As=k(No),js=k("%"),Cs=x(),Rs=g("div"),Fs=k(So),Os=k(" GB"),Ts=x(),Ws=g("div"),Hs=k(Ao),Qs=x(),Ys=k(jo),zs=k(" GB"),Js=x(),Ks=g("div"),Ls=g("div"),Xs=k(Co),Zs=x(),se=g("span"),ee=k(Ro),ae=x(),oe=g("div"),u(te.$$.fragment),le=x(),ie=g("div"),re=g("div"),ce=k(Fo),de=k("%"),ne=x(),me=g("div"),ve=k(Oo),fe=k(" GB"),ue=x(),pe=g("div"),$e=k(To),he=x(),we=k(Wo),be=k(" GB"),xe=x(),ge=g("div"),ke=g("div"),De=k(Ho),Ee=x(),Ie=g("span"),Ve=k(Qo),ye=x(),qe=g("div"),u(_e.$$.fragment),Me=x(),Pe=g("div"),Be=g("div"),Ue=k(Yo),Ge=k("%"),Ne=x(),Se=g("div"),Ae=k(zo),je=k(" GB"),Ce=x(),Re=g("div"),Fe=k(Jo),Oe=x(),Te=k(Ko),We=k(" GB"),He=x(),Qe=g("div"),Ye=g("div"),ze=k(Lo),Je=x(),Ke=g("span"),Le=k(Xo),Xe=x(),Ze=g("div"),u(sa.$$.fragment),ea=x(),aa=g("div"),oa=g("div"),ta=k(Zo),la=k("%"),ia=x(),ra=g("div"),ca=k(st),da=x(),na=k(et),ma=x(),va=g("div"),fa=k(at),ua=x(),pa=k(ot),$a=x(),ha=k(tt),wa=x(),ba=g("div"),xa=g("div"),ga=k(lt),ka=x(),Da=g("span"),Ea=k(it),Ia=x(),Va=g("div"),u(ya.$$.fragment),qa=x(),_a=g("div"),Ma=g("div"),Pa=k(rt),Ba=k("%"),Ua=x(),Ga=g("div"),Na=k(ct),Sa=x(),Aa=k(dt),ja=x(),Ca=g("div"),Ra=k(nt),Fa=x(),Oa=k(mt),Ta=x(),Wa=k(vt),Ha=x(),Qa=g("div"),Ya=g("div"),za=k(ft),Ja=x(),Ka=g("span"),La=k(ut),Xa=x(),Za=g("div"),u(so.$$.fragment),eo=x(),ao=g("div"),oo=g("div"),to=k(pt),lo=k("%"),io=x(),ro=g("div"),co=k($t),no=x(),mo=k(ht),vo=x(),fo=g("div"),uo=k(wt),po=x(),$o=k(bt),ho=x(),wo=k(xt),bo=x(),xo=g("div"),go=x(),gt&&gt.c(),ko=x(),kt&&kt.c(),Do=D(),this.h()},l(e){E('[data-svelte="svelte-jl80hf"]',document.head).forEach(i),a=I(e),o=V(e,"DIV",{class:!0});var c=l(o);t=V(c,"DIV",{class:!0});var d=l(t);r=V(d,"DIV",{class:!0});var n=l(r);m=y(n,s[8]),n.forEach(i),M=I(d),P=V(d,"DIV",{class:!0});var v=l(P);B=V(v,"DIV",{class:!0});var f=l(B);U=y(f,s[1]),f.forEach(i),G=I(v),N=V(v,"DIV",{class:!0});var u=l(N);A=y(u,Io),u.forEach(i),j=I(v),C=V(v,"DIV",{class:!0});var $=l(C);R=y($,Vo),$.forEach(i),v.forEach(i),d.forEach(i),O=I(c),T=V(c,"DIV",{class:!0});var h=l(T);W=V(h,"DIV",{class:!0});var w=l(W);H=y(w,yo),w.forEach(i),Q=I(h),Y=V(h,"DIV",{class:!0});var b=l(Y);p(z.$$.fragment,b),Z=I(b),p(es.$$.fragment,b),b.forEach(i),h.forEach(i),as=I(c),os=V(c,"DIV",{class:!0});var x=l(os);ts=V(x,"DIV",{class:!0});var g=l(ts);ls=y(g,qo),g.forEach(i),is=I(x),rs=V(x,"DIV",{class:!0});var k=l(rs);p(cs.$$.fragment,k),ds=I(k),ns=V(k,"DIV",{class:!0});var q=l(ns);ms=V(q,"DIV",{class:!0});var _=l(ms);vs=y(_,_o),fs=y(_,"%"),_.forEach(i),us=I(q),ps=V(q,"DIV",{class:!0});var S=l(ps);$s=y(S,Mo),hs=y(S," GB"),S.forEach(i),ws=I(q),bs=V(q,"DIV",{class:!0});var F=l(bs);xs=y(F,Po),gs=I(F),ks=y(F,Bo),Ds=y(F," GB"),F.forEach(i),q.forEach(i),k.forEach(i),x.forEach(i),Es=I(c),Is=V(c,"DIV",{class:!0});var J=l(Is);Vs=V(J,"DIV",{class:!0});var K=l(Vs);ys=y(K,Uo),qs=I(K),_s=V(K,"SPAN",{class:!0});var L=l(_s);Ms=y(L,Go),L.forEach(i),K.forEach(i),Ps=I(J),Bs=V(J,"DIV",{class:!0});var X=l(Bs);p(Us.$$.fragment,X),Gs=I(X),Ns=V(X,"DIV",{class:!0});var ss=l(Ns);Ss=V(ss,"DIV",{class:!0});var Eo=l(Ss);As=y(Eo,No),js=y(Eo,"%"),Eo.forEach(i),Cs=I(ss),Rs=V(ss,"DIV",{class:!0});var Dt=l(Rs);Fs=y(Dt,So),Os=y(Dt," GB"),Dt.forEach(i),Ts=I(ss),Ws=V(ss,"DIV",{class:!0});var Et=l(Ws);Hs=y(Et,Ao),Qs=I(Et),Ys=y(Et,jo),zs=y(Et," GB"),Et.forEach(i),ss.forEach(i),X.forEach(i),J.forEach(i),Js=I(c),Ks=V(c,"DIV",{class:!0});var It=l(Ks);Ls=V(It,"DIV",{class:!0});var Vt=l(Ls);Xs=y(Vt,Co),Zs=I(Vt),se=V(Vt,"SPAN",{class:!0});var yt=l(se);ee=y(yt,Ro),yt.forEach(i),Vt.forEach(i),ae=I(It),oe=V(It,"DIV",{class:!0});var qt=l(oe);p(te.$$.fragment,qt),le=I(qt),ie=V(qt,"DIV",{class:!0});var _t=l(ie);re=V(_t,"DIV",{class:!0});var Mt=l(re);ce=y(Mt,Fo),de=y(Mt,"%"),Mt.forEach(i),ne=I(_t),me=V(_t,"DIV",{class:!0});var Pt=l(me);ve=y(Pt,Oo),fe=y(Pt," GB"),Pt.forEach(i),ue=I(_t),pe=V(_t,"DIV",{class:!0});var Bt=l(pe);$e=y(Bt,To),he=I(Bt),we=y(Bt,Wo),be=y(Bt," GB"),Bt.forEach(i),_t.forEach(i),qt.forEach(i),It.forEach(i),xe=I(c),ge=V(c,"DIV",{class:!0});var Ut=l(ge);ke=V(Ut,"DIV",{class:!0});var Gt=l(ke);De=y(Gt,Ho),Ee=I(Gt),Ie=V(Gt,"SPAN",{class:!0});var Nt=l(Ie);Ve=y(Nt,Qo),Nt.forEach(i),Gt.forEach(i),ye=I(Ut),qe=V(Ut,"DIV",{class:!0});var St=l(qe);p(_e.$$.fragment,St),Me=I(St),Pe=V(St,"DIV",{class:!0});var At=l(Pe);Be=V(At,"DIV",{class:!0});var jt=l(Be);Ue=y(jt,Yo),Ge=y(jt,"%"),jt.forEach(i),Ne=I(At),Se=V(At,"DIV",{class:!0});var Ct=l(Se);Ae=y(Ct,zo),je=y(Ct," GB"),Ct.forEach(i),Ce=I(At),Re=V(At,"DIV",{class:!0});var Rt=l(Re);Fe=y(Rt,Jo),Oe=I(Rt),Te=y(Rt,Ko),We=y(Rt," GB"),Rt.forEach(i),At.forEach(i),St.forEach(i),Ut.forEach(i),He=I(c),Qe=V(c,"DIV",{class:!0});var Ft=l(Qe);Ye=V(Ft,"DIV",{class:!0});var Ot=l(Ye);ze=y(Ot,Lo),Je=I(Ot),Ke=V(Ot,"SPAN",{class:!0});var Tt=l(Ke);Le=y(Tt,Xo),Tt.forEach(i),Ot.forEach(i),Xe=I(Ft),Ze=V(Ft,"DIV",{class:!0});var Wt=l(Ze);p(sa.$$.fragment,Wt),ea=I(Wt),aa=V(Wt,"DIV",{class:!0});var Ht=l(aa);oa=V(Ht,"DIV",{class:!0});var Qt=l(oa);ta=y(Qt,Zo),la=y(Qt,"%"),Qt.forEach(i),ia=I(Ht),ra=V(Ht,"DIV",{class:!0});var Yt=l(ra);ca=y(Yt,st),da=I(Yt),na=y(Yt,et),Yt.forEach(i),ma=I(Ht),va=V(Ht,"DIV",{class:!0});var zt=l(va);fa=y(zt,at),ua=I(zt),pa=y(zt,ot),$a=I(zt),ha=y(zt,tt),zt.forEach(i),Ht.forEach(i),Wt.forEach(i),Ft.forEach(i),wa=I(c),ba=V(c,"DIV",{class:!0});var Jt=l(ba);xa=V(Jt,"DIV",{class:!0});var Kt=l(xa);ga=y(Kt,lt),ka=I(Kt),Da=V(Kt,"SPAN",{class:!0});var Lt=l(Da);Ea=y(Lt,it),Lt.forEach(i),Kt.forEach(i),Ia=I(Jt),Va=V(Jt,"DIV",{class:!0});var Xt=l(Va);p(ya.$$.fragment,Xt),qa=I(Xt),_a=V(Xt,"DIV",{class:!0});var Zt=l(_a);Ma=V(Zt,"DIV",{class:!0});var sl=l(Ma);Pa=y(sl,rt),Ba=y(sl,"%"),sl.forEach(i),Ua=I(Zt),Ga=V(Zt,"DIV",{class:!0});var el=l(Ga);Na=y(el,ct),Sa=I(el),Aa=y(el,dt),el.forEach(i),ja=I(Zt),Ca=V(Zt,"DIV",{class:!0});var al=l(Ca);Ra=y(al,nt),Fa=I(al),Oa=y(al,mt),Ta=I(al),Wa=y(al,vt),al.forEach(i),Zt.forEach(i),Xt.forEach(i),Jt.forEach(i),Ha=I(c),Qa=V(c,"DIV",{class:!0});var ol=l(Qa);Ya=V(ol,"DIV",{class:!0});var tl=l(Ya);za=y(tl,ft),Ja=I(tl),Ka=V(tl,"SPAN",{class:!0});var ll=l(Ka);La=y(ll,ut),ll.forEach(i),tl.forEach(i),Xa=I(ol),Za=V(ol,"DIV",{class:!0});var il=l(Za);p(so.$$.fragment,il),eo=I(il),ao=V(il,"DIV",{class:!0});var rl=l(ao);oo=V(rl,"DIV",{class:!0});var cl=l(oo);to=y(cl,pt),lo=y(cl,"%"),cl.forEach(i),io=I(rl),ro=V(rl,"DIV",{class:!0});var dl=l(ro);co=y(dl,$t),no=I(dl),mo=y(dl,ht),dl.forEach(i),vo=I(rl),fo=V(rl,"DIV",{class:!0});var nl=l(fo);uo=y(nl,wt),po=I(nl),$o=y(nl,bt),ho=I(nl),wo=y(nl,xt),nl.forEach(i),rl.forEach(i),il.forEach(i),ol.forEach(i),bo=I(c),xo=V(c,"DIV",{class:!0}),l(xo).forEach(i),c.forEach(i),go=I(e),gt&&gt.l(e),ko=I(e),kt&&kt.l(e),Do=D(),this.h()},h(){c(r,"class","letter elev3 svelte-bkcxoo"),c(B,"class","name svelte-bkcxoo"),c(N,"class","username svelte-bkcxoo"),c(C,"class","address svelte-bkcxoo"),c(P,"class","end svelte-bkcxoo"),c(t,"class","main svelte-bkcxoo"),c(W,"class","box-title svelte-bkcxoo"),c(Y,"class","menu box-content svelte-bkcxoo"),c(T,"class","box elev3 common-actions svelte-bkcxoo"),c(ts,"class","box-title svelte-bkcxoo"),c(ms,"class","percent svelte-bkcxoo"),c(ps,"class","used svelte-bkcxoo"),c(bs,"class","total svelte-bkcxoo"),c(ns,"class","quota-desc svelte-bkcxoo"),c(rs,"class","quota-body svelte-bkcxoo"),c(os,"class","box elev3 quota storage-quota svelte-bkcxoo"),c(_s,"class","comment svelte-bkcxoo"),c(Vs,"class","box-title svelte-bkcxoo"),c(Ss,"class","percent svelte-bkcxoo"),c(Rs,"class","used svelte-bkcxoo"),c(Ws,"class","total svelte-bkcxoo"),c(Ns,"class","quota-desc svelte-bkcxoo"),c(Bs,"class","quota-body svelte-bkcxoo"),c(Is,"class","box elev3 quota imap-download-quota svelte-bkcxoo"),c(se,"class","comment svelte-bkcxoo"),c(Ls,"class","box-title svelte-bkcxoo"),c(re,"class","percent svelte-bkcxoo"),c(me,"class","used svelte-bkcxoo"),c(pe,"class","total svelte-bkcxoo"),c(ie,"class","quota-desc svelte-bkcxoo"),c(oe,"class","quota-body svelte-bkcxoo"),c(Ks,"class","box elev3 quota imap-upload-quota svelte-bkcxoo"),c(Ie,"class","comment svelte-bkcxoo"),c(ke,"class","box-title svelte-bkcxoo"),c(Be,"class","percent svelte-bkcxoo"),c(Se,"class","used svelte-bkcxoo"),c(Re,"class","total svelte-bkcxoo"),c(Pe,"class","quota-desc svelte-bkcxoo"),c(qe,"class","quota-body svelte-bkcxoo"),c(ge,"class","box elev3 quota pop3-download-quota svelte-bkcxoo"),c(Ke,"class","comment svelte-bkcxoo"),c(Ye,"class","box-title svelte-bkcxoo"),c(oa,"class","percent svelte-bkcxoo"),c(ra,"class","used svelte-bkcxoo"),c(va,"class","total svelte-bkcxoo"),c(aa,"class","quota-desc svelte-bkcxoo"),c(Ze,"class","quota-body svelte-bkcxoo"),c(Qe,"class","box elev3 quota received-quota svelte-bkcxoo"),c(Da,"class","comment svelte-bkcxoo"),c(xa,"class","box-title svelte-bkcxoo"),c(Ma,"class","percent svelte-bkcxoo"),c(Ga,"class","used svelte-bkcxoo"),c(Ca,"class","total svelte-bkcxoo"),c(_a,"class","quota-desc svelte-bkcxoo"),c(Va,"class","quota-body svelte-bkcxoo"),c(ba,"class","box elev3 quota recipients-quota svelte-bkcxoo"),c(Ka,"class","comment svelte-bkcxoo"),c(Ya,"class","box-title svelte-bkcxoo"),c(oo,"class","percent svelte-bkcxoo"),c(ro,"class","used svelte-bkcxoo"),c(fo,"class","total svelte-bkcxoo"),c(ao,"class","quota-desc svelte-bkcxoo"),c(Za,"class","quota-body svelte-bkcxoo"),c(Qa,"class","box elev3 quota forwards-quota svelte-bkcxoo"),c(xo,"class","bottom-space svelte-bkcxoo"),c(o,"class","account svelte-bkcxoo")},m(s,e){d(s,a,e),d(s,o,e),n(o,t),n(t,r),n(r,m),n(t,M),n(t,P),n(P,B),n(B,U),n(P,G),n(P,N),n(N,A),n(P,j),n(P,C),n(C,R),n(o,O),n(o,T),n(T,W),n(W,H),n(T,Q),n(T,Y),$(z,Y,null),n(Y,Z),$(es,Y,null),n(o,as),n(o,os),n(os,ts),n(ts,ls),n(os,is),n(os,rs),$(cs,rs,null),n(rs,ds),n(rs,ns),n(ns,ms),n(ms,vs),n(ms,fs),n(ns,us),n(ns,ps),n(ps,$s),n(ps,hs),n(ns,ws),n(ns,bs),n(bs,xs),n(bs,gs),n(bs,ks),n(bs,Ds),n(o,Es),n(o,Is),n(Is,Vs),n(Vs,ys),n(Vs,qs),n(Vs,_s),n(_s,Ms),n(Is,Ps),n(Is,Bs),$(Us,Bs,null),n(Bs,Gs),n(Bs,Ns),n(Ns,Ss),n(Ss,As),n(Ss,js),n(Ns,Cs),n(Ns,Rs),n(Rs,Fs),n(Rs,Os),n(Ns,Ts),n(Ns,Ws),n(Ws,Hs),n(Ws,Qs),n(Ws,Ys),n(Ws,zs),n(o,Js),n(o,Ks),n(Ks,Ls),n(Ls,Xs),n(Ls,Zs),n(Ls,se),n(se,ee),n(Ks,ae),n(Ks,oe),$(te,oe,null),n(oe,le),n(oe,ie),n(ie,re),n(re,ce),n(re,de),n(ie,ne),n(ie,me),n(me,ve),n(me,fe),n(ie,ue),n(ie,pe),n(pe,$e),n(pe,he),n(pe,we),n(pe,be),n(o,xe),n(o,ge),n(ge,ke),n(ke,De),n(ke,Ee),n(ke,Ie),n(Ie,Ve),n(ge,ye),n(ge,qe),$(_e,qe,null),n(qe,Me),n(qe,Pe),n(Pe,Be),n(Be,Ue),n(Be,Ge),n(Pe,Ne),n(Pe,Se),n(Se,Ae),n(Se,je),n(Pe,Ce),n(Pe,Re),n(Re,Fe),n(Re,Oe),n(Re,Te),n(Re,We),n(o,He),n(o,Qe),n(Qe,Ye),n(Ye,ze),n(Ye,Je),n(Ye,Ke),n(Ke,Le),n(Qe,Xe),n(Qe,Ze),$(sa,Ze,null),n(Ze,ea),n(Ze,aa),n(aa,oa),n(oa,ta),n(oa,la),n(aa,ia),n(aa,ra),n(ra,ca),n(ra,da),n(ra,na),n(aa,ma),n(aa,va),n(va,fa),n(va,ua),n(va,pa),n(va,$a),n(va,ha),n(o,wa),n(o,ba),n(ba,xa),n(xa,ga),n(xa,ka),n(xa,Da),n(Da,Ea),n(ba,Ia),n(ba,Va),$(ya,Va,null),n(Va,qa),n(Va,_a),n(_a,Ma),n(Ma,Pa),n(Ma,Ba),n(_a,Ua),n(_a,Ga),n(Ga,Na),n(Ga,Sa),n(Ga,Aa),n(_a,ja),n(_a,Ca),n(Ca,Ra),n(Ca,Fa),n(Ca,Oa),n(Ca,Ta),n(Ca,Wa),n(o,Ha),n(o,Qa),n(Qa,Ya),n(Ya,za),n(Ya,Ja),n(Ya,Ka),n(Ka,La),n(Qa,Xa),n(Qa,Za),$(so,Za,null),n(Za,eo),n(Za,ao),n(ao,oo),n(oo,to),n(oo,lo),n(ao,io),n(ao,ro),n(ro,co),n(ro,no),n(ro,mo),n(ao,vo),n(ao,fo),n(fo,uo),n(fo,po),n(fo,$o),n(fo,ho),n(fo,wo),n(o,bo),n(o,xo),d(s,go,e),gt&&gt.m(s,e),d(s,ko,e),kt&&kt.m(s,e),d(s,Do,e),Eo=!0},p(s,[a]){(!Eo||512&a)&&e!==(e=s[9].My_account)&&(document.title=e),(!Eo||256&a)&&q(m,s[8]),(!Eo||2&a)&&q(U,s[1]),(!Eo||1&a)&&Io!==(Io=s[0].username+"")&&q(A,Io),(!Eo||1&a)&&Vo!==(Vo=s[0].address+"")&&q(R,Vo),(!Eo||512&a)&&yo!==(yo=s[9].Common_actions+"")&&q(H,yo);const o={};4194816&a&&(o.$$scope={dirty:a,ctx:s}),z.$set(o);const t={};4194816&a&&(t.$$scope={dirty:a,ctx:s}),es.$set(t),(!Eo||512&a)&&qo!==(qo=s[9].Storage+"")&&q(ls,qo);const l={};1&a&&(l.end=s[0].limits.quota.used/s[0].limits.quota.allowed),cs.$set(l),(!Eo||1&a)&&_o!==(_o=Math.round(s[0].limits.quota.used/s[0].limits.quota.allowed*100)+"")&&q(vs,_o),(!Eo||1&a)&&Mo!==(Mo=s[10](s[0].limits.quota.used)+"")&&q($s,Mo),(!Eo||512&a)&&Po!==(Po=s[9].of+"")&&q(xs,Po),(!Eo||1&a)&&Bo!==(Bo=s[10](s[0].limits.quota.allowed)+"")&&q(ks,Bo),(!Eo||512&a)&&Uo!==(Uo=s[9].IMAP_Download+"")&&q(ys,Uo),(!Eo||512&a)&&Go!==(Go=s[9].daily+"")&&q(Ms,Go);const i={};1&a&&(i.end=s[0].limits.imapDownload.used/s[0].limits.imapDownload.allowed),Us.$set(i),(!Eo||1&a)&&No!==(No=Math.round(s[0].limits.imapDownload.used/s[0].limits.imapDownload.allowed*100)+"")&&q(As,No),(!Eo||1&a)&&So!==(So=s[10](s[0].limits.imapDownload.used)+"")&&q(Fs,So),(!Eo||512&a)&&Ao!==(Ao=s[9].of+"")&&q(Hs,Ao),(!Eo||1&a)&&jo!==(jo=s[10](s[0].limits.imapDownload.allowed)+"")&&q(Ys,jo),(!Eo||512&a)&&Co!==(Co=s[9].IMAP_Upload+"")&&q(Xs,Co),(!Eo||512&a)&&Ro!==(Ro=s[9].daily+"")&&q(ee,Ro);const r={};1&a&&(r.end=s[0].limits.imapUpload.used/s[0].limits.imapUpload.allowed),te.$set(r),(!Eo||1&a)&&Fo!==(Fo=Math.round(s[0].limits.imapUpload.used/s[0].limits.imapUpload.allowed*100)+"")&&q(ce,Fo),(!Eo||1&a)&&Oo!==(Oo=s[10](s[0].limits.imapUpload.used)+"")&&q(ve,Oo),(!Eo||512&a)&&To!==(To=s[9].of+"")&&q($e,To),(!Eo||1&a)&&Wo!==(Wo=s[10](s[0].limits.imapUpload.allowed)+"")&&q(we,Wo),(!Eo||512&a)&&Ho!==(Ho=s[9].POP3_Download+"")&&q(De,Ho),(!Eo||512&a)&&Qo!==(Qo=s[9].daily+"")&&q(Ve,Qo);const c={};1&a&&(c.end=s[0].limits.pop3Download.used/s[0].limits.pop3Download.allowed),_e.$set(c),(!Eo||1&a)&&Yo!==(Yo=Math.round(s[0].limits.pop3Download.used/s[0].limits.pop3Download.allowed*100)+"")&&q(Ue,Yo),(!Eo||1&a)&&zo!==(zo=s[10](s[0].limits.pop3Download.used)+"")&&q(Ae,zo),(!Eo||512&a)&&Jo!==(Jo=s[9].of+"")&&q(Fe,Jo),(!Eo||1&a)&&Ko!==(Ko=s[10](s[0].limits.pop3Download.allowed)+"")&&q(Te,Ko),(!Eo||512&a)&&Lo!==(Lo=s[9].Received+"")&&q(ze,Lo),(!Eo||512&a)&&Xo!==(Xo=s[9].by_minute+"")&&q(Le,Xo);const d={};1&a&&(d.end=s[0].limits.received.used/s[0].limits.received.allowed),sa.$set(d),(!Eo||1&a)&&Zo!==(Zo=Math.round(s[0].limits.received.used/s[0].limits.received.allowed*100)+"")&&q(ta,Zo),(!Eo||1&a)&&st!==(st=s[0].limits.received.used+"")&&q(ca,st),(!Eo||1&a)&&et!==(et=1===s[0].limits.received.used?"message":"messages")&&q(na,et),(!Eo||512&a)&&at!==(at=s[9].of+"")&&q(fa,at),(!Eo||1&a)&&ot!==(ot=s[0].limits.received.allowed+"")&&q(pa,ot),(!Eo||1&a)&&tt!==(tt=1===s[0].limits.received.allowed?"message":"messages")&&q(ha,tt),(!Eo||512&a)&&lt!==(lt=s[9].Sent+"")&&q(ga,lt),(!Eo||512&a)&&it!==(it=s[9].daily+"")&&q(Ea,it);const n={};1&a&&(n.end=s[0].limits.recipients.used/s[0].limits.recipients.allowed),ya.$set(n),(!Eo||1&a)&&rt!==(rt=Math.round(s[0].limits.recipients.used/s[0].limits.recipients.allowed*100)+"")&&q(Pa,rt),(!Eo||1&a)&&ct!==(ct=s[0].limits.recipients.used+"")&&q(Na,ct),(!Eo||513&a)&&dt!==(dt=(1===s[0].limits.recipients.used?s[9].message:s[9].messages)+"")&&q(Aa,dt),(!Eo||512&a)&&nt!==(nt=s[9].of+"")&&q(Ra,nt),(!Eo||1&a)&&mt!==(mt=s[0].limits.recipients.allowed+"")&&q(Oa,mt),(!Eo||513&a)&&vt!==(vt=(1===s[0].limits.recipients.allowed?s[9].message:s[9].messages)+"")&&q(Wa,vt),(!Eo||512&a)&&ft!==(ft=s[9].Forwarded+"")&&q(za,ft),(!Eo||512&a)&&ut!==(ut=s[9].daily+"")&&q(La,ut);const v={};1&a&&(v.end=s[0].limits.forwards.used/s[0].limits.forwards.allowed),so.$set(v),(!Eo||1&a)&&pt!==(pt=Math.round(s[0].limits.forwards.used/s[0].limits.forwards.allowed*100)+"")&&q(to,pt),(!Eo||1&a)&&$t!==($t=s[0].limits.forwards.used+"")&&q(co,$t),(!Eo||513&a)&&ht!==(s[0].limits.forwards.used,ht=s[9].messages+"")&&q(mo,ht),(!Eo||512&a)&&wt!==(wt=s[9].of+"")&&q(uo,wt),(!Eo||1&a)&&bt!==(bt=s[0].limits.forwards.allowed+"")&&q($o,bt),(!Eo||513&a)&&xt!==(xt=(1===s[0].limits.forwards.allowed?s[9].message:s[9].messages)+"")&&q(wo,xt),s[2]?gt?(gt.p(s,a),4&a&&h(gt,1)):(gt=X(s),gt.c(),h(gt,1),gt.m(ko.parentNode,ko)):gt&&(S(),w(gt,1,1,(()=>{gt=null})),_()),s[6]?kt?(kt.p(s,a),64&a&&h(kt,1)):(kt=ss(s),kt.c(),h(kt,1),kt.m(Do.parentNode,Do)):kt&&(S(),w(kt,1,1,(()=>{kt=null})),_())},i(s){Eo||(h(z.$$.fragment,s),h(es.$$.fragment,s),h(cs.$$.fragment,s),h(Us.$$.fragment,s),h(te.$$.fragment,s),h(_e.$$.fragment,s),h(sa.$$.fragment,s),h(ya.$$.fragment,s),h(so.$$.fragment,s),h(gt),h(kt),Eo=!0)},o(s){w(z.$$.fragment,s),w(es.$$.fragment,s),w(cs.$$.fragment,s),w(Us.$$.fragment,s),w(te.$$.fragment,s),w(_e.$$.fragment,s),w(sa.$$.fragment,s),w(ya.$$.fragment,s),w(so.$$.fragment,s),w(gt),w(kt),Eo=!1},d(s){s&&i(a),s&&i(o),b(z),b(es),b(cs),b(Us),b(te),b(_e),b(sa),b(ya),b(so),s&&i(go),gt&&gt.d(s),s&&i(ko),kt&&kt.d(s),s&&i(Do)}}}var os=function(s,e,a,o){return new(a||(a=Promise))((function(t,l){function i(s){try{c(o.next(s))}catch(e){l(e)}}function r(s){try{c(o.throw(s))}catch(e){l(e)}}function c(s){var e;s.done?t(s.value):(e=s.value,e instanceof a?e:new a((function(s){s(e)}))).then(i,r)}c((o=o.apply(s,e||[])).next())}))};const ts=({page:s,fetch:e,session:a})=>os(void 0,void 0,void 0,(function*(){return yield A({page:s,fetch:e,session:a})}));function ls(s,e,a){let o,t,l;M(s,Q,(s=>a(9,l=s)));var i=this&&this.__awaiter||function(s,e,a,o){return new(a||(a=Promise))((function(t,l){function i(s){try{c(o.next(s))}catch(e){l(e)}}function r(s){try{c(o.throw(s))}catch(e){l(e)}}function c(s){var e;s.done?t(s.value):(e=s.value,e instanceof a?e:new a((function(s){s(e)}))).then(i,r)}c((o=o.apply(s,e||[])).next())}))};let{user:r}=e;let c=!1,d="",n="",m="";const v=j((()=>i(void 0,void 0,void 0,(function*(){if(n.length<6)throw new Error("Password must have 6 characters or more");if(n!==m)throw new Error("Passwords does not match");yield C("/api/me",{existingPassword:d,password:n}),a(3,d=""),a(4,n=""),a(5,m=""),a(2,c=!1),R(l.notifier.Password_updated)}))));let f=!1,u=r.name||"";const p=j((()=>i(void 0,void 0,void 0,(function*(){(null==u?void 0:u.trim())&&(yield C("/api/me",{name:u}),a(0,r.name=u,r),a(6,f=!1),R(l.notifier.Name_updated))}))));return s.$$set=s=>{"user"in s&&a(0,r=s.user)},s.$$.update=()=>{1&s.$$.dirty&&a(1,o=r.name||"Unnamed"),2&s.$$.dirty&&a(8,t=o[0]||"")},[r,o,c,d,n,m,f,u,t,l,s=>(s/Math.pow(1024,3)).toFixed(2),v,p,()=>a(6,f=!0),()=>a(2,c=!0),function(s){d=s,a(3,d)},function(s){n=s,a(4,n)},function(s){m=s,a(5,m)},()=>a(2,c=!1),function(s){u=s,a(7,u)},()=>a(6,f=!1)]}class is extends s{constructor(s){super(),e(this,s,ls,as,a,{user:0})}}export{is as default,ts as load};
