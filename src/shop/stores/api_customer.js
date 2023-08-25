import { derived } from 'svelte/store';
import { customer } from './customer';
import is_logged_in from './is_logged_in';

function api_customer() {
    return derived([is_logged_in, customer], ([$is_logged_in, $customer], set) => {
        if(!$is_logged_in) {
            set(undefined);
            return;
        }
        set($customer);
    });
}

export default api_customer();
