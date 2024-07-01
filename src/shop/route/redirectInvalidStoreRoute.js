import { validate_store } from '@src/shop/core/validate_store.js';
import { redirect_to_valid_store } from '@src/shop/core/redirect_to_valid_store.js';

export async function redirectInvalidStoreRoute(context, fn) {
    if (!validate_store(context?.params?.store)) {
        return redirect_to_valid_store(context);
    }
    if (typeof fn !== 'function') {
        return context.data;
    }
    return await fn(context);
}
