import{S as t,a as e,s,aj as o,b as l,c as i,d as a,ak as n,al as d,A as c,y as r,f as m,ad as $,n as u,e as p,k as f,E as v,L as w,F as g,m as x,M as h,r as j,p as b,N as y,a0 as A,ab as q,ac as k,C as D,aq as U,l as M,o as P,w as C,B as T,a3 as B,aB as z,x as V,z as H,G as W,H as E,as as L,h as I,j as F,aC as N,q as G,aD as R,I as S,u as Y}from"./main-4a061dee.js";import{P as Z}from"./Password-98e27c6e.js";function J(t){let e,s;const $=t[8].default,u=o($,t,t[7],null);return{c(){e=l("svg"),u&&u.c(),i(e,"height",t[1]),i(e,"width",t[0]),i(e,"viewBox","0 0 100 100"),i(e,"preserveAspectRatio","xMidYMid meet")},m(t,o){a(t,e,o),u&&u.m(e,null),s=!0},p(t,[o]){u&&u.p&&128&o&&u.p(n($,t,t[7],null),d($,t[7],o,null)),(!s||2&o)&&i(e,"height",t[1]),(!s||1&o)&&i(e,"width",t[0])},i(t){s||(c(u,t),s=!0)},o(t){r(u,t),s=!1},d(t){t&&m(e),u&&u.d(t)}}}function K(t,e,s){let{start:o}=e,{end:l}=e,{width:i=null}=e,{height:a=null}=e;const n=(t,e,s,o)=>{const l=(o-180)*Math.PI/180;return{x:t+s*Math.cos(l),y:e+s*Math.sin(l)}},d=(t,e,s,o,l)=>{const i=n(t,e,s,l),a=n(t,e,s,o),d=l-o<=180?"0":"1";return`\n            M ${i.x}, ${i.y}\n            A ${s} ${s} 0 ${d} 0 ${a.x} ${a.y}\n        `};let c,{$$slots:r={},$$scope:m}=e;return t.$set=t=>{"start"in t&&s(2,o=t.start),"end"in t&&s(3,l=t.end),"width"in t&&s(0,i=t.width),"height"in t&&s(1,a=t.height),"$$scope"in t&&s(7,m=t.$$scope)},t.$$.update=()=>{12&t.$$.dirty&&(c=d(180*o,180*l))},[i,a,o,l,c,n,d,m,r]}class O extends t{constructor(t){super(),e(this,t,K,J,s,{start:2,end:3,width:0,height:1})}}function Q(t){let e;return{c(){e=l("path"),i(e,"d",t[3]),$(e,"stroke",t[1]),$(e,"fill",t[2]),$(e,"stroke-width",t[0]),$(e,"stroke-linecap","round")},m(t,s){a(t,e,s)},p(t,[s]){8&s&&i(e,"d",t[3]),2&s&&$(e,"stroke",t[1]),4&s&&$(e,"fill",t[2]),1&s&&$(e,"stroke-width",t[0])},i:u,o:u,d(t){t&&m(e)}}}function X(t,e,s){let{start:o}=e,{end:l}=e,{strokeWidth:i="var(--stroke-width, 5)"}=e,{stroke:a="transparent"}=e,{fill:n="transparent"}=e;const d=(t,e,s,o)=>{const l=(o-180)*Math.PI/180;return{x:t+s*Math.cos(l),y:e+s*Math.sin(l)}};let c;return t.$set=t=>{"start"in t&&s(4,o=t.start),"end"in t&&s(5,l=t.end),"strokeWidth"in t&&s(0,i=t.strokeWidth),"stroke"in t&&s(1,a=t.stroke),"fill"in t&&s(2,n=t.fill)},t.$$.update=()=>{48&t.$$.dirty&&s(3,c=((t,e,s,o,l)=>{const i=d(t,e,s,l),a=d(t,e,s,o),n=l-o<=180?"0":"1";return`\n            M ${i.x}, ${i.y}\n            A ${s} ${s} 0 ${n} 0 ${a.x} ${a.y}\n        `})(50,50,35,360*o+90,360*l+90))},[i,a,n,c,o,l]}class _ extends t{constructor(t){super(),e(this,t,X,Q,s,{start:4,end:5,strokeWidth:0,stroke:1,fill:2})}}function tt(t){let e,s;return{c(){e=l("svg"),s=l("path"),i(s,"d","M12.63,2C18.16,2 22.64,6.5 22.64,12C22.64,17.5 18.16,22 12.63,22C9.12,22 6.05,20.18 4.26,17.43L5.84,16.18C7.25,18.47 9.76,20 12.64,20A8,8 0 0,0 20.64,12A8,8 0 0,0 12.64,4C8.56,4 5.2,7.06 4.71,11H7.47L3.73,14.73L0,11H2.69C3.19,5.95 7.45,2 12.63,2M15.59,10.24C16.09,10.25 16.5,10.65 16.5,11.16V15.77C16.5,16.27 16.09,16.69 15.58,16.69H10.05C9.54,16.69 9.13,16.27 9.13,15.77V11.16C9.13,10.65 9.54,10.25 10.04,10.24V9.23C10.04,7.7 11.29,6.46 12.81,6.46C14.34,6.46 15.59,7.7 15.59,9.23V10.24M12.81,7.86C12.06,7.86 11.44,8.47 11.44,9.23V10.24H14.19V9.23C14.19,8.47 13.57,7.86 12.81,7.86Z"),i(s,"fill",t[2]),i(e,"width",t[0]),i(e,"height",t[1]),i(e,"viewBox",t[3])},m(t,o){a(t,e,o),p(e,s)},p(t,[o]){4&o&&i(s,"fill",t[2]),1&o&&i(e,"width",t[0]),2&o&&i(e,"height",t[1]),8&o&&i(e,"viewBox",t[3])},i:u,o:u,d(t){t&&m(e)}}}function et(t,e,s){let{size:o="1em"}=e,{width:l=o}=e,{height:i=o}=e,{color:a="currentColor"}=e,{viewBox:n="0 0 24 24"}=e;return t.$set=t=>{"size"in t&&s(4,o=t.size),"width"in t&&s(0,l=t.width),"height"in t&&s(1,i=t.height),"color"in t&&s(2,a=t.color),"viewBox"in t&&s(3,n=t.viewBox)},[l,i,a,n,o]}class st extends t{constructor(t){super(),e(this,t,et,tt,s,{size:4,width:0,height:1,color:2,viewBox:3})}}function ot(t){let e,s;return{c(){e=f("x-title"),s=v(t[1]),w(e,"class","svelte-1lllrxr")},m(t,o){a(t,e,o),p(e,s)},p(t,e){2&e&&g(s,t[1])},d(t){t&&m(e)}}}function lt(t){let e,s,l,i,$,u,v=null!=t[1]&&ot(t);const g=t[5].default,D=o(g,t,t[4],null);return{c(){e=f("x-overlay"),s=f("x-dialog"),v&&v.c(),l=x(),D&&D.c(),w(s,"class","elevation-4 svelte-1lllrxr"),w(e,"class","svelte-1lllrxr"),h(e,"modal",t[2])},m(o,i,n){a(o,e,i),p(e,s),v&&v.m(s,null),p(s,l),D&&D.m(s,null),$=!0,n&&j(u),u=[b(window,"keydown",t[3],!0),b(s,"click",y(t[6])),b(e,"click",t[7])]},p(t,[o]){null!=t[1]?v?v.p(t,o):(v=ot(t),v.c(),v.m(s,l)):v&&(v.d(1),v=null),D&&D.p&&16&o&&D.p(n(g,t,t[4],null),d(g,t[4],o,null)),4&o&&h(e,"modal",t[2])},i(t){$||(c(D,t),A(()=>{i||(i=q(e,k,{duration:200},!0)),i.run(1)}),$=!0)},o(t){r(D,t),i||(i=q(e,k,{duration:200},!1)),i.run(0),$=!1},d(t){t&&m(e),v&&v.d(),D&&D.d(t),t&&i&&i.end(),j(u)}}}function it(t,e,s){let{open:o}=e,{title:l=null}=e,{modal:i=!1}=e;let{$$slots:a={},$$scope:n}=e;return t.$set=t=>{"open"in t&&s(0,o=t.open),"title"in t&&s(1,l=t.title),"modal"in t&&s(2,i=t.modal),"$$scope"in t&&s(4,n=t.$$scope)},[o,l,i,t=>{o&&!i&&"Escape"===t.key&&s(0,o=!1)},n,a,function(e){D(t,e)},()=>!i&&s(0,o=!1)]}class at extends t{constructor(t){super(),e(this,t,it,lt,s,{open:0,title:1,modal:2})}}function nt(t){let e,s=t[1].commonActions.updatePassword+"";return{c(){e=v(s)},m(t,s){a(t,e,s)},p(t,o){2&o&&s!==(s=t[1].commonActions.updatePassword+"")&&g(e,s)},d(t){t&&m(e)}}}function dt(t){let e;const s=new L({props:{icon:st,$$slots:{default:[nt]},$$scope:{ctx:t}}});return s.$on("click",t[18]),{c(){M(s.$$.fragment)},m(t,o){P(s,t,o),e=!0},p(t,e){const o={};16777218&e&&(o.$$scope={dirty:e,ctx:t}),s.$set(o)},i(t){e||(c(s.$$.fragment,t),e=!0)},o(t){r(s.$$.fragment,t),e=!1},d(t){T(s,t)}}}function ct(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.quota.used/t[0].limits.quota.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.quota.used/t[0].limits.quota.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function rt(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.imapDownload.used/t[0].limits.imapDownload.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.imapDownload.used/t[0].limits.imapDownload.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function mt(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.imapUpload.used/t[0].limits.imapUpload.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.imapUpload.used/t[0].limits.imapUpload.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function $t(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.pop3Download.used/t[0].limits.pop3Download.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.pop3Download.used/t[0].limits.pop3Download.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function ut(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.received.used/t[0].limits.received.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.received.used/t[0].limits.received.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function pt(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.recipients.used/t[0].limits.recipients.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.recipients.used/t[0].limits.recipients.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function ft(t){let e,s;const o=new _({props:{start:0,end:.99,stroke:"rgba(0,0,0,0.075)"}}),l=new _({props:{start:0,end:t[0].limits.forwards.used/t[0].limits.forwards.allowed,stroke:"var(--pc)"}});return{c(){M(o.$$.fragment),e=x(),M(l.$$.fragment)},m(t,i){P(o,t,i),a(t,e,i),P(l,t,i),s=!0},p(t,e){const s={};1&e&&(s.end=t[0].limits.forwards.used/t[0].limits.forwards.allowed),l.$set(s)},i(t){s||(c(o.$$.fragment,t),c(l.$$.fragment,t),s=!0)},o(t){r(o.$$.fragment,t),r(l.$$.fragment,t),s=!1},d(t){T(o,t),t&&m(e),T(l,t)}}}function vt(t){let e,s;function o(e){t[23].call(null,e)}let l={title:t[1].commonActions.updatePassword,$$slots:{default:[gt]},$$scope:{ctx:t}};void 0!==t[5]&&(l.open=t[5]);const i=new at({props:l});return I.push(()=>F(i,"open",o)),{c(){M(i.$$.fragment)},m(t,e){P(i,t,e),s=!0},p(t,s){const o={};2&s&&(o.title=t[1].commonActions.updatePassword),16778178&s&&(o.$$scope={dirty:s,ctx:t}),!e&&32&s&&(e=!0,o.open=t[5],C(()=>e=!1)),i.$set(o)},i(t){s||(c(i.$$.fragment,t),s=!0)},o(t){r(i.$$.fragment,t),s=!1},d(t){T(i,t)}}}function wt(t){let e,s,o=t[1].commonActions.updatePassword+"";return{c(){e=f("span"),s=v(o),$(e,"text-transform","none"),$(e,"font-size","1.1em")},m(t,o){a(t,e,o),p(e,s)},p(t,e){2&e&&o!==(o=t[1].commonActions.updatePassword+"")&&g(s,o)},d(t){t&&m(e)}}}function gt(t){let e,s,o,l,n,d,$,u,v,w,g,h,j;function y(e){t[20].call(null,e)}let A={label:t[1].commonActions.currentPassword};void 0!==t[7]&&(A.value=t[7]);const q=new Z({props:A});function k(e){t[21].call(null,e)}I.push(()=>F(q,"value",y));let D={label:t[1].commonActions.newPassword};void 0!==t[8]&&(D.value=t[8]);const U=new Z({props:D});function B(e){t[22].call(null,e)}I.push(()=>F(U,"value",k));let z={label:t[1].commonActions.confirmPassword};void 0!==t[9]&&(z.value=t[9]);const V=new Z({props:z});I.push(()=>F(V,"value",B));const H=new N({props:{color:"#4273e8",progress:{size:"1.5em"},raised:!0,inprogress:t[6],$$slots:{default:[wt]},$$scope:{ctx:t}}});return{c(){e=f("form"),s=f("div"),M(q.$$.fragment),l=x(),n=f("div"),M(U.$$.fragment),$=x(),u=f("div"),M(V.$$.fragment),w=x(),g=f("div"),M(H.$$.fragment),i(s,"class","field svelte-df4jox"),i(n,"class","field svelte-df4jox"),i(u,"class","field svelte-df4jox"),i(g,"class","send svelte-df4jox"),i(e,"class","password-dialog svelte-df4jox")},m(o,i,d){a(o,e,i),p(e,s),P(q,s,null),p(e,l),p(e,n),P(U,n,null),p(e,$),p(e,u),P(V,u,null),p(e,w),p(e,g),P(H,g,null),h=!0,d&&j(),j=b(e,"submit",G(t[16]))},p(t,e){const s={};2&e&&(s.label=t[1].commonActions.currentPassword),!o&&128&e&&(o=!0,s.value=t[7],C(()=>o=!1)),q.$set(s);const l={};2&e&&(l.label=t[1].commonActions.newPassword),!d&&256&e&&(d=!0,l.value=t[8],C(()=>d=!1)),U.$set(l);const i={};2&e&&(i.label=t[1].commonActions.confirmPassword),!v&&512&e&&(v=!0,i.value=t[9],C(()=>v=!1)),V.$set(i);const a={};64&e&&(a.inprogress=t[6]),16777218&e&&(a.$$scope={dirty:e,ctx:t}),H.$set(a)},i(t){h||(c(q.$$.fragment,t),c(U.$$.fragment,t),c(V.$$.fragment,t),c(H.$$.fragment,t),h=!0)},o(t){r(q.$$.fragment,t),r(U.$$.fragment,t),r(V.$$.fragment,t),r(H.$$.fragment,t),h=!1},d(t){t&&m(e),T(q),T(U),T(V),T(H),j()}}}function xt(t){let e,s,o,l,n,d,$,u,j,b,y,q,k,D,C,W,E,L,I,F,N,G,R,S,Y,Z,J,K,Q,X,_,tt,et,st,ot,lt,it,at,nt,wt,gt,xt,ht,jt,bt,yt,At,qt,kt,Dt,Ut,Mt,Pt,Ct,Tt,Bt,zt,Vt,Ht,Wt,Et,Lt,It,Ft,Nt,Gt,Rt,St,Yt,Zt,Jt,Kt,Ot,Qt,Xt,_t,te,ee,se,oe,le,ie,ae,ne,de,ce,re,me,$e,ue,pe,fe,ve,we,ge,xe,he,je,be,ye,Ae,qe,ke,De,Ue,Me,Pe,Ce,Te,Be,ze,Ve,He,We,Ee,Le,Ie,Fe,Ne,Ge,Re,Se,Ye,Ze,Je,Ke,Oe,Qe,Xe,_e,ts,es,ss,os,ls,is,as,ns,ds,cs,rs,ms,$s,us,ps,fs,vs,ws,gs,xs,hs,js,bs,ys,As,qs,ks,Ds,Us,Ms,Ps,Cs=t[0].username+"",Ts=t[0].address+"",Bs=t[1].commonActions.title+"",zs=t[1].limits.storage.title+"",Vs=Math.round(t[0].limits.quota.used/t[0].limits.quota.allowed*100)+"",Hs=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.quota.used)})+"",Ws=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.quota.allowed)})+"",Es=t[1].limits.imapDownload.title+"",Ls=t[1].limits.imapDownload.comment+"",Is=Math.round(t[0].limits.imapDownload.used/t[0].limits.imapDownload.allowed*100)+"",Fs=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.imapDownload.used)})+"",Ns=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.imapDownload.allowed)})+"",Gs=t[1].limits.imapUpload.title+"",Rs=t[1].limits.imapUpload.comment+"",Ss=Math.round(t[0].limits.imapUpload.used/t[0].limits.imapUpload.allowed*100)+"",Ys=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.imapUpload.used)})+"",Zs=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.imapUpload.allowed)})+"",Js=t[1].limits.pop3Download.title+"",Ks=t[1].limits.pop3Download.comment+"",Os=Math.round(t[0].limits.pop3Download.used/t[0].limits.pop3Download.allowed*100)+"",Qs=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.pop3Download.used)})+"",Xs=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.pop3Download.allowed)})+"",_s=t[1].limits.received.title+"",to=t[1].limits.received.comment+"",eo=Math.round(t[0].limits.received.used/t[0].limits.received.allowed*100)+"",so=t[12]("myAccount.limits.messagesUsed",{n:t[0].limits.received.used})+"",oo=t[12]("myAccount.limits.messagesTotal",{n:t[0].limits.received.allowed})+"",lo=t[1].limits.recipients.title+"",io=t[1].limits.recipients.comment+"",ao=Math.round(t[0].limits.recipients.used/t[0].limits.recipients.allowed*100)+"",no=t[12]("myAccount.limits.messagesUsed",{n:t[0].limits.recipients.used})+"",co=t[12]("myAccount.limits.messagesTotal",{n:t[0].limits.recipients.allowed})+"",ro=t[1].limits.forwards.title+"",mo=t[1].limits.forwards.comment+"",$o=t[12]("myAccount.limits.messagesUsed",{n:t[0].limits.forwards.used})+"",uo=t[12]("myAccount.limits.messagesTotal",{n:t[0].limits.forwards.allowed})+"";const po=new U({props:{$$slots:{default:[dt]},$$scope:{ctx:t}}}),fo=new O({props:{$$slots:{default:[ct]},$$scope:{ctx:t}}}),vo=new O({props:{$$slots:{default:[rt]},$$scope:{ctx:t}}}),wo=new O({props:{$$slots:{default:[mt]},$$scope:{ctx:t}}}),go=new O({props:{$$slots:{default:[$t]},$$scope:{ctx:t}}}),xo=new O({props:{$$slots:{default:[ut]},$$scope:{ctx:t}}}),ho=new O({props:{$$slots:{default:[pt]},$$scope:{ctx:t}}}),jo=new O({props:{$$slots:{default:[ft]},$$scope:{ctx:t}}});let bo=t[5]&&vt(t);return{c(){e=f("x-account"),s=f("div"),o=f("div"),l=v(t[11]),n=x(),d=f("div"),$=f("div"),u=v(t[10]),j=x(),b=f("div"),y=v(Cs),q=x(),k=f("div"),D=v(Ts),C=x(),W=f("div"),E=f("div"),L=f("div"),I=f("div"),F=v(Bs),N=x(),G=f("div"),M(po.$$.fragment),R=x(),S=f("div"),Y=f("div"),Z=v(zs),J=x(),K=f("div"),M(fo.$$.fragment),Q=x(),X=f("div"),_=f("div"),tt=v(Vs),et=v("%"),st=x(),ot=f("div"),lt=v(Hs),it=x(),at=f("div"),nt=v(Ws),wt=x(),gt=f("div"),xt=f("div"),ht=v(Es),jt=x(),bt=f("span"),yt=v(Ls),At=x(),qt=f("div"),M(vo.$$.fragment),kt=x(),Dt=f("div"),Ut=f("div"),Mt=v(Is),Pt=v("%"),Ct=x(),Tt=f("div"),Bt=v(Fs),zt=x(),Vt=f("div"),Ht=v(Ns),Wt=x(),Et=f("div"),Lt=f("div"),It=v(Gs),Ft=x(),Nt=f("span"),Gt=v(Rs),Rt=x(),St=f("div"),M(wo.$$.fragment),Yt=x(),Zt=f("div"),Jt=f("div"),Kt=v(Ss),Ot=v("%"),Qt=x(),Xt=f("div"),_t=v(Ys),te=x(),ee=f("div"),se=v(Zs),oe=x(),le=f("div"),ie=f("div"),ae=v(Js),ne=x(),de=f("span"),ce=v(Ks),re=x(),me=f("div"),M(go.$$.fragment),$e=x(),ue=f("div"),pe=f("div"),fe=v(Os),ve=v("%"),we=x(),ge=f("div"),xe=v(Qs),he=x(),je=f("div"),be=v(Xs),ye=x(),Ae=f("div"),qe=f("div"),ke=v(_s),De=x(),Ue=f("span"),Me=v(to),Pe=x(),Ce=f("div"),M(xo.$$.fragment),Te=x(),Be=f("div"),ze=f("div"),Ve=v(eo),He=v("%"),We=x(),Ee=f("div"),Le=v(so),Ie=x(),Fe=f("div"),Ne=v(oo),Ge=x(),Re=f("div"),Se=f("div"),Ye=v(lo),Ze=x(),Je=f("span"),Ke=v(io),Oe=x(),Qe=f("div"),M(ho.$$.fragment),Xe=x(),_e=f("div"),ts=f("div"),es=v(ao),ss=v("%"),os=x(),ls=f("div"),is=v(no),as=x(),ns=f("div"),ds=v(co),cs=x(),rs=f("div"),ms=f("div"),$s=v(ro),us=x(),ps=f("span"),fs=v(mo),vs=x(),ws=f("div"),M(jo.$$.fragment),gs=x(),xs=f("div"),hs=f("div"),js=v($o),bs=x(),ys=f("div"),As=v(uo),qs=x(),ks=f("div"),Us=x(),bo&&bo.c(),Ms=B(),i(o,"class","letter svelte-df4jox"),i($,"class","name svelte-df4jox"),i(b,"class","username svelte-df4jox"),i(k,"class","address svelte-df4jox"),i(d,"class","end svelte-df4jox"),i(s,"class","main svelte-df4jox"),i(I,"class","box-title svelte-df4jox"),i(G,"class","box-content"),i(L,"class","box common-actions svelte-df4jox"),i(Y,"class","box-title svelte-df4jox"),i(_,"class","percent svelte-df4jox"),i(ot,"class","used svelte-df4jox"),i(at,"class","total svelte-df4jox"),i(X,"class","quota-desc svelte-df4jox"),i(K,"class","quota-body svelte-df4jox"),i(S,"class","box quota storage-quota svelte-df4jox"),i(bt,"class","comment svelte-df4jox"),i(xt,"class","box-title svelte-df4jox"),i(Ut,"class","percent svelte-df4jox"),i(Tt,"class","used svelte-df4jox"),i(Vt,"class","total svelte-df4jox"),i(Dt,"class","quota-desc svelte-df4jox"),i(qt,"class","quota-body svelte-df4jox"),i(gt,"class","box quota imap-download-quota svelte-df4jox"),i(Nt,"class","comment svelte-df4jox"),i(Lt,"class","box-title svelte-df4jox"),i(Jt,"class","percent svelte-df4jox"),i(Xt,"class","used svelte-df4jox"),i(ee,"class","total svelte-df4jox"),i(Zt,"class","quota-desc svelte-df4jox"),i(St,"class","quota-body svelte-df4jox"),i(Et,"class","box quota imap-upload-quota svelte-df4jox"),i(de,"class","comment svelte-df4jox"),i(ie,"class","box-title svelte-df4jox"),i(pe,"class","percent svelte-df4jox"),i(ge,"class","used svelte-df4jox"),i(je,"class","total svelte-df4jox"),i(ue,"class","quota-desc svelte-df4jox"),i(me,"class","quota-body svelte-df4jox"),i(le,"class","box quota pop3-download-quota svelte-df4jox"),i(Ue,"class","comment svelte-df4jox"),i(qe,"class","box-title svelte-df4jox"),i(ze,"class","percent svelte-df4jox"),i(Ee,"class","used svelte-df4jox"),i(Fe,"class","total svelte-df4jox"),i(Be,"class","quota-desc svelte-df4jox"),i(Ce,"class","quota-body svelte-df4jox"),i(Ae,"class","box quota received-quota svelte-df4jox"),i(Je,"class","comment svelte-df4jox"),i(Se,"class","box-title svelte-df4jox"),i(ts,"class","percent svelte-df4jox"),i(ls,"class","used svelte-df4jox"),i(ns,"class","total svelte-df4jox"),i(_e,"class","quota-desc svelte-df4jox"),i(Qe,"class","quota-body svelte-df4jox"),i(Re,"class","box quota recipients-quota svelte-df4jox"),i(ps,"class","comment svelte-df4jox"),i(ms,"class","box-title svelte-df4jox"),i(hs,"class","used svelte-df4jox"),i(ys,"class","total svelte-df4jox"),i(xs,"class","quota-desc svelte-df4jox"),i(ws,"class","quota-body svelte-df4jox"),i(rs,"class","box quota forwards-quota svelte-df4jox"),i(E,"class","col col-1 svelte-df4jox"),i(W,"class","cols svelte-df4jox"),i(ks,"class","bottom-space svelte-df4jox"),w(e,"class","svelte-df4jox"),A(()=>t[19].call(e)),h(e,"narrow",t[3]),h(e,"wide",t[4])},m(i,c){a(i,e,c),p(e,s),p(s,o),p(o,l),p(s,n),p(s,d),p(d,$),p($,u),p(d,j),p(d,b),p(b,y),p(d,q),p(d,k),p(k,D),p(e,C),p(e,W),p(W,E),p(E,L),p(L,I),p(I,F),p(L,N),p(L,G),P(po,G,null),p(E,R),p(E,S),p(S,Y),p(Y,Z),p(S,J),p(S,K),P(fo,K,null),p(K,Q),p(K,X),p(X,_),p(_,tt),p(_,et),p(X,st),p(X,ot),p(ot,lt),p(X,it),p(X,at),p(at,nt),p(E,wt),p(E,gt),p(gt,xt),p(xt,ht),p(xt,jt),p(xt,bt),p(bt,yt),p(gt,At),p(gt,qt),P(vo,qt,null),p(qt,kt),p(qt,Dt),p(Dt,Ut),p(Ut,Mt),p(Ut,Pt),p(Dt,Ct),p(Dt,Tt),p(Tt,Bt),p(Dt,zt),p(Dt,Vt),p(Vt,Ht),p(E,Wt),p(E,Et),p(Et,Lt),p(Lt,It),p(Lt,Ft),p(Lt,Nt),p(Nt,Gt),p(Et,Rt),p(Et,St),P(wo,St,null),p(St,Yt),p(St,Zt),p(Zt,Jt),p(Jt,Kt),p(Jt,Ot),p(Zt,Qt),p(Zt,Xt),p(Xt,_t),p(Zt,te),p(Zt,ee),p(ee,se),p(E,oe),p(E,le),p(le,ie),p(ie,ae),p(ie,ne),p(ie,de),p(de,ce),p(le,re),p(le,me),P(go,me,null),p(me,$e),p(me,ue),p(ue,pe),p(pe,fe),p(pe,ve),p(ue,we),p(ue,ge),p(ge,xe),p(ue,he),p(ue,je),p(je,be),p(E,ye),p(E,Ae),p(Ae,qe),p(qe,ke),p(qe,De),p(qe,Ue),p(Ue,Me),p(Ae,Pe),p(Ae,Ce),P(xo,Ce,null),p(Ce,Te),p(Ce,Be),p(Be,ze),p(ze,Ve),p(ze,He),p(Be,We),p(Be,Ee),p(Ee,Le),p(Be,Ie),p(Be,Fe),p(Fe,Ne),p(E,Ge),p(E,Re),p(Re,Se),p(Se,Ye),p(Se,Ze),p(Se,Je),p(Je,Ke),p(Re,Oe),p(Re,Qe),P(ho,Qe,null),p(Qe,Xe),p(Qe,_e),p(_e,ts),p(ts,es),p(ts,ss),p(_e,os),p(_e,ls),p(ls,is),p(_e,as),p(_e,ns),p(ns,ds),p(E,cs),p(E,rs),p(rs,ms),p(ms,$s),p(ms,us),p(ms,ps),p(ps,fs),p(rs,vs),p(rs,ws),P(jo,ws,null),p(ws,gs),p(ws,xs),p(xs,hs),p(hs,js),p(xs,bs),p(xs,ys),p(ys,As),p(e,qs),p(e,ks),Ds=z(e,t[19].bind(e)),a(i,Us,c),bo&&bo.m(i,c),a(i,Ms,c),Ps=!0},p(t,[s]){(!Ps||2048&s)&&g(l,t[11]),(!Ps||1024&s)&&g(u,t[10]),(!Ps||1&s)&&Cs!==(Cs=t[0].username+"")&&g(y,Cs),(!Ps||1&s)&&Ts!==(Ts=t[0].address+"")&&g(D,Ts),(!Ps||2&s)&&Bs!==(Bs=t[1].commonActions.title+"")&&g(F,Bs);const o={};16777250&s&&(o.$$scope={dirty:s,ctx:t}),po.$set(o),(!Ps||2&s)&&zs!==(zs=t[1].limits.storage.title+"")&&g(Z,zs);const i={};16777217&s&&(i.$$scope={dirty:s,ctx:t}),fo.$set(i),(!Ps||1&s)&&Vs!==(Vs=Math.round(t[0].limits.quota.used/t[0].limits.quota.allowed*100)+"")&&g(tt,Vs),(!Ps||4097&s)&&Hs!==(Hs=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.quota.used)})+"")&&g(lt,Hs),(!Ps||4097&s)&&Ws!==(Ws=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.quota.allowed)})+"")&&g(nt,Ws),(!Ps||2&s)&&Es!==(Es=t[1].limits.imapDownload.title+"")&&g(ht,Es),(!Ps||2&s)&&Ls!==(Ls=t[1].limits.imapDownload.comment+"")&&g(yt,Ls);const a={};16777217&s&&(a.$$scope={dirty:s,ctx:t}),vo.$set(a),(!Ps||1&s)&&Is!==(Is=Math.round(t[0].limits.imapDownload.used/t[0].limits.imapDownload.allowed*100)+"")&&g(Mt,Is),(!Ps||4097&s)&&Fs!==(Fs=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.imapDownload.used)})+"")&&g(Bt,Fs),(!Ps||4097&s)&&Ns!==(Ns=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.imapDownload.allowed)})+"")&&g(Ht,Ns),(!Ps||2&s)&&Gs!==(Gs=t[1].limits.imapUpload.title+"")&&g(It,Gs),(!Ps||2&s)&&Rs!==(Rs=t[1].limits.imapUpload.comment+"")&&g(Gt,Rs);const n={};16777217&s&&(n.$$scope={dirty:s,ctx:t}),wo.$set(n),(!Ps||1&s)&&Ss!==(Ss=Math.round(t[0].limits.imapUpload.used/t[0].limits.imapUpload.allowed*100)+"")&&g(Kt,Ss),(!Ps||4097&s)&&Ys!==(Ys=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.imapUpload.used)})+"")&&g(_t,Ys),(!Ps||4097&s)&&Zs!==(Zs=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.imapUpload.allowed)})+"")&&g(se,Zs),(!Ps||2&s)&&Js!==(Js=t[1].limits.pop3Download.title+"")&&g(ae,Js),(!Ps||2&s)&&Ks!==(Ks=t[1].limits.pop3Download.comment+"")&&g(ce,Ks);const d={};16777217&s&&(d.$$scope={dirty:s,ctx:t}),go.$set(d),(!Ps||1&s)&&Os!==(Os=Math.round(t[0].limits.pop3Download.used/t[0].limits.pop3Download.allowed*100)+"")&&g(fe,Os),(!Ps||4097&s)&&Qs!==(Qs=t[12]("myAccount.limits.gbUsed",{gb:t[15](t[0].limits.pop3Download.used)})+"")&&g(xe,Qs),(!Ps||4097&s)&&Xs!==(Xs=t[12]("myAccount.limits.gbTotal",{gb:t[15](t[0].limits.pop3Download.allowed)})+"")&&g(be,Xs),(!Ps||2&s)&&_s!==(_s=t[1].limits.received.title+"")&&g(ke,_s),(!Ps||2&s)&&to!==(to=t[1].limits.received.comment+"")&&g(Me,to);const m={};16777217&s&&(m.$$scope={dirty:s,ctx:t}),xo.$set(m),(!Ps||1&s)&&eo!==(eo=Math.round(t[0].limits.received.used/t[0].limits.received.allowed*100)+"")&&g(Ve,eo),(!Ps||4097&s)&&so!==(so=t[12]("myAccount.limits.messagesUsed",{n:t[0].limits.received.used})+"")&&g(Le,so),(!Ps||4097&s)&&oo!==(oo=t[12]("myAccount.limits.messagesTotal",{n:t[0].limits.received.allowed})+"")&&g(Ne,oo),(!Ps||2&s)&&lo!==(lo=t[1].limits.recipients.title+"")&&g(Ye,lo),(!Ps||2&s)&&io!==(io=t[1].limits.recipients.comment+"")&&g(Ke,io);const $={};16777217&s&&($.$$scope={dirty:s,ctx:t}),ho.$set($),(!Ps||1&s)&&ao!==(ao=Math.round(t[0].limits.recipients.used/t[0].limits.recipients.allowed*100)+"")&&g(es,ao),(!Ps||4097&s)&&no!==(no=t[12]("myAccount.limits.messagesUsed",{n:t[0].limits.recipients.used})+"")&&g(is,no),(!Ps||4097&s)&&co!==(co=t[12]("myAccount.limits.messagesTotal",{n:t[0].limits.recipients.allowed})+"")&&g(ds,co),(!Ps||2&s)&&ro!==(ro=t[1].limits.forwards.title+"")&&g($s,ro),(!Ps||2&s)&&mo!==(mo=t[1].limits.forwards.comment+"")&&g(fs,mo);const p={};16777217&s&&(p.$$scope={dirty:s,ctx:t}),jo.$set(p),(!Ps||4097&s)&&$o!==($o=t[12]("myAccount.limits.messagesUsed",{n:t[0].limits.forwards.used})+"")&&g(js,$o),(!Ps||4097&s)&&uo!==(uo=t[12]("myAccount.limits.messagesTotal",{n:t[0].limits.forwards.allowed})+"")&&g(As,uo),8&s&&h(e,"narrow",t[3]),16&s&&h(e,"wide",t[4]),t[5]?bo?(bo.p(t,s),32&s&&c(bo,1)):(bo=vt(t),bo.c(),c(bo,1),bo.m(Ms.parentNode,Ms)):bo&&(V(),r(bo,1,1,()=>{bo=null}),H())},i(t){Ps||(c(po.$$.fragment,t),c(fo.$$.fragment,t),c(vo.$$.fragment,t),c(wo.$$.fragment,t),c(go.$$.fragment,t),c(xo.$$.fragment,t),c(ho.$$.fragment,t),c(jo.$$.fragment,t),c(bo),Ps=!0)},o(t){r(po.$$.fragment,t),r(fo.$$.fragment,t),r(vo.$$.fragment,t),r(wo.$$.fragment,t),r(go.$$.fragment,t),r(xo.$$.fragment,t),r(ho.$$.fragment,t),r(jo.$$.fragment,t),r(bo),Ps=!1},d(t){t&&m(e),T(po),T(fo),T(vo),T(wo),T(go),T(xo),T(ho),T(jo),Ds(),t&&m(Us),bo&&bo.d(t),t&&m(Ms)}}}function ht(t,e,s){let o,l,{user:i}=e;const{locale:a,trans:n}=W("app");E(t,a,t=>s(17,o=t)),E(t,n,t=>s(12,l=t));let{locale:d=o.myAccount}=e;console.log(i);let c,r,m=0;let $=!1,u=!1,p="",f="",v="";let w,g;return t.$set=t=>{"user"in t&&s(0,i=t.user),"locale"in t&&s(1,d=t.locale)},t.$$.update=()=>{1&t.$$.dirty&&s(10,w=i.name||"Unnamed"),1024&t.$$.dirty&&s(11,g=w[0]||""),4&t.$$.dirty&&s(3,c=m<900),8&t.$$.dirty&&s(4,r=!c)},[i,d,m,c,r,$,u,p,f,v,w,g,l,a,n,t=>(t/1024**3).toFixed(2),async()=>{if(!u){s(6,u=!0);try{if(f.length<6)throw new Error("Password must have 6 characters or more");if(f!==v)throw new Error("Passwords does not match");await R("/users/me",{existingPassword:p,password:f}),s(7,p=""),s(8,f=""),s(9,v=""),S().add({variant:"normal",text:"Password updated"}),s(5,$=!1)}catch(t){S().add({variant:"error",text:t.message})}finally{s(6,u=!1)}}},o,()=>s(5,$=!0),function(){m=this.clientWidth,s(2,m)},function(t){p=t,s(7,p)},function(t){f=t,s(8,f)},function(t){v=t,s(9,v)},function(t){$=t,s(5,$)}]}class jt extends t{constructor(t){super(),e(this,t,ht,xt,s,{user:0,locale:1})}}function bt(t){let e,s,o;document.title=e=t[0].myAccount.title;const l=new jt({props:{user:t[1]}});return{c(){s=x(),M(l.$$.fragment)},m(t,e){a(t,s,e),P(l,t,e),o=!0},p(t,[s]){(!o||1&s)&&e!==(e=t[0].myAccount.title)&&(document.title=e);const i={};2&s&&(i.user=t[1]),l.$set(i)},i(t){o||(c(l.$$.fragment,t),o=!0)},o(t){r(l.$$.fragment,t),o=!1},d(t){t&&m(s),T(l,t)}}}async function yt(t,{client:e}){if(!Y.get())return this.redirect("#!/login")}function At(t,e,s){let o,l;E(t,Y,t=>s(1,l=t));const{locale:i}=W("app");return E(t,i,t=>s(0,o=t)),[o,l,i]}export default class extends t{constructor(t){super(),e(this,t,At,bt,s,{})}}export{yt as preload};
//# sourceMappingURL=Account-e5362047.js.map
