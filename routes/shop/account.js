import { Config } from '@wyvr/generator/src/utils/config.js';

export default {
    url: '/[store]/account',
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Account', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en'
            }
        };
    },
    title: () => __('customer.my_account')
};
