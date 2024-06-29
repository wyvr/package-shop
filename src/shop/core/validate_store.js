import { get_config } from '@wyvr/generator/shared.js';

const stores = get_config('shop.stores');

export function validate_store(store_param) {
    return !!stores[store_param];
}