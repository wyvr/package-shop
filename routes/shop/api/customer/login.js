export default {
    url: '/[store]/api/customer/login/',
    _wyvr: () => {
        return {
            methods: ['post'],
        };
    },
    onExec: async ({ returnJSON, setStatus }) => {
        setStatus(400);
        return returnJSON({ message: 'missing login implementation' });
    },
};
