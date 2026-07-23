type Attrs = Record<string, string | number | boolean | undefined>;
type Child = Node | string | undefined | null | false;

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  children: Child[] = []
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false || value === null) continue;
    if (key === "class") node.className = String(value);
    else if (value === true) node.setAttribute(key, "");
    else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child === undefined || child === null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(child));
  }
  return node;
}

export function html(markup: string): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = markup;
  return wrapper;
}

export function mount(root: Element, node: Node): void {
  root.innerHTML = "";
  root.append(node);
}

export function $(selector: string, root: ParentNode = document): Element | null {
  return root.querySelector(selector);
}

export function $all(selector: string, root: ParentNode = document): Element[] {
  return Array.from(root.querySelectorAll(selector));
}
