import{aA as s,S as e,a as r,s as t,k as a,E as n,d as i,e as u,F as o,n as f,f as c}from"./main-9f15064e.js";function l(s){let e,r,t=JSON.stringify(s[0],null,2)+"";return{c(){e=a("pre"),r=n(t)},m(s,t){i(s,e,t),u(e,r)},p(s,[e]){1&e&&t!==(t=JSON.stringify(s[0],null,2)+"")&&o(r,t)},i:f,o:f,d(s){s&&c(e)}}}async function p(e,r){return{res:await s("/users/me/storage")}}function m(s,e,r){let{res:t}=e;return s.$set=s=>{"res"in s&&r(0,t=s.res)},[t]}export default class extends e{constructor(s){super(),r(this,s,m,l,t,{res:0})}}export{p as preload};
//# sourceMappingURL=Storage-9d12f2ab.js.map
