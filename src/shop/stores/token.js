import { writable } from 'svelte/store';
import { isServer } from '@wyvr/generator';
import { load, save } from '@src/wyvr/stores/storage.js';
import { getSharedStore, setSharedStore } from '@src/wyvr/stores/shared.js';

export const token_storage_name = 'customer_token';

function createToken() {
    // token is always null on server, no token available
    if (isServer) {
        return null;
    }
    const store = getSharedStore(token_storage_name);
    if (store) {
        return store;
    }
    const current_token = load(token_storage_name, null);
    // load token from storage
    const token_store = writable(current_token);

    // notification from other tab
    window.addEventListener('storage', (e) => {
        if (e.key === token_storage_name) {
            try {
                const value = JSON.parse(e.newValue);
                token_store.set(value);
            } catch (_) {
                token_store.set(undefined);
            }
        }
    });
    // set current value of the store
    token_store.subscribe((token) => {
        save(token_storage_name, JSON.stringify(token));
    });

    return setSharedStore(token_storage_name, token_store);
}

export const token = createToken();
