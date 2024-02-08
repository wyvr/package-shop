export default {
    url: '/[store]/api/customer/register/',
    _wyvr: () => {
        return {
            methods: ['post']
        };
    },
    onExec: async ({ returnJSON, setStatus }) => {
        setStatus(400);
        return returnJSON({ message: 'missing login implementation' });
    }
};
