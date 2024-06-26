import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.js';
import { get_domain } from '@src/shop/api-client/get_domain';
import { get_store } from '@src/shop/api-client/get_store';
import { url_join } from '@src/shop/core/url.js';

export async function get_orders(email, bearer_token, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    let orders_result;
    try {
        const cb = get_time_stamp_minutes();
        const data = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (bearer_token) {
            data.headers.authorization = `Bearer ${bearer_token}`;
        }
        const url = url_join(domain, store, 'api', 'customer', 'orders', email ?? '');
        const response = await fetch(`${url}?cb=${cb}`, data);
        orders_result = await response.json();
        if (!response.ok) {
            return [orders_result?.message, undefined];
        }
    } catch (e) {
        return [e, undefined];
    }

    return [undefined, orders_result];
}
