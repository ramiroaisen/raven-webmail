import dompurify from "dompurify";
export const sanitize = (html) => {
    const fragment = dompurify.sanitize(html, { RETURN_DOM_FRAGMENT: true });
    [].forEach.call(fragment.querySelectorAll("a[href]"), (a) => {
        a.setAttribute("rel", "nofollow noopener");
        a.setAttribute("target", "_blank");
    });
    const helper = [].map.call(fragment.childNodes, ((node) => {
        if (node instanceof Element) {
            return node.outerHTML;
        }
        else {
            return node.textContent;
        }
    })).join("");
    return helper;
};
