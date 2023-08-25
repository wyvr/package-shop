import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';
import { messages } from '@src/shop/stores/messages';

export function customer_logout() {
    token.set(undefined);
    customer.set(undefined);
    messages.push(__('customer.logout_success'), 'success');
}
