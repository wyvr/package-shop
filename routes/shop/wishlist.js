import { Config } from '@wyvr/generator/src/utils/config.js';

const slug = Config.get('shop.slug.wishlist', 'wishlist');

export default {
    url: `/[store]/${slug}/`,
    _wyvr: {
        template: ['shop/Wishlist', 'shop/Default'],
        methods: ['get'],
        persist: true,
        language: 'en',
    },
    title: () => __('wishlist.name'),
};
