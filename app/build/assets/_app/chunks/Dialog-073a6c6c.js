import{S as s,i as a,s as t,e as n,t as l,c as e,a as i,g as c,d,b as o,f as r,H as u,h as p,a8 as h,k as f,n as v,ax as $,I as m,U as w,a3 as g,a9 as j,aa as x,ab as y,x as I,K as k,L as D,aK as E,u as z,N as C,A as V}from"./vendor-dd04488f.js";import{a as b}from"./MenuItem-338ffe8c.js";function K(s){let a,t;return{c(){a=n("div"),t=l(s[0]),this.h()},l(n){a=e(n,"DIV",{class:!0});var l=i(a);t=c(l,s[0]),l.forEach(d),this.h()},h(){o(a,"class","title svelte-1fzj5s2")},m(s,n){r(s,a,n),u(a,t)},p(s,a){1&a&&p(t,s[0])},d(s){s&&d(a)}}}function A(s){let a,t,l,c,p,V,b,A,L,M=s[0]&&K(s);const N=s[6].default,S=h(N,s,s[5],null);return{c(){a=n("div"),t=n("div"),M&&M.c(),l=f(),c=n("div"),S&&S.c(),this.h()},l(s){a=e(s,"DIV",{class:!0});var n=i(a);t=e(n,"DIV",{class:!0,style:!0});var o=i(t);M&&M.l(o),l=v(o),c=e(o,"DIV",{class:!0});var r=i(c);S&&S.l(r),r.forEach(d),o.forEach(d),n.forEach(d),this.h()},h(){o(c,"class","content svelte-1fzj5s2"),o(t,"class","dialog elev3 svelte-1fzj5s2"),$(t,"--width",s[1]),$(t,"--padding",s[2]),o(a,"class","overlay svelte-1fzj5s2")},m(n,e){r(n,a,e),u(a,t),M&&M.m(t,null),u(t,l),u(t,c),S&&S.m(c,null),b=!0,A||(L=[m(t,"click",w(H)),m(a,"click",(function(){g(s[3])&&s[3].apply(this,arguments)}))],A=!0)},p(a,[n]){(s=a)[0]?M?M.p(s,n):(M=K(s),M.c(),M.m(t,l)):M&&(M.d(1),M=null),S&&S.p&&(!b||32&n)&&j(S,N,s,s[5],b?y(N,s[5],n,null):x(s[5]),null),(!b||2&n)&&$(t,"--width",s[1]),(!b||4&n)&&$(t,"--padding",s[2])},i(n){b||(I(S,n),n&&k((()=>{p||(p=D(t,s[4],{},!0)),p.run(1)})),n&&k((()=>{V||(V=D(a,E,{duration:200},!0)),V.run(1)})),b=!0)},o(n){z(S,n),n&&(p||(p=D(t,s[4],{},!1)),p.run(0)),n&&(V||(V=D(a,E,{duration:200},!1)),V.run(0)),b=!1},d(s){s&&d(a),M&&M.d(),S&&S.d(s),s&&p&&p.end(),s&&V&&V.end(),A=!1,C(L)}}}const H=()=>{};function L(s,a,t){let{$$slots:n={},$$scope:l}=a,{title:e}=a,{width:i="800px"}=a,{padding:c="1.5rem"}=a,{onClose:d=(()=>{})}=a;V((()=>b(window,"keydown",(s=>{"Escape"===s.key&&d()}),{capture:!0})));return s.$$set=s=>{"title"in s&&t(0,e=s.title),"width"in s&&t(1,i=s.width),"padding"in s&&t(2,c=s.padding),"onClose"in s&&t(3,d=s.onClose),"$$scope"in s&&t(5,l=s.$$scope)},[e,i,c,d,(s,a={})=>({duration:150,css:(s,a)=>`transform: translateY(${100*a}px) scale(${.5+.5*s}); opacity: ${s}`}),l,n]}class M extends s{constructor(s){super(),a(this,s,L,A,t,{title:0,width:1,padding:2,onClose:3})}}export{M as D};
