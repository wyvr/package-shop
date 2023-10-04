import { Config } from '@wyvr/generator/src/utils/config.js';

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
    title: () => __('compare.name'),
};