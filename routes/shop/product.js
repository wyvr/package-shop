import { Config } from '@wyvr/generator/src/utils/config.js';
import { redirectInvalidStoreRoute } from '@src/shop/route/redirectInvalidStoreRoute.js';

const slug = Config.get('shop.slug.product', 'product');

export default {
    url: `/[store]/${slug}/[slug]`,
    _wyvr: ({ data }) => {
        return {
            ...(data?._wyvr ?? {}),
            ...{
                template: ['shop/Product', 'shop/Default'],
                methods: ['get'],
                persist: true,
                language: data?.locale || 'en',
            },
        };
    },
    onExec: await redirectInvalidStoreRoute,
    title: ({ params }) => `product ${params.slug}`,
    content: 'missing product implementation',
};
