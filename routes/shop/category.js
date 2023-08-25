import { Config } from '@wyvr/generator/src/utils/config.js';

const slug = Config.get('shop.slug.category', 'category');
export default {
    url: `/[store]/${slug}/[slug]`,
    _wyvr: {
        template: ['shop/Category', 'shop/Default'],
        methods: ['get'],
        persist: true,
        language: 'en',
    },
    title: ({ params }) => 'category ' + params.slug,
    content: 'missing category implementation',
};
