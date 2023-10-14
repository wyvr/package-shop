import { valid } from '@src/shop/api/customer/valid.js';
import { get_orders } from '@src/shop/api/customer/orders.js';

export default {
    url: '/[store]/api/customer/orders/[email]/',
    _wyvr: () => {
        return {
            methods: ['get'],
        };
    },
    onExec: async ({ params, returnJSON, headers, isProd }) => {
        const [valid_error, base_customer] = await valid(params.email, headers?.authorization);
        if (valid_error) {
            return returnJSON({ message: valid_error }, 403);
        }
        const [get_error, orders] = await get_orders(params.store, params.email, isProd);
        if (get_error) {
            return returnJSON({ message: get_error }, 403);
        }
        return returnJSON(orders?.items || []);
    },
};
