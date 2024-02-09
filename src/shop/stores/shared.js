import { context } from '@src/wyvr/context.js';

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
