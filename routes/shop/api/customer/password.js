import { valid } from '@src/shop/api/customer/valid.js';
import { change_password } from '@src/shop/api/customer/password';

export default {
    url: '/[store]/api/customer/password/[email]/',
    _wyvr: () => {
        return {
            methods: ['post'],
        };
    },
    onExec: async ({ params, body, returnJSON, headers, isProd }) => {
        const [valid_error, base_customer] = await valid(params.email, headers?.authorization);
        if (valid_error) {
            return returnJSON({ message: valid_error }, 403);
        }
        const [get_error, customer] = await change_password(params.store, base_customer?.id, base_customer?.email, body, isProd);
        if (get_error) {
            return returnJSON({ message: get_error }, 400);
        }
        return returnJSON(customer);
    },
};
