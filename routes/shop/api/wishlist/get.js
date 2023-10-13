export default {
    url: '/[store]/api/wishlist/get/',
    _wyvr: () => {
        return {
            methods: ['get'],
        };
    },
    onExec: async ({ returnJSON }) => {
        return returnJSON(
            {
                message: 'missing wishlist implementation',
            },
            400
        );
    },
};
