import{S as n,i as t,s as a,e as o,t as s,c as e,a as r,g as u,d as c,f as i,H as f,D as l}from"../chunks/vendor-d7518362.js";function d(n){let t,a;return{c(){t=o("h1"),a=s("You dont have any mailbox :(")},l(n){t=e(n,"H1",{});var o=r(t);a=u(o,"You dont have any mailbox :("),o.forEach(c)},m(n,o){i(n,t,o),f(t,a)},p:l,i:l,o:l,d(n){n&&c(t)}}}var h=function(n,t,a,o){return new(a||(a=Promise))((function(s,e){function r(n){try{c(o.next(n))}catch(t){e(t)}}function u(n){try{c(o.throw(n))}catch(t){e(t)}}function c(n){var t;n.done?s(n.value):(t=n.value,t instanceof a?t:new a((function(n){n(t)}))).then(r,u)}c((o=o.apply(n,t||[])).next())}))};const v=function({stuff:n}){return h(this,void 0,void 0,(function*(){const t=n.mailboxes;return null!==t[0]?{status:302,redirect:`/mailbox/${t[0].id}`}:{}}))};class m extends n{constructor(n){super(),t(this,n,null,d,a,{})}}export{m as default,v as load};