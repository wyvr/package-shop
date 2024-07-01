import { redirectInvalidStoreRoute } from '@src/shop/route/redirectInvalidStoreRoute.js';

export default {
    url: '/[store]/account',
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Account', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en',
            },
        };
    },
    onExec: await redirectInvalidStoreRoute,
    title: () => __('customer.my_account'),
};
