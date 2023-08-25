import { valid } from "@src/shop/api/customer/valid.js";

export default {
    url: '/[store]/api/customer/valid/[email]/',
    _wyvr: () => {
        return {
            methods: ['get'],
        };
    },
    onExec: async ({ params, returnJSON, setStatus }) => {
        if (!valid(params.email)) {
            setStatus(500);
        }
        setStatus(400);
        return returnJSON({
            message: 'missing customer implementation',
        });
    },
};
