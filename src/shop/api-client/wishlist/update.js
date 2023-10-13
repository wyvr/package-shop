import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { url_join } from '@src/shop/core/url.mjs';
import { get_store } from '@src/shop/api-client/get_store';
import { get_domain } from '@src/shop/api-client/get_domain';

export async function update(token, changes, domain_url, store_key) {
    store_key = get_store(store_key);
    domain_url = get_domain(domain_url);
    try {
        const cb = get_time_stamp_minutes();
        const data = {
            method: 'post',
            headers: {
                authorization: `Bearer ${token}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify(changes),
        };
        const response = await fetch(url_join(domain_url, store_key, 'api', 'wishlist', 'update') + `?cb=${cb}`, data);
        result = await response.json();
        if (!response.ok) {
            return [result.message || __('shop.internal_error'), undefined];
        }
    } catch (e) {
        return [e, undefined];
    }
    return [undefined, result];
}
