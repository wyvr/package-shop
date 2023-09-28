import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';
import { guest_cart_name } from '@src/shop/stores/cart';
import { save } from '@src/shop/stores/storage';

export function customer_logout() {
    save(guest_cart_name, undefined);
    token.set(undefined);
    customer.set(undefined);
    messages.push(__('customer.logout_success'), 'success');
}
