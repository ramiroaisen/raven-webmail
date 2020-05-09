import { registerPreventer } from "./router/router";
import { once, sleep } from "./util";
let _id = 0;
const uid = () => ++_id;
export const onceBackButton = (fn) => {
    const fno = once(fn);
    const id = uid();
    const unregister = registerPreventer(() => false);
    const remove = () => {
        window.removeEventListener("hashchange", listener);
        unregister();
    };
    const listener = () => {
        fno();
        sleep(25).then(remove);
    };
    location.hash = location.hash + "#" + id;
    sleep(25).then(() => {
        ;
        window.addEventListener("hashchange", listener);
    });
    return remove;
};
