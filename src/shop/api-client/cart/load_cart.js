import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.js';
import { get_domain } from '@src/shop/api-client/get_domain';
import { get_store } from '@src/shop/api-client/get_store';
import { url_join } from '@src/shop/core/url.js';
import { customer_logout } from '@src/shop/logic/customer_logout';

export async function load_cart(email_or_token, bearer_token, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    let cart;
    try {
        const cb = get_time_stamp_minutes();
        const data = {
            headers: {},
            method: 'get'
        };
        if (bearer_token) {
            data.headers.authorization = `Bearer ${bearer_token}`;
        }
        const url = url_join(domain, store, 'api', 'cart', email_or_token || 'guest');
        const response = await fetch(`${url}?cb=${cb}`, data);
        if (!response.ok && response.status === 403) {
            customer_logout();
            return [undefined, undefined];
        }
        cart = await response.json();
    } catch (e) {
        console.error(e);
        return [__('shop.internal_error'), undefined];
    }
    return [undefined, cart];
}
