import{S as e,i as t,s as n,e as s,c as a,a as c,d as i,b as o,f as r,D as l,A as d,ay as u,b0 as h,F as m}from"./vendor-c6674e75.js";function p(e){let t;return{c(){t=s("div"),this.h()},l(e){t=a(e,"DIV",{class:!0}),c(t).forEach(i),this.h()},h(){o(t,"class","ripple svelte-1fw2y3i")},m(n,s){r(n,t,s),e[4](t)},p:l,i:l,o:l,d(n){n&&i(t),e[4](null)}}}function v(e,t){e.style.transform=t,e.style.webkitTransform=t}function f(e,t){e.style.opacity=t.toString()}const g=function(e,t){const n=["touchcancel","mouseleave","dragstart"];let s=t.currentTarget||t.target;if(s&&!s.classList.contains("ripple")&&(s=[].find.call(s.children,(e=>e.classList.contains("ripple")))),!s)return;const a=s.dataset.event;if(a&&a!==e)return;s.dataset.event=e;const c=document.createElement("span"),{radius:i,scale:o,x:r,y:l,centerX:d,centerY:u}=((e,t)=>{const n=t.getBoundingClientRect(),s=function(e){return"TouchEvent"===e.constructor.name}(e)?e.touches[e.touches.length-1]:e,a=s.clientX-n.left,c=s.clientY-n.top;let i=0,o=.3;const r=t.dataset.center;t.dataset.circle?(o=.15,i=t.clientWidth/2,i=r?i:i+Math.sqrt((a-i)**2+(c-i)**2)/4):i=Math.sqrt(t.clientWidth**2+t.clientHeight**2)/2;const l=(t.clientWidth-2*i)/2+"px",d=(t.clientHeight-2*i)/2+"px";return{radius:i,scale:o,x:r?l:a-i+"px",y:r?d:c-i+"px",centerX:l,centerY:d}})(t,s),h=s.dataset.color,m=2*i+"px";c.className="animation",c.style.width=m,c.style.height=m,c.style.background=h,c.classList.add("animation--enter"),c.classList.add("animation--visible"),v(c,`translate(${r}, ${l}) scale3d(${o},${o},${o})`),f(c,0),c.dataset.activated=String(performance.now()),s.appendChild(c),setTimeout((()=>{c.classList.remove("animation--enter"),c.classList.add("animation--in"),v(c,`translate(${d}, ${u}) scale3d(1,1,1)`),f(c,.25)}),0);const p="mousedown"===e?"mouseup":"touchend",g=function(){document.removeEventListener(p,g),n.forEach((e=>{document.removeEventListener(e,g)}));const e=performance.now()-Number(c.dataset.activated),t=Math.max(250-e,0);setTimeout((()=>{c.classList.remove("animation--in"),c.classList.add("animation--out"),f(c,0),setTimeout((()=>{c&&s.removeChild(c),0===s.children.length&&delete s.dataset.event}),300)}),t)};document.addEventListener(p,g),n.forEach((e=>{document.addEventListener(e,g,{passive:!0})}))},y=function(e){0===e.button&&g(e.type,e)},L=function(e){if(e.changedTouches)for(let t=0;t<e.changedTouches.length;++t)g(e.type,e.changedTouches[t])};function E(e,t,n){let s,a,{center:c=!1}=t,{circle:i=!1}=t,{color:o="var(--ripple-color, currentColor)"}=t;return d((async()=>{await u();try{c&&n(0,s.dataset.center="true",s),i&&n(0,s.dataset.circle="true",s),n(0,s.dataset.color=o,s),a=s.parentElement}catch(t){}if(!a)return void console.error("Ripple: Trigger element not found.");let e=window.getComputedStyle(a);0!==e.position.length&&"static"!==e.position||(a.style.position="relative"),a.addEventListener("touchstart",L,{passive:!0}),a.addEventListener("mousedown",y,{passive:!0})})),h((()=>{a&&(a.removeEventListener("mousedown",y),a.removeEventListener("touchstart",L))})),e.$$set=e=>{"center"in e&&n(1,c=e.center),"circle"in e&&n(2,i=e.circle),"color"in e&&n(3,o=e.color)},[s,c,i,o,function(e){m[e?"unshift":"push"]((()=>{s=e,n(0,s)}))}]}class w extends e{constructor(e){super(),t(this,e,E,p,n,{center:1,circle:2,color:3})}}export{w as R};