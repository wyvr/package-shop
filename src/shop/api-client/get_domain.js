export function get_domain(domain_url) {
    if (domain_url) {
        return domain_url;
    }
    if (!location?.origin) {
        return undefined;
    }
    return location.origin;
}
