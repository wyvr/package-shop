import { validate_store } from '@src/shop/core/validate_store.js';
import { get_config } from '@wyvr/generator/shared.js';
import { logger } from '@wyvr/generator/universal.js';
import { object_to_query_param } from '@src/shop/core/url.js';

export default {
    construct_route_context: {
        after: async ({ result }) => {
            return result;
            // if (!result?.data?.$route?.url) {
            //     return result;
            // }
            // // check if the route contains a store
            // if (
            //     result.data.$route.url.indexOf('/[store]/') === -1 ||
            //     !result.params?.store ||
            //     result.data.$route.url === '/[store]/.*'
            // ) {
            //     return result;
            // }
            // // check if the store is valid
            // if (validate_store(result.params?.store)) {
            //     return result;
            // }

            // // if not redirect to the default store
            // const default_store = get_config('shop.default_store');
            // if (!default_store) {
            //     logger.error('missing default store in config');
            //     result.returnData('Not found', 404);
            //     return result;
            // }
            // const splitted = result.data.url.split('/');
            // splitted[1] = default_store;
            // const target = splitted.join('/');
            // logger.warning(
            //     'unknown store',
            //     result.params?.store,
            //     'redirecting to default store',
            //     target
            // );
            // result.returnRedirect(
            //     target + object_to_query_param(result.query),
            //     result.isProd ? 301 : 302
            // );
            // return result;
        },
    },
};
