import{ax as s,S as e,a as r,s as t,e as a,g as n,c as i,h as u,j as o,n as c,d as l}from"./main-8980eb9c.js";function f(s){let e,r,t=JSON.stringify(s[0],null,2)+"";return{c(){e=a("pre"),r=n(t)},m(s,t){i(s,e,t),u(e,r)},p(s,[e]){1&e&&t!==(t=JSON.stringify(s[0],null,2)+"")&&o(r,t)},i:c,o:c,d(s){s&&l(e)}}}async function p(e,r){return{res:await s("/users/me/storage")}}function m(s,e,r){let{res:t}=e;return s.$set=s=>{"res"in s&&r(0,t=s.res)},[t]}export default class extends e{constructor(s){super(),r(this,s,m,f,t,{res:0})}}export{p as preload};
//# sourceMappingURL=Storage-6ce1e436.js.map
