import { cart } from '@src/shop/stores/cart';

let debouncer;

export function update_qty_delayed(sku, qty, on_started, on_finished) {
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

    return await cart.update_item(sku, new_qty);
}
