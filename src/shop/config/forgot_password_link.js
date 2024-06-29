import { url_join } from '@src/shop/core/url.js';

export function forgot_password_link() {
    return url_join(getStack('store')?.key, 'account', 'forgot_password');
}
