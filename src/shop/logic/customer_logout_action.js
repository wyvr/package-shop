import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';
import { guest_cart_name } from '@src/shop/stores/cart';
import { save } from '@src/wyvr/stores/storage.js';

let logout_timer;
export function customer_logout_action(customer_logged_out = false) {
    save(guest_cart_name, undefined);
    token.set(undefined);
    customer.set(undefined);
    // clear all storage keys
    if (localStorage) {
        localStorage.clear();
    }
    if (sessionStorage) {
        sessionStorage.clear();
    }
    // clear all cookies
    for (const cookie of document.cookie.split(';')) {
        const [key] = cookie.split('=');
        document.cookie = `${key.trim()} =; expires = Thu, 01 Jan 1970 00:00:00 UTC`;
    }
    clearTimeout(logout_timer);
    logout_timer = setTimeout(() => {
        messages.push(__(customer_logged_out ? 'customer.logout_success' : 'customer.logout_success_system'), 'success');
    }, 2000);
}
