export function url_join(...parts) {
    let url = parts.filter(Boolean).join('/');

    if (url.indexOf('http') != 0) {
        url = '/' + url.replace(/^\//, '');
    }
    return url.replace(/\/$/) + '/';
}
