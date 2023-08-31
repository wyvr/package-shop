import { Config } from '@wyvr/generator/src/utils/config.js';

export default {
    url: '/[store]/product-to-cart',
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
            template: ['shop/ProductToCart', 'shop/Default'],
            methods: ['get'],
            persist: true,
            language: data?.locale || 'en',
        };
    },
    title: () => __('product_to_cart.name'),
};
