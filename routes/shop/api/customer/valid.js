import { valid } from '@src/shop/api/customer/valid.js';
import { validate_store } from '@src/shop/core/validate_store.js';

export default {
    url: '/[store]/api/customer/valid/[email]/',
    _wyvr: () => {
        return {
            methods: ['get'],
        };
    },
    onExec: async ({ params, returnJSON }) => {
        if (!validate_store(params?.store)) {
            return returnJSON({}, 404);
        }
        if (!valid(params.email)) {
            return returnJSON({ message: 'Invalid email' }, 400);
        }
        return returnJSON({ message: 'Not implemented' }, 501);
    },
};
