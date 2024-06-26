import { isServer } from '@wyvr/generator';
import { writable } from 'svelte/store';
import { getSharedStore, setSharedStore } from '@src/wyvr/stores/shared.js';
import { load, save } from '@src/wyvr/stores/storage.js';
import product_cart_attributes from '@src/shop/config/product_cart_attributes.js';
import { get_attribute_value } from '@src/shop/core/attributes.js';
import { load_product } from '@src/shop/api-client/product/load_product';
import { load_cart } from '@src/shop/api-client/cart/load_cart';
import api_customer from '@src/shop/stores/api_customer';
import { update_cart } from '@src/shop/api-client/cart/update_cart';
import { cart_message } from '@src/shop/cart/cart_message';

export const cart_name = 'cart';
export const purchase_name = 'purchase';
export const guest_cart_name = 'guest_cart';

let product_cache = {};
// handle the email and token for the cart
let email_or_token = 'guest';
let token;
let is_customer;

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
            for (const sku of known_products) {
                delete product_cache[sku];
            }
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
        if (e.key === cart_name) {
            try {
                const cart = JSON.parse(e.newValue);
                if (cart) {
                    set(cart);
                }
            } catch (e) {
                console.error('could not parse cart', e);
            }
        }
    });
    let snapshot;
    // set current value of the store
    subscribe(async (cart) => {
        const products_to_load = get_uncached_items(cart?.items);
        save(cart_name, cart);
        // store the current cart as snapshot, to handle/check the cart without subscribing to the store
        snapshot = JSON.parse(JSON.stringify(cart));
        // load products from cart when not existing
        const [updated_cache] = await fill_products_cache(products_to_load);
        if (updated_cache) {
            // if cache has been updated append the products and set the cart again
            set(fill_cart_with_products_cache(snapshot));
        }
    });

    // refresh cart, when login or logout
    api_customer.subscribe((customer) => {
        if (customer?.email && customer?.token) {
            email_or_token = customer.email;
            token = customer.token;
            is_customer = true;
        } else {
            email_or_token = load(guest_cart_name, 'guest');
            token = undefined;
            is_customer = false;
        }
        // check purchase event, to create new cart
        const purchase = load(purchase_name);
        if (purchase) {
            setTimeout(() => {
                // trigger is created after the components
                trigger('purchase', { purchase, customer });
            }, 100);
            // remove purchase
            save(purchase_name, undefined);
            if (!is_customer) {
                email_or_token = 'guest'; // force new cart
            }
        }
        refresh_cart(snapshot, set, update);
    });

    // create store logic
    store = {
        update_item: async (sku, qty) => await update_cart_item(sku, qty, update, snapshot, true),
        subscribe
    };

    return setSharedStore(cart_name, store);
}

async function update_cart_item(sku, qty, update, snapshot, show_messages = true) {
    if (typeof update !== 'function') {
        console.error('missing update fn');
        return undefined;
    }
    let item = { sku, qty };
    if (!sku || typeof sku !== 'string' || Number.isNaN(qty) || qty == null) {
        if (show_messages) {
            cart_message('error', 'cart.update_error', get_product_from_products_cache(item));
        }
        return undefined;
    }
    await fill_products_cache(get_uncached_items([item]));
    item = get_product_from_products_cache(item);

    let message = 'shop.internal_error';
    let has_changed = true;
    let prev_qty;
    update((cart) => {
        const result = update_cart_with_qty(cart, sku, qty, item, snapshot);
        message = result.message;
        has_changed = result.has_changed;
        if (result.event) {
            trigger(result.event, { sku, qty, item, prev_qty: result.prev_qty });
        }

        return result.cart;
    });

    // persist the cart on the server
    const cart_data = {};
    cart_data[sku] = qty;
    const [update_error, updated_cart] = await update_cart(email_or_token, token, cart_data);
    if (update_error) {
        if (show_messages) {
            cart_message('error', update_error);
        }
        // revert the qty
        update((cart) => {
            const result = update_cart_with_qty(cart, sku, prev_qty, item, snapshot);
            return result.cart;
        });
        return;
    }
    if (updated_cart.message) {
        if (Array.isArray(updated_cart.message)) {
            for (const message of updated_cart.message) {
                if (show_messages) {
                    cart_message('warning', message);
                }
            }
        } else {
            if (show_messages) {
                cart_message('warning', updated_cart.message);
            }
        }
    } else {
        cart_message('success', message, item);
    }
    // update cart with server state
    update((cart) => {
        const index = {};
        for (const item of updated_cart.items) {
            index[item.sku] = item.qty;
        }
        cart.items = cart.items
            .map((item) => {
                // remove unknown items
                if (index[item.sku] === undefined) {
                    return undefined;
                }
                // update qty
                item.qty = index[item.sku];
                return item;
            })
            .filter(Boolean);

        return cart;
    });
    return updated_cart;
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
                    cart_message('error', 'shop.internal_error', error);
                    console.error('could not load product', sku, error);
                    return null;
                }
                const item = {};
                for (const attribute of product_cart_attributes) {
                    if (typeof attribute === 'string') {
                        const value = get_attribute_value(product, attribute);
                        if (value != null) {
                            item[attribute] = value;
                        }
                        continue;
                    }
                    if (typeof attribute === 'object' && !Array.isArray(attribute) && attribute?.attribute) {
                        if (attribute.all) {
                            item[attribute.attribute] = product[attribute.attribute];
                        }
                    }
                }
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

function update_cart_with_qty(cart, sku, qty, item, snapshot) {
    let message = undefined;
    let has_changed = true;
    const prev_qty = snapshot?.items.find((item) => item.sku === sku)?.qty;
    if (qty === 0 || qty === undefined) {
        message = 'cart.delete';
        cart.items = cart.items.filter((item) => item.sku !== sku);
    } else {
        if (prev_qty < qty) {
            message = 'cart.update';
        } else {
            message = 'cart.decrease';
        }
        const found = cart.items.find((item, index) => {
            if (item.sku !== sku) {
                return false;
            }
            has_changed = prev_qty !== qty;
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
    return { cart, message, event: message, has_changed, prev_qty };
}

async function refresh_cart(snapshot, set_cart, update_cart) {
    if (typeof set_cart !== 'function') {
        console.error('no set_cart method given');
        return;
    }

    // load the current cart based on the email or token
    const [cart_error, loaded_cart] = await load_cart(email_or_token, token);
    if (cart_error) {
        cart_message('error', cart_error);
    }

    if (!loaded_cart) {
        return;
    }

    // when id changes the cart has to be merged when switching from guest to customer
    if (snapshot?.guest && !loaded_cart.guest && snapshot?.cart_id !== loaded_cart.cart_id && snapshot?.items.length > 0) {
        const items_map = {};
        for (const item of loaded_cart.items) {
            items_map[item.sku] = { index: loaded_cart.items.indexOf(item), item };
        }
        // merge the old cart into the new one
        for (const item of snapshot.items) {
            // is new
            if (!items_map[item.sku]) {
                update_cart_item(item.sku, item.qty, update_cart, snapshot, false);
                loaded_cart.items.push(item);
                continue;
            }
            // when exists use the higher qty
            const new_qty = Math.max(items_map[item.sku].item.qty, item.qty);
            if (items_map[item.sku].item.qty !== new_qty) {
                update_cart_item(item.sku, new_qty, update_cart, snapshot, false);
                loaded_cart.items[items_map[item.sku].index].qty = new_qty;
            }
        }
        if (loaded_cart.items.length > 0 || snapshot?.items.length > 0) {
            cart_message('info', 'cart.merged');
        }
    }

    // the id of guests cart is the token
    if (!is_customer) {
        email_or_token = loaded_cart.cart_id;
        if (loaded_cart.cart_id) {
            save(guest_cart_name, JSON.stringify(loaded_cart.cart_id));
        }
    }

    // load products from cart when not existing
    await fill_products_cache(get_uncached_items(loaded_cart?.items));

    // insert the products cache
    set_cart(fill_cart_with_products_cache(loaded_cart));
}

/**
 * Svelte Store to get and update the Cart
 */
export const cart = createCart();
