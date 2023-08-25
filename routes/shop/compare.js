import { Config } from '@wyvr/generator/src/utils/config.js';

const slug = Config.get('shop.slug.compare', 'compare');

export default {
    url: `/[store]/${slug}/`,
    _wyvr: {
        template: ['shop/Compare', 'shop/Default'],
        methods: ['get'],
        persist: true,
        language: 'en',
    },
    title: () => __('compare.name'),
};