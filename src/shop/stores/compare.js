import { isServer } from '@wyvr/generator';
import { writable, get } from 'svelte/store';
import { getSharedStore, setSharedStore } from '@src/wyvr/stores/shared.js';
import { load, save } from '@src/wyvr/stores/storage.js';
import is_logged_in from '@src/shop/stores/is_logged_in';
import { messages } from '@src/shop/stores/messages';
import { load_product } from '@src/shop/api-client/product/load_product';
import { get_compare_url } from '@src/shop/compare/get_compare_url';

export const compare_name = 'compare';

function createCompare() {
    const base = { items: [] };
    // token is always null on server, no token available
    if (isServer) {
        return null;
    }
    let store = getSharedStore(compare_name);
    if (store) {
        return store;
    }

    // load customer from local storage
    const current_compare = load(compare_name, base);

    const { subscribe, set, update } = writable(current_compare);

    let is_customer = false;

    is_logged_in.subscribe((is_logged_in) => {
        is_customer = is_logged_in;
    });

    // notification from other tab
    window.addEventListener('storage', (e) => {
        if (e.key === compare_name) {
            try {
                const value = JSON.parse(e.newValue);
                set(value);
            } catch (_) {
                set(null);
            }
        }
    });
    let value = null;
    // set current value of the store
    subscribe((compare) => {
        save(compare_name, compare);
        value = compare;
    });

    // create store logic
    store = {
        toggle: async (sku) => {
            if (!sku || typeof sku !== 'string') {
                messages.push(__('compare.error', sku), 'error');
                return;
            }
            update((compare) => {
                let message = 'shop.internal_error';
                const toggle_sku = sku.toLowerCase();
                let was_in_list = false;
                compare.items = compare.items.filter((sku) => {
                    if (sku === toggle_sku) {
                        was_in_list = true;
                        return false;
                    }
                    return true;
                });
                if (was_in_list) {
                    message = 'compare.remove';
                } else {
                    message = 'compare.add';
                    compare.items.push(toggle_sku);
                }
                load_product(sku).then(([error, product]) => {
                    if (error) {
                        messages.push(__('shop.internal_error', error), 'error');
                        console.error(error);
                        return;
                    }
                    messages.push(__(message, { name: product.name?.value || __('shop.product'), url: get_compare_url() }), 'success');
                });
                return compare;
            });
        },
        get: () => value,
        subscribe
    };

    return setSharedStore(compare_name, store);
}

export const compare = createCompare();
