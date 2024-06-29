import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.js';
import { get_domain } from '@src/shop/api-client/get_domain';
import { get_store } from '@src/shop/api-client/get_store';
import { url_join } from '@src/shop/core/url.js';

export async function update_password(email, bearer_token, current_password, new_password, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    let password_result;
    try {
        const cb = get_time_stamp_minutes();
        const data = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify({ current_password, new_password })
        };
        if (bearer_token) {
            data.headers.authorization = `Bearer ${bearer_token}`;
        }
        const url = url_join(domain, store, 'api', 'customer', 'password', email ?? 'guest');
        const response = await fetch(`${url}?cb=${cb}`, data);
        password_result = await response.json();
        if (!response.ok) {
            return [password_result?.message, undefined];
        }
    } catch (e) {
        return [e, undefined];
    }

    return [undefined, password_result];
}
