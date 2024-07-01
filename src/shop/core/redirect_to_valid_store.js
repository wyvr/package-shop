import { get_config } from '@wyvr/generator/shared.js';
import { logger } from '@wyvr/generator/universal.js';
import { object_to_query_param } from '@src/shop/core/url.js';

const default_store = get_config('shop.default_store');

export function redirect_to_valid_store({
    returnData,
    returnRedirect,
    data,
    query,
    params,
    isProd,
}) {
    // redirect to the default store
    if (!default_store) {
        logger.error('missing default store in config');
        return returnData('Not found', 404);
    }
    const splitted = data.url.split('/');
    splitted[1] = default_store;
    const target = splitted.join('/');
    logger.warning(
        'unknown store',
        params?.store,
        'redirecting to default store',
        target
    );
    return returnRedirect(
        target + object_to_query_param(query),
        isProd ? 301 : 302
    );
}
