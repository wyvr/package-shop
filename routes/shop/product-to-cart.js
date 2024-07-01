import { redirectInvalidStoreRoute } from '@src/shop/route/redirectInvalidStoreRoute.js';

export default {
    url: '/[store]/product-to-cart',
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/ProductToCart', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en',
            },
        };
    },
    onExec: await redirectInvalidStoreRoute,
    title: () => __('product_to_cart.name'),
};
