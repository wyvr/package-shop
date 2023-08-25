import { Logger } from '@wyvr/generator/src/utils/logger.js';

export default {
    url: '/[store]/account',
    onExec: async ({ data }) => {
        if (!data?.store?.value) {
            Logger.warning('missing data on account', data.url);
            return data;
        }

        return data;
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
