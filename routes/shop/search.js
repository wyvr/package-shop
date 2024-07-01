import { redirectInvalidStoreRoute } from '@src/shop/route/redirectInvalidStoreRoute.js';

export default {
    url: '/[store]/search',
    onExec: await redirectInvalidStoreRoute,
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Search', 'shop/Default'],
                methods: ['get', 'post'],
                persist: false,
                language: data?.locale || 'en',
            },
        };
    },
    title: () => __('search.search'),
    content: 'missing search implementation',
};
