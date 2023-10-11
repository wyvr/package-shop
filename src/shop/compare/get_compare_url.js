import { url_join } from '@src/shop/core/url.mjs';

export function get_compare_url() {
    return url_join(getStack('store')?.key, 'compare');
}
