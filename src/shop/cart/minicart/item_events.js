import { cart } from '@src/shop/stores/cart';

let debouncer;

export function update_qty_delayed(sku, qty) {
    // delay the cart update, to avoid bruteforcing the api
    if (debouncer) {
        clearTimeout(debouncer);
    }
    debouncer = setTimeout(() => {
        update_qty(sku, new_qty);
    }, 1000);
}

export function update_qty(sku, qty) {
    const new_qty = qty || 0;
    cart.update_item(sku, new_qty);
}
