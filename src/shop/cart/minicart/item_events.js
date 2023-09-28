import { cart } from '@src/shop/stores/cart';

let debouncer;
const cache = {};

export function update_qty_delayed(sku, qty) {

    if (cache[sku] == null || cache[sku] != qty) {
        cache[sku] = qty;
    } else {
        // when nothing change avoid updating
        return;
    }
    // delay the cart update, to avoid bruteforcing the api
    if (debouncer) {
        clearTimeout(debouncer);
    }
    debouncer = setTimeout(() => {
        update_qty(sku, qty);
    }, 1000);
}

export function update_qty(sku, qty) {
    const new_qty = qty || 0;
    cart.update_item(sku, new_qty);
}
