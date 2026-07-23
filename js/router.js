const routes = [];
let notFoundHandler = () => { };
function compile(path) {
    const keys = [];
    const pattern = path
        .split("/")
        .map((segment) => {
        if (segment.startsWith(":")) {
            keys.push(segment.slice(1));
            return "([^/]+)";
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
        .join("/");
    return { pattern: new RegExp(`^${pattern}$`), keys };
}
export function route(path, handler) {
    const { pattern, keys } = compile(path);
    routes.push({ pattern, keys, handler });
}
export function notFound(handler) {
    notFoundHandler = handler;
}
function resolve() {
    const hash = location.hash.slice(1) || "/";
    for (const r of routes) {
        const match = hash.match(r.pattern);
        if (match) {
            const params = {};
            r.keys.forEach((key, i) => (params[key] = decodeURIComponent(match[i + 1])));
            r.handler(params);
            window.scrollTo(0, 0);
            return;
        }
    }
    notFoundHandler({});
    window.scrollTo(0, 0);
}
export function startRouter() {
    window.addEventListener("hashchange", resolve);
    resolve();
}
