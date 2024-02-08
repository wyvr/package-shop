export function getSharedStore(name, store) {
    if (existsSharedStore(name)) {
        return context().sharedStores[name];
    }
    context().sharedStores[name] = store;
    return store;
}
export function setSharedStore(name, store) {
    initSharedStores();
    context().sharedStores[name] = store;
    return store;
}
export function existsSharedStore(name) {
    initSharedStores();
    return !!context().sharedStores[name];
}
function initSharedStores() {
    if (!context().sharedStores) {
        context().sharedStores = {};
    }
}
function context() {
    // Check for 'window' in a safe way.
    if (typeof window !== 'undefined') {
        return window;
    }
    // Check for 'global' in a safe way.
    if (typeof global !== 'undefined') {
        return global;
    }
}
