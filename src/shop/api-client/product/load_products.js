import { get_time_stamp_minutes } from '@src/shop/core/cache_breaker.mjs';
import { url_join } from '@src/shop/core/url.mjs';
import { get_store } from '@src/shop/api-client/get_store';
import { get_domain } from '@src/shop/api-client/get_domain';

const CHUNK_SIZE = 25;

export async function load_products(skus, domain_url, store_key) {
    const store = get_store(store_key);
    const domain = get_domain(domain_url);
    if (!Array.isArray(skus)) {
        return [__('shop.internal_error'), undefined];
    }
    let products = [];
    const cb = get_time_stamp_minutes();
    const cleaned_skus = skus.filter(Boolean).map((sku) => sku.toLowerCase());
    const errors = [];
    const responses = [];

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


    // load in chunks of 25
    // for (let i = 0; i < cleaned_skus.length; i += CHUNK_SIZE) {
    //     const chunk = cleaned_skus.slice(i, i + CHUNK_SIZE);
    //     try {
    //         responses.push(
    //             await fetch(`${url_join(domain, store, 'api', 'product', 'get')}?cb=${cb}`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(chunk)
    //             })
    //         );
    //     } catch (e) {
    //         errors.push(e);
    //     }
    // }
    // await Promise.all(
    //     responses.map(async (response) => {
    //         try {
    //             const chunk_products = await response.json();
    //             products.push(...chunk_products);
    //         } catch (e) {
    //             errors.push(e);
    //         }
    //         return true;
    //     })
    // );
    // if (errors.length > 0) {
    //     if (products.length === 0) {
    //         return [errors, undefined];
    //     }
    //     console.error(errors);
    // }

    // return [undefined, products];
}
