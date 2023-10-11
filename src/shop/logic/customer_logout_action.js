import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';
import { guest_cart_name } from '@src/shop/stores/cart';
import { save } from '@src/shop/stores/storage';

let logout_timer;
export function customer_logout_action() {
    save(guest_cart_name, undefined);
    token.set(undefined);
    customer.set(undefined);
    // clear all storage keys
    if (localStorage) {
        Object.keys(localStorage).forEach((key) => {
            localStorage.removeItem(key);
        });
    }
    if (sessionStorage) {
        Object.keys(sessionStorage).forEach((key) => {
            sessionStorage.removeItem(key);
        });
    }
    // clear all cookies
    document.cookie.split(';').forEach((cookie) => {
        const key = cookie.split('=');
        document.cookie = key[0].trim() + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC';
    });
    clearTimeout(logout_timer);
    logout_timer = setTimeout(() => {
        messages.push(__('customer.logout_success'), 'success');
    }, 2000);
}
