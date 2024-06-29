import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.js';
import { get_domain } from '@src/shop/api-client/get_domain';
import { get_store } from '@src/shop/api-client/get_store';
import { url_join } from '@src/shop/core/url.js';
import { customer } from '@src/shop/stores/customer';

export async function update_customer(email, bearer_token, customer_data, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    let customer_result;
    try {
        const cb = get_time_stamp_minutes();
        const data = {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'put',
            body: JSON.stringify(customer_data)
        };
        if (bearer_token) {
            data.headers.authorization = `Bearer ${bearer_token}`;
        }
        const url = url_join(domain, store, 'api', 'customer', 'update', email ?? 'guest');
        const response = await fetch(`${url}?cb=${cb}`, data);
        customer_result = await response.json();
        if (!response.ok) {
            return [customer_result?.message, undefined];
        }
    } catch (e) {
        return [e, undefined];
    }

    // update customer
    if (customer_result?.id) {
        customer.update((customer) => ({ ...customer, ...customer_result }));
    }

    return [undefined, customer_result];
}
