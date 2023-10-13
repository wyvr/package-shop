import { isServer, injectConfig } from '@wyvr/generator';
import { writable } from 'svelte/store';
import { getSharedStore, setSharedStore } from './shared';
import { load, save } from './storage';
import { messages } from '@src/shop/stores/messages';
import { load_product } from '@src/shop/api-client/product/load_product';
import { get_wishlist_url } from '@src/shop/wishlist/get_wishlist_url';
import { token } from '@src/shop/stores/token';
import { get } from '@src/shop/api-client/wishlist/get';
import { update as update_wishlist } from '@src/shop/api-client/wishlist/update';

export const wishlist_name = 'wishlist';
const api_enabled = injectConfig('shop.feature.wishlist_api', false);

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

    // load wishlist from local storage
    const current_wishlist = load(wishlist_name, base);

    const { subscribe, set, update } = writable(current_wishlist);

    let token_value;
    if (api_enabled) {
        token.subscribe(async (token) => {
            const changed = token_value != token;
            token_value = token;
            // when token changes load the wishlist from the server
            if (changed && token) {
                const [get_error, loaded_wishlist] = await get(token);
                if (get_error) {
                    messages.push(get_error, 'error');
                    return;
                }
                const changes = {};
                let has_changes = false;
                update((wishlist) => {
                    if (!wishlist) {
                        wishlist = {};
                    }
                    // add items from the previous wishlist to the server wishlist
                    (wishlist.items || [])
                        .filter((x) => (loaded_wishlist.items || []).indexOf(x) == -1)
                        .forEach((sku) => {
                            has_changes = true;
                            changes[sku] = true;
                        });
                    wishlist.id = loaded_wishlist.id;
                    wishlist.items = (wishlist.items || [])
                        .concat(loaded_wishlist.items || [])
                        .sort()
                        .filter((sku, index, arr) => arr.indexOf(sku) == index);

                    return wishlist;
                });
                if (has_changes) {
                    update_wishlist(token_value, changes);
                }
            }
            // clear the wishlist when customer logs out
            if (changed && !token) {
                set({ items: [] });
            }
        });
    }

    // notification from other tab
    window.addEventListener('storage', (e) => {
        if (e.key == wishlist_name) {
            set(e.newValue);
        }
    });
    // set current value of the store
    let snapshot = undefined;
    subscribe((wishlist) => {
        save(wishlist_name, wishlist);
        snapshot = JSON.parse(JSON.stringify(wishlist));
    });

    // create store logic
    store = {
        toggle: async (sku) => await toggle(sku, update, token_value),
        subscribe,
    };

    return setSharedStore(wishlist_name, store);
}

async function toggle(sku, update_fn, token_value) {
    if (!sku || typeof sku != 'string') {
        messages.push(__('wishlist.error', sku), 'error');
        return;
    }
    update_fn((wishlist) => {
        let message = 'shop.internal_error';
        let event;
        const toggle_sku = sku.toLowerCase();
        let was_in_list = false;
        wishlist.items = wishlist.items.filter((sku) => {
            if (sku == toggle_sku) {
                was_in_list = true;
                return false;
            }
            return true;
        });
        const changes = {};
        if (was_in_list) {
            message = 'wishlist.remove';
            event = 'wishlist.remove';
            changes[sku] = false;
        } else {
            message = 'wishlist.add';
            wishlist.items.push(toggle_sku);
            event = 'wishlist.add';
            changes[sku] = true;
        }
        load_product(sku).then(([error, product]) => {
            if (error) {
                messages.push(__('shop.internal_error', error), 'error');
                console.error(error);
                return;
            }
            let name = product?.name?.value;
            let type = 'success';
            if (!name) {
                message = 'wishlist.not_found';
                name = sku;
                type = 'warning';
            }
            messages.push(__(message, { name, url: get_wishlist_url() }), type);
            trigger(event, product);
        });

        // for customers persist the wishlist on the server
        if (token_value) {
            update_wishlist(token_value, changes);
        }
        return wishlist;
    });
}

export const wishlist = createWishlist();
