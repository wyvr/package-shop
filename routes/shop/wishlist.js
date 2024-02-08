import { Config } from '@wyvr/generator/src/utils/config.js';

const slug = Config.get('shop.slug.wishlist', 'wishlist');

export default {
    url: `/[store]/${slug}/`,
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Wishlist', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en'
            }
        };
    },
    title: () => __('wishlist.name')
};
