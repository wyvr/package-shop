import { valid } from '@src/shop/api/customer/valid.js';
import { update_customer } from '@src/shop/api/customer/update';
import { validate_store } from '@src/shop/core/validate_store.js';

export default {
    url: '/[store]/api/customer/update/[email]/',
    _wyvr: () => {
        return {
            methods: ['put'],
        };
    },
    onExec: async ({ params, body, returnJSON, headers, isProd }) => {
        if (!validate_store(params?.store)) {
            return returnJSON({}, 404);
        }
        const [valid_error, base_customer] = await valid(
            params.email,
            headers?.authorization
        );
        if (valid_error) {
            return returnJSON({ message: valid_error }, 403);
        }
        const [get_error, customer] = await update_customer(
            params.store,
            base_customer?.id,
            body,
            isProd
        );
        if (get_error) {
            return returnJSON({ message: get_error }, 400);
        }
        return returnJSON(customer);
    },
};
