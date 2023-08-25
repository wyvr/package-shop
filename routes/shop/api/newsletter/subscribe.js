export default {
    url: '/[store]/api/newsletter/subscribe/',
    _wyvr: () => {
        return {
            methods: ['post'],
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
