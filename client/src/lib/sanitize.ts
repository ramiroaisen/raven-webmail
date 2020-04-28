import dompurify from "dompurify";
export const sanitize = (html: string): string => {
  const fragment = dompurify.sanitize(html, {RETURN_DOM_FRAGMENT: true});
  [].forEach.call(fragment.querySelectorAll("a[href]"), (a: HTMLAnchorElement) => {
    a.setAttribute("rel", "nofollow noopener");
    a.setAttribute("target", "_blank")
  });

  const helper = [].map.call(fragment.childNodes, ((node: Node) => {
    if(node instanceof Element) {
      return node.outerHTML;
    } else {
      return node.textContent;
    }
  })).join("")

  return helper;
}
