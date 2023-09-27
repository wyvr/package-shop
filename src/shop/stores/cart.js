import { isServer } from '@wyvr/generator';
import { writable } from 'svelte/store';
import { getSharedStore, setSharedStore } from './shared';
import { load, save } from './storage';
import { messages } from '@src/shop/stores/messages';
import product_cart_attributes from '@src/shop/config/product_cart_attributes.mjs';
import { get_attribute_value } from '@src/shop/core/attributes.mjs';
import { load_product } from '@src/shop/api-client/product/load_product';
import { load_cart } from '@src/shop/api-client/cart/load_cart';
import api_customer from '@src/shop/stores/api_customer';
import { update_cart } from '@src/shop/api-client/cart/update_cart';

export const cart_name = 'cart';
export const guest_cart_name = 'guest_cart';

let product_cache = {};

/**
 * @typedef Cart
 * @type {object}
 * @property {Boolean} guest whether the cart is from a customer or a guest
 * @property {string|number} id id of the cart
 * @property {string[]} items items in the cart
 * @property {number} count amount of diffrent products in cart
 * @property {number} qty quantity of items in cart
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */
/**
 * @typedef CartItem
 * @type {object}
 * @property {string} sku product SKU
 * @property {number} qty quantity in cart
 * @property {string} [name] name of the product
 * @property {number} [price] price of the product
 */

/**
 * @typedef {object} CartStore
 * @property {function} subscribe Svelte store subscribe to get current cart
 * @property {function(sku: string, qty: number): void} update_item Method for adding, updating or removing a product from the cart
 */

/**
 * @returns {CartStore}
 */
function createCart() {
    const base = { guest: true, items: [] };
    // token is always null on server, no token available
    if (isServer) {
        return null;
    }
    let store = getSharedStore(cart_name);
    if (store) {
        return store;
    }
    let is_customer;

    // load customer from local storage
    const current_cart = load(cart_name, base);

    // extract product cache, to avoid loading known products
    const known_products = (current_cart?.items || [])
        .map((item) => {
            if (!item?.sku) {
                return undefined;
            }
            product_cache[item.sku] = item;
            return item.sku;
        })
        .filter(Boolean);

    // delay reload of known products, but reload them to avoid wrong prices
    if (known_products.length > 0) {
        setTimeout(async () => {
            // destroy the cache for the given products
            known_products.forEach((sku) => {
                delete product_cache[sku];
            });
            // reload the products
            await fill_products_cache(known_products);
            // update the cart
            set(fill_cart_with_products_cache(snapshot));
        }, 30000);
    }

    // create the svelte store
    const { subscribe, set, update } = writable(current_cart);

    // notification from other tab
    window.addEventListener('storage', (e) => {
        if (e.key == cart_name) {
            set(e.newValue);
        }
    });
    let snapshot;
    // set current value of the store
    subscribe(async (cart) => {
        const products_to_load = get_uncached_items(cart?.items);
        save(cart_name, cart);
        // store the current cart as snapshot, to handle/check the cart without subscribing to the store
        snapshot = cart;
        // load products from cart when not existing
        let [updated_cache] = await fill_products_cache(products_to_load);
        if (updated_cache) {
            // if cache has been updated append the products and set the cart again
            set(fill_cart_with_products_cache(snapshot));
        }
    });

    // handle the email and token for the cart
    let email_or_token = 'guest';
    let token;

    // refresh cart, when login or logoout
    api_customer.subscribe(async (customer) => {
        if (customer?.email && customer?.token) {
            email_or_token = customer.email;
            token = customer.token;
            is_customer = true;
        } else {
            email_or_token = load(guest_cart_name, 'guest');
            token = undefined;
            is_customer = false;
        }

        // load the current cart based on the email or token
        const [cart_error, loaded_cart] = await load_cart(email_or_token, token);
        if (cart_error) {
            messages.push(cart_error, 'error');
        }

        if (!loaded_cart) {
            return;
        }

        // when id changes the cart has to be merged when switching from guest to customer
        if (snapshot.guest && !loaded_cart.guest && snapshot.cart_id != loaded_cart.cart_id) {
            const items_map = {};
            loaded_cart.items.forEach((item, index) => {
                items_map[item.sku] = { index, item };
            });
            // merge the old cart into the new one
            snapshot.items.forEach((item) => {
                // is new
                if (!items_map[item.sku]) {
                    loaded_cart.items.push(item);
                    return;
                }
                // when exists use the higher qty
                loaded_cart.items[items_map[item.sku].index].qty = Math.max(items_map[item.sku].item.qty, item.qty);
            });
            if (loaded_cart.items.length > 0 || snapshot.items.length > 0) {
                messages.push(__('cart.merged'), 'info');
            }
        }

        // the id of guests cart is the token
        if (!is_customer) {
            email_or_token = loaded_cart.cart_id;
            if(loaded_cart.cart_id) {
                save(guest_cart_name, JSON.stringify(loaded_cart.cart_id));
            }
        }

        // load products from cart when not existing
        await fill_products_cache(get_uncached_items(loaded_cart?.items));

        // insert the products cache
        set(fill_cart_with_products_cache(loaded_cart));
    });

    // create store logic
    store = {
        update_item: async (sku, qty) => {
            let item = { sku, qty };
            if (!sku || typeof sku != 'string' || isNaN(qty) || qty == null) {
                messages.push(__('cart.update_error', get_product_from_products_cache(item)), 'error');
                return;
            }
            await fill_products_cache(get_uncached_items([item]));
            item = get_product_from_products_cache(item);

            let message = 'shop.internal_error';
            let has_changed = true;
            let prev_qty;
            update((cart) => {
                const result = update_cart_with_qty(cart, sku, qty, item);

                message = result.message;
                has_changed = result.has_changed;

                return result.cart;
            });

            // persist the cart on the server
            const cart_data = {};
            cart_data[sku] = qty;
            const [update_error, updated_cart] = await update_cart(email_or_token, token, cart_data);
            if (update_error) {
                messages.push(update_error, 'error');
                // revert the qty
                update((cart) => {
                    const result = update_cart_with_qty(cart, sku, prev_qty, item);
                    return result.cart;
                });
                return;
            }
            if (updated_cart.message) {
                if (Array.isArray(updated_cart.message)) {
                    updated_cart.message.forEach((message) => {
                        messages.push(message, 'warning');
                    });
                } else {
                    messages.push(updated_cart.message, 'warning');
                }
            } else {
                messages.push(__(message, item), has_changed ? 'success' : 'info');
            }
            // update cart with server state
            update((cart) => {
                const index = {};
                updated_cart.items.forEach((item) => {
                    index[item.sku] = item.qty;
                });
                cart.items = cart.items
                    .map((item) => {
                        // remove unknown items
                        if (index[item.sku] == undefined) {
                            return undefined;
                        }
                        // update qty
                        item.qty = index[item.sku];
                        return item;
                    })
                    .filter(Boolean);

                return cart;
            });
        },
        subscribe,
    };

    return setSharedStore(cart_name, store);
}

/**
 * Returns the skus of the items which should be loaded
 * @param {CartItem[]} items
 * @returns {string[]}
 */
function get_uncached_items(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items
        .filter((item) => !item.name && item.sku)
        .map((item) => item.sku)
        .filter((sku, index, list) => {
            if (!sku) {
                return false;
            }
            return list.indexOf(sku) === index;
        });
}

/**
 * Update the items in the cart with the values from the products_cache
 * @param {Cart} cart
 * @returns {Cart}
 */
function fill_cart_with_products_cache(cart) {
    if (!cart || !Array.isArray(cart.items)) {
        return cart;
    }
    cart.items = cart.items.map(get_product_from_products_cache);
    return cart;
}

/**
 * Load the products from given skus and store in products_cache
 * @param products_to_load
 * @returns {Promise<[has_been_updated: boolean, loaded_skus: string[]]>}
 */
async function fill_products_cache(products_to_load) {
    const result = await Promise.all(
        products_to_load.map(async (sku) => {
            if (!product_cache[sku]) {
                const [error, product] = await load_product(sku);
                if (error) {
                    messages.push(__('shop.internal_error', error), 'error');
                    console.error('could not load product', sku, error);
                    return null;
                }
                const item = {};
                product_cart_attributes.forEach((key) => {
                    const value = get_attribute_value(product, key);
                    if (value != null) {
                        item[key] = value;
                    }
                });
                product_cache[sku] = item;
            }
            return sku;
        })
    );
    const loaded_products = result.filter(Boolean);
    return [loaded_products.length > 0, loaded_products];
}

/**
 * Return the value from the products_cache or the item itself
 * @param {CartItem} item
 * @returns
 */
function get_product_from_products_cache(item) {
    // invalid item
    if (!item?.sku) {
        return undefined;
    }
    // return original item when not in products_cache or already enhanced
    if (!product_cache[item?.sku] || item.name) {
        return item;
    }
    // return the cached products with the sku and qty from the item
    const product = product_cache[item.sku];
    if (item.sku) {
        product.sku = item.sku;
    }
    if (item.qty) {
        product.qty = item.qty;
    }
    return product;
}

function update_cart_with_qty(cart, sku, qty, item) {
    let message = undefined;
    let has_changed = true;
    let prev_qty = undefined;
    if (qty == 0 || qty == undefined) {
        message = 'cart.delete';
        cart.items = cart.items.filter((item) => item.sku != sku);
    } else {
        message = 'cart.update';
        const found = cart.items.find((item, index) => {
            if (item.sku != sku) {
                return false;
            }
            has_changed = cart.items[index].qty !== qty;
            prev_qty = cart.items[index].qty;
            cart.items[index].qty = qty;
            return true;
        });
        if (!has_changed) {
            message = 'cart.unchanged';
        }
        if (!found) {
            message = 'cart.add';
            cart.items.push(get_product_from_products_cache(item));
        }
    }
    return { cart, message, has_changed, prev_qty };
}

/**
 * Svelte Store to get and update the Cart
 */
export const cart = createCart();
