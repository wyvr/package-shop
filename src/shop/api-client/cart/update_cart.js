import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { get_domain } from '@src/shop/api-client/get_domain';
import { get_store } from '@src/shop/api-client/get_store';
import { url_join } from '@src/shop/core/url.mjs';

export async function update_cart(email_or_token, bearer_token, cart_data, domain_url, store_key) {
    store_key = get_store(store_key);
    domain_url = get_domain(domain_url);
    let cart;
    try {
        const cb = get_time_stamp_minutes();
        const data = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'put',
            body: JSON.stringify(cart_data),
        };
        if (bearer_token) {
            data.headers.authorization = `Bearer ${bearer_token}`;
        }
        const url = url_join(domain_url, store_key, 'api', 'cart', email_or_token || 'guest');
        console.log(data, url);
        const response = await fetch(url + `?cb=${cb}`, data);
        cart = await response.json();
    } catch (e) {
        return [e, undefined];
    }
    return [undefined, cart];
}
