import{S as s,i as a,s as t,e as n,t as l,c as e,a as i,g as c,d as o,b as d,f as r,H as u,h as p,a8 as h,k as f,n as v,aw as $,I as m,U as w,a3 as g,a9 as j,aa as y,ab as I,x as k,K as x,L as D,aY as E,u as z,N as C,A as V}from"./vendor-c6674e75.js";import{a as b}from"./MenuItem-f687bcf2.js";function Y(s){let a,t;return{c(){a=n("div"),t=l(s[0]),this.h()},l(n){a=e(n,"DIV",{class:!0});var l=i(a);t=c(l,s[0]),l.forEach(o),this.h()},h(){d(a,"class","title svelte-1fzj5s2")},m(s,n){r(s,a,n),u(a,t)},p(s,a){1&a&&p(t,s[0])},d(s){s&&o(a)}}}function A(s){let a,t,l,c,p,V,b,A,K,L=s[0]&&Y(s);const M=s[6].default,N=h(M,s,s[5],null);return{c(){a=n("div"),t=n("div"),L&&L.c(),l=f(),c=n("div"),N&&N.c(),this.h()},l(s){a=e(s,"DIV",{class:!0});var n=i(a);t=e(n,"DIV",{class:!0,style:!0});var d=i(t);L&&L.l(d),l=v(d),c=e(d,"DIV",{class:!0});var r=i(c);N&&N.l(r),r.forEach(o),d.forEach(o),n.forEach(o),this.h()},h(){d(c,"class","content svelte-1fzj5s2"),d(t,"class","dialog elev3 svelte-1fzj5s2"),$(t,"--width",s[1]),$(t,"--padding",s[2]),d(a,"class","overlay svelte-1fzj5s2")},m(n,e){r(n,a,e),u(a,t),L&&L.m(t,null),u(t,l),u(t,c),N&&N.m(c,null),b=!0,A||(K=[m(t,"click",w(H)),m(a,"click",(function(){g(s[3])&&s[3].apply(this,arguments)}))],A=!0)},p(a,[n]){(s=a)[0]?L?L.p(s,n):(L=Y(s),L.c(),L.m(t,l)):L&&(L.d(1),L=null),N&&N.p&&(!b||32&n)&&j(N,M,s,s[5],b?I(M,s[5],n,null):y(s[5]),null),(!b||2&n)&&$(t,"--width",s[1]),(!b||4&n)&&$(t,"--padding",s[2])},i(n){b||(k(N,n),n&&x((()=>{p||(p=D(t,s[4],{},!0)),p.run(1)})),n&&x((()=>{V||(V=D(a,E,{duration:200},!0)),V.run(1)})),b=!0)},o(n){z(N,n),n&&(p||(p=D(t,s[4],{},!1)),p.run(0)),n&&(V||(V=D(a,E,{duration:200},!1)),V.run(0)),b=!1},d(s){s&&o(a),L&&L.d(),N&&N.d(s),s&&p&&p.end(),s&&V&&V.end(),A=!1,C(K)}}}const H=()=>{};function K(s,a,t){let{$$slots:n={},$$scope:l}=a,{title:e}=a,{width:i="800px"}=a,{padding:c="1.5rem"}=a,{onClose:o=(()=>{})}=a;V((()=>b(window,"keydown",(s=>{"Escape"===s.key&&o()}),{capture:!0})));return s.$$set=s=>{"title"in s&&t(0,e=s.title),"width"in s&&t(1,i=s.width),"padding"in s&&t(2,c=s.padding),"onClose"in s&&t(3,o=s.onClose),"$$scope"in s&&t(5,l=s.$$scope)},[e,i,c,o,(s,a={})=>({duration:150,css:(s,a)=>`transform: translateY(${100*a}px) scale(${.5+.5*s}); opacity: ${s}`}),l,n]}class L extends s{constructor(s){super(),a(this,s,K,A,t,{title:0,width:1,padding:2,onClose:3})}}export{L as D};
