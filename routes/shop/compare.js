import { Config } from '@wyvr/generator/src/utils/config.js';
import { redirectInvalidStoreRoute } from '@src/shop/route/redirectInvalidStoreRoute.js';

const slug = Config.get('shop.slug.compare', 'compare');

export default {
    url: `/[store]/${slug}/`,
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Compare', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en',
            },
        };
    },
    onExec: await redirectInvalidStoreRoute,
    title: () => __('compare.name'),
};
