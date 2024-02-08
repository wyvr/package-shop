import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { url_join } from '@src/shop/core/url.mjs';
import { get_store } from '@src/shop/api-client/get_store';
import { get_domain } from '@src/shop/api-client/get_domain';

export async function load_product(sku, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    let product;
    try {
        const cb = get_time_stamp_minutes();
        const response = await fetch(`${url_join(domain, store, 'api', 'product', 'get', sku.toLowerCase())}?cb=${cb}`);
        product = await response.json();
    } catch (e) {
        return [e, undefined];
    }
    return [undefined, product];
}
