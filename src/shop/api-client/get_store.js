export function get_store(store_key) {
    if (store_key) {
        return store_key;
    }
    if (!document?.querySelector || !document.querySelector('html').dataset.storeKey) {
        return undefined;
    }
    return document.querySelector('html').dataset.storeKey;
}
