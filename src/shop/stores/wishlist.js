import { isServer } from '@wyvr/generator';
import { writable } from 'svelte/store';
import { getSharedStore, setSharedStore } from './shared';
import { load, save } from './storage';
import is_logged_in from '@src/shop/stores/is_logged_in';
import { messages } from '@src/shop/stores/messages';
import { load_product } from '@src/shop/api-client/product/load_product';

export const wishlist_name = 'wishlist';

function createWishlist() {
    const base = { items: [] };
    // token is always null on server, no token available
    if (isServer) {
        return null;
    }
    let store = getSharedStore(wishlist_name);
    if (store) {
        return store;
    }

    // load customer from local storage
    const current_wishlist = load(wishlist_name, base);

    const { subscribe, set, update } = writable(current_wishlist);

    let is_customer = false;

    is_logged_in.subscribe((is_logged_in) => {
        is_customer = is_logged_in;
    });

    // notification from other tab
    window.addEventListener('storage', (e) => {
        if (e.key == wishlist_name) {
            set(e.newValue);
        }
    });
    // set current value of the store
    subscribe((wishlist) => {
        save(wishlist_name, wishlist);
    });

    // create store logic
    store = {
        toggle: async (sku) => {
            if (!sku || typeof sku != 'string') {
                messages.push(__('wishlist.error', sku), 'error');
                return;
            }
            update((wishlist) => {
                let message = 'shop.internal_error';
                const toggle_sku = sku.toLowerCase();
                let was_in_list = false;
                wishlist.items = wishlist.items.filter((sku) => {
                    if (sku == toggle_sku) {
                        was_in_list = true;
                        return false;
                    }
                    return true;
                });
                if (was_in_list) {
                    message = 'wishlist.remove';
                } else {
                    message = 'wishlist.add';
                    wishlist.items.push(toggle_sku);
                }
                load_product(sku).then(([error, product]) => {
                    if (error) {
                        messages.push(__('shop.internal_error', error), 'error');
                        console.error(error);
                        return;
                    }
                    messages.push(__(message, { name: product.name?.value || __('shop.product') }), 'success');
                });
                return wishlist;
            });
        },
        subscribe,
    };

    return setSharedStore(wishlist_name, store);
}

export const wishlist = createWishlist();
