export function combine_url(...parts) {
    return `/${parts
        .map((part) => (part || '').split('/'))
        .flat(2)
        .filter((x) => x)
        .join('/')
        .replace(/\/$/, '')}/`;
}
export function get_category_url(store, url) {
    return combine_url(store, 'c', url);
}
export function get_product_url(store, url) {
    return combine_url(store, 'p', url);
}
export function get_page_url(store, url) {
    return combine_url(store, url);
}
export function url_join(...parts) {
    let url = parts.filter(Boolean).join('/');

    if (url.indexOf('http') != 0) {
        url = '/' + url.replace(/^\//, '');
    }
    return url.replace(/\/$/) + '/';
}
