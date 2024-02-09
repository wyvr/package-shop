import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';

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
