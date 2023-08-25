import { Config } from '@wyvr/generator/src/utils/config.js';

const slug = Config.get('shop.slug.product', 'product');

export default {
    url: `/[store]/${slug}/[slug]`,
    _wyvr: {
        template: ['shop/Product', 'shop/Default'],
        methods: ['get'],
        persist: true,
        language: 'en',
    },
    title: ({ params }) => 'product ' + params.slug,
    content: 'missing product implementation',
};
