import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { url_join } from '@src/shop/api-client/url_join';
import { get_store } from '@src/shop/api-client/get_store';
import { get_domain } from '@src/shop/api-client/get_domain';

export async function load_product(sku, domain_url, store_key) {
    store_key = get_store(store_key);
    domain_url = get_domain(domain_url);
    let product;
    try {
        const cb = get_time_stamp_minutes();
        const response = await fetch(
            url_join(domain_url, store_key, 'api', 'product', 'get', sku.toLowerCase()) + `?cb=${cb}`
        );
        product = await response.json();
    } catch (e) {
        return [e, undefined];
    }
    return [undefined, product];
}
