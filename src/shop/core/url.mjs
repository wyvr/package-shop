/**
 * Joins given URL parts into a single URL string.
 *
 * @function url_join
 * @param {...string} parts - The URL parts to concatenate.
 * @returns {string|undefined} The joined URL string or undefined if no valid parts were provided.
 *
 * @description
 * This function takes multiple URL parts as input, removes leading and trailing slashes of each part, then concatenates them.
 * If the last part doesn't contain an extension (i.e., there is no '.' in the last part), it is treated as a directory, and a trailing slash is added.
 * If the final URL does not start with 'http', a leading slash is prepended. If no valid parts are provided, the function returns undefined.
 *
 * @example
 * url_join('http://example.com/', '/path/to', 'resource.html');
 * // Returns 'http://example.com/path/to/resource.html'
 *
 * url_join('/path/to', 'directory');
 * // Returns '/path/to/directory/'
 */
export function url_join(...parts) {
    if(!Array.isArray(parts)) {
        return undefined;
    }
    // combine parts together and remove the leading and trailing slashes
    let url = parts.filter(Boolean).map((part) => part.toString().replace(/\/$/, '').replace(/^\//, ''));
    if (url.length == 0) {
        return undefined;
    }
    // when the last element dosn't contains a dot(extension for file) treat as folder with trailing slash
    const last_index = url.length - 1;
    const contains_ext = url[last_index].indexOf('.') > -1 && url[last_index].indexOf('@') == -1;
    if (!contains_ext) {
        url[last_index] += '/';
    }

    url = url.join('/');

    // avoid leading slash for absolute urls
    if (url.indexOf('http') != 0) {
        url = '/' + url.replace(/^\//, '');
    }
    return url;
}

export function object_to_query_param(query) {
    if (typeof query !== 'object' || Array.isArray(query)) {
        return '';
    }
    const params = Object.entries(query)
        .map(([key, value]) => {
            return key + '=' + value;
        })
        .filter(Boolean)
        .join('&');
    if (!params) {
        return '';
    }
    return '?' + params;
}
