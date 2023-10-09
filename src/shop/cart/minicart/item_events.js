import { cart } from '@src/shop/stores/cart';

let debouncer;
const cache = {};

export function update_qty_delayed(sku, qty, on_started, on_finished) {
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
    debouncer = setTimeout(async () => {
        if (typeof on_started == 'function') {
            on_started(sku, qty);
        }
        const result = await update_qty(sku, qty);
        if (typeof on_finished == 'function') {
            on_finished(sku, qty, result);
        }
    }, 500);
}

export async function update_qty(sku, qty) {
    const new_qty = qty || 0;
    if (new_qty) {
        delete cache[sku];
    }
    return await cart.update_item(sku, new_qty);
}
