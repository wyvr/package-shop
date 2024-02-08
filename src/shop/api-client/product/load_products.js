import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { url_join } from '@src/shop/core/url.mjs';
import { get_store } from '@src/shop/api-client/get_store';
import { get_domain } from '@src/shop/api-client/get_domain';

export async function load_products(skus, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    if (!Array.isArray(skus)) {
        return [__('shop.internal_error'), undefined];
    }
    let products;
    try {
        const cb = get_time_stamp_minutes();
        const response = await fetch(`${url_join(domain, store, 'api', 'product', 'get')}?cb=${cb}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(skus.filter(Boolean).map((sku) => sku.toLowerCase()))
        });
        products = await response.json();
    } catch (e) {
        return [e, undefined];
    }
    return [undefined, products];
}
