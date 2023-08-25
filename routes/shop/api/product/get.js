export default {
    url: '/[store]/api/product/get/[sku]',
    _wyvr: () => {
        return {
            methods: ['get'],
        };
    },
    onExec: async ({ returnJSON }) => {
        return returnJSON(
            {
                message: 'missing newsletter implementation',
            },
            400
        );
    },
};
