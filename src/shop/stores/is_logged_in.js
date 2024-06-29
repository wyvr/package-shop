import { derived } from 'svelte/store';
import { token } from '@src/shop/stores/token';
import { customer } from '@src/shop/stores/customer';

function is_logged_in() {
    return derived([token, customer], ([$token, $customer], set) => {
        const value = $token && $customer?.token && $token === $customer?.token;
        set(!!value);
    });
}

export default is_logged_in();
