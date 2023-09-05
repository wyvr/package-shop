import { Config } from '@wyvr/generator/src/utils/config.js';

export default {
    url: '/[store]/product-to-cart',
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
