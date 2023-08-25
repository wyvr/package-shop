export function shop_image(domain, src) {
    return domain && src ? [domain, ...src.split('/').filter((x) => x)].join('/') : undefined;
}
