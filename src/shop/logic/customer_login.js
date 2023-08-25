import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';
import { cart, cart_name } from '@src/shop/stores/cart';
import { load } from '@src/shop/stores/storage';

export async function customer_login(customer_data) {
    if (!customer_data) {
        return;
    }
    if (customer_data?.token) {
        token.set(customer_data.token);
    }
    customer.set(customer_data);
    messages.push(__('customer.login_success'), 'success');
}
