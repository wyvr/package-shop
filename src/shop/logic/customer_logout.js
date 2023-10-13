import { customer_logout_action } from '@src/shop/logic/customer_logout_action';

export function customer_logout(customer_logged_out = false) {
    customer_logout_action(customer_logged_out);
}
