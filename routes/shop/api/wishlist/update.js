export default {
    url: '/[store]/api/wishlist/update/',
    _wyvr: () => {
        return {
            methods: ['post'],
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
