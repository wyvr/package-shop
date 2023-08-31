import { Config } from '@wyvr/generator/src/utils/config.js';

export default {
    url: '/[store]/account',
    onExec: async ({ params }) => {
        const stores = Config.get('shop.stores');
        const store_id = stores[params.store];
        return {
            store: {
                key: params.store,
                value: store_id,
            },
            stores,
        };
    },
    _wyvr: ({ data }) => {
        return {
            template: ['shop/Account', 'shop/Default'],
            methods: ['get'],
            persist: true,
            language: data?.locale || 'en',
        };
    },
    title: () => __('customer.my_account'),
};
