export function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === false || value === null)
            continue;
        if (key === "class")
            node.className = String(value);
        else if (value === true)
            node.setAttribute(key, "");
        else
            node.setAttribute(key, String(value));
    }
    for (const child of children) {
        if (child === undefined || child === null || child === false)
            continue;
        node.append(child instanceof Node ? child : document.createTextNode(child));
    }
    return node;
}
export function html(markup) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = markup;
    return wrapper;
}
export function mount(root, node) {
    root.innerHTML = "";
    root.append(node);
}
export function $(selector, root = document) {
    return root.querySelector(selector);
}
export function $all(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
}
