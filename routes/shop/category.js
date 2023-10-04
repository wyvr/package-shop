import { Config } from '@wyvr/generator/src/utils/config.js';

const slug = Config.get('shop.slug.category', 'category');
export default {
    url: `/[store]/${slug}/[slug]`,
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Category', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en',
            },
        };
    },
    title: ({ params }) => 'category ' + params.slug,
    content: 'missing category implementation',
};
