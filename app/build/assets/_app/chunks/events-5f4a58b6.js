const t=()=>{let t=0;const e=new Map;return{on:s=>{const n=++t;return e.set(n,s),()=>{e.delete(n)}},dispatch:t=>{for(const s of e.values())s(t)}}},e=t(),s=t(),n=t();export{e as C,s as E,n as a};
