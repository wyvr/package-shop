export default {
    url: '/[store]/api/customer/get/[email]/',
    _wyvr: () => {
        return {
            methods: ['get']
        };
    },
    onExec: async ({ returnJSON, setStatus }) => {
        setStatus(400);
        return returnJSON({
            message: 'missing customer implementation'
        });
    }
};
