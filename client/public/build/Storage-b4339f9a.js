import{aA as s,S as e,a as r,s as a,k as t,E as n,d as i,e as u,F as o,n as c,f}from"./main-4a061dee.js";function l(s){let e,r,a=JSON.stringify(s[0],null,2)+"";return{c(){e=t("pre"),r=n(a)},m(s,a){i(s,e,a),u(e,r)},p(s,[e]){1&e&&a!==(a=JSON.stringify(s[0],null,2)+"")&&o(r,a)},i:c,o:c,d(s){s&&f(e)}}}async function p(e,r){return{res:await s("/users/me/storage")}}function d(s,e,r){let{res:a}=e;return s.$set=s=>{"res"in s&&r(0,a=s.res)},[a]}export default class extends e{constructor(s){super(),r(this,s,d,l,a,{res:0})}}export{p as preload};
//# sourceMappingURL=Storage-b4339f9a.js.map
