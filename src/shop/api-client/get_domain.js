import { context } from '@src/wyvr/context.js';

export function get_domain(domain_url) {
    if (domain_url) {
        return domain_url;
    }
    const ctx = context();
    if (!ctx?.location?.origin) {
        return undefined;
    }
    return ctx.location.origin;
}
