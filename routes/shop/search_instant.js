import { Config } from '@wyvr/generator/src/utils/config.js';
import { get } from '@src/shop/core/settings.mjs';
import { search_execute } from '@src/shop/core/search/search.mjs';

export default {
    url: '/[store]/search/instant',
    _wyvr: () => {
        return {
            methods: ['post'],
        };
    },
    onExec: async ({ body, params, returnJSON }) => {
        const stores = Config.get('shop.stores');
        const store_id = stores[params.store];
        const date = new Date();

        const code = await get(store_id, 'general.locale.code', `magento 2 search`, 'en_US');
        const locale = code.split('_')[0];

        const currency = await get(store_id, 'currency.options.default', `magento 2 search`, 'EUR');

        const size = 3;
        const search_result = await search_execute(body?.q, store_id, size);

        return returnJSON({
            store: params.store,
            data: body,
            date,
            search: search_result.search,
            locale,
            term: search_result.term,
            currency,
            timing: search_result.timing,
            suggestion: search_result.suggestion,
        });
    },
};
