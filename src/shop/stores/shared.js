export function getSharedStore(name, store) {
    if (existsSharedStore(name)) {
        return window.sharedStores[name];
    }
    window.sharedStores[name] = store;
    return store;
}
export function setSharedStore(name, store) {
    initSharedStores();
    window.sharedStores[name] = store;
    return store;
}
export function existsSharedStore(name) {
    initSharedStores();
    return !!window.sharedStores[name];
}
function initSharedStores() {
    if (!window.sharedStores) {
        window.sharedStores = {};
    }
}
