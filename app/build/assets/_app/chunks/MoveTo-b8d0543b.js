import{S as t,i as e,s as n,e as s,j as a,k as o,c as r,a as l,m as i,n as $,d as c,b as f,G as d,f as m,H as p,o as u,I as g,J as h,Q as v,a3 as x,x as b,u as M,v as y,N as j,l as w,r as I,w as k,E as D,O as E,b1 as N,F as V,P,aD as R,t as _,g as B,h as F}from"./vendor-dd04488f.js";import{P as G,M as H}from"./compose-7c960461.js";import{u as J,e as O,t as Q,v as S,a as U,m as q}from"./util-b32c90e7.js";import{R as z}from"./Ripple-5f31ea97.js";import{t as A,M as C}from"./MenuItem-338ffe8c.js";import{l as K}from"./locale-5d944b89.js";function L(t,e,n){const s=t.slice();return s[2]=e[n],s}function T(t){let e,n,w,I,k,D,E,R,_,B,F,H,J;function O(e){t[13](e)}w=new N({});let Q={anchor:"top-left",$$slots:{default:[Z]},$$scope:{ctx:t}};return void 0!==t[0]&&(Q.open=t[0]),D=new G({props:Q}),V.push((()=>P(D,"open",O))),_=new z({}),{c(){e=s("div"),n=s("div"),a(w.$$.fragment),I=o(),k=s("div"),a(D.$$.fragment),R=o(),a(_.$$.fragment),this.h()},l(t){e=r(t,"DIV",{class:!0});var s=l(e);n=r(s,"DIV",{class:!0});var a=l(n);i(w.$$.fragment,a),I=$(a),k=r(a,"DIV",{class:!0});var o=l(k);i(D.$$.fragment,o),o.forEach(c),R=$(a),i(_.$$.fragment,a),a.forEach(c),s.forEach(c),this.h()},h(){f(k,"class","anchor svelte-4v5xs9"),f(n,"class","action btn-dark"),d(n,"hover",t[0]),f(e,"class","action-group")},m(s,a){m(s,e,a),p(e,n),u(w,n,null),p(n,I),p(n,k),u(D,k,null),p(n,R),u(_,n,null),F=!0,H||(J=[g(n,"click",t[14]),h(B=A.call(null,n,t[4].Move_to))],H=!0)},p(t,e){const s={};131082&e&&(s.$$scope={dirty:e,ctx:t}),!E&&1&e&&(E=!0,s.open=t[0],v((()=>E=!1))),D.$set(s),B&&x(B.update)&&16&e&&B.update.call(null,t[4].Move_to),1&e&&d(n,"hover",t[0])},i(t){F||(b(w.$$.fragment,t),b(D.$$.fragment,t),b(_.$$.fragment,t),F=!0)},o(t){M(w.$$.fragment,t),M(D.$$.fragment,t),M(_.$$.fragment,t),F=!1},d(t){t&&c(e),y(w),y(D),y(_),H=!1,j(J)}}}function W(t){let e,n,s=q(t[2])+"";return{c(){e=_(s),n=o()},l(t){e=B(t,s),n=$(t)},m(t,s){m(t,e,s),m(t,n,s)},p(t,n){8&n&&s!==(s=q(t[2])+"")&&F(e,s)},d(t){t&&c(e),t&&c(n)}}}function X(t){let e,n;return e=new C({props:{icon:U(t[2]),$$slots:{default:[W]},$$scope:{ctx:t}}}),e.$on("click",(function(){return t[12](t[2])})),{c(){a(e.$$.fragment)},l(t){i(e.$$.fragment,t)},m(t,s){u(e,t,s),n=!0},p(n,s){t=n;const a={};8&s&&(a.icon=U(t[2])),131080&s&&(a.$$scope={dirty:s,ctx:t}),e.$set(a)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){M(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function Y(t){let e,n,s=t[3],a=[];for(let r=0;r<s.length;r+=1)a[r]=X(L(t,s,r));const o=t=>M(a[t],1,1,(()=>{a[t]=null}));return{c(){for(let t=0;t<a.length;t+=1)a[t].c();e=w()},l(t){for(let e=0;e<a.length;e+=1)a[e].l(t);e=w()},m(t,s){for(let e=0;e<a.length;e+=1)a[e].m(t,s);m(t,e,s),n=!0},p(t,n){if(10&n){let r;for(s=t[3],r=0;r<s.length;r+=1){const o=L(t,s,r);a[r]?(a[r].p(o,n),b(a[r],1)):(a[r]=X(o),a[r].c(),b(a[r],1),a[r].m(e.parentNode,e))}for(I(),r=s.length;r<a.length;r+=1)o(r);k()}},i(t){if(!n){for(let t=0;t<s.length;t+=1)b(a[t]);n=!0}},o(t){a=a.filter(Boolean);for(let e=0;e<a.length;e+=1)M(a[e]);n=!1},d(t){R(a,t),t&&c(e)}}}function Z(t){let e,n;return e=new H({props:{$$slots:{default:[Y]},$$scope:{ctx:t}}}),{c(){a(e.$$.fragment)},l(t){i(e.$$.fragment,t)},m(t,s){u(e,t,s),n=!0},p(t,n){const s={};131082&n&&(s.$$scope={dirty:n,ctx:t}),e.$set(s)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){M(e.$$.fragment,t),n=!1},d(t){y(e,t)}}}function tt(t){let e,n,s=t[3].length&&T(t);return{c(){s&&s.c(),e=w()},l(t){s&&s.l(t),e=w()},m(t,a){s&&s.m(t,a),m(t,e,a),n=!0},p(t,[n]){t[3].length?s?(s.p(t,n),8&n&&b(s,1)):(s=T(t),s.c(),b(s,1),s.m(e.parentNode,e)):s&&(I(),M(s,1,1,(()=>{s=null})),k())},i(t){n||(b(s),n=!0)},o(t){M(s),n=!1},d(t){s&&s.d(t),t&&c(e)}}}function et(t,e,n){let s,a,o,r,l,i,$;D(t,K,(t=>n(4,$=t)));let{mailbox:c}=e,{onMove:f=(()=>{})}=e,{open:d=!1}=e;const{mailboxes:m}=E("dash");D(t,m,(t=>n(11,i=t)));let p=[];return t.$$set=t=>{"mailbox"in t&&n(2,c=t.mailbox),"onMove"in t&&n(1,f=t.onMove),"open"in t&&n(0,d=t.open)},t.$$.update=()=>{2048&t.$$.dirty&&n(9,s=i.find(J)),2048&t.$$.dirty&&n(6,a=i.find(O)),2048&t.$$.dirty&&n(7,o=i.find(Q)),2048&t.$$.dirty&&n(10,r=i.find(S)),2560&t.$$.dirty&&n(8,l=i.filter((t=>t!==s&&null==t.specialUse))),1988&t.$$.dirty&&(c.id===s.id?n(3,p=[...l,o,a]):c.id===a.id?n(3,p=[s,...l,o]):c.id===o.id?n(3,p=[s,...l,a]):c.id===r.id?n(3,p=[a]):l.some((t=>t.id===c.id))&&n(3,p=[s,...l.filter((t=>t.id!==c.id)),o,a]))},[d,f,c,p,$,m,a,o,l,s,r,i,t=>f(t),function(t){d=t,n(0,d)},()=>n(0,d=!d)]}class nt extends t{constructor(t){super(),e(this,t,et,tt,n,{mailbox:2,onMove:1,open:0})}}export{nt as M};
