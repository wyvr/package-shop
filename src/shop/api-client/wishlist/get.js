import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { url_join } from '@src/shop/core/url.mjs';
import { get_store } from '@src/shop/api-client/get_store';
import { get_domain } from '@src/shop/api-client/get_domain';

export async function get(token, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    let result;
    try {
        const cb = get_time_stamp_minutes();
        const response = await fetch(`${url_join(domain, store, 'api', 'wishlist', 'get')}?cb=${cb}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        result = await response.json();
        if (!response.ok) {
            return [result.message || __('shop.internal_error'), undefined];
        }
    } catch (e) {
        return [e, undefined];
    }
    return [undefined, result];
}
