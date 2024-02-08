import { context } from '@src/wyvr/context.js';

export function get_store(store_key) {
    if (store_key) {
        return store_key;
    }
    const ctx = context();
    if (!ctx?.document?.querySelector || !ctx.document.querySelector('html').dataset.storeKey) {
        return undefined;
    }
    return ctx.document.querySelector('html').dataset.storeKey;
}
