export default {
    url: '/[store]/api/wishlist/[email]/',
    _wyvr: () => {
        return {
            methods: ['get']
        };
    },
    onExec: async ({ returnJSON }) => {
        return returnJSON(
            {
                message: 'missing wishlist implementation'
            },
            400
        );
    }
};
